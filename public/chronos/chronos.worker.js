//chronos worker invocation types
var workerType = { METHOD_CALL : "METHOD_CALL", METADATA : "META" };

//Registering onMessage processor
self.addEventListener('message', function( workerMsg ) {
    
	var data = workerMsg.data;
	
	/* if the data type and Worker type Method call is equal 
	   then the method in worker is called.
	   On Posting the message the result of the Method is obtained in workerlink.
	*/
	if ( data.type === workerType.METHOD_CALL ) {
		var result = self[data.methodName](data.args);
		postMessage( {
			type : data.type,
			context : data.context,
			methodName : data.methodName,
			result : result
		} );
	} else if ( data.type === workerType.METADATA ) {
		//handle META
	}
  
}, false);

//Register error handler
self.addEventListener( 'error', function(e){
	console.log( e );
}, false );

//Sample Method to get the sum of the args and return the sum to result in addEventListener 
function getSum(args) {
	var a = args[0], b = args[1], sum;
	sum = a+b;
	return sum;
}

var one_day = 1000 * 60 * 60 * 24; //one day in millis
var longRangeIndexTillChecked ;
function callFetchDataIfRequired(args) {
	var plot = args.plot;
	var responseData = {};
	var responseDesiredLoadedData = {};
	var desiredLoadedDataArray =  [];
	var desiredLoadedExtraFetchDataArray =  [];
	var currentVisibleYRange =  (Math.floor(plot.currentVisibleData.yValueMax)  - Math.ceil(plot.currentVisibleData.yValueMin)) + 1 ; //including both the start & end yLabels
	// For calculating desired day range for X axis- time in this case		
	var currentVisibleDays =  Math.ceil((plot.currentVisibleData.toDate  - plot.currentVisibleData.fromDate) /one_day) ; //including both the start & end days

	var extraViewFetchRequired = plot.options.interaction.extraViewFetch; // By default previous and next View rows and columns will be fetched
	var initialViewDesiredData = setupDesiredLoadedData(0, 0, extraViewFetchRequired,plot);
	var missingRowIds =  getMissingRowIds(initialViewDesiredData,plot);
	/* console.log("BEFORE VIEW FETCH currentLoadedData---- > ", plot.currentLoadedData);
	console.log("fromDate : " , new Date(plot.currentLoadedData.fromDate) , " toDate : " ,  new Date(plot.currentLoadedData.toDate));
	 
	console.log("\n BEFORE VIEW FETCH desiredLoadedData ---- > ", initialViewDesiredData);
	console.log("fromDate : " , new Date(initialViewDesiredData.fromDate) , " toDate : " ,  new Date(initialViewDesiredData.toDate));
	
	console.log("BEFORE missingRowIds ---- ",missingRowIds); */
	//Only for the initial fetch - server call send separately
	if(missingRowIds.length > 0 || (initialViewDesiredData.fromDate < plot.currentLoadedData.fromDate)
			|| (initialViewDesiredData.toDate > plot.currentLoadedData.toDate)) {
			if(!extraViewFetchRequired) {
				applyExtraFetchFactorAndCap(initialViewDesiredData, currentVisibleYRange, currentVisibleDays,plot);
				discardIrreleventData(initialViewDesiredData,plot);
			}
			responseDesiredLoadedData.fromDate = initialViewDesiredData.fromDate; // no change
			responseDesiredLoadedData.toDate = initialViewDesiredData.toDate; // no change
			missingRowIds =  getMissingRowIds(initialViewDesiredData,plot);
			responseDesiredLoadedData.rowIds = missingRowIds;
			if(responseDesiredLoadedData.rowIds.length >0) {
				desiredLoadedDataArray.push(responseDesiredLoadedData);
			}
			horizontalDatafetch(initialViewDesiredData, desiredLoadedDataArray,plot);
			// setting response
			responseData.extraViewFetchRequired = extraViewFetchRequired;
			responseData.triggerInitialViewDataLoad = true;
			responseData.initialViewDesiredData = initialViewDesiredData;
			responseData.desiredLoadedDataArray = desiredLoadedDataArray;
	} 
	
	//FOR EXTRA VIEW FETCH 
	var desiredLoadedData = setupDesiredLoadedData(currentVisibleYRange, currentVisibleDays,extraViewFetchRequired,plot );
	missingRowIds =  getMissingRowIds(desiredLoadedData,plot);			
	/*console.log("AFTER VIEW FETCH currentLoadedData---- > ", plot.currentLoadedData);
	console.log("fromDate : " , new Date(plot.currentLoadedData.fromDate) , " toDate : " ,  new Date(plot.currentLoadedData.toDate));
	 
	console.log("\n AFTER VIEW FETCH desiredLoadedData ---- > ", desiredLoadedData);
	console.log("fromDate : " , new Date(desiredLoadedData.fromDate) , " toDate : " ,  new Date(desiredLoadedData.toDate));
	*/
		
		//ignore the following case at initial case of plot init.This case will not happen here.
	//Also decide whether we need to go for data fetch or not in case of fetching small movements  
	if(extraViewFetchRequired && (missingRowIds.length > 0 ||
			desiredLoadedData.fromDate < plot.currentLoadedData.fromDate ||
			desiredLoadedData.toDate > plot.currentLoadedData.toDate)) {			
		applyExtraFetchFactorAndCap(desiredLoadedData, currentVisibleYRange, currentVisibleDays,plot);	
		discardIrreleventData(desiredLoadedData,plot);
		missingRowIds = getMissingRowIds(desiredLoadedData,plot);
		responseDesiredLoadedData = {};
		//In both scrollDown and up Case , other than the initial case
			responseDesiredLoadedData.fromDate = desiredLoadedData.fromDate; // no change
			responseDesiredLoadedData.toDate = desiredLoadedData.toDate; // no change
		if(responseDesiredLoadedData.toDate >= responseDesiredLoadedData.fromDate) { 
				responseDesiredLoadedData.rowIds = missingRowIds;		
				if (responseDesiredLoadedData.rowIds.length > 0) {
					// console.log("PUSHING  responseDesiredLoadedData ---- ", printData(responseDesiredLoadedData));
					desiredLoadedExtraFetchDataArray.push(responseDesiredLoadedData);
			}
		}
		
		horizontalDatafetch(desiredLoadedData, desiredLoadedExtraFetchDataArray,plot);	
		// setting response
		responseData.triggerExtraViewDataLoad = true;
		responseData.desiredLoadedData = desiredLoadedData;
		responseData.desiredLoadedExtraFetchDataArray = desiredLoadedExtraFetchDataArray;
	}
	return responseData;
}

