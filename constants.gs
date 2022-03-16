//GITACESSTOKE: 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

const SINGLE_CHARS=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
/**
 * index >= 1
 */
function utils_getChar(index)
{
  return SINGLE_CHARS[Math.min(Math.max(0,index-1),25)];
}
/*==============================*/
const NSEC_PER_DAY = 24*3600*1000;
const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const MAX_EXECUTION_TIME = 3*ONE_MINUTE;
const NOW = Date.now();

/*=====================================================================*/
const ENUM_DATE_FORMAT ={
  SHORT : "YY/M/d",
  MEDIUM : "YY/MM/dd",
  LONG :  "YYYY/MM/dd",
  LONGMS :  "YYYY/M/dd",
  MSHORT: "MM/d/YY",
  MLONG: "MM/d/YYYY",
  MDLONG: "MM/dd/YY",
  LONG_HHMM: "YYYY/MM/dd HH::mm",
  LONG_HHMMSS: "YYYY/MM/dd HH::mm::ss",
  MEDIUMDDMMYYYY : "dd/MM/YYYY",
}
/**
 * 
 */
var ENUMS_AMOUNT_TYPES = {
  GROSS: 1,
  NET: 2,
  SHIP: 3,
  NETENCAISSE: 4
};


/**
 * 
 */
const LANGUAGES = {
  "de": "German",
  "fr": "French",
  "ch" : "Swiss german",
  "es" : "Spanish",
  "it" : "Italian",
  "nl" : "Dutch"
}

function utils_getLanguageName(iso2LettersCode)
{
  let lang = LANGUAGES[iso2LettersCode];
  if (lang==null)
    lang = "English";

  return lang;
}
/**
 * Google Drive folders ids
 */
const SOUK_PILOTAGE_BACKUP_FLDID = "1GT8mXnyJUV4mMPUcI8iH6DFVe_nqR35E";

/**
 * TRIGGERS NAMES
 */

const TRIGGER_ANNUALDATA = "triggerAnnualOrdersRequest";
/**
 * SHOP ID FOR ETSY API V3 REQUESTS
 */
const SHOP_ID = "18397414";
const GETSOLD_DELAY = 0.1;
/**
 * 
 */
const GFMAIL = "gf_oldani@hotmail.com";

/**
 * 
 */
const FEEDBACK_SEHEET_SATISF = ["Excellent","Very good","Good","Medium","Poor"];
/**
 * 
 */
const SHEET_MONTH_NAMES = ["Jan","Fev","Mar","Avr","Mai","Jun", "Jul", "Aou", "Sep","Oct","Nov","Dec"];
const SHEET_MONTH_NAMES_LONG = ["Janvier","Février","Mars","Avril","Mai","Juin", "Juillet", "Août", "Septembre","Octobre","Novembre","Décembre"];

/**
 * 
 */
const MAIN_SHEET          = "Annuel";
const RETRO_SHEET         = "Retrospective";
const DATA_SHEET          = "data";
const RETRODATA_SHEET     = "dataRetro";
const LISTINGS_SHEET      = "listings";
const IMAGE_SHEET         = "images";
const STATDATA_SHEET      = "DonneesStat";
const ADMIN_SHEET         = "Admin";
const HISTPRODUIT_SHEET   = "histoProduit";
const ERROR_SHEET         = "errors";
const MAILING_DATA        = "Mails Newsletter";
const BACKUPPROP_SHEET    = "Backup Properties";
const SALARIES_SHEET      = "Salaries";
const ANNUAL_TRANSACTIONS_SHEET = DATA_SHEET+"Transactions";
const RETRO_TRANSACTIONS_SHEET  = RETRODATA_SHEET+"Transactions";
const REVIEWS_SHEET             = "Reviews"
const FORECASTING_SHEET         = "forecasting"
const GMAIL_SHEET               = "gmail";
const NOTIFICATIONS_SHEET       = "notifications";
const FEEDBACK_SHEET            = "feedbacks";
const TASKS_SHEET               ="tasks";
const TASKS_PARAMS_SHEET        ="tasksData";
const TASKS_BACKUP              = "tasksBackup";
const DISCUSSION_THREADS        ="Discussions"
const RESSOURCES_TASKFORMS_SHEET="tasksForms";
const CCYRATES_SHEET            = "rates";
const WORKERS_SHEET             ="workers";
const SHIPPINGRAW_SHEET         = "EnvoisPoste";
const FLUXFINANCIERS_SHEET      = "Flux";

