
const ETSY_STATUS=
{
  ACTIVE: "active",
  SOLDOUT: "sold_out"
}
const LISTING_STATUS=
{
  ACTIVE: "Active",
  SOLDOUT: "Sold out",
  UNKNOWN: "Unknown"
};

const LISTINGS_HEADER=
["listing id",	"Created",	"Status", "Title", "Unit buy price", "Unit sell Price", "Ccy","Description",	"Quantity",	"Total Buy Amount",  "Potential Revenue Amount", "Num sold", "Revenue", "Soldout forcast","Url"	, "Num. favorer",	"Is customizable",	"Is personalizable", "Who made", "Style", "Weight", "Units" , "Length"	,"Width",	"Height",	"Unit","Details", "Tags", "Materials","Style","Images","Production partners","skus"];

            
const LISTINGID_ININVENT          = 1;
const DATE_ININVENT               = 2
const STATE_ININVENT              = 3;
const TITLE_ININVENT              = 4;
const UNITBUY_PRICE_ININVENT      = 5;
const UNITSELL_PRICE_ININVENT     = 6;
const CCY_ININVENT                = 7;
const DESCRIPTION_ININVENT        = 8 ;
const QUANTITY_ININVENT           = 9 ;
const BUYAMOUNT_IN_INVENT         = 10;
const POTENTIAL_REVENUE_IN_INVENT = 11;
const NUMSOLD_IN_INVENT           = 12;
const REVENUE_IN_INVENT           = 13;
const SOLDOUT_FORCAST_IN_INVENT   = 14;
const URL_ININVENT                = 15;  
const FAVOR_ININVENT              = 16 ;
const CUSTOM_ININVENT             = 17 ;
const PERSO_ININVENT              = 18 ;
const WHO_ININVENT                = 19; 
const STYLE_ININENT               = 20; 
const WEIGHT_ININVENT             = 21;  
const WUNITS_ININVENT             = 22;  
const LENGTH_ININVENT             = 23;  
const WIDTH_ININVENT              = 24;  
const HEIGHT_ININVENT             = 25;  
const LUNITS_ININVENT             = 26;  
const DETAILS_ININVENT            = 27; 
const TAGS_ININVENT               = 28; 
const MATERIALS_ININVENT          = 29; 
const STYLES_ININVENT             = 30; 
const IMAGES_ININVENT             = 31; 
const PRODPARTNERS_ININVENT       = 32; 
const SKUS_ININVENT               = 33;
const LASTCOL_ININVENT            = LISTINGS_HEADER.length;


/*============================= STOCK =================================================*/
const STOCK_SPREADSHEET_ID = "18YtDyTtZZErpDBmoILrknP_8R8BR5sZ3uX3XidQcoQo";

const STOCK_SHEET = "Stock";
const STOCK_HEADER=
["Id","Created", "Updated", "listing id",	"SKU", "Title", "Description", "Url", "CM Length"	, "CM Width",	"CM Height", "CM Diam Top","CM Diam Middle","CM Diam Bottom",
"Kg Weight", "Unit buy price", "Batch size", "Batch price", "Prod Partner", "Unit sell Price", "Ccy", "Quantity", "Soldout forcast", "Min. threshold", "Average prod days","Order Image Id"];

												
const STOCK_ID                = 1;
const STOCK_CRE_DATE          = 2
const STOCK_UPD_DATE          = 3;
const STOCK_LISTINGID         = 4;
const STOCK_SKU               = 5;
const STOCK_TITLE             = 6;
const STOCK_DESCRIPTION       = 7;
const STOCK_URL               = 8; 
const STOCK_CM_LENGTH         = 9;
const STOCK_CM_WIDTH          = 10;
const STOCK_CM_HEIGHT         = 11;
const STOCK_CM_DIAMTOP        = 12;
const STOCK_CM_DIAMMIDDLE     = 13;
const STOCK_CM_DIAMBOTTOM     = 14;
const STOCK_KG_WEIGHT         = 15;
const STOCK_UNITBUY_PRICE     = 16;
const STOCK_BATCH_SIZE        = 17;
const STOCK_BATCHBUY_PRICE    = 18;
const STOCK_PRODPARTNER       = 19;
const STOCK_UNITSELL_PRICE    = 20;
const STOCK_CCY               = 21;
const STOCK_QUANTITY          = 22 ;
const STOCK_SOLDOUT_FORCAST   = 23;
const STOCK_MINTHRESHOLD      = 24;
const STOCK_AVERAGEPROD_DAYS  = 25;
const STOCK_IMAGEID           = 26;
const STOCK_LASTCOL           = STOCK_HEADER.length;     

/*============== FOURNISSEURS =====*/
const STOCK_FOURNISSEURS = "Fournisseurs";
const FOURNISSEURS_HEADER = ["id",	"Nom",	"email",	"telephone",	"adresse"];

const FOURNI_ID = 1;
const FOURNI_NOM = 2;
const FOURNI_EMAIL=3;
const FOURNI_TEL=4;
const FOURNI_ADRESSE=5;

