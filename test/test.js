Test = {};




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 基本的测试数据
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 模拟数据
Test.testData = function () {

  // 测试用超级管理员
  var ret = createAdminUser();
  var teamId = ret.teamId;
  var adminUserId = ret.userId;

  // 测试用管理员
  var managerUserId = createManageUser(teamId);

  // 测试用高级业务员
  var advUserId = createAdvUser(teamId);

  // 测试用普通业务员
  var userId = createUser(teamId);

  // 测试用客户
  var customerId = createCustomer(managerUserId);

  // 测试用公司注册业务

  // 测试用子任务

  // 其他
  var retOther = other(managerUserId, customerId);
}

// 测试用超级管理员
function createAdminUser() {
  if (Meteor.users.findOne({username: 'kylAdmin'}) || UsersTeam.findOne({name: 'testTeam'})) {
    return {
      userId: Meteor.users.findOne({username: 'kylAdmin'})._id,
      teamId: UsersTeam.findOne({name: 'testTeam'})._id
    };
  }

  var user = {
    name: 'kylAdmin',
    password: 'kyl123',
    phone: '18521595051',
    email: 'air.cui@kyl.biz',
  };

  var team = {
    name: 'testTeam',   // 群组名
    remark: '测试用群组', // 备注
  }

  var ret = KAccount.createTotalNewUser(team, user);
  log("测试用超级管理员", ret.userId, ret.teamId);

  return ret;
}


// 测试用管理员
function createManageUser (teamId) {
  check(teamId, String);

  if ( Meteor.users.findOne({username: 'kylManager'}) ) {
    return Meteor.users.findOne({username: 'kylManager'})._id;
  }

  var user = {
    name: 'kylManager',
    password: 'kyl123',
    phone: '18521595051',
    email: 'air.cui@kyl.biz',
  };

  var userId = KAccount.createUser(user, { teamId: teamId, roles: ['manager'] });
  log("测试用管理员", userId);

  return userId;
}


// 测试用高级业务员
function createAdvUser (teamId) {
  check(teamId, String);
  if ( Meteor.users.findOne({username: 'kylAdvUser'}) ) {
    return Meteor.users.findOne({username: 'kylAdvUser'})._id;
  }

  var user = {
    name: 'kylAdvUser',
    password: 'kyl123',
    phone: '18521595051',
    email: 'air.cui@kyl.biz',
  };

  var userId = KAccount.createUser(user, { teamId: teamId, roles: ['advUser'] });
  log("测试用高级业务员", userId);

  return userId;
}

// 测试用业务员
function createUser (teamId) {
  check(teamId, String);
  if ( Meteor.users.findOne({username: 'kylUser'}) ) {
    return Meteor.users.findOne({username: 'kylUser'})._id;
  }

  var user = {
    name: 'kylUser',
    password: 'kyl123',
    phone: '18521595051',
    email: 'air.cui@kyl.biz',
  };

  var userId = KAccount.createUser(user, { teamId: teamId, roles: ['user'] });
  log("测试用业务员", userId);

  return userId;
}


// 测试用客户
function createCustomer (hostId) {
  check(hostId, String);
  if ( Customers.findOne({name: '测试客户'}) ) {
    return Customers.findOne({name: '测试客户'})._id;
  }


  var customer = {
    name: '测试客户',
    hostId: hostId,
    from: '测试来源',
    createdBy: hostId,
    contactInfo: {
      name: 'cc',
      address: '上海徐汇',
      phone: '185215955051',
      email: 'air.cc@kyl.biz',
    },
    // service: ['companyRegist'],
    remark: '测试客户的备注',
  };
  var customerId = KCustomer.createCustomer(customer);
  log('测试用客户', customerId);
  return customerId;
}


// 测试用公司注册业务
function createService () {

}

// 测试用子任务


