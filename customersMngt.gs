


/**
 * 
 * Rebuild  table from new incoming orders
 */
function cust_rebuildCustomerTable(newIncomingOrders)
{
  cust_initCustTable(true,true,newIncomingOrders);

  db_reinitTableOfLastCustomerOrder();
}

/**
 * 
 * Rebuild  all
 */
function cust_reinitializeCustomerTable()
{
    cust_rebuildCustomerTable(null);
}


/**
 * 
 * 
 */
function cust_initCustTable(annualTable, retroTable,newIncomingOrders) 
{
  let allCustomers=[];
  let names=[];
  let countryAccess = tbl_tableAccess(TABLES_DEFINITIONS.COUNTRY,TABLE_ACCESS_TYPE.REPEATED);

  let customerAccess = tbl_tableAccess(TABLES_DEFINITIONS.CUSTOMER,TABLE_ACCESS_TYPE.SINGLE);

  let custSheet = customerAccess.getSheet()

  if ( newIncomingOrders == null )
  {
    custSheet.clear();
    custSheet.appendRow(TABLES_DEFINITIONS.CUSTOMER.Header);
    custSheet.getRange(1,1,1,TABLES_DEFINITIONS.CUSTOMER.NCols).setBackground("lightgreen");
  }

  for (i=0;i<2;i++)
  {
    let data=null;

    if (i==0)
    {
      if ( retroTable )
      {
        if ( newIncomingOrders == null ) //Get all
        {
          let sheet = utils_getSheet(RETRODATA_SHEET);
          let lastRow = sheet.getLastRow()

          if (lastRow > 1)
            data = utils_getSheet(RETRODATA_SHEET).getRange(2,1,lastRow-1,HEADER_ORDERS.length).getValues();
        }
        else
          data = newIncomingOrders;
      }
    }
    else
    {
      if ( annualTable )
      {
        if ( newIncomingOrders == null ) //Get all
        {
          let sheet = utils_getSheet(DATA_SHEET);
          let lastRow = sheet.getLastRow()

          if (lastRow > 1)
            data = utils_getSheet(DATA_SHEET).getRange(2,1,lastRow-1,HEADER_ORDERS.length).getValues(); 
        }
        else
          data = newIncomingOrders;
      }
    }

    if ( data!=null )
    {
      for(let i=0;i<data.length;i++) 
      {
        let aRow = data[i];
        let name = aRow[CUSTNAME_INDATA_SHEET-1];
        
        if (names.indexOf(name)==-1)
        {
            names.push(name);

            let buyerId = aRow[BUYER_ID_INDATA_SHEET-1];
            let email   = aRow[EMAIL_INDATA_SHEET-1];
            let phone = "";
            let address = aRow[FORMATTEDADDRESS_INDATA_SHEET-1]
            let countryCode = aRow[COUNTRY_INDATA_SHEET-1];

            let language =  ctry_getLanguage(countryAccess,countryCode);
            if (language == null)
              language="en"; //English by default
            
            let countryName = ctry_getName(countryAccess,countryCode);																	

            let newRecord = [buyerId,name,email, "", language, "",  "", countryCode,countryName,address];

            if (newRecord.length == TABLES_DEFINITIONS.CUSTOMER.NCols)
              allCustomers.push(newRecord);
            else
              throw new Error("cust_initCustTable: length of record to push and number of columns mismatch");																
        }
      }   
    }
  }

  if ( newIncomingOrders == null )
  {
    if ( allCustomers.length > 0 )
      custSheet.getRange(2,1,allCustomers.length,TABLES_DEFINITIONS.CUSTOMER.NCols).setValues(allCustomers);
  }
  else 
  {
    for(let i = 0;i<allCustomers.length ;i++ )
      custSheet.appendRow(allCustomers[i]);  
  }
}


/**
 * 
 * Be sure that RETRODATA_SHEET is uptodate
 * 
 */
