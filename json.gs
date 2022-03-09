function json_convertToJson(sheetName) {
  const sheet = utils_getSheet(sheetName);

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  
  // First find out headers
  var headerRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var headerArray = headerRow.map(function() { return null; });
  // Header could have sub headers separated by ':';
  for (var i = 0; i < lastColumn; i += 1) {
    var f = headerRow[i];
    var parts = f.split(':');
    headerRow[i] = parts.map(function(p) { return isNaN(parseInt(p)) ? p : parseInt(p); })
  }
  Logger.log(headerRow);
  
  var result = [];
  var values = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  for (var i = 0; i < (lastRow - 1); i += 1) 
  {
    var record = {};
    var row = values[i];
    for (var j = 0; j < lastColumn; j += 1) 
    {
      var value = row[j];
      if (typeof value === "object") 
      {
        if (value.constructor.name === "Date") 
        {
          value = value.getTime() / 1000;
        }
      } 
      else if (typeof value === "string") 
      {
        var firstChar = value.charAt(0);
        if (value === '') {
          value = null;
        } else if (firstChar === '[' || firstChar === '{' || firstChar === '"') {
          value = JSON.parse(value);
        } else if (firstChar === '@') {
          var pos = value.indexOf(':');
          value = parseInt(value.substr(pos + 1));
        }
      }
      
      if (value !== null) 
      {
        var fields = headerRow[j];
        var res = record;
        
        var nextField = fields[0];
        for (var k = 0; k < fields.length - 1; k += 1) {
          var field = fields[k];
          nextField = fields[k + 1];
          if (!res[field]) {
            res[field] = typeof nextField === 'number' ? [] : {};
          }
          res = res[field];
        }
        
        res[nextField] = value;
      }
    }
    result.push(record);
  }
  
  return JSON.stringify(result, null, 2);
//  var file = DriveApp.createFile(sheet.getName() + ".json", JSON.stringify(result));
//  var fileId = file.getId();
//  var fileName = file.getName();
//  
//  var url = ScriptApp.getService().getUrl() + '?&ID='+fileId+'&name='+fileName;
//var html = '<div><pre>' + JSON.stringify(result, null, 2) + '</pre></div>';
    
  //var htmlOutput = HtmlService.createHtmlOutput(html).setWidth(100).setHeight(600).setTitle('Download JSON');
  //SpreadsheetApp.getUi().showSidebar(htmlOutput);
}
