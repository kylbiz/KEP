Template.workbench.onRendered(function() {
  this.autorun(function () {
    Meteor.subscribe("getSupportInfo", {type: 'task', service: 'companyRegist'});   // 获取公司注册业务的子任务描述信息
  });
});

Template.workbench.onDestroyed(function () {
  delete Session.keys['taskType'];
});


// 导航页（业务选项按钮）
Template.breadcrumb_workbench.helpers({
  tasks: function () {
    var supportInfo = SupportInfo.findOne({type: 'task', service: 'companyRegist'}) || {items: []};
    var items = supportInfo.items || [];
    if (items.length && !Session.get('taskType')) {
      var item = items[0] || {};
      Session.set('taskType', item.name || "companyRegistInfo");
      log('init session', item);
    }

    return items;
  }
});

Template.breadcrumb_workbench.events({
  'click .workbench_change_btn button': function (event) {
    Session.set('taskType', $(event.currentTarget).attr("value")); // 切换子任务
  }
});


// 各业务的表单列表
Template.reactiveDataTable.onRendered(function () {
  this.autorun(function () {
    Meteor.subscribe('getTasks');
    Meteor.subscribe('getStepsDes', ['companyCheckName', 'companyRegistInfo']);
  });
});

Template.reactiveDataTable.helpers({
  templateInfo: function () {
    // 需要显示的子任务列表
    var taskType = Session.get('taskType') || "";
    var template = {
      'companyCheckName': 'workbench_checkname',
      'companyRegistInfo': 'workbench_ICBCregister'
    }[taskType] || "";

    // 对应列表所需要的数据
    return {
      template: template,
      stepsDes: ((TaskSteps.findOne({type: taskType}) || {}).stepsDes) || [],
      taskData: Tasks.find({name: taskType}).fetch() || [],
    };
  }
});

// 子任务进度控制
Template.workbench_progress_control.onRendered(function () {

  $('#progress_control').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var taskId = button.data("taskid");
    var serviceId = button.data("serviceid");
    var customerId = button.data("customerid");
    // log('progress_control show', taskId, serviceId, customerId);
    Session.set('selectTaskId', taskId);
    Session.set('selectServiceId', serviceId);
    Session.set('selectCustomerId', customerId);
  });

  $('#progress_control').on('hidden.bs.modal', function (event) {
      delete Session.keys['selectTaskId'];
      delete Session.keys['selectServiceId'];
      delete Session.keys['selectCustomerId'];
      // log('progress_control hidden');
  });


  this.autorun(function () {
    Meteor.subscribe('getSupportInfo', {type: 'stepBackReason'});
  });
});


Template.workbench_progress_control.onDestroyed(function () {
  delete Session.keys['selectTaskId'];
  delete Session.keys['selectServiceId'];
  delete Session.keys['selectCustomerId'];
});


Template.workbench_progress_control.helpers({
  customerName: function () {
    var customerId = Session.get('selectCustomerId') || '';
    return (Customers.findOne({_id: customerId}) || {}).name || "";
  },
  serviceName: function () {
    return '公司注册'; // 这里不想再去找了
  },
  taskName: function () {
    var taskId = Session.get('selectTaskId') || '';
    return (Tasks.findOne({_id: taskId}) || {}).label || "";
  },
  stepsBack: function () {
    var taskId = Session.get('selectTaskId') || '';
    var stepsInfo = (Tasks.findOne({_id: taskId}) || {}).steps || [];
    var stepsBack = [];
    stepsInfo.forEach(function (stepInfo) {
      if (stepInfo.finished) {
        stepsBack.push(stepInfo.name);
      }
    });
    return stepsBack;
  },
  stepBackReason: function () {
    var info = SupportInfo.findOne({type: 'stepBackReason'}) || {};
    return info.items || [];
  }
});


Template.workbench_progress_control.events({
  'click #progressChaBtn': function () {
    var taskId = Session.get('selectTaskId') || '';
    var returnTo = $('#progress_reset').val() || '';
    var reason = $('#progress_reason').val() || '';
    var remark = $('#progress_remarks').val() || '';
    var reset = $('#progress_clear').val() || false;
    reset = {'true': true, 'false': false}[reset];

    log('progressChaBtn', taskId, returnTo, reason, remark, reset);
    Meteor.call('updateProgress', taskId, {
      returnTo: returnTo,
      by: Meteor.userId(),
      reason: reason,
      remark: remark,
      reset: reset,
    }, function (err, result) {
      log('updateProgress', err, result);
      if (err) {
        alert('更新进度失败！' + err);
      } else {
        $('#progress_control').modal("hide");
      }
    });
  }
});


