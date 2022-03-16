



function computeNetEncaisseEstime(month)
{
    let netEncaisse=0;

    switch(month)
    {
      case 0: netEncaisse = utils_getNamedCellValue(cellNetEncaisseJanvier); break;
      case 1: netEncaisse = utils_getNamedCellValue(cellNetEncaisseFevrier); break;
      case 2: netEncaisse = utils_getNamedCellValue(cellNetEncaisseMars); break;
      case 3: netEncaisse = utils_getNamedCellValue(cellNetEncaisseAvril); break;
      case 4: netEncaisse = utils_getNamedCellValue(cellNetEncaisseMai); break;
      case 5: netEncaisse = utils_getNamedCellValue(cellNetEncaisseJuin); break;
      case 6: netEncaisse = utils_getNamedCellValue(cellNetEncaisseJuillet); break;
      case 7: netEncaisse = utils_getNamedCellValue(cellNetEncaisseAout); break;
      case 8: netEncaisse = utils_getNamedCellValue(cellNetEncaisseSept); break;
      case 9: netEncaisse = utils_getNamedCellValue(cellNetEncaisseOct); break;
      case 10: netEncaisse = utils_getNamedCellValue(cellNetEncaisseNov); break;
      case 11: netEncaisse = utils_getNamedCellValue(cellNetEncaisseDec); break;
      default: return -1;
    }

    return netEncaisse + utils_getRemainingDaysInMonth(month)*getAdminMoyenneReelle();
}

function generateSteps()
{
  let allSteps=[];

  let N=10;

  for( let k=0;k<N ;k++)
    allSteps.push([1,0,0,0])

  for( let k=0;k<N;k++)
    allSteps.push([-1,1,0,0])

  for( let k=0;k<N;k++)
    allSteps.push([0,-1,1,0])

  for( let k=0;k<N;k++)
    allSteps.push([0,0,-1,1])

  for( let k=0;k<N;k++)
    allSteps.push([1,1,1,-1])

  for( let k=0;k<N;k++)
    allSteps.push([0,0,1,1])

  for( let k=0;k<N;k++)
    allSteps.push([1,0,0,1])

  for( let k=0;k<N;k++)
    allSteps.push([1,0,0,-1])

  let s="[";
  for (k=0;k<allSteps.length;k++)
  {
    s += "["+allSteps[k]+"],";
  }
  s+= "]";
  Logger.log(s)
}
/**
 * 
 */
let FraisRachatPrevisionnels = 100;
let FraisRachatSuppAjoutes = 100;
let FraisLivraisonSuppAjoutes = 100
let FraisDeRemboursements = 100;

function launch_test_forecastSalariesForMonth()
{
  test_forecastSalariesForMonth();   
} 

function trigger_test_forecastSalariesForMonth() 
{
  test_forecastSalariesForMonth(false,-1); 
}

