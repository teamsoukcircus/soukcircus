
const ChartHeader = '<html><head><script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script><script type="text/javascript">google.charts.load("current", {packages:["corechart"]}); '

const ChartPreData1AddIndexPre = " google.charts.setOnLoadCallback(drawChart"; //+i
const ChartPreData1AddIndexPost = "); ";


const ChartPreData2AddIndexPre = " function drawChart"; //+i
const ChartPreData2AddIndexPost = "() { ";

const ChartPreData3AddIndexPre = " var data"; //+i
const ChartPreData3AddIndexPost = " = google.visualization.arrayToDataTable(["; 
//DATA

const ChartPostDataPreTitle = ']); var options = { hAxis: {},  title: "';
const ChartPostTitle = "\", legend: { position: 'none' },};";
 
const ChartDivStart1AddIndexPre = " var chart"; //+i

const bar_ChartDivStart1AddIndexPost = " = new google.visualization.ColumnChart(document.getElementById('chart_div"; //+i

const line_ChartDivStart1AddIndexPost = " = new google.visualization.LineChart(document.getElementById('chart_div"; //+i
 
const ChartDivStart2AddIndexPre = "'));  chart"; //+i
const ChartDivStart2AddIndexPost = ".draw(data" ; //+i
const ChartDivStart2AddIndexPostPost  = ", options);}  ";

const ChartEndScript = "</script></head><body>";

const ChartBody1AddIndexPre = "<div id='chart_div"; //+i

const ChartBody1AddIndexPost = "' style='width: 900px; height: 500px;'></div>";

const ChartFooter = "</body></html>";

/**
 * =================================== BAR CHARTS ==========================================
 */
function getBarChartPart(partIndex,chartIndex,chartTitle)
{

  switch(partIndex)
  {
    case 0:
      return ChartHeader;
    case 1: 
      return ChartPreData1AddIndexPre + chartIndex + 
             ChartPreData1AddIndexPost+ChartPreData2AddIndexPre + chartIndex + 
             ChartPreData2AddIndexPost+ ChartPreData3AddIndexPre + chartIndex + 
             ChartPreData3AddIndexPost;
    case 2:
      return ChartPostDataPreTitle + chartTitle + ChartPostTitle +
            ChartDivStart1AddIndexPre + chartIndex + 
            bar_ChartDivStart1AddIndexPost+ chartIndex +
            ChartDivStart2AddIndexPre + chartIndex + 
            ChartDivStart2AddIndexPost + chartIndex +  
            ChartDivStart2AddIndexPostPost;
    case 3:
      return ChartEndScript;
      
    case 4:
      return ChartBody1AddIndexPre + chartIndex + ChartBody1AddIndexPost;
    case 5:
      return ChartFooter;
    default:
      return "";
  }
}

function buildBarChart(chartsDataArray)
{
  let retChart = getBarChartPart(0,0,"");

  for (let i=0;i<chartsDataArray.length;i++)
  {
    retChart += getBarChartPart(1,i,chartsDataArray[i][1]);

    let datas = chartsDataArray[i][0];
    retChart += "['"+datas[0][0] + "','" + datas[0][1] + "'],";

    for (let j = 1;j< datas.length;j++)
    {
      retChart += "['" + datas[j][0] + "'," + datas[j][1] + "],";
    }

    retChart += getBarChartPart(2,i,chartsDataArray[i][1]);
  }
  
  retChart += getBarChartPart(3,0,"");
  for (let i=0;i<chartsDataArray.length;i++)
  {
      retChart += getBarChartPart(4,i,chartsDataArray[i][1]);
  }

  retChart += getBarChartPart(5,0,"");

  return retChart;
}



/**
 * 
 * https://developers.google.com/chart/interactive/docs/gallery/columnchart
 */
function createBarCharts(dataArray)
{
    return buildBarChart(dataArray);
}

/**
 * =================================== LINE CHARTS ==========================================
 */

