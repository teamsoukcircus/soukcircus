/**
 * 
 *  DEPRECATED
 */
function db_addQRCode()
{
    let transactionsSheet = utils_getSheet(ANNUAL_TRANSACTIONS_SHEET);
    let transactions = transactionsSheet.getDataRange().getValues();
    let qrCodeFormulas=[];
    let qrCodeGroupFormulas=[];
    let colonneOfQRCodeInput = utils_getChar(STRING4QRCODE_INTRANSACTIONDATA_SHEET);
    let colonneOfQRCode     = utils_getChar(IMAGEQRCODE_INTRANSACTIONDATA_SHEET);

    for (let i = 1;i < transactions.length;i++) 
    { 
        let aTrans = transactions[i][DETAILS_INTRANSACTIONDATA_SHEET-1];

        let qrFormula = [];
        
        qrFormula.push('=IMAGE("https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl="&' + colonneOfQRCodeInput + (i+1) +'&"")');
        qrCodeFormulas.push(qrFormula);
    }

    //Save formulas
    //==================================
    var cell = transactionsSheet.getRange(colonneOfQRCode+"2:"+colonneOfQRCode+transactions.length);
    cell.setFormulas(qrCodeFormulas);
}