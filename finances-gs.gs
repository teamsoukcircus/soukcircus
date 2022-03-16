


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
    Logger.log(fin_getMouvments(0,[]))
}

function fin_getMouvments(type,listeComptes)
{
  let ccyMDA2EURRate = ccy_getRateToEUR("MAD");
  if ( type == 1)
  {
    //Mouvements par compte
    //==================================================================================================================
    let tousLesCompte = (listeComptes.length==0);
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
      let id   = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_ID);
      
      if (id != "")
      {
        let compteCredite   = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_CREDITE);
        let compteDebite    = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_DEBITE);
        let mvtDate         = utils_formatDateForPicker(access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_DATE));
        let raison          = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_RAISON);
        let description     = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_DESC);
        let mvtCCy          = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_CCY);
        let compteMontant   = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_MT);

        if ( tousLesCompte || listeComptes.indexOf(compteCredite)>=0 || listeComptes.indexOf(compteDebite)>=0 )
        {
          if ( mvtCCy == "MAD")
            compteMontant *= ccyMDA2EURRate;

          let aMouvementCredit = [mvtDate, utils_parseFloat(compteMontant).toFixed(2) ,"", description,raison ];
          let aMouvementDebit = [mvtDate, "" ,utils_parseFloat(compteMontant).toFixed(2),description, raison ];

          mouvements[`${compteCredite}`].push(aMouvementCredit) ;
          mouvements[`${compteDebite}`].push(aMouvementDebit) ;
        }

        row = access.getNextRow(row.row);
      }
      else
        break;
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
    //log_RessourceTaskForm(access.getNLines());

    let mouvements = [];
    row = access.getFirstRow();
    while(row != null)
    {
      let date            = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_DATE);
      let compteCredite   = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_CREDITE);
      let compteDebite    = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_DEBITE);
      let montant         = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_MT);
      let mvtCCy          = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_CCY);
      let raison          = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_RAISON);
      let description     = access.getField(row,TABLES_DEFINITIONS.COMPTES_Mouvements.Fields.COMPTES_MVMT_DESC);
      
      if (date=="" && compteCredite=="" && montant =="")
        break;

      let mvtDate         = utils_LocalGMTTimeFormatThisDate(date,ENUM_DATE_FORMAT.LONGMS);

      if ( mvtCCy == "MAD")
          montant *= ccyMDA2EURRate;

      //BILANS

      bilans[`${compteCredite}`].credit +=  montant;
      bilans[`${compteCredite}`].bilan  += montant;
      bilans[`${compteDebite}`].debit   += montant;
      bilans[`${compteDebite}`].bilan   -= montant;

      //BILANS MENSUELS
      let split = mvtDate.split("/");
      let month = utils_parseInt(split[1])-1;
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
 *        function fin_addSalaireMouvment(accountId,salaryAndBonusAmount, ccy)
 */
function fin_addSalaireMouvment(accountId,salaryAndBonusAmount,ccy,month)
{
  let access   =   tbl_tableAccess(TABLES_DEFINITIONS.COMPTES_Mouvements,TABLE_ACCESS_TYPE.REPEATED);
  let ccyMDA2EURRate = ccy_getRateToEUR("MAD");

  //["Id",	"Date",	"Effectuant",	"Compte Débité",	"Compte Crédité", "Montant",	"CCY",	"Description",	"Raison"],
  //1647352547952	15/03/2022	soukcircus@gmail.com	celine@salaire.com	1200	EUR	Salaire	SALAIRE Mars												
  let mouvement=[];
  mouvement.push(utils_uniqueID());
  mouvement.push(utils_officialDatFormat(new Date()));
  mouvement.push("teamsoukcircus@gmail.com");
  mouvement.push("soukcircus@gmail.com");
  mouvement.push(accountId);
  mouvement.push(salaryAndBonusAmount);
  mouvement.push(ccy);
  mouvement.push("Salaire");
  mouvement.push("SALAIRE " + SHEET_MONTH_NAMES_LONG[month])
  if (ccy == "EUR")
  {
    mouvement.push(salaryAndBonusAmount);
    mouvement.push(salaryAndBonusAmount/ccyMDA2EURRate);
  }
  else
  {
    mouvement.push(salaryAndBonusAmount*ccyMDA2EURRate);
    mouvement.push(salaryAndBonusAmount);
  }   
  
  access.appendRow(mouvement);
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
        bilanEnvois.push(bilansMensuels[i][month+1]);

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
  {
    let facture = utils_parseFloat(totalShipFacture[month]).toFixed(2);
    let envois = utils_parseFloat(bilanEnvois[month]).toFixed(2)
    let supp  = utils_parseFloat(envois-facture).toFixed(2);
    retValues.push([facture,envois,supp]);
  }

  return retValues;
}

