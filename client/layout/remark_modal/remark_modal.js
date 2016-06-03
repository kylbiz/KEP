Template.remark_modal.onRendered(function () {
  // ("#remark_modal")
  // $('#remark_modal').on('show.bs.modal', function (event) {
  // });
});


Template.remark_modal.helpers({
  remarkInfo: function () {
    // log("remarkInfo", this);
    return this.remarkInfo || "";
  }
});


Template.remark_modal.events({
  'click #saveRemarkBtn': function () {
    var remarkInfo = $("#remarkInfoInput").val() || "";
    var taskId = FlowRouter.getParam('taskId');
    var stepName = this.name || "";

    log("saveRemarkBtn", this, taskId, stepName, remarkInfo);

    Meteor.call("updateTaskStepRemark", taskId, stepName, remarkInfo, function (error, result) {
      // log("updateTaskStepRemark", error, result);
      if (error) {
        log("updateTaskStepRemark fail");
        alert("更新备注信息失败！");
      } else {
        $('#remark_modal').modal("hide");
      }
    } );

  }
});
