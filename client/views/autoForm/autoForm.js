
AutoForm.hooks({
  // 更新客户信息
  'updateCustomer': {
    endSubmit: function () {
      Meteor.call("updateCustomerLess", this.docId, this.updateDoc, function (error, result) {
        if (error) {
          log("updateCustomerLess error", error);
          alert("更新用户信息失败！" + error);
        } else {
          alert("更新用户信息成功！");
        }
        $("#updateCustomer [type=submit]").removeAttr("disabled");
      });
    },
  },
  'insertService': {
    endSubmit: function () {
      log("insertService", this);
      var doc = this.insertDoc;
      Meteor.call('initService', doc.type, doc.host.id, this.currentDoc.customerId, doc.payed, function (error, result) {
        if (error) {
          log("updateServiceLess error", error);
          alert("添加业务失败！" + error);
        } else {
          $('#service_accept').modal("hide");
        }
        $("#service_accept [type=submit]").removeAttr("disabled");
      });
    }
  },
  'updateService': {
    endSubmit: function () {
      Meteor.call('updateServiceLess', this.docId, this.updateDoc, function (error, result) {
        if (error) {
          log("updateServiceLess error", error);
          alert("更新业务信息失败！" + error);
        } else {
          // alert("更新业务信息成功！");
          $('#service_setting').modal("hide");
        }
        $("#service_setting [type=submit]").removeAttr("disabled");
      });
    }
  },
});
