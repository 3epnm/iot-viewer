window.Device = Backbone.Model.extend({
	defaults: function() {
		return {
			driver: null,
			at: null,
			current_value: null,
			device_id: null,
			name: "",
			max_value: null,
			min_value: null,
			active: false
		};
	}
});