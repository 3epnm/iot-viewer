window.ProviderXively = ProviderDriver.extend({
	has_error: false,
	getView : function (options) {
		return new ProviderXivelyInitializeView(options);
	},
	defaults : function () {
		return _.extend(ProviderDriver.prototype.defaults(),
		{
			_classname: "Xively",
			endpoint: 'https://api.xively.com/v2/feeds/{%feedid}',
			feedid: '',
			apikey: '',
			unit: null
		});
	},
	is_complete : function () {
		return (this.get('feedid') != "" && this.get('apikey') != "");
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
	show_error: function (xhr, ajaxOptions, thrownError) {
		var that = this;
		if (!this.hasError) {
			var response = $.parseJSON(xhr.responseText);
			AppView.showError(response.title, response.errors, function () { that.hasError = false; });
			this.hasError = true;
		}
	},
	load_devices : function (callback) {
		AppView.showMask();
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
			if (callback) {
				callback(that);
			}
			AppView.hideMask();
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
		var range = AppConfig.getLoadToTime().getTime() - AppConfig.getLoadFromTime().getTime();
		for (var i in interval) {
			if (range < interval[i] * 3600000)
				return i;
		}
		return 86400;
	},
	load_provider_data : function (d, callback) {
		var urls = this.urls();
		var url = this.complete(urls['stream']) 
			+ d.getDevice().get("device_id")
			+ '&start=' + AppConfig.getLoadFromTime()
			+ '&end=' + AppConfig.getLoadToTime()
			+ '&limit=1000' 
			+ '&interval=' + this.interval_value();


		this.load(url, "get", null, function (result) {
			result.datastreams.forEach(function (item) {
				if (item.datapoints) {
					item.datapoints.forEach(function (datapoint) {
						d.addData(new Date(datapoint.at), parseFloat(datapoint.value));
					});
				}
			});
			callback(d.getData(AppConfig.getLoadFromTime(), AppConfig.getLoadToTime()));
		});
	},
	load_meta : function (callback) {
		var that = this;
		AppView.showMask();
		this.meta(function (result) {
			result.provider_id = result.id;
			delete result.id;

			that.set(result);
			that.set({initialized : true});
			that.save();

			that.load_devices(callback);
		});	
	}
});


