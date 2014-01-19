window.ProviderDriverList = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("ProviderDriverList"),
	model: function(attrs, options) {
		switch (attrs._classname) {
			case "Xively" :
				return model = new ProviderXively(attrs, options);
			break;
			case "ThingSpeak" :
				return model = new ProviderThingSpeak(attrs, options);
			break;
			case "OpenSense" :
				return model = new ProviderOpenSense(attrs, options);
			break;
			default :
				return model = new ProviderDriver(attrs, options);
			break;
		}
	}
});

window.ProviderDrivers = new ProviderDriverList();
ProviderDrivers.fetch();