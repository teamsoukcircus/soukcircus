/*========================================= DEFINITIONS ====================================================*/
const COMMANDES_FOLDERID="18f02KVUqvM-RbJOv_z-_UO-lqzahivJT";
const COMMANDES_WORK_FOLDERID = "1RJ_ceET8BPaMEmvdHTj8PthFoUn3Zxw4";
const COMMANDES_FICHES_FOLDERID = "18IQRtRUuSZqv9cHXGmE8mDlg3PzHXicZ";
const COMMANDES_NEW_IMAGES_FOLDERID = "1RrdfxomDAUxPHpdbkEsw_EBAk7SYcY7U";
const COMMANDES_ACTUAL_IMAGES_FOLDERID = "1ukNASChE-Gw15jDtTQBE-fsOMuQCkwgw";
const FICHESFOURNISSEURS_FOLDERID = "1U_Gv9WxJSDt8RuDplvK9RENkNi9QJ07s";

const FicheFournisseur_Template = DriveApp.getFileById("1SaHGMM-9imYq6sPFrYsAzd7zAPxOg2fdYC2ueZp2pjY");
const CommandeDoc_Template = DriveApp.getFileById("1fu8tPlSI1dnyyy8ithOk2zMH09rMU4-GtqyV43YOYqw");
const COMMANDES_PREFIX = "soukCommande_";
const COLORED_CELL_ECHANTILLON = 4;

const COMMANDE_HEADER =
["Id",	"Date",	"Titre", 	"Description", "URL Etsy", 	"Fournisseur",	"CM_Length",	"CM_Width",	"CM_Height",	"CM_DiameterTop","CM_DiameterMiddle","CM_DiameterBottom", "Quality", "Quantity",	"Color",	"GDriveDocCommande","New Product","SKU", "GDrive ImageId", "Validated", "Validation date"];
													

const COMMANDE_SHEET = "Commandes";

const COMMANDE_ID = 1;
const COMMANDE_DATE = 2;
const COMMANDE_TITRE = 3;
const COMMANDE_DESC = 4;
const COMMANDE_URLETSY = 5;
const COMMANDE_FOURNISSEUR = 6;
const COMMANDE_CMLENGTH = 7;
const COMMANDE_CMWIDTH = 8;
const COMMANDE_CMHEIGHT = 9;
const COMMANDE_CMDIAMTOP = 10;
const COMMANDE_CMDIAMMIDDLE = 11;
const COMMANDE_CMDIAMBOTTOM = 12;
const COMMANDE_QUALITY = 13;
const COMMANDE_QUANTITY = 14;
const COMMANDE_COLOR = 15;
const COMMANDE_GDRIVECOMMANDE = 16;
const COMMANDE_NEWPRODUCT = 17;
const COMMANDE_SKU = 18;
const COMMANDE_IMAGEID = 19;
const COMMANDE_VALIDATED= 20;
const COMMANDE_VALIDATION_DATE= 21;
const COMMANDE_STOCKID= 22;
/*========================================= FONCTIONS ====================================================*/
function testSauve()
{
          ret={};   
        ret["stockId"]        = 11111
        ret["title"]          = "uziiziouzoiz"
        ret["etsyUrl"]        = "jhgjkhghjkgkj"
        ret["fourni"]         = "HHCC"
        ret["description"]    = "ghjhghjgjhgjhgjhghjgjh"
        ret["cm_length"]      = 22
        ret["cm_width"]       = 33
        ret["cm_height"]      = 44
        ret["cm_diamTop"]     = 100;
        ret["cm_diamMiddle"]  = 50;
        ret["cm_diamBottom"]  = 20;
        ret["quantity"]       = 5
        ret["color"]          = "#AAAAAA"
        ret["quality"]        = "jhgfjkhasgdfjkagsdfjkhagsfjkha"
        ret["langue"]         = "fr"
        ret["imageId"]        = "1E9zw4nDOb0PropvWzAdvtbs26az6ADgv";
        ret["newProduct"]     = 1;
        ret["sku"]            = "MOB013";
        ret["imageId"]        = 'zoqiwuerz3i47rz34oeirufghweijr';
        com_sauvegardeCommande(ret)
}

