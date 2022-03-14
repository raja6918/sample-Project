/*
 * Copyright 2013-2014 IBS Software Services (P) Ltd. All Rights Reserved.
 * This software is the proprietary information of IBS Software Services (P) Ltd.
 * Use is subject to license terms.
 * 
 * @author A-4314, Maintained by TCC.
 * name 	: chronos.scrollLink
 * version : 6.10.6
 * Copy right IBS Software Pvt Ltd 2011-2012
 *
 * plugin added for supporting the multiple monitors
 */

(function($) {
	
	 var options = {
			 multiScreenFeature : {
				 enabled : true, // true or false
				 linkage : "horizontal", // "vertical" or "horizontal"
				 //zoomDirection : null
			 }
	    }; 
	 var customData = {};
	function init(plot) {
		plot.updateDateRangeInLocalStore = function(start, end, doNotUpdate) {

			var screens = $.getFromLocalStore('s');
			var customData = plot.getOptions().multiScreenFeature.customData
			var screenNum = $.multiScreenScroll.getCurrScreenId(customData.key);
			var screenConfig = $.multiScreenScroll.getMultiScreenConfig(screens, customData);
			var linkage = plot.getOptions().multiScreenFeature.linkage;
			var horizontalIncrement = (plot.horizontalScrollBar) ? plot.horizontalScrollBar.getOptions().scroll.horizontalIncrement : "ltr";
			var increment = (horizontalIncrement == "ltr") ? "positive" : "negative";

			// call can come here from multiple plots for a single update
			// Added the check to avoid repeated updates for same change
			if (!screenConfig || (screenConfig.dateRange.start == start) && (screenConfig.dateRange.end == end)) {
				return; // do nothing
			}

			screenConfig.dateRange.start = start;
			screenConfig.dateRange.end = end;

			if (plot.horizontalScrollBar != undefined) {
				var scrollValues = plot.horizontalScrollBar.getViewValues();
				screenConfig.dateRange.minScrollValue = scrollValues.minViewValue;
				screenConfig.dateRange.maxScrollValue = scrollValues.maxViewValue;
			} else {
				screenConfig.dateRange.minScrollValue = start;
				screenConfig.dateRange.maxScrollValue = end;
			}

			if (doNotUpdate != true) {
				$.multiScreenScroll.updateScreens(screenNum, 'horizontal', screens, plot.getPlotLabel(), linkage, increment, customData);
			}
			$.putInLocalStore('s', screens, true);
		}
		
		plot.updateRowRangeInLocalStore = function(min, max, doNotUpdate) {
			var screens = $.getFromLocalStore('s');
			var customData = plot.getOptions().multiScreenFeature.customData
			var screenNum = $.multiScreenScroll.getCurrScreenId(customData.key);
			var screenConfig = $.multiScreenScroll.getMultiScreenConfig(screens, customData);
			var paneConfig = (screenConfig) ? screenConfig.pane[plot.getPlotLabel()] : null;
			var linkage = plot.getOptions().multiScreenFeature.linkage;
			var verticalIncrement = (plot.verticalScrollBar) ? plot.verticalScrollBar.getOptions().scroll.verticalIncrement : "down";
			var increment = (verticalIncrement == "down") ? "positive" : "negative";
			
			if (!paneConfig || ((paneConfig.startDisplayObject.id == min) && (paneConfig.endDisplayObject.id == max) && (paneConfig.totalRows == (max - min)))) {
				return; // do nothing
			}

			paneConfig.startDisplayObject.id = min;
			paneConfig.endDisplayObject.id = max;
			paneConfig.totalRows = (max - min);
			
			if (doNotUpdate != true) {
				$.multiScreenScroll.updateScreens(screenNum, 'vertical', screens, plot.getPlotLabel(), linkage, increment, customData);
				$.putInLocalStore('s', screens, true);
			} else if($.getFromLocalStore('sUpdtdBy') == screenNum) {
				$.putInLocalStore('s', screens, true);
			}

			$.putInLocalStore('s', screens, true);
		}
		
		plot.getMultiscreenYaxisViewArea = function() {
			var screens = $.getFromLocalStore('s');
			var screenConfig = $.multiScreenScroll.getMultiScreenConfig(screens, plot.getOptions().multiScreenFeature.customData);
			var plotLabel = plot.getPlotLabel();
			var viewArea;
			if(screenConfig && screenConfig.pane[plotLabel]){
				viewArea = {
						min : screenConfig.pane[plotLabel].startDisplayObject.id,
						max : screenConfig.pane[plotLabel].endDisplayObject.id,
						totalRows : screenConfig.pane[plotLabel].totalRows
				}
			}			
			return viewArea;
		}
		
		plot.getMultiscreenXaxisViewArea = function() {
			var screens = $.getFromLocalStore('s');
			var screenConfig = $.multiScreenScroll.getMultiScreenConfig(screens, plot.getOptions().multiScreenFeature.customData);
			var viewArea;
			if(screenConfig){
				viewArea = {
						min : screenConfig.dateRange.start,
						max : screenConfig.dateRange.end
				}
			}				
			return viewArea;
		}

		// Private functions to check is scroll has happened or not
		function compareHorizontalRange() {
			var screens = $.getFromLocalStore('s');
			if(screens == undefined || screens  == null) {
				return null;
			}
			var customData = plot.getOptions().multiScreenFeature.customData
			var screenNum = plot.getScreenId();
			var screenConfig = $.multiScreenScroll.getMultiScreenConfig(screens, customData);
			var series = plot.getSeries();

			if (!screenConfig) {
				return null;
			}

			if ((screenConfig.dateRange.start != series.xaxis.min) || (screenConfig.dateRange.end != series.xaxis.max)) {
				// update the horizontal-scrollValues accordingly
				plot.horizontalScrollBar.setViewValues( screenConfig.dateRange.minScrollValue, screenConfig.dateRange.maxScrollValue);
				return screenConfig.dateRange;
			}
			return null;
		}

		function compareVerticalRange() {
			var screens = $.getFromLocalStore('s');
			if(screens == undefined || screens == null){
				return null;
			}
			var customData = plot.getOptions().multiScreenFeature.customData
			var screenNum = plot.getScreenId();
			var screenConfig = $.multiScreenScroll.getMultiScreenConfig(screens, customData);
			var paneConfig = (screenConfig) ? screenConfig.pane[plot.getPlotLabel()] : null;
			var series = plot.getSeries();
			
			if (!screenConfig || !paneConfig) {
				return null;
			}
			if ((paneConfig.startDisplayObject.id != series.yaxis.min) || (paneConfig.endDisplayObject.id != series.yaxis.max)) {
				return paneConfig;
			}
			return null;
		}

		/**
		 * Called from "storage" event
		 * check if the configuration is changed
		 * If changed, redraw the plot with new configurations
		 */ 
		plot.onLocalStoreChange = function(e) {
			var series = plot.getSeries();
			var axisy = series.yaxis.options;
			var axisx = series.xaxis.options;
			var dateRange = compareHorizontalRange();
			var plotRange = compareVerticalRange();
			var needToCallDraw = false;
			var scrollChanged = null;

			if (dateRange != null) {
				if (dateRange.start >= plot.horizontalScrollBar.getAxisValues().minAxisValue && dateRange.end <= plot.horizontalScrollBar.getAxisValues().maxAxisValue ) {
					plot.currentVisibleData.fromDate = dateRange.start;
					plot.currentVisibleData.toDate = dateRange.end;
					axisx.min = dateRange.start;
					axisx.max = dateRange.end;
					needToCallDraw = true;
				}
				scrollChanged = "horizontal";
			}

			if (plotRange != null) {
				if (plotRange.startDisplayObject.id >= plot.verticalScrollBar.getAxisValues().minAxisValue && plotRange.endDisplayObject.id <= plot.verticalScrollBar.getAxisValues().maxAxisValue ) {
					plot.currentVisibleData.yValueMin = plotRange.startDisplayObject.id;
					plot.currentVisibleData.yValueMax = plotRange.endDisplayObject.id;
					axisy.min = plotRange.startDisplayObject.id;
					axisy.max = plotRange.endDisplayObject.id;
					needToCallDraw = true;
				}
				if (scrollChanged == null) {
					scrollChanged = "vertical";
				} else {
					scrollChanged = "both";
				}
			}
			if (needToCallDraw) {
				plot.callFetchDataIfRequired();
				plot.setupGrid();
				plot.draw();
				if (scrollChanged == "both") {
					plot.horizontalScrollBar.redrawScrollBox();
					plot.verticalScrollBar.redrawScrollBox();
				} else if (scrollChanged == "horizontal") {
					plot.horizontalScrollBar.redrawScrollBox();
				} else {
					plot.verticalScrollBar.redrawScrollBox();
				}
			}
		}
	} // init

	$.chronos.plugins.push({
		init : init,
		options: options,
		name : 'chronos.scrollLink',
		version : '6.10.6'
	});
})(jQuery);