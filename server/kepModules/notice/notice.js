/*
 * 通知系统
 * 包括： 客户管理通知，系统通知
 **/

NoticeSys = {};

// 添加状态
NoticeSys.addNotice = function (msg) {
  check(msg, {
    from: Match.Maybe(String),
    to: String,
    type: String,
    title: String,
    content: String,
  });

  var msgInsert = {
    from: msg.from || '',
    to: msg.to,
    type: msg.type,  // system - 系统通知 / customer - 客户管理通知
    status: 0, // 1 - 已读，0 - 未读，-1 - 删除
    title: msg.title,
    createdAt: new Date(),
    frontImages: msg.frontImages || [],
    content: msg.content,
  }

  log("NoticeInfo.insert", msgInsert);
  NoticeInfo.insert(msgInsert);
}


// 根据noticeType获取notice
NoticeSys.getNoticeByType = function (userId, noticeType, filterOpt) {
  check(userId, String);
  check(noticeType, String);
  filterOpt = filterOpt || {}
  var findOpt = _.extend( {to: userId, type: noticeType, status: {$gte: 0} }, filterOpt);

  return NoticeInfo.find(findOpt, {sort: {createdAt: -1}});
}

//
NoticeSys.getNotice = function (userId, noticeId, filterOpt) {
  check(userId, String);
  check(noticeId, String);

  return NoticeInfo.find({ _id: noticeId, to: userId, status: {$gte: 0} }, filterOpt || {});
}



// 更新notice的状态
NoticeSys.updateStatus = function (userId, noticeId, status) {
  check(userId, String);
  check(noticeId, String);
  check(status, Match.OneOf(0, -1, 1));

  KUtil.dataIsInColl([
    {coll: Meteor.users, dataId: userId},
    {coll: NoticeInfo, dataId: noticeId}
  ]);

  return NoticeInfo.update({_id: noticeId, to: userId}, {$set: {status: status}});
}


// 获取当前处于未读取状态的notice数目
NoticeSys.getUnreadNoticeCount = function (userId) {
  check(userId, String);
  return NoticeInfo.find({to: userId, status: 0}).count();
}


NoticeSys.getUnReadNotice = function (userId, filterOpt) {
  check(userId, String);
  return NoticeInfo.find({to: userId, status: 0}, filterOpt);
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
  var content = '您好！您的客户: ' + customerName + '（公司名:' + companyName + '）的' +  taskLabel + '状态更新到' + status;

  log('NoticeSys.addNotice', userId, title, content);
  NoticeSys.addNotice({
    from: '',
    to: userId,
    type: 'customer', // 客户管理
    title: title,
    content: content,
  });
}
