function test_ce()
{
  let c = CustomerEmail;

  c.thisSubject("aa");
  c.thisBody("bb");

  Logger.log(c.subject + "," +c.body)

}

var CustomerEmail = {
  subject : "",
  body :  "",

  thisSubject : function(s){
    this.subject= s;
  },
  thisBody : function(b){
    this.body=b;
  }
};

/**
 * 
 * 
 */
function mailing_getCollaborators() 
{
  let emails = "";

  if ( getCollabNotif(collab01Notif))
    emails += getCollabEmail(collab01Email);


  if ( getCollabNotif(collab02Notif))
    emails += ","+getCollabEmail(collab02Email);

  if ( getCollabNotif(collab03Notif))
    emails += ","+getCollabEmail(collab03Email);

  return emails;
}

/**
 * 
 * 
 */
function mailing_notifyCollaborators(subject, body) 
{
  //utils_emailChartSourceImage(subject, body, mailing_getCollaborators());
  utils_emailChartSourceImage(subject, body, getEmailIT());
}

/**
 * 
 * 
 */
function mailing_notifyFavorStockAndCoCollaborators(listUrls, subject, text) 
{
    let emails = mailing_getCollaborators();

    let html = "<htnml><h3>Bonjour,</h3><br>" + text + "<br>";

    html += "<table>";
    for(let i=0;i<listUrls.length;i++)
    {
        html += "<tr><td><a href='" + listUrls[i][0] + "'>Clicker pour voir</a></td><td>&nbsp;</td><td>"+ listUrls[i][1] + "</td></tr>";
    }
    html += "</table><br>";

    html += "Bonne lecture, l'équipe IT...;o))<br></html>";
    Logger.log(html);
    //mailing_sendMail(subject, html, emails);
    mailing_sendMail(subject, html, getEmailIT());

}

function mailing_notifyStockCollaborators(listUrls) 
{
  mailing_notifyFavorStockAndCoCollaborators(listUrls,"Soukcircus, alerte favoris", "Le niveau de stock est passé en dessous du niveau accepté") 
}

function mailing_notifyFavorCollaborators(listUrls) 
{
  mailing_notifyFavorStockAndCoCollaborators(listUrls, "Soukcircus, alerte stock", "Ces produit ont dépassés le quota de mise en favoris") 
}


function sendTable(html)
{
  emails = showInputPrompt("Liste des emails séparés par des virgules : ").trim();
  
  if (emails != "" )
  {
    MailApp.sendEmail({
    to: emails,
    subject: "Administration Soukcircus",
    htmlBody: html}); 

    alert("Table envoyée avec succès");
  }
  else
    alert("Vous n'avez pas spécfié d'email(s)");
}


function mailing_sendMail(subject, body, emails)
{    

  let targetEmails = "teamsoukcircus@gmail.com";

  try
  {
      setMailingOn();

      MailApp.sendEmail({
      to: targetEmails,
      subject: subject,
      htmlBody: body}); 

      //Validate mailing system
      setMailingOn();
  }
  catch(e)
  {
    errors_logError("mailing_sendMail: " + e.message); 
    errors_logError("Mailing Off: "+ emails +"//" + subject + "//" + body);
    setMailingOff();
  }
}



/*===============================*/
