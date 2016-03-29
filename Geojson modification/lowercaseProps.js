//USAGE:
// input parameter 1: inputfile containing features with properties
// input parameter 2: output file
//
// This tool will make all property keys lowercase
var fs = require('fs');
var path = require('path');
var filePath;
var outFile;

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
    inputJson.features.forEach(function(f_in) {
        Object.keys(f_in.properties).forEach(function(prop) {
            var lowerProp = prop.toLowerCase();
            if (lowerProp !== prop) {
                f_in.properties[lowerProp] = JSON.parse(JSON.stringify(f_in.properties[prop]));
                delete f_in.properties[prop];
            }
        });
        outObj.features.push(f_in);
    });
    fs.writeFileSync(outFile, JSON.stringify(outObj));
    console.log("Wrote " + outObj.features.length);
    console.log('done!');
};