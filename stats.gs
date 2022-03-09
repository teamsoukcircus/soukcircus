function test_list()
{
   let object = '[{"transId":2694606937,"receiptId":2234953606,"listingId":649239605,"productId":8217293234}]';
   let dec = utils_decodeObject(object);
  Logger.log(dec.length);
   Logger.log(dec);

const arr = ["a", "b", "c", "d", "e", "a", "b", "c", "f", "g", "h", "h", "h", "e", "a"]
const counts = {};
arr.forEach((x) => {
  counts[x] = (counts[x] || 0) + 1;
});
Logger.log(counts)

let a = JSON.stringify(counts);
Logger.log(a);
let b = JSON.parse(a);
Logger.log(b);
let allOut=[]
for (let i=0;i<arr.length;i++)
{
  let ent = [];
  ent.push(arr[i]);
  ent.push(counts[arr[i]]);
  allOut.push(ent);
}

Logger.log(allOut);


}


const histoHeader = 
["listingId",	"count",	"url",	"title"];

function statOnListingsIds() 
{
    let listingsSheet = utils_getSheet(LISTINGS_SHEET);

    let transactions = utils_GetNamedRangeValuesInSheet(MAIN_SHEET, cellDataTransactions);

    /* Build list of listing ids */
    let listingIds=[];

    /* !!!!!! start to il = 1 to skip header */
    for (let il = 1 ; il < transactions.length;il++)
    {
      let trans = utils_decodeObject(transactions[il]);
      for (let ntr=0;ntr<trans.length;ntr++)
      {
          listingIds.push(trans[ntr].listingId);
      }
    }  

    let histo = histoOnArray(listingIds);

    //Logger.log(histo);

    let lids = utils_GetNamedRangeValuesInSheet(LISTINGS_SHEET,cellListingsListIds);
    let urls = utils_GetNamedRangeValuesInSheet(LISTINGS_SHEET,cellListingsUrls);
    let titles = utils_GetNamedRangeValuesInSheet(LISTINGS_SHEET,cellListingsTitles);

    let allHisto=[];
    for (let i = 0 ; i < histo.length ; i++)
    {
        let entryLid = histo[i][0];
        let count = histo[i][1];
        let histo2 = [];
        for(let j=0;j<lids.length;j++)
        {
            if(entryLid==lids[j])
            {
              histo2.push(entryLid);
              histo2.push(count);
              histo2.push(urls[j][0]);
              histo2.push(titles[j][0]);
              allHisto.push(histo2);
            } 
        }
    }

      let histoSheet = utils_getSheet(HISTPRODUIT_SHEET);
      getRange(HISTPRODUIT_SHEET,DATAS_RANGEINHISTO_SHEET).clear();
      for (let i = 1; i <= histoHeader.length;i++)
        histoSheet.getRange(1,i).setValue(histoHeader[i-1]);
      
      for (let ic =0 ; ic < allHisto.length;ic++) 
      {
        let aRow=[];

        aRow.push(allHisto[ic][0]);
        aRow.push(allHisto[ic][1]);
        aRow.push(allHisto[ic][2]);
        aRow.push(allHisto[ic][3]);
        histoSheet.appendRow(aRow);
      }
}



function myFunction() {
  let sh = utils_getSheet("Sheet10");

  let allListings = []
  values = sh.getRange("B:B").getValues()

  for (let i = 0; i < values.length/3 ;i += 3)
  {
    let listing=[];

    let text = values[3*i][0];
    let position = text.indexOf("amount=");
    let text2 = text.substring(position);
    let position2 = text2.indexOf(".0");

    text2 = text2.substring(7, position2);
    let amount = Number(text2)/100;
    listing.push(amount);

    let quant = Number(values[3*i+1][0]);
    listing.push(quant);
    listing.push(amount*quant);
    listing.push(values[3*i+2][0]);
    allListings.push(listing);
  }

  Logger.log(allListings.length);
  Logger.log(allListings);

  let sum=0;
  let sum2=0
  for ( let i = 0 ; i< allListings.length;i++)
  {
    sum += allListings[i][2];
    sum2 += allListings[i][1];
  }

  Logger.log(sum + ", " + sum2)

}


function display_ChartsOfGroupSoldGrossAmountBySlice(timeSliceInDays,enumAmountType)
{
  let allCharts = [];
  let chart1 = chartGroupSoldByDaysSlice(DATA_SHEET,timeSliceInDays,enumAmountType);

  if (chart1 != null )
    allCharts.push(chart1);

  let chart2 = chartGroupSoldByDaysSlice(RETRODATA_SHEET,timeSliceInDays,enumAmountType);
  if (chart2 != null )
    allCharts.push(chart2);

  displayCharts(allCharts, "Distributions")
}

