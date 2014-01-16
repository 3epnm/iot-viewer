var PlotView = (function () {
	var instance;

	function init () {
		var selector = "#flot";
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