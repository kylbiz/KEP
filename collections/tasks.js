// 子任务信息
Tasks = new Mongo.Collection('Tasks');
Tasks.attachSchema( new SimpleSchema ({
  'name': {
    type: String,
    label: '任务类型',
  },
  'label': {
    type: String,
    label: '任务名'
  },
  'host': {
    type: Object,
    label: ''
  },
  'host.name': {
    type: String,
    label: '',
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
  'host.id': {
    type: String,
    label: '',
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
  'customerId': {
    type: String,
    label: ''
  },
  'serviceId': {
    type: String,
    label: ''
  },
  'teamId': {
    type: String,
    label: ''
  },
  'createdAt': {
    type: Date,
    label: '',
    // autoValue
  },
  'startTime': {
    type: Date,
    label: ''
  },
  'updateTime': {
    type: Date,
    label: ''
  },
  'status': {
    type: Number,
    label: ''
  },
  'remind': {
    type: Object,
    label: '',
    optional: true
  },
  'remind.email': {
    type: Array,
    label: '',
    optional: true
  },
  'remind.email.$': {
    type: Object,
    label: '',
    optional: true
  },
  'remind.email.$.type': {
    type: String,
    label: '通知类型',
    autoValue: function () {
      return 'email';
    }
  },
  'remind.email.$.to': {
    type: String,
    label: ''
  },
  'remind.email.$.template': {
    type: String,
    label: '',
    optional: true
  },
  'remind.email.$.other': {
    type: String,
    label: '',
    optional: true
  },
  'remind.sms': {
    type: Array,
    label: '',
    optional: true
  },
  'remind.sms.$': {
    type: Object,
    label: '',
    optional: true
  },
  'remind.sms.$.type': {
    type: String,
    label: '',
    autoValue: function () {
      return 'sms';
    }
  },
  'remind.sms.$.to': {
    type: String,
    label: ''
  },
  'remind.sms.$.template': {
    type: String,
    label: '',
    optional: true
  },
  'remind.sms.$.other': {
    type: String,
    label: '',
    optional: true
  },
  'taskStepId': {
    type: String,
    label: '',
    optional: true
  },
  'steps': {
    type: Array,
    label: '',
    optional: true
  },
  'steps.$': {
    type: Object,
    label: '',
    optional: true
  },
  'steps.$.name': {
    type: String,
    label: '',
  },
  'steps.$.startTime': {
    type: Date,
    label: '',
    optional: true
  },
  'steps.$.updateTime': {
    type: Date,
    label: '',
    optional: true
  },
  'steps.$.finished': {
    type: Boolean,
    label: '',
  },
  'steps.$.dataStruct': {
    type: String,
    label: '',
    optional: true
  },
  'steps.$.data': {
    type: Object,
    label: '',
    optional: true
  },
  'progressChange': {
    type: Array,
    label: '',
    optional: true
  },
  'progressChange.$': {
    type: Object,
    label: '',
    optional: true
  },
  'progressChange.$.from': {
    type: String,
    label: ''
  },
  'progressChange.$.returnTo': {
    type: String,
    label: ''
  },
  'progressChange.$.time': {
    type: Date,
    label: ''
  },
  'progressChange.$.by': {
    type: String,
    label: ''
  },
  'progressChange.$.reason': {
    type: String,
    label: ''
  },
  'progressChange.$.remark': {
    type: String,
    label: '',
    optional: true
  },
  'progressChange.$.reset': {
    type: Boolean,
    label: ''
  },
}));


// Task 结构
struct = {
  name: '',   // 如: companyCheckName
  label: '',  // 如: 公司核名

  host: {    // 负责人
    name: '',
    id: '',
  },
  customerId: '', // 所属客户id,
  serviceId: '',  // 所属业务id, 如: 公司注册
  teamId: "",     // 该项业务属于团队

  createdAt: '',
  startTime: '',
  updateTime: '',
  status: 0, // "0 - 处理中, 1 - 已完成， -1 - 废弃"

  remind: { // 通知
    email: [  // 邮件通知
      {
        type: 'email',
        to: '',
        template: '', // 发送邮件模板
        data: {

        },
        other: '',
      },
    ],
    sms: [
      {
        type: 'sms',  // 短信通知
        to: '',
        template: '', // 发送短信邮件
        data: {

        },
        other: '',
      }
    ]
  },

  taskStepId: '',
  steps: [  // 子任务步骤
    {
      name: '填写资料',
      startTime: '',
      updateTime: '',
      finished: false,  // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
      // collection: 'CompanyCheckName',
      dataStruct: '_id', // 待录入数据的结构
      data: {
      }
    },
    {
      name: '客户确认',
      startTime: '',
      updateTime: '',
      finished: true,
      data: {
        name: '',
        time: ''
      }
    },
    {
      name: '提交工商',
      startTime: '',
      updateTime: '',
      finished: true,
      data: {
        name: '',
        time: ''
      }
    }
  ],

  progressChange: [  // 进度控制更改记录
    {
      from: '', // 从哪一步 (step - name)
      returnTo: '', // 回退到哪一步 (step - name)
      time: '', // 回退时间
      by: '', // 操作人的id
      reason: '', // 简要原因
      remark: '', // 备注信息
      reset: false, // 是否重置回退的信息
    },
  ]
}

Tasks.helpers({
  customerName: function () {
    return (Customers.findOne({_id: this.customerId}) || {}).name || "未知";
  },
  companyName: function () {
    return (CompanyInfo.findOne({customerId: this.customerId}) || {}).name || "未知";
  },
  stepStatus: function () {
    var stepStatus = "未知";
    var steps = this.steps || [];
    var stepsNum = steps.length;
    for (var key in steps) {
      var stepInfo = steps[key];
      if (!stepInfo.finished) {
        return stepInfo.name;
      }

      if (stepInfo.finished && (key+1) == stepsNum ) {
        return "完成";
      }
    }

    return stepStatus;
  },
  createdAtLabel: function () {
    return moment(this.createdAt).format("YYYY-MM-DD");
  },
  updateTimeLabel: function () {
    return moment(this.updateTime).format("YYYY-MM-DD");
  }
});
