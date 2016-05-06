/*
 * 受理的业务相关的处理
 **/

Meteor.methods({
  'createService': function (serType, hostId, customerId, payed) {  // 为客户创建新的业务
      // 账号权限
      var userId = KUtil.isLogin();

      // 创建新的业务需要两个权限 1.修改客户受理业务的权限，2. 创建业务的权限
      if (!KTeam.havePermission(userId, 'service.create')
          || !KTeam.havePermission(userId, 'customer.update', customerId)
        ) {
        throw new Meteor.Error('当前账号无权限');
      }

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

      // {type: serType, id: serId};

      return ;
  },
  'updateService': function (serType, serId, serInfo) {  // 更新业务

  },
  'deleteService': function (serType, serId) {  // 删除业务

  }
});
