Yiqicha = {
  config: {
    // 关键词查询
    registrationOptions: {
      homeRefererUrl: 'http://www.sgs.gov.cn/lz/etpsInfo.do?method=index', // The referer url
      registrationResultsUrl: 'http://www.sgs.gov.cn/lz/etpsInfo.do?method=doSearch', // results for keywords url
      registrationDetailUrl: 'http://www.sgs.gov.cn/lz/etpsInfo.do?method=viewDetail' // url for keywords detail
    },
    // 公司状态查询
    companyStatusOptions: {
      targetUrl: 'http://www.sgs.gov.cn/shaic/workonline/appStat!toNameAppList.action'
    },
    // 注册状态
    registrationStatusOption: {
      targetUrl : 'http://www.sgs.gov.cn/shaic/workonline/appStat!toEtpsAppList.action'
    },
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

  if ( !opt.keywords ) {
    callback("关键字不能为空", null);
    return;
  }

  if (allpageNo && pageNo) {
    crawler.getMoreRegistrations(Yiqicha.config.registrationOptions, keywords, allpageNo, pageNo, callback);
    return;
  }

  crawler.searchCompanyInformation(Yiqicha.config.registrationOptions, keywords, callback || function (err, result) {});
}

//
Yiqicha.detail = function () {

}

// test
Meteor.methods({
  search: function (key, allpageNo, pageNo) {
    if (key == 'hey-jude') {
      if (allpageNo && pageNo) {

      } else {

      }
      Yiqicha.search({keywords: '开业啦'}, function (err, result) {
        console.log('search', err, result.numberOfResults, result.detailResultsOutputs[0].company, result.detailResultsOutputs[0].basicDetail);
      });
    }
  }
});
