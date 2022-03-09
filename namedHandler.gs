/**
 * 1 based months
 */
function getNetEncaiss(month) 
{
  return utils_getNamedCellValueRowColOffet(ADMIN_SHEET,cellAdminNetEncaisseJanvier,0,month);
}

function getNetEncaissCumuleToEndOf(month) 
{
  let sum = 0;
  for(let i=0;i<=month;i++)
    sum += utils_getNamedCellValueRowColOffet(ADMIN_SHEET,cellAdminNetEncaisseJanvier,0,i);
  return sum;
}




function getFraisGenerauxMonth(month)
{
  return utils_getNamedCellValueRowColOffet(ADMIN_SHEET,cellAdminfraisGenerauxJanvier,0,month);
}

function getFraisGenerauxMonthCumuleToEndOf(month) 
{
  let sum = 0;
  for(let i=0;i<=month;i++)
    sum += utils_getNamedCellValueRowColOffet(ADMIN_SHEET,cellAdminfraisGenerauxJanvier,0,i);
  return sum;
}


function getAdminMoyenneReelle()
{
  return utils_getNamedCellValueInSheet(ADMIN_SHEET,cellAdminMoyenneReelle);
}

function getAdminMoyenneReelleToEndOf(month) 
{
  let netEncaisseCumule = getNetEncaissCumuleToEndOf(month);
  let nDays=0;
  let year = getDashboardYear();

  for(let i=0;i<=month;i++)
    nDays += utils_getDaysInMonth(i,year)

  return netEncaisseCumule/nDays;
}

function getAdminJoursRestantsDansMoisCourant()
{
  return utils_getNamedCellValueInSheet(ADMIN_SHEET,cellAdminJoursRestantsMois);
}


function getAdminJourDuMois()
{
  return utils_getNamedCellValueInSheet(ADMIN_SHEET,cellAdminJourDuMois);
}


function getAdminMoisCourant()
{
  return utils_getNamedCellValueInSheet(ADMIN_SHEET,cellAdminMoisCourant);
}

function getAdminTotalFix()
{
  return utils_getNamedCellValueInSheet(ADMIN_SHEET,cellAdminTotalFix);
}

/**
 * 
 */
function getObjectifBonusAnnuel()
{
  getAdminTotalFix();
}

function getAdminTotalFraisAchatProvisionnels()
{
    return utils_getNamedCellValueInSheet(ADMIN_SHEET,cellAdminTotalFraisAchatProvisionnels);
}

function getAdminTresorerieTotalEffective()
{
  return utils_getNamedCellValueInSheet(ADMIN_SHEET,cellAdminTresorerieTotalEffective);
}

function setAdminTresorerieTotalEffective(value)
{
  utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminTresorerieTotalEffective,value); 
}



function getAdminDashboardMonth()
{
  return utils_getCurrentMonth();
  //utils_getNamedCellValueInSheet(ADMIN_SHEET,cellAdminDashboardMonth);
}

function setAdminDashboardMonth(value)
{
  utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminDashboardMonth,value); 
}

function getAdminSalaireCollab01Janvier() 
{
  return utils_getNamedCellValueInSheet(ADMIN_SHEET,cellAdminSalaireCollab01Janvier); 
}

function setAdminSalaireCollab01Janvier(value) 
{
  utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminSalaireCollab01Janvier,value); 
}

function getAdminSalaireCollab02Janvier() 
{
  return utils_getNamedCellValueInSheet(ADMIN_SHEET,cellAdminSalaireCollab02Janvier); 
}

function setAdminSalaireCollab02Janvier(value) 
{
  utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminSalaireCollab02Janvier,value); 
}

function getAdminSalaireCollab03Janvier() 
{
  return utils_getNamedCellValueInSheet(ADMIN_SHEET,cellAdminSalaireCollab03Janvier); 
}

function setAdminSalaireCollab03Janvier(value) 
{
  utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminSalaireCollab03Janvier,value); 
}

