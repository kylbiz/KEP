// 公司信息
CompanyInfo = new Mongo.Collection('CompanyInfo');
CompanyInfo.attachSchema(new SimpleSchema({
  "customerId": {
    type: String,
    label: "所属客户的ID"
  },
  "company": {  // 公司基本信息
    type: Object,
    label: "公司基本信息",
    optional: true,
  },
  "company.name": {
    type: String,
    label: "公司名称",
    optional: true,
  },
  "company.moneyAmount": {
    type: Number,
    label: "注册资本",
    optional: true,
  },
  "company.type": {
    type: String,
    label: "公司性质",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '有限责任公司', value: '有限责任公司'},
          {label: '有限合伙', value: '有限合伙'}
        ]
      }
    }
  },
  "company.zone": {
    type: String,
    label: "注册区域",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '虹口', value: '虹口'},
          {label: '浦东', value: '浦东'}
        ]
      }
    }
  },
  "company.address": {
    type: String,
    label: "公司地址",
    optional: true,
  },
  "company.productionAddress": {
    type: String,
    label: "生产经营地址",
    optional: true,
  },
  "company.businessPeriod": {
    type: String,
    label: "经营期限",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '10年', value: '10年'},
          {label: '20年', value: '20年'},
          {label: '长期', value: '长期'}
        ]
      }
    }
  },
  "company.businessScope": {
    type: String,
    label: "经营范围",
    optional: true,
  },
  "company.companyId": {
    type: String,
    label: "",
    optional: true,
  },
  "holders": {  // 股东
    type: Array,
    label: "股东",
    optional: true,
  },
  "holders.$": {
    type: Object,
    label: "股东",
    optional: true,
  },
  "holders.$.name": {
    type: String,
    label: "股东姓名"
  },
  "holders.$.IDType": {
    type: String,
    label: "证件类型",
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '身份证', value: '身份证'}
        ]
      }
    }
  },
  "holders.$.ID": {
    type: String,
    label: "证照号码"
  },
  "holders.$.investType": {
    type: String,
    label: "出资方式",
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '货币', value: '货币'}
        ]
      }
    }
  },
  "holders.$.investShare": {
    type: Number,
    label: "占股比例(%)",
    decimal: true
  },
  "legalPerson": {  // 法人
    type: Object,
    label: "法人",
    optional: true,
  },
  "legalPerson.name": {
    type: String,
    label: "法人姓名"
  },
  "legalPerson.tel": {
    type: String,
    label: "固定电话",
    optional: true,
  },
  "legalPerson.phone": {
    type: String,
    label: "移动电话",
    optional: true,
  },
  "legalPerson.email": {
    type: String,
    label: "电子邮箱",
    optional: true,
  },
  "legalPerson.IDType": {
    type: String,
    label: "证件类型",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '身份证', value: '身份证'}
        ]
      }
    }
  },
  "legalPerson.ID": {
    type: String,
    label: "证件号码",
    optional: true,
  },
  "chairman": {   // 股东
    type: Object,
    label: "董事",
    optional: true,
  },
  "chairman.name": {
    type: String,
    label: "董事姓名",
  },
  "chairman.type": {
    type: String,
    label: "职务",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '执行董事', value: '执行董事'}
        ]
      }
    }
  },
  "chairman.IDType": {
    type: String,
    label: "证件类型",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '身份证', value: '身份证'}
        ]
      }
    }
  },
  "chairman.ID": {
    type: String,
    label: "证件号码",
    optional: true,
  },
  "chairman.phone": {
    type: String,
    label: "移动电话",
    optional: true,
  },
  "supervisor": {   // 监事
    type: Object,
    label: "监事",
    optional: true,
  },
  "supervisor.name": {
    type: String,
    label: "监事姓名",
  },
  "supervisor.type": {
    type: String,
    label: "职务",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '监事', value: '监事'}
        ]
      }
    }
  },
  "supervisor.IDType": {
    type: String,
    label: "证件类型",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '身份证', value: '身份证'}
        ]
      }
    }
  },
  "supervisor.ID": {
    type: String,
    label: "证件号码",
    optional: true,
  },
  "supervisor.phone": {
    type: String,
    label: "移动电话",
    optional: true,
  },
  "manager": {   // 经理
    type: Object,
    label: "经理",
    optional: true,
  },
  "manager.name": {
    type: String,
    label: "经理姓名",
  },
  "manager.type": {
    type: String,
    label: "职务",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '经理', value: '经理'}
        ];
      }
    }
  },
  "manager.IDType": {
    type: String,
    label: "证件类型",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '身份证', value: '身份证'}
        ]
      }
    }
  },
  "manager.ID": {
    type: String,
    label: "证件号码",
    optional: true,
  },
  "financialStaff": { // 财务负责人
    type: Object,
    label: "财务负责人",
    optional: true,
  },
  "financialStaff.name": {
    type: String,
    label: "财务姓名"
  },
  "financialStaff.tel": {
    type: String,
    label: "固定电话",
    optional: true,
  },
  "financialStaff.phone": {
    type: String,
    label: "移动电话",
    optional: true,
  },
  "financialStaff.email": {
    type: String,
    label: "电子邮箱",
    optional: true,
  },
  "financialStaff.IDType": {
    type: String,
    label: "证件类型",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '身份证', value: '身份证'}
        ]
      }
    }
  },
  "financialStaff.ID": {
    type: String,
    label: "证件号码",
    optional: true,
  },
  "contractor": {   // 企业联络员
    type: Object,
    label: "企业联络员",
    optional: true,
  },
  "contractor.name": {
    type: String,
    label: "联络员姓名"
  },
  "contractor.tel": {
    type: String,
    label: "固定电话",
    optional: true,
  },
  "contractor.phone": {
    type: String,
    label: "移动电话",
    optional: true,
  },
  "contractor.email": {
    type: String,
    label: "电子邮箱",
    optional: true,
  },
  "contractor.IDType": {
    type: String,
    label: "证件类型",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '身份证', value: '身份证'}
        ]
      }
    }
  },
  "contractor.ID": {
    type: String,
    label: "证件号码",
    optional: true,
  },
}));

struct = {
  company: { // 公司基本信息
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
  legalPerson: {  // 法人
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
