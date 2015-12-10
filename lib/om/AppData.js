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
		var data = {"AppDataList":"c66da8ca-31dd-5ecd-d494-b282ec8741ec","AppDataList-c66da8ca-31dd-5ecd-d494-b282ec8741ec":"{\"from\":\"2015-12-10T04:00:00.000Z\",\"to\":\"2015-12-10T16:11:20.802Z\",\"show_tutorial\":true,\"load_from\":null,\"load_to\":null,\"show_points\":true,\"show_lines\":true,\"pan\":false,\"zoom\":true,\"cursor\":true,\"id\":\"c66da8ca-31dd-5ecd-d494-b282ec8741ec\"}","DeviceList":"5e3eaf59-c82b-f4b7-67b3-c43d1cbd3d33,45d27d12-bcf1-37f6-83af-7e97d31c80db,7a2e3737-e53f-ca42-336d-1e7bc9006662,016826db-947d-0666-ccae-888685e3bf19,2ead831e-97bb-786c-7026-b575152005ac","DeviceList-016826db-947d-0666-ccae-888685e3bf19":"{\"current_value\":\"24.63\",\"at\":\"2015-12-10T11:05:03.000000Z\",\"max_value\":\"26.88\",\"min_value\":\"22.06\",\"device_id\":\"10781FB7000800B0\",\"driver\":\"a1b8e79b-1317-bd9a-996c-a8913e83dcaa\",\"name\":\"South (Indoor)\",\"color\":\"gold\",\"active\":true,\"id\":\"016826db-947d-0666-ccae-888685e3bf19\",\"tags\":[\"Indoor Temperature\"],\"unit\":{\"symbol\":\"C\",\"label\":\"Celsius\"}}","DeviceList-2ead831e-97bb-786c-7026-b575152005ac":"{\"current_value\":\"22.94\",\"at\":\"2015-12-10T11:05:06.000000Z\",\"max_value\":\"25.63\",\"min_value\":\"22.94\",\"device_id\":\"10360BC100080014\",\"driver\":\"a1b8e79b-1317-bd9a-996c-a8913e83dcaa\",\"name\":\"North (Indoor)\",\"color\":\"darkviolet\",\"active\":true,\"id\":\"2ead831e-97bb-786c-7026-b575152005ac\",\"tags\":[\"Indoor Temperature\"],\"unit\":{\"symbol\":\"C\",\"label\":\"Celsius\"}}","DeviceList-45d27d12-bcf1-37f6-83af-7e97d31c80db":"{\"current_value\":\"25.69\",\"at\":\"2015-12-10T11:05:05.000000Z\",\"max_value\":\"27.75\",\"min_value\":\"20.75\",\"device_id\":\"10420DB6000800E2\",\"driver\":\"a1b8e79b-1317-bd9a-996c-a8913e83dcaa\",\"name\":\"North (Indoor)\",\"color\":\"darkgreen\",\"active\":true,\"id\":\"45d27d12-bcf1-37f6-83af-7e97d31c80db\",\"tags\":[\"Indoor Temperature\"],\"unit\":{\"symbol\":\"C\",\"label\":\"Celsius\"}}","DeviceList-5e3eaf59-c82b-f4b7-67b3-c43d1cbd3d33":"{\"current_value\":\"12.75\",\"at\":\"2015-12-10T11:05:04.000000Z\",\"max_value\":\"33.88\",\"min_value\":\"6.06\",\"tags\":[\"Outdoor Temperature\"],\"unit\":{\"symbol\":\"C\",\"label\":\"Celsius\"},\"device_id\":\"1016D2C000080080\",\"driver\":\"a1b8e79b-1317-bd9a-996c-a8913e83dcaa\",\"name\":\"South (Outdoor)\",\"color\":\"darkred\",\"active\":true,\"id\":\"5e3eaf59-c82b-f4b7-67b3-c43d1cbd3d33\"}","DeviceList-7a2e3737-e53f-ca42-336d-1e7bc9006662":"{\"current_value\":\"9.94\",\"at\":\"2015-12-10T11:05:04.000000Z\",\"max_value\":\"53.0\",\"min_value\":\"0.63\",\"unit\":{\"symbol\":\"C\",\"label\":\"Celsius\"},\"device_id\":\"104C04B70008008D\",\"driver\":\"a1b8e79b-1317-bd9a-996c-a8913e83dcaa\",\"name\":\"North (Outdoor)\",\"color\":\"lightblue\",\"active\":true,\"id\":\"7a2e3737-e53f-ca42-336d-1e7bc9006662\",\"tags\":[\"Outdoor Temperature\"]}","ProviderDriverList":"a1b8e79b-1317-bd9a-996c-a8913e83dcaa","ProviderDriverList-a1b8e79b-1317-bd9a-996c-a8913e83dcaa":"{\"name\":\"...\",\"initialized\":true,\"_classname\":\"Xively\",\"endpoint\":\"https://api.xively.com/v2/feeds/{%feedid}\",\"feedid\":\"1170443106\",\"apikey\":\"a5TgP0CCf8DMNjuSsAeFNApq9EwgZTkPugftcZ38v5nrRFRj\",\"unit\":null,\"id\":\"a1b8e79b-1317-bd9a-996c-a8913e83dcaa\",\"title\":\"Temperature in Hamburg\",\"private\":\"false\",\"website\":\"http://mb.aquarius.uberspace.de/\",\"feed\":\"https://api.xively.com/v2/feeds/1170443106.json\",\"auto_feed_url\":\"https://api.xively.com/v2/feeds/1170443106.json\",\"status\":\"live\",\"updated\":\"2015-12-09T02:10:06.708100Z\",\"created\":\"2013-11-24T18:07:11.547198Z\",\"creator\":\"https://personal.xively.com/users/bretschn\",\"version\":\"1.0.0\",\"product_id\":\"KQNtTJT9c6dapUq2isxx\",\"device_serial\":\"GHR7VQGHX9KT\",\"provider_id\":1170443106}","ProviderList":"4e29ed7e-95a4-65ce-3baf-9b34f8c3607c","ProviderList-4e29ed7e-95a4-65ce-3baf-9b34f8c3607c":"{\"name\":\"Temperature in Hamburg\",\"driver\":\"a1b8e79b-1317-bd9a-996c-a8913e83dcaa\",\"id\":\"4e29ed7e-95a4-65ce-3baf-9b34f8c3607c\",\"show_devices_button\":false}","debug":"undefined"};
		window.localStorage.clear();
		_.each(data, function (item, key) {
			window.localStorage[key] = item;
		});

		window.location.reload();
	}
});