/**
 * This is for handling the scroll right and scroll left cases - horizontal fetch
 */
 horizontalDatafetch = function(desiredLoadedData, desiredLoadedDataArray,plot) {
	//SCROLL RIGHT CASE -------		
	 var tempDesiredLoadedData;
		var desiredVisibleRowIds = getDesiredRowIdsThatAreVisible(desiredLoadedData,plot);
		
		
		if(desiredLoadedData.toDate  > plot.currentLoadedData.toDate) {					
			//console.log("Scroll Right case ----desiredVisible rowIds---", desiredVisibleRowIds );
			tempDesiredLoadedData = {};					
			tempDesiredLoadedData.toDate = desiredLoadedData.toDate;//no change 
			tempDesiredLoadedData.rowIds=desiredVisibleRowIds; //no change
			
			tempDesiredLoadedData.fromDate = plot.currentLoadedData.toDate;
			if(desiredLoadedData.fromDate > plot.currentLoadedData.toDate) { 
				tempDesiredLoadedData.fromDate = desiredLoadedData.fromDate;
			}			
			if (tempDesiredLoadedData.rowIds.length > 0) {
				desiredLoadedDataArray.push(tempDesiredLoadedData);		
			}
			 
		}  			
		
		//SCROLL LEFT CASE -------			 
		if(desiredLoadedData.fromDate  < plot.currentLoadedData.fromDate) {	
			tempDesiredLoadedData={};
			tempDesiredLoadedData.fromDate = desiredLoadedData.fromDate; // no change	 
			// console.log("Scroll LEFT case ----desiredVisible rowIds---", desiredVisibleRowIds );
			tempDesiredLoadedData.rowIds=desiredVisibleRowIds; //no change	
			tempDesiredLoadedData.toDate = plot.currentLoadedData.fromDate;
			if(desiredLoadedData.toDate < plot.currentLoadedData.fromDate) {  
				tempDesiredLoadedData.toDate = desiredLoadedData.toDate;
			}
			if (tempDesiredLoadedData.rowIds.length > 0) {
				desiredLoadedDataArray.push(tempDesiredLoadedData);	
			}
		}
		 
 };
 
 /**
	 * get visible rowIds that are in the desired loaded range. 
	 */
	function getDesiredRowIdsThatAreVisible(desiredLoadedData,plot) {
		var visibleRowIds = getVisibleRowIds(plot.currentLoadedData,plot);
		var desiredVisibleRowIds =  [];
	 
		// get  the visible rows  specified in the desiredLoadedData
		 visibleRowIds.forEach(function(eachVisibleRowId,index) {				
			if(desiredLoadedData.rowIds.indexOf(eachVisibleRowId) > -1) { 
				desiredVisibleRowIds.push(eachVisibleRowId);					
			}
		});
	 
		 return desiredVisibleRowIds;
	};
	
	/**
	 * to retrieve the visible rowIds(not hidden) for the range specified in the desiredLoadedData
	 */
	function getVisibleRowIds(currentLoadedData,plot) {
		var series = plot.series;			 
		var visibleRowIds = [];
		var actualRowId;  	
		var yMin = Math.floor(currentLoadedData.yValueMin);
		var yMax = Math.ceil(currentLoadedData.yValueMax);
		
		// console.log("-getVisibleRowIds ---yMin -------", yMin , "----yMax -------", yMax);
		
		for ( var rowId = yMin; rowId <= yMax; rowId++) {
			actualRowId = series.actualFilterRowIds[rowId]; 
			if(actualRowId) {
				if(series.rowIdLeafNodeMap) {
					var leafNode  = series.rowIdLeafNodeMap[actualRowId];//FOR TREE ON DEMAND ONLY FOR LEAF NODE
	 				if(leafNode && leafNode.isLeafNode ) {
	 					if(plot.hiddenRows.indexOf(actualRowId) == -1) { 
	 						if(visibleRowIds.indexOf(actualRowId) == -1) { // if not already added
		 					visibleRowIds.push(actualRowId);
	 						}
		 				}
	 				}
				} else {
					if(plot.hiddenRows.indexOf(actualRowId) == -1) {// NORMAL ON DEMAND
						if(visibleRowIds.indexOf(actualRowId) == -1) { //if  not already added
	 					visibleRowIds.push(actualRowId);
	 				}
				}
				}
				 
			} 
		} 
		
		//console.log("----visibleRowIds -------", visibleRowIds)
		return visibleRowIds;
	};

/**
 * 
 * discard from currentLoadedMin to desiredLoadedMin, 
 * discard from desiredLoadedMax to currentLoadedMax
 * discardIrreleventData from the data2DMatrix as well -
 */
function discardIrreleventData(desiredLoadedData,plot) {
	var rowAvailable = plot.series.rowAvailable;
	var rowMap = plot.series.rowMap;	
	var actualRowId, dataMapRowIndex, dataMapColumnIndex;
	 if(plot.currentLoadedData.yValueMin < desiredLoadedData.yValueMin ) { 
		 for( var index = plot.currentLoadedData.yValueMin; (index < desiredLoadedData.yValueMin && index <= plot.currentLoadedData.yValueMax) ; index++) {					 
			 actualRowId =  plot.series.actualFilterRowIds[index];//Desired and Currentloaded data are having actualRowId yValue
			 //removing the items from dataMap & from 2Dmatrix also
			 dataMapRowIndex = rowMap[actualRowId];
			 if(dataMapRowIndex) {						 
				 rowAvailable.push(dataMapRowIndex);//make this space in map available and add it to rowAvailable list
			 }
			 rowMap[actualRowId] = null; 
			//  console.log("discarding ", actualRowId);
		}
	 } //if			
	 
	 if(plot.currentLoadedData.yValueMax > desiredLoadedData.yValueMax ) { 
		 //ISRM-5635 >= removed  One extra data removal corrected
		 for(var index = plot.currentLoadedData.yValueMax; index > desiredLoadedData.yValueMax && index >= plot.currentLoadedData.yValueMin ; index--) {	
			 actualRowId =  plot.series.actualFilterRowIds[index];
			//removing the items from dataMap & from 2Dmatrix 
			 dataMapRowIndex = rowMap[actualRowId];
			 if(dataMapRowIndex) {					
				 rowAvailable.push(dataMapRowIndex);//make this space in map available and add it to rowAvailable list 
			 }
			 rowMap[actualRowId] = null; 
			 // console.log("discarding ", actualRowId);
		}
	 } //if			
	 
	 //FOR DAYS & COLUMN MAP	
	var columnAvailable = plot.series.columnAvailable;
	var columnMap = plot.series.columnMap;	
	 
	 if(new Date(plot.currentLoadedData.fromDate) < new Date(desiredLoadedData.fromDate) ) { 
		 for( index = plot.currentLoadedData.fromDate; index < desiredLoadedData.fromDate  &&  index <= plot.currentLoadedData.toDate; ) {
			//removing the items from from dataMap & from 2Dmatrix 
			 dataMapColumnIndex = columnMap[index];
			 if(dataMapColumnIndex) {
				 columnAvailable.push(dataMapColumnIndex);//make this space in map available and add it to rowAvailable list 						
			 }					 
			 columnMap[index] = null; 					 
			 index = resetViewPortTime(index + one_day); //adding one day milliseconds 
		} 
	 } //if					
	 
	 if(new Date(plot.currentLoadedData.toDate) > new Date(desiredLoadedData.toDate) ) { 
		 for( var colindex = plot.currentLoadedData.toDate; colindex > desiredLoadedData.toDate && colindex >= plot.currentLoadedData.fromDate ;  ) {					  
			 dataMapColumnIndex = columnMap[colindex];
			 //removing the items from dataMap & from 2Dmatrix 					
			 if(dataMapColumnIndex != undefined) {
				 columnAvailable.push(dataMapColumnIndex);//make this space in map available and add it to columnAvailable list 
			 }					 
			 columnMap[colindex] = null; 				 
			 colindex = resetViewPortTime(colindex - one_day);
		}  
	 } //if
	 
}

function getMissingRowIds(desiredLoadedData,plot) {
	var series = plot.series;
	var missingRowIds = [];
	var actualRowId;  	
	var yMin = Math.floor(desiredLoadedData.yValueMin);
	var yMax = Math.ceil(desiredLoadedData.yValueMax);
	for ( var YValue = yMin; YValue <= yMax; YValue++) {
			actualRowId = series.actualFilterRowIds[YValue];
			if(actualRowId) {
					if(series.rowIdLeafNodeMap) {
						var leafNode  = series.rowIdLeafNodeMap[actualRowId];
		 				if(leafNode && leafNode.isLeafNode) {
	 					missingRowIds = pushToArray(actualRowId, missingRowIds, series, YValue,plot);
		 				}
					} else {
					missingRowIds = pushToArray(actualRowId, missingRowIds, series ,YValue,plot );
				}
			}
	}	
	// console.log("Missing row Ids------------  ", missingRowIds);
	return missingRowIds;
};

function applyExtraFetchFactorAndCap(desiredLoadedData, currentVisibleYRange, currentVisibleDays,plot) {
	var options = plot.options; 
	var EXTRA_FETCH_FACTOR_ROW  = options.interaction.extraFetchFactor.vertical;
	desiredLoadedData.yValueMin = desiredLoadedData.yValueMin - Math.floor(currentVisibleYRange * EXTRA_FETCH_FACTOR_ROW);
	desiredLoadedData.yValueMax = desiredLoadedData.yValueMax + Math.ceil(currentVisibleYRange * EXTRA_FETCH_FACTOR_ROW);
	//Again cap for any exceeding values
	capDesiredMinMaxActualYValueLimits(desiredLoadedData,plot);	//considering wrap rows as well. Note the capping is with is actual here.
	
	var EXTRA_FETCH_FACTOR_COLUMN = options.interaction.extraFetchFactor.horizontal;
	desiredLoadedData.fromDate = resetViewPortTime(desiredLoadedData.fromDate - Math.floor(currentVisibleDays * one_day) * EXTRA_FETCH_FACTOR_COLUMN);
	desiredLoadedData.toDate = resetViewPortTime(desiredLoadedData.toDate + Math.ceil(currentVisibleDays * one_day) * EXTRA_FETCH_FACTOR_COLUMN);
	//Again cap for any exceeding values				
	capDesiredMinMaxDayLimits(desiredLoadedData,plot);	
	//update the rowIds for this area also
	desiredLoadedData.rowIds =  getRequestedRowIds(desiredLoadedData,plot);
	// console.log("EXTRA FETCH CALCULATED desiredLoadedData", desiredLoadedData);
}

