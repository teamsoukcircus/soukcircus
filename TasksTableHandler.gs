
/*
function doGet() {
  return HtmlService.createTemplateFromFile('TasksHandler').evaluate();
}
*/


//GET DATA FROM GOOGLE SHEET AND RETURN AS AN ARRAY
function getTasksTableData()
{
  var range   = Sheets.Spreadsheets.Values.get(prop_getSpreadSheetId(),DataTasksTableRange);
  //Logger.log(range.values)
  return range.values;
}
 





/*
https://drive.google.com/file/d/1BW1Q6_FtdM2Og7P-D9LTcmgq3r9uq07t/view?usp=sharing

<div class="containertd">
    <img src="https://drive.google.com/uc?export=view&id=1BW1Q6_FtdM2Og7P-D9LTcmgq3r9uq07t" alt="img">
    <img class="cornerimage" src="https://drive.google.com/uc?export=view&id=1B8oR5Zp914mmDq4cWoaOctsaxXfmCzDv" alt="">
<div>


.containertd {
  border: 0;
  float: left;
  position: relative;
} 
.cornerimage {
  border: 0;
  position: absolute;
  top: 0;
  right: 0;
 } 
*/

function task_mustStartSoon(taskValues)
{
  let startDate = new Date(taskValues[COLUMNS.Creation]);
  let today = new Date();
  let diff = utils_realNDaysBetweenTwoDates(today,startDate);
  
  return (diff > -3 && diff < 0)
}

function task_isLate(taskValues)
{
  let finEspereeDate = new Date(taskValues[COLUMNS.FinEspere]);
  let today = new Date();
  let diff = utils_realNDaysBetweenTwoDates(today,finEspereeDate);
  
  return (diff <= 0);
}

function task_HasAlerts(taskValues)
{
  return (taskValues[COLUMNS.SysAlert] != "" )
}

/*
<td>Cell 1,1</td>
      <td class="CellWithComment">Cell 1,2
        <span class="CellComment">Here is a comment</span>
      </td>
*/
function getTableEntry(values,rowNum)
{
      let html = "<tr>"+
          "<td>" + values[COLUMNS.Id]  + "</td>"+
          "<td>" + values[COLUMNS.Title]  + "</td>"+
          "<td>" + values[COLUMNS.Attrib] + "</td>"+
          "<td>" + values[COLUMNS.Urgency]+ "</td>"+
          "<td>" + values[COLUMNS.Status] + "</td>";
    
      let startSoon = task_mustStartSoon(values);
      let isLate =  task_isLate(values);
      let hasAlerts = task_HasAlerts(values);
             
      let taskCellContent="";

      if ( hasAlerts)
        taskCellContent += "<img src='https://drive.google.com/uc?export=view&id=1HyNCRDBfjhGlOsxN3xT1_Z3gIC3t1qfa'>";

      if ( isLate )
        taskCellContent += "<img src='https://drive.google.com/uc?export=view&id=1RT7z4u0gVP9zupj6opV8V-kbn0izv_0M'>";

      if ( startSoon )
        taskCellContent += "<img src='https://drive.google.com/uc?export=view&id=1HkdTz2pQNXVzmMhVMaR68S0khFxaEefU'>";

      let percentWidth=0;
      if ( values[COLUMNS.Percent] != null && values[COLUMNS.Percent]!="")
        percentWidth=values[COLUMNS.Percent]/2;

      html += "<td class='CellWithComment' style='border: 0;position: relative;top: 0px;left: 0px;width:50px; height:15px;'>" +
              "<img style='border: 0;height:15px;width:50px;position: relative;left:-30px;top:+5px'" +
              " src='https://drive.google.com/uc?export=view&id=1BW1Q6_FtdM2Og7P-D9LTcmgq3r9uq07t'>" +
              "<img style='border: 0;position: relative;top: -10px;left: -30px;width:" + percentWidth +"px; height:15px;' "+
              "src='https://drive.google.com/uc?export=view&id=1B8oR5Zp914mmDq4cWoaOctsaxXfmCzDv'>"+
              "<span class='CellComment'>" + (values[COLUMNS.Percent] + " %") + "</span></td>";


      if ( taskCellContent != "" )
      {
        if ( !hasAlerts )
        {
          if (isLate )
          {
            html += "<td class='CellWithComment' style='position:relative;'>" + 
            taskCellContent + 
            "<span class='CellComment'>" + 
            T_TASK_LATE + 
            "</span></td>";                 
          }
          else
            html += "<td align='left' valign='middle'>" + taskCellContent + "</td>";
        }
        else
        {
          html += "<td class='CellWithComment' align='left' valign='middle'>" + 
          taskCellContent + 
          "<span class='CellComment'>" + 
          task[COLUMNS.SysAlert] + 
          "</span></td>";         
        }

      }
      else
        html += "<td align='left' valign='middle'>&nbsp;</td>";
          
      html += "<td><a id='btnSubmitTask' type='button'  class='btnListTasks' href='" + utils_getUrl() + "?taskId=" + 
                                                values[COLUMNS.Id]  + "' target='_blank'><i class='fa fa-fw fa-pencil'></i></button></td>" +
          "<td><button id='btnSubmitTask' type='submit' name='action' class='btnListTasks' onclick='deleteTask(" + 
                                                values[COLUMNS.Id]  + ","+rowNum+")'><i class='fa fa-fw fa-trash'></i></button></td>" +
          "</tr>";
      return html;

}


