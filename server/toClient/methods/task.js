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
  'updateTask': function () {
    // args 正确性
    // 账号权限
    // 更新
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
