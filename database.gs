const ANNUAL_TRANSACTIONS_EXTERNALSS_ID     = "1TsS_unGQucuV6aDvYM1d7kminz5DFnpWq-4W82QH-5Q";
const ANNUAL_TRANSACTIONS_EXTERNAL_SHEET    = "SoukTransactions";

function db_getAnnualTransactionSheet()
{
  return utils_getTable(ANNUAL_TRANSACTIONS_EXTERNALSS_ID,ANNUAL_TRANSACTIONS_EXTERNAL_SHEET);
}

const SELLINGDATE_INTRANSACTIONDATA_SHEET   =1;
const RECEIPTID_INTRANSACTIONDATA_SHEET     =2;
const TRANSID_INTRANSACTIONDATA_SHEET       =3;
const LISTINGID_INTRANSACTIONDATA_SHEET     =4;
const TITLE_INTRANSACTIONDATA_SHEET         =5;
const QUANTITY_INTRANSACTIONDATA_SHEET      =6;
const PRICE_INTRANSACTIONDATA_SHEET         =7;
const EMAIL_INTRANSACTIONDATA_SHEET         =8;
const CUSTOMER_INTRANSACTIONDATA_SHEET      =9;
const ADDRESS_INTRANSACTIONDATA_SHEET       =10;
const FORMATTEDADDRESS_INTRANSACTIONDATA_SHEET=11;
const STATUS_INTRANSACTIONDATA_SHEET        =12;
const ORDER_DATE_INTRANSACTIONDATA_SHEET    =13;
const SHIP_DATE_INTRANSACTIONDATA_SHEET     =14;
const DELIVERY_DATE_INTRANSACTIONDATA_SHEET =15;
const DETAILS_INTRANSACTIONDATA_SHEET       =16;
const STRING4QRCODE_INTRANSACTIONDATA_SHEET =17;
const IMAGEQRCODE_INTRANSACTIONDATA_SHEET   =18;
const SHIPFACTURE_INTRANSACTIONDATA_SHEET   =19;
const URLETSY_INTRANSACTIONDATA_SHEET       =20;
const RESTESTOCK_INTRANSACTIONDATA_SHEET    =21;
const TOTALDISCOUNT_INTRANSACTIONDATA_SHEET =22;
const TOTALTAXES_INTRANSACTIONDATA_SHEET    =23;
const ITEMKGWEIGHT_INTRANSACTION_SHEET      =24;
const LASTCOLUMN_TRANSACTION_SHEET          =24;

//For. the detailed json object
//==============================
const TRANS_ID_INDETAILS      =1;
const RECEIPT_ID_INDETAILS    =2;
const LISTINGID_INDETAILS     =3;
const PRODUCTID_INDETAILS     =4;
const TITLE_INDETAILS         =5;
const BUYERID_INDETAILS       =6;
const QUANTITY_INDETAILS      =7;
const PRICE_INDETAILS         =8;
const SHIPPING_INDETAILS      =9;
const VARIATION_INDETAILS     =10;

//transId,	"receiptId",	"listingId",	"productId", "title","buyer_id","quantity","price", "shipping"
const  HEADER_TRANSACTION_SHEET = 
["Date","Receipt Id","Transaction Id","Listing Id", "Title", "Quantity","Price", "Email","Customer","Address", 
"Formatted Address", "Status","Order Date", "Shipping Date", "Delivery Date", "transaction details","transaction4QRCode","qrCodeFormula","Ship Facture EUR",
"Url Etsy", "ResteStock", "Total Discount on Order",	"Total Tax On Order", "KgWeight"];

const STATUS_TRANSACTION = 
{
  ORDERED: "Ordered",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered"
};

//SHIPPING SESSION TABLE
//=======================
const SHIPPING_LIST_SHEET = "ShippingList";

const SHIPPING_STATUS =
{
  UNKNOWN:  "UNKNOWN",
  PENDING: "PENDING",
  SHIPPED: "SHIPPED",
  PREPARED: "PREPARED"
}

const SHIPPING_FOLDERID = "1yT82kFVZxdcN6IgBbk7rE_q5N9Ek1OSh";
const ID_FICHIER_SHIPPINGSESSION_IN_SHIPPING = '1SNpe-j8EcrUeapbCK8KsL5MSaTWfezI2Mm_9Je2zEJk';
const ID_LISTEUROPEAN_COUNTRYCODES_ID = "1eBYxAinpLZ5tJ5Qrm3Ymp-dOFuPCkJ1iD9O0gUENeGg";

const HEADER_SHIPPING_SESSION =
[
"Shipping date",	"ReceiptId",	"Customer email", "CustomerPhone", "Address",	"Total weight (Kg)",	"Tax info", "Postoffice Id (CPnnnMA)", 	"Order total price (EUR)",	"Order ship cost (MDA)",	"Order ship cost (EUR)"	, "Comment"	, "Transaction Id", 	"Listing Id", "Article",	"Item Price","Items quantity",	"Variations",	"Emballe",	"Statut","Ship Facture EUR", "Etsy Url", "IOSS Code", "Total Discount On Order"	, "Total Taxes On Order", "Url Dossier Etiquette","Customer Comment",
"ItemWeightKg"	
]

const SHIPSESS_SHIPDATE     = 1;
const SHIPSESS_RECEIPTID    = 2;
const SHIPSESS_EMAIL        = 3;
const SHIPSESS_PHONE        = 4;
const SHIPSESS_ADDRESS      = 5;
const SHIPSESS_TOTWEIGHTKG  = 6;
const SHIPSESS_TAXINFO      = 7; //!!! Not used anymore, keeped as spare for future used
const SHIPSESS_POSTID       = 8;
const SHIPSESS_TOTALPRICE   = 9;
const SHIPSESS_SHIPCOSTMAD  = 10;
const SHIPSESS_SHIPCOSTEUR  = 11;
const SHIPSESS_COMMENT      = 12;
const SHIPSESS_TRANSID      = 13;
const SHIPSESS_LISTINGID    = 14;
const SHIPSESS_TITLE        = 15;
const SHIPSESS_ITEMPRICE_EUR  = 16;
const SHIPSESS_QUANTITY     = 17;
const SHIPSESS_VARIATIONS   = 18;
const SHIPSESS_EMBALLE      = 19;
const SHIPSESS_STATUS       = 20;
const SHIPSESS_FACTUREEUR   = 21;
const SHIPSESS_ETSYURL      = 22;
const SHIPSESS_IOSSCODE     = 23;
const SHIPSESS_TOTALORDERDISCOUNT = 24;
const SHIPSESS_TOTALORDERTAXES    = 25;
const SHIPSESS_SHIPPINGBILL_FOLDERURLURL  = 26;
const SHIPSESS_CUSTOMERCOMMENT  = 27;
const SHIPSESS_ITEMWEIGHT       = 28;

/**
 * 
 * 
 * 
 */
