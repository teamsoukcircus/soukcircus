function commperso_emailChartSourceImage()
{
  const sheet = utils_getSheet(MAIN_SHEET); 
  const charts = sheet.getCharts(); 
  
  let x = charts[0].getOptions().get('series')

  // setup some variables for our email
  const chartBlobs = new Array(); 
  const emailImages = {};
  let emailBody = "<html><h3>Salut la compagnie, here is the IT guy speaking...;o)). Il faudra bientôt que je vous brief sur le nouveau tableau de bord. J'ai plein de nouvelles choses à vous montrer...La vous ne voyez que les graphiques mais il y a d'autres choses. On pourrnait se faire un zoom un de ces 4, qu'en dites-vous?</h3><p><h3>Charts</h3><br>"; 
  emailBody +="<table>"
  charts.forEach(function(chart, i){

    chartBlobs[i] = chart.getAs("image/png");
    if (i%3==0)
    {
      emailBody += "<tr><td>";
      emailBody += "<img src='cid:chart"+i+"'>"; // Alligning the chart to the center of the body in the email
      emailBody += "</td>";
    }
    else if (i%3==1)
    {
      emailBody += "<td>";
      emailBody += "<img src='cid:chart"+i+"'>"; // Alligning the chart to the center of the body in the email
      emailBody += "</td>";
    }
    else if (i%3==2)
    {
      emailBody += "<td>";
      emailBody += "<img src='cid:chart"+i+"'>"; // Alligning the chart to the center of the body in the email
      emailBody += "</td></tr>";
    }
    emailImages["chart"+i] = chartBlobs[i];
  });
  
  if (charts.length <= 3)
    emailBody +"</tr>";

  emailBody += "</table></html>";



  MailApp.sendEmail({
    to: "gianfranco.oldani@gmail.com",
    subject: "Chart for average marks per subject",
    htmlBody: emailBody,
    inlineImages:emailImages}); 
}
