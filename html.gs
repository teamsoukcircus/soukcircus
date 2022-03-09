
const ALERT ={
ONE : "<html><style>html, body, div, span, applet, object, iframe,h1, h2, h3, h4, h5, h6, p, blockquote, pre,a, abbr, acronym, address, big, cite, code,del, dfn, em, img, ins, kbd, q, s, samp,small, strike, strong, sub, sup, tt, var,b, u, i, center,dl, dt, dd, ol, ul, li,fieldset, form, label, legend,table, caption, tbody, tfoot, thead, tr, th, td,article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary,time, mark, audio, video {  margin: 0;  padding: 0;  border: 0;  font-size: 100%;  font: inherit;  vertical-align: baseline;}/* HTML5 display-role reset for older browsers */article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section, main {  display: block;}body {  line-height: 1;}ol, ul {  list-style: none;}blockquote, q {  quotes: none;}blockquote:before, blockquote:after,q:before, q:after {  content: '';  content: none;}table {  border-collapse: collapse;  border-spacing: 0;}html * {  -webkit-font-smoothing: antialiased;  -moz-osx-font-smoothing: grayscale;}*, *:after, *:before {  -webkit-box-sizing: border-box;  -moz-box-sizing: border-box;  box-sizing: border-box;}body {  font-size: 100%;  font-family: 'Lato', sans-serif;  color: #8f9cb5;  background-color: #ffd88f;}a {  color: #35a785;  text-decoration: none;}.img-replace {  /* replace text with an image */  display: inline-block;  overflow: hidden;  text-indent: 100%;  color: transparent;  white-space: nowrap;}.cd-nugget-info {  text-align: center;  position: absolute;  width: 100%;  height: 50px;  line-height: 50px;  bottom: 0;  left: 0;}.cd-nugget-info a {  position: relative;  font-size: 14px;  color: #5e6e8d;  -webkit-transition: all 0.2s;  -moz-transition: all 0.2s;  transition: all 0.2s;}.no-touch .cd-nugget-info a:hover {  opacity: .8;}.cd-nugget-info span {  vertical-align: middle;  display: inline-block;}.cd-nugget-info span svg {  display: block;}.cd-nugget-info .cd-nugget-info-arrow {  fill: #5e6e8d;}header {  height: 200px;  line-height: 200px;  text-align: center;  background-color: #5e6e8d;  color: #FFF;}header h1 {  font-size: 20px;  font-size: 1.25rem;}.cd-popup-trigger {  display: block;  width: 170px;  height: 50px;  line-height: 50px;  margin: 3em auto;  text-align: center;  color: #FFF;  font-size: 14px;  font-size: 0.875rem;  font-weight: bold;  text-transform: uppercase;  border-radius: 50em;  background: #35a785;  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.07);}@media only screen and (min-width: 1170px) {  .cd-popup-trigger {    margin: 6em auto;  }}.cd-popup {  position: fixed;  left: 0;  top: 0;  height: 100%;  width: 100%;  background-color: rgba(94, 110, 141, 0.9);  opacity: 0;  visibility: hidden;  -webkit-transition: opacity 0.3s 0s, visibility 0s 0.3s;  -moz-transition: opacity 0.3s 0s, visibility 0s 0.3s;  transition: opacity 0.3s 0s, visibility 0s 0.3s;}.cd-popup.is-visible {  opacity: 1;  visibility: visible;  -webkit-transition: opacity 0.3s 0s, visibility 0s 0s;  -moz-transition: opacity 0.3s 0s, visibility 0s 0s;  transition: opacity 0.3s 0s, visibility 0s 0s;}.cd-popup-container {  position: relative;  width: 90%;  max-width: 400px;  margin: 4em auto;  background: #FFF;  border-radius: .25em .25em .4em .4em;  text-align: center;  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);  -webkit-transform: translateY(-40px);  -moz-transform: translateY(-40px);  -ms-transform: translateY(-40px);  -o-transform: translateY(-40px);  transform: translateY(-40px);  /* Force Hardware Acceleration in WebKit */  -webkit-backface-visibility: hidden;  -webkit-transition-property: -webkit-transform;  -moz-transition-property: -moz-transform;  transition-property: transform;  -webkit-transition-duration: 0.3s;  -moz-transition-duration: 0.3s;  transition-duration: 0.3s;}.cd-popup-container p {  padding: 3em 1em;}.cd-popup-container .cd-buttons:after {  content: '';  display: table;  clear: both;}.cd-popup-container .cd-buttons li {  float: left;  width: 50%;  list-style: none;}.cd-popup-container .cd-buttons a {  display: block;  height: 60px;  line-height: 60px;  text-transform: uppercase;  color: #FFF;  -webkit-transition: background-color 0.2s;  -moz-transition: background-color 0.2s;  transition: background-color 0.2s;}.cd-popup-container .cd-buttons li:first-child a {  background: #fc7169;  border-radius: 0 0 0 .25em;}.no-touch .cd-popup-container .cd-buttons li:first-child a:hover {  background-color: #fc8982;}.cd-popup-container .cd-buttons li:last-child a {  background: #b6bece;  border-radius: 0 0 .25em 0;}.no-touch .cd-popup-container .cd-buttons li:last-child a:hover {  background-color: #c5ccd8;}.cd-popup-container .cd-popup-close {  position: absolute;  top: 8px;  right: 8px;  width: 30px;  height: 30px;}.cd-popup-container .cd-popup-close::before, .cd-popup-container .cd-popup-close::after {  content: '';  position: absolute;  top: 12px;  width: 14px;  height: 3px;  background-color: #8f9cb5;}.cd-popup-container .cd-popup-close::before {  -webkit-transform: rotate(45deg);  -moz-transform: rotate(45deg);  -ms-transform: rotate(45deg);  -o-transform: rotate(45deg);  transform: rotate(45deg);  left: 8px;}.cd-popup-container .cd-popup-close::after {  -webkit-transform: rotate(-45deg);  -moz-transform: rotate(-45deg);  -ms-transform: rotate(-45deg);  -o-transform: rotate(-45deg);  transform: rotate(-45deg);  right: 8px;}.is-visible .cd-popup-container {  -webkit-transform: translateY(0);  -moz-transform: translateY(0);  -ms-transform: translateY(0);  -o-transform: translateY(0);  transform: translateY(0);}@media only screen and (min-width: 1170px) {  .cd-popup-container {    margin: 8em auto;  }}  </style><body>'<div class='cd-popup is-visible' role='alert'><div class='cd-popup-container'><p>",
TITLE : "Processing en cours",
MSG : "",
TWO : "</p><ul class='cd-buttons'><li><a href='#0'>&nbsp;</a></li><li><a href='#'>&nbsp;</a></li></ul><a href='#0' class='cd-popup-close img-replace'>Close</a></div></div></body></html>",
SCRIPT : "<script></script>",
END : "</html>"
};

function getAlert(title, message,script)
{
  let alert = "";

  alert += ALERT.ONE += title += message += ALERT.TWO += script += ALERT.END;
  
  return alert;
}





function emailFullAdminTablexx()
{

  html = startHtml();
  html = startBody(html);
  html = addHtml(html,doObjectifsTable());
  html = addHtml(html,doFraisTable());
  html = endBody(html);
  html = endHtml(html);
 
  sendTable(html);
}

function emailFraisTable()
{

  html = startHtml();
  html = startBody(html);
  html = addHtml(html,doFraisTable());
  html = endBody(html);
  html = endHtml(html);

  sendTable(html);
}

function emailObjectifsTable()
{

  html = startHtml();
  html = startBody(html);
  html = addHtml(html,doObjectifsTable());
  html = endBody(html);
  html = endHtml(html);

  sendTable(html);
}


function doObjectifsTable()
{
  return doTable(ADMIN_SHEET,"adminObjectifsDataRange",0);
}


function doFraisTable()
{
  return doTable(ADMIN_SHEET,"adminFraisDataRange",0);
}
