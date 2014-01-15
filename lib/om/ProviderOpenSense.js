window.ProviderOpenSense = ProviderDriver.extend({
	name : 'OpenSense',
	defaults : function () {
		return _.extend(ProviderDriver.prototype.defaults(),
		{
			name : 'OpenSense',
			endpoint: '',
			feedid: '',
			apikey: '',
		});
	},
	headers : function () {
		return {

		}
	},
	urls : function () {
		return {

		}
	},
	load_devices : function () {

	},
	load_data : function (devices, callback) {

	}
});


