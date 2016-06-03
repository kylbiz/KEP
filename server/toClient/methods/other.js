Meteor.methods({
  'getPageCount': function (collType, dataFilter) {

    log("getPageCount", collType, dataFilter);

    check( collType, Match.OneOf(null, undefined, 'Tasks', 'Customers') );

    var userId = this.userId;

    var handleMap = {
      'Tasks': function () {
        dataFilter = dataFilter || {name: ''};
        log("getPageCount", userId, dataFilter);
        return KTask.getTasksCount(userId, dataFilter);
      },
      'Customers': function () {
        return KCustomer.getCustomersCount(userId, dataFilter || {});
      }
    };
    if (handleMap[collType]) {
      return handleMap[collType]() || 0;
    }

    return 0;
  }
});
