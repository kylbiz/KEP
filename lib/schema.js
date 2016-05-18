Schema = {};

Schema.customers = new SimpleSchema({
  "name": {
    type: String,
    label: '客户名称',
  },
  "host": {
    type: Object,
    label: '客户负责人'
  },
  "host.name": {
    type: String,
    label: '姓名',
  },
  "host.id": {
    type: String,
    label: 'ID',
  },
  "hostpersoon":{
    type:String,
    label: '负责人',
    autoform:{
         type: 'select',
         firstOption: false,
         options: function() {
           return [
             {label: 'cc', value: 'cc'},
             {label: 'windy', value: 'windy'}
           ]
         }
    }
  },
  "createdAt": {
    type: Date,
    label: '创建时间',
  },
  "createdBy": {
    type: String,
    label: '创建人'
  },
  "contactInfo": {
    type: Object,
    label: '联系人',
  },
  "contactInfo.name": {
    type: String,
    label: '名称'
  },
  "contactInfo.address": {
    type: String,
    label: '地址'
  },
  "contactInfo.phone": {
    type: String,
    label: '电话'
  },
  "contactInfo.email": {
    type: String,
    label: '邮箱'
  },
  "service": {
    type: Array,
    label: '需办理的业务',
  },
  "service.$": {
    type: Object,
    label: '业务'
  },
  "service.$.type": {
    type: String,
    label: '类型',
  },
  "service.$.id": {
    type: String,
    label: 'ID'
  },
  "form": {
    type: String,
    label: "客户来源"
  },
  "remark": {
    type: String,
    label: "备注 "
  }
});
