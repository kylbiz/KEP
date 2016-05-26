Template.yiqichaWin.onRendered(function () {
  Session.set('companyName', '');
  Session.set('searchStatus', 'init'); // init -- 初始状态 searching -- 查询中 searched -- 查询完毕
  Session.set('currPage', 0);
  Session.set('allPages', 0);
  Session.set('searchCount', 0);
  Session.set('companyList', []);
});

Template.yiqichaWin.onDestroyed(function () {
  delete Session.keys['companyName']; // 搜索的公司名
  delete Session.keys['searchStatus'];  // 是否已搜索
  delete Session.keys['searchCount']; // 总条目数
  delete Session.keys['searchPages']; // 搜索到的页数
  delete Session.keys['currPage']; // 当前加载到的页数
  delete Session.keys['companyList']; // 公司信息
});


Template.yiqichaWin.helpers({
  disabledBtn: function () {
    if (Session.get('searchStatus') == 'searching') {
      return 'disabled';
    }
    return '';
  },
  searchStatus: function (status) {
    return (Session.get('searchStatus') == status);
  },
  count: function () {
    return Session.get('searchCount') || 0;
  },
  companyList: function () {
    log( "companyList", Session.get('companyList') );
   return Session.get('companyList') || [];
  },
  hasNext: function () {
    var allPages = Session.get('searchPages') || 0;
    var currPage = Session.get('currPage') || 0;
    return (currPage < allPages);
  }
});

Template.yiqichaWin.events({
  'click #searchCompanyName': function () {
    log('click #searchCompanyName');
    var companyName = $('#searchName').val() || "";
    if (!companyName || companyName.length < 2) {
      alert("企业名称必须不少于两个字");
      return;
    }

    Session.set('companyName', companyName);
    Session.set('searchStatus', 'init');
    Session.set('currPage', 0);
    Session.set('allPages', 0);
    Session.set('searchCount', 0);
    Session.set('companyList', []);

    getCompanyList();
  },
  'click #loadMore': function () {
    log('click #loadMore');
    Session.set('currPage', (Session.get('currPage') || 0) + 1 );
    getCompanyList();
  }
});


// 获取搜索到的公司信息
function getCompanyList () {
  var companyName = Session.get('companyName');
  if (!companyName || companyName.length < 2) {
    alert("企业名称必须不少于两个字");
    return;
  }

  var currPage = Session.get('currPage') || 0;
  var allPages = Session.get('allPages') || 0;
  Session.set('searchStatus', 'searching');
  log('yiqichaSearch', companyName, currPage, allPages);

  Meteor.call('yiqichaSearch', companyName, currPage, allPages, function (error, result) {
    if (error) {
      alert("查询失败！" + error);
      Session.set('currPage', (Session.get('currPage') || 1) - 1 );
    } else {
      log("查询成功", currPage, result.numberOfResults, result.allpageNo, result.detailResultsOutputs);

      Session.set('searchCount', result.numberOfResults || 0);
      Session.set('searchPages', result.allpageNo);

      var currPage = Session.get('currPage') || 0;
      if (result.numberOfResults && !currPage) {
        Session.set('currPage', 1 );
      }

      var currCompanyList = Session.get('companyList') || [];
      Session.set( 'companyList', currCompanyList.concat(result.detailResultsOutputs || []) );
      // Session.set('companyList', result.detailResultsOutputs);
    }
    Session.set('searchStatus', 'searched');
  });
}
