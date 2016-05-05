/*
 * 客户管理相关的接口
**/

Meteor.methods({
  'createCustomer': function (customerInfo) { // 创建客户
    // args 正确性
    // 账号权限
    var userId = KUtil.isLogin(this);
    if (!KTeam.havePermission(userId, 'customer.create')) {
      throw new Meteor.Error('当前账号无权限');
    }

    return KCustomer.createCustomer(customerInfo);
  },
  'updateCustomerBasic': function (basicInfo) { // 更新客户基本信息
    // args 正确性
    // 账号权限
    var userId = KUtil.isLogin(this);
    if (!KTeam.havePermission(userId, 'customer.update')) {
      throw new Meteor.Error('当前账号无权限');
    }

    return KCustomer.updateCustomerBasic(basicInfo);
  },
  'updateCustomerService': function (serviceInfo) { // 更新客户受理任务的信息
  },
  'deleteCustomer': function (customerId) { // 删除客户
    // args 正确性
    // 账号权限
    var userId = KUtil.isLogin(this);
    if (!KTeam.havePermission(userId, 'customer.delete')) {
      throw new Meteor.Error('当前账号无权限');
    }

    return KCustomer.deleteCustomer(customerId);
  }
});
