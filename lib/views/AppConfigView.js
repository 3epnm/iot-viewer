var AppConfigView = Backbone.View.extend({
	events: {
		"change input[type='checkbox']" : "set",
		"click .save" : "save",
		"click .cancel" : "cancel"
	},
	height: 310,
	render: function() {
		var template = _.template( $("#appconfig_template").html(), this.model.attributes );
		this.$el.html( template );
		$('input[type="checkbox"], input[type="radio"]', this.$el).bootstrapSwitch();

		var that = this;
		$('input[type="radio"]', this.$el).on('switch-change', function (e, data) {
			switch ($(data.el).val()) {
				case "pan" :
					if (data.value && that.model.get("zoom"))
						$("input[value='zoom']", that.$el).bootstrapSwitch('setState', false);
				break;
				case "zoom" :
					if (data.value && that.model.get("pan"))
						$("input[value='pan']", that.$el).bootstrapSwitch('setState', false);
				break;
			}
			that.set();
		});
	},
	set : function () {
		var data = {
			show_points : $( "input[name='show_points']", this.$el ).prop('checked'),
			show_lines : $( "input[name='show_lines']", this.$el ).prop('checked'),
			cursor : $( "input[name='cursor']", this.$el ).prop('checked'),
			pan : $( "input[value='pan']", this.$el ).prop('checked'),
			zoom : $( "input[value='zoom']", this.$el ).prop('checked')
		}
		this.model.set(data);
		this.model.save();

		PlotView.update(true);
	},
	cancel : function () {
		AppView.hideView(true);
	}
});