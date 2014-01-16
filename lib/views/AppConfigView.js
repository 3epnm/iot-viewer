var AppConfigView = Backbone.View.extend({
	events: {
		"click input" : "set"
	},
	height: 300,
	render: function() {
		var template = _.template( $("#appconfig_template").html(), this.model.attributes );
		this.$el.html( template );
	},
	set : function () {
		var data = {
			show_points : $( "input[name='show_points']", this.$el ).prop('checked'),
			show_lines : $( "input[name='show_lines']", this.$el ).prop('checked')
		}

		this.model.set(data);
		this.model.save();

		PlotView.update();
	}
});