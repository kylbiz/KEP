Template.customers_register.onRendered(function () {
  var self = this;
  self.autorun(function() {
    self.subscribe('getCustomers');
  });
});



Template.customers_register.helpers({
  customers: function () {
    return Customers.find({}).fetch();
  }
});



Template.customerTableCell.helpers({
  managePath: function () {
    var path = FlowRouter.path("customerInfo", {customerId: this._id});
    return path || "/";
  },
  companyInfoPath: function () {
    var path = FlowRouter.path("companyInfo", {customerId: this._id});
    return path || "/";
  }
});


// 创建客户
Template.customers_add.onRendered(function () {

});


