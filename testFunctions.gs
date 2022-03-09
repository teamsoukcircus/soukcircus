
function test_utils_getNamedCellValueRowColOffet()
{
  Logger.log(utils_getNamedCellValueRowColOffet(ADMIN_SHEET,cellAdminTresorJanvier,0,0));
  Logger.log(utils_getNamedCellValueRowColOffet(ADMIN_SHEET,cellAdminNetEncaisseJanvier,0,1));
  Logger.log(utils_getNamedCellValueRowColOffet(ADMIN_SHEET,cellAdminNetEncaisseJanvier,0,2));
}

function test_updateMostXX()
{
   updateMostSoldTable(false,ROWS_FORMOST_SOLD);
    updateMostFavoredTable(false,ROWS_FORMOST_FAVORED);
}


function smallTest()
{
  //setDashboardYearValue(2021);
  Logger.log(parseInt(getDashboardYear()));
}



function small_getAllSoldRecordsForCurrentYear() 
{
  //=====================================
  let mainSheet = utils_getSheet(MAIN_SHEET);   
  let dataSheet = utils_getSheet(DATA_SHEET);
  
  // GET DATA     
  getRange(DATA_SHEET,DATAS_RANGEINDATA_SHEET).clear();

  for (let i = 1; i <= displayData.length;i++)
    dataSheet.getRange(1,i).setValue(displayData[i-1]);
  
  let year = parseInt(getDashboardYear());
  let EtsyService = etsy_getService();

  let orders = [];

  for (let month = 1 ; month <= 1 ; month++)
  {
      const nDays = daysInMonth(year,month);
      const minC  = toTimestamp(year,month,1,0,0,0);
      const maxC  = toTimestamp(year,month,nDays,23,59,59);

      
      let ordersOffset = 0
      let remainingOrders=0;
      let retrievedSlices=0;
      do
      {
        const theRequest = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts?&min_created=${minC}&max_created=${maxC}&limit=10&was_paid=true&offset=${ordersOffset}`;

        let response = UrlFetchApp.fetch(theRequest, {
          headers: {
                  'x-api-key': CLIENT_ID,
                  'Authorization': 'Bearer ' + EtsyService.getAccessToken()
          }
        });

        let theOrders = JSON.parse(response.getContentText());

        if ( theOrders.count > 0 )
        {
          for (let ic =0 ; ic < theOrders.count;ic++) 
          {   
              let transactionsForThisOrder=[];
              if ( theOrders.results[ic].transactions != null)
              {
                  let orderTransactions = theOrders.results[ic].transactions;
                    //Logger.log("======================= TRANSACTIONS START : " + theOrders.results[ic].receipt_id + "==================================")
                    //Logger.log("N transaction: " + theOrders.results[ic].transactions.length);

                  for(let jj=0;jj<orderTransactions.length;jj++)
                  {
                    if ( orderTransactions[jj] != null )
                    {        
                      //Logger.log("=======TRANS START. ========="); 
                      //Logger.log(theOrders.results[ic].transactions[jj])
                      let trans = orderTransactions[jj];
                      let oneTrans = {
                        "transId": trans.transaction_id,
                        "receiptId": trans.receipt_id,
                        "listingId": trans.listing_id,
                        "productId": trans.product_id
                      };
                      transactionsForThisOrder.push(oneTrans)
                      //Logger.log("=======TRANS END. ========="); 
                    }
                  }
                  //Logger.log("======================= TRANSACTIONS END : " + theOrders.results[ic].receipt_id + "==================================")
              }

              let theReceiptId = theOrders.results[ic].receipt_id;
              const  reqReceipt = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts/${theReceiptId}/payments`;
              let responseReceipt = UrlFetchApp.fetch(reqReceipt, {
                headers: {
                        'x-api-key': CLIENT_ID,
                        'Authorization': 'Bearer ' + EtsyService.getAccessToken()
                }
              });


              const theReceipt = JSON.parse(responseReceipt);
              //console.log(responseReceipt.getContentText());
              for (let j = 0 ; j < theReceipt.count;j++)
              {
                let oneOrder = {
                  "t_created" : theReceipt.results[j].create_timestamp,
                  "customerName" : theOrders.results[ic].name,
                  "customerEmail" : theOrders.results[ic].buyer_email,
                  "customerCountry" : theOrders.results[ic].country_iso,
                  "gross": theReceipt.results[j].amount_gross,
                  "net"  : theReceipt.results[j].amount_net,
                  "shipping": theOrders.results[ic].total_shipping_cost,
                  "receiptId": theOrders.results[ic].receipt_id,
                  "transactions": utils_encodeObject(transactionsForThisOrder)
                }

                orders.push(oneOrder)
              }
      
          }


          for (let j = ordersOffset ; j < orders.length;j++)
          {
              let anOrder = orders[j];
              let rowNum = j+2

              let aDate = new Date(anOrder.t_created * 1000);
              let dateCreated = (aDate.getMonth()+1)+"/"+(aDate.getDate())+"/"+(aDate.getFullYear()-2000);
              dataSheet.getRange(rowNum,1).setValue(dateCreated);

              dataSheet.getRange(rowNum,2).setValue(anOrder.customerName);
              dataSheet.getRange(rowNum,3).setValue(anOrder.customerCountry);
              dataSheet.getRange(rowNum,4).setValue(anOrder.customerEmail);

              dataSheet.getRange(rowNum,5).setValue(anOrder.gross.amount/anOrder.gross.divisor);

              let netAmount = anOrder.net.amount/anOrder.net.divisor
              dataSheet.getRange(rowNum,6).setValue(netAmount);

              let shippingCost = anOrder.shipping.amount/anOrder.shipping.divisor;
              dataSheet.getRange(rowNum,7).setValue(shippingCost);

              let netEncaisse = netAmount - shippingCost;
              dataSheet.getRange(rowNum,8).setValue(netEncaisse);
          
              dataSheet.getRange(rowNum,9).setValue(anOrder.receiptId);

              dataSheet.getRange(rowNum,10).setValue(anOrder.transactions);
              //for ( )
              //transactions

          } 

          //Look if more orders need to be retrieved.,
          retrievedSlices++;
          remainingOrders  = Math.max(theOrders.count -retrievedSlices*sliceSize);
          ordersOffset    += sliceSize; 
        }
      }while(remainingOrders > 0);
  }
  Logger.log("======================= ALL ORDERS START ==================================")
  Logger.log(orders);
  Logger.log("======================= ALL ORDERS END ==================================")
}


