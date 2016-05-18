/*
 * 子任务的管理
 **/

KTask = {};

/*
 * 创建任务
 **/
KTask.createTask = function (taskInfo) {
  check(taskInfo, {
    name: Match.OneOf('companyCheckName', 'CompanyRegistInfo'),
    hostId: String,
    serviceId: String,
    email: Match.Maybe([{
      to: String,
      template: String,
      data: Match.Maybe(Object),
      other: Match.Maybe(String),
    }]),
    sms: Match.Maybe([{
      to: String,
      template: String,
      data: Match.Maybe(Object),
      other: Match.Maybe(String),
    }]),
    taskStepId: String
  });

  var timeNow = new Date();
  var label = {"companyCheckName": "公司核名", "CompanyRegistInfo": "工商登记"}[taskInfo.name];

  var retList = KUtil.dataIsInColl([
    {coll: Meteor.users, dataId: taskInfo.hostId},
    {coll: Service, dataId: taskInfo.serviceId},
    {coll: TaskSteps, dataId: taskInfo.taskStepId}
  ]);

  var hostInfo = retList[0];
  var serviceInfo = retList[1];
  var taskStepInfo = retList[2];

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

  Tasks.insert({
    name: taskInfo,
    label: label,
    host: {
      name: hostInfo.username,
      id: hostInfo.id
    },
    customerId: serviceInfo.customerId, // 所属客户id,
    serviceId: serviceInfo._id,  // 所属业务id, 如: 公司注册
    createdAt: timeNow,
    startTime: timeNow,
    updateTime: timeNow,
    status: 0, // "0 - 处理中, 1 - 已完成， -1 - 废弃"
    remind: remind, // 通知
    taskStepId: taskStepInfo._id, // 实际使用的taskstep数据结构
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
KTask.deleteTask = function () {

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

