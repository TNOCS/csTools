rem First, convert the input data to geojson, reprojecting from RD to wgs84.
rem Second, clip to the bounds of clip.json
rem Third, cap the coordinate precision from default (15) to 6 decimals.
rem Fourth, add the area border to each location (if availabled).

rem Steps to reproduce: source data should be a shapefile with RD coordinates downloaded from risicokaart.nl Download hazardous objects and their boundaries, and place all of them in one single folder. Terreingrenzen should be named rgs_irg_lok_pub.shp  &  GevaarlijkeStoffen should be named rgs_irg_pos_pub.shp (or change their coorect filenames in this script).
rem Then place this script, capCoordinatePrecision.js and addContour.js into that folder. 
rem Make sure ogr2ogr.exe and node.exe are added to the PATH variable and run this script.

for %%f in (*.shp) do (
	echo Processing %%f
    del conv_%%f.json
    del clip_%%f.json
	call ogr2ogr -f GeoJSON -t_srs EPSG:4326 -s_srs EPSG:28992 conv_%%f.json %%f
    call ogr2ogr -clipsrc clip.json -f GeoJSON clip_%%f.json conv_%%f.json
    call node capCoordinatePrecision.js clip_%%f.json 6 capped_%%f.json
    del conv_%%f.json
    del clip_%%f.json
)

del HazardousLocationsWithContours.json
call node decodeUriProperty.js HazardousLocationsWithContours.json HazardousLocationsWithContours.json
call node addContour.js capped_rgs_irg_pos_pub.shp.json capped_rgs_irg_lok_pub.shp.json HazardousLocationsWithContours.json RRGS_ID RRGS_ID
call node addProperty.js HazardousLocationsWithContours.json HazardousLocationsWithContours.json featureTypeId "HazObj_{state}"
call node addProperty.js HazardousLocationsWithContours.json HazardousLocationsWithContours.json _dep_water 0.2
call node renameProperty.js HazardousLocationsWithContours.json HazardousLocationsWithContours.json NAAM_INR17 Name


