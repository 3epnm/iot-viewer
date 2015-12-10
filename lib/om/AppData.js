window.AppData = Backbone.Model.extend({
	defaults: function() {
		return {
			from: null,
			to: null,
			load_from: null,
			load_to: null,
			show_points : false,
			show_lines : true,
			pan : false,
			zoom : true,
			cursor: true
		};
	},
	get: function (attr) {
		if (typeof this[attr] == 'function')
			return this[attr]();
		return Backbone.Model.prototype.get.call(this, attr);
	},
	getFrom: function () {
		return new Date(this.get('from'));
	},
	getTo: function () {
		return new Date(this.get('to'));
	},
	getFromTime: function () {
		return new Date(this.get('from'));
	},
	getToTime: function () {
		return new Date(this.get('to'));
	},
	getLoadFromTime : function () {
		var datetime;
		if (this.get('load_from'))
			datetime =  new Date(this.get('load_from'));
		datetime = this.getFrom();

		return datetime;
	},
	getLoadToTime : function () {
		var datetime;
		if (this.get('load_to'))
			datetime =  new Date(this.get('load_to'));
		datetime = this.getTo();

		return datetime;
	},
	load_application_data : function (url) {
		console.log('!!!');
		var data = JSON.parse('{"AppDataList":"75bc2403-6bae-e2ac-8b87-1c5e0ac71350","AppDataList-75bc2403-6bae-e2ac-8b87-1c5e0ac71350":"{\"from\":\"2015-12-10T10:21:00.000Z\",\"to\":\"2015-12-10T16:21:02.332Z\",\"show_tutorial\":true,\"load_from\":null,\"load_to\":null,\"show_points\":true,\"show_lines\":true,\"pan\":false,\"zoom\":false,\"cursor\":true,\"id\":\"75bc2403-6bae-e2ac-8b87-1c5e0ac71350\"}","DeviceList":"80c80f34-e3c6-0742-6906-c693a20eaca5,797b0459-55aa-4c3e-ce35-2dbf1acd9eac,3d47ea29-e479-8269-fdf9-5ade0543adca,ea3eca73-afdb-a9cc-ee09-ec9461146fae,ab79e2b7-a3ce-f4e3-789a-318b6ce84951","DeviceList-3d47ea29-e479-8269-fdf9-5ade0543adca":"{\"device_id\":\"field3\",\"name\":\"104C04B70008008D\",\"current_value\":null,\"at\":\"2015-12-10T16:20:06Z\",\"driver\":\"aa35d665-ec39-5179-58fb-f444a5b221af\",\"color\":\"\",\"max_value\":null,\"min_value\":null,\"active\":false,\"id\":\"3d47ea29-e479-8269-fdf9-5ade0543adca\"}","DeviceList-797b0459-55aa-4c3e-ce35-2dbf1acd9eac":"{\"device_id\":\"field2\",\"name\":\"10781FB7000800B0\",\"current_value\":\"9\",\"at\":\"2015-12-10T16:20:06Z\",\"driver\":\"aa35d665-ec39-5179-58fb-f444a5b221af\",\"color\":\"lightpink\",\"max_value\":null,\"min_value\":null,\"active\":true,\"id\":\"797b0459-55aa-4c3e-ce35-2dbf1acd9eac\"}","DeviceList-80c80f34-e3c6-0742-6906-c693a20eaca5":"{\"device_id\":\"field1\",\"name\":\"1016D2C000080080\",\"current_value\":\"23.88\",\"at\":\"2015-12-10T16:20:06Z\",\"driver\":\"aa35d665-ec39-5179-58fb-f444a5b221af\",\"color\":\"lightblue\",\"max_value\":null,\"min_value\":null,\"active\":true,\"id\":\"80c80f34-e3c6-0742-6906-c693a20eaca5\"}","DeviceList-ab79e2b7-a3ce-f4e3-789a-318b6ce84951":"{\"device_id\":\"field5\",\"name\":\"104C04B70008008D\",\"current_value\":null,\"at\":\"2015-12-10T16:20:06Z\",\"driver\":\"aa35d665-ec39-5179-58fb-f444a5b221af\",\"color\":\"\",\"max_value\":null,\"min_value\":null,\"active\":false,\"id\":\"ab79e2b7-a3ce-f4e3-789a-318b6ce84951\"}","DeviceList-ea3eca73-afdb-a9cc-ee09-ec9461146fae":"{\"device_id\":\"field4\",\"name\":\"10420DB6000800E2\",\"current_value\":null,\"at\":\"2015-12-10T16:20:06Z\",\"driver\":\"aa35d665-ec39-5179-58fb-f444a5b221af\",\"color\":\"\",\"max_value\":null,\"min_value\":null,\"active\":false,\"id\":\"ea3eca73-afdb-a9cc-ee09-ec9461146fae\"}","ProviderDriverList":"aa35d665-ec39-5179-58fb-f444a5b221af","ProviderDriverList-aa35d665-ec39-5179-58fb-f444a5b221af":"{\"channelid\":\"8710\",\"apikey\":\"5GS6G8WA21DQXKED\",\"name\":\"...\",\"initialized\":true,\"_classname\":\"ThingSpeak\",\"endpoint\":\"https://api.thingspeak.com/channels/{%channelid}\",\"unit\":null,\"id\":\"aa35d665-ec39-5179-58fb-f444a5b221af\",\"description\":\"Temperature Sensors\",\"created_at\":\"2013-11-22T01:53:21Z\",\"updated_at\":\"2015-12-10T16:20:06Z\",\"last_entry_id\":270821,\"provider_id\":8710}","ProviderList":"bb7cb185-d8ba-2cc2-82fc-3c98bd59c2e9","ProviderList-bb7cb185-d8ba-2cc2-82fc-3c98bd59c2e9":"{\"name\":\"ThingSpeak\",\"driver\":\"aa35d665-ec39-5179-58fb-f444a5b221af\",\"id\":\"bb7cb185-d8ba-2cc2-82fc-3c98bd59c2e9\"}"}');
		console.log(data);
		window.localStorage.clear();
		_.each(data, function (item, key) {
			console.log(key, item);
		});

		// if (!url) {
		// 	AppView.showError('URL not given.', 'No URL to the application.json given.');
		// 	return;
		// }
		// $.ajax({
		// 	dataType: "json",
		// 	url: url,
		// 	success: function (result) {
		// 		AppView.hideView();

		// 		var ids = [];
		// 		Providers.each(function (provider) {
		// 			ids.push(provider.id);
		// 		});

		// 		ids.forEach(function (id) {
		// 			Providers.get(id).del();
		// 			$("#panel").panelmenu('remove', document.getElementById(id));
		// 		});

		// 		for (var name in result.provider) {
		// 			var provider = Providers.create({name : name});
		// 			provider.save();

		// 			$("#panel").panelmenu('add', provider.get("name"), provider.id);

		// 			var data = { };
		// 			for (var i in result.provider[name]) {
		// 				if (i != "classname") {
		// 					data[i] = result.provider[name][i];
		// 				}
		// 			}
		// 			var driver = new window[result.provider[name].classname](data);
		// 			ProviderDrivers.create(driver);

		// 			provider.set({driver : driver.id})
		// 			provider.save();
		// 			driver.load_meta();
		// 		}
			},
			error: function (jqXHR, textStatus, errorThrow) {
				AppView.showError(textStatus, errorThrow);
			}
		});
	}
});
