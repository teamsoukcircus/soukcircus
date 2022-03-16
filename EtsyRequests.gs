/**
 * 
 */
const sliceSize=100;


/**
 * 
 */
function toTimestamp(year,month,day,hour,minute,second){
    var datum = new Date(year,month-1,day,hour,minute,second);
    //console.log(datum);
    return Math.round(datum.getTime()/1000);
   }

/**
 * 
 */
function daysInMonth (year, month) {
    return new Date(year, month, 0).getDate();
}


/* =========================== ETSY ============================= */
const CLIENT_ID = "f3vaa2e0dclzh177bmdz2pr6";
const CLIENT_SECRET="mtbfyp2e20";
const CODE_VERIFYER="ARzxEupyjZAL-5cDjIY2pBRgIobHs7TTHtbqx9S6qps";
const CODE_CHALLENGE = "GNOI7H4EuLwKz8dSOS2e5gMJrap7Or2Ar8Q6Mv1M7d8";
const CODE_CHALLENGE_METHOD = "S256";
const ETSY_SERVICENAME = "etsy";
const AUTHORIZ_BASEURL="https://www.etsy.com/oauth/connect";
const TOKEN_URL="https://api.etsy.com/v3/public/oauth/token";
/* =========================== ETSY ============================= */

/**=======================================================================================================================
 *                    function etsy_getService(scopes=null) 
 =======================================================================================================================*/
function etsy_getService(scopes=null) {
  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
  let service = OAuth2.createService(ETSY_SERVICENAME)

      // Set the endpoint URLs, which are the same for all ETSY services.
      .setAuthorizationBaseUrl(AUTHORIZ_BASEURL)
      .setTokenUrl(TOKEN_URL)

      // Set the client ID and secret, from the Google Developers Console.
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)

      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('etsyCallback')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())

      .setParam('code_challenge', CODE_CHALLENGE)

      .setParam('code_challenge_method', CODE_CHALLENGE_METHOD)
      
      .setTokenPayloadHandler(etsyTokenHandler);
    
    if (scopes==null)
     // Set the scopes to request (space-separated for Google services).
      service.setScope("address_r billing_r cart_r email_r favorites_r feedback_r listings_r profile_r recommend_r shops_r transactions_r")
    else
      service.setScope(scopes);

    return service;
}





/**
 * 
 */
