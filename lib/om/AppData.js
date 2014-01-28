window.AppData = Backbone.Model.extend({
	defaults: function() {
		return {
			from: null,
			to: null,
			load_from: null,
			load_to: null,
			show_points : false,
			show_lines : true,
			show_tutorial : true,
			pan : false,
			zoom : true,
			cursor: true
		};
	},
	get: function (attr) {
		if (typeof this[attr] == 'function')
			return this[attr]();
		return Backbone.Model.prototype.get.call(this, attr);
	},
	getFrom: function () {
		return new Date(this.get('from'));
	},
	getTo: function () {
		return new Date(this.get('to'));
	},
	getFromTime: function () {
		return new Date(this.get('from'));
	},
	getToTime: function () {
		return new Date(this.get('to'));
	},
	getLoadFromTime : function () {
		var datetime;
		if (this.get('load_from'))
			datetime =  new Date(this.get('load_from'));
		datetime = this.getFrom();

		return datetime;
	},
	getLoadToTime : function () {
		var datetime;
		if (this.get('load_to'))
			datetime =  new Date(this.get('load_to'));
		datetime = this.getTo();

		return datetime;
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
