/*
 * 一企查订阅服务
 **/

var Fiber = Npm.require('fibers');

// 添加一企查服务订阅
Yiqicha.subscribe = function (info, callback) {
  log("Yiqicha.subscribe", info);

  check(info, {
    type: String,
    companyName: String,
    other: Match.Any,
  });


  var subId = YiqichaSub.insert({
    type: info.type,
    companyName: info.companyName,
    other: info.other || {},
    statusInfo: {
      company: info.companyName,
      status: 0,
      label: '初始化',
      detail: {}
    },
    createdAt: new Date(),
    lastSearchTime: 0,
    searchNum: 0,
  });

  Yiqicha.updateCompanyStatus(subId, pushUpdate);
}

// 更新公司状态
Yiqicha.updateCompanyStatus = function (subId, callback) {
  log("Yiqicha.updateCompanyStatus", subId);

  callback = callback || function () {}

  var info = YiqichaSub.findOne({_id: subId}) || false;
  if (!info) {
    callback("传入数据有误");
    return;
  }

  var handleMap = {
    'checkName': Yiqicha.checkName,
    'regist': Yiqicha.regist,
  };
  if ( !handleMap.hasOwnProperty(info.type) ) {
    callback("传入数据有误", null);
    return;
  }

  // 查询操作
  handleMap[info.type](info.companyName, function (err, statusInfo) {
    if (err || !statusInfo) {
      callback("查询失败", null);
      return;
    }

    var oldStatus = info.statusInfo.status || 0;
    var statusChanged = (oldStatus != statusInfo.status);
    // 状态更改
    if (statusChanged) {
      changeStatus(subId, statusInfo || {});
    }

    callback(null, {
      changed: statusChanged,
      type: info.type,
      companyName: info.companyName,
      status: statusInfo.label,
      subId: subId,
      other: info.other
    });
  });
}

// 更新所有
Yiqicha.updateAll = function () {
  Meteor.setInterval(function () {
    updateAll();
  }, 6 * 1000);
  // 1 * 3600 * 1000
}

// 更新所有需要更新的订阅
function updateAll() {
  // 查询条件
  // 过期条件, 间隔查询时间,
  var opt = {
    "statusInfo.status": {
      $gte: 0,
    },
    // "lastSearchTime": {
    //   $lte: moment().subtract(Yiqicha.checkHoursPeriod || 3, 'hours').toDate(),
    // },
    "searchNum": {
      $lte:Yiqicha.maxSearchTimes || 100 // 最大查询次数
    }
  };

  var subList = YiqichaSub.find(opt, {fields: {_id: true}}).fetch();
  var intervalObj = Meteor.setInterval(function() {
    var subObj = subList.pop();
    if(!subObj) {
      Meteor.clearInterval(intervalObj);
    } else {
      var subId = subObj._id;
      Yiqicha.updateCompanyStatus(subId, pushUpdate);
    }
  }, 5 * 1000);
}

// 获取到公司最新状态后的处理
function changeStatus(subId, statusInfo) {
  log("changeStatus", subId, statusInfo);

  Fiber(function () {
    YiqichaSub.update({_id: subId}, {
      $set: {
        statusInfo: statusInfo,
        lastSearchTime: new Date(),
      },
      $inc: {
        searchNum: 1,
      }
    });
  }).run();
}

// 状态有更新，推送更新
function pushUpdate (err, info) {
  log("pushUpdate", err, info);

  if (!err && info.changed) {
    // 想用户推送消息
    Fiber(function () {
      Meteor.call(info.other['call'] || 'companyStatusChange', info);
    }).run();
  }
}

// 或者使用Meteor的特性 状态有更新，推送更新
function observeStatusChange() {
  YiqichaSub.find({}).observe({
    changed: function (newDoc, oldDoc) {
      if (newDoc.statusInfo.status != oldDoc.statusInfo.status) {
        // 公司状态有更新
      }
    },
  });
}


Meteor.startup(function () {
  // 监听一企查
  // Yiqicha.updateAll();
});


// test
Meteor.methods({
  'yqc-sub': function () {
    Yiqicha.subscribe({
      type: 'checkName', // or 'regist'
      companyName: '上海尤安建筑设计股份有限公司',
      other: {
        taskId: '', // 订阅该公司名的子任务id
        call: 'companyStatusChange',
      }
    });
  }
});


