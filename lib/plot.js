var PlotView = (function () {
	var instance;

	function init () {
		var selector = "#flot";
		var plotdata = { };
		var data = [];

		var updateplot = function() {
			var data = [];
			for (var i in plotdata) {
				if (Devices.findWhere({ device_id: i }).get("active")) {
					data.push(plotdata[i]);
				}
				else {
					delete plotdata[i];
				}
			}

			$.plot(selector, data, {
				xaxis: { 
					mode: "time" 
				},
				lines: { 
					show: AppConfig.get("show_lines")  
				},
				points: { 
					show: AppConfig.get("show_points") 
				}
			});
		};
		var load = function () {
			var devices = { };
			Devices.where({ active: true }).forEach(function (device) {
				if (!devices[device.get('driver')])
					devices[device.get('driver')] = [];
				devices[device.get('driver')].push(device);
			});
			for (var driver_id in devices) {
				var driver = ProviderDrivers.get(driver_id);
				driver.load_data(devices[driver_id], function (data) { 
					for (var i in data) {
						plotdata[i] = data[i];
					}
					updateplot();
				});
			}
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