function fin_computeFraisShippingSupplementairesTillMoisCourant()
{
  let val = fin_computeFraisShippingSupplementaires(utils_getCurrentYear(),utils_getCurrentMonth());

  Logger.log(val);
  return val;
}



/*=========================================================================================================================================================
                                                          SALAIRES
==========================================================================================================================================================*/                                                         
/**
 * 
 * Méthiode avec Salaire Said variable
 */
function variable_forecastSalariesForMonth(month,useThisNetEncaisse=-1, manual = false) 
{
  let   currMonth = utils_getCurrentMonth();
  if ( month > currMonth)
      return;

  let listErrors = [];
  //=================Initialisation des variables==========================
  let   bonus1            = 0;
  let   bonus2            = 0;
  let   bonus3            = 0;
  let   estimeNetEncaisse = 0;
  let   salairePrevu1     = 0;
  let   salairePrevu2     = 0;
  let   salairePrevu3     = 0;
  let   salaireFinal1     = 0;
  let   salaireFinal2     = 0;
  let   salaireFinal3     = 0;
  let   totalSalairesPrevus = 0;
  let   Disponible        = 0;
  
  //==========================================================================
  //Les salaires prévus
  salairePrevu1 = getCollabSalaireAnnuel(collab01SalaireAnnuel)/12;
  salairePrevu2 = getCollabSalaireAnnuel(collab02SalaireAnnuel)/12;
  salairePrevu3 = getCollabSalaireAnnuel(collab03SalaireAnnuel)/12;

  totalSalairesPrevus = salairePrevu1+salairePrevu2+salairePrevu3;

  //Estimation du. net encaissé en fin de mois
  if ( useThisNetEncaisse  >= 0  )
    estimeNetEncaisse = useThisNetEncaisse; 
  else
    estimeNetEncaisse = computeNetEncaisseEstime(month);

  //initialisation du disponible
  Disponible = estimeNetEncaisse ;

  //on retire les frais généraux incompressibles du disponib le
  //let fraisGenerauxMonthCumuleToEndOf = utils_parseInt(getFraisGenerauxMonthCumuleToEndOf(month));
  //Disponible -= fraisGenerauxMonthCumuleToEndOf;

  let fraisGenerauxMonth = utils_parseInt(getFraisGenerauxMonth(month));
  Disponible -= fraisGenerauxMonth;

  if ( Disponible > 0 )
  {
    //On retire les frais de remboursements inscrits dans le mois
    let fraisRemboursements = utils_parseInt(getFraisRemboursementsMois(month));
    Disponible -= fraisRemboursements;

    if ( Disponible > 0 )
    {
      //On retire les frais de livraison supplémentaires inscrits dans le mois
      let fraisLivraisonSupp = utils_parseInt(getFraisLivraisonSuppAjoutesMois(month));
      Disponible -= fraisLivraisonSupp;

      if (Disponible > 0)
      {
        //On retire les frais de rachat supplémentaires inscrits dans le mois
        let fraisRachatSupp = utils_parseInt(getFraisRachatSuppAjoutesMois(month));
        Disponible -= fraisRachatSupp;

        if ( Disponible > 0 )
        {  
          //On évalue les salaires, les bonus et un éventuel reste à mettre en trésorerie       
          if ( Disponible <= totalSalairesPrevus )
          {
              //A-t-on de la trésorerie à investir dans les salaires?
              //ObjectifTresorAnnuel
              let tresoTotal = getAdminTesorize(month);
              let tresoUtilisable = 0.2 * tresoTotal; //il faudra mettre un paramétrage pour ce 0.2 arbitraire
              let tresoUtilisee = Math.min(tresoUtilisable,totalSalairesPrevus-Disponible);
              
              let refrenceSalaires= Disponible + tresoUtilisee;
              

              //Dans ce cas on distri
              let fraction4Collab = salairePrevu1/totalSalairesPrevus;
              salaireFinal1 = fraction4Collab*refrenceSalaires;

              fraction4Collab = salairePrevu2/totalSalairesPrevus;
              salaireFinal2 = fraction4Collab*refrenceSalaires;

              fraction4Collab = salairePrevu3/totalSalairesPrevus;
              salaireFinal3  = fraction4Collab*refrenceSalaires;

              Disponible -= (salaireFinal1+salaireFinal2+salaireFinal3);
                
              //A ce stade le disponible est tombé à zéro
              //Pas de bonus et pas de tésorisation
              listErrors.push("Les salaires ont été revus à la baisse");
          }
          else
          {
            //Si l'on arrive à ce point, nécessairement les salaires sont couverts par le disponible
            salaireFinal1 = salairePrevu1;
            salaireFinal2 = salairePrevu2;
            salaireFinal3 = salairePrevu3;
            let totalSalairesFinaux = salaireFinal1+salaireFinal2+salaireFinal3;

            //Le dispo est alors le dispo pour d'éventuels bonus
            Disponible -= totalSalairesFinaux;

            if ( Disponible > 0 ) // le Disponible est nécessairement positif mais pour la clarté de lecture on le test tout de même
            {
              //S'il reste du disponible on calcul les bonus
              //==============================================
              //A priori on calcul sur le disponible
              bonus1 = utils_parseInt(getCollabBonusPercent(collab01BonusPercent)*Disponible);
              bonus2 = utils_parseInt(getCollabBonusPercent(collab02BonusPercent)*Disponible);
              bonus3 = utils_parseInt(getCollabBonusPercent(collab03BonusPercent)*Disponible);

              //On cap les bonus i.e on vérifie que la somme des bonus
              // Ne dépasse pas le pourcentage paramétré de l'enveloppe salariale
              // totale
              //===================================================================
              let capBonusPercent = getCapBonusPourcentSalaire()/100;
              let maxBonus = capBonusPercent*(salaireFinal1+salaireFinal2+salaireFinal3);
              //==============================================

              //Premier cap sur bonus
              if (Disponible > maxBonus )
              {
                  //Dans ce cas la somme des bonus dépasse le seuil du bonus maximum autorisé, on ramène
                  //donc ces bonus au maximum autorisé
                  let ratio = maxBonus/Disponible;
                  bonus1 *= ratio;
                  bonus2 *= ratio;
                  bonus3 *= ratio;
                  Disponible -= maxBonus;
              }
              else
                Disponible = 0; // il a été complètement utilisé pour les bonus
            }
          }
        }
        else
        {
          listErrors.push("Le disponible ne couvre les frais de rachat supplémentaires");
        }
      }
      else
      {
        let fraisRachatSupp = utils_parseInt(getFraisRachatSuppAjoutesMois(month));
        Disponible -= fraisRachatSupp;
        listErrors.push("Le disponible ne couvre les frais de livraison supplémentaires");  
      }
    }
    else
    {
      let fraisLivraisonSupp = utils_parseInt(getFraisLivraisonSuppAjoutesMois(month));
      Disponible -= fraisLivraisonSupp;

      let fraisRachatSupp = utils_parseInt(getFraisRachatSuppAjoutesMois(month));
      Disponible -= fraisRachatSupp;

      listErrors.push("Le disponible ne couvre les frais de remboursements");
    }
  }
  else
  {
    let fraisRemboursements = utils_parseInt(getFraisRemboursementsMois(month));
    Disponible -= fraisRemboursements;

    let fraisLivraisonSupp = utils_parseInt(getFraisLivraisonSuppAjoutesMois(month));
    Disponible -= fraisLivraisonSupp;

    let fraisRachatSupp = utils_parseInt(getFraisRachatSuppAjoutesMois(month));
    Disponible -= fraisRachatSupp;

    listErrors.push("Le net encaissé estimé ne couvre pas les frais généraux");
  }

  
  //if ( useThisNetEncaisse  < 0 )
  {
    /*============================================================*/
    // === A-t-on besoin de couvrir des frais prévisionnels par la trésorerie? ====
    let totalAchatsPrevisionels      
      = utils_parseInt(getAdminTotalFraisAchatProvisionnels()); // Le total des achats prévisionnels 

    setAdminTresorerieTotalEffective(-totalAchatsPrevisionels);

    setAdminTesorize(month, Disponible);

    //Update les cellules dans admin
    setAdminSalaireCollab(1,month,salaireFinal1);
    setAdminBonusCollab(1,month,bonus1);

    setAdminSalaireCollab(2,month,salaireFinal2);
    setAdminBonusCollab(2,month,bonus2);

    setAdminSalaireCollab(3,month,salaireFinal3);
    setAdminBonusCollab(3,month,bonus3);

    if ( useThisNetEncaisse  < 0  )
      setAdminEstimeNetEncaisse(month,estimeNetEncaisse)
  }

/*
  if ( listErrors.length > 0 )
  {
    let htmlMsg = "<div>";
    for(let i=0; i< listErrors.length; i++)
      htmlMsg += listErrors[i] + "<br>";
    htmlMsg += "</div>";

    showWarningWindow("Compte rendu d'exécution",htmlMsg);
  }
*/

  //Return the computed values
  let ret = [[salaireFinal1,bonus1],[salaireFinal2,bonus2],[salaireFinal3,bonus3],[Disponible,0]];
  return ret;
}







