/**
 * 
 */
function getDashboardYear()
{
  let val = PropertiesService.getScriptProperties().getProperty(dashboardYear);
  if (val==null)
    return utils_getCurrentYear();

  return val;
}

function setDashboardYear(yearValue)
{
  PropertiesService.getScriptProperties().setProperty(dashboardYear, yearValue);
}

/**
 * 
 */
function getStoreName()
{
  let val=PropertiesService.getScriptProperties().getProperty(storeName);
  if(val==null)
    return "";
  return val;
}

function setStoreName(shopName)
{
  PropertiesService.getScriptProperties().setProperty(storeName,shopName)
}

/**
 * 
 */
function getEmailIT()
{
  let val=PropertiesService.getScriptProperties().getProperty(emailIT);
  if (val==null)
    return "";

  return val;
}

function setEmailIT(emailStr)
{
  PropertiesService.getScriptProperties().setProperty(emailIT, emailStr);
}


/**
 * 
 */
function getObjectifAnnuel()
{
  let val=getObjectifMensuel();
  
  if(val==null)
    return 0;

  return 12*Number(val);
}

function getObjectifMensuel()
{
  let val=PropertiesService.getScriptProperties().getProperty(objectifMensuel);
  if(val==null)
    return 0;

  return val;
}

/**
 * Objectif mensuel par default
 */
function setObjectifMensuel(objectifMensuelValue)
{
  PropertiesService.getScriptProperties().setProperty(objectifMensuel, objectifMensuelValue);
}



function setObjectifTresorMensuel(objectifTresorValue)
{
  PropertiesService.getScriptProperties().setProperty(objectifTresorMensuel, objectifTresorValue);
}

function getObjectifTresorMensuel()
{
    let val=Number(PropertiesService.getScriptProperties().getProperty(objectifTresorMensuel));
    if(val==null)
      return 0;
    return val;
}

function getObjectifTresorAnnuel()
{
  let val = getObjectifTresorMensuel();
  if (val==null)
    return 0;
  return  12*Number(val);
}


function setStockThresholdToTriggerMailing(value)
{
  PropertiesService.getScriptProperties().setProperty(stockThresholdToTriggerMailing, value);
}

function getStockThresholdToTriggerMailing()
{
    let val=Number(PropertiesService.getScriptProperties().getProperty(stockThresholdToTriggerMailing));
    if(val==null)
      return -1;
    return val;
}

function setFavorThresholdToTriggerMailing(value)
{
  PropertiesService.getScriptProperties().setProperty(favorThresholdToTriggerMailing, value);
}

function getFavorThresholdToTriggerMailing()
{
    let val=Number(PropertiesService.getScriptProperties().getProperty(favorThresholdToTriggerMailing));
    if(val==null)
      return -1;
    return val;
}



function getParamGeneData() 
{
  let data = {
            "dbTarget":"adminGene",
            "StoreName": getStoreName(),
            "DashboardYear":getDashboardYear(),
            "EmailIT":getEmailIT(),
            "ObjectifMensuel":getObjectifMensuel(),
            "ObjectifTresorMensuel": getObjectifTresorMensuel(),
            "FavorThresholdToTriggerMailing": getFavorThresholdToTriggerMailing(),
            "StockThresholdToTriggerMailing": getStockThresholdToTriggerMailing()
      }

  return data;
}

function test_manageFraisGenerauxUserInput()
{
  PropertiesService.getScriptProperties().deleteAllProperties();
verifyInitialization();
var data = {
            "dbTarget":"adminGene",
            "StoreName": "Soukcircus",
            "DashboardYear":2022,
            "EmailIT":"gianfranco.oldani@gmail.com",
            "ObjectifMensuel": 6000,
            "ObjectifTresorMensuel": 0,
            "FavorThresholdToTriggerMailing": -1,
            "StockThresholdToTriggerMailing": -1
          };

manageFraisGenerauxUserInput(data);

}

function manageFraisGenerauxUserInput(data)
{
    try
    {
    //Save values in script properties
      setStoreName(data.StoreName);
      setDashboardYear(data.DashboardYear);
      setEmailIT(data.EmailIT) ;
      setObjectifMensuel(data.ObjectifMensuel);
      setObjectifTresorMensuel(data.ObjectifTresorMensuel);
      setFavorThresholdToTriggerMailing(data.FavorThresholdToTriggerMailing);
      setStockThresholdToTriggerMailing(data.StockThresholdToTriggerMailing);

      //Update spreadsheet cells
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminStoreName,data.StoreName); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminDashboardYear,data.DashboardYear); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminEmailIT,data.EmailIT); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminObjectifAnnuel,getObjectifAnnuel()); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminObjectifTresorAnnuel,getObjectifTresorAnnuel());
    }
    catch(err)
    {
      errors_logErrorAndEmail(err.message)
      return false;
    }

    return  true;
}


/**
 * 
 */
function showInitModalDialog(dialogName)
{
  let template = HtmlService.createTemplateFromFile("parametrageGene");
  let userForm = template.evaluate();
  userForm.setHeight(800); 
  userForm.setWidth(600); 

  SpreadsheetApp.getUi().showModalDialog(userForm,"Initialisation du tableau de bord");
}



