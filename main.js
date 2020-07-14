/**
 * Check if an element has been scrolled into view
 */
function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();  // the distance a user has scrolled
    var docViewBottom = docViewTop + $(window).height();  // add the height of the window

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

/**
 * Cross-browser scroll animation
 * @param {string} selector - CSS selector string for an anchor link that when clicked scrolls the user to another element
 */
function addAnimatedScrollHandlers(selector) {
 $(selector).on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
  });
}


/**
 * Adjust the height of the Hello panel to make it
 * equal to the browser height.
 */

function adjustHelloSectionHeight() {
   windowHeight = $(window).height();
   windowWidth = $(window).width();
   arrowHeight = $('.section__scroll').height();
   topHeight = parseInt($('main').css('padding-top'));

   helloImgElem = $('.hello-image');
   helloImgHeight = helloImgElem.height();
   helloTxtHeight = $('.hello-text').height();

   if (helloTxtHeight > helloImgHeight) {
      adjustedHeight = helloTxtHeight;
   }
   else {
        adjustedHeight = windowHeight - arrowHeight - topHeight;
   }
   helloImgElem.css({ 'height': helloTxtHeight });
}


/**
 * Add scroll animation by adding Animate.css classes
 */

function addDynamicAnimatedEffect(selector, effect) {
    $(selector).css('opacity', 0);
    $(window).scroll(function() {
        $(selector).each(function() {
            // If element is scrolled into view, add animate.css class to trigger effect
            if (isScrolledIntoView(this) === true) {
            $(this).addClass(effect);
            }
        });
    });
  }

/**
 * Remove existing SVG element (to avoid duplicating when resizing)
 */
function clearSVG(elemId) {
    var svgtest = d3.select(elemId).select("svg");
    if (!svgtest.empty()) {
        svgtest.remove();
    }
}
