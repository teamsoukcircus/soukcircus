

function getFraisData() 
{
  let data = {
            "dbTarget":"adminFrais",
            "LoyerAnnuel":      getLoyerAnnuel(),
            "UrsafAnnuel"      :  getUrsafAnnuel(),
            "ElectriciteAnnuel":getElectriciteAnnuel(),
            "EauAnnuel":        getEauAnnuel(),
            "TransportsAnnuel": getTransportsAnnuel(),
            "NettoyagesAnnuel":  getNettoyagesAnnuel(),
            "CapBonusPourcentSalaire": getCapBonusPourcentSalaire(),
            
            /*COLLAB*/
            "Collab01FullName":  getCollabFullName(collab01FullName),
            "Collab01Email": getCollabEmail(collab01Email),
            "Collab01Notif": getCollabNotif(collab01Notif),
            "Collab01SalaireAnnuel":getCollabSalaireAnnuel(collab01SalaireAnnuel), 
            "Collab01BonusPercent":  100*getCollabBonusPercent(collab01BonusPercent),
            /*COLLAB*/
            "Collab02FullName":  getCollabFullName(collab02FullName),
            "Collab02Email": getCollabEmail(collab02Email),
            "Collab02Notif": getCollabNotif(collab02Notif),
            "Collab02SalaireAnnuel":getCollabSalaireAnnuel(collab02SalaireAnnuel), 
            "Collab02BonusPercent":  100*getCollabBonusPercent(collab02BonusPercent),
            /*COLLAB*/
            "Collab03FullName":  getCollabFullName(collab03FullName),
            "Collab03Email": getCollabEmail(collab03Email),
            "Collab03Notif": getCollabNotif(collab03Notif),
            "Collab03SalaireAnnuel":getCollabSalaireAnnuel(collab03SalaireAnnuel), 
            "Collab03BonusPercent":  100*getCollabBonusPercent(collab03BonusPercent),
            /*COLLAB*/
            "Collab04FullName":  getCollabPropertyValue(4,PROP_FullName),
            "Collab04Email": getCollabPropertyValue(4,PROP_Email),
            "Collab04Notif": getCollabPropertyValue(4,PROP_Notif),
            "Collab04SalaireAnnuel":getCollabPropertyValue(4,PROP_SalaireAnnuel), 
            "Collab04BonusPercent":  100*utils_parseInt(getCollabPropertyValue(4,PROP_BonusPercent)),
              /*COLLAB*/
            "Collab05FullName":  getCollabPropertyValue(5,PROP_FullName),
            "Collab05Email": getCollabPropertyValue(5,PROP_Email),
            "Collab05Notif": getCollabPropertyValue(5,PROP_Notif),
            "Collab05SalaireAnnuel":getCollabPropertyValue(5,PROP_SalaireAnnuel), 
            "Collab05BonusPercent":  100*utils_parseInt(getCollabPropertyValue(5,PROP_BonusPercent))
  }

  return data;
}



