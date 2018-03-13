// Creates propTypes from a dictionary of val:key parameters
// {
//              "Eengezinswoning": "a",
//              "Appartement": "b",
//              "Flat": etc.
//  }
//USAGE:
// input parameter 1: dictionary to generate propertyTypes for
// input parameter 2: output file
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
        var allIds = JSON.parse(data);
        this.ConvertData(allIds);
    }else{
        console.log(err);
    }
});

ConvertData = function (data) {
    var count = 0;
    var result = {};
    result['propertyTypeData'] = {};
    result['propertyTypeKeys'] = "";
    Object.keys(data).forEach(function(propVal) {
		var propKey = data[propVal];
        result['propertyTypeData'][propKey] = {
			"label": propKey,
			"title": propVal,
			"visibleInCallout": true,
			"type": "number",
			"description": propVal
		};
		result['propertyTypeKeys'] = result['propertyTypeKeys'].concat(propKey).concat(";");
        count+=1;
    });
    fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
    console.log('Generated propertTypes! ' + count);
};
						