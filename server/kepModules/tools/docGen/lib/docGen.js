DocGen = {
  config: {
    requestUrl: "http://120.55.166.196:8080/word/MyServlet",
  }
}

/**
 * 请求 生成文档服务,请求得到结果存在数据库中
 * @param  {object} options
 */
DocGen.genDocRemote = function(options, callBack) {
  if(!options
    || !options.hasOwnProperty("cnLabel")
    || !options.hasOwnProperty("fileName")
    || !options.hasOwnProperty("randomStr")
    || !options.hasOwnProperty("fileData")) {
    log("getTemplateService: options illegal.", options);

    callBack('illegal params', null);
  } else {
    log("getTemplateService: start generate document [" +cnLabel +"].");

    var randomStr = options.randomStr;
    var fileName = options.fileName;
    var cnLabel = options.cnLabel;
    var fileData = options.fileData || {};

    var params = {
      fileName: fileName,
      cnLabel: cnLabel,
      randomStr: randomStr,
      fileData: fileData
    }
    var queryParams = {
      key: JSON.stringify(params)
    }

    var requestUrl = DocGen.config.requestUrl;

    HTTP.call("POST",requestUrl, {
      params: queryParams
    }, function(err, result) {
      if(err || !result || result.statusCode !== 200) {
        log('getTemplateService: ' + cnLabel + ' [ ' + fileName + ' ] ' + 'handle error,try again.', err)
        callBack('generate doc fail', null);
      } else {
        callBack(null, {fileUrl: result.content});
      }
    })
  }
}


// 核名申请
// var files = [
//   {id: 'K0211090101', name: '企业名称预先核准申请书'},
// ]
//   {id: 'K0211090101', name: '预先核名[单人]'},
//   {id: 'K0211090102', name: '预先核名[多人]'},

// 虹口文档信息
//  var files = [
//   {id: 'K0211090201', name: '股东会决议[单人]'},
//   {id: 'K0211090202', name: '股东会决议[多人]'},
//   {id: 'K0211090301', name: '公司章程[单人]'},
//   {id: 'K0211090302', name: '公司章程[多人]'},
//   {id: 'K0211090401', name: '房屋租赁合同'},
//   {id: 'K0211090501', name: '指定代表或共同代理人授权书'},
//   {id: 'K0211090601', name: '公司登记（备案）申请书'},
//   {id: 'K0211090701', name: '广告企业告知承诺书'},
//   {id: 'K0211090801', name: '小型微型企业认定申请表'},
//   {id: 'K0211090901', name: '上海市组织机构代码申请表'},
//   {id: 'K02110901001', name: '情况说明'}
// ]

// test
Meteor.methods({
  'genDoc': function (key) {
    if (key == 'you-are-the-best') {
      var doc = {
        fileName: 'K0211090101',
        cnLabel: '企业名称预先核准申请书',
        randomStr: Meteor.uuid(),
        fileData: {
          companyName: "开业啦-cc",
          alternativeName: ['开业啦-1', '开业啦-2'],
          companyAddress: '上海-中国',
          businessScope: '企业服务，网络技术',
          holderName: ['cc', 'jack'],
          holderID: ['123456789', '123344444'],
          moneyAmount: '100'
        }
      };
      DocGen.genDocRemote(doc);
    }
  }
})