/**
 * COUNTRIES
 */
var COUNTRIES_LANG={
DE:["DE","de"],
FR:["FR","fr"],
US:["US","en"],
CH:["CH","ch"],
GB:["GB","en"],
NL:["NL","nl"],
CA:["CA","en"],
};
/**
 * CUSTOMER STATUS
 */
var CUSTOMER_TYPE={
  STD : "STANDARD",
  NEW: "NEW",
  RETURNED:"RETURNED"
};
/**
 * NOTIF_STATUS
 */
var NOTIF_STATUS = {
  TBD: "TOBEDONE",
  DONE: "DONE",
  ABANDONNED: "ABANDONED"
};
/**
 * Notification reasons
 */
var NOTIF_REASON = {
  RETURNING: "RETURNING",
  NEWCUSTOMER: "NEWCUST",
  FEEDBACK: "FEEDBACK",
};
/**
 * Position of columns in sheets
 */


/* ========= RETRO DATA SHEET =============*/
const BUYERID_INRETRO_DATASHEET = 11;
/*======== CURR YEAR DATA. SHEET =============*/



/*==========. SHIPPED_TRANSACTION_SHEET ==================*/
const RECEIPTID_SHIPPED_TRANSACTION_SHEET = 2;
/*===========================*/


/*======================================= */
const RETURN_INNOTIF_SHEET=2;
const TYPE_INNOTIF_SHEET=3;
const NAME_INNOTIF_SHEET=4;
const EMAIL_INNOTIF_SHEET=5;
const COUNTRY_INNOTIF_SHEET=6;
const REASON_INNOTIF_SHEET = 7;
const STATUS_INNOTIF_SHEET=8;
const NOTIFDATE_INNOTIF_SHEET=9;


//ADMIN SHEET
//!!!! LEs 4 lignes de frais supplémentaires ne doivent pas êre changées d'ordre !!!!
const FIRST_FRAIS_SUPP_COL = 8
const FIRST_FRAIS_SUPP_ROW = 29
const LAST_FRAIS_SUPP_ROW = 33;

function constant_getFirstFraisColumn(month)
{
    return FIRST_FRAIS_SUPP_COL + month;
}

							
/**
 * 
 */



/**
 *  ==============================. GOOGLE ============================
 */

const SCRIPT_ID = "1wYd0ieG3i6IEJDIhEtYwfVx0IPjEV6PcOod1IvVAlxObLlw1BhsQcf7q";
const REDIRECT_URI = `http://script.google.com/macros/d/"+SCRIPT_ID +"/usercallback"`;



/**
 *  Sheets named ranges
 */

const cellNetEncaisseJanvier = "netEncaisseJan";
const cellNetEncaisseFevrier = "netEncaisseFev";
const cellNetEncaisseMars = "netEncaisseMar";
const cellNetEncaisseAvril = "netEncaisseAvr";
const cellNetEncaisseMai = "netEncaisseMai";
const cellNetEncaisseJuin = "netEncaisseJun";
const cellNetEncaisseJuillet = "netEncaisseJul";
const cellNetEncaisseAout = "netEncaisseAou";
const cellNetEncaisseSept = "netEncaisseSep";
const cellNetEncaisseOct = "netEncaisseOct";
const cellNetEncaisseNov = "netEncaisseNov";
const cellNetEncaisseDec = "netEncaisseDec";

const cellAnnuelMoyenneLisseSurNetEncaisse = "MoyenneLisseSurNetEncaisse";
const cellAnnuelDateMiseAJour = "DateMiseAJour";
const cellStatTrendNetEncaisse="TrendNetEncaisse";
const cellImagesArrowUp = "ArrowUp";
const cellImagesArrowRight = "ArrowRight";
const cellImagesArrowDown = "ArrowDown";
const cellDataDateCreated = "dataDateCreated"; 
const cellDataReceiptIds  = "DataReceiptIds";
const cellDataTransactions = "transactionsInDataSheet";
const cellListingsListIds="ListIds";
const cellListingsNumFavoris = "NumFavoris";
const cellListingsTitles="Titles";
const cellListingsUrls="Urls";
const cellListingsQuantity="ListingsQuantity";
const cellHistoCounts = "Counts"

