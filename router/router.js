// 控制台总URL
// var FlowRouter = FlowRouter.group({
//     prefix: "/console",
//     name: 'consoleGroup'
// });


// 首页 / 工作台
FlowRouter.route('/', {
  name: 'workbench',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "workbench"});
  }
});
//测试页面
FlowRouter.route('/dragtest', {
  name: 'dragtest',
  action: function() {
    BlazeLayout.render("dragtest");
  }
})


//公司核名
FlowRouter.route('/checkname', {
  name: 'checkname',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "checkname"});
  }
});
//工商登记
FlowRouter.route('/register', {
  name: 'register',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "register"});
  }
});

// FlowRouter.route('/workbench/:tableId', {
//   name: 'workbenchTable',
//   action: function() {
//     BlazeLayout.render("reactiveDataTable",{content: "workbench_checkname"});
//   }
// })

//查看

// 客户管理
var customerSection = FlowRouter.group({
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
customerSection.route('/:customerId/info', {
  name: 'customerInfo',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "customer_info"});
  }
});
// 公司信息
customerSection.route('/:customerId/company', {
  name: 'companyInfo',
  action: function() {
    BlazeLayout.render("mainLayout", {content: "company_info"});
  }
});

customerSection.route('/:customerId');
customerSection.route('/:customerId/setting');
customerSection.route('/:customerId/task');



// 子任务管理
var taskSection = FlowRouter.group({
  prefix: "/task",
  name: 'taskGroup'
});

customerSection.route('/:taskType/:taskId');



// 通知中心
var noticeSection = FlowRouter.group({
  prefix: "/notice",
  name: 'taskGroup'
});

noticeSection.route('/',{
  name: "notice",
  action: function() {
    BlazeLayout.render("mainLayout", {content: "notice"});
  }
});
noticeSection.route('/:noticeId');



// 个人中心
FlowRouter.route('/account', {
  name:'account',
  action: function () {
    BlazeLayout.render("mainLayout", {content:"account"});
  }
});



// 登录
FlowRouter.route('/login',{
  name:'login',
  action: function () {
    BlazeLayout.render("signinLayout",{content:"signin"});
  }
});
// 找回密码
FlowRouter.route('/password/forget',{
  name:'findPwd',
  action:function () {
    BlazeLayout.render("signinLayout",{content:"findPwd"});
  }
});



// notfound 页
FlowRouter.notFound = {
  action: function () {
    BlazeLayout.render("notFound");
  }
}


// 团队
FlowRouter.route('/team',{
  name:'team',
  action:function () {
    BlazeLayout.render("mainLayout", {content:'team'});
  }
});
