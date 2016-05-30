Template.notice_content.onRendered(function () {
  var noticeId = FlowRouter.getParam('noticeId');
  Session.set('noticeIdNow', noticeId);

  this.autorun(function () {
    Meteor.subscribe('getNotice', noticeId);
  });
});


Template.notice_content.onDestroyed(function () {
  // 标记notice已读
  var noticeId = Session.get('noticeIdNow');
  Meteor.call('markReadNotice', noticeId);

  delete Session.keys['noticeIdNow'];

});


Template.notice_detail.helpers({
  noticeInfo: function () {
    var noticeId = FlowRouter.getParam('noticeId');
    return NoticeInfo.findOne({_id: noticeId}) || {};
  }
});


Template.notice_content.events({

});
