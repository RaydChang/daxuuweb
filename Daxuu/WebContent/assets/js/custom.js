//Global Nav Script Start
(function() {
	//FIX for main menu touch not working in IE10, bug 125243
	var preventMouseUp = false;
	$('#main_nav .menu_sub a').mousedown(function () {
		preventMouseUp = true;
	}).mouseup(function() {
		if (preventMouseUp) {
			preventMouseUp = false;
		} else {
			this.click();
		}
	});
})();

function ShowSubmenu(elem) {
	$('.menu_sub').hide();
	$(elem).addClass('bg');
	$('a', elem).addClass('mainnav_link_over');
	$('.menu_sub', elem).slideDown(350);
}

$('#main_nav .top_nav_li:not(.last)').mouseenter(function (e) {
	ShowSubmenu(this)
}).mouseleave(function (e) {
	if ($(this).hasClass('bg')) {
		$(this).removeClass('bg');
		$('a', this).removeClass('mainnav_link_over');
		$('.menu_sub').stop(true, true);
		$('.menu_sub').hide();
	}
});
//Global Nav Script End

// MEMBERSHIP SECTION
$(document).ready(function () {
	$('.tabSelector > li').live('click', function (e) {
		e.preventDefault();
		$('li', $(this).parent()).removeClass('selected');
		$(this).addClass('selected');
		$('.tabItem', $(this).parent().parent()).removeClass('selected');
		var id = $(this).data('tab');
		if (id) {
			$('#' + id).addClass('selected');
		}
	});
});

// END OF MEMBERSHIP

// Text selection
function select(element) {
	var body = document.body, range, sel;
	if (document.createRange && window.getSelection) { // FF, Safari, Opera
		range = document.createRange();
		range.selectNodeContents(element);
		sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (body.createTextRange) { // IE
		document.selection.empty();
		range = body.createTextRange();
		range.moveToElementText(element);
		range.select();
	}
}
// End of text selection

//ipad scroll in samples browser.
var pref_x;
var scrolling = false;
var scrollLeft = false;
function featuresListScroll(event) {
	scrolling = true;
	var _this = $(this);
	event.preventDefault();
	var e = event.originalEvent;
	if (e.touches.length == 1) {
		var touch = e.touches[0]
		var scontent = $('.scroll-content', _this);
		var pageSize = 7; //(scontent.height() / _this.height());
		var x = touch.pageY - _this.offset().top;
		if (pref_x > x) {
			if (x < 0) { return; }
		}
		var sliderVertical = $('.slider-vertical', _this);
		var sliderValue = Math.round(100 * (Math.abs(x) / scontent.height()));
		var currentSliderValue = sliderVertical.slider('value');
		//console.log('currentValue: ' + currentSliderValue + ', sliderValue: ' + sliderValue);
		if (pref_x > x) {
			sliderValue = currentSliderValue - (sliderValue / pageSize);
		}
		else {
			sliderValue = currentSliderValue + (sliderValue / pageSize);
		}
		//console.log('sliderValue: ' + sliderValue);
		sliderVertical.slider('value', sliderValue);

		pref_x = x;
	}
}
function startTopNavigationScroll(event) {
	event.preventDefault();
	var e = event.originalEvent;
	if (e.touches.length == 1) {
		var touch = e.touches[0];
		var x = touch.pageX;
		if (pref_x > x) {
			scrollLeft = false;
		}
		else if (pref_x < x) {
			scrollLeft = true;
		}
		scrolling = true;
		pref_x = x;
	}

}
function endTopNavigationScroll(event) {
	if (scrolling) {
		if (!scrollLeft) {
			//console.log('scroll left');
			$("#nextNavButton").trigger('click');
		}
		else {
			//console.log('scroll right');
			$("#prevNavButton").trigger('click');
		}
	}
	scrolling = false;
}
function startMainNavigationMaximize(event) {
	event.preventDefault();
	var e = event.originalEvent;
	if (e.touches.length == 1) {
		var y = e.touches[0].pageY;
		if (pref_x < y) {
			scrolling = true;
		}
		pref_x = y;
	}
}
function endMainNavigationMaximize(event) {
	if (scrolling) {
		//console.log('nav maximize');
		$('a#minimize').trigger('click');
	}
}

$(document).ready(function () {
	if ($.fn.delegate != null) {
		$('body').delegate('.topNavMainContainer', 'touchmove', startTopNavigationScroll)
				.delegate('.topNavMainContainer', 'touchend', endTopNavigationScroll)
				.delegate('#_topNavTitle', 'touchmove', startMainNavigationMaximize)
				.delegate('#_topNavTitle', 'touchend', endMainNavigationMaximize)
				.delegate('.scroll-pane', 'touchmove', featuresListScroll)
				.delegate('.scroll-pane', 'touchend', function (event) {
					if (scrolling) {
						event.preventDefault();
						scrolling = false;
					}
				});
	}
});

if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (fun /*, initial*/) {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();

        // no value to return if no initial value and an empty array
        if (len == 0 && arguments.length == 1)
            throw new TypeError();

        var i = 0;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        }
        else {
            do {
                if (i in this) {
                    rv = this[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= len)
                    throw new TypeError();
            }
            while (true);
        }

        for (; i < len; i++) {
            if (i in this)
                rv = fun.call(null, rv, this[i], i, this);
        }

        return rv;
    };
}