
/**
 * 
 * Called by html Main page
 */
function assign_getScheduleTasks()
{
  let scheduling = assign_scheduleAllTasks();

  let byAssignee = {};

  for (let i=0;i<scheduling.length;i++)
  {
    let assign = scheduling[i];

    for (let j=0;j<assign.length;j++)
    {
      let email = assign[j].email;

      if ( byAssignee[`${email}`]==null)
        byAssignee[`${email}`]=[];

      byAssignee[`${email}`].push(assign[j])
    }
  } 

  return JSON.stringify(byAssignee);
}
/**
 * 
 * 
 */
function assign_scheduleAllTasks()
{
    let scheduling = [];
    let assignment ;

    var values   = utils_getSheet(TASKS_SHEET).getDataRange().getValues();

    let newRange=[];
    do
    {
      assignment = assign_NextTasksToCollaborators(values);

      scheduling.push(assignment);

      let toBeDeleted=[];
      for ( let i=0;i<assignment.length;i++ )
      {
        toBeDeleted.push(assignment[i].taskNum);  
        assignment[i].taskNum=null; //plus valable dans le tableau principal
      }

      newRange.splice(0,newRange.length);
      for ( let i=1;i< values.length ;i++ )
      {
        if ( toBeDeleted.indexOf(i) == -1 )
          newRange.push(values[i]);
      }

      values = newRange.slice();
    }
    while(newRange.length > 0)

    return scheduling;  
}
/**
 *  useTheseRange is an array of tasks rows
 * 
 */
function assign_NextTasksToCollaborators(useTheseRange=null)
{
  let tasksRange;
  let ret={};
  let tableTaskData = null; //row of the sheet "tasks"

  ret.assign=[];

  if ( useTheseRange == null )
  {
    tableTaskData   = utils_getSheet(TASKS_SHEET).getDataRange().getValues();
    tasksRange = assign_getAllTasksForAssignment(tableTaskData);
  }
  else
  {
    tableTaskData = useTheseRange;
    tasksRange = assign_getAllTasksForAssignment(useTheseRange);
  }

  if (tasksRange==null )
  {
    ret.message = T_ERROR_1;
    return ret;
  }

  try
  {
    //Rows of cost matrix : tasks
    //Columns of cost matrix:  workers
    let costMatrix = [];
    let assignees = [];

    for ( user in tasksRange)
    {
      let x = tasksRange[user];
      costMatrix.push(x);
      assignees.push(user);
    }

    let assignments = assign_getTasksAssignments(costMatrix,assignees);
    if ( assignments.assign.length > 0 )
      for ( let i=0;i<assignments.assign.length;i++)
      {
        let x= assignments.assign[i];
        let lastName = getCollabFirstAndLastNameByEmail(x.user)[1];
        let collab = getCollabFirstAndLastNameByEmail(x.user)[0] + " " + (lastName==null? "": lastName);
        let email = x.user;
        let title = tableTaskData[x.taskNum][COLUMNS.Title];
        let id    = tableTaskData[x.taskNum][COLUMNS.Id];
        let taskNum = x.taskNum;
        ret.assign.push({id, taskNum, email, collab,title})
      }
    else if (assignments.message != null )
    {
        ret.message = assignments.message;
    }
  }
  catch(e)
  {
    ret.message = e.message;
  }

  return ret;
}


/**
 * useTheseRange is an array of tasks rows
 * 
 */
function assign_getAllTasksForAssignment(useTheseRange=null)
{
    let tasksRange=null; 
    let ret={};

    if ( useTheseRange == null )
      tasksRange   = utils_getSheet(TASKS_SHEET).getDataRange().getValues();
    else
      tasksRange = useTheseRange;

    if ( tasksRange == null || tasksRange.length==0)
      return null;

    let emails = getAllCollabEmail();
    for ( let i=0;i< emails.length; i++)
    {
        ret[`${emails[i][2]}`]=[];
    }

    for ( let i=0;i< emails.length; i++)
      for (let j=1;j < tasksRange.length; j++) //1 for skipping header
      {
          let values = tasksRange[j];
          if ( values[COLUMNS.Status] == STATUS.CREATED )
              ret[`${emails[i][2]}`].push(0);
      }


    let colIndex=-1;
    for (let i=1;i<tasksRange.length;i++)
    {
        let theRow = tasksRange[i];
        if ( theRow[COLUMNS.Status] == STATUS.CREATED )
        {
            colIndex++;

            let assignee = utils_splitString(theRow[COLUMNS.Principal],"," );

            //Compute business value
            //======================
            let TotalBizValue = 0;
            {
              let faktor1 = theRow[COLUMNS.Urgency] == URGENCY.FAIBLE ? 1 : theRow[COLUMNS.Urgency] == URGENCY.MOYEN ? 2 : 4;

              TotalBizValue = faktor1 * theRow[COLUMNS.BizValue];
            }

            //Compute cost
            //==============
            let cost=0;
            for (let j=0;j<assignee.length;j++)
            {
              let props = getCollabPropertiesWithEmail(assignee[j]);
              let weight = props.SalaireAnnuel;

              cost += weight;
            }

            ret[`${assignee[0]}`][colIndex] = cost/TotalBizValue;
        }
    }  

    return ret;
}


