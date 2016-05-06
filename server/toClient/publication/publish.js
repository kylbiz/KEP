/*
 * 对客户端publish的数据
 **/

// 客户数据
Meteor.publish('getCustomers', function () {
  var userId = KUtil.isLogin(this); // 登录状态
  KUtil.havePermission(userId, 'customer.view'); // 权限
  return KCustomer.getCustomers(userId);
});

// 业务数据
// 目前只有公司注册的数据
Meteor.publish('getService', function (customerId) {
  var userId = KUtil.isLogin(this); // 登录状态
  KUtil.havePermission(userId, 'service.view', customerId);   // 权限
  return KService.getService(userId, customerId);
});
