KUtil = {};

// 将list中数据批量插入collection中
KUtil.insertListToColl = function (listData, coll, preHandleFunc) {
  listData = listData || [];
  listData.forEach(function (data) {
    if (preHandleFunc) {
      data = preHandleFunc(data);
    }
    coll.insert(data);
  });
}

// 判断用户当前是否处于登录状态
KUtil.isLogin = function (self) {
  if (Meteor.userId) {
    return Meteor.userId();
  }

  if (self && self.userId) {
    return self.userId;
  }

  throw new Meteor.Error('未登录');
}

// 判断用户是否有权限
KUtil.havePermission = function (userId, opt) {
  var permission = KTeam.havePermission(userId, opt);
  if (!permission) {
    throw new Meteor.Error('当前账号无权限');
  }
  return permission;
}


// 某一用户负责下的条目下内容
KUtil.getInfoListBelongToUser = function (hostUserId, hostColl, fieldsWant) {
  check(hostUserId, String);
  check(hostColl, Object);
  check(fieldsWant, [String]);

  // var infoList = [];
  // hostColl.find({
  //   'host.id': hostUserId
  // },{
  //   fields: {fieldWant: 1}
  // }).forEach(function (info) {
  //   if (info && info.customerId) {
  //     infoList.push(info.customerId);
  //   }
  // });
  // return
}


