var ProviderThingSpeakInitializeView = Backbone.View.extend({
	height: 160,
	initialize: function() {
		this.render();
	},
	serialize : function() {
		return {
			channelid: $(".channelid", this.$el).val(),
			apikey: $(".apikey", this.$el).val()
		};
	},
	render: function() {
		var template = _.template( $("#thingspeak_initialize").html(), this.model.attributes );
		this.$el.html( template );
	}
});