function specificMonthforecastSalaries(month)
{
  let ret = forecastSalariesForMonth(month,-1) ;

  let html = getTableBaseCss()+
        "<h3> Salaires & Bonus pour le mois de " + SHEET_MONTH_NAMES[month] + "&nbsp;" + getDashboardYear() + "</h3><br>"+
        "<table id='soukTable'>"+
        "<tr><th>Collaborateur</th><th>Salaire&nbsp;&euro;</th><th>Bonus&nbsp;&euro;</th></tr>"+
        "<tr><td>"+getCollabFullName(collab01FullName) + "</td><td>" + parseInt(ret[0][0]) + "</td><td>"+ parseInt(ret[0][1]) + "</td></tr>"+
        "<tr><td>"+getCollabFullName(collab02FullName) + "</td><td>" + parseInt(ret[1][0])+ "</td><td>"+ parseInt(ret[1][1]) + "</td></tr>"+
        "<tr><td>"+getCollabFullName(collab03FullName) + "</td><td>" + parseInt(ret[2][0]) + "</td><td>"+ parseInt(ret[2][1]) + "</td></tr>"+
        "</table>"+
        "<br> Montant total en trésorerie : &nbsp; " + parseInt(ret[3][0]) + "&euro;"+
        "<br><h4>Attention, ce calcul prend pour hypothèse que la moyenne journalière actuelle&nbsp;de " + 
        utils_parseInt(utils_GetCellValue(ADMIN_SHEET,cellAdminMoyenneReelle))  + "&euro;&nbsp;sur le net encaissé est à minima maintenue"+
        "</body></html>";

  //Logger.log(html);
  let adminMoyennNetEncaiise = utils_parseInt(utils_GetCellValue(ADMIN_SHEET,cellAdminMoyenneReelle));

   let page = HtmlService.createHtmlOutput(html)
    .setTitle("Salaires " + SHEET_MONTH_NAMES[month])    
    .setWidth(500)
    .setHeight(200);

    var ui = SpreadsheetApp.getUi();
    ui.showSidebar(page);
} 




