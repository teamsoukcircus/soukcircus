
function test_savingPrompt()
{
    savingPrompt(10);
}

function getValue() {
  return 'hello world';
}

function savingPrompt(durationSec)
{
  var tt = "<script> setTimeout(closePrompt, "+1000*durationSec+"); function closePrompt(){google.script.host.close();}</script>";
  SpreadsheetApp.getUi.alert(tt);
  var output = HtmlService.createTemplateFromFile("alert");

  SpreadsheetApp.getUi().showModelessDialog(output.evaluate(), ' ');
}




/**
 * Display data for parametrage général
 */
function debugInput(data)
{
let ui = SpreadsheetApp.getUi();
    let str="";
    for (const [key, value] of Object.entries(data)) 
    {
      str += `${key}: ${value}` + ", ";
    }
    ui.alert(str);
}



//==================================
//Save values in script properties
function setLoyerAnnuel(dbLoyer)
{
  PropertiesService.getScriptProperties().setProperty(loyerAnnuel, dbLoyer);
}

function getLoyerAnnuel() 
{
  let val=PropertiesService.getScriptProperties().getProperty(loyerAnnuel);
  if (val==null)
    return 0;
  return val;
}


function setElectriciteAnnuel(dbElectricite)
{
  PropertiesService.getScriptProperties().setProperty(electriciteAnnuel, dbElectricite);
}

function getElectriciteAnnuel()
{
  let val=PropertiesService.getScriptProperties().getProperty(electriciteAnnuel);
  if (val==null)
    return 0;
  return val;
}



function setEauAnnuel(dbEau)
{
  PropertiesService.getScriptProperties().setProperty(eauAnnuel, dbEau);
}
function getEauAnnuel()
{
  let val=PropertiesService.getScriptProperties().getProperty(eauAnnuel);
  if (val==null)
    return 0;
  return val;
}


function setTransportsAnnuel(dbTransports)
{
  PropertiesService.getScriptProperties().setProperty(transportsAnnuel, dbTransports);
}

function getTransportsAnnuel()
{
  let val=PropertiesService.getScriptProperties().getProperty(transportsAnnuel);
  if (val==null)
    return 0;
  return val;
}

/**
 * 
 */
function setNettoyagesAnnuel(dbNettoyage)
{
  PropertiesService.getScriptProperties().setProperty(nettoyagesAnnuel, dbNettoyage);
}

function getNettoyagesAnnuel()
{
  let val = PropertiesService.getScriptProperties().getProperty(nettoyagesAnnuel);
  if (val==null)
    return 0;
  return val;
}


/**
 * 
 */
function setUrsafAnnuel(dbUrsaf)
{
  PropertiesService.getScriptProperties().setProperty(ursafAnnuel, dbUrsaf);
}

function getUrsafAnnuel()
{
  let val = PropertiesService.getScriptProperties().getProperty(ursafAnnuel);
  if (val==null)
    return 0;
  return val;
}


/**
 * 
 * 
 */
function setDiversAnnuel(dbDivers)
{
  PropertiesService.getScriptProperties().setProperty(diversAnnuel, dbDivers);
}

function getDiversAnnuel()
{
  let val = PropertiesService.getScriptProperties().getProperty(diversAnnuel);
  if (val==null)
    return 0;
  return val;
}

function setCollabFullName(arrayParams)
{
  PropertiesService.getScriptProperties().setProperty(arrayParams[0], arrayParams[1]);
}

function getCollabFullName(collabNameId)
{
    let val = PropertiesService.getScriptProperties().getProperty(collabNameId);
    if (val==null)
      return "";
    return val;
} 

function setCollabSalaireAnnuel(arrayParams)
{
  PropertiesService.getScriptProperties().setProperty(arrayParams[0], arrayParams[1]);
}

function getCollabSalaireAnnuel(collaSalairebId)
{
    let val = PropertiesService.getScriptProperties().getProperty(collaSalairebId);
    if (val==null)
      return 0;
    return val;
} 

function getCollabMonthlySalary(email)
{

}

function setCollabBonusPercent(arrayParams)
{ 
  PropertiesService.getScriptProperties().setProperty(arrayParams[0], arrayParams[1]);
}

function getCollabBonusPercent(collaBonusbId)
{
    let val = PropertiesService.getScriptProperties().getProperty(collaBonusbId)/100;
    if (val==null)
      return 0;
    return val;
} 

function getCollabBonusAnnuel(salaireId,collaBonusbId)
{
    let salaire = getCollabSalaireAnnuel(salaireId);
    if (salaire==null)
      return 0;

    let bonusPercent = getCollabBonusPercent(collaBonusbId)

    return (bonusPercent*salaire)/100;
} 


/**
 * return array Firstname, Name, email
 */
function getAllCollabEmail()
{
  let list=[];

  for (let i=1;i<= COLLABS_NUMBER;i++)
  {
    
    let words = getCollabFullName(getCollabPropertyName(i,PROP_FullName)) .split(' ');

    list.push([words[0],words[1],getCollabEmail(getCollabPropertyName(i,PROP_Email))]);
  }
   
  return list;
}

