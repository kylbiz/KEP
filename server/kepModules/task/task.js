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

  var steps = taskStepInfo.steps || [];
  steps[0].startTime = timeNow;  // 初始化任务的第一步
  steps[0].updateTime = timeNow;  // 初始化任务的第一步
  log('KTask.createTask steps', steps);

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
    teamId: hostInfo.team.teamId,   // 所属团队的信息
    createdAt: timeNow,
    startTime: timeNow,
    updateTime: timeNow,
    status: 0,    // "0 - 处理中, 1 - 已完成， -1 - 废弃"
    remind: remind,   // 通知
    taskStepId: taskStepInfo._id,  // 实际使用的taskstep数据结构
    steps: steps,
    progressChange: []
  });
}


/*
 * 更新任务信息
 */
KTask.updateTaskBasic = function (taskId, taskInfo) {
  // log('KTask.updateTaskBasic', taskId, taskInfo);

  check(taskId, String);
  check(taskInfo, {
    hostId: String,
    email: Match.Maybe([
      {
        to: String,
        other: Match.Maybe(String),
      }
    ]),
    sms: Match.Maybe([
      {
        to: String,
        other: Match.Maybe(String),
      }
    ])
  });

  KUtil.dataIsInColl({coll: Tasks, dataId: taskId});

  return Tasks.update({_id: taskId}, {$set: {
    'host.id': taskInfo.hostId,
    'remind.email': taskInfo.email || [],
    'remind.sms': taskInfo.sms || [],
  }});
}


/*
 * 通过autoform更新任务步骤中数据
 **/
KTask.updateTaskStepData = function (taskId, stepName, stepData) {
  check(taskId, String);
  check(stepName, String);

  var taskInfo = KUtil.dataIsInColl({coll: Tasks, dataId: taskId});
  log('KTask.updateTaskStepData', taskId, stepName, stepData || {});

  var timeNow = new Date();
  return Tasks.update({"_id": taskId, "steps.name": stepName}, {
    $set: {
      // "steps.$.startTime": timeNow, // 开始时间设计上有问题
      "steps.$.updateTime": timeNow,
      "steps.$.data": stepData || {},
      "updateTime": timeNow
    }
  });
}


/*
 * 确定某一步已完成
 */
KTask.sureStepFinish = function (taskId, stepName) {
  check(taskId, String);
  check(stepName, String);
  var taskInfo = KUtil.dataIsInColl({coll: Tasks, dataId: taskId});
  log('sureStepFinish', taskId, stepName);

  var timeNow = new Date();

  // 更新状态
  var ret = Tasks.update({_id: taskId, "steps.name": stepName}, {
    $set: {
      "steps.$.updateTime": timeNow,
      "steps.$.finished": true,
      "updateTime": timeNow
    }
  });

  // hook
  var stepInfo = KUtil.getStepInfoByStepName(taskInfo.steps, stepName) || {};
  var hooks = stepInfo.hooks || [];
  hooks.forEach(function (hookFunc) {
    log("hook func", hookFunc, taskId);
    if ( KStepHooks[hookFunc] ) {
      KStepHooks[hookFunc](taskId);
    }
  });


  // 更新下一步startTime
  var nextStepName = findNextStep(taskInfo.steps, stepName);
  if (nextStepName) {
    Tasks.update({_id: taskId, "steps.name": nextStepName}, {
      $set: {
        "steps.$.startTime": timeNow,
      }
    });
  }

  return ret;
}

// 获取下一步的step name
function findNextStep (steps, stepName) {
  for (var key in steps) {
    if (steps[key].name == stepName) {
      return (steps[key + 1] || {}).name || "";
    }
  }
  return null;
}



/*
 * 更新任务进度
 **/
KTask.updateProgress = function (taskId, progressInfo) {
  check(taskId, String);
  check(progressInfo, {
    returnTo: String,
    by: String,
    reason: String,
    remark: String,
    reset: Boolean
  });

  log('updateProgress', taskId, progressInfo);

  var taskInfo = KUtil.dataIsInColl({coll: Tasks, dataId: taskId});

  // 更新progress信息
  var nowStep = getNowStep(taskId);
  if (!nowStep) {
    throw new Meteor.Error('当前无进度可退');
  }
  progressInfo.from = nowStep;
  progressInfo.time = new Date();

  // log('progressInfo', progressInfo);
  Tasks.update({_id: taskId}, { $push: {progressChange: progressInfo} });

  // 更新steps信息
  var taskUpdate = updateProgressInfo(taskId, taskInfo.steps, progressInfo.returnTo, progressInfo.reset);
  if (!taskUpdate) {
    throw new Meteor.Error('内部数据处理错误');
  }

  return taskUpdate;
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
 * 获取任务的信息
 **/
KTask.getTasks = function (userId) {
  check(userId, String);
  KUtil.dataIsInColl({coll: Meteor.users, dataId: userId});
  var teamId = KTeam.getTeamId(userId);

  var level = KTeam.getPermissionLevel(userId, 'tasks.views');
  // log("KTask.getTasks level", level);
  if (!level) {
    return [];
  } else if (level >= 1) {
    // log("KTask.getTasks data", Tasks.find({teamId: teamId, status: {$gte: 0}}).fetch());
    return Tasks.find({teamId: teamId, status: {$gte: 0}});
  } else if (level == 1){
    // log("KTask.getTasks data", Tasks.find({'host.id': userId, status:{$gte: 0}}).fetch());
    return Tasks.find({'host.id': userId, status:{$gte: 0}});
  }

  return [];
}


/*
 * 获取某一团队下的所有子任务
 **/
KTask.getTasksByTeamId = function (teamId) {
  // teamId -- customer -- service -- task
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
 * 根据业务Id获取
 **/
KTask.getTasksBySerId = function (serviceId) {
  check(serviceId, String);

  return Tasks.find({serviceId: serviceId});
}


/*
 * 通过taskId获取某一task的信息
 **/
KTask.getTaskInfo = function (taskId) {
  check(taskId, String);

  return Tasks.find({_id: taskId});
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


////////////////////////////////////////////////////////////
// 一些辅助函数
////////////////////////////////////////////////////////////
function getNowStep (taskId) {
  var taskInfo = Tasks.findOne({_id: taskId}) || {};
  var steps = taskInfo.steps || [];

  var nowStep = '';
  for (var key in steps) {
    var stepInfo = steps[key];
    if (stepInfo.finished) {
      nowStep = stepInfo.name;
    }
  }

  return nowStep;
}


// 因进度调整而回退steps信息
function updateProgressInfo(taskId, steps, returnTo, reset) {
  var needBack = false;
  var timeNow = new Date();
  for (var key in steps) {
    var stepInfo = steps[key];
    if (stepInfo.name == returnTo) {
      needBack = true;
    }

    if (needBack) {
      steps[key].finished = false;
      steps[key].startTime = "";
      steps[key].updateTime = "";
      if (reset) {
        steps[key].data = {};
      }
    }
  }

    // log('updateProgressInfo', taskId, steps);

  return Tasks.update({_id: taskId}, {$set: {steps: steps, updateTime: timeNow}});
}
