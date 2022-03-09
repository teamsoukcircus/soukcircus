//1p7MI8hTrCHExVSEIwTEfiRMU09nPq63qM9M5aBcNzME555kBxU55Ax1u

function onInstall(e)
{
  onOpen(e);  
}

function onOpen(e)
{
    initSoukcicusApplication()


}


function initSoukcicusApplication()
{
  ui = SpreadsheetApp.getUi();

  initSoukCircusMenu();

}




function initSoukCircusMenu()
{

  var ui = SpreadsheetApp.getUi();
  var menu;
  
  let shopName = getStoreName();
  if (shopName != null)
    menu = ui.createMenu(shopName);
  else
    menu = ui.createMenu("Tableau de bord");

/**
 * Restricted menu
 */
  /*=======================================================================================================*/
  menu.addItem("Lancer l'appli Souklight","menuLaunchSoukLight");
  menu.addItem("Saisie de l'objectif mensuel","menuSetCurrentMonthObjective");
  menu.addItem("Estimation des salaires & bonus du mois","menuForecastSalariesEnCours");  
/*=======================================================================================================*/
  menu.addSeparator();
  menu.addItem("Paramétrage Général","menuShowInitModalDialog")
      .addItem("Frais fixes et collaborateurs","menuShowFraisModalDialog")
      .addItem("Frais variables","menuShowModifFraisSupplementaireModalDialog")
      .addItem("Mettre à jour les frais variables","frais_updateFeuilleAdmin");                                          
  
  /*=======================================================================================================*/
  menu.addSeparator(); 
  menu.addItem("Shipping","menuRecapEnvois");   
  /*=======================================================================================================*/
  menu.addSeparator();  
  menu.addItem("Mettre à jour les données de l'année","menuEtsyUpdateData")
       .addItem("Mettre à jour les vendus & favoris","menuEtsyUpdateListings")
       .addItem("Mettre à jour les avis","menuUpdateReviews");
  /*=======================================================================================================*/                      
  menu.addSeparator();
  menu.addSubMenu(ui.createMenu("IT").addItem("Activer le mode debug","setDebugMode")
                                    .addItem("Désactiver le mode debug","resetDebugMode")
                                    .addItem("Export admin as json","exportAdminSheetToJson")
                                    .addSeparator()
                                    .addItem("Gmails","getGmailEmails")
                                    .addSeparator()
                                    .addItem("Distribution du CA brut","menuForecastGrossPerSlice")
                                    .addItem("Distribution du CA net","menuForecastNetPerSlice")
                                    .addItem("Distribution du net encaissé","menuForecastNetEncaissePerSlice")
                                    .addItem("Distrib ution du shipping par tranches","menuForecastShippingPerSlice")
                                    .addSeparator()
                                    .addItem("Sauvegarde du tableau de bord","menuDoBackupSpreadsheet")
                                    .addItem("Sauvegarde de la feuille d'administration","menuEmailFullAdminTable")
                                    .addItem("Mise à jour des données de l'année d'une année spécifique","menuEtsyUpdateSpecific")
                                    .addItem("Users","menuUsers")
                                     );
  menu.addSeparator();
  menu.addSubMenu(ui.createMenu("Sheets Mngt").addItem('Show Sheets', 'showSheets')
                                    .addItem('Hide Sheets', 'hideSheets')
                                    .addItem('Delete Sheets All Sheets From Sheet #', 'deleteAllSheetsFrom')
                                    .addItem('Delete Sheets', 'deleteSheets')
                                    .addItem('Copy Sheets', 'copySheets') );

//https://script.google.com/macros/s/AKfycbzSS24tHJKDwsAepfRcHxn_l60S_3Lw7hAaI8iV8_kfrB6u4ZMZl7LLVW2Ge4aMssLS/exec
  menu.addToUi();
}


function menuUsers()
{
      let ui = SpreadsheetApp.getUi();

      ui.alert("Active: " + Session.getActiveUser().getEmail())
      ui.alert("Active: " + Session.getActiveUser().getUserLoginId())
      ui.alert("Effective: " + Session.getEffectiveUser().getEmail())
      ui.alert("Effective: " + Session.getEffectiveUser().getUserLoginId())
}


