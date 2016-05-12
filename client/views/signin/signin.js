Template.signin.helpers({
  errMsg: function () {
    return Session.get('errMsg');
  }
});



Template.signin.events({
  'click .sigininbtn': function () {
    var username = $("#userNameInput").val() || "";
    var password = $("#passwordInput").val() || "";

    if (!username || !password) {
      Session.set('errMsg', '用户账号信息不可为空');
      return;
    }

    loginFunc(username, password, Session.get('lastPath'));
  }
});




// 登录的处理函数
function loginFunc(username, password, redirectUrl) {
  Meteor.loginWithPassword(username, password, function (error, result) {
    if (error) {
      var msg = "登录失败";
      if (error.reason == "User not found") {
        msg = "用户不存在";
      }
      Session.set('errMsg', msg);
    } else {
      FlowRouter.go(redirectUrl || "/");
    }
  });
}
