window.DeviceData = Backbone.Model.extend({
	defaults: function() {
		return {
			data : {}
		};
	},
	device : null,
	setDevice : function (device) {
		this.device = device;
	},
	getDevice : function () {
		return this.device;
	},
	driver : null,
	setDriver : function (driver) {
		this.driver = driver;
	},
	getDriver : function () {
		return this.driver;
	},
	getMin : function () {
		var min = null;
		for (var i in this.get('data')) {
			i = parseInt(i);
			if (min == null || min > parseInt(i))
				min = parseInt(i);			
		} 
		if (min == null)
			return null;

		return new Date(min);
	},
	getMax : function () {
		var max = null;
		for (var i in this.get('data')) {
			i = parseInt(i);
			if (max == null || max < parseInt(i))
				max = i;
		} 
		if (max == null)
			return null;

		return new Date(max);
	},
	length : function () {
		var c = 0;
		for (var i in this.get('data')) 
			c++;
		return c;
	},
	addData : function (datetime, value) {
		var data = this.get("data");
		data[datetime.getTime()] = value;
		this.set({"data" : data});
	},
	prepareData : function (from, to) {
		var from = new Date(from.getTime() - (120*1000));
		var to = new Date(to.getTime() + (120*1000));
		var data = this.get("data");
		var ret = [];
		for (var i in data) {
			var date = new Date(parseInt(i));
			if (date >= from && date <= to) {
				ret.push([date.getTime(), data[i]]);
			}
		}
		ret.sort(function (a, b) {
			return a[0] - b[0];
		});
		return ret;
	},
	getData : function (from, to) {
		return { 
			symbol : this.getDevice().getUnitSymbol(),
			driver : this.getDriver().id,
			device : this.getDevice().get("device_id"),
			label  : this.getDevice().get("name"),
			color  : this.getDevice().get("color"), 
			data   : this.prepareData(from, to)
		};		
	}
});