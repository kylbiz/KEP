/*
 * 路由相关的控制
 ***/


FlowRouter.triggers.enter([loginPermission], {except: ['login', 'findPwd']});
FlowRouter.triggers.exit([setLastPath], {except: ['login', 'findPwd']});

// 登录权限
function loginPermission() {
  log('loginPermission', Meteor.userId());
  if(!Meteor.userId()) {
    // 未登录
    FlowRouter.go("login");
  } else if (FlowRouter.current().route.name == "login") {
    // 已登录了就不允许调转到login界面
    FlowRouter.go(Session.get('lastPath') || "/" );
  }
}

// 记录即将离开的路由的地址
function setLastPath() {
  Session.set('lastPath', FlowRouter.current().route.path);
}