function menuRecapEnvois()
{
  let ui = SpreadsheetApp.getUi();

  var response = ui.alert("Attention, le fichier google sheet nommé 'Envois' dans le dossier shipping est-il à jour? sinon pressez la touche NON  et mettez-le à jour",ui.ButtonSet.YES_NO);

  if (response == ui.Button.YES)
  {
      response = ui.alert("La compilation des envois va débuter, elle peut durer quelques minutes. Lorsqu'elle se terminera une feuille nommée 'EnvoisPerUser' suivit de la date du jour aura été créée. Par exemple EnvoisPerUser2022-02-05 si vous êtes le 5 février 2022. Elle contient l'état actuel des envois sur la base du fichier des envois réels fournit. En particulier, la colonne 'F' contient la valeur des frais supplélmentaires. Ceux-ci sont positifs si l'envoi a coûté plus cher que ce qui a été facturé à la commande et négatif dans le cas contraire. Le total des frais supplémentaires de shipping est indiqué à la fin de la feuille et devraient être reportés dans la case 'frais d'envois supplémentaires de la feuille Admin en utilisant le menu 'Soukcircus -> Paramétrage de frais'",ui.ButtonSet.YES_NO);

      if (response == ui.Button.YES)
      {
        try
        {
          shipping_compareEtsyEtEnvoisReel();
        }
        catch(e)
        {
            ui.alert("L'erreur suivante est survenue: " + e.message,ui.ButtonSet.OK);
        }
      }
      else
        ui.alert("Mise à jour annulée",ui.ButtonSet.OK);
  }
  else
  {
    ui.alert("Mise à jour annulée",ui.ButtonSet.OK);
  }
}



function exportAdminSheetToJson()
{
  SpreadsheetApp.getUi().showModalDialog(convertSheetToJson(ADMIN_SHEET).evaluate(), "Json" );
}

function voirLogiqueFinance()
{

    let page = HtmlService.createTemplateFromFile("image");

    page.url = "https://drive.google.com/uc?export=view&id=13QYqX0tiR3KNu171M9SprRF2ak2J7MVY";

    let html = page.evaluate().setWidth(1000).setHeight(1000);
    SpreadsheetApp.getUi().showModalDialog(html, "Logique financière" );
}


function openUrl(url)
{            
  var html = HtmlService.createHtmlOutput('<html><script>'
  +'window.close = function(){window.setTimeout(function(){google.script.host.close()},9)};'
  +'var a = document.createElement("a"); a.href="'+url+'"; a.target="_blank";'
  +'if(document.createEvent){'
  +'  var event=document.createEvent("MouseEvents");'
  +'  if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1){window.document.body.append(a)}'                          
  +'  event.initEvent("click",true,true); a.dispatchEvent(event);'
  +'}else{ a.click() }'
  +'close();'
  +'</script>'
  // Offer URL as clickable link in case above code fails.
  +'<body style="word-break:break-word;font-family:sans-serif;">Failed to open automatically. <a href="'+url+'" target="_blank" onclick="window.close()">Click here to proceed</a>.</body>'
  +'<script>google.script.host.setHeight(40);google.script.host.setWidth(410)</script>'
  +'</html>')
  .setWidth( 90 ).setHeight( 1 );
  SpreadsheetApp.getUi().showModelessDialog( html, "Opening ..." );
}

function openUrl2(url)
{            
  return HtmlService.createHtmlOutput('<html><script>'
  +'window.close = function(){window.setTimeout(function(){google.script.host.close()},9)};'
  +'var a = document.createElement("a"); a.href="'+url+'"; a.target="_blank";'
  +'if(document.createEvent){'
  +'  var event=document.createEvent("MouseEvents");'
  +'  if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1){window.document.body.append(a)}'                          
  +'  event.initEvent("click",true,true); a.dispatchEvent(event);'
  +'}else{ a.click() }'
  +'close();'
  +'</script>'
  // Offer URL as clickable link in case above code fails.
  +'<body style="word-break:break-word;font-family:sans-serif;">Failed to open automatically. <a href="'+url+'" target="_blank" onclick="window.close()">Click here to proceed</a>.</body>'
  +'<script>google.script.host.setHeight(40);google.script.host.setWidth(410)</script>'
  +'</html>');
}


function menuLaunchSoukLight()
{
  openUrl(ProdAppUrl);
}

function menuCreateTask()
{
  openUrl("https://docs.google.com/forms/d/e/1FAIpQLSfEy359R6wpSFgSm-CAWWRppoAXdZKnvYsiNIcI7Sd4o2b2Bg/viewform");
}

function menuSetCurrentMonthObjective()
{
    let amount = parseInt(showInputPrompt("Veuillez saisir l'objectif du mois courant : "));

    let month = getAdminDashboardMonth();

    setObjectifMois(month,amount);
}