function test_getWebTasksTableData()
{
  let x = {};
  x.assignee = 'All'
  Logger.log(getWebTasksTableData(x));
}




/**
 * 
 * 
 */
function getWebTasksTableData(theScope)
{
  /*
    var cache = CacheService.getScriptCache();

    let htmlTable = cache.get("soukTasksList");
    if (htmlTable != null) 
      return htmlTable;
  */
    let redoHtmlCache = false;
    if ( theScope.assignee == 'All' )
    {
      let cachedTable = cache_getHtml(CACHE_TASKS_HTML_KEY);
      if (cachedTable != null )
        return cachedTable;
      else
        redoHtmlCache=true;
    }

    var values   = utils_getSheet(TASKS_SHEET).getDataRange().getValues();

    let startingHtml = "<table id='soukTableTasksId' width='100%'";
    htmlTable = startingHtml;
            
    if ( values == null || values.length==1) //1 is the header
    {
      htmlTable += "<tr><td><h4>Aucunes tâches trouvées...</h4></td></tr></table>" ;
      return htmlTable;
    }

    if ( theScope.assignee == 'All')
    {
      for (let i=1;i<values.length;i++) //Start from 1 for skipping the header
      {
          let task = values[i];
          if ( task[COLUMNS.Status] != STATUS.ABANDONNED )
            htmlTable += getTableEntry(task,i-1); //tasks start at zero index
      }  
      htmlTable += "</table>";
    }
    else
    {
      let withOthers = (theScope.assignee.indexOf("&") != -1);
      let theAssigneeIn=theScope.assignee;
      if (withOthers)
        theAssigneeIn=theScope.assignee.substring(0,theScope.assignee.indexOf("&")).trim();

      for (let i=1;i<values.length;i++) //Start from 1 for skipping the header
      {
          let task = values[i];
          let assignees = task[COLUMNS.Attrib] ;
          let allAssignees = utils_splitString(assignees,",");

          if (  (!withOthers && allAssignees.length==1 && allAssignees[0]== theAssigneeIn) || 
                (withOthers && allAssignees.length > 1 && (allAssignees.indexOf(theAssigneeIn) != -1))) 
          {
            if ( values[COLUMNS.Status] != STATUS.ABANDONNED )
              htmlTable += getTableEntry(task,i-1); //tasks start at zero index
          }
      }    

      if ( htmlTable.length ==  startingHtml.length )
        htmlTable += "<tr><td><h4>Aucunes tâches trouvées...</h4></td></tr>" 

      htmlTable += "</table></td></tr></table>"; 
    }
   
    if ( redoHtmlCache )
      cache_putHtml(CACHE_TASKS_HTML_KEY,htmlTable);

    return htmlTable;
}


