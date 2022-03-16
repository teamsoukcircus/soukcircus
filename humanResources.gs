/**
 *              function hr_getSalaires(mois)
 */
function hr_getSalaires(mois)
{
    let sheetMois = utils_getSheet(SHEET_MONTH_NAMES[mois]).getDataRange().getValues();

    let salaireCelineMois     = utils_parseFloat(sheetMois[23][2]).toFixed(0);
    let salaireSimonMois      = utils_parseFloat(sheetMois[24][2]).toFixed(0);
    let salaireSaidMois       = utils_parseFloat(sheetMois[25][2]).toFixed(0);

    return [salaireCelineMois,salaireSimonMois,salaireSaidMois];
}


/**
 *            function hr_getAllDataForCurrentYear()
 */
function hr_getAllDataForCurrentYear()
{
    let lastMonth = utils_getCurrentMonth();
    let allMois = new Array(lastMonth+1);

    for (let mois=0;mois <= lastMonth;mois++)
    {
      allMois[mois] = {};
    }

    for (let mois=0;mois <= lastMonth;mois++)
    {
      let nomMois = SHEET_MONTH_NAMES[mois];
      allMois[mois]["mois"] = nomMois;
      allMois[mois]["salaires"] = hr_getSalaires(mois);
    }
    
    let retVal={}
    retVal["err"] = "ok";
    retVal["chiffres"]   = allMois;

    return retVal;
}



/**
 *                  hr_updatePayedPrevisionalSalary(month)
 */
function hr_updatePayedPrevisionalSalary(month)
{
  
}

/**
 *                                hr_addNewWorker()
 */
function hr_addNewWorker()
{

}


/**
 *                               hr_removeWorker(workerId)
 */
function hr_removeWorker(workerId)
{

}