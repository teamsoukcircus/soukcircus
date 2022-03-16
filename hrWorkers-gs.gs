

function hrWorkers_createRow(rowData) 
{
  let retVal={};
  try
  {
    let access      = tbl_tableAccess(TABLES_DEFINITIONS.SoukHR_Workers,TABLE_ACCESS_TYPE.SINGLE);
    let newRow = [];
    newRow.push(utils_uniqueID());
    newRow.push(new Date());
    for(let i=2;i<rowData.length;i++ )
      newRow.push(rowData[i]);

    access.appendRow(newRow);
    
    retVal["err"]="ok";
  }
  catch(err)
  {
    retVal["err"]="nok"
    retVal["msg"]=err.message;
  }
  return retVal;
}


function hrWorkers_updateRow(rowData) 
{
  let retVal={};
  try
  {
    let access      = tbl_tableAccess(TABLES_DEFINITIONS.SoukHR_Workers,TABLE_ACCESS_TYPE.SINGLE);
    access.updateRow(rowData);
    retVal["err"]="ok";
  }
  catch(err)
  {
    retVal["err"]="nok"
    retVal["msg"]=err.message;
  }
  return retVal;
}


function hrWorkers_deleteRow(rowId) 
{
  let retVal={};
  try
  {
    let access      = tbl_tableAccess(TABLES_DEFINITIONS.SoukGeneric_Table1,TABLE_ACCESS_TYPE.SINGLE);
    access.deleteRow(rowId);
    retVal["err"]="ok";
  }
  catch(err)
  {
    retVal["err"]="nok"
    retVal["msg"]=err.message;
  }
  return retVal;
}


function test_hrWorkersread()
{
  Logger.log(hrWorkers_readRow(1));
}

function hrWorkers_readRow(rowId) 
{
  let retVal={};
  try
  {
    let access      = tbl_tableAccess(TABLES_DEFINITIONS.SoukHR_Workers,TABLE_ACCESS_TYPE.SINGLE);
    let data = access.getRow(rowId);
    retVal["err"]="ok";
    retVal["data"] = data["data"];
    retVal["header"] = access.getHeader();
    let accessSettings   = tbl_tableAccess(TABLES_DEFINITIONS.SoukHR_Settings,TABLE_ACCESS_TYPE.SINGLE);  
    retVal["Status"]     = accessSettings.getColumn(TABLES_DEFINITIONS.SoukHR_Settings.Fields.WStatuses)
  }
  catch(err)
  {
    retVal["err"]="nok";
    retVal["msg"]=err.message;
  }

  return JSON.stringify(retVal);
}


function hrWorkers_readRecords()
{
  let retVal={};
  try
  {
    let access      = tbl_tableAccess(TABLES_DEFINITIONS.SoukHR_Workers,TABLE_ACCESS_TYPE.REPEATED);
    
    let row = access.getFirstRow();
    if (row != null)
    {
        let allRecords=[];
        do
        {
          let linkView = "<a href='" + utils_getUrl() + 
          "?&actionId=actionWorkers&workerId=" + access.getRowId(row) + "' target='_top'><i class='fa fa-pencil' aria-hidden='true'></i></a>";

          let aRecord = [];
          aRecord = aRecord.concat(row["data"]);
          aRecord.push(linkView);
          allRecords.push(aRecord);

          row = access.getNextRow(row["row"]);
        }
        while(row!=null)

        retVal["err"]="ok";
        retVal["data"] = allRecords;
        retVal["header"] = access.getHeader();
        retVal["display"] = access.getDisplay();

        let accessSettings   = tbl_tableAccess(TABLES_DEFINITIONS.SoukHR_Settings,TABLE_ACCESS_TYPE.SINGLE);  
        retVal["Status"]     = accessSettings.getColumn(TABLES_DEFINITIONS.SoukHR_Settings.Fields.WStatuses)
    }
    else
    {
      retVal["err"]="ok";
      retVal["data"]=[];
      retVal["header"] = [];
    }
  }
  catch(err)
  {
      retVal["err"]="nok";
      retVal["msg"]=err.message;
  }
  return JSON.stringify(retVal);
}

function hrWorkersTest()
{
  Logger.log(hrWorkers_readRecords());
}


/**
 * 
 *   function hrWorkers_newRowRequest
 */
function hrWorkers_newRowRequest()
{
    let retVal={};

    retVal["err"]="ok";
    retVal["header"] = access.getHeader();

    let accessSettings   = tbl_tableAccess(TABLES_DEFINITIONS.SoukHR_Settings,TABLE_ACCESS_TYPE.SINGLE);  
    retVal["Status"]     = accessSettings.getColumn(TABLES_DEFINITIONS.SoukHR_Settings.Fields.WStatuses);

    return JSON.strtingify(retVal);
}


/*================================================ SALAIRES ====================================================*/
const SALARY_FOLDER_ID  = "1rExlW44XvEkrhi71w3UKizvJ6uRsZ3mB";
const SALARYTEMPLATE_ID = "1TrEV1xXwssdmP6RT18biAA_ol7brGJiqtivTqSA1h_c";
const SALARY_SHEET      = "Salary";


