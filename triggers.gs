function checkCleaning(triggerName)
{
    let clean = getCleanTriggers();
    if (clean==1)
    {
      removeTrigger(triggerName);
      errors_logError("Le trigger : " + triggerName + " a été effacé");  
      return false;
    }

    return true;
}

function checkTimeValidity()
{
    if ( utils_getCurrentYear() != getDashboardYear() )
    {
        errors_logError("L'année sous gestion. ne correspond pas à l'année en cours. Les données ne seront rafaîchies qu'après la finalisation de la paramérisation.du  tableau de bord");  
        return false;
    }

    return true;
}

function askTriggersManager(triggerName)
{
  if ( checkCleaning(triggerName) == false )
    return false;

  switch (triggerName)  
  {
        case "triggerAnnualOrdersRequest":
          if ( checkTimeValidity() == false)
            return false;
        break;

        case "alertMiseAJourTableau":
        break;

        default:
        break;
    }

    return true;
}


function trigger_updateRetroDataSheet(listOfNewOrders)
{
    let retroDataSheet = utils_getSheet(RETRODATA_SHEET);

    for (let i = 0;i<listOfNewOrders.length;i++)
    {
       retroDataSheet.appendRow(listOfNewOrders[i]);
    }
}

function trigger_DashboardYearOrders()
{
    try
    {
      let dashboardYear =getDashboardYear();
      let sheet = utils_getSheet(DATA_SHEET);

      //return all new orders only
      return etsy_getAllOrdersForYear(dashboardYear, DATA_SHEET);
    }
    catch(err)
    {
      errors_logError(err.message);
    }

    return -1;
}


function trigger_checkStockAndFavors()
{
  checkStockAndFavors();
}


function trigger_forecastSalariesForMonth()
{
    let dashboardMonth = getAdminDashboardMonth();
    let dashboardYear = getDashboardYear();
    
    if (utils_getCurrentYear()==dashboardYear)
      forecastSalariesForMonth(dashboardMonth)
} 


/**
 * 
 * Refresh the full list of orders for the current year and many susequent treatments, see code
 */
function triggerAnnualOrdersRequestScheduled() 
{
    trigger_AnnualOrdersRequest(false) 
}     

function trigger_AnnualOrdersRequest(manual=false) 
{
    if (askTriggersManager("triggerAnnualOrdersRequest") )
    {
        let allNewOrders = trigger_DashboardYearOrders();

        log_RessourceTaskForm("allNewOrders : " + allNewOrders.length);
        if (allNewOrders.length > 0)
        {
          //===========================================================================================
          //We got new orders
          //===========================================================================================
          utils_wait(2);

          /*============ update Retrospective data ======= */
          let retroSheetDone=false;
          trigger_updateRetroDataSheet(allNewOrders);
          retroSheetDone=true;
          /*==================================================*/

          /*============ update customer table ======= */
          cust_rebuildCustomerTable(allNewOrders);
          //==================================================

          /*============ update Transqactions tables ======= */
          db_updateAnnualTransactionsTable(allNewOrders);
          db_updateRetroTransactionsTable(allNewOrders);
          //==================================================

          /*=========== Redo the entire inventory ============*/
          stock_getAllShopListings();
          //==================================================

          if ( !manual )
          {
            /*============ mailing ======= */
            let date = getLocalTime();
            let infoToMail = "<html><br>Données mises à jour le: " + date + ", avec " + allNewOrders.length + " nouvelle(s) commande(s)<br> ";

            infoToMail += '<a href="https://docs.google.com/spreadsheets/d/14R6wJO2t38yXUfHGRXjIm06NgQvHt-J8pLknq021Fb0/edit?usp=sharing">'+
                                  "Tableau de bord</a><br></html>";

            mailing_sendMail("Mise à jour des données Soukcircus",infoToMail,getEmailIT());
          }
        }
    }
}