// 其他 -- 目前用于临时创建 公司注册业务及其子任务
function other(hostId, customerId) {
  check(hostId, String);
  check(customerId, String);
  if ( Service.findOne({}) ) {
    return {
      serviceId: Service.findOne({})._id,
      taskIdCheckName: 'testCompanyCheckName',
      taskIdRegist: 'testCompanyRegist'
    };
  }

  var user = Meteor.users.findOne({_id: hostId});

  // 创建公司注册业务
  var serviceId = Service.insert({
    type: 'companyRegist',
    host: {   // 负责人
      name: user.username,
      id: user._id,
    },
    customerId: customerId,   // 对应的客户id
    createdAt: new Date(),
    createdBy: user._id,
    status: 0, // "0 - 准备中", "1 - 受理中", "2 - 已完成", "-1 - 废弃"
    payed: true, // 是否付费 有/无
    // companyInfo: '',  // 公司信息
    tasks: [
      {type: 'companyCheckName', taskId: 'testCompanyCheckName'},
      {type: 'companyCheckName', taskId: 'testCompanyCheckName'},
    ], // 子任务id 列表
  });

  // 创建子任务
  // 核名
  var taskIdCheckName = Tasks.insert({
      _id: 'testCompanyCheckName',
      name: 'companyCheckName',   // 如: companyCheckName
      label: '公司核名',  // 如: 公司核名

      host: {   // 负责人
        name: user.username,
        id: user._id,
      },
      customerId: customerId, // 所属客户id,
      serviceId: serviceId, // 所属业务id, 如: 公司注册
      // nextTask: null,   // 下一步要进行的任务id，如核名下一步是工商登记

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

      steps: [],
      // steps: [ // 子任务步骤
      //   {
      //     dataStruct: '_id', // 待录入数据的结构
      //     name: '资料填写',
      //     startTime: new Date(),
      //     updateTime: new Date(),
      //     finished: true,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      //     data: {}
      //   },
      //   {
      //     dataStruct: '',
      //     name: '客户确认',
      //     startTime: null,
      //     updateTime: null,
      //     finished: true,
      //     data: {}
      //   },
      //   {
      //     dataStruct: '',
      //     name: '提交工商',
      //     startTime: new Date(),
      //     updateTime: new Date(),
      //     finished: false,
      //     data: {}
      //   }
      // ],

      progressChange: [  // 进度控制更改记录
      ]
  });

  // 登记
  var taskIdRegist = Tasks.insert({
      _id: 'testCompanyRegist',
      name: 'companyRegiste',   // 如: companyCheckName
      label: '工商登记',  // 如: 公司核名

      host: {   // 负责人
        name: user.username,
        id: user._id,
      },
      customerId: customerId, // 所属客户id,
      serviceId: serviceId, // 所属业务id, 如: 公司注册
      // nextTask: null,   // 下一步要进行的任务id，如核名下一步是工商登记

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

      steps: [],
      // steps: [ // 子任务步骤
      //   {
      //     dataStruct: '_id', // 待录入数据的结构
      //     name: '资料填写',
      //     startTime: new Date(),
      //     updateTime: new Date(),
      //     finished: true,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      //     data: {}
      //   },
      //   {
      //     dataStruct: '',
      //     name: '客户确认',
      //     startTime: null,
      //     updateTime: null,
      //     finished: true,
      //     data: {}
      //   },
      //   {
      //     dataStruct: '',
      //     name: '提交工商',
      //     startTime: new Date(),
      //     updateTime: new Date(),
      //     finished: false,
      //     data: {}
      //   }
      // ],

      progressChange: [  // 进度控制更改记录
      ]
  });

  log("公司注册业务", serviceId);
  log("子任务-核名", taskIdCheckName);
  log("子任务-登记", taskIdRegist);

  return {
    serviceId: serviceId,
    taskIdCheckName: taskIdCheckName,
    taskIdRegist: taskIdRegist
  };
}




//////////////////////////////0////////////////////////////////////////////////////////////////////////////////////////////
// 对数据的基本操作测试
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 对业务的操作
Test.optService = function (self) {
  log('Test.optService');
  // self.subscribe('getService');
  log("Service", Service.find({}).fetch());
}

Test.createService = function () {
  var customerInfo = Customers.find().fetch();

  var mock = {
    serType: 'companyRegist',
    hostId: Meteor.userId(),
    customerId: Customers.findOne({})._id,
    payed: true
  }

  log("createService", mock);

  Meteor.call('createService', mock.serType, mock.hostId, mock.customerId, mock.payed
      , function (error, result) {
        log('Test.createService', error, result);
  });
};

Test.updateService = function () {
  var mock = {
    serId: 'FS67pLcPwvYa4zKrQ',
    hostId: 'mzu5FdrDdQBofMGSs',
    payed: false,
  };

  Meteor.call('updateService', mock.serId, {hostId: mock.hostId, payed: mock.payed}, function (error, result) {
    log('Test.updateService', error, result);
  });
};

Test.deleteService = function () {
  var mock = {
    serId: 'FS67pLcPwvYa4zKrQ',
  };

  Meteor.call('deleteService', mock.serId, function (error, result) {
    log('Test.deleteService', error, result);
  });
};


//

Meteor.methods({
  'test': function (opt) {
    if ( Test[opt] ) {
      Test[opt]();
    }
  }
});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 公司状态变更测试
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Meteor.methods({
  'testhandle': function () {
    // remindTest();
  },
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
