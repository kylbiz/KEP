Template.signinLayout.helpers({
  _dynamic: function () {
    return Session.get('stepTemplate') || "signin";
  }
});


Template.signinLayout.events({
  'click #findPwd'(event){
  	event.preventDefault();
    log('click findPwd', $(event.currentTarget).attr("value")  );
    Session.set('stepTemplate', $(event.currentTarget).attr("value"));
  },
});