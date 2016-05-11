//autoForm
Customers = new Mongo.Collection('Customers');
// Customer 结构:
Customers.attachSchema(new SimpleSchema({
  customer: {
    type: String,
    label:"客户基本信息",
    optional: true
  },
  "customer.contactor":{
    type: String,
    label: "联系人"
  },
  "customer.contactorPhone":{
    type: String,
    label: "电话",
  },
  "customer.contactorEmail":{
    type: String,
    label: "邮箱",
  },
  customername: {
    type: String,
    label: "客户名称",
    max: 200
  },
  principal: {
    type: String,
    label: "客户负责人",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label:'cc', value:'cc'},
          {label:'kyl', value:'kyl'}
        ]
      }
    }
  },
  customerId: {
    type: String,
    label:"客户代号"
  },
  name: {
    type: String,
    label: "姓名",
  },
  tel: {
    type: String,
    label: "电话"
  },
  email: {
    type: String,
    label: "电子邮箱"
  },
  localtion: {
    type: String,
    label: "通讯地址",
    min: 0
  },
  customerOrigin: {
    type: String,
    label: "客户来源",
    optional: true
  },
  business: {
      type: String,
      allowedValues: ["公司注册","公司注册"]
  },
  service: {
    type: String,
    label: "受理业务",
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label:'公司注册', value:'公司注册'},
          {label:'工商登记', value:'ICBC_register'}
        ]
      }
    }
  },
  remarks: {
    type: String,
    label: "备注",
    optional: true,
    max: 1000
  },
  createAt: {
    type: Date,
    label: "创建时间"
  }
}));

// Customer 结构:
struct = {
  name: '',
  host: {
    name: '',
    id: '',
  },
  status: 1, // -1 -- 删除， 1 -- 服务中
  teamId: '', // 所属团队
  createdAt: '',
  createdBy: '', // 创建人
  contactInfo: {
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  service: [  // 服务项目
    {type: 'companyRegist', id: ''} // 公司注册
  ],
  from: '',   // 客户来源
  remark: '', // 备注
}

// 公司注册业务
// CompanyRegist = new Mongo.Collection('CompanyRegist');
Service = new Mongo.Collection('Service');
struct = {
  type: 'companyRegist',
  host: {   // 负责人
    name: '',
    id: '',
  },
  customerId: '', // 对应的客户id
  createdAt: '',
  createdBy: '',
  contactInfo: {   // 公司注册时的联系人，这个跟客户信息中有重复可不使用，这里放上来主要是考虑以后拓展业务后，各业务间区格
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  remark: '', // 备注信息, 只有单业务（公司注册）的情况下，可不使用
  status: 0, // "0 - 准备中", "1 - 受理中", "2 - 已完成", "-1 - 废弃"
  payed: true, // 是否付费 有/无
  companyInfo: '_id',  // 公司信息
  tasks: [{type: 'checkName', id: ''}], // 子任务id 列表
}

// 子任务信息
Tasks = new Mongo.Collection('Tasks');
// Task 结构
struct = {
  name: '',   // 如: companyCheckName
  label: '',  // 如: 公司核名

  host: {    // 负责人
    name: '',
    id: '',
  },
  customerId: '', // 所属客户id,
  serviceId: '',  // 所属业务id, 如: 公司注册

  createdAt: '',
  startTime: '',
  updateTime: '',
  status: 0, // "0 - 处理中, 1 - 已完成， -1 - 废弃"

  remind: { // 通知
    email: [  // 邮件通知
      {
        type: 'email',
        to: '',
        template: '', // 发送邮件模板
        data: {

        },
        other: '',
      },
    ],
    sms: [
      {
        type: 'sms',  // 短信通知
        to: '',
        template: '', // 发送短信邮件
        data: {

        },
        other: '',
      }
    ]
  },

  taskStepId: '',
  steps: [  // 子任务步骤
    {
      name: '填写资料',
      startTime: '',
      updateTime: '',
      finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      // collection: 'CompanyCheckName',
      dataStruct: '_id', // 待录入数据的结构
      data: {
      }
    },
    {
      name: '客户确认',
      startTime: '',
      updateTime: '',
      finished: true,
      data: {
        name: '',
        time: ''
      }
    },
    {
      name: '提交工商',
      startTime: '',
      updateTime: '',
      finished: true,
      data: {
        name: '',
        time: ''
      }
    }
  ],

  progressChange: [  // 进度控制更改记录
    {
      from: '', // 从哪一步 (step - name)
      returnTo: '', // 回退到哪一步 (step - name)
      time: '', // 回退时间
      by: '', // 操作人的id
      reason: '', // 简要原因
      remark: '' // 备注信息
    },
  ]
}


// 公司信息
CompanyInfo = new Mongo.Collection('CompanyInfo');

// CompanyInfo.attachSchema(new SimpleSchema({
//   name: {
//     type: String,
//     label: '公司名'
//   },
//   RegisterCapital: {
//     type: Number,
//     label: '注册资本'
//   },
//   property: {
//     type: String,
//     label: '公司性质'
//   },
//   RegistrationDistrict: {
//     type: String,
//     label: '注册区域'
//   },
//   CompanyAddress: {
//     type: String,
//     label: '公司地址'
//   },
//   ProductionAddress:{
//     type: String,
//     label: '生产经营地址'
//   },
//   CheckId: {
//     type: String,
//     label: '名称预先核准文号/注册号/统一社会信用代码'
//   },
//   OperationPeriod:{
//     type: String,
//     label: '经营期限'
//   },
//   BusinessScope: {
//     type: String,
//     label: '经营范围'
//   },
//   HoldersName:{
//     type: String,
//     label: '股东姓名'
//   },
//   HoldersCredentials:{
//     type: String,
//     label: '证件类型'
//   },
//   CredentialsNum: {
//     type: String,
//     label: '证件号码'
//   }
// }));

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
