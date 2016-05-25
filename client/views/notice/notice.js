Template.notice.helpers({
  _dynamic: function () {
    return Session.get('noticeTemplate') || "notice_customer";
  }
});

Template.notice.events({
  'click .notice_change_btn button'(event){
  	event.preventDefault();
    log('click task', $(event.currentTarget).attr("value")  );
    Session.set('noticeTemplate', $(event.currentTarget).attr("value"));
  },
  'click .notice_row'(event){
  	event.preventDefault();
    log('click task', $(event.currentTarget).attr("value")  );
    Session.set('noticeTemplate', $(event.currentTarget).attr("value"));
  }
});