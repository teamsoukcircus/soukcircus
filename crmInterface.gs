


function crm_getTable()
{
    let sheet = utils_getSheet(CUSTOMER_SHEET);
    let data = sheet.getRange(2,1,sheet.getLastRow()-1,LASTCOLUMN_CUSTOMER_SHEET).getValues();

    for(let i=0;i<data.length;i++)
    {
        data[i][2] = utils_getLanguageName(data[i][2])
        data[i][3] = utils_formatDateForPicker(data[i][3]);
        data[i][5] = data[i][LASTCOLUMN_CUSTOMER_SHEET-1];
    }

    return JSON.stringify(data);
}



// Today
var crm_today = new Date();

// My email address
//var myEmailAddress = Session.getActiveUser().getEmail();
var myEmailAddress = "teamsoukcircus@gmail.com";
//var myEmailAddress = "soukcircus@gmail.com";

// Parameters
function crm_CleanCache()
{
  CacheService.getScriptCache().remove("lastRow");
}


function allEmailsInLabels() 
{
 var threads = GmailApp.getInboxThreads();

for (var i = 0; i < threads.length; i++) 
{
  Logger.log("First msg subject: " + threads[i].getFirstMessageSubject());
  let threadMsg = threads[i].getMessages()
  Logger.log(threadMsg.length);
  for(let i=0;i<Math.max(threadMsg.length,10);i++)
  {
    if ( threadMsg[i] != null )
    {
      Logger.log(threadMsg[i].getFrom());
      Logger.log(threadMsg[i].getSubject())
    }
  }
}
Logger.log("===============================")
var threads = GmailApp.search(' from:'+myEmailAddress);
for (var i = 0; i < threads.length; i++) 
{
  Logger.log("First msg subject: " + threads[i].getFirstMessageSubject());
  let threadMsg = threads[i].getMessages()
  for(let i=0;i<Math.max(threadMsg.length,10);i++)
  {
    if ( threadMsg[i] != null )
    {
      Logger.log(threadMsg[i].getTo())
      Logger.log(threadMsg[i].getSubject())
    }
  }
}
};


/**
 * Lists all labels in the user's mailbox
 * @see https://developers.google.com/gmail/api/reference/rest/v1/users.labels/list
 */
function listLabels() {
  try {
    // Gmail.Users.Labels.list() API returns the list of all Labels in user's mailbox
    const response = Gmail.Users.Labels.list('me');
    if (!response || response.labels.length === 0) {
      // TODO (developer) - No labels are returned from the response
      Logger.log('No labels found.');
      return;
    }
    // Print the Labels that are available.
    Logger.log('Labels:');
    for(let index in response.labels ) {
      // TODO (developer) - use the labels returned from the list() API
      Logger.log('- %s', response.labels[index].name);
    }
  } catch (err) {
    // TODO (developer) - Handle exception on Labels.list() API
    Logger.log('Labels.list() API failed with error %s', err.toString());
  }
}



