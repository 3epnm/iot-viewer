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

(function($, window, undefined) {
	// First check to see if the platform is an iPhone or iPod
	if(/iP/.test(navigator.platform) && /Safari/i.test(navigator.userAgent)){
		var mobileSafari = "Safari";
	}

	// Set the div height
	function setHeight($div) {
		var new_height = $('body').height();
		// if mobileSafari add +60px
		if (typeof mobileSafari === 'string'){ new_height += 60 };
		$div.css('height', new_height);
	}
 
	setHeight($('.wrapper'));
	$(window).resize(function() {
		setHeight.call(this, $('.wrapper'));
	});

}(jQuery, this));

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
				Providers.create({menuid: $(e).attr("id")});
			}
		},
		onRemove : function (e) {
			var provider = Providers.findWhere({menuid: $(e).attr("id")});
			if (provider.has("driver")) {
				var driver = ProviderDrivers.findWhere({id: provider.get("driver")});
				ProviderDrivers("delete", driver);
			}
			Providers.sync("delete", provider);
		},
		onChange : function (e) {
			var provider = Providers.findWhere({menuid: $(e).attr("id")});
			provider.set({name: $(e).val()});
			provider.save();
			if (!provider.has("driver")) {
				$(e).trigger("click");
			}
		},
		onSelect : function (e) {
			var provider = Providers.findWhere({menuid: $(e).attr("id")});
			var drivers = new DriversAvail({ model : provider });
			if (!provider.has("driver")) {
				AppView.showView(drivers);
			} else {
				var driver = ProviderDrivers.findWhere({id: provider.get("driver")});
				if (!driver.get("initialized")) {
					var view = drivers.initviews[driver.get("name")];
					AppView.showView(new view({
						model : driver
					}));
				} else {
					AppView.showView(new DevicesView({
						model : driver
					}));
				}
			}
		}
	});

	Providers.forEach (function (item) {
		$("#panel").panelmenu('add', item.get("name"), item.get("menuid"));
	});
});