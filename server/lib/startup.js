/*
 * 系统的一些初始化操作
 **/

Meteor.startup(function () {
  // initAccount();   // 初始化管理员
  //initSupportInfo();  // 初始化相关的辅助信息
  //Test.testData();    // 测试数据
});


// 初始化
function initAccount() {
  if (Meteor.users.findOne() || UsersTeam.findOne()) {
    return;
  }

  var user = {
    name: 'kyl',
    password: 'kyl123',
    phone: '18521595051',
    email: 'air.cui@kyl.biz',
  };

  var team = {
    name: 'default',   // 群组名
    remark: '测试用群组', // 备注
  }

  KAccount.createTotalNewUser(team, user);
}


// 辅助信息
function initSupportInfo() {
  var retInfo = getSupportInfo();

  // 具体步骤信息的schema
  StepInfosSchema.remove({createBy: 'default'});
  var stepInfosSchema = retInfo.stepInfosSchema || [];
  KUtil.insertListToColl(stepInfosSchema, StepInfosSchema);

  // 不同任务的步骤
  TaskSteps.remove({createBy: 'default'});
  var taskSteps = retInfo.taskSteps || [];
  KUtil.insertListToColl(taskSteps, TaskSteps, function (taskStep) {
    taskStep.startTime = new Date();
    taskStep.updateTime = new Date();
    return taskStep;
  });
}


