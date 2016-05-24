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
  if ($('.table1').height()<347) {
      var ChildLength = $('.table1').height()-110;
      console.log(ChildLength);
      $('.serviceInfoTable_Button').height(ChildLength);
  }
  else{
      $('.serviceInfoTable_Button').height(260);
  }

  var serviceId = this.data.serviceId || "";
  this.autorun(function () {
    Meteor.subscribe("getTasksBySerId", serviceId);
  });


});


Template.serviceInfo.helpers({
  serInfo: function () {
    return Service.findOne({}) || {};
  },
  tasks: function (serviceId) {
    return Tasks.find({serviceId: serviceId}).fetch();
  }
});


// 设置业务
Template.service_setting.onRendered(function () {
  var self = this;
  $('#service_setting').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var serviceId = button.data("serviceid");
    log("service_setting", serviceId);
    Session.set('selectServiceId', serviceId);
  });

  this.autorun(function () {
    Meteor.subscribe('getHostUser', ['admin', 'manager', 'advUser']);   // 当前团队可管理业务的用户
  });
});

Template.service_setting.helpers({
  serviceDoc: function () {
    var serId = Session.get('selectServiceId') || "";
    return Service.findOne({_id: serId}) || {};
  }
});

// 删除业务
Template.service_delete.onRendered(function () {
  $('#service_delete').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var modal = $(this);

    var serviceId = button.data("serviceid");
    var serviceName = button.data("servicename");
    log("service_delete", serviceId, serviceName);

    modal.find("#deleteServiceBtn").data("serviceid", serviceId);
    modal.find("#deleteServiceMsg").html("确定删除 - " + serviceName + " 该业务?");
  });

  $("#deleteServiceBtn").click(function() {
    var serviceId = $("#deleteServiceBtn").data("serviceid");
    log("deleteService", serviceId);
    Meteor.call("deleteService", serviceId);
    $('#service_delete').modal("hide");
  });
});




// 添加业务
Template.service_accept.helpers({
  serviceDoc: function () {
    return {
      customerId: FlowRouter.getParam('customerId')
    }
  }
});
