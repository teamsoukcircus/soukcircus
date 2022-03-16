
const AMANA_PRICES =
{
  "GB": 
  {
    "1":224,	"2":277,	"3":326,	"4":375,	"5":423,	"6":472,	"7":521,	"8":569,	"9":618,	"10":667,	
    "11":716,	"12":764,	"13":813,	"14":862,	"15":911,	"16":960,	"17":1009,	"18":1058,	"19":1155,	"20":1212
  },
  "DE": {
    "1":224,	"2":262,	"3":295,	"4":328,	"5":360,	"6":392,	"7":424,	"8":456,	"9":488,	"10":520,	
    "11":552,	"12":584,	"13":615,	"14":647,	"15":679,	"16":711,	"17":742,	"18":774,	"19":806,	"20":837
  },
  "FR": {
    "1":185,	"2":215,	"3":242,	"4":268,	"5":294,	"6":320,	"7":346,	"8":372,	"9":398,	"10":423,	
    "11":449,	"12":475,	"13":500,	"14":526,	"15":552,	"16":577,	"17":603,	"18":629,	"19":654,	"20":680
  },	
  "CA": {
    "1":214,	"2":297,	"3":377,	"4":458,	"5":540,	"6":622,	"7":704,	"8":786,	"9":869,	"10":952,	
    "11":1035,	"12":1118,	"13":1202,	"14":1285,	"15":1368,	"16":1452,	"17":1535,	"18":1619,	"19":1702,	"20":1786
  },	
  "US": {
    "1":202,	"2":290,	"3":376,	"4":463,	"5":550,	"6":638,	"7":726,	"8":815,	"9":904,	"10":993,	
    "11":1082,	"12":1171,	"13":1261,	"14":1350,	"15":1440,	"16":1530,	"17":1619,	"18":1709,	"19":1799,	"20":1889
  },	
  "ES": {
    "1":170,	"2":192,	"3":211,	"4":229,	"5":246,	"6":264,	"7":281,	"8":298,	"9":315,	"10":333,	
    "11":350,	"12":367,	"13":384,	"14":401,	"15":418,	"16":434,	"17":451,	"18":468,	"19":485,	"20":502
  },	
  "CH": {
    "1":175,	"2":559,	"3":234,	"4":262,	"5":289,	"6":316,	"7":343,	"8":370,	"9":367,	"10":424,	
    "11":451,	"12":478,	"13":505,	"14":532,	"15":559,	"16":586,	"17":613,	"18":640,	"19":667,	"20":694,
  },	
  "IT": {
    "1":164,	"2":195,	"3":224,	"4":252,	"5":280,	"6":308,	"7":336,	"8":364,	"9":392,	"10":420,	
    "11":447,	"12":475,	"13":503,	"14":531,	"15":559,	"16":587,	"17":615,	"18":643,	"19":671,	"20":698
  },	
  "BE": {
    "1":254,	"2":290,	"3":321,	"4":353,	"5":384,	"6":416,	"7":448,	"8":481,	"9":514,	"10":547,	
    "11":580,	"12":613,	"13":646,	"14":679,	"15":712,	"16":744,	"17":777,	"18":810,	"19":843,	"20":875
  },	
  "AU": {
    "1":254,	"2":290,	"3":321,	"4":353,	"5":384,	"6":416,	"7":448,	"8":481,	"9":514,	"10":547,	
    "11":580,	"12":613,	"13":646,	"14":679,	"15":712,	"16":744,	"17":777,	"18":810,	"19":843,	"20":875
  },

  "NL":{
    "1":175,	"2":210,	"3":242,	"4":274,	"5":305,	"6":336,	"7":368,	"8":399,	"9":430,	"10":461,	
    "11":493,	"12":524,	"13":555,	"14":587,	"15":618,	"16":649,	"17":680,	"18":712,	"19":743,	"20":774
  },
  "??":{
    "1":-1,	"2":-1,	"3":-1,	"4":-1,	"5":-1,	"6":-1,	"7":-1,	"8":-1,	"9":-1,	"10":-1,	
    "11":-1,	"12":-1,	"13":-1,	"14":-1,	"15":-1,	"16":-1,	"17":-1,	"18":-1,	"19":-1,	"20":-1
  }
}

function test_amana_getTarif(codePays,poidsKg) 
{

    Logger.log(amana_getTarif("nl",4.5)) ;
    Logger.log(amana_getTarif("NL",4.5)) 
}

function amana_getTarif(codePays,poidsKg) 
{
  let ceil = Math.min(Math.ceil(poidsKg),20);
  let cp = codePays.toUpperCase();

  if ( AMANA_PRICES[cp] != null )
  {
    let ret = AMANA_PRICES[cp][ceil];
    if ( ret != null )
      return ret;
  }

  return -1;
}

function amana_getAllTarif()
{
  return AMANA_PRICES;
}


/**
 * 
 * allOrders est un tableau et chaque entrée à la structure
 * postCBId, Weight(kg), EmailClient, Price, totalPriceId
 * 
 * 
 */
const AMANA_POSTID = 0;
const AMANA_WEIGHT=1;
const AMANA_EMAIL=2;
const AMANA_PRIX=3;
const AMANA_ORDERINDEX=4;
const AMANA_SHIPPINGFACTURE=5;

function test_amana_computePrices()
{

  allOrders=[["CB8888MA","hanke@footprinter.de",0,"xx",200]];

  amana_computePrices(allOrders);
}

function amana_computePrices(allOrders)
{
  ret={};
  try
  { 
    let access = tbl_tableAccess(TABLES_DEFINITIONS.CUSTOMER,TABLE_ACCESS_TYPE.REPEATED);
    let notFound=[]
    let totalFacture = 0;
    let totalPrice=0;
    for (let i=0;i< allOrders.length;i++)
    {
      let countryCode = cust_getCountryCode(access,allOrders[i][AMANA_EMAIL]);
      let weight = utils_parseFloat(allOrders[i][AMANA_WEIGHT]);
      let tarif = amana_getTarif(countryCode,weight);

      if ( tarif >= 0 )
      {
        totalPrice      += tarif;
        totalFacture    += allOrders[i][AMANA_SHIPPINGFACTURE];
        allOrders[i][AMANA_PRIX] = tarif;
      }
      else
        notFound.push(allOrders[i][AMANA_EMAIL]);
    }

    ret["err"]          = "ok";
    ret["totalMAD"]     = totalPrice.toFixed(2);
    ret["totalEUR"]     = utils_parseFloat(totalPrice * ccy_getRateToEUR("MAD")).toFixed(2);
    ret["totalFacture"] = totalFacture.toFixed(2);
    ret["notFound"] = notFound;
    ret["data"]  = allOrders;

    return JSON.stringify(ret);
  }
  catch(err)
  {
      ret["err"] = "nok";
      ret["msg"] = err.message;
      return JSON.stringify(ret);
  }
}





