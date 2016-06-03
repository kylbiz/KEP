//分页
Template.paginator.onRendered(function() {
  Session.set('currentPage', 1);
  Session.set('dataLimit', {
    page: 1,
    num: 15,
  });

  this.autorun(function () {
    var dataLimit = {
      page: Session.get('currentPage') || 1,
      num: 15,
    };
    Session.set("dataLimit", dataLimit);
  });


  this.autorun(function () {
    // 获取当前所有数据的条数
    Meteor.call('getPageCount', Session.get('tabelCollName'),  Session.get('dataFilter'), function (error, result) {
      log(Session.get('tabelCollName'), "getPageCount", error, result);
      if (!error) {
        Session.set('cellCount', result);
      }
    });
  });

  this.autorun(function () {
    var cellCount = Session.get('cellCount') || 0;
    var dataLimit = Session.get('dataLimit') || {num: 15};
    var totalPages = Math.ceil(cellCount / dataLimit.num) || 1;
    // log("Template.paginator.onRendered", dataLimit, cellCount, totalPages, Session.get('currentPage'));

    // 设置分页
    $('#paginator').jqPaginator({
        totalPages: totalPages,
        visiblePages: 5,
        currentPage: Session.get('currentPage') || 1,
        first: '<li class="first"><a value="first">首页<\/a><\/li>',
        prev: '<li class="prev"><a value="prev"><i class="arrow arrow2"><\/i>上一页<\/a><\/li>',
        next: '<li class="next"><a value="next">下一页<i class="arrow arrow3"><\/i><\/a><\/li>',
        last: '<li class="last"><a value="last">末页<\/a><\/li>',
        page: '<li class="page"><a value={{page}}>{{page}}<\/a><\/li>',
        onPageChange: function (num, type) {
            Session.set("currentPage", num);
            // log("onPageChange", Session.get('currentPage'));
            $('#paginator-text').html('当前第' + num +'/' + totalPages + '页');
        }
    });
  });
});


Template.paginator.onDestroyed(function () {
  delete Session.keys['currentPage'];
  delete Session.keys['cellCount'];

  delete Session.keys['tabelCollName'];
  delete Session.keys['dataFilter'];

  log("Template.paginator.onDestroyed");
});