function testGmail()
{ 
  let theirEmail ;

 // let sheet = utils_getSheet(CUSTOMER_SHEET);
 // let cust = sheet.getRange(2,2,sheet.getLastRow()-1,1).getValues();

  //for(let i=0;i<cust.length;i++)
  {
      theirEmail = "conversations@mail.etsy.com"

      //Logger.log(theirEmail);

      var threads = GmailApp.search('from:'+ theirEmail + ' to:'+myEmailAddress);
      //var threads = GmailApp.search(' to:'+myEmailAddress);

      //var threads = GmailApp.search('from:'+myEmailAddress + ' to:'+theirEmail);
      //var threads = GmailApp.getInboxThreads();
      var latestDate = new Date(1970, 1, 1);
      
      var starredMsg = "";
      var threadStatus = ""

      
      if ( threads.length > 0 )
      {
        Logger.log(threads.length);
        for (var thread in threads) 
        {  
          // Grab the last message date for this thread
          var threadDate = threads[thread].getLastMessageDate();
                            
          // If this is the latest thread we've seen so far, make note!
          //if (threadDate > latestDate) {
          { 
            latestDate = threadDate;
            
            // Check to see if we starred the message (we may be back to overwrite this)
            if (threads[thread].hasStarredMessages()) {
              starredMsg = "Y";
            } else {
              starredMsg = "";
            }           
            
            
            // Open the thread to see who was the last to speak
            var messages = threads[thread].getMessages();
            var totalMessages = messages.length;
            var lastMsg = messages[messages.length-1];
            var lastMsgFrom = lastMsg.getFrom();
            
            for(let mi=0;mi<totalMessages;mi++)
            {
              Logger.log(messages[mi].getSubject())
            }

            // Use regex so we can make our search case insensitive
            var reTheirEmail = new RegExp(theirEmail,"i");
            var reMyEmail = new RegExp(myEmailAddress,"i");

          
            if (lastMsgFrom.search(reTheirEmail) >= 0) 
            {
              if (totalMessages == 1) 
                threadStatus = "They emailed me, I haven't replied";
              else
                threadStatus = "We had an email exchange, they replied last";

            } 
            else if (lastMsgFrom.search(reMyEmail) >= 0) 
            {
              if (totalMessages == 1)
                threadStatus = "Email envoyé, pas encoere de réponse" //"I emailed them, they haven't replied";
              else
                threadStatus =  "Emails échangés, nous sommes les derniers à avoir répondu"; //"We had an email exchange, I replied last";            
            } 
            else 
              threadStatus = "Une discussion avait commençé, elle est pour l'instant en. suspend" 
                            //"We were on a thread together, neither of us replied last"; 

            Logger.log(threadStatus + "," + lastMsgFrom) ;          
          }
        }
      }
  }
}

