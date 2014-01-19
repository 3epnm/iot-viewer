var date_range = {
	from: new Date(AppConfig.get('from')),
	to:  new Date(AppConfig.get('to'))
}

function update(section, datetime) {	
	var getIndexForValue = function (elem, value) {
		for (var i=0; i<elem.options.length; i++)
			if (elem.options[i].value == value)
				return i;
	}

	$("#" + section + "_date").drum('setIndex', datetime.getDate()-1); 
	$("#" + section + "_month").drum('setIndex', datetime.getMonth()); 
	$("#" + section + "_fullYear").drum('setIndex', getIndexForValue($("#" + section + "_fullYear")[0], datetime.getFullYear())); 
	$("#" + section + "_hours").drum('setIndex', datetime.getHours()); 
	$("#" + section + "_minutes").drum('setIndex', datetime.getMinutes()); 
	
	$('.date_range_' + section + '_header .selection').html(datetime.getFormatDateTime());		
}

var AppConfigChange = function (e) {
	update('from', AppConfig.getFrom());
	update('to', AppConfig.getTo());
	PlotView.load();
};

AppConfig.on("change", AppConfigChange);

$(document).ready(function () {
	$(".date_range .handle").click(function () {
		$(".date_range" ).toggleClass("lower_menu_close");
		$(".date_range .handle" ).toggleClass("show_up");
		$(".date_range .handle" ).toggleClass("show_down");
		$(".date_range .handle .btn_grp" ).toggle();
	});

	$("select.date").drum({ 
		onChange : function (elem) {
			var section = elem.name.substr(0, elem.name.indexOf("_"));
			var arr = {'date' : 'setDate', 'month' : 'setMonth', 'fullYear' : 'setFullYear', 'hours' : 'setHours', 'minutes' : 'setMinutes'};
			var datetime = new Date();
			for (var s in arr) {
				var i = ($("form[name='date_" + section + "'] select[name='" + section + "_" + s + "']"))[0].value;
				eval ("datetime." + arr[s] + "(" + i + ")");
			}
			datetime.setSeconds(0);

			date_range[section] = datetime;

			if (section == "from" && date_range["from"] > date_range["to"]) {
				update("to", new Date(datetime.getTime() + 60000));
			}
			if (section == "to" && date_range["from"] > date_range["to"]) {
				update("from", new Date(datetime.getTime() - 60000));
			}
		}
	});

	AppConfigChange();

	$(".date_range .left").click(function (e) {
		$(e.currentTarget).blur();
		e.stopPropagation();

		var datetime = AppConfig.getFrom();
		AppConfig.set({
			from: new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), datetime.getHours() - 6, datetime.getMinutes(), 0, 0), 
			to: datetime
		});
		AppConfig.save();
	});

	$(".date_range .right").click(function (e) {
		$(e.currentTarget).blur();
		e.stopPropagation();

		var datetime = AppConfig.getTo();
		AppConfig.set({
			from: datetime,
			to: new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), datetime.getHours() + 6, datetime.getMinutes(), 0, 0)
		});
		AppConfig.save();
	});

	$(".date_range .today").click(function (e) {
		$(e.currentTarget).blur();
		e.stopPropagation();

		var now = new Date();
		
		AppConfig.set({
			from: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
			to : new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 0, 0)
		});
		AppConfig.save();
	});

	$(".date_range .now").click(function (e) {
		$(e.currentTarget).blur();
		e.stopPropagation();

		var datetime = new Date();
		AppConfig.set({
			from: new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), datetime.getHours() - 6, datetime.getMinutes(), 0, 0), 
			to: datetime
		});
		AppConfig.save();
	});

	$(".date_range .set").click(function (e) {
		$(e.currentTarget).blur();
		e.stopPropagation();
		AppConfig.set(date_range);
		AppConfig.save();
	});
});