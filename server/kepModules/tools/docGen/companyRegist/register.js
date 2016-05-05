/*
 * 公司注册 - 工商登记 - 文档生成
**/

DocGen.register = {}

var expectStruct = {

}


DocGen.register.genDoc = function (doc) {
  doc = expectStruct;

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