/*============== MATERIEUX =====*/
const STOCK_MATERIAUX = "Materiel";
const MATERIALHEADER = ["Id","Libelle"];
const MATERIEL_ID = 1;
const MATERIEL_LIBELLE=2;


/*=====================================================================================*/

/**
 * 
 * 
 */
let ListeThreshold = 100;
/**
 * 
 * 
 */
function stock_getAllShopListings()
{
  let dataSheet = utils_getSheet(LISTINGS_SHEET);   
  dataSheet.getRange(2,1,dataSheet.getLastRow(),LISTINGS_HEADER.length).clear();

  stock_retrieveAllShopListings("active",dataSheet) 
} 

/**
 * 
 * ================================================================================================
 */
function stock_retrieveAllShopListings(listingState,dataSheet) 
{
  let BulkDataRows=[];
  let NextRowFlush=2;

  //=======================================
  // Retrieve data
  //=======================================
  let EtsyService = etsy_getService();
  let listingsOffset    = 0; 
  let remainingListings =0;
  do
  {
    try
    {
      //https://openapi.etsy.com/v3/application/shops/{shop_id}/listings

      let theRequest = 
      `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}/listings/${listingState}?&limit=${ListeThreshold}&offset=${listingsOffset}`;


      let headers=
      {
        'x-api-key': CLIENT_ID,
        Authorization: 'Bearer ' + EtsyService.getAccessToken()
      };

      let params = 
      {
      method: "GET",
      contentType: "application/json",
      headers: headers,
      muteHttpExceptions: true, // for debugging 
      };

      let response = UrlFetchApp.fetch(theRequest,params);

      let theListings = JSON.parse(response.getContentText());

      BulkDataRows = [];
      if ( theListings.count > 0 )
      {
        for (let ic =0 ; ic < theListings.results.length;ic++) 
        {   
            let etsyListing = theListings.results[ic];
        
            let aRow = [];
            aRow.push(etsyListing["listing_id"]);
            
            let aDate = new Date(etsyListing["creation_timestamp"] * 1000);
            let dateCreated = (aDate.getMonth()+1)+"/"+(aDate.getDate())+"/"+(aDate.getFullYear()-2000);
            aRow.push(dateCreated);

            aRow.push( listingState == ETSY_STATUS.ACTIVE ? LISTING_STATUS.ACTIVE : 
                       listingState == ETSY_STATUS.SOLDOUT? LISTING_STATUS.SOLDOUT : 
                       LISTING_STATUS.UNKNOWN);

            aRow.push(etsyListing["title"]);
            aRow.push(""); //Unit buy price place holder

            //Selling price
            let unitSellPrice = etsyListing["price"]["amount"]/etsyListing["price"]["divisor"];
            aRow.push(unitSellPrice);
            aRow.push(etsyListing["price"]["currency_code"]);

            aRow.push(etsyListing["description"]);
            aRow.push(etsyListing["quantity"]);

            aRow.push("");  //Total buy amount placeholder

            //Potential Revenue amount
            aRow.push(etsyListing["quantity"]*unitSellPrice);

            //Place holdesr for post treatment
            aRow.push(""); //Number sold
            aRow.push(""); //Revenue
            aRow.push(""); //Forcast soldout

            //Soukcircus url
            aRow.push(etsyListing["url"]);

            aRow.push(etsyListing["num_favorers"]);
            aRow.push(etsyListing["is_customizable"]);
            aRow.push(etsyListing["is_personalizable"]);
            aRow.push(etsyListing["who_made"]);
            let styleStr="";
            for ( let j=0;j<etsyListing["style"].length;j++)
                styleStr += etsyListing["style"][j]+"/";
            aRow.push(styleStr);

            aRow.push(etsyListing["item_weight"]);
            aRow.push(etsyListing["item_weight_unit"]);
            aRow.push(etsyListing["item_length"]);
            aRow.push(etsyListing["item_width"]);
            aRow.push(etsyListing["item_height"]);
            aRow.push(etsyListing["item_dimensions_unit"]);
      
            let listingDetails = retrieveListing(etsyListing["listing_id"]);
            
            aRow.push(listingDetails[0]);
            for(let di=0;di<listingDetails[1].length;di++)
              aRow.push(listingDetails[1][di]);
              
            BulkDataRows.push(aRow);
        }

        //Look if listings need to be flushed.,
        if ( BulkDataRows.length > 0)
        {
          let nListings= BulkDataRows.length;

          dataSheet.getRange(NextRowFlush,1,nListings,LISTINGS_HEADER.length).setValues(BulkDataRows) ;

          NextRowFlush += nListings;
          listingsOffset    +=  nListings;
          if (listingsOffset==theListings.count)
            remainingListings=0;  
          else
            remainingListings = Math.max(theListings.count-listingsOffset,0)
        }
      }
    }
    catch(err) 
    {
      errors_logError(err);
    } 
  }while(remainingListings > 0);


  
  SpreadsheetApp.flush();


  stock_updateSoldOutForcast();
}



/**
 * 
 * //https://openapi.etsy.com/v3/application/listings/{listing_id}/inventory
 * /v3/application/shops/${SHOP_ID}/listings/{listing_id}
 */

