/*
 * 子任务的具体步骤数据的schema相关处理
 **/

SchemaHandle = {};


/*
 * 获取某个schema的Object
 **/
SchemaHandle.getSchema = function (schemaId) {
  check(schemaId, String);
  var schemaInfo = KUtil.dataIsInColl({coll: StepInfosSchema, dataId: schemaId});
  return schemaInfo.schema;
}


/*
 * 创建一个新的schema
 **/
SchemaHandle.createSchema = function (schemaOrigin) {

}

/*
 * 删除一个schema
 **/
SchemaHandle.deleteSchema = function (schemaId) {
  check(schemaId, String);
  KUtil.dataIsInColl({coll: StepInfosSchema, dataId: schemaId});
  return StepInfosSchema.remove({_id: schemaId});
}



/*
 * 将保存在collection中的schema数据转换成实际生成schema所需要的obj
 **/
function convToSchemaOrigin (saveObj) {
  var newObj = {};
  for (var key in saveObj) {
    var type = saveObj[key].type;
    saveObj[ key ]["type"] = {
      "String": String,
      "Object": Object,
      "Number": Number,
      "Array": Array,
      "Boolean": Boolean,
      "Date": Date
    }[type];

    newObj[ key.replace(/\-/g, ".") ] = saveObj[key];
  }

  return newObj;
}


/*
 * 将schema的原始Obj转换成collection要求的结构
 **/
function convToSaveObj (SchemaOrigin) {

}


