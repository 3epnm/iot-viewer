window.Provider = Backbone.Model.extend({
	defaults: function() {
		return {
			name: "empty provider...",
			driver: null
		};
	},
	del: function() {
		var driver = null;
		if (this.has("driver"))	driver = ProviderDrivers.get(this.get("driver"));
		this.destroy({
			success : function () {
				if (driver) {
					driver.del();
				}
			}
		});
	}
});