function  com_sauvegardeCommande(data)
{
  let ret={};
  try
  {
    let uid = utils_uniqueID();
    data["noCommande"]=uid;
    let ficheInfo = JSON.parse(com_createDocCommande(data));

    if ( ficheInfo["err"] == "ok")
    {
      let fournisseur = stock_findFournisseur(data["fourni"]);
      //let commandeUrl = "<a href='" + ficheInfo["docCommandeUrl"] + "' target='_blank'>Voir la commande</a>";

      let commandeRow = [uid ,new Date(),data["title"],data["description"], data["etsyUrl"],
                        fournisseur, data["cm_length"],data["cm_width"],data["cm_height"],
                        data["cm_diamTop"],data["cm_diamMiddle"],data["cm_diamBottom"],
                        data["quality"], data["quantity"],data["color"],ficheInfo["docCommandeUrl"],
                        data["newProduct"],data["sku"],data["imageId"],"","",data["stockId"]];

      
      let sheet = utils_getTable(STOCK_SPREADSHEET_ID,COMMANDE_SHEET);
      
      sheet.appendRow(commandeRow);

      ret["docCommandeUrl"] = ficheInfo["docCommandeUrl"]
      ret["msg"] = ficheInfo["msg"];
      ret["err"]="ok";
    }
  }
  catch(err)
  {
    ret["err"]="ok";
    ret["msg"] = err.message; 
  }

  return JSON.stringify(ret);
}


/**
 * 
 * 
 */

function test_getRecord()
{
  com_getRecord(1645615978250);
}

function com_getRecord(commandId)
{
    let commandesSheet = utils_getTable(STOCK_SPREADSHEET_ID,COMMANDE_SHEET);
    let ret={};
    ret["err"]="ok";

    if ( commandesSheet.getLastRow() > 1)
    {
      let commandes = commandesSheet.getRange(2,1,commandesSheet.getLastRow()-1,COMMANDE_HEADER.length).getValues();

      let retVal={};
      for(let i=0;i<commandes.length;i++)
      {
          if ( utils_parseInt(commandes[i][COMMANDE_ID-1]) == utils_parseInt(commandId))
          {
            retVal["cmdId"]       = commandes[i][COMMANDE_ID-1];
            retVal["date"]        = commandes[i][COMMANDE_DATE-1];
            retVal["quantity"]    = commandes[i][COMMANDE_QUANTITY-1];
            retVal["title"]       = commandes[i][COMMANDE_TITRE-1];
            retVal["urlFiche"]    = commandes[i][COMMANDE_GDRIVECOMMANDE-1];
            retVal["newProduct"]  = commandes[i][COMMANDE_NEWPRODUCT-1];
            retVal["desc"]        = commandes[i][COMMANDE_DESC-1];
            retVal["urlEtsy"]     = commandes[i][COMMANDE_URLETSY-1];
            retVal["height"]      = commandes[i][COMMANDE_CMHEIGHT-1];
            retVal["length"]      = commandes[i][COMMANDE_CMLENGTH-1];
            retVal["width"]       = commandes[i][COMMANDE_CMWIDTH-1];
            retVal["diamTop"]     = commandes[i][COMMANDE_CMDIAMTOP-1];
            retVal["diamMiddle"]  = commandes[i][COMMANDE_CMDIAMMIDDLE-1];
            retVal["diamBottom"]  = commandes[i][COMMANDE_CMDIAMBOTTOM-1];
            retVal["color"]       = commandes[i][COMMANDE_COLOR-1];
            retVal["sku"]         = commandes[i][COMMANDE_SKU-1];
            retVal["imageId"]     = commandes[i][COMMANDE_IMAGEID-1];
            retVal["fournisseur"] = commandes[i][COMMANDE_FOURNISSEUR-1];
            retVal["stockId"]     = commandes[i][COMMANDE_STOCKID-1];

            ret["data"]=retVal;
            return JSON.stringify(ret);
          }
      }
    }

    ret["err"]="ok";
    ret["msg"]= "Aucune commande trouvée..."

    return JSON.stringify(ret);
}


