/*
 * 一些步骤完成时(或开始时--待定)需要进行的操作
 **/

KStepHooks = {};


/*
 * 订阅公司的状态变更
 */
KStepHooks.subCompanyName = function (taskId) {
    log('KStepHooks.subCompanyName', taskId);

    var taskInfo = Tasks.findOne({_id: taskId}) || false;
    if (!taskInfo) {
      log("KStepHooks.subCheckName fail", taskId);
      return;
    }

    var companyNameList = [];
    var updateStep = {};
    var taskType = taskInfo.name;
    if (taskType == 'companyCheckName') {
      companyNameList = getCompanyNameByCheckNameInfo(taskInfo);
      updateStep = {
        stepMark: '',
        stepKey: ''
      }
    } else if (taskType == 'companyRegistInfo') {
      companyNameList = getCompanyNameByRegisterInfo(taskInfo);
    }

    var subType = {"companyCheckName": "checkName", "companyRegistInfo": "regist"}[taskType] || "";
    companyNameList.forEach(function (companyName) {
      Yiqicha.subscribe({
        type: subType,
        companyName: companyName,
        other: {
          taskId: taskId,
          taskType: taskType
        }
      });
    });
}


/*
 * 将核名阶段的数据导入到companyInfo中
 **/
KStepHooks.copyCheckNameInfoToCompany = function (taskId) {
  log('KStepHooks.copyCheckNameInfoToCompany', taskId);

  var taskInfo = Tasks.findOne({_id: taskId}) || false;
  if (!taskInfo) {
    log("KStepHooks.copyCheckNameInfoToCompany fail", taskId);
    return;
  }
  var steps = taskInfo.steps;


  var companyInfo = {};
  var stepInfo = {};

  // 公司类型 注册区域 (行业类型) 经营范围 股东信息 // mark: inputData
  stepInfo = KUtil.getStepInfoByMark(steps, 'inputData') || {};
  stepData = stepInfo.data || false;
  if (stepData) {
    companyInfo["company.type"] = stepData.company.type;
    companyInfo["company.zone"] = stepData.company.zone;
    companyInfo["company.businessScope"] = stepData.company.businessScope;
    companyInfo["company.holders"] = stepData.holders;
  }
  // 公司名 核名号 // mark: pass
  stepInfo = KUtil.getStepInfoByMark(steps, 'pass') || {};
  stepData = stepInfo.data || false;
  if (stepData) {
    companyInfo["company.name"] = stepData.companyName;
    companyInfo["company.companyId"] = stepData.companyId;
  }

  // 地址 //mark: companyAddress
  stepInfo = KUtil.getStepInfoByMark(steps, 'pacompanyAddressss') || {};
  stepData = stepInfo.data || false;
  if (stepData) {
    companyInfo["company.address"] = stepData.companyAddress;
    companyInfo["company.productionAddress"] = stepData.companyAddress;
  }

  var customerId = taskInfo.customerId || "";

  log("CompanyInfo customerId", customerId, " companyInfo", companyInfo);
  return CompanyInfo.update({customerId: customerId}, {$set: companyInfo});
}


/*
 * 将工商登记阶段的数据导入到companyInfo中
 **/
KStepHooks.copyRegisterInfoToCompany = function (taskId) {
  log('KStepHooks.copyRegisterInfoToCompany', taskId);

  var taskInfo = Tasks.findOne({_id: taskId}) || false;
  if (!taskInfo) {
    log("KStepHooks.copyCheckNameInfoToCompany fail", taskId);
    return;
  }
  var steps = taskInfo.steps;


  var companyInfo = {};
  var stepInfo = {};

  // mark: inputData
  stepInfo = KUtil.getStepInfoByMark(steps, 'inputData') || {};
  stepData = stepInfo.data || false;
  if (stepData) {
    // companyInfo["company.name"] = stepData.company.name;
    // companyInfo["company.moneyAmount"] = stepData.company.moneyAmount;
    // companyInfo["company.type"] = stepData.company.type;
    // companyInfo["company.zone"] = stepData.company.zone;
    // companyInfo["company.address"] = stepData.company.address;
    // companyInfo["company.productionAddress"] = stepData.company.productionAddress;
    // companyInfo["company.businessPeriod"] = stepData.company.businessPeriod;
    // companyInfo["company.businessScope"] = stepData.company.businessScope;
    // companyInfo["company.companyId"] = stepData.company.companyId;
    // companyInfo["company.holders"] = stepData.holders;
    // companyInfo["company.legalPerson"] = stepData.legalPerson;

    delete stepData.company.tel;
    companyInfo = stepData;
  }

  var customerId = taskInfo.customerId || "";
  return CompanyInfo.update({customerId: customerId}, {$set: companyInfo});
}


/*
 * 从核名任务的数据里获取完整公司名的列表
 **/
function getCompanyNameByCheckNameInfo (taskInfo) {
  var stepInfo = KUtil.getStepInfoByMark(taskInfo.steps, 'inputData') || {};

  log('getCompanyNameByCheckNameInfo', stepInfo);

  var stepData = stepInfo.data || {};
  var companyBasicInfo = stepData.company || {};

  var basicNameList = [];
  basicNameList.push(companyBasicInfo.nativeName);

  var alternativeName = companyBasicInfo.alternativeName || [];
  alternativeName.forEach(function (nameInfo) {
    if (nameInfo.name) {
      basicNameList.push(nameInfo.name);
    }
  });

  return KEPUtil.getCompanyFullName(
      basicNameList || [], companyBasicInfo.nameStruct || "", companyBasicInfo.industryType || "", companyBasicInfo.type || "", "上海"
  ) || [];
}


/*
 * 从工商任务的数据里获取完整公司名的列表
 **/
function getCompanyNameByRegisterInfo (taskInfo) {
  var stepInfo = taskInfo.steps[0].data || {};
  var companyBasicInfo = stepInfo.company || {};
  return [companyBasicInfo.name];
}
