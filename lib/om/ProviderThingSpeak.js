window.ProviderThingSpeak = ProviderDriver.extend({
	has_error: false,
	getView : function (options) {
		return new ProviderThingSpeakInitializeView(options);;
	},
	defaults : function () {
		return _.extend(ProviderDriver.prototype.defaults(), 
		{
			_classname: "ThingSpeak",

			endpoint: "https://api.thingspeak.com/channels/{%channelid}",
			channelid: "",
			apikey: ""
		});
	},
	is_complete : function () {
		return (this.get('channelid') != "" && this.get('apikey') != "");
	},
	headers : function () {
		return {
			"X-THINGSPEAKAPIKEY" : this.get('apikey')
		}
	},
	urls : function () {
		return {
			feed_info : this.get('endpoint') + "/feed.json?results=1&key={%apikey}",
			stream    : this.get('endpoint') + "/field/"
		}
	},
	show_error: function (d, msg) {
		var that = this;
		if (!this.hasError) {
			AppView.showError(msg, "ThingSpeak Request Error", function () { that.hasError = false; });
			this.hasError = true;
		}
	},
	load_data : function (device, callback) {
		var urls = this.urls();
		var url = this.complete(urls['stream']) 
			+ device.get("device_id") + ".json"
			+ '?start=' + AppConfig.getFrom().toISOString().substr(0, 19).replace("T", "%20")
			+ '&end=' + AppConfig.getTo().toISOString().substr(0, 19).replace("T", "%20")
			+ '&limit=8000'
			+ '&key=' + this.get("apikey");

		var id = this.id;
		this.load(url, "get", null, function (result) {
			var dataset;
			var data = [];
			result.feeds.forEach(function (item) {
				var date = new Date(item.created_at);
				data.push([date.getTime(), item[device.get("device_id")]]);
			});

			dataset = { 
				symbol : "",
				driver : id,
				device : device.get("device_id"),
				label: device.get("name"), 
				data: data
			};
			callback(dataset);
		});
	},
	load_meta : function () {
		var that = this;
		this.meta(function (result) {

			var channel = result.channel;
			channel.provider_id = channel.id;
			delete channel.id;

			var devices = [];
			var data = {};
			var feeds = result.feeds[0];
			for(var i in channel) {
				if (i.match("field(.*)")) {
					devices.push({
						device_id : i,
						name : channel[i],
						current_value : feeds[i],
						at : feeds['created_at']
					});
				} else {
					data[i] = channel[i];
				}
			}

			that.set(data);
			that.set({initialized : true});
			that.save();

			for (var i=0; i<devices.length; i++) {
				var device = Devices.findWhere({device_id: devices[i].device_id, driver: that.id});
				var data = _.extend(devices[i], { driver: that.id });
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
	load: function (url, method, data, callback) {
		ProviderDriver.prototype.load.call(this, url, method, data, callback, "jsonp");
	},
	load_devices : function () {
		this.load_meta();
	}
});