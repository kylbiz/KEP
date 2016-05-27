SMSSend.companyRegist = {}

SMSSend.companyRegist.remind = function () {
  var phones = [];
  var templateId = [];
  var message = ['param1', 'param2'];
  phones.forEach(function (phone) {
    SMSSend.send(templateId, phone, message, function (err) {
      if (err) {

      }
    });
  });
}


// 公司状态更新发送短信
SMSSend.companyStatusChange = function (taskId, statusInfo) {
    log("SMSSend.companyStatusChange", taskId, statusInfo);

    var taskInfo = Tasks.findOne({_id: taskId}, {fields: {host: 1, customerId: 1, serviceId: 1, remind: 1}});
    if (!taskInfo) {
      log("SMSSend companyStatusChange fail", taskId);
      return;
    }

    var taskLabel = {
      'checkName': '核名',
      'regist': '工商登记'
    }[statusInfo.type];
    var companyName = statusInfo.companyName;
    var status = statusInfo.status;

    smsInfoList = taskInfo.remind.sms || [];
    smsInfoList.forEach(function (smsInfo) {
      // var sms = "【KEP提醒】公司名为`开业啦（上海）网络技术有限公司`的`核名`状态更新到`审核中` "
      log("SMSSend to", smsInfo.template || '71881', smsInfo.to, [companyName, taskLabel, status]);
      SMSSend.send(smsInfo.template || '71881', smsInfo.to, [companyName, taskLabel, status]);
    });

}