/**
 * Request uop to date data from ETSY Restful API
 */
function test_getAllSoldRecordsForCurrentYear() 
{
  //=====================================
  let mainSheet = utils_getSheet(MAIN_SHEET);   
  let dataSheet = utils_getSheet(DATA_SHEET);
  
  // GET DATA     
  getRange(DATA_SHEET,DATAS_RANGEINDATA_SHEET).clear();

  for (let i = 1; i <= displayData.length;i++)
    dataSheet.getRange(1,i).setValue(displayData[i-1]);
  
  let year = parseInt(getDashboardYear());
  let EtsyService = etsy_getService();

  let orders = [];

  for (let month = 1 ; month <= 12 ; month++)
  {
      const nDays = daysInMonth(year,month);
      const minC  = toTimestamp(year,month,1,0,0,0);
      const maxC  = toTimestamp(year,month,nDays,23,59,59);

      
      let ordersOffset = 0
      let remainingOrders=0;
      let retrievedSlices=0;
      do
      {
        const theRequest = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts?&min_created=${minC}&max_created=${maxC}&limit=${sliceSize}&was_paid=true&offset=${ordersOffset}`;

        let response = UrlFetchApp.fetch(theRequest, {
          headers: {
                  'x-api-key': CLIENT_ID,
                  'Authorization': 'Bearer ' + EtsyService.getAccessToken()
          }
        });

        let theOrders = JSON.parse(response.getContentText());

        if ( theOrders.count > 0 )
        {
          for (let ic =0 ; ic < theOrders.count;ic++) 
          {
              let theReceiptId = theOrders.results[ic].receipt_id;
              const  reqReceipt = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts/${theReceiptId}/payments`;
              let responseReceipt = UrlFetchApp.fetch(reqReceipt, {
                headers: {
                        'x-api-key': CLIENT_ID,
                        'Authorization': 'Bearer ' + EtsyService.getAccessToken()
                }
              });


              const theReceipt = JSON.parse(responseReceipt);
              //console.log(responseReceipt.getContentText());
              for (let j = 0 ; j < theReceipt.count;j++)
              {
                let oneOrder = {
                  "t_created" : theReceipt.results[j].create_timestamp,
                  "customerName" : theOrders.results[ic].name,
                  "customerEmail" : theOrders.results[ic].buyer_email,
                  "customerCountry" : theOrders.results[ic].country_iso,
                  "gross": theReceipt.results[j].amount_gross,
                  "net"  : theReceipt.results[j].amount_net,
                  "shipping": theOrders.results[ic].total_shipping_cost,
                  "receiptId": theOrders.results[ic].receipt_id,
                  "transactionId": theReceipt.transactions[ti].transaction_id
                }

                /*
                Logger.log("****");
                Logger.log(theOrders.results[ic].receipt_id);
                if (theReceipt.transactions != null)
                  for ( let ti=0; ti < 1;ti++)
                  {
                    Logger.log("tranId:"+theReceipt.transactions[ti].transaction_id);
                    Logger.log("Quant:"+theReceipt.transactions[ti].quantity);
                    Logger.log("ListId:"+theReceipt.transactions[ti].listing_id);
                    Logger.log("ProdId"+theReceipt.transactions[ti].product_id);
                    Logger.log("PriceAmt:"+theReceipt.transactions[ti].price.amount);
                  }
                  */

                orders.push(oneOrder)
              }
      
          }


          for (let j = ordersOffset ; j < orders.length;j++)
          {
              let anOrder = orders[j];
              let rowNum = j+2

              let aDate = new Date(anOrder.t_created * 1000);
              let dateCreated = (aDate.getMonth()+1)+"/"+(aDate.getDate())+"/"+(aDate.getFullYear()-2000);
              dataSheet.getRange(rowNum,1).setValue(dateCreated);

              dataSheet.getRange(rowNum,2).setValue(anOrder.customerName);
              dataSheet.getRange(rowNum,3).setValue(anOrder.customerCountry);
              dataSheet.getRange(rowNum,4).setValue(anOrder.customerEmail);

              dataSheet.getRange(rowNum,5).setValue(anOrder.gross.amount/anOrder.gross.divisor);

              let netAmount = anOrder.net.amount/anOrder.net.divisor
              dataSheet.getRange(rowNum,6).setValue(netAmount);

              let shippingCost = anOrder.shipping.amount/anOrder.shipping.divisor;
              dataSheet.getRange(rowNum,7).setValue(shippingCost);

              let netEncaisse = netAmount - shippingCost;
              dataSheet.getRange(rowNum,8).setValue(netEncaisse);
          
              dataSheet.getRange(rowNum,9).setValue(anOrder.receiptId);
              dataSheet.getRange(rowNum,10).setValue(anOrder.transactionId);
          } 

          //Look if more orders need to be retrieved.,
          retrievedSlices++;
          remainingOrders  = Math.max(theOrders.count -retrievedSlices*sliceSize);
          ordersOffset    += sliceSize; 
        }
      }while(remainingOrders > 0);
  }

  updateStat();
  updateUpdateDataDate();
}