function showGMailSheet()
{
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  utils_getSheet(GMAIL_SHEET).showSheet();
  spreadsheet.setActiveSheet(utils_getSheet(GMAIL_SHEET),true);
}

function showRetroactiveSheet()
{
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  utils_getSheet(RETRO_SHEET).showSheet();
  spreadsheet.setActiveSheet(utils_getSheet(RETRO_SHEET),true);
}


  function  getMonthsList(locales) 
    {
      var year = new Date().getFullYear();
      
      let monthList= {};

      for (let i =0;i<= 11;i++)
      {
        let k = '"'+i+'"';
        monthList[k] = new Date(year,i,1).toLocaleDateString(locales, { month:"long"}) ;
      }

      return monthList;
    }

function test_dates()
{
  let m = getMonthsList('en');
  Logger.log(m );

  for(let i=0;i<11;i++)
    Logger.log(m['"'+i+'"']);
}
/**
 * 
 */
function verifyInitialization()
{
  let ui = SpreadsheetApp.getUi();
  let sId = prop_getSpreadSheetId();

  if (sId==null)
  {
    setSpreadSheetId(G_SPREADSHEET_APP_ID);
    setTrendNetEncaisse(0);
  }
  else
  {
    if ( getTrendNetEncaisse() != null )
      utils_SetCellValueInSheet(STATDATA_SHEET, cellStatTrendNetEncaisse,getTrendNetEncaisse()) 
  }
  

  if ( getAdminGeneOk() == null || getAdminGeneOk() == 0)
  {
    ui.alert("Les paramètres généraux du tableau de bord n'ont pas encore été initialisés.\r\nUtiliser"+
             "le menu Paramétrage général ci-dessus",ui.ButtonSet.OK) ;
  }

  if ( getAdminFraisOk() == null || getAdminFraisOk() == 0)
  {
    ui.alert("Le  paramétrage des frais généraux du tableau de bord n'a pas encore été réalisé.\r\nUtiliser"+
             "le menu Paramétrage des frais généraux ci-dessus",ui.ButtonSet.OK) ;
  }

}

/**
 * 
 */
function onChange(e)
{ 
  //if INSERT_ROW, INSERT_COLUMN, REMOVE_ROW, REMOVE_COLUMN
  if ( e.source.getSheetName() == MAIN_SHEET || e.source.getSheetName()== ADMIN_SHEET)
  {
    if ( e.changeType == "INSERT_ROW" || e.changeType == "INSERT_COLUMN" || e.changeType == "REMOVE_ROW" || e.changeType == "REMOVE_COLUMN")
      SpreadsheetApp.getUi().alert("Cette action est interdite dans cette feuille, merci d'annuler votre action");
  }

  if ( e.source.getSheetName() == DATA_SHEET )
  {
    SpreadsheetApp.getUi().alert("Vous ne devez pas modifier manuellement cette feuille, merci d'annuler votre action"); 
  }

  if ( e.source.getSheetName() == LISTINGS_SHEET && e.changeType == "EDIT" )
  {
      utils_sort(LISTINGS_SHEET,cellListingsNumFavoris,false);
  }
}
 
 /**
  * 
  */
function onEdit(e) 
{ 
  //if INSERT_ROW, INSERT_COLUMN, REMOVE_ROW, REMOVE_COLUMN
  if ( e.source.getSheetName() == MAIN_SHEET || e.source.getSheetName()== ADMIN_SHEET)
  {
    if ( e.changeType == "INSERT_ROW" || e.changeType == "INSERT_COLUMN" || e.changeType == "REMOVE_ROW" || e.changeType == "REMOVE_COLUMN")
      SpreadsheetApp.getUi().alert("Cette action est interdite dans cette feuille, merci d'annuler votre action");
  }

  if ( e.source.getSheetName() == DATA_SHEET )
  {
    SpreadsheetApp.getUi().alert("Vous ne devez pas modifier manuellement cette feuille, merci d'annuler votre action"); 
  }
  

  if ( String(e.source.getSheetName()) == LISTINGS_SHEET )
  {
      utils_applySorting("favorisInListings");
  }
}

/**
 * Manual update of etsy orders data from ETSY RESTAPI V3
 */
/**
 * 
 */
