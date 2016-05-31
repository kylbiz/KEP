Meteor.methods({
  checkNameGenDoc: function (dataDoc, uuid) {
    log("checkNameGenDoc", dataDoc, uuid);


    var fileData = getFileData_checkName(dataDoc);
    log('fileData', fileData);

    DocGen.checkName.genDoc({
      fileName: 'K0211090101',
      cnLabel: '企业名称预先核准申请书',
      randomStr: uuid,
      fileData: fileData,
    });
  },
  registerGenDoc: function (dataDoc, uuid) {
    log("registerGenDoc", dataDoc, uuid);

    var fileDoc = getFileDoc_register(dataDoc);
    log('fileDoc', fileDoc);

    fileDoc.forEach(function(request) {
      var fileName = request.fileName;
      var cnLabel = request.cnLabel;
      var randomStr = uuid;
      delete request.fileName;
      delete request.cnLabel;

      var paramsObj = {
        fileName: fileName,
        cnLabel: cnLabel,
        randomStr: randomStr,
        fileData: request
      };

      DocGen.register.genDoc(paramsObj);
    });
  }
});


// 获取生成企业核名需要的信息
function getFileData_checkName(dataDoc) {
  var basicNameList = [];

  var companyInfo = dataDoc.company || {};
  basicNameList.push(companyInfo.nativeName) || "";
  (companyInfo.alternativeName || []).forEach(function (info) {
    if (info.name) {
      basicNameList.push(info.name);
    }
  });

  var companyNameList = KEPUtil.getCompanyFullName(basicNameList, companyInfo.nameStruct, companyInfo.industryType, companyInfo.type, '上海');

  var holderName = [];
  var holderID = [];

  dataDoc.holders.forEach(function (holderInfo) {
    if (holderInfo.name && holderInfo.ID) {
      holderName.push(holderInfo.name);
      holderID.push(holderInfo.ID);
    }
  });

  var companyName = companyNameList.shift();

  return {
    companyName: companyName,
    alternativeName: companyNameList,
    companyAddress: companyInfo.address || "",
    businessScope: companyInfo.businessScope || "",
    holderName: holderName,
    holderID: holderID,
    moneyAmount: companyInfo.moneyAmount || ""
  };
}

// 生成文档所数据
// var expectStruct = {
//   fileName: 'K0211090101',
//   cnLabel: '企业名称预先核准申请书',
//   randomStr: Meteor.uuid(),
//   fileData: {
//     companyName: "开业啦-cc",
//     alternativeName: ['开业啦-1', '开业啦-2'],
//     companyAddress: '上海-中国',
//     businessScope: '企业服务，网络技术',
//     holderName: ['cc', 'jack'],
//     holderID: ['123456789', '123344444'],
//     moneyAmount: '100'
//   }
// }


