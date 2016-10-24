$(document).ready (function () { 
	var cnf = {
		prequantifiers: {
			incidents: function (args) { 
				var nest = new Nestify (this.data.incidents, ["grid", "code"], this.data.incidents.columns).data;

				var sum = function (cols, args) {
					return function (x) { 
						var r = 0;
						for (var c in cols) { 
							if (args && args.absolute && args.incidents.indexOf (cols [c]) === -1) continue;
							if (x.values [cols [c]]) {
								r += parseInt (x.values [cols [c]].count.value);
							}
						}
						return r;
					}
				}

				return {
					nest: nest,
					scale: d3.scalePow ()
						.exponent (.4)
						.domain (nest.extent (sum (["01845", "01848"], args)))
						.range ([.5, 10])
						.clamp (true)
				}
			},
			/* blockgroups prequantify: get the race data into a nest and set up the scale */
			blockgroups: function () {
				var nest = new Nestify (this.data.blockgroups_race, ["id"], this.data.blockgroups_race.columns).data;

				return { 
					nest: nest,
					scale: d3.scaleQuantize ().domain ([0, 100]).range (["a", "b", "c", "d"])
				}
			}
		},
		quantifiers: {
			maps: {
				redraw: function () { 
					return {"r": "10" }
				},
				incidents: function (grid, args, prop) { 
					var id = grid.properties.id, nest = prop.nest;
					if (nest [id]) {
						var val = 0;
						if (nest [id] ["01845"] && (!args || args.incidents.indexOf ("01845") !== -1)) val += parseInt (nest [id]["01845"].count.value);
						if (nest [id] ["01848"] && (!args || args.incidents.indexOf ("01848") !== -1)) val += parseInt (nest [id]["01848"].count.value);

						var data = { 
							"parse_first": "#show_legend_grid",
							"parse": [
								/* set the text of .grid_arrests element(s) */
								{"control_element": ".grid_arrests", "element_text": val, "debug": "hey! " + val }
							]
						}
						return {"r": prop.scale (val), "data": data }

					}
				},
				blockgroups: function (blockgroup, args, prop) {
					var id = blockgroup.properties.id, vars = ["w", "b", "o"], className = "blockgroup ";
					if (prop.nest [id]) { 
						for (var i in vars) { 
							var pctg = parseInt (prop.nest [id] [vars [i]].value ) / parseInt (prop.nest [id].total.value) * 100;
							className += " " + vars [i] + "_" + prop.scale (pctg);  

						}
						className += " p_" + prop.scale ((parseInt (prop.nest [id].b.value) + parseInt (prop.nest [id].o.value)) /  parseInt (prop.nest [id].total.value) * 100);
					}
					return {
						"class": className
					}
				}
			}
		}
	}
	new Ant (cnf);
});
