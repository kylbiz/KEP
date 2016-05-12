/*
 * 路由相关的控制
 ***/


FlowRouter.triggers.exit([setLastPath]);
FlowRouter.triggers.enter([loginPermission]);

// 登录权限
function loginPermission() {
  if(!Meteor.userId()) {
    FlowRouter.go("login");
  }
}

// 记录即将离开的路由的地址
function setLastPath() {
  log("FlowRouter.current().route", FlowRouter.current().route.path);
}
