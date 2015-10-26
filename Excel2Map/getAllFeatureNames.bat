rem For each json file in the folder, a list of the 'Name' property of all features is created. E.g., useful for listing all items (Provinces, municipalities) in a excel2map template.

for %%f in (*.json) do (
	echo Processing %%f
    call node getAllFeatureNames.js %%f
)



