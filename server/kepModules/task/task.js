/*
 * 子任务的管理
 **/

KTask = {};

/*
 * 创建任务
 **/
KTask.createTask = function (taskInfo) {
  check(taskInfo, {
    name: Match.OneOf('companyCheckName', 'CompanyRegistInfo'),
    hostId: String,
    serviceId: String,
    email: Match.Maybe([{
      to: String,
      template: String,
      data: Match.Maybe(Object),
      other: Match.Maybe(String),
    }]),
    sms: Match.Maybe([{
      to: String,
      template: String,
      data: Match.Maybe(Object),
      other: Match.Maybe(String),
    }]),
    taskStepId: String
  });

  var timeNow = new Date();
  var label = {"companyCheckName": "公司核名", "CompanyRegistInfo": "工商登记"}[taskInfo.name];

  var retList = KUtil.dataIsInColl([
    {coll: Meteor.users, dataId: taskInfo.hostId},
    {coll: Service, dataId: taskInfo.serviceId},
    {coll: TaskSteps, dataId: taskInfo.taskStepId}
  ]);

  var hostInfo = retList[0];
  var serviceInfo = retList[1];
  var taskStepInfo = retList[2];

  var remind = {};
  if (taskInfo.email) {
    remind.email = [];
    taskInfo.email.forEach(function (info) {
      remind.email.push({
        type: 'email',
        to: info.to,
        template: info.template,
        data: info.data || {},
        other: info.other || "",
      });
    });
  }
  if (taskInfo.sms) {
    remind.sms = [];
    taskInfo.sms.forEach(function (info) {
      remind.sms.push({
        type: 'sms',
        to: info.to,
        template: info.template,
        data: info.data || {},
        other: info.other || "",
      });
    });
  }

  Tasks.insert({
    name: taskInfo,
    label: label,
    host: {
      name: hostInfo.username,
      id: hostInfo.id
    },
    customerId: serviceInfo.customerId, // 所属客户id,
    serviceId: serviceInfo._id,  // 所属业务id, 如: 公司注册
    createdAt: timeNow,
    startTime: timeNow,
    updateTime: timeNow,
    status: 0, // "0 - 处理中, 1 - 已完成， -1 - 废弃"
    remind: remind, // 通知
    taskStepId: taskStepInfo._id, // 实际使用的taskstep数据结构
    steps: taskStepInfo.steps,
    progressChange: []
  });
}


KTask.updateTask = function () {

}

KTask.deleteTask = function () {

}


/*
 * 初始化子任务下的步骤
 **/
KTask.initTaskStep = function (coll, schemaId) {
  // var schemaObj = SchemaHandle.getSchema(schemaId);
  var schemaObj = temp();
  TempStruct.attachSchema(schemaObj);
  return TempStruct;
}