//https://openapi.etsy.com/v3/application/listings/{listing_id}
function retrieveListing(listingId)
{
     let theRequest = 
      `https://openapi.etsy.com/v3/application/listings/${listingId}`;

    //Logger.log(theRequest)
      let headers=
      {
        'x-api-key': CLIENT_ID,
        Authorization: 'Bearer ' + etsy_getService().getAccessToken()
      };

      let params = 
      {
      method: "GET",
      contentType: "application/json",
      headers: headers,
      muteHttpExceptions: true, // for debugging 
      };

      let response = UrlFetchApp.fetch(theRequest,params);

      let theListing = JSON.parse(response.getContentText());

      let infos = [];

      if ( theListing["tags"] != null )
        infos.push(JSON.stringify(theListing["tags"]))
      else
        infos.push("");
        
      if ( theListing["materials"] != null )
          infos.push(JSON.stringify(theListing["materials"]))      
      else
          infos.push("");

      if ( theListing["style"] != null )
          infos.push(JSON.stringify(theListing["style"]))      
      else
          infos.push("");

      if ( theListing["images"] != null )
          infos.push(JSON.stringify(theListing["images"]))      
      else
          infos.push("");

      if ( theListing["production_partners"] != null )
          infos.push(JSON.stringify(theListing["production_partners"]))      
      else
          infos.push("");

      if ( theListing["skus"] != null )
          infos.push(JSON.stringify(theListing["skus"]))      
      else
          infos.push("");

      return [JSON.stringify(theListing), infos];
}
/**
 * 
 * 
 */


function utils_uniqueID() 
{
  Utilities.sleep(2) 
  return Date.now();
}

function testUID()
{
  Logger.log(utils_uniqueID())
}

function extractPartner(p)
{
  if (p!=null)
  {
    let s = p.split('partner_name":"');
    if (s.length > 1)
    {
      let ss = s[1].split('"')
      return ss[0];
    }
  }

  return "";
}
let sku1='["MOB003"]';
let sku2='["MOB003","MO555"]';

function test_extractSKU()
{
  extractSKU(sku1);
  extractSKU(sku2);
}

function extractSKU(p)
{
  let allSKU=[];
  if ( p!=null)
  {
      let ss = p.split(','); 
      for(i=0;i<ss.length;i++)
      {
        let t = ss[i].split('"');
        if (t[1]!=null)
          allSKU.push(t[1])
      }
  }
  let ret="";

  for(let i=0;i<allSKU.length;i++)
    ret += allSKU[i];

  return ret;
}



const todayDate=new Date();

function stock_extractStockInfoFromListing(aRowIn)
{
    let aRowOut = new Array(7);

    aRowOut[STOCK_LISTINGID-1]      = aRowIn[LISTINGID_ININVENT-1];
    aRowOut[STOCK_TITLE-1]          = aRowIn[TITLE_ININVENT-1];
    aRowOut[STOCK_URL-1]            = aRowIn[URL_ININVENT-1];
    aRowOut[STOCK_UNITSELL_PRICE-1] = aRowIn[UNITSELL_PRICE_ININVENT-1];
    aRowOut[STOCK_CCY-1]            = aRowIn[CCY_ININVENT-1];
    aRowOut[STOCK_SKU-1]            = extractSKU(aRowIn[SKUS_ININVENT-1]);
    aRowOut[STOCK_PRODPARTNER-1]    = extractPartner(aRowIn[PRODPARTNERS_ININVENT-1]);
    return aRowOut;
}

function stock_extractStockInfoFromStock(aRowIn)
{
    let aRowOut = new Array(7);

    aRowOut[STOCK_LISTINGID-1]      = aRowIn[STOCK_LISTINGID-1];
    aRowOut[STOCK_TITLE-1]          = aRowIn[STOCK_TITLE-1];
    aRowOut[STOCK_URL-1]            = aRowIn[STOCK_URL-1];
    aRowOut[STOCK_UNITSELL_PRICE-1] = aRowIn[STOCK_UNITSELL_PRICE-1];
    aRowOut[STOCK_CCY-1]            = aRowIn[STOCK_CCY-1];
    aRowOut[STOCK_SKU-1]            = aRowIn[STOCK_SKU-1];
    aRowOut[STOCK_PRODPARTNER-1]    = aRowIn[STOCK_PRODPARTNER-1];

    return aRowOut;
}

function stock_updateStockRowFromListing(rawStockRow,rawListingRow)
{
  rawStockRow[STOCK_UPD_DATE-1]       = utils_formatDateForPicker(new Date());
  rawStockRow[STOCK_LISTINGID-1]      = rawListingRow[LISTINGID_ININVENT-1];
  rawStockRow[STOCK_TITLE-1]          = rawListingRow[TITLE_ININVENT-1];
  rawStockRow[STOCK_URL-1]            = rawListingRow[URL_ININVENT-1];
  rawStockRow[STOCK_UNITSELL_PRICE-1] = rawListingRow[UNITSELL_PRICE_ININVENT-1];
  rawStockRow[STOCK_CCY-1]            = rawListingRow[CCY_ININVENT-1];
  rawStockRow[STOCK_SKU-1]            = extractSKU(rawListingRow[SKUS_ININVENT-1]);
  rawStockRow[STOCK_PRODPARTNER-1]    = extractPartner(rawListingRow[PRODPARTNERS_ININVENT-1]);

  return rawStockRow;
}


