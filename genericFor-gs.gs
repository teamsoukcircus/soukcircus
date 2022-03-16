

function generic_createRow(rowData) 
{
  let retVal={};
  try
  {
    let access      = tbl_tableAccess(TABLES_DEFINITIONS.SoukGeneric_Table1,TABLE_ACCESS_TYPE.SINGLE);
    let newRow = [];
    newRow.push(utils_uniqueID());
    newRow = newRow.concat(rowData);
    access.appendRow(newRow);
    
    retVal["err"]="ok";
  }
  catch(err)
  {
    retVal["err"]="nok"
    retVal["msg"]=err.message;
  }
  return retVal;
}


function generic_updateRow(rowData) 
{
  let retVal={};
  try
  {
    log_RessourceTaskForm(JSON.stringify(rowData));
    let access      = tbl_tableAccess(TABLES_DEFINITIONS.SoukGeneric_Table1,TABLE_ACCESS_TYPE.SINGLE);
    access.updateRow(rowData);
    retVal["err"]="ok";
  }
  catch(err)
  {
    retVal["err"]="nok"
    retVal["msg"]=err.message;
  }
  return retVal;
}


function generic_deleteRow(rowId) 
{
  let retVal={};
  try
  {
    let access      = tbl_tableAccess(TABLES_DEFINITIONS.SoukGeneric_Table1,TABLE_ACCESS_TYPE.SINGLE);
    access.deleteRow(rowId);
    retVal["err"]="ok";
  }
  catch(err)
  {
    retVal["err"]="nok"
    retVal["msg"]=err.message;
  }
  return retVal;
}


function test_read()
{
  Logger.log(generic_readRow(1647194457012));
}

function generic_readRow(rowId) 
{
  let retVal={};
  try
  {
    let access      = tbl_tableAccess(TABLES_DEFINITIONS.SoukGeneric_Table1,TABLE_ACCESS_TYPE.SINGLE);
    let data = access.getRow(rowId);
    retVal["err"]="ok";
    retVal["data"] = data["data"];
  }
  catch(err)
  {
    retVal["err"]="nok";
    retVal["msg"]=err.message;
  }

  return retVal;
}


function generic_readRecords()
{
  let access      = tbl_tableAccess(TABLES_DEFINITIONS.SoukGeneric_Table1,TABLE_ACCESS_TYPE.REPEATED);
  let retVal={};
  
  let row = access.getFirstRow();
  if (row != null)
  {
      let allRecords=[];
      do
      {
        let linkView = "<a href='" + utils_getUrl() + 
        "?&actionId=actionGeneric&genericId=" + access.getRowId(row) + "' target='_top'><i class='fa fa-pencil' aria-hidden='true'></i></a>";

        let aRecord = [];
        aRecord = aRecord.concat(row["data"]);
        aRecord.push(linkView);
        allRecords.push(aRecord);

        row = access.getNextRow(row["row"]);
      }
      while(row!=null)

      retVal["err"]="ok";
      retVal["data"] = allRecords;
      retVal["header"] = access.getHeader();
  }
  else
  {
    retVal["err"]="ok";
    retVal["data"]=[];
  }

  return retVal;
}

function genericTest()
{
  Logger.log(generic_readRecords());
}

