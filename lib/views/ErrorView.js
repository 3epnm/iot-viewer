var ErrorView = Backbone.View.extend({
	events: {
		"click .ok" : "ok"
	},
	callback: false,
	initialize : function (callback) {
		this.callback = callback;
	},
	render: function(content) {
		var template = _.template( $("#error_template").html(), content );
		this.$el.html( template );
	},
	ok : function () {
		if (typeof(this.callback) == "function") {
			this.callback();
		}

		AppView.hideError();
		AppView.hideMask();
	}
});