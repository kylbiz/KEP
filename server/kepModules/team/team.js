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
    throw new Meteor.Error('该团队名中已被占有');
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
 * 获取用户的role信息
 **/
KTeam.roleOfUser = function (userId) {
  check(userId, String);

  var userInfo = Meteor.users.findOne({_id: userId}) || {roles:['']};
  return userInfo.roles[0] || "";
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
 **/
KTeam.havePermission = function (userId, opt) {
  // 所有的操作权限
  var optList = [
    'user.view', 'user.create', 'user.update', 'user.delete', // 用户管理的权限
    'customer.view', 'customer.create', 'customer.update', 'customer.delete', // 客户管理的权限
    'service.view', 'service.create', 'service.update', 'service.delete', // 业务管理的权限
    'task.view', 'task.create', 'task.update', 'task.delete', // 任务管理的权限
  ];

  check(userId, String);
  if (!optList.hasOwnProperty(opt)) {
    throw new Meteor.Error('传入的参数有误');
  }

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

  if (permissionHandle.hasOwnProperty(role)) {
    return permissionHandle[role]();
  }

  return false;
}