function getNotificationEmail(notifReason, language)
{ 
  let ret = [];
  switch (notifReason)
  {
    case NOTIF_REASON.RETURNING: 
      ret.push("Welcome back");
      ret.push("Happy to see you again....");
    break;
    case NOTIF_REASON.NEWCUSTOMER: 
      ret.push("Welcome at Soukcircus");
      ret.push("Happy to welcome you as one of our new customers....");
    break; 
    case NOTIF_REASON.FEEDBACK: 
      ret.push("Your feedback is precious")
      ret.push("We would be happy to have your feedback...."); 
    break;
    default:
    break;
  }

  return ret;
}

function triggerNewOrReturningCustomerNotification(firstNewRow)
{
  //Retrieve all customers eliguble for a notification
  let newToNotify = findNewCustomersOfTheDay(firstNewRow); //firstNewRow is the first new row in the orders table.

  if ( newToNotify.length > 0 )
  {
    let  notifDate = new Date();
    let   notifSheet = utils_getSheet(NOTIFICATIONS_SHEET);

    for(let i=0;i<newToNotify.length;i++)
      notifSheet.appendRow(newToNotify[i]);

    let allCutomers = notifSheet.getDataRange().getValues();

    let MAXNUMBER_OF_NOTIFICATIONS = 20; //Avoid stopping mailing system with too much calls

    //Start to 1 to skip the header
    for(let i=1;i<allCutomers.length && MAXNUMBER_OF_NOTIFICATIONS >=0 ;i++)
    {
        if ( allCutomers[i][STATUS_INNOTIF_SHEET-1]==NOTIF_STATUS.TBD )
        {
            let email = [];

            email.push(allCutomers[i][EMAIL_INNOTIF_SHEET-1]);

            let language = "en";
            switch (allCutomers[i][COUNTRY_INNOTIF_SHEET-1])
            {
              case COUNTRIES_LANG.CH[0]:
                language =  COUNTRIES_LANG.CH[1];
              break;
              case COUNTRIES_LANG.DE[0]:
                language =  COUNTRIES_LANG.DE[1]; 
              break;
              case COUNTRIES_LANG.FR[0]:
                language =  COUNTRIES_LANG.FR[1]; 
              break;
              case COUNTRIES_LANG.GB[0]:
                language =  COUNTRIES_LANG.GB[1]; 
              break;
              case COUNTRIES_LANG.US[0]: 
                language =  COUNTRIES_LANG.US[1];
              break;
              case COUNTRIES_LANG.NL[0]: 
                language =  COUNTRIES_LANG.NL[1];
              break;
              default: //use english
                language =  COUNTRIES_LANG.US[1];
              break
            }

          let emailToSend=[];

          if ( allCutomers[i][REASON_INNOTIF_SHEET-1]==NOTIF_REASON.NEWCUSTOMER )
          {
            emailToSend=getNotificationEmail(NOTIF_REASON.NEWCUSTOMER,language);

          }
          else if ( allCutomers[i][REASON_INNOTIF_SHEET-1]==NOTIF_REASON.RETURNING )
          {
              emailToSend=getNotificationEmail(NOTIF_REASON.RETURNING ,language);
          }
          
          if ( emailToSend.length > 0 )
          {
            //mailing_sendMail(emailToSend[0],emailToSend[1],customers[i][EMAIL_INNOTIF_SHEET-1]);
            mailing_sendMail(emailToSend[0],emailToSend[1],getEmailIT());

            //update customer date notif and status
            notifSheet.getRange(i,NOTIFDATE_INNOTIF_SHEET).setValue(notifDate);
            notifSheet.getRange(i,STATUS_INNOTIF_SHEET).setValue(NOTIF_STATUS.DONE);

            MAXNUMBER_OF_NOTIFICATIONS--;
          }
        }
    }

    //Notify collaborators of these notifications mailing_getCollaborators
    let collabEmails = mailing_getCollaborators();
    //mailing_sendMail("Nouvelles notifications",
    //                "Merci de vérifier la feuille notifications dans le tableau de bord",collabEmails);
  }
}



