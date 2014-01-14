$(document).ready(function () {
	$(".mainmenu .handle").click(function () {

		myFormView.hideView();

		$(".mainmenu").toggleClass("upper_menu_close");
		$(".mainmenu .handle").toggleClass("show_up");
		$(".mainmenu .handle").toggleClass("show_down");
		$(".mainmenu .handle button").toggle();
	});
});