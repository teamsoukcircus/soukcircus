
let style = 
"<style>.alert {padding: 20px;  background-color: #f44336;  color: white;  opacity: 1;  transition: opacity 0.6s;  margin-bottom: 15px;}.alert.success {background-color: #04AA6D;}.alert.info {background-color: #2196F3;}.alert.warning {background-color: #ff9800;}.closebtn {  margin-left: 15px;  color: white;  font-weight: bold;  float: right;  font-size: 22px;  line-height: 20px;  cursor: pointer;  transition: 0.3s;}  .closebtn:hover {  color: black;} body{text-align: center; font-family: Roboto, Arial, sans-serif; font-size: 14px;}. div{margin: auto;}</style>";

function htmlmodalDialog(title, text, close,level,secDuration)
{
  let htmlText = "<html><head>"+ style + "</head><body>";

    if ( level == 0)
      htmlText += '<div class="alert info"><h3>' + text + '</h3></div>';
    else if (level == 1 )
      htmlText += '<div class="alert success"><h3>' + text + '</h3></div>';
    else
      htmlText += '<div class="alert warning"><h3>' + text + '</h3></div>';

    htmlText += "</body>";

    if(close)
    {
      htmlText += "<script> setTimeout(closePrompt, "+secDuration*1000+"); function closePrompt(){google.script.host.close();}</script>";
    }
    htmlText += "</html>";

  var htmlOutput = HtmlService
    .createHtmlOutput(htmlText)
    .setHeight(100)
    .setWidth(400);
  try 
  {
      SpreadsheetApp.getUi().showModalDialog(htmlOutput, title);
  }
  catch(e)
  {
      errors_logError('function htmlmodalDialog(title, text, close)');
      errors_logErrorException(e);
  }
}

/*==============================*/
function showInfoWindow(title,text)
{
  htmlmodalDialog(title, text, false,0,3);
}

function closeInfoWithSuccessWindow(title,text,secDuration)
{
  htmlmodalDialog(title, text, true,1,secDuration);
}

function closeInfoWithWarningWindow(title,text,secDuration)
{
  htmlmodalDialog(title, text, true,2,secDuration);
}

function closeInfoWithInfoWindow(title,text,secDuration)
{
  htmlmodalDialog(title, text, true,0,secDuration);
}

/*==============================*/

function getMessageHtml(level)
{
  let htmlText = "<html><head>"+ style + "</head><body>";

    if ( level == 0)
      htmlText += '<div class="alert info"><h3><?= text ?></h3></div>';
    else if (level == 1 )
      htmlText += '<div class="alert success"><h3><?= text ?></h3></div>';
    else
      htmlText += '<div class="alert warning"><h3><?= text ?></h3></div>';

    htmlText += "</body></html>";

    return htmlText;

}

function getSuccessHtml()
{
  return getMessageHtml(1);
}

function getInfoHtml()
{
  return getMessageHtml(0);
}

function getWarningHtml()
{
  return getMessageHtml(2);
}

function showWarningWindow(title,text)
{
  htmlmodalDialog(title, text, false,2,0);
}

function closeWarningWithSuccessWindow(title,text,secDuration)
{
  htmlmodalDialog(title, text, true,2,secDuration);
}

function closeWarningWithWarningWindow(title,text,secDuration)
{
  htmlmodalDialog(title, text, true,2,secDuration);
}

function closeWarningWithInfoWindow(title,text,secDuration)
{
  htmlmodalDialog(title, text, true,0,secDuration);
}

/*==============================*/
function showSuccessWindow(title,text)
{
  htmlmodalDialog(title, text, false,1,0);
}

function closeSuccessWithSuccessWindow(title,text,secDuration)
{
  htmlmodalDialog(title, text, true,1,secDuration);
}

function closeSuccessWithWarningWindow(title,text,secDuration)
{
  htmlmodalDialog(title, text, true,2,secDuration);
}

function closeSuccessWithInfoWindow(title,text,secDuration)
{
  htmlmodalDialog(title, text, true,0,secDuration);
}



