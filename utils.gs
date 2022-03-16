


function test_utils_ArraysDifference()
{
  let A=["1","1","2","3","7"];
  let B=["1","2","4","5"];

  Logger.log(utils_ArraysDifference(A,B))
  Logger.log(utils_ArraysDifference(B,A))
}

/**
 * Return an array containint the elements of arr1 not in arr2
 */
function utils_ArraysDifference(arr1,arr2)
{
  return  arr1.filter(x => !arr2.includes(x));
}


function utils_getUrl()
{
  return ScriptApp.getService().getUrl();
}

function utils_getHomeUrl()
{
  return utils_getUrl() +"?actionId=actionHome";
}


function utils_getImageUrl(imageId)
{
  if (imageId!=null)
    return "https://drive.google.com/uc?export=view&id=" + imageId;
  else
    return "";
}

/**
 * test if an object with keys is empty
 */

function utils_isEmpty(obj) 
{
    return Object.keys(obj).length === 0;
}

/**
 * 
 * 
 */
function utils_stringBetweenChars(str, start,end)
{
  return utils_splitString(utils_splitString(str, start)[1], end)
}
/**
 * 
 * Split dans un array tous les assignés à une tâche. Retourne un array de prénoms....pas terrible mais bon...
 */
function utils_splitString(str, sep)
{
  let s=[];
  let sepIsComma = (sep==",");
  let sepIsBlank = (sep==" ");

  let i = str.indexOf(sep);
  if (i==-1)
  {
    if ( sepIsComma || sepIsBlank )
      s.push(str.trim());  
    else
      s.push("'"+str.trim()+"'");
      
    return s;
  }

  let subStr=str;
  s.push(str.substring(0,i));
  subStr = str.substring(i+1,subStr.length)
  while( (i = subStr.indexOf(sep)) != -1 )
  {
    if ( !(sepIsComma || sepIsBlank) ) 
      s.push("'"+subStr.substring(0,i).trim() + "'") ;
    else  
      s.push(subStr.substring(0,i).trim()) ;

    subStr = subStr.substring(i+1,subStr.length)
  }
  if (subStr!=null && subStr.length>0)
    if ( !(sepIsComma || sepIsBlank) ) 
      s.push("'"+subStr.trim()+"'");
    else
      s.push(subStr.trim());

  return s;
}

function test_utils_removeSubStrings()
{
  Logger.log(utils_removeSubStrings("Simon & Co","Co")) 

  Logger.log(">"+utils_removeTailAfter("Simon & Co","&")+"<");
}

function utils_removeSubStrings(inStr,subStr)
{
  let s = utils_removeSpecialChars(inStr)
  return s.replace(subStr,"")
}

function utils_removeTailAfter(inStr,after)
{
  let s = inStr.substring(0,inStr.indexOf(after)).trim();
  return s;
}

function utils_removeSpecialChars(inStr)
{
  return inStr.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
}


function testuuu()
{
  let json = {"transId":2865391955,"receiptId":2364557980,"listingId":946037221,"productId":8088935393,"title":"Bench in raw wood and woven cotton, handmade in natural materials, bohemian chic style","buyer_user_id":142194469,"quantity":1,"price":{"amount":7500,"divisor":100,"currency_code":"EUR"},"shipping":{"amount":0,"divisor":100,"currency_code":"EUR"}};

  let str = JSON.stringify(json)

  coded=utils_escapeDoubleQuotesAndBlanksChars(str);
  
  Logger.log(coded)

  Logger.log(utils_revertEscapeDoubleQuotesChars(coded))  
  let url = "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl="+coded;
  Logger.log(url)
  var urlEncoded = encodeURI(url);
  let blob = UrlFetchApp.fetch(urlEncoded).getBlob(); 

  Logger.log(blob)
}

