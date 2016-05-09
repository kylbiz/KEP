Template.application_form_edit.events({
  'click .goldweapon-btn'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    $('#goldweapon').css({"display":"block"});
  },
  'click #close_goldweapon'(event){
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    $('#goldweapon').css({"display":"none"});
  },
});

Template.checkname_content.helpers({
  _dynamic: function () {
    return Session.get('stepTemplate') || "application_form";
  }
});


Template.checkname.events({
  'click .task_ul li a'(event){
    log('click task', $(event.currentTarget).attr("value")  );
    Session.set('stepTemplate', $(event.currentTarget).attr("value"));
  },
  'click .applicationEdit a'(event){
    log('click task', $(event.currentTarget).attr("value")  );
    Session.set('stepTemplate', $(event.currentTarget).attr("value"));
  },
});