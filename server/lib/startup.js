/*
 * 系统的一些初始化操作
 **/

Meteor.startup(function() {
    //initAccount();   // 初始化管理员
    initSupportInfo(); // 初始化相关的辅助信息
    Test.testData(); // 测试数据
});


// 初始化
function initAccount() {
    if (Meteor.users.findOne() || UsersTeam.findOne()) {
        return;
    }

    var user = {
        name: 'kyl',
        password: 'kyl123',
        phone: '18521595051',
        email: 'air.cui@kyl.biz',
    };

    var team = {
        name: 'default', // 群组名
        remark: '测试用群组', // 备注
    }

    KAccount.createTotalNewUser(team, user);
}


// 辅助信息
function initSupportInfo() {
    var retInfo = getSupportInfo();

    // 具体步骤信息的schema
    StepInfosSchema.remove({ createdBy: 'default' });
    var stepInfosSchema = retInfo.stepInfosSchema || [];
    KUtil.insertListToColl(stepInfosSchema, StepInfosSchema);

    // 不同任务的步骤
    TaskSteps.remove({ createdBy: 'default' });
    var taskSteps = retInfo.taskSteps || [];
    KUtil.insertListToColl(taskSteps, TaskSteps, function(taskStep) {
        taskStep.startTime = new Date();
        taskStep.updateTime = new Date();
        return taskStep;
    });

    //  其他辅助信息
    SupportInfo.remove({});
    var supportInfo = retInfo.supportInfo || [];
    KUtil.insertListToColl(supportInfo, SupportInfo);
}


