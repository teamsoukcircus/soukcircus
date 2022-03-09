/*========================================================= VARIABLES AND DEFINES ============================================*/
//Valeur du statut d'une tâche sous forme de paires clé-valeur
const STATUS = {
  CREATED:    "Créée",
  ONGOING:    "En cours",
  FINISHED:   "Terminée",
  ABANDONNED: "Abandonnée",
  OVERDUE_FINESPEREE: "Fin espérée dépassée",
  OVERDUE_ABSOLUTE: "Fin au pire dépassée",
  NOTSTARTED_REPORTED: "Reportée",
}
//Valeur du statut d'une tâche sous forme d'un vecteur
const V_STATUS=["Créée","En cours","Terminée","Abandonnée"]


const STATUS_KEYS = {
  "Créée":    0,
  "En cours":    1,
  "Terminée":   2,
  "Abandonnée": 3
}


//Valeur d'alerte mise par le système à la création d'une tâche si le scheduling du créateu de la tâche
//ne semble pas pouvoir être satisfait

const ALERTS =
{
  FIN_DECALEE: 0
}

//Valeur de l'urgence d'une tâche sous forme de paires clé-valeur
const URGENCY = {
  FAIBLE: "Faible",
  MOYEN: "Moyenne",
  FORTE: "Forte"
}

//Valeur de l'urgence d'une tâche sous forme d'un vecteur
const V_URGENCY = ["Faible","Moyenne","Forte"];


const USER_TASKFORM =
{
  Categorie   :0,
  Title       :1,
  Description :2,
  TaskAssign  :3,
  Urgency     :4,
  FinEsperee  :5,
  FinAuPire   :6,
  BizValue    :7,
  NotifImmediate:8
}

const USER_TASKFORM_ASSIGN_RANK = ["Céline","Simon", "Said", "IT"]


//Created	Updated	Titre	Description	Assignee	FinEsperee	FinAuPire	Status	AssigneeEmail	AssigneeNotified	Id	CreatedBy	UpdatedBy												
// Toutes les colonnes d'une tâche dans la feuille tasks
var COLUMNS_NAMES={
  AppSheetId:     "Id",
  Creation:     "Creation",
  Update:       "Update",
  Title:        "Title",
  Description:  "Description",
  Attrib:       "Attrib",
  Urgency:      "Urgency",
  FinEspere:    "FinEspere",
  FinPire:      "FinPire",
  Status:       "Status",
  AssigneeEmail:"AssigneeEmail",
  AssigneeNotified:"AssigneeNotified",
  Id:             "Id",
  CreatedBy:      "CreatedBy",
  UpdatedBy:      "UpdatedBy",
  Category:       "Categorie",
  Percent:        "Percent",
  DateDebut:      "DateDebut",
  DateFin:        "DateFin",
  BizValue:       "BizValue",
  Principal:      "Principal",
  Secondary:      "Secondary",
  Auxiliary:      "Auxiliary",
  ReportCount:    "ReportCount",
  ReportReason:   "ReportReason",
  SysAlert:      "SysAlert"
};

var COLUMNS={
  AppSheetId:   0,
  Creation:     1,
  Update:       2,
  Title:        3,
  Description:  4,
  Attrib:       5,
  Urgency:      6,
  FinEspere:    7,
  FinPire:      8,
  Status:       9,
  AssigneeEmail:10,
  AssigneeNotified:11,
  Id:           12,
  CreatedBy:    13,
  UpdatedBy:    14,
  Category:     15,
  Percent:      16,
  DateDebut:    17,
  DateFin:      18,
  BizValue:     19,
  Principal:    20,
  Secondary:    21,
  Auxiliary:    22,
  ReportCount:  23,
  ReportReason: 24,
  SysAlert:     25
}

