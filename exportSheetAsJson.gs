

function convertSheetToJson(SheetName) {
  var content = getSheetData(SheetName);
  var contentObject = {GoogleSheetData: content}
  return ContentService.createTextOutput(JSON.stringify(contentObject) ).setMimeType(ContentService.MimeType.JSON); 
}

function getSheetData(SheetName)  
{ 
  var dataSheet = utils_getSheet(SheetName);
  var dataRange = dataSheet.getRange(1,1,50,30);
  var dataValues = dataRange.getValues();  
  return dataValues;
}