/** MIP example that solves an assignment problem. */
/**
 * 
 * @param {allTasks}  is a nx2 vector with [taskId, taskValue] on each row
 */
function assign_getTasksAssignments(costMatrix,assignees)
{
    let engine = LinearOptimizationService.createEngine();
    let numWorkers = assignees.length;
    let numTasks = costMatrix[0].length;

    // Solver
    // Create the linear solver
    let solver = LinearOptimizationService.createEngine();

    // initialize the decision variables
    x = new Array(numWorkers);
    for (let i=0; i<numWorkers; i++)
    {
      x[i] = new Array(numTasks);
      for (let j=0; j< numTasks; j++)
      {
        x[i][j] = engine.addVariable(`x${i}${j}`, 0, 1, LinearOptimizationService.VariableType.INTEGER);
      }
    }

    // Constraints
    // Each worker is assigned to at most one task.
    for (let i = 0; i < numWorkers; ++i) 
    {
      constraint = engine.addConstraint(0, 1);
      for (let j = 0; j < numTasks; ++j) 
      {
        constraint.setCoefficient(`x${i}${j}`, 1);
      }
    }
    for (let i = 0; i < numWorkers; ++i) 
    {
      for (let j = 0; j < numTasks; ++j) 
      {
        engine.setObjectiveCoefficient(`x${i}${j}`, costMatrix[i][j]);
      }
    }

  engine.setMinimization()

  ret={};
  ret.assign = [];
  // Solve the linear program
  var solution = engine.solve(30);

  if (!solution.isValid()) 
  {
    errors_logErrorAndEmail('Assignment, No solution ' + solution.getStatus());
    ret.message= T_ASSIGN_NOSOLUTIONFOUND;
    return ret;
  }

  
  ret.objectiveValue = solution.getObjectiveValue();
  
  for (let workerNum=0; workerNum<numWorkers; workerNum++)
  {
    let user = assignees[workerNum];
    for (let taskNum=0; taskNum<numTasks; taskNum++)
    {
      //Logger.log(`Value of: x${i}${j} ` + solution.getVariableValue(`x${i}${j}`));
      let s = solution.getVariableValue(`x${workerNum}${taskNum}`);
      if (s==1)
      {
          ret.assign.push({user,taskNum});
          break;
      }
    }
  }

  return ret;
}

/**
 * 
 * Calcul la date de début, FinEsperee, FinAuPire de la prochasine tâche assignable à ce worker.
 * On cherche la première tâche commencée et non terminée associée à ce worker
 */

function test_this()
{
  
  let values   = utils_getSheet(TASKS_SHEET).getDataRange().getValues();
  
  tasks_scheduleNextFor(["teamsoukcircus@gmail.com"],values[5]);
}

/**
 * TO BE FIXED
 */
function tasks_scheduleNextFor(emails,task)
{
  let values   = utils_getSheet(TASKS_SHEET).getDataRange().getValues();
  let dateDebut=-1;

  for (let i=1;i< values.length;i++) // 1 for skipping header
  {
    let status   = values[i][COLUMNS.Status];
    if ( status != STATUS.FINISHED )
    {
      let dateAuPire = values[i][COLUMNS.FinPire];

      //On calcul la date la plus proche de libération d'une des ressources
      for (let j=0;j<emails.length;j++)
        if ( values[i][COLUMNS.AssigneeEmail].indexOf(emails[j]) != -1 ) 
        {
            if ( dateDebut != -1 )
            {
                if ( dateAuPire < dateDebut )
                    dateDebut = dateAuPire
            }
            else
            {
              dateDebut = dateAuPire;
              break;
            }
        } 
    }
  }

  
  if ( dateDebut != -1 )
  {
    let initialFinPire    = task[COLUMNS.FinPire] ;
    let initialFinEspere  = task[COLUMNS.FinEspere];
    let initialCreation   = task[COLUMNS.Creation];
    let initialDuration = utils_nDaysBetweenTwoDates(initialCreation,initialFinEspere);
    let newDfinEspere = utils_addDaysFromDate(dateDebut,initialDuration) 

    let initailNDaysBetweenEndDates = utils_nDaysBetweenTwoDates(initialFinEspere,initialFinPire);
    let newDfinPire = utils_addDaysFromDate(newDfinEspere,initailNDaysBetweenEndDates) ;

    if (newDfinPire > initialFinPire)
    {
      task[COLUMNS.SysAlert] = ALERTS.FIN_DECALEE; 
      task[COLUMNS.FinPire]   = newDfinPire;
    }

    task[COLUMNS.DateDebut] =  utils_formatDateForPicker(dateDebut);
    task[COLUMNS.FinEspere] =  utils_formatDateForPicker(newDfinEspere);
    task[COLUMNS.FinPire] =  utils_formatDateForPicker(newDfinPire);
  }
  
  let retS = JSON.stringify(task);

  return retS;
}