function launchRequest(requestId, data) {

  let EtsyService = etsy_getService();

  if (!EtsyService.hasAccess()) {

    let authorizationUrl = EtsyService.getAuthorizationUrl();

   let template = HtmlService.createTemplate(
        '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
        'Reopen the sidebar when the authorization is complete.');
    template.authorizationUrl = authorizationUrl;
    var page = template.evaluate();

    var ui = SpreadsheetApp.getUi();
    ui.showSidebar(page);
  } 
  else 
  {
    showInfoWindow("Download","Le téléchargement est en cours, patientez...");
    try
    {
      switch (requestId)  
      {
          case GET_ALLSELLINGS_DATA:
              let firstNewRow = trigger_AnnualOrdersRequest(true);
          break;
          case GET_ALLSELLINGS_LISTINGS:
              getListingsByListingIds();
          break;
          case GET_YEARSELLINGS_DATA:
            etsy_getAllOrdersForYear(data[0],DATA_SHEET);
          break;
          case GET_REVIEWS:
            getReviews();
          break;
          default:
              SpreadsheetApp.getUi().alert("launchRequest: unknown received request Id : " + requestId);
              closeInfoWithWarningWindow("Téléchargement","une erreur s'est produite, essayez à nouveau...",10);
          break;
      }
      closeInfoWithSuccessWindow("Téléchargement","Le téléchargement est terminé...",5);
    }
    catch(err)
    {
      errors_logErrorExceptionAndEmail(err);
      closeInfoWithWarningWindow("Téléchargement","une erreur s'est produite, essayez à nouveau...",10);
    }
  }
}



function menuForecastSalariesEnCours()
{
  let month = parseInt(showInputPrompt("Veuillez saisir le mois [0=Janvier,...,11=Décembre]: "));
  if (month >=0 && month <= 11)
  {
    showInfoWindow("Calculs","Le calcul est en cours, patientez...");
    specificMonthforecastSalaries(month);
    closeInfoWithSuccessWindow("Calculs","Le calcul est terminé...",5);
  }
  else
    SpreadsheetApp.getUi().alert("Saisie incorrecte du mois...");
}


function menuForecastEvolutionSalariesEnCours()
{
  showInfoWindow("Calculs","Le calcul est en cours, patientez...");
    let month = utils_getCurrentMonth();
    let dataSal = [];
    let dataBon = [];
    let dataTesor = [];

    for(let i=0;i<3;i++)
    {
        dataSal.push([]);
        dataBon.push([]);
    }

    for ( let netEncEstim = 0 ; netEncEstim <= 10000; netEncEstim += 500)
    {
      let estim = forecastSalariesForMonth(month,netEncEstim);
      //[[[0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], 0.0]]
      for(let i=0;i<3;i++)
      {
          dataSal[i].push([netEncEstim,estim[i][0]]);

          dataBon[i].push([netEncEstim,estim[i][1]]);
      }
      
      dataTesor.push([netEncEstim,estim[3][0]]);
    }


    let dataArray=[];
    for(let i=0;i<3;i++)
    {
        dataArray.push([dataSal[i],"Salaire "+(i+1)]);
        dataArray.push([dataBon[i],"Bonus "+(i+1)]);
    }
    dataArray.push([dataTesor,"Tésorisation"]);

    closeInfoWithSuccessWindow("Calculs","Le calcul est terminé...",3);

    let charts = createLineCharts(dataArray);
    let template = HtmlService.createTemplate(charts).evaluate()
                  .setWidth(900)
                  .setHeight(900);
      
    SpreadsheetApp.getUi().showModalDialog(template,"Evolution salaires & bonus")
  
}

function menuForecastGrossPerSlice()
{
  showInfoWindow("Calculs","Le calcul est en cours, patientez...");
    var ui = SpreadsheetApp.getUi();
  let sliceDays = parseInt(showInputPrompt("Tranche de jours [1..365] : "));
  
  display_ChartsOfGroupSoldGrossAmountBySlice(sliceDays,ENUMS_AMOUNT_TYPES.GROSS)
  closeInfoWithSuccessWindow("Calculs","Le calcul est  terminé...",5);
}


function menuForecastNetPerSlice()
{
  showInfoWindow("Calculs","Le calcul est en cours, patientez...");

  var ui = SpreadsheetApp.getUi();
  let sliceDays = parseInt(showInputPrompt("Tranche de jours [1..365] : "));

  display_ChartsOfGroupSoldGrossAmountBySlice(sliceDays,ENUMS_AMOUNT_TYPES.NET)

  closeInfoWithSuccessWindow("Calculs","Le calcul est terminé...",5);
}