function utils_escapeDoubleQuotesAndBlanksChars(inStr)
{
  //Logger.log(">>>"+inStr+"<<<");

  let s1 = inStr.replace(/["]/gi, '\'"');
  return s1.replace(/[\s+]/gi, '%20');
}

function utils_revertEscapeDoubleQuotesChars(inStr)
{
  let s1 = inStr.replace(/[']/gi, '');
  return s1.replace(/\W*%20\W*/gi, ' ');
}

function utils_permuteArray(arr)
{
  let found = [];
  let ret = [];

  while(found.length < arr.length)
  {
    let j = utils_randomInteger(0,arr.length);
    if ( found.indexOf(j) == -1)
    {
      found.push(j)
    }
  }

  for(let i=0;i<found.length;i++)
  {
    ret.push(arr[found[i]]);
  }

  return ret;
}


function utils_randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function utils_randomBit()
{
  if ( Math.random() < 0.5)
    return 0;
  
  return 1;
}

function utils_binaryRandomArray(len)
{
  let x=[];
  for(let i=0;i<len;i++)
    x.push(Math.random() < 0.5?0:1);

  return x;
}


function utils_ternaryRandomArray(len)
{
  let x=[];
  for(let i=0;i<len;i++)
  {
    let v = Math.random();
    x.push( v < 1/3 ?-1: v < 2/3 ? 0 : 1);
  }

  return x;
}


function utils_parseInt(val)
{
  let ret = parseInt(val);
  if (isNaN(ret))
    return 0;

  return ret;
}

function utils_parseFloat(val)
{
  let ret = parseFloat(val);
  if (isNaN(ret))
    return 0;

  return ret;
}
/*====================================================================*/

function utils_formatDateForPicker(date)
{
  return Utilities.formatDate(date,CalendarApp.getDefaultCalendar().getTimeZone(), "yyyy-MM-dd");
}

function utils_isTimeLeft(hasStartedAt)
{
  return MAX_EXECUTION_TIME > Date.now() - hasStartedAt;
};

function utils_wait(nSec)
{
    Utilities.sleep(nSec*1000);
}


/**
 * DAtes and times manipulation
 */
function getLocalTime()
{
  return Utilities.formatDate(new Date(), CalendarApp.getDefaultCalendar().getTimeZone(), "yyyy-MM-dd HH:mm"); // "yyyy-MM-dd'T'HH:mm:ss'Z'"
}

/**
 * d = number of day to add if d >0 or substract id d < 0 and date = start date
 */
function utils_addDaysFromDate(date,ndays)
{
  let nSecPerDay = NSEC_PER_DAY;
  return new Date(date.getTime()+ndays*nSecPerDay);
}

function utils_nDaysBetweenTwoDates(date1,date2)
{
  return Math.abs(utils_realNDaysBetweenTwoDates(date1,date2));
}

function utils_realNDaysBetweenTwoDates(date1,date2)
{
  return (date2.getTime()-date1.getTime())/NSEC_PER_DAY;
}

function divideDiffDatesByNDaysDates(start,subThis,ndays)
{
  if (ndays != 0)
  {
    let nSecPerDay = NSEC_PER_DAY;
    let inSec = ndays*nSecPerDay;

    return (start.getTime()-subThis.getTime())/inSec;
  }

  return Infinity;
}
/**
 * 
Letter	Date or Time Component	Presentation	Examples
G	Era designator	Text	AD
y	Year	Year	1996; 96
Y	Week year	Year	2009; 09
M	Month in year	Month	July; Jul; 07
w	Week in year	Number	27
W	Week in month	Number	2
D	Day in year	Number	189
d	Day in month	Number	10
F	Day of week in month	Number	2
E	Day name in week	Text	Tuesday; Tue
u	Day number of week (1 = Monday, ..., 7 = Sunday)	Number	1
a	Am/pm marker	Text	PM
H	Hour in day (0-23)	Number	0
k	Hour in day (1-24)	Number	24
K	Hour in am/pm (0-11)	Number	0
h	Hour in am/pm (1-12)	Number	12
m	Minute in hour	Number	30
s	Second in minute	Number	55
S	Millisecond	Number	978
z	Time zone	General time zone	Pacific Standard Time; PST; GMT-08:00
Z	Time zone	RFC 822 time zone	-0800
X	Time zone	ISO 8601 time zone	-08; -0800; -08:00


Western European Time / Greenwich Mean Time (UTC). = GMT+0
Western European Time / Greenwich Mean Time (UTC)
Western European Summer Time / British Summer Time / Irish Standard Time (UTC+1)
Central European Time (UTC+1)
Central European Summer Time (UTC+2)
Eastern European Time / Kaliningrad Time (UTC+2)
Eastern European Time (UTC+2)
Eastern European Summer Time (UTC+3)
Moscow Time / Turkey Time (UTC+3)

format = see ENUM_DATE_FORMAT in constants.gs
 */
function  test_utils_FormatDate()
{
  let x = new Date(getLocalTime());
  Logger.log(utils_FormatDate(2022,12,0,ENUM_DATE_FORMAT.MSHORT));

  Logger.log(utils_LocalGMTTimeFormatDate(ENUM_DATE_FORMAT.LONG_HHMMSS));

   Logger.log(utils_LocalGMTTimeFormatDate(ENUM_DATE_FORMAT.LONG));

   Logger.log(utils_LocalGMTTimeFormatThisDate(new Date(),ENUM_DATE_FORMAT.LONG_HHMMSS));


   Logger.log(utils_DateForGantts(new Date()));

  Logger.log(utils_LocalGMTTimeFormatThisDate(new Date(),ENUM_DATE_FORMAT.MEDIUMDDMMYYYY));
}

function  utils_DateForGantts(date)
{
    return new Date(date.getFullYear(),date.getMonth(),date.getDate());
}

function  test_FormatThisDate()
{
    let date = new Date();
    let date2 = utils_formatDateForPicker(date);

    Logger.log(utils_FormatThisDate(date,ENUM_DATE_FORMAT.SHORT))
    Logger.log(utils_FormatThisDate(new Date(date2),ENUM_DATE_FORMAT.SHORT))
}

function  utils_FormatThisDate(date,format)
{
    return utils_FormatDate(date.getFullYear(),date.getMonth(),date.getDate(),format);
}


function  utils_FormatDate(year,month,day,format)
{
    return Utilities.formatDate(new Date(year,Math.min(month,11),Math.max(day,1)),"GMT", format);
}

function test_utils_LocalGMTTimeFormatThisDate()
{
      Logger.log(new Date(getLocalTime()).getMonth());
      Logger.log(utils_LocalGMTTimeFormatThisDate(new Date(),ENUM_DATE_FORMAT.LONG));
}
function  utils_LocalGMTTimeFormatThisDate(date,format)
{
  return Utilities.formatDate(date,"GMT", format);
}

function  utils_LocalGMTTimeFormatDate(format)
{
  return Utilities.formatDate(new Date(getLocalTime()),"GMT", format);
}


function  utils_getMonthName(locales,month) 
{
  var year = new Date().getFullYear();
  return new Date(year,month,1).toLocaleDateString(locales, { month:"long"}) ;
}


function utils_officialDatFormat(date)
{
  return utils_LocalGMTTimeFormatThisDate(date,ENUM_DATE_FORMAT.MEDIUMDDMMYYYY)
}

/**
 * @param {month} numeric month for which you look the day of
 * @param {year}  numeric year YYYY
 * @return{day}  the number of days for specified month and year
 */
function utils_getDaysInMonth(month,year)
{
  month = Math.min(Math.max(month,1),12);
  return (new Date(year, month, 0)).getDate();
}

/**
 * @param {Date} Date1 value e.g. new Date()
 * @param {date}  Date2 value e.g. new Date()
 * @return{day}  the number of days between these two dates
 * utils_daysBetweenDatesInMonth(new Date(),new Date()) returns 0
 */
function utils_daysBetweenDatesInMonth(d1,d2)
{
  return parseInt((d2.getTime()-d1.getTime())/(NSEC_PER_DAY));
}


/**
 * @param {number} remining days from this specified day fromDay 
 * @param {number} for this specific month
 * @param {number}  and this specific year
 * @return{number} 0...31 number of  days remaining
 */
function utils_getRemainingDaysInMonth(fromDay, month,year)
{
  return utils_getDaysInMonth(month,year) - fromDay ;
}


/**
 * @param {month} numeric month for which you look the day of
 * @return{number} 1...31 number of  days till end of specified month, e.g. utils_getRemainingDaysInMonth(1)
 */
function utils_getRemainingDaysInMonth(month)
{
  let currMonth = utils_getCurrentMonth();

  if ( month < currMonth)
    return 0;

  let dInM = utils_getDaysInMonth(month,utils_getCurrentYear()) 
  let actualD = new Date().getDate() ;
  let diff = dInM-actualD;
  return Math.max(0,diff);
}


/**
 * @return{number}  current days in the currenmt month and year
 */
function utils_getCurrentDayInMonth()
{
  return (new Date()).getDate();
}

/**
 * @return{number}  current month in range [0..11]
 */
function utils_getCurrentMonth()
{
  return (new Date()).getMonth();
}

/**
 * @return{number}  current year in YYYY digits
 */
function utils_getCurrentYear()
{
  return (new Date()).getFullYear();
}


function util_helperInsertLink(range,text,url)
{
  var richValue = SpreadsheetApp.newRichTextValue()
   .setText(text)
   .setLinkUrl(url)
   .build();
 range.setRichTextValue(richValue);
}

function utils_insertHyperLinkInCell(namedCell,text,url) 
{
  util_helperInsertLink(utils_getNamedCellRangeInSheet(namedCell),text,url);
}

function utils_insertHyperLinkInCellByCoord(row,col,sheetName,text,url) 
{
  util_helperInsertLink(utils_getRangeByCoord(row,col,sheetName),text,url);
}

function utils_getColumnNrByName(sheetName, colName) 
{
  let sheet = utils_getSheet(sheetName);
  var range = sheet.getRange(1, 1, 1, sheet.getMaxColumns());
  var values = range.getValues();
  
  let colNameSearch = "%"+colName + "%";
  for (var row in values) {
    for (var col in values[row]) {
      if (values[row][col] == colName) {
        return parseInt(col);
      }
    }
  }
  
  throw 'failed to get column by name';
}

function getSortedKeys(okeyValueListj) 
{
    return Object.entries(okeyValueListj).sort((a,b) => b[1]-a[1]);
}


/*============================== JASON and Co ===============================*/
function utils_encodeObject(anObject)
{
  return JSON.stringify(anObject);
}

function utils_decodeObject(codedObject)
{
  return JSON.parse(codedObject);
}


function test_converObjectToArray() 
{
  let codedObject = '[{"transId":2826534709,"receiptId":2335415521,"listingId":946037221,"productId":8325940182},{"transId":2823234452,"receiptId":2335415521,"listingId":946581388,"productId":5958114251}]';

  utils_convertObjectToArray(codedObject);
}

function utils_convertObjectToArray(codedObject) 
{
  let k,outerArray;

  outerArray = [];  
  let cc = JSON.parse(codedObject)
  for (let i=0;i<cc.length;i++)
  {
    let inObj = cc[i];
    inArray = [];

    for (k in inObj) 
    {
      inArray.push(inObj[k]);
    }
    outerArray.push(inArray)
  }
  return outerArray;
  //Logger.log(outerArray)
}

function converJasonArrayToStdArray(jArray) 
{
  let k,outerArray;

  outerArray = [];  
  
  for (let i=0;i<jArray.count;i++)
  {
    let inObj = JSON.parse(jArray.results[i]);

    inArray = [];
    for (k in inObj) 
    {
      inArray.push(inObj[k]);
    }
    outerArray.push(inArray)
  }
  return outerArray;
  //Logger.log(outerArray)
}
/*==========================================================================*/
function test_histoOnArray()
{
  let theArrayIn=[1,1,1,2,3,4,4,4,5,4,4,5,6,7,8,9,3,4,4,4,4,4,4,4,8,8,7,7,7,6,6,6];
 
  Logger.log(histoOnArray(theArrayIn));

  
}

function histoOnArray(theArrayIn)
{
  const counts = {};
  theArrayIn.forEach((x) => {
      counts[x] = (counts[x] || 0) + 1;
  });
  
  return getSortedKeys(counts);
}

function hyperlinkRange() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet1 = ss.getSheetByName("Annuel");
  var sheet2 = ss.getSheetByName("Annuel").getSheetId();

  let value = '=hyperlink("#gid='+sheet2+'&range=graphsCell'+'", "Click to jump to Sheet 2")';

  sheet1.getRange("A1").setValue(value);


}


function utils_name(sheetName,cellName)
{
  return sheetName + "!" + cellName;
}


function utils_getNamedCellValue(cellName)
{
  return SpreadsheetApp.openById(prop_getSpreadSheetId()).getRangeByName(cellName).getValue();
}

function utils_getNamedCellValueInSheet(sheetName,cellName)
{
  return SpreadsheetApp.openById(prop_getSpreadSheetId()).getRangeByName(utils_name(sheetName,cellName)).getValue();
}


function utils_getNamedCellValueRowColOffet(sheetName,cellNamedRange,rowOffset,colOffet)
{
  let sheet = utils_getSheet(sheetName);
  let range = utils_getNamedCellRowColInSheet(sheetName,cellNamedRange);

  return sheet.getRange(range.row+rowOffset,range.col+colOffet).getValue();

}



/**
 * 0 based offsets
 */
function utils_getNamedCellRowColOffet(cellNamedRange,rowOffset,colOffet)
{
  let range = getNamedCellRowCol(cellNamedRange);
  let ro = range.row+rowOffset;
  let co = range.col+colOffet;
  let rowCol={"row":ro,"col":co};

  return rowCol;
}

function utils_getNamedCellRowColInSheet(sheetName,cellNamedRange)
{
  let range = utils_getNamedCellRangeInSheet(sheetName,cellNamedRange); 
  let rowCol= 
  {
      "row":range.getRow(),
      "col":range.getColumn()
  };

  return rowCol;
}


function utils_duplicateSheet(masterSheetName,targetSheetName)
{
  let ss = SpreadsheetApp.openById(prop_getSpreadSheetId());

  const master = ss.getSheetByName(masterSheetName);
  master.copyTo(ss).setName(targetSheetName)
}


function utils_duplicateAndRemoveSheet(masterSheetName,targetSheetName)
{
  let ss = SpreadsheetApp.openById(prop_getSpreadSheetId());

  let theTargetSheet = ss.getSheetByName(targetSheetName);
  if (theTargetSheet != null)
  {
    ss.deleteSheet(theTargetSheet);
  }

  const master = ss.getSheetByName(masterSheetName);
  master.copyTo(ss).setName(targetSheetName)
}



function utils_removeSheet(sheetName)
{
  let ss = SpreadsheetApp.openById(prop_getSpreadSheetId());
  let sheet = ss.getSheetByName(sheetName);
  if ( sheet != null )
    ss.deleteSheet(sheet);
}

function utils_insertSheet(sheetName)
{
  let ss = SpreadsheetApp.openById(prop_getSpreadSheetId());
  ss.insertSheet(sheetName);
}

function utils_getSheet(sheetName)
{
  let TASK_SPREADSHEET_ID = "1DkWlabZtXY0UTn2xcdLMzMewfRo2oZ6lWgLeq_V7yog";
  switch(sheetName)
  {
    case TASKS_SHEET:
    return SpreadsheetApp.openById(TASK_SPREADSHEET_ID).getSheetByName("Tasks")

    default:
    return SpreadsheetApp.openById(G_SPREADSHEET_APP_ID).getSheetByName(sheetName);
  }
}

function utils_getTable(ssId,sheetName)
{
    return SpreadsheetApp.openById(ssId).getSheetByName(sheetName);
}


function utils_getSpreadSheet()
{
  return SpreadsheetApp.openById(G_SPREADSHEET_APP_ID);
}

function utils_getAndInsertSheet(sheetName)
{
  let sheet = utils_getSheet(sheetName)
  if (sheet==null)
  {
    utils_insertSheet(sheetName);
    sheet = utils_getSheet(sheetName);
  }

  return sheet;
}

function utils_getNamedCellRangeInSheet(sheetName, cellName)
{
  return SpreadsheetApp.openById(prop_getSpreadSheetId()).getRangeByName(utils_name(sheetName, cellName));
}

function utils_getRangeByCoord(row,col,sheetName)
{
  return utils_getRangeByCoordAndSpanInSheet(row,0,col,0,sheetName);
}

/**
 * 1 based spans
 */
function utils_getRangeByCoordAndSpanInSheet(row,rowSpan,col,colSpan,sheetName)
{
  return utils_getSheet(sheetName).getRange(row,col,rowSpan+1,colSpan+1);
}




function utils_setValueByCoord(row,col,sheetName,value)
{
  let sheet = utils_getSheet(sheetName);
  return sheet.getRange(row,col).setValue(value);
}

function getRange(sheetName,rangeName)
{
  let ss = SpreadsheetApp.openById(prop_getSpreadSheetId());
  return ss.getSheetByName(sheetName).getRange(rangeName);
}

function getValue(sheetName,rangeName)
{
  return getRange(sheetName,rangeName).getValue();  
}


function utils_SetCellValueInSheet(sheetname,cellName,value)
{
  SpreadsheetApp.openById(prop_getSpreadSheetId()).getRangeByName(utils_name(sheetname,cellName)).setValue(value); 
}

function utils_GetCellValue(sheetName,cellName)
{
  return SpreadsheetApp.openById(prop_getSpreadSheetId()).getRangeByName(utils_name(sheetName,cellName)).getValue(); 
}

/*======*/
function utils_SetCellValueByCoordInSheet(sheetName,row,col,value)
{
  let range = utils_getRangeByCoord(row,col,sheetName);
  range.setValue(value); 
}

function utils_GetCellByCoordValue(sheetName,row,col)
{
  let range = utils_getRangeByCoord(row,col,sheetName);
  return range.getValue(); 
}
/*======*/


function utils_getNamedRangesByArray(sheetName,arrayOfNamedRef) 
{
  return utils_getSheet(sheetName).getRangeList(arrayOfNamedRef).getRanges();
}

function utils_GetNamedRangeValuesInSheet(sheetName,rangeName)
{
  return SpreadsheetApp.openById(prop_getSpreadSheetId()).getRangeByName(utils_name(sheetName,rangeName)).getValues().filter(String);
}



/* ============================================================================ */

function updateJsonSheet(sheetName,response)
{
      let allRecords=[];
      let json = JSON.parse(response);
      var array = [];
      for (var i = 0; i< json.results.length; i++)
      {
        var newJson = Object.keys(json.results[i]).map(function (key) 
        { 
          return [key, json.results[i][key]]; 
        }); 
        for(var j = 0; j< newJson.length; j++)
        {
          allRecords.push(newJson[j]);
        }
      }

 
    let sh = utils_getSheet(sheetName);
    var range = sheet.getRange(1,1, allRecords.length, allRecords[0].length);
    range.clear();
    range.setValues(allRecords);
}





function utils_emailChartSourceImage(emailSubject, emailBody,emailsListInString)
{
  
  let chartsToMail=[];

  //Then for current month
  let month = utils_getCurrentMonth();

  sheet = utils_getSheet(SHEET_MONTH_NAMES[month]); 
  charts = sheet.getCharts(); 
  for(let i=0;i<charts.length;i++)
  {
    let cType=charts[i].modify().getChartType();
    if ( cType == Charts.ChartType.LINE )
    {
        chartsToMail.push(charts[i]);
    }
  } 


  // setup some variables for our email
  const chartBlobs = new Array(); 
  const emailImages = {};
  let newEmailBody = "<html><h3>"+emailBody+"</h3><br><h3>Charts</h3><br>"; 
  newEmailBody +="<table>"
  chartsToMail.forEach(function(chart, i){
    chartBlobs[i] = chart.getAs("image/png");
    if (i%2==0)
    {
      newEmailBody += "<tr><td>";
      newEmailBody += "<img src='cid:chart"+i+"'>"; // Alligning the chart to the center of the body in the email
      newEmailBody += "</td>";
    }
    else if (i%2==1)
    {
      newEmailBody += "<td>";
      newEmailBody += "<img src='cid:chart"+i+"'>"; // Alligning the chart to the center of the body in the email
      newEmailBody += "</td></tr>";
    }
    emailImages["chart"+i] = chartBlobs[i];
  });
  
  if (chartsToMail.length <= 2)
    newEmailBody +"</tr>";

  newEmailBody += "</table></html>";


  /*
  MailApp.sendEmail({
    to: emailsListInString,
    subject: emailSubject,
    htmlBody: newEmailBody,
    inlineImages:emailImages}); 
  */
}

/**
 * ===================================================================================
 */


function utilFindCellWithValue(thisValue, sheetName) 
{
  let sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();

  for (var i = 0; i < values.length; i++) {
    var row = "";
    for (var j = 0; j < values[i].length; j++) {     
      if (values[i][j] == thisValue) {
        row = values[i][j+1];
        return i+1;
      }
    }    
  }  

  return -1;
}

/**
 *  input [[a,x,..],[b,y,..],[c,z,..],...]
 * output [[a,b,c,...],[x,y,z,...],... 
 */
function utils_rangeInArray(range)
{
  let ret=[];
  let single = range[0].length;

  for (let j=0;j<single;j++)
  {
    ret.push([]);
  }

  for (let i=0;i<range.length;i++)
  {
    for (let j=0;j<single;j++)
    {
      ret[j].push(range[i][j]);
    }
  }

  return ret;
}
/**
 * ====================================== SORTING ================================================
 */
function utils_sort(sheetName,columnName,ascMode) 
{
  let range = getRange(sheetName,columnName);
  range.sort({column: range.getColumn(), ascending: ascMode}); 
}


function utils_initBidimensionalArray(nrows,ncols)
{
  let ret = new Array(nrows);
  for(i=0; i<nrows; i++)
  {
    ret[i] = new Array(ncols);
  }
  return ret;
}

function utils_resetBidimensionalRange(sheetName,startRow,startCol,nrows,ncols)
{
  let r = utils_initBidimensionalArray(nrows,ncols);
  utils_getRangeByCoordAndSpanInSheet(startRow,nrows-1,startCol,ncols-1,sheetName).setValues(r);
}




/*
 * ======================================================================================
 */

/**
 * 
 * 
 * Multiply matrices
 */

function utils_multiplyMatrices(a, b)
{
   if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) 
   {
      throw new Error('arguments should be in 2-dimensional array format');
   }

   let x = a.length,
   z = a[0].length,
   y = b[0].length;
   if (b.length !== z) 
   {
      // XxZ & ZxY => XxY
      throw new Error('number of columns in the first matrix should be. the same as the number of rows in the second');
   }

   let productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
   let product = new Array(x);
   for (let p = 0; p < x; p++) 
   {
      product[p] = productRow.slice();
   }
   for (let i = 0; i < x; i++) 
   {
      for (let j = 0; j < y; j++) 
      {
         for (let k = 0; k < z; k++) 
         {
            product[i][j] += a[i][k] * b[k][j];
         }
      }
   }
   return product;
}


function utils_transposeMatrix(mat) 
{
  let rowLength = mat[0].length;
  let result = new Array(rowLength);

  for(let i=0;i<rowLength;i++)
    result[i] = new Array(mat.length);


    for (var i = 0; i <rowLength ; i++) 
    {
        for (var j = 0; j < mat.length; j++) 
        {
            result[i][j] = mat[j][i];
        }
    }

    return result;
}



function convertSheetToJson(SheetName) {
  var content = getSheetData(SheetName);
  var contentObject = {GoogleSheetData: content}
  return ContentService.createTextOutput(JSON.stringify(contentObject) ).setMimeType(ContentService.MimeType.JSON); 
}

function getSheetData(SheetName)  
{ 
  var dataSheet = utils_getSheet(SheetName);
  //var dataRange = dataSheet.getDataRange();
  var dataRange = dataSheet.getRange(2,5,36,16);
  var dataValues = dataRange.getValues();  
  return dataValues;
}