/**
 * 
 * 
 */

function testSetValide()
{
  com_setCommandValidated(1645627486022,true)
}

function com_setCommandValidated(commandId,trueFalse)
{
  let commandesSheet = utils_getTable(STOCK_SPREADSHEET_ID,COMMANDE_SHEET);
  let commandIds     = commandesSheet.getRange(2,1,commandesSheet.getLastRow()-1,1).getValues()[0];

  let index = commandIds.indexOf(commandId);
  log_RessourceTaskForm(commandId + ", index : "+ index);
  if (index >= 0)
  {
      let valDate = new Date();
      let validValues = trueFalse ? 1 : 0;
      commandesSheet.getRange(index+2,COMMANDE_VALIDATED,1,2).setValues([[validValues,valDate]]);
  }
}

/**
 * 
 * 
 */
function com_validerLaCommande(dataIn)
{
  let ret={};
  try
  {  
    /*=========================================*/
    let commandId     = dataIn["cmdId"];
    let commandeInfo  = JSON.parse(com_getRecord(commandId));
    
    
    if (commandeInfo != null)
    {
        let sku = data["sku"];
        if ( sku != null )
          commandeInfo["sku"] = sku;
  
        if ( dataIn["stockId"] != null )
          commandeInfo["data"]["stockId"] = dataIn["stockId"]; 

        commandeInfo["data"]["updateDate"]            = new Date();
        commandeInfo["data"]["unitBuyPriceMAD"]       = dataIn["unitBuyPriceMAD"];
        commandeInfo["data"]["unitWeightKg"]          = dataIn["unitWeightKg"];
        commandeInfo["data"]["quantityInStock"]       = dataIn["quantityInStock"];
        commandeInfo["data"]["minThresholdDays"]      = dataIn["minThresholdDays"];
        
        
        if ( dataIn["urlEtsy"] != null && dataIn["urlEtsy"] != "") //In that case ovewrite the url present in the command record.
          commandeInfo["data"]["urlEtsy"]   = dataIn["urlEtsy"];
        
        commandeInfo["data"]["prodMeanTimeDays"]      = commandeInfo["data"]["updateDate"] - commandeInfo["data"]["date"];

        stock_manageValidatedOrder(commandeInfo);

        //Pour finir on flag la commande comme validée
        com_setCommandValidated(utils_parseInt(commandId),true);

        ret["err"] = "ok";
    }
    else
    {
      ret["err"] = "nok";
      ret["msg"] = "Commande introuvable...";
    }
  }
  catch(err)
  {
    ret["err"] = "nok";
    ret["msg"] = err.message;
  }

  return JSON.stringify(ret);
}



/**
 * 
 * 
 */
function com_getAllSoukCommandes()
{
    let commandesSheet = utils_getTable(STOCK_SPREADSHEET_ID,COMMANDE_SHEET);
    let ret={};
    ret["err"]="ok";

    if ( commandesSheet.getLastRow() > 1)
    {
      let commandes = commandesSheet.getRange(2,1,commandesSheet.getLastRow()-1,COMMANDE_HEADER.length).getValues();

      let retVal=[];
      for(let i=0;i<commandes.length;i++)
      {
          let urlDeValidation = utils_getUrl() + "?actionId=validerCommande&cmdId=" + commandes[i][COMMANDE_ID-1];

          if (commandes[i][COMMANDE_VALIDATED-1] !=null && commandes[i][COMMANDE_VALIDATED-1]==1)
            urlDeValidation = "#";

          retVal.push([ commandes[i][COMMANDE_ID-1],
                        commandes[i][COMMANDE_DATE-1],
                        commandes[i][COMMANDE_NEWPRODUCT-1]==0? "Non":"Oui",
                        commandes[i][COMMANDE_SKU-1],
                        commandes[i][COMMANDE_QUANTITY-1], 
                        commandes[i][COMMANDE_TITRE-1],
                        commandes[i][COMMANDE_GDRIVECOMMANDE-1],
                        urlDeValidation ]);
      }
      ret["data"]=retVal;
    }
    else
    {
      ret["err"]="ok";
      ret["msg"]= "Aucune commande trouvée..."
    }

    return JSON.stringify(ret);

}


