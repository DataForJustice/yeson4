COPY (SELECT
	id,
	total,
	white_nh as w,	
	black_nh + black_h as b,
	white_h + 
		ai_an_nh + asian_nh + hawaiian_nh + other_nh + two_nh + 
		ai_an_h + asian_h + hawaiian_h + other_h + two_h  as o 
FROM
	(SELECT
		"geo.id2" as id,
		coalesce (nullif (hd01_vd01, ''), '0')::numeric as total,
		coalesce (nullif (hd01_vd02, ''), '0')::numeric as total_nh,
		coalesce (nullif (hd01_vd03, ''), '0')::numeric as white_nh,
		coalesce (nullif (hd01_vd04, ''), '0')::numeric as black_nh,
		coalesce (nullif (hd01_vd05, ''), '0')::numeric as ai_an_nh,
		coalesce (nullif (hd01_vd06, ''), '0')::numeric as asian_nh,
		coalesce (nullif (hd01_vd07, ''), '0')::numeric as hawaiian_nh,
		coalesce (nullif (hd01_vd08, ''), '0')::numeric as other_nh,
		coalesce (nullif (hd01_vd09, ''), '0')::numeric as two_nh,
		coalesce (nullif (hd01_vd12, ''), '0')::numeric as total_h,
		coalesce (nullif (hd01_vd13, ''), '0')::numeric as white_h,
		coalesce (nullif (hd01_vd14, ''), '0')::numeric as black_h,
		coalesce (nullif (hd01_vd15, ''), '0')::numeric as ai_an_h,
		coalesce (nullif (hd01_vd16, ''), '0')::numeric as asian_h,
		coalesce (nullif (hd01_vd17, ''), '0')::numeric as hawaiian_h,
		coalesce (nullif (hd01_vd18, ''), '0')::numeric as other_h,
		coalesce (nullif (hd01_vd19, ''), '0')::numeric as two_h
	FROM
		blockgroups_hispanic h
		LEFT JOIN blockgroups b ON h."geo.id" = b.geoid 
		LEFT JOIN place p ON ST_Contains (p.wkb_geometry, b.wkb_geometry) AND p.name = 'Boston'
	) a
) TO '/tmp/blockgroups.race.csv' CSV HEADER;
