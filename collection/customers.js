Customers = new Mongo.Collection('Customers');
// Customer 结构:
Customers.attachSchema( new SimpleSchema({
  "name": {
    type: String,
    label: "客户名称"
  },
  "host": {
    type: Object,
    label: "负责人信息"
  },
  "host.name": {
    type: String,
    label: "负责人名字",
    autoValue: function () { // 创建
      log("host.name", this);
      var docId = this.docId;
      var hostId = this.field("host.id").value;
      if (hostId) {
        var userInfo = Meteor.users.findOne({_id: hostId}) || {};
        return userInfo.username || "未知";
      } else {
        this.unset();
      }
    }
  },
  "host.id": {
    type: String,
    label: "客户负责人",
    autoform: {
      type: 'select',
      firstOption: false,
      options: function () {
          var users = Meteor.users.find({}, {fields: {username: 1, _id: 1}}).fetch();
          var hosts = [];
          users.forEach(function (user) {
            hosts.push({
              label: user.username, value: user._id
            });
          });
        return hosts;
      }
    }
  },
  "status": {
    type: Number,
    label: "状态",
  },
  "teamId": {
    type: String,
    label: "团队ID"
  },
  "createdAt": {
    type: Date,
    label: "创建时间"
  },
  "createdBy": {
    type: String,
    label: "创建者"
  },
  "contactInfo": {
    type: Object,
    label: "联系信息"
  },
  "contactInfo.name": {
    type: String,
    label: "联系人"
  },
  "contactInfo.address": {
    type: String,
    label: "地址",
    optional: true
  },
  "contactInfo.phone": {
    type: String,
    label: "电话"
  },
  "contactInfo.email": {
    type: String,
    label: "电子邮箱",
    optional: true
  },
  "service": {
    type: [Object],
    label: "业务",
    optional: true
  },
  "service.$.type": {
    type: String,
    label: "业务类型"
  },
  "service.$.id": {
    type: String,
    label: "业务ID"
  },
  "from": {
    type: String,
    label: "客户来源",
    optional: true
  },
  "remark": {
    type: String,
    label: "备注",
    optional: true
  },
  // "companyInfo": {
  //   type: String,
  //   label: "客户公司"
  // }
}) );

Customers.helpers({
  statusLabel: function () {
    return {"-1": "删除", "1": "服务中"}[this.status + ""] || "未知";
  },
  payLabel: function () {
    return "未知";
  },
  createdTime: function () {
    return moment(this.createdAt).format("YYYY-MM-DD");
  }
});


// Customer 结构:
var struct = {
  name: '',
  host: {
    name: '',
    id: '',
  },
  status: 1, // -1 -- 删除， 1 -- 服务中
  teamId: '', // 所属团队
  createdAt: '',
  createdBy: '', // 创建人
  contactInfo: {
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  service: [  // 服务项目
    {type: 'companyRegist', id: ''} // 公司注册
  ],
  from: '',   // 客户来源
  remark: '', // 备注
  // companyInfo: '' // 客户公司的ID，暂时不放到里面，目前设计到service
}