var ALL_COLUMNS =
{
  ncols: 26,         //Il y a 26 colonnes par tâche dans la feuille tasks (constants.gs=>TASKS_SHEET)
  formFieldStart: 3, // Les champs spécidifiés dans la forme commencent en colonne 2 
  cols: COLUMNS     // Toutes les colonnes d'une tâche dans la feuille tasks
}

const DataTasksTableRange               = TASKS_SHEET+"!A2:Y"; 
const DataTasksTableTaskIdRange         = TASKS_SHEET+"!L2:L"; 
const DataTasksTableAssigneeRange       = TASKS_SHEET+"!E2:E";
const DataTasksTableAssigneeEmailRange  = TASKS_SHEET+"!J2:J";  
const DataTasksTableStatusRange         = TASKS_SHEET+"!I2:I";  


/*========================================================= BUSINESS CODE  ============================================*/

/** 
 * @param{string} the firstname of the collaborator
 * @return{array} [firstname, lastname, email] of matching collaborator firstname
 */
function getAllEmailsForTheseCollabs(firstnamesString)
{
    let  firstNames = utils_splitString(firstnamesString,",");
    let emails=getAllCollabEmail();
    
    let theEmail2Notify=[];
    for (let i=0;i<firstNames.length;i++)
      for(let j=0;j<emails.length;j++)
      {
        if (firstNames[i] == emails[j][0])
        {
          theEmail2Notify.push([firstNames[i],emails[j][2]]);
          break;
        }
      }

    return theEmail2Notify;
}

/**
 * Calcul un identifiant unique pour une tâche. C'est le max des identifiants existants + 1
 */
function  getTaskId(sheet)
{
  let id = Math.max.apply(null,sheet.getRange(DataTasksTableTaskIdRange).getValues());
  return id+1;
}
/**
 * Cette méthode est appelée via le trigger portant le même nom lors de la créationm d'une nouvelle tâche
 * Le trigger n'est pas définit directement via le menu "TRiggers" mais par appel à la fonction setOnCreateTaskSubmitTrigger
 * dans le fichier triggers.gs
 */

