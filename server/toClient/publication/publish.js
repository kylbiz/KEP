/*
 * 对客户端publish的数据
 **/

// 客户数据
Meteor.publish('getCustomers', function () {
  log('getCustomers ', this.userId);
  var userId = KUtil.isLogin(this); // 登录状态
  var permissionLevel = KUtil.havePermission(userId, 'customer.view'); // 权限

  return KCustomer.getCustomers(userId);
});
