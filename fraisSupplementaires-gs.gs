



function getFraisLivraisonSuppActuelsTotal() 
{
    return utils_GetCellValue(cellTotalFraisShipAnnuel);
}

function getFraisRachatSuppActuelsTotal() 
{
    return utils_GetCellValue(cellTotalFraisRachatAnnuel);
}

function getFraisLivraisonSuppAjoutesMois(month) 
{
  let r = utils_getNamedCellRowColInSheet(ADMIN_SHEET,cellAdminFraisLivraisonSuppJanvier);
  return utils_GetCellByCoordValue(ADMIN_SHEET,r.row,r.col + month) ;
}

function addFraisLivraisonSuppAjoutes(month,value)
{
  if ( value != 0 )
  {
    r = utils_getNamedCellRowColInSheet(ADMIN_SHEET,cellAdminFraisLivraisonSuppJanvier);
    newValue = getFraisLivraisonSuppAjoutesMois(month) + value;
    utils_setValueByCoord(r.row,r.col+month,ADMIN_SHEET,Math.max(newValue,0));
  }
}

function setFraisLivraisonSuppAjoutes(month,value)
{
  r = utils_getNamedCellRowColInSheet(ADMIN_SHEET,cellAdminFraisLivraisonSuppJanvier);
  utils_setValueByCoord(r.row,r.col+month,ADMIN_SHEET,Math.max(value,0));
}

/*================================================================================*/

function getFraisRachatSuppAjoutesMois(month) 
{
  let r = utils_getNamedCellRowColInSheet(ADMIN_SHEET,cellAdminFraisRachatSuppJanvier);
  return utils_GetCellByCoordValue(ADMIN_SHEET,r.row,r.col + month);
}

function addFraisRachatSuppAjoutes(month,value)
{
    if ( value != 0 )
    {
      r = utils_getNamedCellRowColInSheet(ADMIN_SHEET,cellAdminFraisRachatSuppJanvier);
      let newValue = getFraisRachatSuppAjoutesMois(month) + value;
      utils_setValueByCoord(r.row,r.col+month,ADMIN_SHEET,Math.max(newValue,0));
    }
}


function setFraisRachatSuppAjoutesMois(month,value)
{
  r = utils_getNamedCellRowColInSheet(ADMIN_SHEET,cellAdminFraisRachatSuppJanvier);
  utils_setValueByCoord(r.row,r.col+month,ADMIN_SHEET,Math.max(value,0));
}
/*================================================================================*/

function getFraisRachatPrevisionnelsMois(month) 
{
  let r = utils_getNamedCellRowColInSheet(ADMIN_SHEET,cellAdminFraisRachatPrevisionJanvier);
  return utils_GetCellByCoordValue(ADMIN_SHEET,r.row,r.col + month);
}

function addFraisRachatPrevisionnels(month,value)
{
  if (value != 0 )
  {
    r = utils_getNamedCellRowColInSheet(ADMIN_SHEET,cellAdminFraisRachatPrevisionJanvier);
    newValue = Math.max(getFraisRachatPrevisionnelsMois(month) + value,0);
    utils_setValueByCoord(r.row,r.col + month,ADMIN_SHEET,Math.max(newValue,0)); 
  }
}

function setFraisRachatPrevisionnelsMois(month,value)
{
  r = utils_getNamedCellRowColInSheet(ADMIN_SHEET,cellAdminFraisRachatPrevisionJanvier);
  utils_setValueByCoord(r.row,r.col+month,ADMIN_SHEET,Math.max(value,0));
}
/*================================================================================*/

function getFraisRemboursementsMois(month) 
{
  let r = utils_getNamedCellRowColInSheet(ADMIN_SHEET,cellAdminFraisRemboursementsJanvier);
  return utils_GetCellByCoordValue(ADMIN_SHEET,r.row,r.col + month);
}

function addFraisRemboursementsMois(month,value) 
{
  if (value != 0 )
  {
    r = utils_getNamedCellRowColInSheet(ADMIN_SHEET,cellAdminFraisRemboursementsJanvier);
    newValue = Math.max(getFraisRemboursementsMois(month) + value,0);
    log_RessourceTaskForm(r.col+month + ", " + newValue);
    utils_setValueByCoord(r.row,r.col+month,ADMIN_SHEET,Math.max(newValue)); 
  }
}