//IT,Feuille mensuelle,Valider forme et contenu des feuilles mensuelles
//IT,Simon,2022-02-15,2022-02-28
function onCreateTask(event)
{
  let newRow=utils_initRow();
  var form = event.response;
  var itemResponses = form.getItemResponses();

  newRow[COLUMNS.Creation]= utils_formatDateForPicker(new Date());
  newRow[COLUMNS.Status] = STATUS.CREATED;
  newRow[COLUMNS.CreatedBy] = Session.getActiveUser().getEmail();
  newRow[COLUMNS.UpdatedBy] = "";
  newRow[COLUMNS.DateDebut] = "";
  newRow[COLUMNS.DateFin] = "";
  newRow[COLUMNS.Percent] = 0;

  //=================================================================================
  //On crée une row de la table "tasks" avec les données en entrée de la google form
  //=================================================================================

  //Categorie
  //===========
  newRow[COLUMNS.Category] = itemResponses[USER_TASKFORM.Categorie].getResponse();

  //Titre
  //===========
  newRow[COLUMNS.Title] = itemResponses[USER_TASKFORM.Title].getResponse();

  //description
  //===========
  newRow[COLUMNS.Description] = itemResponses[USER_TASKFORM.Description].getResponse();

  //TaskUser Assignment Ranking
  //===========================
  /* Google Doc
  For CheckboxGridItem questions, this returns a String[][] array in which the answers at row index n corresponds to the question at row n + 1 in the checkbox grid.  If a respondent did not answer a question in the grid, that answer is returned as ''.
  */
  let responses =  itemResponses[USER_TASKFORM.TaskAssign].getResponse(); //This is a String[][]
  for (level=0;level<3;level++)
  {
    let s = ""
    for(user=0;user<responses[level].length;user++)
    {
      s +=  getCollabEmailByFirstname(responses[level][user]) +",";
    }
    newRow[COLUMNS.Principal+level]  = s;
    
  }

  //On assign cette tâche au principal
  //=====================================
  newRow[COLUMNS.AssigneeEmail] = newRow[COLUMNS.Principal];

//=========================================
  //Tous les prénoms des personnes assignées
  //=========================================
  let emails = utils_splitString(newRow[COLUMNS.AssigneeEmail],",");
  let assignees = "";
  for(let i=0;i<emails.length;i++)
  {
    let names = getCollabFirstAndLastNameByEmail(emails[i])
    
    if (i> 0)
      assignees += "," ;

    assignees += names[0];
  }
  newRow[COLUMNS.Attrib] = assignees;

  //Urgence
  //===========
  newRow[COLUMNS.Urgency] = itemResponses[USER_TASKFORM.Urgency].getResponse();

 
  //Date fin esperée
  //===========
  newRow[COLUMNS.FinEspere] = itemResponses[USER_TASKFORM.FinEsperee].getResponse();

  //Business value
  //===========
  newRow[COLUMNS.BizValue] = itemResponses[USER_TASKFORM.BizValue].getResponse();

  //Date fin au pire
  //===========
  newRow[COLUMNS.FinPire] = itemResponses[USER_TASKFORM.FinAuPire].getResponse();

  //Notification imméldiate
  //======================= 
  let notifInstantanee=false; 
  if ( itemResponses[USER_TASKFORM.NotifImmediate] != null )
  {
    let choice = itemResponses[USER_TASKFORM.NotifImmediate].getResponse();;

    notifInstantanee = (choice != null && choice != "" && choice.length > 0);
  }

    //========================================================================
    //On adapte le début de la tâche en fonction de la tâche courante
    // associée au worker. TO BE FIXED
    //========================================================================
    /*
    let newRowStringified = tasks_scheduleNextFor(emails,newRow);
    log_RessourceTaskForm("6")
    newRow = JSON.parse(newRowStringified);
    log_RessourceTaskForm("7")
    */
    //========================================================================
    //On rajoute la ligne dans la feuille TASKS_SHEET="tasks"
    //========================================================================
    let sheet = utils_getSheet(TASKS_SHEET);

    //D'abord ajouter l'identifiant de la tâche comme soin numéro de ligne à l'insertion.
    newRow[COLUMNS.Id]= getTaskId(sheet); 


    //Puis ajouter la ligne dans la feuille
    sheet.appendRow(newRow);

    SpreadsheetApp.flush();

    //========================================================================
    //Select correct item in data validations cells 
    //========================================================================
    /*
    utils_addTaskDatValidationListXX(sheet,sheet.getLastRow(),COLUMNS.Attrib+1,COLUMNS_NAMES.Attrib);
    utils_addTaskDatValidationListXX(sheet,sheet.getLastRow(),COLUMNS.Status+1,COLUMNS_NAMES.Status);
    utils_addTaskDatValidationListXX(sheet,sheet.getLastRow(),COLUMNS.Urgency+1,COLUMNS_NAMES.Urgency);
    utils_addTaskDatValidationListXX(sheet,sheet.getLastRow(),COLUMNS.Category+1,COLUMNS_NAMES.Category);
  */
   
    
    //================================================================================
    // Si notification immédiate, on envoie un email à toutes les personnes concernées
    //================================================================================
    log_RessourceTaskForm("notifInstantanee: " + notifInstantanee)
    log_RessourceTaskForm("allAssigneeEmails: " + newRow[COLUMNS.AssigneeEmail] )
    if ( notifInstantanee )
    {
        let html = "<html><body><table><tr><td><h3>Bonjour " + newRow[COLUMNS.Attrib] + ", une nouvelle tâche vient de vous être attribuée</h3></td><td><h3>&nbsp;</h3></td><td><h3><a href='"+ utils_getUrl() +"?taskId=" + newRow[COLUMNS.Id]  + "'><h4>Voir la tâche</a></h3></td></tr>";
      html += "<tr><td><h4>Teamsoukcircus</h4></td></tr></table>"; 
      html +="</body></html>";

      mailing_sendMail("Tâche Soukcircus",html,newRow[COLUMNS.AssigneeEmail] );  

    }
log_RessourceTaskForm("1");  
    //finally update cache
    cache_putTask(sheet.getLastRow(),newRow[COLUMNS.Id] );
    cache_clean(CACHE_TASKS_HTML_KEY);
    log_RessourceTaskForm("2");  
}