/**
 * 
 * 
 * 
 */
function com_createDocOrderForm(targetFolderId,fileName,commandeInfo)
{  
  let CommandesTargetFolder      = DriveApp.getFolderById(targetFolderId);
  let today                   = utils_LocalGMTTimeFormatThisDate(new Date(),ENUM_DATE_FORMAT.LONG);
  let stockId                 = commandeInfo["stockId"] ;
  let noCommande              = commandeInfo["noCommande"];
  let description             = commandeInfo["description"];
  let title                   = commandeInfo["title"];
  let imageUrl                = commandeInfo["imageUrl"];
  let cm_longueur             = commandeInfo["cm_length"] ;
  let cm_largeur              = commandeInfo["cm_width"];
  let cm_hauteur              = commandeInfo["cm_height"];
  let cm_diamTop              = commandeInfo["cm_diamTop"];
  let cm_diamMiddle           = commandeInfo["cm_diamMiddle"];
  let cm_diamBottom           = commandeInfo["cm_diamBottom"];
  let quantite                = commandeInfo["quantity"];
  let couleur                 = commandeInfo["color"];
  let language                = commandeInfo["langue"];
  let language2               = commandeInfo["langue2"];
  let fournisseur             = stock_findFournisseur(commandeInfo["fourni"]);
  let imageId                 = commandeInfo["imageId"];
  let sku                     = commandeInfo["sku"];

  //Creation du. fichier cible
  const newDocFile = CommandeDoc_Template.makeCopy(CommandesTargetFolder).setName(fileName);
  const  OpenDoc = DocumentApp.openById(newDocFile.getId());
  const body = OpenDoc.getBody();

  body.replaceText("{date}",today);
   
  if ( language2 == null )
    body.replaceText("{lab_Fournisseur}",txt_translateEnglishText("Provider",language));
  else
    body.replaceText("{lab_Fournisseur}",txt_translateEnglishText("Provider",language)+
                                        "\n"+txt_translateEnglishText("Provider",language2));

  if ( language2 == null )
      body.replaceText("{lab_Quantite}",txt_translateEnglishText("Quantity",language));
  else
    body.replaceText("{lab_Quantite}",txt_translateEnglishText("Quantity",language)+
                                      "\n"+txt_translateEnglishText("Quantity",language2));

  if ( language2 == null )
   body.replaceText("{lab_Largeur}",txt_translateEnglishText("Width",language) + " [cm]");
  else
    body.replaceText("{lab_Largeur}",txt_translateEnglishText("Width",language) + " [cm]" + 
                                   "\n" + txt_translateEnglishText("Width",language2) + " [cm]");

  if ( language2 == null )
   body.replaceText("{lab_Longueur}",txt_translateEnglishText("Length",language)+ " [cm]");
  else
    body.replaceText("{lab_Longueur}",txt_translateEnglishText("Length",language)+ " [cm]"+ 
                                     "\n" + txt_translateEnglishText("Length",language2)+ " [cm]");

  if ( language2 == null )
    body.replaceText("{lab_Hauteur}",txt_translateEnglishText("Height",language)+ " [cm]");
  else
    body.replaceText("{lab_Hauteur}",txt_translateEnglishText("Height",language)+ " [cm]"+ 
                                    "\n" + txt_translateEnglishText("Height",language2)+ " [cm]");

  if ( language2 == null )
    body.replaceText("{lab_diamTop}",txt_translateEnglishText("Top diameter",language)+ " [cm]");
  else
    body.replaceText("{lab_diamTop}",txt_translateEnglishText("Top diameter",language)+ " [cm]"+ 
                                    "\n" + txt_translateEnglishText("Top diameter",language2)+ " [cm]");

  if ( language2 == null )
    body.replaceText("{lab_diamMiddle}",txt_translateEnglishText("Middle diameter",language)+ " [cm]");
  else
    body.replaceText("{lab_diamMiddle}",txt_translateEnglishText("Middle diameter",language)+ " [cm]"+ 
                                    "\n" + txt_translateEnglishText("Middle diameter",language2)+ " [cm]");

   if ( language2 == null )
    body.replaceText("{lab_diamBottom}",txt_translateEnglishText("Bottom diameter",language)+ " [cm]");
  else
    body.replaceText("{lab_diamBottom}",txt_translateEnglishText("Bottom diameter",language)+ " [cm]"+ 
                                    "\n" + txt_translateEnglishText("Bottom diameter",language2)+ " [cm]");

  if (couleur != "")
  {
    if ( language2 == null )
      body.replaceText("{lab_Couleur}",txt_translateEnglishText("Color",language));
    else
      body.replaceText("{lab_Couleur}",txt_translateEnglishText("Color",language)+
                                      "\n"+txt_translateEnglishText("Color",language2));
  }
  else
    body.replaceText("{lab_Couleur}","");

   body.replaceText("{lab_sku}","SKU");

   body.replaceText("{sku}",sku);
   body.replaceText("{noCommande}",noCommande);
   body.replaceText("{Quantite}",quantite);
   body.replaceText("{Longueur}",cm_longueur);
   body.replaceText("{Largeur}",cm_largeur);
   body.replaceText("{Hauteur}",cm_hauteur);
   body.replaceText("{diamTop}",cm_diamTop);
   body.replaceText("{diamMiddle}",cm_diamMiddle);
   body.replaceText("{diamBottom}",cm_diamBottom);

   if (couleur != "")
   {
      body.replaceText("{Couleur}",couleur);
      body.getChild(COLORED_CELL_ECHANTILLON).asTable().getCell(0,0).setBackgroundColor(couleur);
   }
   else
    body.replaceText("{Couleur}","");

   body.replaceText("{Fournisseur}",fournisseur);
   body.replaceText("{Description}",description);
   body.replaceText("{Titre}",title);

  if ( imageId != null )
  {
    var blob   = DriveApp.getFileById(imageId).getBlob();
    var element = body.findText("{imageCommande}").getElement();
    element.asText().setText("");
    let theImg = element.getParent().asParagraph().insertInlineImage(0, blob); 
    resizeImg(theImg, 400);
  }

  //Sauvegarde du document
  //=====================
  OpenDoc.saveAndClose();

  return newDocFile.getUrl();
}