function triggerCustomersForFeedback()
{
  let newToNotify = potentialUsersForFeedback();

  //NewToNotify contains the index in notification sheet and the record in notfication sheet
  //Logger.log(newToNotify);

  if ( newToNotify.length > 0 )
  {
    let   notifDate = new Date();
    let   notifSheet = utils_getSheet(NOTIFICATIONS_SHEET);
    let   notifSheetRows = notifSheet.getDataRange().getValues();

    for (let i=0;i<newToNotify.length;i++)
    {
        let userToNotify=newToNotify[i];

        for(let j=0;j< notifSheetRows.length;j++)
        {
          let customer = notifSheetRows[j]; 
          //Logger.log(customer[EMAIL_INNOTIF_SHEET-1] + "," +userToNotify[2] );

          if ( customer[STATUS_INNOTIF_SHEET-1]==NOTIF_STATUS.TBD && 
              customer[REASON_INNOTIF_SHEET-1]==NOTIF_REASON.FEEDBACK &&
              customer[EMAIL_INNOTIF_SHEET-1]==userToNotify[2])
          {
            let language = "en";
            switch (userToNotify[1])
            {
              case COUNTRIES_LANG.CH[0]:
                language =  COUNTRIES_LANG.CH[1];
              break;
              case COUNTRIES_LANG.DE[0]:
                language =  COUNTRIES_LANG.DE[1]; 
              break;
              case COUNTRIES_LANG.FR[0]:
                language =  COUNTRIES_LANG.FR[1]; 
              break;
              case COUNTRIES_LANG.GB[0]:
                language =  COUNTRIES_LANG.GB[1]; 
              break;
              case COUNTRIES_LANG.US[0]: 
                language =  COUNTRIES_LANG.US[1];
              break;
              case COUNTRIES_LANG.NL[0]: 
                language =  COUNTRIES_LANG.NL[1];
              break;
              default: //use english
                language =  COUNTRIES_LANG.US[1];
              break
            }

            //let emailToSend=getNotificationEmail(NOTIF_REASON.FEEDBACK,language);
            let emailToSend = getEmailForFeedBack(userToNotify[0],language,userToNotify[3]);

            if ( emailToSend != null  )
            {
              
              //mailing_sendMail(emailToSend.subject,emailToSend.body,newToNotify[2]);

              //mailing_sendMail(emailToSend.subject,emailToSend.body,"oldanisim@gmail.com,gianfranco.oldani@gmail.com");
              //mailing_sendMail(emailToSend.subject,emailToSend.body,"gianfranco.oldani@gmail.com");
              mailing_sendMail(emailToSend.subject,emailToSend.body,getEmailIT());

              //update customer date notif and status
              notifSheet.getRange(j+1,NOTIFDATE_INNOTIF_SHEET).setValue(notifDate);
              notifSheet.getRange(j+1,STATUS_INNOTIF_SHEET).setValue(NOTIF_STATUS.DONE);
            }
          }
        }
    }

    //Notify collaborators of these notifications mailing_getCollaborators
    //let collabEmails = mailing_getCollaborators();
    //mailing_sendMail("Nouvelles notifications de feedback envoyées",
    //                 "Merci de vérifier la feuille notifications dans le tableau de bord","gianfranco.oldani@gmail…com");
  }
}


/**
 * This method must be called after the update of the retro data sheet
 */
