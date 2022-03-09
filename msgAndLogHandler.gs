DEBUG=true;

function setDebugMode()
{
  DEBUG=true;
  //PropertiesService.getScriptProperties().setProperty("debug",true);
}

function resetDebugMode()
{
  DEBUG=false;
  //PropertiesService.getScriptProperties().setProperty("debug",false);
}

function getDebugMode()
{
  PropertiesService.getScriptProperties().getProperty("debug");
}

function debug_logError(text) 
{
  if (DEBUG)
  {
    let err = [getLocalTime(), text];
    utils_getSheet(ERROR_SHEET).appendRow("Debug: " + err);
  }
}

function log_RessourceTaskForm(text) {
  if (DEBUG)
  {  
    let msg = [getLocalTime(), text];
    utils_getSheet(RESSOURCES_TASKFORMS_SHEET).appendRow(msg);
  }
}


function errors_logError(text) {
    let err = [getLocalTime(), text];
    utils_getSheet(ERROR_SHEET).appendRow(err);
}

function errors_logErrorException(e) {
    errors_logError(e.message); 
}

function errors_logErrorAndEmail(text) 
{
  errors_logError(text);
  MailApp.sendEmail(getEmailIT(), getStoreName() + " . Error", getLocalTime() + ": " + text); 

}

function errors_logErrorExceptionAndEmail(e) {
  errors_logError(e.message);  
  //MailApp.sendEmail(getEmailIT(), getStoreName() + " . Exception", getLocalTime() + ": " + e.message); 
}

function successs_logAndEmail(text) 
{
  errors_logError(text);
  MailApp.sendEmail(getEmailIT(), "Success", getLocalTime() + ": " + text); 

}

/**
 * ==================================== MAILING ===============================================
 */
function sendErrorMail(email,subjectText,bodyText)
{
    let replyTo = getStoreEmail();

    sendMailWithReply(email, replyTo, subjectText, bodyText);
}

function sendMailWithReply(email,replyTo,subjectText,bodyText)
{
    MailApp.sendEmail(email, replyTo, subjectText, bodyText);
}

function sendMail(email,subjectText,bodyText)
{
    MailApp.sendEmail(email, subjectText, bodyText);
}