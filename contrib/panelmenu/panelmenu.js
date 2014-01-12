/*! Panelmenu - v0.1dev - 2014-01-11
 * http://mb.aquarius.uberspace.de/panel.js
 *
 * Copyright (c) 2014 Marcel Bretschneider <marcel.bretschneider@gmail.com>;
 * Licensed under the MIT license */

(function($) {
	"use strict";

	var PanelMenu = function(element, options, transformProp)
	{
		var obj = this;

		obj.interrupt = false;
		obj.pos = 0;
		obj.last = 0;
		obj.menu_items = [];

		var HTMLdiv = ($(element))[0];

		obj.menu = ($(".items", HTMLdiv))[0];
		obj.inner = ($(".inner", HTMLdiv))[0];
		obj.add = ($(".add", HTMLdiv))[0];

		var settings = $.extend({
			onNew : null,
			onRemove : null,
			onChange : null,
			onSelect : null

		}, options || {});

		var width = function () {
			var width = 25;
			for (var i=0; i<obj.menu_items.length; i++) {
				width += $(obj.menu_items[i]).width() + 17;
			}
			return width;
		}

		var move = function (pos) {
			obj.pos = pos;
			$(obj.menu).addClass("smooth");
			window.setTimeout(function () { 
				$(obj.menu).removeClass("smooth"); 
			}, 500);
			$(obj.menu).css(transformProp, "translateX(" + obj.pos + "px)");
		}

		var update = function () {
			window.setTimeout(function () {
				$(obj.inner).width(width());

				window.setTimeout(function () { 
					obj.interrupt = false; 
				}, 100);

				var max = $(obj.inner).width() - $(obj.menu).width();

				if (obj.pos > 0) {
					move(0);
				} else if (Math.abs(obj.pos) > max) {
					move(-max);
				}
				obj.last = 0;
			}, 100);
		}

		var deactivate = function (elem) {
			$(".active", obj.inner).removeClass("active");
		}

		var remove_item = function (elem) {
			for (var i=0; i<obj.menu_items.length; i++) {
				if (obj.menu_items[i] == elem) {
					elem.parentNode.removeChild(elem);
					obj.menu_items.splice(i,1);
					return;
				}
			}
		}

		var blur = function (elem) {
			if ($(elem).val() == "") {
				remove_item(elem);
				if (typeof(settings.onRemove) == "function")
					settings.onRemove(elem);
			} else {
				$(elem).addClass("center");
				$(elem).attr("readonly", "readonly");
				$(elem).data("focus", false);

				if (typeof(settings.onChange) == "function")
					settings.onChange(elem);	
			}
			update();
		};

		this.add_item = function (name) {
			var item = document.createElement("input");
			$(item).addClass("item text center");
			$(item).attr("id", "item_" + obj.menu_items.length);
			$(item).attr("size", (name != undefined ? name.length + 1 : 3));
			$(item).attr("value", (name != undefined ? name : ""));
			$(item).attr("readonly", "readonly");
			$(item).attr("type", "text");
			$(item).data("focues", false);

			$(item).click(function () {
				if (obj.interrupt || $(item).data("focus"))
					return;
				deactivate(this);

				$(this).addClass("active");
				if (typeof(settings.onSelect) == "function")
					settings.onSelect(this);
			});

			$(item).dblclick(function () {
				if (obj.interrupt || $(item).data("focus"))
					return;
				deactivate(this);

				$(item).data("focus", true);
				$(this).removeClass("center");
				$(this).removeAttr("readonly");

				var val = $(this).val();
				var that = this;
				
				window.setTimeout(function () { 
					$(that).val(val); 
					$(that).focus(); 
				}, 100);
			});

			$(item).keydown(function(e) {
				var len = $(this).val().length;
				if (len > 2) {
					$(this).attr("size", len + 1);
				}
				if(e.which == 13) {
					$(this).blur();
				}
			});

			$(item).blur(function () { blur(this); });
			
			$(obj.inner).prepend($(item));

			if (typeof(settings.onCreate) == "function")
				settings.onCreate(item);
			
			update();

			obj.menu_items.push(item);
			return item;
		};

		$(obj.add).click(function () {
			deactivate(this);
			var item = obj.add_item(this);
			move(0);
			$(item).trigger("dblclick");
		});

		$(".move", HTMLdiv).click(function () {
			var pw = $(obj.menu).width();
			var ph = pw/2;
			var iw = $(obj.inner).width();
			if ($(this).hasClass("left")) {
				if (obj.pos - ph > iw - pw)
					move(obj.pos - ph);
				else
					move(-(iw-pw));
			} else {
				if (obj.pos - ph >= ph)
					move(obj.pos + ph);
				else
					move(0);
			}
			$(this).blur();
		});

		var hammertime = new Hammer(obj.menu, {
			prevent_default: true,
			no_mouseevents: true
		});

		hammertime.on("dragstart", function (e) { 
			obj.interrupt = true;
			obj.last = 0;
		});

		hammertime.on("dragend", update);

		hammertime.on("drag", function (e) {
			var evt = ["left", "right"];
			if (evt.indexOf(e.gesture.direction)>=0) {
				obj.pos += e.gesture.deltaX - obj.last;
				obj.last = e.gesture.deltaX;
				$(obj.menu).css(transformProp, "translateX(" + obj.pos + "px)");
			}
		});		
	}

	var methods = {
		add : function (item) {
			$(this).data('panelmenu').add_item(item);
		},
		init : function (options) {
			var transformProp = false;
			var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
			for(var i = 0; i < prefixes.length; i++) {
				if(document.createElement('div').style[prefixes[i]] !== undefined) {
					transformProp = prefixes[i];
				}
			}
			if (transformProp) {
				var element = $(this);
				if (!element.data('panelmenu')) {
					var panelmenu = new PanelMenu(element, options, transformProp);
					element.data('panelmenu', panelmenu);
				}
			}
		}
	};

	$.fn.panelmenu = function(methodOrOptions)
	{
		var _arguments = arguments;
		return this.each(function() {
			if ( methods[methodOrOptions] ) {
				return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( _arguments, 1 ));
			} else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
				return methods.init.apply( this, _arguments );
			} else {
				$.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.panelmenu' );
			}
		});
	};
})(jQuery);
