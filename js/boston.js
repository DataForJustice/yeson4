var cityParse = function (city, year, data) {
	var parse = [];
	parse.push ({ 
		"control_chart": "b_sunburst", 
		"quantify": "cities", 
		"quantifier": "cities_race", 
		"quantifier_args": {
			"city": data.id.value, 
			"year": year 
		} 
	});
	parse.push ({
		"control_chart": "b_timeline",
		"quantify": "city_" + data.id.value,
		"quantifier": "cities_race_years",
		"quantifier_args": {
			"city": data.id.value
		}
	});
	var r = ["w", "b", "o"];
	for (var x in r) { 
		var k = r [x] + year; 
		parse.push ({
			"control_element": "#oth_data .city_" + r [x],
			"element_text": data [k].value
		});
	}
	for (var c in data) {
		parse.push ({
			"control_element": "#oth_data .city_" + c, 
			"element_text": data [c].value
		});
	}

	return parse;
}
$(document).ready (function () { 
	var cnf = {
		data: {
		},
		prequantifiers: {
			cities_race_years: function (args) { 
				//if (!args || !args.city || !args.year) return;
				var city = this.data.cities_race [args.city], grps = ["w", "b", "o"], yrs = ["11", "12", "13", "14", "15"],
				lines = [], max = 0;
				for (var x in grps) {
					var dp = [];
					for (var y in yrs) {
						if (city [grps [x] + yrs [y]] > max) max = city [grps [x] + yrs [y]];
						dp.push ({"group": grps [x], "year": yrs [y], "pop": city [grps [x] + yrs[y]]});
					}
					lines.push ({"values": dp});
				}
				return {
					"data": lines,
					"scale": d3.scaleLinear ().range ([0, max])
				}

			},
			cities_race: function (args) { 
				if (!args) args = {};
				var year  = args.year ? args.year : "11", rows = [];
				if (!args.city) { 
					var cities = this.data.cities_race.values (), 
					pop = 0, white = 0, black = 0, other = 0;
					for (var c in cities) {
						pop += parseInt (cities [c]["pop" + year].value),
						white += (parseFloat (cities [c]["w" + year].value) * pop) / 100,
						black += (parseFloat (cities [c]["b" + year].value) * pop) / 100,
						other += (parseFloat (cities [c]["o" + year].value) * pop) / 100;

						rows.push ({"group": "black", "value": black});
						rows.push ({"group": "white", "value": white});
						rows.push ({"group": "other", "value": other});
					}
				} else {
					var city = args.city,
					cities = this.data.cities_race,
					pop = parseInt (cities [city]["pop" + year].value),
					white = (parseFloat (cities [city]["w" + year].value) * pop) / 100,
					black = (parseFloat (cities [city]["b" + year].value) * pop) / 100,
					other = (parseFloat (cities [city]["o" + year].value) * pop) / 100;
					

					rows.push ({"group": "black", "value": black});
					rows.push ({"group": "white", "value": white});
					rows.push ({"group": "other", "value": other});
				}

				var h = new Nestify (rows, ["group"], ["group", "id", "value"]).asHierarchy (
					function (d) { 
						if (d.values) { 
							return 0;
						}
						return parseInt (d.value.value);
					},
					null
				);
				return {
					"data": h,
					"scale": d3.scaleOrdinal (d3.schemeCategory20c),
					"colors": {}
				}
			},
			cities: function (args) { 
				if (!args) args = {};
				var year = args.year ? args.year : "11", col = "pop" + year, scale = args.scale ? args.scale : "scaleSqrt";
				var extent = this.data.cities_race.extent (function (a) {return parseInt (a.values [col].value); })
				if (args.scale) extent.reverse ();

				var qScale = d3 [scale] ()
						.domain (extent)
				return {
					"scale": qScale, 
					"data": [ { "values": this.data.cities_race.sortBy (col) } ]
				}
			}
		},
		quantifiers: {
			sunburst: {
				cities_race: function (d, l, e, siblings) { 
					var color = d3.hcl (l.scale (d.data.key)).toString ();
					return {
						"fill": color,
						"label": d.data.key
					}
				}
			},
			maps: {
				cities: function (city, args, preq) { 
					preq.scale.range ([4, 7, 10, 16]);
					if (!args) args = {};
					var parse = [], year = args.year ? args.year : "11", col = args.col ? args.col : "pop" + year;

					var d = this.data.cities_race [city.properties.id] [col],
					res = preq.scale (d ? d.value : 0),
					data = { "parse": cityParse (city.properties, year, this.data.cities_race [city.properties.id]) }

					return {"r": res, "data": data}
				}
			},
			lines: {
				cities: function (city, args, line, preq) { 
					if (!args) args = {};
					var year = args.year ? args.year : "11", col = "pop" + year;
					var data = { "parse": cityParse (city.values, year, this.data.cities_race [city.values.id.value]) }
					return {"y": line.scale (parseInt (city.values [col].value)), "data": data}
				},
				cities_race_years: function (city) {
					return {"y": 10}
				}
			}
		},
		callbacks: {
			"cities_data": function (rows, id) { 
				return new Nestify (rows, ["id"], rows.columns).data;
			}

		}
	};
	new Ant (cnf);
});