function test_createShippingSession()
{
  let answers=
  {"nAnswers":1,"answers":[{"transactions":[{"title":"Grand panier à linge ou panier de rangement - fabrication artisanale en fibres naturelles style bohème","validated":true,"etsyUrl":"https://www.etsy.com/listing/1127269780/large-laundry-basket-or-storage-basket","variation":"Height : 70 Centimeters","quantity":"1","price":"75","produitEmballe":false,"prepareOnly":false,"listingId":"1127269780","transId":"2881750286"}],"phone":"","shipFacture":26,"totalTaxes":17.95,"address":"Julie Bonnaud\n33 rue du commerce\n17240 SAINT FORT SUR GIRONDE\nFrance","receiptId":"2379180986","totPrice":"75","comment":"commentaire interne test IT","totalWeight":"0","customerComment":"","email":"rq8mg2twkk@privaterelay.appleid.com","postOfficeShipping":"CPXXMA","totalShipping":"0","totalDiscount":11.25}]};

  db_updateShippingSession(answers);

}


/**============================================================================================
 * 
 *                      db_computeIOSSCode(countryCode, totalShippedOrderprice)
 * 
 ================================================================================================*/
function db_computeIOSSCode(countryCode, totalShippedOrderprice)
{
  //EUROPE : IM3720000224
  //GB : 370600428
  let sheet = utils_getTable(ID_LISTEUROPEAN_COUNTRYCODES_ID,"Europe");
  let europeanRegions = sheet.getRange(2,2,sheet.getLastRow()-1,1).getValues()[0];
  let isInEurope = (europeanRegions.indexOf(countryCode.toUpperCase()) >= 0);

  if ( totalShippedOrderprice > 150 || !isInEurope) //euros
  {
    return "No IOSS";
  }
  else
  {
    if (countryCode.toUpperCase() == "GB")
      return 370600428;
    else if ( isInEurope )
      return "IM3720000224";
  }
}


/**================================================================================
 * 
 * Shipping session result. Est appelé depuis shippingPrepare-js
 * 
 ================================================================================*/
function db_updateShippingSession(answers)
{
  let lock = lock_acquire();
  
  //log_RessourceTaskForm(JSON.stringify(answers));
  try
  {
      let transactionsShipped=[];

      //Array de poids à mettre à jour dans le stock
      //let stockWeight=[];

      //Table access definitions
      let customerTableAccess = tbl_tableAccess(TABLES_DEFINITIONS.CUSTOMER,TABLE_ACCESS_TYPE.REPEATED);
      //===================================================================================

      let shippingDate = utils_LocalGMTTimeFormatThisDate(new Date(),ENUM_DATE_FORMAT.LONG_HHMMSS);
      let ShippingList = utils_getTable(ID_FICHIER_SHIPPINGSESSION_IN_SHIPPING,SHIPPING_LIST_SHEET);

      if (ShippingList == null)
      {
        let msg="db_updateShippingSession: Fichier shipping introuvable, abandon...";
        errors_logErrorAndEmail(msg);
        ret={};
        ret["err"]="nok";
        ret["msg"] = msg;

        return;
      }

      let lastRow = ShippingList.getLastRow();
      let listTransactionIds=[];
      if (lastRow > 1)
      {
        let Ids = ShippingList.getRange(2,SHIPSESS_TRANSID,lastRow-1,1).getValues(); 
        listTransactionIds= new Array(Ids.length);
        for(let i=0;i<Ids.length;i++)
          listTransactionIds[i] = Ids[i][0];
      }

      //log_RessourceTaskForm(JSON.stringify(listTransactionIds));

      let ccyMDA2EURRate = ccy_getRateToEUR("MAD");
      let nAnswers = utils_parseInt(answers["nAnswers"]);

      //=========================================================
    
      for( let i=0;i< nAnswers;i++)
      {
        //log_RessourceTaskForm("Answer index="+ (i+1) + " OVER " + nAnswers);
        let anAnswer = answers["answers"][i];
        
        //Les données en entrée
        let receiptId           = anAnswer["receiptId"];
        let address             = anAnswer["address"] ;
        let email               = anAnswer["email"] ; 
        let phone               = anAnswer["phone"] ; 
        let comment             = anAnswer["comment"];
        let customerComment     = anAnswer["customerComment"];
        let postOfficeShipping  = anAnswer["postOfficeShipping"]; 
        let totalDiscount       = utils_parseFloat(anAnswer["totalDiscount"]);
        let totalTaxes          = utils_parseFloat(anAnswer["totalTaxes"]);
        
        let totPrice            = utils_parseFloat(anAnswer["totPrice"]);
        let totalWeight         = utils_parseFloat(anAnswer["totalWeight"]);
        let countryCode         = cust_getCountryCode(customerTableAccess,email);
        let totalShippingMAD    = amana_getTarif(countryCode,totalWeight);
        let totalShippingEUR    = ccyMDA2EURRate * totalShippingMAD;
        let iossCode            = db_computeIOSSCode(countryCode,totPrice);

        let orderTransactions   = anAnswer["transactions"];
        //log_RessourceTaskForm("orderTransactions.length. = " + orderTransactions.length);
        if ( orderTransactions.length > 0 )
        {
          for(let j=0;j<orderTransactions.length;j++ )
          {
            //log_RessourceTaskForm("Answer transaction index="+(j+1) + " OVER " + orderTransactions.length);
            let aTransaction        = orderTransactions[j];
            let prepareOnly         = aTransaction["prepareOnly"];
            let mustBeShipped       = aTransaction["validated"];
            let listingId           = aTransaction["listingId"];
            let title               = aTransaction["title"];
            let quantity            = utils_parseInt(aTransaction["quantity"]);
            let price               = utils_parseFloat(aTransaction["price"]);
            let variation           = aTransaction["variation"];  
            let produitEmballe      = aTransaction["produitEmballe"]?true:false;
            let shipFactureEUR      = utils_parseFloat(anAnswer["shipFacture"]);
            let etsyUrl             = aTransaction["etsyUrl"];
            let transId             = utils_parseInt(aTransaction["transId"]);

            
            //Calculer le statut de l'envoi et prendre en compte les coûts d'envoi   
            let status = SHIPPING_STATUS.PENDING;
            if ( mustBeShipped )
            {
                status = SHIPPING_STATUS.SHIPPED;
                transactionsShipped.push(transId);
            }
            else if (prepareOnly)
                status = SHIPPING_STATUS.PREPARED;

            //!!!! =================================================================================================!!!!!
            //!!!! Attention à bien conserver la structure de ce qui est enregistré avec le HEADER_SHIPPING_SESSION !!!!!
            //!!!! =================================================================================================!!!!!
            let newRowValues = [shippingDate,receiptId,email,phone,address,totalWeight,"",
                                postOfficeShipping,totPrice,totalShippingMAD,totalShippingEUR,comment,
                                transId,listingId,title, price, quantity,variation,produitEmballe,status,
                                shipFactureEUR,etsyUrl,iossCode,totalDiscount,totalTaxes,"", customerComment,""];


            //Si le poids est spécifié, on mettra le stock à jour avec cette valeur
            

            //Garde fous
            if ( newRowValues.length != HEADER_SHIPPING_SESSION.length)
            {
              let msg = "db_updateShippingSession: Record et Header ne concordent pas...";
              errors_logError(msg)
              throw new Error(msg);
            }

            let shipTransactionRow = listTransactionIds.indexOf(transId); //Les données partent de 0;
            
            if (shipTransactionRow < 0)
              ShippingList.appendRow(newRowValues);
            else
              ShippingList.getRange(shipTransactionRow+2,1,1,newRowValues.length).setValues([newRowValues])         
          }
        }
        else
        {
          errors_logError("db_updateShippingSession: no transactions found with order, at least one must be...");
          throw new Error("db_updateShippingSession: no transactions found with ordre, at least one must be...")
        }                          
      }

      SpreadsheetApp.flush();

      let ret={};
      ret["err"] = "ok";
      ret["transactionsShipped"] = transactionsShipped;
      return ret;
  }
  catch(err)
  {
    let ret={};
    ret["err"] = "nok";
    ret["msg"] = "db_updateShippingSession error: " + err.message; 
    return ret;
  }
  finally
  {
    lock_release(lock);
  }
}