function crm_CRMHandler() 
{
  
  // Use the cache to determine how far we got last time before the inevitable 5 minute Google timeout
  var cache = CacheService.getScriptCache(); 
  var lastRowProcessed = cache.get("lastRow")*1.0;
  
  // If this cache doesn't yet exist, create it and set last row to 1
  if (lastRowProcessed == null || lastRowProcessed == 0) 
  {
    lastRowProcessed = 1;
    cache.put("lastRow", lastRowProcessed, 60*60*24); // cache for 25 minutes
  }  
  
  // Keep track of where we started 
  var startingRow = lastRowProcessed;
  
  // Connect to our active sheet and collect all of our email addresses in the second column
  var sheet = utils_getSheet(CUSTOMER_SHEET);
  var totalRows = sheet.getLastRow();
  var range = sheet.getRange(2, CUSTOMER_EMAIL, totalRows, 1);
  var emails = range.getValues();  
  
  // Attempt to iterate through 100 times (although we'll timeout before this)
  for (var cntr = 0; cntr<emails.length; cntr++ ) 
  {  
    // If we've reached the end of our last, wrap to the front
    if (lastRowProcessed >= totalRows) lastRowProcessed = 1;
    
    // Increment the row we're processing
    var currentRow = lastRowProcessed+1;
    
    // If we've been through all records, bail
    if (currentRow == startingRow)
      break; 
    
    // Get the email address from the current row
    var theirEmail = emails[currentRow-2][0].trim();
    
    // If the email address field is empty, skip to the next row
    if (theirEmail != null && theirEmail != "") 
    {
        // Look for all threads from me to this person
        var threads = GmailApp.search('from:'+myEmailAddress+ ' to:'+theirEmail);
        
        // Add a quick pause so we don't run into rate limiting issues with gmail
        Utilities.sleep(20);
        
        // If there are no threads, I haven't emailed them before
        if (threads.length == 0) 
        {  
          // Update the spreadsheet row to show we've never emailed
          var range = sheet.getRange(currentRow, COLUMN_WHERE_MAGIC_BEGINS,1, 4 ).setValues([["JAMAIS  CONTACTE", "", "", ""]] );
          
          //  And cary one
          lastRowProcessed = currentRow;
          cache.put("lastRow", currentRow, 60*60*24); // cache for 25 minutes    
          continue;
        }
        
        
        // Beyond a reasonable doubt
        var latestDate = new Date(1970, 1, 1);
        
        var starredMsg = "";
        var threadStatus = ""

        // Iterate through each of the message threads returned from our search
        for (var thread in threads) 
        {  
          // Grab the last message date for this thread
          var threadDate = threads[thread].getLastMessageDate();
                            
          // If this is the latest thread we've seen so far, make note!
          if (threadDate > latestDate) {
            
            //latestDate = threadDate;
            
            // Check to see if we starred the message (we may be back to overwrite this)
            if (threads[thread].hasStarredMessages()) {
              starredMsg = "Y";
            } else {
              starredMsg = "";
            }           
            
            
            // Open the thread to see who was the last to speak
            var messages = threads[thread].getMessages();
            var totalMessages = messages.length;
            var lastMsg = messages[messages.length-1];
            var lastMsgFrom = lastMsg.getFrom();
            
            
            // Use regex so we can make our search case insensitive
            var reTheirEmail = new RegExp(theirEmail,"i");
            var reMyEmail = new RegExp(myEmailAddress,"i");

            // If we can find their email address in the email address from the last message, they spoke last
            // (we may be back to overwrite this)
            /*
            var rawEmail = lastMsg.getRawContent();
            var reCal1 = new RegExp('text\/calendar',"i");
            var reCal2 = new RegExp('calendar-notification',"i");
            if (theirEmail == "dledger@gmail.com") {
              var hereWeStop = true; 
              Logger.clear();
              Logger.log(rawEmail);
            }
            
            if (rawEmail.search('text/calendar') >= 0 || rawEmail.search('calendar-notification') >= 0) {
              // Ignore it unless this is the only correspondence so far
              threadStatus = "We were on a calendar invite together"
            }         
            else */
            if (lastMsgFrom.search(reTheirEmail) >= 0) 
            {
              if (totalMessages == 1) 
                threadStatus = "They emailed me, I haven't replied";
              else
                threadStatus = "We had an email exchange, they replied last";

            } 
            else if (lastMsgFrom.search(reMyEmail) >= 0) 
            {
              if (totalMessages == 1)
                threadStatus = "Email envoyé, pas encoere de réponse" //"I emailed them, they haven't replied";
              else
                threadStatus =  "Emails échangés, nous sommes les derniers à avoir répondu"; //"We had an email exchange, I replied last";            
            } 
            else 
              threadStatus = "Une discussion avait commençé, elle est pour l'instant en. suspend" 
                            //"We were on a thread together, neither of us replied last";            
          }
        }
      
        // Determine how many days have passed since our last correspondence 
        var daysSinceContact = Math.round(Math.abs((crm_today.getTime() - latestDate.getTime())/(NSEC_PER_DAY)));
        
        // Format the date so it plays nicely with Google Sheets
        sheet.get
        var latestDate = Utilities.formatDate(latestDate, SpreadsheetApp.getActive().getSpreadsheetTimeZone(),  "MMM d yyyy");
        
        // Write the row!
        var range = sheet.getRange(currentRow, COLUMN_WHERE_MAGIC_BEGINS, 1, 4 ).setValues([[latestDate, daysSinceContact, starredMsg, threadStatus]] );
        
        // update cache
        cache.put("lastRow", currentRow, 60*60*24); 
        
        // update lastRowProcessed
        lastRowProcessed = currentRow;
        
        // Log it (mostly to see how many of these we're making it through per run
        Logger.log("processed "+currentRow);
    }
    else
    {
       lastRowProcessed = currentRow;
        cache.put("lastRow", currentRow, 60*60*24);  
    }
  }
}