function menuForecastNetEncaissePerSlice()
{
  showInfoWindow("Calculs","Le calcul est en cours, patientez...");

    var ui = SpreadsheetApp.getUi();
  let sliceDays = parseInt(showInputPrompt("Tranche de jours [1..365] : "));
  
  display_ChartsOfGroupSoldGrossAmountBySlice(sliceDays,ENUMS_AMOUNT_TYPES.NETENCAISSE);

  closeInfoWithSuccessWindow("Calculs","Le calcul est terminé...",5);
}
 
function menuForecastShippingPerSlice()
{
  showInfoWindow("Calculs","Le calcul est en cours, patientez...");
  
  var ui = SpreadsheetApp.getUi();
  let sliceDays = parseInt(showInputPrompt("Tranche de jours [1..365] : "));

  display_ChartsOfGroupSoldGrossAmountBySlice(sliceDays,ENUMS_AMOUNT_TYPES.SHIP);

  closeInfoWithSuccessWindow("Calculs","Le calcul est terminé...",5);
}


function menuShowModifFraisSupplementaireModalDialog()
{
  showModifFraisSupplementaireModalDialog()
}

function menuShowModifAdminModalDialog()
{
  showModifAdminModalDialog()
}

function menuShowInitModalDialog()
{
  showInitModalDialog()
}

function menuShowFraisModalDialog()
{
  showFraisModalDialog()
}



function menuEmailFullAdminTable()
{
  emailFullAdminTablexx();
}


function menuEtsyUpdateData() 
{

  var ui = SpreadsheetApp.getUi();
  var response = ui.alert("Merci de confirmer cette mise à jour des données. Si vous la confirmez, lorsque la fenêtre d'exécution ci-dessus se fermera, les données auront été mises à jour",ui.ButtonSet.YES_NO);

  if (response == ui.Button.YES)
  {
    launchRequest(GET_ALLSELLINGS_DATA,[]);
  }
  else
  {
    ui.alert("Mise à jour annulée",ui.ButtonSet.OK);
  }
}

function menuEtsyUpdateSpecific() 
{
  var ui = SpreadsheetApp.getUi();
  let annee = parseInt(showInputPrompt("Pour quelle année voulez-vous la mise à jour? [YYYY] : "));

  if ( annee >= 2000 )
  {
    var response = ui.alert("Merci de confirmer la mise à jour des données pour l'année : " + annee+ ". Si vous la confirmez, lorsque la fenêtre d'exécution ci-dessus se fermera, les données auront été mises à jour",ui.ButtonSet.YES_NO);

    if (response == ui.Button.YES)
    {
      launchRequest(GET_YEARSELLINGS_DATA,[annee]);
      return;
    }
  }

  ui.alert("Mise à jour annulée",ui.ButtonSet.OK);

}


/**
 * Manual update of etsy orders data from ETSY RESTAPI V3
 */
function menuEtsyUpdateListings() 
{
  var ui = SpreadsheetApp.getUi();
  ui.alert("Attention, pour que les données que vous demandez soient complètes il faut vous assurer que les données de vente sont à jour. Pour les mettre à jour utiliser le menu -- Mise à jour manuelle des données --. Une confirmation va vous être demandée...",ui.ButtonSet.OK);
  
  var response = ui.alert("Merci de confirmer cette mise à jour des données. Si vous la confirmez, lorsque la fenêtre d'exécution ci-dessus se fermera, les données auront été mises à jour",ui.ButtonSet.YES_NO);

  if (response == ui.Button.YES)
  {
    launchRequest(GET_ALLSELLINGS_LISTINGS,[]);
  }
  else
  {
    ui.alert("Mise à jour annulée",ui.ButtonSet.OK);
  }
}




/**
 * Efface toutes les propriétés de paramétrage stockées
 */
function menuResetAllParameters() 
{
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert("Merci de confirmer l'effacement du paramétrage",ui.ButtonSet.YES_NO);

  if (response == ui.Button.YES)
  {
    deleteAllScriptProperties();
  }
  else
  {
    ui.alert("Effacement annulé",ui.ButtonSet.OK);
  }
}


/**
 * Efface toutes les propriétés de paramétrage stockées
 */
function menuDoBackupSpreadsheet() 
{
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert("Merci de confirmer la sauvegarde du tableau de bord",ui.ButtonSet.YES_NO);

  if (response == ui.Button.YES)
  {
    backupSpreadsheet();
  }
  else
  {
    ui.alert("Sauvegarde annulée",ui.ButtonSet.OK);
  }
}


function menuUpdateReviews()
{

}




