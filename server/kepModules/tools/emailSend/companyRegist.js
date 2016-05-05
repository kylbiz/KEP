EmailSend.companyStatusChange = function (taskId,  statusInfo) {
    var taskInfo = Tasks.findOne({_id: taskId}, {fields: {host: 1, customerId: 1, serviceId: 1, remind: 1}});
    if (!taskInfo) {
      log("companyStatusChange fail", taskId);
      return;
    }

    var taskLabel = {
      'checkName': '核名',
      'regist': '工商登记'
    }[statusInfo.type];
    var companyName = statusInfo.companyName;
    var status = statusInfo.status;

    var emailInfoList = taskInfo.remind.email || [];

    // 这里具体描述需通过emailInfo中email的TemplateId来确定
    var subject = companyName + '的' + taskLabel + '的状态更新到' + status;
    var content = '<h2>您好:</h2><p>【KEP提醒】公司名为:<i>' + companyName + '</i>的<i>' +  taskLabel + '</i>状态更新到<i>' + status + '</i></p>';

    emailInfoList.forEach(function (emailInfo) {
      EmailSend.send({
        to: emailInfo.to,
        subject: subject,
        html: content,
      });
    });
};
