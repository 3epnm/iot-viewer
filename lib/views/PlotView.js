var PlotView = (function () {
	var instance;

	var selector = "#flot";
	var plot = null;

	var updateLegendTimeout = null;
	var latestPosition = null;

	function updateLegend() {

		var legends = $(selector + " tr");
		updateLegendTimeout = null;

		var pos = latestPosition;
		var axes = plot.getAxes();

		if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
			pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
			return;
		}

		var i, j, dataset = plot.getData();
		for (i = 0; i < dataset.length; ++i) {

			var series = dataset[i];
			for (j = 0; j < series.data.length; ++j) {
				if (series.data[j][0] > pos.x) {
					break;
				}
			}

			if (typeof(series.data[j]) != "undefined") {
				var y,
					p1 = series.data[j - 1],
					p2 = series.data[j];

				p1[1] = parseFloat(p1[1]);
				p1[0] = parseFloat(p1[0]);
				p2[1] = parseFloat(p2[1]);
				p2[0] = parseFloat(p2[0]);

				if (p1 == null) {
					y = p2[1];
				} else if (p2 == null) {
					y = p1[1];
				} else {
					y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
				}

				if ($("td", legends.eq(i)).length < 3) {
					legends.eq(i).append(document.createElement("td"));
				}
				$("td", legends.eq(i)).last().text(y.toFixed(2) + " " + series.symbol);
			} else {
				if ($("td", legends.eq(i)).length > 2) {
					$("td", legends.eq(i)).last().remove();
				}
			}
		}
	};
	function init () {
		var plotdata = {};
		var hashCode = function(s) {
			return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
		};
		var add = function (item) {
			plotdata[hashCode(item.device+item.driver)] = item;
		};
		var get = function () {
			var data = [];
			for (var i in plotdata) {
				var item = plotdata[i];
				var device = Devices.findWhere({ device_id: item.device, driver: item.driver });
				if (device && device.get("active")) {
					data.push(item);
				} else {
					delete plotdata[i];
				}
			}
			return data;
		};
		var updateplot = function() {
			var data = get();
			plot = $.plot(selector, data, {
				xaxis: { 
					mode: "time",
					min: new Date(AppConfig.get('from')),
					max: new Date(AppConfig.get('to'))
				},
				lines: { 
					show: AppConfig.get("show_lines")  
				},
				points: { 
					show: AppConfig.get("show_points") 
				},
				crosshair: {
					mode: "x"
				},
				grid: {
					hoverable: true,
					autoHighlight: false
				}
			});
			$(selector).bind("plothover",  function (event, pos, item) {
				latestPosition = pos;
				if (!updateLegendTimeout) {
					updateLegendTimeout = setTimeout(updateLegend, 50);
				}
			});
		};
		var load = function () {
			var that = this;
			Devices.where({ active: true }).forEach(function (device) {
				var driver_id = device.get('driver');
				var driver = ProviderDrivers.get(driver_id);
				
				driver.load_data(device, function (data) { 
					add(data);
					updateplot();
				});
			});
		};
		return {
			load : function () {
				load();
			},
			update : function () {
				updateplot();
			}
		}
	};
	return (function () {
		if ( !instance ) {
			instance = init();
		}
		return instance;
	})();
})();