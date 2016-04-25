process.env.MAIL_URL = "smtp://air.cui@kyl.biz:Kylbiz123@smtp.exmail.qq.com/";

EmailSend = {};

// 发送邮件的模板
EmailSend.getTemplate = function (type) {

}

EmailSend.send = function (msg) {
  Email.send(msg);
}


// test
Meteor.methods({
  'emailSend': function (key) {
    if (key == "this-is-not-a-game") {
      EmailSend.send({
        from: "air.cui@kyl.biz",
        to: "1145571693@qq.com",
        subject: "Meteor 测试邮件 -" + new Date(),
        html: "<p><strong>This will render as bold text</strong>, but this will not.</p>",
        // text: '',
      });
    }
  }
});
