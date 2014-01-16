window.ProviderDriver = Backbone.Model.extend({
	defaults: function() {
		return {
			name: '...',
			initialized: false
		};
	},
	complete: function (str) {
		var data = this;
		return str.replace(/\{%(\w*)\}/g, function(m, key) {
			return data.has(key) ?data.get(key) : "";
		});
	},
	meta: function (callback) {
		var urls = this.urls();
		var url = this.complete(urls["feed_info"]);
		this.load(url, "get", null, function (result) { 
			callback(result); 
		});
	},
	load: function (url, method, data, callback) {
		AppView.showMask();

		var that = this;
		$.ajax({ 
			url: url,
			crossDomain: true,
			success: function (result) {
				AppView.hideMask();
				callback(result);
			},
			beforeSend: function (xhr) {
				var headers = that.headers();
				for (var name in headers) {
					xhr.setRequestHeader(name, headers[name]);
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				if (xhr.status == 0) {
					AppView.showError("Unknown Error", null, null);
				} else {
					that.show_error.apply(that, arguments);
				}
			}
		});
	}
});

