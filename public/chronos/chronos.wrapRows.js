/*
 * Copyright 2013-2014 IBS Software Services (P) Ltd. All Rights Reserved.
 * This software is the proprietary information of IBS Software Services (P) Ltd.
 * Use is subject to license terms.
 
@author A-2014, Maintained by TCC.
name 	: chronos.wrapRows
version	: 6.10.8
Copy right IBS Software Pvt Ltd 2011-2012
 
plugin added for handling the wrapped-row feature in the GANTT.
This js exposes the API methods which is used for all wrapping related activities.
*/

(function ($) {	
	function init(plot) {
	 
		//Global index for checking the position from where longrange data task need to be checked
		this.longRangeIndexTillChecked = 0;
		this.maxWrappedRowIndex = 0;
		var wrapIndexDisplayMap = []; //will have key as index 0,1,2,3(displayYValue) -- and value as the wrapIndex corresponding to each wrap ROw.
			
		var wrapIndexChangeYValueMap = []; // will have index as actual start of Yvalue when wrap is 0 and  value as ascending 0,1,2...3 count  
			
		var taskIdWrapIndexMap = [];   //will have Map[task.chronosId] = wrappedRowIndex; 
		
		var rowIdExpandedStatusMap = []; // will have key as rowId and the value will be the status expanded(true)or collapsed(false) for the items in client
		var rowIdMaxWrapMap = []; //will have key as rowId and the value will be the total maxWrapRows calculated for that row. . If collpased, will be 1 always .
		var rowIdDisplayWrapMap = [] ; ////  will have key as rowId and the value will be the displayed WrapRows calculated for that row on display 
		
		var oneDayMillis = 86400000; //24*3600*1000, 
		
		var nodeParseRowIndex = 0;
		var actualStartRowIndex = 0;
		/**
		 * Key will be rowId-wrappedRowIndex-startDayMillis.
		 * Value will be list of tasks starting in that day in that rowId with the given wrappedIndex.
		 */
		var wrapRowNormalTaskListMap = [];
		/**
		 * Key  will be rowId-wrappedRowIndex
		 * Value will be list of tasks in that rowId with the given wrappedIndex.
		 */
		var wrapRowLongRangeTaskListMap = [];
		
		var HYPHEN = "_";
		
		plot.getWrapIndexDisplayMap = function() {
			return(wrapIndexDisplayMap);
		};
		/**
		 * This is used for cases when we need to know the yValue when a new row starts after wrap.
		 * used for alternate coloring of merged wrap rows. 
		 */
		plot.getWrapIndexChangeYValueMap = function() {
			return(wrapIndexChangeYValueMap);
		};
		
		
		
		
		plot.getTaskIdWrapIndexMap = function() {
			return taskIdWrapIndexMap;
		};
		
		
		plot.getWrapIndexOfItem = function(taskId) {
			var wrapIndex = 0;
			if(taskIdWrapIndexMap) {
				wrapIndex = taskIdWrapIndexMap[taskId] != undefined || taskIdWrapIndexMap[taskId] != null ? taskIdWrapIndexMap[taskId]: 0;
			}
			return wrapIndex;
		};
		
		
		plot.getRowIdExpandedStatusMap = function() {
			return rowIdExpandedStatusMap;
		};
		/**
		 * This will include the displayed rows and hidden rows
		 * Will have the total row count(including wrap + hidden rows) of  rows at that time
		 */
		plot.getRowIdMaxWrapMap = function() {
			return rowIdMaxWrapMap;
		};
		/**
		 * This will not have  the hidden rows count.
		 * Will have the total row count(including wrap) of  all displayed rows at that time 
		 */
		plot.getRowIdDisplayWrapMap = function() {
			return rowIdDisplayWrapMap;
		};
		
		/**
		 * For each Row for a given day, finding out how may wrapped rows are there for that bucket
		 */
		plot.determineBucketWiseWrap = function(series, isAsyncCall, isCallFetchReq) {
			var options = plot.getOptions(), axes = plot.getAxes();       	
			var axisYmin = Math.ceil(plot.currentLoadedData.yValueMin) ;
			var axisYmax = Math.ceil(plot.currentLoadedData.yValueMax) ;			
			if( options.chronosWorker.enabled && isAsyncCall ){
				
				options = {	
					yaxis: {
						scrollRange: options.yaxis.scrollRange,
						verticalScrollExtendunit: options.yaxis.verticalScrollExtendunit,
						newScrollRange: {
							scrollMin: options.yaxis.scrollMin,
							scrollMax: options.yaxis.scrollMax
						},
						min: options.yaxis.min
					},
					xaxis: {
						scrollRange: options.xaxis.scrollRange,
					}
				}
				axes = {
					xaxis: {
						direction: axes.xaxis.direction,
						options: {}
					},
					yaxis: {
						direction: axes.yaxis.direction,
						options: {}
					}
				}		
				var customPlot = {
						currentLoadedData: plot.currentLoadedData,
						hiddenRows: plot.hiddenRows,
						options: options,
						axes: axes
				}
				var customSeries = {
						displayedRowIds: series.displayedRowIds,
						xaxis: {
						min: series.xaxis.min,
						max: series.xaxis.max
						},
						yaxis: {
						min: series.yaxis.min,
						max: series.yaxis.max
						},
						actualFirstWrapDisplayMap: series.actualFirstWrapDisplayMap,
						actualFilterRowIds: series.actualFilterRowIds,
						rowHeaderIds: series.rowHeaderIds,
						rowYvalueMap: series.rowYvalueMap,
						rowMap: series.rowMap,
						columnMap: series.columnMap,
						dataMap: series.dataMap ? plot.prepareDataMap(series.dataMap,["chronosId", "start", "end", "wrappable"]) : series.dataMap,
						rootTreeNode: series.rootTreeNode ? true : undefined,
						rowIdRowObjectMap: series.rowIdRowObjectMap ? prepRowIdRowObjectMap(series) : undefined,
						gantt: {
							normalMaximumDaySpan: series.gantt.normalMaximumDaySpan
						},
						data2DMatrix: series.data2DMatrix,
						longRangeDataMap : series.longRangeDataMap
				}

				if(isCallFetchReq){
					customPlot.currentVisibleData = plot.currentVisibleData;
					customPlot.newInsertedRows = plot.newInsertedRows;
					customPlot.options.interaction = {
							extraFetchFactor : plot.getOptions().interaction.extraFetchFactor,
							extraViewFetch : plot.getOptions().interaction.extraViewFetch,
							extraViewFetchFactor : plot.getOptions().interaction.extraViewFetchFactor
					};
					customSeries.rowIdLeafNodeMap = series.rowIdLeafNodeMap ? plot.prepareDataMap(series.rowIdLeafNodeMap,["isLeafNode"]) : undefined;
					customSeries.rowAvailable = series.rowAvailable;
					customSeries.columnAvailable = series.columnAvailable;
				}
				var data = {
						series: customSeries,
						axisYmin: axisYmin,
						axisYmax: axisYmax,
						isCallFetchReq: isCallFetchReq,
						plot: customPlot
				}
				$.chronosworker.call("determineBucketWiseWrap", data, function(response) {
					taskIdWrapIndexMap = [] ; //clear the map			
					rowIdMaxWrapMap = []; //reset this on each callfetch recalculation
					//reset on each datafetch calculation
					wrapRowNormalTaskListMap =  [];
					wrapRowLongRangeTaskListMap = [];
					if(response){
						taskIdWrapIndexMap = response.taskIdWrapIndexMap ;		
						wrapRowNormalTaskListMap = response.wrapRowNormalTaskListMap;
						wrapRowLongRangeTaskListMap = response.wrapRowLongRangeTaskListMap;
						rowIdMaxWrapMap = response.rowIdMaxWrapMap;
						series.data2DMatrix = response.data2DMatrix;
						series.actualFirstWrapDisplayMap = response.actualFirstWrapDisplayMap
						series.actualyValueFromDisplayedYValue = response.actualyValueFromDisplayedYValue
						wrapIndexDisplayMap = response.wrapIndexDisplayMap;
						wrapIndexChangeYValueMap = response.wrapIndexChangeYValueMap;
						rowIdDisplayWrapMap = response.rowIdDisplayWrapMap;
						series.displayedRowIds = response.displayedRowIds;
						series.columnMap= response.columnMap;
						longRangeIndexTillChecked = response.longRangeIndexTillChecked;
						plot.updateVerticalScrollBar(response, series);
						if(isCallFetchReq){
							plot.callFetchCallBack(response);
						}
					}
					plot.setupGrid();
					plot.draw();
					if(plot.currentScrollRowId){
						plot.scrollToPosition(null, plot.currentScrollRowId, true);
					}					
					//if it is  a tree iterate the node again
					if(series.rootTreeNode != undefined) { //WRAP IN TREE CASE
						series.rowHeaderIds = [];
						series.rowHeaderObjects = [];
						var nodeParseRowIndex = 0 , actualStartRowIndex = 0, nodeLevel = 0;
						//console.log("iterateNodeRecursively Called row wrap :::::::::::::::::::::::: "   );
						plot.iterateNodeRecursively(series.rootTreeNode, series.rowHeaderIds, series.rowHeaderObjects, nodeLevel, nodeParseRowIndex, actualStartRowIndex); // A recursive call
						plot.calculateWrappedFamilyCountRecursively(series.rootTreeNode, nodeLevel, 0, 0);
					}
				}, plot.getPlotLabel());
			} else {
				taskIdWrapIndexMap = [] ; //clear the map			
				rowIdMaxWrapMap = []; //reset this on each callfetch recalculation
				//reset on each datafetch calculation
				wrapRowNormalTaskListMap =  [];
				wrapRowLongRangeTaskListMap = [];
				var rowId, actualFilteredRowIds = series.actualFilterRowIds ;
				for (var yValue = axisYmin;  yValue <= axisYmax; yValue++) {
						rowId = actualFilteredRowIds[yValue];
						//console.log("Each ROW ID TAKEN -----------------------------------" , rowId);
						if(rowId == undefined) {
							continue;
						}
						//longRangeIndexTillChecked = 0;
						plot.determineBucketWiseWrapForEachRow( rowId, series );   		
				} //for
				//Always recalculate the actualFilter rowIds and update the wrapIndex map after this
				plot.updateWrapIndexDisplayMap();
				//if it is  a tree iterate the node again
				if(series.rootTreeNode != undefined) { //WRAP IN TREE CASE
					series.rowHeaderIds = [];
					series.rowHeaderObjects = [];
					var nodeParseRowIndex = 0 , actualStartRowIndex = 0, nodeLevel = 0;
					//console.log("iterateNodeRecursively Called row wrap :::::::::::::::::::::::: "   );
					plot.iterateNodeRecursively(series.rootTreeNode, series.rowHeaderIds, series.rowHeaderObjects, nodeLevel, nodeParseRowIndex, actualStartRowIndex); // A recursive call
					plot.calculateWrappedFamilyCountRecursively(series.rootTreeNode, nodeLevel, 0, 0);
				}
			}
		};	
	    
		prepRowIdRowObjectMap = function (series){
			var data = series.rowIdRowObjectMap
			var attrs = ["expanded"];
			if(series.rootTreeNode){
				attrs.push("isLeafNode");
			}
			return plot.prepareDataMap(data, attrs);
		}
		
		// prepare data for UpdateWrapIndexDisplayMap worker method
		prepareDataUpdateWrapIndexDisplayMap = function(plot) {
			var series = {
					displayedRowIds: plot.getSeries().displayedRowIds,
					xaxis: {
						min: plot.getSeries().xaxis.min,
						max: plot.getSeries().xaxis.max
					},
					yaxis: {
						min: plot.getSeries().yaxis.min,
						max: plot.getSeries().yaxis.max
					},
					actualFirstWrapDisplayMap: plot.getSeries().actualFirstWrapDisplayMap,
					actualFilterRowIds: plot.getSeries().actualFilterRowIds,
					rowHeaderIds: plot.getSeries().rowHeaderIds,
					rowMap: plot.getSeries().rowMap,
					columnMap: plot.getSeries().columnMap,
					rowIdRowObjectMap: plot.getSeries().rowIdRowObjectMap ? prepRowIdRowObjectMap(plot.getSeries()) : undefined,
					data2DMatrix: plot.getSeries().data2DMatrix,
					rootTreeNode: plot.getSeries().rootTreeNode ? true : undefined,
					rowYvalueMap: plot.getSeries().rowYvalueMap,
					gantt: {
						normalMaximumDaySpan: plot.getSeries().gantt.normalMaximumDaySpan
					},
					
			}
			
			var options = {
					yaxis: {
						scrollRange: plot.getOptions().yaxis.scrollRange,
						verticalScrollExtendunit: plot.getOptions().yaxis.verticalScrollExtendunit,
						newScrollRange: {
							scrollMin: plot.getOptions().yaxis.scrollMin,
							scrollMax: plot.getOptions().yaxis.scrollMax
						},
						min: plot.getOptions().yaxis.min
					},
					xaxis: {
						scrollRange: plot.getOptions().xaxis.scrollRange,
					}
			}
			
			var axes = {
					xaxis: {
						direction: plot.getAxes().xaxis.direction,
						options: {}
					},
					yaxis: {
						direction: plot.getAxes().yaxis.direction,
						options: {}
					}
			}
			var data = {
					plot: {
						currentLoadedData: plot.currentLoadedData,
						hiddenRows: plot.hiddenRows,
						series: series,
						options: options,
						axes: axes
					}
			}
			return data;
		}
		
		//Also update vertical scrollbar with new range
		plot.updateVerticalScrollBar = function (response, series) {
			var options = response.options;
			var newScrollRange = response.newScrollRange;
			var opts = plot.getOptions();
			if(opts && opts.yaxis && options && options.yaxis){
				opts.yaxis.scrollRange = response.options.yaxis.scrollRange;
				opts.yaxis.min = response.options.yaxis.min;
				opts.yaxis.newScrollRange = response.options.yaxis.newScrollRange;
			}
			if(plot.getAxes() && response.axes){
				$.each(plot.getAxes(), function(_, axis) {
	            	if(axis.direction == 'x' && response.axes.yaxis && response.axes.yaxis.options) {
	            		axis.options.scrollRange = response.axes.xaxis.options.scrollRange;        
	            	} else if(axis.direction == 'y' && response.axes.yaxis && response.axes.yaxis.options) { 
	            		axis.options.scrollRange = response.axes.yaxis.options.scrollRange;
	            	}
	            });
			}
		    if(plot.verticalScrollBar != undefined) {   
		    // if verticalScrollunit is set, consider that too in calculating min
		        plot.verticalScrollBar.setAxisValues(newScrollRange[0] , newScrollRange[1]);
		        var min, max;
			    	//ISRM-5620 min and max calculation need to be done before
		        min = series.actualFirstWrapDisplayMap[response.previousMinDisplayedYValue] + response.scrollDelta; // position the scroll to where it was before
		        if(options.yaxis.verticalScrollExtendunit != null && response.scrollDelta == 0) {
		            min = min - options.yaxis.verticalScrollExtendunit;
		        }
		        max = min + response.viewRange;
		        if(plot.actionType == "scrollToTimeAndItemRowOnTop" ) {
		            var item = plot.actionData.item;
		            var actualYValueOfRow = series.rowYvalueMap[item.rowId];
		            var wrapIndex = plot.getTaskIdWrapIndexMap()[item.chronosId];					
		            //console.log("Actual first wrap display map  of  actualYValueOfRow : ",actualYValueOfRow  ," = " , series.actualFirstWrapDisplayMap[actualYValueOfRow] );
		            //console.log("Wrap Index corresponding to chronosID" , item.chronosId , " = " ,  wrapIndex);
		            min = series.actualFirstWrapDisplayMap[actualYValueOfRow]  + wrapIndex - options.yaxis.verticalScrollExtendunit;   
		            var viewValue = plot.verticalScrollBar.getViewValues();
		            var diff = viewValue.maxViewValue - viewValue.minViewValue;
		            max = min + diff; //ISRM-6438 stretching the rows issue
		            if(max > plot.verticalScrollBar.maxAxisValue) {
		                max = plot.verticalScrollBar.maxAxisValue;
		                min = max - diff;
		            } 
		             
		        }
		        if(!isNaN(min) && !isNaN(max)) {
		            capScrollLimits(plot.verticalScrollBar);
		            plot.setYaxisViewArea(min, max);        
		        }
		        plot.verticalScrollBar.redrawScrollBox(); // the vertical scroll bar should be redrawn with the new set of rows
		  	} 
			   
		    if(series.rootTreeNode != undefined) { //WRAP IN TREE CASE - RECALCULATION OF WRAP COUNT
					var nodeParseRowIndex = 0 , nodeLevel = 0, actualStartRowIndex = 0;
					plot.calculateWrappedFamilyCountRecursively(series.rootTreeNode, nodeLevel, nodeParseRowIndex, actualStartRowIndex);
			}
		    
		    //assign the task with the new rows-  to be done before draw ISRM:4584
		    plot.assignNewRowToTask();
		    //Added a call back indicating teh updation of  view Range
		    var viewRangeChangedCallback = plot.getSeries().gantt.viewRangeChangedCallback;
		    if(viewRangeChangedCallback) {
	   			var args = [];
	   			var data = {};
	   			data.currentVisibleData = plot.currentVisibleData;
	   			data.triggeredFrom = "updateWrapIndexDisplayMap";
	    		args.push(data);
	   			eval(viewRangeChangedCallback).apply(this, args);	
	   		}
		}
		
		/*when the recalculation of wrap index for each row is done when ever remove or add task is done, then 
		 * we need to clear those data in the taskIDWrapIndexMap.
		 * if wrapIndexToSet is provided each task item in this row will be assigned with this wrapIndex
		 * */
		function clearTaskIdWrapIndexMapForLongRangeDataForThisRow(rowId, wrapIndexToSet) {
			var  taskObjectId, eachTask, taskObjectIdArray;//, dataMapRowIndex;
			var series = plot.getSeries();
			var rowIndexMap = series.rowMap; 
			var dataMap = series.dataMap; 	 
			var dataMapRowIndex = rowIndexMap[rowId];
			if(series.longRangeDataMap != undefined) {
				taskObjectIdArray = plot.getLongRangeTaskIdArray(series, dataMapRowIndex );
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
		function clearTaskIdWrapIndexMapForNormalDataForThisRow(rowId, viewPortMin, viewPortMax, rowIndexMap, columnIndexMap, dataMap, wrapIndexToSet) {
			var dataMapRowIndex = rowIndexMap[rowId];
			var dataMapColumnIndex, eachTask;
			var normalTaskIdMap, taskObjectIdArray,taskObjectId;
			for (var day = viewPortMin; day <= viewPortMax; ) {		            		
					dataMapColumnIndex = columnIndexMap[day];
					if(dataMapColumnIndex == undefined) {
						dataMapColumnIndex = plot.getCurrentColumnIndex(day); //to create the column map when there is no data
					}
					if(dataMapColumnIndex) {
						normalTaskIdMap = plot.getNormalTaskIdMap(dataMapRowIndex,dataMapColumnIndex );
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
		 * Remove data from corresponding taskListMap
		 * wrapRowLongRangeTaskListMap[rowId + HYPHEN + wrappedRowIndex]
		 * wrapRowNormalTaskListMap[rowId + HYPHEN + wrappedRowIndex + HYPHEN + bucketStartTime];
		 */
		plot.clearWrapRowTaskListMaps = function(rowId, wrappedRowIndex, bucketStartTime, isLongRangeTask ) {			 
			if(isLongRangeTask) {
				for( var index = 0; index < plot.getRowIdDisplayWrapMap()[rowId]; index++){
					delete(wrapRowLongRangeTaskListMap[rowId + HYPHEN + index]);
				}
			} else {				 
				for(var lindex = 0; lindex < plot.getRowIdDisplayWrapMap()[rowId]; lindex++) {
					delete(wrapRowNormalTaskListMap[rowId + HYPHEN + lindex + HYPHEN + bucketStartTime]);
				}
		    } 
		};
		/**
		 * determining the max wrap index for each Row in each bucket  and add as an attribute bucketWiseRowIndex in the object in 2d Map 
		 *  Object is of the form  {
		 *  	bucketWiseRowIndex :  bucketWiseRowIndex will be no:of maximum wrap rows for that bucket - 4 means ->4 wrap rows 
		 *  	taskIdArray : { ids of objects } 
		 *  }
		 * @PARAM clearWrapIndexForTasksInRow : when the recalculation of wrap index for each row is done when ever remove or add task is done, then 
		 * we need to clear those data in the taskIDWrapIndexMap.
		 */
		plot.determineBucketWiseWrapForEachRow = function(rowId, series, clearWrapIndexForTasksInRow) {
			
			longRangeIndexTillChecked = 0;
			var maxWrapRowCount = 0;
			
			//console.log("determineBucketWiseWrapForEachRow ", rowId);
			var rowIndexMap = series.rowMap; 
			var dataMapRowIndex = rowIndexMap[rowId];
			//console.log("determineBucketWiseWrapForEachRow ---------- " + rowId + " dataMapRowIndex = " + dataMapRowIndex); 
			if(dataMapRowIndex == null ||  dataMapRowIndex == undefined) {	
				rowIdMaxWrapMap[rowId] = 1; //for empty data row
				return;
			}
			var columnIndexMap = series.columnMap; 
			var taskObjectId, eachTask, taskObjectIdArray;
			var dataMap = series.dataMap;
			 
			var axisxMin = plot.currentLoadedData.fromDate ;
			var axisxMax = plot.currentLoadedData.toDate ;
			var dataMapColumnIndex , normalTaskIdMap ;
			var normalMaximumDaySpan = series.gantt.normalMaximumDaySpan - 1;
		
			var viewPortMin = plot.resetViewPortTime(axisxMin) - (normalMaximumDaySpan * oneDayMillis); 
			var viewPortMax= plot.resetViewPortTime(axisxMax);
			
			//if the row is a tree Node(with childNodes ) , don't consider for wrapping 
			if(series.rootTreeNode != undefined) { // if tree wrapping
			 var rowHeaderNode = series.rowIdRowObjectMap[rowId];
			 if(rowHeaderNode && !rowHeaderNode.isLeafNode) {
				 var wrapIndexToSet = 0;
				 clearTaskIdWrapIndexMapForLongRangeDataForThisRow(rowId, wrapIndexToSet); //otherwise taskIdWrapIndexMap will be cleared in the determineBucketWiseWrap call itself
				 clearTaskIdWrapIndexMapForNormalDataForThisRow(rowId, viewPortMin, viewPortMax, rowIndexMap, columnIndexMap, dataMap, wrapIndexToSet);
				 return null;
			 }
			}
			
			if(clearWrapIndexForTasksInRow) {
				clearTaskIdWrapIndexMapForLongRangeDataForThisRow(rowId); //otherwise taskIdWrapIndexMap will be cleared in the determineBucketWiseWrap call itself
				clearTaskIdWrapIndexMapForNormalDataForThisRow(rowId, viewPortMin, viewPortMax, rowIndexMap, columnIndexMap, dataMap);
			}
			
			for (var day = viewPortMin; day <= viewPortMax; ) {		            		
				var normalTasksArray = new Array(); //to store sorted aray
				//previous buckets until normal span
				//To handle the previous days entities ending in current day 
				var prevdayMilliSeconds = day - (normalMaximumDaySpan * oneDayMillis) ;  
				for (var olderDay = prevdayMilliSeconds; olderDay < day; ) {
					dataMapColumnIndex = columnIndexMap[olderDay];
					if(dataMapColumnIndex == undefined) {
						dataMapColumnIndex = plot.getCurrentColumnIndex(olderDay); //to create the column map when there is no data
						//console.log("Created column index :  for " , new Date(olderDay) +" = " + dataMapColumnIndex);
					}
					if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {
						normalTaskIdMap = plot.getNormalTaskIdMap(dataMapRowIndex, dataMapColumnIndex );
						if(normalTaskIdMap != null && normalTaskIdMap != undefined ) {
							taskObjectIdArray = normalTaskIdMap.taskIdArray;
							if(taskObjectIdArray != undefined ) {
								for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
									taskObjectId = taskObjectIdArray[taskID];       
									eachTask  = dataMap[taskObjectId]; 
									if(eachTask != null &&  eachTask !=  undefined) {
										if(eachTask.end >  day ) {
											if(jQuery.inArray(eachTask, normalTasksArray) == -1) { // not added already 
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
					dataMapColumnIndex = plot.getCurrentColumnIndex(day);  //to create the column map when there is no data
					//console.log("Created column index :  for " , new Date(day) +" = " + dataMapColumnIndex);
				}
				if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {
					//console.log("START Calculating index for  dataMapColumnIndex :  ", dataMapColumnIndex ,  " dataMapColumnIndex ", dataMapColumnIndex);
					normalTaskIdMap = plot.getNormalTaskIdMap(dataMapRowIndex, dataMapColumnIndex );
					if(normalTaskIdMap != null && normalTaskIdMap != undefined ) {
						taskObjectIdArray = normalTaskIdMap.taskIdArray;
						if(taskObjectIdArray != undefined ) {
							for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
								taskObjectId = taskObjectIdArray[taskID];       
								eachTask  = dataMap[taskObjectId]; 
								if(eachTask != null &&  eachTask !=  undefined) {
									if(jQuery.inArray(eachTask, normalTasksArray) == -1) { // not added already 
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
					var bucketWiseRowIndex = determineMaxWrapIndexForThisBucket(rowId , day , normalTasksArray, day + oneDayMillis, clearWrapIndexForTasksInRow);
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
			rowIdMaxWrapMap[rowId] = maxWrapRowCount;
		};
		

		function sortLongRangeDataForThisRow(rowId, clearWrapIndexForTasksInRow) {
			
			var  taskObjectId, eachTask, taskObjectIdArray;//, dataMapRowIndex;
			var series = plot.getSeries();
			var rowIndexMap = series.rowMap; 
			var dataMap = series.dataMap; 	 
			var dataMapRowIndex = rowIndexMap[rowId];
			var longDataArray = new Array();
			
			if(series.longRangeDataMap != undefined) {
				taskObjectIdArray = plot.getLongRangeTaskIdArray(series, dataMapRowIndex );
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
		/*
		 * normalTasksArrayInCurrentBucket is the sorted tasks
		 */
		function determineMaxWrapIndexForThisBucket(rowId, bucketStartTime , normalTasksArrayInCurrentBucket , bucketEndTime, clearWrapIndexForTasksInRow) {
			//console.log("START determineMaxWrapIndexForThisBucket :Sorted normalTasksArrayInCurrentBucket = ", normalTasksArrayInCurrentBucket);
			var longRangeDataTasksInCurrentRow = sortLongRangeDataForThisRow(rowId, clearWrapIndexForTasksInRow) ;
			//console.log("Sorted longDataArray ==== ", longRangeDataTasksInCurrentRow);
			maxWrappedRowIndex = 0; //reset back for each bucket
			//iterating each sorted item according to the start task to assign the index
			if(normalTasksArrayInCurrentBucket.length > 0) {
				$.each(normalTasksArrayInCurrentBucket, function(index, eachTask) {
					//TAKING  EACH TASK FOR PLACEMENT 
					//check all longrange data starting before this normal task
					if(longRangeDataTasksInCurrentRow != undefined) {
						for(var longTask = longRangeDataTasksInCurrentRow[longRangeIndexTillChecked] ; (longTask !=undefined && longTask.start <= eachTask.start); ){
							if(taskIdWrapIndexMap[longTask.chronosId] == undefined || taskIdWrapIndexMap[longTask.chronosId] == null) {
								maxWrappedRowIndex = assignWrapRowIndexForTask(longTask, rowId, bucketStartTime, true);
								//console.log("AFTER LONG ASSIGNING ---- " , longTask.chronosId + " --------------------", longTask.wrappedRowIndex);	
							} else if(taskIdWrapIndexMap[longTask.chronosId] > maxWrappedRowIndex){
								maxWrappedRowIndex = taskIdWrapIndexMap[longTask.chronosId]; 
							}
							longRangeIndexTillChecked++;
							longTask = longRangeDataTasksInCurrentRow[longRangeIndexTillChecked];						
						}		
					}
					//if no long range data , check in normal
					if(taskIdWrapIndexMap[eachTask.chronosId] == undefined || taskIdWrapIndexMap[eachTask.chronosId] == null){
						maxWrappedRowIndex = assignWrapRowIndexForTask(eachTask, rowId, bucketStartTime, false);
						//console.log("AFTER ASSIGNING NORMAL TASK ---- " , eachTask.chronosId + " --------------------", eachTask.wrappedRowIndex);
					} else if(taskIdWrapIndexMap[eachTask.chronosId] > maxWrappedRowIndex){
						maxWrappedRowIndex = taskIdWrapIndexMap[eachTask.chronosId]; 
					}
					//}
			  });
				
		  } 
		  if(longRangeDataTasksInCurrentRow != undefined) {
				var longRangeIndex = 0;
				for(var longTask = longRangeDataTasksInCurrentRow[longRangeIndex] ; (longTask !=undefined && longTask.start <= bucketEndTime); ){
					if(taskIdWrapIndexMap[longTask.chronosId] == undefined || taskIdWrapIndexMap[longTask.chronosId] == null ) {
						maxWrappedRowIndex = assignWrapRowIndexForTask(longTask, rowId, bucketStartTime, true);
						longRangeIndexTillChecked++;
						//console.log("AFTER ASSIGNING ---- " , longTask.chronosId + " --------------------", longTask.wrappedRowIndex);	
					}  else if(taskIdWrapIndexMap[longTask.chronosId] > maxWrappedRowIndex && (longTask.end > (bucketEndTime - 86400000))){
						maxWrappedRowIndex = taskIdWrapIndexMap[longTask.chronosId]; 
					}
					longRangeIndex++;
					longTask = longRangeDataTasksInCurrentRow[longRangeIndex];						
				}		
		 }
		  //console.log("END determineMaxWrapIndexForThisBucket rowId ", rowId, "bucketEndTime " , new Date(bucketEndTime), ":maxWrappedRowIndex = ", maxWrappedRowIndex);
		  return maxWrappedRowIndex; 			
		};
		
		
		function assignWrapRowIndexForTask(task, rowId, bucketStartTime, isLongRangeTask) {
			//increment wrappedRowIndex from 0
			var  wrappedRowIndex = 0; //again start checking at 0
			//call findItemAt
			var checkAgain = true;
			if(task.wrappable == false) { //if wrappable is false
				task.wrappedRowIndex = 0;
				taskIdWrapIndexMap[task.chronosId] = 0; // don't consider for wrapping
				assignToWrapListMap(isLongRangeTask, rowId, wrappedRowIndex, bucketStartTime, task);
				if(wrappedRowIndex > maxWrappedRowIndex) {
					maxWrappedRowIndex = wrappedRowIndex;
				}				 
				checkAgain = false;
			}
			while(checkAgain) {
				var itemFound = plot.findItemAt(rowId, wrappedRowIndex, task.start, bucketStartTime);
				if(itemFound != null && itemFound.wrappable != false) { // ITEM FOUND , itemPresent with this index
					wrappedRowIndex++;
					checkAgain = true;
				} else { //if null GOT POSITION -  Now assign task.wrappedRowIndex = wrappedRowIndex;
					task.wrappedRowIndex = wrappedRowIndex;					
					taskIdWrapIndexMap[task.chronosId] = wrappedRowIndex; //assigned to map
					//assign these task to the corresponding list
					assignToWrapListMap(isLongRangeTask, rowId, wrappedRowIndex, bucketStartTime, task);
					if(wrappedRowIndex > maxWrappedRowIndex) {
						maxWrappedRowIndex = wrappedRowIndex;
					}
					checkAgain = false;
				}					
			} //while
			return maxWrappedRowIndex;
			
		}
		/**
		 * this function assigns the task to corresponding wrapList map
		 */
		function assignToWrapListMap(isLongRangeTask, rowId,wrappedRowIndex, bucketStartTime, task ) {
			var listOfItems = [];
			if(isLongRangeTask) {
				if (wrapRowLongRangeTaskListMap[rowId + HYPHEN + wrappedRowIndex] ) {
					listOfItems = wrapRowLongRangeTaskListMap[rowId + HYPHEN + wrappedRowIndex];							
				} 
				listOfItems.push(task);
				wrapRowLongRangeTaskListMap[rowId + HYPHEN + wrappedRowIndex] = listOfItems;
			} else {
				if(wrapRowNormalTaskListMap[rowId + HYPHEN + wrappedRowIndex + HYPHEN + bucketStartTime] ) {
					listOfItems = wrapRowNormalTaskListMap[rowId + HYPHEN + wrappedRowIndex + HYPHEN + bucketStartTime];							
				}  
				listOfItems.push(task);
				wrapRowNormalTaskListMap[rowId + HYPHEN + wrappedRowIndex + HYPHEN + bucketStartTime] = listOfItems;
			} 
		}
		
		
		
		/**
		 *  This function returns the item at the given wrappedRowIndex and the taskStartTime within the array of tasks 
		 *  If  not found , returns null.
		 *  @param time is the start time of the task to be checked
		 *  @param normalTasksArrayInCurrentBucket  -sorted normal task array
 		 *  @param longRangeDataTasksInCurrentRow  - sorted long range task array
		 */
		plot.findItemAt = function(rowId, wrappedRowIndex, taskStartTime, startDayMillis) {
			//first check in the wrappedRowIndexArray in both normal and long range		  
		   //To handle the previous days entities ending in current day
		    var normalMaximumDaySpan = plot.getSeries().gantt.normalMaximumDaySpan - 1;
			var prevdayMilliSeconds = startDayMillis - (normalMaximumDaySpan * oneDayMillis) ;  
			var finalArrayWithAlltasks = [], key;
			for (var olderDay = prevdayMilliSeconds; olderDay <= startDayMillis; ) {
				key = rowId + HYPHEN + wrappedRowIndex + HYPHEN + olderDay;
				var currentList = wrapRowNormalTaskListMap[key];
				if(currentList)  {
					finalArrayWithAlltasks = finalArrayWithAlltasks.concat(currentList) ;
				} 
				olderDay = olderDay + oneDayMillis ;
			}
			 var itemFound = null;
			 if(finalArrayWithAlltasks.length > 0){
				  itemFound = checkIfTaskPresentInArray(finalArrayWithAlltasks, wrappedRowIndex, taskStartTime);
			 }
				 if( itemFound != null) {
					 return itemFound;
				 } else {
				//look in long range map as well
				finalArrayWithAlltasks = wrapRowLongRangeTaskListMap[rowId + HYPHEN + wrappedRowIndex];
				 if(finalArrayWithAlltasks) {
					 itemFound = checkIfTaskPresentInArray(finalArrayWithAlltasks, wrappedRowIndex, taskStartTime);
					 if( itemFound != null) {
					 return itemFound;
				 }
				 }
			}  
			
		};
		
		/**
		 * check in this array if the wrapIndex and the task with this time exists already in the array
		 */
		function checkIfTaskPresentInArray(arrayToCheck, wrapIndexToCheck, time) {
			if(arrayToCheck == undefined) {
				return null;
			}
			var taskFound = null, eachTask;
			var wrapIndexInMap, chronosId;
			for( var i = 0, len = arrayToCheck.length; i< len; i++) {
				eachTask = arrayToCheck[i];
				 chronosId = eachTask.chronosId; 
				 wrapIndexInMap = taskIdWrapIndexMap[chronosId];
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
		//common function  which can be called from any method 
		
		function compareObjectsBasedOnStartTime (a,b) {
			if (a.start < b.start)
				return -1;
			if (a.start > b.start)
				return 1;
			return 0;
		}
		
		/**
         * Wrap count calculation for each Node for merging multi header rows when displaying row tree header
         */
        plot.calculateWrappedFamilyCountRecursively = function(currentNode, nodeLevel,  nodeParseRowIndexPassed, actualStartRowIndexPassed) {
        	var  wrappedFamilyCount = 0;
        	var options = plot.getOptions();
        	var rowId = currentNode.rowId; // rowId should be there in our tree Node structure
        	if (rowId == null) {//Create empty rows with this objects 
	    		rowId = plot.TREE_ROWID_CONSTANT + currentNode.nodeLevel +"-"+ nodeParseRowIndex;
	    	}  
        	if(nodeParseRowIndexPassed != undefined && actualStartRowIndexPassed != undefined) {
	    		 nodeParseRowIndex = nodeParseRowIndexPassed;		    		 
	    		 actualStartRowIndex = actualStartRowIndexPassed;
	    	 }
        	 currentNode.startRowIndex = nodeParseRowIndex;
        	 currentNode.actualStartRowIndex = actualStartRowIndex;
        	 var map = plot.getRowIdDisplayWrapMap();
        	 //console.log(rowId + " == " + map[rowId] + " == " +  currentNode.startRowIndex, " wrappedFamilyCount ", wrappedFamilyCount);
         	var maxWrap = map[rowId] ? map[rowId]  : 0;
     	    if(options.yaxis.treeNode.nodeLimit >= currentNode.nodeLevel && nodeLevel != 0) {
 	           wrappedFamilyCount = wrappedFamilyCount + maxWrap ;
 	           if(jQuery.inArray(rowId, plot.hiddenRows) == -1) { // not hidden 
 	        	   nodeParseRowIndex = nodeParseRowIndex + 1;
 			   } 	
 	          actualStartRowIndex++;
     	    }  else if(currentNode.childNodes == null) { //LEAF
	        	//when child nodes are null , this is a leaf node  grab the rowId and rowObject
    		    wrappedFamilyCount = maxWrap;
	        	currentNode.wrappedFamilyCount = wrappedFamilyCount;
	        	if(jQuery.inArray(rowId, plot.hiddenRows) == -1){ // not hidden 
	        		 nodeParseRowIndex = nodeParseRowIndex + maxWrap;
				} 	
	        	actualStartRowIndex = actualStartRowIndex+ maxWrap;
	        	return wrappedFamilyCount;
	        }  
	        if(currentNode.childNodes != null) {
				var childNodes = currentNode.childNodes;
				for ( var i = 0; i < childNodes.length; i++) {
					wrappedFamilyCount += plot.calculateWrappedFamilyCountRecursively(childNodes[i], nodeLevel+1, nodeParseRowIndex, actualStartRowIndex);
				}
				currentNode.wrappedFamilyCount = wrappedFamilyCount;	
				return wrappedFamilyCount;
			} 
	        //Case when there is no child nodes  up to nodeLimit mentioned
	        currentNode.wrappedFamilyCount = wrappedFamilyCount;
	        return wrappedFamilyCount;
        }; 
        	
		/**
		 * function to update  WrappedRows In wrapIndexDisplayMap - which will have key(actualyValue) as index 0,1,2,3 -- and value as the wrapIndex
		 * corresponding to each wrap ROw. Note: displayedRowIds will have same key(0,0,0) for its wrap rows as keys(0,1,2)
		 *  and also update the corresponding actual rowIds which will now have actualFirstWrapDisplayMap
		 */
		
		plot.updateWrapIndexDisplayMap = function(isAsyncCall) {
			if(plot.getOptions().chronosWorker.enabled && isAsyncCall){
				var data =  prepareDataUpdateWrapIndexDisplayMap(plot)
				$.chronosworker.call("updateWrapIndexDisplayMap", data, function(response) {
					plot.getSeries().actualFirstWrapDisplayMap = response.actualFirstWrapDisplayMap
					plot.getSeries().actualyValueFromDisplayedYValue = response.actualyValueFromDisplayedYValue
					wrapIndexDisplayMap = response.wrapIndexDisplayMap;
					wrapIndexChangeYValueMap = response.wrapIndexChangeYValueMap;
					rowIdDisplayWrapMap = response.rowIdDisplayWrapMap;
					plot.getSeries().displayedRowIds = response.displayedRowIds;
					plot.getSeries().columnMap= response.columnMap;
					plot.updateVerticalScrollBar(response, plot.getSeries());
					var forcedDraw = false;
					if(plot.forcedDrawWorker){
						forcedDraw = true;
						plot.forcedDrawWorker = false;
					}
					plot.setupGrid();
				    plot.draw();
				    if(forcedDraw){
				    	plot.newInsertedRows = [];
				    	plot.isScrollRangeUpdated = false;
						plot.forcedDraw = true;
					}
				})
			}else{
				var series = plot.getSeries();
				var options= plot.getOptions();
				var axisx = series.xaxis;
				var viewPortMin = plot.resetViewPortTime(axisx.min); //take only from VIEW AREA 
				var viewPortMax = plot.resetViewPortTime(axisx.max);
				plot.viewBucket = { 
							min : 	viewPortMin,
							max :  viewPortMax 
				};
				var dataMapRowIndex, dataMapColumnIndex , normalTaskIdMap ;					
				var noOfWrapRowsForThisRow;			
				wrapIndexDisplayMap = []; //reset this here for every calculation 
				wrapIndexChangeYValueMap = [];
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
							dataMapColumnIndex = plot.getCurrentColumnIndex(day);  //to create the column map when there is no data
							//console.log("Created column index :  for " , new Date(day) +" = " + dataMapColumnIndex);
						}
						//console.log("Day --------------- " ,  new Date(day) + " rowId--- "+ rowId + " dataMapColumnIndex " + dataMapColumnIndex + " dataMapRowIndex : ", dataMapRowIndex);
						if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {
							//console.log("START Calculating index for   rowId--- "+ rowId,  " dataMapColumnIndex ", dataMapColumnIndex);
							if(dataMapRowIndex != null && dataMapRowIndex != undefined) {
								normalTaskIdMap = plot.getNormalTaskIdMap(dataMapRowIndex, dataMapColumnIndex );
								
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
					//console.log("rowIdDisplayWrapMap  for row : " , rowId , " == ", rowIdDisplayWrapMap[rowId]);
					
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
				$.each(series.displayedRowIds, function(displayedYValue, actualyValueExcludingHidden) { //index , eachItem	
					//console.log("plot.retrieveActualRowId(displayedYValue) "+ plot.retrieveActualRowId(displayedYValue));
					actualYValue = series.rowYvalueMap[plot.retrieveActualRowId(displayedYValue)];// This actual yValue is including hidden				
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
				plot.setScrollRangeAccordingToData(null, yScrollRange); // internally considered vertical scroll unit  so passing 0 here
			    
				//Now set the view areas to the begining of the view area in case of rows    
	         	var newScrollRange = options.yaxis.scrollRange;        	
	         	
	         	//Also update vertical scrollbar with new range
	            if(plot.verticalScrollBar != undefined) {   
	            // if verticalScrollunit is set, consider that too in calculating min
	                plot.verticalScrollBar.setAxisValues(newScrollRange[0] , newScrollRange[1]);
	                var min, max;
	       	    	//ISRM-5620 min and max calculation need to be done before
	                min = series.actualFirstWrapDisplayMap[previousMinDisplayedYValue] + scrollDelta; // position the scroll to where it was before
	                if(options.yaxis.verticalScrollExtendunit != null && scrollDelta == 0) {
	                    min = min - options.yaxis.verticalScrollExtendunit;
	                }
	                max = min + viewRange;
	                if(plot.actionType == "scrollToTimeAndItemRowOnTop" ) {
	                    var item = plot.actionData.item;
	                    var actualYValueOfRow = series.rowYvalueMap[item.rowId];
	                    var wrapIndex = plot.getTaskIdWrapIndexMap()[item.chronosId];	
	                    if(wrapIndex == undefined || wrapIndex == null){
	                    	wrapIndex = 0;
	                    }
	                    //console.log("Actual first wrap display map  of  actualYValueOfRow : ",actualYValueOfRow  ," = " , series.actualFirstWrapDisplayMap[actualYValueOfRow] );
	                    //console.log("Wrap Index corresponding to chronosID" , item.chronosId , " = " ,  wrapIndex);
	                    min = series.actualFirstWrapDisplayMap[actualYValueOfRow]  + wrapIndex - options.yaxis.verticalScrollExtendunit;   
	                    var viewValue = plot.verticalScrollBar.getViewValues();
	                    var diff = viewValue.maxViewValue - viewValue.minViewValue;
	                    max = min + diff; //ISRM-6438 stretching the rows issue
	                    if(max > plot.verticalScrollBar.maxAxisValue) {
	                        max = plot.verticalScrollBar.maxAxisValue;
	                        min = max - diff;
	                    } 
	                     
	                }
	                if(!isNaN(min) && !isNaN(max)) {
	                    capScrollLimits(plot.verticalScrollBar);
	                    plot.setYaxisViewArea(min, max);        
	                }
	                plot.verticalScrollBar.redrawScrollBox(); // the vertical scroll bar should be redrawn with the new set of rows
	          	} 
	       	   
			    if(series.rootTreeNode != undefined) { //WRAP IN TREE CASE - RECALCULATION OF WRAP COUNT
						var nodeParseRowIndex = 0 , nodeLevel = 0, actualStartRowIndex = 0;
						plot.calculateWrappedFamilyCountRecursively(series.rootTreeNode, nodeLevel, nodeParseRowIndex, actualStartRowIndex);
				}
			    
			    //assign the task with the new rows-  to be done before draw ISRM:4584
			    plot.assignNewRowToTask();
			    //Added a call back indicating teh updation of  view Range
			    var viewRangeChangedCallback = plot.getSeries().gantt.viewRangeChangedCallback;
			    if(viewRangeChangedCallback) {
		   			var args = [];
		   			var data = {};
		   			data.currentVisibleData = plot.currentVisibleData;
		   			data.triggeredFrom = "updateWrapIndexDisplayMap";
		    		args.push(data);
		   			eval(viewRangeChangedCallback).apply(this, args);	
		   		}
			}
		};
		/**
		* This will check and limit the scroll beyond range
		**/
		function capScrollLimits(scrollbar) {		
			if (scrollbar.minViewValue < scrollbar.minAxisValue) {
				scrollbar.minViewValue = scrollbar.minAxisValue;
				scrollbar.maxViewValue = scrollbar.minViewValue + scrollbar.viewArea;
			} 
			if (scrollbar.maxViewValue > scrollbar.maxAxisValue) {
				scrollbar.maxViewValue =  scrollbar.maxAxisValue;
				scrollbar.minViewValue = scrollbar.maxViewValue - scrollbar.viewArea;
			}	
			//console.log("capScrollLimits:", scrollbar.minViewValue, scrollbar.maxViewValue);
		}
		
		/**
		 * 
		 */
		plot.assignNewRowToTask = function() {			
			var series = plot.getSeries();			 
			var axisx = series.xaxis;
        	var axisy = series.yaxis;
        	var oneDayMillis = 86400000; //24*3600*1000 
        	var normalMaximumDaySpan = series.gantt.normalMaximumDaySpan;
        	//This normalMaximumDaySpan is passed from the server at emptyChart call in plotData
        	var viewPortMin = plot.resetViewPortTime(axisx.min) - (normalMaximumDaySpan * oneDayMillis); 
        	var wrapRowIndex, drawRowId, rowHeaderObject, dataMapRowIndex, dataMapColumnIndex;
            var taskObjectId, entityWrapIndex;        	 
			for (var row = Math.floor(axisy.min) ;  row <= Math.ceil(axisy.max); row++) {
				wrapRowIndex = wrapIndexDisplayMap[row];
				drawRowId = plot.retrieveActualRowId(row);
				if(drawRowId != undefined) {     
				rowHeaderObject = series.rowIdRowObjectMap[drawRowId];	
				
        		dataMapRowIndex = series.rowMap[drawRowId];  
        		if(dataMapRowIndex) {	
        			for(var dayMilliSeconds = viewPortMin; dayMilliSeconds <= axisx.max; ) {
        				dataMapColumnIndex = series.columnMap[dayMilliSeconds]; 
            			if(dataMapColumnIndex) {	
            				var taskObjectIdArray = plot.getNormalTaskIdArray(series, dataMapRowIndex, dataMapColumnIndex );
            				if(taskObjectIdArray != undefined ) {
	            				for(var taskID = 0;  taskID < taskObjectIdArray.length ; taskID++) {
	            					taskObjectId = taskObjectIdArray[taskID]; 
		            				var eachTask  = series.dataMap[taskObjectId];		
		            				if(eachTask) {		            				   
	            				    	  entityWrapIndex = taskIdWrapIndexMap[eachTask.chronosId];
	            				    	  eachTask.wrappedRowIndex = entityWrapIndex;
	            				    	  if ((wrapRowIndex != entityWrapIndex) && 
	            				    			  (rowHeaderObject!= null && rowHeaderObject.expanded)) {
											continue;
										}		            					 				            					
		            					eachTask.yValue = row;
		            					//console.log("taskObjectId-----------", taskObjectId , " yValue ", row);
		            				}
	            				}
            				}
            			}
            			dayMilliSeconds = dayMilliSeconds + oneDayMillis;
        			} //for
        			// now assign yValue for long range tasks
        			if (series.longRangeDataMap != undefined) {
        				taskObjectIdArray = plot.getLongRangeTaskIdArray(series, dataMapRowIndex );
        				if(taskObjectIdArray != undefined) {
            				for(var taskId = 0;  taskId<taskObjectIdArray.length ; taskId++) {
            					taskObjectId = taskObjectIdArray[taskId];
            					var leachTask  = series.dataMap[taskObjectId];		
                				if(leachTask) {		            					
                					  if (plot.areWrapRowsEnabled()) {
                						  entityWrapIndex = taskIdWrapIndexMap[leachTask.chronosId];
                						  leachTask.wrappedRowIndex = entityWrapIndex;
                						  if ((wrapRowIndex != entityWrapIndex) && 
                								  (rowHeaderObject != null && rowHeaderObject.expanded)) {
        										continue;
        									}
                    					}		
                					  leachTask.yValue = row;   	
                					  //console.log("LONG taskObjectId-----------", taskObjectId , " yValue ", row);
        	            		}//if
            				}//for
        				}
        			}//series.longRangeDataMap        			
        		 } // if dataMapRowIndex
			}
		} // outermost for			
		}
		
		/**
		 * checking if the row is expanded or not
		 */
		plot.isRowExpanded= function(rowId) {
			var series = plot.getSeries();
			var rowHeaderObject = series.rowIdRowObjectMap[rowId];
			return rowHeaderObject.expanded;
		};
		
		/**
		 * call this function to expand the row and show  objects in each wrapped rows without overlap 
		 */
		plot.expandRow = function(rowId) {			
			var series = plot.getSeries();
			series.rowIdRowObjectMap[rowId].expanded = true;
			var rowIdStatusMap = plot.getRowIdExpandedStatusMap();
			rowIdStatusMap[rowId] = true;
			plot.updateWrapIndexDisplayMap(true); //calling as Async
		};
		/**
		 * call this function to collapse the wrapped rows and show  all wrapped 
		 * objects together in one single row
		 */
		plot.collapseRow = function(rowId) {
			if (!plot.areWrapRowsEnabled() ) {
				return false;
			}
			var series = plot.getSeries();
			//var rowHeaderObject = series.rowIdRowObjectMap[rowId];
			series.rowIdRowObjectMap[rowId].expanded = false;		
			var rowIdStatusMap = plot.getRowIdExpandedStatusMap();
			rowIdStatusMap[rowId] = false;			
			plot.updateWrapIndexDisplayMap(true); //calling as Async
		};
		
		 /**
		  * Expanding all rows according to wrap-index and displaying without  any overlap.
		  * The   rowIdExpandedStatusMap map is updated and row header object is updated with expandstatus
		  */
		plot.expandAllRows = function() {
			//console.log("expanding...............");
			if (!plot.areWrapRowsEnabled() ) {
				return false;
			}
			var series = plot.getSeries();
			var rowIdExpandedStatusMap = plot.getRowIdExpandedStatusMap();
			var eachRowHeaderObject;
			 var rowIdRowObjectMap = series.rowIdRowObjectMap;
			for (var eachRowId in rowIdRowObjectMap) {							
				if(eachRowId != undefined) {
					rowIdExpandedStatusMap[eachRowId] = true;
					eachRowHeaderObject = series.rowIdRowObjectMap[eachRowId];
					if(eachRowHeaderObject != undefined) {
						eachRowHeaderObject.expanded = true;						 
						series.rowIdRowObjectMap[eachRowId] = eachRowHeaderObject; //update the row header objecte in this map
						plot.determineBucketWiseWrapForEachRow(eachRowId, series);  //3rd paramter undefined =>  do not clearWrapIndexForTasksInRow
					}
				}				
			  //console.log("Expanding Each row ID ", eachRowId , " rowIdRowObjectMap[eachRowId] ", eachRowHeaderObject);
			}
			
			// recalculate the actualFilter rowIds and update the wrapIndex map after this
			series.gantt.wrappedRows.expandMode = true; //retain wrap view
			plot.updateWrapIndexDisplayMap(true); //calling as Async
		};
		/**
		 * Collapsing all rows in the view  area. The status in rowIdExpandedStatusMap and rowHEaderObject are updated.
		 */
		
		plot.collapseAllRows = function() {
			var series = plot.getSeries();
			//console.log("Collapsing...............");
			var rowIdExpandedStatusMap = plot.getRowIdExpandedStatusMap();
			var eachRowHeaderObject;			
			var rowIdRowObjectMap = series.rowIdRowObjectMap;
			for (var eachRowId in rowIdRowObjectMap) {
				if(eachRowId != undefined) {
					rowIdExpandedStatusMap[eachRowId] = false;
					eachRowHeaderObject = series.rowIdRowObjectMap[eachRowId];
					if(eachRowHeaderObject != undefined) {
						eachRowHeaderObject.expanded = false;							 
						series.rowIdRowObjectMap[eachRowId] = eachRowHeaderObject; //update the row header objects in this map
					}
				}
				//console.log("Collapsing Each row ID ", eachRowId , " rowIdRowObjectMap[eachRowId] ", eachRowHeaderObject);
			}
			series.gantt.wrappedRows.expandMode = false; //retain wrap view
			plot.updateWrapIndexDisplayMap(true); //calling as Async
		 
		};
		
		/**
		 * To check if a row has any wrap rows ie tasks getting overlapped exists in this row in the current display. 
		 * If the row is collpased returns 1. if it has only 2 rows in that view it retuns 2.
		 * 
		 */
		plot.getWrappedRowsDisplayedInCurrentView = function(rowId) {
			var map = plot.rowIdDisplayWrapMap(); // this map also can return the  no: of rows showing currently in the view
			return map[rowId];
		};
		/**
		 *  To check if a row has any wrap rows according to its task Data - in any view    
		 */
		 plot.hasWrappedRows = function(rowId) {
			var map = plot.getRowIdMaxWrapMap(); // this map also can return the max Wrap rows for a particular rowId
			if(map[rowId] > 1) {
				return true;
			} else {
				return false;
			}
		}; 
		
		/**
		 * This will return the task Items in the view area along with the task Items in the
		 * view area for the extra rows given in the bufferRowsCount.
		 * This will count the actualYvalue( wrapped Rows) as one row and not the actual rowId
		 * additionalFetch is the flag set from callback to know if it is already returned 
		 * from this API and corresponding  business logic in callback for those task is executed
		 * or not
		 */
		plot.getViewAreaTasksWithBufferRows = function(bufferRowsCount) {
			var series = plot.getSeries();			 
			var axisx = series.xaxis;
        	var axisy = series.yaxis;
        	var oneDayMillis = 86400000; //24*3600*1000 
        	var normalMaximumDaySpan = series.gantt.normalMaximumDaySpan;
		 
			var viewPortMinDay = plot.resetViewPortTime(axisx.min) - (normalMaximumDaySpan * oneDayMillis); 
			var viewPortMaxDay= plot.resetViewPortTime(axisx.max);
			if(!bufferRowsCount) {
				bufferRowsCount = 0;
			}
			var minYValueToCollect = Math.floor(axisy.min) - bufferRowsCount;			 
			if(minYValueToCollect < 0) {
				minYValueToCollect = 0;
			}
			var yMaxBorder = Math.ceil(axisy.options.scrollRange[1]);
			var maxYValueToCollect = Math.ceil(axisy.max) +  bufferRowsCount;
			if(maxYValueToCollect > yMaxBorder) {
				maxYValueToCollect = yMaxBorder;
			}
			var viewPortTaksItems = [];
			var rowId, rowIndexMap = series.rowMap, columnIndexMap = series.columnMap;
			var dataMapRowIndex , dataMapColumnIndex,normalTaskIdMap, longTaskIdMap, actualRowYvalue = 0 ;
		
			//console.log(" VISIBLE RANGE IN BUFFER API " , minYValueToCollect , maxYValueToCollect );
			//initially find the startWrapIndex as we may 
            var startWrapIndex = 0, rowStart = minYValueToCollect;
            for(var i = minYValueToCollect; i >=0 ; i--) {
                  actualRowYvalue = wrapIndexChangeYValueMap[i] + wrapIndexChangeYValueMap.indexOf(0);
                  if(actualRowYvalue != undefined && !isNaN(actualRowYvalue) ) {
                         startWrapIndex =  minYValueToCollect - i; // this is to be calculated only initially
                         break;
                  }
            }

			
			while(rowStart <= maxYValueToCollect ) {				
				rowId = series.actualFilterRowIds[actualRowYvalue];		 
				if(rowId == undefined) {					
					actualRowYvalue++;
					startWrapIndex = 0;
					rowStart = rowStart + 1;// start of next row
					continue;
				}				 
				var maxWrapForThisRow =  rowIdDisplayWrapMap[rowId];
				//console.log("maxWrapForThisRow ", maxWrapForThisRow);
				dataMapRowIndex = rowIndexMap[rowId];	
				var checkTill = maxYValueToCollect - rowStart;
				 
				for (var day = viewPortMinDay; day <= viewPortMaxDay; ) { //view port area only --- time            		
					dataMapColumnIndex = columnIndexMap[day];				
					if(dataMapColumnIndex && dataMapRowIndex ) {
							normalTaskIdMap = plot.getNormalTaskIdMap(dataMapRowIndex, dataMapColumnIndex );
							if(normalTaskIdMap) {
								var normaltaskIds =   normalTaskIdMap.taskIdArray;		
								var eachTaskId , eachTask , taskWrapIndex ;
								if(normaltaskIds != null) {
									for(var i = 0 ; i < normaltaskIds.length ; i++) {
										 eachTaskId = normaltaskIds[i];
										 eachTask = plot.getTaskById(eachTaskId);
										 taskWrapIndex = plot.getWrapIndexOfItem(eachTaskId);
										//additionalFetch is the flag set from callback to know if it is already processed or not
	                                    if(eachTask && taskWrapIndex >= startWrapIndex && 
	                                            eachTask.yValue <= maxYValueToCollect && eachTask.additionalFetch != true) {
	                                     viewPortTaksItems.push(eachTaskId);    
	                                     eachTask.additionalFetch = true;
	                                    }  
											 
									} //for  
										
								}	
							}
							
					}					
					day = day + oneDayMillis;
				}// for
				//LONGRANE DATA
				if(dataMapRowIndex) {
					longTaskIdMap = plot.getLongRangeTaskIdMap(dataMapRowIndex );
					if(longTaskIdMap) {
						var longTaskIdArray = longTaskIdMap.taskIdArray;
						var eachTaskId , eachTask , taskWrapIndex ;
						if(longTaskIdArray != null) {
							for(var i = 0 ; i < longTaskIdArray.length ; i++) {
								 eachTaskId = longTaskIdArray[i];
								 eachTask = plot.getTaskById(eachTaskId);
								 taskWrapIndex = plot.getWrapIndexOfItem(eachTaskId);
								//additionalFetch is the flag set from callback to know if it is already processed or not
                                if(eachTask && taskWrapIndex >= startWrapIndex && 
                                        eachTask.yValue <= maxYValueToCollect && eachTask.additionalFetch != true) {
                                 viewPortTaksItems.push(eachTaskId);
                                 eachTask.additionalFetch = true;
                                   
                                }
									 
							} //for  								
						}							 
					}//if			  
				} //if
              rowStart = rowStart + maxWrapForThisRow - startWrapIndex;// start of next row
              startWrapIndex = 0;
              actualRowYvalue++;
			} // while
			 
			//console.log("viewPortTaksItems ", viewPortTaksItems);
			return viewPortTaksItems;
		};
		
		/**
		 * This will retrieve all task in the view area and also the buffer rows above and below
		 */	
		plot.getAllViewAreaTasksWithBufferRows = function(bufferRowsCount) {
			var series = plot.getSeries();			 
			var axisx = series.xaxis;
        	var axisy = series.yaxis;
        	var oneDayMillis = 86400000; //24*3600*1000 
        	var normalMaximumDaySpan = series.gantt.normalMaximumDaySpan;
		 
			var viewPortMinDay = plot.resetViewPortTime(axisx.min) - (normalMaximumDaySpan * oneDayMillis); 
			var viewPortMaxDay= plot.resetViewPortTime(axisx.max);
			if(!bufferRowsCount) {
				bufferRowsCount = 0;
			}
			var minYValueToCollect = Math.floor(axisy.min) - bufferRowsCount;			 
			if(minYValueToCollect < 0) {
				minYValueToCollect = 0;
			}
			var yMaxBorder = Math.ceil(axisy.options.scrollRange[1]);
			var maxYValueToCollect = Math.ceil(axisy.max) +  bufferRowsCount;
			if(maxYValueToCollect > yMaxBorder) {
				maxYValueToCollect = yMaxBorder;
			}
			var viewPortTaksItems = [];
			var rowId, rowIndexMap = series.rowMap, columnIndexMap = series.columnMap;
			var dataMapRowIndex , dataMapColumnIndex,normalTaskIdMap, longTaskIdMap, actualRowYvalue = 0 ;
			var dataMap = series.dataMap;
			while(minYValueToCollect <= maxYValueToCollect ) {				
				actualRowYvalue = series.displayedRowIds[minYValueToCollect];	
				rowId = series.actualFilterRowIds[actualRowYvalue];		
				//console.log("IN WRAP   rowId: ", rowId , "minYValueToCollect ", minYValueToCollect );
				if(rowId == undefined) {					
					minYValueToCollect = minYValueToCollect + 1;  
					continue;
				}				 
				var maxWrapForThisRow =  rowIdDisplayWrapMap[rowId];
				//console.log("maxWrapForThisRow ", maxWrapForThisRow);
				//console.log("minYValueToCollect ------------------", minYValueToCollect);
				dataMapRowIndex = rowIndexMap[rowId];	
				var eachTaskId , eachTask , taskWrapIndex, taskYValue;
				for (var day = viewPortMinDay; day <= viewPortMaxDay; ) { //view port area only --- time            		
					dataMapColumnIndex = columnIndexMap[day];				
					if(dataMapColumnIndex && dataMapRowIndex ) {
							normalTaskIdMap = plot.getNormalTaskIdMap(dataMapRowIndex, dataMapColumnIndex );
							if(normalTaskIdMap) {
							var normaltaskIds =   normalTaskIdMap.taskIdArray;							
								if(normaltaskIds != null) {
									for(var i = 0 ; i < normaltaskIds.length ; i++) {
										 eachTaskId = normaltaskIds[i];
										 eachTask = dataMap[eachTaskId];
										 taskWrapIndex = plot.getWrapIndexOfItem(eachTaskId);
										 taskYValue = eachTask ? eachTask.yValue : minYValueToCollect;
										 if(taskYValue == undefined) {
											 taskYValue = minYValueToCollect + taskWrapIndex;
										 }  
										//additionalFetch is the flag set from callback to know if it is already processed or not
	                                    if(eachTask && taskYValue <= maxYValueToCollect && eachTask.additionalFetch != true) {
	                                     viewPortTaksItems.push(eachTaskId);    
	                                     //console.log("eachTaskId ", eachTaskId ,"--",  taskWrapIndex , "eachTask.yValue  ", eachTask.yValue , "maxYValueToCollect ", maxYValueToCollect)
	                                     eachTask.additionalFetch = true;
	                                    }  
											 
									} //for  
										
								}	
							}
							
					}					
					day = day + oneDayMillis;
				}// for
				//LONGRANE DATA
				if(dataMapRowIndex) {
					longTaskIdMap = plot.getLongRangeTaskIdMap(dataMapRowIndex );
					if(longTaskIdMap) {
						var longTaskIdArray = longTaskIdMap.taskIdArray;
						
						if(longTaskIdArray != null) {
							for(var i = 0 ; i < longTaskIdArray.length ; i++) {
								 eachTaskId = longTaskIdArray[i];
								 eachTask = dataMap[eachTaskId];
								 taskWrapIndex = plot.getWrapIndexOfItem(eachTaskId);
								 taskYValue = eachTask.yValue;
								 taskYValue = eachTask ? eachTask.yValue : minYValueToCollect;
								 if(taskYValue == undefined) {
									 taskYValue = minYValueToCollect + taskWrapIndex;
								 }  
								//additionalFetch is the flag set from callback to know if it is already processed or not
                                if(eachTask && taskYValue <= maxYValueToCollect  && eachTask.additionalFetch != true) {
                                 viewPortTaksItems.push(eachTaskId);
                                 eachTask.additionalFetch = true;
                                   
                                }
									 
							} //for  								
						}							 
					}//if			  
				} //if
				minYValueToCollect = minYValueToCollect + 1;
			} // while
			 
			//console.log("viewPortTaksItems ", viewPortTaksItems);
			return viewPortTaksItems;
		};
		
	} //init
	
	$.chronos.plugins.push({
		init: init,
		name: 'chronos.wrapRows',
		version	: '6.10.8'
	}); 
})(jQuery);