function stock_refreshStockFromListings()
{
  throw new Error("We do not stick to ETSY Listings anymore");
}


/**
 * 
 * 
 * 
 */

function  stock_updateSoldOutForcast()
{
  let dataSheet = utils_getSheet(ANNUAL_TRANSACTIONS_SHEET);   
  let fullRangeDates = dataSheet.getRange(2,SELLINGDATE_INTRANSACTIONDATA_SHEET,dataSheet.getLastRow()-1,1).getValues();
  let fullRangeSoldListingIds = dataSheet.getRange(2,LISTINGID_INTRANSACTIONDATA_SHEET,dataSheet.getLastRow()-1,1);

  let soldListingIds = fullRangeSoldListingIds.getValues();

  let compiledData=[];
  let treatedListings=[];
  for(let i=0;i<soldListingIds.length;i++)
  {
    if (treatedListings.indexOf(soldListingIds[i][0]) < 0 )
    {
        let textFinder = fullRangeSoldListingIds.createTextFinder(soldListingIds[i][0]);

        // Returns the first occurrence of 'dog'.
        let allOccurences = textFinder.findAll();

        if ( allOccurences!= null && allOccurences.length  > 0)
        {
          let firstRow = allOccurences[0].getRow();
          let lastRow  = allOccurences[allOccurences.length-1].getRow();

          let nSold = allOccurences.length;
          let lastDate = fullRangeDates[lastRow-2][0];
          let firstDate = fullRangeDates[firstRow-2][0];
          let deltaDays = utils_parseInt(utils_nDaysBetweenTwoDates(firstDate,lastDate));
          let sellingSlope;
          if ( deltaDays > 0 )
            sellingSlope = - nSold/deltaDays;
          else
            sellingSlope = 0;

          compiledData.push([soldListingIds[i][0],sellingSlope]);

          treatedListings.push(soldListingIds[i][0])
        }
    }
  }
 
  let today = new Date();
  let stockSheet =utils_getTable(STOCK_SPREADSHEET_ID,STOCK_SHEET);
  let stockListingIds = stockSheet.getRange(2,STOCK_LISTINGID,stockSheet.getLastRow()-1,1);

  for(let i=0;i<compiledData.length;i++)
  {
    let listingId     = compiledData[i][0];
    let sellingSlope  = compiledData[i][1];

    if ( sellingSlope != 0 )
    {
      let textFinder = stockListingIds.createTextFinder(listingId);

      let firstOccurence = textFinder.findNext();

      if (firstOccurence != null)
      {
          let values =  stockSheet.getRange(firstOccurence.getRow(),1,1,STOCK_HEADER.length).getValues();
          let quantity = values[0][STOCK_QUANTITY-1];
          
          let offset2SoldOutInDays = 365;
          if ( sellingSlope != 0 )
            offset2SoldOutInDays= -utils_parseInt(quantity)/sellingSlope;

          offset2SoldOutInDays = offset2SoldOutInDays.toFixed(0);
          let soldOutForcastDate = utils_addDaysFromDate(today,offset2SoldOutInDays);
          stockSheet.getRange(firstOccurence.getRow(),STOCK_SOLDOUT_FORCAST,1,1).setValue(soldOutForcastDate);
      }
    }
  }

}

/**==========================================================================================================================================
 * 
 *                                                    stock_getActiveStock()
 * 
 ==========================================================================================================================================*/

function stock_getActiveStock()
{
  let retData = {};
  let retVal=[];
  try
  {
    let dataSheet = utils_getTable(STOCK_SPREADSHEET_ID,STOCK_SHEET);  
    let data = dataSheet.getRange(2,1,dataSheet.getLastRow(),STOCK_HEADER.length).getValues();
    
    for(let i=0;i<data.length;i++)
    {
      let d=data[i];
      let forcastDate="";
      if ( d[STOCK_SOLDOUT_FORCAST-1] != "" )
          forcastDate = utils_formatDateForPicker(d[STOCK_SOLDOUT_FORCAST-1])


      //Crer un lien pour générer une commande

      //Sauvegarder pour visualisation
      let link = "<a href='" + utils_getUrl() + "?&actionId=commandeNewProduct&stockId=" + d[STOCK_ID-1] + 
                                              "'  target='_blank'><i class='fa fa-cart-plus fa-2x' aria-hidden='true'></i></a>";

      let linkUpdate = "<a href='" + utils_getUrl() + "?&actionId=actionUpdateProduct&stockId=" + d[STOCK_ID-1] + 
                                              "'  target='_blank'><i class='fa fa-pencil fa-2x' aria-hidden='true'></i></a>";
      retVal.push([d[STOCK_ID-1],
                    d[STOCK_SKU-1],
                    d[STOCK_TITLE-1], 
                    "<a href='"+ d[STOCK_URL-1] + "' target='_blank'>Lien Etsy</a>",
                    "<img src='" + utils_getImageUrl(d[STOCK_IMAGEID-1]) + "' width='100%' height='100%' >",
                    d[STOCK_QUANTITY-1], 
                    d[STOCK_UNITSELL_PRICE-1],  
                    d[STOCK_UNITBUY_PRICE-1], 
                    d[STOCK_PRODPARTNER-1],
                    forcastDate,
                    d[STOCK_MINTHRESHOLD-1],
                    d[STOCK_AVERAGEPROD_DAYS-1],
                    link,
                    linkUpdate]);

    } 

    retData["err"] = "ok";
    retData["data"] = retVal;
  }
  catch(err)
  {
    retData["err"] = "nok";
    retData["msg"] = err.messag;
    retData["data"] = [];
  }

  return JSON.stringify(retData);
}


