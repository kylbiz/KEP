// 生成文档
DocGenerated = new Mongo.Collection('DocGenerated');
struct = {
  url: '',
  createdBy: '',
  createdAt: '',
  uuid: '',
  templateId: '',
  label: '',
}



// KEP系统内通知
NoticeInfo = new Mongo.Collection('NoticeInfo');
struct = {
  from: '',
  to: '',
  type: '', // system - 系统通知 / customer - 客户管理通知
  status: 0, // 1 - 已读，0 - 未读，-1 - 删除
  title: '',
  createdAt: '',
  frontImages: '',
  content: "",
}


// 操作log
LogSys = new Mongo.Collection('LogSys');
struct = {
  type: 'customer', // <sys / customer>
  createdAt: '',
  operator: '', // 操作人员 id
  opt: '', // 操作类型 暂定: < customer_add customer_del customer_change / task_add task_del task_change>
  optObj: '',
  msg: '',
}


// 公司核名信息
CompanyCheckName = new Mongo.Collection('CompanyCheckName');
struct = {
  company: {
    zone: '',
    type: '',
    name: '',
    alternativeName: [
      {name: ''},
    ],
    moneyAmount: '',
    businessScope: '',
  },
  address: '',
  holders: [
    {
      name: '',
      IDType: '',
      ID: ''
    }
  ]
}


// 公司工商登记信息
CompanyRegistInfo = new Mongo.Collection('CompanyRegistInfo');
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


// 用户所在团队 暂不使用
UsersTeam = new Mongo.Collection('UsersTeam');
struct = {
  name: '',   // 群组名
  remark: '', // 备注
  createdAt: '',
  roles: ['admin', 'manager', 'user']
}


// 用户meteor包管理创建
struct = {
  username: '',
  email: '',
  profile: {
    phone: '',
  },
  team: {    // 用户群组
    teamId: '',
    name: '',
    roles: ['admin'], // 用户在群组中的权限
  }
}
