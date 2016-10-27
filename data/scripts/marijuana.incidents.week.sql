COPY 
(SELECT distinct 
	grid,
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
		AND to_char ("occurred on date"::timestamp,'YYYYIW') = to_char (current_date, 'YYYYIW')

	) a
GROUP BY
	grid
) TO '/tmp/incidents.week.csv' CSV HEADER 
