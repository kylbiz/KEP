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
