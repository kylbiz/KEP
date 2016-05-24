
Template.checkname.onRendered(function () {
  var taskId = FlowRouter.getParam('taskId');
  var taskType = FlowRouter.getParam('taskType');
  this.autorun(function () {
    Meteor.subscribe('getTaskInfo', taskId);
    Meteor.subscribe('getStepsDes', [taskType]);
  });

 $('.task_ul li a').first().addClass('selected');
});

Template.checkname_content.helpers({
  templateInfo: function () {
    var taskInfo = Tasks.findOne();
    if (taskInfo) {
      if (!Session.get('stepName')) {
        var workingStep = KEPUtil.taskStepWorking(taskInfo.steps);
        Session.set('stepName', workingStep.name);
      }

      var stepName = Session.get('stepName') || "";
      var templateName = getTemplateName(stepName) || "";
      var stepInfo = getStepInfo(taskInfo.steps, stepName) || {} ;

      log('templateInfo', templateName, stepInfo);

      return {
        name: templateName,
        data: stepInfo,
      }
    }

    return {};
  },
  stepsDes: function () {
    var taskType = FlowRouter.getParam('taskType');
    return ((TaskSteps.findOne({type: taskType}) || {}).stepsDes) || [];
  }
});

Template.checkname.events({
  'click .task_ul li a'(event){
    log('click task', $(event.currentTarget).attr("value")  );
    Session.set('stepName', $(event.currentTarget).attr("value"));

    $('.task_ul li a').removeClass('selected');
    $(event.currentTarget).addClass("selected");
  },
  'click .applicationEdit'(event){
    log('click task', $(event.currentTarget).attr("value")  );
    Session.set('stepTemplate', $(event.currentTarget).attr("value"));
  },
});


// 根据步骤名称获取相应的template
function getTemplateName (stepName) {
  var specialTemplate = {'资料填写': 'application_form'}; // 这个地方的数据需要从collection中获取
  return specialTemplate[stepName] || 'stepCommonTempalte';
}


function getStepInfo (steps, stepName) {
  for (var key in steps) {
    var stepInfo = steps[key];
    if (stepInfo.name == stepName) {
      return stepInfo || {};
    }
  }
  return {};
}



