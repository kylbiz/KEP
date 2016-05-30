Template.sidebar.onRendered(function () {
  Session.setDefault("unReadNotice", 0);
    Meteor.subscribe("getUnReadNotice", {fields: {_id: 1}});
});


Template.sidebar.onDestroyed(function () {
  delete Session.keys['unReadNotice'];
});


Template.sidebar.helpers({
  unReadNotice: function () {
    return NoticeInfo.find({status: 0}).count();
  }
});
