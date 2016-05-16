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
  // return
});

// 业务数据
Meteor.publish('getService', function (customerId) {
  var userId = KUtil.isLogin(this); // 登录状态
  KUtil.havePermission(userId, 'service.view', customerId);   // 权限
  return KService.getService(customerId);
});

// 任务数据
Meteor.publish('getTasks', function (taskType) {
  log('getTasks', taskType);
  var userId = KUtil.isLogin(this); // 登录状态
  KUtil.havePermission(userId, 'task.view');   // 权限

  log("KTask-", KTask.getTasks(userId, taskType).fetch());
  return KTask.getTasks(userId, taskType);
});

// 获取辅助信息
Meteor.publish('getSupportInfo', function (opt) {
  // var userId = KUtil.isLogin(this); // 登录状态

  opt = opt || {};
// log("getSupportInfo-opt", opt, this.userId);
// var info = SupportInfo.findOne({type: 'task', service: 'companyRegist'});
// log("getSupportInfo-info", info.items);

  return SupportInfo.find(opt);
});
