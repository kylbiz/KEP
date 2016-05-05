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
SMSSend.companyStatusChange = function (taskId, info) {
    var taskInfo = Tasks.findOne({_id: taskId}, {fields: {host: 1, customerId: 1, serviceId: 1}});
    if (!taskInfo) {
      log("companyStatusChange fail", taskId);
      return;
    }


}