function findNewCustomersOfTheDay(firstNewRow)
{
        //Find new customers
      let retroDataSheet = utils_getSheet(RETRODATA_SHEET);
      let currDataSheet = utils_getSheet(DATA_SHEET);
      let lastRetroRow = retroDataSheet.getLastRow();
      let lastRow = currDataSheet.getLastRow();

      let oldEmailsSheet  = retroDataSheet.getRange(1,EMAIL_INDATA_SHEET,lastRetroRow).getValues();
      let oldDatesSheet   = retroDataSheet.getRange(1,DATE_INDATA_SHEET,lastRetroRow).getValues();
      let newEmailsSheet  = currDataSheet.getRange(firstNewRow,EMAIL_INDATA_SHEET,lastRow-firstNewRow+1).getValues();
      let newDatesSheet   = currDataSheet.getRange(firstNewRow,DATE_INDATA_SHEET,lastRow-firstNewRow+1).getValues();
      let newCountrySheet = currDataSheet.getRange(firstNewRow,COUNTRY_INDATA_SHEET,lastRow-firstNewRow+1).getValues();
      let newNamesSheet = currDataSheet.getRange(firstNewRow,CUSTNAME_INDATA_SHEET,lastRow-firstNewRow+1).getValues();

      let oldEmails = []
      let oldDates=[];
      let newEmails=[];
      let newDates=[];
      let newCountries=[];
      let newOrReturningCustomers = [];

      for(let i=0;i<newEmailsSheet.length;i++)
          newEmails.push(newEmailsSheet[i][0]);

      for(let i=0;i<newDatesSheet.length;i++)
          newDates.push(newDatesSheet[i][0]);

      for(let i=0;i<newCountrySheet.length;i++)
          newCountries.push(newCountrySheet[i][0]);

      for(let i=1;i<oldEmailsSheet.length;i++)
          oldEmails.push(oldEmailsSheet[i][0]);
          
      for(let i=1;i<oldDatesSheet.length;i++)
          oldDates.push(oldDatesSheet[i][0]);

      oldEmails.reverse();
      oldDates.reverse();

      let pushingDate = new Date();
      for(let i=0;i<newDatesSheet.length;i++)
      {
          let index = oldEmails.indexOf(newEmails[i]);

          if (  index == -1 )
          {
            let newCust=[];
            newCust.push(pushingDate);
            newCust.push(0)
            newCust.push(CUSTOMER_TYPE.NEW);
            newCust.push(newNamesSheet[i]);
            newCust.push(newEmails[i]);
            newCust.push(newCountries[i]);
            newCust.push(NOTIF_REASON.NEWCUSTOMER);
            newCust.push(NOTIF_STATUS.TBD);
            newOrReturningCustomers.push(newCust);
          }
          else
          {
            let deltaDays = (newDates[i] - oldDates[index])/NSEC_PER_DAY;
            if ( deltaDays > 100 )
            {
              let newCust=[];
              newCust.push(pushingDate);
              newCust.push(deltaDays)
              newCust.push(CUSTOMER_TYPE.RETURNED);
              newCust.push(newNamesSheet[i]);
              newCust.push(newEmails[i]);
              newCust.push(newCountries[i]);
              newCust.push(NOTIF_REASON.RETURNING);
              newCust.push(NOTIF_STATUS.TBD);
              newOrReturningCustomers.push(newCust);
            }
          }
      }

      return newOrReturningCustomers;
}


function initCustomerNotifSheet()
{
      let allNotifRows=[];

      //Find new customers
      let notifSheet = utils_getSheet(NOTIFICATIONS_SHEET);
      notifSheet.clear();

      let header = ["CreationDate","ReturnedAfterDays","Type",	"Name",	"Email",	"Country",	"NotificationReason",	"Status",	"NotificationDate"];

      allNotifRows.push(header);

      let retroDataSheet = utils_getSheet(RETRODATA_SHEET);
      let entries = retroDataSheet.getDataRange().getValues();
      let alreadyDone=[];
      let pushingDate = new Date();

      for(let i=1;i<entries.length;i++)
      {
          if (alreadyDone.indexOf(entries[i][EMAIL_INDATA_SHEET-1]) == -1)
          {
            let newCust=[];
            newCust.push(pushingDate);
            newCust.push(0)
            newCust.push(CUSTOMER_TYPE.STD);

            newCust.push(entries[i][CUSTNAME_INDATA_SHEET-1]);
            newCust.push(entries[i][EMAIL_INDATA_SHEET-1]);

            newCust.push(entries[i][COUNTRY_INDATA_SHEET-1]);

            newCust.push(NOTIF_REASON.FEEDBACK);
            newCust.push(NOTIF_STATUS.DONE);
            newCust.push(pushingDate);

            alreadyDone.push(entries[i][EMAIL_INDATA_SHEET-1]);

            allNotifRows.push(newCust);
          }
      }

      notifSheet.getRange(2, 1,allNotifRows.length,header.length).setValues(allNotifRows);
}