/**
 * Test requests
 */

/**
 * Request uop to date data from ETSY Restful API
 */
function test_SendRequest(requestExpression) {
  
  let EtsyService = etsy_getService();


  const theRequest = requestExpression;

  let response = UrlFetchApp.fetch(theRequest, {
    headers: {
            'x-api-key': CLIENT_ID,
            'Authorization': 'Bearer ' + EtsyService.getAccessToken()
    }
  });

  return response;
}

/**
 * 
 */
function test_findAllActiveListingsByShop()
{
  let theRequest = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/active`;

  let response = testRequest(theRequest);

  Logger.log(response);
}


/**
 * https://openapi.etsy.com/v3/application/shops/{shop_id}/receipts/{receipt_id}/transactions
 */
function test_findTransactionsPerReceipt()
{
  
  let theRequest = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts/2061061958/transactions`;

  Logger.log(theRequest)

  let response = test_SendRequest(theRequest);

  let json = JSON.parse(response);
  Logger.log(json);
  var array = [];
  for (var i = 0; i< json.results.length; i++){
    var newJson = Object.keys(json.results[i]).map(function (key) { 
      return [key, json.results[i][key]]; 
    }); 
    for(var j = 0; j< newJson.length; j++){
      array.push(newJson[j]);
    }
  }

  Logger.log(array);
  var ss = SpreadsheetApp.getActive();
  var sheet = utils_getSheet("TransactionsPerReceipt") 
  var range = sheet.getRange(1,1, array.length, array[0].length);
  range.setValues(array);

  Logger.log(response);
}


/**
 * https://openapi.etsy.com/v3/application/shops/{shop_id}/transactions
 */
