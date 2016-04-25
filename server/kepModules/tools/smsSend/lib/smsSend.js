SMSSend = {};

// 短信发送默认需要的参数
SMSSend.getParams = function () {
  var config = {
    appId: '8a48b5514a9e4570014a9f1ac45b0115',
    accountSid: '8a48b5514a9e4570014a9f056aa300ec',
    accountToken: '0fe4efa3c2c54a0eb91dbac340aa49cf',
  }

  var timestamp = moment().format('YYYYMMDDHHmmss'); //时间戳

  var auth = new Buffer( config.accountSid + ':' + timestamp ).toString('base64');

  var content = config.accountSid + config.accountToken + timestamp;
  var crypto = Npm.require('crypto');
  var md5 = crypto.createHash('md5');
  md5.update(content);
  var sig = md5.digest('hex').toUpperCase();

  var url = "https://app.cloopen.com:8883/2013-12-26/Accounts/"
      + config.accountSid
      + "/SMS/TemplateSMS?sig="
      + sig;

  return {
    appId: config.appId,
    url: url,
    sig: sig,
    auth: auth
  }
};


SMSSend.send = function (templateId, phone, message, callback) {
  // check params

  var params = SMSSend.getParams();

  HTTP.call("POST", params.url,
    {
      "data":{
        "to": phone,
        "appId": params.appId,
        "templateId": templateId,
        "datas": message,
      },
      "headers":{
        "Accept":"application/json",
        "content-type":"application/json;charset=UTF-8",
        "Authorization":params.auth}
    }, function (err, result) {
      var codeValue = {};
      if(err) {
        log('send verification code error', err);
        codeValue = {
          codestatus: 0,
          message: "发送验证码失败"
        };
      } else {
        log('send verification code succeed');
        codeValue = {
          codestatus: 1,
          message: "验证码发送成功!"
        };
      }
      if (callback) {
        callback(err, codeValue);
      }
    }
  );
};

// test
Meteor.methods({
  smsSend: function (key) {
    if (key == 'you-you-fuck-you') {

    }
  }
});
