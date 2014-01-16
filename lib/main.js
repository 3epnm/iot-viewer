Hammer.plugins.fakeMultitouch();

if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && window.innerHeight != document.documentElement.clientHeight) {
	var fixViewportHeight = function() {
		document.documentElement.style.height = window.innerHeight + "px";
		if (document.body.scrollTop !== 0) {
			window.scrollTo(0, 0);
		}
	}.bind(this);

	window.addEventListener("scroll", fixViewportHeight, false);
	window.addEventListener("orientationchange", fixViewportHeight, false);
	fixViewportHeight();

	document.body.style.webkitTransform = "translate3d(0,0,0)";
}

$(document).delegate('.stopscrollcontent', 'touchmove', false);
$(document).delegate(".stopscrollcontent", "scrollstart", false);

$(document).ready(function () {
	PlotView.load();

	$("#panel .settings").click(function () {
		AppView.showView(new AppConfigView({
			model : AppConfig
		}));
	});

	$("#panel").panelmenu({
		onCreate : function (e) {
			if (!Providers.findWhere({menuid: $(e).attr("id")})) {
				var provider = Providers.create({name: $(e).val(), menuid: $(e).attr("id")});
				provider.save();
				AppView.showView(new ProviderView({ model : provider }));
			}
		},
		onSelect : function (e) {
			var provider = Providers.findWhere({menuid: $(e).attr("id")});
			var driver = ProviderDrivers.findWhere({id: provider.get("driver")});
			if (!driver.get("initialized")) {
				AppView.showView(new ProviderView({ model : provider }));
			} else {
				AppView.showView(new DevicesView({
					model : driver
				}));
			}
		}
	});

	Providers.forEach (function (item) {
		$("#panel").panelmenu('add', item.get("name"), item.get("menuid"));
	});
});