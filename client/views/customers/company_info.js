Template.company_info_form.onRendered(function () {
  this.autorun(function () {
    Meteor.subscribe("getCompanyInfoByCustomer", FlowRouter.getParam('customerId'));
  });
});


Template.company_info_form.helpers({
  companyDoc: function () {
    var customerId = FlowRouter.getParam('customerId');
    log("companyDoc", CompanyInfo.findOne({customerId: customerId}));
    return CompanyInfo.findOne({customerId: customerId}) || {};
  }
});
