window.ProviderDriver = Backbone.Model.extend({
	get: function (attr) {
		if (typeof this[attr] == 'function')
		{
			return this[attr]();
		}
		return Backbone.Model.prototype.get.call(this, attr);
	},
	defaults: function() {
		return {
			name: '...',
			initialized: false
		};
	},
	complete: function (str) {
		var data = this;
		return str.replace(/\{%(\w*)\}/g, function(m, key) {
			return data.has(key) ? data.get(key) : "";
		});
	},
	meta: function (callback) {
		var urls = this.urls();
		var url = this.complete(urls["feed_info"]);
		this.load(url, "get", null, function (result) { 
			callback(result); 
		});
	},
	destroy: function(options) {
		Devices.where({driver: this.id}).forEach(function (item) {
			item.destroy();
		});
		Devices.fetch();
        Backbone.Model.prototype.destroy.call(this, options);
	},
	load: function (url, method, data, callback, dataType) {
		AppView.showMask();
		var that = this;

		if (dataType == "jsonp") {
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
			return;
		}
	
		var req = $.ajax({
			dataType: "json",
			url: url,
			crossDomain: true,
			contentType: 'application/json',
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
			},
			statusCode: {
				404: function() {
					alert( "page not found" );
				}
			}
		}).fail(function() {
			alert( "error" );
		});
	}
});

