/*
 * 提供给客户端调用
 **/


Meteor.methods({
  'createKEPUser': function () { // 创建用户的方法
  },
  'updateUserBasic': function (userinfo) { // 更新用户的基本信息
log('updateUserBasic', userinfo);
    var userId = KUtil.isLogin();
    return KAccount.updateBasic(userId, userinfo);
  },
  'resetUserPassword': function () {
    // 重置用户密码
  }
});
