/*
 * Copyright 2013-2014 IBS Software Services (P) Ltd. All Rights Reserved.
 * This software is the proprietary information of IBS Software Services (P) Ltd.
 * Use is subject to license terms.
 
@author A-2094, Maintained by TCC.
name : chronos-util
version: 6.10.6

Copy right IBS Software Pvt Ltd 2011-2012
 
plugin added for storing utility methods for testing, functionality for including connections and some common functions.
This js exposes the API methods that can be used for testing the items in chronos canvas.
Usage :  Eg: plot1.getTasksAtCoordinates(768,244);

//Method exposed to get all items in the current view area
plot.getAllItemsInViewArea=getAllItemsInViewArea;
Method exposed to get next and previous item of a  particular time in a row
	  plot.findPreviousObject = findPreviousObject; 
	  plot.findNextObject = findNextObject;
//Other public functions  
plot.getAllItemObjectsInARow
plot.getAllTasksAtPixel
plot.getAllTasksAtCoordinates
plot.getTasksInRange
plot.getTasksAtPosition
plot.getTasksAtCoordinates
This will add this tick to highlighted list -  plot.highlightATick=highlightATick;	
This will remove the tick from the highlighted list of days and redraw -   plot.removeHighlightForATick= removeHighlightForATick;
This will clear all highlights added for days in the plot - plot.clearAllTickHighlights = clearAllTickHighlights;	 
This will return a 1D array of  all the highlighted days - plot.getAllTickHighlights = getAllTickHighlights;
plot.getAllTasksOnlyInsideTimeAndRowRange  = function (startTime, endTime, startRowId, endRowId)
plot.getAllTasksInTimeAndRowRange  = function (startTime, endTime, startRowId, endRowId,includePassingThroughTask)		        
*/

