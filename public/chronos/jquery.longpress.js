/**
 * Longpress is a jQuery plugin that makes it easy to support long press
 * events on mobile devices and desktop borwsers.
 *
 * @name longpress
 * @version 0.1.2
 * @requires jQuery v1.2.3+
 * @author Vaidik Kapoor
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, check out the README at:
 * http://github.com/vaidik/jquery-longpress/
 *
 * Copyright (c) 2008-2013, Vaidik Kapoor (kapoor [*dot*] vaidik -[at]- gmail [*dot*] com)
 */

(function($) {
    $.fn.longpress = function(opts) {
		var duration; 
        if (opts && typeof opts.duration === "undefined") {
           duration = 500; //IFTAGL-5358
        }else  {
			duration = opts.duration;
        }

		var longCallback, shortCallback, selector = opts.selector ? opts.selector: null ;
		longCallback = opts.longCallback , shortCallback = opts.shortCallback; 

        return this.each(function() {
            var $this = $(this);

            // to keep track of how long something was pressed
            var mouse_down_time;
            var timeout;

            // mousedown or touchstart callback
            function mousedown_callback(e) {
                mouse_down_time = new Date().getTime();
                var context = $(this);

                // set a timeout to call the longpress callback when time elapses
                timeout = setTimeout(function() {
                    if (typeof longCallback === "function") {
                        longCallback.call(context, e);
                    } else {
                        $.error('Callback required for long press. You provided: ' + typeof longCallback);
                    }
                }, duration);
            }

            // mouseup or touchend callback
            function mouseup_callback(e) {
                var press_time = new Date().getTime() - mouse_down_time;
                if (press_time < duration) {
                    // cancel the timeout
                    clearTimeout(timeout);

                    // call the shortCallback if provided
                    if (typeof shortCallback === "function") {
                        shortCallback.call($(this), e);
                    } else if (typeof shortCallback === "undefined") {
                        ;
                    } else {
                        $.error('Optional callback for short press should be a function.');
                    }
                }
            }

            // cancel long press event if the finger or mouse was moved
            function move_callback(e) {
                clearTimeout(timeout);
            }

			var touchtime = 0;
			function doubleTap_callback(e) {
				if (touchtime == 0) {
					// set first click
					touchtime = new Date().getTime();
				} else {
					// compare first click to this click and see if they occurred within double click threshold
					if (((new Date().getTime()) - touchtime) < 800) {
						// double click occurred	
						$(e.target)[0].dispatchEvent(  new MouseEvent('dblclick', event));	
						touchtime = 0;
					} else {
						// not a double click so set as a new first click
						touchtime = new Date().getTime();
					}
				}
			}

            // Browser Support
            /*$this.on('mousedown', selector,mousedown_callback);
			$this.on('mousedown',selector, doubleTap_callback);
            $this.on('mouseup',selector, mouseup_callback);
            $this.on('mousemove',selector, move_callback);*/

            // Mobile Support
            $this.on('touchstart',selector, mousedown_callback);
			//$this.on('touchstart',selector, doubleTap_callback);
            $this.on('touchend',selector, mouseup_callback);
            $this.on('touchmove',selector, move_callback);
        });
    };
}(jQuery));