function resizeImg(img, targetHeight) {
    var height = img.getHeight();
    var width = img.getWidth();
    var factor = height / targetHeight;
    img.setHeight(height / factor);
    img.setWidth(width / factor);
};

/**
 * 
 * For testing purpose only
 */
function getElement() 
{
  const newDocFile = CommandeDoc_Template.makeCopy(TEMP_FOLDER).setName("test");
  const  OpenDoc = DocumentApp.openById(newDocFile.getId());
  const body = OpenDoc.getBody();

  var numOfElements = body.getNumChildren();
  for(let i=0;i<numOfElements;i++)
  {
  var element = body.getChild(i).asText();
  Logger.log(i + ":  " + element.getText() + ",   " + body.getChild(i).getType());

  if(i==COLORED_CELL_ECHANTILLON)
  {
    var style = {};
      style[DocumentApp.Attribute.BACKGROUND_COLOR] = "#000000";  
      body.getChild(i).asTable().getCell(0,0).setBackgroundColor('#BBB9B9');
  }
  }
  OpenDoc.saveAndClose();
}


/**
 * 
 * 
 * 
 */
function testCreateFicheFournisseur()
{
  let commandes=[];

  let comm1 = {};
  comm1["fourni"] = "Fournisseur 1";
  comm1["commandes"] =  [{"noCommande":111111,"quantite":5, "imageId":"1msodVRkLd7OnmmpfBZpcSt_FZ8jDIdkf"},
                         {"noCommande":222222,"quantite":15, "imageId":"1msodVRkLd7OnmmpfBZpcSt_FZ8jDIdkf"}];
  commandes.push(comm1);

  let comm2 = {};
  comm2["fourni"] = "Fournisseur 2";
  comm2["commandes"] =  [{"noCommande":111111-22,"quantite":522, "imageId":"1msodVRkLd7OnmmpfBZpcSt_FZ8jDIdkf"},
                         {"noCommande":222222,"quantite":15, "imageId":"1msodVRkLd7OnmmpfBZpcSt_FZ8jDIdkf"}];
  commandes.push(comm2); 

  com_CreateFicheFournisseurs(commandes,FICHESFOURNISSEURS_FOLDERID);
}




