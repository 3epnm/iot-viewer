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
	test: function () {
		this.load("feed_info", "get", null, function (result) { 
			console.dir(result); 
		});
	},
	load: function (url, method, data, callback) {
		var that = this;
		var url = this.complete();
		$.ajax({ 
			url: url,
			complete: function (result) {
				callback($.parseJSON( result.responseText ));
			},
			beforeSend : function (xhr) {
				var headers = that.headers();
				for (var name in headers) {
					xhr.setRequestHeader(name, headers[name]);
				}
			}
		});			
	}
});