/**==================================================================================================================
 * 
 *                                    db_validateShippingSession()
 * 
 ==================================================================================================================*/
 function test_alidateShippingSession()
 {
   let transIds = [2878284882];
   db_validateShippingSession(transIds);
 }

function db_validateShippingSession(transactionIdsArray)
{
  try
  {
    //Les fichiers étiquettes sont préfixés avec l'id de l'utilisateur les générant
    let user = Session.getActiveUser().getEmail();
    let splitted = user.split("@");

    //Créer les formes à coller sur colis
    //ON crée un nouveau dossier
    let dateTime        = utils_LocalGMTTimeFormatDate(ENUM_DATE_FORMAT.LONG_HHMMSS);

    let shippingFolder  = DriveApp.getFolderById(SHIPPING_ETIQUETTES_FOLDERID);
    let folderName      = "Etiquettes_"+splitted[0]+dateTime;
    var targetFolder    = shippingFolder.createFolder(folderName);

    let numberOFCreatedForms = db_createShippingForms(transactionIdsArray,targetFolder.getId(),targetFolder.getUrl());
    if ( numberOFCreatedForms > 0)
    {
      let ret={};
      ret["err"] = "ok";
      ret["msg"] = "Les étiquettes sont dans le répertoire suivant <a href='" + targetFolder.getUrl() + "' target='_blank'> Liste des étiquettes</a>";
      return ret;
    }
    else
    {
      targetFolder.setTrashed(true); 
      let ret={};
      ret["err"] = "ok";
      ret["msg"] = "Opération terminée sans aucune étiquette générée...";
      return ret;
    }
  }
  catch(err)
  {
    let ret={};
    ret["err"] = "nok";
    ret["msg"] = "db_validateShippingSession : " + err.message; 
    return ret;
  }
}



/**===================================================================================================
 *            
 *                            db_createShippingForms(folderId)                         
 *  															
 ===================================================================================================*/
function db_createShippingForms(transactionIdsArray,folderId, folderUrl) 
{
  var lock = lock_acquire();
  let numberOfCreatedForms=0;

  try
  {
      let customerTableAccess = tbl_tableAccess(TABLES_DEFINITIONS.CUSTOMER,TABLE_ACCESS_TYPE.REPEATED);

      let groups = db_groupShippingTransactionsPerCustomer();

      for (let i = 0; i < groups.length && numberOfCreatedForms < transactionIdsArray.length ; i++) 
      {
        let aGroup        = groups[i];
        let aShipping     = {};
        let itemsDetails  = [];
        let totalQuantity = 0;
        let totalPrice    = 0;
        let iossCode      = "no ioss";
        let totalDiscount = 0;
        let totalTaxes    = 0;
        let shipmentFacture =0;
        let customerComment ="";
        for (let j = 0; j < aGroup.length; j++) 
        {
            let theDataRow          = aGroup[j]["trans"];
            let email               = theDataRow[SHIPSESS_EMAIL - 1];
            let custLang            = cust_getLanguage(customerTableAccess,email)
            let formattedAddress    = theDataRow[SHIPSESS_ADDRESS - 1];
            let receiptId           = theDataRow[SHIPSESS_RECEIPTID - 1];
            let transactionId       = theDataRow[SHIPSESS_TRANSID - 1];
            let productDescription  = theDataRow[SHIPSESS_TITLE - 1];
            let quantity            = utils_parseInt(theDataRow[SHIPSESS_QUANTITY - 1]);
            let price               = utils_parseFloat(theDataRow[SHIPSESS_ITEMPRICE_EUR - 1]);
            let variations          = theDataRow[SHIPSESS_VARIATIONS-1];

            iossCode                = theDataRow[SHIPSESS_IOSSCODE-1];//sur toute la commande
            totalTaxes              = utils_parseFloat(theDataRow[SHIPSESS_TOTALORDERTAXES-1]); //Total sur toute la commande
            totalDiscount           = utils_parseFloat(theDataRow[SHIPSESS_TOTALORDERDISCOUNT-1]);  //Total sur toute la commande
            shipmentFacture         = utils_parseFloat(theDataRow[SHIPSESS_FACTUREEUR-1]); //Total sur toute la commande
            customerComment         = theDataRow[SHIPSESS_CUSTOMERCOMMENT-1]; //Global sur toute la commande
            

            //Compute prices
            let ccy                 = "EUR";
            let totalPriceForItem   = quantity * price;

            totalPrice    += totalPriceForItem;
            totalQuantity += quantity;

            if (j == 0) 
            {
              aShipping["receiptId"]        = receiptId;
              aShipping["email"]            = email;
              aShipping["formattedAddress"] = formattedAddress;
              aShipping["custLang"]         = custLang;
              aShipping["totalDiscount"]    = totalDiscount;
              aShipping["totalTaxes"]       = totalTaxes;
              aShipping["shipmentFacture"]  = shipmentFacture;
            }

             if ( transactionIdsArray.indexOf(transactionId) >= 0 )
              itemsDetails.push([transactionId, productDescription, quantity, totalPriceForItem, ccy,variations])
        }

        if (itemsDetails.length > 0) 
        {
          aShipping["itemsDetails"]   = itemsDetails;
          aShipping["totalPrice"]     = totalPrice;
          aShipping["totalQuantity"]  = totalQuantity;
          aShipping["iossCode"]       = iossCode;
          aShipping["customerComment"] = customerComment;

          let grandTotal = totalPrice + shipmentFacture - totalDiscount +  totalTaxes;
           aShipping["grandTotal"]    = grandTotal;

          ship_createDocShippingForm(aShipping, folderId);
          numberOfCreatedForms++;
        }
      }
  }
  catch(err)
  {
    errors_logErrorAndEmail("ship_createShippingForms: " + err.message);
  }
  finally
  {
    lock_release(lock);
  }

  return numberOfCreatedForms;
}


/**
 * 
 * 
 */
