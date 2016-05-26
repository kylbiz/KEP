/*
 * 一企查的基础API调用
 **/

YiqichaSub = new Mongo.Collection('YiqichaSub'); // 一企查的订阅集合

Yiqicha = {
  config: {
    // 关键词查询
    registrationOptions: {
      homeRefererUrl: 'http://www.sgs.gov.cn/lz/etpsInfo.do?method=index', // The referer url
      registrationResultsUrl: 'http://www.sgs.gov.cn/lz/etpsInfo.do?method=doSearch', // results for keywords url
      registrationDetailUrl: 'http://www.sgs.gov.cn/lz/etpsInfo.do?method=viewDetail' // url for keywords detail
    },
    // 核名状态查询
    nameStatusOptions: {
      targetUrl: 'http://www.sgs.gov.cn/shaic/workonline/appStat!toNameAppList.action'
    },
    // 工商注册状态
    registrationStatusOption: {
      targetUrl : 'http://www.sgs.gov.cn/shaic/workonline/appStat!toEtpsAppList.action'
    },
    maxValidDate: 8, // 核名审核的最长天数，多于这个天数表示审核基本不通过 /天
    maxSearchTimes: 80, // 核名最大查询次数 /次
    checkHoursPeriod: 4, // 轮询间隔时间 /小时
  }
}

var Crawler = Meteor.npmRequire('mycrawl').Crawler;
var crawler = new Crawler();


// 关键词搜索
Yiqicha.search = function (opt, callback) {
  opt = opt || {};
  var keywords = opt.keywords;
  var allpageNo = opt.allpageNo;
  var pageNo = opt.pageNo;
  var callback = callback || function () {};

  if ( !opt.keywords ) {
    callback("关键字不能为空", null);
    return;
  }

  if (allpageNo && pageNo) {
    log('getMoreRegistrations', keywords, allpageNo, pageNo);
    crawler.getMoreRegistrations(Yiqicha.config.registrationOptions, keywords, allpageNo, pageNo, callback);
    return;
  }

  log('searchCompanyInformation', keywords);
  crawler.searchCompanyInformation(Yiqicha.config.registrationOptions, keywords, callback);
}


// 暂只使用关键词到的信息
Yiqicha.detail = function () {
}


// 公司核名状态查询
Yiqicha.checkName = function (companyName, callback) {
  crawler.searchCompanyNameStatus(Yiqicha.config.nameStatusOptions, companyName, function (err, statusInfo) {
    if (err || statusInfo.statuscode < 1) {
      log("checkName search fail! companyName: " + companyName  + " error: ", err);
      return callback("信息未找到", null);
    }

    statusStr = statusInfo.companynameInfo[0].applayStatus || "未知"; // 工商返回的审核状态
    // ['(-1)<审核已过期>', '(1)审查中', '(2)核准，可取']

    var applyStatus = 0;
    if (statusStr === "审查中") {
      applyStatus = 1;

      // 审核过期
      var maxValidDate = Yiqicha.config.maxValidDate || 5;
      var acceptedDate = new Date(statusInfo.companynameInfo[0].acceptedDate);
      var validateDate = moment().subtract(maxValidDate, 'days');
      if (acceptedDate < validateDate) {
        applyStatus = -1;
      }
    } else if (statusStr == "核准，可取") {
      applyStatus = 2
    }

    var ret = {
      company: companyName,
      status: applyStatus,
      label: statusStr,
      detail: statusInfo.companynameInfo[0],
    }
    callback(null, ret);
  });
}


// 公司登记状态查询
Yiqicha.regist = function (companyName, callback) {
  crawler.searchRegistrationStatus(Yiqicha.config.registrationStatusOption, companyName, function (err, statusInfo) {
    if (err || statusInfo.statuscode < 1) {
      log("regist search fail! companyName: " + companyName  + " error:", err);
      return callback("信息未找到", null);
    }

    var infoRet = statusInfo.registrationStatusInfo[0];
    var statusStr = infoRet.registrationStatus || "未知"; // 工商返回的审核状态
    var status = 0;

    // ['(-1)<审核已过期>', '(1)审查中','(2)预审通过'/'核准', '(-2)撤销', '(-3)申请案暂存','(3)可领照']
    var handleMap = {
      '审查中': function () {
        status = 1;

        // 判断审核是否已过期
        var acceptedDate = new Date(infoRet.acceptedDate);
        var maxValidDate = Yiqicha.config.maxValidDate || 5;
        var validateDate = moment().subtract(maxValidDate, 'days');
        if (acceptedDate < validateDate) {
          status = -1;
        }
      },
      '预审通过': function () {
        status = 2;
      },
      '核准': function () {
        status = 2;
      },
      '可领照': function () {
        status = 3;
      },
      '撤销': function () {
        status = -2;
      },
      '申请案暂存': function () {
        status = -3;
      }
    }

    var ret = {
      company: companyName,
      status: status,
      label: statusStr,
      detail: infoRet,
    }
    callback(null, ret);
  });
}


// test
Meteor.methods({
  search: function (key, allpageNo, pageNo) {
    if (key == 'hey-jude') {
      Yiqicha.search({keywords: '开业啦'}, function (err, result) {
        console.log('search', err, result.numberOfResults, result.detailResultsOutputs[0].company, result.detailResultsOutputs[0].basicDetail);
      });
    }
  },
  checkName: function (key) {
    if (key == 'hey-jude') {
        Yiqicha.checkName('上海睿颉生物科技有限公司', function (err, result) {
          console.log('checkName', err, result);
        });
    }
  },
  regist: function (key) {
    if (key == 'hey-jude') {
      Yiqicha.regist('上海卓图房地产', function (err, result) {
        console.log('regist', err, result);
      });
    }
  }
});