let stockMap={};
function stock_doMap()
{
    if (stockMap.length > 0)
      return stockMap;

    let stock = utils_getTable(STOCK_SPREADSHEET_ID,STOCK_SHEET).getDataRange().getValues();

    for(let i=1;i<stock.length;i++)
    {
        let listingId = stock[i][STOCK_LISTINGID-1];
        stockMap[listingId] = stock[i];
    }

    return stockMap;
}
/*================================= FICHES PRODUIT POUR COMMANDE =================================*/
/**
 * 
 * 
 * 
 */


function testStock()
{
  //1645430445618
  stock_getRecord(1645430445462)
}


/**
 * 
 * 
 * 
 */
function stock_getRecord(stockId) 
{
    let fournisseurSheet = utils_getTable(STOCK_SPREADSHEET_ID,STOCK_FOURNISSEURS);
    let stockSheet = utils_getTable(STOCK_SPREADSHEET_ID,STOCK_SHEET);
    let stockIdsRange = stockSheet.getRange(2,STOCK_ID,stockSheet.getLastRow()-1,1);

    let ret={};
    ret["err"]="ok";
    ret["data"] = {};
    ret["data"]["fournisseur"] = fournisseurSheet.getRange(2,1,fournisseurSheet.getLastRow()-1,FOURNISSEURS_HEADER.length).getValues();
    ret["data"]["langue"] = LANGUAGE_MAP_JSON;

    if ( utils_parseInt(stockId) >= 0 )
    {
      let record = stockIdsRange.createTextFinder(stockId).findNext();
      if (record != null)
      {
          let stockRow = stockSheet.getRange(record.getRow() ,1,1,STOCK_HEADER.length).getValues()[0]; 
          ret["data"]["itemProvider"]  = stockRow[STOCK_FOURNISSEURS-1]
          ret["data"]["title"]        = stockRow[STOCK_TITLE-1];
          ret["data"]["description"]  = stockRow[STOCK_DESCRIPTION-1];
          ret["data"]["sku"]          = stockRow[STOCK_SKU-1];
          ret["data"]["etsyUrl"]      = stockRow[STOCK_URL-1];
          ret["data"]["imageUrl"]     = utils_getImageUrl(stockRow[STOCK_IMAGEID-1]);
          ret["data"]["imageId"]      = stockRow[STOCK_IMAGEID-1];
          ret["data"]["kg_weight"]    = stockRow[STOCK_KG_WEIGHT-1];
          ret["data"]["cm_length"]    = stockRow[STOCK_CM_LENGTH-1];
          ret["data"]["cm_width"]     = stockRow[STOCK_CM_WIDTH-1];
          ret["data"]["cm_height"]    = stockRow[STOCK_CM_HEIGHT-1];
          ret["data"]["cm_topDiam"]   = stockRow[STOCK_CM_DIAMTOP-1];
          ret["data"]["cm_middleDiam"]  = stockRow[STOCK_CM_DIAMMIDDLE-1];
          ret["data"]["cm_bottomDiam"]  = stockRow[STOCK_CM_DIAMBOTTOM-1];
          ret["data"]["dispoImageIds"]  = com_getActualPictures();

      }
      else
      {
        ret["err"]="nok";
        ret["msg"] = "Objet introuvable dans le stock..."
      }
    }
    else
    {
        //On rajoute à la réponse la liste des id des images disponibles pour une nouvelle
        //commande
        ret["data"]["dispoImageIds"] = com_getNewPictures();
    }

    return JSON.stringify(ret);
}



/**
 * 
 * 
 *  return object {err, rowNumber, record}
 * 
 */
function stock_findRecord(stockId) 
{
    let ret={};

    if ( utils_parseInt(stockId) >= 0 )
    {
      let stockSheet = utils_getTable(STOCK_SPREADSHEET_ID,STOCK_SHEET);
      let stockIdsRange = stockSheet.getRange(2,STOCK_ID,stockSheet.getLastRow()-1,1);

      let record = stockIdsRange.createTextFinder(stockId).findNext();
      if (record != null)
      {
          let stockRow = stockSheet.getRange(record.getRow() ,1,1,STOCK_HEADER.length).getValues()[0]; 
          ret["err"]    = "ok"
          ret["rowNum"] = record.getRow();
          ret["record"] = stockRow; 
          return ret;
      }
    }
    
    ret["err"]="nok";
    ret["msg"] = "Objet introuvable dans le stock..."
    return ret;
}


