function getTableBaseCss() {
  
return '<html><head><style type="text/css">#soukTable {  font-family: Arial, Helvetica, sans-serif;  border-collapse: collapse;  width: 100%;}#soukTable td, #soukTable th {  border: 1px solid #ddd;  padding: 8px;} #soukTable tr:nth-child(even){background-color: #f2f2f2;} #soukTable tr:hover {background-color: #ddd;}#soukTable th {  padding-top: 12px;  padding-bottom: 12px;  text-align: left;  background-color: #04AA6D;  color: white;}</style></head> <body>';
}

/**
 * @param{border} n pixels , 0 <=> no border
 * @param{headerColor} #xxxxxx. color format for the table header <th>
 * @param{yourId} id for your table css styles
 * @return{html}. start of html file till <body>
 */
function getTableBaseCssDetailed(border, headerColor,yourId) {
  

let style =  '<html><head><style type="text/css">'+
             '#soukTable'+yourId+'{  font-family: Arial, Helvetica, sans-serif;  border-collapse: collapse;  width: 100%;}'+
             '#soukTable'+yourId+'td, #soukTable th {  border: '+ border + 'px solid #ddd;  padding: 8px;}'+
             '#soukTable'+yourId+ 'tr:nth-child(even){background-color:#f2f2f2;}'+
             '#soukTable'+yourId+ 'tr:hover {background-color: #ddd;}'+
             '#soukTable'+yourId+ 'th {  padding-top: 12px;  padding-bottom: 12px;  text-align: left;  background-color: '+ headerColor +';  color: white;}'+
             '</style></head><body>';
}


function getTableCssType3()
{
  let css= "#table-container {max-width: 800px;padding: 5px; margin: 0 auto;}"+
            "#main-table {width: 100%;color: white;}"+
            "#main-table th {background: #27afd8;padding: 7px;}"+
            "#main-table td {background: #4a9eb8;text-align: center;padding: 7px;}"+
            "#table-container button {  float: right;border: none; padding: 5px 12px;margin: 10px 0;background: #27afd8;color: white;cursor: pointer;}";

  return css;
}


function startHtml()
{
  return "<html>"+getTableBaseCss();
}
function endHtml(s)
{
  return s+"</html>";
}

function startBody(s)
{
  return s+"<body>";
}
function endBody(s)
{
  return s+"</body>";
}

function startTable(s)
{
  return s+"<table id='soukBase'>";
}

function endTable(s)
{
  return s+"</table>";
}


function addTableRowInt(s,values)
{
    let html = "<tr>";

    //l'entete de ligne
    html += "<td>"+values[0]+ "</td>";

    for (j=1;j<values.length;j++)
    {
      let val =values[j];

      if (val == "" || isNaN(val))
          html += "<td></td>";
      else
          html += "<td>"+parseInt(values[j])+ "</td>";
    }
    html += "</tr>";

    return s+html;
}

function addTableRowFloat(s,values)
{
    let html = "<tr>";
    //l'entete de ligne
    html += "<td>"+values[0]+ "</td>";

    for (j=1;j<values.length;j++)
    {
      let val =values[j];

      if (val == "" || isNaN(val))
          html += "<td></td>";
      else
          html += "<td>"+parseFloat(values[j])+ "</td>";
    }
    html += "</tr>";

    return s+html;
}

function addTableRowText(s,values)
{
    let html = "<tr>";
    
    //l'entete de ligne
    html += "<td>"+values[0]+ "</td>";

    //les données
    for (j=1;j<values.length;j++)
    {
      let val =values[j];

      if (val == "" || isNaN(val))
          html += "<td></td>";
      else
          html += "<td>"+values[j]+ "</td>";
    }
    html += "</tr>";

    return s+html;
}

function addTableHead(s,values)
{
    let html = "<tr>";

    for (j=0;j<values.length;j++)
        html += "<th>"+values[j]+ "</th>";
    html += "</tr>";

    return s+html;
}

function addHtml(s,html)
{
  return s + html;
}

function doTableByRows(rows,typeVal)
{
  let table = startTable("");

  table = addTableHead(table,rows[0]);

  if (typeVal==0)
    for (i=1;i<rows.length;i++)
        table = addTableRowInt(table,rows[i]);
  else if (typeVal==1)
    for (i=1;i<rows.length;i++)
        table = addTableRowFloat(table,rows[i]);
  else //if (typeVal==2)
    for (i=1;i<rows.length;i++)
        table = addTableRowText(table,rows[i]);

  table = endTable(table);

  return table;
}

/**
 * typVal = 0 for Integer values, 1 for float values 2 for text values
 */
function doTable(sheetName,dataNamedRange,typeVal)
{
  return doTableByRows(utils_getSheet(sheetName).getRange(dataNamedRange).getDataRegion().getValues(),typeVal);
}

function addLink(html, text, url)
{
  return html + '<a href='+ '"' + url + '">' + text + "</a>";
}


function addText(html,text, htype)
{
  return html + '<h'+htype+'>' + text + '</h'+htype+">";
}


function addBreak(html)
{
  return html + '<br>';
}


