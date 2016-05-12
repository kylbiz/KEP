/*
 * 辅助信息的集合
 **/

// 一些系统运行的辅助信息
SupportInfo = new Mongo.Collection('SupportInfo');
struct = {  // 业务
  type: 'service',
  items: [
    {name: 'companyRegist', label: '公司注册'},
    {name: 'financeAgent', label: '财务代理'},
  ]
}
struct = {  // 子任务
  type: 'task',
  items: [
    {name: 'companyCheckName', label: '公司核名'},
    {name: 'CompanyRegistInfo', label: '工商登记'},
  ]
}

// 每个团队提供个性化的操作
TaskSteps = new Mongo.Collection('TaskSteps');
struct = {
  type: 'customer', // 自定义
  teamId: '',  // 团队名称
  steps: [
  ],
}
// 公司注册 - 核名预设步骤
struct = {
  type: 'checkName',
  steps: [
    {
      name: '填写资料',
      startTime: '',
      updateTime: '',
      finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      dataStruct: '_id', // 待录入数据的结构
      data: {},
    },
    {
      name: '签字确认',
      startTime: '',
      updateTime: '',
      finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      dataStruct: '_id', // 待录入数据的结构
      data: {},
    },
    {
      name: '提交工商',
      startTime: '',
      updateTime: '',
      finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      dataStruct: '_id', // 待录入数据的结构
      data: {},
    },
    {
      name: '核名通过',
      startTime: '',
      updateTime: '',
      finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      dataStruct: '_id', // 待录入数据的结构
      data: {},
    },
    {
      name: '申请地址',
      startTime: '',
      updateTime: '',
      finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      dataStruct: '_id', // 待录入数据的结构
      data: {},
    },
    {
      name: '准备公章',
      startTime: '',
      updateTime: '',
      finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      dataStruct: '_id', // 待录入数据的结构
      data: {},
    },
  ]
}
// 公司注册 - 工商登记预设步骤
struct = {
  type: 'regist',
  steps: [
    {
      name: '资料填写',
      startTime: '',
      updateTime: '',
      finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      dataStruct: '_id', // 待录入数据的结构
      data: {},
    },
    {
      name: '签字确认',
      startTime: '',
      updateTime: '',
      finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      dataStruct: '_id', // 待录入数据的结构
      data: {},
    },
    {
      name: '提交工商',
      startTime: '',
      updateTime: '',
      finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      dataStruct: '_id', // 待录入数据的结构
      data: {},
    },
    {
      name: '登记通过',
      startTime: '',
      updateTime: '',
      finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      dataStruct: '_id', // 待录入数据的结构
      data: {},
    },
  ]
}

// 具体步骤需要存放的schema结构
StepInfosSchema = new Mongo.Collection('StepInfosSchema');
struct = {    // 公司核名申请书资料 - 结构
  _id: 'stepInfoCompanyCheckName',
  name: 'companyCheckName',
  data: {
    company: {
      zone: '',
      type: '',
      name: '',
      alternativeName: [
        {name: ''},
      ],
      moneyAmount: '',
      businessScope: '',
      address: '',
    },
    holders: [
      {
        name: '',
        IDType: '',
        ID: ''
      }
    ]
  }
}
struct = {    // 工商登记资料 - 结构
  _id: 'stepInfoCompanyRegistInfo',
  name: 'companyRegistInfo',
  data: {
    company: {  // 公司基本信息
      name: '',
      moneyAmount: '',
      type: '',
      zone: '',
      address: '',
      productionAddress: '',
      companyId: '',
      businessPeriod: '',
      businessScope: '',
    },
    holders: [ // 股东
      {
        name: '',
        IDType: '',
        ID: '',
        investType: '',
        investShare: '',
      }
    ],
    legalPerson: { // 法人
      name: '',
      tel: '',
      phone: '',
      email: '',
      IDType: '',
      ID: '',
    },
    chairman: [ // 股东
      {
        name: '',
        type: '', // 执行董事
        IDType: '',
        ID: '',
        phone: '',
      }
    ],
    supervisor: { // 监事
      name: '',
      type: '',
      IDType: '',
      ID: '',
    },
    manager: { // 经理
      name: '',
      type: '',
      IDType: '',
      ID: '',
    },
    financialStaff: { // 财务负责人
      name: '',
      tel: '',
      phone: '',
      email: '',
      IDType: '',
      ID: '',
    },
    contractor: { // 企业联络员
      name: '',
      phone: '',
      email: '',
      IDType: '',
      ID: ''
    }
  }
}

// 用于临时通过schema生成表单的collection
TempStruct = new Mongo.Collection('TempStruct');

TestColl = new Mongo.Collection('TestColl');
TestColl.attachSchema(
  new SimpleSchema({
    "name": {
      type: "String",
      label: '公司名称'
    }
  })
);



