window.Device = Backbone.Model.extend({
	defaults: function() {
		return {
			driver: null,
			at: null,
			current_value: null,
			device_id: null,
			name: "",
			color: "",
			max_value: null,
			min_value: null,
			active: false
		};
	},
	devicedata : null,
	getDeviceData : function () {
		if (!this.devicedata) {
			this.devicedata = new DeviceData();
			this.devicedata.setDevice(this);
			this.devicedata.setDriver(ProviderDrivers.get(this.get("driver")));
		}
		return this.devicedata;
	},
	getUnitSymbol : function () {
		var symbol = "";
		if (this.has("unit") && this.get("unit").symbol)
			symbol = this.get("unit").symbol;
		return symbol;
	},
	del : function () {
		this.destroy({
			success : function () {

			}
		});
	}
});