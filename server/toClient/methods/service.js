/*
 * 受理的业务相关的处理
 **/

Meteor.methods({
  'createService': function (serType, hostId, customerId, payed) {  // 为客户创建新的业务
      // 登录
      var userId = KUtil.isLogin();

      // 账号权限
      // 创建新的业务需要两个权限 1.修改客户受理业务的权限，2. 创建业务的权限
      KUtil.havePermission(userId, 'customer.update', customerId);
      KUtil.havePermission(userId, 'service.create');

      var serId = KService.createService({
        serType: serType,
        hostId: hostId,
        customerId: customerId,
        payed: payed,
        creatorId: userId,
      });
      if (!serId) {
        throw new Meteor.Error("创建业务的失败");
      }

      var customerChanged = KCustomer.updateCustomerService(customerId, {
        opt: 'add',
        service: {
          type: serType,
          id: serId
        }
      });
      if (!customerChanged) {
        throw new Meteor.Error('内部数据处理错误');
      }
      return serId;
  },
  'updateService': function (serId, serInfo) {  // 更新业务
      // 登录
      var userId = KUtil.isLogin();

      // 账号权限
      KUtil.havePermission(userId, 'service.update', serId);

      var serChanged = KService.updateService(serId, serInfo);
      if ( !serChanged ) {
        throw new Meteor.Error('内部数据处理错误');
      }
      return serId;
  },
  'deleteService': function (serId) {  // 删除业务
    // 登录
    var userId = KUtil.isLogin();

    // 账号权限
    var serChanged = KUtil.havePermission(userId, 'service.delete', serId);
    if (!serChanged) {
      throw new Meteor.Error('内部数据处理错误');
    }

    return serId;
  }
});
