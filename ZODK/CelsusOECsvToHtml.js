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
    var kvknumbers = {};
    var data = [];
    var outHtml = [];
    outHtml.push('<ul>');
    
    //Create a dictionary of the headers (key: headertitle, val: column index)
    var headers = {};
    lines[0].split(';').forEach(function(h, i) {
        headers[h] = i;
    });
    
    //Convert the csv-text to an array of objects
    for (var n = 1; n<lines.length; ++n) {
        var line = lines[n].split(';');
        if (line.length < 6) continue;
        var item = {
            // Link the header names to a column index
            plaatsnaam: line[headers['Plaats']].replace(/\'/g, '').toLowerCase(),
            naam: line[headers['oe_naam']].replace(/\'/g, '').replace(/\ +$/g, ''),
            c_kvk: line[headers['c_kvk']].replace(/\ +$/g, ''),
            nl: line[headers['link_oe_nl']],
            gemeente: line[headers['Gemeente']].replace(/\ +$/g, '')
        };
        kvknumbers[item['c_kvk']] = (line[headers['concern_naam']].replace(/\ +$/g, '').length > 1) ? this.formatName(line[headers['concern_naam']].replace(/(\'|\")/g, '')) : this.formatName(line[headers['c_naam']].replace(/(\'|\")/g, ''));
        data.push(item);
    }
    
    console.log(JSON.stringify(data));
    data.sort(function(a, b) { return (a.naam > b.naam)});
    
    var htmlblocks = {};
    var abc = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    Object.keys(kvknumbers).forEach(function (dig) {
        var htmlblock = '<li type="none" style="padding:0; margin:0;"><span style="padding: 5px; background-color:#B5A3C1;font-size: 1.3em; font-weight: bold;">'+kvknumbers[dig]+'</span><ul>';
        data.forEach(function(d){
            if (d.c_kvk === dig) {
                d.plaatsnaam = this.formatName(d.plaatsnaam);
                d.gemeente = this.formatName(d.gemeente.toLowerCase());
                htmlblock += '<li><a target="_blank" href="'+d.nl+'">'+d.naam+', '+d.gemeente+'</a></li>';
            }
        });
        htmlblock += '</ul></li>';
        htmlblocks[kvknumbers[dig]] = htmlblock;
    });
    
    var stichtings = Object.keys(htmlblocks);
    stichtings.sort();
    stichtings.forEach(function(s) {
        outHtml.push(htmlblocks[s]);
    });
    
    outHtml.push('</ul>');
    
    return outHtml;
};
