window.DeviceList = Backbone.Collection.extend({
	model: Device,
	localStorage: new Backbone.LocalStorage("DeviceList")
});

window.Devices = new DeviceList();
Devices.fetch();