const cellLoyerJanvier="loyerjanvier";
const cellUrsafJanvier="UrsafJanvier"
const cellElecticiteJanvier="electriciteJanvier";
const cellEauJanvier = "eauJanvier";
const cellTransportJanvier="transportJanvier";
const cellNettoyageJanvier="nettoyageJanvier";
const cellDiversJanvier="diversJanvier";

/**
 * Global Ranges
 */
const DATAS_RANGEINDATA_SHEET = DATA_SHEET+"!A1:Z10000";
const DATAS_RANGEINLISTINGS_SHEET = LISTINGS_SHEET+"!A1:Z10000";
const DATAS_RANGEINHISTO_SHEET = HISTPRODUIT_SHEET+"!A1:Z10000";
const DATA_VERTSPAN_SOLDINMONTH = 30;
const DATA_HORIZSPAN_SOLDINMONTH=3;


const cellAdminStoreName = "StoreName";
const cellAdminEmailIT = "EmailIT";
const cellAdminDashboardYear = "DashboardYear";
const cellAdminDashboardMonth="adminDashboardMonth";
const cellAdminObjectifAnnuel = "ObjectifAnnuel";
const cellAdminObjectifBonusAnnuel = "ObjectifBonusAnnuel";
const cellAdminObjectifTresorAnnuel = "ObjectifTresorAnnuel";
const cellAdminNmois = "adminNMois";
const cellAdminDebutAnnee="adminDebutAnnee"
const cellAdminFinAnnee = "adminFinAnnee";
const cellAdminNJours = "adminNJours";
const cellAdminJourDuMois="adminJourDuMois";
const cellAdminJoursRestants ="adminJoursRestantsAnnee";
const cellAdminJoursRestantsMois="adminJoursRestantsMois";
const cellAdminMoyennObjectif = "adminMoyenneObjectif";
const cellAdminMoyenneBonus = "adminMoyenneBonus";
const cellAdminMoyenneReelle = "adminMoyenneReelle";  
const cellAdminRAF = "adminResteAFaire";
const cellAdminLoyerAnnuel = "LoyerAnnuel";
const cellAdminUrsafAnnuel = "UrsafAnnuel";
const cellAdminElectriciteAnnuel = "ElectriciteAnnuel";
const cellAdminEauAnnuel = "EauAnnuel";
const cellAdminTransportsAnnuel = "TransportsAnnuel";
const cellAdminNettoyagesAnnuel = "NettoyagesAnnuel";
const cellAdminDiversAnnuel = "DiversAnnuel";
const cellAdminBonusJanvier = "adminBonusJanvier";
const cellAdminNetEncaisseJanvier = "adminNetEncaisseJanvier";
const cellAdminTotalFraisAchatProvisionnels = "adminTotalFraisAchatProvisionnels";
const cellAdminTresorerieTotalEffective = "adminTresorerieTotalEffective";
const cellAdminBonusTotalanvier="adminBonusTotalanvier";

/* For all collabs */

/* COLLAB */
const cellAdminCollab01FullName = "Collab01FullName";
const cellAdminCollab01SalaireAnnuel="Collab01SalaireAnnuel";
const cellAdminCollab01BonusAnnuel="Collab01BonusAnnuel";
const cellAdminCollab01Email="Collab01Email";
const cellAdminCollab01Notif="Collab01Notif";
const cellAdminSalaireCollab01Janvier = "adminSalaireCollab01Janvier";

/* COLLAB */
const cellAdminCollab02FullName = "Collab02FullName";
const cellAdminCollab02SalaireAnnuel="Collab02SalaireAnnuel";
const cellAdminCollab02BonusAnnuel="Collab02BonusAnnuel";
const cellAdminCollab02Email="Collab02Email";
const cellAdminCollab02Notif="Collab02Notif";
const cellAdminSalaireCollab02Janvier = "adminSalaireCollab02Janvier";

/* COLLAB */
const cellAdminCollab03FullName = "Collab03FullName";
const cellAdminCollab03SalaireAnnuel="Collab03SalaireAnnuel";
const cellAdminCollab03BonusAnnuel="Collab03BonusAnnuel";
const cellAdminCollab03Email="Collab03Email";
const cellAdminCollab03Notif="Collab03Notif";
const cellAdminSalaireCollab03Janvier = "adminSalaireCollab03Janvier";

