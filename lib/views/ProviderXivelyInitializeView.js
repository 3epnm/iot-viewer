var ProviderXivelyInitializeView = Backbone.View.extend({
	height: 160,
	initialize: function() {
		this.render();
	},
	serialize : function() {
		return {
			feedid: $(".feedid", this.$el).val(),
			apikey: $(".apikey", this.$el).val()
		};
	},
	render: function() {
		var template = _.template( $("#xively_initialize").html(), this.model.attributes );
		this.$el.html( template );
	}
});