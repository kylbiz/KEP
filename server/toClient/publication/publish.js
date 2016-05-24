/*
 * 对客户端publish的数据
 **/

// 客户数据
Meteor.publish('getCustomers', function () {
  var userId = KUtil.isLogin(this); // 登录状态
  KUtil.havePermission(userId, 'customer.view'); // 权限
  return KCustomer.getCustomers(userId);
});

Meteor.publish('getCustomer', function (customerId) {
  var userId = KUtil.isLogin(this); // 登录状态
  KUtil.havePermission(userId, 'customer.view'); // 权限
  return  KCustomer.getCustomer(customerId);
});

// 业务数据
Meteor.publish('getService', function (customerId) {
  var userId = KUtil.isLogin(this); // 登录状态
  KUtil.havePermission(userId, 'service.view', customerId);   // 权限
  return KService.getService(customerId);
});


// 获取子任务数据
Meteor.publish('getTasks', function () {
  var userId = KUtil.isLogin(this);   // 登录状态
  KUtil.havePermission(userId, 'task.view');   // 权限

  var tasksCursor = KTask.getTasks(userId);

  var customerList = [];
  tasksCursor.forEach(function (task) {
    customerList.push(task.customerId);
  });
  var customersCursor = KCustomer.getCustomersByIdList(customerList);

  return [tasksCursor, customersCursor];
});

// 获得某一类型任务数据
Meteor.publish('getTasksByType', function (taskType) {
  log('getTasksByType', taskType);
  var userId = KUtil.isLogin(this); // 登录状态
  KUtil.havePermission(userId, 'task.view');   // 权限

  return KTask.getTasksByType(userId, taskType);
});

// 通过从属业务的ID获得相应的任务
Meteor.publish("getTasksBySerId", function (serviceId) {
  log("getTasksBySerId", serviceId);
  var userId = KUtil.isLogin(this); // 登录状态
  KUtil.havePermission(userId, 'task.view');   // 权限

  return KTask.getTasksBySerId(serviceId);
});

Meteor.publish('getTaskInfo', function (taskId) {
  var userId = KUtil.isLogin(this); // 登录状态
  KUtil.havePermission(userId, 'task.view', taskId);   // 权限

  return KTask.getTaskInfo(taskId);
});


// 通过客户获取其相对的公司信息
Meteor.publish("getCompanyInfoByCustomer", function (customerId) {
  var userId = KUtil.isLogin(this); // 登录状态
  // 暂时只需要登录权限,未想好
  return KCompanyInfo.getCompanyInfoByCustomer(customerId);
});

// 获取辅助信息
Meteor.publish('getSupportInfo', function (opt) {
  var userId = KUtil.isLogin(this); // 登录状态
  opt = opt || {};
// log("getSupportInfo-opt", opt, this.userId);
// var info = SupportInfo.findOne({type: 'task', service: 'companyRegist'});
// log("getSupportInfo-info", info.items);
  return SupportInfo.find(opt);
});

// 获取某个team的任务的steps信息
Meteor.publish('getStepsDes', function (taskTypeList) {
  var userId = KUtil.isLogin(this); // 登录状态

  return KTaskSteps.getStepsDes(userId, taskTypeList);
});

// 获得相关的用户信息
Meteor.publish('getHostUser', function (roles) {
  if (_.isString(roles)) {
    roles = [roles];
  }

  if (_.isArray(roles)) {
    return Meteor.users.find({'team.roles': {$in: roles}}, {fields: {username: 1, _id: 1}});
  }
  return [];
});