/* COLLAB */
const cellAdminCollab04FullName = "Collab04FullName";
const cellAdminCollab04SalaireAnnuel="Collab04SalaireAnnuel";
const cellAdminCollab04BonusAnnuel="Collab04BonusAnnuel";
const cellAdminCollab04Email="Collab04Email";
const cellAdminCollab04Notif="Collab04Notif";
const cellAdminSalaireCollab04Janvier = "adminSalaireCollab04Janvier";

/* COLLAB */
const cellAdminCollab05FullName = "Collab05FullName";
const cellAdminCollab05SalaireAnnuel="Collab05SalaireAnnuel";
const cellAdminCollab05BonusAnnuel="Collab05BonusAnnuel";
const cellAdminCollab05Email="Collab05Email";
const cellAdminCollab05Notif="Collab05Notif";
const cellAdminSalaireCollab05Janvier = "adminSalaireCollab05Janvier";

const cellAdminTotalFix = "totalFixes";
const cellAdminTotalFixesEffectif="totalFixesEffectif";
const cellAdminTotalFixesJanvier = "totalFixesJanvier";

const cellAdminSalEtBonusTotal = "adminSalEtBonusTotal";
const cellAdminSalEtBonusTotalEffectif="adminSalEtBonusTotalEffectif";
const celAdminSalEtBonJanvier="adminSalEtBonJanvier";

const cellAdminFraisGenerauxTotal="fraisGenerauxTotal";
const cellAdminFraisGenerauxTotalEffectif="fraisGenerauxTotalEffectif";
const cellAdminfraisGenerauxJanvier="fraisGenerauxJanvier";

const cellAdminLoyerAnnuelEffectif= "loyerAnnuelEffectif";
const cellAdminUrsafAnnuelEffectif = "UrsafAnnuelEffectif"
const cellAdminElectriciteAnnuelEffectif = "electriciteAnnuelEffectif";
const cellAdminEauAnnuelEffectif = "eauAnnuelEffectif";
const cellAdminTransportsAnnuelEffectif = "transportsAnnuelEffectif";
const cellAdminNettoyagesAnnuelEffectif ="nettoyagesAnnuelEffectif";
const cellAdminDiversAnnuelEffectif = "diversAnnuelEffectif";

const cellAdminFraisLivraisonSuppJanvier = "fraisLivraisonSuppJanvier";
const cellAdminFraisRachatSuppJanvier = "fraisRachatSuppJanvier";
const cellAdminFraisRachatPrevisionJanvier = "fraisRachatPrevisionJanvier";
const cellAdminFraisRemboursementsJanvier = "fraisRemboursementsJanvier";

const cellAdminMoisCourant = "adminMoisCourant";
const cellAdminTresorJanvier = "adminTresorJanvier";
const cellAdminEstimeNetEncaisseJanvier = "adminEstimeNetEncaisseJanvier";

const cellTotalFraisShipAnnuel = "totalFraisShipAnnuel";
const cellTotalFraisRachatAnnuel = "totalFraisRachatAnnuel";

const cellObjectifCAJanvier = "objectifCAJanvier";

const cellBeneficeNetPrefix = "BeneficeNet";
function getCelluleBeneficeNetPourMoisEnCours()
{
  //BeneficeNetJan
  let ret = cellBeneficeNetPrefix+SHEET_MONTH_NAMES[utils_getCurrentMonth()];
  return ret;
}

/**
 *  Saved properties
 */
//Propriétés générales
const spreadSheetId = "SpreadSheetId";
const trendNetEncaisse = "TrendNetEncaisse";
const adminGeneOk = "AdminGeneOk";
const adminFraisOk = "AdminFraisOk";
const adminGene = "AdminGene";
const adminFrais = "AdminFrais";


//Paramètres généraux
const storeName = "StoreName";
const dashboardYear = "DashboardYear";
const emailIT = "EmailIT";
const objectifMensuel = "ObjectifMensuel";
const objectifTresorMensuel = "ObjectifTresorMensuel";
const favorThresholdToTriggerMailing = "FavorThresholdToTriggerMailing";
const stockThresholdToTriggerMailing = "StockThresholdToTriggerMailing";

