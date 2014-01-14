var FormView = function () {
	this.currentView = null;
	this.currentError = null;
	this.currentConfirm = null;

	this.showView = function (view) {
		if (this.currentView) {
			this.currentView.close();
		}
		this.currentView = view;
		this.currentView.render();

		if ($("#form").parent().height() == view.height) {
			$("#form").html(this.currentView.el);
		} else {
			var that = this;
			window.setTimeout(function () {
				$("#form").html(that.currentView.el);
			}, 100);
			$("#form").parent().height(view.height);			
		}
	}
	this.hideView = function () {
		$("#form").parent().height(60);

		if (!this.currentView) return;
		this.currentView.close();
		this.currentView = null;
	}
	this.showConfirm = function (msg) {
		this.currentConfirm = new ConfirmView();

		this.currentConfirm.render(msg);
		$("#confirm div").html(this.currentConfirm.el);
		$("#confirm").toggleClass( "open" );
	}
	this.hideConfirm = function () {
		if (!this.currentConfirm) return;
		$("#confirm").toggleClass( "open" );
		this.currentConfirm.close();
		this.currentConfirm = null;
	}
	this.showError = function (headline, message) {
		this.currentError = new ErrorView();

		this.currentError.render({ headline: headline, message: message });
		$("#error div").html(this.currentError.el);
		$("#error").toggleClass( "open" );
	}
	this.hideError = function () {
		if (!this.currentError) return;
		$("#error").toggleClass( "open" );
		this.currentError.close();
		this.currentError = null;
	}
	this.showMask = function () {
		var top = ($(document).height() - 75) / 2;
		$("#mask .wait").css("margin-top", top + "px");
		$("#mask").show();
	},
	this.hideMask = function () {
		$("#mask").hide();
	}
}
