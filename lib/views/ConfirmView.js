var ConfirmView = Backbone.View.extend({
	events: {
		"click .yes" : "yes",
		"click .no"  : "no"
	},
	callback: false,
	initialize : function (callback) {
		this.callback = callback;
	},
	render: function(msg) {
		var template = _.template( $("#confirm_template").html(), { msg : msg } );
		this.$el.html( template );
	},
	yes : function () {
		if (typeof(this.callback) == "function") {
			this.callback();
		}
		AppView.hideConfirm();
	},
	no : function () {
		AppView.hideConfirm();
	}
});