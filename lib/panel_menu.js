var sensor_feeds = [];

var get_inner_width = function () {
	var width = 25;
	for (var i=0; i<sensor_feeds.length; i++) {
		width += $(sensor_feeds[i]).width() + 17;
	}
	return width;
}

var move = function (pos) {
	$("#panelmenu").addClass("smooth");
	window.setTimeout(function () { $("#panelmenu").removeClass("smooth"); }, 500);
	$("#panelmenu").css(transformProp, "translateX(" + pos + "px)");
	$("#panelmenu").data("pos", pos);
}

var stop = false;
var last_pos = 0;
var update = function () {
	var t = 100;
	window.setTimeout(function () {
		var width = get_inner_width();
		$("#inner-list").width(width);

		window.setTimeout(function () { stop = false; }, 100);
		var pos = $("#panelmenu").data("pos");
		var max = $("#inner-list").width() - $("#panelmenu").width();

		if (pos > 0) {
			move(0);
		} else if (Math.abs(pos) > max) {
			move(-max);
		}
		last_pos = 0;
	}, t);
}

var unset_active = function (elem) {
	$(".inner .list .active").removeClass("active");
}

var destroy_sensor_feed = function (elem) {
	for (var i=0; i<sensor_feeds.length; i++) {
		if (sensor_feeds[i] == elem) {
			elem.parentNode.removeChild(elem);
			sensor_feeds.splice(i,1);
			return;
		}
	}
}

var blur = function (elem) {
	if ($(elem).val() == "") {
		destroy_sensor_feed(elem);
	} else {
		$(elem).addClass("center");
		$(elem).attr("readonly", "readonly");
		$(elem).data("focus", false);		
	}
	update();
};

var add_sensor_feed = function (elem, name) {
	var new_sensor_feed = document.createElement("input");
	$(new_sensor_feed).addClass("icon text center");
	$(new_sensor_feed).attr("id", "sensor_feed_" + sensor_feeds.length);
	$(new_sensor_feed).attr("size", (name != undefined ? name.length + 1 : 3));
	$(new_sensor_feed).attr("value", (name != undefined ? name : ""));
	$(new_sensor_feed).attr("readonly", "readonly");
	$(new_sensor_feed).attr("type", "text");
	$(new_sensor_feed).data("focues", false);

	$(new_sensor_feed).click(function () {
		if (stop || $(new_sensor_feed).data("focus"))
			return;
		unset_active(this);

		$(this).addClass("active");
		console.log($(this).attr("id") + " click");
	});

	$(new_sensor_feed).dblclick(function () {
		if (stop || $(new_sensor_feed).data("focus"))
			return;
		unset_active(this);

		$(new_sensor_feed).data("focus", true);
		$(this).removeClass("center");
		$(this).removeAttr("readonly");

		console.log($(this).attr("id") + " dblclick");
		var val = $(this).val();
		var that = this;
		window.setTimeout(function () { $(that).val(val); $(that).focus(); }, 100);
	});

	$(new_sensor_feed).keydown(function(e) {
		var len = $(this).val().length;
		if (len > 2) 
			$(this).attr("size", len + 1);
		if(e.which == 13) {
			$(this).blur();
		}
	});

	$(new_sensor_feed).blur(function () { blur(this); });
	
	$("#inner-list").prepend($(new_sensor_feed));
	update();

	sensor_feeds.push( new_sensor_feed );
	return new_sensor_feed;
};

var transformProp;
var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
for(var i = 0; i < prefixes.length; i++) {
	if(document.createElement('div').style[prefixes[i]] !== undefined) {
		transformProp = prefixes[i];
	}
}

$(document).ready(function () {
	$("#panelmenu").data("pos", 0);

	$("#panel #add").click(function () {
		unset_active(this);
		var new_sensor_feed = add_sensor_feed(this);
		move(0);
		$(new_sensor_feed).trigger("dblclick");
	});

	$("#panel .move").click(function () {
		var pos = $("#panelmenu").data("pos");
		var pw = $("#panelmenu").width();
		var ph = pw/2;
		var iw = $("#inner-list").width();
		if ($(this).hasClass("left")) {
			if (pos - ph > iw - pw)
				move(pos - ph);
			else
				move(-(iw-pw));
		} else {
			if (pos - ph >= ph)
				move(pos + ph);
			else
				move(0);
		}
		$(this).blur();
	});

	var hammertime = new Hammer(document.getElementById("panelmenu"), {
		prevent_default: true,
		no_mouseevents: true
	});

	hammertime.on("dragstart", function (e) { 
		stop = true;
		last_pos = 0;
	});

	hammertime.on("dragend", update);

	hammertime.on("drag", function (e) {
		var evt = ["left", "right"];
		if (evt.indexOf(e.gesture.direction)>=0) {
			var pos = $("#panelmenu").data("pos");

			pos += e.gesture.deltaX - last_pos;
			last_pos = e.gesture.deltaX;

			$("#panelmenu").data("pos", pos);
			$("#panelmenu").css(transformProp, "translateX(" + pos + "px)");
		}
	});
});
