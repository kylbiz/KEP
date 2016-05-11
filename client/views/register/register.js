
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

Template.register_form_edit.helpers({
  collectionName: function () {
    // return KTask.initTaskStep("stepInfoCompanyRegistInfo");
    return "TempStruct";
  }
});

Template.register.onRendered(function () {

  function convToSchemaOrigin (saveObj) {
    var newObj = {};
    for (var key in saveObj) {
      var type = saveObj[key].type;
      saveObj[ key ]["type"] = {
        "String": String,
        "Object": Object,
        "Number": Number,
        "Array": Array,
        "Boolean": Boolean,
        "Date": Date
      }[type];

      newObj[ key.replace(/\-/g, ".") ] = saveObj[key];
    }

    return newObj;
  }


  Meteor.call('getSchema', 'stepInfoCompanyRegistInfo', function (err, schemaOrigin) {
    if (!err) {
      var schemaO = convToSchemaOrigin(schemaOrigin);
      var schemaObj = new SimpleSchema(schemaO);
      TempStruct.attachSchema( schemaObj );
    }
  });
});
