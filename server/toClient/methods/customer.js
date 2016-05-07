/*
 * 客户管理相关的接口
**/

Meteor.methods({
  'createCustomer': function (customerInfo) { // 创建客户
    // args 正确性
    // 账号权限
    var userId = KUtil.isLogin();
    KUtil.havePermission(userId, 'customer.create');

    return KCustomer.createCustomer(customerInfo);
  },
  'updateCustomerBasic': function (customerId, basicInfo) { // 更新客户基本信息
    // args 正确性
    // 账号权限
    var userId = KUtil.isLogin();
    KUtil.havePermission(userId, 'customer.update', customerId)

    return KCustomer.updateCustomerBasic(customerId, basicInfo);
  },
  'deleteCustomer': function (customerId) { // 删除客户
    // args 正确性
    // 账号权限
    var userId = KUtil.isLogin();
    KUtil.havePermission(userId, 'customer.delete');

    return KCustomer.deleteCustomer(customerId);
  }
});
