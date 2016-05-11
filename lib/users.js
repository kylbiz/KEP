Users = new Mongo.Collection('Users');

var UserSchema = new SimpleSchema({
	userId:{
		type: String,
		label: '用户ID'
	},
	user:{
		type: String,
		label:'用户基本信息'
	},
	'user.nickName':{
		type: String,
		label: '昵称',
		optional: true
	},
	'user.qqNum':{
		type: String,
		label: 'qq',
		optional: true
	},
	'user.phone':{
		type:String,
		label:'电话'
	},
	'user.weixin':{
		type:String,
		label:'微信'
	},
	'user.email':{
		type:String,
		label:'电子邮箱'
	},
	password:{
		type:String,
		label: '密码信息'
	},
	'password.oldPwd':{
		type:String,
		label:'旧密码'
	},
	'password.newPwd':{
		type:String,
		label:'新密码'
	},
	'password.confirmPwd':{
		type:String,
		label:'确认密码'
	}
})

Users.attachSchema(UserSchema);