function getCols(arr,cols) 
{
  return arr.map(row =>
    row.filter((_,i) => cols.includes(++i)))
}



/**
 * 
 * 
 * 
 */
function db_getPreparedShippingTransactionsIds()
{
  let sheet = utils_getTable(ID_FICHIER_SHIPPINGSESSION_IN_SHIPPING,SHIPPING_LIST_SHEET);
  let lastRow = sheet.getLastRow();
  let transactionPrepared=[];

  if (lastRow > 1 )
  {
    let ShippingList = sheet.getRange(2,1,sheet.getLastRow()-1,HEADER_SHIPPING_SESSION.length).getValues();

    for(let i=0;i<ShippingList.length;i++)
    {
      let status = ShippingList[i][SHIPSESS_STATUS-1];
      if (status==SHIPPING_STATUS.PREPARED || status==SHIPPING_STATUS.PENDING )
        transactionPrepared.push(ShippingList[i][SHIPSESS_TRANSID-1]);
    }
  }

  return transactionPrepared;
}

function db_getPreparedShippingFullTransactions()
{
  let sheet = utils_getTable(ID_FICHIER_SHIPPINGSESSION_IN_SHIPPING,SHIPPING_LIST_SHEET);
  let lastRow = sheet.getLastRow();
  let transactionPrepared=[];

  if (lastRow > 1)
  {
    let ShippingList = sheet.getRange(2,1,lastRow-1,HEADER_SHIPPING_SESSION.length).getValues();
    
    for(let i=0;i<ShippingList.length;i++)
    {
      let status = ShippingList[i][SHIPSESS_STATUS-1];
      if (status == SHIPPING_STATUS.PREPARED || status==SHIPPING_STATUS.PENDING)
        transactionPrepared.push(ShippingList[i]);
    }
  }

  return transactionPrepared;

}


/**
 * 
 *  Toutes le transaction dans Shipping Session table qui sont marcquée SHIPPED
 * 
 */
function db_getShippedShippingTransactionsIds()
{
  let ShippingList = utils_getTable(ID_FICHIER_SHIPPINGSESSION_IN_SHIPPING,SHIPPING_LIST_SHEET).getDataRange().getValues();
  let transactionIds=[];

  for(let i=1;i<ShippingList.length;i++)
  {
    if (ShippingList[i][SHIPSESS_STATUS-1]==SHIPPING_STATUS.SHIPPED)
      transactionIds.push(ShippingList[i][SHIPSESS_TRANSID-1]);
  }

  return transactionIds;
}



/**
 * 
 * 
 * 
 */
function db_getStatusesEtsyTransaction()
{
  var sheet = db_getAnnualTransactionSheet();
  let lastRow = sheet.getLastRow();
  let data=[];
  var nonShippedData = [];
  let shippedTransIds=[];

  if (lastRow > 1)
  {
    data = sheet.getRange(2,1,lastRow-1,LASTCOLUMN_TRANSACTION_SHEET).getValues();

    for(let i=0;i<data.length;i++)
    {
        if (data[i][STATUS_INTRANSACTIONDATA_SHEET-1] ==  STATUS_TRANSACTION.ORDERED )
        {
          nonShippedData.push(data[i]);
        }
        else if (data[i][STATUS_INTRANSACTIONDATA_SHEET-1] ==  STATUS_TRANSACTION.SHIPPED )
          shippedTransIds.push(data[i][TRANSID_INTRANSACTIONDATA_SHEET-1]);
    }
  }

  return {"nonShippedData":nonShippedData, "shippedTransIds":shippedTransIds};
}




/**
 * 
 * 
 * 
 */
function db_buildItemsMapFromEtsyTransaction(transaction)
{
    let map = {};
    map["receiptId"]  = transaction[RECEIPTID_INTRANSACTIONDATA_SHEET-1];
    map["transId"]    = transaction[TRANSID_INTRANSACTIONDATA_SHEET-1];
    map["listingId"]  = transaction[LISTINGID_INTRANSACTIONDATA_SHEET-1];
    //map["title"]      = transaction[TITLE_INTRANSACTIONDATA_SHEET-1] + "//" + txt_translateEnglishText(transaction[TITLE_INTRANSACTIONDATA_SHEET-1],"fr");
    map["title"]      = txt_translateEnglishText(transaction[TITLE_INTRANSACTIONDATA_SHEET-1],"fr");
    map["quantity"]   = transaction[QUANTITY_INTRANSACTIONDATA_SHEET-1];
    map["price"]      = transaction[PRICE_INTRANSACTIONDATA_SHEET-1];
    map["email"]      = transaction[EMAIL_INTRANSACTIONDATA_SHEET-1];
    map["customer"]   = transaction[CUSTOMER_INTRANSACTIONDATA_SHEET-1];
    map["address"]    = transaction[FORMATTEDADDRESS_INTRANSACTIONDATA_SHEET-1];
    map["etsyUrl"]    = transaction[URLETSY_INTRANSACTIONDATA_SHEET-1];
    map["resteStock"] = transaction[RESTESTOCK_INTRANSACTIONDATA_SHEET-1];
    map["itemWeight"] = transaction[ITEMKGWEIGHT_INTRANSACTION_SHEET-1] != null? transaction[ITEMKGWEIGHT_INTRANSACTION_SHEET-1]:"";
    map["variation"]  = [];

    //Variations
    let details = utils_decodeObject(transaction[DETAILS_INTRANSACTIONDATA_SHEET-1])
    let variations = details["variation"];
    if ( variations.length > 0)
    {
      let varia={};
      varia["name"]  = variations[0].formatted_name;
      varia["value"] = variations[0].formatted_value;  
      map["variation"].push(varia);
    }
    return map;
}



function db_buildItemsMapFromShipSessionRecord(transaction,stockMap)
{
    let map = {};
    map["receiptId"]  = transaction[SHIPSESS_RECEIPTID-1];
    map["prepareOnly"] = (transaction[SHIPSESS_STATUS-1] == SHIPPING_STATUS.PREPARED);
    map["transId"]    = transaction[SHIPSESS_TRANSID-1];
    map["listingId"]  = transaction[SHIPSESS_LISTINGID-1];
    map["title"]      = transaction[SHIPSESS_TITLE-1];
    map["quantity"]   = transaction[SHIPSESS_QUANTITY-1];
    map["price"]      = transaction[SHIPSESS_ITEMPRICE_EUR-1];
    map["email"]      = transaction[SHIPSESS_EMAIL-1];
    map["address"]    = transaction[SHIPSESS_ADDRESS-1];
    map["etsyUrl"]    = transaction[SHIPSESS_ETSYURL-1];
    map["variation"]  = transaction[SHIPSESS_VARIATIONS-1];
    map["produitEmballe"]= transaction[SHIPSESS_EMBALLE-1]?true:false;
    map["itemWeight"]    =  transaction[SHIPSESS_ITEMWEIGHT-1]; 
    
    let stockRow = stockMap[map["listingId"]];
    if ( stockRow != null)
      map["resteStock"]         = stockRow[STOCK_QUANTITY-1];
    else
      map["resteStock"]         = -1000000000;
    return map;
}

