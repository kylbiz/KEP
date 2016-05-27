// delNotice

/*
 * 系统通知相关的接口
 **/
Meteor.methods({
  delNotice: function (noticeId) {
    var userId = KUtil.isLogin();
    checkNoticePermission(userId, noticeId);

    return NoticeSys.updateStatus(userId, noticeId, -1);
  },
  markReadNotice: function (noticeId) {
    var userId = KUtil.isLogin();
    log("markReadNotice", userId, noticeId, NoticeInfo.findOne({_id: noticeId}) );
    checkNoticePermission(userId, noticeId);
    return NoticeSys.updateStatus(userId, noticeId, 1);
  }
});


function checkNoticePermission (userId, noticeId) {
    if (!NoticeInfo.findOne({_id: noticeId, to: userId})) {
      throw new Meteor.Error('当前账号无权限');
    }
}
