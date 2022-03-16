

const TABLE_ACCESS_TYPE=
{
  SINGLE:0,
  REPEATED: 1
}
/**
 * The appObject
 * @param {Object} par The main parameter object.
 * @return {Object} The appObject Object.
 */
function TableAccessDef(par) 
{
  "use strict";
  var objectName = "appObjeTableAccessDefct";
  var tableDef = par.tableDef;
  var accessType = par.accessType
  var dataSheet = SpreadsheetApp.openById(tableDef.SpreadSheet).getSheetByName(tableDef.Table);
  var dataTable = accessType==TABLE_ACCESS_TYPE.REPEATED? dataSheet.getRange(1,1,dataSheet.getLastRow(),tableDef.NCols).getValues(): null;
  let lastRow   = SpreadsheetApp.openById(tableDef.SpreadSheet).getSheetByName(tableDef.Table).getLastRow();
  /**
     * run some code
     */
  function getData() 
  {
    return dataSheet.getRange(2,1,dataSheet.getLastRow()-1,tableDef.NCols).getValues();
  }

  function getSheet()
  {
    return dataSheet;
  }

  function getHeader()
  {
    return tableDef.Header;
  }

   function getDisplay()
  {
    return tableDef.Display;
  } 

  function getRowId(row)
  {
    return getField(row, tableDef.keyColumn);
  }

  /**
   * return object {row: rowNumber, data : rowdata}
   */
  function getRow(key) 
  {
    if (lastRow > 1 )
    {
      let range = dataSheet.getRange(2,tableDef.keyColumn,lastRow-1,1);
      let textFinder = range.createTextFinder(key);
      let next = textFinder.findNext();

      if (next != null)
        return {"row": next.getRow(),
              "data": dataSheet.getRange(next.getRow(),1,1,tableDef.NCols).getValues()[0]};
      else
          throw new Error("Row not found for key : " + key + " in table " + tableDef.Table); 
    }
    else
    {
      return {"row": 0,"data": []}
    }  
  }

  function getFirstRow()
  {
    return getNextRow(1);
  }

  function getNextRow(ofThisRow)
  {
    if (ofThisRow < lastRow )
    {
      return {"row": ofThisRow+1,
              "data": dataSheet.getRange(ofThisRow+1,1,1,tableDef.NCols).getValues()[0]}; 
    }
    return null;  
  }

  function getRowByNum(num) 
  {
    
    if (dataTable == null)
      dataTable = dataSheet.getValues();

    return dataTable[num]
  }

  function getField(row, field)
  {
      return row.data[field-1];
  }

  function getNLines()
  {
      return dataTable.length;
  }

  function appendRow(row)
  {
      dataSheet.appendRow(row);
      lastRow   = SpreadsheetApp.openById(tableDef.SpreadSheet).getSheetByName(tableDef.Table).getLastRow();
  }

  function updateRow(rowData)
  {
      let row = getRow(rowData[0]) ;
      log_RessourceTaskForm(JSON.stringify(row))
      log_RessourceTaskForm(JSON.stringify(rowData));
      dataSheet.getRange(row["row"],1,1,rowData.length).setValues([rowData]);
  }

  function updateField(key,field,value)
  {
      let row = getRow(key) ;
      dataSheet.getRange(row["row"],field,1,1).setValue(value);
  }

  function deleteRow(key)
  {
    let row = getRow(key) ;
    dataSheet.deleteRow(row["row"]);
  }

  function getColumn(field)
  {
      return dataSheet.getRange(2,field,lastRow-1,1).getValues();
  }



  return Object.freeze({
    objectName: objectName,
    getSheet: getSheet,
    getHeader:getHeader,
    getDisplay: getDisplay,
    getData: getData,
    getRow: getRow,
    getColumn:getColumn,
    getRowByNum: getRowByNum,
    getFirstRow: getFirstRow,
    getNextRow: getNextRow,
    getField: getField,
    getNLines:getNLines,
    appendRow: appendRow,
    updateRow: updateRow,
    updateField: updateField,
    deleteRow: deleteRow,
    getRowId:getRowId
  });
};


function tbl_validateAccess(accessDef)
{
  if ( accessDef == null || accessDef.ROW == null || accessDef.KEY)
    throw new Error("Invalid access definition provided A AccessDef object must be passed...see tableAccess");
}

function tbl_startFullAccess(TableID,TableName)
{
}


function tbl_tableAccess(Table, repeated)
{
    return new TableAccessDef({tableDef:Table, accessType: repeated});
}

function example_access()
{
    let access      = tbl_tableAccess(TABLES_DEFINITIONS.CUSTOMER,TABLE_ACCESS_TYPE.SINGLE);
    //Logger.log(access.getData()); 

    let row = access.getRow("decker.rose@gmail.com")
    Logger.log(row); 

    Logger.log(access.getField(row,TABLES_DEFINITIONS.CUSTOMER.Fields.CUSTOMER_EMAIL));
    Logger.log(cust_getCountryCode(access,"decker.rose@gmail.com"));
}


