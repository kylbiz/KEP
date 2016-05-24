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
Template.customers_add.events({
  'click #addCustomerBtn': function () {
    var name = $("#customerName").val() || "";
    var hostId = $("#hostId").val() || "";
    var fromInfo = $("#customerFrom").val() || "";
    var containerName = $("#containerName").val() || "";
    var containerPhone = $("#containerPhone").val() || "";
    var containerEmail = $("#containerEmail").val() || "";
    var containerAddress = $("#containerAddress").val() || "";
    var remarkInfo = $("#remark").val() || "";

    var service = [];
    var serviceSelect = $(".serviceSelect");
    $.each(serviceSelect, function (key, value) {
      var obj = $(value);
      if (obj.prop('checked')) {
        service.push( {serType: obj.val(), payed: false} );
      }
    });

    if (!name) {
      alert("客户名称必须填写");
    }``
    if (!containerName) {
      alert("客户联系人姓名必须填写");
    }
    if (!containerPhone) {
      alert("客户联系人电话必须填写");
    }

    var basicInfo = {
      name: name,
      hostId: hostId,
      from: fromInfo,
      createdBy: Meteor.userId(),
      remark: remarkInfo,
      contactInfo: {
        name: containerName,
        address: containerAddress,
        phone: containerPhone,
        email: containerEmail
      }
    };

    log(basicInfo);

    Meteor.call('initCustomer', basicInfo, service, function (error, result) {
      if (error) {
        alert("创建新客户失败! " + error);
      } else {
        $("#customers_add").modal('hide');
      }
    });
  }
});


Template.customers_add_autoform.onRendered(function () {
  this.autorun(function () {
    Meteor.subscribe('getSupportInfo', {type: 'service'});  // 系统可提供的服务
    Meteor.subscribe('getHostUser', ['admin', 'manager', 'advUser']);   // 当前团队可管理客户的用户
  });
});


Template.customers_add_autoform.helpers({
  hosts: function () {
    return Meteor.users.find({}).fetch() || [];
  },
  serviceInfo: function () {
    var service = SupportInfo.findOne({}) || {};
    return service.items || [];
  }
});



// 删除客户
Template.customers_delete.onRendered(function () {
  $('#customers_delete').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var modal = $(this);

    var customerId = button.data("customerid");
    var customerName = button.data("customername");

    modal.find("#deleteCustomerBtn").data("customerid", customerId);
    modal.find("#deleteCustomerBtn").data("customername", customerName);
    modal.find("#deleteMsg").html("确定删除 - " + customerName + "?");
  });

  $("#deleteCustomerBtn").click(function() {
    var customerId = $("#deleteCustomerBtn").data("customerid");
    log("deleteCustomer", customerId);
    Meteor.call("deleteCustomer", customerId);
    $('#customers_delete').modal("hide");
  });
});


//客户基本信息

