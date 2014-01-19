var ProviderView = Backbone.View.extend({
	events: {
		"click .cancel" : "cancel",
		"click .save" : "save",
		"click .delete" : "delete",
		"click .devices" : "devices"		
	},
	height: 240,
	subview: null,
	render: function() {
		var obj = this.model.attributes;

		obj.show_devices_button = false;
		var driver = null;
		if (this.model.has("driver")) {
			driver = ProviderDrivers.findWhere({id: this.model.get("driver")});
			if (driver.get("initialized")) {
				obj.show_devices_button = true;
			}
		}

		var template = _.template( $("#provider_template").html(), obj );
		this.$el.html( template );

		if (driver) {
			this.subview = driver.getView({
				model : driver
			});
		} else {
			this.subview = new ProviderDriverView({
				model : this.model
			});
		}

		$(".form-group", this.$el).after(this.subview.el);
		this.height += this.subview.height;
	},
	save: function () {
		var data = {
			name : $( "input[name='name']", this.$el ).val()
		}
		this.model.set(data);
		this.model.save();
		
		$('#panel').panelmenu('update', this.model);

		if (this.model.has("driver")) {
			var driver = ProviderDrivers.findWhere({id: this.model.get("driver")});
			var data = this.subview.serialize(this.$el);
			driver.set(data);
			driver.save();
			if (driver.is_complete()) {
				driver.load_meta(function (model) {
					AppView.showView(new DevicesView({
						model : model
					}));
				});
			} else {
				AppView.showError("Please finalize the form", "Provider credentials missed", null);
			}
		};
	},
	cancel : function () {
		if (this.subview) {
			this.subview.close();
		}	
		AppView.hideView(true);
		$("#panel").panelmenu('deselect');
	},
	devices: function () {
		AppView.showView(new DevicesView({
			model : ProviderDrivers.findWhere({id: this.model.get("driver")})
		}));
	},
	delete : function () {
		var that = this;
		AppView.showConfirm("Are you sure?", function () {
			$("#panel").panelmenu('remove', document.getElementById(that.model.id));
			that.model.delete();
			AppView.hideView(true);
			PlotView.update();
			that.remove();
		})
	}
});