function getLineChartPart(partIndex,chartIndex,chartTitle)
{

  switch(partIndex)
  {
    case 0:
      return ChartHeader;
    case 1: 
      return ChartPreData1AddIndexPre + chartIndex + 
             ChartPreData1AddIndexPost+ChartPreData2AddIndexPre + chartIndex + 
             ChartPreData2AddIndexPost+ ChartPreData3AddIndexPre + chartIndex + 
             ChartPreData3AddIndexPost;
    case 2:
      return ChartPostDataPreTitle + chartTitle + ChartPostTitle +
            ChartDivStart1AddIndexPre + chartIndex + 
            line_ChartDivStart1AddIndexPost+ chartIndex +
            ChartDivStart2AddIndexPre + chartIndex + 
            ChartDivStart2AddIndexPost + chartIndex +  
            ChartDivStart2AddIndexPostPost;
    case 3:
      return ChartEndScript;
      
    case 4:
      return ChartBody1AddIndexPre + chartIndex + ChartBody1AddIndexPost;
    case 5:
      return ChartFooter;
    default:
      return "";
  }
}

function buildLineChart(chartsDataArray)
{
  let retChart = getLineChartPart(0,0,"");

  for (let i=0;i<chartsDataArray.length;i++)
  {
    retChart += getLineChartPart(1,i,chartsDataArray[i][1]);

    let datas = chartsDataArray[i][0];
    retChart += "['"+datas[0][0] + "','" + datas[0][1] + "'],";

    for (let j = 1;j< datas.length;j++)
    {
      retChart += "['" + datas[j][0] + "'," + datas[j][1] + "],";
    }

    retChart += getLineChartPart(2,i,chartsDataArray[i][1]);
  }
  
  retChart += getLineChartPart(3,0,"");
  for (let i=0;i<chartsDataArray.length;i++)
  {
      retChart += getLineChartPart(4,i,chartsDataArray[i][1]);
  }

  retChart += getLineChartPart(5,0,"");

  return retChart;
}



/**
 * 
 * https://developers.google.com/chart/interactive/docs/gallery/columnchart
 * 
 * dataArray is expected to be structured as follow
 * [[[x1,y1[],[x2,y2[],[x3,y3],......[xn,yn], "chart title"]
 */