/**
 * 
 * 
 */

function hrWorkers_makeCopy(file, dstFolderId) 
{
  var dstFolder = DriveApp.getFolderById(dstFolderId);

  let f = file.makeCopy(dstFolder);
  if (file.getMimeType() == MimeType.GOOGLE_APPS_SCRIPT) 
  {
    Drive.Files.update({"parents": [{"id": dstFolderId}]}, f.getId());
  }
  return f;
}


/**
 *          function cloneGoogleSheet()
 */
function hrWorkers_cloneSalaryTemplateGoogleSheet(destFolderName,destFileName) 
{
  let rootFolder = DriveApp.getFolderById(SALARY_FOLDER_ID); 
  let destFolder = rootFolder.getFoldersByName(destFolderName).next();

  let file = DriveApp.getFileById(SALARYTEMPLATE_ID);
  let f = hrWorkers_makeCopy(file, destFolder.getId()); 
  f.setName(destFileName);
  return f;
}

/**
 *    function hrWorkers_SalaryBills()
 */

function test_hrWorkers_SalaryBills()
{
  let dataOut={};
      dataOut["mois"] = mois-1;
      dataOut["type"] = type; 
  hrWorkers_SalaryBills(dataOut);
}

const SALARY_CELLS =
{
  NOM_PRENOM: [3,7],
  ADRESSE:[4,7],
  EMPLOI:[5,7],
  SALAIRE_BRUT: [6,7],
  BONUS:[7,7],
  CCY: [8,7]
}

/**
 *   helper:  function hrWorker_printSalaryBill(aWorker,month,salary,bonus)
 */
function hrWorker_printSalaryBill(aWorker,month,salary,bonus)
{
  let folderName = aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.FirstName-1] + aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.LastName-1];
  let fileName   = "Salaire" + SHEET_MONTH_NAMES_LONG[month]+ utils_getCurrentYear();

  let file = hrWorkers_cloneSalaryTemplateGoogleSheet(folderName,fileName); 
  let sheet = utils_getTable(file.getId(),SALARY_SHEET);

  sheet.getRange(SALARY_CELLS.NOM_PRENOM[0],SALARY_CELLS.NOM_PRENOM[1],1,1).setValue(aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.FirstName-1] + " " +
  aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.LastName-1]);

  sheet.getRange(SALARY_CELLS.ADRESSE[0],SALARY_CELLS.ADRESSE[1],1,1).setValue(aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.Adresse-1]);

  sheet.getRange(SALARY_CELLS.EMPLOI[0],SALARY_CELLS.EMPLOI[1],1,1).setValue(aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.Emploi-1]);

  sheet.getRange(SALARY_CELLS.SALAIRE_BRUT[0],SALARY_CELLS.SALAIRE_BRUT[1],1,1).setValue(salary);

  sheet.getRange(SALARY_CELLS.BONUS[0],SALARY_CELLS.BONUS[1],1,1).setValue(bonus);

  sheet.getRange(SALARY_CELLS.CCY[0],SALARY_CELLS.CCY[1],1,1).setValue(aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.Ccy-1]);
}


function test_SalaryBills()
{
  let dataOut={};
  dataOut["mois"] = 2;
  dataOut["type"] = 0;

  hrWorkers_SalaryBills(dataOut)
}

function hrWorkers_SalaryBills(dataIn)
{
  let retVal={};
  try
  {
    let month = dataIn["mois"];

    if ( dataIn["type"]==1)
    {
        let access      = tbl_tableAccess(TABLES_DEFINITIONS.SoukHR_Workers,TABLE_ACCESS_TYPE.REPEATED);
        let retData = JSON.parse(hrWorkers_forecastSalariesForMonth(month)) ;
        if (retData["err"]=="ok")
        {
          let salaries = retData["data"];
          for (let wi=0;wi<salaries.length;wi++)
          {
            let row = access.getRow(salaries[wi][3]) ;
            if (row != null)
            {
              let aWorker = row["data"];

              hrWorker_printSalaryBill(aWorker,month,utils_parseInt(salaries[wi][1]),utils_parseInt(salaries[wi][2]));   

              fin_addSalaireMouvment(aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.SalaryAccountId-1],
                                     utils_parseInt(salaries[wi][1])+utils_parseInt(salaries[wi][2]),
                                     aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.Ccy-1],month)   
            }
          }
        }
        else
        {
          retVal["err"] = "nok";
          retVal["msg"] = retData["msg"];
        }
    }
    else
    {
      let workersData = JSON.parse(hrWorkers_readRecords());
      let workersRecords = workersData["data"];

      for(let wi=0;wi<workersRecords.length;wi++)
      {
        let aWorker = workersRecords[wi];

        let salary = utils_parseInt(aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.AnnualSalary-1]/12);
        let bonus=0;
        hrWorker_printSalaryBill(aWorker,month,salary,bonus);

        fin_addSalaireMouvment(aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.SalaryAccountId-1],salary+bonus,
                                            aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.Ccy-1],month);
      }
    }
    retVal["err"]="ok";
  }
  catch(err)
  {
    retVal["err"]="nok";
    retVal["msg"] = err.message;
  }

  return retVal;
}


