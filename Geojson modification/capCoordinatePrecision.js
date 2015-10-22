//USAGE:
// input parameter 1: inputfile containing geojson features
// input parameter 2: max number of decimals
// input parameter 3: output file
//
// This tool will limit the amount of decimals of geojson coordinates
var fs = require('fs');
var path = require('path');
var filePath;
var outFile;
var nDec;

var ptArray = [];
var ptObj = {};
var ptKeys = '';
var outObj = {};

var printMsg;
if (process.argv.length < 4) {
   console.log('Too few input parameters. Exiting...');
   process.exit();
} 
process.argv.forEach(function (val, index, array) {
    switch(index) {
        case 0:
        case 1:
            break;
        case 2:
            filePath = path.join(__dirname, val);
            printMsg = 'Input file: ' + filePath;
            break;
        case 3: 
            nDec = parseInt(val);
            if (isNaN(nDec)) { 
                console.log('Nr of decimals is NaN. Exiting...');
                process.exit()
            }
            printMsg = 'Number of decimals will be ' + nDec;
            break;
        case 4: 
            outFile = path.join(__dirname, val);
            printMsg = 'Output file: ' + outFile;
            break;
        default:
            printMgs = 'Additional parameter ignored';
            break;            
    }
    if (printMsg) console.log(printMsg);
});


fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (!err){
        console.log('Received data successfully');
        var inputJson = JSON.parse(data);
        this.ConvertData(inputJson);
    }else{
        console.log(err);
    }
});


ConvertData = function (inputJson) {
    outObj['type'] = "FeatureCollection";
    outObj['features'] = [];
    inputJson.features.forEach(function(f){
        var type = f.geometry.type;
        switch (type) {
            case "MultiPolygon":
                f.geometry.coordinates = this.CapMultiPoly(f.geometry.coordinates);
                break; 
            case "Polygon":
            case "MultiLineString":
                f.geometry.coordinates = this.CapPoly(f.geometry.coordinates);
                break;
            case "LineString":
            case "MultiPoint":
                f.geometry.coordinates = this.CapLine(f.geometry.coordinates);
                break;
            case "Point":
                f.geometry.coordinates = this.CapPoint(f.geometry.coordinates);
                break;
            default: 
                console.log("Geometry type not found: " + f.geometry.type);
                break;
        }        
        //console.log(f.geometry.coordinates);
        outObj.features.push(f);
    });
    fs.writeFileSync(outFile, JSON.stringify(outObj));
    console.log('done!');
};

CapMultiPoly = function (mpoly) {
    var newCoords = [];
    mpoly.forEach(function(c) {
        newCoords.push(this.CapPoly(c));
    });
    return newCoords;
}

CapPoly = function (poly) {
    var newCoords = [];
    poly.forEach(function(c) {
        newCoords.push(this.CapLine(c));
    });
    return newCoords;
}
                
CapLine = function (linestring) {
    var newCoords = [];
    linestring.forEach(function(c) {
        newCoords.push(this.CapPoint(c));
    });
    return newCoords;
}

CapPoint = function (point) {
    var newCoords = [];
    point.forEach(function(c) {
        newCoords.push(parseFloat(c.toFixed(nDec)));
    });
    return newCoords;
}