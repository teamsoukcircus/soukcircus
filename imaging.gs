



function digitalizeText(text2Digitalize) 
{
  const fileId = "1BEFkaEn4D5wDNxSFyEWg3SR_RiNIN5Lc" // Please set the file ID of image file.

  // Please set the text.
  const text = {
    text: "",
    left: 0,
    top: 0,
    width: 1500,
    height: 1500,
    fontSize: 15,
  };

  // 1. Retrieve the image size using ImgApp.
  const file = DriveApp.getFileById(fileId);
  const blob = file.getBlob();
  const size = ImgApp.getSize(blob);

  // 2. Create new Google Slides with the custom page size using DocsServiceApp.
  const object = {
    title: "sample title", // Title of created Slides.
    width: { unit: "pixel", size: size.width },
    height: { unit: "pixel", size: size.height },
  };
  const presentationId = DocsServiceApp.createNewSlidesWithPageSize(object);

  // 3. Put the image and text.
  const s = SlidesApp.openById(presentationId);
  const slide = s.getSlides()[0];

  slide.insertImage(blob);

slide.insertTextBox(text2Digitalize, text.left, text.top, text.width, text.height)
      .getText()
      .getTextStyle()
      .setFontSize(text.fontSize);

  s.saveAndClose();

  // 4. Export the result image.
  const obj = Slides.Presentations.Pages.getThumbnail(
    presentationId,
    slide.getObjectId(),
    {
      "thumbnailProperties.thumbnailSize": "LARGE",
      "thumbnailProperties.mimeType": "PNG",
    }
  );
  const url = obj.contentUrl.replace(/=s\d+/, "=s" + size.width);
  const resultBlob = UrlFetchApp.fetch(url)
    .getBlob()
    .setName("Result_" + file.getName());

  
  let imageFileResult = DriveApp.createFile(resultBlob);
  DriveApp.getFileById(presentationId).setTrashed(true);
  DriveApp.getFileById(imageFileResult.getId()).setTrashed(true);
  return resultBlob;
  
}


function image_getDataFromQRCode(data) {
  const slide = SlidesApp.getActivePresentation().getSlides()[0]; // The 1st page of Google Slides.
  if (!data) {
    const qrCode = slide.getImages()[0];
    const blob = qrCode.getBlob();
    const html = HtmlService.createTemplateFromFile("index");
    html.image = JSON.stringify(blob.getBytes());
    SlidesApp.getUi().showModalDialog(html.evaluate(), "sample");
    return;
  }
  slide.replaceAllText("Data: ", `Data: ${data}`);
}

function image_getDataFromQRCode(urlDeTraitement) 
{
  
    let qrUrl = "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl="+encodeURI(urlDeTraitement);

    let blobGlobal = UrlFetchApp.fetch(qrUrl).getBlob(); 


  const ui = SpreadsheetApp.getUi();

    const html = HtmlService.createTemplateFromFile("index");
    html.image = JSON.stringify(blobGlobal.getBytes());
    ui.showModalDialog(html.evaluate().setWidth(300).setHeight(300), "sample");

}



const url="https://script.google.com/macros/s/AKfycbxLeYDPxNJ8r1uV1WbfR66URmOw5Cgk9qbDm7WZLfs/dev";

function test_image_createQRCode()
{
  image_createQRCode(url);
}
const QRCode_Template = DriveApp.getFileById("1EVFehmRIQcDsHZC2q9wx93iCgXua0wKzP2ZM_V8YLLc");

function image_createQRCodeInFile(stringData)
{  
    const newDocFile = QRCode_Template.makeCopy(TEMP_FOLDER).setName("QRCode"+utils_formatDateForPicker(new Date()));;
    const  OpenDoc = DocumentApp.openById(newDocFile.getId());
    const body = OpenDoc.getBody();

    body.replaceText("{date}",new Date());

    let blobGlobal = image_createQRCode(stringData);

    var element = body.findText("{QRC}").getElement();
    element.asText().setText("");
    element.getParent().asParagraph().insertInlineImage(0, blobGlobal); 

    OpenDoc.saveAndClose();


  
}


function image_createQRCode(stringData)
{  
    let coded = stringData.replace(/\W*&amp\W*/g, "%26");
    let qrUrl = "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl="+coded;

    return UrlFetchApp.fetch(qrUrl).getBlob();
}

const ProdAppUrl = "https://script.google.com/macros/s/AKfycbwMOsmK2zPH4TJGVcqsBmLstF7RFfUKaht59Bg_-MyQ-n7AqRRWsb3cYvEiHMGx1oXf/exec";

function image_sendAppVersion()
{
  image_sendQRCodeBYEmail(ProdAppUrl);
}


function image_sendQRCodeBYEmail(stringData)
{
  let blob = image_createQRCode(stringData);
  //let encoded = Utilities.base64Encode(blob.getBytes());

  let coded = stringData.replace(/\W*&amp\W*/g, "%26");
    let qrUrl = "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl="+coded;


  //html = '<html><body><img alt="Embedded Image" height="300" width="300" src="data:image/jpeg;base64,' + encoded + '" /></body></html>';
  html = "<html><body>" + "<p>Hello Simon, scan ce QRCode avec l'appli que je t'ai dis d'installer et suis le lien proposé; tu arrives dans Souklight...yesss<br/>"+
         '<img alt="Embedded Image" height="300" width="300" src="https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl='+coded+'"/></body></html>';
  Logger.log(html);

  mailing_sendMail("QRCode",html,"teamsoukcircus@gmail.com,oldanisim@gmail.com");
}