function etsyCallback(request) {
  console.log(request);
  console.log("In etsyCallback");
  var EtsyService = etsy_getService();
  var isAuthorized = EtsyService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

/**
 * 
 */
function etsyTokenHandler(payload) {
  payload.code_verifier = CODE_VERIFYER;
  return payload;
}

/**
 * 
 */
function updateUpdateDataDate()
{
  utils_SetCellValueInSheet(MAIN_SHEET,cellAnnuelDateMiseAJour,utils_LocalGMTTimeFormatDate(ENUM_DATE_FORMAT.LONG_HHMMSS));
}
/**
 * 
 */


function updateStat()
{
  let actualTrend = getTrendNetEncaisse();

  let fitter = fitCumulatedData(cellAnnuelMoyenneLisseSurNetEncaisse);

  let slope = fitter.getSlope();

  setTrendNetEncaisse(slope);
  utils_SetCellValueInSheet(STATDATA_SHEET, cellStatTrendNetEncaisse,slope); 

  let delta = slope-actualTrend;
  if (delta < 0)
    showArrowOnMainSheet(cellImagesArrowDown);
  else if (delta > 0)
    showArrowOnMainSheet(cellImagesArrowUp);
  else
    showArrowOnMainSheet(cellImagesArrowRight); 
}

function updateMailingData()
{
  utils_duplicateAndRemoveSheet(DATA_SHEET,MAILING_DATA);
}

function updateAdmin()
{
  let month = utils_getCurrentMonth();
  setAdminEstimeNetEncaisse(month,computeNetEncaisseEstime(month));
}


const HEADER_ORDERS = 
["Date created", "Customer name","Country", "Customer email","Gross amount","Net amount", "Shipping cost","Net Income", "ReceiptId","Transactions","BuyerId","Is Shipped", "Date shipped",  "address", "formattedAddress", "Total Discount", "Total Taxes"];


const DATE_INDATA_SHEET = 1;
const CUSTNAME_INDATA_SHEET=2;
const COUNTRY_INDATA_SHEET = 3;

const EMAIL_INDATA_SHEET= 4;
const AMOUNT_INDATA_SHEET= 5;
const NETAMOUNT_INDATA_SHEET=6;

const SHIPPING_COSTEUR_INDATA_SHEET=7;
const NETINCOME_INDATA_SHEET=8;
const RECEIPTID_INDATA_SHEET=9;

const TRANSACTIONS_INDATA_SHEET=10;
const BUYER_ID_INDATA_SHEET=11
const IS_SHIPPED_INDATA_SHEET=12;

const DATE_SHIPPED_INDATA_SHEET=13;
const ADDRESS_INDATA_SHEET = 14;
const FORMATTEDADDRESS_INDATA_SHEET = 15;
const TOTALDISCOUNT_INDATA_SHEET = 16;
const TOTALTAXES_INDATA_SHEET = 17;


function getLastMonthToQuery(year)
{
  let currentYear = utils_getCurrentYear();
  let lastMonth  = utils_getCurrentMonth();
  if ( currentYear != year )
    return 12;
  else
    return utils_getCurrentMonth() +1 ; //utils function returns a 0 based month 
}

/**
 * Request uop to date data from ETSY Restful API
 */
function run_getAllOrdersForYear() 
{
    etsy_getAllOrdersForYear(2022, DATA_SHEET);
}


/** ================================================================================================
 *
 *                      function etsy_getAllOrdersForYear(year, targetTable)  
 * 
 ================================================================================================*/

let EtsyRequestSliceSize = 100;

function etsy_getAllOrdersForYear(year, targetTable) 
{
  let BulkDataRows=[];
  let NextRowFlush=2;

  //======================
  //Load exchange rates
  //=====================
  let ccyRates = ccy_loadRates() ;

  //=======================================
  // Retrieve data
  //=======================================
  let dataSheet = utils_getSheet(targetTable);
  let dataSheetLastRow = dataSheet.getLastRow();
  let orderIdsInTable = [];
  if ( dataSheetLastRow > 1)
  {
    let receiptIds = dataSheet.getRange(2,RECEIPTID_INDATA_SHEET,dataSheetLastRow-1,1).getValues();
    orderIdsInTable = new Array(receiptIds.length);
    for(let i =0;i<receiptIds.length;i++)
      orderIdsInTable[i] = receiptIds[i][0];
  }

  NextRowFlush = dataSheetLastRow + 1; // les données existentes ne sont pas écrasées.

  // GET DATA     
  //dataSheet.clear();
  //dataSheet.appendRow(HEADER_ORDERS);
  
  let EtsyService = etsy_getService();
  let orders = [];
  let allNewOrders=[];

  //Set last month to avoid inutile calls to the Etsy api
  let lastMonth2Query = getLastMonthToQuery(year);

  for (let month = 1 ; month <= lastMonth2Query ; month++)
  {
      const nDaysInMonth = utils_getDaysInMonth(month,year);
      const minC  = toTimestamp(year,month,1,0,0,0);
      const maxC  = toTimestamp(year,month,nDaysInMonth,23,59,59);

      let ordersOffset    = 0; 
      let remainingOrders =0;
      do
      {
        try
        {
          let theRequest = 
          `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts?&min_created=${minC}&max_created=${maxC}&limit=${EtsyRequestSliceSize}&was_paid=true&offset=${ordersOffset}`;


          let response = UrlFetchApp.fetch(theRequest, {
            headers: 
            {
              'x-api-key': CLIENT_ID,
              'Authorization': 'Bearer ' + EtsyService.getAccessToken()
            }
          });

          let theOrders = JSON.parse(response.getContentText());

          if ( theOrders.results.length  > 0 )
          {
            orders=[];

            for (let ic =0 ; ic < theOrders.results.length;ic++) 
            {   
                let etsyOrder = theOrders.results[ic];
                
                //====================================================
                //Retrieve the receipt and transactions for this order
                //====================================================
                let theReceiptId = etsyOrder.receipt_id;

                if ( orderIdsInTable.indexOf(theReceiptId) < 0)
                {
                    //=========================================
                    //This is a new order, lets take care of it
                    //=========================================
                    let transactionsForThisOrder=[];

                    if ( etsyOrder.transactions != null)
                    {
                        let orderTransactions = etsyOrder.transactions;

                        for(let jj=0;jj<orderTransactions.length;jj++)
                        {
                          if ( orderTransactions[jj] != null )
                          {        
                            let trans = orderTransactions[jj];
                            let oneTrans = {
                              "transId":        trans.transaction_id,
                              "receiptId":      trans.receipt_id,
                              "listingId":      trans.listing_id,
                              "productId":      trans.product_id,
                              "title":          trans.title,
                              "buyer_user_id":  trans.buyer_user_id,
                              "quantity" :      trans.quantity,
                              "price":          trans.price,
                              "shipping":       trans.shipping_cost,
                              "variations":     trans.variations
                            };

                            //Push a new gtransaction for this order
                            //=======================================
                            transactionsForThisOrder.push(oneTrans);

                          }
                        }
                    }

                    //In order to not get an error message for too fast rquest to ETSY API
                    utils_wait(GETSOLD_DELAY);

                    const  reqReceipt = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts/${theReceiptId}/payments`;
                    let responseReceipt = UrlFetchApp.fetch(reqReceipt, {
                      headers: {
                              'x-api-key': CLIENT_ID,
                              'Authorization': 'Bearer ' + EtsyService.getAccessToken()
                      }
                    });

                    const theReceipt = JSON.parse(responseReceipt);

                    for (let j = 0 ; j < theReceipt.count;j++)
                    {
                      let theReceiptResult = theReceipt.results[j];
                      //Take care of currency exchanges
                      let exRate = ccyRates[theReceiptResult.amount_gross.currency_code];

                      theReceiptResult.amount_gross.amount *= exRate;
                      theReceiptResult.amount_gross.currency_code="EUR";
                      theReceiptResult.amount_net.amount *= exRate;
                      theReceiptResult.amount_net.currency_code="EUR";

                      //Format user address
                      let customerAddress = etsyOrder.first_line + ", " + 
                                    etsyOrder.second_line + ", " + 
                                    etsyOrder.city + ", " +
                                    etsyOrder.zip;

                      let oneOrder = 
                      {
                        "t_created" :       theReceiptResult.create_timestamp,
                        "customerName" :    etsyOrder.name,
                        "customerCountry" : etsyOrder.country_iso,
                        "customerEmail" :   etsyOrder.buyer_email,                   
                        "gross":            theReceiptResult.amount_gross,
                        "net"  :            theReceiptResult.amount_net,
                        "shipping":         etsyOrder.total_shipping_cost,
                        "discount":         etsyOrder.discount_amt,
                        "totalTax":         etsyOrder.total_tax_cost,
                        "receiptId":        etsyOrder.receipt_id,
                        "transactions":     utils_encodeObject(transactionsForThisOrder),
                        "buyer_id" :        etsyOrder.buyer_user_id,
                        "is_shipped":       etsyOrder.is_shipped,
                        "t_shipped":        theReceiptResult.shipped_timestamp,
                        "address":          customerAddress,
                        "formatted_address": etsyOrder.formatted_address      
                      }

                      orders.push(oneOrder)
                    }
                }
            }

            BulkDataRows = [];
            for (let j = 0 ; j < orders.length;j++)
            {
                let anOrder = orders[j];

                let aDate = new Date(anOrder.t_created * 1000);
                let dateCreated = (aDate.getMonth()+1)+"/"+(aDate.getDate())+"/"+(aDate.getFullYear()-2000);

                let aRow = [];
                aRow.push(dateCreated);
                aRow.push(anOrder.customerName);
                aRow.push(anOrder.customerCountry);
                aRow.push(anOrder.customerEmail);

                aRow.push(anOrder.gross.amount/anOrder.gross.divisor);

                let netAmount = anOrder.net.amount/anOrder.net.divisor
                aRow.push(netAmount);

                let shippingCost = anOrder.shipping.amount/anOrder.shipping.divisor;
                aRow.push(shippingCost);

                let netEncaisse = netAmount - shippingCost;
                aRow.push(netEncaisse);
                aRow.push(anOrder.receiptId);
                aRow.push(anOrder.transactions);
                aRow.push(anOrder.buyer_id);
                aRow.push(anOrder.is_shipped);

                let dateShipped=""
                if ( anOrder.t_shipped != null )
                {
                  aDate = new Date(anOrder.t_shipped * 1000);
                  dateShipped = (aDate.getMonth()+1)+"/"+(aDate.getDate())+"/"+(aDate.getFullYear()-2000);
                }
                aRow.push(dateShipped);

                aRow.push(anOrder.address);
                aRow.push(anOrder.formatted_address);

                let discountAmt = anOrder.discount.amount/anOrder.discount.divisor;
                aRow.push(discountAmt);

                let totalTax = anOrder.totalTax.amount/anOrder.totalTax.divisor;
                aRow.push(totalTax);

                BulkDataRows.push(aRow);

                allNewOrders.push(aRow);
            } 

            //Look if orders need to be flushed.,
            if ( BulkDataRows.length > 0)
            {
              let nOrders= BulkDataRows.length;

              dataSheet.getRange(NextRowFlush,1,nOrders,HEADER_ORDERS.length).setValues(BulkDataRows) ;

              NextRowFlush += nOrders;
            }

            ordersOffset    +=  theOrders.results.length;
            /*if (ordersOffset==theOrders.count)
              remainingOrders=0;  
            else
              remainingOrders = Math.max(theOrders.count-ordersOffset,0);*/
          }
          else
            break;
        }
        catch(err) 
        {
          setDataNotAvailable();
          errors_logErrorExceptionAndEmail(err);
        } 
      }while(1);

  }

  if ( allNewOrders.length > 0 )
  {
    SpreadsheetApp.flush();

    if ( targetTable == DATA_SHEET )
    {
      //Close the session with various setups
      let allDataRange = dataSheet.getRange(2,1,dataSheet.getLastRow()-1,HEADER_ORDERS.length);
      allDataRange.sort({column: DATE_INDATA_SHEET, ascending: true});
      
      updateAdmin();
      updateStat();
      updateUpdateDataDate();
      updateMailingData();
    }
  }

  return allNewOrders;

}




/**
 *          function etsy_refreshAllOrdersForYear()
 */

function run_refreshAllOrdersForYear() 
{
    etsy_refreshAllOrdersForYear(2022, DATA_SHEET);
}


function etsy_refreshAllOrdersForYear(year, targetTable) 
{
  let BulkDataRows=[];
  let NextRowFlush=2;

  //======================
  //Load exchange rates
  //=====================
  let ccyRates = ccy_loadRates() ;

  //=======================================
  // Retrieve data
  //=======================================
  let dataSheet = utils_getSheet(targetTable);

  // GET DATA     
  dataSheet.clear();
  dataSheet.appendRow(HEADER_ORDERS);
  
  let EtsyService = etsy_getService();
  let orders = [];

  //Set last month to avoid inutile calls to the Etsy api
  let lastMonth2Query = getLastMonthToQuery(year);

  for (let month = 1 ; month <= lastMonth2Query ; month++)
  {
      const nDaysInMonth = utils_getDaysInMonth(month,year);
      const minC  = toTimestamp(year,month,1,0,0,0);
      const maxC  = toTimestamp(year,month,nDaysInMonth,23,59,59);

      let ordersOffset    = 0; 
      let remainingOrders =0;
      do
      {
        try
        {
          let theRequest = 
          `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts?&min_created=${minC}&max_created=${maxC}&limit=${EtsyRequestSliceSize}&was_paid=true&offset=${ordersOffset}`;


          let response = UrlFetchApp.fetch(theRequest, {
            headers: 
            {
              'x-api-key': CLIENT_ID,
              'Authorization': 'Bearer ' + EtsyService.getAccessToken()
            }
          });

          let theOrders = JSON.parse(response.getContentText());

          if ( theOrders.results.length  > 0 )
          {
            orders=[];

            for (let ic =0 ; ic < theOrders.results.length;ic++) 
            {   
                let etsyOrder = theOrders.results[ic];
                
                //====================================================
                //Retrieve the receipt and transactions for this order
                //====================================================
                let theReceiptId = etsyOrder.receipt_id;
                {
                    //=========================================
                    //This is a new order, lets take care of it
                    //=========================================
                    let transactionsForThisOrder=[];

                    if ( etsyOrder.transactions != null)
                    {
                        let orderTransactions = etsyOrder.transactions;

                        for(let jj=0;jj<orderTransactions.length;jj++)
                        {
                          if ( orderTransactions[jj] != null )
                          {        
                            let trans = orderTransactions[jj];
                            let oneTrans = {
                              "transId":        trans.transaction_id,
                              "receiptId":      trans.receipt_id,
                              "listingId":      trans.listing_id,
                              "productId":      trans.product_id,
                              "title":          trans.title,
                              "buyer_user_id":  trans.buyer_user_id,
                              "quantity" :      trans.quantity,
                              "price":          trans.price,
                              "shipping":       trans.shipping_cost,
                              "variations":     trans.variations
                            };

                            //Push a new gtransaction for this order
                            //=======================================
                            transactionsForThisOrder.push(oneTrans);

                          }
                        }
                    }

                    //In order to not get an error message for too fast rquest to ETSY API
                    utils_wait(GETSOLD_DELAY);

                    const  reqReceipt = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts/${theReceiptId}/payments`;
                    let responseReceipt = UrlFetchApp.fetch(reqReceipt, {
                      headers: {
                              'x-api-key': CLIENT_ID,
                              'Authorization': 'Bearer ' + EtsyService.getAccessToken()
                      }
                    });

                    const theReceipt = JSON.parse(responseReceipt);

                    for (let j = 0 ; j < theReceipt.count;j++)
                    {
                      let theReceiptResult = theReceipt.results[j];
                      //Take care of currency exchanges
                      let exRate = ccyRates[theReceiptResult.amount_gross.currency_code];

                      theReceiptResult.amount_gross.amount *= exRate;
                      theReceiptResult.amount_gross.currency_code="EUR";
                      theReceiptResult.amount_net.amount *= exRate;
                      theReceiptResult.amount_net.currency_code="EUR";

                      //Format user address
                      let customerAddress = etsyOrder.first_line + ", " + 
                                    etsyOrder.second_line + ", " + 
                                    etsyOrder.city + ", " +
                                    etsyOrder.zip;

                      let oneOrder = 
                      {
                        "t_created" :       theReceiptResult.create_timestamp,
                        "customerName" :    etsyOrder.name,
                        "customerCountry" : etsyOrder.country_iso,
                        "customerEmail" :   etsyOrder.buyer_email,                   
                        "gross":            theReceiptResult.amount_gross,
                        "net"  :            theReceiptResult.amount_net,
                        "shipping":         etsyOrder.total_shipping_cost,
                        "discount":         etsyOrder.discount_amt,
                        "totalTax":         etsyOrder.total_tax_cost,
                        "receiptId":        etsyOrder.receipt_id,
                        "transactions":     utils_encodeObject(transactionsForThisOrder),
                        "buyer_id" :        etsyOrder.buyer_user_id,
                        "is_shipped":       etsyOrder.is_shipped,
                        "t_shipped":        theReceiptResult.shipped_timestamp,
                        "address":          customerAddress,
                        "formatted_address": etsyOrder.formatted_address      
                      }

                      orders.push(oneOrder)
                    }
                }
            }

            BulkDataRows = [];
            for (let j = 0 ; j < orders.length;j++)
            {
                let anOrder = orders[j];

                let aDate = new Date(anOrder.t_created * 1000);
                let dateCreated = (aDate.getMonth()+1)+"/"+(aDate.getDate())+"/"+(aDate.getFullYear()-2000);

                let aRow = [];
                aRow.push(dateCreated);
                aRow.push(anOrder.customerName);
                aRow.push(anOrder.customerCountry);
                aRow.push(anOrder.customerEmail);

                aRow.push(anOrder.gross.amount/anOrder.gross.divisor);

                let netAmount = anOrder.net.amount/anOrder.net.divisor
                aRow.push(netAmount);

                let shippingCost = anOrder.shipping.amount/anOrder.shipping.divisor;
                aRow.push(shippingCost);

                let netEncaisse = netAmount - shippingCost;
                aRow.push(netEncaisse);
                aRow.push(anOrder.receiptId);
                aRow.push(anOrder.transactions);
                aRow.push(anOrder.buyer_id);
                aRow.push(anOrder.is_shipped);

                let dateShipped=""
                if ( anOrder.t_shipped != null )
                {
                  aDate = new Date(anOrder.t_shipped * 1000);
                  dateShipped = (aDate.getMonth()+1)+"/"+(aDate.getDate())+"/"+(aDate.getFullYear()-2000);
                }
                aRow.push(dateShipped);

                aRow.push(anOrder.address);
                aRow.push(anOrder.formatted_address);

                let discountAmt = anOrder.discount.amount/anOrder.discount.divisor;
                aRow.push(discountAmt);

                let totalTax = anOrder.totalTax.amount/anOrder.totalTax.divisor;
                aRow.push(totalTax);

                BulkDataRows.push(aRow);
            } 

            //Look if orders need to be flushed.,
            if ( BulkDataRows.length > 0)
            {
              let nOrders= BulkDataRows.length;

              dataSheet.getRange(NextRowFlush,1,nOrders,HEADER_ORDERS.length).setValues(BulkDataRows) ;

              NextRowFlush += nOrders;
            }

            ordersOffset    +=  theOrders.results.length;
          }
          else
            break;
        }
        catch(err) 
        {
          setDataNotAvailable();
          errors_logErrorExceptionAndEmail(err);
        } 
      }while(1);

  }

  SpreadsheetApp.flush();

  if ( targetTable == DATA_SHEET )
  {
    //Close the session with various setups
    let allDataRange = dataSheet.getRange(2,1,dataSheet.getLastRow()-1,HEADER_ORDERS.length);
    allDataRange.sort({column: DATE_INDATA_SHEET, ascending: true});

  }
}

/**
 * 
 */
function getAllListingsByShopReceipt() 
{
  let mainSheet = utils_getSheet(MAIN_SHEET);   
  let listingsSheet = utils_getSheet(LISTINGS_SHEET);

  getRange(LISTINGS_SHEET,DATAS_RANGEINLISTINGS_SHEET).clear();
  for (let i = 1; i <= headersData.length;i++)
    listingsSheet.getRange(1,i).setValue(headersData[i-1]);

  let receiptIds = utils_GetNamedRangeValuesInSheet(MAIN_SHEET,cellDataReceiptIds);
  let allListings=[];
  let EtsyService = etsy_getService();

  /* !!!!!! start to il = 1 to skip header */
  for (let il = 1 ; il < receiptIds.length;il++)
  {
    allListings.push(getListingsByShopReceipt(EtsyService,receiptIds[il]));
  }
  
  //Logger.log(allListings);

  for (let j =0;j < allListings.length;j++)
  {
    let aListing = allListings[j][0];
    let rowNum = j+2

    let aDate = new Date(aListing.t_created * 1000);
    let dateCreated = (aDate.getMonth()+1)+"/"+(aDate.getDate())+"/"+(aDate.getFullYear()-2000);
    listingsSheet.getRange(rowNum,1).setValue(dateCreated);
    listingsSheet.getRange(rowNum,2).setValue(aListing.title);
    listingsSheet.getRange(rowNum,3).setValue(aListing.quantity);
    listingsSheet.getRange(rowNum,4).setValue(aListing.url);
  }
}


function getListingsByShopReceipt(service,receiptId) 
{
    let listings = [];
    let theReceiptId = parseInt(receiptId);
    const theRequest = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts/${theReceiptId}/listings`;

    let response = UrlFetchApp.fetch(theRequest, {
      headers: {
              'x-api-key': CLIENT_ID,
              'Authorization': 'Bearer ' + service.getAccessToken()
      }
    });


    let allListings = JSON.parse(response.getContentText());
    //Logger.log(allListings);

    if ( allListings.count > 0 )
    {
      for (let ic =0 ; ic < allListings.count;ic++) 
      {
          let aListing = allListings.results[ic];

          let oneListing = {
          "t_created" : aListing.creation_timestamp,
          "title" : aListing.title,
          "quantity": aListing.quantity,
          "url"  : aListing.url
        }

        listings.push(oneListing);
  
      }
    }

    return listings;
}



/**
 * 
 * PAYMENTS: https://openapi.etsy.com/v3/application/shops/{shop_id}/payments
 */

function getListingsOfPayments() 
{
    let listings = [];
    const theRequest = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/payments`;

    let EtsyService = etsy_getService();
    let response = UrlFetchApp.fetch(theRequest, {
      headers: {
              'x-api-key': CLIENT_ID,
              'Authorization': 'Bearer ' + EtsyService.getAccessToken()
      }
    });


    let allPayments = JSON.parse(response.getContentText());
   
    if ( allPayments.count > 0 )
    {
      for (let ic =0 ; ic < allPayments.count;ic++) 
      {
          Logger.log(allPayments.results[ic]);
      }
    }
}


/**
 * 
 * 
 */

const headersData = 
["listing_id","Date created", "title","quantity","url","num_favorer","is_customizable","style","item_weight","item_length","item_width","item_height","item_dimensions_unit"];

function helper_getListingsByListingIds(paramStr)
{
    const theRequest = "https://openapi.etsy.com/v3/application/listings/batch?"+paramStr;
    let EtsyService = etsy_getService();
    let response = UrlFetchApp.fetch(theRequest, {
      headers: {
              'x-api-key': CLIENT_ID,
              'Authorization': 'Bearer ' + EtsyService.getAccessToken()
      }
    });

    let allListings = JSON.parse(response.getContentText());

    if ( allListings.count > 0 )
    {
      /* ============== FILL listings sheet =============*/
      let listingsSheet = utils_getSheet(LISTINGS_SHEET);
      for (let ic =0 ; ic < allListings.count;ic++) 
      {
        let aListing = allListings.results[ic];
        let aRow=[];

        aRow.push(aListing.listing_id);
        
        let aDate = new Date(aListing.creation_timestamp * 1000);
        let dateCreated = (aDate.getMonth()+1)+"/"+(aDate.getDate())+"/"+(aDate.getFullYear()-2000);
        aRow.push(dateCreated);
        
        aRow.push(aListing.title);
        aRow.push(aListing.quantity);
        aRow.push(aListing.url);
        aRow.push(aListing.num_favorers);
        aRow.push(aListing.is_customizable);
        if (aListing.style != null )
        {
          let str="";
          for (let ist=0;ist<aListing.style.length;ist++)
            str=str+aListing.style[ist];
          
          aRow.push(str);
        }
          
        aRow.push(aListing.item_weight);
        aRow.push(aListing.item_length);
        aRow.push(aListing.item_width);
        aRow.push(aListing.item_height);
        aRow.push(aListing.item_dimensions_unit);
        
        listingsSheet.appendRow(aRow);
      }
    }
}

function getListingsByListingIds() 
{
  return;

    let listingsSheet = utils_getSheet(LISTINGS_SHEET);
    getRange(LISTINGS_SHEET,DATAS_RANGEINLISTINGS_SHEET).clear();
    getRange(HISTPRODUIT_SHEET,DATAS_RANGEINLISTINGS_SHEET).clear();

    for (let i = 1; i <= headersData.length;i++)
      listingsSheet.getRange(1,i).setValue(headersData[i-1]);


    let transactions = utils_GetNamedRangeValuesInSheet(MAIN_SHEET,cellDataTransactions);
   
    allListings=[];
    for (let il = 1 ; il < transactions.length;il++)
    {
      let trans = utils_decodeObject(transactions[il]);

      for (let ntr=0;ntr<trans.length;ntr++)
      {
        allListings.push(trans[ntr].listingId);
      }
    }

    let histo = histoOnArray(allListings);

  /* Build list of listing ids */
    let paramStr = "listing_ids=";
    let nAddedIds=0;
    for (let lid=0;lid< histo.length;lid++)
    {
        if ( nAddedIds > 0 )
          paramStr = paramStr + "," + histo[lid][0];
        else
          paramStr = paramStr + histo[lid][0];

        nAddedIds++;

        if (nAddedIds==100)
        {
          helper_getListingsByListingIds(paramStr);
          nAddedIds=0;
          paramStr = "listing_ids=";
          utils_wait(GETSOLD_DELAY);
        }
    }

    if ( nAddedIds > 0 )
      helper_getListingsByListingIds(paramStr);   

    utils_sort(LISTINGS_SHEET,cellListingsNumFavoris,false);   

    statOnListingsIds();

    updateMostSoldTable(false,ROWS_FORMOST_SOLD);
    updateMostFavoredTable(false,ROWS_FORMOST_FAVORED);
    updateSoldByMonthsInMonthSheets();
}




function getStockAndFavoredFromListings(fromDate)
{
    let sheet = utils_getSheet(LISTINGS_SHEET);
    let lastRow = sheet.getLastRow();
    let stockRanges = sheet.getRange(LISTINGS_SHEET+"!D2:D"+lastRow).getValues().filter(String);
    let favorRange = sheet.getRange(LISTINGS_SHEET+"!F2:F"+lastRow).getValues().filter(String);
    let urlRange = sheet.getRange(LISTINGS_SHEET+"!E2:E"+lastRow).getValues().filter(String);
    let dateCreatedRange = sheet.getRange(LISTINGS_SHEET+"!B2:B"+lastRow).getValues().filter(String);

    let retList = [];
    for(let i=0;i<lastRow-1;i++)
    {
      if (dateCreatedRange[i][0] >= fromDate)
      {
          let anEntry=[];
          anEntry.push(dateCreatedRange[i][0] );
          anEntry.push(favorRange[i][0]);
          anEntry.push(stockRanges[i][0]);
          anEntry.push(urlRange[i][0]);

          retList.push(anEntry);
      }
    }

    return retList;
}



function getReviews()
{
    /* ============== FILL listings sheet =============*/
    let reviewsSheet = utils_getAndInsertSheet(REVIEWS_SHEET);
    reviewsSheet.clear();

    reviewsSheet.appendRow(["dateCreated","listing_id","transaction_id","buyer_id","rating","language","review","image_url"])

    let reviewsOffset   = 0
    let remainingReviews =0;
    let retrievedSlices =0;
    let slice = 25;
    do
    {
      try
      {
        const theRequest = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/reviews?limit=${slice}&offset=${reviewsOffset}`;
        let EtsyService = etsy_getService();
        let response = UrlFetchApp.fetch(theRequest, {
          headers: {
                  'x-api-key': CLIENT_ID,
                  'Authorization': 'Bearer ' + EtsyService.getAccessToken()
          }
        });

        let theReviews = JSON.parse(response.getContentText());
        let nReviews = theReviews.results.length;
        if ( nReviews > 0 )
        {
          let allReviews=[];

          for (let jr =0 ; jr < nReviews;jr++) 
          {   
              let oneReview = [];

              let aDate = new Date(theReviews.results[jr].create_timestamp * 1000);
              let dateCreated = (aDate.getMonth()+1)+"/"+(aDate.getDate())+"/"+(aDate.getFullYear()-2000);
              oneReview.push(dateCreated);
              oneReview.push(theReviews.results[jr].listing_id)
              oneReview.push(theReviews.results[jr].transaction_id);
              oneReview.push(theReviews.results[jr].buyer_user_id);
              oneReview.push(theReviews.results[jr].rating);
              oneReview.push(theReviews.results[jr].language);
              oneReview.push(theReviews.results[jr].review);
              oneReview.push(theReviews.results[jr].image_url_fullxfull);

              allReviews.push(oneReview);
          }

          let firstRowToUpdate = 2+retrievedSlices*slice

          reviewsSheet.getRange(firstRowToUpdate,1,allReviews.length,allReviews[0].length).setValues(allReviews);
          
          //Look if more orders need to be retrieved.,
          retrievedSlices++;
          remainingReviews  = Math.max(theReviews.count - retrievedSlices*slice) ;
          reviewsOffset    += slice; 
        }
      }
      catch(err) 
      {
        errors_logErrorExceptionAndEmail(err);
      } 
      finally {}
    }
    while(remainingReviews > 0);

    
    
}



/**
 * 
 */
function logout() {
  var service = etsy_getService()
  service.reset();
}