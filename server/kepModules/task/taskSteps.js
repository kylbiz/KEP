/*
 * 任务具体的步骤信息
 **/
KTaskSteps = {};

KTaskSteps.getStepsDes = function (userId, taskTypeList) {
  check(userId, String);
  check(taskTypeList, [String]);

  // KUtil.dataIsInColl({coll: Meteor.users});
  var teamId = KTeam.getTeamId(userId);

  return TaskSteps.find({
    $or: [
      { type: {$in: taskTypeList}, teamId: teamId, createdBy: 'customer' },
      { type: {$in: taskTypeList}, createdBy: 'default' }
  ]}, { fields: {steps: 0} });
}
