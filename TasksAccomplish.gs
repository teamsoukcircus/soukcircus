function test_getRessourcesTables() 
{
  Logger.log(getRessourcesTables("teamsoukcircus@gmail.com") )
}

function getRessourcesTables(assigneeEmail) 
{
    var range   = Sheets.Spreadsheets.Values.get(prop_getSpreadSheetId(),DataTasksTableRange);  
    let collabData = {};
    
    collabData.email  = assigneeEmail; 
    collabData.tasks = []; 
    for (let i=0;i<range.values.length;i++)
    {

        let values = range.values[i];
        let assignIndex = values[COLUMNS.AssigneeEmail].indexOf(assigneeEmail) ;

        if ( assignIndex>=0 )
        {
          if (values[COLUMNS.AssigneeEmail]==assigneeEmail || assignIndex==0 )
          {
              let aTask = {};
              aTask.id = values[COLUMNS.Id];
              aTask.status = values[COLUMNS.Status];
              aTask.title = values[COLUMNS.Title];
              aTask.percent = values[COLUMNS.Percent];
              aTask.title  = values[COLUMNS.Title];
              collabData.tasks .push(aTask);
          }
        }
    }

    return collabData;
}


/**
 * 
 * 
 */
function trigger_reorgClean()
{
    //First do some cleanUp
    tasks_Cleanup();

    //Then reorganize tasks
    tasks_Reorganize(); 
}



function trigger_ressourceAccomplishmentRequest()
{
    //First do some cleanUp
    tasks_Cleanup();

    //Then reorganize tasks
    tasks_Reorganize(); 

    //Finally request accomplishment status to workers
    let emails = getAllCollabEmail();

    for(let i=0;i<emails.length;i++)
    {
      if (emails[i][2] != "soukcircus@gmail.com")
        requestTasksAccomplishment(emails[i]) ; 
    }
    
}



/**
 * 
 * assigneeEmail est un array [firstName, LastName, email]
 */
function test_requestTasksAccomplishment()
{
    requestTasksAccomplishment(["Gianfranco","Oldani","gianfranco.oldani@gmail.com"]);
}

function requestTasksAccomplishment(assigneeEmail)
{
  let tasks = getRessourcesTables(assigneeEmail[2]);

  var form = FormApp.create('Soukcircus avancement des tâches');
  
  form.setConfirmationMessage("Merci d'avoir répondu!");

  setRessourceAccomplishmentTrigger(form.getId());

  form.setTitle("Bonjour " + assigneeEmail[0]);

  var item = form.addSectionHeaderItem();
  item = form.addSectionHeaderItem();
  item.setTitle("Quand tu pourras, merci de renseigner au-mieux le statut et le pourcentage d'avancement de ces tâches");

  for(i=0;i<tasks.tasks.length;i++)
  {
    var tsk = tasks.tasks[i];

    if (tsk.status == STATUS.CREATED || tsk.status==STATUS.ONGOING)
    {
      //===================================
      var itemSection = form.addMultipleChoiceItem().setChoiceValues(["TÂCHE : " +  tsk.id ])
      itemSection.setTitle(tsk.title);

      //====================================

      var itemStatus = form.addListItem().setTitle(" • Status actuel : " + tsk.status + ". \n • Sélectionnez le statut correct de la tâche \n • Vous pouvez laisser en blanc si le statut n'a pas changé");

      itemStatus.setChoiceValues(V_STATUS);

      //====================================
      var itemPercent = form.addTextItem();
      itemPercent.setTitle("• Pourcentage actuel: " + tsk.percent + " %. \n • Renseignez le pourcentage actuel \n • Vous pouvez laisser en blanc si ce pourcentage n'a pas changé");
    }
  }


  utils_wait(1);

  //Notify ressource
  html = "<html><body><h3>Bonjour, " + assigneeEmail[0] + ", merci de renseigner quand tu le pourras l'avancement de tes tâches : <a href='" + form.getPublishedUrl() +
          "'> Formulaire </a></h3><br><h3>Merci beaucoup, c'est important et très utile<br>Team soukcircus</h3>";

  //mailing_sendMail("Soukcircus, avancement des tâches",html,"teamsoukcircus@gmail.com");    
  mailing_sendMail("Soukcircus, avancement des tâches",html,assigneeEmail[2]);

}
//=IMAGE("https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl="&I2&"")

