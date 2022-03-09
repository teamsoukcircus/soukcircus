
  
const db_Name= "dbqhs8dkezfrhw"
const db_User="u0xl9k8wbpzrd"
const db_Password = "sffvam4uqvvg"
const port=3306;

const db_Url = "jdbc:mysql://oldani.me:"+port+"/"+db_Name;

function db_Connect()
{
  return Jdbc.getConnection(db_Url,db_User,db_Password);
}

function selectExample()
{

  let conn = db_Connect();
  try
  {

    let stmt = conn.createStatement();
    var results = stmt.executeQuery('select * from testAppScript');
    var numCols = results.getMetaData().getColumnCount();

    while (results.next()) 
    {
      var rowString = '';
      for (var col = 0; col < numCols; col++) 
      {
        rowString += results.getString(col + 1) + '\t';
      }
    
      Logger.log(rowString);
    }

    results.close();
    stmt.close();
  }
  catch(err)
  {

  }
  finally
  {
    conn.close();
  }

}


/**
 * 
 * 
 */
function appendRecord(record) 
{
 var sheet = SpreadsheetApp.getActiveSheet();
 var data = sheet.getDataRange().getValues();

 var stmt = conn.prepareStatement('INSERT INTO products ' +  '(productName, productCode) values (?, ?)');

 for (var i = 0; i < data.length; i++) {
  stmt.setString('Product name: ' + data[i][0]);
  stmt.setString('Product number: ' + data[i][1]);
  stmt.addBatch();
 }
}


/**
 * 
 * 
 */

function db_insertRecords(insertRequest, records) 
{ 
  let conn = db_Connect();
  try
  {
    for (var i = 0; i < records.length; i++) 
    {
      let stmt = conn.createStatement();

      let anInsert = insertRequest + "(";
      for (let j=0;j<records[i].length;j++)
      {
        if ( j<records[i].length-1)
          anInsert += records[i][j] + ", ";
        else
          anInsert += records[i][j];
      }

      anInsert += ")";

      //Logger.log(anInsert);
      try
      {
          if (stmt.executeUpdate(anInsert) <= 0)
              errors_logErrorAndEmail("insertion failed : "+anInsert);
      }
      catch (e) 
      {
        errors_logErrorAndEmail("SQL exception: " + e.getMessage());
      }
      stmt.close();
    }
  }
  catch(err)
  {

  }
  finally
  {
    if (conn != null)
      conn.close();
  }

}


