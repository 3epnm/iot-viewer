if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && window.innerHeight != document.documentElement.clientHeight) {
	var fixViewportHeight = function() {
		document.documentElement.style.height = window.innerHeight + "px";
		if (document.body.scrollTop !== 0) {
			window.scrollTo(0, 0);
		}
	}.bind(this);

	window.addEventListener("scroll", fixViewportHeight, false);
	window.addEventListener("orientationchange", fixViewportHeight, false);
	fixViewportHeight();

	document.body.style.webkitTransform = "translate3d(0,0,0)";
}
(function($, window, undefined) {
    // First check to see if the platform is an iPhone or iPod
    if(/iP/.test(navigator.platform) && /Safari/i.test(navigator.userAgent)){
        var mobileSafari = "Safari";
    }
 
    // Set the div height
    function setHeight($div) {
        var new_height = $(this).height();
        // if mobileSafari add +60px
        if (typeof mobileSafari === 'string'){ new_height += 60 };
        $div.css('height', new_height);
    }
 
    setHeight($('.wrapper'));
    $(window).resize(function() {
        setHeight.call(this, $('.wrapper'));
    });
 
}(jQuery, this));