function setFraisRemboursementsMois(month,value)
{
  r = utils_getNamedCellRowColInSheet(ADMIN_SHEET,cellAdminFraisRemboursementsJanvier);
  utils_setValueByCoord(r.row,r.col+month,ADMIN_SHEET,Math.max(value,0));
}

/*============================== DIVERS FRAIS==================================================*/
function setDiversMois(month,value)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellDiversJanvier); 
  let estimeRow = rJanvier.getRow();
  let estimeCol = rJanvier.getColumn() + month;

  return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,estimeRow,estimeCol,value);
}

function getDiversMois(month)
{
    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellDiversJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

    return utils_GetCellByCoordValue(ADMIN_SHEET,estimeRow,estimeCol);
}

function addDiversMois(month,value)
{
    let actual = getDiversMois(month);

    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellDiversJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

    return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,estimeRow,estimeCol,actual+value);
}
/*=================================================================================*/
function test_manageFraisSupplementaireUserInput()
{
var data = {
          "dbTarget":"adminFraisSupp",
          "FraisLivraisonSuppAjoutes": 0,
          "FraisRachatSuppAjoutes":0,
          "FraisRachatPrevisionnels": 0,
          "FraisDeRemboursements" : 140,
          "FraisDivers" : 140,
          "Mois": 1
        };

        manageFraisSupplementaireUserInput(data)
}

function manageFraisSupplementaireUserInput(data)
{
    log_RessourceTaskForm(8+data.Mois);
    try
    {
      let mois = Number(data.Mois);

      /*============================ FraisLivraisonSuppAjoutes =========================*/
      addFraisLivraisonSuppAjoutes(mois,data.FraisLivraisonSuppAjoutes );

      /*================================ FraisRachatSuppAjoutes ========================*/
      addFraisRachatSuppAjoutes(mois,data.FraisRachatSuppAjoutes);

      /*================================ FraisRachatPrevisionnels ======================*/
      addFraisRachatPrevisionnels(mois,data.FraisRachatPrevisionnels);

       /*================================ FraisDeRemboursements ========================*/
      addFraisRemboursementsMois(mois,data.FraisDeRemboursements);

       /*================================ FraisDeRemboursements ========================*/
      addDiversMois(mois,data.FraisDivers);

      /*========================= Remettre à jour le tableau ===========================*/
      forecastSalariesForMonth(mois);
    }
    catch(err)
    {
      errors_logErrorAndEmail(err.message)
      return false;
    }

    return true;
}

function test_getFraisSupplementairesData()
{
  Logger.log(getFraisSupplementairesData(1));
}



function getFraisSupplementairesData(month)
{
  setDebugMode()
  data={};

  let mois = utils_parseInt(month);


  let col1 = constant_getFirstFraisColumn(mois);

  log_RessourceTaskForm("Month: " + mois + ", col: "+ col1);
  
  let frais = utils_getSheet(ADMIN_SHEET).getRange(FIRST_FRAIS_SUPP_ROW,col1,LAST_FRAIS_SUPP_ROW-FIRST_FRAIS_SUPP_ROW+1,1).getValues();

  data["livraison"]          = utils_parseInt(frais[0][0]);
  data["rachatSupp"]         = utils_parseInt(frais[1][0]);
  data["rachatPrevisionnel"] = utils_parseInt(frais[2][0]);
  data["remboursements"]     = utils_parseInt(frais[3][0]); 
  data["divers"]             = utils_parseInt(getDiversMois(mois)); 

  log_RessourceTaskForm(JSON.stringify(data));

  resetDebugMode();
  return data;
}

/**
 * 
 */
function menuShowModifFraisSupplementaireModalDialog()
{
  let userForm = HtmlService.createHtmlOutputFromFile("fraisSupplementaires-html")
  .setHeight(700) 
  .setWidth(800); 

  SpreadsheetApp.getUi().showModalDialog(userForm,"Rajout de frais supplémentaires");
}


/**
 * 
 * Id	Mois	Date	Détail	MarketingEtsy	MarketingGoogle	MarketingInstagram	MarketingFacebook	Shopify	Achat Marchandises	Matériaux Créations	Showroom	Supp Livraison	Achats 	Remboursements														
 */

const FRAIS_SPREADSHEET_ID = "1zE-GT6VR4XioTFzKpggxhUn0spoA22BhSdvK5ZIpGP0";
const FRAIS_SHEET = "ListeFrais";
const SOMMES_SHEET = "Sommes";

