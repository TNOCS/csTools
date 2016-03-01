@echo off
rem First, clip the input data (e.g. a country) to a smaller region (geojson).
rem Second, cap the coordinate precision from default (15) to 5 decimals.

rem Place this script and capCoordinatePrecision.js into the folder that contains the input files.
rem The clip shape should be called clip.json
rem Make sure ogr2ogr.exe and node.exe are added to the PATH variable, and then run this script.

for %%f in (*.json) do (
	IF "%%f"=="clip.json" (
    		ECHO Skip clip.json
	) ELSE (
		echo Processing %%f
		call ogr2ogr -clipsrc clip.json -f GeoJSON %%f.geojson %%f
    	call node capCoordinatePrecision.js %%f.geojson 5 capped_%%f
		del /S %%f.geojson
	)
)






