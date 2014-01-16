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

				if ($(selector).parent().height() == currentView.height) {
					$(selector).html(currentView.el);
				} else {
					window.setTimeout(function () {
						$(selector).html(currentView.el);
					}, 200);
					$(selector).parent().height(currentView.height);
					$(selector).height(currentView.height - 75);
				}
			},
			hideView : function () {
				$(selector).html("");
				$(selector).parent().height(60);

				if (!currentView) return;
				currentView.close();
				currentView = null;
			},
			showConfirm : function (msg, callback) {
				currentConfirm = new ConfirmView(callback);
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
			showError : function (headline, message, callback) {
				AppView.hideSpinner();
				currentError = new ErrorView(callback);				
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
			showPrompt : function (text, value, callback) {
				AppView.showMask(true);
				currentPrompt = new PromptView(callback);
				currentPrompt.render({ text: text, value: value });
				$("#prompt div").html(currentPrompt.el);
				$("#prompt").toggleClass( "open" );
			},
			hidePrompt : function () {
				if (!currentPrompt) return;
				$("#prompt").toggleClass( "open" );
				currentPrompt.close();
				currentPrompt = null;
				AppView.hideMask(true);
			},
			showMask : function (hide_spinner) {
				if (!hide_spinner) {
					var top = ($(document).height() - 75) / 2;
					$("#mask .wait").css("margin-top", top + "px");
				} else {
					AppView.hideSpinner();
				}
				$("#mask").show();
			},
			hideMask : function () {
				$("#mask").hide();
				$("#mask .wait").show();
			},
			hideSpinner : function () {
				$("#mask .wait").hide();
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
