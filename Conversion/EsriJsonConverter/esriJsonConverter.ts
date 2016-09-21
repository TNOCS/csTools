import fs = require('fs');
import path = require('path');

if (process.argv.length < 3) {
    console.log('Too few input arguments')
    exit();
};

var esri;
var geo;
fs.readFile(process.argv[2], 'utf8', (err, data) => {
    if (err) return;
    esri = JSON.parse(data);
    geo = new esriJsonConverter.esriJsonConverter().toGeoJson(esri);
    fs.writeFileSync(process.argv[3], JSON.stringify(geo, null, 2));
});

module esriJsonConverter {
    export class esriJsonConverter {

        /*determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
          or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
          points-are-in-clockwise-order*/
        public ringIsClockwise(ringToTest) {
            var total = 0, i = 0,
                rLength = ringToTest.length,
                pt1 = ringToTest[i],
                pt2;
            for (i; i < rLength - 1; i++) {
                pt2 = ringToTest[i + 1];
                total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
                pt1 = pt2;
            }
            return (total >= 0);
        }

        public esriCon = {};

        /*Converts ESRI Rest Geometry to GeoJSON Geometry
          Input is ESRI Rest Geometry Object*/
        public esriGeometryToGcGeometry(esriGeom) {
            var gcGeom,
                i,
                g,
                coordinates,
                geomType,
                geomParts,
                polyArray,
                ringArray,
                ring;

            //check for x, points, paths, or rings to determine geometry type.
            if (esriGeom) {
                //gcGeom = {};
                if (((esriGeom.x && esriGeom.x !== "NaN") || esriGeom.x === 0) &&
                    ((esriGeom.y && esriGeom.y !== "NaN") || esriGeom.y === 0)) {
                    geomType = "Point";
                    coordinates = [esriGeom.x, esriGeom.y];
                } else if (esriGeom.points && esriGeom.points.length) {
                    geomType = "MultiPoint";
                    coordinates = esriGeom.points;
                } else if (esriGeom.paths && esriGeom.paths.length) {
                    geomParts = esriGeom.paths;
                    if (geomParts.length === 1) {
                        geomType = "LineString";
                        coordinates = geomParts[0];
                    } else {
                        geomType = "MultiLineString";
                        coordinates = geomParts;
                    }
                } else if (esriGeom.rings && esriGeom.rings.length) {
                    //array to hold the individual polygons. A polygon is an outer ring with one or more inner rings
                    //the conversion logic assumes that the Esri json is in the format of an outer ring (clockwise)
                    //followed by inner rings (counter-clockwise) with a clockwise ring signalling the start of a new polygon
                    polyArray = [];
                    geomParts = esriGeom.rings;
                    for (i = 0; i < geomParts.length; i++) {
                        ring = geomParts[i];
                        if (this.ringIsClockwise(ring)) {
                            //outer ring so new polygon. Add to poly array
                            polyArray.push([ring]);
                        } else if (polyArray.length > 0) {
                            //inner ring. Add as part of last polygon in poly array
                            polyArray[polyArray.length - 1].push(ring);
                        }
                    }
                    if (polyArray.length > 1) {
                        //MultiPolygon. Leave coordinates wrapped in outer array
                        coordinates = polyArray;
                        geomType = "MultiPolygon";
                    } else {
                        //Polygon. Remove outer array wrapper.
                        coordinates = polyArray.pop();
                        geomType = "Polygon";
                    }
                }
                gcGeom = (coordinates && geomType) ? { type: geomType, coordinates: coordinates } : null;
                return gcGeom;
                //gcGeom.coordinates = coordinates;
            }
            return gcGeom;
        }

        /*
         * Converts GeoJSON feature to ESRI REST Feature.
         * Input parameter is an ESRI Rest Feature object
         */
        public esriFeatureToGcFeature(esriFeature) {
            var gcFeat = null,
                prop,
                gcProps,
                i,
                p;
            if (esriFeature) {
                gcFeat = {
                    type: "Feature"
                };
                if (esriFeature.geometry) {
                    gcFeat.geometry = this.esriGeometryToGcGeometry(esriFeature.geometry);
                }
                if (esriFeature.attributes) {
                    gcProps = {};
                    p = esriFeature.attributes;
                    for (prop in esriFeature.attributes) {
                        gcProps[prop] = esriFeature.attributes[prop];
                    }
                    gcFeat.properties = gcProps;
                }
            }
            return gcFeat;
        }

