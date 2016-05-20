  /*
 * 业务相关的梳理
 **/

KService = {};


/*
 * 创建新的业务
 **/
KService.createService = function (serInfo) {
  check(serInfo, {
    serType: Match.OneOf('companyRegist'),
    hostId: String,
    customerId: String,
    payed: Boolean,
    creatorId: String,
  });


  var retList = KUtil.dataIsInColl([
    {coll: Customers, dataId: serInfo.customerId},
    {coll: Meteor.users, dataId: serInfo.hostId},
    {coll: Meteor.users, dataId: serInfo.creatorId}
  ]);

  var customerInfo = retList[0];
  var hostInfo = retList[1];
  var creatorInfo = retList[2];

  // 创建公司信息
  var companyInfoId = KCompanyInfo.createCompanyInfo(serInfo.customerId);


  var serviceId = Service.insert({
    type: serInfo.serType,
    host: {
      name: hostInfo.username,
      id: hostInfo._id
    },
    customerId: customerInfo._id,
    createdAt: new Date(),
    createdBy: creatorInfo._id,
    contactInfo: customerInfo.contactInfo,
    remark: customerInfo.remark,
    status: 0,
    payed: serInfo.payed,
    companyInfo: companyInfoId || null,
    tasks: [],
  });

  return serviceId;
}


/*
 * 更新已受理的业务
 **/
KService.updateService = function (serId, serInfo) {
  check(serId, String);
  check(serInfo, {
    hostId: String,
    payed: Boolean,
  });
  KUtil.dataIsInColl([
    {coll: Service, dataId: serId},
    {coll: Meteor.users, dataId: serInfo.hostId}
  ]);

  return Service.update({_id: serId}, {$set: serInfo});
}


/*
 * 更新业务的任务
 **/
KService.updateServiceTasks = function (serviceId, tasksInfo) {
  check(serviceId, String);
  check(tasksInfo, {
    opt: Match.OneOf('add'),
    tasks:[{
      type: String,
      id: String
    }]
  });

  var info = KUtil.dataIsInColl({coll: Service, dataId: serviceId});
  var tasks = info.tasks || [];
  tasks.concat(tasksInfo.tasks);

  if (tasksInfo.opt == 'add') {
    return Service.update({_id: serviceId}, {$set: {tasks: tasks}});
  }

  throw new Metor.Error('内部数据处理错误');
}

/*
 * 注销已受理的业务
 **/
KService.deleteService = function (serId) {
  check(serId, String);
  KUtil.dataIsInColl({coll: Service, dataId: serId});

  // 标记废弃的业务
  Service.update({_id: serId}, {$set: {
    status: -1,
  }});

  // 标记废弃相关的子任务
  KTask.delTaskBySer(serId);
  log('delTaskBySer', serId);

  return serId;
}


/*
 * 注销某一customer下的所有业务
 **/
KService.delSerByCustomer = function (customerId) {
  // 标记废弃的业务
  Service.find({customerId: customerId}, {feilds: {_id: 1}}).forEach(function (ser) {
    KService.deleteService(ser._id);
  });
  log('delSerByCustomer', customerId);
  return customerId;
}

/*
 * 获取某个客户所有的受理业务
 **/
KService.getService = function (customerId) {
  check(customerId, String);
  KUtil.dataIsInColl({coll: Customers, dataId: customerId});

  log("KService.getService", customerId);

  return Service.find({customerId: customerId, status: {$gte: 0}});
}
