


function fin_getDataForCurrentYear()
{
  let data={};
  let currentYear = utils_getCurrentYear();
  data["year"] = currentYear;

  let fraisData = frais_getFrais(currentYear);
}



function test_fin_getMouvments()
{
    fin_getMouvments(0)
}
/**
 * 
 * 
 * 
 */
function test_fin_getMouvments()
{
    Logger.log(fin_getMouvments(0))
}

function fin_getMouvments(type)
{
  if ( type == 1)
  {
    //Mouvements par compte
    //==================================================================================================================
    let mouvements = {};
    let access1   =   tbl_tableAccess(TABLES_DEFINITIONS.COMPTES_ListeComptes,TABLE_ACCESS_TYPE.REPEATED);
    let row       = access1.getFirstRow();
    while(row !=null)
    {
        let idCompte  = access1.getField(row,TABLES_DEFINITIONS.COMPTES_ListeComptes.Fields.COMPTES_LIST_EMAIL);
        mouvements[`${idCompte}`] = [];
        row = access1.getNextRow(row.row);
    }
    //======== LES MONTANTS 
    let access   =   tbl_tableAccess(TABLES_DEFINITIONS.COMPTES_Mouvements,TABLE_ACCESS_TYPE.REPEATED);
    row = access.getFirstRow();
    while(row != null)
    {
      let mvtDate         = utils_formatDateForPicker(access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_DATE));
      let compteCredite   = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_CREDITE);
      let compteDebite    = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_DEBITE);
      let compteMontant   = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_MT);
      let raison          = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_RAISON);
      let description     = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_DESC);
      let mvtCCy          = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_CCY);

      let aMouvementCredit = [mvtDate, utils_parseFloat(compteMontant).toFixed(2) ,"", description,raison ];
      let aMouvementDebit = [mvtDate, "" ,utils_parseFloat(compteMontant).toFixed(2),description, raison ];

      mouvements[`${compteCredite}`].push(aMouvementCredit) ;
      mouvements[`${compteDebite}`].push(aMouvementDebit) ;

      row = access.getNextRow(row.row);
    }
    return JSON.stringify(mouvements);
  }
  else
  {
    //Mouvements tous les comptes
    //==================================================================================================================
    let bilans = {};
    let bilansMensuels = {};
    let access   =   tbl_tableAccess(TABLES_DEFINITIONS.COMPTES_ListeComptes,TABLE_ACCESS_TYPE.REPEATED);
    let row       = access.getFirstRow();
    while(row !=null)
    {
        let idCompte  = access.getField(row,TABLES_DEFINITIONS.COMPTES_ListeComptes.Fields.COMPTES_LIST_EMAIL);
        bilans[`${idCompte}`] = {};
        bilans[`${idCompte}`]["credit"] = 0;
        bilans[`${idCompte}`]["debit"] = 0;
        bilans[`${idCompte}`]["bilan"] = 0;

        bilansMensuels[`${idCompte}`] = {};
        for(let im=0;im<12;im++)
        {
          bilansMensuels[`${idCompte}`][`${im}`]= {};
          bilansMensuels[`${idCompte}`][`${im}`]["credit"] = 0;
          bilansMensuels[`${idCompte}`][`${im}`]["debit"] = 0;
          bilansMensuels[`${idCompte}`][`${im}`]["bilan"] = 0;
        }

        row = access.getNextRow(row.row);
    }

    access   =   tbl_tableAccess(TABLES_DEFINITIONS.COMPTES_Mouvements,TABLE_ACCESS_TYPE.REPEATED);
    let mouvements = [];
    row = access.getFirstRow();
    let totalDebits=0;
    let totalCredit = 0;
    while(row != null)
    {
      let date            = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_DATE);
      let mvtDate         = utils_formatDateForPicker(date);
      let compteCredite   = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_CREDITE);
      let compteDebite    = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_DEBITE);
      let montant         = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_MT);
      let mvtCCy          = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_CCY);
      let raison          = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_RAISON);
      let description     = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_DESC);
      let idCompte  = access.getField(row,TABLES_DEFINITIONS.COMPTES_ListeComptes.Fields.COMPTES_LIST_EMAIL);

      //BILANS
      bilans[`${compteCredite}`].credit +=  montant;
      bilans[`${compteCredite}`].bilan  += montant;
      bilans[`${compteDebite}`].debit   += montant;
      bilans[`${compteDebite}`].bilan   -= montant;

      //BILANS MENSUELS
      let month = new Date(date).getMonth();
      bilansMensuels[`${compteCredite}`][`${month}`].credit += montant;
      bilansMensuels[`${compteCredite}`][`${month}`].bilan += montant;
      bilansMensuels[`${compteDebite}`][`${month}`].debit += montant;
      bilansMensuels[`${compteDebite}`][`${month}`].bilan -= montant;

      //MOUVEMENTS
      let aMouvement = [mvtDate, compteDebite, compteCredite, utils_parseFloat(montant).toFixed(2) ,description,raison];
      mouvements.push(aMouvement) ;

      row = access.getNextRow(row.row);
    }

    let bilansArray = [];
    for(key in bilans)
    {
        let split = key.split("@");
        bilansArray.push(["<b>"+split[0]+"</b>",utils_parseFloat(bilans[key].debit).toFixed(2), 
                              utils_parseFloat(bilans[key].credit).toFixed(2), utils_parseFloat(bilans[key].bilan).toFixed(2)])
    }

    let bilansMensuelsArray = [];
    for(key in bilansMensuels)
    {
        let split = key.split("@");
        let oneYear = ["<b>"+split[0]+"</b>"];
        for (let i=0;i<12;i++)
        {
          /*
          oneYear = oneYear.concat([utils_parseFloat(bilansMensuels[key][`${i}`].debit).toFixed(2), 
                              utils_parseFloat(bilansMensuels[key][`${i}`].credit).toFixed(2), utils_parseFloat(bilansMensuels[key][`${i}`].bilan).toFixed(2)])
          */
          oneYear = oneYear.concat([utils_parseFloat(bilansMensuels[key][`${i}`].bilan).toFixed(2)])
        }

        bilansMensuelsArray.push(oneYear);
    }

    let retVal = {};
    retVal["err"]="ok";
    let ret = {};
    ret["mouvements"] = mouvements;
    ret["bilans"] = bilansArray;
    ret["bilansMensuels"] = bilansMensuelsArray;
    retVal["data"] = ret;
    return JSON.stringify(retVal);
  } 
}