(function ($) {
function init(plot) {
	////////////////ALL UTILITY METHODS FOR SIMULATION TESTING ////////////////////////
	plot.MAJOR_TICK = "MAJOR_TICK";
	plot.MINOR_TICK = "MINOR_TICK";
	plot.NORMAL_TICK = "NORMAL_TICK";
	
	/**
	 * When a canvas coordinates is given , it will return the single hovered item in that area
	 */
	plot.getTasksAtCoordinates  = function (canvasX, canavasY) { 
		var foundItem = this.findItemOnGantt(canvasX, canavasY);
		if(foundItem != null) {
		  return(foundItem.details);
		} 
	 };
	/**
	 * When a canvas coordinates is given , it will return all the (array of) items in that area
	 */ 
	 plot.getAllTasksAtPixel  = function (canvasX, canavasY) { 
		 return findAllItemsOnGantt(canvasX, canavasY);
	 };
		 
	 /**
      * this function will return all the items whose start and end is  in this range
      * will NOT consider items whose  
      * 1. endTime  outside this range   
      * 2. startTime outside this range  and 
      * 3. startTime and endTime outside this range
      */
     plot.getAllTasksOnlyInsideTimeAndRowRange  = function (startTime, endTime, startRowId, endRowId) {
         var series = plot.getSeries();        
         var startRowyValue= series.rowYvalueMap[startRowId];
         var endRowyValue= series.rowYvalueMap[endRowId];
         return plot.getTasksInRange( startRowyValue, startTime, endRowyValue , endTime, false);   
     };
	 
     /**
      * This function will return all the items whose
      * 1. startTime(in millis) is outside but ends  in this range
      * 2. endTime (millis) outside  but starting in this range        
      * 3. startTime and endTime outside this range (if includePassingThroughTask is set to true)
      * from  the following rowIds
      * startRowId - actual start rowId      
      * endRowId - actual endRowId
      */
     plot.getAllTasksInTimeAndRowRange  = function (startTime, endTime, startRowId, endRowId,
    		  includePassingThroughTask) {
    	  	var currentSeries = plot.getSeries();
        	var oneDayMillis = 24*60*60*1000;
        	var dataMapRowIndex, dataMapColumnIndex,  resetEndTime, resetStartTime;            
        	var rowIndexMap = currentSeries.rowMap;          
        	var columnIndexMap = currentSeries.columnMap;        	
        	var dataMap = currentSeries.dataMap;         	
        	resetStartTime = plot.resetViewPortTime(startTime);
        	resetEndTime = plot.resetViewPortTime(endTime);
        	var normalSpanMillis = (currentSeries.gantt.normalMaximumDaySpan * oneDayMillis); // to check the ending tasks also in the open view range
        	resetStartTime = resetStartTime - normalSpanMillis;  //fetching normalDaySpan buckets ahead
        	var allItemsInRange = [], startRow, endRow;
        	var actualYValueStart =  currentSeries.rowYvalueMap[startRowId];
        	var actualYValueEnd = currentSeries.rowYvalueMap[endRowId];
    		for (var row = actualYValueStart;  row <= actualYValueEnd; row++) { 
    			drawRowId = currentSeries.actualFilterRowIds[row]; 
    			if(drawRowId != undefined ) {
        			dataMapRowIndex = rowIndexMap[drawRowId];        			
        			if(dataMapRowIndex != null ||  dataMapRowIndex != undefined) {
		            	for (var dayMilliSeconds = resetStartTime; dayMilliSeconds <= resetEndTime;  ) {		            		
		            		dataMapColumnIndex = columnIndexMap[dayMilliSeconds];		            		
		            		if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {	
		            			var taskObjectIdArray = plot.getNormalTaskIdArray(currentSeries, dataMapRowIndex,dataMapColumnIndex );
		            			if(taskObjectIdArray != undefined) {
			            			for(var taskID = 0;  taskID < taskObjectIdArray.length ; taskID++) {
			            			   var taskObjectId = taskObjectIdArray[taskID];		            					
				            		   var eachTask  = dataMap[taskObjectId];		
			            			   if(eachTask && (eachTask.start >= startTime && eachTask.start <= endTime) ||
					            					 (eachTask.end <= endTime   && eachTask.end >= startTime) ) {
			            				   allItemsInRange.push(eachTask);						            					
			            				}
		            					if(eachTask && includePassingThroughTask && eachTask.start < startTime &&  eachTask.end > endTime)  {
		            						allItemsInRange.push(eachTask); 								  
			            				}				            			 
			            			}//for
		            			}
		            		}//if
		            		dayMilliSeconds = dayMilliSeconds + oneDayMillis;
		            	} //for		
		            	
	            	}//if	          			
        			//longRangeData drawing for this particular yLabels is handled here	        			 
        			if(currentSeries.longRangeDataMap != undefined) {
        				var longTaskObjectIdArray = plot.getLongRangeTaskIdArray(currentSeries, dataMapRowIndex );
        				if (longTaskObjectIdArray != undefined) {
	        				for(var ltaskID = 0;  ltaskID < longTaskObjectIdArray.length ; ltaskID++) {
            					var longTaskObjectId = longTaskObjectIdArray[ltaskID];
	            				var eachLongTask  = dataMap[longTaskObjectId];		
	            				  if(eachLongTask && (eachLongTask.start >= startTime && eachLongTask.start <= endTime) ||
		            					 (eachLongTask.end <= endTime   && eachLongTask.end >= startTime) ) {
	            					  allItemsInRange.push(eachLongTask); 	
	            				 } 
	            				 if(eachLongTask && includePassingThroughTask && eachLongTask.start < startTime &&  eachLongTask.end > endTime)  {
	            					 allItemsInRange.push(eachLongTask); 
	            				 }
            				}//for
        				}
        			}  
    			}
    			
    	} //outer for        
    	return allItemsInRange;
     };
     
     function addTaskToItemsInRange(row, task, allItemsInRange, exactCheck) {
    	 var yValue = plot.getyValueConsideringWrap(task);
    	 if(exactCheck == true) {
				if(row  == yValue ) { 
					allItemsInRange.push(task);
					//console.log("Adding LR task " ,eachTask);
				}
		} else {
			allItemsInRange.push(task); 
		}	
    	 return allItemsInRange;
     }
		 
	 /**
	 * When a time and row is given , it will return array of items(all the items) in that position
	 * @param time : time in milliseconds 
	 * @param row : the yValue of row..eg: 0, 1, 2...etc
	 */ 
	 plot.getAllTasksAtCoordinates  = function (time, row) { 
		 var series = plot.getSeries(), 
					axisx = series.xaxis, 
					axisy = series.yaxis,     
					canvasX = axisx.p2c(time), 
					canavasY = axisy.p2c(row);
		 return findAllItemsOnGantt(canvasX, canavasY);
	 };
	 
	 /**
	 * When a row and time is given , it will return the single hovered item in that area
	 */
	plot.getTasksAtPosition  = function (row, time) { 		
		var series = plot.getSeries(), 
			axisx = series.xaxis, 
			axisy = series.yaxis,     
			canvasX = axisx.p2c(time), 
			canavasY = axisy.p2c(row);
		
		var foundItem = this.findItemOnGantt(canvasX, canavasY);
		if(foundItem != null) {
		  return(foundItem.details);
		} 		
	 };
	 
	 plot.getRowHeaderObject = function(rowId) {
		var series = plot.getSeries();
		//, rowHeaderObject = null; 
		/*var yValue= series.rowYvalueMap[rowId]; //get the yValue from rowId (which is same as rowHeaderID)
		if(yValue != null) {
			rowHeaderObject = series.rowHeaderMap[yValue];
		}	*/			
		return series.rowIdRowObjectMap[rowId];
	 };
		 
	/**
     * This function returns the entire task object which is there in client when the id of the task is given
     * @param idOfTask
     * @returns
     */
    plot.getTaskById = function (idOfTask) {
	   	 var currentSeries = plot.getSeries();
	   	 var dataMap = currentSeries.dataMap;
	   	 if(dataMap[idOfTask] != null) {
	   		 return(dataMap[idOfTask]); //both long range data and normal data are there in dataMap    		 
	   	 } 
    };
	    
    plot.getAllItemObjectsInARow = function(rowId) {
	   	 var currentSeries = plot.getSeries();
	   	 var dataMap = currentSeries.dataMap;
    	var taskIds = plot.getAllItemsInARow(rowId);
    	var taskObjects = new Array();
    	for(var i = 0; i<taskIds.length ; i++) {
    		 if(dataMap[taskIds[i]] != null) {
    			 taskObjects.push(dataMap[taskIds[i]]);     		 
    	   	 } 
    	}	
    	return taskObjects;
    };
	    
	/**
	 * the tasks in the coordinate range
	 */
	 plot.getTasksInCoordinateRange = function (startTimeCoordinate, startRowCoordinate, endTimeCoordinate, endRowCoordinate) {     	
		var series = plot.getSeries(), 
			axisx = series.xaxis, 
			axisy = series.yaxis,     
			startTime = axisx.c2p(startTimeCoordinate), 
			startRow = axisy.c2p(startRowCoordinate),		
			endTime = axisx.c2p(endTimeCoordinate),
			endRow = axisy.c2p(endRowCoordinate);
     	
		return(plot.getTasksInRange(Math.ceil(startRow), startTime, Math.ceil(endRow), endTime));		 
	 };	 
	 
    /**
     * 
     * @param startRow - the displayed yValue(0,1,2....no:of total rows) of the map where range starts
     * @param startTime - the actual time in milliseconds where the rectangle starts
     * @param endRow -the displayed yValue of the map where range ends
     * @param endTime - the actual time in milliseconds where the rectangle ends
     * @param exactCheck  - boolean flag if true will return only the items from startYValue to endyValue
     * if null will return all items in that bucket. Used when wrap rows are given for exact data.
     * 
     * This function returns all the tasks that comes completely within  the range 
     * 
     */
    plot.getTasksInRange = function (startRowYvalue, startTime, endRowYvalue, endTime, exactCheck) {     	
    	var currentSeries = plot.getSeries();
    	var oneDayMillis = 24*60*60*1000;
    	var allItemsInRange = new  Array();
    	var dataMapRowIndex, dataMapColumnIndex,  resetEndTime, resetStartTime;//, displayedRowIds;   
    	var rowIndexMap = currentSeries.rowMap;          
    	var columnIndexMap = currentSeries.columnMap;        	
    	var data2DMatrix = currentSeries.data2DMatrix;
    	var dataMap = currentSeries.dataMap;         	
    	resetStartTime = this.resetViewPortTime(startTime);
    	resetEndTime = this.resetViewPortTime(endTime);
    	//console.log("Getting tasks in the range  --" + startRow + ",--- " +  plot.printDate(resetStartTime) + " , --- " +  endRow + " ,  ----" + plot.printDate(resetEndTime));
		for (var row = startRowYvalue;  row <= endRowYvalue; row++) {
			drawRowId = this.retrieveActualRowId(row);
			if(drawRowId != undefined) {
    			dataMapRowIndex = rowIndexMap[drawRowId];        			
    			//console.log("Taking  each Row with rowId - " + drawRowId); 
    			if(dataMapRowIndex != null ||  dataMapRowIndex != undefined) {
		            	for (var dayMilliSeconds = resetStartTime; dayMilliSeconds <= resetEndTime;  ) {		            		
		            		dataMapColumnIndex = columnIndexMap[dayMilliSeconds];		            		
		            		if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {	
		            			taskObjectIdArray = data2DMatrix[dataMapRowIndex][dataMapColumnIndex];
		            			if(taskObjectIdArray != undefined && taskObjectIdArray.taskIdArray != undefined) {
			            			for(var taskID = 0;  taskID < taskObjectIdArray.taskIdArray.length ; taskID++) {
			            				taskObjectId = taskObjectIdArray.taskIdArray[taskID];		            					
				            			eachTask  = dataMap[taskObjectId];		
				            			if(eachTask != null &&  eachTask !=  undefined) {
				            				if(eachTask.start >= startTime && eachTask.end <= endTime) {
				            					var yValue = plot.getyValueConsideringWrap(eachTask);
					            				if(exactCheck == true) {
					            					if(row  == yValue ) { 
					            						allItemsInRange.push(eachTask);
					            						//console.log("Adding task " ,eachTask);
					            					}
					            				} else {
					            					allItemsInRange.push(eachTask); 
					            				}
					            				
				            				}
			            					
				            			}//if
			            			}//for
		            			}
		            		}//if
		            		dayMilliSeconds = dayMilliSeconds + oneDayMillis;
		            	} //for		
	            	}//if	   
    			//longRangeData drawing for this particular yLabels is handled here	        			 
    			if(currentSeries.longRangeDataMap != undefined) {
    				taskObjectIdArray = currentSeries.longRangeDataMap[dataMapRowIndex];	     
    				if(taskObjectIdArray != undefined && taskObjectIdArray.taskIdArray != undefined) {
	        				for(var taskID = 0;  taskID < taskObjectIdArray.taskIdArray.length ; taskID++) {
        					taskObjectId = taskObjectIdArray.taskIdArray[taskID];	
        					  //console.log("ID retrieved ... " + taskObjectId);
	            				eachTask  = dataMap[taskObjectId];		
	            				if(eachTask.start >= startTime && eachTask.end <= endTime) { 
	            					var yValue = plot.getyValueConsideringWrap(eachTask);
		            				if(exactCheck == true) {
		            					 if(rowY == yValue ) { 
		            						allItemsInRange.push(eachTask);
		            						//console.log("Adding task " ,eachTask);
		            					 }
		            				} else {
		            					allItemsInRange.push(eachTask); 
		            				}        					 
	            				} 
        				}//for
    				}
    			}  
			} 			
		} //outer for          	
   
		return allItemsInRange;
   };//function getAllItemsInTheRange end
 /**
  * Function which returns the actual displayed yValue considering wrap Index as  well.
  */   
 plot.getyValueConsideringWrap= function(eachTask) {
   	var currentSeries = plot.getSeries();
	var rowYvalueMap = currentSeries.rowYvalueMap; // This map has actual yValue and not displayed yValue
	var rowId = eachTask.rowId;
	var yValue = eachTask.yValue; //displayed yValue
	if (plot.areWrapRowsEnabled() && currentSeries.actualFirstWrapDisplayMap){
		  var actualyValue = rowYvalueMap[rowId];	// this y value is the actualyValue
		  var displayedYValueOfRow = currentSeries.actualFirstWrapDisplayMap[actualyValue];
 		  var rowIdExpandedStatusMap = plot.getRowIdExpandedStatusMap();	 		
			if(rowIdExpandedStatusMap[rowId]) {  //if expanded row
     			 //Add the wrapIndex to get the displayed Row correctly if the row is expanded
     			 var wrapIndex = plot.getTaskIdWrapIndexMap()[eachTask.chronosId];
     			 yValue = displayedYValueOfRow + wrapIndex;
			} else {
				 yValue = displayedYValueOfRow;
			}
			eachTask.yValue = yValue;
	 } 	
	return yValue;
};

	plot.prepareDataMap = function (dataMap, dataMapAttributes){
		var customDataMap = [];
		for (var data in dataMap) {
	        var innerData = {};
			if(dataMap[data]){
				for( attr of dataMapAttributes ) {
					innerData[attr] = dataMap[data][attr];
				}
			}
			customDataMap[data] = innerData
		}
		return customDataMap
	}

   /**
    * //Method exposed to get all items in the current view area
    * This method will return all items with all the item details + top, bottom , right, left coordinates in a json format
    */
   plot.getAllItemsInViewArea = function() { 	  
   	var viewItems=[];   	
   	var series = plot.getSeries();
   	
   	var dataMapRowIndex, dataMapColumnIndex;   	
   	//displayedRowIds = series.displayedRowIds;
   	var rowIndexMap = series.rowMap;          
   	var columnIndexMap = series.columnMap;        	
   	var data2DMatrix = series.data2DMatrix;
   	var dataMap = series.dataMap; 
   	var axisx = series.xaxis;
   	var axisy = series.yaxis; 
   	var oneDayMillis = 24*3600*1000, 
   	normalMaximumDaySpan = series.gantt.normalMaximumDaySpan;        	
   	var viewPortMin = this.resetViewPortTime(axisx.min) - (normalMaximumDaySpan * oneDayMillis); 
   	var drawRowId, taskObjectId, eachTask, taskObjectIdArray;        
   	for (var row = Math.floor(axisy.min);  row <= Math.ceil(axisy.max); row++) {
   			//console.log("row  = " + row  + " ymin = " + axisy.min + " max " + axisy.max);            		            		
   			//drawRowId = displayedRowIds[row];   			
   			drawRowId = this.retrieveActualRowId(row);   					
   			if(drawRowId != undefined) {
       			dataMapRowIndex = rowIndexMap[drawRowId];
	            	//Drawing tasks only for this view port
       			if(dataMapRowIndex != null ||  dataMapRowIndex != undefined) {	
		            	for (var dayMilliSeconds = viewPortMin; dayMilliSeconds <= axisx.max; ) {		            		
		            		//console.log('Drawing CrewID ====' + drawCrewId + " And Day : " + dayMilliSeconds  + "(ms) == " + new Date(dayMilliSeconds).toString() );
		            		dataMapColumnIndex = columnIndexMap[dayMilliSeconds];		            		
		            			//console.log("dayMilliSeconds " + printDate(dayMilliSeconds)); 
		            			if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {	
		            				taskObjectIdArray = data2DMatrix[dataMapRowIndex][dataMapColumnIndex];
		            				if(taskObjectIdArray != undefined) {
			            				for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
			            					taskObjectId = taskObjectIdArray[taskID];	
			            					//console.log("ID retrieved ... " + taskObjectId);
				            				eachTask  = dataMap[taskObjectId];		
				            				if(eachTask != null &&  eachTask !=  undefined) {		  				            			 
							            		//drawGanttTask(eachTask.start, row, eachTask.end, axisx, axisy, ctx, eachTask, "NORMAL");
				            					addToViewItemsMap(eachTask, row, axisx, axisy, viewItems);
							            		 				            				 
						            		}//if
			            				}//for
		            				}
		            			}//if
		            			dayMilliSeconds = dayMilliSeconds + oneDayMillis;
		            		} //for			            		
	            	}//if	            	 
       			//longRangeData drawing for this particular yLabels is handled here	        			 
       			if(series.longRangeDataMap != undefined) {
       				taskObjectIdArray = series.longRangeDataMap[dataMapRowIndex];	     
       				if(taskObjectIdArray != undefined) {
	        				for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
           					taskObjectId = taskObjectIdArray[taskID];	
           					//console.log("ID retrieved ... " + taskObjectId);
	            				eachTask  = dataMap[taskObjectId];		
	            				if(eachTask != null &&  eachTask !=  undefined) {
	            					addToViewItemsMap(eachTask, row, axisx, axisy,  viewItems);				            				 
			            		}//if
           				}//for
       				}
       			} 
   			}
   			
   	} //outer for
   	
   	return viewItems;
   	
   }; //function   
   
   
//Find all items on gantt at a single position    
 function findAllItemsOnGantt(mouseX, mouseY) {
	 	var plotWidth =  plot.width();
	 	var plotHeight =  plot.height();
	   	if(mouseX < 0 || mouseY < 0 || mouseX > plotWidth || mouseY > plotHeight){
	   		return null;
	   	}
	   	var s = plot.getSeries();  
	   	if(s == null || s == undefined || s.xaxis == undefined || s.yaxis == undefined) {
	   		return;
	   	}
        var  axisx = s.xaxis, axisy = s.yaxis,          
        	mx = axisx.c2p(mouseX), my = axisy.c2p(mouseY), 
        	dataMapRowIndex, dataMapColumnIndex, 
        	taskIdArray = null; 			
        var rowIndexMap = s.rowMap, columnIndexMap = s.columnMap, currentRowId = null;
        var oneDayMillis = 24*3600*1000, normalMaximumDaySpan = s.gantt.normalMaximumDaySpan;
  	 	
       //Note: Check for tasks before   'normalMaximumDaySpan' days of axis.min    up to mx    
      	var viewPortMin = plot.resetViewPortTime(mx) - (normalMaximumDaySpan * oneDayMillis);        	
      	var itemYValue = Math.round(my); 

      	if (plot.areWrapRowsEnabled()) {
			var displayObj = wrappedRowDisplayMap[itemYValue];
			if (displayObj == undefined || displayObj == null) {
				currentRowId = plot.retrieveActualRowId(itemYValue);
			} else {
				currentRowId = plot.retrieveActualRowId(displayObj.yValue);
			}
		} else {
			currentRowId = plot.retrieveActualRowId(itemYValue); //normal case
		}
      	var allItems = new Array(), items = null, longItems;
	   	dataMapRowIndex = rowIndexMap[currentRowId]; //itemYValue should be teh exact rowId. only integers on map
	   	if(dataMapRowIndex != null ||  dataMapRowIndex != undefined) {
	   		 //1. Checking if item is a task in the 2D map
	       	 for(var time = viewPortMin ; time <= plot.resetViewPortTime(mx) ; ) { //check tasks in previous and next bucket also
	       		//Case 1 . Check if item is a normal task 
	       		dataMapColumnIndex = columnIndexMap[time];		          	        	
		     		if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {
	    				//console.log("dataMapColumnIndex  " + dataMapColumnIndex);   
		     			taskIdArray = plot.getNormalTaskIdArray(s, dataMapRowIndex, dataMapColumnIndex );
		     			if(taskIdArray != null &&  taskIdArray !=  undefined) {		     			
		     				items = checkIfItemsFound(taskIdArray, s, mx, my, itemYValue, currentRowId);
		     				allItems = allItems.concat(items);
		       				 
		     			}	       				
		     		}//if				     		
		     		// Case 2. Check if the item  is a task in longRangeData 
		     		taskIdArray = plot.getLongRangeTaskIdArray(s, dataMapRowIndex);
		     		if(taskIdArray != null &&  taskIdArray !=  undefined) {
			     		longItems = checkIfItemsFound(taskIdArray, s, mx, my, itemYValue, currentRowId);		     		
			     		allItems = allItems.concat(longItems);
			     		
		     		}
		     		time = time + oneDayMillis;
	       	 } //for all the previous and next days span	        	 
	   	}  //outer if dataMapRowIndex != null 
	   	
	   	allItems = unique(allItems);
    	return allItems;
        
   }       
 
	 var unique = function(originalArray) {
		 var newArray = [],
				 origLen = originalArray.length,
				 found,
				 x, y;
		  
		 for ( x = 0; x < origLen; x++ ) {
			 found = undefined;
			 for ( y = 0; y < newArray.length; y++ ) {
				 if ( originalArray[x].id === newArray[y].id ) {
					 found = true;
					 break;
				 }
			 }
			 if ( !found) {
				 newArray.push( originalArray[x] );
		 	 }
		 }
		 return newArray;
	 };
 
   
   function checkIfItemsFound(taskIdArray, s, mx, my , itemYValue , currentRowId) {	
   		var barBottom = plot.getBarBottom();
   		var barTop = plot.getBarTop();       
   	
	   	//ADDED FOR CONSIDERATION OF HOTSPOT
	   	var heightPosition = s.gantt.itemHeightPositioning;
	   	if(heightPosition != undefined) {
	   		//Note : percentage with respect to s.gantt.barHeight
	   		//startPercentage :25,  //from the rowHeight top 
	   		//endPercentage :75,  //from the rowHeight top
	   		barBottom = barBottom - (s.gantt.barHeight *(100-heightPosition.endPercentage)/100);
	   		barTop = barTop - (s.gantt.barHeight *heightPosition.startPercentage/100);
	   	}
	   	var item = {};
	/*   	var wrappedRowDisplayMap = null;
		var displayedRowHeaderObject = null;
		var rowHeaderObject = null, expandable = true;
		var wrapRowIndex = 0;
		var rowHeaderMap = s.rowHeaderMap;		*/
		var items = new Array();
      	for(var taskIdIndex = 0;  taskIdIndex < taskIdArray.length ; taskIdIndex++) {			            			 
      		 var eachTaskID  =  taskIdArray[taskIdIndex];
      		 var eachTask = s.dataMap[eachTaskID];			            			
      			 if(eachTask != null || eachTask != undefined) {	       				 
      			  if((mx <= eachTask.end  && mx >= eachTask.start) &&
          		    		(my <= (itemYValue + barBottom) && my >= (itemYValue - barTop))) {
          		    	 //console.log("Each Task Object from Map ---FOUND " + JSON.stringify(eachTask));
          		    	 item = eachTask;	
          		    	 item.rowId = currentRowId;	
          		    	 item.yValue = itemYValue;	           		  
				        // console.log ("ITEM FOUND..........." + JSON.stringify(item) );	
				         items.push(item);          		                		         
          		        } //if
      			 } //if
      	}//for
	        
      	//console.log("Returnign array .." +items );
      	return items;
   }
   
   function addToViewItemsMap(eachTask, y,  axisx, axisy, viewItems) {
	   var left = eachTask.startTime;
	   var right = eachTask.endTime;
	   var top = y + barBottom;
	   var bottom = y - barTop;
              
    // clip             
    if (right < axisx.min || left > axisx.max ||
        top-barBottom < axisy.min || bottom + barTop > axisy.max)
        return; 
    
    if (left < axisx.min) {            	 
        left = axisx.min;
       
    }

    if (right > axisx.max) {            	 
        right = axisx.max;
       
    }
    if (bottom < axisy.min) {
        bottom = axisy.min;                
    }
    
    if (top >= axisy.max) {            	            	
        top =  axisy.max;
        
    } 
    
    left = axisx.p2c(left);
    bottom = axisy.p2c(bottom);
    right = axisx.p2c(right);
    top = axisy.p2c(top);
    
    
    eachTask.left = left;
    eachTask.bottom = bottom;
    eachTask.right =right;
    eachTask.top = top;
    
    //Add this to array;
    viewItems.push(eachTask);         
    
   }//
   
   plot.printDate = function(dateInmillis) {
	   	var d = new Date();
	   	d.setTime(dateInmillis);
	   	var curr_date = d.getUTCDate();
	   	var curr_month = d.getUTCMonth() + 1; // months are zero based
	   	var curr_year = d.getUTCFullYear();
	   	return curr_date + "-" + curr_month + "-" + curr_year + " : " +  d.getUTCHours()+" hours , " + d.getUTCMinutes() + " mins, " 
	   			+ d.getUTCSeconds() + " seconds, " +  d.getUTCMilliseconds()+ " millsec";
   };     
   
   //Following methods are used by Chronos internals for proper bucketisation and Storage maps
   /**
    *  @param currentSeries
    *  @param dataMapRowIndex
	  * @returns
    */
   plot.getLongRangeTaskIdArray = function(currentSeries, dataMapRowIndex) {
	     currentSeries = plot.getSeries();
		 var matrixObject = currentSeries.longRangeDataMap[dataMapRowIndex];	
		 if(matrixObject != null && (undefined != matrixObject)) {
			 return(matrixObject.taskIdArray);
		 } else {
			 return null;
		 }
	 };
	 /**
	  * 
	  * @param currentSeries
	  * @param dataMapRowIndex
	  * @param newIdArray
	  */
   plot.setLongRangeTaskIdArray = function(currentSeries, dataMapRowIndex, newIdArray) {
		 var matrixObject ={};
		 matrixObject.taskIdArray = newIdArray;
		  currentSeries = plot.getSeries();
		 currentSeries.longRangeDataMap[dataMapRowIndex] = matrixObject;
	 };
	 
	 
	   /**
	    *  @param currentSeries
	    *  @param dataMapRowIndex
		*  @returns map containing taskIdArray and wrapRowCount
	    */
	   plot.getLongRangeTaskIdMap = function (dataMapRowIndex) {
		     var currentSeries = plot.getSeries();
			 var matrixObject = currentSeries.longRangeDataMap[dataMapRowIndex];	
			 if((matrixObject != null) && (undefined != matrixObject)) {
				 return matrixObject;
			 } else {
				 return null;
			 }
		 };
	 
		 /**
		  * 
		  * @param currentSeries
		  * @param dataMapRowIndex
		  * @param dataMapColumnIndex
		  * @param newIdArray
		  */
	   plot.setNormalTaskIdArray = function(currentSeries, dataMapRowIndex, dataMapColumnIndex, newIdArray) {
			 var matrixObject ={};
			 if(newIdArray != null || newIdArray != undefined){
				 matrixObject.taskIdArray = newIdArray;
			 }
			 //currentSeries = plot.getSeries();
			 currentSeries.data2DMatrix[dataMapRowIndex][dataMapColumnIndex] = matrixObject; //removed array should be added back
		 };
	 /**
	  * @param currentSeries
	  * @returns
	  */
	   plot.getNormalTaskIdArray = function(currentSeries , dataMapRowIndex, dataMapColumnIndex) {
		  // currentSeries = plot.getSeries();
			 var matrixObject = currentSeries.data2DMatrix[dataMapRowIndex][dataMapColumnIndex];			
			 if(matrixObject != null) {
				 if(matrixObject.taskIdArray != null) {
					 return(matrixObject.taskIdArray);
				 } else {
					 return null;
				 }
			 } else {
				 return null;
			 }
		 };
	 /**
 	  * @param currentSeries
	  * @returns map containing taskIdArray and wrapRowCount
	  */
   plot.getNormalTaskIdMap = function (dataMapRowIndex, dataMapColumnIndex) {
	     var currentSeries = plot.getSeries();
		 var matrixObject = currentSeries.data2DMatrix[dataMapRowIndex][dataMapColumnIndex];			
		 //if((matrixObject != null) && (undefined != matrixObject)) {
			// return matrixObject;
		 //}// else {
			 
			 //matrixObject = new Object();
			 //currentSeries.data2DMatrix[dataMapRowIndex][dataMapColumnIndex] = matrixObject;
			 return matrixObject;
		 //}
	};  
   var taskNodeListMap = null, connectionNodesMap = null; // global variables
   
   /**
    * The connections will be a map which have key as connection name , and value -as the list of nodes in that connection  
    * When ever user calls this incremental connections, ensure that plot.updateNodeConnections(null) is called before
    * to clear the static connection list.(eg : if user have called all connections for a flight and then used the option show all connections)
    */
   plot.updateOnDemandConnections = function(connections) {
	  // console.log("Data supplied -------------------------------------");
	    connectionNodesMap = plot.getConnectionNodesMap();
	    if(connectionNodesMap == null) {
	    	 connectionNodesMap = [];
	    	 plot.setConnectionNodesMap(connectionNodesMap);
	    }
	   // var taskHighestIndexMap = [];
		   var taskNodeListMap = [];
	   if(connections != null) {		 
		   var isPresentAlready, newNodeFragmentList, connectionId, eachConnection, existingFragmentArray;
		  
		   for(var i = 0; i < connections.length ; i++) { 
			   //Check each new connection with this ID in already existing map
			   eachConnection = connections[i];
			   nodesInThisConnection = eachConnection.nodes;				   
			   newNodeFragmentList = tokenizeNodesWithTerminal(nodesInThisConnection); //nodeList is an array holding connection fragments
			   connectionId = eachConnection.id;
			   isPresentAlready = checkConnectionIfInMap(connectionId);
			   
			   if(!isPresentAlready) {
				   //Add as a new connection 				 
				   //keep each nodeFragment List in a map with key as connectionId for this list
				   connectionNodesMap[connectionId] = {
						   data : eachConnection.data,
						   nodeFragments : newNodeFragmentList			   
				   };
			   } else {
				   existingFragmentArray = connectionNodesMap[connectionId].nodeFragments;
				   //traverse these nodes and and see if a terminal node is found and and nodes that are 
				   //continuation of these terminal nodes are present in the new list				   
				   for(var eachFragmentIndex = 0; eachFragmentIndex < existingFragmentArray.length ; eachFragmentIndex++) {
					   existingFragment = existingFragmentArray[eachFragmentIndex];
					   fragmentLength = 0;
					   var  eachNodeList = new Array();					   
					   //console.log("START Taking  in each fragment " + JSON.stringify(existingFragment));
					   for(var n = 0; n < newNodeFragmentList.length ; n++) {						   
						   eachNodeList = newNodeFragmentList[n];
						   
						  // console.log("EACH NODE LIST " + eachNodeList + " length " + eachNodeList.length);
						  firstNode =  eachNodeList[0]; //firstNode in the connection fragment
						  lastNode = eachNodeList[eachNodeList.length -1];
						   
						  //console.log("Taking first Node " );
						  //console.log(firstNode);
						  // console.log("Taking last Node ");
						  // console.log(lastNode);
						  firstNodeIndex = getIndexIfNodeInFragment(firstNode, existingFragment);
						  lastNodeIndex = getIndexIfNodeInFragment(lastNode, existingFragment);
						   
						  //console.log("firstNodeIndex " + firstNodeIndex + " lastNodeIndex " + lastNodeIndex);	
						   
						  // CASE 1 check if any nodes in this connection is present in the fragment so that we can insert.
						  if(firstNodeIndex > -1  && lastNodeIndex > -1) { 
							   // CASE 1: BOTH NODE PRESENT IN THE FRAGMENT
							  // console.log("Don't do anything .. Ignore this new node fragment as it is already there in the fragment as a part ");
							   continue;
						   } else if(firstNodeIndex > -1 && lastNodeIndex == -1) {
							   
							   //console.log("CASE 2 : firstNodeIndex > -1 && lastNodeIndex == -1  ");
							   
							   //CASE 2: LAST NODE NOT PRESENT  && FIRST NODE THERE IN SOME WHERE  IN FRAGEMNT LIST .. Push to the end
							   //now Find out how many nodes are repeating in the new nodelist which is already there in the fragment
							    
							   var noOfNodesToRemove =  existingFragment.length - firstNodeIndex; // ignore the rest of the nodes after a match is found only for first node
							   //Now modify the fragment accordingly if index found
							   //existingFragment.splice(firstNodeIndex, noOfNodesToRemove, eachNodeList); 
						       //removeNodes which are duplicate before merging
						       
							   //console.log("CASE 2 : Before removing ");
							   //console.log(existingFragment);
							   existingFragment.splice(firstNodeIndex, noOfNodesToRemove);
						       //console.log("CASE 2 : After removing ");
						       //console.log(existingFragment);
						       $.merge(existingFragment, eachNodeList ); //the new fragment should append to last and the original existingFragment wil be modified
						      // console.log("After merging ");
						       //console.log(existingFragment);						    	 
						    	  //Now update this change in the ind 
						    	 existingFragmentArray[eachFragmentIndex] = existingFragment;
						    	 
						   } else if( lastNodeIndex > -1 && firstNodeIndex == -1 )	{	   							   
							   //console.log("CASE 3 : lastNodeIndex > -1 && firstNodeIndex == -1  ");							   
							   //CASE 3 : LAST NODE present IN THE FRAGMENT and FIRST NODE NOT IN FRAGMENT LIST
							   	//Now Add  this eachNodeList to existingFragmentList of this connection 
							    existingFragmentArray.push(eachNodeList);							    
							   	/*now Find out how many nodes are repeating in the new nodelist which is already there in the existingFragment. 
							    So check with the first node in existingFragment with each node till first Node in this nodeList*/
							    var returnObject  = isFullListDuplicateFound(existingFragment, eachNodeList, lastNodeIndex);
							    if (returnObject.duplicate) {
							    	//remove the duplicate nodeList added just now. This nodelist is already there in the fragment
							    	existingFragmentArray.pop();
							    } else  {
							    	//Otherwise merge at the begining of fragment
							    	 removeNodesCount  =  returnObject.noOfNodesRepeated;
							    	 //removeNodes which are duplicate before merging
							    	 existingFragment.splice(0, removeNodesCount);
							    	 var changedFragment = $.merge($.merge( [], eachNodeList ), existingFragment ); //Merges two arrays, but uses a copy, so the original isn't altered.
							    	 //Now update theis change in the ind 
							    	 existingFragmentArray[eachFragmentIndex] = changedFragment;
							    	 existingFragment = changedFragment;
							    	 //console.log("existing fragment changed " + existingFragment);							    	 
							    	// now remove the duplicate nodeList added just now.
								    existingFragmentArray.pop();
							    }
						   }												  								   
					  } //for looking each nodes in each fragment	in the nodelist				   
				   } //for existingFragmentArray.length 
				   connectionNodesMap[connectionId] = {
						   data : eachConnection.data,
						   nodeFragments : existingFragmentArray	//THis could be chnaged and hence updated		   
				   };				 
			   } //else  			   
		   } //for each connections till connections.length		   
	   	   plot.setConnectionNodesMap(connectionNodesMap);
	   	 
	   	  var fullConnections = plot.getConnections(), //add to the existing connections
	   			connectionFragmentObject, connectionFragmentArray;
			if(fullConnections.length == 0) {
			  for(var connectionId in connectionNodesMap) {				   
				   connectionFragmentObject =  connectionNodesMap[connectionId];
				   connectionFragmentArray = connectionFragmentObject.nodeFragments;
				
				   for(var eachFragmentIndex = 0 ; eachFragmentIndex< connectionFragmentArray.length ; eachFragmentIndex++) {
					   var nodeList = connectionFragmentArray[eachFragmentIndex];
					   //console.log(nodeList);
					   if(nodeList != undefined) {
						   var connectionFragments  =  {
									id : connectionId,
									nodes: nodeList,
									data : connectionFragmentObject.data
							 };
							fullConnections.push(connectionFragments); //TODO Check for merge iteratively
						   //NOW parse these connections
						   parseConnection(connectionFragments);  
					  }
					
				   }//for
			   }
		   } else {
				for ( var i = 0; i < connections.length; i++) {
					//adding to existing connections 
					fullConnections.push(connections[i]);
				}
		   }
		   plot.setConnections(fullConnections);
		   //Check if connections need to be discarded and remove them from the map if it is out of view area (on demand loading)
		   //console.log("Discarding BEFORE  -------------------------------------");
		   //console.log(connections);
		   discardConnections(fullConnections);	  
		   //console.log("Discarding AFTER  -------------------------------------");
		   //console.log(connections);
	      } //if connections != null
	   
	      //Now order the nodeList according to priority and set the index appropriately
		  for(taskIdKey in taskNodeListMap) {
		    	nodeList = taskNodeListMap[taskIdKey];
		     	nodeList.sort(function(a, b) {
		    	if(b.priority == undefined || a.priority == undefined || b.priority == null || a.priority == null) {
		    				return 0;
		    			} else if(a.priority > b.priority) {
		            		return 1;
		            	} else if(a.priority < b.priority) {
		            		return -1;
		            	} else {
		            		return 0;
		            	}	            	 
		        }); 
		    	taskNodeListMap[taskIdKey] = nodeList;
		     	for(i = 0;i < nodeList.length; i++) { //Assign  index
		     		nodeList[i].index = i;
		     		createNodeYValueMap(nodeList[i]);
		     	}	     	
		   }	    
   };   
   
   
   /**
    * This will check if the nodelist is completely presnet in fragment 
    * If partially found, it will return those no:of nodes repeated.
    */
   function isFullListDuplicateFound(existingFragment, eachNodeList, lastNodeIndexInFragment) {
	   var noOfNodesRepeated = 0, currentNodeTaskId = "";
	   for(var i = eachNodeList.length-1; i > 0  ; i-- ) { //looking each node from last of list 
		   eachNodetaskId = eachNodeList[i].taskId;
		   if(lastNodeIndexInFragment > -1) { //case  when nodelist ends
			   currentNodeTaskId = existingFragment[lastNodeIndexInFragment].taskId;
		   }
		  // console.log("Checking  eachNodetaskId " +eachNodetaskId + " with currentNodeTaskId " + currentNodeTaskId);
		   if(eachNodetaskId == currentNodeTaskId) {
			   if(eachNodeList[i].isTerminal) {
				   eachNodeList[i].isTerminal = false;
			   }
			   lastNodeIndexInFragment--;
			   noOfNodesRepeated ++;
			   continue;		   
		   } else {
			   return {
				   duplicate : false ,
				   noOfNodesRepeated : noOfNodesRepeated
			   };
		   }
	   } //for
	   
	   return {
		   duplicate : true,
		   noOfNodesRepeated : noOfNodesRepeated
	   };
	   
   }
   
   /**
    * This method will find if this node is present in the fragment, if present it will return the index 
    * else it will return -1
    */
   function getIndexIfNodeInFragment(eachNode, currentFragment) {
	   var index = -1;	   
	   if(currentFragment == undefined) {
		   return index;
	   }
	   
	   eachNodetaskId = eachNode.taskId;
	   for(var i = 0; i < currentFragment.length ; i++ ) {
		   taskId = currentFragment[i].taskId;
		   if(eachNodetaskId == taskId) {
			   return i;			   
		   }		   
	   }	   
	   return index;
   } 
    
   
   function checkConnectionIfInMap(connectionId) {
	   if(connectionNodesMap != null) {		// is global	 
		   for(connectionIdKey in connectionNodesMap ) {
			   if(connectionIdKey == connectionId) {
				   return true;
			   }
		   }
	   }
	   return false;
   }
   
   function tokenizeNodesWithTerminal(nodes) {
	  var nodeFragmentList = new Array();
	   var fragment = new Array();
	   for(var i= 0; i< nodes.length ; i++ ) {
		   var eachNode = nodes[i];
		   if(eachNode != undefined) {
			   fragment.push(eachNode);	
			   if(eachNode.isTerminal == undefined) {
				   eachNode.isTerminal = false; // default case
			   }
			   if(eachNode.isTerminal && fragment!= undefined) {
				   nodeFragmentList.push(fragment);
				   fragment = new Array();
			   }
		   }
		   if( i == nodes.length-1 && fragment != undefined && fragment.length >0 ) {
			   //push the last fragemnet also
			   nodeFragmentList.push(fragment);
		   }
	   }
	   //push the last list also
	 /*  if(fragment.length > 0) {
		  
	   }*/
	   return nodeFragmentList;
   }
   function isNodeInLoadedRange(node) { //if task is seen in the loaded range or not
	   var taskId = node.taskId;
	   var series = plot.getSeries(), options= plot.getOptions();
	   var dataMap = series.dataMap; 
	   var eachTask  = dataMap[taskId];		   
	   
	   var rowId = null,
	   rowIdAttributeInTask = options.series.gantt.rowIdAttributeInTask,	   
	   rowIdProviderCallBackFunction = series.gantt.rowIdProviderCallBack;

	   if(eachTask != undefined) {
			if(rowIdAttributeInTask != null) {
				   rowId = eachTask[rowIdAttributeInTask];  
			} else if(rowIdProviderCallBackFunction != null){
				  rowId = plot.triggerCallBackProviderToGetRowId(eachTask, rowIdProviderCallBackFunction);
			}  		   
			var rowYvalueMap = series.rowYvalueMap,
			  		yValue = rowYvalueMap[rowId]; 
		   	//Check if task is completely in the view area
		 	if( yValue >= Math.floor(plot.currentLoadedData.yValueMin)  &&  yValue <= Math.ceil(plot.currentLoadedData.yValueMax) &&
		 			eachTask.start>= plot.currentLoadedData.fromDate || eachTask.end <= plot.currentLoadedData.toDate ) { 
	   			//console.log("Task in  loaded range " + taskId + " rowId  = " + rowId  +  " is in the view area ");
		 		return true;
		 	}
	   }
	  // console.log("Task NOT IN   loaded range " + taskId + " rowId  = " + rowId  +  " NOT IN VIEW ");
	   return false;
   }

/**
 * Discarding connections which are not in currently loaded range.
 * 
 */
function discardConnections(connections) {
	var connectionNodesMap = plot.getConnectionNodesMap();
	for( connectionId in connectionNodesMap) {
		 existingFragmentArray = connectionNodesMap[connectionId].nodeFragments;
		 //Take each fragment array  and see if those nodes
		 var removeConnectionList = new Array();
		 var previousNodeInView; 
		 
		 for(var eachFragmentIndex = 0; eachFragmentIndex < existingFragmentArray.length ; eachFragmentIndex++) {
			   eachConnection = existingFragmentArray[eachFragmentIndex];				  	    
			  // allNodesOutOfView = true ;
			   previousNodeInView = false,currentNodeInView =false ;
			   var newCopyOfConnection = $.merge([], eachConnection);
			   totalNodesInConnection = newCopyOfConnection.length;
			   var  allNodesOutOfView = true;
			   var allNodesChecked = false;
				 	// CASE : LEFT SIDE  Check from left side of fragment whteher nodes are in loaded area
					 for ( var i = 0; i < totalNodesInConnection; i++) {							  
						  if(i == totalNodesInConnection-1) { // fully traversed from left ..
							   allNodesChecked = true;
						   }
						   currentNode  = newCopyOfConnection[i];						    
						   if(isNodeInLoadedRange(currentNode)) {
							   allNodesOutOfView = false;	
							   currentNodeInView = true;
						   } else {
							   currentNodeInView = false;
						   }
						   //console.log("FROM LEFT  previousNodeInView =" + previousNodeInView + " currentNodeInView = " + currentNodeInView);
						   if(!previousNodeInView && !currentNodeInView) {
							   //if the node and previous node are not in view area remove current Node from connection
							   eachConnection.splice(eachFragmentIndex, 1);
							   //console.log("currentNode: " + currentNode.taskId + " not in view  So removing---------------");
						   }					   
						   if(currentNodeInView) { // break the checking loop from here as no more will be out of view  from this side 
							   break; // from left side there is no node to remove
						   }		 
						   previousNodeInView = currentNodeInView;	
						   
					    }//for all nodes from start		
					  
					// CASE : RIGHT SIDE  Check if right side nodesa re in view 						
					 if(!allNodesChecked  || !allNodesOutOfView ) {
						 previousNodeInView = false;
						 for ( var i = totalNodesInConnection-1; i >= 0 ; i--) {
							   currentNode  = newCopyOfConnection[i];								   
							   if(isNodeInLoadedRange(currentNode)) {									   
								   currentNodeInView = true;
							   }							   
							   //console.log("FROM RIGHT previousNodeInView =" + previousNodeInView + " currentNodeInView = " + currentNodeInView);
							   if(!previousNodeInView && !currentNodeInView) {
								   //if the node and previous node are not in view area remove current Node from connection
								   eachConnection.splice(eachFragmentIndex, 1);//TODO  test
								  // console.log("currentNode: " + currentNode.taskId + " not in view  So removing----------------");
							   }					   
							   if(currentNodeInView) { // except first case
								   break; // from left side there is no node to remove
							   }		 
							   previousNodeInView = currentNodeInView;					   
						    }//for all nodes from start	
					 } 
				    if(allNodesOutOfView) { // if all nodes are out of view do not add to the new list
				    	//Push only the connection which are completely out of view
					   //console.log("Pushing the connection fragment completely to removeList");
				       removeConnectionList[eachFragmentIndex] = eachConnection;				    	
				    }  				   
		 }//each Fragments in connection
		 //Modify the existing fragement Array by deleting fragments from removeConnectionList	
		 for(eachFragmentIndex in removeConnectionList) {
			// console.log("Before deleting  existingFragmentArray.length = " +  existingFragmentArray.length);
			 var originalLength = existingFragmentArray.length;
			 var originalArrayCopy = $.merge([], existingFragmentArray);
			 for(var eachFragmentIndex = 0; eachFragmentIndex < originalLength ; eachFragmentIndex++) {
				 if(originalArrayCopy[eachFragmentIndex] != null) {
					 //delete(existingFragmentArray[eachFragmentIndex]);
					 existingFragmentArray.splice(eachFragmentIndex, 1);
					 //console.log("deleting index " + eachFragmentIndex);
				 }
			 }
			 //console.log("After deleting  existingFragmentArray.length = " +  existingFragmentArray.length);
		 }
	}//iterating map
}
	/**
	 * Addign a new connection to an existing static connections list and drawing all together.
	 */
	plot.addNodeConnections = function(newConnections) {
		var existingConnections =  plot.getConnections();
		for ( var i = 0; i < newConnections.length; i++) {
			//adding to existing connections 
			existingConnections.push(newConnections[i]);
		}
		//Now call the updateConnections call with the new set of list
		plot.updateNodeConnections(existingConnections); 
	};
	
	/**
	* Removing a new connection to an existing static connections list and drawing with new list.
	*/
	plot.removeNodeConnections = function(id) {
		var existingConnections =  plot.getConnections();
		for ( var i = 0; i < existingConnections.length; i++) {
			//removinging from existing connections 
			if (existingConnections[i].id == id) {
					existingConnections.splice(i,1);
			}
		}
		//Now call the updateConnections call with the new set of list
		plot.updateNodeConnections(existingConnections); 
		/* applicable only for on demand connections
		var existingConnectionNodesMap =  plot.getConnectionNodesMap(); 
		for(connectionId in connectionNodesMap) {	
			//removinging from existing connections 
			if (connectionId == id) {
					delete existingConnectionNodesMap[connectionId];
			}
		}
		plot.setConnectionNodesMap(existingConnectionNodesMap);	*/	
	};

   /**
    * connections :  list of connections. 
    * 1. Case 1 :  All data fo connections with datamap.
    * 2. Case 2 :  User will supply data  not in datamap to draw that particular connection to that node
    *  eachNode = {												  eachNode = {
				taskId : "Schedule 213-41-2",							taskId : "Schedule 213-41-2",
				taskObjectData : {							OR 			shouldDisplayDetail : true/false,
	 				rowId: "Flight213",									priority  :1,2.....,
	 				start :"1407445200000",								data: <object> //any data the user need to get back in renderer
	 				end : "1407474000000"								}
			}	
		};	
		Here there will not be any discarding of connections.
		updateNodeConnections(null)  will clear the list.
		To add to existing connection use plot.addNodeConnections()
    */
   plot.updateNodeConnections = function(connections) {	  
	   //console.log("updateNodeConnections  " + connections + " connections.length "  +connections.length);  
	   if(connections == null) {
		 connections = new Array();
	   }
	   plot.setConnections(connections);
	   if(connections != null && connections.length >0) {
		   //taskHighestIndexMap = [];
		   taskNodeListMap = [];
		   for ( var i = 0; i < connections.length; i++) {
			   parseConnection(connections[i]);
		   }
		   //Now order the nodeList according to priority and set the index appropriately
		   for(taskIdKey in taskNodeListMap) {
		    	nodeList = taskNodeListMap[taskIdKey];
		    	 nodeList.sort(function(a, b) {
		    			if(b.priority == undefined || a.priority == undefined || b.priority == null || a.priority ==null) {
		    				return 0;
		    			} else if(a.priority > b.priority) {
		            		return 1;
		            	} else if(a.priority < b.priority){
		            		return -1;
		            	} else {
		            		return 0;
		            	}	            	 
		        }); 
		    	taskNodeListMap[taskIdKey] = nodeList;
		     	for(i=0;i<nodeList.length ; i++) { //Assign  index
		     		nodeList[i].index = i;
		     		createNodeYValueMap(nodeList[i]);
		     	}	     	
		   }
	   }	
	       
   };
   plot.findHoverNodeInConnection = function(canvasX, canvasY) {
	   	  var 	axisy = plot.getSeries().yaxis,
	   	   		axisx = plot.getSeries().xaxis,
	   	  		yValueHovered = Math.round(axisy.c2p(canvasY));      
	   	  
	   	  //get all the nodes in that entire row with yValue -- from s.gantt.barHeight/2 upto yValue + series.gantt.barHeight/2 
	   	  var nodeList = plot.yValueNodeDetailsMap[yValueHovered],  eachNode = null;	   	   
	   	  if(nodeList != null ) {
			for ( var i = 0; i < nodeList.length; i++) {
				eachNode = nodeList[i];			
				var startTimePiexel = axisx.p2c(eachNode.startTime);				
				var nodeEndTimePixel = startTimePiexel  + eachNode.widthInPixel;
				if(canvasX >= startTimePiexel && canvasX <= nodeEndTimePixel &&
						canvasY >= eachNode.startPixel && canvasY <= eachNode.endPixel ) {
					//console.log("Hovered in node "+ JSON.stringify(eachNode.node));
					return eachNode;
			   }			 
			}   		
		}
	};
   
   function createNodeYValueMap(currentNode) {
	   //	get the node data coordinates	 	   
	   //console.log("currentNode " + JSON.stringify(currentNode));
	   var  nodeDataCoordinates = getNodeDataCoordinates(currentNode);
	   if (nodeDataCoordinates == null) {
	    	return;
	   }	    
	   var topYValue = Math.round(nodeDataCoordinates.topYValue);
	   var bottomYValue = Math.round(nodeDataCoordinates.bottomYValue);
	   //console.log("topYValue " + topYValue + " bottomYValue " + bottomYValue);
	   var nodesInTheRow = null;
	   for(var yValueToPush = topYValue; yValueToPush <= bottomYValue ; yValueToPush++ ) {
	   		nodesInTheRow = plot.yValueNodeDetailsMap[yValueToPush];
	   		if(nodesInTheRow == undefined || nodesInTheRow == null) {
	   			nodesInTheRow  =  new Array();
	   		}
	   	   nodesInTheRow.push(nodeDataCoordinates);	
	   	   plot.yValueNodeDetailsMap[yValueToPush] = nodesInTheRow;
	   }
   }
   
   function  getNodeDataCoordinates(currentNode) {
	   var series = plot.getSeries(),
		   dataMap = series.dataMap,
		  // axisx = series.xaxis,
		   axisy = series.yaxis,
		   options = plot.getOptions(),
		   rowHeight = options.series.gantt.minTickHeight;
	   	var rowYvalueMap = series.rowYvalueMap;
			   
	   connectionOption = options.series.gantt.connections;	  
	   var currentNodeTask  = dataMap[currentNode.taskId];
	   if(currentNodeTask == undefined) {
		   return null;
	   }
	   
	   var currentNodeRowId = null,
		  rowIdAttributeInTask = options.series.gantt.rowIdAttributeInTask,
		  rowIdProviderCallBackFunction = series.gantt.rowIdProviderCallBack;
		  if(rowIdAttributeInTask != null) {
				currentNodeRowId = currentNodeTask[rowIdAttributeInTask];  
		  } else if(rowIdProviderCallBackFunction != null){
				currentNodeRowId = plot.triggerCallBackProviderToGetRowId(currentNodeTask, rowIdProviderCallBackFunction);
		  }  
		  var currentNodeyValue = rowYvalueMap[currentNodeRowId];	
		  
	   var nodeHeightInPixel =  connectionOption.node.height; // in pixels	   
       var	topYValue = currentNodeyValue + series.gantt.barHeight/2+ (nodeHeightInPixel/rowHeight) *currentNode.index,
  			bottomYValue = currentNodeyValue + series.gantt.barHeight/2+ (nodeHeightInPixel/rowHeight) *(currentNode.index + 1);
       
       var  startPixel =axisy.p2c(currentNodeyValue + series.gantt.barHeight/2 )+ (nodeHeightInPixel * currentNode.index);
    	  endPixel = startPixel + nodeHeightInPixel;
      
       //first take width from task, if present else take from default options for that task
    	var  widthInPixel = calculateWidth(currentNode, connectionOption);  
       
       return  {
    	   topYValue : topYValue ,
    	   bottomYValue : bottomYValue,
    	   startTime : currentNodeTask.start,    	   
    	   widthInPixel : widthInPixel,
    	   heightInPixel: nodeHeightInPixel,
    	   startPixel : startPixel,
    	   endPixel : endPixel,
    	   node :currentNode
       };
   } 
   
   var taskDetailWidthMap = [];
   function calculateWidth(currentNode, connectionOption) {
	   var widthInPixels = null;
	     
	   if(currentNode.connectionNodeWidth != null) {
		   widthInPixels = currentNode.connectionNodeWidth ;
	   }  else {
		   widthInPixels = connectionOption.node.width;
	   }
	   
	   taskDetailWidthMap[currentNode.taskId] = widthInPixels;
	   return widthInPixels;
   }
   
   /** node {
	    * data : Object/String,
	    * taskId : uniquetaskId,
	    * shouldDisplayDetail : true/false
	    * 
	    * }
   */
   var previousNode = null, connectionOption = null; //global
	/**
	 * eachConnection :  holds a list of nodes
	 */
 
   function parseConnection(eachConnection) {
	   var options = plot.getOptions();
	   	connectionOption = options.series.gantt.connections;	  
	   
	   //console.log("Parse eachConnection " + JSON.stringify(eachConnection));
	   var currentNode = null,   
		   nodesInConnection = eachConnection.nodes;	  
	   if(nodesInConnection == null) {
		   return;
	   }
	   plot.yValueNodeDetailsMap = [];
	    for ( var i = 0; i < nodesInConnection.length; i++) {
		   currentNode  = nodesInConnection[i];		  
		   shouldDisplayDetail = currentNode.shouldDisplayDetail;
		   if(shouldDisplayDetail) {
			   var nodeList = taskNodeListMap[currentNode.taskId];
			   if(nodeList == null)  {
				   nodeList = new Array();
			   }  
			   nodeList.push(currentNode);
			   taskNodeListMap[currentNode.taskId] = nodeList; //global map which keeps track of no:of 
		   }
	    }//for	  
	   
  } 
   
   plot.drawConnections = function(connections) {	
	  // console.log("Drawing connections " + connections);
	   if(connections != null) {
		   for ( var i = 0; i < connections.length; i++) {
			   drawConnections(connections[i]);
			   continue;
		   }
	   }
   };
   
   function drawConnections(eachConnection) {
	   //console.log("New Connection drawing  ---------------");
	   var options = plot.getOptions();
	   	   connectionOption = options.series.gantt.connections;	  
	   
		
	   var shouldDisplayDetail, isCurrentNodeVisible = false, isPreviousNodeVisible = false; 
	   //console.log("Each Connection " + eachConnection);
	   var currentNode = null,  nextNode=null,  nodesInConnection = eachConnection.nodes;	   
	   for ( var i = 0; i < nodesInConnection.length; i++) {
		   currentNode  = nodesInConnection[i];
		   if(i < nodesInConnection.length) {
			   nextNode =  nodesInConnection[i+1];
		   }
		   shouldDisplayDetail = currentNode.shouldDisplayDetail;		
		   if(connectionOption.node.visibleRangeOnly) {
			   isCurrentNodeVisible = isNodeInVisibleRange(currentNode) ;
			   if(previousNode != null) {
				  isPreviousNodeVisible = isNodeInVisibleRange(previousNode);
			   }
		   }
		   //console.log("connectionOption.node.visibleRangeOnly " + connectionOption.node.visibleRangeOnly);
		   if( i == 0) {
			   if(connectionOption.node.visibleRangeOnly) {//FROM CONFIGURATION ..BOTH SHOULD BE IN VISIBLE RANGE
				   if (isCurrentNodeVisible &&  shouldDisplayDetail) {
					   drawNode(null, currentNode, nextNode, eachConnection); // trigger the node renderer as well
				   }
			   } else {
				   if (shouldDisplayDetail) {
					   drawNode(null, currentNode, nextNode, eachConnection); // trigger the node renderer as well
				   }
			   }
		   }
		   if(i > 0 ) {			   
			   if(connectionOption.node.visibleRangeOnly) {//FROM CONFIGURATION ..BOTH SHOULD BE IN VISIBLE RANGE
				   if (isCurrentNodeVisible && shouldDisplayDetail) {
					   drawNode(previousNode, currentNode, nextNode, eachConnection); // trigger the node renderer as well
				   }
		   		} else {
		   			if (shouldDisplayDetail) {
						   drawNode(previousNode, currentNode, nextNode, eachConnection); // trigger the node renderer as well
					 }
		   		}
			   if(connectionOption.node.visibleRangeOnly) { //FROM CONFIGURATION ..BOTH SHOULD BE IN VISIBLE RANGE
				   if (isPreviousNodeVisible && isCurrentNodeVisible) { //TODO THIS TO BE MADE A CONFIGURATION LATER
					   drawConnection(previousNode, currentNode, nextNode, eachConnection); // trigger the connection renderer as well
				   }
			   } else {
				   drawConnection(previousNode, currentNode, nextNode, eachConnection); // trigger the connection renderer as well				   
				 //  console.log("Draw connection if not visible..........");
			   }
		   }		   
		   previousNode = currentNode;
		}//for	    
   }
     
  /* node {
	     data : Object,
	    taskId : uniquetaskId,
	    shouldDisplayDetail : true/false
	    
	    }*/
   function isNodeInVisibleRange(node) { //if task is seen in the visible range or not
	   var taskId = node.taskId;
	   var series = plot.getSeries(), options= plot.getOptions();
	   var dataMap = series.dataMap; 
	   var eachTask  = dataMap[taskId];		   
	   
	   var rowId = null,
	   rowIdAttributeInTask = options.series.gantt.rowIdAttributeInTask,	   
	   rowIdProviderCallBackFunction = series.gantt.rowIdProviderCallBack;

	   if(eachTask != undefined) {
			if(rowIdAttributeInTask != null) {
				   rowId = eachTask[rowIdAttributeInTask];  
			} else if(rowIdProviderCallBackFunction != null){
				  rowId = plot.triggerCallBackProviderToGetRowId(eachTask, rowIdProviderCallBackFunction);
			}  		   
			var rowYvalueMap = series.rowYvalueMap,
			  		yValue = rowYvalueMap[rowId];		   
			var axisx = series.xaxis;
		   	var axisy = series.yaxis; 
		   	//Check if task is completely in the view area
		 	if( yValue >= Math.floor(axisy.min)  &&  yValue <= Math.ceil(axisy.max) &&
		 			eachTask.start>= axisx.min || eachTask.end <= axisx.max ) { // rowId comes in the view area and the task in the view time frame
	   			//console.log("Task in " + taskId + " rowId  = " + rowId  +  " is in the view area ");
		 		return true;
		 	}
	   }
	   return false;
   }
   
   /**`
    * 
    * @param previousNode can be null for the first Node
    * @param currentNode
    * @param nextNode
    * @param connection
    */
   function drawNode(previousNode, currentNode, nextNode, connection) {
	   var ctx = plot.getCanvasContext(); 
       // bottom = bottom + (height*currentNode.index);
	   var  nodeDetailBox = getNodeAreaBox(currentNode);
	   if(nodeDetailBox == undefined) {
		   return;
	   }
	  /* var options = plot.getOptions(),
	   		connectionOption = options.series.gantt.connections;	  
*/	  
	   ctx.strokeStyle = connectionOption.node.borderColor;
	   ctx.lineWidth=connectionOption.node.lineWidth;	
	   ctx.fillStyle = connectionOption.node.fillColor;
	   ctx.textBaseline ="top";
	   var f = connectionOption.node.font;
       ctx.font = f.style + " " + f.variant + " " + f.weight + " " + f.size + "px '" + f.family + "'";	 
       ctx.fillStyle = connectionOption.node.fillColor;// fill style of teh nodebox
       
	   var rendererFunction = connectionOption.node.nodeRenderer;
	   if( rendererFunction!= null) {		
		   var series = plot.getSeries() , axisy = series.yaxis, tickHeight =  axisy.p2c(1) - axisy.p2c(0);
		   var dataToRenderer = { 
    			  drawingContext : ctx,
    			  nodeDetailBox : nodeDetailBox,
    			  previousNode:previousNode,
    			  currentNode : currentNode,
    			  nextNode : nextNode,
    			  connection :connection,
    			  rowHeight : tickHeight
    	  };

	       //trigger renderer with this options
		   var args = new Array();
		   args.push(dataToRenderer);
		   eval(rendererFunction).apply(this, args);		  
		   
	   } else {
	      ctx.beginPath(); //madatory 
	      ctx.strokeStye = connectionOption.node.borderColor;
	      ctx.strokeRect(nodeDetailBox.left, nodeDetailBox.top, nodeDetailBox.width , nodeDetailBox.height); //make heigth configurable
	      ctx.fillRect(nodeDetailBox.left, nodeDetailBox.top, nodeDetailBox.width , nodeDetailBox.height);
	  	  
	  	  ctx.fillStyle = connectionOption.node.fontColor;
	  	  ctx.fillText("Index " + currentNode.index, nodeDetailBox.left, nodeDetailBox.top);
	      ctx.closePath();
	   }
   }
   
  function  getNodeAreaBox(currentNode) {
	   var series = plot.getSeries(),
		   dataMap = series.dataMap,
		   axisx = series.xaxis,
		   axisy = series.yaxis,
		   options = plot.getOptions(),
		   rowIdAttributeInTask = options.series.gantt.rowIdAttributeInTask,
		   rowIdProviderCallBackFunction = series.gantt.rowIdProviderCallBack,
		   connectionOption = options.series.gantt.connections;
	   
	    var currentNodeTask  = dataMap[currentNode.taskId];			   
	    if(currentNodeTask == undefined) {
	    	return;
	    }
	    
		if(rowIdAttributeInTask != null) {
			 currentNodeRowId = currentNodeTask[rowIdAttributeInTask];  
		} else if(rowIdProviderCallBackFunction != null){
			 currentNodeRowId = plot.triggerCallBackProviderToGetRowId(currentNodeTask, rowIdProviderCallBackFunction);
	    }  
 	   currentNodeyValue = series.rowYvalueMap[currentNodeRowId];
	   var  left = currentNodeTask.start,
	   		bottom = currentNodeyValue + plot.getBarBottom() ,
	   		right = currentNodeTask.end,
	   		top = currentNodeyValue - plot.getBarTop();
	   
	   left = axisx.p2c(left);
       bottom = axisy.p2c(bottom);
       
       right = axisx.p2c(right);
       top = axisy.p2c(top);
      
       var width =   calculateWidth(currentNode, connectionOption );
       var height = connectionOption.node.height; // in pixels
       
      if(!currentNode.shouldDisplayDetail) {
    	 //Draw the line from/to the task. So return coordinates of the task;    	  
    	   return  {
    		   data : currentNode.data + "-" + currentNode.taskId,
    		   top : top,
        	   left : left,
        	   right :left + width,
        	   width : right - left ,
        	   height: bottom-top
           };    	    
       } 
       //incrementing index and its height       
       var newTop = bottom + (height * currentNode.index);
       return  {
    	   data : currentNode.data,
    	   top : newTop,
    	   left : left,
    	   right :left + width,
    	   width : width,
    	   height: height
       };
   }
  
	  plot.triggerCallBackProviderToGetRowId =  function(eachObject, providerFunction ) {    	  
	      var args = new Array();
		   args.push(eachObject);
		   return eval(providerFunction).apply(this, args);			   
	 };
   
   /**
    * 
    * @param previousNode -- line  draw from previous end to 
    * @param currentNode -- line to current start
    * @param nextNode can be null
    * @param connection
    * @param currentNodeDisplayDetail -  shouldDisplayDetail of the current Node
    */
   function drawConnection(previousNode, currentNode, nextNode, connection) { 
	   var  series = plot.getSeries(),
	  		options = plot.getOptions(),
		   	axisx = series.xaxis,
		   	axisy = series.yaxis,		 
		   	rowYvalueMap = series.rowYvalueMap,
		   	dataMap = plot.getDataMap(),		 
		   	connectionOption = options.series.gantt.connections,		   	
		   	currentNodeTask  = dataMap[currentNode.taskId],
		  	previousNodeTask  = dataMap[previousNode.taskId];
			//CASE FOR ONDEMAND DATA FETCH
			   if(previousNode.isTerminal) {
				   //if this is true it is an end node and no connection line will be drawn from here
				   //alert('returning without drawing rest');
				   return;
			   }
	   
	   
	        //CASE DATA NOT IN MAP . USER WILL SUPPLY ALONG WITH NODE if the nodes not in visible range also need to be drawn 
		   if(currentNodeTask == undefined ) {
			   if( !connectionOption.node.visibleRangeOnly && currentNode.taskObjectData != undefined) {
				   //console.log("taking data for drawing currentNode ...currentNode  = ");
				   //console.log(currentNode );
				   currentNodeTask = {};
				   currentNodeTask.rowId = currentNode.taskObjectData.rowId;
				   currentNodeTask.start = currentNode.taskObjectData.start;
				   currentNodeTask.end = currentNode.taskObjectData.end;
			   } else {
				   //console.log("Don't draw...currentNode not in VisibleRange  and no data  supplied  =" + currentNode.taskObjectData);
				   //console.log(currentNode);
				   return;
			   }
		   }
		   if(previousNodeTask == undefined ) {
			   if(!connectionOption.node.visibleRangeOnly && previousNode.taskObjectData != undefined) { 
				   previousNodeTask ={};
				   //console.log("taking data for drawing previousNode ...");
				   previousNodeTask.rowId = previousNode.taskObjectData.rowId;
				   previousNodeTask.start =previousNode.taskObjectData.start;
				   previousNodeTask.end = previousNode.taskObjectData.end;
			   } else {
				   // console.log("Don't draw...previousNode not in VisibleRange and no data supplied  = " + previousNode.taskObjectData);
				   //console.log(previousNode);
				   return;
			   }
		   }		   
		   var currentNodeRowId = null, 
		   		previousNodeRowId = null,		
		   		rowIdAttributeInTask = options.series.gantt.rowIdAttributeInTask,
				rowIdProviderCallBackFunction = series.gantt.rowIdProviderCallBack;		   	
		   	
			if(rowIdAttributeInTask != null) {
				currentNodeRowId = currentNodeTask[rowIdAttributeInTask];  
			  	previousNodeRowId = previousNodeTask[rowIdAttributeInTask];
			} else if(rowIdProviderCallBackFunction != null){
				currentNodeRowId = plot.triggerCallBackProviderToGetRowId(currentNodeTask, rowIdProviderCallBackFunction);
				previousNodeRowId = plot.triggerCallBackProviderToGetRowId(previousNodeTask, rowIdProviderCallBackFunction);
		         // console.log("Got  ID " + eachRowHeaderKey);
			}  
		    var currentNodeyValue = rowYvalueMap[currentNodeRowId],		     	
		    	previousNodeyValue = rowYvalueMap[previousNodeRowId];
		    
		    if (plot.areWrapRowsEnabled()) {
		    	//console.log("currentNodeTask == " , currentNodeTask );		    	
		    	var currentRowHeaderObject = series.rowIdRowObjectMap[currentNodeRowId];
		    	if(currentRowHeaderObject != undefined) { // case of ondemand not in view
			    	if(currentRowHeaderObject.expanded && currentNodeTask.wrappedRowIndex != undefined) {
						currentNodeyValue = series.actualFirstWrapDisplayMap[currentNodeyValue] + currentNodeTask.wrappedRowIndex;
					} else {
						currentNodeyValue = series.actualFirstWrapDisplayMap[currentNodeyValue];
					}
		    	}
		    	var previousRowHeaderObject = series.rowIdRowObjectMap[previousNodeRowId];
		    	if(previousRowHeaderObject != undefined) { // case of ondemand not in view
			    	previousRowHeaderObject = series.rowIdRowObjectMap[previousNodeRowId];
					if(previousRowHeaderObject.expanded && previousNodeTask.wrappedRowIndex != undefined) {
						previousNodeyValue = series.actualFirstWrapDisplayMap[previousNodeyValue] + previousNodeTask.wrappedRowIndex;
					} else {
						previousNodeyValue = series.actualFirstWrapDisplayMap[previousNodeyValue];
					}
		    	}
			}
		    
		    
		   var	startX, endX, startY, endY;
		   var ctx = plot.getCanvasContext();
		   
		   if(previousNode.shouldDisplayDetail) {
			  var  previousNodeDetailBox = getNodeAreaBox(previousNode);
			  startX = previousNodeDetailBox.right;
			  startY = previousNodeDetailBox.top + previousNodeDetailBox.height/2;
		   } else {
			  startX = axisx.p2c(previousNodeTask.end);
			  startY = axisy.p2c(previousNodeyValue);
		   }
		   if(currentNode.shouldDisplayDetail) {
			   var currentNodeDetailBox = getNodeAreaBox(currentNode);		
			   endX = currentNodeDetailBox.left;
			   endY = currentNodeDetailBox.top + currentNodeDetailBox.height/2;
		   } else {
			   endX = axisx.p2c(currentNodeTask.start);
			   endY = axisy.p2c(currentNodeyValue);
		   }
		   
		   ctx.strokeStyle = connectionOption.line.lineColor;
		   ctx.lineWidth=connectionOption.line.lineWidth;			  
		   var rendererFunction = connectionOption.line.lineRenderer;
		   
			//Support for drawing connections in priorityContext
			var renderingContext = ctx;
		   var priorityContext = plot.getCanvasLayerMap() ? plot.getCanvasLayerMap()["chronos_priority"].context : null;		
		   if(options.series.gantt.priorityLayer && connectionOption.drawOnPriorityLayer) { // will draw on priority layer completely
			   renderingContext = priorityContext;
			} else if(currentNode.drawOnTop) { 
				// if drawOnTop (boolean-true) specifically mentioned in each node , it will be drawn on priority layer.
				renderingContext = priorityContext;
			}
		   
		   if( rendererFunction!= null) {	
			   var tickHeight =  axisy.p2c(1) - axisy.p2c(0);
			   var lineCordinate = {
					   startX  : startX,
					   startY :startY,
					   endX :endX,
					   endY : endY
			   };
			   var dataToRenderer = { 
         			  drawingContext : renderingContext,
         			  lineCordinate : lineCordinate,
         			  startNode:previousNode,
         			  endNode : currentNode,
         			  connection :connection,
         			  rowHeight:tickHeight
         	  };
			   var args = new Array();
			   args.push(dataToRenderer);
			   eval(rendererFunction).apply(this, args);		  
		   } else {
			   //draw Line
			   renderingContext.beginPath();
		       //console.log( "previousEndTimeToCanvasPos  " + previousEndTimeToCanvasPos + " previousNodeYvalueToCanvasPos " + previousNodeYvalueToCanvasPos );
			   renderingContext.moveTo(startX, startY);	        	        
			   renderingContext.lineTo(endX + 0.5, endY); //Note 0.5 to make the line straight - prevent antialiasing	         
			   renderingContext.closePath();
			   renderingContext.stroke();
		   }
		   
   };   
   
   plot.createHeaderImage = function() {
 	  //console.log("createHeaderImage ------");
 	  if(!plot.isSameCanvasBounds() ) {
 	  	var baseCanvas = plot.getCanvas();
     	var url = baseCanvas.toDataURL('image/jpg', 0.25);
     	plot.headerImage = new Image();
     	plot.headerImage.src = url;
     	plot.headerImage.onload = function() {
     	};
     	plot.headerImage.onerror= function() {};
       	 
 	  }  
   };
   
   plot.drawHeaderImage = function() {
		 //console.log("Drawing headerimage " + plot.headerImage);
		  if(plot.headerImage == null) {
			  return;
		  }
		  var baseContext = plot.getCanvasContext();	  
		   var plotOffset = plot.getPlotOffset();
		   scrollDirection =  plot.getScrollDirection();
		   series = plot.getSeries();
		   canvasHeight = plot.getPlaceholder().height();
		   canvasWidth = plot.getPlaceholder().width();
		   
		   var position = null;      	
	       if(scrollDirection == 'horizontal') {
				  //cache vertical headers as images on scrolling
	    		position = series.yaxis.position;    
	    		switch(position) {
		      		case "both" : {
		      			baseContext.drawImage(plot.headerImage,  0 , 0, plotOffset.left, canvasHeight, 0, 0, plotOffset.left, canvasHeight);
		      			baseContext.drawImage(plot.headerImage, plotOffset.left + plot.width(), 0, plotOffset.right, canvasHeight, 
	    						plotOffset.left + plot.width(), 0 , plotOffset.right, canvasHeight);
		      			 
		      			break;
		      		}
		      		case "left" : {
		      			baseContext.drawImage(plot.headerImage,  0 , 0, plotOffset.left, canvasHeight, 0, 0, plotOffset.left, canvasHeight);
		      			break;
		      		}
		      		case "right" : {
		      			baseContext.drawImage(plot.headerImage, plotOffset.left + plot.width(), 0, plotOffset.right, canvasHeight, 
		      						plotOffset.left + plot.width(), 0 , plotOffset.right, canvasHeight);
		      			break;
		      		}	
	    		}
			} else  if(scrollDirection == 'vertical') { 
				position = series.xaxis.position;     		
				switch(position) {
		      		case "both" : {
		      			baseContext.drawImage(plot.headerImage,  0 , 0, canvasWidth, plotOffset.top, 0, 0, canvasWidth, plotOffset.top);
		      			baseContext.drawImage(plot.headerImage, 0, plotOffset.top + plot.height(), canvasWidth, plotOffset.bottom,
		      					0, plotOffset.top + plot.height(),  canvasWidth, plotOffset.bottom);
		      			 
		      			break;
		      		}
		      		case "top" : {
		      			baseContext.drawImage(plot.headerImage,  0 , 0, canvasWidth, plotOffset.top, 0, 0, canvasWidth, plotOffset.top);
		      			break;
		      		}
		      		case "bottom" : {
		      			baseContext.drawImage(plot.headerImage, 0, plotOffset.top + plot.height(), canvasWidth, plotOffset.bottom,
		      					0, plotOffset.top + plot.height(),  canvasWidth, plotOffset.bottom);
		      			break;
		      		}	
				}
			}
		};
		
		
	//Utility for wrapping text in the available width and height
	plot.wrapText = function(ctx, text,maxWidth, lineHeight, totalHeight)  {
		 //console.log( "line to wrap "+ text + "maxWidth= "+ maxWidth + " lineHeight = " + lineHeight + " totalHeight = "+ totalHeight);
        var words = text.split(' ');
        var pixelForEachChar = ctx.measureText("W").width;  
        var wrapedLines = new Array();
        var availableLineCount = Math.floor(totalHeight/lineHeight);
        var wordIndex = 0;
        for(var i = 0; i < availableLineCount && wordIndex < words.length; i++) {
          var testLine="";
          while(true) {           
       	   var tempLine = testLine;
       	   if(testLine.length > 0) {
       		   tempLine = tempLine + " ";
       	   }
	           tempLine = tempLine + words[wordIndex];
	           textLength = ctx.measureText(tempLine).width;
	           if(textLength > maxWidth) {
	        	   if(testLine.length == 0) { //no space to write even one word.
	        		   var minCharsToWrite =  Math.floor(maxWidth/pixelForEachChar);
	                   var charsToWrite =  textLength;
	                   for(var j = minCharsToWrite + 1; j <= textLength; j++) {
	                         if(ctx.measureText(tempLine.substring(0, j)).width > maxWidth) {
	                               charsToWrite = j - 1;
	                               break;
	                         }
	                   }
	                   testLine = tempLine.substring(0, charsToWrite);
	                   words[wordIndex] = tempLine.substring(charsToWrite);//keeping rest of the word
	                   break;
	        	   }
	        	   break;
	           } else {
	        	   wordIndex++;
	        	   testLine = tempLine;
	        	   if(wordIndex >= words.length) {
	        		   break;
	        	   }
	           }
           }
          wrapedLines.push(testLine);
        }
        if(wordIndex < words.length ) {//there are words to write
       	 if(wrapedLines.length > 0) {
	        	 var lastLine = wrapedLines[wrapedLines.length-1];
	        	 var nextWord = words[wordIndex];
     		   var minCharsToWrite =  Math.floor(maxWidth/pixelForEachChar) - lastLine.length - 3;
     		   if(minCharsToWrite < 0 && lastLine.length > 0)  {
	               var charsToWrite =  nextWord.length;
	               for(var j = minCharsToWrite + 1; j <= nextWord.length; j++) {
	                     if(ctx.measureText(lastLine + " " + nextWord.substring(0, j) + "..").width > maxWidth) {
	                           charsToWrite = j - 1;
	                           break;
	                     }
	               }
	               lastLine = lastLine + " " + nextWord.substring(0, charsToWrite) + ".."; 
     		   } else {
 	        	 lastLine= lastLine + "..";
	        	}
	        	 wrapedLines[wrapedLines.length-1] = lastLine;
       	 }
        }
        //console.log( wrapedLines);
        return wrapedLines;
	};
		
	 plot.getCanvasPixelForTimeWidth = function(widthInmilliseconds) {
   	 	var axisx = plot.getSeries().xaxis;
   	    return (axisx.p2c(widthInmilliseconds) - axisx.p2c(0));
	 };    
	 
	 plot.getTimeInMillisForPixelWidth = function(widthInPx) {
	   	 	var axisx = plot.getSeries().xaxis;
	   	    return (axisx.c2p(widthInPx) -  axisx.p2c(0));
	 };
	 /**
	  * set X axis options .
	  * Eg :  plot1.setXAxisOptions("showLabel", false);		 		
	  */
	 plot.setXAxisOptions = function(key, value) {
		 	var xaxes = plot.getXAxes();
		 	var options = plot.getOptions();
		 	var series = plot.getSeries();
		 	var axis;
			 for (var i = 0; i < xaxes.length; ++i) {
	             axis = xaxes[i];
	             axis.options[key] = value;
	             options.xaxis[key] = value;
	             series.xaxis[key] = value;
			 }
	 };
	 /**
	  * set Y axis options .
	  * Eg :  plot1.setYAxisOptions("defaultMarkings",  { enable :  true });		 		
	  */
	 plot.setYAxisOptions = function(key, value) {
		 	var yaxes = plot.getYAxes();
		 	var options = plot.getOptions();
		 	var series = plot.getSeries();
		 	var axis;
			 for (var i = 0; i < yaxes.length; ++i) {
	             axis = yaxes[i];
	             axis.options[key] = value;
	             options.yaxis[key] = value;
	             series.yaxis[key] = value;
			 }
	 };
	 /**
	  * Considering wrap also . will return only the exact item in that displayed yValue(currentRowyValue)
	  */
	 plot.findExactNextObject = function(currentRowyValue, currentObjectEndTime) {
		 var checkExact  = {
			  checkYValue : currentRowyValue
		 };
		 var currentRowId = plot.retrieveActualRowId(currentRowyValue);
		 return plot.findNextObject(currentRowId, currentObjectEndTime, checkExact);
	 };
	 
	   /**
      * This will return  the next object to the currentObject in this rowId.
      * in the whole data loaded in client side(not only in the current view range) 
      * checkExact if given would return the exact item in the checkYValue (In case of wrap)
      * onDemandFetchRequired :  if true, will fire the data fetch, if false
      * will not trigger data fetch - used in case u need to find data not loaded 
      */
     plot.findNextObject = function(currentRowId, currentObjectEndTime, checkExact, onDemandFetchRequired) {
     	 var immediateNextObject = null, s = plot.getSeries(), dataMapRowIndex, dataMapColumnIndex, taskIdArray = null; 			
         var rowIndexMap = s.rowMap, 
         	columnIndexMap = s.columnMap;             	
         var oneDayMillis = 24*3600*1000;
         var options = plot.getOptions();
         var scrollRange = options.xaxis.scrollRange;
     	dataMapRowIndex = rowIndexMap[currentRowId]; //itemYValue should be the exact rowId. only integers on map
      
     	if(dataMapRowIndex != null ||  dataMapRowIndex != undefined) {
     		 //1. Checking if item is a task in the 2D map
	        	 for(var time = plot.resetViewPortTime(currentObjectEndTime) ; time <= plot.resetViewPortTime(scrollRange[1]) ; ) { //check tasks in previous and next bucket also 
	        		//console.log("Looking each ---" + new Date(time));
	        		//Case 1 . Check if item is a normal task 
	        		 var sameObject = false;
	        		dataMapColumnIndex = columnIndexMap[time];		          	        	
		     		if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {	
	     				//console.log("dataMapColumnIndex  " + dataMapColumnIndex);   
		     			taskIdArray = plot.getNormalTaskIdArray(s, dataMapRowIndex,dataMapColumnIndex );
		     			if(taskIdArray == null) {
		     				//load data fetch if needed -on demand case
		     				if(onDemandFetchRequired ){
		     				plot.callFetchDataIfRequired();
		     				}
		     				taskIdArray = plot.getNormalTaskIdArray(s, dataMapRowIndex,dataMapColumnIndex );
		     			}  
		     			//console.log(" taskIdArray at [", dataMapRowIndex , " " , dataMapColumnIndex , "] " , taskIdArray);
	       				if(taskIdArray  && taskIdArray.length > 0) {
	       					immediateNextObject = checkFirstImmediateNext(taskIdArray, currentObjectEndTime, immediateNextObject, checkExact);
	       					//console.log("immediateNextObject ", immediateNextObject);
	       					if(immediateNextObject != null && immediateNextObject.start == currentObjectEndTime){
	       					 sameObject = true;
	       					}
	       				} 
	       				if(immediateNextObject != null && !sameObject) {
	       					break;
	       				}  
		     		}//if				     		
		     		
		     		time = time + oneDayMillis;
		     		 
	        	 } //for all the previous and next days span	 	 
	        	 
	        	// Case 2. Check if any longrange data items before immediateNextObject in longRangeData 
      			taskIdArray = plot.getLongRangeTaskIdArray(s, dataMapRowIndex );
      			if(taskIdArray !=null && taskIdArray != undefined && taskIdArray.length >0) {
      				immediateNextObject = checkFirstImmediateNext(taskIdArray, currentObjectEndTime, immediateNextObject, checkExact);
      			}
	        	 
     	}  //outer if dataMapRowIndex != null 
     	//console.log("Returning immediateNextObject ... " ,immediateNextObject);
     	return immediateNextObject;
     };
     
     //First Case 
     function checkFirstImmediateNext(taskIdArray, currentObjectEndTime, currentNextObject, checkExact) {
     	var s = plot.getSeries(),  dataMap = s.dataMap;
     	var immediateNextObject = currentNextObject, eachObject;
     	//timeToCheck = currentObjectEndTime;
     	for ( var i = 0; i < taskIdArray.length; i++) {
	     		taskObjectId = taskIdArray[i];
     		    eachObject  = dataMap[taskObjectId];
     		   if(eachObject){
     			  if(eachObject.yValue == undefined) {
       		    	eachObject.yValue = plot.getyValueConsideringWrap(eachObject);// considering on item not draw also
       		    	}
       		    	if(checkExact != null && checkExact.checkYValue !=  eachObject.yValue ){
       		    		//console.log("Continuing .......", eachObject.yValue, eachObject);
       		    		continue;
       		    	}
       		    	if(immediateNextObject == null) { 	     			   			
       		    		if( eachObject.start >= currentObjectEndTime && plot.focusedItem && plot.focusedItem.chronosId != taskObjectId ) { 
       		    			immediateNextObject = eachObject;   
       		    			//console.log("Inside immediateNextObject == null eachObject ... " , eachObject, "immediateNextObject.start  " , 
  		     					//	immediateNextObject.start  , "currentObjectEndTime ", currentObjectEndTime);  
       		    		} 
       		    	} else  {
       		    		if( eachObject.start < immediateNextObject.start  && eachObject.start >= currentObjectEndTime) {
       		    			immediateNextObject = eachObject;     	     				
		         		 
       		    		}        			
       		    	}  
     		   }     		    
     	}
     	//console.log("Inside checkFirstImmediateNext ... " , immediateNextObject);
     	return immediateNextObject;
     }
     
     /**
	  * Considering wrap also . will retun only the exact item in that displayed yValue(currentRowyValue)
	  */
	 plot.findExactPreviousObject = function(currentRowyValue, currentObjectEndTime) {
		 var checkExact  = {
			  checkYValue : currentRowyValue
		 };
		 var currentRowId = plot.retrieveActualRowId(currentRowyValue);
		 return plot.findPreviousObject(currentRowId, currentObjectEndTime, checkExact);
	 };
	 
     
     /**
      * This will return  the immediate object  before the currentObject in this currentRowId.
      * in the whole data loaded in client side
      * checkExact if given would return the exact item from the checkYValue (In case of wrap)
      *  ie only from the same row with same yValue
      * onDemandFetchRequired :  if true, will fire the data fetch, if false
      *  will not trigger data fetch -used in case u need to find data not loaded
      */ 
     plot.findPreviousObject = function(currentRowId, currentObjectEndTime, checkExact, onDemandFetchRequired) {
     	 var immediatePreviousObject = null, s = plot.getSeries(), dataMapRowIndex, dataMapColumnIndex, taskIdArray = null; 			
          var rowIndexMap = s.rowMap, columnIndexMap = s.columnMap;             	
          var oneDayMillis = 24*3600*1000, normalMaximumDaySpan = s.gantt.normalMaximumDaySpan; 
     	 dataMapRowIndex = rowIndexMap[currentRowId]; //itemYValue should be teh exact rowId. only integers on map
     	 var options = plot.getOptions();
     	 var scrollRange =options.xaxis.scrollRange;
     	if(dataMapRowIndex) {
     		 //1. Checking if item is a task in the 2D map
     		 for(var time = plot.resetViewPortTime(currentObjectEndTime) ; time >= plot.resetViewPortTime(scrollRange[0] - (normalMaximumDaySpan*oneDayMillis)) ; ) { //check tasks in previous and next bucket also 
	        		//console.log("Looking each ---" + printDate(time));
	        		//Case 1 . Check if item is a normal task 
	        		dataMapColumnIndex = columnIndexMap[time];		          	        	
		     		if(dataMapColumnIndex) {	     				 
		     			taskIdArray = plot.getNormalTaskIdArray(s, dataMapRowIndex,dataMapColumnIndex );
		     			if(taskIdArray == null) {
		     				//load data fetch if needed -on demand case only if onDemandFetchRequired flag is true or undefined
		     				if(onDemandFetchRequired) {
		     				plot.callFetchDataIfRequired();
		     				}  
		     				taskIdArray = plot.getNormalTaskIdArray(s, dataMapRowIndex,dataMapColumnIndex );
		     			}  
	       				if(taskIdArray && taskIdArray.length > 0) {
	       					immediatePreviousObject = checkFirstPreviousObjectInThisArray(taskIdArray, currentObjectEndTime, immediatePreviousObject, checkExact);		
	       					if(immediatePreviousObject != null) {
	       						break;
	       					}
	       				}       				
		     		}//if		
		     		time = time - oneDayMillis;
	        	 } //for
	        	 // Case 2. Check if any longrange data items less than immediatePreviousObject in longRangeData 
	 	 			taskIdArray = plot.getLongRangeTaskIdArray(s, dataMapRowIndex );
 	     		if(taskIdArray && taskIdArray.length >0) {
 	     			immediatePreviousObject = checkFirstPreviousObjectInThisArray(taskIdArray, currentObjectEndTime, immediatePreviousObject, checkExact);       				 
 				}
	 	 		
     	}  //outer if dataMapRowIndex != null
     	 
     	return immediatePreviousObject;        	
     };
     
     /**
      * Sort the taskObjects according to the end time.
      */
     function sortWithAscendingEndTime(taskIdArray) {
	    	var s = plot.getSeries(), dataMap = s.dataMap;
    	 var taskObjectArray = [], taskObjectId;
	     	for ( var i = 0; i < taskIdArray.length; i++ ) {
	     		taskObjectId = taskIdArray[i];
	     		if(dataMap[taskObjectId]) {
	     			taskObjectArray.push(dataMap[taskObjectId]);
	     		}
    		}
    		taskObjectArray.sort(function(a, b) {
				var result;				
				var condition1 = a.end < b.end; 
				var condition2 = a.end > b.end; 
		    	 if(condition1 ) { //ascending 
		    		result =  1;
		        } else if(condition2) {
		        	result= -1;
		        } else {  
		        	result = 0 
		        } 
		    	 return result;
		     });   	 
    	  
    	 return taskObjectArray;
     }
     
     	/**
     	 * Will check for the immediate previous ending task (endTime) in the set of taskids passed
     	 * Sorting is performed on the taskObjects 
     	 */
	    function checkFirstPreviousObjectInThisArray(taskIdArray, currentObjectEndTime, currentImmediatePreviousObject,checkExact ) {	    	 
	     	var immediatePreviousObject = currentImmediatePreviousObject;
	     	var eachObject;
	     	var taskObjectArray = sortWithAscendingEndTime(taskIdArray);
	     	// checkign in sorted array
	     	for ( var i = 0; i < taskObjectArray.length; i++ ) {	     	 
	     		eachObject = taskObjectArray[i];
	     		taskObjectId = eachObject.chronosId;	     		
	     		// console.log("Takign EACH  ", taskObjectId , 'compatign with ' , new Date(currentObjectEndTime) );
	     		 
	     		 if(eachObject.yValue == undefined) {
	     		    	eachObject.yValue = plot.getyValueConsideringWrap(eachObject); // considering on item not draw also
	     		}
	     		if(eachObject && checkExact != null && checkExact.checkYValue !=  eachObject.yValue ){	     		   
		     		continue;
	     		}    		 
	     		if(plot.focusedItem && plot.focusedItem.chronosId != taskObjectId && eachObject.end <= currentObjectEndTime ) { 
	     			 if(immediatePreviousObject == null || 
	     					 (immediatePreviousObject  && eachObject.end >= immediatePreviousObject.end) ) {
	     			immediatePreviousObject = eachObject;
	     				 break;		     				 
	     			 }
	     		}
	     	} //for
	     	//console.log("immediatePreviousObject ... " ,immediatePreviousObject);
	     	return immediatePreviousObject; // will return the object with less start time than currentObject 
	     }
	    
	    plot.resetViewPortTime = function(minTimeInMillis) {
			minTimeInMillis = Math.floor(minTimeInMillis);
            var viewPortMinTime = new Date(minTimeInMillis);
            viewPortMinTime.setUTCHours(0);
        	viewPortMinTime.setUTCMinutes(0);
        	viewPortMinTime.setUTCSeconds(0);
        	viewPortMinTime.setUTCMilliseconds(0);     		
        	return viewPortMinTime.getTime();        	
        };
        
        
        /**
         * This will return all the objects within this range from the whole data loaded in client side
         * The items returned will be same as in rectangle select
         * Ensure that endRow > startRow and  @endTime > @startTime
         *  @startRow - yValue -displayed
         *  @startTime - start time in millis - 
         *  @endRow - yValuedisplayed
         *  @endTime - end Time in millis
         *   @param exactCheck  - boolean flag when true will return only the items from startYValue to endyValue. 
         *   						(This is Used when wrap rows are given for exact data) 
         * 					     -  when null/false will return all items in that bucket.
         *
         */
        plot.getAllTasksInArea = function (startRow, startTime, endRow, endTime, exactCheck) {     	
        	var currentSeries = plot.getSeries();
        	var oneDayMillis = 24*60*60*1000;
        	var allItemsInRange = new  Array();
        	var dataMapRowIndex, dataMapColumnIndex,  resetEndTime, resetStartTime;//, displayedRowIds;   
        	//rowYvalueMap = currentSeries.rowYvalueMap;
        	var rowIndexMap = currentSeries.rowMap;          
        	var columnIndexMap = currentSeries.columnMap;        	
        	var data2DMatrix = currentSeries.data2DMatrix;
        	var dataMap = currentSeries.dataMap;         	
        	resetStartTime = this.resetViewPortTime(startTime);
        	resetEndTime = this.resetViewPortTime(endTime);
        	
        	startRow = Math.round(startRow);
        	endRow = Math.round(endRow);
        	//console.log("Getting tasks in the range  --" + startRow + ",--- " +  plot.printDate(resetStartTime) + " , --- " +  endRow + " ,  ----" + plot.printDate(resetEndTime));
    		for (var row = startRow;  row <= endRow; row++) {
    			drawRowId = this.retrieveActualRowId(row);
    			if(drawRowId != undefined) {
        			dataMapRowIndex = rowIndexMap[drawRowId];        			
        			//console.log("Taking  each Row with rowId - " + drawRowId); 
        			if(dataMapRowIndex != null ||  dataMapRowIndex != undefined) {
    		            	for (var dayMilliSeconds = resetStartTime; dayMilliSeconds <= resetEndTime;  ) {		            		
    		            		dataMapColumnIndex = columnIndexMap[dayMilliSeconds];		            		
    		            		if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {	
    		            			taskObjectIdArray = data2DMatrix[dataMapRowIndex][dataMapColumnIndex];
    		            			if(taskObjectIdArray != undefined && taskObjectIdArray.taskIdArray != undefined) {
    			            			for(var taskID = 0;  taskID < taskObjectIdArray.taskIdArray.length ; taskID++) {
    			            				taskObjectId = taskObjectIdArray.taskIdArray[taskID];		            					
    				            			eachTask  = dataMap[taskObjectId];		
    				            			if(eachTask != null &&  eachTask !=  undefined) {
    				            				if((eachTask.start >= startTime && eachTask.start <= endTime) ||
						            					 (eachTask.end <= endTime   && eachTask.end >= startTime) ) {
    				            					var yValue = plot.getyValueConsideringWrap(eachTask);
    					            				if(exactCheck == true) {
    					            					if(row == yValue ) { 
    					            						allItemsInRange.push(eachTask);
    					            						//console.log("Adding task in exactCheck" ,eachTask.id);
    					            					}
    					            				} else {
    					            					allItemsInRange.push(eachTask); 
    					            				}
    					            				
    				            				}
    			            					
    				            			}//if
    			            			}//for
    		            			}
    		            		}//if
    		            		dayMilliSeconds = dayMilliSeconds + oneDayMillis;
    		            	} //for		
    	            	}//if	   
        			//longRangeData drawing for this particular yLabels is handled here	        			 
        			if(currentSeries.longRangeDataMap != undefined && dataMapRowIndex != null) {
        				taskObjectIdArray = currentSeries.longRangeDataMap[dataMapRowIndex];	     
        				if(taskObjectIdArray != undefined && taskObjectIdArray.taskIdArray != undefined) {
    	        				for(var taskID = 0;  taskID < taskObjectIdArray.taskIdArray.length ; taskID++) {
            					taskObjectId = taskObjectIdArray.taskIdArray[taskID];	
            					  //console.log("ID retrieved ... " + taskObjectId);
    	            				eachTask  = dataMap[taskObjectId];		
    	            				if((eachTask.start >= startTime && eachTask.start <= endTime) ||
			            					 (eachTask.end <= endTime   && eachTask.end >= startTime)) {
    	            					var yValue = plot.getyValueConsideringWrap(eachTask);
    		            				if(exactCheck == true) {
			            					if(row  == yValue ) { 
			            						allItemsInRange.push(eachTask);
			            						//console.log("Adding task in exactCheck" ,eachTask.id);
			            					}
			            				} else {
			            					allItemsInRange.push(eachTask); 	
			            				}
    	            				} 
            				}//for
        				}
        			}  
    			} 			
    		} //outer for          	
       
    		return allItemsInRange;
       };//function getAllItemsInTheRange end
  
       ///////////////////Functions for tick highlight implementation//////////////////          
         
       
       plot.addTickToHighlightList = function( hoveredArea, ctrlPressed, shiftPressed) {
			var tickDetails = calculateTickWidthbasedOnTickUnit(hoveredArea.currentTime, hoveredArea.currentPosition);
			var tickSelection = null;
			if (tickDetails == null) {
				return;
			}
			var index = tickDetails.index;
			var placeholder = plot.getPlaceholder();
			// clear highlights if ctrl is NOT pressed
			var unselected = false ;
			//console.log('Control pressed --------' + ctrlPressed + "shiftPressed --------" + shiftPressed);
			if (!ctrlPressed && !shiftPressed && plot.isTickHighlighted(tickDetails)) {
				plot.removeHighlightForATick(index);
				unselected = true;
				tickSelection = {
					columnHeaderItem : index,
					selected : false,
					tickDetails : tickDetails
				};
				placeholder.trigger("tickSelection", [ tickSelection ]);
			} else if (!ctrlPressed && !shiftPressed) {
				// console.log('clearAll Day highlights ');
				if (!plot.tickHighlights[index]) { // if some items are  selected and clicked on  the selected item
													// releasing ctrl or shift donot unhighlight
					plot.clearAllTickHighlights();
				}
			} else if ((ctrlPressed || shiftPressed)
					&& plot.isTickHighlighted(tickDetails)) {
				// console.log('remove--------------------');
				plot.removeHighlightForATick(index);
				unselected = true;
				tickSelection = {
					columnHeaderItem : index,
					selected : false,
					tickDetails :tickDetails
				};
				placeholder.trigger("tickSelection", [ tickSelection ]);
			} else if (shiftPressed) {
				unselected = plot.checkForDaysToHighlightOnShiftKeyDown(tickDetails); // already highlighted inside the  function
			}
			if (index != null && !unselected) {
				plot.highlightATick(tickDetails);
				tickSelection = {
					columnHeaderItem : index,
					selected : true,
					tickDetails :tickDetails
				};
				placeholder.trigger("tickSelection", [ tickSelection ]);
			}
       };
       /**
		 * 
		 */
       function calculateTickWidthbasedOnTickUnit(hoveredTime, currentPosition) {
    	
    	  var xaxis = plot.getAxes().xaxis;
    	  plotOffset = plot.getPlotOffset();
    	  var majorTicks = xaxis.showLabel ? xaxis.majorTicks : null;
    	  var normalTicks = xaxis.ticks; // minor tikcs in case of multi line time header
    	  /* console.log("currentPosition.y  = ", currentPosition.y  ,
    			   " heightOfMajorTickLabel ----"  , xaxis.heightOfMajorTickLabel, 
    			   " heightOfMinorTickLabel ----"  , xaxis.heightOfMinorTickLabel ,   
    			   "axis.endOfMajorTickLabel------------ " , xaxis.endOfMajorTickLabel , 
    			   "axis.endOfMinorTickLabel------------ " , xaxis.endOfMinorTickLabel , 
    			   "plotOffset.top ", plotOffset.top);  
    	   */
    	  var topHeaderHeight = xaxis.options.topHeader.enable ? xaxis.topHeaderHeight : 0;
    	  var timeHeaderStart = topHeaderHeight > 0 ? topHeaderHeight : 0; // if topHeader exists ...give that height    	
    	  var tickDetails = null;
    	  var options = plot.getOptions();
    	  if(majorTicks != null && (currentPosition.y > timeHeaderStart) && (currentPosition.y <= xaxis.endOfMajorTickLabel)) { //MAJOR TICK AREA HOVERED
    		  tickDetails =  getSelectedTick(majorTicks, hoveredTime, plot.MAJOR_TICK);	   		
    		  tickDetails.type = plot.MAJOR_TICK;
    		  //console.log("MAJOR_TICK-------- TICK");
    		  tickDetails.selectionStart = timeHeaderStart;
    		  tickDetails.selectionEnd =   xaxis.endOfMajorTickLabel; // stored when drawing horizontal line in core
    		  if(options.columnHeaderClick.selectionStyle.type == "COMPLETE_HEADER") {
    			  tickDetails.selectionEnd =   xaxis.endOfMinorTickLabel; 
    			  //special case of drawing tick selection in complete header irrespective of area of click
    		  }
    	  } else  if(majorTicks != null && (currentPosition.y > xaxis.endOfMajorTickLabel) && (currentPosition.y <= xaxis.endOfMinorTickLabel )) { //MINOR TICK AREA HOVERED - labelHeight is total height
    		  if(options.columnHeaderClick.selectionStyle.type == "COMPLETE_HEADER") { 
    			  //special case of drawing selection in complete header
        		  tickDetails =  getSelectedTick(majorTicks, hoveredTime, plot.MAJOR_TICK);	
        		  tickDetails.type = plot.MAJOR_TICK;
        		  //console.log("CONVERTED TO MAJOR_TICK-------- TICK AND UP TO END OF MINOR");
        		  tickDetails.selectionStart = timeHeaderStart;
        		  tickDetails.selectionEnd =   xaxis.endOfMinorTickLabel; // stored when drawing horizontal line in core
        	  } else {    		  
	    		  tickDetails = getSelectedTick(normalTicks, hoveredTime, plot.MINOR_TICK);	
	    		  tickDetails.type = plot.MINOR_TICK;
	    		  //console.log("MINOR----------- TICK");
	    		  tickDetails.selectionStart = xaxis.endOfMajorTickLabel;
	    		  tickDetails.selectionEnd =   xaxis.endOfMinorTickLabel; // stored when drawing horizontal line in core
	    		  //Special case when where ever the user clicks, the major tick should be highlighted.
        	 }
    	  } if (majorTicks == null && currentPosition.y > timeHeaderStart && currentPosition.y <=  plotOffset.top ) {
    		  //console.log("NO MULTI LINE BUT ON COLUMN SUMMARY OR NORMAL TICK");
			  //no multi line time header but normal ticks or on columnSummary
    		  tickDetails = getSelectedTick(normalTicks, hoveredTime, plot.NORMAL_TICK);
    		  tickDetails.type = plot.NORMAL_TICK;	
    		  tickDetails.selectionStart = timeHeaderStart;
    		//the columnSummary highlight will be drawn according to the selectionAllowed configuration
    		  if(options.xaxis.columnSummary.enable) {
      			//the columnSummary highlight will be drawn according to the selectionAllowed configuration
      			  if(options.xaxis.columnSummary.selectionAllowed ) {
      				  tickDetails.selectionEnd =   plotOffset.top; // stored when drawing horizontal line in core
      			  } else {
      				  tickDetails.selectionEnd =   plotOffset.top - options.xaxis.columnSummary.height;  
      			  }
      		  }  else {
      			  tickDetails.selectionEnd =   plotOffset.top; // stored when drawing horizontal line in core
      		  }
    		  
    	  } if (currentPosition.y > xaxis.endOfMinorTickLabel && currentPosition.y <=  plotOffset.top ) {
    		  //console.log("ON COLUMN SUMMARY OR NORMAL TICK");
			  //no multi line time header but normal ticks or on columnSummary
    		  tickDetails = getSelectedTick(normalTicks, hoveredTime, plot.NORMAL_TICK);
    		  tickDetails.type = plot.NORMAL_TICK;	
    		  tickDetails.selectionStart = xaxis.endOfMajorTickLabel;
    		  //the columnSummary highlight will be drawn according to the selectionAllowed configuration
    		  if(options.xaxis.columnSummary.enable) {
      			//the columnSummary highlight will be drawn according to the selectionAllowed configuration
    			  if(options.xaxis.columnSummary.selectionAllowed ) {
      				  tickDetails.selectionEnd =   plotOffset.top; // stored when drawing horizontal line in core
      			  } else {
      				  tickDetails.selectionEnd =   plotOffset.top - options.xaxis.columnSummary.height;  
      			  }
      		  }  else {
      			  tickDetails.selectionEnd =   plotOffset.top; // stored when drawing horizontal line in core
      		  }
    	  }  
    	  //console.log("tickDetails ", tickDetails.type);
    	  return tickDetails;
       }  
       
       /**
        * @param ticks - the ticks shown in axis 
        * @param - hoveredTime on the header
        * @param tickType :  will be MAJOR_TICK , MINOR_TICK  and NORMAL_TICK
        * 
        * selected tick details will be calculated here and the selection start and end  will be returned
        */
       function getSelectedTick(ticks, hoveredTime, tickType) {
    	   var startTick = 0, endTick = 0;
    	   var axis = plot.getAxes().xaxis;
    	   var axismax = axis.max; // view max   	  
    	   var tickStep = axis.tickStep; // for minor ticks and normal ticks
    	   for( var i = 0 ; i < ticks.length ; i++) {			  
    		   if(ticks[i+1] != undefined) {    		   
	    		   if((hoveredTime >=  ticks[i].v) && (hoveredTime <=  ticks[i+1].v)) {
	    			   startTick = ticks[i].v;
	    			   // Do this only for majorTick Selection
	    			   if(tickType == plot.MAJOR_TICK) {          
	    				   tickStep =  calculateCorrctMajorTickStep(startTick, axis);
	    			   }
	        		   endTick = startTick + tickStep;
	    			   break;
	    		   }
    		   } else {//clicked on last tick in the view
    			   if((hoveredTime >=  ticks[i].v ) && (hoveredTime <=  axismax)) {
	    			   startTick = ticks[i].v;
    			   if (tickType == plot.MAJOR_TICK) {   
    				   //Do this only for majorTick Selection
    				   tickStep =  calculateCorrctMajorTickStep(startTick, axis);
    			   }  
	    			   endTick = startTick + tickStep;      			   
	    			   break;
    			   }
    		   }
    		   if(startTick != 0  && endTick !=0) {
    			   break;
    		   }		   
	   }
	   return {
		   index : startTick, // is the index of array
		   startTick  :startTick,
		   endTick  :endTick,
		   widthTimeInMillis : parseInt(endTick - startTick)
	   };
      }
       
       // Added to fix ISRM- 5053
       //This will correctly check the no:of days in a month as well as no: of days in an year
       function calculateCorrctMajorTickStep (startTick, axis) {    	   
    	   var tickSize = axis.majorTickSize[0], unit = axis.majorTickSize[1];
    	   var d = new Date(startTick);
    	   var tickSizeDayInMilliseconds =  24 * 60 * 60 * 1000;
    	   var tickStep;
    	   var timeUnitSize = {
                   "second": 1000,
                   "minute": 60 * 1000,
                   "hour": 60 * 60 * 1000,
                   "day": 24 * 60 * 60 * 1000,
                   "week": 7 * 24 * 60 * 60 * 1000,
                   "month": 30 * 24 * 60 * 60 * 1000,
                   "year": 365.2425 * 24 * 60 * 60 * 1000
               };

    	   if( unit == "month") {
			  var daysInMonth = new Date(d.getFullYear(), d.getMonth() +1, 0).getDate();	
			   d.setMonth(d.getMonth());	
               d.setDate(1);
               d.setHours(0);
               d.setMinutes(0);
               d.setSeconds(0);
               //console.log("Days in this month ",daysInMonth );
               tickStep = daysInMonth * tickSizeDayInMilliseconds * tickSize;  
		  } else if (unit == "year" ) {
			 var year  = d.getFullYear();
			 d.setMonth(1);	
	         d.setDate(1);
	         d.setHours(0);
	         d.setMinutes(0);
	         d.setSeconds(0);
			 var daysInYear = 365;  // Not a leap year
			 if(year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
				 // if Leap year
				 daysInYear =  366;
			 }  
			tickStep = daysInYear * tickSizeDayInMilliseconds * tickSize; // calculate step here as months have different days
    	   	     					 
		  } else if (unit == "week") {
			  tickStep = 7 * tickSizeDayInMilliseconds;
		  } else  {
			  tickStep = tickSize * timeUnitSize[unit]; //  Eg:  should be 6 ticks for an hour if [10, minute]	
		  }			  
		  return tickStep;
	  
       }
       //This will ensure that the ticks selected will be added to highlighted list
       plot.checkForDaysToHighlightOnShiftKeyDown = function(tickDetails) {
	        //var series = plot.getSeries(),
	       	var	xaxis = plot.getAxes().xaxis,
	       		lastHighlightedTick = null,
	       		length = 0,
	       		hoveredTick = tickDetails.index;
	       	 
	       	 for(var tick in plot.tickHighlights) {
	       		length++;
	       		lastHighlightedTick  = parseInt(tick);
	       	 } 
	       	if(lastHighlightedTick != null && length >= 1) { //only if one item is highlighted
	       		var startTick, endTick;
		       	 	//get the end tick 	in both directions   
	       		if(lastHighlightedTick <= hoveredTick) {
	       			startTick = lastHighlightedTick;  //start tick
	       			endTick =  hoveredTick;	 // end tick
	       		} else {
	       			startTick = hoveredTick;   //start tick - need not be exact tick
	       			endTick =  lastHighlightedTick;	 // end tick
	       		}
	       		var tickSelection ={};
	       		//var one_day_millies = 1000 * 60 * 60 * 24;
	       	    var majorTicks = plot.getAxes().xaxis.majorTicks; 
	       	    
	       	    var ticks = (tickDetails.type == plot.MAJOR_TICK) ? majorTicks : plot.getAxes().xaxis.ticks;
	       		for( var i = 0 ; i < ticks.length ; i++) {
	       			 var currentTick =  ticks[i].v;
	       			 var nextTick = ticks[i+1] != undefined ? ticks[i+1].v : plot.getAxes().xaxis.max;
       				 if((nextTick >= startTick)  && (currentTick <= endTick) && (currentTick >=startTick) ) {
       					var tickObject = {
       							index : currentTick,
       							startTick :  currentTick,
       							endTick : nextTick,
       							widthTimeInMillis : (nextTick - currentTick),
    	       					highlighted : true
    	       			};
       					
       					plot.tickHighlights[currentTick]  = tickObject;
       					plot.highlightedTick.type = tickDetails.type;
       					plot.highlightedTick.selectionStart = tickDetails.selectionStart;
       					plot.highlightedTick.selectionEnd = tickDetails.selectionEnd;
       				 
       					if(plot.highlightedTick.type == plot.MAJOR_TICK){
       	   					plot.highlightedTick.size = xaxis.majorTickSize[0];
       	   					plot.highlightedTick.unit = xaxis.majorTickSize[1];
       	   				} else {
       	   					plot.highlightedTick.size = xaxis.tickSize[0];
       	   					plot.highlightedTick.unit = xaxis.tickSize[1];
       	   				 
       	   				}
       					//console.log("Selecting ... ", tickDetails.type);
       					tickSelection = {
    		       				columnHeaderItem :  tickObject,
    		            		selected : true
    		            	};
    		       		plot.getPlaceholder().trigger("tickSelection", [tickSelection]);
       				 }   
       				}	//for
	       		plot.draw(); // shift selected items should be drawn on last press itself
	       	}  
	       	return true;
       };
       
       /**
        * this will return a 1D array of  all the highlighted days
        */      
       plot.getAllTickHighlights = function() {      
	       	var tickHighlightsArray = new Array();
	       	for(var index in  plot.tickHighlights) {
	       		tickHighlightsArray.push(index);
	       	}        	
	       	return tickHighlightsArray;
       };
       
       /*This will add this tick with this details to highlighted list
       	tickDetails is the object of type
    	{
    	type : NORMAL_TICK/MAJOR_TICK/MINOR_TICK
    	startTick : start tick to highlight,
		endTick : end tick to highelight
       }*/
       plot.highlightATick = function(tickDetails) { 
	       
    	   var xaxis = plot.getAxes().xaxis;
    	   if(tickDetails.startTick != null && tickDetails.index == null) {
    		   tickDetails.index = tickDetails.startTick;
    	   }
	       var isAlreadyHighlighted = plot.isTickHighlighted(tickDetails);
	    	
	    	if(tickDetails.selectionStart == null || tickDetails.selectionEnd == null ) {
	    		tickDetails = calculateTickWidthbasedonTickDetails(tickDetails); // set selectionStart and End
	    		
	    	}
	    	if(tickDetails.widthTimeInMillis == null && tickDetails.endTick != null &&  tickDetails.startTick != null) {
	    		tickDetails.widthTimeInMillis = parseInt(tickDetails.endTick - tickDetails.startTick);
	    	}
	    	 
   			if(!isAlreadyHighlighted) {//if false only add to list
   				tickDetails.highlighted = true;
   				plot.tickHighlights[tickDetails.index] = tickDetails;
   				plot.highlightedTick.type = tickDetails.type;   				
   				plot.highlightedTick.selectionStart = tickDetails.selectionStart;
				plot.highlightedTick.selectionEnd = tickDetails.selectionEnd;
					
   				if(plot.highlightedTick.type == plot.MAJOR_TICK) {
   					plot.highlightedTick.size = xaxis.majorTickSize[0];
   					plot.highlightedTick.unit = xaxis.majorTickSize[1];
   				} else {
   					plot.highlightedTick.size = xaxis.tickSize[0];
   					plot.highlightedTick.unit = xaxis.tickSize[1];
   				}
   				plot.draw();   
   			}
	       	 
       };
       
       /**
        * tickDetails should be of the form
        * {
        * startTick : start time in millis
        * endTick : end timeIn millis
        * type :MAJOR_TICK/MINOR_TICK/NORMAL_TICK
        * }
        * 
        */
       function calculateTickWidthbasedonTickDetails(tickDetails) {
    	   var xaxis = plot.getAxes().xaxis;
    	   var options = plot.getOptions();
    	   plotOffset = plot.getPlotOffset();
    	   var majorTicks = xaxis.showLabel ? xaxis.majorTicks : null;
    	   var topHeaderHeight = xaxis.options.topHeader.enable ? xaxis.topHeaderHeight : 0;
    	   var timeHeaderStart = topHeaderHeight > 0 ? topHeaderHeight : 0; // if topHeader exists ...give that height    	
    	  
    	  if(majorTicks != null &&  tickDetails.type == plot.MAJOR_TICK) {
    		 // console.log("MAJOR_TICK-------- TICK");
    		  tickDetails.selectionStart = timeHeaderStart;
    		  tickDetails.selectionEnd =   xaxis.endOfMajorTickLabel; // stored when drawing horizontal line in core
    		  
    	  } else  if(majorTicks != null &&  tickDetails.type == plot.MINOR_TICK) {
    		  //console.log("MINOR----------- TICK");
    		  tickDetails.selectionStart = xaxis.endOfMajorTickLabel;
    		  tickDetails.selectionEnd =   xaxis.endOfMinorTickLabel; // stored when drawing horizontal line in core
    		  
    	  } else if (majorTicks == null && tickDetails.type == plot.NORMAL_TICK) {	
    		  //console.log("NORMAL_TICK----------- TICK");
    		  tickDetails.selectionStart = timeHeaderStart;
    		  //the columnSummary highlight will be drawn according to the selectionAllowed configuration
    		  if(options.xaxis.columnSummary.enable) {
      			//the columnSummary highlight will be drawn according to the selectionAllowed configuration
      			  if(options.xaxis.columnSummary.selectionAllowed ) {
      				  tickDetails.selectionEnd =   plotOffset.top; // stored when drawing horizontal line in core
      			  } else {
      				  tickDetails.selectionEnd =   plotOffset.top - options.xaxis.columnSummary.height;  
      			  }
      		  }  else {
      			  tickDetails.selectionEnd =   plotOffset.top; // stored when drawing horizontal line in core
      		  }
    	  } else if (tickDetails.type == plot.NORMAL_TICK ) {	
    		  //console.log("NORMAL_TICK----------- TICK");
    		  tickDetails.selectionStart = xaxis.endOfMajorTickLabel;
    		  if(options.xaxis.columnSummary.enable) {
    			//the columnSummary highlight will be drawn according to the selectionAllowed configuration
    			  if(options.xaxis.columnSummary.selectionAllowed ) {
    				  tickDetails.selectionEnd =   plotOffset.top; // stored when drawing horizontal line in core
    			  } else {
    				  tickDetails.selectionEnd =   plotOffset.top - options.xaxis.columnSummary.height;  
    			  }
    		  }  else {
    			  tickDetails.selectionEnd =   plotOffset.top; // stored when drawing horizontal line in core
    		  }
    	  }  
    	  //console.log("tickDetails ----------", tickDetails);
    	  return tickDetails;
       }  
       
       plot.isTickHighlighted = function(tickDetails) {    
    	    if (plot.highlightedTick.type != tickDetails.type) { 
	       		plot.clearAllTickHighlights();
	       	} 
    	    tick = tickDetails.index;
	       	if(plot.tickHighlights[tick] == undefined || plot.tickHighlights[tick].highlighted == false) {
	       		return false;
	       	} else if (plot.tickHighlights[tick].highlighted == true) {
	       		return true;
	       	}
       };
       
       //This will remove the row with this ID from the highlighted list and redraw the plot
       plot.removeHighlightForATick = function(tickInMillis) {
       	   delete  plot.tickHighlights[tickInMillis];    
       	   //remove and redarw as it need to reflect in plot
       	   plot.draw(); //ISRM-5545
       };
       
       //This will clear all highlights added for rows in the plot
       plot.clearAllTickHighlights = function() { 
       	 for(var index in  plot.tickHighlights) {
       		delete  plot.tickHighlights[index];
       	 }
       };
       
   /**
	* To get the weekend areas markings array for coloring,
	* you can provide those  days color needed to be highlighted in.
	*  colorDays : {
            	enable: false,
            	headerOnly : true, // if false header and plot area will be colored
            	colors:[null, null, null, null, null, "red", "red"] // will highlight saturday and sunday in red
            	//this is in the order for days monday to sunday
            } 
	**/  
   plot.coloringFunction = function(colorDays) { 
	   var axes = plot.getAxes();          
       axes.xmin = axes.xaxis.min;
       axes.xmax = axes.xaxis.max;
       axes.ymin = axes.yaxis.min;
       axes.ymax = axes.yaxis.max;      
		var markings = [];
		var d = new Date(axes.xaxis.min);
		
		var colors = colorDays.colors;		
		for(var c = 0, index = 6  ; c < colors.length ; c++, index--) {
			if(colors[c] == null){
				continue;
			}
			// console.log("d.getUTCDate() :  ",  d.getUTCDate(), " d.getUTCDay() : ", d.getUTCDay());	
			d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + index) % 7));
			d.setUTCSeconds(0);
			d.setUTCMinutes(0);
			d.setUTCHours(0);	
			var i = d.getTime();
			var maxDate = new Date(axes.xaxis.max);
			do {
			  // when we don't set yaxis, the rectangle automatically
			  // extends to infinity upwards and downwards
			  markings.push({ xaxis: { 
				  				from: i,
				  				to: i + 24 * 60 * 60 * 1000 
				  				} , 
				  				color: colors[c],
				  				clipWithBoundary: true
			  });
			  i += 7 * 24 * 60 * 60 * 1000;
			} while(i< maxDate.getTime());
		}		 
		return markings;
	}    
		
} //init

$.chronos.plugins.push({
    init: init,
    name: 'chronos.util',
    version: '6.10.6'
}); 
})(jQuery);