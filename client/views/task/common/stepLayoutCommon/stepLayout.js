Template.checkname.onRendered(function () {
  var taskId = FlowRouter.getParam('taskId');
  var taskType = FlowRouter.getParam('taskType');
  this.autorun(function () {
    Meteor.subscribe('getTaskInfo', taskId);
    Meteor.subscribe('getStepsDes', [taskType]);
  });

 // $('.task_ul li a').first().addClass('selected');
});


Template.checkname.onDestroyed(function () {
  delete Session.keys['stepName'];
  log('checkname onDestroyed');
});

Template.checkname_content.helpers({
  templateInfo: function () {
    var taskId = FlowRouter.getParam('taskId');
    var taskInfo = Tasks.findOne({_id: taskId});
    if (taskInfo) {
      if (!Session.get('stepName')) {
        var workingStep = KEPUtil.taskStepWorking(taskInfo.steps);
        // log('workingStep', workingStep);
        Session.set('stepName', workingStep.name);
      }

      var stepName = Session.get('stepName') || "";
      var templateName = getTemplateName(stepName) || "";
      var stepInfo = getStepInfo(taskInfo.steps, stepName) || {} ;

      if ('stepCommonTempalte' == templateName) {
        Session.set('CommonTemplateDataStruct', stepInfo.dataStruct);
      }

      log("templateInfo", templateName, stepName);

      return {
        name: templateName,
        data: stepInfo,
      };
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
    // $('.task_ul li a').removeClass('selected');
    // $(event.currentTarget).addClass("selected");
  },
  'click .dataEdit': function (event) {
    Session.set('showEdit', true);
  },
  'click .stepFinished': function () {
    var taskId = FlowRouter.getParam('taskId');
    var stepName = Session.get('stepName');
    Meteor.call('sureStepFinish', taskId, stepName, function (err, ret) {
      if (err) {
        log('sureStepFinish', err);
        alert("操作失败");
      } else {
        alert("操作成功");

        // 更新stepName
        setWorkingStep();
      }
    });
  }
});


Template.checkname_content_ul.helpers({
  isSelect: function (stepName) {
    return (Session.get('stepName') == stepName);
  }
});


// 根据步骤名称获取相应的template
function getTemplateName (stepName) {
  var taskType = FlowRouter.getParam('taskType');
  var specialTemplate = {    // 这个地方的数据需要从collection中获取
    'companyCheckName': {'资料填写': 'application_form'},
    'companyRegistInfo': {'资料填写': 'register_form'}
  };
  return (specialTemplate[taskType] || {})[stepName] || 'stepCommonTempalte';
}


// 根据stepName获得其对应的info
function getStepInfo (steps, stepName) {
  for (var key in steps) {
    var stepInfo = steps[key];
    if (stepInfo.name == stepName) {
      return stepInfo || {};
    }
  }
  return {};
}


// 获取最新的workingstep并设置到stepName
function setWorkingStep() {
  var taskId = FlowRouter.getParam('taskId');
  var taskInfo = Tasks.findOne({_id: taskId}) || {};
  var workingStep = KEPUtil.taskStepWorking(taskInfo.steps || []);
  Session.set('stepName', workingStep.name);
}



