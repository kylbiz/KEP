/*
 * KEP前端的辅助方法
 **/

// 这个之后可改进为系统日志的记录
log = console.log.bind(console, "KEPDebug(" + moment().format('YYYY-MM-DD HH:mm:ss') + "): ");


// 弥补上check 1.2.1中包含的功能
if (typeof Match == 'object') {
  Match.Maybe = function (pattern) {
    return Match.OneOf(undefined, null, pattern);
  }
}

// KEP前端的辅助函数
KEPUtil = {};

// 将保存在collection中的schema数据转换为客户端可用的obj
KEPUtil.convToSchemaOrigin = function (saveObj) {
  var newObj = {};
  for (var key in saveObj) {
    var info = saveObj[ key ];
    var type = info.type;
    info["type"] = {
      "String": String,
      "Object": Object,
      "Number": Number,
      "Array": Array,
      "Boolean": Boolean,
      "Date": Date
    }[type];


    var options = false;

    // if (info.autoform && info.autoform.type == 'select') {
    //   log("info.autoform.options-1", info.autoform.options);
    //   // options = info.autoform.options.clone();
    // }

    newObj[ key.replace(/\-/g, ".") ] = info;
    if (options) {
      newObj[ key.replace(/\-/g, ".") ].autoform.options = function () {
        return options;
      }
    }
  }

  return newObj;
}


// 两个时间间隔天数
KEPUtil.intervalDays = function (startTime, endTime) {
  var perTime = (endTime || 0) - (startTime || 0);
  var days = moment.duration(perTime).asDays();
  // .toFixed(1)
  return Math.floor(days);
}


// 验证手机号
KEPUtil.validatePhone = function (phone) {
    var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    return phoneReg.test(phone);
};

// 验证邮箱
KEPUtil.validateEmail = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// 获取当前进行到哪一步骤
KEPUtil.taskStepWorking = function (steps) {
  for (var key in steps) {
    var step = steps[key] || {};
    if (!step.finished) {
      return {index: key, name: step.name} || "";
    }
  }

  // 全部完成显示第一个
  return { index: 0, name: (steps[0] || {}).name || ''};
}

