//USAGE:
// input parameter 1: file to get all features from
//
// Writes a csv file containing a list of names of all the 
// features that exist in the supplied json file.

var fs = require('fs');
var path = require('path');
var filePath;
var outFile;

var printMsg;
if (process.argv.length < 3) {
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
        default:
            printMgs = 'Additional parameter ignored';
            break;            
    }
    if (printMsg) console.log(printMsg);
});


fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (!err){
        console.log('Received data successfully');
        var inJson = JSON.parse(data);
        outFile = filePath.split('.').shift() + '.csv';
        this.ConvertData(inJson);
    }else{
        console.log(err);
    }
});


ConvertData = function (data) {
    var list = [];
    data.features.forEach(function(f){
        list.push(f.properties.Name);
    });
    var csvContent = list.join('\n');
    fs.writeFileSync(outFile, csvContent);
    console.log('done!');
};
						