        /*Converts ESRI Rest Featureset, Feature, or Geometry
          to GeoJSON FeatureCollection, Feature, or Geometry */
        public toGeoJson(esriObject) {
            var outObj, i, esriFeats, gcFeat;
            if (esriObject) {
                if (esriObject.features) {
                    outObj = {
                        type: "FeatureCollection",
                        features: []
                    };
                    esriFeats = esriObject.features;
                    for (i = 0; i < esriFeats.length; i++) {
                        gcFeat = this.esriFeatureToGcFeature(esriFeats[i]);
                        if (gcFeat) {
                            outObj.features.push(gcFeat);
                        }
                    }
                }
                else if (esriObject.geometry) {
                    outObj = this.esriFeatureToGcFeature(esriObject);
                }
                else {
                    outObj = this.esriGeometryToGcGeometry(esriObject);
                }
            }
            return outObj;
        };



        /************************************************
         * GeoJSON to ESRI Rest Converter
         ************************************************/

        public gCon = {};

        /*compares a GeoJSON geometry type and ESRI geometry type to see if they can be safely
          put together in a single ESRI feature. ESRI features must only have one
          geometry type, point, line, polygon*/
        public isCompatible(esriGeomType, gcGeomType) {
            var compatible = false;
            if ((esriGeomType === "esriGeometryPoint" || esriGeomType === "esriGeometryMultipoint") && (gcGeomType === "Point" || gcGeomType === "MultiPoint")) {
                compatible = true;
            } else if (esriGeomType === "esriGeometryPolyline" && (gcGeomType === "LineString" || gcGeomType === "MultiLineString")) {
                compatible = true;
            } else if (esriGeomType === "esriGeometryPolygon" && (gcGeomType === "Polygon" || gcGeomType === "MultiPolygon")) {
                compatible = true;
            }
            return compatible;
        }

        /*Take a GeoJSON geometry type and make an object that has information about
          what the ESRI geometry should hold. Includes the ESRI geometry type and the name
          of the member that holds coordinate information*/
        public gcGeomTypeToEsriGeomInfo(gcType) {
            var esriType,
                geomHolderId;
            if (gcType === "Point") {
                esriType = "esriGeometryPoint";
            } else if (gcType === "MultiPoint") {
                esriType = "esriGeometryMultipoint";
                geomHolderId = "points";
            } else if (gcType === "LineString" || gcType === "MultiLineString") {
                esriType = "esriGeometryPolyline";
                geomHolderId = "paths";
            } else if (gcType === "Polygon" || gcType === "MultiPolygon") {
                esriType = "esriGeometryPolygon";
                geomHolderId = "rings";
            }
            return {
                type: esriType,
                geomHolder: geomHolderId
            };
        }

        /*Convert GeoJSON polygon coordinates to ESRI polygon coordinates.
          GeoJSON rings are listed starting with a singular outer ring. ESRI
          rings can be listed in any order, but unlike GeoJSON, the ordering of
          vertices determines whether it's an outer or inner ring. Clockwise
          vertices indicate outer ring and counter-clockwise vertices indicate
          inner ring */
        public gcPolygonCoordinatesToEsriPolygonCoordinates(gcCoords) {
            var i,
                len,
                esriCoords = [],
                ring;
            for (i = 0, len = gcCoords.length; i < len; i++) {
                ring = gcCoords[i];
                // Exclusive OR.
                if ((i == 0) != this.ringIsClockwise(ring)) {
                    ring = ring.reverse();
                }
                esriCoords.push(ring);
            }
            return esriCoords;
        }

        /*Wraps GeoJSON coordinates in an array if necessary so code can iterate
          through array of points, rings, or lines and add them to an ESRI geometry
          Input is a GeoJSON geometry object. A GeoJSON GeometryCollection is not a
          valid input */
        public gcCoordinatesToEsriCoordinates(gcGeom) {
            var i,
                len,
                esriCoords;
            if (gcGeom.type === "MultiPoint" || gcGeom.type === "MultiLineString") {
                esriCoords = gcGeom.coordinates;
            } else if (gcGeom.type === "Point" || gcGeom.type === "LineString") {
                esriCoords = [gcGeom.coordinates];
            } else if (gcGeom.type === "Polygon") {
                esriCoords = this.gcPolygonCoordinatesToEsriPolygonCoordinates(gcGeom.coordinates);
            } else if (gcGeom.type === "MultiPolygon") {
                esriCoords = [];
                for (i = 0, len = gcGeom.coordinates.length; i < len; i++) {
                    esriCoords.push(this.gcPolygonCoordinatesToEsriPolygonCoordinates(gcGeom.coordinates[i])[0]);
                }
            }
            return esriCoords;
        }