function capDesiredMinMaxDayLimits(desiredLoadedData,plot) {			
	var series = plot.series;
	 var normalSpanMillis = (series.gantt.normalMaximumDaySpan) * 1000 * 60 * 60 * 24;
	var options = plot.options,
	scrollRange = options.xaxis.scrollRange,   
	capMinDays=scrollRange[0] - normalSpanMillis,
	capMaxDays=scrollRange[1];
	
	 
	if (desiredLoadedData.fromDate < capMinDays) {
		desiredLoadedData.fromDate = resetViewPortTime(capMinDays);				 
	}			
	if (desiredLoadedData.toDate >capMaxDays) {
		desiredLoadedData.toDate = resetViewPortTime(capMaxDays);				 
	}	 		
}

/**
 * Capping the desired loaded data with actual yValue.
 */		
function capDesiredMinMaxActualYValueLimits(desiredLoadedData,plot) { 
	var options = plot.options;		 
	scrollRange = options.yaxis.scrollRange;   
	var capActualMinYValue=plot.series.displayedRowIds[Math.ceil(scrollRange[0])];
	var capActualMaxYValue = plot.series.displayedRowIds[Math.floor(scrollRange[1])];
	if (desiredLoadedData.yValueMin < capActualMinYValue) {
		desiredLoadedData.yValueMin = capActualMinYValue;		
	}			
	if (desiredLoadedData.yValueMax > capActualMaxYValue) {
		desiredLoadedData.yValueMax = capActualMaxYValue;		
	}	 			
	//After capping retrieve the rowIds as well and set to object
	
}

function resetViewPortTime(minTimeInMillis) { 	         
    var viewPortMinTime = new Date(minTimeInMillis);  
    viewPortMinTime.setUTCHours(0);
	viewPortMinTime.setUTCMinutes(0);
	viewPortMinTime.setUTCSeconds(0);
	viewPortMinTime.setUTCMilliseconds(0);     	
	return viewPortMinTime.getTime();
 } 

/**
 * to retrieve the rowIds for the range specified in the desiredLoadedData
 * The rowIds fetched will be only leaf rows if it is tree. else
 * all rowIds (and not hidden) will be added for fetchign in desired rowIds
 */
function getRequestedRowIds(desiredLoadedData,plot) {
	var series = plot.series;
	var options = plot.options;
	var requestedRowIds = [];
	var actualRowId;  	
	var yMin = Math.floor(desiredLoadedData.yValueMin);
	var yMax = Math.ceil(desiredLoadedData.yValueMax);
	for ( var rowId = yMin; rowId <= yMax; rowId++) {
			actualRowId = series.actualFilterRowIds[rowId];
			if(actualRowId != undefined) {
				if(options.yaxis.treeNode && options.yaxis.treeNode.displayData){  // if non leaf nodes also needs to display data
					if(plot.hiddenRows.indexOf(actualRowId) == -1) {
						requestedRowIds.push(actualRowId);
					}
				} else {
					if(series.rowIdLeafNodeMap != undefined) {
						var leafNode  = series.rowIdLeafNodeMap[actualRowId];//FOR TREE ON DEMAND ONLY FOR LEAF NODE
						//console.log("Requestign tree leaf node----", leafNode);
		 				if(leafNode && leafNode.isLeafNode) {
		 					if(plot.hiddenRows.indexOf(actualRowId) == -1) { 
		 						requestedRowIds.push(actualRowId);
		 						// console.log("Requested rowID--", actualRowId);
	 		 				}
		 				}
					} else {
						if(plot.hiddenRows.indexOf(actualRowId) == -1) {// NORMAL ON DEMAND
							requestedRowIds.push(actualRowId);
		 				}
						 
					}
				}
				
			}
	} 
	
	return requestedRowIds;
};

function pushToArray(actualRowId, arrayToPush, series, YValue,plot) {
	if(plot.hiddenRows.indexOf(actualRowId) == -1) {
		if(series.rootTreeNode != undefined) {
			// case when tree expandNodes are done : for on demand fetching of those discarded rows
			var row2DIndex = series.rowMap[actualRowId];
			if(!row2DIndex && (arrayToPush.indexOf(actualRowId) == -1)) {	// if not already added
				arrayToPush.push(actualRowId);				
			}
		}
						 
		/** 
		 * Load all rows in current loaded range. The wrap calculation can change in each  scenario.
		 * So checking the yValue range will not fetch all the required rows 
		 */
		if(  arrayToPush.indexOf(actualRowId) == -1  && ((plot.currentLoadedData.yValueMax == -1) || 
					plot.currentLoadedData.rowIds.indexOf(actualRowId)  == -1 ) ) {
			arrayToPush.push(actualRowId);
		}
	}			
	if(arrayToPush.indexOf(actualRowId) == -1 && plot.newInsertedRows.indexOf(actualRowId) != -1) {
		//check if not already there in array
			arrayToPush.push(actualRowId);	
	 
	}
	return arrayToPush;
};

/**
 * Create desired loaded data considering the min-/max+currentVisibleYRange and min-/max+currentVisibleDays
 */
function setupDesiredLoadedData(currentVisibleYRange, currentVisibleDays, extraViewFetchRequired,plot) {
	var desiredLoadedData = {}, series = plot.series, options = plot.options;
	// For calculating desired data fetch range for Y axis- ie yLabels in this case				
    // console.log("currentVisibleYRange : ", currentVisibleYRange , " extraViewFetchRequired ", extraViewFetchRequired);
	var extraViewFetchFactor = options.interaction.extraViewFetchFactor;
			
	if(extraViewFetchRequired){
		desiredLoadedData.yValueMin = plot.currentVisibleData.yValueMin - (extraViewFetchFactor.vertical * currentVisibleYRange); 
		desiredLoadedData.yValueMax = plot.currentVisibleData.yValueMax + (extraViewFetchFactor.vertical * currentVisibleYRange);
	} else {
		desiredLoadedData.yValueMin = plot.currentVisibleData.yValueMin; 
		desiredLoadedData.yValueMax = plot.currentVisibleData.yValueMax;
	}
 	
	if(series.rootTreeNode != undefined) { // only cap for tree case
		desiredLoadedData.yValueMin =   Math.floor(desiredLoadedData.yValueMin); 
		desiredLoadedData.yValueMax =   Math.ceil(desiredLoadedData.yValueMax);
	}
 
	//Capping with displayed
	capDesiredMinMaxDisplayedYValueLimits(desiredLoadedData,plot); // normal displayedYValue -NOTE: Not converted to actual
	if(desiredLoadedData.yValueMin) {
		desiredLoadedData.yValueMin =   Math.floor(desiredLoadedData.yValueMin); 
	}
	if(desiredLoadedData.yValueMax) {
		desiredLoadedData.yValueMax =   Math.ceil(desiredLoadedData.yValueMax);
	}
	
	if (desiredLoadedData.yValueMin < 0) {
		desiredLoadedData.yValueMin = 0;
	}
	 
	if (desiredLoadedData.yValueMax >= series.displayedRowIds.length) {  
		desiredLoadedData.yValueMax = series.displayedRowIds.length - 1;
	}
	
	//converting to actual -CONVERSION HAPPENS HERE
	desiredLoadedData.yValueMin = series.displayedRowIds[desiredLoadedData.yValueMin]; //convert to  actual rowIds
	desiredLoadedData.yValueMax = series.displayedRowIds[desiredLoadedData.yValueMax]; //convert actual rowIds
	var requestedRowIds;
	//After capping retrieve the rowIds as well and set to object			 
	requestedRowIds = getRequestedRowIds(desiredLoadedData,plot);	
	desiredLoadedData.rowIds = requestedRowIds;
	// For calculating desired day range for X axis- time in this case		
	// console.log("currentVisibleDays : ", currentVisibleDays);
	if(extraViewFetchRequired){
		desiredLoadedData.fromDate = plot.currentVisibleData.fromDate - extraViewFetchFactor.horizontal * Math.floor(currentVisibleDays * one_day);// in millisecondonds
		desiredLoadedData.toDate = plot.currentVisibleData.toDate + extraViewFetchFactor.horizontal * Math.ceil(currentVisibleDays * one_day);
	} else {
		desiredLoadedData.fromDate = plot.currentVisibleData.fromDate;// in milliseconds
		desiredLoadedData.toDate = plot.currentVisibleData.toDate;
	}
	
	//considering normal day span here	 
	var normalSpanMillis = (series.gantt.normalMaximumDaySpan) * 1000 * 60 * 60 * 24;
	desiredLoadedData.fromDate = desiredLoadedData.fromDate - normalSpanMillis;
	
	//Cap both desired and currentLoaded data
	capDesiredMinMaxDayLimits(desiredLoadedData,plot);		
	return desiredLoadedData;
};

