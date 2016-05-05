Test = {};

// 模拟数据
Test.testData = function () {
  if (Customers.find({}).count() > 0) {
    return;
  }

  // 用户
  var user = Meteor.users.findOne();

  // 创建客户
  var customerId = Customers.insert({
    name: '开业啦测试用户',
    host: {
      name: user.username,
      id: user._id
    },
    createdAt: new Date(),
    contactInfo: {
      name: 'cc',
      address: '上海徐汇',
      phone: '18521595051',
      email: 'air.cui@kyl.biz',
    },
    service: [
      {
        type: 'companyRegist',
        service: true
      },
    ],
    from: 'test',
    remark: '测试用户'
  });

  // 创建公司注册业务
  var serviceId = CompanyRegist.insert({
    host: {   // 负责人
      name: user.username,
      id: user._id,
    },
    customerId: customerId, // 对应的客户id
    createdAt: new Date(),
    status: 0, // "0 - 准备中", "1 - 受理中", "2 - 已完成", "-1 - 废弃"
    payed: true, // 是否付费 有/无
    // companyInfo: '',  // 公司信息
    // tasks: [], // 子任务id 列表
  });

  // 创建子任务
  var taskId = Tasks.insert({
      name: 'companyCheckName',   // 如: companyCheckName
      label: '公司核名',  // 如: 公司核名

      host: {   // 负责人
        name: user.username,
        id: user._id,
      },
      customerId: customerId, // 所属客户id,
      serviceId: serviceId, // 所属业务id, 如: 公司注册
      nextTask: null,   // 下一步要进行的任务id，如核名下一步是工商登记

      createdAt: new Date(),
      updateTime: new Date(),
      status: 0, // "0 - 处理中, 1 - 已完成， -1 - 废弃"
      remind: { // 通知
        email: [  // 邮件通知
          {
            type: 'email',
            to: '1145571693@qq.com',
            template: 'default', // 发送邮件模板
            data: {

            },
            other: '',
          },
        ],
        sms: [
          {
            type: 'sms',  // 短信通知
            to: '18521595051',
            template: '11559', // 发送短信邮件
            data: {

            },
            other: '',
          }
        ]
      },


      steps: [ // 子任务步骤
        {
          dataStruct: '_id', // 待录入数据的结构
          name: '资料填写',
          startTime: new Date(),
          updateTime: new Date(),
          finished: true,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
          data: {}
        },
        {
          dataStruct: '',
          name: '客户确认',
          startTime: null,
          updateTime: null,
          finished: true,
          data: {}
        },
        {
          dataStruct: '',
          name: '提交工商',
          startTime: new Date(),
          updateTime: new Date(),
          finished: false,
          data: {}
        }
      ],


      progressChange: [  // 进度控制更改记录
      ]
  });
}


Meteor.methods({
  'testhandle': function () {
    // remindTest();
  }
});


// 模拟公司信息变更的操作
function remindTest() {
  var taskInfo = Tasks.findOne({});
  var taskId = taskInfo._id;
  // var customerId = taskInfo.customerId;

  Yiqicha.subscribe({
    type: 'checkName',  // or 'regist'
    companyName: '上海尤安建筑设计股份有限公司',
    other: {
      taskId: taskId, // 订阅该公司名的子任务id
      call: 'companyStatusChange',
    }
  });
}
