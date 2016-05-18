Template.workbench.onRendered(function() {
  var self = this;
  self.autorun(function () {
    self.subscribe("getSupportInfo", {type: 'task', service: 'companyRegist'});
    // 任务信息
    var taskType = Session.get('taskType') || "checkName";
    self.subscribe("getTasksByType", taskType);

    // 客户信息
  });
});


Template.breadcrumb_workbench.helpers({
  tasks: function () {
    var supportInfo = SupportInfo.findOne({}) || {items: []};
    return supportInfo.items || [];
  }
});


Template.reactiveDataTable.helpers({
	_dynamic: function () {
    if (!Session.get('taskType')) {
      // var type = SupportInfo.findOne({}).items[0].name;
      var type = false;
      Session.set('taskType', type || "checkName");
    }

    var taskType = Session.get('taskType');

    return {
      'checkName': 'workbench_checkname',
      'regist': 'workbench_ICBCregister'
    }[taskType];
  },
  templateData: function () {
    log("dataTempl", Tasks.find({}).fetch());
    var tasks = Tasks.find({}).fetch();
    var dataInfos = [];
    return dataInfos;
  }
});


Template.workbench.events({
	'click .workbench_change_btn a'(event) {
		event.preventDefault();
		Session.set('taskType', $(event.currentTarget).attr("value"));
	}
});



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