function getWebTasksFor(theScope)
{

    var range   = Sheets.Spreadsheets.Values.get(prop_getSpreadSheetId(),DataTasksTableRange);

    if ( theScope.assignee != 'All')
    {
      let userRange=[];
      let withOthers = (theScope.assignee.indexOf("&") != -1);
      let theAssigneeIn=theScope.assignee;
      if (withOthers)
        theAssigneeIn=theScope.assignee.substring(0,theScope.assignee.indexOf("&")).trim();

      for (let i=0;i<range.values.length;i++)
      {
          let values = range.values[i];
          let assignees = values[COLUMNS.Attrib] ;
          let allAssignees = utils_splitString(assignees,",");

          if (  (!withOthers && allAssignees.length==1 && allAssignees[0]== theAssigneeIn) || 
                (withOthers && allAssignees.length > 1 && (allAssignees.indexOf(theAssigneeIn) != -1))) 
          {
            if ( values[COLUMNS.Status] != STATUS.ABANDONNED )
              userRange.push(values)
          }
      }    

      range.values = userRange;
    }
   

    return range;
}


function test_findFullTaskInSheet(taskNo)
{
  
  let t = findFullTaskInSheet(4);

  Logger.log(t);
  Logger.log(t.taskNo);

}

function findFullTaskInSheet(taskNo)
{
  let taskRow = cache_getTaskRow(taskNo);
  if ( taskRow == null )
    return null;

  let sheet           = utils_getSheet(TASKS_SHEET);
  let task=sheet.getRange(taskRow,1,1,ALL_COLUMNS.ncols).getValues()[0];

  if ( task != null)
  {
      let ret={};

      ret.TaskRow=taskRow;
    
      ret.Created = utils_formatDateForPicker(new Date(task[COLUMNS.Creation]));

      if ( task[COLUMNS.Update] != null && task[COLUMNS.Update] != "")
        ret.Updated = utils_formatDateForPicker(new Date(task[COLUMNS.Update]));
      else
          ret.Updated="";

      ret.Title           = task[COLUMNS.Title]
      ret.Description     = task[COLUMNS.Description];
      ret.Attrib          = task[COLUMNS.Attrib];
      ret.Urgency         = task[COLUMNS.Urgency];
      ret.FinEspere       = utils_formatDateForPicker(new Date(task[COLUMNS.FinEspere]));
      ret.FinPire         = utils_formatDateForPicker(new Date(task[COLUMNS.FinPire]));
      ret.Status            = task[COLUMNS.Status];
      ret.AssigneeEmail     = task[COLUMNS.AssigneeEmail];
      ret.AssigneeNotified  = task[COLUMNS.AssigneeNotified];
      ret.TaskNo        = task[COLUMNS.Id];
      ret.CreatedBy     = task[COLUMNS.CreatedBy];
      ret.UpdatedBy     = task[COLUMNS.UpdatedBy];
      ret.Category      = task[COLUMNS.Category];
      ret.Percent       = task[COLUMNS.Percent];
      ret.DateDebut     = task[COLUMNS.DateDebut];
      ret.DateFin       = task[COLUMNS.DateFin];
      ret.BizValue      = task[COLUMNS.BizValue];
      ret.Principal     = task[COLUMNS.Principal];
      ret.Secondary     = task[COLUMNS.Secondary];
      ret.Auxiliary     = task[COLUMNS.Auxiliary];
      ret.ReportCount   = task[COLUMNS.ReportCount];
      ret.ReportReason  = task[COLUMNS.ReportReason];
      ret.SysAlert      = task[COLUMNS.SysAlert];

      return ret;
    }    

  return null;
}


