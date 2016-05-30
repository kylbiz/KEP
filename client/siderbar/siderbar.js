Template.sidebar.onRendered(function () {
    Meteor.subscribe("getUnReadNotice", {fields: {_id: 1, status: 1}});
});


Template.sidebar.helpers({
  unReadNotice: function () {
    return NoticeInfo.find({status: 0}).count();
  }
});
