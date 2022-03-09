
/**
 * Request all sold records sinc 01.01.2020 (Forget before)
 */
function etsy_retroGetAllSoldRecordsSinceInception() 
{
    let dataSheet = utils_getSheet(RETRODATA_SHEET);  
    dataSheet.clear();
    dataSheet.appendRow(HEADER_ORDERS);

    let currYear = utils_getCurrentYear();
    for(let year=2020 ; year <= currYear;year++)
      etsy_getAllOrdersForYear(year, RETRODATA_SHEET);

    let allDataRange = dataSheet.getRange(2,1,dataSheet.getLastRow()-1,HEADER_ORDERS.length);
    allDataRange.sort({column: DATE_INDATA_SHEET, ascending: true});
}






/**
 * 
 * 
 * 
 */
/**
 * ================================================================================================
 */

let ShippedBulkDataRows=[];
function etsy_retroGetAllShippedOrdersSinceInception() 
{
  let ret={};

  try
  {
    ShippedBulkDataRows=[];
    let currYear = utils_getCurrentYear();
    for(let year=2021 ; year <= currYear;year++)
    {
      let found = etsy_retroGetShippedOrdersForYear(year);
      ShippedBulkDataRows = ShippedBulkDataRows.concat(found);
    }

    
    ret["err"] = "ok" ;
    ret["data"] = ShippedBulkDataRows;
    return JSON.stringify(ret);
  }
  catch(err)
  {
    ret["err"] = "nok" ;
    ret["msg"] = err.message;
    return JSON.stringify(ret);
  }
}


function etsy_retroGetShippedOrdersForYear(year) 
{ 
  let BulkData = [];
  let EtsyService = etsy_getService();

  //Set last month to avoid inutile calls to the Etsy api
  let lastMonth2Query;
  let currYear = utils_getCurrentYear();
  if (year < currYear)
    lastMonth2Query=12;
  else
    lastMonth2Query = utils_getCurrentMonth()+1; 


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
          let theRequest = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/receipts?&min_created=${minC}&max_created=${maxC}&limit=${EtsyRequestSliceSize}&was_paid=true&offset=${ordersOffset}`;


          let response = UrlFetchApp.fetch(theRequest, {
            headers: 
            {
              'x-api-key': CLIENT_ID,
              'Authorization': 'Bearer ' + EtsyService.getAccessToken()
            }
          });

          let theOrders = JSON.parse(response.getContentText());

          if ( theOrders.results != null && theOrders.results.length > 0 )
          {
            for (let ic =0 ; ic < theOrders.results.length ;ic++) 
            {   
                let etsyOrder = theOrders.results[ic];

                if ( etsyOrder.is_shipped )
                {
                  let transactionsForThisOrder=[];
                  if ( etsyOrder.transactions != null)
                  {
                      let orderTransactions = etsyOrder.transactions;

                      for(let jj=0;jj<orderTransactions.length;jj++)
                      {
                        if ( orderTransactions[jj] != null )
                        {        
                          //Logger.log("=======TRANS START. ========="); 
                          //Logger.log(theOrders.results[ic].transactions[jj])
                          let trans = orderTransactions[jj];
                          let oneTrans = {
                            "transId":    trans.transaction_id,
                            "receiptId":  trans.receipt_id,
                            "listingId":  trans.listing_id,
                            "productId":  trans.product_id,
                            "title":      trans.title,
                            "buyer_user_id":  trans.buyer_user_id,
                            "quantity" :      trans.quantity,
                            "price":          trans.price,
                            "shipping":       trans.shipping_cost
                          };

                          //Logger.log(oneTrans);

                          //Push a new gtransaction for this order
                          //=======================================

                          transactionsForThisOrder.push(oneTrans)

                        }
                      }
                  }

                  let aDate = new Date(etsyOrder.create_timestamp * 1000);
                  let dateCreated = (aDate.getMonth()+1)+"/"+(aDate.getDate())+"/"+(aDate.getFullYear()-2000);
                  BulkData.push([dateCreated, 
                                     etsyOrder.receipt_id,
                                     etsyOrder.buyer_user_id,
                                     etsyOrder.name,
                                     etsyOrder.formatted_address,
                                     etsyOrder.buyer_email,
                                     utils_encodeObject(transactionsForThisOrder)]);
                }
            }
          }

          remainingOrders = theOrders.count -  BulkData.length; 
        }
        catch(err) 
        {
          errors_logErrorExceptionAndEmail(err);
        } 
      }while(remainingOrders > 0);
  }

  return BulkData;
}