const test_data = [[[[0.0, 0.0], [100.0, 0.0], [200.0, 0.0], [300.0, 0.0], [400.0, 0.0], [500.0, 34.285714285714285], [600.0, 77.14285714285714], [700.0, 120.0], [800.0, 162.85714285714286], [900.0, 205.7142857142857], [1000.0, 248.57142857142856], [1100.0, 291.4285714285714], [1200.0, 334.2857142857143], [1300.0, 377.1428571428571], [1400.0, 420.0], [1500.0, 462.85714285714283], [1600.0, 505.71428571428567], [1700.0, 548.5714285714286], [1800.0, 591.4285714285714], [1900.0, 634.2857142857142], [2000.0, 677.1428571428571], [2100.0, 720.0], [2200.0, 762.8571428571428], [2300.0, 805.7142857142857], [2400.0, 848.5714285714286], [2500.0, 891.4285714285713], [2600.0, 934.2857142857142], [2700.0, 977.1428571428571], [2800.0, 1020.0], [2900.0, 1062.857142857143], [3000.0, 1105.7142857142856], [3100.0, 1148.5714285714284], [3200.0, 1191.4285714285713], [3300.0, 1234.2857142857142], [3400.0, 1277.142857142857], [3500.0, 1320.0], [3600.0, 1362.857142857143], [3700.0, 1405.7142857142856], [3800.0, 1448.5714285714284], [3900.0, 1491.4285714285713], [4000.0, 1500.0], [4100.0, 1500.0], [4200.0, 1500.0], [4300.0, 1500.0], [4400.0, 1500.0], [4500.0, 1500.0], [4600.0, 1500.0], [4700.0, 1500.0], [4800.0, 1500.0], [4900.0, 1500.0], [5000.0, 1500.0], [5100.0, 1500.0], [5200.0, 1500.0], [5300.0, 1500.0], [5400.0, 1500.0], [5500.0, 1500.0], [5600.0, 1500.0], [5700.0, 1500.0], [5800.0, 1500.0], [5900.0, 1500.0], [6000.0, 1500.0], [6100.0, 1500.0], [6200.0, 1500.0], [6300.0, 1500.0], [6400.0, 1500.0], [6500.0, 1500.0], [6600.0, 1500.0], [6700.0, 1500.0], [6800.0, 1500.0], [6900.0, 1500.0], [7000.0, 1500.0], [7100.0, 1500.0], [7200.0, 1500.0], [7300.0, 1500.0], [7400.0, 1500.0], [7500.0, 1500.0], [7600.0, 1500.0], [7700.0, 1500.0], [7800.0, 1500.0], [7900.0, 1500.0], [8000.0, 1500.0], [8100.0, 1500.0], [8200.0, 1500.0], [8300.0, 1500.0], [8400.0, 1500.0], [8500.0, 1500.0], [8600.0, 1500.0], [8700.0, 1500.0], [8800.0, 1500.0], [8900.0, 1500.0], [9000.0, 1500.0], [9100.0, 1500.0], [9200.0, 1500.0], [9300.0, 1500.0], [9400.0, 1500.0], [9500.0, 1500.0], [9600.0, 1500.0], [9700.0, 1500.0], [9800.0, 1500.0], [9900.0, 1500.0], [10000.0, 1500.0]], 'Salaire 1'], 

[[[0.0, 0.0], [100.0, 0.0], [200.0, 0.0], [300.0, 0.0], [400.0, 0.0], [500.0, 0.0], [600.0, 0.0], [700.0, 0.0], [800.0, 0.0], [900.0, 0.0], [1000.0, 0.0], [1100.0, 0.0], [1200.0, 0.0], [1300.0, 0.0], [1400.0, 0.0], [1500.0, 0.0], [1600.0, 0.0], [1700.0, 0.0], [1800.0, 0.0], [1900.0, 0.0], [2000.0, 0.0], [2100.0, 0.0], [2200.0, 0.0], [2300.0, 0.0], [2400.0, 0.0], [2500.0, 0.0], [2600.0, 0.0], [2700.0, 0.0], [2800.0, 0.0], [2900.0, 0.0], [3000.0, 0.0], [3100.0, 0.0], [3200.0, 0.0], [3300.0, 0.0], [3400.0, 0.0], [3500.0, 0.0], [3600.0, 0.0], [3700.0, 0.0], [3800.0, 0.0], [3900.0, 0.0], [4000.0, 280.0], [4100.0, 280.0], [4200.0, 280.0], [4300.0, 280.0], [4400.0, 280.0], [4500.0, 280.0], [4600.0, 280.0], [4700.0, 280.0], [4800.0, 280.0], [4900.0, 280.0], [5000.0, 280.0], [5100.0, 280.0], [5200.0, 280.0], [5300.0, 280.0], [5400.0, 280.0], [5500.0, 280.0], [5600.0, 280.0], [5700.0, 280.0], [5800.0, 280.0], [5900.0, 280.0], [6000.0, 280.0], [6100.0, 280.0], [6200.0, 280.0], [6300.0, 280.0], [6400.0, 280.0], [6500.0, 280.0], [6600.0, 280.0], [6700.0, 280.0], [6800.0, 280.0], [6900.0, 280.0], [7000.0, 280.0], [7100.0, 280.0], [7200.0, 280.0], [7300.0, 280.0], [7400.0, 280.0], [7500.0, 280.0], [7600.0, 280.0], [7700.0, 280.0], [7800.0, 280.0], [7900.0, 280.0], [8000.0, 280.0], [8100.0, 280.0], [8200.0, 280.0], [8300.0, 280.0], [8400.0, 280.0], [8500.0, 280.0], [8600.0, 280.0], [8700.0, 280.0], [8800.0, 280.0], [8900.0, 280.0], [9000.0, 280.0], [9100.0, 280.0], [9200.0, 280.0], [9300.0, 280.0], [9400.0, 280.0], [9500.0, 280.0], [9600.0, 280.0], [9700.0, 280.0], [9800.0, 280.0], [9900.0, 280.0], [10000.0, 280.0]], 'Bonus 1']];

function test_createLineCharts()
{
    let charts = buildLineChart(test_data);

    Logger.log(charts);

    let template = HtmlService.createTemplate(charts).evaluate()
                  .setWidth(900)
                  .setHeight(900);
      
    SpreadsheetApp.getUi().showModalDialog(template,"Evolution salaires & bonus")
}
function createLineCharts(dataArray)
{
    return buildLineChart(dataArray);
}
