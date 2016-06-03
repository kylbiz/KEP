/*
 * 子任务管理项目的接口
 **/

Meteor.methods({
  'createTask': function (taskInfo) {
    var userId = KUtil.isLogin();
    // 账号权限
    KUtil.havePermission(userId, 'task.create');

    // 创建
    return KTask.createTask(taskInfo);
  },
  'updateTaskBasic': function (taskId, taskInfo) {
    // args 正确性
    var userId = KUtil.isLogin();
    // 账号权限
    KUtil.havePermission(userId, 'task.update', taskId);
    // 更新
    return KTask.updateTaskBasic(taskId, taskInfo);
  },
  'updateTaskStepData': function (taskId, stepName, stepData) {
    // args 正确性
    var userId = KUtil.isLogin();
    // 账号权限
    KUtil.havePermission(userId, 'task.update', taskId);
    // 更新
    return KTask.updateTaskStepData(taskId, stepName, stepData);
  },
  'updateTaskStepRemark': function (taskId, stepName, stepRemark) {
    // args 正确性
    var userId = KUtil.isLogin();
    // 账号权限
    KUtil.havePermission(userId, 'task.update', taskId);
    // 更新
    return KTask.updateTaskStepRemark(taskId, stepName, stepRemark);
  },
  'sureStepFinish': function (taskId, stepName) {
    // args 正确性
    var userId = KUtil.isLogin();
    // 账号权限
    KUtil.havePermission(userId, 'task.update', taskId);
    // 更新
    return KTask.sureStepFinish(taskId, stepName);
  },
  'updateTaskStepCommonData': function (taskId, stepName, stepData) {
    // args 正确性
    var userId = KUtil.isLogin();
    // 账号权限
    KUtil.havePermission(userId, 'task.update', taskId);
    KTask.updateTaskStepData(taskId, stepName, stepData);
    return KTask.sureStepFinish(taskId, stepName);
  },
  'updateProgress': function (taskId, progressInfo) {
    // 进度控制
    var userId = KUtil.isLogin();
    // 账号权限
    KUtil.havePermission(userId, 'task.update');

    return KTask.updateProgress(taskId, progressInfo);
  },
  'deleteTask': function () {
    // args 正确性
    // 账号权限
    // 删除
  },
  'getSchema': function (schemaId) {  //获取子步骤的schema
    return SchemaHandle.getSchema(schemaId);
  }
});