//Frais généraux
const loyerAnnuel="LoyerAnnuel";
const electriciteAnnuel = "ElectriciteAnnuel";
const eauAnnuel = "EauAnnuel";
const ursafAnnuel ="UrsafAnnuel"
const transportsAnnuel="TransportsAnnuel";
const nettoyagesAnnuel="NettoyagesAnnuel"
const diversAnnuel="DiversAnnuel";

const fraisLivraisonSuppAjoutes = "FraisLivraisonSuppAjoutes";
const fraisRachatSuppAjoutes = "FraisRachatSuppAjoutes"
const fraisRachatPrevisionnels = "FraisRachatPrevisionnels";

const capBonusPourcentSalaire = "CapBonusPourcentSalaire";
/* === COLLAB ==*/

const COLLABS_NUMBER  = 5;
const PROP_COLLAB_PREFIX="Collab0";
const PROP_FullName="FullName";
const PROP_Email="Email";
const PROP_Notif = "Notif";
const PROP_SalaireAnnuel="SalaireAnnuel";
const PROP_BonusPercent = "BonusPercent";

/**
 * @param {number} collabNo = 1,2,...
 * @param{string}  collabPropertyName, see constants.gs defines beginning with PROP_
 * @return{string} property name
 */
function getCollabPropertyName(collabNo,collabPropertyName)
{
  //return PROP_COLLAB_PREFIX+Utilities.formatString("%02d", collabNo)+collabPropertyName;
  return PROP_COLLAB_PREFIX+collabNo+collabPropertyName;
}


const collab01FullName = "Collab01FullName";
const collab01Email="Collab01Email";
const collab01Notif="Collab01Notif";
const collab01SalaireAnnuel = "Collab01SalaireAnnuel";
const collab01BonusPercent = "Collab01BonusPercent";
/* === COLLAB ==*/
const collab02FullName = "Collab02FullName";
const collab02Email="Collab02Email";
const collab02Notif="Collab02Notif";
const collab02SalaireAnnuel = "Collab02SalaireAnnuel";
const collab02BonusPercent = "Collab02BonusPercent";
/* === COLLAB ==*/
const collab03FullName = "Collab03FullName";
const collab03Email="Collab03Email";
const collab03Notif="Collab03Notif";
const collab03SalaireAnnuel = "Collab03SalaireAnnuel";
const collab03BonusPercent = "Collab03BonusPercent";
/* === COLLAB ==*/
const collab04FullName = "Collab04FullName";
const collab04Email="Collab04Email";
const collab04Notif="Collab04Notif";
const collab04SalaireAnnuel = "Collab04SalaireAnnuel";
const collab04BonusPercent = "Collab04BonusPercent";

/* === COLLAB ==*/
const collab05FullName = "Collab05FullName";
const collab05Email="Collab05Email";
const collab05Notif="Collab05Notif";
const collab05SalaireAnnuel = "Collab05SalaireAnnuel";
const collab05BonusPercent = "Collab05BonusPercent";


