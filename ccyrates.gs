

const CCY_EUR = "EUR";
const CCY_MAD = "MAD";
const RATES_SPREADSHEETID = "18_x5tRC6-X3YSiNWf2O-e6l2A36tp8_4vxBmBPxgeJE";
const RATES_EURO_SHEET = "EuroRates";

/***
 * return une map CCY ==> Axchange rate contre EURO
 */
function ccy_loadRates() 
{
  let ratesSheet = utils_getTable(RATES_SPREADSHEETID,RATES_EURO_SHEET);
  let values = ratesSheet.getRange(2,1,ratesSheet.getLastRow()-1,3).getValues();
  let rates = {};

  for (let i=0;i< values.length;i++)
  {
    let aRate = values[i][0];
    rates[`${aRate}`] = values[i][2];
  }

  return rates;
}

function ccy_getRateToEUR(ccy)
{
  let rates=ccy_loadRates() ;

  let retRate = rates[ccy]; 

  if (retRate==null)
  {
    throw new Error("ccy_getRateToEUR : EUR rate for " + ccy + ", not found");
  }

  return retRate;
}
