Template.workbench.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('');
  });
});

Template.reactiveDataTable.helpers({
	_dynamic: function () {
		return Session.get('workbenchTemplate')||'workbench_checkname';
	}
});


Template.workbench.events({
	'click .workbench_change_btn a'(event) {
		// ...
		event.preventDefault();
		Session.set('workbenchTemplate', $(event.currentTarget).attr("value"));
	}
});

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
