/*
 *  Copyright 2013-2014 IBS Software Services (P) Ltd. All Rights Reserved.
 *  This software is the proprietary information of IBS Software Services (P) Ltd.
 *  Use is subject to license terms.
 *	
 *	@author 	: A-4314 
 * 	@copyright  : 2014 IBS Software Services Pvt Ltd
 *	version		: 6.10.6
 *
 *  Plugin which enables to perform to link scroll on multipleScreens. (same browser, different windows)
 */

(function(jQuery){
	"use strict";
	var customDataMap = {};
    function multiScreenScroll () {
		var updateHeartbeat = null;
		var storageEventTriggerTime = 0;
		var defaultOptions = {
			rowOverlapCount            : 0,
			colOverlapCount            : 0,
			refreshInterval            : 3000 , // in milli-secs
			terminationTime            : 4000 // in milli-secs
		};
        var base = this;
        var paneObjArr = [];
        var plotLabelArr = [];

		// Private (config) classes
		function screenConfig() {
			// VerticalScroll - for each pane
			this.pane = {},	//new paneConfig()
			//should be unique each pane that should linked, consider multitab scenario: plotlabel+pageID
			// HorizontalScroll - common for all the panes
			this.dateRange = {
				start : 0,  // time-in-milliSecs
				end   : 0,   // time-in-milliSecs
				minScrollValue : 0,
				maxScrollValue : 0
			},
			this.customData ={}
		}
	
		function paneConfig()	{
			//this.paneLabel = "";
			this.startDisplayObject = {}, // id : <rowYValue>, wrappedRowIndex : <>
			this.endDisplayObject   = {}, // id : <rowYValue>, wrappedRowIndex : <>
			this.totalRows          = 0,
			this.displayMap         = []  // array of display-objects
		}
	
		function heartbeatConfig() {
			this.timestamp = $.now();
		}
		
        // getters
		base.getRowOverlapCount = function () {
			return base.options.rowOverlapCount;
		};
		
		base.getColOverlapCount = function () {
            return base.options.colOverlapCount;
		};
		
		base.getTerminationTime = function () {
			return base.options.terminationTime;
		};
		
		base.getRefreshInterval = function () {
			return base.options.refreshInterval;
		};

		base.setPaneObject = function (paneObj) {
			var index = paneObjArr.findIndex(function(paneObject){
				return paneObject.getPlaceholder().attr('id') === paneObj.getPlaceholder().attr('id');
			});
			if(index == -1) {
				paneObjArr.push(paneObj);
			}
			var customData = paneObj.getOptions().multiScreenFeature.customData;
			var data = {
						plotLabelArr : plotLabelArr,
						customData : customData,
						paneObjArr : paneObjArr
			}
			customDataMap[customData.key] = data;		
		};
		
		base.clearPaneObjects = function(placeHolderId) {
			var index = paneObjArr.findIndex(function(paneObject){
				return paneObject.getPlaceholder().attr('id') === placeHolderId;
			});
			if(index != -1) {
				paneObjArr.splice(index, 1);
			}
		};
		
		function initializeScreen (screenNumber, plotLabel, paneAdded, customData) {
			var screens = $.getFromLocalStore ('s');
			var heartbeats = $.getFromLocalStore ('hB');
			if (!screens) {
				screens = {};
			}
			
			if(!heartbeats) {
				heartbeats = {};
			}
			
			var screenUpdatedBy = {};
			screenUpdatedBy[customData.key] = screenNumber;
			$.putInLocalStore('sUpdtdBy', screenUpdatedBy, true);
			if (screens[screenNumber] && !paneAdded && plotLabel) {
				var currScreenConfig = base.getMultiScreenConfig(screens, customData);
				currScreenConfig.pane[plotLabel] = new paneConfig();
				if(!screens[screenNumber].includes(currScreenConfig)){
					screens[screenNumber].push(currScreenConfig);
				}
				var heartbeat = base.getMultiscreenCurrentData(customData.key,"hB");
				if(heartbeat == undefined || heartbeat == null){
					heartbeat = {};
					heartbeat[screenNumber] = new heartbeatConfig();
				} else if(heartbeat[screenNumber] == undefined || heartbeat[screenNumber] == null) {
					heartbeat[screenNumber] = {};
					heartbeat[screenNumber] = new heartbeatConfig();
				}
				heartbeats[customData.key] = heartbeat;
				$.putInLocalStore ('hB', heartbeats);
				$.putInLocalStore('s', screens, true); //scenario when screens[screenNumber] exists and pane with diff metaData is not added to be checked
			} else if (!screens[screenNumber]) {
				if(heartbeats){
					var heartbeat = {};
					heartbeat[screenNumber] = new heartbeatConfig();
				}
				heartbeats[customData.key] = heartbeat;
				var currScreenConfig = new screenConfig();
				currScreenConfig.customData = customData;
				if (plotLabel) {
					currScreenConfig.pane[plotLabel] = new paneConfig();
				}				
				screens[screenNumber] = [currScreenConfig];
				$.putInLocalStore ('hB', heartbeats);
				$.putInLocalStore('s', screens, true);
			}			
		};

		/**
		* scrollDirection : "horizontal" or "vertical"
		* direction : "forward" or "backward
		*/
		function updatePlotsInAScreen (screenId, scrollDirection, direction, screens, plotLabel, linkage, increment, customData) {
			var refScreenConfig = base.getMultiScreenConfig(screens,customData,screenId);
			var currScreenConfig = (direction == 'forward') ? base.getMultiScreenConfig(screens,customData, screenId+1) : base.getMultiScreenConfig(screens,customData, screenId-1) ;
			if(!currScreenConfig || !refScreenConfig) {
            	return;
            }
			var refPaneConfig = refScreenConfig.pane[plotLabel];
			var currPaneConfig = currScreenConfig.pane[plotLabel];
			var rowOverlapCount = base.getRowOverlapCount();
			var colOverlapCount = base.getColOverlapCount();
            var MILLISECS_IN_A_DAY = 86400000;
            var isIncrement;
            if (direction && increment) {
            	if ((direction == 'forward' && increment == 'positive') || (direction == 'backward' && increment == 'negative')) {
    				isIncrement = true;
    			} else if ((direction == 'backward' && increment == 'positive') || (direction == 'forward' && increment == 'negative')) {
    				isIncrement = false;
    			}
            	
            	if (linkage == 'vertical') {
    				if (scrollDirection == 'horizontal') {
    					currScreenConfig.dateRange.start = refScreenConfig.dateRange.start;
    					currScreenConfig.dateRange.end = refScreenConfig.dateRange.end;
    					currScreenConfig.dateRange.minScrollValue = refScreenConfig.dateRange.minScrollValue;
    					currScreenConfig.dateRange.maxScrollValue = refScreenConfig.dateRange.maxScrollValue;
    				} else if (scrollDirection == 'vertical') {
    					if (isIncrement) {
    						currPaneConfig.startDisplayObject.id = refPaneConfig.endDisplayObject.id - rowOverlapCount;
    						currPaneConfig.endDisplayObject.id = currPaneConfig.startDisplayObject.id + currPaneConfig.totalRows;
    					} else {
    						currPaneConfig.endDisplayObject.id = refPaneConfig.startDisplayObject.id + rowOverlapCount;
    						currPaneConfig.startDisplayObject.id = currPaneConfig.endDisplayObject.id - currPaneConfig.totalRows;
    					}
    				}
                } else if (linkage == 'horizontal') {
                	if (scrollDirection == 'horizontal') {
                		if (isIncrement) {
                			currScreenConfig.dateRange.start = refScreenConfig.dateRange.end  - colOverlapCount*MILLISECS_IN_A_DAY;
                			currScreenConfig.dateRange.end = currScreenConfig.dateRange.start + ( refScreenConfig.dateRange.end-refScreenConfig.dateRange.start);
                			currScreenConfig.dateRange.minScrollValue = refScreenConfig.dateRange.maxScrollValue - colOverlapCount*MILLISECS_IN_A_DAY;
                			currScreenConfig.dateRange.maxScrollValue = currScreenConfig.dateRange.minScrollValue +(  refScreenConfig.dateRange.maxScrollValue-refScreenConfig.dateRange.minScrollValue);
                		} else {
                			currScreenConfig.dateRange.end = refScreenConfig.dateRange.start + colOverlapCount*MILLISECS_IN_A_DAY;
                			currScreenConfig.dateRange.start = currScreenConfig.dateRange.end  - ( refScreenConfig.dateRange.end-refScreenConfig.dateRange.start);
                			currScreenConfig.dateRange.maxScrollValue = refScreenConfig.dateRange.minScrollValue + colOverlapCount*MILLISECS_IN_A_DAY;
                			currScreenConfig.dateRange.minScrollValue = currScreenConfig.dateRange.maxScrollValue - ( refScreenConfig.dateRange.maxScrollValue-refScreenConfig.dateRange.minScrollValue);
                		}
                	} else if (scrollDirection == 'vertical') {
                		currPaneConfig.startDisplayObject.id = refPaneConfig.startDisplayObject.id;
                		currPaneConfig.endDisplayObject.id = refPaneConfig.endDisplayObject.id;
                	}
                }
            }
		};

		/**
		* change the configurations of other screens as per the changes in the current-plot.
		* scrollDirection : "horizontal" or "vertical"
		*/ 
		base.updateScreens = function (updateFromScreen, scrollDirection, screens, plotLabel, linkage, increment, customData) {			
			var totalScreens = base.getMultiscreenCurrentData(customData.key,"nOfS");
			if (updateFromScreen > 0) {
				var j = parseInt(updateFromScreen) - 1;
				while (j >= 0) {
					updatePlotsInAScreen (j+1, scrollDirection, 'backward', screens, plotLabel, linkage, increment, customData);
					j--;
				}
			}
			
			if (updateFromScreen < (totalScreens - 1)) {
				var j = parseInt(updateFromScreen) + 1;
				while (j < totalScreens) {
					updatePlotsInAScreen (j-1, scrollDirection, 'forward', screens, plotLabel, linkage, increment, customData);
					j++;
				}
			}
		};
		
		base.startHeartbeat = function(customData) {
			if (updateHeartbeat != null) {
				window.clearInterval (updateHeartbeat);
			}
			updateHeartbeat = setInterval(function() {
				for (var property in customDataMap) {
					if (customDataMap.hasOwnProperty(property)) {
						var currKey = property;
						var screenId = base.getCurrScreenId(currKey);	
						var heartbeats = $.getFromLocalStore ('hB');
						if(heartbeats && heartbeats[currKey] && heartbeats[currKey][screenId])
							heartbeats[currKey][screenId]['timestamp'] = $.now();
						else return;
						if(heartbeats)
						{	$.putInLocalStore('hB', heartbeats);
							if (screenId <= 1) {
								var numberOfScreens = parseInt(base.getMultiscreenCurrentData(customData.key,"nOfS"));
								if ((numberOfScreens > 1) && ((heartbeats[currKey][screenId]['timestamp'] - storageEventTriggerTime) > 2000)) {
									checkHeartBeat(customDataMap[property].customData);
								}
							}
						}
					}
				}
			}, base.getRefreshInterval());						    							
		};
		
		base.getScreenId = function () {
			var screenId = $.getFromSessionStore('sId');
			if(screenId){
				return screenId;
			}
		};
		
		base.setScreenId = function (plotLabel, customData) {
			// check if the page already exist or not			
			var currKey = customData.key;
			var screenIds = $.getFromSessionStore('sId');
			var screenId = base.getCurrScreenId(currKey), paneAdded = false, currScreenConfigs;
			var screens = $.getFromLocalStore('s');
			//var plotLabelsArray = [];
			plotLabelArr = (customDataMap && customDataMap[customData.key]) ? customDataMap[customData.key].plotLabelArr : [];
		    if(screens)
			{	currScreenConfigs = screens[0]; // on assuming that all added panes will be on first screen
				for ( var i = 0; i < currScreenConfigs.length; i++) {
					var currCustomData = currScreenConfigs[i].customData; 
					if(currCustomData.key == customData.key) {
						//plotLabelArr = Object.keys(currScreenConfigs[i].pane)
						if(plotLabelArr.includes(plotLabel))
						{	paneAdded = true;
							break;
						}
					} 
				}
			}
			if(!paneAdded){
				plotLabelArr.push(plotLabel);
			}
			if (screenIds == undefined) {
				screenIds = {};
				var totalNumOfScreens = $.getFromLocalStore ('nOfS');
				var currentNumOfScreens = base.getMultiscreenCurrentData(customData.key,"nOfS");
				if(totalNumOfScreens == undefined || totalNumOfScreens == null){
					totalNumOfScreens = {};
				}
				screenIds[currKey] = (currentNumOfScreens == undefined) ? 0 : currentNumOfScreens;
			 	totalNumOfScreens[currKey] = screenIds[currKey] + 1;
				$.putInLocalStore ('nOfS', totalNumOfScreens, true);
				$.putInSessionStore ('sId', screenIds);
			} else if(screenId == undefined){ // new key
				var totalNumOfScreens = $.getFromLocalStore ('nOfS');
				var currentNumOfScreens = base.getMultiscreenCurrentData(currKey,'nOfS');
				screenIds[currKey] = (currentNumOfScreens == undefined) ? 0 : currentNumOfScreens;
				totalNumOfScreens[currKey] = screenIds[currKey] + 1;
				$.putInLocalStore ('nOfS', totalNumOfScreens, true);
				$.putInSessionStore ('sId', screenIds);
			}else { // most probably a refresh
				if(paneAdded) {
					$.putInSessionStore ('rfsh', 'true');
				}
			}
			initializeScreen(base.getCurrScreenId(currKey), plotLabel, paneAdded, customData);
			
			return screenId;
		};
		
		base.getMultiScreenConfig = function(screens, customData, defaultScreenId){
			var screenId = base.getCurrScreenId(customData.key);
			if(defaultScreenId != null || defaultScreenId != undefined){
				screenId = defaultScreenId; // set screenId to defaultScreenId if present
			}
			var configNotFound = false;
			var currScreenConfigs = screens[screenId];// find out screenId from store using customData key
			if(!currScreenConfigs){
				return;
			}
			for ( var i = 0; i < currScreenConfigs.length; i++) {
				var currCustomData = currScreenConfigs[i].customData; 
				if(currCustomData.key == customData.key) {
					return currScreenConfigs[i];
				} else {
					configNotFound = true;
				}					
			}
			if(configNotFound == true){
				var newScreenConfig = new screenConfig();
				newScreenConfig.customData = customData;
				return newScreenConfig;
			}					
		}
		
		base.removeMultiScreenConfig = function(screens, customData){
			var screenId = base.getCurrScreenId(customData.key);
			if(screenId != null || screenId != undefined){
				var currScreenConfigs = screens[screenId];// find out screenId from store using customData key
				if(!currScreenConfigs){
					return;
				}
				var configPos = null;
				for ( var i = 0; i < currScreenConfigs.length; i++) {
					var currCustomData = currScreenConfigs[i].customData; 
					if(currCustomData.key == customData.key) {
						configPos = i;
					}					
				}
				if(configPos != null){
					currScreenConfigs.splice(configPos,1);
				}
			}				
		}
		
		base.getCurrScreenId = function(currKey){
			var screenIds = $.getFromSessionStore('sId');
			if(screenIds == null || screenIds == undefined)
				return undefined;
			else{
				if(Object.keys(screenIds).length > 0){
					for(var i = 0; i <Object.keys(screenIds).length; i++){
						if(Object.keys(screenIds)[i] == currKey);
						return screenIds[currKey];
					}
				}
				else{
					return screenIds[currKey];
				}
			}
		}
		
		base.getMultiscreenCurrentData = function(currKey, dataType){
			var data = $.getFromLocalStore(dataType);
			if(data == null || data == undefined)
				return undefined;
			else{
				if(Object.keys(data).length > 0){
					for(var i = 0; i <Object.keys(data).length; i++){
						if(Object.keys(data)[i] == currKey);
						return data[currKey];
					}
				}
				else{
					return data[currKey];
				}
			}
		}

		base.removePane = function(screenId, extraParams, plotLabel, customData) {
			var screens = $.getFromLocalStore('s');
			if(screens) {
				var currScreenConfig = base.getMultiScreenConfig(screens,customData);				
				if(currScreenConfig && currScreenConfig.pane[plotLabel]) {
					delete currScreenConfig.pane[plotLabel];
					plotLabelArr.splice(plotLabelArr.findIndex(function(e){
						return e == plotLabel;
					}), 1);
					if (Object.keys(currScreenConfig.pane).length == 0) {
						base.removeMultiScreenConfig(screens,customData);
					}
					$.putInLocalStore('s', screens, true);
				}
				/*if(plotLabelArr.length == 0) {
					updateConfigOnScreenClose(screenId);
				} else {
					
				}*/
				var screenUpdatedBy = {};
				screenUpdatedBy[customData.key] = screenId;
				$.putInLocalStore('sUpdtdBy', screenUpdatedBy, true);
			}
			if(plotLabelArr.length == 0) {
				for(var paramName in extraParams) {
					var params = $.getFromLocalStore(paramName);
						delete params[plotLabel];
					if(params) {
						$.putInLocalStore(paramName, params, true);
					}
				}
			}
		};
		
		base.changePageTitle = function (screenId, customData) {
			if(!screenId){
				screenId = base.getCurrScreenId(customData.key)
			}
			var title = $(document).attr('title');
			var titleParts = title.split(":");
			title = (parseInt(screenId)+1) + " : " + ((titleParts.length > 1) ? titleParts[1] : titleParts[0]);
			$(document).attr('title', title); 
		};
		
		function updatePlots (event,customData) {
            	var paneObjectArr = customDataMap[customData.key].paneObjArr;
            	$.each(paneObjectArr, function(index, paneObject) {
            	if(paneObject.getPlaceholder().height() > 0) {
            		paneObject.onLocalStoreChange();
            	}
            });
		}
		
		function updatePlotDataInMultiScreen (event, customData) {			
			var paneObjectArr = customDataMap[customData.key].paneObjArr;
			for(var i = 0; i < paneObjectArr.length;i++){
				var paneObject = paneObjectArr[i];
				var placeholder  = paneObject.getPlaceholder();
				var plotLabel, isTree;
				var e = jQuery.Event("multiScreenChangeEvent");
				e.originalEvent = event;
				e.OriginalType = e.type;
				plotLabel = paneObject.getPlotLabel();
				if(plotLabel.substr(plotLabel.length - 4) == "tree"){
					isTree = true;
				}
				placeholder.trigger(e, {
					key : event.key.substring((iFlight_Module_Name + "_").length),
					value : event.newValue,
					treeEnabled : isTree
				});	
			}
		}
		
		function updateConfigOnScreenClose(screenId, customData) {
			var totalScreens = parseInt(base.getMultiscreenCurrentData(customData.key,"nOfS"));
			var screens = $.getFromLocalStore ('s');
			var heartbeats = base.getMultiscreenCurrentData(customData.key,"hB");
			delete screens[screenId];
			delete heartbeats[screenId];
			var numberOfScreens = {};
			numberOfScreens[customData.key] = totalScreens - 1;
			$.putInLocalStore ('nOfS', numberOfScreens, true);
			$.putInLocalStore('s', screens, true);
			var heartBeats = {};
			heartBeats[customData.key] = heartbeats;
			$.putInLocalStore ('hB', heartBeats);
		}
		
		function clearAllConfigs() {
			$.deleteFromLocalStore('s');
			$.deleteFromLocalStore('hB');
			$.deleteFromLocalStore('nOfS');
			$.deleteFromSessionStore('rfsh');
			plotLabelArr = [];
			$.deleteFromLocalStore('sUpdtdBy');
			console.log("Last open gantt in master closed");
			console.trace();
		}
		
		function swapScreenIds (newScreenId, oldScreenId, dontUpdateLocalStore,customData) {
			var screenId = {};
			screenId[customData.key] = newScreenId;
			$.putInSessionStore ('sId', screenId);
			var totalScreens = parseInt(base.getMultiscreenCurrentData(customData.key,"nOfS"));
			var screens = $.getFromLocalStore ('s');
			
			var paneObjectArr = customDataMap[customData.key].paneObjArr;
			$.each(paneObjectArr, function(index, paneObject) {
                paneObject.setScreenId(newScreenId);
			});
			totalScreens = totalScreens - 1;
			var numberOfScreens = {};
			numberOfScreens[customData.key] = totalScreens;
			$.putInLocalStore ('nOfS', numberOfScreens, true);
			
			screens[newScreenId] = screens[oldScreenId];
			if(oldScreenId >= totalScreens) {
				delete screens[oldScreenId];
			}
			$.putInLocalStore('s', screens, true);
			$.multiScreenScroll.changePageTitle (newScreenId, customData);
			updatePlots('',customData);
		}
		
		function checkHeartBeat (customData) {
			var currentScreenId = parseInt(base.getCurrScreenId(customData.key));
			var totalScreens = parseInt(base.getMultiscreenCurrentData(customData.key,"nOfS"));
			var heartbeats = base.getMultiscreenCurrentData(customData.key,"hB");
			var previousScreenId = ((currentScreenId != 0) ? (currentScreenId - 1) : (totalScreens - 1));
			var screensLastUpdatedBy = base.getMultiscreenCurrentData(customData.key,"sUpdtdBy");
			if (heartbeats != undefined && (heartbeats[previousScreenId] != undefined) && (heartbeats[currentScreenId] != undefined)) {
				var previousScreenPulse = parseInt(heartbeats[previousScreenId]['timestamp']);
				var currentScreenPulse = parseInt(heartbeats[currentScreenId]['timestamp']);
				if (currentScreenPulse - previousScreenPulse > base.getTerminationTime()) {
					if (currentScreenId == 0) { // no need of swapping
						updateConfigOnScreenClose(previousScreenId,customData);
					} else {
						swapScreenIds (previousScreenId, currentScreenId,null,customData);
						triggerScreenEvent("multiScreenScreenClose", {}, customData);// just update the configuration
					}
				} else if(currentScreenId != screensLastUpdatedBy) { // New Gantt pane open or close
					var screens = $.getFromLocalStore ('s');
					var prevScreenConfig = Object.keys(base.getMultiScreenConfig(screens, customData, previousScreenId).pane),
					currentScreenConfig =  Object.keys(base.getMultiScreenConfig(screens, customData, currentScreenId).pane);
					if(prevScreenConfig.length != currentScreenConfig.length) {
                        if(prevScreenConfig.length > currentScreenConfig.length) { //Pane Open in previous screen
                            var data = {
                                    openedPanes : $(prevScreenConfig).not(currentScreenConfig).get()
                            }
                            triggerScreenEvent("multiScreenScreenOpen", data, customData);
                        } else { //Pane Close in previous screen
                            var data = {
                                    closedPanes : (prevScreenConfig.length !=0) ? $(currentScreenConfig).not(prevScreenConfig).get() : []
                            }
                            triggerScreenEvent("multiScreenScreenClose", data, customData);                           
                        }                       
                    }					
				}
			}
		}
		
		var triggerScreenEvent = function(eventName, params, customData) {
			var paneObjectArr = customDataMap[customData.key].paneObjArr;
			$.each(paneObjectArr, function(index, paneObject) {
        		paneObject.getPlaceholder().trigger(eventName, params);
			});
		}
		
		base.onConfigurationUpdate = function (e) {			
			if (e.key == iFlight_Module_Name + '_' + 's') {		
				for (var property in customDataMap) {
					  if (customDataMap.hasOwnProperty(property)) {
						  updatePlots(e,customDataMap[property].customData);
					  }
				}				
			} else if (e.key == iFlight_Module_Name + '_' + 'hB') {
				storageEventTriggerTime = $.now();
				for (var property in customDataMap) {
					  if (customDataMap.hasOwnProperty(property)) {
						  checkHeartBeat(customDataMap[property].customData);
					  }
				}				
			} else if (e.key == iFlight_Module_Name + '_' + 'nOfS') {
				if (e.newValue > e.oldValue) {
					return;
				}
			} else if (e.key.match(iFlight_Module_Name + '_' + 'g_')){
				/*if(Object.keys(JSON.parse(e.newValue)).length == Object.keys(JSON.parse(e.oldValue)).length)
				{*/
				for (var property in customDataMap) {
					  if (customDataMap.hasOwnProperty(property)) {
						  updatePlotDataInMultiScreen(e,customDataMap[property].customData);
					  }
				}	
				
				//}
			}
		};
		
		
        base.init = function (options) {
            base.options = $.extend({}, defaultOptions, options);            
            // Any code you want to run during initialization
			if (window.addEventListener) {
				window.addEventListener("storage", base.onConfigurationUpdate, false);
			} else {
				window.attachEvent("onstorage", base.onConfigurationUpdate);
			}
        };
		
        base.handleMultiScreenClose = function(placeHolderId, plotLabel, customData) {
        	var screenId = base.getCurrScreenId(customData.key),
        	totalScreens = parseInt(base.getMultiscreenCurrentData(customData.key,"nOfS"));
        	var paneObjArr = customDataMap[customData.key].paneObjArr;
        	if(placeHolderId) {
    			var index = paneObjArr.findIndex(function(paneObject){
    				return paneObject.getPlaceholder().attr('id') === placeHolderId;
    			});
    			if(index != -1) {
    				var plot = paneObjArr[index];
    				if(plot) {
	    				base.removePane(screenId, {}, plotLabel, plot.getOptions().multiScreenFeature.customData);
	    				var data = {
	    						plotLabel : plotLabel
	    				};
	    				plot.getPlaceholder().trigger("multiScreenScreenClose", data);
	    				paneObjArr.splice(index, 1);
    				}
    			}
    		} else { // Call came from beforeunload event. Clear all Configs.
    			$.each(paneObjArr, function(index, paneObject) {
            		base.removePane(screenId, {}, paneObject.getPlotLabel(), customData);
            		paneObject.getPlaceholder().trigger("multiScreenScreenClose", []);
    			});
    			paneObjArr = [];
    		}
        	var screens =  $.getFromLocalStore('s');
        	if(paneObjArr.length == 0 && screens) {
        		var totalConfigs = screens[screenId];
        		if(totalConfigs.length == 0)
        		{
        			$.deleteFromSessionStore('sId');
        		}
        		if (updateHeartbeat != null) {
    				window.clearInterval (updateHeartbeat);
    			}
        	}
        	if(screenId == 0 && totalScreens == 1 && paneObjArr.length == 0 && screens) {
        		var totalConfigs = screens[screenId];
        		if(totalConfigs.length == 0)
        		{
        			clearAllConfigs();
        		}
        	}
        }
        
        
        // Run initializer
        base.init();
        
        $(window).on('beforeunload', function(){
        	for (var property in customDataMap) {
				  if (customDataMap.hasOwnProperty(property)) {
					  base.handleMultiScreenClose(null,null,customDataMap[property].customData);
				  }
			}
        	
        });
    };
	
	jQuery.multiScreenScroll = new multiScreenScroll();
    
})(jQuery);