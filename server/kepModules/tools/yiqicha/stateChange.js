/*
 * 订阅用户状态更新的操作
 **/

Meteor.methods({
  'companyStatusChange': function (info) {
    // 这个需要权限判断 - 不然很危险
    log('companyStatusChange', info);

    // 更改子任务状态
    updateTaskInfo(info);

    // 推送状态更新
    pushNotice(info);
  }
});


// 推送消息
function pushNotice(info) {
  log("pushNotice", info);

  // 系统的客户管理通知
  NoticeSys.companyStatusChange(info.other.taskId, info);

  // 短信通知
  SMSSend.companyStatusChange(info.other.taskId, info);

  // 邮箱通知
  EmailSend.companyStatusChange(info.other.taskId, info);
}


// 更新任务信息
function updateTaskInfo(info) {
  // var taskType = info.taskType;

  // if (taskType == 'companyCheckName') {

  // } else if (taskType == 'companyRegistInfo') {

  // }
}