const FRAIS_ID = 1;
const FRAIS_MOIS = 2;
const FRAIS_ANNEE = 3;
const FRAIS_DATE = 4;
const FRAIS_DETAIL=5 ;
const FRAIS_MarketingEtsy= 6;
const FRAIS_MarketingGoogle=7 ;
const FRAIS_MarketingInstagram=8 ;
const FRAIS_MarketingFacebook=9 ;
const FRAIS_Shopify= 10;
const FRAIS_MateriauxCreation= 11;
const FRAIS_Showroom=12 ;
const FRAIS_SUPPLivraison= 13;
const FRAIS_AchatMarchandises=14;
const FRAIS_SUPPRemboursements=15;
const FRAIS_CCY=16;

const FRAIS_NBRE_COLUMNS = 16;

/*==========*/
const SOMME_SOMMEMOIS = 1;
const SOMME_MOIS = 2;
const SOMME_ANNEE=3 ;

const SOMME_MarketingEtsy= 4;
const SOMME_MarketingGoogle=5 ;
const SOMME_MarketingInstagram=6 ;
const SOMME_MarketingFacebook=7 ;
const SOMME_Shopify= 8;
const SOMME_MateriauxCreation= 9;
const SOMME_Showroom= 10;
const SOMME_SUPPLIVRAISON= 11;
const SOMME_AchatMarchandises=12;
const SOMME_SUPPRemboursements=13;

const SOMME_NBRE_COLUMNS = 13;

const LISTE_SOMMES = 
[[SOMME_MarketingEtsy,"Marketing Etsy"],
 [SOMME_MarketingGoogle,"Marketing Google"],
  [SOMME_MarketingInstagram,"Marketing Instagram"],
  [SOMME_MarketingFacebook,"Marketing Facebook"],
  [SOMME_Shopify,"Shopify"],
  [SOMME_MateriauxCreation,"Materiaux Creation"],
  [SOMME_Showroom,"Showroom"],
  [SOMME_SUPPLIVRAISON, "Frais de livraion"],
  [SOMME_AchatMarchandises, "Achat de marchandise"],
  [SOMME_SUPPRemboursements , "Remboursements Etsy"]];