function test_accomplishment()
{
   let taskValues={};
    taskValues.taskNo     = 8;
    taskValues.dateDebut  = null;
    taskValues.dateFin    = null;
    taskValues.status     = null;
    taskValues.taskRow    = null;
    taskValues.attrib     = null;
    taskValues.percentage = 95;

    log_RessourceTaskForm("taskValues : " + JSON.stringify(taskValues));
    task_updateTaskAccomplishment(taskValues);
}
/**
 * 
 * this method is triggered by an installable trigger once a week
 */
function onRessourceAccomplishmentForm(event)
{
  var form = FormApp.openById(event.source.getId());
  var inputFormId = form.getId();

  log_RessourceTaskForm("received answer for form : " + form.getId());

  var formResponses = form.getResponses();
  for (var j = 0; j < formResponses.length; j++) 
  { 
      //log_RessourceTaskFormxx("formResponse : " + j);
      let formResponse = formResponses[j];
      let itemResponses = formResponse.getItemResponses();
      let taskId;
      let statusChoice; 
      let newTask=0;

      for (var i=0; i<itemResponses.length; i++) 
      {
          let itemResponse = itemResponses[i];
          let type = itemResponse.getItem().getType();

          //log_RessourceTaskForm("TYPE : " + type + ",  newTask " + newTask);

          if ( newTask == 0 && type == FormApp.ItemType.MULTIPLE_CHOICE)
          { 
              let title = itemResponse.getItem().getTitle();
              //log_RessourceTaskForm("TITLE : " + title);

              let splitted = utils_splitString(itemResponse.getResponse(),":")
              //log_RessourceTaskForm("splitted : " + splitted);
              
              taskId = utils_parseInt(utils_removeSpecialChars(splitted[1]));

              //log_RessourceTaskForm("TASK : " + taskId);
          }
          else
          {
            newTask++;

            if (newTask==1)
            {
                statusChoice =  itemResponse.getResponse();
                if ( statusChoice == "")
                  statusChoice=null;
                log_RessourceTaskForm("Choice : " + statusChoice);
            }
            else if (newTask==2)
            {
              let percentage
              if ( itemResponse.getResponse() == "" )
                percentage = null //Inchangé
              else
                percentage = Math.max(Math.min(utils_parseInt(itemResponse.getResponse()),100),0);

              log_RessourceTaskForm("Percentage : " + percentage);

              let taskValues={};
              taskValues.taskNo     = taskId;
              taskValues.dateDebut  = null;
              taskValues.dateFin    = null;
              taskValues.status     = statusChoice;
              taskValues.taskRow    = null;
              taskValues.attrib     = null;
              taskValues.percentage = percentage;
          
              log_RessourceTaskForm("taskValues : " + JSON.stringify(taskValues));
              task_updateTaskAccomplishment(taskValues);

              //ready for next task
              newTask=0;
            }
          } 
      }      
  }

  
  //Remove the installed trigger, we do not need it anymore
  let formId = removeTriggerForFormSource(inputFormId);

  //finally remove the form from the root drive of teamsoukcircus account
  let theFormFile = DriveApp.getFileById(inputFormId);

  theFormFile.setTrashed(true);

  //log_RessourceTaskForm("Trigger deleted for form: " + formId);
}


function logTriggerForFormSource()
{
  let triggers = ScriptApp.getScriptTriggers();

  for (i=0;i<triggers.length;i++)
  {
    let aTrigger = triggers[i];

    log_RessourceTaskForm("=====================================");
    log_RessourceTaskForm("Source:" + aTrigger.getTriggerSource());
    log_RessourceTaskForm("Source:" + aTrigger.getTriggerSourceId());
    log_RessourceTaskForm("Source:" + aTrigger.getHandlerFunction());
    log_RessourceTaskForm("Source:" + aTrigger.getEventType());
  }
  return null;
}

function test_me()
{
  let s="TÂCHE <" +  2+ "> " + "hello you";

  let splitted = utils_stringBetweenChars(s, "<",">");
  let taskId = utils_parseInt(utils_removeSpecialChars(splitted[0]));

  Logger.log(splitted)
  Logger.log(taskId)
}


