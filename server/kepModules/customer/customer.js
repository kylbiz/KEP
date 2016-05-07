/*
 * 客户的管理
 **/
KCustomer = {};


/*
 * 创建客户
 **/
KCustomer.createCustomer = function (customerInfo) {
  // check
  var isSafeToProcess = Match.test(customerInfo, {
    name: String,
    hostId: String,
    from: Match.Maybe(String),
    createdBy: String,
    contactInfo: {
      name: String,
      address: Match.Maybe(String),
      phone: String,
      email: Match.Maybe(String)
    },
    // service: Match.Maybe([String]),
    remark: Match.Maybe(String)
  });

  if (!isSafeToProcess) {
    throw new Meteor.Error('传入的参数有误');
  }

  var hostInfo = Meteor.users.findOne({_id: customerInfo.hostId});
  // var service = [];
  // customerInfo.service.forEach(function (type) {
  //   // 检测service的数据是否非法 这个地方写得比较死
  //   if ( ['companyRegist'].indexOf(type) ) {
  //     service.push({type: type});
  //   }
  // });

  var customerId = Customers.insert({
    name: customerInfo.name,
    host: {
      name: hostInfo.username,
      id: customerInfo.hostId
    },
    status: 1, // 正常服务
    teamId: hostInfo.team.teamId,
    createdAt: new Date(),
    createdBy: customerInfo.createdBy,
    contactInfo: customerInfo.contactInfo,
    service: [],
    from: customerInfo.from || "",
    remark: customerInfo.remark
  });

  // 这里service中如果有业务则需要初始化相应的业务

  return customerId;
}


/*
 * 更新客户的基本信息
 **/
KCustomer.updateCustomerBasic = function (customerId, basicInfo) {
  // check
  var isSafeToProcess = Match.test(basicInfo, {
    name: String,
    payed: Boolean,
    hostId: String,
    from: Match.Maybe(String),
    contactInfo: {
      name: String,
      address: Match.Maybe(String),
      phone: String,
      email: Match.Maybe(String)
    },
    remark: Match.Maybe(String)
  });

  if (!isSafeToProcess) {
    throw new Meteor.Error('传入的参数有误');
  }

  var customerInfo = Customers.findOne({_id: customerId});
  if (!customerInfo) {
    throw new Meteor.Error('查找的信息不存在');
  }

  return Customers.update({_id: customerId}, {$set: basicInfo});
}


/*
 * 更新客户的业务
 **/
KCustomer.updateCustomerService = function (customerId, serviceInfo) {
  check(customerId, String);
  check(serviceInfo, {
    opt: Match.OneOf('add'),
    service: {
      type: Match.OneOf('companyRegist'),
      id: String,
      // status: 0,
    }
  });

  if (!Customers.findOne({_id: customerId})) {
    throw new Meteor.Error('查找的信息不存在');
  }

  if (serviceInfo.opt == 'add') {
    return Customers.update({_id: customerId}, {$push: {service: serviceInfo.service}});
  }

  throw new Metor.Error('内部数据处理错误');
}


/*
 * 删除客户
 **/
KCustomer.deleteCustomer = function (customerId) {

  if (Customers.findOne({_id: customerId})) {
    throw new Meteor.Error('传入的参数有误');
  }

  return Customers.update({_id: customerId}, {$set: {status: -1}});
}


/*
 * 各种用户能获取到的客户信息
 **/
KCustomer.getCustomers = function (userId) {
  check(userId, String);

  var userInfo = Meteor.users.findOne({_id: userId}) || false;
  if (!userInfo) {
    throw new Meteor.Error('查找的信息不存在');
  }
  var teamInfo = userInfo.team || {};
  var role = teamInfo.roles[0] || false;
  var teamId = teamInfo.teamId || false;
  if (!role || !teamId) {
    throw new Meteor.Error('内部数据处理错误');
  }

  var dataFilter = {teamId: teamId, status: {$gte: 0}};
  var dataOpt = {sort: {createdAt: -1}};

  // 具体角色的处理
  var handleMap = {
    'admin': function () {
      // return Customers.find(dataFilter, dataOpt);
    },
    'manager': function () {
      // (也可以是只能看到他负责的客户)
    },
    'advUser': function () {
      var customers = [];
      Service.find({
        'host.id': userId
      },{
        fields: {customerId: 1}
      }).forEach(function (info) {
        if (info && info.customerId) {
          customers.push(info.customerId);
        }
      });
      dataFilter = _.extend(dataFilter, {_id: {$in: customers}});
    },
    'user': function () {
      //
      var customers = [];
      Tasks.find({
        'host.id': userId
      }, {
        fields: {customerId: 1}
      }).forEach(function (info) {
        if (info && info.customerId) {
          customers.push(info.customerId);
        }
      });
      dataFilter = _.extend(dataFilter, {_id: {$in: customers}});
    },
  }

  if (typeof handleMap[role] == 'function') {
    handleMap[role]();
// log('getCustomers', userId, role, dataFilter, dataOpt);
    return Customers.find(dataFilter, dataOpt);
  }

  return [];
}