        /*Converts GeoJSON geometry to ESRI geometry. The ESRI geometry is
          only allowed to contain one type of geometry, so if the GeoJSON
          geometry is a GeometryCollection, then only geometries compatible
          with the first geometry type in the collection are added to the ESRI geometry
    
          Input parameter is a GeoJSON geometry object.*/
        public gcGeometryToEsriGeometry(gcGeom) {
            var esriGeometry,
                esriGeomInfo,
                gcGeometriesToConvert,
                i,
                g,
                coords;

            //if geometry collection, get info about first geometry in collection
            if (gcGeom.type === "GeometryCollection") {
                gcGeometriesToConvert = [gcGeom.geometries.shift()];
                esriGeomInfo = this.gcGeomTypeToEsriGeomInfo(gcGeometriesToConvert[0].type);

                //loop through collection and only add compatible geometries to the array
                //of geometries that will be converted
                for (i = 0; i < gcGeom.geometries.length; i++) {
                    if (this.isCompatible(esriGeomInfo.type, gcGeom.geometries[i].type)) {
                        gcGeometriesToConvert.push(gcGeom.geometries[i]);
                    }
                }
            } else {
                esriGeomInfo = this.gcGeomTypeToEsriGeomInfo(gcGeom.type);
                gcGeometriesToConvert = [gcGeom];
            }

            //if a collection contained multiple points, change the ESRI geometry
            //type to MultiPoint
            if (esriGeomInfo.type === "esriGeometryPoint" && gcGeometriesToConvert.length > 1) {
                esriGeomInfo = this.gcGeomTypeToEsriGeomInfo("MultiPoint");
            }

            //make new empty ESRI geometry object
            esriGeometry = {
                //type: esriGeomInfo.type,
                spatialReference: {
                    wkid: 4326
                }
            };

            //perform conversion
            if (esriGeomInfo.type === "esriGeometryPoint") {
                if (gcGeometriesToConvert[0].coordinates.length === 0) {
                    esriGeometry.x = null;
                    esriGeometry.y = null;
                } else {
                    esriGeometry.x = gcGeometriesToConvert[0].coordinates[0];
                    esriGeometry.y = gcGeometriesToConvert[0].coordinates[1];
                }
            } else {
                esriGeometry[esriGeomInfo.geomHolder] = [];
                for (i = 0; i < gcGeometriesToConvert.length; i++) {
                    coords = this.gcCoordinatesToEsriCoordinates(gcGeometriesToConvert[i]);
                    for (g = 0; g < coords.length; g++) {
                        esriGeometry[esriGeomInfo.geomHolder].push(coords[g]);
                    }
                }
            }
            return esriGeometry;
        }

        /*Converts GeoJSON feature to ESRI REST Feature.
          Input parameter is a GeoJSON Feature object*/
        public gcFeatureToEsriFeature(gcFeature) {
            var esriFeat,
                prop,
                esriAttribs;
            if (gcFeature) {
                esriFeat = {};
                if (gcFeature.geometry) {
                    esriFeat.geometry = this.gcGeometryToEsriGeometry(gcFeature.geometry);
                }
                if (gcFeature.properties) {
                    esriAttribs = {};
                    for (prop in gcFeature.properties) {
                        esriAttribs[prop] = gcFeature.properties[prop];
                    }
                    esriFeat.attributes = esriAttribs;
                }
            }
            return esriFeat;
        }

        /*Converts GeoJSON FeatureCollection, Feature, or Geometry
          to ESRI Rest Featureset, Feature, or Geometry*/
        public toEsri(geoJsonObject) {
            var outObj,
                i,
                gcFeats,
                esriFeat;
            if (geoJsonObject) {
                if (geoJsonObject.type === "FeatureCollection") {
                    outObj = {
                        features: []
                    };
                    gcFeats = geoJsonObject.features;
                    for (i = 0; i < gcFeats.length; i++) {
                        esriFeat = this.gcFeatureToEsriFeature(gcFeats[i]);
                        if (esriFeat) {
                            outObj.features.push(esriFeat);
                        }
                    }
                }
                else if (geoJsonObject.type === "Feature") {
                    outObj = this.gcFeatureToEsriFeature(geoJsonObject);
                }
                else {
                    outObj = this.gcGeometryToEsriGeometry(geoJsonObject);
                }
            }
            return outObj;
        };


        /*
            if (typeof define === 'function') {
                var module = {
                    esriConverter: esriConverter,
                    geoJsonConverter: geoJsonConverter
                };
     
                define([], function() {
     
                    return module;
     
                });
            } else {
                root.esriConverter = esriConverter;
                root.geoJsonConverter = geoJsonConverter;
            }*/

    }
}