/**
 * Capping the desired loaded data with displayed yValue - normal scrollrange 
 */
function capDesiredMinMaxDisplayedYValueLimits(desiredLoadedData,plot) { 
	var options = plot.options;		 
	scrollRange = options.yaxis.scrollRange;   
	var capMinYValue= Math.ceil(scrollRange[0]);
	var capMaxYValue = Math.floor(scrollRange[1]);
	if (desiredLoadedData.yValueMin < capMinYValue) {
		desiredLoadedData.yValueMin = capMinYValue;		
	}			
	if (desiredLoadedData.yValueMax > capMaxYValue) {
		desiredLoadedData.yValueMax = capMaxYValue;		
	}	 			
	if(desiredLoadedData.yValueMax < desiredLoadedData.yValueMin){
		desiredLoadedData.yValueMin = desiredLoadedData.yValueMax;
	}
	//IMPT: To extend scroll units accordign to the  set
	adjustEndPointsForYaxis(desiredLoadedData,plot); //CHECK IF NEEDED HERE
	//After capping retrieve the rowIds as well and set to object
}

function adjustEndPointsForYaxis(desiredLoadedData,plot) {
	var opts = plot.options;     
	var scrollMin =  opts.yaxis.newScrollRange.scrollMin;
    var scrollMax = opts.yaxis.newScrollRange.scrollMax;		   
    if(opts.yaxis.verticalScrollExtendunit > 0) {
		if(desiredLoadedData.yValueMin <= scrollMin) {
			desiredLoadedData.yValueMin = scrollMin + opts.yaxis.verticalScrollExtendunit;
		} 
		if(desiredLoadedData.yValueMax >= scrollMax) {
			desiredLoadedData.yValueMax = scrollMax - opts.yaxis.verticalScrollExtendunit;
		} 			
		if(desiredLoadedData.yValueMax < desiredLoadedData.yValueMin){
			desiredLoadedData.yValueMin = desiredLoadedData.yValueMax;
		}
   } 
}

/**
 * to retrieve the rowIds for the range specified in the desiredLoadedData
 * The rowIds fetched will be only leaf rows if it is tree. else
 * all rowIds (and not hidden) will be added for fetchign in desired rowIds
 */
function getRequestedRowIds(desiredLoadedData,plot) {
	var series = plot.series;
	var options = plot.options;
	var requestedRowIds = [];
	var actualRowId;  	
	var yMin = Math.floor(desiredLoadedData.yValueMin);
	var yMax = Math.ceil(desiredLoadedData.yValueMax);
	for ( var rowId = yMin; rowId <= yMax; rowId++) {
			actualRowId = series.actualFilterRowIds[rowId];
			if(actualRowId != undefined) {
				if(options.yaxis.treeNode && options.yaxis.treeNode.displayData){  // if non leaf nodes also needs to display data
					if(plot.hiddenRows.indexOf(actualRowId) == -1) {
						requestedRowIds.push(actualRowId);
					}
				} else {
					if(series.rowIdLeafNodeMap != undefined) {
						var leafNode  = series.rowIdLeafNodeMap[actualRowId];//FOR TREE ON DEMAND ONLY FOR LEAF NODE
						//console.log("Requestign tree leaf node----", leafNode);
		 				if(leafNode && leafNode.isLeafNode) {
		 					if(plot.hiddenRows.indexOf(actualRowId) == -1) { 
		 						requestedRowIds.push(actualRowId);
		 						// console.log("Requested rowID--", actualRowId);
	 		 				}
		 				}
					} else {
						if(plot.hiddenRows.indexOf(actualRowId) == -1) {// NORMAL ON DEMAND
							requestedRowIds.push(actualRowId);
		 				}
						 
					}
				}
				
			}
	} 
	
	return requestedRowIds;
};

function determineBucketWiseWrap (args) {
	var response = {};
	var axisYmin = args.axisYmin;
	var axisYmax = args.axisYmax;
	
	var rowIdMaxWrapMap = []; //will have key as rowId and the value will be the total maxWrapRows calculated for that row. . If collpased, will be 1 always .
	var taskIdWrapIndexMap = [];
	var wrapRowNormalTaskListMap = [];
	var wrapRowLongRangeTaskListMap = [];
	
	var actualFilteredRowIds = args.series.actualFilterRowIds;
	plot = args.plot;
	
	var series = args.series;
	series.rowIdMaxWrapMap = rowIdMaxWrapMap;
	series.taskIdWrapIndexMap = taskIdWrapIndexMap;
	series.wrapRowNormalTaskListMap = wrapRowNormalTaskListMap;
	series.wrapRowLongRangeTaskListMap = wrapRowLongRangeTaskListMap;
	
	plot.series = series;
	args.plot = plot;
	for (var yValue = axisYmin;  yValue <= axisYmax; yValue++) {
		var rowId = actualFilteredRowIds[yValue];
		//console.log("Each ROW ID TAKEN -----------------------------------" , rowId);
		if(rowId == undefined) {
			continue;
		}
		//longRangeIndexTillChecked = 0;
		//plot.determineBucketWiseWrapForEachRow( rowId, args.series ); 
		determineBucketWiseWrapForEachRow(  rowId, plot );
	} 
	response.columnMap = series.columnMap;
	var updateWrapIndexResponse = updateWrapIndexDisplayMap(args);
	for(var prop in updateWrapIndexResponse){
		response[prop] = updateWrapIndexResponse[prop];
	}
	if(args.isCallFetchReq){
		var responseData = callFetchDataIfRequired(args);
		for(var prop in responseData){
			response[prop] = responseData[prop];
		}
	}
	response.longRangeIndexTillChecked = longRangeIndexTillChecked;
	response.rowIdMaxWrapMap = rowIdMaxWrapMap
	response.taskIdWrapIndexMap = taskIdWrapIndexMap
	response.wrapRowNormalTaskListMap = wrapRowNormalTaskListMap
	response.wrapRowLongRangeTaskListMap = wrapRowLongRangeTaskListMap
	response.data2DMatrix = plot.series.data2DMatrix;
	return response; 
}

