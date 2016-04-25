Meteor.startup(function () {
  initAdminUser();
});



// 初始化
function initAdminUser() {

  if (Meteor.users.find({}).count()) {
    return;
  }

  var user = {
    name: 'kyl',
    password: 'kyl123',
    phone: '18521595051',
    email: 'air.cui@kyl.biz',
    roles: ['admin'],
  };

  var userId = Accounts.createUser({
    username: user.name,
    password: user.password,
    profile: {
      nickname: user.name,
      phone: user.phone,
      email: user.email,
    }
  });
  Roles.addUsersToRoles(userId, user.roles);
}