/**
 * 
 * 
 * 
 */
function stock_findRecordByEtsyListingId(listingId) 
{
    let ret={};

    if ( utils_parseInt(listingId) >= 0 )
    {
      let stockSheet = utils_getTable(STOCK_SPREADSHEET_ID,STOCK_SHEET);

      let stockRange = stockSheet.getRange(2,STOCK_LISTINGID,stockSheet.getLastRow()-1,1);

      let finder = stockRange.createTextFinder(listingId);
      if (finder != null)
      {
        let record = finder.findNext();
        if (record != null)
        {
            let stockRow = stockSheet.getRange(record.getRow() ,1,1,STOCK_HEADER.length).getValues()[0]; 
            ret["err"]    = "ok"
            ret["rowNum"] = record.getRow();
            ret["record"] = stockRow; 
            return ret;
        }
        else
        {
              ret["err"]="nok";
              ret["msg"] = "2-Objet introuvable dans le stock...";
              ret["record"] = null;
              errors_logError(ret["msg"] );
              return ret;
        }
      }
    }
    
    
    ret["err"]="nok";
    ret["msg"] = "1-Objet introuvable dans le stock...";
    ret["record"] = null;
    errors_logError(ret["msg"] );
    return ret;
}


/***
 *
 *  
 * 
 */
function stock_findFournisseur(idFourni)
{
    let fournisseurSheet = utils_getTable(STOCK_SPREADSHEET_ID,STOCK_FOURNISSEURS);
    let values = fournisseurSheet.getRange(2,1,fournisseurSheet.getLastRow()-1,FOURNISSEURS_HEADER.length).getValues();
    
    for(let i=0;i<values.length;i++)
    {
      let f = values[i];
      if (f[FOURNI_ID-1]==idFourni)
      {
        return f[FOURNI_NOM-1] + "//" + f[FOURNI_EMAIL-1] + "//" + f[FOURNI_ADRESSE-1];  
      }
    }

    return "Fournisseur avec ID : "+ idFourni + "  introuvable";
}


/* NOT FOUND:
[[MOB021, 1xXGAMgZ_kzPmOUpM7DhVFDKxRVo2keh4], 
 [MOB011, 1Ci2zW6lQOESSSFvjaUN28BvWeAXwxFHP], 
 [MOB015, 1uiF_I9JW00KPyeKkX1q52zXYd_TitEe2], 
 [MOB052, 1MxpaMuQ3H4cM0pLzHL0LTjnFPdHtVJ1h], 
 [MOB053, 1cr8DT7-TP7QdjZpXS7D9S8Z5zUcDFUCt], 
 [MOB058, 13G9oqxC6YbTzqU1wQbIgmvQXrPsLMkku], 
 [MOB054, 1qZsfMLte061pGRXISTJjmd_ySRkjIafE], 
 [MOB050, 1dBfVVqSw0AxS7ssgheGed_YcJlAbphA9], 
 [MOB007, 12QUokX7jPNzlV9zdzzFZ5MxeQnIwG6wl], 
 [MOB006, 1XAijBu63cD0wFm5pGu6sl5cdv1cWlkV9]]
*/
function stock_attachImageIds()
{
  let imgIdsArray = com_getActualPicturesWithSKU();
  let stockSheet = utils_getTable(STOCK_SPREADSHEET_ID,STOCK_SHEET);
  let stockData = stockSheet.getDataRange().getValues();
  let notFound=[];

  for(let i=0;i<imgIdsArray.length;i++)
  {
      let imgSku = imgIdsArray[i][0];
      let found=false;
      for(let j=1;j<stockData.length;j++)
      {
        let aProduct = stockData[j];
        let sku = aProduct[STOCK_SKU-1];

        if (sku == imgSku)
        {
          found=true;
          aProduct[STOCK_IMAGEID-1]=imgIdsArray[i][1];
          stockSheet.getRange(j+1,1,1,aProduct.length).setValues([aProduct]);
        }
      }
      if ( !found )
        notFound.push(imgIdsArray[i])
  }

  Logger.log(notFound);
}


/**
 * 
 * 
 */

function testInsert()
{
  let data = 
  {"err":"ok",
"data":{
  "cmdId":1645627486022,
  "date":"2022-02-23T14:44:52.768Z",
  "quantity":100,
  "title":"PANIER OSIER VERT ROND",
  "urlFiche":"https://docs.google.com/document/d/1uNvAT-9wA66ZNJkDs692_4TCG1VqC_ehttnrjUhQe00/edit?usp=drivesdk",
  "newProduct":1,
  "desc":"PANIER OSIER VERT RONDPANIER OSIER VERT RONDPANIER OSIER VERT RONDPANIER OSIER VERT RONDPANIER OSIER VERT RONDPANIER OSIER VERT RONDPANIER OSIER VERT ROND",
  "urlEtsy":"",
  "height":"",
  "length":"",
  "width":"",
  "diamTop":100,
  "diamMiddle":50,
  "diamBottom":30,
  "color":"#32AA36",
  "sku":"PA0013",
  "imageId":"1cr8DT7-TP7QdjZpXS7D9S8Z5zUcDFUCt",
  "fournisseur":"Abdou////Marrakesh, Morocco",
  "unitBuyPriceMAD":500,
  "unitSellPriceEUR":100,
  "unitWeightKg":4,
  "quantityInStock":50,
  "prodMeanTimeDays":7}}

      stock_insertNewItem(data);
}


