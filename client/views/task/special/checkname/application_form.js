Template.application_form.onRendered(function () {
  var self = this;
  self.autorun(function () {
    Session.set('schemaOrigin', false);
    var dataStruct = self.data.dataStruct;

    // 获取核名申请书的schema
    Meteor.call('getSchema', dataStruct, function (err, schemaOrigin) {
      if (!err) {
        Session.set('schemaOrigin', schemaOrigin);
      }
    });
  });

  Session.set('chaCompanyFullName', !Session.get('chaCompanyFullName') );
});

Template.application_form.onDestroyed(function () {
  delete Session.keys['schemaOrigin'];
  delete Session.keys['showEdit'];
  // log("application_form onDestroyed");
});


Template.application_form.helpers({
  showEdit: function () {
    return _.isEmpty(this.data) || Session.get('showEdit') || false;
  },
});



// 预览
// Template.application_form_preview.events({
//   'click .dataEdit': function (event) {
//     Session.set('showEdit', true);
//   },
//   'click .stepFinished': function () {
//     var taskId = FlowRouter.getParam('taskId');
//     var stepName = Session.get('stepName');
//     Meteor.call('sureStepFinish', taskId, stepName, function (err, ret) {
//       if (err) {
//         log('sureStepFinish', err);
//         alert("操作失败");
//       } else {
//         alert("操作成功");
//       }
//     });
//   }
// });


// 编辑
Template.application_form_edit.onRendered(function () {
  $('#drag-area').dad({
    draggable: 'button'
  });
});

Template.application_form_edit.helpers({
  schemaReady: function () {
    return Session.get('schemaOrigin') || false; // 用于tempStruct的schema是否attach
  },
  schema: function () {
    var schemaOrigin = Session.get('schemaOrigin');
    var schemaO = KEPUtil.convToSchemaOrigin(schemaOrigin);
    // log('getSchema', schemaO);
    return new SimpleSchema(schemaO);
  },
  stepInfo: function () {
    log("application_form_edit", this);
    return this.data || {};
  },
  alternativeName: function (name, index) {
    // log("alternativeName", name, index);
    return {
      name: name,
      dataName: "company.alternativeName." + index + ".name"
    };
  },
  showCompanyNames: function () {
    Session.get('chaCompanyFullName');
    log("showCompanyNames");
    return getCompanyNames() || '.....';
  }
});


Template.application_form_edit.events({
  'change #industryType': function (event) {
    var industryType = $(event.currentTarget).val() || "";
    var businessScope = KEPUtil.getBusinessScope(industryType) || "";
    $("#businessScope").val(businessScope);
  },
  'change .changeCompany': function (event) {
    // log("", $(event.currentTarget) );
    Session.set('chaCompanyFullName',  !Session.get('chaCompanyFullName') );
  },
  'click .plusbtn': function (event, template) {
    var inputNum = $("#drag-area .module").length;
    if (inputNum < 5) {
      // Blaze.render(Template.reserveWord, template.$('#drag-area').get(0));
      $("#backupName").clone().attr('style', '').appendTo('#drag-area');
      indexAlternativeName('#drag-area .module input', "company.alternativeName.$.name");
    } else {
      alert('最多添加5个备选名');
    }
  },
  'click .deleteItem': function (event) {
    $(event.currentTarget).closest(".module").remove();
    indexAlternativeName('#drag-area .module input', "company.alternativeName.$.name");

    Session.set('chaCompanyFullName',  !Session.get('chaCompanyFullName') );
  },
  'click .goldweapon-btn'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    $('#goldweapon').css({"display":"block","margin-right":"0px","max-width":"327px"});
    // $('.searchName').css({"max-width":"150px"});
    // $('#goldweapon').addClass('goldweapon-show');
  },
  'click #close_goldweapon'(event){
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    $('#goldweapon').css({"max-width":"0px","margin-right":"-362px"});
    // $('#goldweapon').addClass('goldweapon-hide');
  },
});


// 公司名
function getCompanyNames () {
  var companyName = []; // 公司名list
  var companyNavName = $("#companyNavName").val() || "";
  companyName.push( companyNavName );
  $('#drag-area .module input').each(function(index, el) {
    var companyAltName = $(el).val() || "";
    if (companyAltName) {
      companyName.push( companyAltName );
    }
  });

  var industry = $("#industryType").val() || ""; // 所属行业

  var companyType = $("#companyType").val() || ""; // 公司类型
  companyType = {'有限责任公司': '有限公司', '有限合伙': '公司'}[companyType];

  var nameStruct = $("#nameStruct").val() || ""; // 公司名结构
  nameStruct = nameStruct.split('-');

  var companyObj = {
    area: '上海',
    industry: industry,
    type: companyType,
  }

  var nameStrList = [];
  if (nameStruct[0] !== 'area') {
    companyObj.area = '（' + companyObj.area + '）';
  }
  companyName.forEach(function (name) {
    companyObj.name = name;

    var nameStr = '';
    nameStruct.forEach(function (key) {
        nameStr += companyObj[key] || '';
    });
    nameStrList.push(nameStr);
  });
  return nameStrList;
}

// 给备选公司input加上排序后的name
function indexAlternativeName (findStr, name) {
  $(findStr).each(function(index, el) {
    var elName = name.replace('$', index);
    // log('indexAlternativeName', index, elName);
    $(el).attr('name', elName);
    $(el).attr('data-schema-key', elName);
  });
}

// 备选字号
Template.reserveWord.events({
  'click .deleteItem': function (event) {
    $(event.currentTarget).closest(".module").remove();
  }
});
