window.Provider = Backbone.Model.extend({
	defaults: function() {
		return {
			name: "empty provider...",
			menuid: null,
			driver: null
		};
	}
});