/**
 * 
 * 
 */
function stock_insertNewItem(commandInfoDataIn)
{
  let record = new Array(STOCK_HEADER.length);

  let commandInfo = commandInfoDataIn["data"];

  record[STOCK_ID-1]              = utils_uniqueID();
  record[STOCK_CRE_DATE-1]        = new Date();
  record[STOCK_UPD_DATE-1]        = new Date();
  record[STOCK_LISTINGID-1]       = "";
  record[STOCK_SKU-1]             = commandInfo["sku"];
  record[STOCK_TITLE-1]           = commandInfo["title"];
  record[STOCK_DESCRIPTION-1]     = commandInfo["desc"];
  record[STOCK_URL-1]             = commandInfo["urlEtsy"];
  record[STOCK_CM_HEIGHT-1]       = commandInfo["height"];
  record[STOCK_CM_WIDTH-1]        = commandInfo["width"];
  record[STOCK_CM_LENGTH-1]       = commandInfo["length"];
  record[STOCK_PRODPARTNER-1]     = commandInfo["fournisseur"];
  record[STOCK_CM_DIAMTOP-1]       = commandInfo["diamTop"];
  record[STOCK_CM_DIAMMIDDLE-1]    = commandInfo["diamMiddle"];
  record[STOCK_CM_DIAMBOTTOM-1]    = commandInfo["diamBottom"];

  record[STOCK_KG_WEIGHT-1]       = commandInfo["unitWeightKg"];
  record[STOCK_UNITBUY_PRICE-1]   = commandInfo["unitBuyPriceMAD"];
  record[STOCK_FOURNISSEURS-1]    = commandInfo["fournisseur"];
  record[STOCK_UNITSELL_PRICE-1]  = commandInfo["unitSellPriceEUR"];
  record[STOCK_CCY-1]             = "EUR";
  record[STOCK_QUANTITY-1]        = commandInfo["quantityInStock"];
  record[STOCK_MINTHRESHOLD-1]                      = commandInfo["minThresholdDays"];
  record[STOCK_AVERAGEPROD_DAYS-1]= commandInfo["prodMeanTimeDays"];
  record[STOCK_IMAGEID-1]         = commandInfo["imageId"];

  utils_getTable(STOCK_SPREADSHEET_ID, STOCK_SHEET).appendRow(record);

  return true;
}


/**
 * 
 * 
 */
function stock_updateStockItem(commandInfoDataIn)
{
  let commandInfo = commandInfoDataIn["data"];

  let data = stock_findRecord(commandInfo["stockId"]) ;

  if ( data["err"] == "nok")
    throw new Error("stock_updateStockItem: impossible de mettre à jour l'objet dans le stock");

  let record = data["record"];

  record[STOCK_UPD_DATE-1]        = new Date();
  record[STOCK_PRODPARTNER-1]     = commandInfo["fournisseur"];
  record[STOCK_KG_WEIGHT-1]       = commandInfo["unitWeightKg"];
  record[STOCK_UNITBUY_PRICE-1]   = commandInfo["unitBuyPriceMAD"];
  record[STOCK_FOURNISSEURS-1]    = commandInfo["fournisseur"];
  record[STOCK_UNITSELL_PRICE-1]  = commandInfo["unitSellPriceEUR"];
  record[STOCK_CCY-1]             = "EUR";
  record[STOCK_QUANTITY-1]        = record[STOCK_QUANTITY-1] + commandInfo["quantityInStock"];
  record[STOCK_MINTHRESHOLD-1]    = commandInfo["minThresholdDays"];
  record[STOCK_AVERAGEPROD_DAYS-1]= commandInfo["prodMeanTimeDays"];
  record[STOCK_CM_HEIGHT-1]         = commandInfo["height"];
  record[STOCK_CM_WIDTH-1]          = commandInfo["width"];
  record[STOCK_CM_LENGTH-1]         = commandInfo["length"];
  record[STOCK_CM_DIAMTOP-1]        = commandInfo["diamTop"];
  record[STOCK_CM_DIAMMIDDLE-1]     = commandInfo["diamMiddle"];
  record[STOCK_CM_DIAMBOTTOM-1]     = commandInfo["diamBottom"];
  record[STOCK_UNITBUY_PRICE-1]     = commandInfo["unitBuyPriceMAD"];
  record[STOCK_CCY-1]               = "EUR";


  /*
  record[STOCK_DESCRIPTION-1]     = commandInfo["desc"];
  record[STOCK_URL-1]             = commandInfo["urlEtsy"];
  record[STOCK_CM_HEIGHT-1]       = commandInfo["height"];
  record[STOCK_CM_WIDTH-1]        = commandInfo["width"];
  record[STOCK_CM_LENGTH-1]       = commandInfo["length"];
  record[STOCK_PRODPARTNER-1]     = commandInfo["fournisseur"];
  record[STOCK_CM_DIAMTOP-1]       = commandInfo["diamTop"];
  record[STOCK_CM_DIAMMIDDLE-1]    = commandInfo["diamMiddle"];
  record[STOCK_CM_DIAMBOTTOM-1]    = commandInfo["diamBottom"];

  record[STOCK_KG_WEIGHT-1]       = commandInfo["unitWeightKg"];
  record[STOCK_UNITBUY_PRICE-1]   = commandInfo["unitBuyPriceMAD"];
  */

  utils_getTable(STOCK_SPREADSHEET_ID, STOCK_SHEET).getRange(data["rowNum"],1,1,STOCK_HEADER.length).setValues([record]);

  return true;
}


