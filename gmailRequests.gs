
/**
 * 
 * 
 */
function gmail_History(startHistoryId)
{    
    let request = GMAIL_Request_Names.HISTORY;

    request.params.starHistotyId=startHistoryId;

    let response = gmail_doRequest(request);

    var result = response.getResponseCode();
    if (result == '200') 
    {  // OK

    }
    else 
    {
      // This is only needed when muteHttpExceptions == true
      Logger.log(response.getContentText()); 
      var err = JSON.parse(response.getContentText());
      throw new Error( 'Error (' + result + ") " + err.error.message );
    }
}


/**
 * 
 *  return the mnessage (see doc) or throw an Error. in case of.
 */
function gmail_OneMessage(messageId)
{    
    let request = GMAIL_Requests.ONEMESSAGE;

    request.params.messageId=messageId;
    let response = gmail_doRequest(request);

    if (response.status==GREQUEST_Status.OK) 
    {  // OK
        let responseMsg = response.response;

        let message   = Object.assign({}, GMail_Message);
        message.ID        = responseMsg["id"];
        message.HISTOID   = responseMsg.historyId;
        message.CONTAINER = responseMsg.labelIds["2"]; //INBOX
        message.STATUS    = responseMsg.labelIds["0"];   //UNREAD

        if ( responseMsg.payload.body.data != null )
          message.BODY      = Utilities.base64Decode(responseMsg.payload.body.data);
        else
          message.BODY = "Nobody";

        let headers = responseMsg.payload.headers;
        for(let i=0;i<headers.length;i++)
        {
            if (headers[i].name == "From" )
                message.FROM = headers[i].value;
            else if ( headers[i].name == "To"  )
              message.TO = headers[i].value;
            else if ( headers[i].name == "Subject")
              message.SUBJECT = headers[i].value;
        }

        return message;
    }
    else 
      throw response.error;    
}



/**
 * 
 * 
 */

function test_gmail_AllMessage()
{
  let allMessages = gmail_AllMessage();

  for(let i=0; i<allMessages.length;i++)
  {
    Logger.log(allMessages[i].FROM+ " >>> " + allMessages[i].TO + ", " + allMessages[i].SUBJECT )
    Logger.log("-------------------------------------------");
    Logger.log(allMessages[i].BODY)
    Logger.log("========================================================")
  }
}

/**
 * Return an aray with all messages,  throw an error in case of. 
 */
function gmail_AllMessage()
{    
    let request = GMAIL_Requests.ALLMESSAGES;
    let response = gmail_doRequest(request);

    if (response.status==GREQUEST_Status.OK) 
    {
      let messages= response.response["messages"];
      let allMessages = [];
      for (let i=0;i< messages.length;i++)
        allMessages.push(gmail_OneMessage(messages[i]["id"]));

      return allMessages;
    }
    else 
      throw response.error;
}


const GMAIL_Request_Names =
{
  ALLMESSAGES: "allMessages",
  ONEMESSAGE : "oneMessage",
  HISTORY:    "history"
}

const targetUser = 'soukcircus@gmail.com';
const GMAIL_Requests =
{
  ALLMESSAGES: {  name: GMAIL_Request_Names.ALLMESSAGES,
                  req: `https://gmail.googleapis.com/gmail/v1/users/${targetUser}/messages`,  
                  doc:"https://developers.google.com/gmail/api/reference/rest/v1/users.history/list",
                  params:null
               },
  ONEMESSAGE : {
                name: GMAIL_Request_Names.ONEMESSAGE,
                req: `https://gmail.googleapis.com/gmail/v1/users/${targetUser}/messages`,  
                params: { messageId:null},
                doc: "https://developers.google.com/gmail/api/reference/rest/v1/users.messages/get"
              },
  HISTORY:    {
                name: GMAIL_Request_Names.HISTORY,
                req: `https://gmail.googleapis.com/gmail/v1/users/${targetUser}/history`,
                doc: "https://developers.google.com/gmail/api/reference/rest/v1/users.history/list",
                params: { starHistotyId:null}
              }
}

const GREQUEST_Status=
{
  OK: "ok",
  NOK: "nok"
};

const GMail_Message =
{
  ID:"",
  HISTOID:"",
  CONTAINER:"",
  STATUS:"",
  FROM: "",
  TO: "",
  SUBJECT:"",
  BODY:""
};

