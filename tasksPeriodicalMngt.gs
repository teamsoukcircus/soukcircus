/**
 * Reorganise les tâches en reportnt celles. non terminées qui ont dépassé la date de fn au pire
 * Est appelé depuis le trigger qui demande aux workers de mettre leur avancement à jour
 */
function tasks_Reorganize(useThisTasks=null) 
{
  var values=null;

  if ( useThisTasks == null )
    values   = utils_getSheet(TASKS_SHEET).getDataRange().getValues();
  else
    values = useThisTasks;
    
  let today = new Date();

  for (let i=1;i< values.length;i++) // 1 for skipping header
  {
    let status      = values[i][COLUMNS.Status];
    let task=values[i];

    if ( status != STATUS.FINISHED )
    {
      let dFinEsperee = task[COLUMNS.FinEspere];
      let dFinPire    = task[COLUMNS.FinPire];
      let dCreated    = task[COLUMNS.Creation];
      let initialExpectedDuration = dFinEsperee-dCreated;
      let percent     = task[COLUMNS.Percent];
      
      if ( today > dFinPire)
      {
          //La fin au pire est dépassée et la tâche n'est pas terminée
          //On la reporte 
          task[COLUMNS.ReportCount] = utils_parseInt(values[i][COLUMNS.ReportCount]) + 1;
          task[COLUMNS.ReportReason] = T_ALERT_REPORT;
          //On met la fin espérée en proprtion de l'avancement actuel
          task[COLUMNS.FinEspere] = dFinPire + (1-percent/100)*initialExpectedDuration;
          task[COLUMNS.FinPire]   = values[i][COLUMNS.FinEspere] +  (1-percent/100)*initialExpectedDuration;

          //Mettre la tâche à jour
          utils_getSheet(TASKS_SHEET).getRange(i+1,1,1,task.length).setValues([task]);
      }
    }
  } 
}

/**
 * 
 * Trasnfère les tâches terminées dans la feuille de backup des tâches
 * Est appelé depuis le trigger qui demande aux workers de mettre leur avancement à jour
 */
function tasks_Cleanup() 
{
  let range   = Sheets.Spreadsheets.Values.get(prop_getSpreadSheetId(),DataTasksTableRange); 
  let tasksSheet = utils_getSheet(TASKS_SHEET);
  let backup = utils_getSheet(TASKS_BACKUP);
  let tasksToDelete = [];

  let values = range.values;
  let today = new Date();

  for (let i=0;i< values.length;i++)
  {
    let status      = values[i][COLUMNS.Status];
    if ( status == STATUS.FINISHED || status == STATUS.ABANDONNED )
    {
      backup.appendRow(values[i]) ;

      tasksToDelete.push(i+1) ; //+1 to skip heade
    }
  } 

  for(let i=0;i<tasksToDelete.length;i++)
    tasksSheet.deleteRow(tasksToDelete[i]);  
}
