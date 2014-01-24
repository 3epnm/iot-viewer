window.ProviderDriverJsonP = ProviderDriver.extend({
	load: function (url, method, data, callback) {
		var that = this;
		$.jsonp({
			url: url + "&callback=?",
			success: function(data) {
				callback(data);
			},
			error: function(d, msg) {
				that.show_error.apply(that, arguments);
			}
		});
	}
});