function getCollabEmailByFirstname(firstname)
{
  for (let i=1;i<= COLLABS_NUMBER;i++)
  {
    let words = getCollabFullName(getCollabPropertyName(i,PROP_FullName)) .split(' ');
    if ( words[0] == firstname)
      return getCollabEmail(getCollabPropertyName(i,PROP_Email));
  }

  errors_logErrorAndEmail("Email for " + firstname + " requested but not found");
  return getEmailIT();
} 


function test_getCollabFirstAndLastNameByEmail()
{
    Logger.log(getCollabFirstAndLastNameByEmail("teamsoukcircus@gmail.com"));
    Logger.log(getCollabFirstAndLastNameByEmail("oldanisim@gmail.com"));
    Logger.log(getCollabFirstAndLastNameByEmail("gelle.celine@gmail.com"));
    Logger.log(getCollabFirstAndLastNameByEmail("said182008@gmail.com"));
}

function getCollabFirstAndLastNameByEmail(email)
{
  for (let i=1;i<= COLLABS_NUMBER;i++)
  {
    let anEmail = getCollabEmail(getCollabPropertyName(i,PROP_Email));
    if ( anEmail == email)
    {
      return utils_splitString(getCollabPropertyValue(i,PROP_FullName)," ")
    }
  }

  return [];
} 

function getCollabEmail(collaId)
{
    let val = PropertiesService.getScriptProperties().getProperty(collaId);
    if (val==null)
      return "no-mail";
    return val;
} 

function setCollabEmail(arrayParams)
{ 
  PropertiesService.getScriptProperties().setProperty(arrayParams[0], arrayParams[1]);
}


function setCollabNotif(arrayParams)
{ 
  PropertiesService.getScriptProperties().setProperty(arrayParams[0], arrayParams[1]);
}


function getCollabNotif(collaId)
{
    let prop = PropertiesService.getScriptProperties().getProperty(collaId);
    if (prop==null)
      return false;
    return prop.toLowerCase() == "true";
} 

function getCollabNotifDisplay(collaId)
{
    let status = getCollabNotif(collaId);
    if ( status == null )
      return "Sans";
      
    if (status)
    {
      return "Avec";
    }
    else
    {
      return "Sans";
    }
} 

function getCapBonusPourcentSalaire()
{
  let val = PropertiesService.getScriptProperties().getProperty(capBonusPourcentSalaire);
  if ( val == null)
    return 0;

  return val;
}

function setCapBonusPourcentSalaire(value)
{
    PropertiesService.getScriptProperties().setProperty(capBonusPourcentSalaire, value);
}


/**
 * 
 * Generic get prperty method
 * collabNo: 1,2,3,4....
 * collabPropertyName : see constants.gs
 */

function getCollabPropertyValue(collabNo,collabPropertyName)
{
  let val = PropertiesService.getScriptProperties().getProperty(getCollabPropertyName(collabNo,collabPropertyName));
  if ( val == null)
    return "";

  return val;
}


function getCollabAllProperties(collabNo)
{
  let ret={};

  ret.FullName = getCollabPropertyValue(collabNo,PROP_FullName);
  ret.Email = getCollabPropertyValue(collabNo,PROP_Email);
  ret.Notif = getCollabPropertyValue(collabNo,PROP_Notif);
  ret.SalaireAnnuel = getCollabPropertyValue(collabNo,PROP_SalaireAnnuel);
  ret.BonusPercent = getCollabPropertyValue(collabNo,PROP_BonusPercent);
  return ret;
}

/**
 * Return an array with all properties if found, empty array else
 */
function getCollabPropertiesWithEmail(email)
{
  for(let i=1;i<=COLLABS_NUMBER;i++)
  {
    if (email == getCollabPropertyValue(i,PROP_Email))
      return getCollabAllProperties(i);
  }

  return [];
}