function frais_mettreAJourLesSommes()
{
    //Puis les sommes
    let fraisSheet = utils_getTable(FRAIS_SPREADSHEET_ID,FRAIS_SHEET);
    let fraisData = fraisSheet.getRange(2,1,fraisSheet.getLastRow()-1,FRAIS_NBRE_COLUMNS).getValues();
    let sommesSheet = utils_getTable(FRAIS_SPREADSHEET_ID,SOMMES_SHEET);
    
    let sommeFrais={};
    for(let i=2022;i<=2062;i++)
    {
      sommeFrais[`${i}`] = {};
      for(j=1;j<=12;j++)
      {
          sommeFrais[`${i}`][`${j}`] = {};

          sommeFrais[`${i}`][`${j}`][`${SOMME_MarketingEtsy}`] = 0;
          sommeFrais[`${i}`][`${j}`][`${SOMME_MarketingGoogle}`] = 0;
          sommeFrais[`${i}`][`${j}`][`${SOMME_MarketingInstagram}`] = 0;
          sommeFrais[`${i}`][`${j}`][`${SOMME_MarketingFacebook}`] = 0;
          sommeFrais[`${i}`][`${j}`][`${SOMME_Shopify}`] = 0;  
          sommeFrais[`${i}`][`${j}`][`${SOMME_MateriauxCreation}`] = 0;
          sommeFrais[`${i}`][`${j}`][`${SOMME_Showroom}`] = 0;
          sommeFrais[`${i}`][`${j}`][`${SOMME_SUPPLIVRAISON}`] = 0;
          sommeFrais[`${i}`][`${j}`][`${SOMME_AchatMarchandises}`] = 0;    
          sommeFrais[`${i}`][`${j}`][`${SOMME_SUPPRemboursements}`] = 0;

      }
    }


    let rates = ccy_loadRates(); 
    for(let i=0;i<fraisData.length;i++)
    {
        let annee = fraisData[i][FRAIS_ANNEE-1];
        let mois  = fraisData[i][FRAIS_MOIS-1];

        if (mois !="" && annee != "")
        {
          let ccy = fraisData[i][FRAIS_CCY-1];
          let exchangeValue = 1;
          if (ccy!="" && ccy != CCY_EUR)
            exchangeValue = rates[ccy];

          sommeFrais[`${annee}`][`${mois}`][`${SOMME_MarketingEtsy}`]       += exchangeValue * fraisData[i][FRAIS_MarketingEtsy-1];
          sommeFrais[`${annee}`][`${mois}`][`${SOMME_MarketingGoogle}`]     += exchangeValue * fraisData[i][FRAIS_MarketingGoogle-1];
          sommeFrais[`${annee}`][`${mois}`][`${SOMME_MarketingInstagram}`]  += exchangeValue * fraisData[i][FRAIS_MarketingInstagram-1];
          sommeFrais[`${annee}`][`${mois}`][`${SOMME_MarketingFacebook}`]   += exchangeValue * fraisData[i][FRAIS_MarketingFacebook-1];
          sommeFrais[`${annee}`][`${mois}`][`${SOMME_Shopify}`]             += exchangeValue * fraisData[i][FRAIS_Shopify-1];  
          sommeFrais[`${annee}`][`${mois}`][`${SOMME_MateriauxCreation}`]   += exchangeValue * fraisData[i][FRAIS_MateriauxCreation-1];
          sommeFrais[`${annee}`][`${mois}`][`${SOMME_Showroom}`]            += exchangeValue * fraisData[i][FRAIS_Showroom-1];
          sommeFrais[`${annee}`][`${mois}`][`${SOMME_SUPPLIVRAISON}`]       += exchangeValue * fraisData[i][FRAIS_SUPPLivraison-1];
          sommeFrais[`${annee}`][`${mois}`][`${SOMME_AchatMarchandises}`]   += exchangeValue * fraisData[i][FRAIS_AchatMarchandises-1];    
          sommeFrais[`${annee}`][`${mois}`][`${SOMME_SUPPRemboursements}`]  += exchangeValue * fraisData[i][FRAIS_SUPPRemboursements-1];
        }
    }

    let sommeValues = []; //En euros
    for(let annee=2022; annee<=2062;annee++)
    {
      for(mois=1;mois<=12;mois++)
      {
          let aRow = [0,0,0,0,0,0,0,0,0,0,0,0];

          aRow[SOMME_MOIS-2]  = mois;
          aRow[SOMME_ANNEE-2] = annee;
          aRow[SOMME_MarketingEtsy-2]       = utils_parseFloat(sommeFrais[`${annee}`][`${mois}`][`${SOMME_MarketingEtsy}`]) ;
          aRow[SOMME_MarketingGoogle-2]     = utils_parseFloat(sommeFrais[`${annee}`][`${mois}`][`${SOMME_MarketingGoogle}`]) ;
          aRow[SOMME_MarketingInstagram-2]  = utils_parseFloat(sommeFrais[`${annee}`][`${mois}`][`${SOMME_MarketingInstagram}`]) ;
          aRow[SOMME_MarketingFacebook-2]   = utils_parseFloat(sommeFrais[`${annee}`][`${mois}`][`${SOMME_MarketingFacebook}`]) ;
          aRow[SOMME_Shopify-2]             = utils_parseFloat(sommeFrais[`${annee}`][`${mois}`][`${SOMME_Shopify}`])  ;
          aRow[SOMME_MateriauxCreation-2]   = utils_parseFloat(sommeFrais[`${annee}`][`${mois}`][`${SOMME_MateriauxCreation}`]) ;
          aRow[SOMME_Showroom-2]            = utils_parseFloat(sommeFrais[`${annee}`][`${mois}`][`${SOMME_Showroom}`]) ;
          aRow[SOMME_SUPPLIVRAISON-2]       = utils_parseFloat(sommeFrais[`${annee}`][`${mois}`][`${SOMME_SUPPLIVRAISON}`]) ;
          aRow[SOMME_AchatMarchandises-2]   = utils_parseFloat(sommeFrais[`${annee}`][`${mois}`][`${SOMME_AchatMarchandises}`]) ;
          aRow[SOMME_SUPPRemboursements-2]  = utils_parseFloat(sommeFrais[`${annee}`][`${mois}`][`${SOMME_SUPPRemboursements}`]) ;

          sommeValues.push(aRow);
      }
    }

    sommesSheet.getRange(2,2,sommeValues.length,SOMME_NBRE_COLUMNS-1).setValues(sommeValues);
}


/**
 * 
 * fraisId est le nom de la colonne SOMME_xxxx voir ci-dessus
 * annee >= 2022, mois =1...12
 */
