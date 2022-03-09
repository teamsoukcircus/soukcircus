
const G_SPREADSHEET_APP_ID="14R6wJO2t38yXUfHGRXjIm06NgQvHt-J8pLknq021Fb0"; //Tableau de bord. complet

const TABLES_DEFINITIONS =
{
  "COUNTRY" : 
  {
    SpreadSheet : G_SPREADSHEET_APP_ID,
    Table       : "Country",
    Header      : ["Code", "Name", "Language"],
    Fields      : {COUNTRY_CODE:1, COUNTRY_NAME:2, COUNTRY_LANGUAGE:3},
    NCols       : 3,
    keyColumn   : 1
  },
  "CUSTOMER": 
  {
    SpreadSheet : "1MGxsvx2tKT6Z8ZI54fydD9VjC9UAuYkNKScv7U7fCQE",
    Table       : "Customers",
    Header      : ["Buyer Id", "Name",	"Email",	"Phone", "Language",	"Last order date",	
                               "Total ordered"	, "Country code",	"Country name",	"Address"	],
    Fields      : {CUSTOMER_BUYER_ID:1,CUSTOMER_NAME:2,CUSTOMER_EMAIL:3,CUSTOMER_PHONE:4,CUSTOMER_LANGUAGE:5,CUSTOMER_LASTORDERDATE:6,
                   CUSTOMER_TOTALAMOUNT:7,CUSTOMER_COUNTRYCODE:8,CUSTOMER_COUNTRYNAME:9,CUSTOMER_ADDRESS:10},
    NCols       : 10,
    keyColumn   : 3
  },
  "COMMANDES": 
  {
    SpreadSheet : STOCK_SPREADSHEET_ID,
    Table       : "Commandes",
    Header      : ["Id",	"Date",	"Titre", 	"Description", "URL Etsy", 	"Fournisseur",	"CM_Length",	"CM_Width",	
                   "CM_Height",	"CM_DiameterTop","CM_DiameterMiddle","CM_DiameterBottom", "Quality", "Quantity",	
                   "Color",	"GDriveDocCommande","New Product","SKU", "GDrive ImageId", "Validated", "Validation date"],
    NCols       : 21,
    keyColumn   : 1
  },
  "COMPTES_Mouvements": 
  {
    SpreadSheet : "1Qif-gpeXoTJ_SurN5P1dp5pUHHTKbmfxO-K4xEJKHDU",
    Table       : "Mouvements",
    Header      : ["Id",	"Date",	"Effectuant",	"Compte Débité",	"Compte Crédité", "Montant",	"CCY",	"Description",	"Raison"],
    Fields      : {COMPTES_MVMT_ID:1,COMPTES_MVMT_DATE:2, COMPTES_MVMT_EFFECTUANT:3, COMPTES_MVMT_DEBITE:4,COMPTES_MVMT_CREDITE:5,
                   COMPTES_MVMT_MT:6, COMPTES_MVMT_CCY:7, COMPTES_MVMT_DESC:8, COMPTES_MVMT_RAISON:9},
    NCols       : 9,
    keyColumn   : 1
  },
  
  "COMPTES_ListeComptes": 
  {
    SpreadSheet : "1Qif-gpeXoTJ_SurN5P1dp5pUHHTKbmfxO-K4xEJKHDU",
    Table       : "Liste des comptes",
    Header      : ["Détenteur",	"Email",	"Role",	"Date création",	"Date mise à jour",	"Crédits",	"Débits",	"Bilan"],
    Fields      : {COMPTES_LIST_DETENTEUR:1,COMPTES_LIST_EMAIL:2, COMPTES_LIST_ROLE:3,COMPTES_LIST_DATECRE:4,
                   COMPTES_LIST_DATEUPD:5,COMPTES_LIST_CREDITS:6, COMPTES_LIST_DEBITS:7, COMPTES_LIST_BILAN:8},
    NCols       : 8,
    keyColumn   : 2
  },
  "COMPTES_MouvementsMois": 
  {
    SpreadSheet : "1Qif-gpeXoTJ_SurN5P1dp5pUHHTKbmfxO-K4xEJKHDU",
    Table       : "MvtsMois",
    Header      : ["Mois","Id",	"Date",	"Effectuant",	"Compte Débité",	"Compte Crédité", "Montant",	"CCY",	"Description",	"Raison"],
    Fields      : {COMPTES_MVMT_MOIS_M: 1, COMPTES_MVMT_MOIS_ID:2,COMPTES_MVMT_MOIS_DATE:3, COMPTES_MVMT_MOIS_EFFECTUANT:4, COMPTES_MVMT_MOIS_DEBITE:5,COMPTES_MVMT_MOIS_CREDITE:6,COMPTES_MVMT_MOIS_MT:7, COMPTES_MVMT_MOIS_CCY:8, COMPTES_MVMT_MOIS_DESC:9, COMPTES_MVMT_MOIS_RAISON:10},
    NCols       : 10,
    keyColumn   : 2
  }
  /* Next 
  "<NAME>": 
  {
    SpreadSheet : <NAME>_SPREADSHEET_ID,
    Table       : <NAME>_SHEET,
    Header      : <NAME>_HEADER,
    NCols       : <NAME>_HEADER.length
  }
  */
};

/**
 * 
 * ======================================== TEMPLATE TABLE DEFINITION ========================================
const <NAME>_SPREADSHEET_ID    = "";
const <NAME>_SHEET             = ""; 
const <NAME>_<COLUMNS          = ;
const <NAME>_<COLUMNS          = ;
....
const <NAME>_<COLUMNS          = ;
const <NAME>_HEADER            = ["", "", ...., ""];

=============================================================================================================*/


/**
 * 
 * ======================================== COUNTRIES TABLE DEFINITION ========================================
 */
const COUNTRY_CODE              = 1;
const COUNTRY_NAME              = 2;
const COUNTRY_LANGUAGE          = 3;

/* =============================================================================================================*/




/**
 * 
 * ======================================== CUSTOMERS TABLE DEFINITION ========================================
 */
const CUSTOMER_BUYER_ID         = 1;
const CUSTOMER_NAME             = 2;
const CUSTOMER_EMAIL            = 3;
const CUSTOMER_PHONE            = 4;
const CUSTOMER_LANGUAGE         = 5;
const CUSTOMER_LASTORDERDATE    = 6;
const CUSTOMER_TOTALAMOUNT      = 7;
const CUSTOMER_COUNTRYCODE      = 8;
const CUSTOMER_COUNTRYNAME      = 9;
const CUSTOMER_ADDRESS          = 10;

/* =============================================================================================================*/




/* =============================================================================================================*/



