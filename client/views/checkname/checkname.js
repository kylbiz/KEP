
Template.checkname.onRendered(function () {
  this.autorun(function () {
    Meteor.call('getSchema', 'stepInfoCompanyCheckName', function (err, schemaOrigin) {
      if (!err) {
        var schemaO = KEPUtil.convToSchemaOrigin(schemaOrigin);
        var schemaObj = new SimpleSchema(schemaO);
        TempStruct.attachSchema( schemaObj );
      }
    });
  });
});

Template.application_form_edit.onRendered(function () {
  $('#drag-area').dad({
    draggable: '#drag'
  });
});


Template.application_form_edit.events({
  'click .goldweapon-btn'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    $('#goldweapon').css({"display":"block","margin-right":"0px","max-width":"327px"});
    $('.searchName').css({"max-width":"150px"});
    // $('#goldweapon').addClass('goldweapon-show');
  },
  'click #close_goldweapon'(event){
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    $('#goldweapon').css({"max-width":"0px","margin-right":"-362px"});
    // $('#goldweapon').addClass('goldweapon-hide');
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



