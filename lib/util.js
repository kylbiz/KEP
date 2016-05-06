log = console.log.bind(console, "KEPDebug(" + moment().format('YYYY-MM-DD HH:mm:ss') + "): "); // 这个之后可改进为系统日志的记录

KEPUtil = {}



// 弥补上check 1.2.1中包含的功能
if (typeof Match == 'object') {
  Match.Maybe = function (pattern) {
    return Match.OneOf(undefined, null, pattern);
  }
}