let allSteps=[[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[-1,1,0,0],[-1,1,0,0],[-1,1,0,0],[-1,1,0,0],[-1,1,0,0],[-1,1,0,0],[-1,1,0,0],[-1,1,0,0],[-1,1,0,0],[-1,1,0,0],[0,-1,1,0],[0,-1,1,0],[0,-1,1,0],[0,-1,1,0],[0,-1,1,0],[0,-1,1,0],[0,-1,1,0],[0,-1,1,0],[0,-1,1,0],[0,-1,1,0],[0,0,-1,1],[0,0,-1,1],[0,0,-1,1],[0,0,-1,1],[0,0,-1,1],[0,0,-1,1],[0,0,-1,1],[0,0,-1,1],[0,0,-1,1],[0,0,-1,1],[1,1,1,-1],[1,1,1,-1],[1,1,1,-1],[1,1,1,-1],[1,1,1,-1],[1,1,1,-1],[1,1,1,-1],[1,1,1,-1],[1,1,1,-1],[1,1,1,-1],[0,0,1,1],[0,0,1,1],[0,0,1,1],[0,0,1,1],[0,0,1,1],[0,0,1,1],[0,0,1,1],[0,0,1,1],[0,0,1,1],[0,0,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,-1],[1,0,0,-1],[1,0,0,-1],[1,0,0,-1],[1,0,0,-1],[1,0,0,-1],[1,0,0,-1],[1,0,0,-1],[1,0,0,-1],[1,0,0,-1]];

function test_forecastSalariesForMonth(manual=false,netEncaisse=-1) 
{
  let mois = 0;
  let cumulFraisDeRemboursements = 0;
  let cumulFraisLivraisonSuppAjoutes = 0;
  let cumulFraisRachatPrevisionnels = 0;
  let cumulFraisRachatSuppAjoutes = 0;
  let increment0=increment1=increment2=increment3=0;
  let useThisNetEncaisse = 0;

  let salairePrevu1 = getCollabSalaireAnnuel(collab01SalaireAnnuel)/12;
  let bonus1 = utils_parseInt(getCollabBonusPercent(collab01BonusPercent)*salairePrevu1);

  let testSheet = utils_getSheet(FORECASTING_SHEET);
  if (testSheet==null)
  {
    utils_insertSheet(FORECASTING_SHEET);
    testSheet = utils_getSheet(FORECASTING_SHEET);
    testSheet.appendRow(["'+-Rembourse","'+-Livraisons Supplémentaires","'+-Rachats effectués","'+-Rachats prévus","Frais Remboursements","Frais Livraison Supp.",	"Frais Rachats Effectués",	"Frais Rachats Prévus"," Salaire Simon","Bonus Simon","Salaire Céline", "Bonus Céline", "Salaire Said", "Bonus Said",	"Tréso Mois", 	"Treso Totale Effective", "Checksum", "Net Encaissé","Total Simon", "Total Céline", "Total Said","Bonus Flag","Total frais supportables pour 95% de salaire et 0 bonus","index"])
    testSheet.appendRow([0,0,0,0,0,0,	0,	0,"","","", "", "", "",	"", 	"", "", "","", "", "","","",""])
  }

  let nStepsDone = testSheet.getLastRow()-2;
  let ncols = testSheet.getLastColumn();
  if ( nStepsDone > 0 )
  {
    let row = testSheet.getRange(nStepsDone+1,1,1,ncols).getValues()[0];

    increment3= row[0];
    increment2= row[1];
    increment1= row[2];
    increment0= row[3];

    useThisNetEncaisse = row[17];
    let vals = testSheet.getRange(2,18,nStepsDone,1).getValues();
    let countNet=0;
    for(let jj=0;jj<nStepsDone;jj++)
    {
        if (vals[jj][0]==useThisNetEncaisse)
          countNet++;
    }

    if (countNet > 0 && countNet%20==0)
      useThisNetEncaisse += 1000;

    cumulFraisDeRemboursements=row[4];
    cumulFraisLivraisonSuppAjoutes=row[5];
    cumulFraisRachatSuppAjoutes=row[6];
    cumulFraisRachatPrevisionnels=row[7];
  
    setFraisRemboursementsMois(mois,cumulFraisDeRemboursements);
    setFraisLivraisonSuppAjoutes(mois,cumulFraisLivraisonSuppAjoutes);
    setFraisRachatSuppAjoutesMois(mois,cumulFraisRachatSuppAjoutes);
    setFraisRachatPrevisionnelsMois(mois,cumulFraisRachatPrevisionnels);

    setAdminSalaireCollab(1,mois,row[8]);
    setAdminBonusCollab(1,mois,row[9]);
    setAdminSalaireCollab(2,mois,row[10]);
    setAdminBonusCollab(2,mois,row[11]);
    setAdminSalaireCollab(1,mois,row[12]);
    setAdminBonusCollab(1,mois,row[13]);

    setAdminTesorize(mois, row[14])
    setAdminTresorerieTotalEffective(row[15]);

    SpreadsheetApp.flush();
  }
  else
  {
    setFraisRemboursementsMois(mois,0);
    setFraisLivraisonSuppAjoutes(mois,0);
    setFraisRachatSuppAjoutesMois(mois,0);
    setFraisRachatPrevisionnelsMois(mois,0);
    setAdminTesorize(mois, 0)
    setAdminTresorerieTotalEffective(0);
  }


  let fraisGeneraux = getFraisGenerauxMonth(mois);

  /*  ===============================================================================*/
  /*  ===============================================================================*/
  FraisRachatPrevisionnels  = utils_randomInteger(100,200);
  FraisRachatSuppAjoutes    = utils_randomInteger(100,200);
  FraisLivraisonSuppAjoutes = utils_randomInteger(100,200);
  FraisDeRemboursements     = utils_randomInteger(100,200);
  allSteps=utils_permuteArray(allSteps); 

  let startingAt = Date.now();
  while(utils_isTimeLeft(startingAt))
  { 
      /*==========================================================================================
                Initialisation des paramètre pour le prochain round de simulation
      ==========================================================================================*/
    let nextIndex = nStepsDone%allSteps.length;
    let allIncrements = [];
    let pilot = testSheet.getRange("A2:Z2").getValues()[0];
    Logger.log(pilot);

    allIncrements.push(utils_parseInt(pilot[0]));
    if ( allIncrements[0]==-2)
      break; //On stop le processus

    allIncrements.push(utils_parseInt(pilot[1]));
    allIncrements.push(utils_parseInt(pilot[2]));
    allIncrements.push(utils_parseInt(pilot[3]));
    Logger.log(allIncrements);

    FraisDeRemboursements=utils_parseInt(pilot[4]) ; 
    FraisLivraisonSuppAjoutes=utils_parseInt(pilot[5]) ; 
    FraisRachatSuppAjoutes=utils_parseInt(pilot[6]) ; 
    FraisRachatPrevisionnels=utils_parseInt(pilot[7]) ;

    useThisNetEncaisse = utils_parseInt(pilot[17]);
    if ( useThisNetEncaisse == 0 ) 
      useThisNetEncaisse = 4000; 

    Logger.log(allIncrements);


    /*==========================================================================================
                            Démarrage simulation
      ==========================================================================================*/
    increment0=allIncrements[3];
    if ( cumulFraisRachatPrevisionnels <= 0 && increment0==-1) 
    {
      setFraisRachatPrevisionnelsMois(mois,0);
      cumulFraisRachatPrevisionnels=0;
      increment0=0;
    } 

    if ( increment0 != 0 )
    {
      let addValue = increment0*FraisRachatPrevisionnels;
      addFraisRachatPrevisionnels(mois,addValue);
      cumulFraisRachatPrevisionnels += addValue;
      cumulFraisRachatPrevisionnels = Math.max(cumulFraisRachatPrevisionnels,0);
    }
    
    /*================================================================*/
    /*================================================================*/
      increment1=allIncrements[2];
      if ( cumulFraisRachatSuppAjoutes <= 0 && increment1==-1 ) 
      {
        setFraisRachatSuppAjoutesMois(mois,0);
        cumulFraisRachatSuppAjoutes=0;
        increment1 = 0;
      } 

      if ( increment1 != 0 )
      {
        let addValue = increment1*FraisRachatSuppAjoutes;
        addFraisRachatSuppAjoutes(mois,addValue);
        cumulFraisRachatSuppAjoutes += addValue;
        cumulFraisRachatSuppAjoutes = Math.max(cumulFraisRachatSuppAjoutes,0);
      }

      /*================================================================*/
      /*================================================================*/
        increment2=allIncrements[1];
        if ( cumulFraisLivraisonSuppAjoutes <= 0 && increment2==-1) 
        {
          setFraisLivraisonSuppAjoutes(mois,0);
          cumulFraisLivraisonSuppAjoutes=0;
          increment2 = 0;
        } 

        if ( increment2 != 0 )
        {
          let addValue = increment2*FraisLivraisonSuppAjoutes;
          addFraisLivraisonSuppAjoutes(mois,addValue);
          cumulFraisLivraisonSuppAjoutes += addValue;
          cumulFraisLivraisonSuppAjoutes = Math.max(cumulFraisLivraisonSuppAjoutes,0);
        }


        
        /*  ===============================================================================*/
        /*  ===============================================================================*/
          increment3=allIncrements[0];
          if ( cumulFraisDeRemboursements <= 0 && increment3==-1) 
          {
            setFraisRemboursementsMois(mois,0);
            cumulFraisDeRemboursements=0;
            increment3 = 0; 
          } 

          if ( increment3 != 0 )
          {
            let addValue = increment3*FraisDeRemboursements;
            addFraisRemboursementsMois(mois,addValue);
            cumulFraisDeRemboursements += addValue;
            cumulFraisDeRemboursements = Math.max(cumulFraisDeRemboursements,0);
          }

          let loopC=0;
          let fr = getFraisRemboursementsMois(mois);
          let la = getFraisLivraisonSuppAjoutesMois(mois);
          let rs = getFraisRachatSuppAjoutesMois(mois);
          let rp = getFraisRachatPrevisionnelsMois(mois);
          while ( fr != cumulFraisDeRemboursements ||
                la != cumulFraisLivraisonSuppAjoutes ||
                rs != cumulFraisRachatSuppAjoutes ||
                rp != cumulFraisRachatPrevisionnels )
              {
                SpreadsheetApp.flush();
                loopC++;
                if ( loopC > 5)
                  SpreadsheetApp.getUi().alert("ALERT ALERT LOOPING");

                fr = getFraisRemboursementsMois(mois);
                la = getFraisLivraisonSuppAjoutesMois(mois);
                rs = getFraisRachatSuppAjoutesMois(mois);
                rp = getFraisRachatPrevisionnelsMois(mois);
              }

        /*========================= Remettre à jour le tableau ===========================*/
          let ret = forecastSalariesForMonth(mois,useThisNetEncaisse);

          fr = getFraisRemboursementsMois(mois);
          la = getFraisLivraisonSuppAjoutesMois(mois);
          rs = getFraisRachatSuppAjoutesMois(mois);
          rp = getFraisRachatPrevisionnelsMois(mois);
          if ( fr != cumulFraisDeRemboursements )
            cumulFraisDeRemboursements=fr; 
          
          if ( la != cumulFraisLivraisonSuppAjoutes)
            cumulFraisLivraisonSuppAjoutes=la;

          if ( rs != cumulFraisRachatSuppAjoutes )
            cumulFraisRachatSuppAjoutes=rs;

          if ( rp != cumulFraisRachatPrevisionnels )
            cumulFraisRachatPrevisionnels=rp;

          Logger.log("("+fr+","+cumulFraisDeRemboursements +"), ("+la+","+cumulFraisLivraisonSuppAjoutes+"), ("+rs+"," +cumulFraisRachatSuppAjoutes+
                "), ("+rp+", "+cumulFraisRachatPrevisionnels+")");

          let tresorerieTotalEffective = getAdminTresorerieTotalEffective();

          let colToUse=nStepsDone+2;

          let salEtBon = testSheet.getRange("I"+colToUse+":J"+colToUse).getValues()[0];
          let lesFrais = testSheet.getRange("E"+colToUse+":H"+colToUse).getValues()[0];
          let totFrais=0;
          for(i=0;i<4;i++)
            totFrais+=utils_parseInt(lesFrais[i]);
          
          if (salEtBon[0] < 0.95*salairePrevu1)
            totFrais=0;

          let logThis = [increment3,increment2,increment1,increment0,cumulFraisDeRemboursements, cumulFraisLivraisonSuppAjoutes, cumulFraisRachatSuppAjoutes, cumulFraisRachatPrevisionnels, 
          utils_parseInt(ret[0][0]),utils_parseInt(ret[0][1]),
          utils_parseInt(ret[1][0]),utils_parseInt(ret[1][1]),
          utils_parseInt(ret[2][0]),utils_parseInt(ret[2][1]),
          utils_parseInt(ret[3][0]),utils_parseInt(tresorerieTotalEffective),"=SUM(E"+colToUse+":P"+colToUse+")+"+fraisGeneraux,utils_parseInt(useThisNetEncaisse)
          ,"=I"+colToUse+" + J"+colToUse,"=K"+colToUse+" + L"+colToUse,"=M"+colToUse+" + N"+colToUse,"=IF(J"+colToUse+">0,1,0)",totFrais,"="+colToUse];

          testSheet.appendRow(logThis);
          
          nStepsDone++;

          if (nStepsDone%20==0)
            useThisNetEncaisse += 1000;

  }

  SpreadsheetApp.getUi().alert("Fin de la simulation");
}

function test_forecastSalariesForMonth()
{
  specificMonthforecastSalaries(0);
}












