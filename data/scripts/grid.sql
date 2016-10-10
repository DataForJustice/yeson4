CREATE OR REPLACE FUNCTION makegrid (geometry, integer) RETURNS geometry AS
	'
	SELECT 
		ST_Collect(st_SetSRID(ST_POINT(x/1000000::float,y/1000000::float), ST_SRID($1))) 
	FROM 
		generate_series(floor(ST_Xmin($1)*1000000)::int, ceiling(ST_Xmax($1)*1000000)::int,$2) as x,
		generate_series(floor(ST_Ymin($1)*1000000)::int, ceiling(ST_Ymax($1)*1000000)::int,$2) as y 
	WHERE st_intersects($1,ST_SetSRID(ST_POINT(x/1000000::float,y/1000000::float),ST_SRID($1)))
	'
LANGUAGE SQL;
DROP TABLE IF EXISTS boston_grid;
CREATE TABLE boston_grid AS 
	SELECT
		(b.geom).path [1] as id, 
		(b.geom).geom as geom
	FROM
		(SELECT 
			ST_Dump (makegrid (ST_Union (geom), 4000)) as geom 
		FROM
			(SELECT
				b.geoid as id,
				b.wkb_geometry as geom
			FROM 
				blockgroups b,
				place p
			WHERE
				ST_Contains (p.wkb_geometry, b.wkb_geometry)
				AND p.name = 'Boston'
			) as a
		) b
;
SELECT
	row_to_json (c)
FROM
	(SELECT
		'FeatureCollection' as type,
		array_to_json (array_agg (b)) as features
	FROM
		(SELECT
			'Feature' as type,
			ST_AsGeoJson (geom)::json as geometry,
			(WITH data (id) AS (VALUES (a.id)) SELECT row_to_json (data) FROM data) as properties
		FROM
			(SELECT
				id, 
				geom
			FROM 
				boston_grid
			) as a
		) as b
	) as c