function determineBucketWiseWrapForEachRow(rowId, plot, clearWrapIndexForTasksInRow) {
	var series = plot.series;
	longRangeIndexTillChecked = 0;
	var maxWrapRowCount = 0;
	var oneDayMillis = 86400000; //24*3600*1000,
	
	//console.log("determineBucketWiseWrapForEachRow ", rowId);
	var rowIndexMap = series.rowMap; 
	var dataMapRowIndex = rowIndexMap[rowId];
	//console.log("determineBucketWiseWrapForEachRow ---------- " + rowId + " dataMapRowIndex = " + dataMapRowIndex); 
	if(dataMapRowIndex == null ||  dataMapRowIndex == undefined) {	
		series.rowIdMaxWrapMap[rowId] = 1; //for empty data row
		return;
	}
	var columnIndexMap = series.columnMap; 
	var taskObjectId, eachTask, taskObjectIdArray;
	var dataMap = series.dataMap;
	 
	var axisxMin = plot.currentLoadedData.fromDate ;
	var axisxMax = plot.currentLoadedData.toDate ;
	var dataMapColumnIndex , normalTaskIdMap ;
	var normalMaximumDaySpan = series.gantt.normalMaximumDaySpan - 1;

	var viewPortMin = resetViewPortTime(axisxMin) - (normalMaximumDaySpan * oneDayMillis); 
	var viewPortMax= resetViewPortTime(axisxMax);
	
	//if the row is a tree Node(with childNodes ) , don't consider for wrapping 
	if(series.rootTreeNode != undefined) { // if tree wrapping
	 var rowHeaderNode = series.rowIdRowObjectMap[rowId];
	 if(rowHeaderNode && !rowHeaderNode.isLeafNode) {
		 var wrapIndexToSet = 0;
		 clearTaskIdWrapIndexMapForLongRangeDataForThisRow(series, rowId, wrapIndexToSet); //otherwise taskIdWrapIndexMap will be cleared in the determineBucketWiseWrap call itself
		 clearTaskIdWrapIndexMapForNormalDataForThisRow(plot, rowId, viewPortMin, viewPortMax, rowIndexMap, columnIndexMap, dataMap, wrapIndexToSet);
		 return null;
	 }
	}
	
	if(clearWrapIndexForTasksInRow) {
		clearTaskIdWrapIndexMapForLongRangeDataForThisRow(series, rowId); //otherwise taskIdWrapIndexMap will be cleared in the determineBucketWiseWrap call itself
		clearTaskIdWrapIndexMapForNormalDataForThisRow(plot, rowId, viewPortMin, viewPortMax, rowIndexMap, columnIndexMap, dataMap);
	}
	
	for (var day = viewPortMin; day <= viewPortMax; ) {		            		
		var normalTasksArray = new Array(); //to store sorted aray
		//previous buckets until normal span
		//To handle the previous days entities ending in current day 
		var prevdayMilliSeconds = day - (normalMaximumDaySpan * oneDayMillis) ;  
		for (var olderDay = prevdayMilliSeconds; olderDay < day; ) {
			dataMapColumnIndex = columnIndexMap[olderDay];
			if(dataMapColumnIndex == undefined) {
				dataMapColumnIndex = getCurrentColumnIndex(olderDay, plot); //to create the column map when there is no data
				//console.log("Created column index :  for " , new Date(olderDay) +" = " + dataMapColumnIndex);
			}
			if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {
				normalTaskIdMap = getNormalTaskIdMap(series, dataMapRowIndex, dataMapColumnIndex );
				if(normalTaskIdMap != null && normalTaskIdMap != undefined ) {
					taskObjectIdArray = normalTaskIdMap.taskIdArray;
					if(taskObjectIdArray != undefined ) {
						for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
							taskObjectId = taskObjectIdArray[taskID];       
							eachTask  = dataMap[taskObjectId]; 
							if(eachTask != null &&  eachTask !=  undefined) {
								if(eachTask.end >  day ) {
									if(normalTasksArray.indexOf(eachTask) == -1) { // not added already 
										normalTasksArray.push(eachTask);   
									}
								}
							}//if
						}//for
					}//if
				}
		} //if
			olderDay = olderDay + oneDayMillis ;
		} //for
			
		//current bucket
		dataMapColumnIndex = columnIndexMap[day];
		if(dataMapColumnIndex == undefined) {
			dataMapColumnIndex = getCurrentColumnIndex(day, plot);  //to create the column map when there is no data
			//console.log("Created column index :  for " , new Date(day) +" = " + dataMapColumnIndex);
		}
		if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {
			//console.log("START Calculating index for  dataMapColumnIndex :  ", dataMapColumnIndex ,  " dataMapColumnIndex ", dataMapColumnIndex);
			normalTaskIdMap = getNormalTaskIdMap(series, dataMapRowIndex, dataMapColumnIndex );
			if(normalTaskIdMap != null && normalTaskIdMap != undefined ) {
				taskObjectIdArray = normalTaskIdMap.taskIdArray;
				if(taskObjectIdArray != undefined ) {
					for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
						taskObjectId = taskObjectIdArray[taskID];       
						eachTask  = dataMap[taskObjectId]; 
						if(eachTask != null &&  eachTask !=  undefined) {
							if(normalTasksArray.indexOf(eachTask) == -1) { // not added already 
								normalTasksArray.push(eachTask);  
							} 							
						}//if
					}//for
				}//if
			}
			//console.log("determineBucketWiseWrapForEachRow -------normalTasksArray.length " + normalTasksArray.length); 
			if(normalTasksArray.length > 0) {
				normalTasksArray.sort (compareObjectsBasedOnStartTime); //sorted normal Data
			}
			if(normalTaskIdMap == null || normalTaskIdMap == undefined) {
				normalTaskIdMap = [];
				series.data2DMatrix[dataMapRowIndex][dataMapColumnIndex] = normalTaskIdMap;
				
			}	
			//console.log("Sorted  normalTasksArray ... " , normalTasksArray);
			var bucketWiseRowIndex = determineMaxWrapIndexForThisBucket(rowId , day , normalTasksArray, day + oneDayMillis, series, clearWrapIndexForTasksInRow);
			normalTaskIdMap.bucketWiseRowIndex = bucketWiseRowIndex + 1; //incrementing as the maxWrap Index will be calculated from 0,1,2,3 etc 
			//console.log("END -" +  new Date(day)  +  " --------- rowid = " + rowId + "------ :bucketWiseRowIndex Calculated = ", normalTaskIdMap.bucketWiseRowIndex );
			if( normalTaskIdMap.bucketWiseRowIndex > maxWrapRowCount) {
				maxWrapRowCount = normalTaskIdMap.bucketWiseRowIndex;
			}
			
		} //if
			
		day = day + oneDayMillis ;
		//console.log("END -" + rowId + "------ :bucketWiseRowIndex Calculated = ", normalTaskIdMap.bucketWiseRowIndex );
	}//for
	//console.log("maxWrapRowCount for  row Id = " + rowId + "------  = ", maxWrapRowCount );
	series.rowIdMaxWrapMap[rowId] = maxWrapRowCount;
};

function resetViewPortTime(minTimeInMillis) {
	minTimeInMillis = Math.floor(minTimeInMillis);
    var viewPortMinTime = new Date(minTimeInMillis);
    viewPortMinTime.setUTCHours(0);
	viewPortMinTime.setUTCMinutes(0);
	viewPortMinTime.setUTCSeconds(0);
	viewPortMinTime.setUTCMilliseconds(0);     		
	return viewPortMinTime.getTime();        	
};

/**
 * return  the columnIndex to be used for  finding position in the 2d  dataMap for saving actualdata
 */
function getCurrentColumnIndex(date, plot) {
	var series = plot.series;
    var oneDayMillis = 24*3600*1000;
    var normalSpanMillis = series.gantt.normalMaximumDaySpan * oneDayMillis; // to check the ending tasks also in the loaded range
    var currentLoadedData = plot.currentLoadedData;
    var columnIndex = series.columnMap[date];
    if(columnIndex == null || columnIndex == undefined) {
    	  if ((date >= resetViewPortTime(currentLoadedData.fromDate)) && (date <= currentLoadedData.toDate)) {
              var columnAvailable = series.columnAvailable;
              if(columnAvailable != undefined) {	
                  columnIndex = columnAvailable.pop();
                   if(columnIndex != undefined) {
                  	   series.columnMap[date] = columnIndex;
   				} else {
   					console.log("WARNING !!! -  Column Index not available  for  date  ",  new Date(date) );
   				}
              }
			}		
    	   	   
    }                        
   return columnIndex;
}

/*when the recalculation of wrap index for each row is done when ever remove or add task is done, then 
 * we need to clear those data in the taskIDWrapIndexMap.
 * if wrapIndexToSet is provided each task item in this row will be assigned with this wrapIndex
 * */
function clearTaskIdWrapIndexMapForLongRangeDataForThisRow(series, rowId, wrapIndexToSet) {
	var  taskObjectId, eachTask, taskObjectIdArray;//, dataMapRowIndex;
	var rowIndexMap = series.rowMap; 
	var dataMap = series.dataMap; 	 
	var dataMapRowIndex = rowIndexMap[rowId];
	if(series.longRangeDataMap != undefined) {
		taskObjectIdArray = getLongRangeTaskIdArray(series, dataMapRowIndex );
		if(taskObjectIdArray != undefined) {
			for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
				taskObjectId = taskObjectIdArray[taskID];	
				
				eachTask  = dataMap[taskObjectId];		
				if(eachTask) {            
					if(wrapIndexToSet != undefined) {
						taskIdWrapIndexMap[eachTask.chronosId] = wrapIndexToSet;
					} else {
						//set default wrapIndex to null or undefined  if there is no wrap
						taskIdWrapIndexMap[eachTask.chronosId] = null;
					}
					//console.log("LONG DATA -ID retrieved  CLEARED... " + eachTask.chronosId);
				}//if
			}//for
		}				 
	}     	
}

/*when the recalculation of wrap index for each row is done when ever remove or add task is done, then 
 * we need to clear those data in the taskIDWrapIndexMap.
 * if wrapIndexToSet is provided each task item in this row will be assigned with this wrapIndex
 * */
