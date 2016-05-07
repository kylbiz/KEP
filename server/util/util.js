/*
 * KEP后端的辅助函数
 **/

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
  var userId = false;
  if (self) {
    userId = self.userId;
  } else {
    userId = Meteor.userId();
  }

  log('isLogin', userId);
  if (userId) {
    return userId;
  }
  throw new Meteor.Error('未登录');
}

// 判断用户是否有权限
KUtil.havePermission = function (userId, opt, infoId) {
  var permission = KTeam.havePermission(userId, opt, infoId);
  if (!permission) {
    throw new Meteor.Error('当前账号无权限');
  }
  return permission;
}


// 某一用户负责下的条目下内容
KUtil.getInfoListBelongToUser = function (hostUserId, hostColl, fieldsWant) {
  check(hostUserId, String);
  // check(hostColl, Match.Any);
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


// 获取在某个collection中是否有某个对象
KUtil.dataIsInColl = function (infoList) {
  var infos = [];
  if ( _.isArray(infoList) ) {
    infos = infoList;
  } else {
    infos.push(infoList);
  }

  check(infos, [{
    coll: Match.Any, // check的Object只能用于识别简单的
    dataId: String
  }]);

  var flag = true;
  var dataList = [];
  for (var key in infos) {
    var info = infos[key];
    var data = info.coll.findOne({_id: info.dataId});
    if (!data) {
      flag = false;
    } else {
      dataList.push(data);
    }
  }
  if (!flag) {
    throw new Meteor.Error('查找的信息不存在');
  }

  return ( (dataList.length == 1) ? dataList[0] : dataList );
}


