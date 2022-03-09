function myFunction() {
  let data = utils_getSheet(LISTINGS_SHEET).getDataRange().getValues();

  for(let i=1;i<data.length;i++)
  {
    let aRow = data[i];

    let details = aRow[DETAILS_ININVENT-1];

  
    Logger.log(JSON.parse(details));
  }
}