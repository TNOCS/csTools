rem First, clip the input data to an output folder (shapefile). 
rem Second, convert the shapefile to geojson (in wgs84).
rem Third, cap the coordinate precision from default (15) to 6 decimals.

rem Place this script and capCoordinatePrecision.js into the folder that contains the input files.
rem The clip shape should be called clip.json
rem Make sure ogr2ogr.exe and node.exe are added to the PATH variable, and then run this script.

for %%f in (*.json) do (
	IF "%%f"=="clip.json" (
    		ECHO Skip clip.json
	) ELSE (
		echo Processing %%f
		call ogr2ogr -clipsrc clip.json %%f_outshp %%f
		ogr2ogr -f GeoJSON -t_srs crs:84 %%f.geojson %%f_outshp\OGRGeoJSON.shp
    		call node capCoordinatePrecision.js %%f.geojson 5 %%f_capped.geojson
    		RD /S /Q %%f_outshp
		del /S &&f.geojson
	)
)




