Template.notice.onRendered(function () {
  Session.setDefault('noticeTypeSel', 'customer');

  this.autorun(function () {
    var filter = Session.get('filterVal') || "";
    var filterOpt = {status: {$gte: 0}};
    if (filter.length > 0) {
      var status = Number(filter);
      filterOpt.status = status;
    }

    // log("getNoticeByType", Session.get('noticeTypeSel'), filterOpt);

    Meteor.subscribe('getNoticeByType', Session.get('noticeTypeSel'), filterOpt);
  });
});

Template.notice.onDestroyed(function () {
  delete Session.keys['noticeTypeSel'];
});

Template.breadcrumb_notice.helpers({
  filterStr: function () {
    var filterVal = Session.get('filterVal') || "";
    return {"0": "未读", "1": "已读"}[filterVal] || "全部";
  }
});

Template.breadcrumb_notice.events({
  'click .chaNoticeType': function (event) {
    var noticeType = $(event.currentTarget).attr('value');
    Session.set('noticeTypeSel', noticeType);
  },
  'click .NoticeFilter':function (event) {
    var filterVal = $(event.currentTarget).attr('value') || "";
    Session.set('filterVal', filterVal);
  }
});


Template.notice_list.helpers({
  noticeList: function () {
    return NoticeInfo.find({}, {sort: {createdAt: -1}}).fetch() || [];
  }
});


// 单条通知记录
Template.notice_list_content.helpers({
  haveRead: function (status) {
    return status ? "disabled" : "";
  },
  goToNoticeDetail: function (noticeId) {
    return FlowRouter.path('noticeDetail', {noticeId: noticeId});
  }
});


Template.notice_list_content.events({
  'click .deleNotice': function (event) {
    var noticeId = $(event.currentTarget).attr('value');
    Meteor.call('delNotice', noticeId, function (err, ret) {
      if (err) {
        log('delNotice fail', err);
        alert("删除通知失败！");
      }
    });
  },
  'click .markRead': function (event) {
    var noticeId = $(event.currentTarget).attr('value');
    Meteor.call('markReadNotice', noticeId, function (err, ret) {
      if (err) {
        log('delNotice fail', err);
        alert("标记通知已读失败！");
      }
    });
  }
});



Template.notice_delete.onRendered(function () {
  $('#notice_delete').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var modal = $(this);
    var noticeId = button.data("noticeid");
    modal.find("#deleteNoticeBtn").data("noticeid", noticeId);
  });

  $("#deleteNoticeBtn").click(function() {
    var noticeId = $("#deleteNoticeBtn").data("noticeid");
    Meteor.call('delNotice', noticeId);
    $('#notice_delete').modal("hide");
  });
});

