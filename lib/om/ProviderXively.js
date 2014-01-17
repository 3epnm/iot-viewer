window.ProviderXively = ProviderDriver.extend({
	name : 'Xively',
	defaults : function () {
		return _.extend(ProviderDriver.prototype.defaults(),
		{
			name : 'Xively',
			endpoint: 'https://api.xively.com/v2/feeds/{%feedid}',
			feedid: '',
			apikey: '',

			auto_feed_url: "",
			title: "",
			created: "",
			updated: "",
			creator: "",
			website: "",
			device_serial: "",
			feed: "",
			provider_id: 0,
			private: false,
			product_id: "",
			status: "",
			version: ""
		});
	},
	headers : function () {
		return {
			"X-ApiKey" : this.get('apikey')
		}
	},
	urls : function () {
		return {
			feed_info : this.get('endpoint') + "?content=summary",
			devices   : this.get('endpoint'),
			stream    : this.get('endpoint') + ".json?datastreams="
		}
	},
	serialize : function($el) {
		return {
			feedid:   $(".feedid", $el).val(),
			apikey:   $(".apikey", $el).val()
		};
	},
	has_error: false,
	show_error: function (xhr, ajaxOptions, thrownError) {
		var that = this;
		if (!this.hasError) {
			var response = $.parseJSON(xhr.responseText);
			AppView.showError(response.title, response.errors, function () { that.hasError = false; });
			this.hasError = true;
		}
	},
	load_devices : function () {
		var that = this;
		var urls = this.urls();
		var url = this.complete(urls["devices"]);
		this.load(url, "get", null, function (result) {
			for (var i=0; i<result.datastreams.length; i++) {
				var now = result.datastreams[i];
				now.device_id = now.id;
				delete now.id;
				var device = Devices.findWhere({device_id: now.device_id, driver: that.id});
				var data = _.extend(now, { driver: that.id, name: now.device_id });
				if (!device) {
					Devices.create(data);
				} else {
					delete data.name;
					device.set(data);
					device.save();
				}
			}
			AppView.showView(new DevicesView({
				model : that
			}));
		});
	},
	interval_value : function () {
		var interval = {
			0	: 6,
			30	: 12,
			60	: 24,
			300	: 5 * 24,
			900	: 14 * 24,
			1800 : 31 * 24,
			3600 : 31 * 24,
			10800 : 90 * 24,
			21600 : 180 * 24,
			43200 : 1 * 365 * 24,
			86400 : 1 * 365 * 24
		}
		var range = new Date(AppConfig.get('to')) - new Date(AppConfig.get('from'));
		for (var i in interval) {
			if (range < interval[i] * 3600000)
				return i;
		}
		return 86400;
	},
	load_data : function (device, callback) {
		var urls = this.urls();
		var url = this.complete(urls['stream']) 
			+ device.get("device_id")
			+ '&start=' + AppConfig.get('from') 
			+ '&end=' + AppConfig.get('to')
			+ '&limit=1000' 
			+ '&interval=' + this.interval_value();

		var that = this;
		var symbol = "";
		if (device.has("unit") && device.get("unit").symbol)
			symbol = device.get("unit").symbol;
		
		this.load(url, "get", null, function (result) {
			var dataset;
			result.datastreams.forEach(function (item) {
				var data = [];
				item.datapoints.forEach(function (datapoint) {
					var date = new Date(datapoint.at);
					data.push([date.getTime(), datapoint.value]);
				});
				dataset = { 
					symbol : symbol,
					driver : that.id,
					device : item.id,
					label: device.get("name"), 
					data: data
				};
			});
			callback(dataset);
		});
	},
	load_meta : function () {
		var that = this;
		this.meta(function (result) {
			result.provider_id = result.id;
			delete result.id;

			that.set(result);
			that.set({initialized : true});
			that.save();

			that.load_devices();
		});	
	}
});