/**
 * 
 * 
 */
function stock_manageValidatedOrder(commandInfoDataIn)
{
  if ( commandInfoDataIn["data"]["stockId"]==null )
    throw new Error("stock_manageValidatedOrder: Il manque l'information stockId dans les infos commande");

  if ( commandInfo["stockId"]==0 )
  {
    return stock_insertNewItem(commandInfoDataIn);
  }
  else 
  {
    return stock_updateStockItem(commandInfoDataIn);
  }
}


function stock_sauvegarderArticle(frontEndData)
{
  let lock = lock_acquire();
  try
  {
    let stockItemData = frontEndData["data"];

    let data = stock_findRecord(stockItemData["stockId"]) ;

    if ( data["err"] == "nok")
      throw new Error("stock_updateStockItem: impossible de mettre à jour l'objet dans le stock");

    let record = data["record"];

    record[STOCK_UPD_DATE-1]          = new Date();
    record[STOCK_PRODPARTNER-1]       = stockItemData["fournisseur"];
    record[STOCK_TITLE-1]             = stockItemData["description"];
    record[STOCK_DESCRIPTION-1]       = stockItemData["title"];

    record[STOCK_KG_WEIGHT-1]         = stockItemData["unitWeightKg"];
    record[STOCK_CM_HEIGHT-1]         = stockItemData["height"];
    record[STOCK_CM_WIDTH-1]          = stockItemData["width"];
    record[STOCK_CM_LENGTH-1]         = stockItemData["length"];
    record[STOCK_CM_DIAMTOP-1]        = stockItemData["diamTop"];
    record[STOCK_CM_DIAMMIDDLE-1]     = stockItemData["diamMiddle"];
    record[STOCK_CM_DIAMBOTTOM-1]     = stockItemData["diamBottom"];

    record[STOCK_UNITBUY_PRICE-1]     = stockItemData["unitBuyPriceMAD"];
    record[STOCK_FOURNISSEURS-1]      = stockItemData["fournisseur"];
    record[STOCK_UNITSELL_PRICE-1]    = stockItemData["unitSellPriceEUR"];
    record[STOCK_CCY-1]               = "EUR";
    record[STOCK_QUANTITY-1]          = record[STOCK_QUANTITY-1];
    record[STOCK_MINTHRESHOLD-1]      = stockItemData["minThresholdDays"];
    record[STOCK_AVERAGEPROD_DAYS-1]  = stockItemData["prodMeanTimeDays"];

    utils_getTable(STOCK_SPREADSHEET_ID, STOCK_SHEET).getRange(data["rowNum"],1,1,STOCK_HEADER.length).setValues([record]);

    let ret={};
    ret["err"] = "ok";
    return ret;
  }
  catch(err)
  {
    let ret={};
    ret["err"] = "nok";
    ret["msg"] = err.message;
    return ret;
  }
  finally
  {
    lock_release(lock);
  }
}


/*====================================== TRIGGERS ====================================================*/

function stock_alertOnThreshold()
{
  let stockSheet = utils_getTable(STOCK_SPREADSHEET_ID,STOCK_SHEET);
  let lastRow = stockSheet.getLastRow();

  if (lastRow<=1)
    return;

  let stockData = stockSheet.getRange(2,1,lastRow-1,STOCK_HEADER.length).getValues();
  let productsAlert=[];
  for(let i=0;i<stockData.length;i++)
  {
    let threshold = stockData[i][STOCK_MINTHRESHOLD-1];
    let quantity = stockData[i][STOCK_QUANTITY-1];

    if (quantity < threshold)
    {
        productsAlert.push(stockData[i]);
    }
  }
 
  if ( productsAlert.length > 0)
  {
    let html = "Bonjour,<br>Les articles suivants sont passés en dessous de leur seuil admis minimum en stock:<br>";
    
    html += "<table border='1px'><th>SKU</th><th>Quantité restante</th><th>Article</th></tr>";
    for(let i=0;i<productsAlert.length;i++)
    {
        html += "<tr>";
        html += "<td>" + productsAlert[i][STOCK_SKU-1] + "</td>";
        html += "<td style='text-align:center'>" + productsAlert[i][STOCK_QUANTITY-1] + "</td>";
        html += "<td>" + productsAlert[i][STOCK_TITLE-1] + "</td>";
        html += "</tr>";
    }
    html += "</table>";
   
    mailing_notifyCollaborators("Soukcircus, alerte rupture de stock",html);
  }

}


/*==================================================================================================== */

