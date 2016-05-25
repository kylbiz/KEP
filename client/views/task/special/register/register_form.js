Template.register_form.onRendered(function () {
  var self = this;
  self.autorun(function () {
    Session.set('schemaOrigin', false);
    var dataStruct = self.data.dataStruct;

    // 获取核名申请书的schema
    Meteor.call('getSchema', dataStruct, function (err, schemaOrigin) {
      if (!err) {
        Session.set('schemaOrigin', schemaOrigin);
      }
    });
  });
});


Template.register_form.onDestroyed(function () {
  delete Session.keys['schemaOrigin'];
  delete Session.keys['showEdit'];
  // log("register_form onDestroyed");
});


Template.register_form.helpers({
  showEdit: function () {
    return _.isEmpty(this.data) || Session.get('showEdit') || false;
  }
});


// Template.register_form_preview.events({
//   'click .dataEdit': function () {
//     Session.set('showEdit', true);
//   },
//   'click .stepFinished': function () {

//   }
// });



Template.register_form_edit.helpers({
  schemaReady: function () {
    return Session.get('schemaOrigin') || false; // 用于tempStruct的schema是否attach
  },
  schema: function () {
    var schemaOrigin = Session.get('schemaOrigin');
    var schemaO = KEPUtil.convToSchemaOrigin(schemaOrigin);
    return new SimpleSchema(schemaO);
  },
  stepInfo: function () {
    log("application_form_edit", this);
    return this.data || {};
  },
});
