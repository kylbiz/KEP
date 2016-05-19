/*
 * 受理的业务相关的处理
 **/


// check(taskInfo, {
//   name: Match.OneOf('companyCheckName', 'CompanyRegistInfo'),
//   hostId: String,
//   serviceId: String,
//   email: Match.Maybe([{
//     to: String,
//     template: String,
//     data: Match.Maybe(Object),
//     other: Match.Maybe(String),
//   }]),
//   sms: Match.Maybe([{
//     to: String,
//     template: String,
//     data: Match.Maybe(Object),
//     other: Match.Maybe(String),
//   }]),
//   taskStepId: String
// });


Meteor.methods({
  'initService': function (serType, hostId, customerId, payed) {
      // 创建业务
      var serviceId = Meteor.call('createService', serType, hostId, customerId, payed);

      // 创建业务相关的task
      var tasks = initTaskForService(serType, {
        hostId: hostId,
        serviceId: serviceId
      });
      log("initTaskForService", tasks);

      // 更新业务的子任务
      Meteor.call('updateServiceTasks', serviceId, {
        opt: 'add',
        tasks: tasks
      });

      return serviceId;
  },
  'createService': function (serType, hostId, customerId, payed) {  // 为客户创建新的业务
      // 登录
      var userId = KUtil.isLogin();

      // 账号权限
      // 创建新的业务需要两个权限 1.修改客户受理业务的权限，2. 创建业务的权限
      KUtil.havePermission(userId, 'customer.update', customerId);
      KUtil.havePermission(userId, 'service.create');

      // 创建业务
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

      // 更新客户中的服务项目
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
  'updateServiceTasks': function (serId, tasksInfo) { // 更新业务的子任务信息
    // 登录
      var userId = KUtil.isLogin();
      // 账号权限
      KUtil.havePermission(userId, 'service.update', serId);

      return KService.updateServiceTasks(serId, tasksInfo);
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


// 根据具体业务初始化不同的task
function initTaskForService(serType, taskInfo) {
  //一项业务需要的步骤
  var supportInfo = SupportInfo.findOne({type: 'task', service: serType});
  if (!supportInfo) {
    throw new Meteor.Error("查找的信息不存在");
  }
  var taskList = supportInfo.items || [];

  // 获取step的具体信息
  var hostInfo = Meteor.users.findOne({_id: taskInfo.hostId}) || {team: {}};
  var teamId = hostInfo.team.teamId;
  if (!teamId) {
    throw new Meteor.Error("查找的信息不存在");
  }

  var tasks = [];
  taskList.forEach(function (stepInfo) {
    var taskType = stepInfo.name;

    // 任务步骤，可以是用户所在team的自定义步骤，也可以是系统默认添加的
    var taskSteps = TaskSteps.findOne({
      $or: [
        { type: taskType, teamId: teamId, createBy: 'customer' },
        { type: taskType, createBy: 'default' }
    ]}) || {};
    var taskStepId = taskSteps._id;
    if (!taskStepId) {
      throw new Meteor.Error("查找的信息不存在");
    }
    stepInfo.taskStepId = taskStepId;
    var taskId = Meteor.call('createTask', _.extend(taskInfo, stepInfo));
    tasks.push({
      type: taskType,
      id: taskId
    });
  });

  return tasks;
}
