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
});