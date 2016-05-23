if (typeof UI !== 'undefined') {

  // 当前步骤的状态
  UI.registerHelper('stepStatusShow', function(stepInfo) {
    stepInfo = stepInfo || {};
    var stepStatus  = 'noStart';  // 未开始
    if (stepInfo.finished) {
      stepStatus = 'finished';  // 完成
    } else if (stepInfo.expectTime) {
      if ( (stepInfo.updateTime - stepInfo.startTime) >= stepInfo.expectTime ) {
        stepStatus = 'overtime'  // 超时
      }
    }

    return {
        'noStart': 'circle-gray',
        'finished': 'circle-green',
        'overtime': 'circle-red'
    }[stepStatus] || '';
  });

  // 当前步骤的耗时
  UI.registerHelper('stepTimeUsed', function (stepInfo) {
    if (!stepInfo.startTime) {
      return '';
    } else {
      return KEPUtil.intervalDays(stepInfo.startTime, stepInfo.updateTime) + '天';
    }
  });

  // 当前子任务的总耗时
  UI.registerHelper('totalTimeUsed', function (step) {
    if (step.updateTime && step.startTime) {
      return KEPUtil.intervalDays(step.startTime, step.updateTime) + '天';
    }
    return '--';
  });

  UI.registerHelper('goToTask', function (taskType, taskId) {
    return FlowRouter.path('task', {taskType: taskType, taskId: taskId});
  });

}
