window.ProviderDriverList = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("ProviderDriverList"),
	model: function(attrs, options) {
		switch (attrs.name) {
			case "Xively" :
				return model = new ProviderXively(attrs, options);
			break;
			case "ThingSpeak" :
				return model = new ProviderThingSpeak(attrs, options);
			break;
			default :
				return model = new ProviderDriver(attrs, options);
			break;
		}
	},
	nextOrder: function() {
		if (!this.length) return 1;
		return this.last().get('order') + 1;
	},
	comparator: 'order'
});

window.ProviderDrivers = new ProviderDriverList();
ProviderDrivers.fetch();