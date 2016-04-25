/*
 * 公司注册 - 核名 - 文档生成
**/

DocGen.checkName = {}

// 生成文档所数据
var expectStruct = {
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
}


DocGen.checkName.genDoc = function () {
  var doc = expectStruct;

  DocGen.genDocRemote(doc, function (err, result) {
    if (err || !result || !result.fileUrl) {
      throw new Meteor("生成文档失败", err || "未知错误");
    } else {
      var fileUrl = result.fileUrl;
      DocGenerated.insert({
        uuid: doc.randomStr,
        url: fileUrl,
        templateId: doc.fileName,
        label: doc.cnLabel,
        createdBy: Meteor.userId(),
        createdAt: new Date(),
      });
    }
  });
}



