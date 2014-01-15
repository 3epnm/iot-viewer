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
				if (!device) {
					var data = _.extend(now, { driver: that.id, name: now.device_id });
					Devices.create(data);
				} else {
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
	load_data : function (devices, callback) {
		var datastreams = [];
		var labels = { };
		devices.forEach(function (item) {
			datastreams.push(item.get("device_id"));
			labels[item.get("device_id")] = item.get("name");
		});
		var urls = this.urls();
		var url = this.complete(urls['stream']) 
			+ datastreams.join() 
			+ '&start=' + AppConfig.get('from') 
			+ '&end=' + AppConfig.get('to')
			+ '&limit=1000' 
			+ '&interval=' + this.interval_value();

		this.load(url, "get", null, function (result) {
			var datasets = { };
			result.datastreams.forEach(function (item) {
				if (!datasets[item.id]) 
					datasets[item.id] = { label: labels[item.id], data: [ ] };
				item.datapoints.forEach(function (datapoint) {
					var date = new Date(datapoint.at);
					datasets[item.id].data.push([date.getTime(), datapoint.value]);
				});
			});
			callback(datasets);
		});
	}
});


