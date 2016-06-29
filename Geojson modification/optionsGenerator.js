// Creates options list from a text file having one option id per line. Result in the form of
//"options": {
//              "0": "Eengezinswoning",
//              "1": "Appartement"
//           }
//USAGE:
// input parameter 1: options to convert (text file with one option id per line)
// input parameter 2: output file
// input parameter 3: (optional) use title as id (default false) Ex. "Eengezinswoning": "Eengezinswoning", "Appartement": "Appartement"
var fs = require('fs');
var path = require('path');
var filePath;
var outFile;

var useTitleId = false;
var colorList = [
"#FF9900",
"#FF0000",
"#800000",
"#FFFF00",
"#808000",
"#00FF00",
"#008000",
"#00FFFF",
"#008080",
"#0000FF",
"#000080",
"#FF00FF",
"#800080",
"#222222",
"#DDDDDD",
"#C0C0C0",
"#808080"]
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
        case 4: 
            useTitleId = true;
            printMsg = 'Use Title as id';
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
        var allIds = data;
        this.ConvertData(allIds);
    }else{
        console.log(err);
    }
});

//"options": {
 //               "0": "Eengezinswoning",
  //              "1": "Appartement"
   //         },

ConvertData = function (data) {
    var allIds = data.split('\n');
    var count = 0;
    var result = {};
    result['legend'] = {legendEntries: [], legendKind: "discretestrings", visualAspect: "fillColor", id: "", description: ""};
    result['options'] = {};
    allIds.forEach(function(opt) {
        if (useTitleId) {
            result['options'][opt] = opt;
        } else {
            result['options'][count.toFixed(0)] = opt;
        }
        result['legend']['legendEntries'].push( {sortKey: count, label: opt, stringValue: opt, color: colorList[count]})
        count+=1;
    });
    fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
    console.log('Generated options! ' + count);
};
						