function clearTaskIdWrapIndexMapForNormalDataForThisRow(plot, rowId, viewPortMin, viewPortMax, rowIndexMap, columnIndexMap, dataMap, wrapIndexToSet) {
	var series = plot.series;
	var dataMapRowIndex = rowIndexMap[rowId];
	var oneDayMillis = 86400000; //24*3600*1000 
	var dataMapColumnIndex, eachTask;
	var normalTaskIdMap, taskObjectIdArray,taskObjectId;
	for (var day = viewPortMin; day <= viewPortMax; ) {		            		
			dataMapColumnIndex = columnIndexMap[day];
			if(dataMapColumnIndex == undefined) {
				dataMapColumnIndex = getCurrentColumnIndex(day, plot); //to create the column map when there is no data
			}
			if(dataMapColumnIndex) {
				normalTaskIdMap = getNormalTaskIdMap(series,dataMapRowIndex,dataMapColumnIndex );
				if(normalTaskIdMap) {
					taskObjectIdArray = normalTaskIdMap.taskIdArray;
					if(taskObjectIdArray != undefined ) {
						for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
							taskObjectId = taskObjectIdArray[taskID];       
							eachTask  = dataMap[taskObjectId]; 
							if(eachTask) {
								if(wrapIndexToSet != undefined) {
									taskIdWrapIndexMap[eachTask.chronosId] = wrapIndexToSet;
								} else {
									//set default wrapIndex to null or undefined  if there is no wrap
									taskIdWrapIndexMap[eachTask.chronosId] = null;
								}
							 
								//console.log("ID retrieved CLEARED... " + eachTask.chronosId);
							}
						}//if
					}//for
				}//if
			  
		} //if
			day = day + oneDayMillis ;
	} //for
	 
}

/**
  * @param currentSeries
 * @returns map containing taskIdArray and wrapRowCount
 */
function getNormalTaskIdMap(series, dataMapRowIndex, dataMapColumnIndex) {
    var currentSeries = series;
	 var matrixObject = currentSeries.data2DMatrix[dataMapRowIndex][dataMapColumnIndex];			
	 //if((matrixObject != null) && (undefined != matrixObject)) {
		// return matrixObject;
	 //}// else {
		 
		 //matrixObject = new Object();
		 //currentSeries.data2DMatrix[dataMapRowIndex][dataMapColumnIndex] = matrixObject;
		 return matrixObject;
}

/*
 * normalTasksArrayInCurrentBucket is the sorted tasks
 */
function determineMaxWrapIndexForThisBucket(rowId, bucketStartTime , normalTasksArrayInCurrentBucket , bucketEndTime, series, clearWrapIndexForTasksInRow) {
	//console.log("START determineMaxWrapIndexForThisBucket :Sorted normalTasksArrayInCurrentBucket = ", normalTasksArrayInCurrentBucket);
	var longRangeDataTasksInCurrentRow = sortLongRangeDataForThisRow(rowId, series, clearWrapIndexForTasksInRow) ;
	//console.log("Sorted longDataArray ==== ", longRangeDataTasksInCurrentRow);
	maxWrappedRowIndex = 0; //reset back for each bucket
	//iterating each sorted item according to the start task to assign the index
	if(normalTasksArrayInCurrentBucket.length > 0) {
		normalTasksArrayInCurrentBucket.forEach( function(eachTask, index) {
			//TAKING  EACH TASK FOR PLACEMENT 
			//check all longrange data starting before this normal task
			if(longRangeDataTasksInCurrentRow != undefined) {
				for(var longTask = longRangeDataTasksInCurrentRow[longRangeIndexTillChecked] ; (longTask !=undefined && longTask.start <= eachTask.start); ){
					if(series.taskIdWrapIndexMap[longTask.chronosId] == undefined || series.taskIdWrapIndexMap[longTask.chronosId] == null) {
						maxWrappedRowIndex = assignWrapRowIndexForTask(longTask, series, rowId, bucketStartTime, true);
						//console.log("AFTER LONG ASSIGNING ---- " , longTask.chronosId + " --------------------", longTask.wrappedRowIndex);	
					} else if(series.taskIdWrapIndexMap[longTask.chronosId] > maxWrappedRowIndex){
						maxWrappedRowIndex = series.taskIdWrapIndexMap[longTask.chronosId]; 
					}
					longRangeIndexTillChecked++;
					longTask = longRangeDataTasksInCurrentRow[longRangeIndexTillChecked];						
				}		
			}
			//if no long range data , check in normal
			if(series.taskIdWrapIndexMap[eachTask.chronosId] == undefined || series.taskIdWrapIndexMap[eachTask.chronosId] == null){
				maxWrappedRowIndex = assignWrapRowIndexForTask(eachTask, series, rowId, bucketStartTime, false);
				//console.log("AFTER ASSIGNING NORMAL TASK ---- " , eachTask.chronosId + " --------------------", eachTask.wrappedRowIndex);
			} else if(series.taskIdWrapIndexMap[eachTask.chronosId] > maxWrappedRowIndex){
				maxWrappedRowIndex = series.taskIdWrapIndexMap[eachTask.chronosId]; 
			}
			//}
	  });
		
  } 
  if(longRangeDataTasksInCurrentRow != undefined) {
		var longRangeIndex = 0;
		for(var longTask = longRangeDataTasksInCurrentRow[longRangeIndex] ; (longTask !=undefined && longTask.start <= bucketEndTime); ){
			if(series.taskIdWrapIndexMap[longTask.chronosId] == undefined || series.taskIdWrapIndexMap[longTask.chronosId] == null ) {
				maxWrappedRowIndex = assignWrapRowIndexForTask(longTask, series, rowId, bucketStartTime, true);
				longRangeIndexTillChecked++;
				//console.log("AFTER ASSIGNING ---- " , longTask.chronosId + " --------------------", longTask.wrappedRowIndex);	
			}  else if(series.taskIdWrapIndexMap[longTask.chronosId] > maxWrappedRowIndex && (longTask.end > (bucketEndTime - 86400000))){
				maxWrappedRowIndex = series.taskIdWrapIndexMap[longTask.chronosId]; 
			}
			longRangeIndex++;
			longTask = longRangeDataTasksInCurrentRow[longRangeIndex];						
		}		
 }
  //console.log("END determineMaxWrapIndexForThisBucket rowId ", rowId, "bucketEndTime " , new Date(bucketEndTime), ":maxWrappedRowIndex = ", maxWrappedRowIndex);
  return maxWrappedRowIndex; 			
}

function sortLongRangeDataForThisRow(rowId, series, clearWrapIndexForTasksInRow) {
	
	var  taskObjectId, eachTask, taskObjectIdArray;//, dataMapRowIndex;
	var rowIndexMap = series.rowMap; 
	var dataMap = series.dataMap; 	 
	var dataMapRowIndex = rowIndexMap[rowId];
	var longDataArray = new Array();
	
	if(series.longRangeDataMap != undefined) {
		taskObjectIdArray = getLongRangeTaskIdArray(series, dataMapRowIndex );
		if(taskObjectIdArray != undefined) {
			for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
				taskObjectId = taskObjectIdArray[taskID];	
				//console.log("LONG DATA -ID retrieved ... " + taskObjectId);
				eachTask  = dataMap[taskObjectId];		
				if(eachTask != null &&  eachTask != undefined) {            					
					longDataArray.push(eachTask); 	
				}//if
			}//for
		}
		longDataArray.sort (compareObjectsBasedOnStartTime); //sorted longRange Data
	}     	
	
	return longDataArray;
}

function assignWrapRowIndexForTask(task, series, rowId, bucketStartTime, isLongRangeTask) {
	//increment wrappedRowIndex from 0
	var  wrappedRowIndex = 0; //again start checking at 0
	//call findItemAt
	var checkAgain = true;
	if(task.wrappable == false) { //if wrappable is false
		task.wrappedRowIndex = 0;
		series.taskIdWrapIndexMap[task.chronosId] = 0; // don't consider for wrapping
		assignToWrapListMap(isLongRangeTask, series, rowId, wrappedRowIndex, bucketStartTime, task);
		if(wrappedRowIndex > maxWrappedRowIndex) {
			maxWrappedRowIndex = wrappedRowIndex;
		}				 
		checkAgain = false;
	}
	while(checkAgain) {
		var itemFound = findItemAt(rowId, series, wrappedRowIndex, task.start, bucketStartTime);
		if(itemFound != null && itemFound.wrappable != false) { // ITEM FOUND , itemPresent with this index
			wrappedRowIndex++;
			checkAgain = true;
		} else { //if null GOT POSITION -  Now assign task.wrappedRowIndex = wrappedRowIndex;
			task.wrappedRowIndex = wrappedRowIndex;					
			series.taskIdWrapIndexMap[task.chronosId] = wrappedRowIndex; //assigned to map
			//assign these task to the corresponding list
			assignToWrapListMap(isLongRangeTask, series, rowId, wrappedRowIndex, bucketStartTime, task);
			if(wrappedRowIndex > maxWrappedRowIndex) {
				maxWrappedRowIndex = wrappedRowIndex;
			}
			checkAgain = false;
		}					
	} //while
	return maxWrappedRowIndex;
	
}