// 子任务设置
Template.workbench_config.onRendered(function () {
  $('#config').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var taskId = button.data("taskid");
    Session.set('selectTaskId', taskId);
  });

  $('#config').on('hidden.bs.modal', '.modal', function (event) {
    // log("config hidden.bs.modal", $(this));
    delete Session.keys['selectTaskId'];
    $(this).removeData('bs.modal');
    $(this).removeAttr('bs.modal');
  });

  this.autorun(function () {
    Meteor.subscribe('getHostUser', ['admin', 'manager', 'advUser', 'user']);   // 当前团队可管理客户的用户
  });

});

Template.workbench_config.onDestroyed(function () {
  delete Session.keys['selectTaskId'];
});

Template.workbench_config.helpers({
  hosts: function () {
    return Meteor.users.find({}).fetch();
  },
  taskInfo: function () {
    var taskId = Session.get('selectTaskId');
    return Tasks.findOne({_id: taskId}) || {};
  }
});

Template.workbench_config.events({
  'click #add_email_btn': function (event, template) {
    var template = Blaze.render(Template.add_email, template.$('#add_email_form').get(0));
  },
  'click #add_tel_btn': function (event, template) {
    var template = Blaze.render(Template.add_tel, template.$('#add_tel_form').get(0));
  },
  'click .delRemind': function (event) {
    $(event.currentTarget).closest(".module").remove();
  },
  'click #settingBtn': function () {
    log('settingBtn')
    var taskId = Session.get('selectTaskId') || "";
    var hostId = $('#hostId').val() || '';
    var emailList = getInputDataList('#add_email_form .add_email', [
        {
          findStr: '.remindTo',
          keyName: 'to',
          validate: {
            func: KEPUtil.validateEmail,
            errMsg: '请输入合法的邮箱！'
          }
        },
        {
          findStr: '.remindRemark',
          keyName: 'other',
          validate: null,
        },
    ]);
    if (!emailList) {
      return;
    }

    var smsList = getInputDataList('#add_tel_form .add_tel', [
      {
        findStr: '.remindTo',
        keyName: 'to',
        validate: {
          func: KEPUtil.validatePhone,
          errMsg: '请输入合法的手机号！'
        }
      },
      {
        findStr: '.remindRemark',
        keyName: 'other',
        validate: null,
      },
    ]);
    if (!smsList) {
      return;
    }

    log(hostId, emailList, smsList);


    Meteor.call('updateTaskBasic',
      taskId, {hostId: hostId, email: emailList || [], sms: smsList || []},
      function (err, res) {
        if (err) {
          alert("更新子任务设置失败！" + err);
        } else {
          $('#config').modal("hide");
        }
    });

  }
});


// 从页面获取通知的信息
function getInputDataList(findStr, childrenList) {

  check(findStr, String);
  check(childrenList, [{
    findStr: String,
    keyName: String,
    validate: Match.Maybe({
      func: Function,
      errMsg: String,
    })
  }]);

  var retList = [];
  var validate = true;
  var errMsg = '';

  $(findStr).each(function () {
    var elem = $(this);
    var pushObj = {};
    childrenList.forEach(function (child) {
      var val = $(elem.find(child.findStr)[0]).val() || '';
      var validateObj = child.validate || false;
      if (validateObj) {
        if (! child.validate.func(val) ) {
          validate = false;
          errMsg = validateObj.errMsg
        } else {
          pushObj[child.keyName] = val;
        }
      } else {
        pushObj[child.keyName] = val;
      }
    });

    if (validate) {
      retList.push(pushObj);
    }
  });

  if (validate) {
    return retList;
  } else {
    alert(errMsg);
    return false;
  }

    // var validate = true;
    // $('#add_email_form .add_email').each(function () {
    //   var elem = $(this);
    //   var email = $(elem.find('.remindEmail')[0]).val() || '';
    //   var remark = $(elem.find('.remindRemark')[0]).val() || '';
    //   log('email', email, 'remark', remark);
    //   if (email && KEPUtil.validateEmail(email)) {
    //     alert('请输入合法的邮箱！');
    //     return;
    //   }
    //   emailList.push({
    //     to: email,
    //     other: remark
    //   });
    // });
}




