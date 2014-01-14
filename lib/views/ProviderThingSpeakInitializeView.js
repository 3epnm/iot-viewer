var ProviderThingSpeakInitializeView = Backbone.View.extend({
	events: {
		"click .initialize" : "save"
	},
	initialize: function() {
		this.render();
	},
	serialize : function() {
		return {
			endpoint:  $(".endpoint", this.$el).val(),
			channelid: $(".channelid", this.$el).val(),
			apikey:    $(".apikey", this.$el).val()
		};
	},
	render: function() {
		var template = _.template( $("#thingspeak_initialize").html(), this.model.attributes );
		this.$el.html( template );
	},
	save : function () {
		this.model.set(this.serialize());
		this.model.save();
	}
});