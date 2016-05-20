/*
 * 子任务的管理
 **/

KTask = {};

/*
 * 创建任务
 **/
KTask.createTask = function (taskInfo) {
  // check(taskInfo, {
  //   name: Match.OneOf('companyCheckName', 'companyRegistInfo'),
  //   label: String,
  //   hostId: String,
  //   serviceId: String,
  //   taskStepId: String,
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
  // });

  var timeNow = new Date();
  // var label = {"companyCheckName": "公司核名", "companyRegistInfo": "工商登记"}[taskInfo.name];

  var retList = KUtil.dataIsInColl([
    {coll: Meteor.users, dataId: taskInfo.hostId},
    {coll: Service, dataId: taskInfo.serviceId},
    {coll: TaskSteps, dataId: taskInfo.taskStepId}
  ]);

  var hostInfo = retList[0];
  var serviceInfo = retList[1];
  var taskStepInfo = retList[2];

  var steps = [];


  var remind = {};
  if (taskInfo.email) {
    remind.email = [];
    taskInfo.email.forEach(function (info) {
      remind.email.push({
        type: 'email',
        to: info.to,
        template: info.template,
        data: info.data || {},
        other: info.other || "",
      });
    });
  }
  if (taskInfo.sms) {
    remind.sms = [];
    taskInfo.sms.forEach(function (info) {
      remind.sms.push({
        type: 'sms',
        to: info.to,
        template: info.template,
        data: info.data || {},
        other: info.other || "",
      });
    });
  }

  return Tasks.insert({
    name: taskInfo.name,
    label: taskInfo.label,
    host: {
      name: hostInfo.username,
      id: hostInfo._id
    },
    customerId: serviceInfo.customerId, // 所属客户id,
    serviceId: serviceInfo._id,  // 所属业务id, 如: 公司注册
    createdAt: timeNow,
    startTime: timeNow,
    updateTime: timeNow,
    status: 0,  // "0 - 处理中, 1 - 已完成， -1 - 废弃"
    remind: remind, // 通知
    taskStepId: taskStepInfo._id,  // 实际使用的taskstep数据结构
    steps: taskStepInfo.steps,
    progressChange: []
  });
}


/*
 * 更新任务信息
 */
KTask.updateTask = function () {

}


/*
 * 标记该任务被删除
 **/
KTask.deleteTask = function (taskId) {
  check(taskId, String);
  KUtil.dataIsInColl({coll: Tasks, dataId: taskId});

  return Tasks.update({_id: taskId}, {$set: {status: -1}});
}


/*
 * 注销某项业务下的所有子任务
 **/
KTask.delTaskBySer = function (serviceId) {
  // Tasks.find({serviceId: serviceId}, {fields: {_id: 1}}).forEach(function (task) {
  //   KTask.deleteTask(task._id);
  // });

  return  Tasks.update({serviceId: serviceId}, {$set: {status: -1}}, {multi: true});
}

/*
 * 获取某一类型任务的信息
 **/
KTask.getTasksByType = function (userId, taskType) {
  check(userId, String);
  check(taskType, String);

  return Tasks.find({name: taskType});
 }

/*
 *
 **/
KTask.getTasksBySerId = function (serviceId) {
  check(serviceId, String);

  return Tasks.find({serviceId: serviceId});
}



/*
 * 初始化子任务下的步骤
 **/
// KTask.initTaskStep = function (coll, schemaId) {
//   // var schemaObj = SchemaHandle.getSchema(schemaId);
//   var schemaObj = temp();
//   TempStruct.attachSchema(schemaObj);
//   return TempStruct;
// }

