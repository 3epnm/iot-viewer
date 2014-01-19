window.ProviderDriverJsonP = ProviderDriver.extend({
	load: function (url, method, data, callback) {
		AppView.showMask();
		var that = this;
		$.jsonp({
			url: url + "&callback=?",
			success: function(data) {
				AppView.hideMask();
				callback(data);
			},
			error: function(d, msg) {
				that.show_error.apply(that, arguments);
			}
		});
	}
});