function db_reinitTableOfLastCustomerOrder()
{
  let ordersSheet = utils_getSheet(RETRODATA_SHEET);
  let ordersRange=[];
  let allOrderValues=[];
  if ( ordersSheet.getLastRow() > 1 )
  {
    ordersRange = ordersSheet.getRange(2,BUYERID_INRETRO_DATASHEET,ordersSheet.getLastRow()-1,1);
    allOrderValues = ordersSheet.getRange(2,1,ordersSheet.getLastRow()-1,HEADER_ORDERS.length).getValues();
  }

  let access = tbl_tableAccess(TABLES_DEFINITIONS.CUSTOMER,TABLE_ACCESS_TYPE.SINGLE);
  let custSheet = access.getSheet();
  let customers = custSheet.getRange(2,CUSTOMER_BUYER_ID,custSheet.getLastRow()-1,1).getValues();
  let customerData=[];

  for(let i=0;i< customers.length;i++)
  {
      let buyerId = customers[i][CUSTOMER_BUYER_ID-1];
      let textFinder = ordersRange.createTextFinder(buyerId);
      let occurrences = textFinder.findAll()
      
      if ( occurrences.length > 0)
      {
          let grossSum=0;
          let lastDate ;
          for(let j=0;j<occurrences.length;j++)
          {
            let rowNum = occurrences[j].getRow()-2;
            let grossAmount = allOrderValues[rowNum][AMOUNT_INDATA_SHEET-1];
            lastDate = allOrderValues[rowNum][DATE_INDATA_SHEET-1];
            grossSum += grossAmount;
          }

           customerData.push([lastDate,utils_parseInt(grossSum+0.5)]);
      }
      else
        customerData.push(["",0]);  
  }

  

  custSheet.getRange(2,CUSTOMER_LASTORDERDATE,customerData.length,2).setValues(customerData);
}



/**
 *  VALUE_ID: Voir ci-dessus les définitons des colonnes CUSTORMER_XXXXX
 * 
 */

function cust_getBuyerId(access,customerEmail)
{
  return access.getField(access.getRow(customerEmail),TABLES_DEFINITIONS.CUSTOMER.Fields.CUSTOMER_BUYER_ID);
}

function cust_getEmail(access,customerEmail)
{
   return access.getField(access.getRow(customerEmail),TABLES_DEFINITIONS.CUSTOMER.Fields.CUSTOMER_EMAIL);
}

function cust_getPhone(access,customerEmail)
{
  return access.getField(access.getRow(customerEmail),TABLES_DEFINITIONS.CUSTOMER.Fields.CUSTOMER_PHONE);
}

function cust_getCountryCode(access,customerEmail)
{
  return access.getField(access.getRow(customerEmail),TABLES_DEFINITIONS.CUSTOMER.Fields.CUSTOMER_COUNTRYCODE);
}

function cust_getCountryName(access,customerEmail)
{
  return access.getField(access.getRow(customerEmail),TABLES_DEFINITIONS.CUSTOMER.Fields.CUSTOMER_COUNTRYNAME);
}

function cust_getLanguage(access,customerEmail)
{
    let language = access.getField(access.getRow(customerEmail),TABLES_DEFINITIONS.CUSTOMER.Fields.CUSTOMER_LANGUAGE);

    if (language !=null)
      return language;
    else
      return "en";
}


function cust_getCountryLanguage(access,customerEmail)
{
  return access.getField(access.getRow(customerEmail),TABLES_DEFINITIONS.CUSTOMER.Fields.CUSTOMER_LANGUAGE);
}

function cust_getLastOrderDate(access,customerEmail)
{
  return access.getField(access.getRow(customerEmail),TABLES_DEFINITIONS.CUSTOMER.Fields.CUSTOMER_LASTORDERDATE);
}

function cust_getLastOrderValue(access,customerEmail)
{
  return access.getField(access.getRow(customerEmail),TABLES_DEFINITIONS.CUSTOMER.Fields.CUSTOMER_TOTALAMOUNT);
}

function cust_getAddress(access,customerEmail)
{
  return access.getField(access.getRow(customerEmail),TABLES_DEFINITIONS.CUSTOMER.Fields.CUSTOMER_ADDRESS);
}



//====================================== TEST FUNCTIONS ===========================================
