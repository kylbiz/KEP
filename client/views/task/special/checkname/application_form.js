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
Template.application_form_preview.events({
  'click .dataEdit': function (event) {
    Session.set('showEdit', true);
  },
  'click .stepFinished': function () {
    var taskId = FlowRouter.getParam('taskId');
    var stepName = Session.get('stepName');
    Meteor.call('sureStepFinish', taskId, stepName, function (err, ret) {
      if (err) {
        log('sureStepFinish', err);
        alert("操作失败");
      } else {
        alert("操作成功");
      }
    });
  }
});


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
    var nameStruct = 'name-area-industry-type'; // 'area-name-industry-type'
    var area = '上海';
    var companyName = [ '开业啦', '开业啦二', '开业啦三' ];
    var industryType = '网络技术';
    var companyType = {'有限责任公司': '有限公司'}['有限责任公司'];

    var companyObj = {
      area: '上海',
      industry: '网络技术',
      type: '有限公司'
    }

    var nameStrList = [];
    var nameStruct = nameStruct.split('-');
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

    return nameStrList || '.....';
  }
});


Template.application_form_edit.events({
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
