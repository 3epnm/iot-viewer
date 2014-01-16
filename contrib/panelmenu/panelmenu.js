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
			//onRemove : null,
			//onChange : null,
			onSelect : null

		}, options || {});

		var width = function () {
			var width = 26;
			for (var i=0; i<obj.menu_items.length; i++) {
				width += $(obj.menu_items[i]).width() + 18;
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

		this.update_panel = function () {
			window.setTimeout(function () {
				$(obj.inner).width(width());

				window.setTimeout(function () { 
					obj.interrupt = false; 
				}, 100);

				var max = $(obj.inner).width() - $(obj.menu).width();

				if (obj.pos >= 0) {
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

		this.remove_item = function (elem) {
			for (var i=0; i<obj.menu_items.length; i++) {
				if (obj.menu_items[i] == elem) {
					elem.parentNode.removeChild(elem);
					obj.menu_items.splice(i,1);
					obj.update_panel();
					return;
				}
			}
		}
		
		this.add_item = function (name, id) {
			var callback = function (name) {
				if (!name)
					return;

				var item = document.createElement("input");
				$(item).addClass("item text center");
				$(item).attr("autocomplete","off"); 
				$(item).attr("autocorrect", "off"); 
				$(item).attr("autocapitalize", "off")
				$(item).attr("spellcheck", "false");
				$(item).attr("id", (id ? id : "item_" + obj.menu_items.length));
				$(item).attr("size", (name != '' ? name.length + 1 : 10));
				$(item).attr("value", name);
				$(item).attr("readonly", "readonly");
				$(item).attr("type", "text");

				var hammeritem = new Hammer(item, {
					prevent_default: false,
					no_mouseevents: false
				});

				hammeritem.on('tap', function () {
					if (obj.interrupt || $(item).data("focus"))
						return;
					deactivate(this);

					$(this).addClass("active");
					
					if (typeof(settings.onSelect) == "function")
						settings.onSelect(this);
				});

				$(obj.inner).prepend($(item));

				if (typeof(settings.onCreate) == "function")
					settings.onCreate(item);
				
				obj.update_panel();

				obj.menu_items.push(item);
			}

			$(obj.add).blur();

			if (name == '') {
				AppView.showPrompt("Please enter a name", "", callback);
			} else {
				callback(name);
			} 
		};

		var hammeradd = new Hammer(obj.add, {
			prevent_default: false,
			no_mouseevents: false
		});

		hammeradd.on("tap", function () {
			deactivate(this);
			var item = obj.add_item('');
			move(0);
			$(item).trigger("tap");
		});

		var move_handler = function () {
			var pw = $(obj.menu).width();
			var ph = pw/2;
			var iw = $(obj.inner).width();
			if ($(this).hasClass("right")) {
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
		}

		var hammermoveleft = new Hammer($(".left", HTMLdiv)[0], {
			prevent_default: false,
			no_mouseevents: false
		});

		hammermoveleft.on("tap", move_handler);

		var hammermoveright = new Hammer($(".right", HTMLdiv)[0], {
			prevent_default: false,
			no_mouseevents: false
		});

		hammermoveright.on("tap", move_handler);

		var hammermove = new Hammer(obj.menu, {
			prevent_default: false,
			no_mouseevents: false
		});

		hammermove.on("dragstart", function (e) { 
			obj.interrupt = true;
			obj.last = 0;
		});

		hammermove.on("dragend", obj.update_panel);

		hammermove.on("drag", function (e) {
			var evt = ["left", "right"];
			if (evt.indexOf(e.gesture.direction)>=0) {
				obj.pos += e.gesture.deltaX - obj.last;
				obj.last = e.gesture.deltaX;
				$(obj.menu).css(transformProp, "translateX(" + obj.pos + "px)");
			}
		});		
	}

	var methods = {
		add : function (item, id) {
			$(this).data('panelmenu').add_item(item, id);
		},
		remove : function (item) {
			$(this).data('panelmenu').remove_item(item);
		},
		update : function (model) {
			$('#' + model.get('menuid')).val(model.get('name'));
			$('#' + model.get('menuid')).attr("size", model.get('name').length + 1);
			$(this).data('panelmenu').update_panel();
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