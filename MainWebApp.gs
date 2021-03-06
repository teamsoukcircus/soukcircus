


function doGet(e) 
{ 
  let userSessionEmail = Session.getActiveUser().getEmail();
  let user=getCollabPropertiesWithEmail(userSessionEmail);

  if ( user != null && user.FullName != null && user.FullName.trim() != "")
  {
    //let splitted = utils_splitString(user.FullName," ");
    
      if ( e.parameter.taskId != null)
      {
          let page = HtmlService.createTemplateFromFile('SoukTask');
          page.taskNumberTitle = e.parameter.taskId;
          page.taskNumber = e.parameter.taskId;
          //page.activeFirstName = splitted[0];
          //page.activeLastName= splitted[1];
          page.activeEmail = user.Email;

          return page.evaluate();
      }
      else if ( e.parameter.actionId != null)
      {
        switch(e.parameter.actionId)
        {  
          case "actionAddFraisSupp":
          return HtmlService.createTemplateFromFile('fraisSupplementaires-html').evaluate();

          case "actionFraisFixes":
          return HtmlService.createTemplateFromFile("frais").evaluate();

          case "actionParamGene":
          return HtmlService.createTemplateFromFile("parametrageGene").evaluate();

          case "actionVoirFinances":
          return HtmlService.createTemplateFromFile("finances").evaluate();

          case "actionStock":
          {
            let page = HtmlService.createTemplateFromFile("stock-html");
            page.commandeNewProduct     = utils_getUrl() + "?actionId=commandeNewProduct";
            page.actionCommandesSouk    = utils_getUrl()  + "?actionId=actionCommandesSouk";
            return page.evaluate();
          }
           
          case "actionOrders":
          {
            return HtmlService.createTemplateFromFile("orders-html").evaluate();
          }

          case "actionShipSession":
          {
            let page = HtmlService.createTemplateFromFile("shippingPrepare-html");
            page.actionCustomers  = utils_getUrl() + "?actionId=actionCustomers";
            page.actionOrders     = utils_getUrl()  + "?actionId=actionOrders";
            return page.evaluate();
          }

          case "actionCrm":
          {
            return HtmlService.createTemplateFromFile("crmMain-html").evaluate();
          }

          case "commandeNewProduct":
          {
            let page = HtmlService.createTemplateFromFile("passerCommande");
            if ( e.parameter.stockId !=null )
              page.stockIdValue = e.parameter.stockId ;
            else
              page.stockIdValue = -1;
            return page.evaluate();
          }

          case "actionCommandesSouk":
          return HtmlService.createTemplateFromFile("soukListCommandes-html").evaluate();

          case "actionUpdateProduct":
          {
            let page = HtmlService.createTemplateFromFile("stockEdit-html");
            if ( e.parameter.stockId !=null )
              page.stockIdValue = e.parameter.stockId ;
            else
              page.stockIdValue = -1;
            return page.evaluate();
          }

          case  "validerCommande":
          {

            let page = HtmlService.createTemplateFromFile("validerCommande");
            page.cmdId = e.parameter.cmdId;
            return page.evaluate();
          }
          
          case "actionFinances":
          {
            let page = HtmlService.createTemplateFromFile("finances");
            page.actionFraisFixes = utils_getUrl() + "?actionId=actionFraisFixes";
            return page.evaluate();
          }

          case "actionHR":
          {
            let page = HtmlService.createTemplateFromFile("humanResources-html");
            page.currentDay            = new Date().getDate();
            page.currentMonth          = SHEET_MONTH_NAMES_LONG[utils_getCurrentMonth()];
            page.currentYear           = utils_getCurrentYear();
            page.actionWorkers         = utils_getUrl()  + "?actionId=actionWorkers";
            return page.evaluate();
          }

          case "actionCustomers":
          {
            let page = HtmlService.createTemplateFromFile("customers-html");
            return page.evaluate();
          }

          case "actionTableauDeBord":
          {
            if ( userSessionEmail.toUpperCase().indexOf("SAID") < 0 && userSessionEmail.toUpperCase().indexOf("GIANFRANCO") < 0)
            {
              let page = HtmlService.createTemplateFromFile('tableauDeBord');
              page.activeEmail = user.Email;
              
              page.actionFinances         = utils_getUrl()  + "?actionId=actionFinances";
              page.actionHR               = utils_getUrl()  + "?actionId=actionHR";

              page.currentDay            = new Date().getDate();
              page.currentMonth          = SHEET_MONTH_NAMES_LONG[utils_getCurrentMonth()];
              page.currentYear           = utils_getCurrentYear();

              /*
              let chiffres= new Array(6);
          
              chiffres = main_getChiffresDuMois(utils_getCurrentMonth());

              page.objectifMois          = utils_parseInt(chiffres[0]);
              page.minBonusMois          = utils_parseInt(chiffres[1]);
              page.ventesCreditsEtsyMois = utils_parseInt(chiffres[2]);
              page.salaireCelineMois     = utils_parseInt(chiffres[3]);
              page.salaireSimonMois      = utils_parseInt(chiffres[4]);
              page.salaireSaidMois       = utils_parseInt(chiffres[5]);

              */
              return page.evaluate();
            }
            else
            {
                let page = HtmlService.createTemplate(getInfoHtml());
                page.text = "D??sol??s il semble que vous ne soyiez pas autoris?? ?? acc??der cette page...";
                return page.evaluate();
            }
          }

          case "actionWorkers":
          {
            let page = HtmlService.createTemplateFromFile("hrWorkers-html");
            if ( e.parameter.workerId !=null )
              page.recordIdValue = e.parameter.workerId;
            else
              page.recordIdValue="";

            return page.evaluate();
          }
          case "actionCalendrier":
          {
            return HtmlService.createTemplateFromFile("calendrier-html").evaluate();
          }
          case "actionGeneric":
          {
              let page = HtmlService.createTemplateFromFile("genericForm-html");
            if ( e.parameter.genericId !=null )
              page.recordIdValue = e.parameter.genericId;
            else
              page.recordIdValue="";

            return page.evaluate();
          }

          default:
            //Display home page
          break;
        }
      }

      //Display home page
      let page = HtmlService.createTemplateFromFile('SoukWebAppMain');
      page.activeEmail = user.Email;

      page.actionShipSession      = utils_getUrl()  + "?actionId=actionShipSession";  
      page.actionVoirFinances     = utils_getUrl()  + "?actionId=actionVoirFinances";
      page.actionStock            = utils_getUrl()  + "?actionId=actionStock";
      //page.actionOrders           = utils_getUrl()  + "?actionId=actionOrders"; pass??e dans shipping
      //page.actionCommandesSouk    = utils_getUrl()  + "?actionId=actionCommandesSouk"; pass??e dans la page stock-html.html
      page.actionGeneric          = utils_getUrl()  + "?actionId=actionGeneric";
      page.actionCalendrier       = utils_getUrl()  + "?actionId=actionCalendrier";

      //Les chiffres du mois
      if ( userSessionEmail.toUpperCase().indexOf("SAID") < 0 && userSessionEmail.toUpperCase().indexOf("GIANFRANCO") < 0)
      {
          page.TableauDeBordTitle = "Tableau de bord";
          page.actionTableauDeBord = utils_getUrl()  + "?actionId=actionTableauDeBord";
      }
      else
      {
        page.actionTableauDeBord = "#";
        page.TableauDeBordTitle  = "";
      }

      return page.evaluate();
  }
  else
  {
      let page = HtmlService.createTemplate(getInfoHtml());
      page.text = "Vous essayez de vous connecter avec le compte : " + Session.getActiveUser().getEmail() + ", D??sol??s il semble que vous ne soyiez pas autoris??...";
      return page.evaluate();
  }

}