/**
 * 
 * function hrWorkers_SalarySingleBills(dataSalarie)
 */
function test_SalarySingleBills(dataSalarie)
{
      let dataOut={};
      dataOut["mois"] = 2;
      dataOut["salarieId"] = 1;
      dataOut["salaire"] = 1000;
      dataOut["bonus"] = 200;
      dataOut["ccy"] = "EUR";

      hrWorkers_SalarySingleBills(dataOut)
}
function hrWorkers_SalarySingleBills(dataSalarie)
{
  let retVal={};
  try
  {
    let access      = tbl_tableAccess(TABLES_DEFINITIONS.SoukHR_Workers,TABLE_ACCESS_TYPE.REPEATED);
    
    let row = access.getRow(dataSalarie["salarieId"]) ;
    if (row != null)
    {
      let aWorker = row["data"];
      let month   = dataSalarie["mois"];

      hrWorker_printSalaryBill(aWorker,month,utils_parseInt(dataSalarie["salaire"]),utils_parseInt(dataSalarie["bonus"]));

      fin_addSalaireMouvment(aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.SalaryAccountId-1],
                                    utils_parseInt(dataSalarie["salaire"])+utils_parseInt(dataSalarie["bonus"]),
                                    dataSalarie["ccy"],month);
      retVal["err"]="ok";
    }
    else
    {
      retVal["err"]="nok";
      retVal["msg"] = "Salarié non identifiable...";
    }
  }
  catch(err)
  {
      retVal["err"]="nok";
      retVal["msg"]=err.message;
  }
  return JSON.stringify(retVal);
}
 

/**
 * 
 * 
 */
function hrWorkers_forecastSalariesForMonth(month) 
{
  let retVal={};
  try
  {
    let forecasts = forecastSalariesForMonth(month,-1,false);

    let workersData = JSON.parse(hrWorkers_readRecords());
    let workersRecords = workersData["data"];
    let retData = [];

    for(let wi=0;wi<workersRecords.length;wi++)
    {
      let aWorker = workersRecords[wi];
      let NomPrenom = aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.FirstName-1] + " " + aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.LastName-1];
      retData.push([NomPrenom,forecasts[wi][0],forecasts[wi][1],aWorker[TABLES_DEFINITIONS.SoukHR_Workers.Fields.WorkerID-1] ])
    }
    retVal["err"]   = "ok";
    retVal["data"]  = retData;
  }
  catch(err)
  {
      retVal["err"]="nok";
      retVal["msg"] = err.message;
  }

  return JSON.stringify(retVal)

}


/**
 * 
 * Méthiode avec Salaire Said fixe
 */

function test_forecastSalariesForMonth() 
{
  forecastSalariesForMonth(1,useThisNetEncaisse=-1, manual = true)
}

function forecastSalariesForMonth(month,useThisNetEncaisse=-1, manual = false) 
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
  
  //Estimation du. net encaissé en fin de mois
  if ( useThisNetEncaisse  >= 0  )
    estimeNetEncaisse = useThisNetEncaisse; 
  else
    estimeNetEncaisse = computeNetEncaisseEstime(month);

  //initialisation du disponible
  Disponible = estimeNetEncaisse ;

//==========================================================================
  //Les salaires prévus
  salairePrevu1 = getCollabSalaireAnnuel(collab01SalaireAnnuel)/12;
  salairePrevu2 = getCollabSalaireAnnuel(collab02SalaireAnnuel)/12;

  totalSalairesPrevus = salairePrevu1+salairePrevu2;


  salairePrevu3 = getCollabSalaireAnnuel(collab03SalaireAnnuel)/12; 
  //On retire le salaire de Said
  salaireFinal3 = salairePrevu3;
  Disponible -= salairePrevu3; //Salaire fixe = comme un faris fixe incontournable

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
              salaireFinal2 = fraction4Collab*refrenceSalaires

              Disponible -= (salaireFinal1+salaireFinal2);
                
              //A ce stade le disponible est tombé à zéro
              //Pas de bonus et pas de tésorisation
              listErrors.push("Les salaires ont été revus à la baisse");
          }
          else
          {
            //Si l'on arrive à ce point, nécessairement les salaires sont couverts par le disponible
            salaireFinal1 = salairePrevu1;
            salaireFinal2 = salairePrevu2;
            let totalSalairesFinaux = salaireFinal1+salaireFinal2;

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

  //Return the computed values
  let ret = [[utils_parseFloat(salaireFinal1).toFixed(2),utils_parseFloat(bonus1).toFixed(2)],
             [utils_parseFloat(salaireFinal2).toFixed(2),utils_parseFloat(bonus2).toFixed(2)],
             [utils_parseFloat(salaireFinal3).toFixed(2),utils_parseFloat(bonus3).toFixed(2)],
             [utils_parseFloat(Disponible).toFixed(2),0]];
  return ret;
}



/*================================================ SALAIRES ====================================================*/
