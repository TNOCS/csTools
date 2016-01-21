// USAGE:
// input parameter 1: file to convert
//
// PURPOSE:
// Converts a csv-table with care facility names and links to Celsus reports, to an html list.
// 
// WARNING: When saving an Excel-sheet to csv using MS-Excel, probably the line-endings
// are Windows style and the decoding is ANSI. Convert this first to Unix line-endings 
// and to UTF-8 text encoding before using this converter. 
//
var fs = require('fs');
var path = require('path');

var filePath;
var baseFile;
var outFile;

var ptArray = [];
var ptObj = {};
var ptKeys = '';
var resourceOut = {};

var printMsg;
if (process.argv.length < 3) {
    console.log('Too few input parameters. Exiting...');
    process.exit();
}
process.argv.forEach(function(val, index, array) {
    switch (index) {
        case 0:
        case 1:
            break;
        case 2:
            filePath = path.join(__dirname, val);
            printMsg = 'Input file: ' + filePath;
            break;
        default:
            printMsg = 'Additional parameter ignored';
            break;
    }
    if (printMsg) console.log(printMsg);
});


fs.readFile(filePath, {
    encoding: 'utf-8'
}, function(err, data) {
    if (!err) {
        console.log('Received data successfully');
        var input = data;
        baseFile = path.basename(filePath, '.csv');
        outFile = baseFile + '.txt';
        this.ConvertData(input);
    } else {
        console.log(err);
    }
});


ConvertData = function(input) {
    var result = this.FormatData(input);
    fs.writeFileSync(outFile, result.join('\n'));
    console.log('Output written to ' + outFile);
    console.log('done!');
};


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Sets camel case to names seperated by a space or dash
// e.g. baarle-nassau => Baarle-Nassau
// e.g. den haag => Den Haag
// e.g. amsterdam => Amsterdam
formatName = function (name) {
    if (name.indexOf(' ') > -1) {
        var parts = name.split(' ');
        parts.forEach(function(p, index) { parts[index] = p.capitalize(); });
        name = parts.join(' ');
    } else if (name.indexOf('-') > -1) {
        var parts = name.split('-');
        parts.forEach(function(p, index) { parts[index] = p.capitalize(); });
        name = parts.join('-');
    } else {
        name = name.capitalize();
    }
    return name;
}

FormatData = function(jsondata) {
    var j = jsondata;
    var lines = j.split('\n');
    var data = [];
    var outHtml = [];
    outHtml.push('<ul>');
    
    //Create a dictionary of the headers (key: headertitle, val: column index)
    var headers = {};
    lines[0].split(';').forEach(function(h, i) {
        headers[h] = i;
    });
    
    //Convert the csv-text to an array of objects
    for (var n = 1; n<lines.length; n++) {
        var line = lines[n].split(';');
        if (line.length < 6) continue;
        var item = {
            // Link the header names to a column index
            plaatsnaam: line[headers['plaatsnaam']].replace(/\'/g, '').toLowerCase(),
            naam: line[headers['Naam']].replace(/\'/g, ''),
            nl: line[headers['Financieel-kwaliteit rapport (NL)']],
            en: line[headers['Financial-Quality Benchmark report (EN)']],
            de: line[headers['Finanziel-Qualität Benchmarking-Gutachten (DE)']]
        };
        data.push(item);
    }
    
    console.log(JSON.stringify(data));
    
    var abc = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    abc.forEach(function (dig) {
        outHtml.push('<li type="none" style="padding:0; margin:0;"><span style="padding: 10px; background-color:#B5A3C1;font-size: 1.5em; font-weight: bold;">'+dig.toUpperCase()+'</span><ul>');
        data.forEach(function(d){
            if (d.plaatsnaam[0] === dig) {
                d.plaatsnaam = this.formatName(d.plaatsnaam);
                outHtml.push('<li><a target="_blank" href="'+d.en+'"><img src="http://www.zorgopdekaart.nl/files/2015-11/englishflag.png" style="vertical-align:middle"></a>  <a target="_blank" href="'+d.de+'"><img src="http://www.zorgopdekaart.nl/files/2015-11/germanflag.png" style="vertical-align:middle"></a>  '+'<a target="_blank" href="'+d.nl+'">'+d.naam+', '+d.plaatsnaam+'</a></li>');
            }
        });
        outHtml.push('</ul></li>');
    });
    
    outHtml.push('</ul>');
    
    return outHtml;
};
