window.ProviderList = Backbone.Collection.extend({
	model: Provider,
	localStorage: new Backbone.LocalStorage("ProviderList")
});

window.Providers = new ProviderList();
Providers.fetch();