// 子任务
function getSupportInfo() {
    return {
        'taskSteps': [{ // 核名预设步骤
            type: 'companyCheckName',
            createdBy: 'default',
            stepsDes: ['资料填写', '签字确认', '提交工商', '核名通过', '申请地址', '准备公章'],
            steps: [{
                name: '资料填写',
                startTime: '',
                updateTime: '',
                mark: 'inputData', // 标记必要的操作
                finished: false, // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
                dataStruct: 'stepInfoCompanyCheckName', // 待录入数据的结构
                data: {},
            }, {
                name: '签字确认',
                startTime: '',
                updateTime: '',
                finished: false, // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
                dataStruct: 'stepInfoCustomerConfirm', // 待录入数据的结构
                data: {},
            }, {
                name: '提交工商',
                startTime: '',
                updateTime: '',
                mark: 'submitFiles',
                hooks: ['subCompanyName'],  // 确认完成的时候需要进行的操作
                finished: false, // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
                dataStruct: 'stepInfoGovSubmit', // 待录入数据的结构
                data: {},
            }, {
                name: '核名通过',
                startTime: '',
                updateTime: '',
                mark: 'pass',
                finished: false, // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
                dataStruct: 'stepInfoCheckNamePass', // 待录入数据的结构
                data: {},
            }, {
                name: '申请地址',
                startTime: '',
                updateTime: '',
                mark: 'companyAddress',
                finished: false, // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
                dataStruct: 'stepInfoCompanyAddress', // 待录入数据的结构
                data: {},
            }, {
                name: '准备公章',
                startTime: '',
                updateTime: '',
                hooks: ['copyCheckNameInfoToCompany'], // 确认完成的时候需要进行的操作
                finished: false, // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
                dataStruct: 'stepInfoOfficialSeal', // 待录入数据的结构
                data: {},
            }, ]
        }, { // 工商登记预设步骤
            type: 'companyRegistInfo',
            createdBy: 'default',
            stepsDes: ['资料填写', '签字确认', '提交工商', '登记通过'],
            steps: [{
                name: '资料填写',
                startTime: '',
                updateTime: '',
                mark: 'inputData',
                finished: false, // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
                dataStruct: 'stepInfoCompanyRegistInfo', // 待录入数据的结构
                data: {},
            }, {
                name: '签字确认',
                startTime: '',
                updateTime: '',
                finished: false, // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
                dataStruct: 'stepInfoCustomerConfirm', // 待录入数据的结构
                data: {},
            }, {
                name: '提交工商',
                startTime: '',
                updateTime: '',
                mark: 'submitFiles',
                hooks: ['subCompanyName'],  // 确认完成的时候需要进行的操作
                finished: false, // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
                dataStruct: 'stepInfoGovSubmit', // 待录入数据的结构
                data: {},
            }, {
                name: '登记通过',
                startTime: '',
                updateTime: '',
                mark: 'pass',
                hooks: ['copyRegisterInfoToCompany'],  // 确认完成的时候需要进行的操作
                finished: false, // 该步骤是否完成，可以是用户手动点击完成，也可以是系统检测确认完成
                dataStruct: 'stepInfoCompanyRegistPass', // 待录入数据的结构
                data: {},
            }, ]
        }, ],
        'stepInfosSchema': [{ // 公司核名申请书资料
            _id: 'stepInfoCompanyCheckName',
            createdBy: 'default', // 系统定义 用户自定义的用 'customer'
            schema: {
                'company': {
                    type: "Object",
                    label: "公司基本信息",
                    optional: true
                },
                'company-zone': {
                    type: "String",
                    label: '注册区域',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '虹口', value: '虹口' },
                            { label: '浦东', value: '浦东' }
                        ]
                    }
                },
                "company-type": {
                    type: "String",
                    label: '公司类型',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '有限责任公司', value: '有限责任公司' },
                            { label: '有限合伙', value: '有限合伙' }
                        ]
                    }
                },
                "company-nativeName": {
                    type: "String",
                    label: '公司名称（必填）'
                },
                'company-alternativeName': {
                    type: "Array",
                    minCount: 0,
                    maxCount: 10,
                    label: "备选企业字号",
                    optional: true
                },
                "company-alternativeName-$": {
                    type: "Object",
                    optional: true
                },
                "company-alternativeName-$-name": {
                    type: "String",
                    label: "备选字号",
                    minCount: 0,
                    maxCount: 10,
                    optional: true
                },
                'company-moneyAmount': {
                    type: "Number",
                    label: '注册资本(单位：万元，必填)'
                },
                "company-industryType": {
                    type: "String",
                    label: '行业类型',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '网络科技', value: '网络科技' },
                            { label: '生物技术', value: '生物技术' },
                        ]
                    }
                },
                'company-nameStruct': {
                    type: "String",
                    label: "公司名称结构",
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '<公司名>(<地区>)<行业类型><公司性质>', value: 'name-area-industry-type' },
                            { label: '<地区><公司名><行业类型><公司性质>>', value: 'area-name-industry-type' },
                        ]
                    }
                },
                'company-businessScope': {
                    type: "String",
                    label: '经营范围',
                    optional: true,
                    min: 0,
                    max: 1000,
                    autoform: {
                        rows: 5
                    }
                },
                'company-address': {
                    type: "String",
                    label: '地 址',
                    optional: true
                },
                "holders": {
                    type: "Array",
                    minCount: 0,
                    maxCount: 10,
                    label: "股东信息（必填）",
                },
                "holders-$": {
                    type: "Object",
                    label: '添加股东'
                },
                "holders-$-name": {
                    type: "String",
                    label: "股东名称或姓名"
                },
                "holders-$-ID": {
                    type: "String",
                    label: "证照号码",
                    min: 18,
                    max: 18
                }
            }
        }, { // 工商登记资料
            _id: 'stepInfoCompanyRegistInfo',
            createdBy: 'default',
            schema: {
                "company": {
                    type: "Object",
                    label: "公司基本信息",
                    optional: true
                },
                "company-zone": {
                    type: "String",
                    label: '注册区域（必填）',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '虹口', value: '虹口' },
                            { label: '浦东', value: '浦东' }
                        ]
                    }
                },
                "company-name": {
                    type: "String",
                    label: '公司名称（必填）'
                },
                "company-type": {
                    type: "String",
                    label: '公司类型',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '有限责任公司', value: '有限责任公司' },
                            { label: '有限合伙', value: '有限合伙' }
                        ]
                    }
                },
                'company-companyId': {
                    type: "String",
                    label: '名称预先核准文号/注册号/统一社会信用代码',
                    optional: true
                },
                'company-tel': {
                    type: "String",
                    label: '联系电话（必填）'
                },
                'company-moneyAmount': {
                    type: "Number",
                    label: '注册资本(单位：万元，必填)'
                },
                'company-businessScope': {
                    type: "String",
                    label: '经营范围',
                    optional: true,
                    min: 0,
                    max: 1000,
                    autoform: {
                        rows: 5
                    }
                },
                'company-businessPeriod': {
                    type: "String",
                    label: '经营期限',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '10年', value: '10年' },
                            { label: '20年', value: '20年' },
                            { label: '长期', value: '长期' }
                        ]
                    }
                },
                'company-address': {
                    type: "String",
                    label: '地 址',
                    optional: true
                },
                'company-productionAddress': {
                    type: "String",
                    label: '生产经营地',
                    optional: true
                },

                "legalPerson": {
                    type: "Object",
                    label: '法人（必填）',
                    optional: true
                },
                "legalPerson-name": {
                    type: "String",
                    label: '法定代表人姓名'
                },
                "legalPerson-tel": {
                    type: "String",
                    label: '固定电话',
                    optional: true
                },
                "legalPerson-phone": {
                    type: "String",
                    label: '移动电话（必填）'
                },
                "legalPerson-email": {
                    type: "String",
                    label: '电子邮箱',
                    optional: true,
                    autoform: {
                        afFieldInput: {
                            type: "email"
                        }
                    }
                },
                "legalPerson-IDType": {
                    type: "String",
                    label: '身份证类型',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '身份证', value: '身份证' }
                        ]
                    }
                },
                "legalPerson-ID": {
                    type: "String",
                    label: '身份证号码（必填）'
                },
                "chairman": {
                    type: "Object",
                    label: '董事',
                    optional: true
                },
                "chairman-name": {
                    type: "String",
                    label: '董事姓名',
                    optional: true
                },
                "chairman-type": {
                    type: "String",
                    label: '董事职务',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '执行董事', value: '执行董事' }
                        ]
                    }
                },
                "chairman-IDType": {
                    type: "String",
                    label: '董事身份证类型',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '身份证', value: '身份证' }
                        ]
                    }
                },
                "chairman-ID": {
                    type: "String",
                    label: '董事身份证号码',
                    optional: true
                },
                "chairman-phone": {
                    type: "String",
                    label: "董事手机号码",
                    optional: true
                },
                "supervisor": {
                    type: "Object",
                    label: '监事（必填）',
                    optional: true
                },
                "supervisor-name": {
                    type: "String",
                    label: '监事姓名（必填）'
                },
                "supervisor-type": {
                    type: "String",
                    label: '监事职务',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '监事', value: '监事' }
                        ]
                    }
                    // defaultValue: function() {
                    //   return '监事';
                    // }
                },
                "supervisor-IDType": {
                    type: "String",
                    label: '监事身份证类型',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '身份证', value: '身份证' }
                        ]
                    }
                },
                "supervisor-ID": {
                    type: "String",
                    label: '监事身份证号码（必填）'
                },

                "manager": {
                    type: "Object",
                    label: "经理",
                    optional: true
                },
                "manager-name": {
                    type: "String",
                    label: "经理姓名",
                    optional: true
                },
                "manager-type": {
                    type: "String",
                    label: '经理职务',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '经理', value: '经理' }
                        ]
                    }
                },
                "manager-IDType": {
                    type: "String",
                    label: '经理身份证类型',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '身份证', value: '身份证' },
                        ]
                    }
                },
                "manager-ID": {
                    type: "String",
                    label: '经理身份证号码',
                    optional: true
                },

                "holders": {
                    type: "Array",
                    minCount: 0,
                    maxCount: 10,
                    label: "股东信息(必填)",
                    optional: true
                },
                "holders-$": {
                    type: "Object",
                    optional: true
                },
                "holders-$-name": {
                    type: "String",
                    label: "股东（发起人）名称或姓名"
                },

                "holders-$-IDType": {
                    type: "String",
                    label: "证件类型",
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '身份证', value: '身份证' }
                        ]
                    }
                },
                "holders-$-ID": {
                    type: "String",
                    label: "证照号码"
                },
                "holders-$-investType": {
                    type: "String",
                    label: '出资方式',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '货币', value: '货币' }
                        ]
                    }
                },
                "holders-$-investShare": {
                    type: "Number",
                    label: '占股比例(%)',
                    decimal: true
                },

                "contractor": {
                    type: "Object",
                    label: '联络员',
                    optional: true
                },
                "contractor-name": {
                    type: "String",
                    label: '联络员姓名',
                    optional: true
                },
                "contractor-tel": {
                    type: "String",
                    label: '固定电话',
                    optional: true
                },
                "contractor-phone": {
                    type: "String",
                    label: '移动电话',
                    optional: true
                },
                "contractor-email": {
                    type: "String",
                    label: '电子邮箱',
                    optional: true,
                    autoform: {
                        afFieldInput: {
                            type: "email"
                        }
                    }
                },
                "contractor-IDType": {
                    type: "String",
                    label: '身份证件类型',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '身份证', value: '身份证' }
                        ]
                    }
                },
                "contractor-ID": {
                    type: "String",
                    label: '身份证件号码',
                    optional: true
                },

                "financialStaff": {
                    type: "Object",
                    label: '财务负责人',
                    optional: true
                },
                "financialStaff-name": {
                    type: "String",
                    label: '联络员姓名',
                    optional: true
                },
                "financialStaff-tel": {
                    type: "String",
                    label: '固定电话',
                    optional: true
                },
                "financialStaff-phone": {
                    type: "String",
                    label: '移动电话',
                    optional: true
                },
                "financialStaff-email": {
                    type: "String",
                    label: '电子邮箱',
                    optional: true,
                    autoform: {
                        afFieldInput: {
                            type: "email"
                        }
                    }
                },
                "financialStaff-IDType": {
                    type: "String",
                    label: '身份证件类型',
                    optional: true,
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '身份证', value: '身份证' }
                        ]
                    }
                },
                "financialStaff-ID": {
                    type: "String",
                    label: '身份证件号码',
                    optional: true
                }
            }
        }, { // 公司核名 - 客户确认
            _id: 'stepInfoCustomerConfirm',
            createdBy: 'default',
            schema: {
                name: {
                    type: "String",
                    label: '签字或确认人',
                },
                time: {
                    type: "Date",
                    label: '时间',
                }
            }
        }, { // 公司核名 - 提交工商
            _id: 'stepInfoGovSubmit',
            createdBy: 'default',
            schema: {
                time: {
                    type: "Date",
                    label: '提交时间'
                }
            }
        }, { // 公司核名 - 核名通过
            _id: 'stepInfoCheckNamePass',
            createdBy: 'default',
            schema: {
                companyName: {
                    type: "String",
                    label: '申请通过的企业名称'
                },
                companyId: {
                    type: "String",
                    label: "名称预先核准文号"
                }
            }
        }, { // 公司核名 - 申请地址
            _id: 'stepInfoCompanyAddress',
            createdBy: 'default',
            schema: {
                companyAddress: {
                    type: "String",
                    label: '企业地址',
                }
            }
        }, { //  公司核名 - 公章准备
            _id: 'stepInfoOfficialSeal',
            createdBy: 'default',
            schema: {
                financial: {
                    type: Boolean,
                    defaultValue: false,
                    label: "财务章",
                    autoform: {
                        type: 'boolean-checkbox'
                    }
                },
                corporate: {
                    type: Boolean,
                    defaultValue: false,
                    label: "法人章",
                    autoform: {
                        type: 'boolean-checkbox'
                    }
                },
                company: {
                    type: Boolean,
                    defaultValue: false,
                    label: "公司章",
                    autoform: {
                        type: 'boolean-checkbox'
                    }
                }
            }
        }, { // 工商登记 - 登记通过
            _id: 'stepInfoCompanyRegistPass',
            createdBy: 'default',
            schema: {
                registPass: {
                    type: "Boolean",
                    label: '确认登记通过',
                    autoform: {
                        type: 'select',
                        firstOption: false,
                        options: [
                            { label: '未确认', value: false },
                            { label: '确认', value: true }
                        ]
                    }
                }
            }
        }],
        'supportInfo': [{
            type: 'service',
            items: [
                { name: 'companyRegist', label: '公司注册' },
                // { name: 'financeAgent', label: '财务代理' },
            ]
        }, {
            type: 'task',
            service: 'companyRegist',
            items: [
                { name: 'companyCheckName', label: '核名' },
                { name: 'companyRegistInfo', label: '工商登记' },
            ]
        }, {
            type: 'stepBackReason',
            items: [
                { name: '客户更改需求', label: '客户更改需求' },
                { name: '工商提交失败', label: '工商提交失败' },
                { name: '我方操作失误', label: '我方操作失误' },
                { name: '其他', label: '其他' }
            ]
        }, {
            type: 'industryBig',
            items: ['管理类', '科技类', '广告类', '咨询类', '贸易类', '工程类', '服务类', '代理类', '设计类']
        }, {
            type: 'industryDetail',
            items: [{ industryBig: '科技类', industrySmall: '信息科技', content: ['从事信息科技', '网络科技', '软件科技', '教育科技领域内的技术开发', '技术咨询', '技术服务', '技术转让', '网页设计', '企业管理咨询', '摄影服务', '电信建设工程专业施工', '通讯设备（除卫星电视广播地面接收设施）', '电子产品', '计算机', '软件及辅助设备的批发，零售', '电子商务（不得从事增值电信，金融业务）', '自有设备租赁（不得从事金融租赁）'] }, { industryBig: '科技类', industrySmall: '生物科技', content: ['技术开发', '技术咨询', '技术转让', '技术服务，化工原料及产品（除危险化学品', '监控化学品', '烟花爆竹', '民用爆炸物品', '易制毒化学品）', '纺织原料', '洗涤用品', '实验室设备', '一类医疗器械批发零售'] }, { industryBig: '科技类', industrySmall: '电子科技', content: ['技术开发', '技术咨询', '技术服务', '技术转让', '环保材料', '绝缘材料', '金属材料', '塑胶制品', '五金制品', '包装材料', '机械设备及配件', '文具用品', '一般劳防用品', '化工原料及产品（除危险化学品', '监控化学品', '烟花爆竹', '民用爆炸物品', '易制毒化学品）的批发', '零售'] }, { industryBig: '科技类', industrySmall: '生物科技', content: ['技术开发', '技术咨询', '技术转让', '技术服务', '化工原料及产品（除危险化学品', '监控化学品', '烟花爆竹', '民用爆炸物品', '易制毒化学品）', '纺织原料', '洗涤用品', '实验室设备', '一类医疗器械批发', '零售'] }, { industryBig: '科技类', industrySmall: '网络科技', content: ['技术开发', '技术咨询', '技术服务', '技术转让，监控设备', '家用电器', '机电设备', '五金交电', '电线电缆', '通讯设备（除卫星电视广播地面接收设施）', '计算机', '软件及辅助设备（除计算机信息系统安全专用产品）', '电子产品的批发', '零售，电子商务（不得从事增值电信', '金融业务），计算机网络工程施工'] }, { industryBig: '科技类', industrySmall: '智能科技', content: ['技术开发', '技术咨询', '技术服务', '技术转让，计算机信息系统集成，管道建设工程专业施工，建筑智能化建设工程专业施工，计算机网络工程施工，环保建设工程专业施工，计算机', '软件及辅助设备（除计算机信息系统安全专用产品）', '锅炉及辅助设备', '自动化设备', '管道', '控制设备的批发', '零售'] }, { industryBig: '科技类', industrySmall: '印务科技', content: ['技术开发', '技术咨询', '技术服务', '技术转让，设计', '制作各类广告，电脑图文设计', '制作，美术设计，企业形象策划，展览展示服务，纸制品', '包装材料', '印刷设备', '计算机', '软件及辅助设备（除计算机信息系统安全专用产品）', '办公设备，工艺礼品', '电子产品的批发', '零售'] }, { industryBig: '科技类', industrySmall: '医疗科技', content: ['技术开发', '技术咨询', '技术服务', '技术转让，资产管理，实业投资，投资管理，投资信息咨询（除经纪），商务信息咨询，接受金融机构委托从事金融技术外包，接受金融机构委托从事金融业务流程外包，接受金融机构委托从事金融知识流程外包，展览展示服务，会务服务，翻译服务，企业形象策划，文化艺术交流策划，日用百货', '工艺礼品', '机械设备的的批发', '零售，设计', '制作', '代理', '发布各类广告，企业管理服务，从事货物进出口及技术进出口业务'] }, { industryBig: '科技类', industrySmall: '环保科技', content: ['技术开发', '技术咨询', '技术服务', '技术转让，保洁服务，园林绿化工程施工，照明设备', '化工产品及原料（除危险化学品', '监控化学品', '烟花爆竹', '民用爆炸物', '易制毒化学品）', '日用百货', '消毒设备', '卫生洁具', '空气净化设备的批发', '零售，害虫防治服务'] }, { industryBig: '科技类', industrySmall: '化工科技', content: ['技术开发', '技术咨询', '技术转让', '技术服务', '水性涂料（除油漆）', '化工原料及产品（除危险化学品', '监控化学品', '烟花爆竹', '民用爆炸物品', '易制毒化学品）', '油墨', '燃料油（除危险化学品）', '润滑油', '五金交电', '电动工具', '电器设备', '喷涂设备', '包装材料', '印刷器材', '金属材料', '洗涤用品', '清洁用品', '塑料制品', '橡胶制品', '电子产品的批发', '零售', '货物运输代理', '危险化学品经营（具体项目见许可证）'] }, { industryBig: '科技类', industrySmall: '新材料科技', content: ['技术开发', '技术咨询', '技术服务', '技术转让'] }, { industryBig: '科技类', industrySmall: '教育科技', content: ['技术开发', '技术咨询', '技术转让', '技术服务，计算机信息系统集成，商务信息咨询，企业管理咨询，系统内职（员）工培训，家政服务（不得从事职业中介，医疗，餐饮，住宿等前置性行政许可事项），电子元器件', '机电产品', '电线电缆', '服装服饰的批发', '零售，从事货物进出口及技术进出口业务'] }, { industryBig: '广告类', industrySmall: '文化传播', content: ['文化艺术交流策划', '设计', '制作', '代理', '发布各类广告', '自有设备租赁（不得从事金融租赁）', '市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）', '商务信息咨询', '产品包装设计', '电子商务（不得从事增值电信，金融业务）', '公关活动策划', '会务服务', '木制建设工程作业', '砌筑建设工程作业', '抹灰建设工程作业', '油漆建设工程作业', '钢筋建设工程作业', '混凝土建设工程作业', '模板建设工程作业', '焊接建设工程作业', '水暖电安装建设工程作业', '脚手架建设工程作业', '桥梁建设工程专业施工', '隧道建设工程专业施工', '创意服务', '绿化养护', '从事建筑科技', '智能化科技领域内的技术开发', '技术咨询', '技术服务', '技术转让', '系统内职（员）工培训', '办公用品', '乐器', '文具用品', '体育用品', '玩具批发', '零售'] }, { industryBig: '广告类', industrySmall: '广告', content: ['设计', '制作', '代理', '发布各类广告', '文化用品', '服装', '饰品', '玩具', '家用电器', '五金交电', '计算机软硬件及附件（除计算机信息系统安全专用产品）', '通讯器材（不含卫星广播电视地面接收设施）', '百货批发', '零售', '企业投资管理咨询（除经纪）', '市场营销策划', '会展会务服务', '商务信息咨询', '图文设计', '企业形象策划'] }, { industryBig: '广告类', industrySmall: '文化传媒', content: ['设计', '制作', '代理', '发布各类广告', '公关活动策划', '体育赛事活动策划', '个人形象策划', '企业形象策划', '市场营销策划', '摄影服务', '摄像服务', '婚庆服务', '礼仪服务', '翻译服务', '展览展示服务', '会务服务', '文化艺术交流策划', '商务信息咨询', '建筑装饰装修建设工程设计与施工', '市政公用建设工程施工', '园林绿化工程施工', '网页设计', '计算机网络工程施工', '工艺礼品设计', '电脑图文设计', '制作', '舞台艺术造型策划', '电影发行'] }, { industryBig: '广告类', industrySmall: '文化发展', content: ['文化艺术交流策划', '系统内职（员）工培训', '从事信息科技领域内的技术开发', '技术咨询', '技术服务', '技术转让', '商务信息咨询', '展览展示服务', '市场营销策划', '企业形象策划', '图文设计', '制作', '会务服务', '礼仪服务', '投资管理', '工艺礼品', '电子产品', '日用百货批发', '零售'] }, { industryBig: '广告类', industrySmall: '图文设计制作', content: ['图文设计', '制作', '利用自有媒体发布广告', '会务服务', '展览展示服务', '礼仪服务', '企业形象策划', '市场营销策划', '产品包装设计', '从事印务科技领域内的技术开发', '技术咨询', '技术转让', '技术服务', '设计', '制作各类广告', '包装材料', '文具用品', '体育用品', '办公用品', '服装', '鞋帽的批发', '零售'] }, { industryBig: '广告类', industrySmall: '广告设计', content: ['设计', '制作', '代理', '发布各类广告', '图文设计', '制作', '文化艺术交流策划', '展示设计服务', '展览展示服务', '布景设计', '制作', '舞台艺术造型策划', '标识标牌设计', '制作（限分支机构经营）', '灯光设计', '城市及道路照明建设工程专业施工', '照明建设工程专项设计', '灯具灯饰', '电子产品的批发', '零售'] }, { industryBig: '广告类', industrySmall: '广告制作', content: ['设计', '制作各类广告', '利用自有媒体发布广告', '企业形象策划', '文化艺术交流策划', '礼仪服务', '会务服务', '展览展示服务', '市场营销策划', '舞台灯光设计', '风景园林建设工程专项设计', '动漫设计', '翻译服务', '图文设计', '制作', '标牌制作（限分支机构经营）', '建筑装饰装修建设工程设计与施工', '钢结构建设工程专业施工', '建筑幕墙建设工程专业施工'] }, { industryBig: '广告类', industrySmall: '广告设计制作', content: ['设计', '制作', '代理', '发布各类广告', '图文设计', '制作', '文化艺术交流策划', '展示设计服务', '展览展示服务', '布景设计', '制作', '舞台艺术造型策划', '标识标牌设计', '制作（限分支机构经营）', '灯光设计', '城市及道路照明建设工程专业施工', '照明建设工程专项设计', '灯具灯饰', '电子产品的批发', '零售'] }, { industryBig: '广告类', industrySmall: '广告传媒', content: ['设计', '制作', '代理', '发布各类广告', '电脑图文设计', '制作', '企业形象策划', '市场营销策划', '展览展示服务', '企业管理咨询'] }, { industryBig: '设计类', industrySmall: '装饰设计', content: ['建筑装饰装修建设工程设计与施工', '工艺礼品的制造', '加工（以上限分支机构经营）', '墙纸', '窗帘', '工艺礼品', '灯具的批发', '零售'] }, { industryBig: '设计类', industrySmall: '建筑设计', content: ['建筑工程设计与施工', '室内装饰设计与施工', '景观工程设计与施工', '园林绿化工程施工', '道路建设', '市政工程施工', '商务信息咨询'] }, { industryBig: '设计类', industrySmall: '图文设计', content: ['图文设计', '制作', '利用自有媒体发布广告', '会务服务', '展览展示服务', '礼仪服务', '企业形象策划', '市场营销策划', '产品包装设计', '从事印务科技领域内的技术开发', '技术咨询', '技术转让', '技术服务', '设计', '制作各类广告', '包装材料', '文具用品', '体育用品', '办公用品', '服装', '鞋帽的批发', '零售'] }, { industryBig: '设计类', industrySmall: '景观设计', content: ['风景园林建设工程专项设计', '从事建筑工程技术领域内的技术咨询', '建筑装修装饰建设工程专业施工', '建筑装饰建设工程专项设计'] }, { industryBig: '设计类', industrySmall: '建筑工程设计', content: ['建筑专业设计', '工程勘察设计', '城市规划设计', '风景园林建设工程专项设计', '建筑装饰建设工程专项设计', '市政专业建设工程设计', '工程项目服务', '建筑工程造价咨询', '建筑工程检测', '从事建筑工程技术领域内的技术开发', '技术转让', '技术咨询', '技术服务'] }, { industryBig: '设计类', industrySmall: '艺术设计', content: ['模型设计', '设计', '制作各类广告', '利用自有媒体发布广告', '展览展示服务', '室内装潢'] }, { industryBig: '设计类', industrySmall: '创意设计', content: ['创意设计', '空间艺术设计', '服装设计', '模型设计', '电脑图文设计', '制作', '建筑专业建设工程设计', '美术设计', '产品包装设计', '建筑装饰建设工程专项设计', '文化艺术交流策划', '市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）', '市场营销策划', '企业形象策划', '品牌策划', '设计', '制作', '代理', '发布各类广告', '日用百货', '工艺礼品的批发', '零售'] }, { industryBig: '设计类', industrySmall: '空间设计', content: ['建筑装饰装修建设工程设计与施工', '园林绿化工程施工', '企业形象策划', '美术设计', '设计', '制作', '代理', '发布各类广告', '建筑材料', '装潢材料', '家居用品', '布艺制品', '珠宝首饰的批发', '零售'] }, { industryBig: '设计类', industrySmall: '建筑装潢设计', content: ['建筑装修装饰建设工程专业施工', '建筑智能化建设工程设计施工一体化', '机电安装建设工程施工', '园林绿化工程施工', '环保建设工程专业施工', '市政公用建设工程施工', '土石方建设工程专业施工', '河湖整治建设工程专业施工', '风景园林建设工程专项设计', '电脑图文设计', '制作', '建筑装饰材料', '五金交电', '机电产品', '环保设备的批发', '零售'] }, { industryBig: '咨询类', industrySmall: '商务咨询', content: ['商务信息咨询', '企业管理咨询', '从事计算机信息技术科技领域内的技术服务', '技术咨询', '技术开发', '技术转让', '投资信息咨询（除经纪）'] }, { industryBig: '咨询类', industrySmall: '企业管理咨询', content: ['企业管理咨询', '计算机网络工程施工', '建筑智能化建设工程专业施工', '电子商务（不得从事增值电信', '金融业务）', '从事计算机信息科技', '电子科技领域内的技术开发', '技术咨询', '技术服务', '技术转让', '计算机软件开发', '市场营销策划', '会务服务', '展览展示服务', '计算机', '软件及辅助设备（除计算机信息系统安全专业产品）', '机械设备及配件的批发', '零售'] }, { industryBig: '咨询类', industrySmall: '投资咨询', content: ['投资信息咨询（除经纪）', '实业投资', '投资管理', '企业管理咨询', '人才咨询（不得从事人才中介', '职业中介）', '商务信息咨询', '市场营销策划', '会务服务', '汽车租赁（不得从事金融租赁）'] }, { industryBig: '咨询类', industrySmall: '信息咨询', content: ['商务信息咨询', '投资信息咨询（除经纪）', '投资管理', '企业管理咨询', '文化艺术交流策划', '公关活动策划', '市场营销策划', '企业营销策划', '企业形象策划', '市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）', '设计', '制作各类广告', '利用自有媒体发布广告', '会务服务', '礼仪服务', '婚庆服务', '翻译服务', '展览展示服务'] }, { industryBig: '咨询类', industrySmall: '财务咨询', content: ['财务咨询（不得从事代理记账）', '投资管理', '商务信息咨询', '投资信息咨询（除经纪）', '企业管理咨询', '电子商务（不得从事增值电信，金融业务）', '实业投资', '会务服务', '展览展示服务', '市场营销策划', '翻译服务', '资产管理', '日用百货', '文具用品', '电子产品的批发', '零售'] }, { industryBig: '咨询类', industrySmall: '投资管理咨询', content: ['投资管理', '投资信息咨询（除经纪）', '企业管理咨询', '商务信息咨询', '财务咨询（不得从事代理记账）', '市场信息咨询与调查（不得从事社会调查', '社会调研', '民意调查', '民意测验）', '展览展示服务', '会务服务', '电子商务（除增值电信', '金融业务）', '金融信息服务（金融业务除外）', '接受金融机构委托从事金融信息技术外包', '接受金融机构委托从事金融业务流程外包', '接受金融机构委托从事金融知识流程外包', '从事信息科技', '计算机科技', '网络技术领域内的技术开发', '技术服务', '技术转让', '技术咨询', '计算机信息系统集成', '设计', '制作各类广告', '计算机', '软件及辅助设备（除计算机信息系统安全专用产品）的批发', '零售'] }, { industryBig: '咨询类', industrySmall: '健康管理咨询', content: ['健康管理咨询（不得从事诊疗活动，心理咨询）', '会务服务', '展览展示服务', '从事医疗科技领域内的技术开发', '技术咨询', '技术转让', '技术服务', '医药咨询（不得从事诊疗活动）', '计算机', '软件及辅助设备（除计算机信息系统安全专用产品）', '电子产品', '文具用品', '办公用品', '工艺礼品的批发', '零售', '商务信息咨询'] }, { industryBig: '咨询类', industrySmall: '建筑工程咨询', content: ['建筑工程咨询', '企业管理咨询', '投资咨询（除经纪）', '建设工程项目管理', '策划', '企业形象设计', '礼仪服务', '测绘领域内的技术开发', '技术咨询', '技术服务', '技术转让'] }, { industryBig: '咨询类', industrySmall: '旅游信息咨询', content: ['旅游咨询', '企业管理咨询', '商务信息咨询', '房屋建设工程施工', '家用电器的批发', '零售'] }, { industryBig: '咨询类', industrySmall: '法律咨询', content: ['企业管理咨询', '法律咨询', '商务信息咨询', '投资信息咨询'] }, { industryBig: '管理类', industrySmall: '投资管理', content: ['投资管理', '投资管理咨询', '企业管理服务', '供应链管理', '企业管理咨询', '商务咨询', '投资信息咨询', '市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）', '企业形象策划', '市场营销策划'] }, { industryBig: '管理类', industrySmall: '餐饮管理', content: ['餐饮企业管理', '酒店管理', '供应链管理', '投资管理咨询', '企业管理服务', '商务咨询', '投资信息咨询', '市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）', '企业形象策划', '市场营销策划', '厨房设备', '酒店设备', '不锈钢制品的批发', '零售'] }, { industryBig: '管理类', industrySmall: '企业管理', content: ['投资管理', '投资管理咨询', '企业管理服务', '供应链管理', '企业管理咨询', '商务咨询', '投资信息咨询', '市场信息咨询与调查（不得从事社会调查', '社会调研', '民意调查', '民意测验）', '企业形象策划', '市场营销策划', '会务服务，展览展示服务'] }, { industryBig: '管理类', industrySmall: '资产管理', content: ['投资管理', '资产管理', '品牌管理', '企业管理服务', '供应链管理', '企业管理', '投资管理咨询', '创业投资', '商务信息咨询（除经纪）商务咨询', '房地产咨询', '企业形象策划', '市场营销策划'] }, { industryBig: '管理类', industrySmall: '物业管理', content: ['物业管理', '餐饮企业管理，健身俱乐部管理', '停车场经营管理', '体育场馆管理', '酒店管理', '建设工程项目管理服务', '资产管理', '品牌管理', '企业管理服务', '企业管理咨询', '会务服务', '展览展示服务', '保洁服务', '花卉租赁服务', '家用电器安装', '维修', '绿化养护', '建筑物清洁服务', '标示标牌设计'] }, { industryBig: '管理类', industrySmall: '酒店管理', content: ['酒店管理', '餐饮企业管理', '停车场经营管理', '资产管理', '品牌管理', '企业管理服务', '企业管理咨询', '企业形象策划', '公关活动策划', '展台搭建', '物业管理会务服务', '礼仪服务', '展览展示服务', '保洁服务', '花卉租赁服务', '家用电器安装', '维修', '绿化养护', '建筑物清洁服务', '标示标牌设计'] }, { industryBig: '管理类', industrySmall: '供应链管理', content: ['供应链管理', '打包服务', '人工搬运服务', '人工装卸服务，仓储服务'] }, { industryBig: '管理类', industrySmall: '体育发展', content: ['体育赛事活动策划，体育场地设施建设工程专业施工，房屋建设工程施工，会务服务，展览展示服务，舞台艺术造型策划，图文设计', '制作，市场信息咨询与调查（不得从事社会调查', '社会调研', '民意调查', '民意测验），体育用品', '健身器材', '文具用品', '办公设备', '服装服饰', '鞋帽的批发零售'] }, { industryBig: '管理类', industrySmall: '商业管理', content: ['企业管理服务', '市场信息咨询与调查（不得从事社会调查', '社会调研', '民意调查', '民意测验）', '会务服务', '展览展示服务', '物业管理', '企业营销策划', '企业形象策划', '实业投资', '房地产经纪', '设计', '制作各类广告', '从事货物及技术进出口业务'] }, { industryBig: '服务类', industrySmall: '汽车服务', content: ['机动车驾驶服务', '汽车租赁（不得从事金融租赁）', '汽车销售', '二手车销售', '汽车配件的批发', '零售', '保险咨询（不得从事金融', '证劵', '保险业务）', '货物运输代理'] }, { industryBig: '服务类', industrySmall: '金融信息服务', content: ['金融信息服务（金融业务除外）', '接受金融机构委托从事金融信息技术外包', '接受金融机构委托从事金融业务流程外包', '接受金融机构委托从事金融知识流程外包', '从事信息科技', '网络科技领域内的技术开发', '技术咨询', '技术转让', '技术服务', '计算机软件开发', '计算机信息系统集成', '计算机网络工程施工', '电子商务（不得从事增值电信，金融业务）', '企业管理咨询', '投资信息咨询（除经纪）', '商务信息咨询', '电子产品', '办公用品的批发', '零售', '食用农产品（不含生猪产品）的销售'] }, { industryBig: '服务类', industrySmall: '保洁服务', content: ['保洁服务', '园林绿化工程施工', '建筑装修装饰建设工程专业施工', '市政公用建设施工', '建筑装饰材料', '五金交电', '机电设备及配件', '一般劳防用品的批发', '零售', '电子设备安装', '维修'] }, { industryBig: '服务类', industrySmall: '展览展示服务', content: ['展览展示服务', '会务服务', '礼仪服务', '包装服务', '人工搬运服务', '人工装卸服务', '企业形象策划', '市场营销策划', '文化艺术交流策划', '工业产品设计', '图文设计', '制作', '设计', '制作各类广告', '建筑装修装饰建设工程专业施工', '计算机网络工程施工', '计算机', '软件及辅助设备（除计算机信息系统安全专用产品）', '工艺礼品', '日用百货', '文具用品', '办公用品', '金属制品', '不锈钢制品', '机械设备及配件', '电子数码产品', '照明器材', '建筑材料的批发', '零售'] }, { industryBig: '服务类', industrySmall: '会展服务', content: ['会务服务', '展览展示服务', '汽车租赁（不得从事金融租赁）', '自有设备租赁（不得从事金融租赁）', '投资管理', '文化艺术交流策划', '企业管理咨询', '汽车配件', '办公用品', '日用百货批发', '零售'] }, { industryBig: '服务类', industrySmall: '汽车租赁服务', content: ['汽车租赁', '企业管理咨询', '商务信息咨询', '旅游咨询（不得从事旅行社业务）', '人才咨询（不得从事人才中介', '职业中介）', '礼仪服务', '会务服务', '展览展示服务', '计算机软件安装', '计算机硬件维修', '汽车配件', '旅游用品', '日用百货的批发', '零售'] }, { industryBig: '服务类', industrySmall: '投资管理服务', content: ['投资管理', '企业管理服务', '建筑工程施工', '市政工程施工'] }, { industryBig: '工程类', industrySmall: '装饰工程', content: ['建筑装修装饰建设工程设计与施工', '园林古建筑建设工程专业施工', '消防设施建设工程专业施工', '机电设备安装建设工程专业施工', '建筑防水建设工程专业施工', '防腐保温建设工程专业施工', '建筑幕墙建设工程设计与施工', '建筑智能化建设工程设计与施工', '园林绿化工程施工', '环保建设工程专业施工', '土石方建设工程专业施工', '市政公用建设工程施工', '钢结构建设工程专业施工', '水暖电安装建设工程作业', '金属门窗安装', '建筑材料的批发', '零售'] }, { industryBig: '工程类', industrySmall: '建筑工程', content: ['市政公用建设工程施工', '钢结构建设工程专业施工', '房屋建设工程施工', '消防设施建设工程专业施工', '管道建设工程专业施工', '土石方建设工程专业施工', '建筑装饰装修建设工程设计施工一体化', '园林绿化工程施工', '绿化养护', '水暖电安装建设工程作业', '机电安装建设工程施工', '建筑智能化建设工程专业施工', '金属材料', '金属制品', '包装材料', '钢材', '建筑材料', '塑料制品', '防水材料', '五金交电的批发', '零售'] }, { industryBig: '工程类', industrySmall: '装饰设计工程', content: ['建筑装饰装修建设工程设计与施工', '市政公用建设工程施工', '地基与基础建设工程专业施工', '土石方建设工程专业施工', '园林绿化工程施工', '水暖电安装建设工程作业', '机电设备', '机械设备（除特种设备）的制造', '加工（以上限分支机构经营）', '安装', '维修', '批发', '零售', '电脑图文设计', '制作', '展览展示服务', '保洁服务', '设计', '制作各类广告', '五金交电', '电线电缆', '建筑材料', '装饰材料', '办公设备', '文具用品', '通讯器材（除卫星广播电视地面接收设施）', '电子产品', '金属材料', '日用百货', '户外用品', '橡胶制品', '铝合金制品', '服装服饰', '不锈钢制品的批发', '零售', '从事货物及技术的进口业务'] }, { industryBig: '工程类', industrySmall: '绿化工程', content: ['园林绿化工程施工', '公路路基建设工程专业施工', '水利水电机电设备安装建设工程专业施工', '钢结构建设工程专业施工', '建筑专业建设工程设计', '城市规划设计', '景观设计', '保洁服务', '家政服务（不得从事职业中介，医疗，餐饮，住宿等前置性行政许可事项）', '绿化养护', '花卉', '苗木', '盆景的批发', '零售'] }, { industryBig: '工程类', industrySmall: '园林工程', content: ['园林绿化工程施工', '绿化养护', '风景园林建设工程专项设计', '花卉', '苗木种植', '花卉', '苗木', '盆景租赁', '花卉', '苗木', '观赏鱼', '金属材料', '建筑材料', '消防设备', '交通设施', '五金交电', '机械设备及配件的批发', '零售', '地基与基础建设工程专业施工', '土石方建设工程专业施工', '建筑装饰装修建设工程设计施工一体化', '市政公用建设工程施工', '消防设施建设工程专业施工', '管道建设工程专业施工', '建设工程项目管理服务', '建设工程造价咨询', '建设工程审图', '电脑图文设计', '制作', '从事绿化工程技术领域内的技术服务', '技术咨询', '技术转让', '技术开发'] }, { industryBig: '工程类', industrySmall: '建筑安装工程', content: ['建筑工程施工', '土建工程施工', '室内外装潢', '市政工程施工', '绿化工程施工', '防水工程施工', '内外墙保温工程施工', '水电安装', '强弱电工程施工', '电器设备', '机电设备', '空调设备', '暖通设备的安装', '建筑材料', '装潢材料', '五金电器', '办公用品', '一般劳防用品的批发', '零售'] }, { industryBig: '工程类', industrySmall: '防水工程', content: ['"建筑防水建设工程专业施工', '防腐保温建设工程专业施工', '建筑装饰装修建设工程设计与施工', '建筑智能化建设工程专业施工', '市政公用建设工程施工', '园林绿化工程施工', '建筑材料', '防水材料', '装饰材料批发', '零售'] }, { industryBig: '工程类', industrySmall: '景观工程', content: ['园林古建筑建设工程专业施工', '雕塑制品设计', '加工（限分支机构经营）', '标识标牌设计', '制作（限分支机构经营）', '电脑图文设计', '制作', '建筑装饰装修建设工程设计与施工'] }, { industryBig: '工程类', industrySmall: '石材装饰工程', content: ['建筑装饰装修建设工程设计与施工', '石材养护', '园林绿化工程施工', '建筑材料', '石材的批发', '零售'] }, { industryBig: '工程类', industrySmall: '机电工程', content: ['机电安装建设工程施工', '机电设备', '电子元件', '配电开关控制设备', '建筑材料', '电线电缆', '灯具灯饰', '消防器材的批发', '零售', '建筑装饰装修建设工程设计与施工', '园林绿化工程施工', '城市及道路照明建设工程专业施工'] }, { industryBig: '工程类', industrySmall: '货运代理', content: ['货物运输代理', '人工装卸服务', '打包服务', '仓储服务', '商务信息咨询'] }, { industryBig: '工程类', industrySmall: '货物运输代理', content: ['航空国际货物运输代理', '海上国际货物运输代理', '公路国际货物运输代理', '人工装卸服务', '仓储服务', '商务信息咨询'] }, { industryBig: '工程类', industrySmall: '国际货运代理', content: ['承办海运', '陆运', '空运进出口货物的国际运输代理业务', '包括：揽货', '订舱', '中转', '集装箱拼装拆箱', '报关', '报检', '相关的短途运输服务及运输咨询业务'] }, { industryBig: '工程类', industrySmall: '知识产权代理', content: ['知识产权代理（除专利代理）', '市场营销策划', '设计', '制作各类广告', '商务信息咨询', '企业管理咨询', '投资信息咨询（除经纪）', '市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）', '网络科技', '计算机信息技术领域内的技术开发', '技术咨询', '技术服务', '技术转让'] }, { industryBig: '贸易类', industrySmall: '商贸', content: ['日用百货', '办公用品', '五金交电', '电子产品', '通讯设备（除卫星电视广播地面接收设施）', '建筑材料', '箱包', '仪器仪表', '电气设备', '汽车用品', '服装辅料', '汽车配件', '床上用品', '化妆品的批发零售', '商务信息咨询', '电子商务（不得从事增值电信，金融业务）', '企业形象策划'] }, { industryBig: '贸易类', industrySmall: '电子商务', content: ['电子商务（不得从事电信增值业务，金融业务）', '服装鞋帽', '箱包', '玩具', '办公用品', '电子产品', '日用百货批发零售', '从事货物及技术进口业务'] }],
        }],
    }
}



