var PromptView = Backbone.View.extend({
	events: {
		"click .ok" : "ok",
		"click .cancel" : "cancel"
	},
	callback: null,
	initialize : function (callback) {
		this.callback = callback;
	},
	render: function(content) {
		var template = _.template( $("#prompt_template").html(), content);
		this.$el.html( template );
	},
	cancel : function () {
		if (this.callback)
			this.callback(null);
		AppView.hidePrompt();
		AppView.hideMask();
	},
	ok : function () {
		if (this.callback)
			this.callback($( "input[name='value']", this.$el ).val());
		AppView.hidePrompt();
		AppView.hideMask();
	}
});