var DevicesView = Backbone.View.extend({
	events: {
		"click .set" : "set",
		"click input[type=checkbox]" : "set",
		"click .edit" : "edit",
		"click .reload" : "reload"
	},
	height: 390,
	initialize: function() {
		this.render();
	},
	render: function() {
		var vars = {
			title: this.model.get("title"),
			listItems : [ ]
		}
		var devices = Devices.where({driver: this.model.id}).forEach(function (item) {
			vars.listItems.push({ 
				id: item.id, 
				name: item.get("name"), 
				active: item.get("active"),
				current_value: item.get("current_value")
			});
		});

		var template = _.template( $("#devices_view").html(), vars );
		this.$el.html( template );
	},
	set: function () {
		var that = this;
		var devices = Devices.where({driver: this.model.id}).forEach(function (item) {
			var data = {
				name : $( "input[name='" + item.id + "_name']", this.$el ).val(),
				active : $( "input[name='" + item.id + "_activated']", this.$el ).prop('checked')
			}
			item.set(data);
			item.save();
		});
		PlotView.load();
	},
	edit: function () {
		var provider = Providers.findWhere({ "driver" : this.model.id }); 
		AppView.showView(new ProviderView({ model : provider }));
	},
	reload: function () {
		this.model.load_devices();
	}
});