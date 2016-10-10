COPY 
(SELECT distinct 
	grid,
	code,
	count (*)
FROM
	(
	SELECT 
		"offense code" as code,
		(
			SELECT 
				id 
			FROM 
				boston_grid grid 
			ORDER BY 
				grid.geom <-> ST_FlipCoordinates (ST_SetSRID (ST_MakePoint (coalesce (nullif (lat, ''), '0')::numeric, coalesce (nullif (long, ''), '0')::numeric), 4326))
			LIMIT 1
		) as grid
	FROM
		incidents
	WHERE
		lat != '' AND long != ''
		AND "offense code" IN ('01845', '01848')
	) a
GROUP BY
	grid,
	code
) TO '/tmp/incidents.csv' CSV HEADER 
