
function test_getGantsCharts()
{
  let scope={};
  scope.assignee='All';
  Logger.log(getGantsCharts(scope))

  scope.assignee='Said';
  Logger.log(getGantsCharts(scope) );

  scope.assignee='IT';
  Logger.log(getGantsCharts(scope) );
} 

function getGantsCharts(scope) 
{
    var range = getWebTasksFor(scope);

    let allGantts = [];

  
    for (let i=0;i<range.values.length;i++)
    {
        let values = range.values[i];
        let oneRow = [];

        oneRow.push(values[COLUMNS.Id])
        oneRow.push(values[COLUMNS.Category])
        oneRow.push(values[COLUMNS.Attrib]);
        if ( values[COLUMNS.DateDebut]==null || values[COLUMNS.DateDebut] == "" )
        {
          oneRow.push(null);
        }
        else
        {
          let d = new Date(values[COLUMNS.DateDebut]);
          oneRow.push([d.getFullYear(),d.getMonth(),d.getDate()])
        }

        let d = new Date(values[COLUMNS.FinEspere]);
        oneRow.push([d.getFullYear(),d.getMonth(),d.getDate()]);

        //Compute durations
        let dateDebut = values[COLUMNS.DateDebut];
        let duration = 20;
        if (dateDebut != "")
        {
          if ( values[COLUMNS.DateFin] == null ||  values[COLUMNS.DateFin] == "")
            duration = utils_parseInt(new Date(values[COLUMNS.FinEspere]).getDate() - new Date(dateDebut).getDate());
          else
            duration = utils_parseInt(new Date(values[COLUMNS.DateFin]).getDate() - new Date(dateDebut).getDate());
        }
        else
        { 
          let d = new Date();
          duration = utils_parseInt(new Date(values[COLUMNS.FinEspere]).getDate() - new Date(values[COLUMNS.Creation]).getDate());
        }

        oneRow.push(duration);
        oneRow.push(values[COLUMNS.Percent]);
        oneRow.push(null);
        
        allGantts.push(oneRow);
    }

    
    let s = JSON.stringify(allGantts);
    return s;
}
