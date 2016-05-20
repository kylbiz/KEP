/*
 * 团队的管理
 **/

KTeam = {};

/*
 * 创建团队
 *
 **/
KTeam.createTeam = function (name, remark) {
  // check
  check(name, String);
  check(remark, Match.Maybe(String));

  if (UsersTeam.findOne({name: name})) {
    throw new Meteor.Error('该团队名称已被占有');
  }

  var teamId = UsersTeam.insert({
      name: name,   // 群组名
      remark: remark || '', // 备注
      createdAt: new Date(),
      roles: ['admin', 'manager', 'advUser', 'user']
  });
  return teamId;
}


/*
 * 添加用户
 **/
KTeam.addUser = function (userId, teamId, roles) {
  // check
  check(userId, String);
  check(teamId, String);
  check(roles, [String]);

  var team = UsersTeam.findOne({_id: teamId, roles: {$all: roles}});
  if (!team) {
    throw new Meteor.Error('传入参数有误');
  }

  Meteor.users.update({_id: userId}, {
    $set: {
      team: {
        teamId: team._id,
        name: team.name,
        roles: roles
      }
    }
  });
}


/*
 * 判断用户是否有相应的权限
 **/
 KTeam.userIsInRole = function (userId, roleStr) {
  check(userId, String);
  check(roleStr, String);

  var roles = [roleStr];
  var user = Meteor.users.findOne({_id: userId, 'team.roles': {$in: roles}});
  return !!user;
 }

 /*
  * 获取处于对应role下的用户
  **/
KTeam.getUsersInRoles = function (roles) {
  check( roles, Match.OneOf(String, [String]) );

  if (_.isString(roles)) {
    roles = [roles];
  }

  return Meteor.users.find({ 'team.roles': {$in: [roles]}}).fetch();
}


/*
 * 获取用户的role信息
 **/
KTeam.roleOfUser = function (userId) {
  check(userId, String);

  var userInfo = Meteor.users.findOne({_id: userId}) || {team: {roles:['']}};
  return userInfo.team.roles[0] || "";
}

/*
 * 具体的操作权限判断
 *
 * 用户角色
 * admin -- 最高权限: 可操作对应team下所有用户及所有客户
 * manager -- 管理员: 可操作对应team下所有客户 (！！！也可以是自己的客户，这个权限存疑)
 * advUser -- 高级用户: 可操作对应team下，其负责的业务，查看对应客户的信息
 * user -- 普通用户: 可操作对应team下，其负责的子任务，查看对应客户的信息
 *
 * 权限等级 -- 0 - 无权限， 1 - 有自己为负责人的信息的权限， 2 - 所有权限
 *
 *@param userId -- 请求权限的用户id
 *@param opt -- 请求的操作
 *@param infoId -- 具体到某一条数据的操作权限
 *
 *
 *@return
 * 若无infoId, 则返回该用户对该操作的等级权限 <0 1 2>
 * 若有infoId, 则返回该用户对该具体数据的该操作是否有权限
 *
 **/
KTeam.havePermission = function (userId, opt, infoId) {
  check(userId, String);
  check(opt, String);
  check(opt, Match.Maybe(String));

  // 所有的操作权限
  var optList = [
    'user.view', 'user.create', 'user.update', 'user.delete', // 用户管理的权限
    'customer.view', 'customer.create', 'customer.update', 'customer.delete', // 客户管理的权限
    'service.view', 'service.create', 'service.update', 'service.delete', // 业务管理的权限
    // 'companyRegist.view', 'companyRegist.create', 'companyRegist.update', 'companyRegist.delete', // 公司注册的权限
    'task.view', 'task.create', 'task.update', 'task.delete', // 任务管理的权限
    'companyInfo.view', 'companyInfo.create', 'companyInfo.update', 'companyInfo.delete', // 客户公司资料的权限 （目前无对应的权限）
  ];

  if (optList.indexOf(opt) < 0) {
    throw new Meteor.Error('传入的参数有误');
  }

  var permissionLevel = KTeam.getPermissionLevel(userId, opt);   // 权限等级

  // 无infoId, 则返回该用户对该操作的等级权限
  if (!infoId) {
    return permissionLevel;
  }

  // 有infoId, 则返回该用户对该具体数据的该操作是否有权限
  if (permissionLevel == 0) {
    return false;
  } else if (permissionLevel == 2) {
    return true;
  } else if (permissionLevel == 1) {
    var optObj = opt.split(".")[0];
    var collObj = {
      'user': Meteor.users, // 用户
      'customer': Customers,  // 客户
      'task': Tasks,  // 任务
      'service': Service, // 客户业务
    }[optObj];

    var dataInfo = collObj.findOne({_id: infoId, 'host.id': userId})
    return !!dataInfo;
  }

  return false;
}


KTeam.getPermissionLevel = function (userId, opt) {
  check(userId, String);
  check(opt, String);

  var role = KTeam.roleOfUser(userId);
  var permissionHandle = {
    'admin': function () {
      return 2;
    },
    'manager': function () {
      var limit = ['user.view', 'user.create', 'user.update', 'user.delete'];
      return ( (limit.indexOf(opt) < 0) ? 2 : 0 );
    },
    'advUser': function () {
      // 只对自己负责的条目有权限
      var permissionHost = [
        'customer.view',
        'service.view', 'service.update',
        'task.create', 'task.view', 'task.update', 'task.delete'
      ];
      return ( (permissionHost.indexOf(opt) >= 0) ? 1 : 0 );
    },
    'user': function () {
      var permissionHost = [
        'customer.view',
        'task.view', 'task.update'
      ];
      return ( (permissionHost.indexOf(opt) >= 0) ? 1 : 0 );
    }
  };

  // log('KTeam.havePermission', userId, opt, role);
  if (!permissionHandle.hasOwnProperty(role)) {
    return 0;
  }

  return permissionHandle[role]();   // 权限等级
}

