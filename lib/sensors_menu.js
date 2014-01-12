$(document).ready(function () {
	$(".sensors_menu .handle").click(function () {
		$(".sensors_menu").toggleClass("upper_menu_close");
		$(".sensors_menu .handle").toggleClass("show_up");
		$(".sensors_menu .handle").toggleClass("show_down");
		$(".sensors_menu .handle button").toggle();
	});
});