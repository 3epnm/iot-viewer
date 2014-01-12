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

var date_range = {
	from: null,
	to: null
}

function update(section, datetime) {
	$("#" + section + "_date").drum('setIndex', datetime.getDate()-1); 
	$("#" + section + "_month").drum('setIndex', datetime.getMonth()); 
	$("#" + section + "_fullYear").drum('setIndex', getIndexForValue($("#" + section + "_fullYear")[0], datetime.getFullYear())); 
	$("#" + section + "_hours").drum('setIndex', datetime.getHours()); 
	$("#" + section + "_minutes").drum('setIndex', datetime.getMinutes()); 

	date_range[section] = datetime;
}

$(document).ready(function () {
	$(".date_range .handle").click(function () {
		$(".date_range" ).toggleClass("lower_menu_close");
		$(".date_range .handle" ).toggleClass("show_up");
		$(".date_range .handle" ).toggleClass("show_down");
		$(".date_range .handle button" ).toggle();
	});
	
	$("select.date").drum({ 
		onChange : function (elem) {
			var section = elem.name.substr(0, elem.name.indexOf("_"));
			var arr = {'date' : 'setDate', 'month' : 'setMonth', 'fullYear' : 'setFullYear', 'hours' : 'setHours', 'minutes' : 'setMinutes'};
			var date = new Date();
			for (var s in arr) {
				var i = ($("form[name='date_" + section + "'] select[name='" + section + "_" + s + "']"))[0].value;
				eval ("date." + arr[s] + "(" + i + ")");
			}
			date.setSeconds(0);
			update(section, date);
			var format = date.getFullYear() + '-' + pad( date.getMonth() + 1 ) + '-' + pad( date.getDate() ) + ' ' + pad( date.getHours() ) + ':' + pad( date.getMinutes() );
			$('.date_range_' + section + '_header .selection').html(format);
		}
	});

	var now = new Date();
	var init_date_from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
	var init_date_to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 0);

	update('from', new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
	update('to', new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 0));

	$(".date_range button").click(function () {
		console.debug(date_range);
	});
});