/**
 * 
 * 
 */
function db_getAllShippingSession()
{
  let shipSession = utils_getTable(ID_FICHIER_SHIPPINGSESSION_IN_SHIPPING,SHIPPING_LIST_SHEET);
  let lastRow = shipSession.getLastRow();

  if ( lastRow < 2)
    return [];

  return shipSession.getRange(2,1,lastRow-1,HEADER_SHIPPING_SESSION.length).getValues();
}



/**
 * 
 * On prend ceux qui sont dans le fichier ShippingSession, qui sont en statut PREPARED (pas les SHIPPED)  
 *  sauf si elles sont marquées SHIPPED dans ETsy
 */
function db_rebuildPreparedShippingOrder(etsyShippedTransIds)
{
  let preparedTransactions = db_getPreparedShippingFullTransactions();
  let orders=[];
  let preparedIds=[];

  if ( preparedTransactions.length > 0 )
  {
    let stockMap = stock_doMap();

    let anOrder = {}
    anOrder["receiptId"]    = preparedTransactions[0][SHIPSESS_RECEIPTID-1];
    anOrder["email"]        = preparedTransactions[0][SHIPSESS_EMAIL-1];
    anOrder["phone"]        = preparedTransactions[0][SHIPSESS_PHONE-1];
    anOrder["address"]      = preparedTransactions[0][SHIPSESS_ADDRESS-1];
    anOrder["shipFacture"]  = preparedTransactions[0][SHIPSESS_FACTUREEUR-1];
    anOrder["comment"]      = preparedTransactions[0][SHIPSESS_COMMENT-1];
    anOrder["customerComment"]    = preparedTransactions[0][SHIPSESS_CUSTOMERCOMMENT-1];
    anOrder["postOfficeShipping"] = preparedTransactions[0][SHIPSESS_POSTID-1];
    anOrder["weightKg"]           = preparedTransactions[0][SHIPSESS_TOTWEIGHTKG-1];

    anOrder["items"]        = {};

    if ( preparedTransactions[0][SHIPSESS_STATUS-1] != SHIPPING_STATUS.SHIPPED && etsyShippedTransIds.indexOf(preparedTransactions[0][SHIPSESS_TRANSID-1]) < 0)
    {
      let map = db_buildItemsMapFromShipSessionRecord(preparedTransactions[0],stockMap);

      anOrder["items"]["0"]   = map;
      anOrder["totPrice"]     = utils_parseFloat(map["price"]) * utils_parseInt(map["quantity"] );
      anOrder["totalDiscount"]  =  utils_parseFloat(preparedTransactions[0][SHIPSESS_TOTALORDERDISCOUNT-1]);
      anOrder["totalTaxes"]     =  utils_parseFloat(preparedTransactions[0][SHIPSESS_TOTALORDERTAXES-1]);

      preparedIds.push(preparedTransactions[0][SHIPSESS_TRANSID-1]);
    }

    let lastItemIndex=0;

    let lastReceipt = anOrder["receiptId"] ;

    for ( let i=1;i<preparedTransactions.length;i++)
    {
      let receipt = preparedTransactions[i][SHIPSESS_RECEIPTID-1];

      if ( receipt == lastReceipt )
      {
          if ( preparedTransactions[i][SHIPSESS_STATUS-1] != SHIPPING_STATUS.SHIPPED &&  
               etsyShippedTransIds.indexOf(preparedTransactions[i][SHIPSESS_TRANSID-1]) < 0)
          {
            lastItemIndex++; //!!! Ordre important
  
            let map   = db_buildItemsMapFromShipSessionRecord(preparedTransactions[i],stockMap)
            anOrder["totPrice"] += map["price"] * map["quantity"] ;
            anOrder["items"][`${lastItemIndex}`] = map;

            preparedIds.push(preparedTransactions[0][SHIPSESS_TRANSID-1]);
          }
      }
      else
      {
          if ( Object.keys(anOrder.items).length > 0 )
            orders.push(anOrder);

          anOrder = {};
          anOrder["receiptId"]              = preparedTransactions[i][SHIPSESS_RECEIPTID-1];
          anOrder["email"]                  = preparedTransactions[i][SHIPSESS_EMAIL-1];
          anOrder["phone"]                  = preparedTransactions[i][SHIPSESS_PHONE-1];
          anOrder["address"]                = preparedTransactions[i][SHIPSESS_ADDRESS-1];
          anOrder["comment"]                = preparedTransactions[i][SHIPSESS_COMMENT-1];
          anOrder["customerComment"]        = preparedTransactions[i][SHIPSESS_CUSTOMERCOMMENT-1];
          anOrder["postOfficeShipping"]     = preparedTransactions[i][SHIPSESS_POSTID-1];
          anOrder["weightKg"]               = preparedTransactions[i][SHIPSESS_TOTWEIGHTKG-1];
          anOrder["shipFacture"]            = utils_parseFloat(preparedTransactions[i][SHIPSESS_FACTUREEUR-1]);
          anOrder["totalDiscount"]          =  utils_parseFloat(preparedTransactions[i][SHIPSESS_TOTALORDERDISCOUNT-1]);
          anOrder["totalTaxes"]             =  utils_parseFloat(preparedTransactions[i][SHIPSESS_TOTALORDERTAXES-1]);
          anOrder["totalPrice"]             = 0;
          anOrder["items"]                  = {};


          if ( preparedTransactions[i][SHIPSESS_STATUS-1] != SHIPPING_STATUS.SHIPPED && 
               etsyShippedTransIds.indexOf(preparedTransactions[i][SHIPSESS_TRANSID-1]) < 0)
          {
            let map = db_buildItemsMapFromShipSessionRecord(preparedTransactions[i],stockMap);
            anOrder["totPrice"]   = utils_parseFloat(map["price"]) * utils_parseInt(map["quantity"] )
            anOrder["items"]["0"] = map;
            anOrder["weightKg"] = map["weightKg"];

            preparedIds.push(preparedTransactions[i][SHIPSESS_TRANSID-1]);
          }

          lastItemIndex         = 0;
          lastReceipt           = anOrder["receiptId"];
      }
    }

    if ( Object.keys(anOrder.items).length > 0 )
      orders.push(anOrder);
  }

  let retVal={};
  retVal["orders"] = orders;
  retVal["preparedIds"] = preparedIds;
  return retVal;
}

/**
 *  Appelé depuis shippingMngt-js
 * 
 * 
 */

function db_testSaid()
{
  let retVal = {};
  retVal["err"] = "nok";
  retVal["msg"] = "On y arrivera...;o))"; 
  return JSON.stringify(retVal);
}

