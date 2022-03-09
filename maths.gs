


var LineFitter = function()
{
    this.slope = 0;
    this.offet = 0;

    this.count = 0;
    this.sumX = 0;
    this.sumX2 = 0;
    this.sumXY = 0;
    this.sumY = 0;

    this.add = function(x, y)
    {
        this.count++;
        this.sumX += x;
        this.sumX2 += x*x;
        this.sumXY += x*y;
        this.sumY += y;
    },
    
    this.getSlope = function()
    {
      return this.slope;
    },

    this.getOffset = function()
    {
      return this.offset;
    },

    this.linearTrend = function(data)
    {
      for (var i = 0; i < data.length; i++)
      {
          this.add(i, data[i]);
      }

      let det = this.count * this.sumX2 - this.sumX * this.sumX;

      this.offset = (this.sumX2 * this.sumY - this.sumX * this.sumXY) / det;
      this.slope = (this.count * this.sumXY - this.sumX * this.sumY) / det;
    }
};


function fitCumulatedData(dataCellRange)
{
  let fitter = new LineFitter();

  let ss = SpreadsheetApp.openById(prop_getSpreadSheetId());
  let cumulatedData = ss.getRangeByName(dataCellRange).getValues()[0].filter(String);

  fitter.linearTrend(cumulatedData);
  return fitter;

}

function test_fitCumulatedData()
{
  let fitter = new LineFitter();

  //let sheet = SpreadsheetApp.getActive().getSheetByName("souk");
  let ss = SpreadsheetApp.openById(prop_getSpreadSheetId());
  let cumulatedData = ss.getRangeByName(cellAnnuelMoyenneLisseSurNetEncaisse).getValues()[0].filter(String);
  Logger.log(cumulatedData)

  fitter.linearTrend(cumulatedData);
  Logger.log(fitter.getSlope());
  Logger.log(fitter.getOffset());
  return fitter;

}

var data = [867.52, 143.7, 49.62, 50.58, 96.66, 86.1, 633.3, 141.79, 106.86, 141.22, 43.86, 114.9, 114.9, 147.99, 78.28, 108.18, 556.5, 117.78, 54.42, 114.9, 136.98, 88.02, 75.22, 160.73, 40.02, 177.3, 537.3, 47.7, 40.9, 56.34, 148.5, 81.3, 50.47, 218.61, 147.95, 78.25, 148.11, 148.16, 141.58, 126.07, 154.26, 90.9, 141.44, 69.66, 139.45, 147.98, 56.34, 108.18, 66.42, 88.6, 50.45, 114.9, 57.13, 113.94, 364.68, 121.56, 82.26, 50.4, 39.92, 220.64, 95.7, 133.14, 95.7, 55.15, 631.45, 190.1, 94.5, 93.78, 100.5, 39.06, 37.14, 114.9, 126.42, 148.2, 141.47, 273.3, 75.54, 116.82, 179.22, 148.16, 148.07, 141.25, 75.54, 141.25, 146.58, 79.17, 62.1, 545.89, 215.22, 108.18, 140.82, 71.7, 128.34, 90.9, 53.46, 38.89, 119.19, 208.4, 122.0, 147.99, 141.29, 104.18, 34.16, 148.22, 94.39, 114.9, 96.66, 148.28, 361.64, 147.99, 86.76, 100.5, 147.99, 59.22, 296.9, 172.86, 90.9, 152.34, 16.98, 60.18, 148.0, 161.94, 92.82, 127.38, 121.62, 244.55, 148.19, 100.5, 147.94, 114.9, 77.27, 87.06, 58.26, 398.06, 172.89, 141.58, 136.98, 148.18, 148.16, 39.06, 38.92, 172.96, 172.95, 173.04, 151.1, 149.84, 88.64, 148.19, 77.46, 93.78, 94.52, 58.1, 141.26, 57.3, 82.26, 158.1, 97.62, 90.9, 172.95, 148.07, 142.21, 53.34, 117.42, 113.94, 50.16, 242.85, 154.56, 147.95, 148.13, 117.3, 69.2, 71.13, 124.5, 94.39, 34.26, 159.54, 94.59, 78.42, 69.61, 190.99, 44.73, 139.59, 125.19, 85.14, 123.51, 268.5, 88.82, 295.94, 243.05, 91.05, 173.02, 75.32, 283.22, 72.39, 703.78, 118.27, 195.06, 38.95, 39.0, 253.62, 135.14, 89.71, 172.5, 38.95, 58.11, 86.83, 86.83, 134.97, 120.5, 39.01, 79.91, 70.31, 59.98, 96.8, 133.39, 148.07, 134.94, 72.15, 102.16, 95.59, 191.05, 77.8, 99.66, 84.46, 54.11, 55.15, 98.25, 63.25, 115.84, 41.8, 155.74, 54.11, 117.61, 54.11, 85.42, 109.8, 179.22, 181.55, 158.38, 172.5, 77.76, 66.9, 68.91, 68.01, 83.41, 210.9, 39.91, 109.23, 107.75, 51.11, 138.57, 54.11, 86.1, 39.95, 127.89, 127.89, 167.3, 39.86, 44.76, 156.8, 114.56, 37.97, 66.48, 158.51, 97.95, 239.96, 110.75, 74.27, 101.56, 127.38, 175.05, 156.54, 88.24, 78.42, 81.3, 104.14, 143.7, 39.96, 38.92, 745.19, 71.34, 75.38, 75.38, 86.76, 193.9, 140.25, 101.09, 136.6, 75.64, 64.96, 110.82, 76.1, 91.09, 88.74, 53.65, 145.94, 609.01, 69.06, 195.54, 97.86, 109.38, 77.56, 69.78, 424.02, 513.78, 595.38, 115.06, 79.62, 69.06, 78.42, 66.23, 48.66, 75.42, 117.37, 40.02, 166.74, 74.58, 79.38, 72.66, 135.52, 71.7, 72.66, 178.26, 80.62, 49.2, 74.91, 233.2, 162.42, 72.66, 221.84, 61.58];

function test()
{
  let fitter = new LineFitter();

  let sheet = SpreadsheetApp.getActive().getSheetByName("souk");
  let orders = sheet.getRange("D44:ND44").getValues()[0].filter(String);

  Logger.log(orders);
  fitter.linearTrend(orders);
  Logger.log(fitter.getSlope())
  Logger.log(fitter.getOffset());


}

