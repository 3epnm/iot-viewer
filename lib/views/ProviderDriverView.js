var ProviderDriverView = Backbone.View.extend({
	events: {
		"click .btn" : "save"
	},
	drivers: [
		{
			name : 'Xively',
			disabled : false,
			model : ProviderXively,
			view : ProviderXivelyInitializeView
		},
		{
			name : 'ThingSpeak',
			disabled : false,
			model : ProviderThingSpeak,
			view : ProviderThingSpeakInitializeView
		},
		{
		 	name : 'OpenSense',
			model : ProviderOpenSense,
			disabled : false,
			view : ProviderOpenSenseInitializeView
		}
	],
	height: 70,
	initialize: function(){
		this.render();
	},
	render: function() {
		var template = _.template( $("#drivers_view").html(), { drivers : this.drivers } );
		this.$el.html( template );
	},
	save: function (e) {
		var self = this;
		var selected = $(e.target).attr("data-name");
		this.drivers.forEach(function (item) {
			if (item.name == selected) {
				var driver = new item.model();
				ProviderDrivers.add(driver);
				driver.save();

				self.model.set({ "driver" : driver.id});
				self.model.save();

				AppView.showView(new ProviderView({ model : self.model }));
			}
		});
	}
});