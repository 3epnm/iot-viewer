window.Provider = Backbone.Model.extend({
	defaults: function() {
		return {
			name: "empty provider...",
			driver: null
		};
	}
});