function db_getWaitingShipping()
{
  let lock = lock_acquire();
  
  try
  {
      let customerTableAccess = tbl_tableAccess(TABLES_DEFINITIONS.CUSTOMER,TABLE_ACCESS_TYPE.REPEATED);
      let orders = {};
      orders["length"] = 0;

      //Puis les commandes Etsy non encore traitées
      //==============================================
      let etsyData = db_getStatusesEtsyTransaction();

      let etsyNonShippedTransactions  = etsyData.nonShippedData;
      let etsyShippedTransactionIds   = etsyData.shippedTransIds;

      //D'abord les prepared non shippées car ils sont probablement prêts à partir
      //==========================================================================
      let retData = db_rebuildPreparedShippingOrder(etsyShippedTransactionIds);

      orders["orders"]  = retData["orders"];
      let preparedIds   = retData["preparedIds"];

      //MAintenant on prend les transqction non preparée et non shippée ETSY
      //Pour faire un check on reprend celle shipped dans Session ID (seulement les Transaction Ids)
      //=============================================================================================

      if ( etsyNonShippedTransactions.length > 0 )
      {
        let anOrder = {}
        
        anOrder["receiptId"]        = etsyNonShippedTransactions[0][RECEIPTID_INTRANSACTIONDATA_SHEET-1];
        anOrder["email"]            = etsyNonShippedTransactions[0][EMAIL_INTRANSACTIONDATA_SHEET-1];
        anOrder["phone"]            = cust_getPhone(customerTableAccess,anOrder["email"]);
        anOrder["address"]          = etsyNonShippedTransactions[0][FORMATTEDADDRESS_INTRANSACTIONDATA_SHEET-1];
        anOrder["shipFacture"]      = etsyNonShippedTransactions[0][SHIPFACTURE_INTRANSACTIONDATA_SHEET-1];
        anOrder["totalDiscount"]    = etsyNonShippedTransactions[0][TOTALDISCOUNT_INTRANSACTIONDATA_SHEET-1];
        anOrder["totalTaxes"]       = etsyNonShippedTransactions[0][TOTALTAXES_INTRANSACTIONDATA_SHEET-1];     
        anOrder["items"]            = {};
        
        //Vérifier qu'elle n'est pas déjà shipped dans session ID <==> oubli de mettre à Shipped
        //Dans ETSY
        if ( preparedIds.indexOf(etsyNonShippedTransactions[0][TRANSID_INTRANSACTIONDATA_SHEET-1]) < 0)
        {
          let map                     = db_buildItemsMapFromEtsyTransaction(etsyNonShippedTransactions[0]);
          anOrder["items"]["0"]       = map;
          anOrder["totPrice"]         = utils_parseFloat(map["price"]) * utils_parseInt(map["quantity"] );
          anOrder["totalWeight"]      = map["itemWeight"];
        }

        let lastItemIndex=0;
        let lastReceipt = anOrder["receiptId"] ;
        for ( let i=1;i<etsyNonShippedTransactions.length;i++)
        {
          if ( etsyNonShippedTransactions[i][TRANSID_INTRANSACTIONDATA_SHEET-1] == 2914473565)
          {
            let sdfsdfs=0;
          }

          let receipt = etsyNonShippedTransactions[i][RECEIPTID_INTRANSACTIONDATA_SHEET-1];

          if ( receipt == lastReceipt )
          {
              lastItemIndex++;
              
              //Vérifier qu'elle n'est pas déjà shipped dans ession ID <==> oubli de mettre à Shipped
              //Dans ETSY
              if ( preparedIds.indexOf(etsyNonShippedTransactions[i][TRANSID_INTRANSACTIONDATA_SHEET-1]) < 0)
              {
                let map = db_buildItemsMapFromEtsyTransaction(etsyNonShippedTransactions[i]);
                anOrder["totPrice"]     += utils_parseFloat(map["price"]) * utils_parseInt(map["quantity"] );;
                anOrder["totalWeight"]  += utils_parseFloat(map["itemWeight"]);
                anOrder["items"][`${lastItemIndex}`] = map;
              }

          }
          else
          {
              if ( Object.keys(anOrder.items).length > 0 )
              {
                if ( anOrder["totalWeight"] > 0 )
                {
                  let countryCode         = cust_getCountryCode(customerTableAccess,anOrder["email"] );
                  anOrder["totalShipCost"] = amana_getTarif(countryCode,anOrder["totalWeight"]);
                }
              }
                

              anOrder = {};
              anOrder["receiptId"]    = etsyNonShippedTransactions[i][RECEIPTID_INTRANSACTIONDATA_SHEET-1];
              anOrder["email"]        = etsyNonShippedTransactions[i][EMAIL_INTRANSACTIONDATA_SHEET-1];
              anOrder["phone"]        = ""; 
              anOrder["address"]      = etsyNonShippedTransactions[i][FORMATTEDADDRESS_INTRANSACTIONDATA_SHEET-1];
              anOrder["shipFacture"]  = etsyNonShippedTransactions[i][SHIPFACTURE_INTRANSACTIONDATA_SHEET-1];
              anOrder["totalDiscount"] = etsyNonShippedTransactions[i][TOTALDISCOUNT_INTRANSACTIONDATA_SHEET-1];
              anOrder["totalTaxes"]    = etsyNonShippedTransactions[i][TOTALTAXES_INTRANSACTIONDATA_SHEET-1];
              anOrder["totPrice"]     = 0;
              anOrder["items"]        = {};

              
              if ( preparedIds.indexOf(etsyNonShippedTransactions[i][TRANSID_INTRANSACTIONDATA_SHEET-1]) < 0)
              {
                let map = db_buildItemsMapFromEtsyTransaction(etsyNonShippedTransactions[i]);
                anOrder["items"]["0"]       = map;
                anOrder["totPrice"]         = utils_parseFloat(map["price"]) * utils_parseInt(map["quantity"] );
                anOrder["totalWeight"]      = map["itemWeight"];
                orders["orders"].push(anOrder);
              }

              //===============================
              lastItemIndex         = 0;
              lastReceipt           = anOrder["receiptId"];
          }
        }

      }

      
      //Retourner l'ensemble
      orders["length"] = orders["orders"].length;

      let retVal = {};
      retVal["err"] = "ok";
      retVal["data"] = orders;

      return JSON.stringify(retVal);
  }
  catch(err)
  {
    let retVal = {};
    retVal["err"] = "nok";
    retVal["msg"] = err.message;
  }
  finally
  {
    lock_release(lock);
  }
}


/**
 * 
 * 
 *                  db_updateShippingStatus
 * Update status of transactions in Shipping Session table
 */
