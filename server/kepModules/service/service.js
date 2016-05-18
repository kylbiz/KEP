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
    companyInfo: null,
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
 * 注销已受理的业务
 **/
KService.deleteService = function (serId) {
  check(serId, String);
  KUtil.dataIsInColl({coll: Service, dataId: serId});

  return Service.update({_id: serId}, {$set: {
    status: -1,
  }});
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
