
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
  'insertCompanyInfo': {
    endSubmit: function () {
      var taskId = FlowRouter.getParam('taskId');
      var stepName = Session.get('stepName');
      log('insertCompanyInfo endSubmit', taskId, stepName, this.insertDoc);

      if (this.insertDoc) {
        Meteor.call('updateTaskStepData', taskId, stepName, this.insertDoc, function (error, result) {
          if (error) {
            log("insertCompanyInfo error", error);
            alert("更新数据失败！" + error);
          } else {
            log("更新数据成功! ");
          }
        });
      }

      $("#insertCompanyInfo [type=submit]").removeAttr("disabled");
      Session.set('showEdit', false);
    }
  },
  'insertRegisterInfo': {
    endSubmit: function () {
      var taskId = FlowRouter.getParam('taskId');
      var stepName = Session.get('stepName');
      log('insertRegisterInfo endSubmit', taskId, stepName, this.insertDoc);

      if (this.insertDoc) {
        Meteor.call('updateTaskStepData', taskId, stepName, this.insertDoc, function (error, result) {
          if (error) {
            log("insertRegisterInfo error", error);
            alert("更新数据失败！" + error);
          } else {
            log("更新数据成功! ");
          }
        });
      }

      $("#insertRegisterInfo [type=submit]").removeAttr("disabled");
      Session.set('showEdit', false);
    }
  },
  'insertCommonStepInfo': {
    endSubmit: function () {
      var taskId = FlowRouter.getParam('taskId');
      var stepName = Session.get('stepName');
      log('insertCommonStepInfo endSubmit', taskId, stepName, this.insertDoc);

      if (this.insertDoc) {
        Meteor.call('updateTaskStepCommonData', taskId, stepName, this.insertDoc, function (error, result) {
          if (error) {
            log("insertCompanyInfo error", error);
            alert("更新数据失败！" + error);
          } else {
            log("更新数据成功! ");
          }
          $("#insertCommonStepInfo [type=submit]").removeAttr("disabled");
        });
      }
    }
  }
});