/**
 * 
 * 
 */
function findTaskInSheet(taskNo)
{
  let sheet           = utils_getSheet(TASKS_SHEET);
  let lastRow         = sheet.getLastRow();
  let data            = sheet.getRange(DataTasksTableTaskIdRange+lastRow).getValues();
  let assignee        = sheet.getRange(DataTasksTableAssigneeRange+lastRow).getValues();
  let assigneeEmails  = sheet.getRange(DataTasksTableAssigneeEmailRange+lastRow).getValues();
  let statuses        = sheet.getRange(DataTasksTableStatusRange+lastRow).getValues();

  for(let i=0;i<data.length;i++)
    if (data[i][0]==taskNo)
      return [i+1,assignee[i][0],assigneeEmails[i][0],statuses[i][0], data[i][0]]; 

  return null;
}

/**
 * 
 * 
 */
function findNextCreatedTaskFor(emailAssignee, afterThisTaskNo)
{
  let sheet           = utils_getSheet(TASKS_SHEET);
  let lastRow         = sheet.getLastRow();
  let data            = sheet.getRange(DataTasksTableTaskIdRange+lastRow).getValues();
  let assignee        = sheet.getRange(DataTasksTableAssigneeRange+lastRow).getValues();
  let assigneeEmails  = sheet.getRange(DataTasksTableAssigneeEmailRange+lastRow).getValues();
  let statuses        = sheet.getRange(DataTasksTableStatusRange+lastRow).getValues();

  for(let i=0;i<data.length;i++)
  {
    if (assigneeEmails[i][0]==emailAssignee && statuses[i][0] == STATUS.CREATED && utils_parseInt(data[i][0]) > afterThisTaskNo)
    {
      return [i+2,sheet.getRange(i+2,1,1,ALL_COLUMNS.ncols).getValues()];
    }
  }

  return [];
}

/**
 * 
 * 
 */
function getAllAssignee(assigneeString)
{
  return utils_splitString(assigneeString,",");  
}


/**
 * 
 */
 function manageStatusTransition(newStatus,task)
 {
   if (newStatus == STATUS.FINISHED || newStatus == STATUS.ABANDONNED)
   {
      let allAssignee = getAllAssignee(task.Attrib);

      for (let i=0;i<allAssignee.length;i++)
      {
        let nextTask=findNextCreatedTaskFor(allAssignee[i],task.TaskNo);

        if (nextTask.length > 0)
        {
          notifyAssigneeNextTask(nextTask[0],nextTask[1][0][COLUMNS.AssigneeEmail]);
          return false;
        }
      }
   }

   return true;
 }



/**
 * 
 * Process une tâche site à une édition
 * formData = {urgency:1, taskNo:1, status:1, updatedBy:"Simon", attribue:"Said", noteDest:"Ceci est la note", descTask:"Ceci est la nouvelle descritption"};
 */

function test_processTaskForm()
{
  let formData = {urgency:1, taskNo:13, status:1, updatedBy:"IT", attribue:"IT", noteDest:"Ceci est la note", descTask:"Ceci est la nouvelle descritption"};

  processTaskForm(formData)
}


/**
 * 
 * 
 */