/**
 * 
 * 
 * frais_computeFraisShippingSupplementaires
 * Février: 32667 MAD
 * Mois >= 0
 */
function test_fin_computeFraisShippingSupplementaires()
{
  Logger.log(fin_computeFraisShippingSupplementaires(2022,2))
}


/**
 * 
 * 0 <= tillMonth <= 11
 * 
 */
function fin_computeFraisShippingSupplementaires(year,tillMonth)
{
  let maxMonth = Math.min(tillMonth,11);
  let data = JSON.parse(fin_getMouvments(0));
  let bilansMensuels = data["data"]["bilansMensuels"];
  let bilanEnvois=[];

  for(let i=0;i<bilansMensuels.length;i++)
  {
    let compte = bilansMensuels[i][0];
    if (compte.indexOf("Amana") >= 0)
    {
      for(month=0;month <= maxMonth;month++)
        bilanEnvois.push(bilansMensuels[i][3*month+2]);
      break;
    }
  }

  let orderData = utils_getSheet(DATA_SHEET).getDataRange().getValues();
  let totalShipFacture = [];
  for (month =0;month <= maxMonth;month++)
  {
    totalFacture=0;
    for(let i=1;i<orderData.length-1;i++)
    {
        let date = new Date(orderData[i][DATE_INDATA_SHEET-1]);
        let mois = date.getMonth();
        let annee = date.getFullYear();
        if (annee == year && mois == month)
        {
            totalFacture += orderData[i][6];
        }
    }

    totalShipFacture.push(totalFacture);
  }

  let retValues = [];
  for(let month=0;month<=maxMonth;month++ )
    retValues.push(utils_parseFloat(bilanEnvois[month] - totalShipFacture[month]).toFixed(0));

  return retValues;
}

function fin_computeFraisShippingSupplementairesTillMoisCourant()
{
  let val = fin_computeFraisShippingSupplementaires(utils_getCurrentYear(),utils_getCurrentMonth());

  Logger.log(val);
  return val;
}