let ALL_PROPERTIES = [
  [ spreadSheetId , "SpreadSheetId"],
  [ dashboardYear , "DashboardYear"],
  [ storeName , "StoreName"],
  [ trendNetEncaisse , "TrendNetEncaisse"],
  [ objectifMensuel , "ObjectifMensuel"],
  [ objectifTresorMensuel , "ObjectifTresorMensuel"],
  [ emailIT , "EmailIT"],
  /* === COLLAB ==*/
  [ collab01FullName , "CollabFullName",collab01FullName],
  [ collab01Email,"CollabEmail",collab01Email],
  [ collab01SalaireAnnuel , "CollabSalaireAnnuel",collab01SalaireAnnuel],
  [ collab01BonusPercent , "CollabBonusPercent",collab01BonusPercent],
  [ collab01Notif,"CollabNotif",collab01Notif],
  /* === COLLAB ==*/
  [ collab02FullName , "CollabFullName",collab02FullName],
  [ collab02Email,"CollabEmail",collab02Email],
  [ collab02BonusPercent , "CollabBonusPercent",collab02BonusPercent],
  [ collab02SalaireAnnuel , "CollabSalaireAnnuel",collab02SalaireAnnuel],
  [ collab02Notif,"CollabNotif",collab02Notif],
  /* === COLLAB ==*/
  [ collab03FullName , "CollabFullName",collab03FullName],
  [ collab03Email,"CollabEmail",collab03Email],
  [ collab03SalaireAnnuel , "CollabSalaireAnnuel",collab03SalaireAnnuel],
  [ collab03BonusPercent , "CollabBonusPercent",collab03BonusPercent],
  [ collab03Notif,"CollabNotif",collab03Notif],
  /* === COLLAB ==*/
  [ collab04FullName , "CollabFullName",collab04FullName],
  [ collab04Email,"CollabEmail",collab04Email],
  [ collab04SalaireAnnuel , "CollabSalaireAnnuel",collab04SalaireAnnuel],
  [ collab04BonusPercent , "CollabBonusPercent",collab04BonusPercent],
  [ collab04Notif,"CollabNotif",collab04Notif],
  /* === COLLAB ==*/
  [ collab05FullName , "CollabFullName",collab05FullName],
  [ collab05Email,"CollabEmail",collab05Email],
  [ collab05SalaireAnnuel , "CollabSalaireAnnuel",collab05SalaireAnnuel],
  [ collab05BonusPercent , "CollabBonusPercent",collab05BonusPercent],
  [ collab05Notif,"CollabNotif",collab05Notif],
  /*===================*/
  [ loyerAnnuel,"LoyerAnnuel"],
  [ electriciteAnnuel , "ElectriciteAnnuel"],
  [ eauAnnuel , "EauAnnuel"],
  [ ursafAnnuel,"UrsafAnnuel"]
  [ transportsAnnuel,"TransportsAnnuel"],
  [ nettoyagesAnnuel,"NettoyagesAnnuel"],
  [ diversAnnuel,"DiversAnnuel"],
  [ adminGeneOk , "AdminGeneOk"],
  [ adminFraisOk , "AdminFraisOk"],
  [ adminGene , "AdminGene"],
  [ adminFrais , "AdminFrais"],
  [capBonusPourcentSalaire,"CapBonusPourcentSalaire"]];





function saveAllProperties(propArray) 
{
  for( let i=0;i<ALL_PROPERTIES.length;i++)
  {
    let use = ALL_PROPERTIES[i];
    let propertyId = use[0];
    let funcSuffix=use[1];
    let found=false;

    for (let j=0;j<propArray.length;j++)
    {
      let prop = propArray[j];

      if ( prop[0]==propertyId)
      {
        found=true
        var setF = "set"+funcSuffix;

        if (use.length > 2)
        {
          let params = [];
          for (pi=0;pi<use.length-2;pi++)
          {
            params.push(use[pi+2]); 
          }
          params.push(prop[1]);
          this[setF](params);
        }
        else
        {
            this[setF](prop[1]);
        }
      }
    }

    if (!found)
    {
      errors_logErrorAndEmail("saveAllProperties: Property : "+funcSuffix + ", not found");
    }
  }
}

function loadAllProperties() 
{
  let propArray = [];
  for( let i=0;i<ALL_PROPERTIES.length;i++)
  {
    let use = ALL_PROPERTIES[i];
    let propertyId=use[0];
    let funcSuffix=use[1];

     var getF = "get"+funcSuffix;
     
    let params="";
    if (use.length > 2)
    {
      for (pi=0;pi<use.length-2;pi++)
      {
        if (pi>0)
          params += ",";
        params += use[pi+2]  ;
      }
    }

    let val;
    if (params=="")
      val = this[getF]();
    else
      val = this[getF](params);

    propArray.push([propertyId,val]);
    Logger.log(propertyId + " : " + val);
  }

  return propArray;
}


/**
 * Indicators for triggers
 */
const indicatorCleanTriggersCLEAN_ALL_TRIGGERS = "cleanAllTriggers"; 

/**
 * Requests Ids
 */
GET_ALLSELLINGS_DATA = "triggerAnnualOrdersRequest";
GET_ALLSELLINGS_LISTINGS = "getAllListingsByShopReceipt";
GET_YEARSELLINGS_DATA = "getAllSoldRecordsForYear";
GET_REVIEWS = "getReviews";

/**
 * 
 */
const ROWS_FORMOST_SOLD=5;
const ROWS_FORMOST_FAVORED=5;
/**
 * Codes d'erreur
 */
const ERR_001= " ERR_0001 : La ligne du net encaissé sur la feuille principale a été décalée";
function test()
{
  Logger.log(prop_getSpreadSheetId());
  Logger.log(STORE_NAME_RANGE);
}
