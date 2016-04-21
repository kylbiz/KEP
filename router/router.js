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



// 客户管理
var customerSection = consoleSection.group({
  prefix: "/customer",
  name: 'customersGroup'
});

customerSection.route('/', {
  name: 'customers'
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
