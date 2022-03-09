


/**==============================================================================================================================================================
 * 
 *  Comparaison Envois ==> email >>> EtsyData + email ==> EtsyData + BuyerId  >>> dataTransactions+BuyerId ==> Transactions info
 ==============================================================================================================================================================*/
function shipping_rechercheShippingReelsParTransaction()
{
  let date = utils_formatDateForPicker(new Date());
  let compareSheet = utils_getSheet(ship_getCompareSheetName());

  if (compareSheet==null)
  {
    errors_logErrorExceptionAndEmail("shipping_recherceShippingReelsParTransaction, fichier " + 
                    ship_getCompareSheetName() + "  de comparaisons non trouvé, abandon...");
    return;
  }

  //Pour garantir la complétude des données on refait la liste des transactions pour l'année
  //A terme on fera ça dans un processus end of day
  //================================================
  db_updateAnnualTransactionsTable();


  //ON va rajouter les dltails de(s)) transaction(s) 
  //================================================
  let etsyDataSheet     = utils_getSheet(DATA_SHEET);
  let transactionsSheet = utils_getSheet(ANNUAL_TRANSACTIONS_SHEET);

  let compData = compareSheet.getDataRange().getValues();
  let etsyData = etsyDataSheet.getDataRange().getValues();
  let transactionData = transactionsSheet.getDataRange().getValues();

  let outputArray=[];

  /*========== ON ne prend qu'un sous-ensemble des données */
  let header = [];
   for(let dm=0;dm<6;dm++)
    header.push(compData[0][dm]);
  header.push("Détails transaction");
  outputArray.push(header);
  /*================================*/
  for (xc=1;xc<compData.length;xc++)
  {
    let email = compData[xc][2]; //Dans la feuille input les emails sont en colonne 3 à partir de 1 (donc 2 à partir de 0)

    for (xe=1;xe< etsyData.length;xe++)
    {
      let etsyEmail = etsyData[xe][EMAIL_INDATA_SHEET-1];

      if (email == etsyEmail)
      {
        let buyerId = etsyData[xe][BUYER_ID_INDATA_SHEET-1];
        for (xt=1;xt < transactionData.length;xt++)
        {
          let transactionDetails = transactionData[xt][DETAILS_INTRANSACTIONDATA_SHEET-1];

          let details = utils_decodeObject(transactionDetails);
          let xtBuyerId = details.buyer_user_id;

          if ( xtBuyerId == buyerId )
          {
            /*================================*/
            let donneesMaintenues=[];
            for(let dm=0;dm<6;dm++)
              donneesMaintenues.push(compData[xc][dm])

            donneesMaintenues.push(transactionDetails)

            outputArray.push(donneesMaintenues);
            /*============= FIN ===================*/
          }
        }
      }
    }
  }


  //========================================
  //Hightlight des transactions par customer
  //========================================
  compareSheet.clear();

  let headerLength = outputArray[0].length

  compareSheet.getRange(1,1,outputArray.length,headerLength).setValues(outputArray);

  //ON remet le header pour signaler la fin
  compareSheet.appendRow(outputArray[0]); //The header

  compareSheet.getRange(1,1,1,headerLength).setBackground("#a3e66b");
  compareSheet.getRange(outputArray.length+1,1,1,headerLength).setBackground("#a3e66b");

  //=============================================================================================
  let totalFraisSupp=0;
  let color=["#FFFFFF","#FFE8C1"]
  let startRow=2;
  let endRow=2;
  let nReceipt=0;
  let lastReceiptId=-1;
  for(let i=2;i<= outputArray.length;i++)
  {
    let j=i-1;

    let detailsTransaction = utils_decodeObject(outputArray[j][6]);
    let receiptId = detailsTransaction.receiptId;

    if (receiptId != lastReceiptId && lastReceiptId != -1)
    {
        nReceipt++;
        endRow = j;

        let nRows = endRow-startRow+1

        compareSheet.getRange(startRow,1,nRows,headerLength).setBackground(color[nReceipt%2])

        //Frais supp en colonne 5 en partant danbs 0 dans l'array. !! 
        //toujours décalage de 1 p.r. aux colonne dans la feuille.
        //Mettre les frais supp en rouge s'ils sont positifs
        let fraisSupp = utils_parseFloat(outputArray[j][5]) ;
        totalFraisSupp += fraisSupp;

        //Mettre les montants à 0 sauf le premier car ils sont en duplicata
        if ( nRows > 1 )
        {
          let nRowsZero = nRows-1;
          let startRowZero=startRow+1;

          for (let zi=0;zi<nRowsZero;zi++)
          {
            //Les montants sont à la colonne 4 et 5 en partant de 1
            compareSheet.getRange(startRowZero+zi,4,1,3).setValue(0);
          }
        }

        //CES INSTRUCTIONS A LA FIN SEULEMENT
        startRow=i;
        endRow=i;
    }
   
    lastReceiptId=receiptId;
  }

  compareSheet.getRange(outputArray.length+4,5).setValue("Total des frais supplémentaires")
  compareSheet.getRange(outputArray.length+4,5).setWrap(true);
  compareSheet.getRange(outputArray.length+4,6).setValue(totalFraisSupp);
  compareSheet.getRange(outputArray.length+4,7).setValue("EUR");
  if ( totalFraisSupp > 0 )
  {
      compareSheet.getRange(outputArray.length+4,6).setBackground("red");
      compareSheet.getRange(outputArray.length+4,6).setFontColor("white");
      compareSheet.getRange(outputArray.length+4,6).setFontWeight("bold");
      compareSheet.getRange(outputArray.length+4,7).setFontWeight("bold");
  }


  //On refait une passe pour mettre en rouge les montant suplémentaire positifs
  //==========================================================================
  let data = compareSheet.getDataRange().getValues();

  for(let i=1;i<data.length;i++)
  {
      let fraisSupp = data[i][5];

      if (fraisSupp > 0 )
      {
            compareSheet.getRange(i+1,6).setBackground("red"); 
            compareSheet.getRange(i+1,6).setFontColor("white");
            compareSheet.getRange(i+1,6).setFontWeight("bold");
      }
  }
}

