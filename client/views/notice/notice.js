Template.notice.helpers({
  _dynamic: function () {
    return Session.get('stepTemplate') || "notice_customer";
  }
});

Template.notice.events({
  'click .notice_change_btn button a'(event){
  	event.preventDefault();
    log('click task', $(event.currentTarget).attr("value")  );
    Session.set('stepTemplate', $(event.currentTarget).attr("value"));
  },
  'click .notice_row'(event){
  	event.preventDefault();
    log('click task', $(event.currentTarget).attr("value")  );
    Session.set('stepTemplate', $(event.currentTarget).attr("value"));
  }
});