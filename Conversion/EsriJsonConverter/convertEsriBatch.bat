for %%f in (*.json) do (
                echo Processing %%f
		call node esriJsonConverter.js %%f %%f.geojson
                call ogr2ogr -f GeoJSON -lco COORDINATE_PRECISION=6 -t_srs EPSG:4326 -s_srs EPSG:28992 %%f_wgs84.geojson %%f.geojson
		del %%f.geojson
    )
