var ConfirmView = Backbone.View.extend({
	events: {
		"click .yes" : "yes",
		"click .no"  : "no"
	},
	render: function(msg) {
		var template = _.template( $("#confirm_template").html(), { msg : msg } );
		this.$el.html( template );
	},
	yes : function () {

	},
	no : function () {

	}
});