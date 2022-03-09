const MAX_SIZE_INCACHE = 1500; //for one object
const NTASKS_PER_CACHE = 40;
const MAX_SLICES      = 10000;
const MAX_CACHES_BEFORERESET = 50;

const CACHE_TASKS_HTML_KEY = "allSoukTasksHtml";

const documentCache = CacheService.getDocumentCache();

function cache_JSONConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}

function test_me()
{
  let j = {0:"a",1:"b",2:"c",3:"4"}
  let elem;
  for (elem in j)
  {
    Logger.log(elem)
  }

  Logger.log(elem)
}


function test_cache_getTaskRow()
{
  /*
    let r = cache_getTaskRow(6);
    Logger.log(r);

    r = cache_getTaskRow(46);
    Logger.log(r);

    r= cache_getTaskRow(300);
    Logger.log(r);
*/
    r = cache_getTaskRow(380);
    Logger.log(r);
}

function cache_getTaskRow(taskId)
{
    //On tente ce cache
    for(let trying=1;trying<=2;trying++)
    {
      let cacheName = cache_getNextPotentialCache(taskId);

      let jsonTasks=cache_getCacheJson(cacheName);

      if ( jsonTasks != null && jsonTasks.tasks!=null && jsonTasks.nTasks>0)
      {
        let key;

        for (key in jsonTasks.tasks)
        {
            if ( key == taskId)
              return jsonTasks.tasks[key];
        }

        //Si on arrive là on a pas eu de chance, on recommence depuis le début
        //key contient la dernière clé de ce cache
        let slice = 1
        let countNullCaches=0;
        do
        {
            let jsonTasks=cache_getTasksSlice(slice);
            if ( jsonTasks != null && jsonTasks.tasks!=null && jsonTasks.nTasks>0)
            {
              let key;

              for (key in jsonTasks.tasks)
              {
                  if ( key == taskId)
                    return jsonTasks.tasks[key];
              }
            }
            else
              countNullCaches++;

            //on essaye le cache suivant
            slice++;
        }
        while(slice < MAX_CACHES_BEFORERESET )
      }
      
      
      if (trying==2)
      {
        //La tâche semble ne pas exister
        return null;
      }

      //il doit y avoir un problème, les caches sont fractionn és
      //On réinitialise le cache
      cache_putAllTasks();

      //et on recommence
    }
      
}


function cache_getAllTasks()
{
  let allTasks = {};
  let cacheExist=true;
  let i = 0
  do
  {
    let cacheName = "tasks"+ i;
    let r = documentCache.get(cacheName);
    cacheExist = (r != null);

    if(cacheExist)
      allTasks = cache_JSONConcat(allTasks, JSON.parse(r)) 
    i=i+1
  }
  while(cacheExist)

  return allTasks;
}

/**
 * let cacheName = "tasks"+ slice, slice >= 1
 */
function cache_getTasksSlice(slice)
{
    let cacheName = "tasks"+ slice
    let r = documentCache.get(cacheName);
    if (r==null)
    {
      return null;
    }
    
    return JSON.parse(r);
}

function cache_cleanTasks()
{
  let cacheExist=true;
  let cacheIndex = 0
  do
  {
    let cacheName = "tasks"+ cacheIndex;
    cacheExist = ( documentCache.get(cacheName) != null );
    if(cacheExist)
      documentCache.remove(cacheName);
    cacheIndex++;
  }
  while(cacheIndex < MAX_CACHES_BEFORERESET)
  
  //Clean html tables if any
  cache_clean(CACHE_TASKS_HTML_KEY);
}

function cache_getNextPotentialCache(taskIndex)
{
    return "tasks" + (Math.floor(taskIndex/NTASKS_PER_CACHE)+1);
}


function cache_getNextCacheName(taskIndex)
{
    return "tasks" + Math.floor(taskIndex/NTASKS_PER_CACHE);
}


function cache_getCacheJson(cacheName)
{
  let r = documentCache.get(cacheName);
  if (r !=null)
    return JSON.parse(r);
  
  return null;
}

/**
 * 
 * 
 */
function cache_putTask(taskRow,taskId)
{
  let cacheIndex=1
  let cacheName = "tasks"+cacheIndex;
  let nCacheVisited=0;
  do
  {
    let r = documentCache.get(cacheName);

    if(r!=null )
    {
      if ( r.length < MAX_SIZE_INCACHE-20)
      {
        let jsonData = JSON.parse(r);
        jsonData[taskId]= taskRow;
        try
        {
          documentCache.put(cacheName,JSON.stringify(jsonData));
        }
        catch(e)
        {
          errors_logErrorAndEmail(e.message);
          return false;
        }
        return true;
      }
      nCacheVisited++;
    }
    else
      break;

  }
  while(r!=null);

  //On dout créer un nouveau cache
  cacheName=cache_getNextCacheName((nCacheVisited+1)*NTASKS_PER_CACHE);
  let allTasks={};
  var jsonData = {};
  jsonData[taskId]= taskRow;
  try
  {
      allTasks.tasks = jsonData;
      documentCache.put(cacheName,JSON.stringify(jsonData));
  }
  catch(e)
  {
    errors_logErrorAndEmail(e.message);
    return false;
  }

  return true;
}



