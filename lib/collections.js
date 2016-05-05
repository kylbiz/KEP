// 客户信息
Customers = new Mongo.Collection('Customers');
// Customer 结构:
struct = {
  name: '',
  host: {
    name: '',
    id: '',
  },
  createdAt: '',
  contactInfo: {
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  service: {  // 服务项目
    companyRegist: true, // 公司注册
  },
  from: '', // 客户来源
  remark: '', // 备注
}

// 公司注册业务
CompanyRegist = new Mongo.Collection('CompanyRegist');
struct = {
  host: {   // 负责人
    name: '',
    id: '',
  },
  customerId: '', // 对应的客户id
  createdAt: '',
  contactInfo: {  // 公司注册时的联系人，这个跟客户信息中有重复可不使用，这里放上来主要是考虑以后拓展业务后，各业务间区格
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  remark: '', // 备注信息, 只有单业务（公司注册）的情况下，可不使用
  status: 0, // "0 - 准备中", "1 - 受理中", "2 - 已完成", "-1 - 废弃"
  payed: true, // 是否付费 有/无
  companyInfo: '_id',  // 公司信息
  tasks: [], // 子任务id 列表
}

// 子任务信息
Tasks = new Mongo.Collection('Tasks');
// Task 结构
struct = {
  name: '',   // 如: companyCheckName
  label: '',  // 如: 公司核名

  host: {   // 负责人
    name: '',
    id: '',
  },
  customerId: '', // 所属客户id,
  serviceId: '', // 所属业务id, 如: 公司注册
  nextTask: '',   // 下一步要进行的任务id，如核名下一步是工商登记

  createdAt: '',
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


  steps: [ // 子任务步骤
    {
      name: '',
      startTime: '',
      updateTime: '',
      finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      dataStruct: '_id', // 待录入数据的结构
      data: {}
    },
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
struct = {
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

LogSys = new Mongo.Collection('LogSys');
struct = {
  type: 'customer', // <sys / customer>
  createdAt: '',
  operator: '', // 操作人员 id
  opt: '', // 操作类型 暂定: < customer_add customer_del customer_change / task_add task_del task_change>
  optObj: '',
  msg: '',
}



// 用户meteor包管理创建
struct = {
  username: '',
  email: '',
  profile: {
    phone: ''
  },
  roles: [''],
}