//Following methods are used by Chronos internals for proper bucketisation and Storage maps
/**
 *  @param currentSeries
 *  @param dataMapRowIndex
	  * @returns
 */
function getLongRangeTaskIdArray(currentSeries, dataMapRowIndex) {
		 var matrixObject = currentSeries.longRangeDataMap[dataMapRowIndex];	
		 if(matrixObject != null && (undefined != matrixObject)) {
			 return(matrixObject.taskIdArray);
		 } else {
			 return null;
		 }
	 };
//common function  which can be called from any method 

function compareObjectsBasedOnStartTime (a,b) {
	if (a.start < b.start)
		return -1;
	if (a.start > b.start)
		return 1;
	return 0;
}

/**
 *  This function returns the item at the given wrappedRowIndex and the taskStartTime within the array of tasks 
 *  If  not found , returns null.
 *  @param time is the start time of the task to be checked
 *  @param normalTasksArrayInCurrentBucket  -sorted normal task array
	 *  @param longRangeDataTasksInCurrentRow  - sorted long range task array
 */
function findItemAt(rowId, series, wrappedRowIndex, taskStartTime, startDayMillis) {
	//first check in the wrappedRowIndexArray in both normal and long range		  
   //To handle the previous days entities ending in current day
	var oneDayMillis = 86400000; //24*3600*1000,
	var HYPHEN = "_";
    var normalMaximumDaySpan = series.gantt.normalMaximumDaySpan - 1;
	var prevdayMilliSeconds = startDayMillis - (normalMaximumDaySpan * oneDayMillis) ;  
	var finalArrayWithAlltasks = [], key;
	for (var olderDay = prevdayMilliSeconds; olderDay <= startDayMillis; ) {
		key = rowId + HYPHEN + wrappedRowIndex + HYPHEN + olderDay;
		var currentList = series.wrapRowNormalTaskListMap[key];
		if(currentList)  {
			finalArrayWithAlltasks = finalArrayWithAlltasks.concat(currentList) ;
		} 
		olderDay = olderDay + oneDayMillis ;
	}
	 var itemFound = null;
	 if(finalArrayWithAlltasks.length > 0){
		  itemFound = checkIfTaskPresentInArray(finalArrayWithAlltasks, series, wrappedRowIndex, taskStartTime);
	 }
		 if( itemFound != null) {
			 return itemFound;
		 } else {
		//look in long range map as well
		finalArrayWithAlltasks = series.wrapRowLongRangeTaskListMap[rowId + HYPHEN + wrappedRowIndex];
		 if(finalArrayWithAlltasks) {
			 itemFound = checkIfTaskPresentInArray(finalArrayWithAlltasks, series, wrappedRowIndex, taskStartTime);
			 if( itemFound != null) {
			 return itemFound;
		 }
		 }
	}  
	
}

/**
 * this function assigns the task to corresponding wrapList map
 */
function assignToWrapListMap(isLongRangeTask, series, rowId,wrappedRowIndex, bucketStartTime, task ) {
	var HYPHEN = "_";
	var listOfItems = [];
	if(isLongRangeTask) {
		if (series.wrapRowLongRangeTaskListMap[rowId + HYPHEN + wrappedRowIndex] ) {
			listOfItems = series.wrapRowLongRangeTaskListMap[rowId + HYPHEN + wrappedRowIndex];							
		} 
		listOfItems.push(task);
		series.wrapRowLongRangeTaskListMap[rowId + HYPHEN + wrappedRowIndex] = listOfItems;
	} else {
		if(series.wrapRowNormalTaskListMap[rowId + HYPHEN + wrappedRowIndex + HYPHEN + bucketStartTime] ) {
			listOfItems = series.wrapRowNormalTaskListMap[rowId + HYPHEN + wrappedRowIndex + HYPHEN + bucketStartTime];							
		}  
		listOfItems.push(task);
		series.wrapRowNormalTaskListMap[rowId + HYPHEN + wrappedRowIndex + HYPHEN + bucketStartTime] = listOfItems;
	} 
}
/**
 * check in this array if the wrapIndex and the task with this time exists already in the array
 */
function checkIfTaskPresentInArray(arrayToCheck, series, wrapIndexToCheck, time) {
	if(arrayToCheck == undefined) {
		return null;
	}
	var taskFound = null, eachTask;
	var wrapIndexInMap, chronosId;
	for( var i = 0, len = arrayToCheck.length; i< len; i++) {
		eachTask = arrayToCheck[i];
		 chronosId = eachTask.chronosId; 
		 wrapIndexInMap = series.taskIdWrapIndexMap[chronosId];
		 //if wrap Index is same in this task 
		 if(wrapIndexInMap != undefined && wrapIndexInMap == wrapIndexToCheck) { 
		// Changed for improving execution time -  overlap avoided for tasks ending and starting on same time
		if(eachTask && eachTask.start <= time && eachTask.wrappable != false && time < eachTask.end) {
				// time is between the start and  end of this task
				//console.log(" ***** FOUND******************** ", eachTask ); 
				taskFound = eachTask; 
				break; 
			}
		 }
	 }//for 
	 return taskFound;
}

/**
 * function to update  WrappedRows In wrapIndexDisplayMap - which will have key(actualyValue) as index 0,1,2,3 -- and value as the wrapIndex
 * corresponding to each wrap ROw. Note: displayedRowIds will have same key(0,0,0) for its wrap rows as keys(0,1,2)
 *  and also update the corresponding actual rowIds which will now have actualFirstWrapDisplayMap
 */