function test_findAllTransactionsPerShop()
{
  let limit = 100;
  let offset = 0;
  let nslices=0
  let allRecords=[];
  do
  {
      let theRequest = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/transactions?limit=`+limit+"&offset="+offset;

      Logger.log(theRequest)

      let response = test_SendRequest(theRequest);

      let json = JSON.parse(response);
      Logger.log(json);
      var array = [];
      for (var i = 0; i< json.results.length; i++)
      {
        var newJson = Object.keys(json.results[i]).map(function (key) 
        { 
          return [key, json.results[i][key]]; 
        }); 
        for(var j = 0; j< newJson.length; j++)
        {
          allRecords.push(newJson[j]);
        }
      }

 
      nslices++;
      remaining = json.count - nslices*limit;
      offset = offset + limit;
  }
  while(remaining > 0)

    var ss = SpreadsheetApp.getActive();
    var sheet = utils_getSheet("TransactionsPerShop") 
    var range = sheet.getRange(1,1, allRecords.length, allRecords[0].length);
    range.clear();
    range.setValues(allRecords);

}


/**
 * https://openapi.etsy.com/v3/application/shops/{shop_id}/transactions
 */
function test_findAllReceiptsPerShopPerYear()
{     
  const year = getDashboardYear();
  const nDays = daysInMonth(year,month);
  const minC  = toTimestamp(year,month,1,0,0,0);
  const maxC  = toTimestamp(year,month,nDays,23,59,59);

  let limit = 100;
  let offset = 0;
  let nslices=0
  let allRecords=[];
  do
  {
      let theRequest = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts?&min_created=${minC}&max_created=${maxC}&limit=${limit}&was_paid=true&offset=${offset}`;

      Logger.log(theRequest)

      let response = test_SendRequest(theRequest);

      let json = JSON.parse(response);
      Logger.log(json);
      var array = [];
      for (var i = 0; i< json.results.length; i++)
      {
        var newJson = Object.keys(json.results[i]).map(function (key) 
        { 
          return [key, json.results[i][key]]; 
        }); 
        for(var j = 0; j< newJson.length; j++)
        {
          allRecords.push(newJson[j]);
        }
      }

 
      nslices++;
      remaining = json.count - nslices*limit;
      offset = offset + limit;
  }
  while(remaining > 0)

    var ss = SpreadsheetApp.getActive();
    var sheet = utils_getSheet("ReceiptsPerShopPerYear") 
    var range = sheet.getRange(1,1, allRecords.length, allRecords[0].length);
    range.clear();
    range.setValues(allRecords);

}



/**
 * https://openapi.etsy.com/v3/application/shops/{shop_id}/receipts/{receipt_id}/listings
 */