function task_manageChangeStatus(updatedRow, taskValues)
{
      let today = new Date();
      let formatedToday = utils_formatDateForPicker(today);

      if ( taskValues.status == STATUS.ONGOING )
      {
        if (updatedRow[COLUMNS.DateDebut] !=null && updatedRow[COLUMNS.DateDebut]!="")
        {
            let actual = new Date(updatedRow[COLUMNS.DateDebut]);

            if (actual > today )
              updatedRow[COLUMNS.DateDebut] = formatedToday;
        }
        else
          updatedRow[COLUMNS.DateDebut]     = formatedToday;
     
        if ( updatedRow[COLUMNS.DateFin] != null && updatedRow[COLUMNS.DateFin] != "")
        {
          let actualFin = new Date(updatedRow[COLUMNS.DateFin]);

          if ( today > actualFin ) // Dsate de fin non atteinte
            updatedRow[COLUMNS.DateFin] = "";
        }
      }

      if ( taskValues.status == STATUS.FINISHED )
      {
        if (updatedRow[COLUMNS.DateFin]==null || updatedRow[COLUMNS.DateFin]=="") 
          updatedRow[COLUMNS.DateFin]   = formatedToday;
        
        if ( updatedRow[COLUMNS.Status] != STATUS.FINISHED) //Only if previous status was not finished
        {
          let html="<html>Bonjour, nous vous informons que la tâche no: " + updatedRow[COLUMNS.Id] + " est passée au status TERMINE. <br>";
          html += updatedRow[COLUMNS.Title] + "<br>";
          html += updatedRow[COLUMNS.Description] + "</html>";
          mailing_sendMail("Tâche soukcircus terminée",html,updatedRow[COLUMNS.CreatedBy]);
        }
      }

      updatedRow[COLUMNS.Status] =  taskValues.status;

      return updatedRow;
}


/**
 * 
 * 
 */