function manageFraisUserInput_old(data)
{
    //debugInpu
    try
    {
      //Save values in script properties
      setLoyerAnnuel(data.LoyerAnnuel);
      setUrsafAnnuel(data.UrsafAnnuel);
      setElectriciteAnnuel(data.ElectriciteAnnuel);
      setEauAnnuel(data.EauAnnuel) ;
      setTransportsAnnuel(data.TransportsAnnuel);
      setNettoyagesAnnuel(data.NettoyagesAnnuel); 

      setCapBonusPourcentSalaire(data.CapBonusPourcentSalaire);

      
      setCollabFullName([collab01FullName,data.Collab01FullName]);
      setCollabSalaireAnnuel([collab01SalaireAnnuel,data.Collab01SalaireAnnuel]);
      setCollabBonusPercent([collab01BonusPercent,data.Collab01BonusPercent]);
      setCollabEmail([collab01Email,data.Collab01Email]);
      setCollabNotif([collab01Notif,data.Collab01Notif]);
      
      setCollabFullName([collab02FullName,data.Collab02FullName]);
      setCollabSalaireAnnuel([collab02SalaireAnnuel,data.Collab02SalaireAnnuel]);
      setCollabBonusPercent([collab02BonusPercent,data.Collab02BonusPercent]);
      setCollabEmail([collab02Email,data.Collab02Email]);
      setCollabNotif([collab02Notif,data.Collab02Notif]);

      setCollabFullName([collab03FullName,data.Collab03FullName]);
      setCollabSalaireAnnuel([collab03SalaireAnnuel,data.Collab03SalaireAnnuel]);
      setCollabBonusPercent([collab03BonusPercent,data.Collab03BonusPercent]);
      setCollabEmail([collab03Email,data.Collab03Email]);
      setCollabNotif([collab03Notif,data.Collab03Notif]);

      setCollabFullName([collab04FullName,data.Collab04FullName]);
      setCollabSalaireAnnuel([collab04SalaireAnnuel,data.Collab04SalaireAnnuel]);
      setCollabBonusPercent([collab04BonusPercent,data.Collab04BonusPercent]);
      setCollabEmail([collab04Email,data.Collab04Email]);
      setCollabNotif([collab04Notif,data.Collab04Notif]);

      setCollabFullName([collab05FullName,data.Collab05FullName]);
      setCollabSalaireAnnuel([collab05SalaireAnnuel,data.Collab05SalaireAnnuel]);
      setCollabBonusPercent([collab05BonusPercent,data.Collab05BonusPercent]);
      setCollabEmail([collab05Email,data.Collab05Email]);
      setCollabNotif([collab05Notif,data.Collab05Notif]);

      //Update spreadsheet cells
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminLoyerAnnuel,getLoyerAnnuel()); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminUrsafAnnuel,getUrsafAnnuel()); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminElectriciteAnnuel,getElectriciteAnnuel());
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminEauAnnuel,getEauAnnuel()); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminTransportsAnnuel,getTransportsAnnuel()); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminNettoyagesAnnuel,getNettoyagesAnnuel()); 

      //========Collab 1
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab01FullName,getCollabFullName(collab01FullName)); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab01SalaireAnnuel,getCollabSalaireAnnuel(collab01SalaireAnnuel)); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab01BonusAnnuel,getCollabBonusPercent(collab01BonusPercent));
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab01Email,getCollabEmail(collab01Email));
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab01Notif,getCollabNotifDisplay(collab01Notif));

      //========Collab 2

      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab02FullName,getCollabFullName(collab02FullName)); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab02SalaireAnnuel,getCollabSalaireAnnuel(collab02SalaireAnnuel)); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab02BonusAnnuel,getCollabBonusPercent(collab02BonusPercent));
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab02Email,getCollabEmail(collab02Email));
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab02Notif,getCollabNotifDisplay(collab02Notif));

      //========Collab 3
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab03FullName,getCollabFullName(collab03FullName)); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab03SalaireAnnuel,getCollabSalaireAnnuel(collab03SalaireAnnuel)); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab03BonusAnnuel,getCollabBonusPercent(collab03BonusPercent));
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab03Email,getCollabEmail(collab03Email));
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab03Notif,getCollabNotifDisplay(collab03Notif));

      //========Collab 4
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab04FullName,getCollabPropertyValue(4,PROP_FullName)); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab04SalaireAnnuel,getCollabPropertyValue(4,PROP_SalaireAnnuel)); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab04BonusAnnuel,getCollabPropertyValue(4,PROP_BonusPercent));
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab04Email,getCollabPropertyValue(4,PROP_Email));
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab04Notif,getCollabPropertyValue(4,PROP_Notif));

      //========Collab 5
      //Ce collaborateur est Souk circus, il n 'a pas de cellules dans admin pour l'instant au niveau salairte et bonus
      
      /*
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab05FullName,getCollabPropertyValue(5,PROP_FullName)); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab05SalaireAnnuel,getCollabPropertyValue(5,PROP_SalaireAnnuel)); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab05BonusAnnuel,getCollabPropertyValue(5,PROP_BonusPercent));
      */
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab05Email,getCollabPropertyValue(5,PROP_Email));
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab05Notif,getCollabPropertyValue(5,PROP_Notif));

    }
    catch(err)
    {
      errors_logErrorAndEmail(err.message)
      return false;
    }

    return true;
}


