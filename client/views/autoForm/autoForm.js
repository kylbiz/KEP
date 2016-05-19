
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
  }
});
