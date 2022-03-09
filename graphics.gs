



function showArrowOnMainSheet(arrowName) 
{
  let imageUrl = utils_GetCellValue(IMAGE_SHEET, arrowName);
  let imageColPos=14;
  let imageRowPos=6;
  let mainSheet = utils_getSheet(MAIN_SHEET);

  allImages = mainSheet.getImages();

  for ( let i = 0 ; i < allImages.length;i++)
  {
      if ( allImages[i].getAltTextDescription()== cellImagesArrowDown )
      {
          allImages[i].remove();
      }
      else if ( allImages[i].getAltTextDescription()== cellImagesArrowRight )
      {
          allImages[i].remove();
      }
      else if ( allImages[i].getAltTextDescription()== cellImagesArrowUp )
      {
          allImages[i].remove();
      }
  }
  SpreadsheetApp.flush()

  var img = DriveApp.getFileById(imageUrl).getBlob();

  mainSheet.insertImage(img, imageColPos, imageRowPos);
  SpreadsheetApp.flush()

  allImages = mainSheet.getImages();
  if ( allImages.length > 0)
  {
    for ( let i = 0 ; i < allImages.length;i++)
    {
      if ( allImages[i].getAltTextDescription()== '' )
      {
          allImages[i].setAltTextDescription(arrowName);
          SpreadsheetApp.flush()
          break;
      }
    }
  }
  else{
      allImages[0].setAltTextDescription(name);
      SpreadsheetApp.flush()
  }
   
}

function test_showArrowOnMainSheet()
{
  showArrowOnMainSheet(cellImagesArrowUp); 
}