function db_updateShippingStatus()
{
  let shippingSessionSheet = utils_getTable(ID_FICHIER_SHIPPINGSESSION_IN_SHIPPING,SHIPPING_LIST_SHEET);
  let shippingSession = db_getPreparedShippingFullTransactions();
  let shippingSessionIds = new Array(shippingSession.length)
  for(let i=0;i<shippingSession.length;i++)
    shippingSessionIds[i] = shippingSession[i][SHIPSESS_TRANSID-1];

  var sheet = db_getAnnualTransactionSheet();
  let lastRow = sheet.getLastRow();
  let data=[];
  var nonShippedData = [];
  let shippedTransIds=[];

  if (lastRow > 1)
  {
    data = sheet.getRange(2,1,lastRow-1,LASTCOLUMN_TRANSACTION_SHEET).getValues();
    let shippingDate = new Date() -1;

    for(let i=0;i<data.length;i++)
    {
        let transId = data[i][TRANSID_INTRANSACTIONDATA_SHEET-1];
        if (data[i][STATUS_INTRANSACTIONDATA_SHEET-1] ==  STATUS_TRANSACTION.SHIPPED ) 
        {
            let index = shippingSessionIds.indexOf(transId);

            if (index >= 0 && shippingSessionIds[index][SHIPSESS_STATUS] != SHIPPING_STATUS.SHIPPED )
            {
                shippingSessionSheet.getRange(2+index,SHIPSESS_STATUS,1,1).setValue(SHIPPING_STATUS.SHIPPED)
                shippingSessionSheet.getRange(2+index,SHIPSESS_SHIPDATE,1,1).setValue(shippingDate)
            }
        } 
    }
  }
}
/*===================================================================================================*/
/**
 * 
 * 
 */
function db_modifyTransactionsTable(ordersSheet, transactionsSheet, updateWithTheseOrders) 
{ 
    let newTransactions = [];
    let firstRowToUpdate=2;

    //Les ordres comme reçus d'etsy. Sur un ordre on peut avoiur plusieurs transaction (plusieurs objets dans la même commande)
    let ordersTocareOf = [];
    if ( updateWithTheseOrders == null)
      ordersTocareOf = ordersSheet.getRange(2,1,ordersSheet.getLastRow()-1,HEADER_ORDERS.length).getValues();
    else
    {
      ordersTocareOf = updateWithTheseOrders;
      firstRowToUpdate = transactionsSheet.getLastRow()+1;
    }


    for (let i = 0;i< ordersTocareOf.length;i++) 
    { 
      let trans = utils_convertObjectToArray(ordersTocareOf[i][TRANSACTIONS_INDATA_SHEET-1]);
      let newTrans= new Array(HEADER_TRANSACTION_SHEET.length);		

      let date = ordersTocareOf[i][0];
      newTrans[SELLINGDATE_INTRANSACTIONDATA_SHEET-1]       = date;
      newTrans[EMAIL_INTRANSACTIONDATA_SHEET-1]             = ordersTocareOf[i][EMAIL_INDATA_SHEET-1];
      newTrans[CUSTOMER_INTRANSACTIONDATA_SHEET-1]          = ordersTocareOf[i][CUSTNAME_INDATA_SHEET-1];
      newTrans[ADDRESS_INTRANSACTIONDATA_SHEET-1]           = ordersTocareOf[i][ADDRESS_INDATA_SHEET-1];
      newTrans[FORMATTEDADDRESS_INTRANSACTIONDATA_SHEET-1]  = ordersTocareOf[i][FORMATTEDADDRESS_INDATA_SHEET-1];
      newTrans[ORDER_DATE_INTRANSACTIONDATA_SHEET-1]        = ordersTocareOf[i][DATE_INDATA_SHEET -1];
      newTrans[TOTALDISCOUNT_INTRANSACTIONDATA_SHEET-1]     = ordersTocareOf[i][TOTALDISCOUNT_INDATA_SHEET -1]
      newTrans[TOTALTAXES_INTRANSACTIONDATA_SHEET-1]        = ordersTocareOf[i][TOTALTAXES_INDATA_SHEET -1]
      
      if (ordersTocareOf[i][IS_SHIPPED_INDATA_SHEET-1] == true)
      {
        newTrans[STATUS_INTRANSACTIONDATA_SHEET-1]    = STATUS_TRANSACTION.SHIPPED;
        newTrans[SHIP_DATE_INTRANSACTIONDATA_SHEET-1] = ordersTocareOf[i][DATE_SHIPPED_INDATA_SHEET-1]
      }
      else 
      {
        newTrans[STATUS_INTRANSACTIONDATA_SHEET-1]    = STATUS_TRANSACTION.ORDERED;
        newTrans[SHIP_DATE_INTRANSACTIONDATA_SHEET-1] = "";
      }

      newTrans[DELIVERY_DATE_INTRANSACTIONDATA_SHEET-1] = "";
      newTrans[SHIPFACTURE_INTRANSACTIONDATA_SHEET-1] = ordersTocareOf[i][SHIPPING_COSTEUR_INDATA_SHEET-1];

      //On créé une ligne par transaction touvée dans la commande (order)
      //================================================================
      let strAllTransactions = {};
      for( let j=0;j<trans.length;j++)
      {
        let aNewTrans = newTrans.slice();

        let aTransaction = {};
        aTransaction.transId        = trans[j][TRANS_ID_INDETAILS-1];
        aTransaction.receiptId      = trans[j][RECEIPT_ID_INDETAILS-1];
        aTransaction.listingId      = trans[j][LISTINGID_INDETAILS-1];
        aTransaction.productId      = trans[j][PRODUCTID_INDETAILS-1];
        aTransaction.title          = trans[j][TITLE_INDETAILS-1];
        aTransaction.buyer_user_id  = trans[j][BUYERID_INDETAILS-1];
        aTransaction.quantity       = trans[j][QUANTITY_INDETAILS-1];
        aTransaction.price          = trans[j][PRICE_INDETAILS-1];
        aTransaction.shipping       = trans[j][SHIPPING_INDETAILS-1];
        aTransaction.variation       = trans[j][VARIATION_INDETAILS-1];

        //Fill placeholders
        aNewTrans[RECEIPTID_INTRANSACTIONDATA_SHEET-1]     = aTransaction.receiptId ; //update placeholder
        aNewTrans[TRANSID_INTRANSACTIONDATA_SHEET-1]       = aTransaction.transId ; //update placeholder
        aNewTrans[LISTINGID_INTRANSACTIONDATA_SHEET-1]     = aTransaction.listingId ; //update placeholder
        aNewTrans[TITLE_INTRANSACTIONDATA_SHEET-1]         = aTransaction.title ; //update placeholder
        aNewTrans[QUANTITY_INTRANSACTIONDATA_SHEET-1]      = aTransaction.quantity //update placeholder
        aNewTrans[PRICE_INTRANSACTIONDATA_SHEET-1]         = aTransaction.price["amount"]/aTransaction.price["divisor"];
        aNewTrans[DETAILS_INTRANSACTIONDATA_SHEET-1]       = utils_encodeObject(aTransaction);
        aNewTrans[STRING4QRCODE_INTRANSACTIONDATA_SHEET-1] = 
                        utils_escapeDoubleQuotesAndBlanksChars(aNewTrans[DETAILS_INTRANSACTIONDATA_SHEET-1]);


        //Retrouver des infos stock
        let stockData = stock_findRecordByEtsyListingId(aTransaction.listingId);
        if ( stockData["err"]  == "ok" )
        {
            stockRecord = stockData["record"];
            aNewTrans[URLETSY_INTRANSACTIONDATA_SHEET-1] = stockRecord[STOCK_URL-1];
            aNewTrans[RESTESTOCK_INTRANSACTIONDATA_SHEET-1] = stockRecord[STOCK_QUANTITY-1]; 
            aNewTrans[ITEMKGWEIGHT_INTRANSACTION_SHEET-1] = stockRecord[STOCK_KG_WEIGHT-1]; 
        }

        newTransactions.push(aNewTrans);
      }
    }

    //Save transactions, all by customer
    //=================================
    if ( newTransactions.length > 0 )
    {
      log_RessourceTaskForm
      transactionsSheet.getRange(firstRowToUpdate,1,newTransactions.length,HEADER_TRANSACTION_SHEET.length).setValues(newTransactions);

      //Group by customer
      //===================================
      let groups = db_groupSellingTransactionsPerCustomer(newTransactions);

      transactionsSheet.getRange(1,1,1,HEADER_TRANSACTION_SHEET.length).setBackground("lightgreen");
      let color=["#FFFFFF","#FFE8C1"];
      let firstRow=2;
      for (let i = 0;i < groups.length;i++) 
      { 
        let aGroup = groups[i];

          //Highligth previous nRowToHighlight rows
        transactionsSheet.getRange(firstRow,1,aGroup.length,HEADER_TRANSACTION_SHEET.length).setBackground(color[i%2]);
        firstRow += aGroup.length;
      }
    }
}


