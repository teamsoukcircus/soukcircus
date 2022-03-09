


function alertMiseAJourTableau()
{
    if ( askTriggersManager("alertMiseAJourTableau") )
    { 
      let page = HtmlService.createHtmlOutputFromFile("emailFrais");
      //mailing_sendMail("Rappel tableau de bord",mailing_getCollaborators()+","+getEmailIT());
     
      mailing_sendMail("Soukcircus, saisie des frais de fonctionnement",page.getContent(),mailing_getCollaborators()+","+getEmailIT());
    }
}   








