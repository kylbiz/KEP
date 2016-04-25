// 提醒通知设置
// Remind = new Mongo.Collection('Remind');

//
TaskSteps = new Mongo.Collection('TaskSteps');
struct = {
  name: '',
  createAt: '',
  struct: {

  }
}

// 核名数据
// var NameCheckSchema = new SimpleSchema({
//   company: {
//     type: Object,
//     label: "公司基本信息",
//     optional: true
//   },
//   "company.companyZone": {
//     type: String,
//     label: '注册区域',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '虹口', value: '虹口'},
//           {label: '浦东', value: '浦东'}
//         ]
//       }
//     }
//   },
//   "company.companyType": {
//     type: String,
//     label: '公司类型',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '有限责任公司', value: '有限责任公司'},
//           {label: '有限合伙', value: '有限合伙'}
//         ]
//       }
//     }
//   },
//   "company.companyName": {
//     type: String,
//     label: '公司名称（必填）'
//   },
//   'company.alternativeName': {
//     type: Array,
//     minCount: 0,
//     maxCount: 10,
//     label: "备选企业字号",
//     optional: true
//   },
//   "company.alternativeName.$": {
//     type: Object,
//     optional: true
//   },
//   "company.alternativeName.$.name": {
//     type: String,
//     label: "备选字号",
//     optional: true
//   },
//   'company.moneyAmount': {
//     type: Number,
//     label: '注册资本(单位：万元，必填)'
//   },
//   'company.businessScope': {
//     type: String,
//     label: '经营范围',
//     optional: true,
//     min: 0,
//     max: 1000,
//     autoform: {
//       rows: 5
//     }
//   },
//   "addressFlag": {
//     type: String,
//     label: '公司地址',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '开业啦提供地址', value: '开业啦提供地址'},
//           {label: '自己提供地址', value: '自己提供地址'}
//         ]
//       }
//     }
//   },
//   'companyAddress': {
//     type: String,
//     label: '地 址',
//     optional: true
//   },
//   holders: {
//     type: Array,
//     minCount: 0,
//     maxCount: 10,
//     label: "股东信息（必填）",
//   },
//   "holders.$": {
//     type: Object,
//     label: '添加股东'
//   },
//   "holders.$.holderName": {
//     type: String,
//     label: "股东名称或姓名"
//   },
//   "holders.$.holderID": {
//     type: String,
//     label: "证照号码",
//     min: 18,
//     max: 18
//   },
//   'createTime': {
//     type: Date,
//     label: "创建日期",
//     optional: true,
//     autoValue: function() {
//       return (new Date());
//     }
//   }
// })

// 工商登记数据
// var companySchema = new SimpleSchema({
//   company: {
//     type: Object,
//     label: "公司基本信息",
//     optional: true
//   },
//   "company.companyZone": {
//     type: String,
//     label: '注册区域（必填）',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '虹口', value: '虹口'},
//           {label: '浦东', value: '浦东'}
//         ]
//       }
//     }
//   },
//   "company.companyName": {
//     type: String,
//     label: '公司名称（必填）'
//   },
//   "company.companyType": {
//     type: String,
//     label: '公司类型',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '有限责任公司', value: '有限责任公司'},
//           {label: '有限合伙', value: '有限合伙'}
//         ]
//       }
//     }
//   },
//   'company.companyId': {
//     type: String,
//     label: '名称预先核准文号/注册号/统一社会信用代码',
//     optional: true
//   },
//   'company.companyTel': {
//     type: String,
//     label: '联系电话（必填）'
//   },
//   'company.moneyAmount': {
//     type: Number,
//     label: '注册资本(单位：万元，必填)'
//   },
//   'company.businessScope': {
//     type: String,
//     label: '经营范围',
//     optional: true,
//     min: 0,
//     max: 1000,
//     autoform: {
//       rows: 5
//     }
//   },
//   'company.businessPeriod': {
//     type: String,
//     label: '经营期限',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '10年', value: '10年'},
//           {label: '20年', value: '20年'},
//           {label: '长期', value: '长期'}
//         ]
//       }
//     }
//   },
//   "addressFlag": {
//     type: String,
//     label: '公司地址',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '开业啦提供地址', value: '开业啦提供地址'},
//           {label: '自己提供地址', value: '自己提供地址'}
//         ]
//       }
//     }
//   },
//   'companyAddress': {
//     type: String,
//     label: '地 址',
//     optional: true
//   },
//   'productionAddress': {
//     type: String,
//     label: '生产经营地',
//     optional: true
//   },