// 核名列表
// Template.checknameTableCell.onRendered(function () {

// });

// Template.checknameTableCell.helpers({
//   stepStatusShow: function (stepInfo) {
//     var stepStatus  = 'noStart';  // 未开始
//     if (stepInfo.finished) {
//       stepStatus = 'finished';  // 完成
//     } else if (stepInfo.expectTime) {
//       if ( (stepInfo.updateTime - stepInfo.startTime) >= stepInfo.expectTime ) {
//         stepStatus = 'overtime'  // 超时
//       }
//     }

//     return {
//         'noStart': 'circle-gray',
//         'finished': 'circle-gray',
//         'overtime': 'circle-red'
//     }[stepStatus] || '';
//   },
//   stepTimeUsed: function (stepInfo) {
//     if (!stepInfo.startTime) {
//       return '';
//     } else {
//       return KEPUtil.intervalDays(stepInfo.startTime, stepInfo.updateTime) + '天';
//     }
//   },
//   totalTimeUsed: function (stepInfo) {
//     if (stepInfo.updateTime && stepInfo.startTime) {
//       return KEPUtil.intervalDays(stepInfo.updateTime, stepInfo.startTime) + '天';
//     }
//     return '--';
//   }
// });


// // 核名列表
// Template.workbench_checkname.onRendered(function () {
//   // var self = this;
//   // self.autorun(function () {
//   //   var taskType = Session.get('taskType');
//   //   log('workbench_checkname taskType', taskType);
//   //   self.subscribe("getTasks", taskType);
//   // });
// });

// Template.workbench_checkname.helpers({
//   // checkNameInfos: function () {
//   //   log("workbench_checkname this", this);
//   //   return Tasks.find({}).fetch();
//   // }
// });


// // 工商登记列表
// Template.workbench_ICBCregister.helpers({
//   foo: function () {
//     // ...
//   }
// });

// var orderlistsOptions = {
//   columns: [
//   {
//     title: '客户名称',
//     data: 'customername',
//     className: 'customername'
//   },
//   {
//     title: '文件名称',
//     data: "filename"
//   },
//   {
//     title: '客户确认',
//     data: "customerconfirm"
//   },
//   {
//     title: '提交工商',
//     data: "submitICBC"
//   },
//   {
//     title: '核名通过',
//     data: 'checkName'
//   },
//   {
//     title: '申请地址',
//     className: 'applicationAddress',
//     data: 'applicationAddress'
//   },
//   {
//     title: '耗时/天',
//     className: 'Timeconsuming',
//     data: 'orderHost'
//   },
//   {
//     title: '业务员',
//     className: 'salesman',
//     data: 'salesman'
//   },
//   {
//     title: "操作",
//     className: 'handle',
//     render: function(cellData, renderType, currentRow) {
//       if(currentRow.hasOwnProperty("payed") && (currentRow.payed === true || currentRow.payed === "true")) {
//           var orderId = currentRow.orderId;
//           var url='/'+currentRow.typeNameFlag+'/'+orderId;
//           var html = "<a href="+url+">详细信息</a>";
//           return html;
//       } else {
//         return "";
//       }
//     }
//   }
//   ],
//    pageLength: 10,
//    lengthMenu: [ 10, 15, 20, 25, 50 ]
// }

// Template.containsTheDataTable.helpers({
//   orderlistData: function () {
//     return function () {
//       // return Orders.find({payed: true}, {sort: {orderId: -1}}).fetch();
//       return Orders.find({}).fetch();
//     };
//   },
//   optionsObject: orderlistsOptions,
//   ordersLists: function() {
//     return Orders.find({});
//   }
// });

// Template.workbench.helpers({
//   "listNum": function() {
//     return Orders.find({}).count();
//   }
// })

// Template.workbench.onRendered(function () {
//   $.fn.dataTable.ext.search.push(
//     function (settings, data, dataIndex) {
//       var min = $('#start_date').val();
//       var max = $('#last_date').val();
//       var time = data[4];

//       min = Date.parse(min);
//       max = Date.parse(max);
//       time = Date.parse(time);

//       if ((isNaN(min) && isNaN(max)) ||
//         (isNaN(min) && time < max) ||
//         (min < time && isNaN(max)) ||
//         (min < time && time < max)) {
//         return true;
//     }
//     return false;
//   }
//   );

// })
