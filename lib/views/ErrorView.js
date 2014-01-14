var ErrorView = Backbone.View.extend({
	events: {
		"click .ok" : "ok"
	},
	render: function(content) {
		var template = _.template( $("#error_template").html(), content );
		this.$el.html( template );
	},
	ok : function () {

	}
});