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
    payed: Boolean,
    hostId: String,
    contactInfo: {
      name: String,
      address: Match.Maybe(String),
      phone: String,
      email: Match.Maybe(String)
    },
    service: Match.OneOf('companyRegist'), // 这个地方写得比较死
    remark: Match.Maybe(String)
  });

  if (!isSafeToProcess) {
    throw new Meteor.Error('传入的参数有误');
  }

  var hostInfo = Meteor.users.findOne({_id: customerInfo.hostId});
  var creator = this.userId;
  var service = [];
  customerInfo.service.forEach(function (name) {
    service.push({name: name});
  });

  var customerId = Customers.insert({
    name: customerInfo.name,
    host: {
      name: hostInfo.username,
      id: customerInfo.hostId
    },
    payed: customerInfo.payed,
    status: 1, // 正常服务
    teamId: hostInfo.team.teamId,
    createdAt: new Date(),
    createdBy: creator,
    contactInfo: customerInfo.contactInfo,
    service: service,
    from: customerInfo.from,
    remark: customerInfo.remark
  });

  // 这里service中如果有业务则需要初始化相应的业务

  return customerId;
}


/*
 * 更新客户的基本信息
 **/
KCustomer.updateCustomerBasic = function (basicInfo) {
}


/*
 * 更新客户的业务
 **/
KCustomer.updateCustomerService = function (serviceInfo) {
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
  check(role, String);

  var userInfo = Meteor.users.findOne({_id: userId}) || false;
  if (userInfo) {
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
      // 这里只有公司注册一项业务, 以后要是加业务就需要从客户的信息中查看他开通的业务
      var customers = [];
      CompanyRegist.find({
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

  if (handleMap.hasOwnPerporty(role)) {
    handleMap[role]();
    return Customers.find(dataFilter, dataOpt);
  }

  return [];
}





