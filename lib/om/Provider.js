window.Provider = Backbone.Model.extend({
	defaults: function() {
		return {
			name: "empty provider...",
			driver: null
		};
	},
	destroy: function(options) {
		$("#panel").panelmenu('remove', document.getElementById(this.id));
		if (this.has("driver")) {
			var driver = ProviderDrivers.findWhere({id: this.get("driver")}).destroy();
			ProviderDrivers.fetch();
		}
		Backbone.Model.prototype.destroy.call(this, options);
	}
});