function processTaskForm(formData)
{
  let task = findFullTaskInSheet(formData.taskNo);
  
  //==================================================================================================
  //Si non null, task contient [prénom, nom, email, status, taskId] de la personne assignée à la tâche
  //=================================================================================================
  if ( task != null )
  {
    let oldAssignee = task.Attrib;
    let newAssignee = formData.attribue;

    //{urgency=1, taskNo=1, status=1, updatedBy=Simon, attribue=Said}
    if (task.TaskRow != null )
    {
      let today = new Date();

      task.Updated  = utils_formatDateForPicker(today);
      task.UpdatedBy= formData.updatedBy + "$" + Session.getActiveUser().getEmail();

      if ( formData.urgency != null )
        task.Urgency =  formData.urgency;

      if ( formData.titleTask && formData.titleTask.trim() != "")
        task.Title =   formData.titleTask;

      if (formData.bestFin != null)
        task.FinEspere = formData.bestFin

      if (formData.deadline != null)
        task.FinPire = formData.deadline;

      if ( formData.descTask != null && formData.descTask.trim() != "")
        task.Description =  formData.descTask;

      if ( formData.category != null )
        task.Category =  formData.category;

      if ( formData.percent != null )
        task.Percent =  Math.max(Math.min(formData.percent,100),0);

      let notifyForStatusChange=false;
      if(formData.status != null && formData.status != "") 
      {
          notifyForStatusChange = (task.Status != formData.status);
          task.Status = formData.status;
      }

      /*===================== Notifier les nouveaux assignés =================*/
      let notifyNewAssigneeChange=false;
      let oldAssigneeEmails="";
      if ( task.Attrib != formData.attribue)
      {
        notifyNewAssigneeChange=true;
        task.Attrib   = formData.attribue;

        //=========================================================
        //Get old assignee emails for notifications of reassignment
        //=========================================================
        let emails=getAllEmailsForTheseCollabs(oldAssignee);
        for(let i=0;i<emails.length;i++)
            oldAssigneeEmails += emails[i][1] + ",";

        //=========================================================
        //Get new assignee emails for notifications of assignment
        //=========================================================
        task.AssigneeEmail="";
        emails=getAllEmailsForTheseCollabs(newAssignee);
        for(let i=0;i<emails.length;i++)
            task.AssigneeEmail += emails[i][1] + ",";
      }

      /*================= manage status changed =====================*/
     
 
      /*========================= Update row =========================*/
      let updatedRow=[];
      updatedRow[COLUMNS.Creation]          = task.Created;
      updatedRow[COLUMNS.Update]            = task.Updated;
      updatedRow[COLUMNS.Title]             =task.Title;
      updatedRow[COLUMNS.Description]       =task.Description;
      updatedRow[COLUMNS.Attrib]            =task.Attrib;
      updatedRow[COLUMNS.Urgency]           =task.Urgency;
      updatedRow[COLUMNS.FinEspere]         =task.FinEspere;
      updatedRow[COLUMNS.FinPire]           = task.FinPire;
      updatedRow[COLUMNS.Status]            = task.Status;
      updatedRow[COLUMNS.AssigneeEmail]     = task.AssigneeEmail;
      updatedRow[COLUMNS.AssigneeNotified]  = task.AssigneeNotified;
      updatedRow[COLUMNS.Id]                = task.TaskNo;
      updatedRow[COLUMNS.CreatedBy]         = task.CreatedBy;
      updatedRow[COLUMNS.UpdatedBy]         = formData.updatedBy;
      updatedRow[COLUMNS.Category]          = task.Category;
      updatedRow[COLUMNS.Percent]           = task.Percent;
      updatedRow[COLUMNS.DateDebut]         = task.DateDebut;
      updatedRow[COLUMNS.DateFin]           = task.DateFin ;
      updatedRow[COLUMNS.BizValue]           = task.BizValue ;
      updatedRow[COLUMNS.Principal]           = task.Principal ;
      updatedRow[COLUMNS.Secondary]           = task.Secondary ;
      updatedRow[COLUMNS.Auxiliary]           = task.Auxiliary ;
      updatedRow[COLUMNS.ReportCount]         = task.ReportCount ;
      updatedRow[COLUMNS.ReportReason]        = task.ReportReason ;
      updatedRow[COLUMNS.SysAlert]            = task.SysAlert ;

      //Manage eventual 100% percentage 
      //=================================
      if ( task.Percent == 100 )
          task.status = STATUS.FINISHED;

      //Manage eventual change of status
      //=================================
      updatedRow = task_manageChangeStatus(updatedRow, task);

      task.DateDebut = updatedRow[COLUMNS.DateDebut] ;
      task.DateFin = updatedRow[COLUMNS.DateFin] ;
      //=================================

      /* ============== MISE A JOUR DE LA TACHE DANS LA FEUILLE ==================*/
      let sheet = utils_getSheet(TASKS_SHEET);
      
      let values = [];
      values.push(updatedRow);

      sheet.getRange(task.TaskRow,1,1,ALL_COLUMNS.ncols).setValues(values);
      
      /*========== Manage eventual new thread ==================*/
      let notifyForNewThread = false;
      let newThread = {};
      if ( formData.newThread != null && formData.newThread.trim() != "" )
      {          
          newThread.taskNo = formData.taskNo;
          newThread.threadRow = formData.threadRow;
          newThread.text = formData.newThread;
          newThread.destinee = formData.destinee;

          createNewThread(newThread);

          notifyForNewThread = true;
      }
      SpreadsheetApp.flush();

      //================    
      //Notify
      //================

      if ( notifyNewAssigneeChange )
        notifyNewAndOldAssignee(task.TaskRow,task.AssigneeEmail,oldAssigneeEmails,formData.updatedBy,formData.noteDest);
      else if ( notifyForStatusChange)
      {
        if ( manageStatusTransition(formData.status,task) )
            notifyStatusChange(task.TaskRow,task.AssigneeEmail);
      }
      else if ( notifyForNewThread )
        notifyLastAssigneeInDiscussionThread(newThread.threadRow,newThread.destinee,newThread.taskNo,newThread.text);

    }
  }
}

function processNewDiscussion(formData)
{
    /*========== Manage eventual new thread ==================*/
    let notifyForNewThread = false;
    let newThread = {};
    if ( formData.newThread != null && formData.newThread.trim() != "" )
    {          
        newThread.taskNo = formData.taskNo;
        newThread.threadRow = formData.threadRow;
        newThread.text = formData.newThread;
        newThread.destinee = formData.destinee;

        createNewThread(newThread);

        notifyLastAssigneeInDiscussionThread(newThread.threadRow,newThread.destinee,newThread.taskNo,newThread.text);
    }
    SpreadsheetApp.flush();

    return getTaskThreads(formData.taskNo);
}


