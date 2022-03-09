

const THREAD_MAX = 25;

function test_getTaskThread()
{
  Logger.log(getTaskThreads(34)) 
}
function getTaskThreads(taskId)
{

  let sheet = utils_getSheet(DISCUSSION_THREADS);
  let threads = sheet.getRange("A2:A").getValues()[0];
  let retThreads = {};
  let nThreads=0;

  retThreads.nThreads= nThreads;

  for(let i=0; i < threads.length;i++)
  {
    if ( threads[i]==taskId)
    {
        let values = sheet.getRange(i+2,2,1,25).getValues()[0];
        let retDiscussions=[];

        for (let j=0;j<values.length;j++)
        {
          if (values[j].trim().indexOf("$") != -1)
          {
            let split = utils_splitString(values[j],"$");
            retDiscussions.push({date:split[0], destinee:split[1], text:split[2]});
            nThreads++;
          }
          else
            break;
        }

        retThreads.nThreads=nThreads;
        retThreads.threadRow=i+2; ///+2 grrrrrrr...
        retThreads.discussions= retDiscussions;
    }
  }

  return retThreads;
}

function test_createNewThread()
{
  let newThread={};
  newThread.taskNo = 34;
  //newThread.threadRow = 2;
  newThread.date = utils_FormatThisDate(new Date(), ENUM_DATE_FORMAT.LONG_HHMMSS);
  newThread.text = "iuertzoiuqwerztoiquwezrtoiuwzretoi";
  newThread.destinee = "Simon";

  createNewThread(newThread);
}

function createNewThread(thread)
{
  let sheet = utils_getSheet(DISCUSSION_THREADS);

  if ( thread.threadRow == null || thread.threadRow=='')
  {
    thread.threadRow=2;
    sheet.getRange(2,1,1,1).setValue(thread.taskNo); 
    let value = utils_FormatThisDate(new Date(), ENUM_DATE_FORMAT.LONG_HHMMSS) + "$" + thread.destinee + "$" + thread.text;
    sheet.getRange(thread.threadRow,2,1,1).setValue(value); 
    return;
  }

  let range = sheet.getRange(thread.threadRow,1,1,25).getValues()[0];
  for (let i = 0;i<range.length;i++)
  {
    if (range[i] == "")
    {
      let value = utils_FormatThisDate(new Date(), ENUM_DATE_FORMAT.LONG_HHMMSS) + "$" + thread.destinee + "$" + thread.text;
      sheet.getRange(thread.threadRow,i+1,1,1).setValue(value); 
      break;
    } 
  }

}