function manageFraisUserInput(data)
{
    //debugInpu
    try
    {
      ///PropertiesService.getScriptProperties().setProperty("admin",data);
      
      //Save values in script properties
      setLoyerAnnuel(data.LoyerAnnuel);
      setUrsafAnnuel(data.UrsafAnnuel);
      setElectriciteAnnuel(data.ElectriciteAnnuel);
      setEauAnnuel(data.EauAnnuel) ;
      setTransportsAnnuel(data.TransportsAnnuel);
      setNettoyagesAnnuel(data.NettoyagesAnnuel);
      setCapBonusPourcentSalaire(data.CapBonusPourcentSalaire);

      
      setCollabFullName([collab01FullName,data.Collab01FullName]);
      setCollabSalaireAnnuel([collab01SalaireAnnuel,data.Collab01SalaireAnnuel]);
      setCollabBonusPercent([collab01BonusPercent,data.Collab01BonusPercent]);
      setCollabEmail([collab01Email,data.Collab01Email]);
      setCollabNotif([collab01Notif,data.Collab01Notif]);
      
      setCollabFullName([collab02FullName,data.Collab02FullName]);
      setCollabSalaireAnnuel([collab02SalaireAnnuel,data.Collab02SalaireAnnuel]);
      setCollabBonusPercent([collab02BonusPercent,data.Collab02BonusPercent]);
      setCollabEmail([collab02Email,data.Collab02Email]);
      setCollabNotif([collab02Notif,data.Collab02Notif]);

      setCollabFullName([collab03FullName,data.Collab03FullName]);
      setCollabSalaireAnnuel([collab03SalaireAnnuel,data.Collab03SalaireAnnuel]);
      setCollabBonusPercent([collab03BonusPercent,data.Collab03BonusPercent]);
      setCollabEmail([collab03Email,data.Collab03Email]);
      setCollabNotif([collab03Notif,data.Collab03Notif]);

      setCollabFullName([collab04FullName,data.Collab04FullName]);
      setCollabSalaireAnnuel([collab04SalaireAnnuel,data.Collab04SalaireAnnuel]);
      setCollabBonusPercent([collab04BonusPercent,data.Collab04BonusPercent]);
      setCollabEmail([collab04Email,data.Collab04Email]);
      setCollabNotif([collab04Notif,data.Collab04Notif]);

      setCollabFullName([collab05FullName,data.Collab05FullName]);
      setCollabSalaireAnnuel([collab05SalaireAnnuel,data.Collab05SalaireAnnuel]);
      setCollabBonusPercent([collab05BonusPercent,data.Collab05BonusPercent]);
      setCollabEmail([collab05Email,data.Collab05Email]);
      setCollabNotif([collab05Notif,data.Collab05Notif]);

      //Update spreadsheet cells
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminLoyerAnnuel,data.LoyerAnnuel); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminUrsafAnnuel,data.UrsafAnnuel); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminElectriciteAnnuel,data.ElectriciteAnnuel);
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminEauAnnuel,data.EauAnnuel); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminTransportsAnnuel,data.TransportsAnnuel); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminNettoyagesAnnuel,data.NettoyagesAnnuel); 

      //========Collab 1
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab01FullName,data.Collab01FullName); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab01SalaireAnnuel,data.Collab01SalaireAnnuel); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab01BonusAnnuel,data.Collab01BonusPercent);
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab01Email,data.Collab01Email);
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab01Notif,data.Collab01Notif);

      //========Collab 2

      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab02FullName,data.Collab02FullName); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab02SalaireAnnuel,data.Collab02SalaireAnnuel); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab02BonusAnnuel,data.Collab02BonusPercent);
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab02Email,data.Collab02Email);
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab02Notif,data.Collab02Notif);

      //========Collab 3
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab03FullName,data.Collab03FullName); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab03SalaireAnnuel,data.Collab03SalaireAnnuel); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab03BonusAnnuel,data.Collab03BonusPercent);
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab03Email,data.Collab03Email);
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab03Notif,data.Collab03Notif);

      //========Collab 4
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab04FullName,data.Collab04FullName); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab04SalaireAnnuel,data.Collab04SalaireAnnuel); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab04BonusAnnuel,data.Collab04BonusPercent);
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab04Email,data.Collab04Email);
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab04Notif,data.Collab04Notif);

      //========Collab 5
      //Ce collaborateur est Souk circus, il n 'a pas de cellules dans admin pour l'instant au niveau salairte et bonus
      /*
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab05FullName,getCollabPropertyValue(5,PROP_FullName)); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab05SalaireAnnuel,getCollabPropertyValue(5,PROP_SalaireAnnuel)); 
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab05BonusAnnuel,getCollabPropertyValue(5,PROP_BonusPercent));
      */
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab05Email,data.Collab05Email);
      utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminCollab05Notif,data.Collab05Notif);

    }
    catch(err)
    {
      errors_logErrorAndEmail(err.message)
      return false;
    }

    return true;
}