function updateWrapIndexDisplayMap (args) {
	var response = {};
	var oneDayMillis = 86400000; //24*3600*1000,
	var series = args.plot.series;
	var options= args.plot.options;
	var plot = args.plot;
	var axisx = series.xaxis;
	var viewPortMin = resetViewPortTime(axisx.min); //take only from VIEW AREA 
	var viewPortMax = resetViewPortTime(axisx.max);
	plot.viewBucket = { 
				min :  viewPortMin,
				max :  viewPortMax 
	};
	var dataMapRowIndex, dataMapColumnIndex , normalTaskIdMap ;					
	var noOfWrapRowsForThisRow;			
	wrapIndexDisplayMap = []; //reset this here for every calculation 
	wrapIndexChangeYValueMap = [];
	var rowIdDisplayWrapMap = [] ;
	var previousMinDisplayedYValue = Math.ceil(series.yaxis.min); //Cache this before clearing displayedRowIds
	var scrollDelta = 0; //Added for ISRM 156
	if(series.actualFirstWrapDisplayMap && series.actualFirstWrapDisplayMap[previousMinDisplayedYValue] != undefined) {
		scrollDelta = series.yaxis.min - series.actualFirstWrapDisplayMap[previousMinDisplayedYValue];
	}
	//console.log("ymin " + Math.ceil(series.yaxis.min));
	//console.log(" previousMinDisplayedYValue ", previousMinDisplayedYValue);
	//Now clear the map			 
	series.displayedRowIds = new Array();
	var yLoadedMin = plot.currentLoadedData.yValueMin  ;//take the entire Loaded data for Y so as to do wrap calculation
	var yLoadedMax =  plot.currentLoadedData.yValueMax  ;
	var rowHeaderIds = series.rowHeaderIds;
	var rowIndexMap = series.rowMap; 
	var columnIndexMap = series.columnMap;  
	var hiddenRows = plot.hiddenRows;
	var rowHeaderObject, rowId;
	for (var yValue = 0 , newYValue =  0, wrapChangeIndex = 0;  yValue <= series.actualFilterRowIds.length; yValue++) { //---entire rows
		//newYValue will be actually the displayedYvalue
		rowId = rowHeaderIds[yValue] ; //original set of rowHeaders
		rowHeaderObject = series.rowIdRowObjectMap[rowId];
		if(rowId == undefined) {
			continue;
		}
		dataMapRowIndex = rowIndexMap[rowId];
		noOfWrapRowsForThisRow = 1;//reset 
		for (var day = viewPortMin; day <= viewPortMax; ) {		  //view port area only --- time            		
			dataMapColumnIndex = columnIndexMap[day];					
			
			if(dataMapColumnIndex == undefined) {
				dataMapColumnIndex = getCurrentColumnIndex(day, plot);  //to create the column map when there is no data
				//console.log("Created column index :  for " , new Date(day) +" = " + dataMapColumnIndex);
			}
			//console.log("Day --------------- " ,  new Date(day) + " rowId--- "+ rowId + " dataMapColumnIndex " + dataMapColumnIndex + " dataMapRowIndex : ", dataMapRowIndex);
			if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {
				//console.log("START Calculating index for   rowId--- "+ rowId,  " dataMapColumnIndex ", dataMapColumnIndex);
				if(dataMapRowIndex != null && dataMapRowIndex != undefined) {
					normalTaskIdMap = getNormalTaskIdMap(series, dataMapRowIndex, dataMapColumnIndex );
					
					//console.log("  rowId--- " , rowId + " normalTaskIdMap " , normalTaskIdMap);
					if(normalTaskIdMap != undefined && normalTaskIdMap.bucketWiseRowIndex > noOfWrapRowsForThisRow) {
						//console.log("RowHeader Object ", rowHeaderObject );
						//Assuming only leaf Nodes will have wrap in case of tree
						if(series.rootTreeNode != undefined) {
							if(rowHeaderObject != undefined && rowHeaderObject.expanded  && rowHeaderObject.isLeafNode) { 
								noOfWrapRowsForThisRow = normalTaskIdMap.bucketWiseRowIndex;
							} else {
								noOfWrapRowsForThisRow = 1; // don't show expanded list
							}
						} else {
							if(rowHeaderObject != undefined && rowHeaderObject.expanded) {
								noOfWrapRowsForThisRow = normalTaskIdMap.bucketWiseRowIndex;
							} else {
								noOfWrapRowsForThisRow = 1; // don't show expanded list
							}
						}
						//console.log("Assigning noOfWrapRowsForThisRow " + noOfWrapRowsForThisRow + " rowId--- "+ rowId +
						// " rowHeaderObject.expanded " , rowHeaderObject.expanded);								
					}
				}
			} //if
			day = day + oneDayMillis;
		} //for
		
		//The actual wrapRow at the point of time (visible area)
		rowIdDisplayWrapMap[rowId] = noOfWrapRowsForThisRow;
		
		//Get the max of each Row and allocate
		//if(jQuery.inArray(rowId, hiddenRows) == -1) {  // not hidden 
		if(hiddenRows.indexOf(rowId) == -1)  { // not hidden 
			if(yValue >= yLoadedMin && yValue <= yLoadedMax) { // ONLY UPDATE WRAP ROWS FOR loaded Y RANGE
				   //only update wrapWrows for the visible range of Y  ..else keep the wrapIndex as zero which means no wrap
					if(noOfWrapRowsForThisRow != undefined) {
						for(var wrapRow = 0 ; wrapRow < noOfWrapRowsForThisRow ; wrapRow++){		
							//console.log("newYValue : " , newYValue , " wrapRow  ", wrapRow , " for rowId ", rowId);
							wrapIndexDisplayMap[newYValue] = wrapRow;  // the key is the actual displayed value 0,1,2,....in order
							
							if(wrapRow == 0) {									 
								wrapIndexChangeYValueMap[newYValue] = wrapChangeIndex++ ;  // the key is the actual displayed value 0,1,2,....in order
							}
							series.displayedRowIds.push(yValue);
							if( wrapRow < noOfWrapRowsForThisRow) {
								newYValue = newYValue + 1;
							}
						}//for
					}
			} else if(yValue != undefined) { // ISRM: 5426 unique  and don't add undefined also
				series.displayedRowIds.push(yValue);
				newYValue++;
		}
			
			
			
		}
	} //for
	//console.log("END wrapIndexDisplayMap = ", wrapIndexDisplayMap , " \ n actualFilterRowIds : ", series.actualFilterRowIds);
	//console.log("IN WRAP   displayedRowIds: ", series.displayedRowIds);			 
	series.actualFirstWrapDisplayMap = [];
	series.actualyValueFromDisplayedYValue = [];
	var displayedYValue, actualYValue;
	
	series.displayedRowIds.forEach( function(actualyValueExcludingHidden, displayedYValue) {
		//console.log("plot.retrieveActualRowId(displayedYValue) "+ plot.retrieveActualRowId(displayedYValue));
		actualYValue = series.rowYvalueMap[retrieveActualRowId(series, displayedYValue)];// This actual yValue is including hidden				
		//This will keep  key as actualYValue and value as the first displayedYValue of the Row (wrapIndex = 0)
		if(series.actualFirstWrapDisplayMap[actualYValue]  == undefined) { 
			series.actualFirstWrapDisplayMap[actualYValue] = displayedYValue;
			//console.log("actualFirstWrapDisplayMap : Adding key:  ", actualYValue , " Value  ", displayedYValue);
		}
	});
 			
	//Now change the yaxis  max accordingly				
	var newYScrollRangeMax = series.displayedRowIds.length -1; 	// new total rows				
	var viewRange = series.yaxis.max - series.yaxis.min;
	if(newYScrollRangeMax < viewRange - 1) {
		//then no change the yScrollRangeMax : this is the case when rows displayed are less that the current displayed rows.
		newYScrollRangeMax = viewRange - 1; //Note : newYScrollRangeMax is one extra as it is the total rows considering vertical scrollExtendunit
	}  
	var  yScrollRange = [0, newYScrollRangeMax];	 				
	setScrollRangeAccordingToData(null, yScrollRange, plot); // internally considered vertical scroll unit  so passing 0 here
    
	//Now set the view areas to the begining of the view area in case of rows    
 	var newScrollRange = options.yaxis.scrollRange;        	
 	response.newScrollRange = newScrollRange;
 	response.previousMinDisplayedYValue = previousMinDisplayedYValue;
 	response.scrollDelta = scrollDelta;
 	response.viewRange = viewRange;
 	response.axes = plot.axes;
 	response.options = {} 
 	response.options.yaxis = options.yaxis;
 	response.columnMap = series.columnMap;
 	response.actualFirstWrapDisplayMap = series.actualFirstWrapDisplayMap;
 	response.actualyValueFromDisplayedYValue = series.actualyValueFromDisplayedYValue;
 	response.displayedRowIds = series.displayedRowIds
 	response.wrapIndexDisplayMap = wrapIndexDisplayMap;
 	response.rowIdDisplayWrapMap = rowIdDisplayWrapMap;
 	response.wrapIndexChangeYValueMap = wrapIndexChangeYValueMap;
 	return response;
}

function retrieveActualRowId (series, displayedyValue) {
	var actualRowYValue = series.displayedRowIds[displayedyValue];
	//get the actual rowId from actualFilterRowIds
	return(series.actualFilterRowIds[actualRowYValue]); //returns the rowId
};

function setScrollRangeAccordingToData(xscrollRange, yScrollRange, plot) { 
	var options = plot.options;
    var	verticalScrollUnit = options.yaxis.verticalScrollExtendunit;
    if ( yScrollRange != null && verticalScrollUnit > 0) {   
    	options.yaxis.newScrollRange=[];
    	options.yaxis.newScrollRange.scrollMin = yScrollRange[0] - verticalScrollUnit;
    	options.yaxis.newScrollRange.scrollMax = yScrollRange[1] + verticalScrollUnit; 	   	 	
   	 	options.yaxis.scrollRange = [options.yaxis.newScrollRange.scrollMin, options.yaxis.newScrollRange.scrollMax] ;
        //Also adjust the initial min & max according to the scrollrange
		if(options.yaxis.min > -0.5) {
			options.yaxis.min = options.yaxis.min - verticalScrollUnit;
		}
    } else if(yScrollRange != null) {            	
    	options.yaxis.scrollRange = yScrollRange ;
    }            
    if(xscrollRange != null) {            	
    	options.xaxis.scrollRange = xscrollRange ;
    }
    //Update the axis options which is used in navigate (zooming or scrolling) as well as in setupRows for canvas height.
    
    for(const key in plot.axes) {
    	var axis = plot.axes[key];
    	if(axis.direction == 'x') {
    		axis.options.scrollRange = options.xaxis.scrollRange;        
    	} else if(axis.direction == 'y') { 
    		axis.options.scrollRange = options.yaxis.scrollRange;
    	}
    }
}