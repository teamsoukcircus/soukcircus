
/*============================ SOUK LIGHT REQUESTS ==================================*/

function orders_getAllPendingTransactionsForSoukLight()
{
  let sheet = utils_getSheet(ANNUAL_TRANSACTIONS_SHEET);
  let data = sheet.getRange(2,1,sheet.getLastRow()-1, HEADER_TRANSACTION_SHEET.length).getValues();

  let groups = db_groupSellingTransactionsPerCustomer(data);

  retVal = [];

  for (let i = 0;i < groups.length;i++) 
  { 
    let aGroup = groups[i];

    for(let j=0;j<aGroup.length;j++)
    {
      row = aGroup[j];

      /*if (j>0)
      {
        retVal.push(["", "","", "", row[TITLE_INTRANSACTIONDATA_SHEET-1],row[QUANTITY_INTRANSACTIONDATA_SHEET-1],row[PRICE_INTRANSACTIONDATA_SHEET-1]]);
      }
      else*/
      {
        retVal.push([row[RECEIPTID_INTRANSACTIONDATA_SHEET-1],
                    utils_formatDateForPicker(row[SELLINGDATE_INTRANSACTIONDATA_SHEET-1]),                    
                    row[EMAIL_INTRANSACTIONDATA_SHEET-1],
                    row[CUSTOMER_INTRANSACTIONDATA_SHEET-1],
                    row[TITLE_INTRANSACTIONDATA_SHEET-1],
                    row[QUANTITY_INTRANSACTIONDATA_SHEET-1],
                    utils_parseInt(row[PRICE_INTRANSACTIONDATA_SHEET-1]),
                    row[STATUS_INTRANSACTIONDATA_SHEET-1]]);
      }
    } 
  }

  return JSON.stringify(retVal);
    
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
