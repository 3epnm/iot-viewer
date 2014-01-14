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
		this.load("feed_info", "get", null, function (result) { 
			callback(result); 
		});
	},
	load: function (url, method, data, callback) {
		myFormView.showMask();

		var that = this;
		var urls = this.urls();

		if (typeof(urls[url]) == 'undefined') {
			myFormView.showError( url + " not found in " + this.name + " driver.");
			return;
		}

		var url = this.complete(urls[url]);
		$.ajax({ 
			url: url,
			crossDomain: true,
			success: function (result) {
				callback(result);
			},
			beforeSend: function (xhr) {
				var headers = that.headers();
				for (var name in headers) {
					xhr.setRequestHeader(name, headers[name]);
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				myFormView.showError(xhr.statusText + " " + xhr.status, xhr.responseText);
			}
		});
	}
});

