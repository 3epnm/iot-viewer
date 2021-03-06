window.ProviderOpenSense = ProviderDriverJsonP.extend({
	has_error: false,
	getView : function (options) {
		return new ProviderOpenSenseInitializeView(options);;
	},
	defaults : function () {
		return _.extend(ProviderDriver.prototype.defaults(),
		{
			_classname: "OpenSense",
			endpoint: 'http://api.sen.se',
			feedids: '',
			sense_key: '',
			unit: null
		});
	},
	show_error: function (d, msg) {
		var that = this;
		if (!this.hasError) {
			AppView.showError(msg, "Open.Sen.Se Request Error", function () { that.hasError = false; });
			this.hasError = true;
		}
	},
	is_complete : function () {
		return (this.get('feedids') != "" && this.get('sense_key') != "");
	},
	headers : function () {
		return {
			"sense_key" : this.get('sense_key')
		}
	},
	urls : function () {
		return {
			meta_data : this.get('endpoint') + "/feeds/{%feed_id}/last_event/?sense_key={%sense_key}",
			stream : this.get('endpoint') + "/feeds/{%feed_id}/events/?sense_key={%sense_key}&order_by=timetag"
		}
	},
	load_provider_data : function (d, callback) {
		var url = this.complete(this.urls()["stream"].replace('{%feed_id}', d.getDevice().get("feed_id")))
			+ "&gt=" + AppConfig.getFrom().toISOString()
			+ "&lt=" + AppConfig.getTo().toISOString()
			+ "&limit=1000"

		this.load(url, "get", null, function (result) {
			result.forEach(function (item) {
				d.addData(new Date(item.timetag), parseFloat(item.value));
			});
			callback(d.getData(AppConfig.getLoadFromTime(), AppConfig.getLoadToTime()));
		});
	},
	load_meta : function (callback) {
		AppView.showMask();
		var that = this;
		var feedids = [];
		this.get("feedids").split(",").forEach(function (item) {
			var feed_id = item.replace(/^\s+|\s+$/g, '');
			if (feed_id != "") {
				feedids.push(feed_id)				
			}
		});
		var c = 0;
		feedids.forEach(function (feed_id) {
			var url = that.complete(that.urls()["meta_data"].replace('{%feed_id}', feed_id));
			that.load(url, "get", null, function (result) {
				delete result.id;
				delete result.publish_id;

				result.device_id = result.feed_id;
				result.name = result.feed_id;
				result.at = result.timetag;
				delete result.timetag;

				result.current_value = result.value;
				delete result.value;
				result.unit = {
					symbol : result.unit
				}

				var device = Devices.findWhere({device_id: result.device_id, driver: that.id});
				var data = _.extend(result, { driver: that.id, name: result.device_id });
				if (!device) {
					Devices.create(data);
				} else {
					delete data.name;
					device.set(data);
					device.save();
				}
				if (++c == feedids.length) {
					that.set({initialized : true});
					that.save();

					if (callback) {
						callback(that);
					}
					AppView.hideMask();
				}
			});
		});
	},
	load_devices : function () {
		this.load_meta();
	}
});