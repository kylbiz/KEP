// AutoForm.addHooks(['updateCustomer'], {});

AutoForm.hooks({
  'insertCompanyInfoForm': {
    'beginSubmit': function () {
      var docId = this.docId;
      var insertDoc = this.insertDoc;
      var updateDoc = this.updateDoc;
      if (this.docId) {

      } else {

      }

    }
  },
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
    // onError: function (formType, error) {
    //   log("updateCustomer onError", formType, error);
    // },
    // onSubmit: function (insertDoc, updateDoc, currentDoc) {
    //   log("fuck onSubmit");
    //   // console.log('insertDoc', insertDoc);
    //   // console.log('updateDoc', updateDoc);
    //   // console.log('currentDoc', currentDoc);
    //   // var hook = this;

    //   return false;
    // },
    // onSuccess: function (formType, collection) {
    //   log("updateCustomer onSuccess");
    // }
  }
});
