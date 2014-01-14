window.ProviderXively = ProviderDriver.extend({
	name : 'Xively',
	defaults : function () {
		return _.extend(ProviderDriver.prototype.defaults(),
		{
			name : 'Xively',
			endpoint: 'https://api.xively.com/v2/feeds/{%feedid}',
			feedid: '',
			apikey: '',

			auto_feed_url: "",
			title: "",
			created: "",
			updated: "",
			creator: "",
			website: "",
			device_serial: "",
			feed: "",
			provider_id: 0,
			private: false,
			product_id: "",
			status: "",
			version: ""
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