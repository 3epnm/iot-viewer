var ProviderOpenSenseInitializeView = Backbone.View.extend({
	height: 160,
	initialize: function(){
		this.render();
	},
	serialize : function() {
		return {
			feedids: $(".feedids", this.$el).val(),
			sense_key: $(".sense_key", this.$el).val()
		};
	},
	render: function() {
		var template = _.template( $("#opensense_initialize").html(), this.model.attributes );
		this.$el.html( template );
	}
});