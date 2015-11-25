//USAGE:
// input parameter 1: file to convert
// Converts a Marvel diagram (*.mrv) from the XML format to a JSON 
// structure that can be read by the MarvelWidget in csWeb.
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');

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
        var inputXml = data;
        baseFile = path.basename(filePath, '.mrv');
        outFile = baseFile + '.mrvjson';
        this.ConvertData(inputXml);
    } else {
        console.log(err);
    }
});


ConvertData = function(inputXml) {
    var parseNumbers = function(str) {
        if (!isNaN(str)) {
            str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
        }
        return str;
    };

    var jsonMarvel;
    var parser = new xml2js.Parser({
        trim: true,
        normalize: true,
        explicitArray: false,
        mergeAttrs: true,
        valueProcessors: [parseNumbers]
    });
    parser.parseString(inputXml, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            jsonMarvel = data;
        }
    });
    var result = this.FormatData(jsonMarvel);
    fs.writeFileSync(outFile, JSON.stringify(result));
    console.log('Output written to ' + outFile);
    console.log('done!');
};

FormatData = function(jsonMarvel) {
    var j = jsonMarvel; //JSON.parse(jsonMarvel);
    var webConns = [];
    var webVars = [];
    var store = j["Store"];
    var conns = store["Connectors"]["Connector"];
    conns.forEach(function(c) {
        var webConnector = {
            Name: c.Name,
            Description: c.Description,
            FromVariable: c.SourceId,
            ToVariable: c.SinkId,
            Center: {
                _x: Math.round(c.Center.X),
                _y: Math.round(c.Center.Y)
            },
            Speed: "c.Speed.Name",
            Strength: "c.Strength.Name",
            SpeedIndex: c.SpeedIndex,
            StrengthIndex: c.StrengthIndex
        }
        webConns.push(webConnector);
    });
    var vars = store["Variables"]["Variable"];
    vars.forEach(function(v) {
        var webVariable = {
            Name: v.Name,
            Id: v.Id,
            Description: v.Description,
            IsControl: v.IsControl,
            Value: v.InitialValue,
            Background: v.Background,
            Center: {
                _x: Math.round(v.Center.X),
                _y: Math.round(v.Center.Y)
            }
        }
        webVars.push(webVariable);
    });
    var result = {
        GetModelResult: {
            Connections: webConns,
            Variables: webVars
        }
    };
    return result;
};
