Template.testCustomers.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('getCustomers');
    // self.subscribe('getService', Customers.findOne({}));
  });

  // Test.optService(this);
});


Template.testCustomers.helpers({
  data: function() {
    log('customer', Customers.find({}).fetch() );
    // log('service', Service.find({}).fetch());

    var userInfo = Customers.findOne({}) || {};
    Session.set('customerId', userInfo._id || null);
    return Customers.find({}).count();
  },
  docInfo: function () {
    return {name: 'cc', _id: 'hello'};
  }
});

Template.testCustomers.events({
  'click p': function () {
    var customerId = Session.get('customerId');
    if (customerId) {
      Meteor.call('deleteCustomer', function(err, ret) {
log('deleteCustomer', err, ret);
      })
    }
  }
});

AutoForm.hooks({
  test_insert: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      log("test_insert onSubmit", insertDoc, updateDoc, currentDoc);
      // Meteor.call('testhandle');
      return false;
    },
    onSuccess: function(formType, result) {
      log("onSuccess");
    },
    onError: function (formType, result) {
      log("onError", formType, result);
    },
    beginSubmit: function () {
      log('beginSubmit', this);
    }
  }
});

