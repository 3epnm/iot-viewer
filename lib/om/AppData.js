window.AppData = Backbone.Model.extend({
	defaults: function() {
		return {
			from: null,
			to: null,
			show_points : false,
			show_lines : true
		};
	}
});