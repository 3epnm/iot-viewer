var date_range = {
	from: new Date(AppConfig.get('from')),
	to:  new Date(AppConfig.get('to'))
}

var setDateRange = function () {
	AppConfig.set(date_range);
	AppConfig.save();
	PlotView.load();
}

function getIndexForValue(elem, value) {
	for (var i=0; i<elem.options.length; i++)
		if (elem.options[i].value == value)
			return i;
}

function pad(number) {
	if ( number < 10 ) {
		return '0' + number;
	}
	return number;
}

var onChangeCallback = function (elem) {
	var section = elem.name.substr(0, elem.name.indexOf("_"));
	var arr = {'date' : 'setDate', 'month' : 'setMonth', 'fullYear' : 'setFullYear', 'hours' : 'setHours', 'minutes' : 'setMinutes'};
	var date = new Date();
	for (var s in arr) {
		var i = ($("form[name='date_" + section + "'] select[name='" + section + "_" + s + "']"))[0].value;
		eval ("date." + arr[s] + "(" + i + ")");
	}
	date.setSeconds(0);
	update(section, date, true);
	var format = date.getFullYear() + '-' + pad( date.getMonth() + 1 ) + '-' + pad( date.getDate() ) + ' ' + pad( date.getHours() ) + ':' + pad( date.getMinutes() );
	$('.date_range_' + section + '_header .selection').html(format);
};

function update(section, datetime, checkdate) {	
	$("#" + section + "_date").drum('setIndex', datetime.getDate()-1); 
	$("#" + section + "_month").drum('setIndex', datetime.getMonth()); 
	$("#" + section + "_fullYear").drum('setIndex', getIndexForValue($("#" + section + "_fullYear")[0], datetime.getFullYear())); 
	$("#" + section + "_hours").drum('setIndex', datetime.getHours()); 
	$("#" + section + "_minutes").drum('setIndex', datetime.getMinutes()); 

	var delta = date_range.to.getTime() - date_range.from.getTime();

	date_range[section] = datetime;

	if (checkdate) {
		if (section == "from" && date_range["from"] > date_range["to"]) {
			update("to", new Date(datetime.getTime() + delta));
			onChangeCallback(document.getElementById("to_fullYear"));
		}
		if (section == "to" && date_range["from"] > date_range["to"]) {
			update("from", new Date(datetime.getTime() - delta));
			onChangeCallback(document.getElementById("from_fullYear"));
		}
	} else {
		onChangeCallback(document.getElementById(section + "_fullYear"));
	}
}

$(document).ready(function () {
	$(".date_range .handle").click(function () {
		$(".date_range" ).toggleClass("lower_menu_close");
		$(".date_range .handle" ).toggleClass("show_up");
		$(".date_range .handle" ).toggleClass("show_down");
		$(".date_range .handle .btn_grp" ).toggle();
	});

	$("select.date").drum({ 
		onChange : onChangeCallback
	});

	update('from', date_range.from, false);
	update('to', date_range.to, false);

	$(".date_range .today").click(function (e) {
		$(e.currentTarget).blur();
		e.stopPropagation();

		var now = new Date();
		
		update("from", new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0), false);
		update("to", new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 0, 0), false);

		setDateRange();
	});

	$(".date_range .now").click(function (e) {
		$(e.currentTarget).blur();
		e.stopPropagation();

		var datetime = new Date();
		var delta = date_range.to.getTime() - date_range.from.getTime();

		update("to", datetime, false);
		update("from", new Date(datetime.getTime() - delta), false);

		setDateRange();
	});

	$(".date_range .set").click(function (e) {
		$(e.currentTarget).blur();
		e.stopPropagation();

		setDateRange();
	});
});

AppConfig.on("change", function (e) {
	date_range = {
		from: new Date(AppConfig.get('from')),
		to:  new Date(AppConfig.get('to'))
	}
	update('from', date_range.from, false);
	update('to', date_range.to, false);
});