// 从小白云那边扒来的 有问题
function getFileDoc_register(_regObj) {
  _regObj.createTime = new Date();
  var year = _regObj.createTime.getFullYear();
  var month = _regObj.createTime.getMonth() + 1;
  var day = '28';

  _regObj.investDate = (year + 10) + '年' + month + '月' + day + '日';
  _regObj.mettingDate = year + '年' + month + '月' + day + '日';


  _regObj.company.zipcode = '200082';
  switch(_regObj.company.zone) {
    case '虹口':
      _regObj.company.zipcode = '200082';
      break;
    case '浦东':
      _regObj.company.zipcode = '201204';
      break;
    default:
      _regObj.company.zipcode = '200082';
      break;
  }


  var regulationFileName = '';
  var holderFileName = '';
  var registrationFileName = '';

  var holders = _regObj.holders;
  var holderLength = holders.length;

  var holderName = [];
  var holderIDType = [];
  var holderID = [];
  var investType = [];
  var investShare = [];
  var investMoneyAmount = [];
  var investDateOutput = [];



  holders.forEach(function(holder) {
    holderName.push(holder.name);
    holderIDType.push(holder.IDType);
    holderID.push(holder.ID);
    investType.push(holder.investType);
    investShare.push(holder.investShare + "%");

    holder.investMoneyAmount = _regObj.company.moneyAmount * holder.investShare / 100|| 0;
    investMoneyAmount.push(holder.investMoneyAmount);
    investDateOutput.push(_regObj.investDate);
  })


  if(holderLength <= 1) {
    log("单人")
    regulationFileName = 'K0211090301';
    holderFileName = 'K0211090201';
    registrationFileName = 'K0211090601';

    var regulations = {
      fileName: regulationFileName,
      cnLabel : '公司章程',
      companyName: _regObj.company.name || "",
      companyAddress: _regObj.company.address || "",
      productionAddress: _regObj.company.productionAddress || "",
      businessScope: _regObj.company.businessScope || "",
      moneyAmount: _regObj.company.moneyAmount || "",
      holderName: holderName[0] || "",
      investDate: investDateOutput[0] || "",
      investType: investType[0] || "",
      investMoney: investMoneyAmount[0] || "",
      registeredCapital: investMoneyAmount[0] || ""
    }
  } else {
    log('多人')
    regulationFileName = 'K0211090302';
    holderFileName = 'K0211090202';
    registrationFileName = 'K0211090602';
    var regulations = {
      fileName: regulationFileName || "",
      cnLabel : '公司章程',
      companyName: _regObj.company.name || "",
      companyAddress: _regObj.company.address || "",
      productionAddress: _regObj.company.productionAddress || "",
      businessScope: _regObj.company.businessScope || "",
      moneyAmount: _regObj.company.moneyAmount || "",
      holderName: holderName || [],
      investDate: investDateOutput || [],
      investType: investType || [],
      investMoney: investMoneyAmount || [],
      registeredCapital: investMoneyAmount || []
    }
  }

  var requests = [];
  requests.push(regulations);

  var shareholder = {
    fileName : holderFileName || "",
    cnLabel : '股东会决议' || "",
    mettingDate: _regObj.mettingDate || "",
    companyName : _regObj.company.name || "",
    chairmanName: _regObj.chairman.name || "",
    managerName: _regObj.manager.name || "",
    supervisorName: _regObj.supervisor.name || "",
    supervisorID: _regObj.supervisor.ID || ""
  }
  requests.push(shareholder);


  var leasing = {
    fileName: 'K0211090401',
    cnLabel: '房屋租赁合同',
    companyName: _regObj.company.name || "",
    companyAddress: _regObj.company.address || ""
  }
  requests.push(leasing);

  // 公司备案申请书
  var registrationBook = {
    fileName: registrationFileName || "",
    cnLabel : '公司登记（备案）申请书',
    companyName: _regObj.company.name || "",
    companyZone: _regObj.company.zone || "",
    companyType: _regObj.company.type || "",
    companyId: _regObj.companyId || "",
    companyTel: _regObj.company.tel || "",
    companyZipcode: _regObj.company.zipcode || "",
    businessScope: _regObj.company.businessScope || "",
    businessPeriod: _regObj.company.businessPeriod || "",

    companyAddress: _regObj.company.address || "",
    productionAddress: _regObj.company.productionAddress || "",

    legalPersonName: _regObj.legalPerson.name || "",
    legalPersonTel: _regObj.legalPerson.tel || "",
    legalPersonPhone: _regObj.legalPerson.phone || "",
    legalPersonEmail: _regObj.legalPerson.email || "",
    legalPersonIDType: _regObj.legalPerson.IDType || "",
    legalPersonID: _regObj.legalPerson.ID || "",

    chairmanName: _regObj.chairman.name || "",
    chairmanType: _regObj.chairman.type || "",
    chairmanIDType: _regObj.chairman.IDType || "",
    chairmanID: _regObj.chairman.ID || "",
    chairmanPhone: _regObj.chairman.phone || "",

    supervisorName: _regObj.supervisor.name || "",
    supervisorType: _regObj.supervisor.type || "",
    supervisorIDType: _regObj.supervisor.IDType || "",
    supervisorID: _regObj.supervisor.ID || "",

    managerName: _regObj.manager.name || "",
    managerType: _regObj.manager.type || "",
    managerIDType: _regObj.manager.IDType || "",
    managerID: _regObj.manager.ID || "",

    holderName: holderName || "",
    holderIDType: holderIDType || "",
    holderID: holderID || "",
    investType: investType || "",
    investDate: investDateOutput || "",
    money: investMoneyAmount || "",
    share: investShare || "",
    moneyAmount: _regObj.company.moneyAmount || "",

    contractorName: _regObj.contractor.name || "",
    contractorTel: _regObj.contractor.tel || "",
    contractorPhone: _regObj.contractor.phone || "",
    contractorEmail: _regObj.contractor.email || "",
    contractorIDType: _regObj.contractor.IDType || "",
    contractorID: _regObj.contractor.ID || "",

    financialStaffName: _regObj.financialStaff.name || "",
    financialStallTel: _regObj.financialStaff.tel || "",
    financialStaffPhone: _regObj.financialStaff.phone || "",
    financialStaffEmail: _regObj.financialStaff.email || "",
    financialStaffIDType: _regObj.financialStaff.IDType || "",
    financialStaffID: _regObj.financialStaff.ID || ""
  }

  requests.push(registrationBook);
  var commitment = {
    fileName: 'K0211090701',
    cnLabel : '广告企业告知承诺书'
  };

  requests.push(commitment);

  var appraise = {
    fileName: 'K0211090801',
    cnLabel : '小型微型企业认定申请表'
  };
  requests.push(appraise);

  var companyIdApplication = {
    fileName: 'K0211090901',
    cnLabel : '上海市组织机构代码申请表'
  };

  requests.push(companyIdApplication);

  var note = {
    fileName: 'K0211091001',
    cnLabel : '情况说明'
  };

  requests.push(note);

  return requests;
}
