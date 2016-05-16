Template.status.events({
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