/**
 * Group transactions per customer
 * 
 */
function db_groupSellingTransactionsPerCustomer(transactions)
{
    let customersTransaction=[];
    if ( transactions.length == 0)
        return customersTransaction;

    //========================== HIGHHTLIGHT ==========================
    let lastReceiptId=transactions[0][RECEIPTID_INTRANSACTIONDATA_SHEET-1];
    let receiptId;
    let newCustomer=[];

    newCustomer.push(transactions[0])
    for (let i = 1;i <transactions.length;i++) 
    { 
      receiptId = transactions[i][RECEIPTID_INTRANSACTIONDATA_SHEET-1];
      if ( receiptId == lastReceiptId )
      {
          newCustomer.push(transactions[i]);
      }
      else
      {
          customersTransaction.push(newCustomer);
          newCustomer=[];
          newCustomer.push(transactions[i])
          lastReceiptId=receiptId;
      }
    }
    
    if (newCustomer.length > 0)
      customersTransaction.push(newCustomer);
    
    return customersTransaction;
}



/**============================================================================================
 * Group transactions per customer
 * 
 ============================================================================================*/
function db_groupShippingTransactionsPerCustomer()
{
    let shipSession = utils_getTable(ID_FICHIER_SHIPPINGSESSION_IN_SHIPPING,SHIPPING_LIST_SHEET);
    let lastRow = shipSession.getLastRow();
    let customersTransaction=[];

    if ( lastRow < 2)
      return customersTransaction;

    let transactions = shipSession.getRange(2,1,lastRow-1,HEADER_SHIPPING_SESSION.length).getValues();
    
    //========================== HIGHHTLIGHT ==========================
    let lastReceiptId="";
    let firstCustLine=0;
    let newCustomer=[];

    for (let i = 0;i <transactions.length;i++) 
    { 
      let aTransaction = transactions[i];
      let status       = aTransaction[SHIPSESS_STATUS-1];
      let receiptId    = aTransaction[SHIPSESS_RECEIPTID-1];

      if ( status == SHIPPING_STATUS.SHIPPED && (i==0 || receiptId == lastReceiptId ))
      {
          let obj = {};
            obj["tableRow"] = i+1 ; //+1 to skip header.....not good...
            obj["trans"] = aTransaction;
            newCustomer.push(obj);
      }
      else
      { 
          //Save current group
          if (newCustomer.length > 0)
            customersTransaction.push(newCustomer);

          //Start next
          newCustomer = [];
          if ( status == SHIPPING_STATUS.SHIPPED )
          {
            let obj = {};
            obj["tableRow"] = i+1 ; //+1 to skip header.....not good...
            obj["trans"] = aTransaction;
            newCustomer.push(obj);
          }
            
      }
      
      lastReceiptId=receiptId;
    }

    if ( newCustomer.length > 0)
      customersTransaction.push(newCustomer);  

    return customersTransaction;
}


/**
 * 
 * 
 */

function db_replaceTextWithImage(bodyDoc,thisText,blob) 
{
  //var body = DocumentApp.getActiveDocument().getBody(); // Get current document's body
  var body=bodyDoc;
  var element = body.findText(thisText).getElement(); // Get element of #Photo#
  element.asText().setText(""); // Remove #Photo# placeholder
  //var url = "YOUR_IMAGE_URL"; // Change this accordingly
  //var blob = UrlFetchApp.fetch(url).getBlob(); // Get blob from image URL
  var image = element.getParent().asParagraph().insertInlineImage(0, blob); // Insert image
}




/*================== UPDATE ====================*/

function db_updateAnnualTransactionsTable(withTheseNewOrders) 
{
  let transactionsSheet = utils_getSheet(ANNUAL_TRANSACTIONS_SHEET);
  let ordersSheet = utils_getSheet(DATA_SHEET);

  db_modifyTransactionsTable(ordersSheet, transactionsSheet,withTheseNewOrders) ; 
}

function db_updateRetroTransactionsTable(withTheseNewOrders) 
{
  let transactionsSheet = utils_getSheet(RETRO_TRANSACTIONS_SHEET);
  let ordersSheet = utils_getSheet(RETRODATA_SHEET);

  db_modifyTransactionsTable(ordersSheet, transactionsSheet,withTheseNewOrders) ; 
}


function db_UpdatesAll()
{
  db_updateAnnualTransactionsTable(null) 
  db_updateRetroTransactionsTable(null) 
}


/*================== INITIALIZE ====================*/
function db_initializeAnnualTransactionsTable() 
{
  let transactionsSheet = utils_getSheet(ANNUAL_TRANSACTIONS_SHEET);
  if ( transactionsSheet.getLastRow() > 1)
    transactionsSheet.getRange(2,1,transactionsSheet.getLastRow()-1,HEADER_TRANSACTION_SHEET.length).clear();

  let ordersSheet = utils_getSheet(DATA_SHEET);

  db_modifyTransactionsTable(ordersSheet, transactionsSheet,null) ; 
}


function db_initializeRetroTransactionsTable() 
{
  let transactionsSheet = utils_getSheet(RETRO_TRANSACTIONS_SHEET);
  if ( transactionsSheet.getLastRow() > 1)
    transactionsSheet.getRange(2,1,transactionsSheet.getLastRow()-1,HEADER_ORDERS.length).clear();

  let ordersSheet = utils_getSheet(RETRODATA_SHEET);

  db_modifyTransactionsTable(ordersSheet, transactionsSheet,null) ; 
}



function db_InitializeAll()
{
  db_initializeAnnualTransactionsTable() ;
  db_initializeRetroTransactionsTable() ;
}


/**
 * 
 * 
 */
function cleanLastRowCache()
{
  CacheService.getDocumentCache().remove("lastCustOrderRow");
}

function db_restartFromHere()
{
  db_reinitTableOfLastCustomerOrder(589)
}