/**
 * 
 * 
 * 
 * 
 */
function com_generateAllProvidersOrders()
{
  let access            =   tbl_tableAccess(TABLES_DEFINITIONS.COMMANDES,TABLE_ACCESS_TYPE.REPEATED);
  let listeFiches       =   {};
  let rec               =   access.getFirstRow();
  let buildFiche        =   false;

  while(rec != null)
  {
      let data          = rec["data"];
      let status        = data[COMMANDE_VALIDATED-1];

      if (status==null || status==0)
      {
        let fournisseur   = data[COMMANDE_FOURNISSEUR-1];
        let quantite      = data[COMMANDE_QUANTITY-1];
        let noCommande    = data[COMMANDE_ID-1];
        let imageId       = data[COMMANDE_IMAGEID-1];

        if ( listeFiches[fournisseur] == null)
          listeFiches[fournisseur]=[];

        let aCommand ={};
        aCommand["noCommande"]  = noCommande;
        aCommand["quantite"]    = quantite;
        aCommand["imageId"]     = imageId;

        listeFiches[fournisseur].push(aCommand);
        buildFiche = true;
      }
      rec = access.getNextRow(rec["row"]);
  }

  
  if ( buildFiche )
  {
    let fichesBaseFolder  =   DriveApp.getFolderById(FICHESFOURNISSEURS_FOLDERID);
    let folderName        =   "Fiches_"+ new Date();
    var targetFolder      =   fichesBaseFolder.createFolder(folderName);
  
    com_CreateFicheFournisseurs(listeFiches, targetFolder.getId());

    let ret={};
    ret["err"] = "ok";
    ret["msg"] = "Les fiches sont dans le répertoire suivant <a href='" + targetFolder.getUrl() + "' target='_blank'> Liste des étiquettes</a>";
    return ret;
  }
  else
  {
    let ret={};
    ret["err"] = "ok";
    ret["msg"] = "Aucunes fiches n'on pu être générées";
    return ret;
  }
}




/**
 * 
 * 
 * 
 */
function com_CreateFicheFournisseurs(mapInfo, targetFolderId)
{
  let FicheTargetFolder      = DriveApp.getFolderById(targetFolderId);
  let today                  = utils_LocalGMTTimeFormatThisDate(new Date(),ENUM_DATE_FORMAT.LONG);

  //Creation du. fichier cible
  for( let key in mapInfo)
  {
    let unFournisseur   = key;
    let commandes       = mapInfo[key];

    const   fileName    = "Fiche_" + unFournisseur + "_" + Session.getActiveUser().getEmail() + today;
    const   newDocFile  = FicheFournisseur_Template.makeCopy(FicheTargetFolder).setName(fileName);
    const   OpenDoc     = DocumentApp.openById(newDocFile.getId());
    const   body        = OpenDoc.getBody();

    body.replaceText("{date}",today);

    var table         = body.appendTable();

    body.replaceText("{Fournisseur}",unFournisseur);

    for (let j=0;j<commandes.length;j++)
    {
      if ( commandes[j]["imageId"] != null )
      {
        try
        {
          table.appendTableRow().appendTableCell("{Image}");

          var blob      = DriveApp.getFileById(commandes[j]["imageId"]).getBlob();
          var element   = body.findText("{Image}").getElement();
          element.asText().setText("");

          let theImg    = element.getParent().asParagraph().insertInlineImage(0, blob); 
          resizeImg(theImg, 400);
        }
        catch(err)
        {
            body.replaceText("{Image}",err.message); 
        }
      }

      var tr2 = table.appendTableRow();
      var td2 = tr2.appendTableCell(commandes[j]["noCommande"]);

      var tr3 = table.appendTableRow();
      var td3 = tr3.appendTableCell(commandes[j]["quantite"]);
    }

    //Sauvegarde du document
    //=====================
    OpenDoc.saveAndClose();
  }

}



