window.ProviderList = Backbone.Collection.extend({
	model: Provider,
	localStorage: new Backbone.LocalStorage("ProviderList"),
	nextOrder: function() {
		if (!this.length) return 1;
		return this.last().get('order') + 1;
	},
	comparator: 'order'
});

window.Providers = new ProviderList();
Providers.fetch();