function groupSoldGrossAmountBy(dataSheetSource,timeSliceInDays,enumAmountType)
{
  let groupingSheet = dataSheetSource+"Grouping";

  utils_duplicateAndRemoveSheet(dataSheetSource,groupingSheet)
  let sheet = utils_getSheet(groupingSheet);


  let lastRow = sheet.getLastRow();
  let range = sheet.getRange(groupingSheet+"!A2:A"+lastRow);
  let sortedDates = range.sort({column: 1, ascending: true}); 
  let dates = sortedDates.getValues().filter(String);

  let rangeAmounts;
  if ( enumAmountType == ENUMS_AMOUNT_TYPES.GROSS)
    rangeAmounts = sheet.getRange(groupingSheet+"!E2:E"+lastRow).getValues().filter(String);
  else if ( enumAmountType == ENUMS_AMOUNT_TYPES.NET )
    rangeAmounts = sheet.getRange(groupingSheet+"!F2:F"+lastRow).getValues().filter(String);
  else if ( enumAmountType == ENUMS_AMOUNT_TYPES.NETENCAISSE )
    rangeAmounts = sheet.getRange(groupingSheet+"!H2:H"+lastRow).getValues().filter(String);
  else if ( enumAmountType == ENUMS_AMOUNT_TYPES.SHIP )
    rangeAmounts = sheet.getRange(groupingSheet+"!G2:G"+lastRow).getValues().filter(String);
  else
  {
    errors_logErrorAndEmail("Wrong enum received: " + enumAmountType);
    return [];
  }

  let firstDate = dates[0][0];
  let lastDate = dates[dates.length-1][0];
  let nSlices = parseInt(utils_nDaysBetweenTwoDates(firstDate,lastDate)/timeSliceInDays)+1;

  let dateSlices = [];
  dateSlices.push(['Date','Size']);
  for (let k=0;k<nSlices;k++)
  {
      let aDate = utils_addDaysFromDate(firstDate,k*timeSliceInDays);

      dateSlices.push([utils_FormatDate(aDate.getFullYear(),aDate.getMonth(),aDate.getDay(),ENUM_DATE_FORMAT.LONG),0]);
  }

  for(let i=1;i<dates.length;i++)
  {
    let date = dates[i][0];
    let sliceIndex = parseInt(divideDiffDatesByNDaysDates(date,firstDate,timeSliceInDays));
    
    if (sliceIndex < dateSlices.length)
    {
      dateSlices[sliceIndex+1][1] = dateSlices[sliceIndex+1][1] + rangeAmounts[i][0] ;
    }
    else
      errors_logError("ERROR : " + i + " --- " + date + " --- " + sliceIndex + " --- " + dateSlices[sliceIndex]);
  }


  return dateSlices;

}

/**
 * For enum amount types see constants.gs file
 */

function chartGroupSoldByDaysSlice(dataSourceSheet,timeSliceInDays,enumAmountType)
{
  var ui = SpreadsheetApp.getUi();
  let dataArray = groupSoldGrossAmountBy(dataSourceSheet,timeSliceInDays,enumAmountType);

  if ( dataArray.length > 0 )
  {
    let title = enumAmountType==
                      ENUMS_AMOUNT_TYPES.GROSS? "Chiffre d'affaire brut par tranches de " + timeSliceInDays:
                      ENUMS_AMOUNT_TYPES.NET? "Chiffre d'affaire net par tranches de " + timeSliceInDays:
                      ENUMS_AMOUNT_TYPES.NETENCAISSE? "Net encaissé par tranches de " + timeSliceInDays:
                      ENUMS_AMOUNT_TYPES.SHIP? "Coût de shipping facturés par tranches de " + timeSliceInDays: "Pas de titre";

    if ( dataSourceSheet == DATA_SHEET)
      title += " (année courante)"
    else
      title += " (rétrospective)";

    return [dataArray,title];
  }
  
  return null;

}

function displayCharts(dataArrays,title)
{
    html = createBarCharts(dataArrays);
   
    let template = HtmlService.createTemplate(html).evaluate()
                  .setWidth(800)
                  .setHeight(800);
      
    SpreadsheetApp.getUi().showModalDialog(template,title);
}

