Template.application_form.onRendered(function () {
  var dataStruct = this.data.dataStruct;
  log('Template.application_form.onRendered', dataStruct);
  this.autorun(function () {
    // 获取核名申请书的schema
    Meteor.call('getSchema', dataStruct, function (err, schemaOrigin) {
      if (!err) {
        var schemaO = KEPUtil.convToSchemaOrigin(schemaOrigin);
        var schemaObj = new SimpleSchema(schemaO);
        TempStruct.attachSchema( schemaObj );
        log('TempStruct.attachSchema');
      }
    });
  });
});

Template.application_form.helpers({
  noData: function () {
    return _.isEmpty(this.data);
  }
});


Template.application_form_edit.onRendered(function () {
  $('#drag-area').dad({
    draggable: 'button'
  });

});


Template.application_form_edit.events({
  'click .goldweapon-btn'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    $('#goldweapon').css({"display":"block","margin-right":"0px","max-width":"327px"});
    // $('.searchName').css({"max-width":"150px"});
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
