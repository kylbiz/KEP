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
