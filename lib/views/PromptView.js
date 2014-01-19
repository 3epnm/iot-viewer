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
		AppView.hidePrompt();
		AppView.hideMask();
	},
	ok : function () {
		var name = $( "#prompt_value", this.$el ).val();
		if (this.callback) {
			this.callback(name);
		}
		AppView.hidePrompt();
		AppView.hideMask();
	}
});