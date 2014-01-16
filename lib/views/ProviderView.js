var ProviderView = Backbone.View.extend({
	events: {
		"click .cancel" : "cancel",
		"click .save" : "save",
		"click .delete" : "delete"
	},
	avail: [
		ProviderXively,
		ProviderThingSpeak,
		ProviderOpenSense
	],
	initviews: {
		"Xively": ProviderXivelyInitializeView,
		"ThingSpeak": ProviderThingSpeakInitializeView,
		"OpenSense": ProviderOpenSenseInitializeView
	},
	height: 240,
	subview: null,
	serialize : function() {
		return {

		};
	},
	render: function() {
		var template = _.template( $("#provider_template").html(), this.model.attributes );
		this.$el.html( template );

		if (this.model.has("driver")) {
			var driver = ProviderDrivers.findWhere({id: this.model.get("driver")});
			this.subview = new this.initviews[driver.get("name")]({
				model : driver
			});
			$(".form-group", this.$el).after(this.subview.el);
			this.height += this.subview.height;		
		} else {
			var self = this;
			this.height += 70;
			$(".form-group", this.$el).after('<h5>Provider Type</h5><div class="form-group"><div class="drivers btn-group"></div></div>');
			for (var i=0; i<this.avail.length; i++) {
				var btn = document.createElement("button");
				$(btn).data("driver", this.avail[i]);

				$(btn).click(function (e) {
					var driver = new ($(this).data("driver"))();
					var model = ProviderDrivers.create({name: driver.name});
					model.save();

					self.model.set({ "driver" : model.id});
					self.model.save();

					AppView.showView(new ProviderView({ model : self.model }));
				});

				$(btn).addClass('btn btn-default');
				$(btn).text(this.avail[i].prototype.name);

				$(".drivers", this.$el).append(btn);
			}
		}
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
			var data = driver.serialize(this.$el);
			driver.set(data);
			driver.save();
			driver.load_meta();
		};
	},
	cancel : function () {
		this.subview.close();
		AppView.hideView();
	},
	delete : function () {
		var that = this;
		AppView.showConfirm("Are you sure?", function () {
			$("#panel").panelmenu('remove', document.getElementById(that.model.get('menuid')));
			if (that.model.has("driver")) {
				var driver = ProviderDrivers.findWhere({id: that.model.get("driver")});
				if (driver) 
					ProviderDrivers.sync("delete", driver);
			}
			Providers.sync("delete", that.model);		
			AppView.hideView();
			that.remove();			
		})
	}
});