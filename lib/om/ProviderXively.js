window.ProviderXively = ProviderDriver.extend({
	name : 'Xively',
	defaults : function () {
		return _.extend(ProviderDriver.prototype.defaults(),
		{
			name : 'Xively',
			endpoint: 'https://api.xively.com/v2/feeds/{%feedid}',
			feedid: '',
			apikey: ''
		});
	},
	headers : function () {
		return {
			"X-ApiKey" : this.get('apikey')
		}
	},
	urls : function () {
		return {
			feed_info : this.get('endpoint') + "?content=summary"
		}
	}
});