/**
 * Retourne toutes les tâches avec le status spécifié.
 */
function getListOfTasks(all=true, statuses, fromDate=null)
{
    let allTasks = utils_getSheet(TASKS_SHEET).getDataRange().getValues();
    let retTasks=[];

    if ( all )
      return allTasks;

    for (let i=0;i<allTasks.length;i++)
    {
      if (statuses.indexOf(allTasks[i][COLUMNS.Status]) >= 0)
          retTasks.push(allTasks[i]);
    }

    if ( fromDate != null )
    {
      allTaks=retTasks;
      retTasks=[];
      for (let i=0;i<allTasks.length;i++)
      {
        if (allTasks[i][COLUMNS.Creation] >= fromDate)
          retTasks.push(allTasks[i]); 
      }
    }

    return retTasks;
}

/**
 * Retourne la liste des tâches en cours.
 */
function getOnGoingTasks()
{
  return getListOfTasks(false, STATUS.FINISHED);
}

/**
 * Notifies chaque collaborateur avec toutes les tâches qui lui sont assignée Cette méthoide tourne 
 * 1x par semaine via un trigger, tous les lundi m,atin.
 */
function notifyAssignees()
{
  let tasks = getListOfTasks(false, [STATUS.CREATED,STATUS.ONGOING]) 
  let assignees = {};

  for(let i=0;i<tasks.length;i++)
  {
    let email = tasks[i][COLUMNS.AssigneeEmail];

    if ( assignees[email] == null )
        assignees[email] = [];

    assignees[email].push([i+2,tasks[i]]);
  } 

  let today = new Date();
  for ( email in assignees)
  {
    let notStarted = [];
    let onGoing = [];
    let late = [];

    let tasks = assignees[email];

    for (let i=0;i< tasks.length;i++)
    {
      let task = tasks[i][1];
      let taskRow = tasks[i][0];

      if ( task[COLUMNS.Status]==STATUS.CREATED )
      {
        let delta = task[COLUMNS.FinEspere] - today;
        if (delta < 0)
          late.push(task);
        else
          notStarted.push(task);

        utils_SetCellValueByCoordInSheet(TASKS_SHEET,taskRow,COLUMNS.AssigneeNotified+1,today);
      }
      else if ( task[COLUMNS.Status]==STATUS.ONGOING )
      {
        let delta = task[COLUMNS.FinEspere] - today;
        if (delta < 0)
          late.push(task);
        else
          onGoing.push(task);
      }
    }

    /*====================================================================== */
    let html = getTableBaseCss();
        html += "<br><h3>Bonjour " + tasks[0][COLUMNS.Attrib] + ", voici un résumé des tâches qui vous sont attribuées</h3><br>"

    if ( notStarted.length > 0 )
    {
      html += "<br><h3>Tâches à démarrer</h3><br>"+
              "<table id='soukTable'>"+ 
              "<tr><th>Titre</th><th>description</th><th>Fin espérée</th><th>Fin au pire</th></tr>";

      for (let i=0; i<notStarted.length;i++)
      {
        html += "<tr><td>" + notStarted[i][COLUMNS.Title] + "</td>"+
                "<td>" + notStarted[i][COLUMNS.Description] + "</td>"+
                "<td>" + notStarted[i][COLUMNS.FinEspere],  + "</td>"+
                "<td>" + notStarted[i][COLUMNS.FinPire]  + "</td>" +
                "</tr>";
      }
      html += "</table>";
    }


    if ( late.length > 0 )
    {
      html += "<br><h3>Tâches en retard</h3><br>"+
              "<table id='soukTable'>"+ 
              "<tr><th>Titre</th><th>description</th><th>Fin espérée</th><th>Fin au pire</th></tr>";
      for (let i=0; i<late.length;i++)
      {
        html += "<tr><td>" + late[i][COLUMNS.Title] + "</td>"+
                "<td>" + late[i][COLUMNS.Description] + "</td>"+
                "<td>" + late[i][COLUMNS.FinEspere]  + "</td>"+
                "<td>" + late[i][COLUMNS.FinPire]  + "</td>" +
                "</tr>";
      }
      html += "</table>";
    }

    if ( onGoing.length > 0 )
    {
      html += "<br><h3>Tâches en cours</h3><br>"+
              "<table id='soukTable'>"+ 
              "<tr><th>Titre</th><th>description</th><th>Fin espérée</th><th>Fin au pire</th></tr>";
      for (let i=0; i<onGoing.length;i++)
      {
        html += "<tr><td>" + onGoing[i][COLUMNS.Title] + "</td>"+
                "<td>" + onGoing[i][COLUMNS.Description] + "</td>"+
                "<td>" + onGoing[i][COLUMNS.FinEspere]  + "</td>"+
                "<td>" + onGoing[i][COLUMNS.FinPire]  + "</td>" +
                "</tr>";
      }
      html += "</table>";
    }   

      html += "<table><tr><td><a href='" + utils_getUrl() + "'><h4>Voir toutes les tâches</a></td></tr></table>"
    
    html +="</body></html>";

    mailing_sendMail("Tâches Soukcircus",html,email);  
  }
}

