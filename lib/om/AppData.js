window.AppData = Backbone.Model.extend({
	defaults: function() {
		return {
			from: null,
			to: null,
			show_points : false,
			show_lines : true
		};
	},
	get: function (attr) {
		if (typeof this[attr] == 'function')
		{
			return this[attr]();
		}
		return Backbone.Model.prototype.get.call(this, attr);
	},
	getFrom: function () {
		return new Date(this.get('from'));
	},
	getTo: function () {
		return new Date(this.get('to'));
	},
	getFromTime: function () {
		return new Date(this.get('from')).getTime();
	},
	getToTime: function () {
		return new Date(this.get('to')).getTime();
	}
});
