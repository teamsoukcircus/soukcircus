

const GENERIC_Request_names=
{
  DEPLOYMENTS: "Deployements", 
}

const GENERIC_Requests =
{
  DEPLOYMENTS: {  name: GENERIC_Request_names.DEPLOYMENTS,
                  req: 'https://script.googleapis.com/v1/projects/1wYd0ieG3i6IEJDIhEtYwfVx0IPjEV6PcOod1IvVAlxObLlw1BhsQcf7q/deployments',  
                  doc:"",
                  params:null
               }
}

function test_requester_doRequest()
{
  Logger.log(requester_doRequest(GENERIC_Requests.DEPLOYMENTS));
}

//https://script.googleapis.com/v1/projects/1wYd0ieG3i6IEJDIhEtYwfVx0IPjEV6PcOod1IvVAlxObLlw1BhsQcf7q/deployments

function requester_doRequest(request)
{
  let soukHttpRequest=null;
  let ret = {response:null, status:null, error:"Unknown error occurred..."};

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
        muteHttpExceptions: false, // for debugging 
      };

    
    switch(request.name)
    {
      case GENERIC_Request_names.DEPLOYMENTS:
        soukHttpRequest = GENERIC_Requests.DEPLOYMENTS.req;
      break;

      default:
        soukHttpRequest=null;
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


const MYGOOGLE_REFRESH_TOKEN  = '1//041PDKd1in_6BCgYIARAAGAQSNwF-L9IrwMW1xUGIkd2LHWMOKm6TG3sCMViwGIMac2zYFNDDqlKn3pHzE4Zjv2_gQjHrDAgvwJA';
function generic_attemptTokenRefresh() 
{
  var refreshToken = MYGOOGLE_REFRESH_TOKEN;
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


const GENERIC_SERVICE      = "Generic";
function generic_enableService()
{
  //Set service data
  //================
  let service = generic_getService();

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

function generic_Callback(request) 
{
  var service = generic_getService();
  var isAuthorized = service.handleCallback(request);
  if (isAuthorized) 
  {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

function genericTokenHandler(payload) {
  return payload;
}


function generic_getService() 
  {
  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
  let service = OAuth2.createService(GENERIC_SERVICE)
      .setAuthorizationBaseUrl(GOOGLE_REDIRECT_URI)
      .setTokenUrl(GOOGLE_TOKEN_URL)
      .setClientId(GOOGLE_CLIENT_ID)
      .setClientSecret(GOOGLE_CLIENT_SECRET)
      .setPropertyStore(PropertiesService.getScriptProperties())
      .setCallbackFunction('generic_Callback')
      .setScope('https://www.googleapis.com/auth/script.deployments');

  return service;
}






