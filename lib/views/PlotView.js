var PlotView = (function () {
	var instance;
	var instance_plot;  

	var selector = "#flot";

	var updateLegendTimeout = null;
	var updateTimeout = null;
	
	var plotdata = {};
	var events = {};
	var lastPos = null;

	var is_updating = false;
	
	var updateRangeLegend = function () {
		var axes = instance_plot.getAxes();

		$(".plotfrom").text(new Date(axes.xaxis.min).getFormatDateTime());
		$(".plotto").text(new Date(axes.xaxis.max).getFormatDateTime());		

		$(".plotfrom, .plotto").show();	
	};

	var hideRangeLegend = function () {
		$(".plotfrom, .plotto").hide();		
	};

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

	var updateLegendY = function () {
		var i, j, dataset = instance_plot.getData();

		updateLegendTimeout = null;

		if (dataset.length < 1)
			return;

		var pos = lastPos;

		updateLegendX(new Date(pos.x));

		var legends = $(selector + " .legend tr");
		var axes = instance_plot.getAxes();

		if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
			pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
			removeLegendY();
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
				removeLegendY();
			}
		}
	};

	var removeLegendY = function () {
		removeLegendX();
		var legends = $(selector + " .legend tr");

		$(legends).each (function () {
			if ($("td", this).length > 2) {
				$("td", this).last().remove();
			}
		});
	};

	var showMask = function () {
		is_updating = true;

		removeLegendY();
		if ($(selector).is(":visible") && $(selector + " canvas").length > 0) {
			$(selector).append('<div class="mask" style="right: ' + $('.legend div', $(selector)).first().css('right') + '">loading...</div>');
		} else {
			AppView.showMask();
		}
	};

	var hideMask = function () {
		is_updating = false;

		AppView.hideMask();
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
				min: new Date(AppConfig.get('from')).getTime(),
				max: new Date(AppConfig.get('to')).getTime()
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
	var destroy = function () {
		if (instance_plot) {
			hideRangeLegend();
			$(selector).unbind();
			instance_plot.shutdown();
			$(selector).html("");
			delete instance_plot;
		}
	};

	var init = function (force) {
		destroy();

		var data = get_plotdata();
		instance_plot = $.plot(selector, data, getOptions());
		updateRangeLegend();
		
		if (AppConfig.get("zoom")) {
			events.zoom = $(selector).bind("plotselected", function (event, ranges) {
				removeLegendY();

				var set = {
					from: new Date(parseInt(ranges.xaxis.from.toFixed(1))),
					to: new Date(parseInt(ranges.xaxis.to.toFixed(1)))
				};
				AppConfig.save(set, {
					success : function () {
						DateRange.reload();
					}
				});
			});	
		}

		if (AppConfig.get("pan")) {
			events.pan =  $(selector).bind("plotpan", function (event, plot) {
				if (updateLegendTimeout)
					window.clearTimeout(updateLegendTimeout);
				
				updateLegendTimeout = true;
				removeLegendY();
				updateRangeLegend();
				
				if (updateTimeout)
					window.clearTimeout(updateTimeout);

				updateTimeout = window.setTimeout(function () { 
					var axes = plot.getAxes();
					var set = {
						from : new Date(parseInt(axes.xaxis.min)),
						to : new Date(parseInt(axes.xaxis.max)),
						load_from : new Date(parseInt(axes.xaxis.min)),
						load_to : new Date(parseInt(axes.xaxis.max))
					};
					AppConfig.save(set, {
						success: function () {
							updateLegendTimeout = null;
							DateRange.reload();
						}
					});
				}, 150);
			});
		}

		if (AppConfig.get("cursor")) {
			events.cursorbegin = $(selector).bind("plothover",  function (event, pos, item) {
				if (!pos.x || !pos.y)
					return;
				lastPos = pos;
				if (!updateLegendTimeout)
					updateLegendTimeout = window.setTimeout(function () { updateLegendY(); }, 50);
			});
			events.cursorend = $(selector).bind("plothoverend",  function (event) {
				if (updateLegendTimeout)
					window.clearTimeout(updateLegendTimeout);
				updateLegendTimeout = false;
				removeLegendY();
			});
		}
	};

	var update = function() {
		hideMask();
		var data = get_plotdata();

		if (data.length > 0) {
			$(selector).show();
			instance_plot = $.plot(selector, data, getOptions());
			updateRangeLegend();
		}
		else {
			$(selector).hide();
			hideRangeLegend();
		}
	};

	var load = function () {
		showMask();

		var active = Devices.where({ active: true });
		if (active.length < 1) {
			return update();
		}

		var len = Devices.where({ active: true }).length;
		var cnt = 0;
		active.forEach(function (device) {
			var driver_id = device.get('driver');
			var driver = ProviderDrivers.get(driver_id);
			driver.load_data(device, function (data) { 
				plotdata[(data.device+data.driver).hashCode()] = data;
				if (++cnt == len) {
					update();
				}
			});
		});
	};
	function construct () {
		$(document).ready(function () {
			window.setTimeout(init, 250);
		});
		return {
			init : init,
			load : load,
			update : update
		}
	};
	return (function () {
		if ( !instance ) {
			instance = construct();
		}
		return instance;
	})();
})();