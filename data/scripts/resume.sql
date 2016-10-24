SELECT
	sum (coalesce (nullif (hd01_vd01, ''), '0')::numeric) as count,
	sum (coalesce (nullif (hd01_vd02, ''), '0')::numeric) as total_nh,
	sum (coalesce (nullif (hd01_vd03, ''), '0')::numeric) as white_nh,
	sum (coalesce (nullif (hd01_vd04, ''), '0')::numeric) as black_nh,
	sum (coalesce (nullif (hd01_vd05, ''), '0')::numeric) as ai_an_nh,
	sum (coalesce (nullif (hd01_vd06, ''), '0')::numeric) as asian_nh,
	sum (coalesce (nullif (hd01_vd07, ''), '0')::numeric) as hawaiian_nh,
	sum (coalesce (nullif (hd01_vd08, ''), '0')::numeric) as other_nh,
	sum (coalesce (nullif (hd01_vd09, ''), '0')::numeric) as two_nh,
	sum (coalesce (nullif (hd01_vd12, ''), '0')::numeric) as total_h,
	sum (coalesce (nullif (hd01_vd13, ''), '0')::numeric) as white_h,
	sum (coalesce (nullif (hd01_vd14, ''), '0')::numeric) as black_h,
	sum (coalesce (nullif (hd01_vd15, ''), '0')::numeric) as ai_an_h,
	sum (coalesce (nullif (hd01_vd16, ''), '0')::numeric) as asian_h,
	sum (coalesce (nullif (hd01_vd17, ''), '0')::numeric) as hawaiian_h,
	sum (coalesce (nullif (hd01_vd18, ''), '0')::numeric) as other_h,
	sum (coalesce (nullif (hd01_vd19, ''), '0')::numeric) as two_h
FROM
	blockgroups_hispanic h
	LEFT JOIN blockgroups b ON h."geo.id2" = b.geoid 
	LEFT JOIN place p ON ST_Contains (p.wkb_geometry, b.wkb_geometry)
WHERE
	p.name = 'Boston'
