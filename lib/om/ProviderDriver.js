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
	del: function() {
		var id = this.id;
		this.destroy({
			success : function () {
				var ids = [];
				Devices.where({driver: id}).forEach(function (device) {
					ids.push(device.id);
				});
				ids.forEach(function(id) {
					Devices.get(id).del();
				});
			}
		})
		
	},
	load: function (url, method, data, callback) {
		AppView.showMask();
		var that = this;

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
		});
	}
});