/**
 * Envoie une notification au collaborateur qu'une tâche existante lui a lui a été réassignée 
 * 
 * IN. taskRow: le num. de la rangle dans la feuille "tasks" de cette tâche
 *     email: l'email destinataire
 *     modifyer: le prénom du créateur de la tâche
 *     noteTodest : node du modifyer au moment de la réassignation
 */
function notifyNewAndOldAssignee(taskRow,newAssignEmail,oldAssignEmail,modifyer, noteTodest)
{
  let theTask = utils_getSheet(TASKS_SHEET).getRange(taskRow,1,1,15).getValues()[0];

    /*====================================================================== */
  let html_01 = "<html><body><table><tr><td><h3>Bonjour " + theTask[COLUMNS.Attrib] + ", cette tâche vous a été assignée par "+ modifyer + "</h3></td><td><h3>&nbsp;</h3></td><td><h3><a href='"+ utils_getUrl() +"?taskId=" + theTask[COLUMNS.Id]  + "'><h4>Voir la tâche</a></h3></td></tr>";



    /*====================================================================== */
    if ( noteTodest!=null && noteTodest.trim() != "")
    {
      html_01 += "<tr><td><h3>La note suivante vous est adressée</h3></td></tr>";
      html_01 += "<tr><td><h3>"+noteTodest + "</h3></td></tr>";
    }

    html_01 += "<tr><td><h4>Teamsoukcircus</h4></td></tr>";
    html_01 += "</table>";

    mailing_sendMail("Tâches Soukcircus",html_01,newAssignEmail); 

    /*=================. Maintenant notifier l'ancien détenteur de la tâche ===============*/
    html_01 = "<html><body><table><tr><td><h3>Bonjour " + theTask[COLUMNS.Attrib] + ", cette tâche vous a été réassignée par "+ modifyer + "</h3></td><td><h3>&nbsp;</h3></td><td><h3><a href='"+ utils_getUrl() +"?taskId=" + theTask[COLUMNS.Id]  + "'><h4>Voir la tâche</a></h3></td></tr></table></body></html>";

    mailing_sendMail("Tâches Soukcircus",html_01,oldAssignEmail); 
}