/**
 * 
 * 
 */
function cache_deleteTask(taskRow,taskId)
{
  let cacheIndex=1
  let cacheName = "tasks"+cacheIndex;
  let nCacheVisited=0;
  do
  {
    let r = documentCache.get(cacheName);

    if(r!=null )
    {
      if ( r.length < MAX_SIZE_INCACHE-20)
      {
        let jsonData = JSON.parse(r);
        if ( jsonData[taskId] != null )
        {
          delete jsonData.taskId; 

          try
          {
            documentCache.put(cacheName,JSON.stringify(jsonData));
          }
          catch(e)
          {
            errors_logErrorAndEmail(e.message);
            return false;
          }
          finally{
            cache_clean(CACHE_TASKS_HTML_KEY);
          }
          
          return true;
        }
      }
      nCacheVisited++;
    }
    else
      break;

  }
  while(r!=null);

  //If we come here something went wrong. clear cache and redo
  if ( nCacheVisited > 0 )
  {
    errors_logErrorAndEmail("Delete tasks faild : taskId = " + taskId + ", taskRow= " + taskRow);
  }

  cache_cleanTasks();

  return false;
}


function cache_putAllTasks()
{
  //start from clean situation
  cache_cleanTasks()

  //cache actual tasks
  let sheet           = utils_getSheet(TASKS_SHEET);
  let lastRow         = sheet.getLastRow();
  let data            = sheet.getRange(DataTasksTableTaskIdRange+lastRow).getValues();
  let allTasks={ };
  var jsonData = {};

  let cacheIndex;
  let tasksInCurrentCache =0;
  let nCacheCreated=0;
  for (cacheIndex=1;cacheIndex<=data.length;cacheIndex++)
  {
      let taskRow       =cacheIndex+1;
      let task          =sheet.getRange(taskRow,1,1,ALL_COLUMNS.ncols).getValues()[0];
      let taskId        =task[COLUMNS.Id];


      jsonData[taskId]  = taskRow;
      tasksInCurrentCache++;

      if (tasksInCurrentCache==NTASKS_PER_CACHE)
      {
          nCacheCreated++;
          let cacheName = cache_getNextCacheName(nCacheCreated*NTASKS_PER_CACHE);
          allTasks.nTasks=NTASKS_PER_CACHE;
          allTasks.tasks = jsonData;
          documentCache.put(cacheName,JSON.stringify(allTasks));

          allTasks={};
          jsonData = {};
          tasksInCurrentCache=0;
      }
  }

  //cache le reste
  if ( tasksInCurrentCache > 0)
  {
    nCacheCreated++;

    let cacheName = cache_getNextCacheName(nCacheCreated*NTASKS_PER_CACHE);
    allTasks.nTasks=tasksInCurrentCache;
    allTasks.tasks = jsonData;
    documentCache.put(cacheName,JSON.stringify(allTasks));
  }
}

function cache_clean(key)
{
  documentCache.remove(key);
}

//============================= RAW HTML CACHE INTERFACE =================

function cache_putHtml(key,html)
{
  cache_clean(key);
  documentCache.put(key,html,3600);
}

function cache_getHtml(key)
{
  return documentCache.get(key);
}

//======================= TRANSACTION S ========================
/**
 * 
 * Cache only the receipt ids with header the. we get immediately the row number
 */
function cache_setAnnualTransactions(data,minutes)
{
  documentCache.remove("annualTransactions");

  let rid=[];
  for(let i=0;i<data.length;i++)
    rid.push(data[RECEIPTID_INTRANSACTIONDATA_SHEET-1])

  documentCache.put("annualTransactions",rid,minutes*60);
}

function cache_getAnnualTransactionsRow(receiptId)
{
  let index=-1;
  let rid = documentCache.get("annualTransactions");
  if (rid !=null)
    index = rid.indexOf(receiptId);

  if (rid==null || index==-1)
  {
    let data = utils_getSheet(ANNUAL_TRANSACTIONS_SHEET).getDataRange().getValues();

    cache_setAnnualTransactions(data,60); //cache expire dans 60 minutes

    return cache_getAnnualTransactionsRow(receiptId);
  }

  return utils_getSheet(ANNUAL_TRANSACTIONS_SHEET).getRange(index,1,1,DETAILS_INTRANSACTIONDATA_SHEET);
}

