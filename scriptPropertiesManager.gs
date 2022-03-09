


function getSpreadSheetInitialized()
{
  let adminGene = getAdminGeneOk();
  let adminFrais =  adminFraisOk();

  if (adminGene == null )
    return adminGeneOk;
    
  if (adminFrais == null )
    return adminFraisOk;

  //Tout est ok
  return spreadSheetInitialized;
}


function getAdminGene()
{
  return PropertiesService.getScriptProperties().getProperty(adminGene);
}

function setAdminGene(value)
{
  PropertiesService.getScriptProperties().setProperty(adminGene, value)
}

function getAdminFrais()
{
  return PropertiesService.getScriptProperties().getProperty(adminFrais);
}

function setAdminFrais(value)
{
  PropertiesService.getScriptProperties().setProperty(adminFrais, value)
}


function getAdminGeneOk()
{
  return PropertiesService.getScriptProperties().getProperty(adminGeneOk);
}

function setAdminGeneOk(value)
{
  PropertiesService.getScriptProperties().setProperty(adminGeneOk, value)
}


function getAdminFraisOk()
{
  return PropertiesService.getScriptProperties().getProperty(adminFraisOk);
}

function setAdminFraisOk(value)
{
  PropertiesService.getScriptProperties().setProperty(adminFraisOk, value)
}

function deleteAllScriptProperties()
{
  PropertiesService.getScriptProperties().deleteAllProperties();
}


function prop_getSpreadSheetId()
{
  //return PropertiesService.getScriptProperties().getProperty(spreadSheetId);
  return G_SPREADSHEET_APP_ID;
}

/**
 * !! val ignored on purpose. technical concern for uniform call of set functions
 */
function setSpreadSheetId(val)
{
  let id = SpreadsheetApp.getActive().getId();
  PropertiesService.getScriptProperties().setProperty(spreadSheetId,id);
}


function getTrendNetEncaisse()
{
  return PropertiesService.getScriptProperties().getProperty(trendNetEncaisse);
}

function setTrendNetEncaisse(trendVal)
{
  PropertiesService.getScriptProperties().setProperty(trendNetEncaisse,trendVal);
}

function setCleanTriggers(val)
{
  PropertiesService.getScriptProperties().setProperty(indicatorCleanTriggersCLEAN_ALL_TRIGGERS,val);
}

function getCleanTriggers()
{
  let val = PropertiesService.getScriptProperties().getProperty(indicatorCleanTriggersCLEAN_ALL_TRIGGERS);  
  if (val == null )
  {
    setCleanTriggers(0);
    return 0;
  }

  return parseInt(val);
}

function testStatus()
{
  setAdminGeneOk(1);
  setAdminFraisOk(1);
}


function setMailingOff()
{
  PropertiesService.getScriptProperties().setProperty("mailing",false);
}

function setMailingOn()
{
  PropertiesService.getScriptProperties().setProperty("mailing",true);
}

function isMailingServiceOn()
{
    return PropertiesService.getScriptProperties().getProperty("mailing");
}



function setDataNotAvailable()
{
  PropertiesService.getScriptProperties().setProperty("dataOk",false);
}

function setDataAvailable()
{
  PropertiesService.getScriptProperties().setProperty("dataOk",true);
}

function getDataAvailable()
{
  PropertiesService.getScriptProperties().getProperty("dataOk");
}

function getSoukLightLink()
{
  return "https://script.google.com/macros/s/AKfycbx4nTWTUrIjGkxJu7Ru9XQ4qVAZo68_xkCMwhJy9lP_udc1urE-qgEKp_Jku2vj2Rg/exec"
}