function test_getListingsByShopReceipt()
{
  
  let theRequest = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts/2061061958/listings`;

  Logger.log(theRequest)

  let response = test_SendRequest(theRequest);

  let json = JSON.parse(response);
  Logger.log(json);
  var array = [];
  for (var i = 0; i< json.results.length; i++){
    var newJson = Object.keys(json.results[i]).map(function (key) { 
      return [key, json.results[i][key]]; 
    }); 
    for(var j = 0; j< newJson.length; j++){
      array.push(newJson[j]);
    }
  }

  Logger.log(array);
  var ss = SpreadsheetApp.getActive();
  var sheet = utils_getSheet("getListingsByShopReceipt") 
  var range = sheet.getRange(1,1, array.length, array[0].length);
  range.setValues(array);

  Logger.log(response);
}


/**
 * 
 */
function logout() {
  var service = etsy_getService()
  service.reset();
}


function test_getAllListingsByShopReceipt() 
{
  let mainSheet = utils_getSheet(MAIN_SHEET);   
  let listingsSheet = utils_getSheet(LISTINGS_SHEET);

  getRange(LISTINGS_SHEET,DATAS_RANGEINLISTINGS_SHEET).clear();
  for (let i = 1; i <= headersData.length;i++)
    listingsSheet.getRange(1,i).setValue(headersData[i-1]);

  let receiptIds = utils_GetNamedRangeValuesInSheet(cellDataReceiptIds);
  let allListings=[];
  let EtsyService = etsy_getService();

  for (let il = 0 ; il < receiptIds.length;il++)
  {
    allListings.push(test_getListingsByShopReceipt(EtsyService,receiptIds[il]));
  }
  
  //Logger.log(allListings);

  for (let j =0;j < allListings.length;j++)
  {
    let aListing = allListings[j][0];
    let rowNum = j+2

    Logger.log(aListing.t_created );
    Logger.log(aListing.title);
    Logger.log(aListing.quantity);
    Logger.log(aListing.url);

    let aDate = new Date(aListing.t_created * 1000);
    let dateCreated = (aDate.getMonth()+1)+"/"+(aDate.getDate())+"/"+(aDate.getFullYear()-2000);
    listingsSheet.getRange(rowNum,1).setValue(dateCreated);
    listingsSheet.getRange(rowNum,2).setValue(aListing.title);
    listingsSheet.getRange(rowNum,3).setValue(aListing.quantity);
    listingsSheet.getRange(rowNum,4).setValue(aListing.url);
  }
}

function test_getListingsByShopReceipt(service,receiptId) 
{
    let listings = [];
    let theReceiptId = parseInt(receiptId);
    const theRequest = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts/${theReceiptId}/listings`;

    Logger.log(theRequest);

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


function test_utils_getRangeByCoordAndSpan()
{
    Logger.log(utils_getRangeByCoordAndSpanInSheet(21,2,2,2,MAIN_SHEET).getValues());
}


/*=============================== ADMIN =================================*/
function test_AdminGene()
{
  let data =
  {
    "dbTarget" : "adminGene",
    "StoreName": "aaaaaa",
    "DashboardYear": 2035,
    "EmailIT": "a@b.com",
    "ObjectifMensuel": 333,
    "ObjectifBonusMensuel":55,
    "ObjectifTresorMensuel":7777
  }
  updateFraisGeneraux(data);
}

function test_AdminFrais()
{
  let data =
  {
    dbTarget:"adminFrais",
    "LoyerAnnuel": 46000,
    "ElectriciteAnnuel":6000,
    "EauAnnuel": 333,
    "TransportsAnnuel": 4444,
    "NettoyagesAnnuel": 55555,
    "DiversAnnuel": 666666,
    "Collab01FullName": "toto",
    "Collab01SalaireAnnuel": 23000,
    "Collab01BonusPercent": 10,
    "Collab01Email": "toto@gmail.com",
    "Collab01Notif": true,

    "Collab02FullName": "tata",
    "Collab02SalaireAnnuel": 34000,
    "Collab02BonusPercent": 20,
    "Collab02Email": "tata@gmail.com",
    "Collab02Notif": false,

    "Collab03FullName": "titi",
    "Collab03SalaireAnnuel": 48000,
    "Collab03BonusPercent": 30,
    "Collab03Email": "titi@gmail.com",
    "Collab03Notif": true
  }
  updateFraisGeneraux(data);
}


function test_saveProps()
{
  let props = loadAllProperties();
  saveAllProperties(props);
  let props2 = loadAllProperties();

  if (props.length == props2.length )
  {
    let diff=false;
    for (i=0;i<props.length;i++)
    {
        if ( props[i][0] != props2[i][0] || props[i][1] != props2[i][1])
        {
          diff=true;
          Logger.log("====================== DIFFERENCES ============================");
          Logger.log(props[i][0] + "," +props2[i][0]+ "//" + props[i][1] + "," +props2[i][1]);
        }
    }
    
    if ( !diff )
      Logger.log("====================== IDENTICAL ============================");

  }
  else
  {
    Logger.log("==================Diff len: " + props.length + ", " +  props2.length + "===================" );
  }
}



function test_html(month)
{

   let page = HtmlService.createHtmlOutputFromFile  ("emailFrais").setWidth(900).setHeight(900);

    var ui = SpreadsheetApp.getUi();
    ui.showModalDialog(page,"title")
} 





function test_setupOrder()
{
  let order={};

  order["email"]="a@b.com";
  order["items"] = {};
  order["items"]["0"]={"transId":23423, "title":'this is the title 1',"quantity":1, "price":{"amount":7500, "divisor":100, "ccy":"eur"}}
  order["items"]["1"]={"transId":56456, "title":'this is the title 2',"quantity":2, "price":{"amount":9500, "divisor":100, "ccy":"eur"}}
  order["items"]["2"]={"transId":78978, "title":'this is the title 3',"quantity":3, "price":{"amount":10500, "divisor":100, "ccy":"eur"}}

  
    let tableId = "id_"+23423423;
    let header = "<tr><th>transactionId</th><th>Titre</th><th>Qty</th><th>Prix</th>";
    let tableRows={};
    let totalPrice=0;
    for(key in order["items"])
    {  
      let aRow={};

      aRow["transId"]   = {"val":order["items"][key]["transId"],"type":"T"};
      aRow["title"]     = {"val":order["items"][key]["title"],"type":"T"};
      aRow["quantity"]  = {"val":order["items"][key]["quantity"],"type":"T"};

      let amount = order["items"][key]["price"]["amount"];
      let divisor     = order["items"][key]["price"]["divisor"];
      let price = aRow["quantity"].val * amount/divisor;
      aRow["price"] = {"val":price,"type":"T"};

      totalPrice   += price;

      aRow["ship"] = {"val":0,"type":"I"};

      tableRows[key] = aRow;
    }

    Logger.log(totalPrice);
     Logger.log(order);
    Logger.log(tableRows);
}


