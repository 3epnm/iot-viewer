var DriversAvail = Backbone.View.extend({
	avail: [
		ProviderXively,
		ProviderThingSpeak
	],
	initviews: {
		"Xively": ProviderXivelyInitializeView,
		"ThingSpeak": ProviderThingSpeakInitializeView
	},
	height: 140,
	render: function () {
		var template = _.template( $("#drivers_avail").html(), { } );
		this.$el.html( template );

		var self = this;
		for (var i=0; i<this.avail.length; i++) {
			var btn = document.createElement("button");
			$(btn).data("driver", this.avail[i]);

			$(btn).click(function (e) {
				var driver = new ($(this).data("driver"))();

				var model = ProviderDrivers.create({name: driver.name});
				self.model.set({ "driver" : model.id});
				self.model.save();

				$("#" + self.model.get("menuid")).trigger("click");
			});

			$(btn).addClass('btn btn-default');
			$(btn).text(this.avail[i].prototype.name);
			$(".btn-group", this.$el).append(btn);
		}		
	}
});