/**
 * Envoie une notification au collaborateur assigné à cette tâche lui indiquant qu'elle a été 
 * effacée. En fait mise en status ABANDONNEE, les tâches ne sont jamis effacées.
 * IN. taskRow: le num. de la rangle dans la feuille "tasks" de cette tâche
 *     email: l'email destinataire
 */
function notifyAssigneeTaskDeleted(taskRow,email)
{
  let theTask = utils_getSheet(TASKS_SHEET).getRange(taskRow,1,1,15).getValues()[0];

     let html = "<html><body><table><tr><td><h3>Bonjour " + theTask[COLUMNS.Attrib] + ", cette tâche a été supprimée</h3></td><td><h3>&nbsp;</h3></td><td><h3><a href='"+ utils_getUrl() +"?taskId=" + theTask[COLUMNS.Id]  + "'><h4>Voir la tâche</a></h3></td></tr>";
      html += "<tr><td><h4>Teamsoukcircus</h4></td></tr></table>"; 
      html +="</body></html>";

    mailing_sendMail("Tâches Soukcircus",html,email);  
}

function notifyAssigneeNextTask(taskRow,email)
{
  let theTask = utils_getSheet(TASKS_SHEET).getRange(taskRow,1,1,15).getValues()[0];

    let html = "<html><body><table><tr><td><h3>Bonjour " + theTask[COLUMNS.Attrib] + ", ceci devrait être la prochaine tâche</h3></td><td><h3>&nbsp;</h3></td><td><h3><a href='"+ utils_getUrl() +"?taskId=" + theTask[COLUMNS.Id]  + "'><h4>Voir la tâche</a></h3></td></tr>";
      html += "<tr><td><h4>Teamsoukcircus</h4></td></tr></table>"; 
      html +="</body></html>";

    let email2Notify = theTask[COLUMNS.AssigneeEmail];
    mailing_sendMail("Tâches Soukcircus",html,email2Notify);  
}

function notifyStatusChange(taskRow,email)
{
  let theTask = utils_getSheet(TASKS_SHEET).getRange(taskRow,1,1,15).getValues()[0];

    let html = "<html><body><table><tr><td><h3>Bonjour " + theTask[COLUMNS.Attrib] + ", le status de cette tâche a changé</h3></td><td><h3>&nbsp;</h3></td><td><h3><a href='"+ utils_getUrl() +"?taskId=" + theTask[COLUMNS.Id]  + "'><h4>Voir la tâche</a></h3></td></tr>";
      html += "<tr><td><h4>Teamsoukcircus</h4></td></tr></table>"; 
      html +="</body></html>";

    let email2Notify = theTask[COLUMNS.AssigneeEmail];
    mailing_sendMail("Tâches Soukcircus",html,email2Notify);  
}


function test_notifyLastAssigneeInDiscussionThgread()
{
  notifyLastAssigneeInDiscussionThread(2,"IT", 34,"Salut IT");
}

/*
 * 
 * 
 */
function notifyLastAssigneeInDiscussionThread(threadRow,asigneeFirstname, taskNo,text)
{
    //let html = getTableBaseCssDetailed(0,'#EEEEEE',"Go");
    let html = "<html><body><table><tr><td><h3>Bonjour , vous avez reçu une notification sur une tâche</h3></td><td><h3>&nbsp;</h3></td><td><h3><a href='"+ utils_getUrl() +"?taskId=" + taskNo + "'><h4>Voir la tâche</a></h3></td></tr>";
      html += "<tr><td><h4>Teamsoukcircus</h4></td></tr></table>"; 
      html +="</body></html>";

      let email = getAllEmailsForTheseCollabs(asigneeFirstname);
      //errors_logError("EMAIL: " + email);
      mailing_sendMail("Tâche Soukcircus",html,email[0][1]); 
}

