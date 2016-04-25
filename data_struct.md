// 客户信息

```
Customers = new Mongo.Collection('Customers');
// Customer 结构:
customer = {
  name: '',
  host: '',
  createdAt: '',
  contactInfo: {
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  service: { // 服务项目
    companyRegist: '_id', // 公司注册
  },
  companyInfo: '_id', //
  remark: {
    base: ''
  }
}
```

// 公司注册业务

```
CompanyRegist = new Mongo.Collection('CompanyRegist');
struct = {
  name: '',
  host: '', // 负责人
  createdAt: '',
  contactInfo: {
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  remark: '',
  status: 0, // "0 - 准备中", "1 - 受理中", "2 - 已完成"
  payed: true, // 是否付费 有/无
  tasks: [], // 任务
}

```

// 任务信息

```
Tasks = new Mongo.Collection('Tasks');
// Task 结构
struct = {
  name: '', // 如: companyCheckName
  label: '', // 如: 公司核名
  host: 'cc', // 负责人
  createdAt: '',
  updateTime: '',
  remind: { // 通知
    email: [  // 邮件通知
      {
        type: 'email',
        to: '',
        template: '',
        data: {

        },
        other: '',
      },
    ],
    sms: [
      {
        type: 'sms',  // 短信通知
        to: '',
        template: '',
        data: {

        }
      }
    ]
  },
  step: [
    {
      name: '',
      updateTime: '',
      status: '',
      data: {

      }
    }
  ]
}

```


// 公司信息

```
CompanyInfo = new Mongo.Collection('CompanyInfo');
struct = {

}

```

// 通知

```
Notice = new Mongo.Collection('Notice');
struct = {
  type: '', // system - 系统通知 / customer - 客户管理通知
  status: 0, // 1 - 已读，0 - 未读，-1 - 删除
  title: '',
  createdAt: '',
  frontImages: '',
  content: "",
}

```

// 用户meteor包管理创建

```
struct = {
  username: '',
  email: '',
  profile: {
    phone: ''
  },
  roles: [''],
}

```








