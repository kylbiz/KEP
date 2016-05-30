/*
 * KEP前端的辅助方法
 **/

// 这个之后可改进为系统日志的记录
log = console.log.bind(console, "KEPDebug(" + moment().format('YYYY-MM-DD HH:mm:ss') + "): ");


// 弥补上check 1.2.1中包含的功能
if (typeof Match == 'object') {
  Match.Maybe = function (pattern) {
    return Match.OneOf(undefined, null, pattern);
  }
}

// KEP前端的辅助函数
KEPUtil = {};

// 将保存在collection中的schema数据转换为客户端可用的obj
KEPUtil.convToSchemaOrigin = function (saveObj) {
  var newObj = {};
  for (var key in saveObj) {
    var info = saveObj[ key ];
    var type = info.type;
    info["type"] = {
      "String": String,
      "Object": Object,
      "Number": Number,
      "Array": Array,
      "Boolean": Boolean,
      "Date": Date
    }[type];


    var options = false;

    // if (info.autoform && info.autoform.type == 'select') {
    //   log("info.autoform.options-1", info.autoform.options);
    //   // options = info.autoform.options.clone();
    // }

    newObj[ key.replace(/\-/g, ".") ] = info;
    if (options) {
      newObj[ key.replace(/\-/g, ".") ].autoform.options = function () {
        return options;
      }
    }
  }

  return newObj;
}


// 两个时间间隔天数
KEPUtil.intervalDays = function (startTime, endTime) {
  var perTime = (endTime || 0) - (startTime || 0);
  var days = moment.duration(perTime).asDays();
  // .toFixed(1)
  return Math.floor(days);
}


// 验证手机号
KEPUtil.validatePhone = function (phone) {
    var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    return phoneReg.test(phone);
};

// 验证邮箱
KEPUtil.validateEmail = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// 获取当前进行到哪一步骤
KEPUtil.taskStepWorking = function (steps) {
  for (var key in steps) {
    var step = steps[key] || {};
    if (!step.finished) {
      return {index: key, name: step.name} || "";
    }
  }

  // 全部完成显示第一个
  return { index: 0, name: (steps[0] || {}).name || ''};
}


// 根据条件获取自动设置公司的全称
KEPUtil.getCompanyFullName = function (basicNameList, nameStruct, industryType, companyType, area) {
  log('KEPUtil.getCompanyFullName', basicNameList, nameStruct, industryType, companyType, area);

  check(basicNameList, [String]);
  check(nameStruct, String);
  check(industryType, String);
  check(companyType, String);

  var companyObj = {
    area: area || '上海',
    industry: industryType,
    type: {'有限责任公司': '有限公司', '有限合伙': '公司'}[companyType] || '公司',
  }

  nameStruct = nameStruct.split('-');
  if (nameStruct[1] == 'area') {
    companyObj.area = '（' + companyObj.area + '）';
  }

  var nameStrList = [];
  basicNameList.forEach(function (name) {
    companyObj.name = name;
    var nameStr = '';
    nameStruct.forEach(function (key) {
        nameStr += companyObj[key] || '';
    });
    nameStrList.push(nameStr);
  });

  return nameStrList;
}

// 根据行业类型获取经营范围
KEPUtil.getBusinessScope = function (industryType) {
  return "";
}

