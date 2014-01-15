window.AppDataList = Backbone.Collection.extend({
	model: AppData,
	localStorage: new Backbone.LocalStorage("AppDataList")
});

window.AppDataHistory = new AppDataList();

var AppConfig = AppDataHistory.at(0);

if (!AppConfig) {
	AppDataHistory.create({ 
		from: 0, 
		to: 0
	});
	AppConfig = AppDataHistory.at(0);
} 

var now = new Date();
AppConfig.set({
	from: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 6, now.getMinutes() + 1, 0, 0), 
	to: now
});

AppConfig.save();