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
	},
	load_application_data : function (url) {
		if (!url) {
			AppView.showError('URL not given.', 'No URL to the application.json given.');
			return;
		}
		$.ajax({
			dataType: "json",
			url: url,
			success: function (result) {
				AppView.hideView();

				var ids = [];
				Providers.each(function (provider) {
					ids.push(provider.id);
				});
				ids.forEach(function (id) {
					Providers.get(id).del();
					$("#panel").panelmenu('remove', document.getElementById(id));
				});
				PlotView.update();
				for (var name in result.provider) {
					var provider = Providers.create({name : name});
					provider.save();

					$("#panel").panelmenu('add', provider.get("name"), provider.id);

					var data = { };
					for (var i in result.provider[name]) {
						if (i != "classname") {
							data[i] = result.provider[name][i];
						}
					}
					var driver = new window[result.provider[name].classname](data);
					ProviderDrivers.create(driver);

					provider.set({driver : driver.id})
					provider.save();
					driver.load_meta();
				}
			},
			error: function (jqXHR, textStatus, errorThrow) {
				AppView.showError(textStatus, errorThrow);
			}
		});
	}
});
