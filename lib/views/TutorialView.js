var TutorialView = Backbone.View.extend({
	events: {
		"click .start" : "start",
		"click .demo"  : "demo",
		"click .cancel" : "cancel",
		"click .set" : "set",
		"click .next" : "next",
		"click .prev" : "prev"
	},
	initialize : function () {
		this.$el = $("#tutorial td .tutorial_template");
		this.render();
	},
	render: function() {
		var template = _.template( $("#tutorial_template").html(), { } );
		this.$el.html(template);
		$("#tutorial").show();
	},
	set : function () {
		var val = !$( "input[name='hide_tutorial']", this.$el ).prop('checked') ;
		this.model.set({ show_tutorial: val});
		this.model.save();
	},
	load_tutorial_step : function () {
		var template = _.template( $("#tutorial_template_introduction_" + this.step).html(), { } );
		this.$el.html(template);
		$(this.$el).removeClass("tutorial_template_introduction_" + (this.step-1));
		$(this.$el).addClass("tutorial_template_introduction_" + this.step);

		window.setTimeout(function () {
			$(".inner", this.$el).addClass("introduction_inner");
		}, 1);
		window.setTimeout(function () {
			$("#video").show();

			document.getElementById("video").addEventListener("ended", function (e) {
				var $last = $(".content .last");
				if (!$last.hasClass("shown")) {
					$(".content .shown").removeClass("shown");
					$last.addClass("shown");
				}
				$(".content .continue").show();
			});
			var callback = function (e) {
				var now = Math.floor(this.currentTime);
				$(".content .continue").hide();
				var has = false;
				$(".content .step").each(function (index, item) {
					var time = $(item).attr('class').match(/t(\d+)/);
					var $next = $(".content ." + time[0]);
					if (parseInt(time[1]) == now && !$next.hasClass("shown")) {
						$(".content .shown").removeClass("shown");
						$next.addClass("shown");
					}
				});
			};
			document.getElementById("video").addEventListener("play", callback);
			document.getElementById("video").addEventListener("timeupdate", callback);
			document.getElementById("video").play();
		}, 1000);
	},
	start : function () {
		$(".tutorial_template").addClass("tutorial_template_introduction");
		$(".tutorial_template").addClass("start_introduction");
		window.setTimeout(function () {
			//$(".tutorial_template").removeClass("start_introduction");
		}, 1000);
		this.step1();
	},
	step1 : function () {
		this.step = 1;		
		this.load_tutorial_step();
	},
	step2 : function () {
		this.step = 2;
		this.load_tutorial_step();
	},
	step3: function () {
		this.step = 3;		
		this.load_tutorial_step();
	},
	step4 : function () {
		this.step = 4;		
		this.load_tutorial_step();
	},
	step5 : function () {
		this.step = 5;		
		this.load_tutorial_step();
	},
	step6 : function () {
		this.step = 6;		
		this.load_tutorial_step();
	},
	next : function () {
		this.step++;
		this.load_tutorial_step();
	},
	prev: function () {
		this.step--;
		this.load_tutorial_step();
	},
	cancel : function () {
		this.hide();
		this.close();
	},
	show : function () {
		$("#tutorial").show();
	},
	hide : function() {
		this.close();
		$("#tutorial").hide();
	}
});

$(document).ready(function () {
	if (AppConfig.get("show_tutorial")) {
		new TutorialView({ model: AppConfig });
	}
});
