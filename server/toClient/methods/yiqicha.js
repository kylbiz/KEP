/*
 * 一起查相关的接口
 **/


Meteor.methods({
  'yiqichaSearch': function (keywords, pageNo, allpageNo) {
    // 一企查 搜索企业名
    var userId = KUtil.isLogin();

    check(keywords, String);
    if (keywords.length < 2) {
      throw new Meteor.Error('企业名称必须不少于两个字');
    }

    var ret = Async.runSync(function (callback) {
      Yiqicha.search({
        keywords: keywords, pageNo: pageNo || null, allpageNo: allpageNo || null
      }, callback);
    });

    if (ret.error) {
      throw new Meteor.Error("查询失败");
    } else {
      log("查询成功", ret.result);
      return ret.result;
    }
  },
});
