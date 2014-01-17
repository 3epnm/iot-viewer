window.ProviderOpenSense = ProviderDriver.extend({
	name : 'OpenSense',
	disabled: true,
	defaults : function () {
		return _.extend(ProviderDriver.prototype.defaults(),
		{
			name : 'OpenSense',
			endpoint: '',
			feedid: '',
			apikey: '',
		});
	}
});