function getCustomerLstOrder(email,currDataSheetValues)
{
  let lastDate=null;
  for(let i=0;i<currDataSheetValues.length;i++)
  {
    if (currDataSheetValues[i][EMAIL_INDATA_SHEET-1]==email)
    {
      return currDataSheetValues[i];
    }
  }

  return null;
}


function getItemDescriptionFromListings(listingIds)
{
  let  listingsSheet = utils_getSheet(LISTINGS_SHEET).getDataRange().getValues();
  let retDesc=[];

  for(j=0;j<listingIds.length;j++)
  {
    let lid = listingIds[j]
    for (let i=0;i<listingsSheet.length;i++)
    {
      if (listingsSheet[LISTINGID_ININVENT-1]==lid)
        retDesc.push(listingsSheet[TITLE_ININVENT-1]);
    }
  }

  return retDesc;
}


function potentialUsersForFeedback() 
{
  let  currDataSheetValues = utils_getSheet(DATA_SHEET).getDataRange().getValues();
  
  currDataSheetValues.reverse();

  let  notifSheet = utils_getSheet(NOTIFICATIONS_SHEET);
  let  notificationEntries = notifSheet.getDataRange().getValues();
  let   currDate = new Date();
  let   retUsers=[];

  for (let i=1;i< notificationEntries.length;i++)
  {
    let entry = notificationEntries[i];
    let reason = entry[REASON_INNOTIF_SHEET-1];
    let notifStatus = entry[STATUS_INNOTIF_SHEET-1];

    /* ONLY FOR FEEDBACKS */
    if (reason == NOTIF_REASON.FEEDBACK && notifStatus==NOTIF_STATUS.TBD)
    {
      /* Get las orer as in data table */
      lastOrder= getCustomerLstOrder(entry[EMAIL_INNOTIF_SHEET-1],currDataSheetValues);

      if ( lastOrder != null )
      {
        /*Verify that the last order was at least one month*/
        let lastOrderDate = lastOrder[DATE_INDATA_SHEET-1];

        let deltaDays = (currDate - lastOrderDate)/NSEC_PER_DAY;
        if ( deltaDays >= 30 )
        {
            let aUser=[];
          //After one year we ask again for a feedback
          aUser.push(lastOrder[CUSTNAME_INDATA_SHEET-1]); // Customer name
          aUser.push(lastOrder[COUNTRY_INDATA_SHEET-1]); // Country code
          aUser.push(lastOrder[EMAIL_INDATA_SHEET-1]); //Customer email

          let trans = utils_decodeObject(lastOrder[TRANSACTIONS_INDATA_SHEET-1]);
          let allListings=[];
          for (let ntr=0;ntr<trans.length;ntr++)
            allListings.push(trans[ntr].listingId);

          aUser.push(getItemDescriptionFromListings(allListings)); //list of items bought

          retUsers.push(aUser);
        }
      }
    }
  }  

  return retUsers;

}