function web_specificMonthforecastSalaries(month)
{
  return "<table  width='100%'>"+
        "<tr><td><h3> Salaires & Bonus pour le mois de " + SHEET_MONTH_NAMES[month] + "&nbsp;" + getDashboardYear() + "</h3></td></tr>"+
        "<tr><td><table id='soukTable' width='50%' >"+
        "<tr><th>Collaborateur</th><th>Salaire&nbsp;&euro;</th><th>Bonus&nbsp;&euro;</th></tr>"+
        "<tr><td>"+ getAdminCollabFullName(1)+ "</td><td>" + parseInt(getAdminSalaireCollab(1,month)) + 
                                                         "</td><td>"+ parseInt(getAdminBonusCollab(1,month)) + "</td></tr>"+
       "<tr><td>"+ getAdminCollabFullName(2) + "</td><td>" + parseInt(getAdminSalaireCollab(2,month)) + 
                                                         "</td><td>"+ parseInt(getAdminBonusCollab(2,month)) + "</td></tr>"+
       "<tr><td>"+ getAdminCollabFullName(3) + "</td><td>" + parseInt(getAdminSalaireCollab(3,month)) + 
                                                         "</td><td>"+ parseInt(getAdminBonusCollab(3,month)) + "</td></tr>"+
        "</table></td></tr>"+
        "<tr><td><h4>Montant total en tr??sorerie : &nbsp; " + parseInt(getAdminTesorize(month)) + "&euro;" + "</h4></td></tr>" +
        "<tr><td><h4>Attention, ce calcul prend pour hypoth??se que la moyenne journali??re actuelle&nbsp;de " + 
        utils_parseInt(getAdminMoyenneReelle())  + "&euro;&nbsp;sur le net encaiss?? est ?? minima maintenue"+"</td></tr>"+
        "</table>";
} 