// BusinessTypeLists: [
//       {num: 0, name: '管理类'},
//       {num: 1, name: '科技类'},
//       {num: 2, name: '广告类'},
//       {num: 3, name: '咨询类'},
//       {num: 4, name: '贸易类'},
//       {num: 5, name: '工程类'},
//       {num: 6, name: '服务类'},
//       {num: 7, name: '代理类'},
//       {num: 8, name: '设计类'}
//     ],
//     Business: [{industryBig: '科技类', industrySmall: '信息科技',content:['从事信息科技', '网络科技', '软件科技', '教育科技领域内的技术开发', '技术咨询', '技术服务', '技术转让', '网页设计', '企业管理咨询', '摄影服务', '电信建设工程专业施工', '通讯设备（除卫星电视广播地面接收设施）', '电子产品', '计算机', '软件及辅助设备的批发，零售', '电子商务（不得从事增值电信，金融业务）', '自有设备租赁（不得从事金融租赁）']}, {industryBig: '科技类', industrySmall: '生物科技',content:['技术开发', '技术咨询', '技术转让', '技术服务，化工原料及产品（除危险化学品', '监控化学品', '烟花爆竹', '民用爆炸物品', '易制毒化学品）', '纺织原料', '洗涤用品', '实验室设备', '一类医疗器械批发零售']}, {industryBig: '科技类', industrySmall: '电子科技',content:['技术开发', '技术咨询', '技术服务', '技术转让', '环保材料', '绝缘材料', '金属材料', '塑胶制品', '五金制品', '包装材料', '机械设备及配件', '文具用品', '一般劳防用品', '化工原料及产品（除危险化学品', '监控化学品', '烟花爆竹', '民用爆炸物品', '易制毒化学品）的批发', '零售']}, {industryBig: '科技类', industrySmall: '生物科技',content:['技术开发', '技术咨询', '技术转让', '技术服务', '化工原料及产品（除危险化学品', '监控化学品', '烟花爆竹', '民用爆炸物品', '易制毒化学品）', '纺织原料', '洗涤用品', '实验室设备', '一类医疗器械批发', '零售']}, {industryBig: '科技类', industrySmall: '网络科技',content:['技术开发', '技术咨询', '技术服务', '技术转让，监控设备', '家用电器', '机电设备', '五金交电', '电线电缆', '通讯设备（除卫星电视广播地面接收设施）', '计算机', '软件及辅助设备（除计算机信息系统安全专用产品）', '电子产品的批发', '零售，电子商务（不得从事增值电信', '金融业务），计算机网络工程施工']}, {industryBig: '科技类', industrySmall: '智能科技',content:['技术开发', '技术咨询', '技术服务', '技术转让，计算机信息系统集成，管道建设工程专业施工，建筑智能化建设工程专业施工，计算机网络工程施工，环保建设工程专业施工，计算机', '软件及辅助设备（除计算机信息系统安全专用产品）', '锅炉及辅助设备', '自动化设备', '管道', '控制设备的批发', '零售']}, {industryBig: '科技类', industrySmall: '印务科技',content:['技术开发', '技术咨询', '技术服务', '技术转让，设计', '制作各类广告，电脑图文设计', '制作，美术设计，企业形象策划，展览展示服务，纸制品', '包装材料', '印刷设备', '计算机', '软件及辅助设备（除计算机信息系统安全专用产品）', '办公设备，工艺礼品', '电子产品的批发', '零售']}, {industryBig: '科技类', industrySmall: '医疗科技',content:['技术开发', '技术咨询', '技术服务', '技术转让，资产管理，实业投资，投资管理，投资信息咨询（除经纪），商务信息咨询，接受金融机构委托从事金融技术外包，接受金融机构委托从事金融业务流程外包，接受金融机构委托从事金融知识流程外包，展览展示服务，会务服务，翻译服务，企业形象策划，文化艺术交流策划，日用百货', '工艺礼品', '机械设备的的批发', '零售，设计', '制作', '代理', '发布各类广告，企业管理服务，从事货物进出口及技术进出口业务']}, {industryBig: '科技类', industrySmall: '环保科技',content:['技术开发', '技术咨询', '技术服务', '技术转让，保洁服务，园林绿化工程施工，照明设备', '化工产品及原料（除危险化学品', '监控化学品', '烟花爆竹', '民用爆炸物', '易制毒化学品）', '日用百货', '消毒设备', '卫生洁具', '空气净化设备的批发', '零售，害虫防治服务']}, {industryBig: '科技类', industrySmall: '化工科技',content:['技术开发', '技术咨询', '技术转让', '技术服务', '水性涂料（除油漆）', '化工原料及产品（除危险化学品', '监控化学品', '烟花爆竹', '民用爆炸物品', '易制毒化学品）', '油墨', '燃料油（除危险化学品）', '润滑油', '五金交电', '电动工具', '电器设备', '喷涂设备', '包装材料', '印刷器材', '金属材料', '洗涤用品', '清洁用品', '塑料制品', '橡胶制品', '电子产品的批发', '零售', '货物运输代理', '危险化学品经营（具体项目见许可证）']}, {industryBig: '科技类', industrySmall: '新材料科技',content:['技术开发', '技术咨询', '技术服务', '技术转让']}, {industryBig: '科技类', industrySmall: '教育科技',content:['技术开发', '技术咨询', '技术转让', '技术服务，计算机信息系统集成，商务信息咨询，企业管理咨询，系统内职（员）工培训，家政服务（不得从事职业中介，医疗，餐饮，住宿等前置性行政许可事项），电子元器件', '机电产品', '电线电缆', '服装服饰的批发', '零售，从事货物进出口及技术进出口业务']}, {industryBig: '广告类', industrySmall: '文化传播',content:['文化艺术交流策划', '设计', '制作', '代理', '发布各类广告', '自有设备租赁（不得从事金融租赁）', '市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）', '商务信息咨询', '产品包装设计', '电子商务（不得从事增值电信，金融业务）', '公关活动策划', '会务服务', '木制建设工程作业', '砌筑建设工程作业', '抹灰建设工程作业', '油漆建设工程作业', '钢筋建设工程作业', '混凝土建设工程作业', '模板建设工程作业', '焊接建设工程作业', '水暖电安装建设工程作业', '脚手架建设工程作业', '桥梁建设工程专业施工', '隧道建设工程专业施工', '创意服务', '绿化养护', '从事建筑科技', '智能化科技领域内的技术开发', '技术咨询', '技术服务', '技术转让', '系统内职（员）工培训', '办公用品', '乐器', '文具用品', '体育用品', '玩具批发', '零售']}, {industryBig: '广告类', industrySmall: '广告',content:['设计', '制作', '代理', '发布各类广告', '文化用品', '服装', '饰品', '玩具', '家用电器', '五金交电', '计算机软硬件及附件（除计算机信息系统安全专用产品）', '通讯器材（不含卫星广播电视地面接收设施）', '百货批发', '零售', '企业投资管理咨询（除经纪）', '市场营销策划', '会展会务服务', '商务信息咨询', '图文设计', '企业形象策划']}, {industryBig: '广告类', industrySmall: '文化传媒',content:['设计', '制作', '代理', '发布各类广告', '公关活动策划', '体育赛事活动策划', '个人形象策划', '企业形象策划', '市场营销策划', '摄影服务', '摄像服务', '婚庆服务', '礼仪服务', '翻译服务', '展览展示服务', '会务服务', '文化艺术交流策划', '商务信息咨询', '建筑装饰装修建设工程设计与施工', '市政公用建设工程施工', '园林绿化工程施工', '网页设计', '计算机网络工程施工', '工艺礼品设计', '电脑图文设计', '制作', '舞台艺术造型策划', '电影发行']}, {industryBig: '广告类', industrySmall: '文化发展',content:['文化艺术交流策划', '系统内职（员）工培训', '从事信息科技领域内的技术开发', '技术咨询', '技术服务', '技术转让', '商务信息咨询', '展览展示服务', '市场营销策划', '企业形象策划', '图文设计', '制作', '会务服务', '礼仪服务', '投资管理', '工艺礼品', '电子产品', '日用百货批发', '零售']}, {industryBig: '广告类', industrySmall: '图文设计制作',content:['图文设计', '制作', '利用自有媒体发布广告', '会务服务', '展览展示服务', '礼仪服务', '企业形象策划', '市场营销策划', '产品包装设计', '从事印务科技领域内的技术开发', '技术咨询', '技术转让', '技术服务', '设计', '制作各类广告', '包装材料', '文具用品', '体育用品', '办公用品', '服装', '鞋帽的批发', '零售']}, {industryBig: '广告类', industrySmall: '广告设计',content:['设计', '制作', '代理', '发布各类广告', '图文设计', '制作', '文化艺术交流策划', '展示设计服务', '展览展示服务', '布景设计', '制作', '舞台艺术造型策划', '标识标牌设计', '制作（限分支机构经营）', '灯光设计', '城市及道路照明建设工程专业施工', '照明建设工程专项设计', '灯具灯饰', '电子产品的批发', '零售']}, {industryBig: '广告类', industrySmall: '广告制作',content:['设计', '制作各类广告', '利用自有媒体发布广告', '企业形象策划', '文化艺术交流策划', '礼仪服务', '会务服务', '展览展示服务', '市场营销策划', '舞台灯光设计', '风景园林建设工程专项设计', '动漫设计', '翻译服务', '图文设计', '制作', '标牌制作（限分支机构经营）', '建筑装饰装修建设工程设计与施工', '钢结构建设工程专业施工', '建筑幕墙建设工程专业施工']}, {industryBig: '广告类', industrySmall: '广告设计制作',content:['设计', '制作', '代理', '发布各类广告', '图文设计', '制作', '文化艺术交流策划', '展示设计服务', '展览展示服务', '布景设计', '制作', '舞台艺术造型策划', '标识标牌设计', '制作（限分支机构经营）', '灯光设计', '城市及道路照明建设工程专业施工', '照明建设工程专项设计', '灯具灯饰', '电子产品的批发', '零售']}, {industryBig: '广告类', industrySmall: '广告传媒',content:['设计', '制作', '代理', '发布各类广告', '电脑图文设计', '制作', '企业形象策划', '市场营销策划', '展览展示服务', '企业管理咨询']}, {industryBig: '设计类', industrySmall: '装饰设计',content:['建筑装饰装修建设工程设计与施工', '工艺礼品的制造', '加工（以上限分支机构经营）', '墙纸', '窗帘', '工艺礼品', '灯具的批发', '零售']}, {industryBig: '设计类', industrySmall: '建筑设计',content:['建筑工程设计与施工', '室内装饰设计与施工', '景观工程设计与施工', '园林绿化工程施工', '道路建设', '市政工程施工', '商务信息咨询']}, {industryBig: '设计类', industrySmall: '图文设计',content:['图文设计', '制作', '利用自有媒体发布广告', '会务服务', '展览展示服务', '礼仪服务', '企业形象策划', '市场营销策划', '产品包装设计', '从事印务科技领域内的技术开发', '技术咨询', '技术转让', '技术服务', '设计', '制作各类广告', '包装材料', '文具用品', '体育用品', '办公用品', '服装', '鞋帽的批发', '零售']}, {industryBig: '设计类', industrySmall: '景观设计',content:['风景园林建设工程专项设计', '从事建筑工程技术领域内的技术咨询', '建筑装修装饰建设工程专业施工', '建筑装饰建设工程专项设计']}, {industryBig: '设计类', industrySmall: '建筑工程设计',content:['建筑专业设计', '工程勘察设计', '城市规划设计', '风景园林建设工程专项设计', '建筑装饰建设工程专项设计', '市政专业建设工程设计', '工程项目服务', '建筑工程造价咨询', '建筑工程检测', '从事建筑工程技术领域内的技术开发', '技术转让', '技术咨询', '技术服务']}, {industryBig: '设计类', industrySmall: '艺术设计',content:['模型设计', '设计', '制作各类广告', '利用自有媒体发布广告', '展览展示服务', '室内装潢']}, {industryBig: '设计类', industrySmall: '创意设计',content:['创意设计', '空间艺术设计', '服装设计', '模型设计', '电脑图文设计', '制作', '建筑专业建设工程设计', '美术设计', '产品包装设计', '建筑装饰建设工程专项设计', '文化艺术交流策划', '市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）', '市场营销策划', '企业形象策划', '品牌策划', '设计', '制作', '代理', '发布各类广告', '日用百货', '工艺礼品的批发', '零售']}, {industryBig: '设计类', industrySmall: '空间设计',content:['建筑装饰装修建设工程设计与施工', '园林绿化工程施工', '企业形象策划', '美术设计', '设计', '制作', '代理', '发布各类广告', '建筑材料', '装潢材料', '家居用品', '布艺制品', '珠宝首饰的批发', '零售']}, {industryBig: '设计类', industrySmall: '建筑装潢设计',content:['建筑装修装饰建设工程专业施工', '建筑智能化建设工程设计施工一体化', '机电安装建设工程施工', '园林绿化工程施工', '环保建设工程专业施工', '市政公用建设工程施工', '土石方建设工程专业施工', '河湖整治建设工程专业施工', '风景园林建设工程专项设计', '电脑图文设计', '制作', '建筑装饰材料', '五金交电', '机电产品', '环保设备的批发', '零售']}, {industryBig: '咨询类', industrySmall: '商务咨询',content:['商务信息咨询', '企业管理咨询', '从事计算机信息技术科技领域内的技术服务', '技术咨询', '技术开发', '技术转让', '投资信息咨询（除经纪）']}, {industryBig: '咨询类', industrySmall: '企业管理咨询',content:['企业管理咨询', '计算机网络工程施工', '建筑智能化建设工程专业施工', '电子商务（不得从事增值电信', '金融业务）', '从事计算机信息科技', '电子科技领域内的技术开发', '技术咨询', '技术服务', '技术转让', '计算机软件开发', '市场营销策划', '会务服务', '展览展示服务', '计算机', '软件及辅助设备（除计算机信息系统安全专业产品）', '机械设备及配件的批发', '零售']}, {industryBig: '咨询类', industrySmall: '投资咨询',content:['投资信息咨询（除经纪）', '实业投资', '投资管理', '企业管理咨询', '人才咨询（不得从事人才中介', '职业中介）', '商务信息咨询', '市场营销策划', '会务服务', '汽车租赁（不得从事金融租赁）']}, {industryBig: '咨询类', industrySmall: '信息咨询',content:['商务信息咨询', '投资信息咨询（除经纪）', '投资管理', '企业管理咨询', '文化艺术交流策划', '公关活动策划', '市场营销策划', '企业营销策划', '企业形象策划', '市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）', '设计', '制作各类广告', '利用自有媒体发布广告', '会务服务', '礼仪服务', '婚庆服务', '翻译服务', '展览展示服务']}, {industryBig: '咨询类', industrySmall: '财务咨询',content:['财务咨询（不得从事代理记账）', '投资管理', '商务信息咨询', '投资信息咨询（除经纪）', '企业管理咨询', '电子商务（不得从事增值电信，金融业务）', '实业投资', '会务服务', '展览展示服务', '市场营销策划', '翻译服务', '资产管理', '日用百货', '文具用品', '电子产品的批发', '零售']}, {industryBig: '咨询类', industrySmall: '投资管理咨询',content:['投资管理', '投资信息咨询（除经纪）', '企业管理咨询', '商务信息咨询', '财务咨询（不得从事代理记账）', '市场信息咨询与调查（不得从事社会调查', '社会调研', '民意调查', '民意测验）', '展览展示服务', '会务服务', '电子商务（除增值电信', '金融业务）', '金融信息服务（金融业务除外）', '接受金融机构委托从事金融信息技术外包', '接受金融机构委托从事金融业务流程外包', '接受金融机构委托从事金融知识流程外包', '从事信息科技', '计算机科技', '网络技术领域内的技术开发', '技术服务', '技术转让', '技术咨询', '计算机信息系统集成', '设计', '制作各类广告', '计算机', '软件及辅助设备（除计算机信息系统安全专用产品）的批发', '零售']}, {industryBig: '咨询类', industrySmall: '健康管理咨询',content:['健康管理咨询（不得从事诊疗活动，心理咨询）', '会务服务', '展览展示服务', '从事医疗科技领域内的技术开发', '技术咨询', '技术转让', '技术服务', '医药咨询（不得从事诊疗活动）', '计算机', '软件及辅助设备（除计算机信息系统安全专用产品）', '电子产品', '文具用品', '办公用品', '工艺礼品的批发', '零售', '商务信息咨询']}, {industryBig: '咨询类', industrySmall: '建筑工程咨询',content:['建筑工程咨询', '企业管理咨询', '投资咨询（除经纪）', '建设工程项目管理', '策划', '企业形象设计', '礼仪服务', '测绘领域内的技术开发', '技术咨询', '技术服务', '技术转让']}, {industryBig: '咨询类', industrySmall: '旅游信息咨询',content:['旅游咨询', '企业管理咨询', '商务信息咨询', '房屋建设工程施工', '家用电器的批发', '零售']}, {industryBig: '咨询类', industrySmall: '法律咨询',content:['企业管理咨询', '法律咨询', '商务信息咨询', '投资信息咨询']}, {industryBig: '管理类', industrySmall: '投资管理',content:['投资管理', '投资管理咨询', '企业管理服务', '供应链管理', '企业管理咨询', '商务咨询', '投资信息咨询', '市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）', '企业形象策划', '市场营销策划']}, {industryBig: '管理类', industrySmall: '餐饮管理',content:['餐饮企业管理', '酒店管理', '供应链管理', '投资管理咨询', '企业管理服务', '商务咨询', '投资信息咨询', '市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）', '企业形象策划', '市场营销策划', '厨房设备', '酒店设备', '不锈钢制品的批发', '零售']}, {industryBig: '管理类', industrySmall: '企业管理',content:['投资管理', '投资管理咨询', '企业管理服务', '供应链管理', '企业管理咨询', '商务咨询', '投资信息咨询', '市场信息咨询与调查（不得从事社会调查', '社会调研', '民意调查', '民意测验）', '企业形象策划', '市场营销策划', '会务服务，展览展示服务']}, {industryBig: '管理类', industrySmall: '资产管理',content:['投资管理', '资产管理', '品牌管理', '企业管理服务', '供应链管理', '企业管理', '投资管理咨询', '创业投资', '商务信息咨询（除经纪）商务咨询', '房地产咨询', '企业形象策划', '市场营销策划']}, {industryBig: '管理类', industrySmall: '物业管理',content:['物业管理', '餐饮企业管理，健身俱乐部管理', '停车场经营管理', '体育场馆管理', '酒店管理', '建设工程项目管理服务', '资产管理', '品牌管理', '企业管理服务', '企业管理咨询', '会务服务', '展览展示服务', '保洁服务', '花卉租赁服务', '家用电器安装', '维修', '绿化养护', '建筑物清洁服务', '标示标牌设计']}, {industryBig: '管理类', industrySmall: '酒店管理',content:['酒店管理', '餐饮企业管理', '停车场经营管理', '资产管理', '品牌管理', '企业管理服务', '企业管理咨询', '企业形象策划', '公关活动策划', '展台搭建', '物业管理会务服务', '礼仪服务', '展览展示服务', '保洁服务', '花卉租赁服务', '家用电器安装', '维修', '绿化养护', '建筑物清洁服务', '标示标牌设计']}, {industryBig: '管理类', industrySmall: '供应链管理',content:['供应链管理', '打包服务', '人工搬运服务', '人工装卸服务，仓储服务']}, {industryBig: '管理类', industrySmall: '体育发展',content:['体育赛事活动策划，体育场地设施建设工程专业施工，房屋建设工程施工，会务服务，展览展示服务，舞台艺术造型策划，图文设计', '制作，市场信息咨询与调查（不得从事社会调查', '社会调研', '民意调查', '民意测验），体育用品', '健身器材', '文具用品', '办公设备', '服装服饰', '鞋帽的批发零售']}, {industryBig: '管理类', industrySmall: '商业管理',content:['企业管理服务', '市场信息咨询与调查（不得从事社会调查', '社会调研', '民意调查', '民意测验）', '会务服务', '展览展示服务', '物业管理', '企业营销策划', '企业形象策划', '实业投资', '房地产经纪', '设计', '制作各类广告', '从事货物及技术进出口业务']}, {industryBig: '服务类', industrySmall: '汽车服务',content:['机动车驾驶服务', '汽车租赁（不得从事金融租赁）', '汽车销售', '二手车销售', '汽车配件的批发', '零售', '保险咨询（不得从事金融', '证劵', '保险业务）', '货物运输代理']}, {industryBig: '服务类', industrySmall: '金融信息服务',content:['金融信息服务（金融业务除外）', '接受金融机构委托从事金融信息技术外包', '接受金融机构委托从事金融业务流程外包', '接受金融机构委托从事金融知识流程外包', '从事信息科技', '网络科技领域内的技术开发', '技术咨询', '技术转让', '技术服务', '计算机软件开发', '计算机信息系统集成', '计算机网络工程施工', '电子商务（不得从事增值电信，金融业务）', '企业管理咨询', '投资信息咨询（除经纪）', '商务信息咨询', '电子产品', '办公用品的批发', '零售', '食用农产品（不含生猪产品）的销售']}, {industryBig: '服务类', industrySmall: '保洁服务',content:['保洁服务', '园林绿化工程施工', '建筑装修装饰建设工程专业施工', '市政公用建设施工', '建筑装饰材料', '五金交电', '机电设备及配件', '一般劳防用品的批发', '零售', '电子设备安装', '维修']}, {industryBig: '服务类', industrySmall: '展览展示服务',content:['展览展示服务', '会务服务', '礼仪服务', '包装服务', '人工搬运服务', '人工装卸服务', '企业形象策划', '市场营销策划', '文化艺术交流策划', '工业产品设计', '图文设计', '制作', '设计', '制作各类广告', '建筑装修装饰建设工程专业施工', '计算机网络工程施工', '计算机', '软件及辅助设备（除计算机信息系统安全专用产品）', '工艺礼品', '日用百货', '文具用品', '办公用品', '金属制品', '不锈钢制品', '机械设备及配件', '电子数码产品', '照明器材', '建筑材料的批发', '零售']}, {industryBig: '服务类', industrySmall: '会展服务',content:['会务服务', '展览展示服务', '汽车租赁（不得从事金融租赁）', '自有设备租赁（不得从事金融租赁）', '投资管理', '文化艺术交流策划', '企业管理咨询', '汽车配件', '办公用品', '日用百货批发', '零售']}, {industryBig: '服务类', industrySmall: '汽车租赁服务',content:['汽车租赁', '企业管理咨询', '商务信息咨询', '旅游咨询（不得从事旅行社业务）', '人才咨询（不得从事人才中介', '职业中介）', '礼仪服务', '会务服务', '展览展示服务', '计算机软件安装', '计算机硬件维修', '汽车配件', '旅游用品', '日用百货的批发', '零售']}, {industryBig: '服务类', industrySmall: '投资管理服务',content:['投资管理', '企业管理服务', '建筑工程施工', '市政工程施工']}, {industryBig: '工程类', industrySmall: '装饰工程',content:['建筑装修装饰建设工程设计与施工', '园林古建筑建设工程专业施工', '消防设施建设工程专业施工', '机电设备安装建设工程专业施工', '建筑防水建设工程专业施工', '防腐保温建设工程专业施工', '建筑幕墙建设工程设计与施工', '建筑智能化建设工程设计与施工', '园林绿化工程施工', '环保建设工程专业施工', '土石方建设工程专业施工', '市政公用建设工程施工', '钢结构建设工程专业施工', '水暖电安装建设工程作业', '金属门窗安装', '建筑材料的批发', '零售']}, {industryBig: '工程类', industrySmall: '建筑工程',content:['市政公用建设工程施工', '钢结构建设工程专业施工', '房屋建设工程施工', '消防设施建设工程专业施工', '管道建设工程专业施工', '土石方建设工程专业施工', '建筑装饰装修建设工程设计施工一体化', '园林绿化工程施工', '绿化养护', '水暖电安装建设工程作业', '机电安装建设工程施工', '建筑智能化建设工程专业施工', '金属材料', '金属制品', '包装材料', '钢材', '建筑材料', '塑料制品', '防水材料', '五金交电的批发', '零售']}, {industryBig: '工程类', industrySmall: '装饰设计工程',content:['建筑装饰装修建设工程设计与施工', '市政公用建设工程施工', '地基与基础建设工程专业施工', '土石方建设工程专业施工', '园林绿化工程施工', '水暖电安装建设工程作业', '机电设备', '机械设备（除特种设备）的制造', '加工（以上限分支机构经营）', '安装', '维修', '批发', '零售', '电脑图文设计', '制作', '展览展示服务', '保洁服务', '设计', '制作各类广告', '五金交电', '电线电缆', '建筑材料', '装饰材料', '办公设备', '文具用品', '通讯器材（除卫星广播电视地面接收设施）', '电子产品', '金属材料', '日用百货', '户外用品', '橡胶制品', '铝合金制品', '服装服饰', '不锈钢制品的批发', '零售', '从事货物及技术的进口业务']}, {industryBig: '工程类', industrySmall: '绿化工程',content:['园林绿化工程施工', '公路路基建设工程专业施工', '水利水电机电设备安装建设工程专业施工', '钢结构建设工程专业施工', '建筑专业建设工程设计', '城市规划设计', '景观设计', '保洁服务', '家政服务（不得从事职业中介，医疗，餐饮，住宿等前置性行政许可事项）', '绿化养护', '花卉', '苗木', '盆景的批发', '零售']}, {industryBig: '工程类', industrySmall: '园林工程',content:['园林绿化工程施工', '绿化养护', '风景园林建设工程专项设计', '花卉', '苗木种植', '花卉', '苗木', '盆景租赁', '花卉', '苗木', '观赏鱼', '金属材料', '建筑材料', '消防设备', '交通设施', '五金交电', '机械设备及配件的批发', '零售', '地基与基础建设工程专业施工', '土石方建设工程专业施工', '建筑装饰装修建设工程设计施工一体化', '市政公用建设工程施工', '消防设施建设工程专业施工', '管道建设工程专业施工', '建设工程项目管理服务', '建设工程造价咨询', '建设工程审图', '电脑图文设计', '制作', '从事绿化工程技术领域内的技术服务', '技术咨询', '技术转让', '技术开发']}, {industryBig: '工程类', industrySmall: '建筑安装工程',content:['建筑工程施工', '土建工程施工', '室内外装潢', '市政工程施工', '绿化工程施工', '防水工程施工', '内外墙保温工程施工', '水电安装', '强弱电工程施工', '电器设备', '机电设备', '空调设备', '暖通设备的安装', '建筑材料', '装潢材料', '五金电器', '办公用品', '一般劳防用品的批发', '零售']}, {industryBig: '工程类', industrySmall: '防水工程',content:['"建筑防水建设工程专业施工', '防腐保温建设工程专业施工', '建筑装饰装修建设工程设计与施工', '建筑智能化建设工程专业施工', '市政公用建设工程施工', '园林绿化工程施工', '建筑材料', '防水材料', '装饰材料批发', '零售']}, {industryBig: '工程类', industrySmall: '景观工程',content:['园林古建筑建设工程专业施工', '雕塑制品设计', '加工（限分支机构经营）', '标识标牌设计', '制作（限分支机构经营）', '电脑图文设计', '制作', '建筑装饰装修建设工程设计与施工']}, {industryBig: '工程类', industrySmall: '石材装饰工程',content:['建筑装饰装修建设工程设计与施工', '石材养护', '园林绿化工程施工', '建筑材料', '石材的批发', '零售']}, {industryBig: '工程类', industrySmall: '机电工程',content:['机电安装建设工程施工', '机电设备', '电子元件', '配电开关控制设备', '建筑材料', '电线电缆', '灯具灯饰', '消防器材的批发', '零售', '建筑装饰装修建设工程设计与施工', '园林绿化工程施工', '城市及道路照明建设工程专业施工']}, {industryBig: '工程类', industrySmall: '货运代理',content:['货物运输代理', '人工装卸服务', '打包服务', '仓储服务', '商务信息咨询']}, {industryBig: '工程类', industrySmall: '货物运输代理',content:['航空国际货物运输代理', '海上国际货物运输代理', '公路国际货物运输代理', '人工装卸服务', '仓储服务', '商务信息咨询']}, {industryBig: '工程类', industrySmall: '国际货运代理',content:['承办海运', '陆运', '空运进出口货物的国际运输代理业务', '包括：揽货', '订舱', '中转', '集装箱拼装拆箱', '报关', '报检', '相关的短途运输服务及运输咨询业务']}, {industryBig: '工程类', industrySmall: '知识产权代理',content:['知识产权代理（除专利代理）', '市场营销策划', '设计', '制作各类广告', '商务信息咨询', '企业管理咨询', '投资信息咨询（除经纪）', '市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）', '网络科技', '计算机信息技术领域内的技术开发', '技术咨询', '技术服务', '技术转让']}, {industryBig: '贸易类', industrySmall: '商贸',content:['日用百货', '办公用品', '五金交电', '电子产品', '通讯设备（除卫星电视广播地面接收设施）', '建筑材料', '箱包', '仪器仪表', '电气设备', '汽车用品', '服装辅料', '汽车配件', '床上用品', '化妆品的批发零售', '商务信息咨询', '电子商务（不得从事增值电信，金融业务）', '企业形象策划']}, {industryBig: '贸易类', industrySmall: '电子商务',content:['电子商务（不得从事电信增值业务，金融业务）', '服装鞋帽', '箱包', '玩具', '办公用品', '电子产品', '日用百货批发零售', '从事货物及技术进口业务']}],
//     Business1: [{businessBig: '服务类', businessSmall: [{cate: '咨询类', content: ['财务咨询','法律咨询','旅游咨询','人才咨询(不得从事人才中介、职业中介)','健康管理咨询','投资管理咨询','商务信息咨询（除经纪）','企业管理咨询','投资信息咨询','房地产咨询','建设工程造价咨询','物流装备信息咨询','市场信息咨询与调查（不得从事社会调查，社会调研，民意调查，民意测验）','创业投资','教育投资']},{cate: '设计类', content: ['智能化建设工程专项设计','城市规划设计','建筑装饰建设工程专项设计','环境工程建设工程专项设计','建筑专业建设工程设计','景观设计','建筑装饰设计','工业产品设计','工艺礼品设计','产品包装设计','标识标牌设计','商标设计','道具设计','动漫设计','多媒体制作','多媒体设计','平面设计','创意设计','网页设计','服装设计','饰品设计','舞台灯光设计','集成电路设计']},{cate: '科技类', content: ['计算机服务','计算机软硬件开发','计算机信息系统集成','计算机数据处理']},{cate: '广告类', content: ['电脑喷绘','电脑图文设计制作','设计、制作、代理各类广告','设计、制作、代理、发布各类广告','利用自有媒体发布广告']},{cate: '管理类', content: ['企业管理','投资管理','资产管理','物业管理','品牌管理','酒店管理','餐饮企业管理','企业管理服务','停车场经营管理','房地产开发经营','供应链管理','体育场馆管理','健身俱乐部管理','建设工程项目管理服务','实业投资']},{cate: '工程类', content: ['焊接建设工程作业','木制建设工程作业','油漆建设工程作业','架线建设工程作业','钣金建设工程作业','砌筑建设工程作业','石制建设工程作业','抹灰建设工程作业','钢筋建设工程作业','模板建设工程作业','脚手架建设工程作业','混凝土建设工程作业','水暖电安装建设工程作业','室内装潢','室内外装潢','综合布线','建筑装饰装修建设工程设计施工一体化','建筑智能化建设工程设计施工一体化','机电设备安装','机电设备维修','空调设备、暖通设备安装','水电安装','安全防范工程','照明建设工程专项设计','钢结构建设工程专项设计','风景园林建设工程专项设计','市政工程施工','市政公用建设工程专业施工','城市及道路照明建设工程专业施工','河湖整治建设工程专业施工','水利水电建设工程施工','公路建设工程施工','建筑装饰工程设计、施工','建筑装饰装修建设工程设计与施工','环保建设工程专业施工','管道建设工程专业施工','混凝土预制构件建设工程专业施工','钢结构建设工程专业施工','土石方建设工程专业施工','金属门窗建设工程专业施工','消防设施建设工程设计与施工','建筑幕墙建设工程设计与施工','防腐保温建设工程专业施工','建筑防水建设工程专业施工','通信建设工程施工','弱电工程施工','计算机网络工程施工','电子建设工程专业施工','机电设备安装建设工程专业施工','地基与基础建设工程专业施工','房屋建设工程施工','园林古建筑建设工程专业施工','园林绿化工程施工']},{cate: '服务类', content: ['装卸服务','打包服务','摄影服务','仓储服务','翻译服务','婚庆服务','会务服务','礼仪服务','保洁服务','创意服务','健身服务','企业营销策划','企业形象策划','公关活动策划','市场营销策划','文化艺术交流策划','舞台艺术造型策划','房地产营销策划','展示设计服务','摄影摄像服务','婚庆礼仪服务','展示展览服务','人工搬运服务','建筑物清洁服务','机动车驾驶服务','建设工程监理服务','展台搭建','品牌策划','舞台设计、搭建','家用电器安装、维修','计算机硬件安装、维修','花卉租赁','绿化养护','石材养护','自有设备租赁（不得从事金融租赁）','金融信息服务(金融业务除外）']},{cate: '文化类', content: ['娱乐咨询','影视策划','体育赛事活动策划','文化艺术交流活动策划','经营演出及经纪业务']},{cate: '金融类', content: ['接受金融机构委托从事金融信息技术外包','接受金融机构委托从事金融业务流程外包','接受金融机构委托从事金融知识流程外包']}]},{businessBig: '销售类',businessSmall: [{cate: '材料类', content: ['广告材料','金属材料','包装材料','环保材料','保温材料','防水材料','建筑装饰材料','金属制品','不锈钢制品','铝合金制品','消防器材','金属门窗','润滑油','电线电缆','木材','石材','钢材','建材']},{cate: '纺织品类', content: ['针纺织品','纺织品','纺织原料']},{cate: '日用品类', content: ['日用百货','工艺礼品','装饰品','金银饰品','工艺品','化妆品','玩具','箱包','眼镜（除隐形眼镜）','钟表','珠宝首饰','家居用品','床上用品','洗涤用品','酒店用品','清洁用品','母婴用品（除食品）','一般劳防用品','厨房用具','卫生洁具','家用电器','家具','灯具灯饰','厨房设备','酒店设备','服装鞋帽','服装服饰及辅料','塑料制品','皮革制品','陶瓷制品','橡塑制品','玻璃制品','橡胶制品','布艺制品','纸制品','木制品']},{cate: '五金类', content: ['五金交电','五金制品','五金工具','电动工具']},{cate: '电器类', content: ['电子产品','电子元器件','数码产品','数码设备','电器设备','电气设备','照明设备','照明器材','通讯器材（除卫星广播电视地面接收设施）','通信设备（除卫星电视广播地面接收设施）','摄影器材','印刷器材','音响设备']},{cate: '文教类', content: ['办公用品','办公设备','文具用品','体育用品','健身器材','实验室设备']},{cate: '计算机类', content: ['计算机','软件及辅助设备（除计算机信息系统安全专用产品）','电子商务（不得从事电信增值业务）']},{cate: '机械类', content: ['环保设备','制冷设备','电子设备','空调设备','暖通设备','安防设备','净水设备','消防设备','水处理设备','自动化设备','机械设备及配件','机电设备及配件','仪器仪表','阀门','轴承','管道配件','压缩机及配件']},{cate: '汽车类', content: ['汽车销售','二手车销售','商用车及九座以上乘用车销售','汽车配件','汽车用品','摩托车配件','汽车租赁','自有汽车租赁']},{cate: '绿化类', content: ['苗木','花卉','盆景']}]}],
