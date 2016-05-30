Template.dropdownMenu.helpers({
  timeNow: function () {
    return moment().format("YYYY-MM-DD");
  },
  goToAccount: function () {
    return FlowRouter.path('account');
  }
});

Template.dropdownMenu.events({
  'click #a-logout': function () {
    Meteor.logout(function (err) {
      if (err) {
        alert(err);
      } else {
        FlowRouter.go("login");
      }
    });
  }
});