function gmail_doRequest(request)
{
  let soukHttpRequest=null;
  let ret = {response:null, status:null, error:"Unknoiw error occurred..."};

  try
  {
    var token = gmail_attemptTokenRefresh() ;

    headers=
    {
        'x-api-key': GOOGLE_CLIENT_ID,
        Authorization: 'Bearer ' + token
    };

    var soukHtttpParams = 
      {
        method: "GET",
        contentType: "application/json",
        headers: headers,
        muteHttpExceptions: true, // for debugging 
      };

    
    switch(request.name)
    {
      case GMAIL_Request_Names.ALLMESSAGES:
        soukHttpRequest = GMAIL_Requests.ALLMESSAGES.req;
      break;

      case GMAIL_Request_Names.ONEMESSAGE:
        if (request.params != null && request.params.messageId!=null)
        {
          soukHttpRequest = GMAIL_Requests.ONEMESSAGE.req + "/"+request.params.messageId;
        }
        else
          throw new Error("No message id provided, see : " + Requests.ONEMESSAGE.doc);
      break;
      
      case GMAIL_Request_Names.HISTORY:

        if (request.starHistotyId==null)
          throw new Error("Params missing, see doc here : "  + Requests.HISTORY.doc);

        soukHttpRequest = Requests.HISTORY.req ;

        soukHttpRequest += "?startHistoryId="+request.params.starHistotyId;

        if ( request.maxResults!=null)
          soukHttpRequest +="maxResults=" + request.maxResults;

        if (request.pageToken != null)
          soukHttpRequest += "&pageToken="+ request.pageToken;

        if (request.labelId != null)
          soukHttpRequest += "&labelId="+request.labelId;
      
      break;

      default:
        soukHttpRequest="";
    }
  }
  catch(err)
  {
      ret.status = GREQUEST_Status.NOK;
      ret.msg = err.msg;
  }
  finally
  {
      if ( soukHttpRequest != null && soukHttpRequest.params != null)
        for(key in soukHttpRequest.params)
          soukHttpRequest.params[key]=null;
  }
  

  if ( soukHttpRequest != null ) 
  {   
      let response = UrlFetchApp.fetch(soukHttpRequest,soukHtttpParams); 
      let result = response.getResponseCode();
      if ( result == '200')
      {
        ret.response =  JSON.parse(response.getContentText());
        ret.status   =  GREQUEST_Status.OK;
      }
      else
      {
        ret.status=GREQUEST_Status.NOK;
        var err   = JSON.parse(response.getContentText());
        ret.error = new Error( 'Error (' + result + ") " + err.error.message );
      }
  }
    
  return ret;
}

//const GOOGLE_GMAIL_REFRESH_TOKEN  = '1//04Po-FtuNWCHECgYIARAAGAQSNwF-L9IrK52KxHs7a2KZUcJ1NWPgVlb5cMqXmI8LeHe-c7kJ8LBQxJgJu7nbocpp4cx8pV0LJjo';
const GOOGLE_GMAIL_REFRESH_TOKEN  = '1//041PDKd1in_6BCgYIARAAGAQSNwF-L9IrwMW1xUGIkd2LHWMOKm6TG3sCMViwGIMac2zYFNDDqlKn3pHzE4Zjv2_gQjHrDAgvwJA';
function gmail_attemptTokenRefresh() 
{
  var refreshToken = GOOGLE_GMAIL_REFRESH_TOKEN;
  if (!refreshToken) {
    Logger.log('No refresh token available to refresh with ' + tokenKey);
    return false;
  }
  var requestData = {
    method: 'post',
    payload: {
      type : 'OAuth2', 
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }
  };

  var response = UrlFetchApp.fetch(GOOGLE_TOKEN_URL, requestData).getContentText();

  //storeOAuthValues_(response);

  let data = JSON.parse(response);

  return data["access_token"];
}


const GMAIL_SERVICE      = "Gmail";
function gmail_enableService()
{
  //Set service data
  //================
  let service = gmail_getGMailService();

  if (!service.hasAccess()) 
  {
    var ui = SpreadsheetApp.getUi();

    let authorizationUrl = service.getAuthorizationUrl();

  ui.alert(authorizationUrl);

   let template = HtmlService.createTemplate(
        '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
        'Reopen the sidebar when the authorization is complete.');
    
    template.authorizationUrl = authorizationUrl;
    var page = template.evaluate();

    
    ui.showSidebar(page);
  }

}

function gmail_Callback(request) {
  var service = gmail_getGMailService();
  var isAuthorized = service.handleCallback(request);
  if (isAuthorized) 
  {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

function gmailTokenHandler(payload) {
  return payload;
}


function gmail_getGMailService() 
  {
  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
  let service = OAuth2.createService(GMAIL_SERVICE)
      .setAuthorizationBaseUrl(GOOGLE_REDIRECT_URI)
      .setTokenUrl(GOOGLE_TOKEN_URL)
      .setClientId(GOOGLE_CLIENT_ID)
      .setClientSecret(GOOGLE_CLIENT_SECRET)
      .setPropertyStore(PropertiesService.getScriptProperties())
      .setCallbackFunction('gmail_Callback')
      .setScope('https://mail.google.com/ https://www.googleapis.com/auth/script.deployments.readonly');

  return service;
}