function temp() {
  var RegisterSchema = new SimpleSchema({
    "company": {
      type: Object,
      label: "公司基本信息",
      optional: true
    },
    "company.zone": {
      type: String,
      label: '注册区域（必填）',
      optional: true,
      autoform: {
        type: 'select',
        firstOption: false,
        options: function() {
          return [
            {label: '虹口', value: '虹口'},
            {label: '浦东', value: '浦东'}
          ]
        }
      }
    },
    "company.name": {
      type: String,
      label: '企业名称'
    },
    "company.type": {
      type: String,
      label: '公司类型',
      optional: true,
      autoform: {
        type: 'select',
        firstOption: false,
        options: function() {
          return [
            {label: '有限责任公司', value: '有限责任公司'},
            {label: '有限合伙', value: '有限合伙'}
          ]
        }
      }
    },
    'company.companyId': {
      type: String,
      label: '名称预先核准文号/注册号/统一社会信用代码',
      optional: true
    },
    'company.tel': {
      type: String,
      label: '联系电话（必填）'
    },
    'company.moneyAmount': {
      type: Number,
      label: '注册资本(单位：万元，必填)'
    },
    'company.businessScope': {
      type: String,
      label: '经营范围',
      optional: true,
      min: 0,
      max: 1000,
      autoform: {
        rows: 5
      }
    },
    'company.businessPeriod': {
      type: String,
      label: '经营期限',
      optional: true,
      autoform: {
        type: 'select',
        firstOption: false,
        options: function() {
          return [
            {label: '10年', value: '10年'},
            {label: '20年', value: '20年'},
            {label: '长期', value: '长期'}
          ]
        }
      }
    },
    'company.address': {
      type: String,
      label: '公司地址',
      optional: true
    },
    'company.productionAddress': {
      type: String,
      label: '生产经营地',
      optional: true
    },

    "legalPerson": {
      type: Object,
      label: '法人（必填）',
      optional: true
    },
    "legalPerson.name": {
      type: String,
      label: '法定代表人姓名'
    },
    "legalPerson.tel": {
      type: String,
      label: '固定电话',
      optional: true
    },
    "legalPerson.phone": {
      type: String,
      label: '移动电话（必填）'
    },
    "legalPerson.email": {
      type: String,
      label: '电子邮箱',
      optional: true,
      autoform: {
        afFieldInput: {
          type: "email"
        }
      }
    },
    "legalPerson.IDType": {
      type: String,
      label: '证件类型',
      optional: true,
      autoform: {
        type: 'select',
        firstOption: false,
        options: function() {
          return [
            {label: '身份证', value: '身份证'}
          ]
        }
      }
    },
    "legalPerson.ID": {
      type: String,
      label: '证件号码（必填）'
    },
    "chairman": {
      type: Object,
      label: '董事',
      optional: true
    },
    "chairman.name": {
      type: String,
      label: '董事姓名',
      optional: true
    },
    "chairman.type": {
      type: String,
      label: '董事职务',
      optional: true,
      autoform: {
        type: 'select',
        firstOption: false,
        options: function() {
          return [
            {label: '执行董事', value: '执行董事'}
          ]
        }
      }
    },
    "chairman.IDType": {
      type: String,
      label: '董事身份证类型',
      optional: true,
      autoform: {
        type: 'select',
        firstOption: false,
        options: function() {
          return [
            {label: '身份证', value: '身份证'}
          ]
        }
      }
    },
    "chairman.ID": {
      type: String,
      label: '董事身份证号码',
      optional: true
    },
    "chairman.phone": {
      type: String,
      label: "董事手机号码",
      optional: true
    },
    "supervisor": {
      type: Object,
      label: '监事（必填）',
      optional: true
    },
    "supervisor.name": {
      type: String,
      label: '监事姓名（必填）'
    },
    "supervisor.type": {
      type: String,
      label: '监事职务',
      optional: true,
      defaultValue: function() {
        return '监事';
      }
    },
    "supervisor.IDType": {
      type: String,
      label: '监事身份证类型',
      optional: true,
      autoform: {
        type: 'select',
        firstOption: false,
        options: function() {
          return [
            {label: '身份证', value: '身份证'}
          ]
        }
      }
    },
    "supervisor.ID": {
      type: String,
      label: '监事身份证号码（必填）'
    },

    "manager": {
      type: Object,
      label: "经理",
      optional: true
    },
    "manager.name": {
      type: String,
      label: "经理姓名",
      optional: true
    },
    "manager.type": {
      type: String,
      label: '经理职务',
      optional: true,
      autoform: {
        type: 'select',
        firstOption: false,
        options: function() {
          return [
            {label: '经理', value: '经理'}
          ]
        }
      }
    },
    "manager.IDType": {
      type: String,
      label: '经理身份证类型',
      optional: true,
      autoform: {
        type: 'select',
        firstOption: false,
        options: function() {
          return [
            {label: '身份证', value: '身份证'},
          ]
        }
      }
    },
    "manager.ID": {
      type: String,
      label: '经理身份证号码',
      optional: true
    },

    "holders": {
      type: Array,
      minCount: 0,
      maxCount: 10,
      label: "股东信息(必填)",
      optional: true
    },
    "holders.$": {
      type: Object,
      optional: true
    },
    "holders.$.name": {
      type: String,
      label: "股东（发起人）名称或姓名"
    },

    "holders.$.IDType": {
      type: String,
      label: "证件类型",
      optional: true,
      autoform: {
        type: 'select',
        firstOption: false,
        options: function() {
          return [
            {label: '身份证', value: '身份证'}
          ]
        }
      }
    },
    "holders.$.ID": {
      type: String,
      label: "证照号码"
    },
    "holders.$.investType": {
      type: String,
      label: '出资方式',
      optional: true,
      autoform: {
        type: 'select',
        firstOption: false,
        options: function() {
          return [
            {label: '货币', value: '货币'}
          ]
        }
      }
    },
    "holders.$.investShare": {
      type: Number,
      label: '占股比例(%)',
      decimal: true
    },

    "contractor": {
      type: Object,
      label: '联络员',
      optional: true
    },
    "contractor.name": {
      type: String,
      label: '联络员姓名',
      optional: true
    },
    "contractor.tel": {
      type: String,
      label: '固定电话',
      optional: true
    },
    "contractor.phone": {
      type: String,
      label: '移动电话',
      optional: true
    },
    "contractor.email": {
      type: String,
      label: '电子邮箱',
      optional: true,
      autoform: {
        afFieldInput: {
          type: "email"
        }
      }
    },
    "contractor.IDType": {
      type: String,
      label: '身份证件类型',
      optional: true,
      autoform: {
        type: 'select',
        firstOption: false,
        options: function() {
          return [
            {label: '身份证', value: '身份证'}
          ]
        }
      }
    },
    "contractor.ID": {
      type: String,
      label: '身份证件号码',
      optional: true
    },

    "financialStaff": {
      type: Object,
      label: '财务负责人',
      optional: true
    },
    "financialStaff.name": {
      type: String,
      label: '联络员姓名',
      optional: true
    },
    "financialStaff.tel": {
      type: String,
      label: '固定电话',
      optional: true
    },
    "financialStaff.phone": {
      type: String,
      label: '移动电话',
      optional: true
    },
    "financialStaff.email": {
      type: String,
      label: '电子邮箱',
      optional: true,
      autoform: {
        afFieldInput: {
          type: "email"
        }
      }
    },
    "financialStaff.IDType": {
      type: String,
      label: '身份证件类型',
      optional: true,
      autoform: {
        type: 'select',
        firstOption: false,
        options: function() {
          return [
            {label: '身份证', value: '身份证'}
          ]
        }
      }
    },
    "financialStaff.ID": {
      type: String,
      label: '身份证件号码',
      optional: true
    }
  });

  return RegisterSchema;
}

