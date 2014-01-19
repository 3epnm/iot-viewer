Hammer.plugins.fakeMultitouch();

var fixViewportHeightInterrupt = false;
var fixViewportHeightTimeout = null;

var fixViewportHeight = function() {
	if (fixViewportHeightInterrupt || !navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i))
		return;
	document.documentElement.style.height = window.innerHeight + "px";
	if (document.body.scrollTop !== 0) {
		window.scrollTo(0, 0);
	}
};

if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && window.innerHeight != document.documentElement.clientHeight) {
	window.addEventListener("scroll", fixViewportHeight, false);
	window.addEventListener("orientationchange", fixViewportHeight, false);
	fixViewportHeight();

	document.body.style.webkitTransform = "translate3d(0,0,0)";
}

$(document).on("focus", "input[type='text']", false, function (e) {
	if (fixViewportHeightTimeout) {
		window.clearTimeout(fixViewportHeightTimeout);
	}
	fixViewportHeightInterrupt = true;
});

$(document).on("blur", "input[type='text']", false, function (e) {
	fixViewportHeightTimeout = window.setTimeout(function () {
		fixViewportHeightInterrupt = false;
		fixViewportHeight();
	}, 100);
});

$(document).ready(function () {
	PlotView.load();

	$("#panel .settings").click(function () {
		$(this).blur();
		AppView.showView(new AppConfigView({
			model : AppConfig
		}));
	});

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

	Providers.forEach (function (item) {
		$("#panel").panelmenu('add', item.get("name"), item.id);
	});
});