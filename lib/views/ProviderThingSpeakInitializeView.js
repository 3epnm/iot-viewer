var ProviderThingSpeakInitializeView = Backbone.View.extend({
	events: {
		"click .initialize" : "save",
		"click .delete" : "delete"
	},
	height: 320,
	initialize: function() {
		this.render();
	},
	serialize : function() {
		return {
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
	},
	delete : function () {

	}
});