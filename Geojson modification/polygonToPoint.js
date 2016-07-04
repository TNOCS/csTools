//USAGE:
// input parameter 1: inputfile containing polygon features 
// input parameter 2: output file
//
// This tool will convert the geometry of polygon features to point features based on a centroid approximation. The original
// polygon will be added as contour property
var fs = require('fs');
var path = require('path');
var filePath;
var rcName;
var outFile;
var inProp;
var contProp;

var ptArray = [];
var ptObj = {};
var ptKeys = '';
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



// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(callback, initialValue) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    }
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    var t = Object(this), len = t.length >>> 0, k = 0, value;
    if (arguments.length == 2) {
      value = arguments[1];
    } else {
      while (k < len && !(k in t)) {
        k++; 
      }
      if (k >= len) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      value = t[k++];
    }
    for (; k < len; k++) {
      if (k in t) {
        value = callback(value, t[k], k, t);
      }
    }
    return value;
  };
}

fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (!err){
        console.log('Received data successfully');
        var inputJson = JSON.parse(data);
        this.ConvertData(inputJson);
    }else{
        console.log(err);
    }
});


ConvertData = function (inputJson) {
    outObj['type'] = "FeatureCollection";
    outObj['features'] = [];
    inputJson.features.forEach(function(f_in) {
        if (f_in.geometry['type'].toLowerCase() == 'polygon' || f_in.geometry['type'].toLowerCase() == 'multipolygon') {
            f_in.properties['contour'] = JSON.stringify(f_in.geometry);
            f_in.geometry = getCentroid(f_in.geometry.coordinates);
        }
        outObj.features.push(f_in);
    });
    fs.writeFileSync(outFile, JSON.stringify(outObj));
    console.log('Found ' + inputJson.features.length);
    console.log('done!');
};


/** Get the approximate centroid of a polygon by averaging the coordinates of its vertices. */
getCentroid = function (arr) {
    if (!arr || arr.length === 0)
        return { type: 'Point', coordinates: [0, 0] };
    if (arr[0].constructor === Array) {
        if (arr[0][0].constructor === Array) {
            if (arr[0][0][0].constructor === Array) {
                console.log("arr[0][0][0]");
                var all = [];
                arr.forEach(function (part) {
                    all = all.concat(part[0]);
                });
                arr = all;
            }
            else {
                console.log("arr[0][0]");
                arr = arr[0];
            }
        } else {
            console.log("arr[0]");
        }
    } else {
        console.log(arr);
        return { type: 'Point', coordinates: [0, 0] };
    }
    // http://stackoverflow.com/questions/22796520/finding-the-center-of-leaflet-polygon
    console.log(" " + arr.length + " " + (arr.constructor === Array ? "True" : "False"));
    var centroid = arr.reduce(function (x, y) {
        return [x[0] + y[0] / arr.length, x[1] + y[1] / arr.length];
    }, [0, 0]);
    return { type: 'Point', coordinates: centroid };
};
