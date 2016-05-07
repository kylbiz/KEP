/*
 * schema相关的处理
 **/

SchemaHandle = {};


/*
 * 获取某个schema的Object
 **/
SchemaHandle.getSchema = function (schemaId) {
  check(schemaId, String);
  var schemaInfo = KUtil.dataIsInColl({coll: StepInfosSchema, dataId: schemaId});
  return convToSchemaObj(schemaInfo);
}


/*
 * 创建一个新的schema
 **/
SchemaHandle.createSchema = function (schemaObj) {

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
function convToSchemaObj (saveObj) {

}


/*
 * 将schema的原始Obj转换成collection要求的结构
 **/
function convToSaveObj (schemaObj) {

}


