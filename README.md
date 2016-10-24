# Methodology
1. Download data: 
	1. Census' 2010-2014 American Community Survey 5-Year Estimate, hispanic origin data from all blockgroups in Suffolk County, MA
	2. Census' TIGER/Line shapefiles:
		1. Places in Massachusetts
		2. Blockgroups in Massachusetts
	3. City of Boston's Open Data Portal Crime Incident Report (Aug, 2015 - To date)
		wget "https://data.cityofboston.gov/api/views/fqn4-4qap/rows.csv?accessType=DOWNLOAD" data/sources/incidents.csv ; ogr2ogr -f "PGDump" -nln incidents data/sources/incidents.sql data/sources/incidents.csv ; psql -t -q -d yesonfour -f data/sources/incidents.sql 
	
	4. http://factfinder.census.gov/bkmk/cf/1.0/en/place/Boston city, Massachusetts/ALL
2. Get all the data into PostgreSQL database using GDAL's ogr2ogr wonderful tool.
3. To get the blockgroups that are inside Boston only into blockgroups.json file, run: 
	* psql -t -q -d yesonfour -f data/scripts/blockgroups/blockgroups.sql | topojson -p -q 1e5 -o data/blockgroups.json
4. To get the grid into the data/grid.json, run:
	* psql -t -q -d yesonfour -f data/scripts/grid.sql  | topojson -p -q 1e5 -o data/grid.json
5. Get the data for Class D incidents by grid point 
	* psql -t -q -d yesonfour -f data/scripts/marijuana.incidents.sql ; mv /tmp/incidents.csv data/
6. Get the racial data for every blockgroup
	* psql -t -q -d yesonfour -f data/scripts/blockgroups.race.sql ; mv /tmp/blockgroups.race.csv data/
