// 控制台总URL
var consoleSection = FlowRouter.group({
    prefix: "/console",
    name: 'consoleGroup'
});


// 首页 / 工作台
consoleSection.route('/', {
  name: 'workbench',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "workbench",workbench_table:"workbench_checkname"});
  }
});

// 工作台 核名表
consoleSection.route('/workbench_checkname', {
  name: 'workbench',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "workbench",workbench_table:"workbench_checkname"});
  }
});
// 工作台 工商登记表
consoleSection.route('/workbench_ICBCregister', {
  name: 'workbench',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "workbench",workbench_table:"workbench_ICBCregister"});
  }
});




//公司核名
consoleSection.route('/checkname', {
  name: 'checkname',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "checkname",application: "application_form"});
  }
});
//公司核名-签字确认
consoleSection.route('/checkname/confirm', {
  name: 'checkname',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "checkname",application: "application_form_confirm"});
  }
});
//公司核名-提交工商
consoleSection.route('/checkname/submitICBC', {
  name: 'checkname',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "checkname",application: "application_form_submitICBC"});
  }
});

//公司核名-核名通过
consoleSection.route('/checkname/checkSucess', {
  name: 'checkname',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "checkname",application: "application_form_checkSucess"});
  }
});

//公司核名-申请通过
consoleSection.route('/checkname/applicationAddress', {
  name: 'checkname',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "checkname",application: "application_form_applicationAddress"});
  }
});

//公司核名-准备公章
consoleSection.route('/checkname/prepareSeal', {
  name: 'checkname',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "checkname",application: "application_form_prepareSeal"});
  }
});


// 公司核名-编辑
consoleSection.route('/checkname/edit', {
  name: 'checkname',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "checkname",application: "application_form_edit"});
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
