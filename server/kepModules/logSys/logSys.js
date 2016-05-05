/*
 * 日志系统
 **/

LogSys = {}

LogSys.writeCustomer = function(msg) {
  // check
  if ( !Meteor.userId() ) {
    return;
  }


  LogSys.insert({
    type: 'customer',   // <sys / customer>
    createdAt: new Date(),
    operator: Meteor.userId(),
    opt: msg.opt, // 操作类型 暂定: < customer_add customer_del customer_change / task_add task_del task_change>
    optObj: '',
    msg: msg.msg,
  });
};


LogSys.writeSys = function (msg) {
  LogSys.insert({
    type: 'system',
    createdAt: new Date(),
    operator: 'system',
    opt: '',
    msg: '',
  });
}