/**
 * collabNumber = 1,2,3
 * month = 0,1,2,....,11
*/
function getAdminSalaireCollab(collabNumber,month)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,collabNumber==1?cellAdminSalaireCollab01Janvier : 
                                             collabNumber==2?cellAdminSalaireCollab02Janvier: 
                                             cellAdminSalaireCollab03Janvier);

  let rSalRow = rJanvier.getRow();
  let rSalCol = rJanvier.getColumn() + month;

  return utils_GetCellByCoordValue(ADMIN_SHEET,rSalRow,rSalCol);
}

 // month = 0,1,2,....,11
function setAdminSalaireCollab(collabNumber,month,value)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,collabNumber==1?cellAdminSalaireCollab01Janvier : 
                                             collabNumber==2?cellAdminSalaireCollab02Janvier: 
                                             cellAdminSalaireCollab03Janvier);

  let rSalRow = rJanvier.getRow();
  let rSalCol = rJanvier.getColumn() + month;

  return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,rSalRow,rSalCol,value);
}

 // month = 0,1,2,....,11
function getAdminBonusCollab(collabNumber,month)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,collabNumber==1?cellAdminSalaireCollab01Janvier : 
                                             collabNumber==2?cellAdminSalaireCollab02Janvier: 
                                             cellAdminSalaireCollab03Janvier);

  let rBonRow = rJanvier.getRow()+1;
  let rBonCol = rJanvier.getColumn() + month;

  return utils_GetCellByCoordValue(ADMIN_SHEET,rBonRow,rBonCol);
}


 // month = 0,1,2,....,11
function setAdminBonusCollab(collabNumber,month,value)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,collabNumber==1?cellAdminSalaireCollab01Janvier : 
                                             collabNumber==2?cellAdminSalaireCollab02Janvier: 
                                             cellAdminSalaireCollab03Janvier);

  let rBonRow = rJanvier.getRow()+1;
  let rBonCol = rJanvier.getColumn() + month;

  return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,rBonRow,rBonCol,value);
}

 // month = 0,1,2,....,11
function getCellAdminBonusTotal(month)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellAdminBonusTotalanvier);

  let rBonRow = rJanvier.getRow();
  let rBonCol = rJanvier.getColumn() + month;

  return utils_GetCellByCoordValue(ADMIN_SHEET,rBonRow,rBonCol); 
}

 // month = 0,1,2,....,11
function setCellAdminBonusTotal(month,value)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellAdminBonusTotalanvier);

  let rBonRow = rJanvier.getRow();
  let rBonCol = rJanvier.getColumn() + month;

  return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,rBonRow,rBonCol,value);
}

function getAdminEstimeNetEncaisseJanvier()
{
  return utils_getNamedCellValueInSheet(ADMIN_SHEET,cellAdminEstimeNetEncaisseJanvier); 
}

function setAdminEstimeNetEncaisseJanvier(value)
{
    utils_SetCellValueInSheet(ADMIN_SHEET,cellAdminEstimeNetEncaisseJanvier,value); 
}

function setAdminEstimeNetEncaisse(month, value)
{
    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellAdminEstimeNetEncaisseJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

  return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,estimeRow,estimeCol,value);
}

function getAdminEstimeNetEncaisse(month)
{
    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellAdminEstimeNetEncaisseJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

  return utils_GetCellByCoordValue(ADMIN_SHEET,estimeRow,estimeCol);
}

//Cette fonction cumule les trésorerie
function setAdminTesorize(month, value)
{
    let cumul=0;
    if ( month > 0 )
      cumul = getAdminTesorize(month-1);

    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellAdminTresorJanvier); 
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

  return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,estimeRow,estimeCol,value+cumul);
}

function getAdminTesorize(month)
{
    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellAdminTresorJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

  return utils_GetCellByCoordValue(ADMIN_SHEET,estimeRow,estimeCol);
}

/**
 * 
 * 
 */
function getLoyerMois(month)
{
    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellLoyerJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

    return utils_GetCellByCoordValue(ADMIN_SHEET,estimeRow,estimeCol);
}

function setLoyerMois(month,value)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellLoyerJanvier); 
  let estimeRow = rJanvier.getRow();
  let estimeCol = rJanvier.getColumn() + month;

  return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,estimeRow,estimeCol,value);
}

