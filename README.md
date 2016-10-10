# Methodology
1. Download data: 
	1. Census' American Fact Finder 2014 racial and hispanic origin data from all blockgroups in Suffolk County, MA
	2. Census' TIGER/Line shapefiles:
		1. Places in Massachusetts
		2. Blockgroups in Massachusetts
	3. City of Boston's Open Data Portal Crime Incident Report (Aug, 2015 - To date)
2. Get all the data into PostgreSQL database using GDAL's ogr2ogr wonderful tool.
3. To get the blockgroups that are inside Boston only into blockgroups.json file, run: 
	* psql -t -q -d yesonfour -f data/scripts/blockgroups/blockgroups.sql | topojson -p -q 1e5 -o data/blockgroups.json
4. To get the grid into the data/grid.json, run:
	* psql -t -q -d yesonfour -f data/scripts/grid.sql  | topojson -p -q 1e5 -o data/grid.json
5. Get the data for Class D incidents by grid point 
