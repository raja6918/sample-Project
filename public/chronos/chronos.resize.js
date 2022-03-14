/*
 * Copyright 2013-2014 IBS Software Services (P) Ltd. All Rights Reserved.
 * This software is the proprietary information of IBS Software Services (P) Ltd.
 * Use is subject to license terms.
 
 @author A-2094, Maintained by TCC.
 name : chronos-resize
 version: 6.10.6
 
Updated plugin for automatically redrawing plots when the placeholder
size changes, e.g. on window resizes.Row resizing and fetching data if required is handled

It works by listening for changes on the placeholder div (through the
jQuery resize event plugin) - if the size changes, it will redraw the
plot.

 If you need to disable the plugin for some
plots, you can just fix the size of their placeholders.

*/


/* dependency: 
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

(function ($) {
    var options = {
    		plotResize : {
    			autoTrigger : true, // by default if plugin is added it is enabled. If you need to call using an API 
    						   	// autoTrigger should be false and call triggerResize function manually on custom action.
    			resizeCallback : null
    			
    		}
    }; // no options
    
   
    function init(plot) {
    	plot.triggerResize = function () {
    	    	onResize();
    	 };

        function onResize() {
        	//console.log('On resize called...........');
            var placeholder = plot.getPlaceholder();
            // we can't plot when we don't have the dimensions
            if (placeholder.width() == 0 || placeholder.height() == 0)
                return;
            plot.resize();       
            plot.setupGrid();
            plot.callFetchDataIfRequired();       
            plot.clearHeaderImage();//done to create header image fresh
           
            //execute the code only in normal case . tiling not applicable
            //Added callback - to support tile caching call to be triggered  on resize after completing tiling
            var options = plot.getOptions() , series = plot.getSeries();
            var callBackFunction  = options.plotResize.resizeCallback;
            var xaxis = series.xaxis;
            var globalTimer = null;
           
            //console.log("tilesLoaded  from resize" + plot.isTilesLoaded());
            if(callBackFunction!= null) {
            	if(globalTimer != null) {
            		 clearTimeout(globalTimer);
            	}
            	globalTimer = setTimeout(function() { 
            		var args = new Array();
          		    args.push(xaxis.min);
          		    args.push(xaxis.max);
          		    args.push(plot);
          		   	eval(callBackFunction).apply(this, args);	
            	},500);
            	//console.log("Draw  called from on resize callback................ ");
            }
            plot.draw(); 
            //if( (window['console'] !== undefined) )console.log("AFTER onResize Plot width " +  placeholder.width() + " height " + placeholder.height() );            
        }
        
        function bindEvents(plot, eventHolder) {
        	var options = plot.getOptions();
        	//By default the events is binded
        	if(options.plotResize.autoTrigger) { 
        		plot.getPlaceholder().resize(onResize);
        	}
        }
        function unBindResizeEvents() {
        	var options = plot.getOptions();
        	if(options.plotResize.autoTrigger) { 
        		plot.getPlaceholder().unbind("resize", onResize);
        	}
            //console.log("Unbind called ...");
        }        
       plot.hooks.bindEvents.push(bindEvents);
       plot.hooks.shutdown.push(unBindResizeEvents);
    }
    
    $.chronos.plugins.push({
        init: init,
        options: options,
        name: 'resize',
        version: '6.10.6'
    });
})(jQuery);