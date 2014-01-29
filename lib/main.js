Hammer.plugins.fakeMultitouch();

if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && !window.navigator.standalone) {
	$('html').addClass('ipad ios7');
}
if (navigator.userAgent.match(/Trident/i) || navigator.userAgent.match(/MSIE/i)) {
	$('html').addClass('msie');
}

var fixViewportHeightInterrupt = false;
var fixViewportHeightTimeout = null;

var fixViewportHeight = function() {
	if (fixViewportHeightInterrupt)
		return;

	document.documentElement.style.height = window.innerHeight + "px";
	if (document.body.scrollTop !== 0) {
		window.scrollTo(0, 0);
	}
};

$(document).ready(function () {
	window.addEventListener("scroll", fixViewportHeight, false);
	window.addEventListener("orientationchange", fixViewportHeight, false);
	fixViewportHeight();
});

$(document).on("focus", "input[type='text']", false, function (e) {
	if (fixViewportHeightTimeout) {
		window.clearTimeout(fixViewportHeightTimeout);
	}
	fixViewportHeightInterrupt = true;

	if (/(iPad|iPhone|iPod)/g.test( navigator.userAgent ))
		$(".date_range").hide();
});

$(document).on("blur", "input[type='text']", false, function (e) {
	fixViewportHeightTimeout = window.setTimeout(function () {
		fixViewportHeightInterrupt = false;
		fixViewportHeight();
		if (/(iPad|iPhone|iPod)/g.test( navigator.userAgent ))
			$(".date_range").show();
	}, 100);
});

var DateRange = {
	status : {
		from: new Date(AppConfig.get('from')),
		to:  new Date(AppConfig.get('to'))
	},
	setStatus : function (section, datetime) {
		this.status[section] = datetime;

		DateRange.update(section, datetime);

		if (section == "from" && this.status.from > this.status.to) {
			this.status.to = new Date(datetime.getTime() + 120000);
			this.update("to", this.status.to);
		}

		if (section == "to" && this.status.from > this.status.to) {
			this.status.from = new Date(datetime.getTime() - 120000);
			this.update("from", this.status.from);
		}
	},
	update : function (section, datetime) {	
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
	},
	set : function () {
		AppConfig.set(this.status);
		AppConfig.save();
		PlotView.load();
	},
	reload : function () {
		this.update('from', AppConfig.getFrom());
		this.update('to', AppConfig.getTo());
		PlotView.load();		
	}
}

$(document).ready(function () {
	$("#panel").panelmenu({
		onBeforeCreate : function (name) {
			var provider = Providers.create({name: name});
			provider.save();
			return provider.id;
		},
		onCreate : function (id) {
			AppView.showView(new ProviderView({ model : Providers.get(id) }));
		},
		onSelect : function (e) {
			var provider = Providers.get($(e).attr("id"));
			var driver = ProviderDrivers.findWhere({id: provider.get("driver")});
			if (!driver || !driver.get("initialized")) {
				AppView.showView(new ProviderView({ model : provider }));
			} else {
				AppView.showView(new DevicesView({
					model : driver
				}));
			}
		}
	});

	$("#panel .settings").click(function () {
		$(this).blur();
		$("#panel").panelmenu("deselect");
		AppView.showView(new AppConfigView({
			model : AppConfig
		}));
	});

	Providers.forEach (function (item) {
		$("#panel").panelmenu('add', item.get("name"), item.id);
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

			DateRange.setStatus(section, datetime);
		}
	});

	DateRange.reload();

	var Hammertime = new Hammer(document.getElementById('lower_menu_handle'), {
		prevent_default: true,
		no_mouseevents: true
	});
	
	var toggle_lowermenu_state = function () {
		$(".date_range").toggleClass("lower_menu_close");
		$(".date_range .handle").toggleClass("show_up");
		$(".date_range .handle").toggleClass("show_down");
		$(".date_range .handle .btn_grp").toggle();
	};

	Hammertime.on("tap", function (e) {
		$(e.target).blur();

		var set = null;
		if ($(e.target).hasClass("now")) {

			var datetime = new Date();
			set = {
				from: new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), datetime.getHours() - 6, datetime.getMinutes(), 0, 0), 
				to: datetime
			};

		} else if ($(e.target).hasClass("set")) {

			DateRange.set();

		} else if ($(e.target).hasClass("today")) {

			var now = new Date();
			set = {
				from: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
				to : new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 0, 0)
			};

		} else if ($(e.target).hasClass("left")) {

			var datetime = AppConfig.getFrom();
			set = {
				from: new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), datetime.getHours() - 6, datetime.getMinutes(), 0, 0), 
				to: datetime
			};

		} else if ($(e.target).hasClass("right")) {

			var datetime = AppConfig.getTo();
			set = {
				from: datetime,
				to: new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), datetime.getHours() + 6, datetime.getMinutes(), 0, 0)
			};
		}

		if (set) {
			AppConfig.save(set, {
				success : function () {
					DateRange.reload();
				}
			});			
		};

		toggle_lowermenu_state();
	});
});