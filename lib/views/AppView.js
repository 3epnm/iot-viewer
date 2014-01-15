var AppView = (function () {
	var instance;

	function init () {
		var currentView = null;
		var currentError = null;
		var currentConfirm = null;
		var selector = "#form";

		return {
			showView : function (view) {
				if (currentView)
					currentView.close();
				currentView = view;
				currentView.render();

				if ($(selector).parent().height() == view.height) {
					$(selector).html(currentView.el);
				} else {
					window.setTimeout(function () {
						$(selector).html(currentView.el);
					}, 200);
					$(selector).parent().height(view.height);
					$(selector).height(view.height - 75);
				}
			},
			hideView : function () {
				$(selector).parent().height(60);

				if (!currentView) return;
				currentView.close();
				currentView = null;
			},
			showConfirm : function (msg) {
				currentConfirm = new ConfirmView();
				currentConfirm.render(msg);
				$("#confirm div").html(currentConfirm.el);
				$("#confirm").toggleClass( "open" );
			},
			hideConfirm : function () {
				if (!currentConfirm) return;
				$("#confirm").toggleClass( "open" );
				currentConfirm.close();
				currentConfirm = null;
			},
			showError : function (headline, message) {
				currentError = new ErrorView();
				currentError.render({ headline: headline, message: message });
				$("#error div").html(currentError.el);
				$("#error").toggleClass( "open" );
			},
			hideError : function () {
				if (!currentError) return;
				$("#error").toggleClass( "open" );
				currentError.close();
				currentError = null;
			},
			showMask : function () {
				var top = ($(document).height() - 75) / 2;
				$("#mask .wait").css("margin-top", top + "px");
				$("#mask").show();
			},
			hideMask : function () {
				$("#mask").hide();
			}
		}
	};
	
	return (function () {
		if ( !instance ) {
			instance = init();
		}
		return instance;
	})();
})();