//   "legalPerson": {
//     type: Object,
//     label: '法人（必填）',
//     optional: true
//   },
//   "legalPerson.legalPersonName": {
//     type: String,
//     label: '法定代表人姓名'
//   },
//   "legalPerson.legalPersonTel": {
//     type: String,
//     label: '固定电话',
//     optional: true
//   },
//   "legalPerson.legalPersonPhone": {
//     type: String,
//     label: '移动电话（必填）'
//   },
//   "legalPerson.legalPersonEmail": {
//     type: String,
//     label: '电子邮箱',
//     optional: true,
//     autoform: {
//       afFieldInput: {
//         type: "email"
//       }
//     }
//   },
//   "legalPerson.legalPersonIDType": {
//     type: String,
//     label: '身份证类型',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '身份证', value: '身份证'}
//         ]
//       }
//     }
//   },
//   "legalPerson.legalPersonID": {
//     type: String,
//     label: '身份证号码（必填）'
//   },
//   "chairman": {
//     type: Object,
//     label: '董事',
//     optional: true
//   },
//   "chairman.chairmanName": {
//     type: String,
//     label: '董事姓名',
//     optional: true
//   },
//   "chairman.chairmanType": {
//     type: String,
//     label: '董事职务',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '执行董事', value: '执行董事'}
//         ]
//       }
//     }
//   },
//   "chairman.chairmanIDType": {
//     type: String,
//     label: '董事身份证类型',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '身份证', value: '身份证'}
//         ]
//       }
//     }
//   },
//   "chairman.chairmanID": {
//     type: String,
//     label: '董事身份证号码',
//     optional: true
//   },
//   "chairman.chairmanPhone": {
//     type: String,
//     label: "董事手机号码",
//     optional: true
//   },
//   "supervisor": {
//     type: Object,
//     label: '监事（必填）',
//     optional: true
//   },
//   "supervisor.supervisorName": {
//     type: String,
//     label: '监事姓名（必填）'
//   },
//   "supervisor.supervisorType": {
//     type: String,
//     label: '监事职务',
//     optional: true,
//     defaultValue: function() {
//       return '监事';
//     }
//   },
//   "supervisor.supervisorIDType": {
//     type: String,
//     label: '监事身份证类型',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '身份证', value: '身份证'}
//         ]
//       }
//     }
//   },
//   "supervisor.supervisorID": {
//     type: String,
//     label: '监事身份证号码（必填）'
//   },

//   "manager": {
//     type: Object,
//     label: "经理",
//     optional: true
//   },
//   "manager.managerName": {
//     type: String,
//     label: "经理姓名",
//     optional: true
//   },
//   "manager.managerType": {
//     type: String,
//     label: '经理职务',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '经理', value: '经理'}
//         ]
//       }
//     }
//   },
//   "manager.managerIDType": {
//     type: String,
//     label: '经理身份证类型',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '身份证', value: '身份证'},
//         ]
//       }
//     }
//   },
//   "manager.managerID": {
//     type: String,
//     label: '经理身份证号码',
//     optional: true
//   },
//   holders: {
//     type: Array,
//     minCount: 0,
//     maxCount: 10,
//     label: "股东信息(必填)",
//     optional: true
//   },
//   "holders.$": {
//     type: Object,
//     optional: true
//   },
//   "holders.$.holderName": {
//     type: String,
//     label: "股东（发起人）名称或姓名"
//   },

//   "holders.$.holderIDType": {
//     type: String,
//     label: "证件类型",
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '身份证', value: '身份证'}
//         ]
//       }
//     }
//   },
//   "holders.$.holderID": {
//     type: String,
//     label: "证照号码"
//   },
//   "holders.$.investType": {
//     type: String,
//     label: '出资方式',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '货币', value: '货币'}
//         ]
//       }
//     }
//   },
//   "holders.$.investShare": {
//     type: Number,
//     label: '占股比例(%)',
//     decimal: true
//   },
//   "contractor": {
//     type: Object,
//     label: '联络员',
//     optional: true
//   },
//   "contractor.contractorName": {
//     type: String,
//     label: '联络员姓名',
//     optional: true
//   },
//   "contractor.contractorTel": {
//     type: String,
//     label: '固定电话',
//     optional: true
//   },
//   "contractor.contractorPhone": {
//     type: String,
//     label: '移动电话',
//     optional: true
//   },
//   "contractor.contractorEmail": {
//     type: String,
//     label: '电子邮箱',
//     optional: true,
//     autoform: {
//       afFieldInput: {
//         type: "email"
//       }
//     }
//   },
//   "contractor.contractorIDType": {
//     type: String,
//     label: '身份证件类型',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '身份证', value: '身份证'}
//         ]
//       }
//     }
//   },
//   "contractor.contractorID": {
//     type: String,
//     label: '身份证件号码',
//     optional: true
//   },

//   "financialStaff": {
//     type: Object,
//     label: '财务负责人',
//     optional: true
//   },
//   "financialStaff.financialStaffName": {
//     type: String,
//     label: '联络员姓名',
//     optional: true
//   },
//   "financialStaff.financialStallTel": {
//     type: String,
//     label: '固定电话',
//     optional: true
//   },
//   "financialStaff.financialStaffPhone": {
//     type: String,
//     label: '移动电话',
//     optional: true
//   },
//   "financialStaff.financialStaffEmail": {
//     type: String,
//     label: '电子邮箱',
//     optional: true,
//     autoform: {
//       afFieldInput: {
//         type: "email"
//       }
//     }
//   },
//   "financialStaff.financialStaffIDType": {
//     type: String,
//     label: '身份证件类型',
//     optional: true,
//     autoform: {
//       type: 'select',
//       firstOption: false,
//       options: function() {
//         return [
//           {label: '身份证', value: '身份证'}
//         ]
//       }
//     }
//   },
//   "financialStaff.financialStaffID": {
//     type: String,
//     label: '身份证件号码',
//     optional: true
//   },
//   createTime: {
//     type: Date,
//     label: "创建日期",
//     optional: true,
//     autoValue: function() {
//       return (new Date());
//     }
//   }
// });