/**
 * 
 * let taskValues={};
              taskValues.taskNo     = taskId;
              taskValues.tateDebut  = null;
              taskValues.tateFin    = null;
              taskValues.status     = statusChoice;
              taskValues.taskRow    = null;
              taskValues.attrib     = null;
              taskValues.percentage = percentage;
 */
function task_updateTaskAccomplishment( taskValues )
{
  log_RessourceTaskForm("task_updateTaskAccomplishment: taskId="+ taskValues.taskNo);
  let taskRow = cache_getTaskRow(taskValues.taskNo);
  if (taskRow==null)
  {
    errors_logErrorAndEmail(T_TASK_NOTFOUND,taskValues.taskNo)
    return  false; 
  }  

  let sheet   =utils_getSheet(TASKS_SHEET);

  let task    =sheet.getRange(taskRow,1,1,ALL_COLUMNS.ncols).getValues()[0];

  //Manage unchanged values indicated by a null value
  if ( taskValues.status==null) 
    taskValues.status = task[COLUMNS.Status];
  if ( taskValues.percentage == null )
    taskValues.percentage = task[COLUMNS.Percent];


  if ( task != null)
  {
    task[COLUMNS.Percent] = Math.max(0,Math.min(taskValues.percentage,100));
    if (task[COLUMNS.Percent] == 100)
      task[COLUMNS.Status] =STATUS.FINISHED;


    task = task_manageChangeStatus(task, taskValues);
    
    let sheet   = utils_getSheet(TASKS_SHEET);
    let values = [];  

    values.push(task);
    sheet.getRange(taskRow,1,1,ALL_COLUMNS.ncols).setValues(values);
  }
}




function test_getTaskDetails()
{
  Logger.log(getTaskDetails(4));
}
/**
 * {"activeFirstName":"IT",
"activeEmail":"teamsoukcircus@gmail.com",
"Task":{
		"TaskRow":4,
		"Created":"2022-01-23",
		"Updated":"1970-01-01",
		"Title":"Valider la logique de calcul des salaires et bonus",
		"Description":"Si vous souhaitez vous baser sur le tableau pour ce calcul ça serait bien que l'on le valide ensemble et que je vous montre le paramétrage associé",
		"Attrib":"IT",
		"Urgency":"Moyenne",
		"FinEspere":"2022-03-30",
		"FinPire":"2022-02-28",
		"Status":"Terminée",
		"AssigneeEmail":"teamsoukcircus@gmail.com,",
		"AssigneeNotified":"2022-01-23T23:19:38.807Z",
		"TaskNo":4,
		"CreatedBy":"teamsoukcircus@gmail.com",
		"UpdatedBy":"Simon",
		"Category":"Envois colis",
		"Percent":100,
		"DateDebut":"2022-01-20T08:00:00.000Z",
		"DateFin":"2022-01-27T08:00:00.000Z"},
		"listUrgency":["Faible","Moyenne","Forte"],
		"listAssignee":["Céline","Simon","Said","Céline,Simon","Céline,Said","Simon,Said","Céline,Simon,Said","IT"],
		"listStatuses":["Créée","En cours","Terminée","Abandonnée"],
		"listCategories":["Design produits","Recherche de produit","Envois colis","Administration Etsy","Visite artisans","Administration Spotify","Veille internet","Commandes sur mesures","Répondre aux clients Etsy","IT","Autres"],
		"threads":{
			"nThreads":4,
			"threadRow":2,
			"discussions":[
							{"date":"2022/01/25 00::00::00","destinee":"'Simon'","text":"'Hello que puis-je pour vous...;o)))'"},
							{"date":"2022/01/24 00::00::00","destinee":"'Simon'","text":"'test sim'"},
							{"date":"2022/01/24 00::00::00","destinee":"'Simon'","text":"'test sim'"},
							{"date":"2022/01/24 00::00::00","destinee":"'Simon'","text":"'Hello Simon'"}
						  ]
				  }
		}
 * 
 */
