
function test_getEmailForFeedBack()
{
  let e = getEmailForFeedBack("Simon Oldani","en");
  //mailing_sendMail(e.subject,e.body,"oldanisim@gmail.com");
  mailing_sendMail(e.subject,e.body,"oldanisim@gmail.com");
}


function getEmailForFeedBack(customerName,language)
{
      //mailing_sendMail("Rappel tableau de bord",mailing_getCollaborators()+","+getEmailIT());
      
      
      let subject ;
      let dearCustomer;
      let introText1;
      let introText2;
      let introText3;
      let buttonOpinionTxt;
      let returnToSoukCircus;
      let  soukNews = "";

      switch(language)
      {
        case COUNTRIES_LANG.DE[1]:
          subject = LanguageApp.translate(T_OPINION+ ", " + T_OPINION_MATTER, 'en', 'de');
          dearCustomer = LanguageApp.translate(T_DEAR, 'en', 'de') + customerName;
          introText1 = LanguageApp.translate(T_ITEMBOUGHT_1, 'en', 'de') ;
          
          buttonOpinionTxt = LanguageApp.translate(T_OPINION_BUTT, 'en', 'de');
        break;
        case COUNTRIES_LANG.CH[1]:
        
          dearCustomer = LanguageApp.translate(T_DEAR, 'en', 'de') + " " + customerName ;
          subject = LanguageApp.translate(T_OPINION+ ", " + T_OPINION_MATTER, 'en', 'de');
          introText1 = LanguageApp.translate(T_ITEMBOUGHT_1, 'en', 'de') ;
          buttonOpinionTxt = LanguageApp.translate(T_OPINION_BUTT, 'en', 'de');
        break;
        case COUNTRIES_LANG.FR[1]:
          subject = LanguageApp.translate(T_OPINION+ ", " + T_OPINION_MATTER, 'en', 'fr');
          dearCustomer = LanguageApp.translate(T_DEAR, 'en', 'fr') + "  " + customerName;

          introText1 = LanguageApp.translate(T_ITEMBOUGHT_1, 'en', 'fr') ;
          buttonOpinionTxt = LanguageApp.translate(T_OPINION_BUTT, 'en', 'fr');
        break;
        case COUNTRIES_LANG.NL[1]:
          subject = LanguageApp.translate(T_OPINION+ ", " + T_OPINION_MATTER, 'en', 'nl');
          dearCustomer = LanguageApp.translate(T_DEAR, 'en', 'nl') + "&nbsp" + customerName;
          
          introText1 = LanguageApp.translate(T_ITEMBOUGHT_1+ ", " + T_OPINION_MATTER, 'en', 'nl') ;
          buttonOpinionTxt = LanguageApp.translate(T_OPINION_BUTT, 'en', 'nl');

        break;
        default: //english
          subject = T_OPINION;
          dearCustomer = T_DEAR + customerName;
          introText1 = T_ITEMBOUGHT_1 + ", " + T_OPINION_MATTER;
          buttonOpinionTxt = T_OPINION_BUTT;
        break;
      }

      email = CustomerEmail;
      email.thisSubject(subject);

      let page = HtmlService.createTemplateFromFile("feedbackPostPurchase-html");

      page.customerName = dearCustomer;
      //page.subCustName = subject;
      page.introText1 = introText1;
      //page.introductoryText3 = introText3;
      page.opinionButtonTxt = buttonOpinionTxt;
      //page.returnToSoukCircus = returnToSoukCircus;
      //page.soukNews = soukNews;

      let html = page.evaluate();
      
      email.thisBody(html.getContent());

      return email;
}   


function onCusomerFeedbackSubmit(event)
{
  let newRow=[];
  var form = event.response;
  var itemResponses = form.getItemResponses();

  newRow.push(new Date())
  for (var i=0; i<itemResponses.length; i++) 
  {
    newRow.push(itemResponses[i].getResponse());
    //let index=itemResponses[i].getItem().getIndex();
  } 

  utils_getSheet(FEEDBACK_SHEET).appendRow(newRow);
}






