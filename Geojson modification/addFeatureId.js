//USAGE:
// input parameter 1: inputfile containing features with properties
// input parameter 2: output file
// input parameter 3: id prefix text
//
// This tool will add an id to eaach feature in the form "PREFIX#"
var fs = require('fs');
var path = require('path');
var filePath;
var outFile;
var prefix;

var outObj = {};

var printMsg;
if (process.argv.length < 5) {
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
            prefix = val.trim();
            printMsg = 'prefix: ' + prefix;
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
    var counter = 0;
    inputJson.features.forEach(function(f_in) {
        if (f_in) {
            counter += 1;
            f_in.id = ''.concat(prefix, counter);
            outObj.features.push(f_in);
        }
    });
    fs.writeFileSync(outFile, JSON.stringify(outObj));
    console.log("Wrote " + outObj.features.length);
    console.log('done!');
};