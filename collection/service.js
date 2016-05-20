
// 公司注册业务
// CompanyRegist = new Mongo.Collection('CompanyRegist');
Service = new Mongo.Collection('Service');
Service.attachSchema( new SimpleSchema ({
  "type": {
    type: String,
    label: '类型',
    autoform: {
      type: 'select',
      firstOption: false,
      options: function () {
        return [
          {label: '公司注册', value: 'companyRegist'}
        ]
      }
    }
  },
  "host": {
    type: Object,
    label: "负责人信息",
  },
  "host.name": {
    type: String,
    label: "负责人名字",
    autoValue: function () {
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
  "customerId": {
    type: String,
    label: "客户ID"
  }, // 对应的客户id
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
  "remark": {
    type: String,
    label: "备注",
    optional: true
  }, // 备注信息, 只有单业务（公司注册）的情况下，可不使用
  "status": {
    type: Number,
    label: "状态"
  }, // "0 - 准备中", "1 - 受理中", "2 - 已完成", "-1 - 废弃"
  "payed": {
    type: Boolean,
    label: "付款",
    autoform: {
      type: 'select',
      firstOption: false,
      options: function () {
        return [
          {label: "未付款", value: false},
          {label: "已付款", value: true}
        ];
      }
    }
  }, // 是否付费 有/无
  "companyInfo": {
    type: String,
    label: "公司信息",
    optional: true
  },  // 公司信息
  "tasks": {
    type: Array,
    label: "任务信息",
    optional: true
  },
  "tasks.$": {
    type: Object,
    label: "子任务",
    optional: true
  },
  "tasks.$.type": {
    type: String,
    label: "子任务类型"
  },
  "tasks.$.id": {
    type: String,
    label: "子任务ID"
  }
}) );


Service.helpers({
  label: function () {  // 业务名称
    return {'companyRegist': '公司注册'}[this.type || ""] || "未知";
  }
});


// service的结构
var struct = {
  type: 'companyRegist',
  host: {   // 负责人
    name: '',
    id: '',
  },
  customerId: '', // 对应的客户id
  createdAt: '',
  createdBy: '',
  contactInfo: {   // 公司注册时的联系人，这个跟客户信息中有重复可不使用，这里放上来主要是考虑以后拓展业务后，各业务间区格
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  remark: '', // 备注信息, 只有单业务（公司注册）的情况下，可不使用
  status: 0, // "0 - 准备中", "1 - 受理中", "2 - 已完成", "-1 - 废弃"
  payed: true, // 是否付费 有/无
  companyInfo: '_id',  // 公司信息
  tasks: [{type: 'companyCheckName', id: ''}, {type: 'companyRegistInfo', id: ''}], // 子任务id 列表
}