function test_yy()
{
  let a={}
  var outputJSON={};
  outputJSON['a']=[];
  outputJSON['b']=[];

  //Logger.log(JSON.stringify(outputJSON));  

  outputJSON['a'].push(1);
  Logger.log(outputJSON);  
  outputJSON['b'].push(2);
  Logger.log(outputJSON); 
  Logger.log(outputJSON['a']); 
  Logger.log(outputJSON['b']); 
}


/*========================================================= UTILITARIANS DEV. FOR TASKS============================================*/
/**
 * 
 * Permet d'avoir des mutli-chaînes dans une dropdown 
 */
function utils_addTaskDatValidationList(sheet,atLine,atColumn, colName)
{
  if (sheet == null)
    return false;

  sheet = utils_getSheet(TASKS_SHEET);
  
  var partSheet   = utils_getSheet(TASKS_PARAMS_SHEET);
  var partLastRow = partSheet.getLastRow();

  //PART DROPDOWN
  var partCell = sheet.getRange(atLine,atColumn); 
  var a1Rang;
  
  if (colName == COLUMNS_NAMES.Status )
    a1Rang = "tasksData!C2:C" + partLastRow;
  else if (colName == COLUMNS_NAMES.Attrib )
    a1Rang = "tasksData!B2:B" + partLastRow;
  else if (colName == COLUMNS_NAMES.Urgency )
    a1Rang = "tasksData!A2:A" + partLastRow;
  else
    return false;

  var ids = partSheet.getRange(a1Rang).getDisplayValues();
  var matchedId = ids.find(id=>{
      return id[0] == partCell.getDisplayValue();
    })

  var partRange;
  partRange = partSheet.getRange(a1Rang);

  var partRule = SpreadsheetApp.newDataValidation().requireValueInRange(partRange).build();
  partCell.setDataValidation(partRule);

  if (matchedId.length > 0)
  {
    partCell.setValue(matchedId[0]);
    return true;
  }

  return false;
}

/**
 * 
 * Selectionne l'item avec la disdplay value = dispValue, dans une dropdown dans la feuille spécifiée. LA dropdown doit
 * se trouver à la ligne te colonne spécifiée
 */
function utils_selectItemInList(sheet=null,atLine,atColumn, dispValue)
{
  var menuSheet = sheet;
  if (sheet == null)
    menuSheet = utils_getSheet(TASKS_SHEET);

  //PART DROPDOWN
  var partCell = menuSheet.getRange(atLine,atColumn+1);   
  partCell.setValue(dispValue);
  return true;
}

/**
 * Initiualise une rangée en vue d'insertion dans la feuille TASK_SHEET=tasks
 */
function utils_initRow()
{
  let ret=[];
  for(let i=0;i<ALL_COLUMNS.ncols;i++)
    ret.push("");

  return ret;
}


function test_splitAssignee()
{
  Logger.log(utils_splitString("Simon , Oldani , toto",","));
}



/*========================================================= TESTING ============================================*/
function test_xx()
{
  let a={"A" : [0,1,2,3], "B" : [4,5,6] }

  Logger.log(a["A"]);
  Logger.log(a["B"]);
  Logger.log(a["C"]);

  for(key in a)
    Logger.log(key + " : " + a[key])

  Logger.log(getAllCollabEmail());

//Assign email
  let newRow=utils_initRow();
  newRow[4]='Simon';

  let emails=getAllCollabEmail();
  for(let i=0;i<emails.length;i++)
  {
    Logger.log("EMAIL:" + emails[i]);

    Logger.log(emails[i][0] + ", " + newRow[COLUMNS.Attrib] + ", " + emails[i][0].indexOf(newRow[COLUMNS.Attrib]));

    if (emails[i][0].indexOf(newRow[COLUMNS.Attrib]) != -1 )
    {
      Logger.log(">>>>>>>>>> " + emails[i][1]);
      newRow[COLUMNS.AssigneeEmail] =  emails[i][1];
      break; 
    }
  }

  Logger.log(newRow)
}