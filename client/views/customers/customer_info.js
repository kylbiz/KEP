Template.customer_info.onRendered(function () {
  this.autorun(function () {
    Meteor.subscribe("getCustomer", FlowRouter.getParam('customerId'));
  });
});

// 客户基本资料
Template.customerBasicInfo.onRendered(function () {
  this.autorun(function () {
    Meteor.subscribe('getHostUser', ['admin', 'manager', 'advUser']);   // 当前团队可管理客户的用户
  });
});


Template.customerBasicInfo.helpers({
  customerInfo: function () {
    return Customers.findOne({});
  }
});



// 客户业务
Template.customerService.onRendered(function () {
  this.autorun(function () {
    Meteor.subscribe("getService", FlowRouter.getParam('customerId'));
  });
});


Template.customerService.helpers({
  service: function () {
    return Service.find({}, {fields: {_id: 1}}).fetch();
  }
});


// 业务流程
Template.serviceInfo.onRendered(function () {
  var serviceId = this.data._id || "";
  this.autorun(function () {
    Meteor.subscribe("getTasksBySerId", serviceId);
  });
});


Template.serviceInfo.helpers({
  serInfo: function () {
    // ...
  }
});


// 添加
