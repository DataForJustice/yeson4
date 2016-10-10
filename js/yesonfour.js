$(document).ready (function () { 
	var cnf = {
		prequantifiers: {
			incidents: function () { 
				var nest = new Nestify (this.data.incidents, ["grid", "code"], this.data.incidents.columns).data;

				return {
					nest: nest,
					scale: d3.scalePow ().exponent (.9).domain (nest.extent (function (x) { var r = 0; if (x.values ["01845"]) { r += parseInt (x.values ["01845"].count.value); } if (x.values ["01848"]) { r += parseInt (x.values ["01848"].count.value); } return r; })).range ([.5, 10]).clamp (true)
				}
			}
		},
		quantifiers: {
			maps: {
				incidents: function (grid, args, prop) { 
					var id = grid.properties.id, nest = prop.nest;
					if (nest [id]) {
						var val = 0;
						if (nest [id] ["01845"]) val += parseInt (nest [id]["01845"].count.value);
						if (nest [id] ["01848"]) val += parseInt (nest [id]["01848"].count.value);

						return {"r": prop.scale (val)}

					}
				}
			}
		}
	}
	new Ant (cnf);
});