/**
 * 
 * 
 */
function testCreate()
{
  let ret={};
      ret["stockId"]        = 1645430445462;
      ret["noCommande"]        = 3453453;
      ret["title"]          = "TITLE HERE";
      ret["imageUrl"]       = "http://www.google.com";
      ret["etsyUrl"]        = "http://www.google.com";
      ret["fourni"]         = "tzoto";
      ret["description"]    = "shjfgaljhsdgfljhagsdfljhagsdfljhagsdfljqhgsfljhasgdjlhfags";
      ret["cm_length"]      = 22;
      ret["cm_width"]       = 35;
      ret["cm_height"]      = 33;
      ret["quantity"]       = 8;
      ret["color"]          = "rouge";
      ret["quality"]        = "bonne";
      ret["sku"]            = "MOB0013";

      com_createDocCommande(ret)
}


/**
 *
 *  
 * 
 */
function com_createFicheInFolder(folderId,folderName,commandeInfo)
{
ret={};
      
  let stockId = commandeInfo["stockId"];
  try
  {
    let user = Session.getActiveUser().getEmail();
    let splitted = user.split("@");
    //Créer les formes à coller sur colis
    
    let fileName = COMMANDES_PREFIX+utils_formatDateForPicker(new Date())

    let docUrl = com_createDocOrderForm(folderId,fileName,commandeInfo);

    let ret={};
    ret["err"] = "ok";
    ret["docCommandeUrl"] = docUrl;
    ret["msg"] = ["Vous trouverez la fiche commande dans Google Drive, dans le sous-dossier: " + folderName + ", du dossier partagé Commandes",
                  "Nom de la fiche: " + fileName];
    return JSON.stringify(ret);
  }
  catch(err)
  {
    let ret={};
    ret["err"] = "nok";
    ret["msg"] = "com_createFicheInFolder("+commandeInfo["imageId"] +") : " + err.message; 
    return JSON.stringify(ret);
  }
}


/**
 * 
 * 
 */
function com_createFiche(commandeInfo)
{
  return com_createFicheInFolder(COMMANDES_WORK_FOLDERID,"WORK",commandeInfo)
}


/**
 * 
 * 
 */
function com_createDocCommande(commandeInfo)
{
  return com_createFicheInFolder(COMMANDES_FICHES_FOLDERID, "FICHESVALIDEES",commandeInfo)
}


/**
 * 
 * 
 */
function com_getPictures(folderId) 
{
    var destination = DriveApp.getFolderById(folderId);
    
    var files = destination.getFiles();
    var file_array = [];
    
    while (files.hasNext()) 
    {
      var file = files.next();
      file_array.push(file.getId());
    }

    return file_array;
}

/**
 * 
 * 
 */
function com_getNewPictures() 
{
    return com_getPictures(COMMANDES_NEW_IMAGES_FOLDERID);
}


/**
 * 
 * 
 */
function com_getActualPictures() 
{
  return com_getPictures(COMMANDES_ACTUAL_IMAGES_FOLDERID);
}


/**
 * 
 * Each file in COMMANDES_ACTUAL_IMAGES_FOLDERID must be in the followinmh format
 * SKU-****
 */
function com_getActualPicturesWithSKU() 
{
  let ids = com_getPictures(COMMANDES_ACTUAL_IMAGES_FOLDERID);

    var destination = DriveApp.getFolderById(COMMANDES_ACTUAL_IMAGES_FOLDERID);
    
    var files = destination.getFiles();
    var file_array = [];
    let ret=[];
    while (files.hasNext()) 
    {
      var file = files.next();
      let name = file.getName();
      let id    = file.getId();
      let split = name.split("-");
      let sku = split[0];

      ret.push([sku,id])
    }

    return ret;
}




