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
    }

    return items;
  }
});

Template.breadcrumb_workbench.events({
  'click .workbench_change_btn button': function (event) {
    Session.set('taskType', $(event.currentTarget).attr("value")); // 切换子任务
    // console.log($(".workbench_change_btn button").parent());
    // $(".workbench_change_btn button").parent().toggleClass('border-red');
    $('.workbench_change_btn button').parent().removeClass('border-red');
    $(event.currentTarget).parent().addClass('border-red');
  },
  'click #searchBtn': function () {
    var filterStr = $("#searchInput").val() || "";
    log('click #searchBtn', filterStr);

    // var dataFilter = Session.get("dataFilter");
    // if (filterStr) {
    //   var extFilter = {$or : [
    //     // {"name": filterStr},
    //     {"host.name": filterStr},
    //   ]};

    //   Session.set('dataFilter', _.extend(dataFilter, extFilter));
    // } else {
    //   delete dataFilter['$or'];
    //   Session.set('dataFilter',dataFilter);
    // }
  }
});


// 各业务的表单列表
Template.reactiveDataTable.onRendered(function () {
  this.autorun(function () {
    Session.set('tabelCollName', 'Tasks');
    // 批量获取tasks数据
    var dataFilter = {name: Session.get('taskType') || ""};
    Session.set("dataFilter", dataFilter);

    Meteor.subscribe('getTasks', Session.get('dataLimit'), dataFilter);

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


Template.reactiveDataTable.events({
  'click .taskSetting': function (event, template) {
    var taskId = $(event.currentTarget).attr("value");
    // var template = Blaze.toHTMLWithData(Template.workbench_config, {});
    // $("#taskConfig").html(template);

    Blaze.render(Template.workbench_config, $('#taskConfig')[0] );
    Session.set('selectTaskId', taskId);

    // $('#config').on('show.bs.modal', function (event) {
    //   var button = $(event.relatedTarget);
    //   var taskId = button.data("taskid");
    //   Session.set('selectTaskId', taskId);
    // });

    $('#config').on('hidden.bs.modal', function (event) {
      // log("config hidden.bs.modal", $('#add_email_form')[0]);
      delete Session.keys['selectTaskId'];
      $(event.currentTarget).detach();
    });

    $('#config').modal('show');
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
  // $('#config').modal("hide",{
  //   keyborad:true
  // })

  // $('#config').onkeydown(function (event) {
  //   if(event.keyCode == 13 && window.event.srcElement.tagName!="TEXTAREA")
  //     {
  //       event.returnValue=false;
  //     }
  // });

  // $('#config').on('show.bs.modal', function (event) {
  //   var button = $(event.relatedTarget);
  //   var taskId = button.data("taskid");
  //   Session.set('selectTaskId', taskId);
  // });

  // $('#config').on('hidden.bs.modal', function (event) {
  //   log("config hidden.bs.modal", $('#add_email_form')[0]);
  //   delete Session.keys['selectTaskId'];
  //   // $( ".hello" ).remove()
  // });

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
  hostNow: function (hostId) {
    var taskId = Session.get('selectTaskId');
    var taskInfo = Tasks.findOne({_id: taskId}) || {host: {}};
    return ( hostId == taskInfo.host.id ) ? "selected" : "";
  },
  taskInfo: function () {
    var taskId = Session.get('selectTaskId');
    return Tasks.findOne({_id: taskId}) || {};
  }
});

Template.workbench_config.events({
  'click #add_email_btn': function (event, template) {
    log("add_email_btn");
    Blaze.render(Template.add_email, template.$('#add_email_form').get(0));
  },
  'click #add_tel_btn': function (event, template) {
    Blaze.render(Template.add_tel, template.$('#add_tel_form').get(0));
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

    // log(taskId, hostId, emailList, smsList);

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