// 子任务
function getSupportInfo() {
  return {
    'taskSteps': [
      { // 核名预设步骤
        type: 'checkName',
        createBy: 'default',
        steps: [
          {
            name: '填写资料',
            startTime: '',
            updateTime: '',
            finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
            dataStruct: 'stepInfoCompanyCheckName', // 待录入数据的结构
            data: {},
          },
          {
            name: '签字确认',
            startTime: '',
            updateTime: '',
            finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
            dataStruct: 'stepInfoCustomerConfirm', // 待录入数据的结构
            data: {},
          },
          {
            name: '提交工商',
            startTime: '',
            updateTime: '',
            finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
            dataStruct: 'stepInfoGovSubmit', // 待录入数据的结构
            data: {},
          },
          {
            name: '核名通过',
            startTime: '',
            updateTime: '',
            finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
            dataStruct: 'stepInfoCheckNamePass', // 待录入数据的结构
            data: {},
          },
          {
            name: '申请地址',
            startTime: '',
            updateTime: '',
            finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
            dataStruct: 'stepInfoCompanyAddress', // 待录入数据的结构
            data: {},
          },
          {
            name: '准备公章',
            startTime: '',
            updateTime: '',
            finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
            dataStruct: 'stepInfoOfficialSeal', // 待录入数据的结构
            data: {},
          },
        ]
      },
      { // 工商登记预设步骤
        type: 'regist',
        createBy: 'default',
        steps: [
          {
            name: '资料填写',
            startTime: '',
            updateTime: '',
            finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
            dataStruct: 'stepInfoCompanyRegistInfo', // 待录入数据的结构
            data: {},
          },
          {
            name: '签字确认',
            startTime: '',
            updateTime: '',
            finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
            dataStruct: 'stepInfoCustomerConfirm', // 待录入数据的结构
            data: {},
          },
          {
            name: '提交工商',
            startTime: '',
            updateTime: '',
            finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
            dataStruct: 'stepInfoGovSubmit', // 待录入数据的结构
            data: {},
          },
          {
            name: '登记通过',
            startTime: '',
            updateTime: '',
            finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
            dataStruct: 'stepInfoCompanyRegistPass', // 待录入数据的结构
            data: {},
          },
        ]
      }
    ],
    'stepInfosSchema': [
      {    // 公司核名申请书资料
        _id: 'stepInfoCompanyCheckName',
        createBy: 'default', // 系统定义 用户自定义的用 'customer'
        schema: {
          'company': {
            type: "Object",
            label: "公司基本信息",
            optional: true
          },
          'company-zone': {
            type: "String",
            label: '注册区域',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '虹口', value: '虹口'},
                {label: '浦东', value: '浦东'}
              ]
            }
          },
          "company-type": {
            type: "String",
            label: '公司类型',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '有限责任公司', value: '有限责任公司'},
                {label: '有限合伙', value: '有限合伙'}
              ]
            }
          },
          "company-nativeName": {
            type: "String",
            label: '公司名称（必填）'
          },
          'company-alternativeName': {
            type: "Array",
            minCount: 0,
            maxCount: 10,
            label: "备选企业字号",
            optional: true
          },
          "company-alternativeName-$": {
            type: "Object",
            optional: true
          },
          "company-alternativeName-$-name": {
            type: "String",
            label: "备选字号",
            optional: true
          },
          'company-moneyAmount': {
            type: "Number",
            label: '注册资本(单位：万元，必填)'
          },
          "company-industryType": {
            type: "String",
            label: '行业类型',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '网络技术', value: '网络技术'},
                {label: '生物技术', value: '生物技术'}
              ]
            }
          },
          'company-nameStruct': {
            type: "String",
            label: "公司名称结构",
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '<公司名>(<地区>)<行业类型><公司性质>', value: 'name-area-industry-type'},
                {label: '<地区><公司名><行业类型><公司性质>>', value: 'area-name-industry-type'},
              ]
            }
          },
          'company-businessScope': {
            type: "String",
            label: '经营范围',
            optional: true,
            min: 0,
            max: 1000,
            autoform: {
              rows: 5
            }
          },
          'company-address': {
            type: "String",
            label: '地 址',
            optional: true
          },
          "holders": {
            type: "Array",
            minCount: 0,
            maxCount: 10,
            label: "股东信息（必填）",
          },
          "holders-$": {
            type: "Object",
            label: '添加股东'
          },
          "holders-$-name": {
            type: "String",
            label: "股东名称或姓名"
          },
          "holders-$-ID": {
            type: "String",
            label: "证照号码",
            min: 18,
            max: 18
          }
        }
      },
      {    // 工商登记资料
        _id: 'stepInfoCompanyRegistInfo',
        createBy: 'default',
        schema: {
          "company": {
            type: "Object",
            label: "公司基本信息",
            optional: true
          },
          "company-zone": {
            type: "String",
            label: '注册区域（必填）',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '虹口', value: '虹口'},
                {label: '浦东', value: '浦东'}
              ]
            }
          },
          "company-name": {
            type: "String",
            label: '公司名称（必填）'
          },
          "company-type": {
            type: "String",
            label: '公司类型',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '有限责任公司', value: '有限责任公司'},
                {label: '有限合伙', value: '有限合伙'}
              ]
            }
          },
          'company-companyId': {
            type: "String",
            label: '名称预先核准文号/注册号/统一社会信用代码',
            optional: true
          },
          'company-tel': {
            type: "String",
            label: '联系电话（必填）'
          },
          'company-moneyAmount': {
            type: "Number",
            label: '注册资本(单位：万元，必填)'
          },
          'company-businessScope': {
            type: "String",
            label: '经营范围',
            optional: true,
            min: 0,
            max: 1000,
            autoform: {
              rows: 5
            }
          },
          'company-businessPeriod': {
            type: "String",
            label: '经营期限',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '10年', value: '10年'},
                {label: '20年', value: '20年'},
                {label: '长期', value: '长期'}
              ]
            }
          },
          'company-address': {
            type: "String",
            label: '地 址',
            optional: true
          },
          'company-productionAddress': {
            type: "String",
            label: '生产经营地',
            optional: true
          },

          "legalPerson": {
            type: "Object",
            label: '法人（必填）',
            optional: true
          },
          "legalPerson-name": {
            type: "String",
            label: '法定代表人姓名'
          },
          "legalPerson-tel": {
            type: "String",
            label: '固定电话',
            optional: true
          },
          "legalPerson-phone": {
            type: "String",
            label: '移动电话（必填）'
          },
          "legalPerson-email": {
            type: "String",
            label: '电子邮箱',
            optional: true,
            autoform: {
              afFieldInput: {
                type: "email"
              }
            }
          },
          "legalPerson-IDType": {
            type: "String",
            label: '身份证类型',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '身份证', value: '身份证'}
              ]
            }
          },
          "legalPerson-ID": {
            type: "String",
            label: '身份证号码（必填）'
          },
          "chairman": {
            type: "Object",
            label: '董事',
            optional: true
          },
          "chairman-name": {
            type: "String",
            label: '董事姓名',
            optional: true
          },
          "chairman-type": {
            type: "String",
            label: '董事职务',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '执行董事', value: '执行董事'}
              ]
            }
          },
          "chairman-IDType": {
            type: "String",
            label: '董事身份证类型',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '身份证', value: '身份证'}
              ]
            }
          },
          "chairman-ID": {
            type: "String",
            label: '董事身份证号码',
            optional: true
          },
          "chairman-phone": {
            type: "String",
            label: "董事手机号码",
            optional: true
          },
          "supervisor": {
            type: "Object",
            label: '监事（必填）',
            optional: true
          },
          "supervisor-name": {
            type: "String",
            label: '监事姓名（必填）'
          },
          "supervisor-type": {
            type: "String",
            label: '监事职务',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '监事', value: '监事'}
              ]
            }
            // defaultValue: function() {
            //   return '监事';
            // }
          },
          "supervisor-IDType": {
            type: "String",
            label: '监事身份证类型',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '身份证', value: '身份证'}
              ]
            }
          },
          "supervisor-ID": {
            type: "String",
            label: '监事身份证号码（必填）'
          },

          "manager": {
            type: "Object",
            label: "经理",
            optional: true
          },
          "manager-name": {
            type: "String",
            label: "经理姓名",
            optional: true
          },
          "manager-type": {
            type: "String",
            label: '经理职务',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '经理', value: '经理'}
              ]
            }
          },
          "manager-IDType": {
            type: "String",
            label: '经理身份证类型',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '身份证', value: '身份证'},
              ]
            }
          },
          "manager-ID": {
            type: "String",
            label: '经理身份证号码',
            optional: true
          },

          "holders": {
            type: "Array",
            minCount: 0,
            maxCount: 10,
            label: "股东信息(必填)",
            optional: true
          },
          "holders-$": {
            type: "Object",
            optional: true
          },
          "holders-$-name": {
            type: "String",
            label: "股东（发起人）名称或姓名"
          },

          "holders-$-IDType": {
            type: "String",
            label: "证件类型",
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '身份证', value: '身份证'}
              ]
            }
          },
          "holders-$-ID": {
            type: "String",
            label: "证照号码"
          },
          "holders-$-investType": {
            type: "String",
            label: '出资方式',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '货币', value: '货币'}
              ]
            }
          },
          "holders-$-investShare": {
            type: "Number",
            label: '占股比例(%)',
            decimal: true
          },

          "contractor": {
            type: "Object",
            label: '联络员',
            optional: true
          },
          "contractor-name": {
            type: "String",
            label: '联络员姓名',
            optional: true
          },
          "contractor-tel": {
            type: "String",
            label: '固定电话',
            optional: true
          },
          "contractor-phone": {
            type: "String",
            label: '移动电话',
            optional: true
          },
          "contractor-email": {
            type: "String",
            label: '电子邮箱',
            optional: true,
            autoform: {
              afFieldInput: {
                type: "email"
              }
            }
          },
          "contractor-IDType": {
            type: "String",
            label: '身份证件类型',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '身份证', value: '身份证'}
              ]
            }
          },
          "contractor-ID": {
            type: "String",
            label: '身份证件号码',
            optional: true
          },

          "financialStaff": {
            type: "Object",
            label: '财务负责人',
            optional: true
          },
          "financialStaff-name": {
            type: "String",
            label: '联络员姓名',
            optional: true
          },
          "financialStaff-tel": {
            type: "String",
            label: '固定电话',
            optional: true
          },
          "financialStaff-phone": {
            type: "String",
            label: '移动电话',
            optional: true
          },
          "financialStaff-email": {
            type: "String",
            label: '电子邮箱',
            optional: true,
            autoform: {
              afFieldInput: {
                type: "email"
              }
            }
          },
          "financialStaff-IDType": {
            type: "String",
            label: '身份证件类型',
            optional: true,
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '身份证', value: '身份证'}
              ]
            }
          },
          "financialStaff-ID": {
            type: "String",
            label: '身份证件号码',
            optional: true
          }
        }
      },
      {   // 公司核名 - 客户确认
        _id: 'stepInfoCustomerConfirm',
        createBy: 'default',
        schema: {
          name: {
            type: "String",
            label: '签字或确认人',
          },
          time: {
            type: "Date",
            label: '时间',
          }
        }
      },
      { // 公司核名 - 提交工商
        _id: 'stepInfoGovSubmit',
        createBy: 'default',
        schema: {
          time: {
            type: "Date",
            label: '提交时间'
          }
        }
      },
      {   // 公司核名 - 核名通过
        _id: 'stepInfoCheckNamePass',
        createBy: 'default',
        schema: {
          companyName: {
            type: "String",
            label: '申请通过的企业名称'
          }
        }
      },
      {  // 公司核名 - 申请地址
        _id: 'stepInfoCompanyAddress',
        createBy: 'default',
        schema: {
          companyAddress: {
            type: "String",
            label: '企业地址',
          }
        }
      },
      { //  公司核名 - 公章准备
        _id: 'stepInfoOfficialSeal',
        createBy: 'default',
        schema: {

        }
      },
      { // 工商登记 - 登记通过
        _id: 'stepInfoCompanyRegistPass',
        createBy: 'default',
        schema: {
          registPass: {
            type: "Boolean",
            label: '确认登记通过',
            autoform: {
              type: 'select',
              firstOption: false,
              options: [
                {label: '未确认', value: false},
                {label: '确认', value: true}
              ]
            }
          }
        }
      }
    ]
  }
}
