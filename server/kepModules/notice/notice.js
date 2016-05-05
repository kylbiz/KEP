/*
 * 通知系统
 * 包括： 客户管理通知，系统通知
 **/

NoticeSys = {}

// 添加状态
NoticeSys.addNotice = function (msg) {
  var msg = {
    from: msg.from || '',
    to: msg.to,
    type: msg.type,  // system - 系统通知 / customer - 客户管理通知
    status: 0, // 1 - 已读，0 - 未读，-1 - 删除
    title: msg.title,
    createdAt: new Date(),
    frontImages: msg.frontImages || [],
    content: msg.content,
  }

  NoticeInfo.insert(msg);
}

// 更新notice的状态
NoticeSys.updateStatus = function (noticeId, status) {

}

// 推送公司状态更新的通知
NoticeSys.companyStatusChange = function (taskId, statusInfo) {
  var taskInfo = Tasks.findOne({_id: taskId}, {fields: {host: 1, customerId: 1, serviceId: 1}});
  if (!taskInfo) {
    log("companyStatusChange fail", taskId);
    return;
  }

  var userName = taskInfo.host.name;
  var userId = taskInfo.host.id;
  var customerId = taskInfo.customerId;

  var customerName = Customers.findOne({_id: customerId}).name;
  var taskLabel = {
    'checkName': '核名',
    'regist': '工商登记'
  }[statusInfo.type];
  var companyName = statusInfo.companyName;
  var status = statusInfo.status;

  var title = customerName + '的' + taskLabel + '的状态更新到' + status;
  var content = userName + ', 您好！您的客户:' + customerName + '（公司名:' + companyName + '）的' +  taskLabel + '状态更新到' + status;

  NoticeSys.addNotice({
    from: '',
    to: userId,
    type: 'customer', // 客户管理
    title: title,
    content: content,
  });
}