function checkStockAndFavors()
{
    let favorThreshold = getFavorThresholdToTriggerMailing();
    let stockThreshold = getStockThresholdToTriggerMailing();
    if ( favorThreshold >= 0 || stockThreshold >= 0)
    {
        let refDate = utils_addDaysFromDate(new Date(),-2);

        //Redo listings
        getListingsByListingIds();
        //========================
        
        let list = getStockAndFavoredFromListings(refDate);

        if ( favorThreshold >= 0 )
        {
          let urls = [];
          for (let i = 0;i< list.length;i++)
          {
            entryList = list[i];

            let dateCreated = entryList[0];
            let numFavor = entryList[1];
            if (numFavor >= favorThreshold && dateCreated >= refDate )
            {
              urls.push([entryList[3],numFavor]);
            }
          }

          if (urls.length > 0)
          {
            mailing_notifyFavorCollaborators(urls);
          }
        }

        if ( stockThreshold >= 0 )
        {
          let urls = [];
          for (let i = 0;i< list.length;i++)
          {
            entryList = list[i];

            let dateCreated = entryList[0];
            let numInStock = entryList[2];
            if (numInStock <= stockThreshold && dateCreated >= refDate )
            {
              urls.push([entryList[3],numInStock]);
            }
          }

          if (urls.length > 0)
          {
            mailing_notifyStockCollaborators(urls);
          }
        }
    }
}
function test_triggerRecomputeSalaries()
{
  triggerRecomputeSalaries(2022,0)
}



/**
 * Utilitarians====================================================================================
 */

function setupOnFraisTrigger()
{
  ScriptApp.newTrigger("onFraisSubmit").forForm("1mmFTHBRdGy1-dhDFNsDe2Nb9MX2231qQKhSRlbfOYdE").onFormSubmit().create();  
}

function setupOnCusomerFeedbackSubmitTrigger()
{
  ScriptApp.newTrigger("onCusomerFeedbackSubmit").forForm("1mcsfhcxYQ9KXzZr-no6jUySijUDEnsfVxdO1V6znUyo").onFormSubmit().create(); 
}

function setOnCreateTaskSubmitTrigger()
{
  ScriptApp.newTrigger("onCreateTask").forForm("1XPlhuJtOpcsSdr14WFGK6KoPjueO0fpHtZqr7lYs1Do").onFormSubmit().create(); 
}

function setRessourceAccomplishmentTrigger(formId)
{
  ScriptApp.newTrigger("onRessourceAccomplishmentForm").forForm(formId).onFormSubmit().create(); 
}

function removeTriggerForFormSource(formId)
{
  let triggers = ScriptApp.getScriptTriggers();

  for (i=0;i<triggers.length;i++)
  {
    let aTrigger = triggers[i];

    //log_RessourceTaskForm("Source Id = "+ aTrigger.getTriggerSourceId() + ",  " +formId);
    if ( aTrigger.getTriggerSourceId() == formId )
    {
        ScriptApp.deleteTrigger(aTrigger);
        return formId;
    }
  }
  return null;
}

function removeTriggerTest()
{
  removeTrigger("triggerAnnualOrdersRequest");
}

function removeTrigger(triggerName)
{
    var triggers = getProjectTriggersByName(triggerName);
    for (var i = 0; i < triggers.length; ++i)
        //ScriptApp.deleteTrigger(triggers[i]);
        Logger.log(triggers[i].getHandlerFunction());
}

function getProjectTriggersByName(name) {
    return ScriptApp.getProjectTriggers().filter(
        function(s) {return s.getHandlerFunction() === name;}
    );
}

/**
 * 
 * Daily copy of orders and transactions in external file for use by app sheets Souk Orders and Souk Inventory
 */

const SOUK_INVENTORY_FILE_ID    = "12Qvh39oVsuazqU9mMhx8R0w5JQvnzCjbbTSphGW8nrw"; //For Souk Inventory app sheet
const SOUK_TRANSACTION_FILE_ID  = "1TsS_unGQucuV6aDvYM1d7kminz5DFnpWq-4W82QH-5Q"; //For Souk Orders app sheet 
const SOUK_SHIPPEDITEMS_FILE_ID = "1ANzl_WzUcGcRhCrkaEazvUQ_1avVz9_FChNDINUXufY";

function trigger_updateExternalSources()
{
  //Update Shipping Session with shipped transactions
}