/**
 * 
 */
function showFraisModalDialog()
{
  let userForm = HtmlService.createHtmlOutputFromFile("frais")
  .setHeight(1000) 
  .setWidth(1200); 
  SpreadsheetApp.getUi().showModalDialog(userForm,"Paramétrage des frais fixes et collaborateurs");
}


const FRAIS_USERFORM =
{
  Mois: 0,
  Remboursements: 1,
  LivraisonSupp: 2,
  Rachats: 3,
  Loyer: 4,
  Ursaf: 5,
  Electricite: 6,
  Transports: 7,
  Nettoyage: 8,
  Eau: 9
}
/**
 * 
 * 
 */
function onFraisSubmit(event)
{
  /*
  var form = event.response;
  var itemResponses = form.getItemResponses();
  let fraisRecus=[];

  fraisRecus.push(new Date());
  
  let moisImpacte = utils_parseInt(itemResponses[FRAIS_USERFORM.Mois].getResponse());
  fraisRecus.push(SHEET_MONTH_NAMES[moisImpacte]);

  
  let frais = utils_parseFloat(itemResponses[FRAIS_USERFORM.Remboursements].getResponse());
  addFraisRemboursementsMois(moisImpacte,frais); 
  fraisRecus.push(frais);

  frais=utils_parseFloat(itemResponses[FRAIS_USERFORM.LivraisonSupp].getResponse());
  addFraisLivraisonSuppAjoutes(moisImpacte,frais)   ;
  fraisRecus.push(frais); 

  frais=utils_parseFloat(itemResponses[FRAIS_USERFORM.Rachats].getResponse());
  addFraisRachatSuppAjoutes(moisImpacte,frais);
  fraisRecus.push(frais);

  frais=utils_parseFloat(itemResponses[FRAIS_USERFORM.Transports].getResponse());
  addTransportMois(moisImpacte,frais);
  fraisRecus.push(frais);

  frais=utils_parseFloat(itemResponses[FRAIS_USERFORM.Nettoyage].getResponse())
  addNettoyageMois(moisImpacte,frais);
  fraisRecus.push(frais);

  frais=utils_parseInt(itemResponses[FRAIS_USERFORM.Loyer].getResponse());
  setLoyerMois(moisImpacte,frais)
  fraisRecus.push(frais);

  frais=utils_parseFloat(itemResponses[FRAIS_USERFORM.Electricite].getResponse());
  setElectriciteMois(moisImpacte,frais);
  fraisRecus.push(frais);

  frais=utils_parseFloat(itemResponses[FRAIS_USERFORM.Eau].getResponse());
  setEauMois(moisImpacte,frais);
  fraisRecus.push(frais);

  frais=utils_parseFloat(itemResponses[FRAIS_USERFORM.Ursaf].getResponse());
  setUrsafMois(moisImpacte,frais);
  fraisRecus.push(frais);
  
  utils_getSheet(GMAIL_SHEET).appendRow(fraisRecus);
  */
}


