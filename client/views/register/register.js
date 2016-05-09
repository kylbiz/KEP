
Template.register_content.helpers({
  _dynamic: function () {
    return Session.get('stepTemplate') || "register_form";
  }
});


Template.register.events({
  'click .task_ul li a'(event){
    log('click task', $(event.currentTarget).attr("value")  );
    Session.set('stepTemplate', $(event.currentTarget).attr("value"));
  },
  'click .registerEdit a'(event){
    log('click task', $(event.currentTarget).attr("value")  );
    Session.set('stepTemplate', $(event.currentTarget).attr("value"));
  },
});