function getSalairesTable()
{
  return web_specificMonthforecastSalaries(utils_getCurrentMonth());
}



function main_getChiffresDuMois(mois)
{
    let nomMois = SHEET_MONTH_NAMES[mois];
    let sheetMois = utils_getSheet(SHEET_MONTH_NAMES[mois]).getDataRange().getValues();

    let objectifMois          = utils_parseFloat(sheetMois[10][2]).toFixed(0);
    let minBonusMois          = utils_parseFloat(sheetMois[11][2]).toFixed(0);
    let ventesCreditsEtsyMois = utils_parseFloat(sheetMois[12][2]).toFixed(0);
    /*
    let salaireCelineMois     = utils_parseFloat(sheetMois[23][2]).toFixed(0);
    let salaireSimonMois      = utils_parseFloat(sheetMois[24][2]).toFixed(0);
    let salaireSaidMois       = utils_parseFloat(sheetMois[25][2]).toFixed(0);

    return [nomMois,objectifMois,minBonusMois,ventesCreditsEtsyMois,salaireCelineMois,salaireSimonMois,salaireSaidMois];
    */

    return [nomMois,objectifMois,minBonusMois,ventesCreditsEtsyMois];
}

function main_getChiffresAnnee()
{
    let allMois = [];
    for (let mois=1;mois <= utils_getCurrentMonth();mois++)
      allMois.append(main_getChiffresDuMois(mois));

    return allMois;
}



/**
 * 
 * 
 */
const dataHeaders = ["Objectif net encaiss??", "Projection Fin mois", "Donn??es date du jour", "Objectif minimum bonus", "Jours du mois"];
function main_geFiguresForTheMonth(mois)
{
    let month = SHEET_MONTH_NAMES[mois];
    let sheetMonth = utils_getSheet(month);
    let chartingDataMonth = sheetMonth.getRange(2,6,5,32).getValues();
    let labels = new Array(31);

    for (let j=0;j<31 ;j++)
      labels[j]=j+1;

    let retData={};
    retData["labels"] = labels;
    retData["series"] = [];

    for(let i=0;i<4;i++)
    {
      let data = new Array(31);

      for (let j=0;j<31 ;j++)
      {
        let nextData =  chartingDataMonth[i][j+1];
        if ( nextData != null && nextData != "")
          data[j] = nextData;
        else
          break;
      }

      let xData={};
      xData["month"] = month;
      xData["name"] = dataHeaders[i];
      xData["data"] = data;
      retData["series"].push(xData); 
    }

    return JSON.stringify(retData);
}

function main_getFiguresForCurrentYear()
{
    let allMois = [];
    for (let mois=1;mois <= utils_getCurrentMonth();mois++)
      allMois.append(main_geFiguresForTheMonth(mois));

    return allMois;
}

function main_getAllDataForCurrentYear()
{
    let lastMonth = utils_getCurrentMonth();
    let allMois = [];
    for (let mois=0;mois <= lastMonth;mois++)
    {
      oneMonth={};
      oneMonth["numbers"] = main_getChiffresDuMois(mois);
      oneMonth["figures"] = main_geFiguresForTheMonth(mois);

      allMois.push(oneMonth);
    }
    
    let retVal={}
    retVal["monthly"]   = allMois;
    retVal["shipping"]  = fin_computeFraisShippingSupplementairesTillMoisCourant()


    //[[salaireFinal1,bonus1],[salaireFinal2,bonus2],[salaireFinal3,bonus3],[Disponible,0]];
    retVal["salAndTreso"]  = forecastSalariesForMonth(lastMonth,-1,false) 

    return retVal;
}








