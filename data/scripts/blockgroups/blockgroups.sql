SELECT
	row_to_json (c)
FROM
	(SELECT
		'FeatureCollection' as type,
		array_to_json (array_agg (b)) as features
	FROM
		(SELECT
			'Feature' as type,
			ST_AsGeoJson (wkb_geometry)::json as geometry,
			(WITH data (id) AS (VALUES (a.id)) SELECT row_to_json (data) FROM data) as properties
		FROM
			(SELECT
				b.geoid as id,
				ST_Intersection (p.wkb_geometry, b.wkb_geometry) as wkb_geometry
			FROM 
				blockgroups b,
				place p
			WHERE
				ST_Contains (p.wkb_geometry, b.wkb_geometry)
				AND p.name = 'Boston'
			) as a
		) as b
	) as c
