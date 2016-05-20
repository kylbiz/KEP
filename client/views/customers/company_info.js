Template.company_info_form.onRendered(function () {
  this.autorun(function () {
    Meteor.subscribe("getCompanyInfoByCustomer", FlowRouter.getParam('customerId'));
  });
});


Template.company_info_form.helpers({
  companyDoc: function () {
    return CompanyInfo.findOne({}) || {};
  }
});
