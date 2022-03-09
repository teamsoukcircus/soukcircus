


const TEMP_FOLDER = DriveApp.getFolderById("1GHuKBSR72F7DT11T8pwKOdk2UOt0iVuL");
const ShippingDoc_Template = DriveApp.getFileById("1Tla1WRaGgNm9YVtLWDtZtji3U1cKLNIK1yaF5OyfO-E");
const SHIPFORMS_PREFIX="soukShip_";
const SHIPPING_ETIQUETTES_FOLDERID = "1Cs657obEAQgC-PdAWSwblK9MlESGE9bz";
const MAXALLOWED_ITEMS = 7;
/**
 * 
 * 
 * 
 */
function ship_createDocShippingForm(shippingInfo, targetFolderId)
{  
  let ShippingTargetFolder      = DriveApp.getFolderById(targetFolderId);
  let today                   = utils_LocalGMTTimeFormatThisDate(new Date(),ENUM_DATE_FORMAT.LONG);
  let receiptId               = shippingInfo["receiptId"];
  let customerEmail           = shippingInfo["email"];
  let customerFormattedAdress = shippingInfo["formattedAddress"];
  let customerLang            = shippingInfo["custLang"];
  let totalDiscount           = shippingInfo["totalDiscount"];
  let totalTaxes              = shippingInfo["totalTaxes"];
  let items                   = shippingInfo["itemsDetails"];
  let totalEUROPrice          = shippingInfo["totalPrice"];
  let totalQuantity           = shippingInfo["totalQuantity"];
  let iossCode                = shippingInfo["iossCode"];
  let grandTotal              = shippingInfo["grandTotal"];
  let shipmentFacture         = shippingInfo["shipmentFacture"];
  let customerComment         = shippingInfo["customerComment"];

  //Creation du. fichier cible
  const newDocFile = ShippingDoc_Template.makeCopy(ShippingTargetFolder).setName(SHIPFORMS_PREFIX+customerEmail+utils_formatDateForPicker(new Date()));
  const  OpenDoc = DocumentApp.openById(newDocFile.getId());
  const body = OpenDoc.getBody();
  
  //ON commence à y mettre les infos de la commande
  //===============================================
  //Les détails de la commande
  //==========================
   body.replaceText("{date}",today);
   body.replaceText("{Order}",txt_translateEnglishText(T_ORDER_NO,customerLang));
   body.replaceText("{OrderNo}",receiptId);
   body.replaceText("{IOSS}","IOSS");
   body.replaceText("{IOSSNo}",iossCode); 
   body.replaceText("{customerComment}",customerComment);

   
   body.replaceText("{Libelle}",txt_translateEnglishText(T_ITEM,customerLang));
   body.replaceText("{Quantite}","Qty");
   body.replaceText("{Prix}",txt_translateEnglishText(T_PRICE,customerLang));
   body.replaceText("{ccy}","EUR");
   body.replaceText("{Address}", customerFormattedAdress);

  if ( MAXALLOWED_ITEMS < items.length)
    body.replaceText("{ERROR}","ATTENTION: Limites des 7 Artcicle/envoi unqiue dépassée, voir l'IT pour modifier ce comportement");
  else
    body.replaceText("{ERROR}","");

  //transactionId, productDescription, quantity, totalPriceForItem, ccy,variations]
   for(let i=1;i<= Math.min(MAXALLOWED_ITEMS,items.length);i++)
   {
    body.replaceText("{a"+i+"}", txt_translateFrenchText(items[i-1][1] + ", " + items[i-1][5],"en"));
    body.replaceText("{q"+i+"}", items[i-1][2]);
    body.replaceText("{p"+i+"}", items[i-1][3]);
   }

    for(let i=Math.min(MAXALLOWED_ITEMS,items.length);i<=7;i++)
    {
      body.replaceText("{a"+i+"}", "");
      body.replaceText("{q"+i+"}", "");
      body.replaceText("{p"+i+"}", "");
    }

    
    body.replaceText("{Shipment}", txt_translateEnglishText(T_SHIPMENT,customerLang));
    body.replaceText("{SHI}", shipmentFacture);

    body.replaceText("{TotalDiscount}", txt_translateEnglishText(T_DISCOUNT,customerLang));
    body.replaceText("{TDI}", totalDiscount);

    body.replaceText("{TotalTaxes}", txt_translateEnglishText(T_TAXES,customerLang));
    body.replaceText("{TTX}", totalTaxes);


    body.replaceText("{GrandTotal}", txt_translateEnglishText(T_TOTAL,customerLang));
    body.replaceText("{TQ}", totalQuantity);
    body.replaceText("{TP}", grandTotal);



    //Sauvegarde du document
    //=====================
    OpenDoc.saveAndClose();
  
    return newDocFile.getUrl();
}



/**
 * 
 * 
 */
function ship_createPdfShippingForm(shippingInfo)
{
  let PDF_ShippingFolder = DriveApp.getFolderById(SHIPPING_FOLDERID);
  let docFile = ship_createDocShippingForm(shippingInfo);
  
  const BLOBPDF = docFile.getAs(MimeType.PDF);
  const pdfFile =  PDF_ShippingFolder.createFile(BLOBPDF).setName(docFile.getName() +".pdf");

  return pdfFile;
}