function getTaskDetails(taskId)
{
  let ReturnedTask={};

  let task = findFullTaskInSheet(taskId);
  if (task==null)
  {
    errors_logErrorAndEmail("Task not found for id : ",taskId)
    return ReturnedTask; 
  }
  
  let user=getCollabPropertiesWithEmail(Session.getActiveUser().getEmail());
  if (user.FullName.trim() == "")
  {
    errors_logErrorAndEmail("getTaskDetails(" + taskId +"), user unknoen");
    return "ERR_NOK";
  }

  let splitted = utils_splitString(user.FullName," ");
  ReturnedTask.activeFirstName = splitted[0];
  ReturnedTask.activeLastName = splitted[1];
  ReturnedTask.activeEmail = user.Email;

  task.FinEspere     = utils_formatDateForPicker(new Date(task.FinEspere));
  task.FinPire       = utils_formatDateForPicker(new Date(task.FinPire));
  if ( task.DateDebut != null && task.DateDebut != "" )
    task.DateDebut     = utils_formatDateForPicker(new Date(task.DateDebut));
  if ( task.DateFin != null && task.DateFin != "" ) 
  task.DateFin       = utils_formatDateForPicker(new Date(task.DateFin));     

  ReturnedTask.Task = task;

  let sheet = utils_getSheet(TASKS_PARAMS_SHEET);
  let v=sheet.getRange("A2:A").getValues();
  ReturnedTask.listUrgency =  [];
  for (let i=0;i<v.length && v[i][0].trim().length > 0 ;i++)
    ReturnedTask.listUrgency.push(v[i][0]);

  v =  sheet.getRange("B2:B").getValues();
  ReturnedTask.listAssignee =  [];
  for (let i=0;i<v.length && v[i][0].trim().length > 0 ;i++)
    ReturnedTask.listAssignee.push(v[i][0]);

  v =  sheet.getRange("C2:C").getValues();
  ReturnedTask.listStatuses =  [];
  for (let i=0;i<v.length && v[i][0].trim().length > 0 ;i++)
    ReturnedTask.listStatuses.push(v[i][0]);

  v =  sheet.getRange("D2:D").getValues();
  ReturnedTask.listCategories =  [];
  for (let i=0;i<v.length && v[i][0].trim().length > 0 ;i++)
    ReturnedTask.listCategories.push(v[i][0]);

  ReturnedTask.threads = getTaskThreads(taskId);
  
  let jsonString = JSON.stringify(ReturnedTask);
  return jsonString;
}


function test_processDeleteTask()
{
  processDeleteTask(9);
}

/**
 * 
 * Remove a task
 */
function processDeleteTask(taskNo)
{
  let task = findTaskInSheet(taskNo);

  //_logError("taskno:"+taskNo);

  if ( task != null )
  {
    let taskRow = task[0]+1;
    
    let today = new Date();
    utils_SetCellValueByCoordInSheet(TASKS_SHEET,taskRow,COLUMNS.Update+1,today + "$$Deleted$$");
    utils_SetCellValueByCoordInSheet(TASKS_SHEET,taskRow,COLUMNS.Status+1,STATUS.ABANDONNED);

    //notifyAssigneeTaskDeleted(taskRow,task[2]);

    SpreadsheetApp.flush();

    cache_deleteTask(taskRow,taskNo);
  }
}


function showTasksModalDialog()
{
  let tasksForm = HtmlService.createHtmlOutputFromFile('TasksHandler')
  .setHeight(1000) 
  .setWidth(2000); 

  SpreadsheetApp.getUi().showModelessDialog(tasksForm,"Tâches Soukcircus");
}



//INCLUDE JAVASCRIPT AND CSS FILES
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

//    <!--<?!= include('TasksHandlerJScript'); ?> <!--INCLUDE JavaScript.html FILE--> -->