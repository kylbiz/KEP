/*
 * taskId stepName schema
 **/

Template.stepCommonTempalte.onRendered(function () {
  var self = this;
  this.autorun(function () {
    Session.set('schemaOrigin', null);
    var dataStruct = Session.get('CommonTemplateDataStruct');
    // 获取核名申请书的schema
    Meteor.call('getSchema', dataStruct, function (err, schemaOrigin) {
      if (!err) {
        Session.set('schemaOrigin', schemaOrigin);
      }
    });
  });
});

Template.stepCommonTempalte.onDestroyed(function () {
  delete Session.keys['schemaOrigin'];
  // log("stepCommonTempalte onDestroyed");
});


Template.stepCommonTempalte.helpers({
  schemaReady: function () {
    return Session.get('schemaOrigin');
  },
  schema: function () {
    // log('schemaOrigin');
    var schemaOrigin = Session.get('schemaOrigin');
    var schemaO = KEPUtil.convToSchemaOrigin(schemaOrigin);
    var schemaObj = new SimpleSchema(schemaO);
    return schemaObj;
  }
  // stepInfo: function () {
  //   return {};
  // }
});