function frais_getFrais(fraisIdArray, mois, annee)
{
  try
  {
    let sommesSheet = utils_getTable(FRAIS_SPREADSHEET_ID,SOMMES_SHEET);
    let sommesData = sommesSheet.getRange(2,1,sommesSheet.getLastRow()-1,SOMME_NBRE_COLUMNS).getValues();
    let dataRow = (annee-2022)*12 + mois-1;

    let ret=[];
    for(let i=0;i<fraisIdArray.length;i++)
    {
        ret.push(sommesData[dataRow][fraisIdArray[i][0]-1]);
    }

    return ret;
  }
  catch(err)
  {
    Logger.log(err.message);
  }
}

/**
 * 
 * fraisId est le nom de la colonne SOMME_xxxx voir ci-dessus
 * annee >= 2022, mois =1...12
 */
function test_frais_getFraisForYear()
{
  frais_getFraisForYear(2022);
}

function frais_getFraisForYear(annee)
{
  try
  {
    let sommesSheet = utils_getTable(FRAIS_SPREADSHEET_ID,SOMMES_SHEET);
    let data = sommesSheet.getRange(1+(annee-2022), 4, 13, LISTE_SOMMES.length+1).getValues();
    
    for (let j=0 ;j < LISTE_SOMMES.length ; j++)
      data[0][j] = "<b>"+LISTE_SOMMES[j][1]+"</b>";

    data[0][LISTE_SOMMES.length] = "";

    for ( let mois=0;mois<12;mois++)
    {
      let sum = 0.0;
      for(let frais=0;frais<LISTE_SOMMES.length;frais++)
      {
        sum += utils_parseFloat(data[mois+1][frais]);
      }
      data[mois+1][LISTE_SOMMES.length] = utils_parseFloat(sum.toFixed(2));
    }

    let sumByFrais  = new Array(LISTE_SOMMES.length+1);
    sumByFrais[0]="";
    for ( let frais=0;frais<LISTE_SOMMES.length;frais++)
    {
      let sum = 0;
      for(let mois=0;mois<12;mois++)
      {
        sum += data[mois+1][frais];
      }
      sumByFrais[frais] = utils_parseFloat(sum).toFixed(2);;
    }

    data.push(sumByFrais);
    data[0][LISTE_SOMMES.length]= "<p style='color:green;'><b>Totaux par mois</b></p>";

    //Le grand total
    sum=0.0;
    for(let i=0;i<12;i++)
      sum += utils_parseFloat(data[13][i]);
    
    data[13][LISTE_SOMMES.length] = "<p style='color:orange;'><b>" + utils_parseFloat(sum).toFixed(2) + "</b></p>";

    for (i=1;i<=12;i++)
      for (j=0;j<=LISTE_SOMMES.length;j++)
      { 
        if ( data[i][j] != 0. )
          data[i][j] = utils_parseFloat(data[i][j]).toFixed(2);
        else
          data[i][j] = "";
      }

    for (i=1;i<=12;i++)
      data[i][LISTE_SOMMES.length] = "<p style='color:green;'><b>" + data[i][LISTE_SOMMES.length] + "</b></p>";

    for (i=1;i<=LISTE_SOMMES.length;i++)
      data[13][i] = "<p style='color:green;'><b>" + data[13][i] + "</b></p>";


    let ret={};
    ret["err"]="ok"
    ret["year"]     = annee;
    ret["sumMatrix"] = utils_transposeMatrix(data);;
    return JSON.stringify(ret);
  }
  catch(err)
  {
    let ret={};
    ret["err"]="nok";
    ret["msg"] = err.message;
    return ret;
  }
}


/**
 * 
 * 
 */
function frais_getFraisForCurrentYear()
{
  return frais_getFraisForYear(utils_getCurrentYear());
}


/**
 * 
 * 
 * 
 */
function frais_updateFeuilleAdmin()
{
  //Et maitenant la feuille admnin
  let annee = utils_getCurrentYear(); //>= 2022
  let mois = utils_getCurrentMonth()+1; //>=1

  //Pour être certain d'avoir les bonnes valeurs
  frais_mettreAJourLesSommes();

  

  let frais = frais_getFrais(LISTE_SOMMES, mois, annee);

  let fraisDivers = 0;
  //Frais divers de col 0 à col  du résultat
  for(let i=0;i<=6;i++)
    fraisDivers += frais[i];

  setDiversMois(mois-1,fraisDivers);
  setFraisRemboursementsMois(mois-1,frais[9]);
  setFraisLivraisonSuppAjoutes(mois-1,frais[7]);
  setFraisRachatSuppAjoutesMois(mois-1,frais[8]);
}





