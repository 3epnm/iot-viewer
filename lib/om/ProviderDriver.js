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
		});
	},
	load_data : function (device, callback) {
		var d = device.getDeviceData();
		if (d.getMin() 
			&& d.getMax() 
			&& d.getMin() <= AppConfig.getLoadFromTime() 
			&& d.getMax() >= AppConfig.getLoadToTime()) 
		{
			callback(d.getData(AppConfig.getLoadFromTime(), AppConfig.getLoadToTime()));
			return;
		}

		this.load_provider_data(d, callback);
	},
	load: function (url, method, data, callback) {
		var that = this;

		var req = $.ajax({
			dataType: "json",
			url: url,
			crossDomain: true,
			contentType: 'application/json',
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

