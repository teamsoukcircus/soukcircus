

function backupSpreadsheet() 
{
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetId = sheet.getId();
  var destFolder = DriveApp.getFolderById(SOUK_PILOTAGE_BACKUP_FLDID);
  var fileName = sheet.getName() + "-" + getDashboardYear() + "-" + getLocalTime();
  try
  {
      //======================================
      setCleanTriggers(1);

      //======================================
      utils_SetCellValueInSheet(MAIN_SHEET, cellAnnuelDateMiseAJour,"Fichier backup année : " + getDashboardYear());
      
      //Create a sheet with the properties
      //======================================
      let props = loadAllProperties() ;

      utils_removeSheet(BACKUPPROP_SHEET);
      utils_insertSheet(BACKUPPROP_SHEET);
      let propSheet = utils_getSheet(BACKUPPROP_SHEET);

      for (let i =0;i<props.length;i++) 
      {
          Logger.log(props[i]);
          propSheet.appendRow(props[i]);
      }
        
      //====================================


      DriveApp.getFileById(sheet.getId()).makeCopy(fileName, destFolder);

      //==================================
      sheet.deleteSheet(propSheet);

      //==================================
      let text = "Le tableau de bord " + getStoreName() + " " + getDashboardYear() + " a été archivé dans le dossier backup le : " + getLocalTime(); 
      successs_logAndEmail(text) ; 

      //======================================
      alert("Sauvegarde terminée avec succès");
  }
  catch(err)
  {
    errors_logErrorExceptionAndEmail(err);
  }
  finally
  {
    setCleanTriggers(0); 
  }
}



