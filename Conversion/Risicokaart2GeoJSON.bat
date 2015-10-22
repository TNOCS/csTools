rem First, convert the input data to geojson, reprojecting from RD to wgs84.
rem Second, cap the coordinate precision from default (15) to 6 decimals.
rem Third, add the area border to each location (if availabled).

rem Steps to reproduce: source data should be a shapefile with RD coordinates downloaded from risicokaart.nl Download hazardous objects and their boundaries, and place all of them in one single folder. Terreingrenzen should be named rgs_irg_lok_pub.shp  &  GevaarlijkeStoffen should be named rgs_irg_pos_pub.shp (or change their coorect filenames in this script).
rem Then place this script, capCoordinatePrecision.js and addContour.js into that folder. 
rem Make sure ogr2ogr.exe and node.exe are added to the PATH variable and run this script.

for %%f in (*.shp) do (
	echo Processing %%f
	call ogr2ogr -f GeoJSON -t_srs EPSG:4296 -s_srs EPSG:28992 %%f_out.json %%f
    call node capCoordinatePrecision.js %%f_out.json 6  %%f_capped.json
    del %%f_out.json
)

call node addContour.js rgs_irg_pos_pub.shp_capped.json rgs_irg_lok_pub.shp_capped.json HazardousLocationsWithContours.json RRGS_ID RRGS_ID



