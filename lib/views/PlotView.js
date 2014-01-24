var PlotView = (function () {
	var instance;
	var instance_plot;  

	var selector = "#flot";
	var updateLegendTimeout = null;
	var latestPosition = null;
	var plotdata = {};
	var events = {};

	var updateLegendX = function (datetime) {
		if ($('.legendX', $(selector)).length == 0) {
			var right = $('.legend div', $(selector)).first().css('right');
			$(selector).append('<div class="legendX legend"><div style="position: absolute; height: 24px; bottom: 30px; right: '+right+'; background-color: rgb(255, 255, 255); opacity: 0.85;"></div><table style="position: absolute; bottom: 30px; right: '+right+'; font-size:smaller; color: #545454"><tbody><tr><td class="legendLabel">Datetime</td><td class="datetime"></td></tr></tbody></table></div>');
		}
		$(selector + " .legendX .datetime").text(datetime.getFormatDateTime());
	};
	var removeLegendX = function () {
		$(selector + ' .legendX').remove();
	};
	var removeLegend = function () {
		removeLegendX();
		var legends = $(selector + " .legend tr");
		$(legends).each (function () {
			if ($("td", this).length > 2) {
				$("td", this).last().remove();
			}
		});
	};
	var updateLegend = function () {
		var i, j, dataset = instance_plot.getData();

		if (dataset.length < 1)
			return;

		var legends = $(selector + " .legend tr");
		updateLegendTimeout = null;

		var pos = latestPosition;

		updateLegendX(new Date(pos.x));

		var axes = instance_plot.getAxes();

		if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
			pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
			removeLegend();
			return;
		}
		
		for (i = 0; i < dataset.length; ++i) {
			var series = dataset[i];
			for (j = 0; j < series.data.length; ++j) {
				if (series.data[j][0] > pos.x) {
					break;
				}
			}

			if (typeof(series.data[j-1]) != "undefined" 
				&& typeof(series.data[j]) != "undefined") {

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
				removeLegend();
			}
		}
	};
	var get_plotdata = function () {
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
	var getOptions = function () {
		var obj = {
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
			grid: {
				hoverable: true,
				autoHighlight: false
			}
		};
		if (AppConfig.get("cursor")) {
			obj.crosshair = { mode: "x" };
		}
		if (AppConfig.get("zoom")) {
			obj.selection = { mode: "x" };
		}
		if (AppConfig.get("pan")) {
			obj.pan = { interactive: true };
		}
		return obj;
	};
	var init_plot = function () {
		if (instance_plot) {
			$(selector).unbind();
			instance_plot.shutdown();
			$(selector).html("");
			delete instance_plot;
		}

		var data = get_plotdata();
		if (data.length < 1)
			return;

		instance_plot = $.plot(selector, data, getOptions());

		if (AppConfig.get("zoom")) {
			events.zoom = $(selector).bind("plotselected", function (event, ranges) {
				AppConfig.set({
					from: new Date(parseInt(ranges.xaxis.from.toFixed(1))),
					to: new Date(parseInt(ranges.xaxis.to.toFixed(1)))
				});
				AppConfig.save();
				PlotView.load();
			});	
		}

		if (AppConfig.get("pan")) {
			events.pan =  $(selector).bind("plotpan", function (event, plot) {
				console.dir(event);				
			});
		}

		if (AppConfig.get("cursor")) {
			events.cursor = $(selector).bind("plothover",  function (event, pos, item) {
				latestPosition = pos;
				if (!updateLegendTimeout) {
					updateLegendTimeout = setTimeout(updateLegend, 50);
				}
			});
		}
	};
	function init () {
		var hashCode = function(s) {
			return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
		};
		var add_plotdata = function (item) {
			plotdata[hashCode(item.device+item.driver)] = item;
		};
		var updateplot = function(init) {
			PlotView.hideMask();
			if (!instance_plot || init) {
				init_plot();
				return;
			}
			var data = get_plotdata();
			if (data.length < 1) {
				instance_plot.shutdown();
				$(selector).html("");
				delete instance_plot;
			} else {
				instance_plot = $.plot(selector, data, getOptions());
			}
		};
		var load = function () {
			PlotView.showMask();
			var that = this;
			var len = Devices.where({ active: true }).length;
			var cnt = 0;
			plotdata = {};
			var active = Devices.where({ active: true });
			if (active.length < 1) {
				updateplot();
			}
			active.forEach(function (device) {
				var driver_id = device.get('driver');
				var driver = ProviderDrivers.get(driver_id);
				driver.load_data(device, function (data) { 
					add_plotdata(data);
					if (++cnt == len) {
						updateplot();
					} else {
						PlotView.showMask();
					}
				});
			});
		};
		return {
			load : function () {
				load();
			},
			update : function (init) {
				updateplot(init || false);
			},
			showMask : function () {
				if ($(selector + " canvas").length > 0) {
					$(selector).append('<div class="mask" style="right: ' + $('.legend div', $(selector)).first().css('right') + '">loading...</div>');
				} 
			},
			hideMask : function () {
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