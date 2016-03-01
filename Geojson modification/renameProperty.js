//USAGE:
// input parameter 1: inputfile containing features with properties
// input parameter 2: output file
// input parameter 3: property-name to rename
// input parameter 4: new property name
//
// This tool will rename a property for each feature of the input file. For example, useful when
// you want to rename a property to 'Name'
var fs = require('fs');
var path = require('path');
var filePath;
var outFile;
var inProp;
var valProp;

var outObj = {};

var printMsg;
if (process.argv.length < 6) {
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
        case 4: 
            inProp = val.trim();
            printMsg = 'property-name: ' + inProp;
            break;
        case 5: 
            valProp = val.trim();
            printMsg = 'new property-name: ' + valProp;
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
        if (f_in.properties.hasOwnProperty(inProp)) {
            f_in.properties[valProp] = f_in.properties[inProp];
            delete f_in.properties[inProp];
            outObj.features.push(f_in);
        }
    });
    fs.writeFileSync(outFile, JSON.stringify(outObj));
    console.log("Wrote " + outObj.features.length);
    console.log('done!');
};