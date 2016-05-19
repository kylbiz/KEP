/*
 * 账号系统
 **/

KAccount = {};

/*
 * 创建一个完全新的用户
 * @return {itemId: '新创建的团队Id', userId: '新创建的该团队的管理员账号'}
 **/
KAccount.createTotalNewUser = function (teamInfo, adminInfo) {
  check(teamInfo, {
    name: String,
    remark: Match.Maybe(String)
  });

  check(adminInfo, {
    name: String,
    password: String,
    phone: Match.Maybe(String),
    email: Match.Maybe(String),
    qq: Match.Maybe(String),
    wechat: Match.Maybe(String)
    // nickname: Match.Maybe(String),
  });

  var teamId = KTeam.createTeam(teamInfo.name, teamInfo.remark || '');
  var userId = KAccount.createUser(adminInfo, {
    teamId: teamId,
    roles: ['admin'],
  });

  return {
    teamId: teamId,
    userId: userId
  };
}


/*
 * 创建新用户
 */
KAccount.createUser = function (userInfo, teamInfo) {
  // check
  check(userInfo, {
    name: String,
    password: String,
    phone: Match.Maybe(String),
    email: Match.Maybe(String),
    qq: Match.Maybe(String),
    wechat: Match.Maybe(String),
    // nickname: Match.Maybe(String),
  });

  check(teamInfo, {
    teamId: String,
    roles: [String],
  });

  var userId = Accounts.createUser({
    username: userInfo.name,
    password: userInfo.password,
    profile: {
      nickname: userInfo.nickname || userInfo.name,
      phone: userInfo.phone || '',
      email: userInfo.email || '',
      qq: userInfo.qq || '',
      wechat: userInfo.wechat || ''
    }
  });

  KTeam.addUser(userId, teamInfo.teamId, teamInfo.roles);
  return userId;
}


/*
 * 用户的team信息
 **/
KAccount.teamInfo = function (userId) {
  check(userId, String);

  var userInfo = Meteor.users.findOne({_id: userId}) || false;
  if (!userInfo) {
    throw new Meteor.Error('查找的信息不存在');
  }

  return userInfo.team || {};
 }


 /*
  * 更新用户的基本信息
  **/
  KAccount.updateBasic = function (userId, basicInfo) {
    check(userId, String);
    check(basicInfo, {
      username: String,
      phone: Match.Maybe(String),
      email: Match.Maybe(String),
      qq: Match.Maybe(String),
      wechat: Match.Maybe(String),
      // nickname: Match.Maybe(String)
    });

    KUtil.dataIsInColl({coll: Meteor.users, dataId: userId});

    if ( Meteor.users.findOne({username: basicInfo.username, _id: {$ne: userId}}) ) {
      throw new Meteor.Error('该用户名已存在');
    }

    Meteor.users.update({_id: userId}, {$set: {
      'username': basicInfo.username,
      'profile.phone': basicInfo.phone || "",
      'profile.email': basicInfo.email || "",
      'profile.qq': basicInfo.qq || "",
      'profile.wechat': basicInfo.wechat || "",
      // 'profile.nickname': basicInfo.nickname || "",
    }});
  }



