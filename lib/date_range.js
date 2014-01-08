Hammer.plugins.fakeMultitouch();

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

$(document).ready(function () {
	$(".date_range .handle").click(function () {
		$(".date_range" ).toggleClass("date_range_close");
		$(".date_range .handle" ).toggleClass("show_up");
		$(".date_range .handle" ).toggleClass("show_down");
	});
	
	$("select.date").drum({ 
		panelCount: 24,
		onChange : function (elem) {
			var section = elem.name.substr(0, elem.name.indexOf("_"));
			var arr = {'date' : 'setDate', 'month' : 'setMonth', 'fullYear' : 'setFullYear', 'hours' : 'setHours', 'minutes' : 'setMinutes'};
			var date = new Date();
			for (var s in arr) {
				var i = ($("form[name='date_" + section + "'] select[name='" + section + "_" + s + "']"))[0].value;
				eval ("date." + arr[s] + "(" + i + ")");
			}
			date.setSeconds(0);

			$("#" + section + "_date").drum('setIndex', date.getDate()-1); 
			$("#" + section + "_month").drum('setIndex', date.getMonth()); 
			$("#" + section + "_fullYear").drum('setIndex', getIndexForValue($("#from_fullYear")[0], date.getFullYear())); 
			$("#" + section + "_hours").drum('setIndex', date.getHours()); 
			$("#" + section + "_minutes").drum('setIndex', date.getMinutes()); 

			var format = date.getFullYear() + '-' + pad( date.getMonth() + 1 ) + '-' + pad( date.getDate() ) + ' ' + pad( date.getHours() ) + ':' + pad( date.getMinutes() );

			$('.date_range_' + section + '_header .selection').html(format);
		}
	});

	var now = new Date();
	var init_date_from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
	var init_date_to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 0);

	$("#from_date").drum('setIndex', init_date_from.getDate()-1); 
	$("#from_month").drum('setIndex', init_date_from.getMonth()); 
	$("#from_fullYear").drum('setIndex', getIndexForValue($("#from_fullYear")[0], init_date_from.getFullYear())); 
	$("#from_hours").drum('setIndex', init_date_from.getHours()); 
	$("#from_minutes").drum('setIndex', init_date_from.getMinutes()); 

	$("#to_date").drum('setIndex', init_date_to.getDate()-1); 
	$("#to_month").drum('setIndex', init_date_to.getMonth()); 
	$("#to_fullYear").drum('setIndex', getIndexForValue($("#to_fullYear")[0], init_date_to.getFullYear())); 
	$("#to_hours").drum('setIndex', init_date_to.getHours()); 
	$("#to_minutes").drum('setIndex', init_date_to.getMinutes()); 
});