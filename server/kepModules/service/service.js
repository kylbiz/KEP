/*
 * 业务相关的梳理
 **/

KService = {};


/*
 * 创建新的业务
 **/
KService.createService = function (serInfo) {
  check(serInfo, {
    serType: Match.oneOf('companyRegist'),
    hostId: String,
    customerId: String,
    payed: Boolean,
    creatorId: String,
  });

  var hostInfo = Meteor.users.findOne({_id: serInfo.hostId});
  var customerInfo = Customers.findOne({_id: serInfo.customerId});
  var creatorInfo = Meteor.users.findOne({_id: serInfo.creatorId});
  if (!hostInfo || !customerInfo || !creatorInfo) {
    throw new Meteor.Error('查找的信息不存在');
  }

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
 *
 **/
KService.getService = function (userId, customerId) {

}
