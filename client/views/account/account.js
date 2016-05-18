Template.account.events({
  'click #changeProfile': function () {
    var username = $('#username').val();
    var qq = $('#qq').val();
    var phone = $('#phone').val();
    var wechat = $('#wechat').val();
    var email = $('#email').val();

    if (!username) {
      alert("用户名字必须填写");
      return;
    }

    Meteor.call('updateUserBasic', {
      username: username,
      qq: qq || '',
      phone: phone || '',
      wechat: wechat || '',
      email: email || ''
    }, function (err, res) {
      if (err) {
        alert("用户更新失败");
      } else {
        alert("更新成功");
      }
    });
  },
  'click #cancelChange': function () {
    resetUserInfo();
  },
  'click #changePasswd': function () {
    var oldPasswd = $("#oldPassword").val();
    var newPasswd = $("#newPassword").val();
    var PasswdConfirm = $("#passwordConfirm").val();

    if (!oldPasswd || !newPasswd || !PasswdConfirm) {
      alert("输入信息不可为空");
      return;
    }

    if (newPasswd != PasswdConfirm) {
      alert("新密码前后不一致");
      return;
    }

    Accounts.changePassword(oldPasswd, newPasswd, function (err) {
      if (err) {
        console.log("changePasswd", err);
        var msg = "更新密码失败! ";
        if ("Incorrect password" == err.reason) {
          msg += "原密码错误";
        }
        alert(msg);
      } else {
        alert("更新密码成功");
      }
    });
    resetPasswdInfo();
  },
  'click #cancelChangePasswd': function () {
    resetPasswdInfo();
  }
});

function resetUserInfo () {
  var userInfo = Meteor.user();
  $('#username').val(userInfo.username);
  $('#qq').val(userInfo.profile.qq);
  $('#phone').val(userInfo.profile.phone);
  $('#wechat').val(userInfo.profile.wechat);
  $('#email').val(userInfo.profile.email);
}

function resetPasswdInfo () {
  $("#oldPassword").val('');
  $("#newPassword").val('');
  $("#passwordConfirm").val('');
}
