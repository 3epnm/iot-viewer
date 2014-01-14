window.ProviderThingSpeak = ProviderDriver.extend({
	name : 'ThingSpeak',
	defaults : function () {
		return _.extend(ProviderDriver.prototype.defaults(), 
		{
			name : 'ThingSpeak',
			endpoint: "http://api.thingspeak.com/channels/{%channelid}/feed.json",
			channelid: "",
			apikey: ""
		});
	},
	headers : function () {
		return {
			"X-THINGSPEAKAPIKEY" : this.get('apikey')
		}
	},
	urls : function () {
		return {
			feed_info : this.get('endpoint') + "?result=1"
		}
	}
});