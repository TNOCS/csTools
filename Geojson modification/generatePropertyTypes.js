//USAGE:
// input parameter 1: semicolon-separated file of propertytype labels
// input parameter 2: output file
// input parameter 3: (optional) section
//
// This tool generate an array of property type data
var fs = require('fs');
var path = require('path');
var inputString;
var section;
var propData = {};
var outFile;

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
            inputString = val;
            printMsg = 'Input string: ' + inputString;
            break;
        case 3: 
            outFile = path.join(__dirname, val);
            printMsg = 'Output file: ' + outFile;
            break;
		case 4: 
            section = val;
            printMsg = 'Section: ' + section;
            break;
        default:
            printMgs = 'Additional parameter ignored';
            break;            
    }
    if (printMsg) console.log(printMsg);
});

GenerateData = function () {
	var inputArray = inputString.split(';');
	inputArray.forEach(function (value) {
		var pt = {}; 
		pt['label'] = value;
		pt['title'] = value;
		pt['type'] = 'text';
		pt['visibleInCallOut'] = true;
		if (section != null) pt['section'] = section;
		propData[value] = pt;
	});
	
    fs.writeFileSync(outFile, JSON.stringify(propData));
    console.log("Created " + Object.keys(propData).length + " properties");
    console.log('done!');
};

GenerateData();