//自定义弹出框
KEPUtil.alertMsg = function (msg, mode) {
      msg = msg || '';
      mode = mode || 0;
      var top = document.body.scrollTop || document.documentElement.scrollTop;
      var isIe = (document.all) ? true : false;
      var isIE6 = isIe && !window.XMLHttpRequest;
      var sTop = document.documentElement.scrollTop || document.body.scrollTop;
      var sLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
      var winSize = function(){
          var xScroll, yScroll, windowWidth, windowHeight, pageWidth, pageHeight;
          // innerHeight获取的是可视窗口的高度，IE不支持此属性
          if (window.innerHeight && window.scrollMaxY) {
              xScroll = document.body.scrollWidth;
              yScroll = window.innerHeight + window.scrollMaxY;
          } else if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
              xScroll = document.body.scrollWidth;
              yScroll = document.body.scrollHeight;
          } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
              xScroll = document.body.offsetWidth;
              yScroll = document.body.offsetHeight;
          }

          if (self.innerHeight) {    // all except Explorer
              windowWidth = self.innerWidth;
              windowHeight = self.innerHeight;
          } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
              windowWidth = document.documentElement.clientWidth;
              windowHeight = document.documentElement.clientHeight;
          } else if (document.body) { // other Explorers
              windowWidth = document.body.clientWidth;
              windowHeight = document.body.clientHeight;
          }

          // for small pages with total height less then height of the viewport
          if (yScroll < windowHeight) {
              pageHeight = windowHeight;
          } else {
              pageHeight = yScroll;
          }

          // for small pages with total width less then width of the viewport
          if (xScroll < windowWidth) {
              pageWidth = windowWidth;
          } else {
              pageWidth = xScroll;
          }

          return{
              'pageWidth':pageWidth,
              'pageHeight':pageHeight,
              'windowWidth':windowWidth,
              'windowHeight':windowHeight
          }
      }();
      //alert(winSize.pageWidth);
      //遮罩层
      var styleStr = 'top:0;left:0;position:absolute;z-index:10000;background:#666;width:' + winSize.pageWidth + 'px;height:' +  (winSize.pageHeight + 30) + 'px;';
      styleStr += (isIe) ? "filter:alpha(opacity=80);" : "opacity:0.8;"; //遮罩层DIV
      var shadowDiv = document.createElement('div'); //添加阴影DIV
      shadowDiv.style.cssText = styleStr; //添加样式
      shadowDiv.id = "shadowDiv";
      //如果是IE6则创建IFRAME遮罩SELECT
      if (isIE6) {
          var maskIframe = document.createElement('iframe');
          maskIframe.style.cssText = 'width:' + winSize.pageWidth + 'px;height:' + (winSize.pageHeight + 30) + 'px;position:absolute;visibility:inherit;z-index:-1;filter:alpha(opacity=0);';
          maskIframe.frameborder = 0;
          maskIframe.src = "about:blank";
          shadowDiv.appendChild(maskIframe);
      }
      document.body.insertBefore(shadowDiv, document.body.firstChild); //遮罩层加入文档
      //弹出框
      var styleStr1 = 'display:block;position:fixed;_position:absolute;left:' + (winSize.windowWidth / 2 - 200) + 'px;top:' + (winSize.windowHeight / 2 - 150) + 'px;_top:' + (winSize.windowHeight / 2 + top - 150)+ 'px;'; //弹出框的位置
      var alertBox = document.createElement('div');
      alertBox.id = 'alertMsg';
      alertBox.style.cssText = styleStr1;
      //弹出框标头
      var alert_top = document.createElement('p');
      alert_top.id = 'alert_top';
      alert_top.innerHTML = '<i class=\'fa fa-warning fa-2x\'>警告!</i>';
      alertBox.appendChild(alert_top);
      //创建关闭按钮
      var alert_close = document.createElement('button');
      alert_close.id = 'alert_close';
      alert_close.innerHTML = '&times;'
      alertBox.appendChild(alert_close);
      alert_close.onclick = function () {
        document.body.removeChild(alertBox);
        document.body.removeChild(shadowDiv);
        return true;
      }
      //创建弹出框里面的内容P标签
      var alertMsg_info = document.createElement('P');
      alertMsg_info.id = 'alertMsg_info';
      alertMsg_info.innerHTML = msg;
      alertBox.appendChild(alertMsg_info);
      //创建按钮
      var btn1 = document.createElement('a');
      btn1.id = 'alertMsg_btn1';
      btn1.href = 'javas' + 'cript:void(0)';
      btn1.innerHTML = '<cite>确定</cite>';
      btn1.onclick = function () {
          document.body.removeChild(alertBox);
          document.body.removeChild(shadowDiv);
          return true;
      };
      alertBox.appendChild(btn1);
      if (mode === 1) {
          var btn2 = document.createElement('a');
          btn2.id = 'alertMsg_btn2';
          btn2.href = 'javas' + 'cript:void(0)';
          btn2.innerHTML = '<cite>取消</cite>';
          btn2.onclick = function () {
              document.body.removeChild(alertBox);
              document.body.removeChild(shadowDiv);
              return false;
          };
          alertBox.appendChild(btn2);
      }
      document.body.appendChild(alertBox);
}