function test()
{
  let data = {
            "dbTarget":"adminFrais",
            "LoyerAnnuel":      4800,
            "ElectriciteAnnuel":240,
            "EauAnnuel":        0,
            "TransportsAnnuel": 0,
            "NettoyagesAnnuel":  0,
            "DiversAnnuel" :    0,
            "CapBonusPourcentSalaire": 10,
            /*COLLAB*/
            "Collab01FullName":  "Simon Oldani",
            "Collab01Email": "oldanisim@gmail.com",
            "Collab01Notif": true,
            "Collab01SalaireAnnuel":18000, 
            "Collab01BonusPercent":  40,
            /*COLLAB*/
            "Collab02FullName":  "Céline Gelle",
            "Collab02Email": "gelle.celine@gmail.com",
            "Collab02Notif": true,
            "Collab02SalaireAnnuel": 18000, 
            "Collab02BonusPercent":  40,
            /*COLLAB*/
            "Collab03FullName":  "Said",
            "Collab03Email": "said182008@gmail.com",
            "Collab03Notif": false,
            "Collab03SalaireAnnuel":6000, 
            "Collab03BonusPercent":  20,
            /*COLLAB*/
            "Collab04FullName":  "IT",
            "Collab04Email": "teamsoukcircus@gmail.com",
            "Collab04Notif": true,
            "Collab04SalaireAnnuel":0, 
            "Collab04BonusPercent":  0,
            /*COLLAB*/
            "Collab05FullName":  "Souk Circus",
            "Collab05Email": "soukcircus@gmail.com",
            "Collab05Notif": true,
            "Collab05SalaireAnnuel":0, 
            "Collab05BonusPercent":  0};


  updateFraisGeneraux(data);

  Logger.log(getFraisData());

  Logger.log(getLoyerAnnuel());
  Logger.log(getElectriciteAnnuel());
  Logger.log(getEauAnnuel());
  Logger.log(getTransportsAnnuel());
  Logger.log(getNettoyagesAnnuel());
  Logger.log(getDiversAnnuel());
  Logger.log(getCapBonusPourcentSalaire());
            /*COLLAB*/
  Logger.log(getCollabFullName(collab01FullName));
  Logger.log(getCollabEmail(collab01Email));
  Logger.log(getCollabNotif(collab01Notif));
  Logger.log(getCollabSalaireAnnuel(collab01SalaireAnnuel)); 
  Logger.log(100*getCollabBonusPercent(collab01BonusPercent));
            /*COLLAB*/
  Logger.log(getCollabFullName(collab02FullName));
  Logger.log(getCollabEmail(collab02Email));
  Logger.log(getCollabNotif(collab02Notif));
  Logger.log(getCollabSalaireAnnuel(collab02SalaireAnnuel)); 
  Logger.log(100*getCollabBonusPercent(collab02BonusPercent));
            /*COLLAB*/
  Logger.log(getCollabFullName(collab03FullName));
  Logger.log(getCollabEmail(collab03Email));
  Logger.log(getCollabNotif(collab03Notif));
  Logger.log(getCollabSalaireAnnuel(collab03SalaireAnnuel)); 
  Logger.log(100*getCollabBonusPercent(collab03BonusPercent));
  /*COLLAB*/
  Logger.log(getCollabPropertyValue(4,PROP_FullName));
  Logger.log(getCollabPropertyValue(4,PROP_Email));
  Logger.log(getCollabPropertyValue(4,PROP_Notif));
  Logger.log(getCollabPropertyValue(4,PROP_SalaireAnnuel)); 
  Logger.log(100*utils_parseInt(getCollabPropertyValue(4,PROP_BonusPercent)));

  /*COLLAB*/
  Logger.log(getCollabPropertyValue(5,PROP_FullName));
  Logger.log(getCollabPropertyValue(5,PROP_Email));
  Logger.log(getCollabPropertyValue(5,PROP_Notif));
  Logger.log(getCollabPropertyValue(5,PROP_SalaireAnnuel)); 
  Logger.log(100*utils_parseInt(getCollabPropertyValue(5,PROP_BonusPercent)));
}


function test_addNewRow()
{
var data = {
          "dbTarget":"adminFraisSupp",
          "FraisLivraisonSuppAjoutes": 100,
          "FraisRachatSuppAjoutes":200,
          "FraisRachatPrevisionnels": 500,
          "Mois": 0
        };

        updateFraisGeneraux(data)
}


function updateFraisManager(data)
{

  let error=true;

  showInfoWindow("Sauvegarde","La sauvegarde est en cours, patientez...",false);

  if (data.dbTarget=="adminGene")
  {
    if ( manageFraisGenerauxUserInput(data) )
    {
      setAdminGeneOk(1);
      error=false;
    }
  }
  else if (data.dbTarget=="adminFrais")
  {
    if ( manageFraisUserInput(data) )
    {
      setAdminFraisOk(1);
      error=false;
    }
  }
  else if ( data.dbTarget == "adminFraisSupp")
  {
    if ( manageFraisSupplementaireUserInput(data) )
    {
      setAdminGeneOk(1);
      error=false;
    }
  
  }
  
  if ( ! error )
  {
    SpreadsheetApp.flush();
    closeInfoWithSuccessWindow("Sauvegarde","Sauvegarde effectuée avec succès...",true,5);
  }
  else
    closeInfoWithWarningWindow("Sauvegarde","Une erreur inattendue s'est produite, merci de ressaisir vos données...",10);

  return true;  
}


function updateFraisManagerNoWindow(data)
{

  let error=true;


  if (data.dbTarget=="adminGene")
  {
    if ( manageFraisGenerauxUserInput(data) )
    {
      setAdminGeneOk(1);
      error=false;
    }
  }
  else if (data.dbTarget=="adminFrais")
  {
    if ( manageFraisUserInput(data) )
    {
      setAdminFraisOk(1);
      error=false;
    }
  }
  else if ( data.dbTarget == "adminFraisSupp")
  {
    if ( manageFraisSupplementaireUserInput(data) )
    {
      setAdminGeneOk(1);
      error=false;
    }
  
  }
  
  return true;  
}