/**
 * 
 * 
 */
function getUrsafMois(month)
{
    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellUrsafJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

    return utils_GetCellByCoordValue(ADMIN_SHEET,estimeRow,estimeCol);
}

function setUrsafMois(month,value)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellUrsafJanvier); 
  let estimeRow = rJanvier.getRow();
  let estimeCol = rJanvier.getColumn() + month;

  return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,estimeRow,estimeCol,value);
}

/**
 * 
 * 
 */
function getElectriciteMois(month)
{
    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellElecticiteJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

    return utils_GetCellByCoordValue(ADMIN_SHEET,estimeRow,estimeCol);
}

function setElectriciteMois(month,value)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellElecticiteJanvier); 
  let estimeRow = rJanvier.getRow();
  let estimeCol = rJanvier.getColumn() + month;

  return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,estimeRow,estimeCol,value);
}

function getEauMois(month)
{
    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellEauJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

    return utils_GetCellByCoordValue(ADMIN_SHEET,estimeRow,estimeCol);
}

function setEauMois(month,value)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellEauJanvier); 
  let estimeRow = rJanvier.getRow();
  let estimeCol = rJanvier.getColumn() + month;

  return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,estimeRow,estimeCol,value);
}

function getEauMois(month)
{
    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellEauJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

    return utils_GetCellByCoordValue(ADMIN_SHEET,estimeRow,estimeCol);
}

function setTransportsMois(month,value)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellTransportJanvier); 
  let estimeRow = rJanvier.getRow();
  let estimeCol = rJanvier.getColumn() + month;

  return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,estimeRow,estimeCol,value);
}

function addTransportMois(month,value)
{
    let actual = getTransportsMois(month);

    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellTransportJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

    return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,estimeRow,estimeCol,actual+value);
}

function getTransportsMois(month)
{
    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellTransportJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

    return utils_GetCellByCoordValue(ADMIN_SHEET,estimeRow,estimeCol);
}

function setNettoyageMois(month,value)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellNettoyageJanvier); 
  let estimeRow = rJanvier.getRow();
  let estimeCol = rJanvier.getColumn() + month;

  return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,estimeRow,estimeCol,value);
}

function getNettoyageMois(month)
{
    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellNettoyageJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

    return utils_GetCellByCoordValue(ADMIN_SHEET,estimeRow,estimeCol);
}

function addNettoyageMois(month,value)
{
    let actual = getNettoyageMois(month);

    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellNettoyageJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

    return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,estimeRow,estimeCol,actual+value);
}





/**
 * 
 */

function setObjectifMois(month,value)
{
  let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellObjectifCAJanvier); 
  let estimeRow = rJanvier.getRow();
  let estimeCol = rJanvier.getColumn() + month;

  return utils_SetCellValueByCoordInSheet(ADMIN_SHEET,estimeRow,estimeCol,value);
}

function getObjectifMois(month)
{
    let rJanvier = utils_getNamedCellRangeInSheet(ADMIN_SHEET,cellObjectifCAJanvier);
    let estimeRow = rJanvier.getRow();
    let estimeCol = rJanvier.getColumn() + month;

    return utils_GetCellByCoordValue(ADMIN_SHEET,estimeRow,estimeCol);
}


function getAdminCollabFullName(collabId)
{
  switch(collabId)
  {
    case 1: return utils_getNamedCellValue(cellAdminCollab01FullName);
    case 2: return utils_getNamedCellValue(cellAdminCollab02FullName);
    case 3: return utils_getNamedCellValue(cellAdminCollab03FullName);
    default: return "Unknown";
  }
}

function getAdminMoyenneReelle()
{ 
  return utils_GetCellValue(ADMIN_SHEET,cellAdminMoyenneReelle);
}

function getDateDerniereMiseAJourDonneesAnnee()
{
  return utils_GetCellValue(MAIN_SHEET,cellAnnuelDateMiseAJour);
}



function getValueBeneficeNetPourMoisEnCours()
{
  return utils_getNamedCellValue(getCelluleBeneficeNetPourMoisEnCours());
  
}

