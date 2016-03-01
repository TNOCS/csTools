//USAGE:
// input parameter 1: inputfile containing features with properties
// input parameter 2: output file
//
// This tool will regard each property as URI encoded string, and decode it to regular text.
// Useful for layers originating from the risicokaart NL

var fs = require('fs');
var path = require('path');
var filePath;
var outFile;
var inProp;
var valProp;

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
        this.RenameData(inputJson);
    }else{
        console.log(err);
    }
});

RenameData = function (inputJson) {
    outObj['type'] = "FeatureCollection";
    outObj['features'] = [];
    var found = 0;
    inputJson.features.forEach(function(f_in) {
        if (f_in.properties) {
            var keys = Object.keys(f_in.properties);
            keys.forEach(function(k) {
                f_in.properties[k] = decodeURIComponent(f_in.properties[k]);
            });
            outObj.features.push(f_in);
        }
    });
    fs.writeFileSync(outFile, JSON.stringify(outObj));
    console.log("Wrote " + outObj.features.length);
    console.log('done!');
};