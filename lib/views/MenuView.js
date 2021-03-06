var MenuView = (function () {
	var is_open = false;
	var transformProp = false;
	var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
	for(var i = 0; i < prefixes.length; i++) {
		if(document.createElement('div').style[prefixes[i]] !== undefined) {
			transformProp = prefixes[i];
		}
	}
	var close = function (timeout) {
		t = timeout || 1;
		window.setTimeout(function () {
			is_open = false;
			$(".mainmenu").css(transformProp, 'translateY(-' + ($(".menu_container").height() - 20) + 'px)');
			$(".mainmenu .handle").removeClass("show_up");
			$(".mainmenu .handle").addClass("show_down");			
		}, t);
	};
	var open = function () {
		is_open = true;
		$(".mainmenu").css(transformProp, 'translateY(0px)');
		$(".mainmenu .handle").addClass("show_up");
		$(".mainmenu .handle").removeClass("show_down");
	};
	return {
		toggle: function () {
			if (is_open) {
				close();
			} else {
				open();
			}
		},
		open: open,
		close: close
	}
})();

$(document).ready(function () {
	var Hammertime = new Hammer(document.getElementById('upper_menu_handle'), {
		prevent_default: true,
		no_mouseevents: true
	});
	Hammertime.on("tap", function (e) {
		MenuView.toggle();
	});
});