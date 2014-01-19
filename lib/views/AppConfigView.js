var AppConfigView = Backbone.View.extend({
	events: {
		"click input[type='checkbox']" : "set",
		"click .demo" : "demo",
		"click .cancel" : "cancel",
	},
	height: 220,
	render: function() {
		var template = _.template( $("#appconfig_template").html(), this.model.attributes );
		this.$el.html( template );
	},
	set : function () {
		var data = {
			show_points : $( "input[name='show_points']", this.$el ).prop('checked'),
			show_lines : $( "input[name='show_lines']", this.$el ).prop('checked')
		}
		this.model.set(data);
		this.model.save();
	},
	demo : function () {
		$.ajax({
			dataType: "json",
			url: "lib/demo.json",
			success: function (result) {
				AppView.hideView();

				var ids = [];
				Providers.each(function (provider) {
					ids.push(provider.id);
				});
				ids.forEach(function (id) {
					Providers.get(id).delete();
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
	},
	cancel : function () {
		AppView.hideView(true);
	},
});