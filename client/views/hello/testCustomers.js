Template.testCustomers.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('getCustomers');
  });
});


Template.testCustomers.helpers({
  customer: function() {
log('customer', Customers.find({}).fetch() );
    var userInfo = Customers.findOne({}) || {};
    Session.set('customerId', userInfo._id || null);
    return Customers.find({}).count();
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
