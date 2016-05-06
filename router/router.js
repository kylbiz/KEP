// 控制台总URL
var consoleSection = FlowRouter.group({
    prefix: "/console",
    name: 'consoleGroup'
});


// 首页 / 工作台
consoleSection.route('/', {
  name: 'workbench',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "workbench"});
  }
});

// consoleSection.route('/workbench/:tableId', {
//   name: 'workbenchTable',
//   action: function() {
//     BlazeLayout.render("reactiveDataTable",{content: "workbench_checkname"});
//   }
// })

//查看

// 客户管理
var customerSection = consoleSection.group({
  prefix: "/customer",
  name: 'customersGroup'
});

customerSection.route('/', {
  name: 'customers',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "customers"});
  }
});

// 客户基本信息
customerSection.route('/customer_info', {
  name: 'customer_info',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "customer_info"});
  }
});
// 公司信息
customerSection.route('/company_info', {
  name: 'company_info',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "company_info"});
  }
});

customerSection.route('/:customerId');
customerSection.route('/:customerId/setting');
customerSection.route('/:customerId/task');



// 子任务管理
var taskSection = consoleSection.group({
  prefix: "/task",
  name: 'taskGroup'
});

customerSection.route('/:taskType/:taskId');



// 通知中心
var noticeSection = consoleSection.group({
  prefix: "/notice",
  name: 'taskGroup'
});

noticeSection.route('/');
noticeSection.route('/:noticeId');



// 个人中心
consoleSection.route('/account');



// 登录
consoleSection.route('/signin');
// 找回密码
consoleSection.route('/password/forget');



// notfound 页
FlowRouter.notFound = {
  action: function () {
    BlazeLayout.render("notFound");
  }
}




// 团队
consoleSection.route('/team');
