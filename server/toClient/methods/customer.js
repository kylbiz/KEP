/*
 * 客户管理相关的接口
**/

Meteor.methods({
  'initCustomer': function (customerInfo, service) {
    log('initCustomer', customerInfo);
    // 创建新客户
    var customerId = Meteor.call('createCustomer', customerInfo);
    log('createCustomer', customerId);

    // 为新客户开通业务
    var hostId = customerInfo.hostId;
    var service = service || [];
    var serList = [];
    service.forEach(function (ser) {
      var serId = Meteor.call('initService', ser.serType, hostId, customerId, ser.payed || false);
      log("initService", ser.serType, serId)
      serList.push({serType: ser.serType, serId: serId});
    });

    return {
      customerId: customerId,
      service: serList
    };
  },
  'createCustomer': function (customerInfo) { // 创建客户
    // args 正确性
    // 账号权限
    var userId = KUtil.isLogin();
    KUtil.havePermission(userId, 'customer.create');

    // 创建客户
    return KCustomer.createCustomer(customerInfo);
  },
  'updateCustomerBasic': function (customerId, basicInfo) { // 更新客户基本信息
    // args 正确性
    // 账号权限
    var userId = KUtil.isLogin();
    KUtil.havePermission(userId, 'customer.update', customerId)

    return KCustomer.updateCustomerBasic(customerId, basicInfo);
  },
  // 通过autoform生成了操作mongodb的set或unset
  'updateCustomerLess': function (customerId, opt) {
    var userId = KUtil.isLogin();
    KUtil.havePermission(userId, 'customer.update', customerId);

    log('updateCustomerLess', customerId, opt);

    return Customers.update({_id: customerId}, opt);;
  },
  'deleteCustomer': function (customerId) { // 删除客户
    // args 正确性
    // 账号权限
    var userId = KUtil.isLogin();
    KUtil.havePermission(userId, 'customer.delete');

    return KCustomer.deleteCustomer(customerId);
  }
});
