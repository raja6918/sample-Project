/*
 * Copyright 2013-2014 IBS Software Services (P) Ltd. All Rights Reserved.
 *
 * This software is the proprietary information of IBS Software Services (P) Ltd.
 * Use is subject to license terms.
 * Dependencies : chronos.navigate.js
 * 				  jquery.colorhelpers.js
 * 				  jQuery resize
 * 				  chronos.date.js
 * 				  date.js(timezoneJS)
 *
 * Optional  :
 * 		for scrollbar include 	 :	 chronos.scrollbar.js
 * 		for resize chart include :	 chronos.resize.js
 *
 * For API refer to the Chronos-API.txt
 *
 * This script accepts options to create gantt chart, bar chart and line chart,
 * and draws chart on canvas with those options.
 *
 * @author A-2094, Maintained by TCC.
 * name : chronos-core
 * version: 6.10.10
 *
 */

//Added to prevent plot conflict and ensure backward compatibility
var preventChronosPlotConflict = preventChronosPlotConflict || false;

//the actual Plot code
(function($) {

	globalTransferObject = {
			plotCanvasMap: []
	};

    function Chronos(placeholder, data_, options_, plugins) {
        var series =  null,
            options = {
                // the color theme used for graphs
                colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
                legend: {
                	show: false,
                    backgroundColor: null, // null means auto-detect
                    backgroundOpacity: 0.85, // set to 0 to avoid background
                    labelContainerWidth: 0, //in pixels - the total width of labelBox and label-text.The total width of labelContainer to be included in the labelWidth.
                	labelBoxBorderColor: "#000000", // border color for the little label boxes
                    labelBoxWidth:10,
                    rowHeight:20,// the height for each entry to be displayed
                    font : { color:"#000000" , size: 10, style: "italic", weight: 'bold', family: 'arial', variant: "normal" }
                },
                 timeZone : {
                	value :null // or any timexone value :"GMT", // default null, user can give a timeZone string which will be used to render the plot
                				//zoneFileBasePath : "tz" // the path of the time zone data files
                },
                xaxis: {
                    show: null, // null = auto-detect, true = always, false = never
                    position: "top", // or "top"
                    mode: null, // null or "time"
                    //font: null, // null (derived from CSS in placeholder) or object like { size: 11, style: "italic", weight: "bold", family: 'sans-serif', variant: "small-caps" }
                	font: {size: 12, style: "normal", weight: "bold", family: "arial", variant: "normal"},
                    color: "#000000", // base color, labels, ticks
                    transform: null, // null or f: number -> number to transform axis
                    inverseTransform: null, // if transform is set, this should be the inverse function
                    min: null, // min. value to show, null means set automatically
                    max: null, // max. value to show, null means set automatically
                    autoscaleMargin: 0.2, // margin in % to add if auto-setting min/max
                    ticks: null, // either [1, 3] or [[1, "a"], 3] or (fn: axis info -> ticks) or app. number of ticks for auto-ticks
                    tickFormatter: null, // fn: number -> string
                    tickSizeProvider:null,// fn:  which returns resultof the form [10,"minute"]
                    majorTicks :null,
                    subTicks :null,
                    //color moved inside tickStyle possibly different tickColor of ticks, e.g. "rgba(0,0,0,0.15)"
                    tickStyle: { tickColor : "#000000", dashedLine:false, dashedStyle:[2,2] , lineWidth : 1  }, // for minor axis labels as well
                    showLabel:true,
                    labelWidth: null, // space allocated for of tick labels in pixels.This include the space for labelContainerWidth if it needs to be shown
                    labelHeight: null,
                    labelMargin: 2, // in pixels .This will be taken for x axis alone if needed in both  mention separately for each axis or in grid.labelMargin
                    labelRenderer :null, // for drawign labels by the user application : takes preference
                    labelBackgroundColor:"#FFFFFF",
                    reserveSpace: null, // whether to reserve space even if axis isn't shown
                    tickLength: null, // size in pixels of ticks, or "full" for whole line
                    alignTicksWithAxis: true, // axis number or null for no sync
                    // mode specific options
                    tickDecimals: null, // no. of decimals, null means auto
                    tickSize: null, // number or [number, "unit"]
                    minTickSize: null, // number or [number, "unit"]
                    monthNames: null, // list of names of months
                    timeformat: null, // format string to use
                    twelveHourClock: true, // 12 or 24 time in time mode
                    minTickWidth : null , //set in pixels if this is set, this will be taken as precedence in no:of ticks calculation
                    //support for multi line column header for time display

                    multiLineTimeHeader : {
                    	enable : false, // means chart will be created with a major and minor ticks
                    	majorTickFormatter : null,
                    	header : {
                    	minorTickLines:"show",//hide
                        majorTickLines:"show",//hide
                        tickRenderer : null
                    	},
                    	drawHorizontalLine:"show",//hide
                    	majorTickRenderer :null,
                    	majorLabelRenderer : null,
                        minorLabelRenderer : null,
                    	majorTickLabelHeight : null,
                    	minorTickLabelHeight : null,
                    	majorTickSizeProvider : null,// fn:  which returns result of the form [1,"day"]
                    	majorTickSize :null, //eg: [1, "day"], [number, "unit"]
                    	majorTickStyle: { tickColor : "#FF0000", dashedLine:false, dashedStyle:[2,2] ,lineWidth : 1 , majorTickLength:'full' , drawTickOnTop : true},
                    	//,majorTickFont : { color: "FF0000" , size: 11, style: "italic", weight: "bold", family: 'sans-serif', variant: "small-caps" }
                    	// This ticklength will be the height from the axis to the top of canvas on top,  and from bottom axis to bottom of canvas
                    	//if given full it will be drawn from canvas top to canvas bottom
                    	displayWeek : {
                    		enable : false, // by default if enabled the major axis will display label of  day in weekFormat ("%b %d, %W")
                    		showInMinor: false, // if the days in that week need to display week names.
                    		weekFormat: "%b %d, %W",
                    		weekFirstDay: 0 // default is set as 1st day of week sunday
                    	} ,
                    	minorTickLabel : {
                    		tickPosition : "center",// ontick
                    			zeroHour : "show"//hide
                    	},
                    	majorTickLabel : {
                    		tickPosition : "center",//defaulted
                    		boundaryLabel : "show"  //hide
                    	}
	                },
	                subTick : {
	                	enable:false,
	                	relativeTickSize:0, //the diviosns relative to each minor Ticks if minor tick is 1hr, subTics will 30 minutes each
	                	subTickSize : null, //eg : [10,'minute'] ie [number, "unit"]
	                	//subTickFormatter : TODO,
	                	subTickStyle: {
	                		subTickLength:'full' ,//in pixels
	                		tickColor : "#00FF00",
	                		dashedLine:false,
	                		dashedStyle:[3,3] ,
	                		lineWidth : 1,
	                		tickRenderer: null//a function which will draw the ticks
	                	}
	                },
	                columnSummary : {
	                	enable:false,
	                	position:"top", //by default
	                	height: 25, // default in pixels
	                	summaryHeaderRenderer:null,
	                	summaryHeader : {
	                		clickAllowed : false,
	                		hoverable :  false
	                	},
	                	summaryTickRenderer :null, // for the ticks
	                	fullBackground :null, // for ticks
	                	clickAllowed : true, // for ticks
	                	selectionAllowed :false, // for ticks
	                	hoverable : true, // for ticks
	                	selectionStyle: {
	    	               	lineWidth: 1,
	    	               	lineColor: "rgba(255, 0, 0, 0.2)",
	    	               	fillColor :"rgba(255, 0, 0, 0.2)",
	    	               	type : "HEADER_ONLY"  // OR FULL (selection drawn full the plot height)
	                	}
	                },
	                topHeader : {
	                	enable :false,
	                	height: 0, // default in pixels
	                	fullBackground :null,
	                	customRenderer : null,
	                	clickAllowed : true,
	                	hoverable : true
	                },
	                colorDays : {
	                	enable: false,
	                	headerOnly : true,
	                	colorOn : "HEADER",//GRID OR BOTH
	                	colors: null // provide an array of colors of length 7 starting from monday to sunday in order
	                }
                },
                yaxis: {
                    autoscaleMargin: 0.02,
                    position: "left", // or "right"
                    max:10,
                    min:0,
                    showLabel:true,
                    labelBackgroundColor: "#FFFFFF",
                    backgroundLabelRenderer : null,
                    minTickSize:1, //made as default
                    verticalScrollExtendunit : 0.5,
					tickSize:1, //made as default
					defaultMarkings : {
	                    	enable: true, // specifically to show horizontal markings on Y axis
	                    	sameColorForMergedRows:  false,
	                    	size:1,
		                    lineWidth:1,
		                    lineColor: "#ededed",
		                    dashedLine:true,
		                    dashedStyle:[2,2],
		                    alternateRowColor:["#eefaff", "#ffffff"], //Row colour between the above markings
		                    rowColoringFor: "displayed" , //displayed/full  , full will color all the rows irrespective of displayed data
		                    gridLineRenderer : {
                					rendererCallback :null, //callback for drawing grid lines
                					lineRendererFor: "full"  //displayed/full  , full will color all the rows irrespective of displayed data
                			}
	                },
	                /*treeNode : { configure this,  if the rows should be displayed as tree structure
						 nodeLimit :1,
						 openMultiple : true =>multiple nodes can be opened  , false behaves like an accordion
						 nodeRenderer : "treeHeaderNodeRenderer",
						 displayData : true, // if data in the root Node  should be displayed
						 eventCallback : false, // event call back needed on click - default false and action will be expand/collapse.
						 footer : {
							 enable : true,
							 renderer : treeHeaderFooterRenderer,
							 width : 120,
							 borderWidth :1,
							 borderColor : "#000000"
						 }
					},*/
	                multiColumnLabel : {
	                		columns :[]		//columns is an array of columns that should be displayed as label
											/*columns:[{
																			headerText : "Room",
																			width: 10,
																			cellRenderer:"",
																			cellProperty :"room",
																			nodeLevel: 2,
																			sortable: true/false
																			comparator: A function 	 of the following type
																			comparator :  function(a, b) {
																					var result = 0;
																	            	if(a.data['allocatedTo'] > b.data['allocatedTo']) {
																	            		result  = 1;
																	            	} else if(a.data['allocatedTo'] < b.data['allocatedTo']) {
																	            		result= -1;
																	            	}
																	            	return result;
																				},
																				minWidth : 0 //default 5 for resizing case
																			}]*/


			                ,border : {
								width : 1,
								color :"#bababa"
							},
							header : {
								show : true,
								resizable : true,
								textFont : {
										size: 12,
										weight: "normal",
										family: "Tahoma",
										style :"normal",
										variant :""
								},
								textColor:"#000000",
								sortedArrowColor : "rgb(255,255,255)",
								unSortedArrowColor :"rgba(255,255,255, 0.4)",
								backgroundColor:"rgb(255, 248, 231)"  //only row header background
							}
	                },
	                transform: function (v) { return -v; },  // THis is mandatory to view lowest data on top of yaxis
				    inverseTransform: function (v) { return -v; }, // THis is mandatory to view lowest data on top of yaxis
				    rowFooter : {
				    	enable: false,
				    	width : 100, //in pixels
				    	borderWidth:1,
				    	borderColor:"#bababa",
				    	hoverable :true,
				    	clickable:true,
				    	footerRenderer:null,
				    	fullBackgroundColor : null,
		        		backgroundRendererCallbackFn: null

				    }
                },
                xaxes: [],
                yaxes: [],
                series: {
                    gantt: {
                        show: false,
                        canvasLayers : {
                			layerNames : null,
                			mainLayerIndex : null
                		},
                        rowIdAttribute : "id", //default rowId in rowHeaderObject
                        rowIdAttributeInTask : "rowId",  // the rowId reference in task
                        rowIdProviderCallBack:"rowIDProviderFunction",  // the call back function which  returns the rowId if rowIdAttributeInTask is not specified
                        startDateAttribute:"start", //startDate to be read for task or a call back function which will return the attribute(from 5.3)
                        endDateAttribute:"end",		//end Date to be read for task or a call back function which will return the attribute(from 5.3)

                        taskIdProviderCallBack: null, //default null means it expects an id attribute in task
                        lineWidth: 2, // in pixels
                        barHeight: .5, // in units of the y axis
                        minTickHeight:50, //in pixels added for resize horizontally
                        rowHeightProvider:null,  // is the call back function that returns the rowHeight from Chronos user
                        maxTotalRows:25 , // the no:of rows that the gantt will show maximum and this max Row that will be capped always.
                        fill: true,
                        font: { size: 10, style: "normal", weight: 'bold', family: 'sans-serif', variant: "normal"},//default set by Chronos for task Renderer base context
                        fontColor:["FFFFF"],
                        fillColor: ["#bdbdbd"],
                        align: "center", // or "top or bottom"
                        normalMaximumDaySpan:2, // the no:of days the task span
                        subTaskIdentifier:null, // function to call if a subtask is present
                        fullBackgroundColor:null, //background color for the whole canvas
                        fullBorderColor:null  ,
                        fullBorderWidth:1,
                        cacheTextAsImage :false, // cache this only for IE to increase speed of scrolling
                        cacheHeaderTextAsImage:false, //Cache this for header text to improve scrolling performance.
                        							//optimiseScrollOnArrowClick on scroll will work only if cacheHeaderTextAsImage is true
                        imagePreloadEndCallBack : null,  //triggers the function configured after textImage Cache
                        connections : {
							line : {
								lineRenderer :null,
								lineColor :"#000000",
								lineWidth : 1
							},
							node : {
								nodeRenderer :null,
								lineWidth :1,
								fillColor :"yellow",
								borderColor :"#000000", //for node box
								width :null, // in pixels now kept half the percentage o
								height:null , //in pixels
								fontColor:"#000000", // the color of the text written inside node
								font: { size: 10, style: "normal", weight: 'bold', family: 'sans-serif', variant: "normal"},
								visibleRangeOnly: true // true indicates whether to draw connection if both nodes are in visible range.
							},
							drawOnPriorityLayer :  false // Also ensure that series.gantt.priorityLayer is true
                        },
                        //enableWrappedRows:false,
                        wrappedRows : {
                        	enabled : false,
                        	expandMode : true, // true (default) - all rows will be expanded initially , false otherwise
                        	mergeWrapRows : false // default false  will not merge the wrapped row headers.
                        },
                        priorityProvider:null, // The function which returns a true/false to specify whether the task to be drawn on top of all other tasks
                        priorityLayer:true,
                        itemHeightPositioning: null, // example startPercentage :25,  //25% down from the rowHeight top . percentage with respect to series.gantt.barHeight
			    									//endPercentage :75,  //upto 75%  from the row top. This means the task is centered in the middle 50%
                        findItemOnGanttCallBack:null,
                        hoverItemCallBack : null, //from 5.3
                        //taskPadding : 3 // defaulted to the taskresize radius TODO later
                        cacheOffset: true // whether to cache offset
                    },
                    points: {
                        show: false,
                        radius: 3,
                        lineWidth: 2, // in pixels
                        fill: true,
                        fillColor: "#ffffff",
                        symbol: "circle"  // or callback
                    },
                    lines: {
                    	show: false,
                        // we don't put in show: false so we can see
                        // whether lines were actively disabled
                        lineWidth: 2, // in pixels
                        fill: false,
                        fillColor: null,
                        steps: false
                    },
                    bars: {
                        show: false,
                        lineWidth: 2, // in pixels
                        barWidth: 1, // in units of the x axis
                        fill: true,
                        fillColor: null,
                        align: "left", // or "center"
                        horizontal: false,
                        valueRenderer: null //to render value above the bar graph
                    },
                    shadowSize: 3,
                    highlightColor: null

                },
                grid: {
                    show: true,
                    aboveData: false,
                    color: ["#545454"], // primary color used for outline and labels
                    backgroundColor: null, // null for transparent, else color
                    borderColor: null, // set if different from the grid color
                    tickColor: null, // color for the ticks, e.g. "rgba(0,0,0,0.15)"
                    labelMargin: null, // in pixels .This will be taken for both axis if specified, else mention separately for axis
                    axisMargin: 10, // in pixels
                    borderWidth: 0, // in pixels the gap between label box and the plot margin
                    minBorderMargin: 3, // in pixels, null means taken from points radius

                    //markings: null, // array of ranges or fn: axes -> array of ranges
                    //markingsColor: "#f4f4f4", Cha
                    //markingsLineWidth: 1,

                    markings : { //Changed to inner style from 5.6
	                    markingsArray: null, // array of ranges or fn: axes -> array of ranges
	                    color: "#f4f4f4",
	                    lineWidth: 1,
	                    drawOnTop : true // ensure that markings are on top of default markings
                	},
                    // interactive stuff
                    clickable: false,
                    hoverable: true,
                    autoHighlight: true, // highlight in case mouse is on the task.Precondn: hoverable should be true
                    headerClickable: true, // enable click event on row headers
                    headerHighlight:true, //highlight the row header on Ctrl Press, shift press & on normal Click.
                    drawSelectionStyle: {
         	            	 lineWidth: 2,
         	            	 lineColor: "green",
         	            	 fillColor :"white"
                   },
                    drawHoverStyle : {
        	            	 lineWidth: 2,
        	            	 lineColor: "#ff000",
        	            	 fillColor :"#f4f4f4"
                    },
                    showCurrentTimeMarker:true, //to display the marker on current time
                    timeMarkerStyle : {
   	            	 	lineWidth	: 2,
   	            	 	lineColor	: "green",
   	            	 	dashedLine	: false,
	   	            	showTime : { // to show time on marker,  on mouse hover
		   	              	enable : false,
		   	              	timeFormat :"%b %d %h:%M %S",
		   	              	font : { color:"#000000" , size: 11, style: "normal", weight: 'bold', family: 'arial', variant: "normal" }
	   	            	 }
                    },
                    cornerBox: {
                    	enable:false, //if enabled, Clipping the gantt corners to prevent labels overlapping
                    	image: { path: null, height:10 , width:10}, // if given this this image will be drawn . You can overwrite this in r
                    	fillColor :"#FFFFFF", // to fill the corner area
                    	borderColor:"#FFFFFF", // to draw a border for the corner
                    	lineWidth:1, // the drawing linewidth
                    	cornerRendererCallbackFn:null, // the call back render function which will be triggered
                    	clickable : false
                    }
                },
                interaction: {
                    redrawOverlayInterval: 1000/60, // time between updates, -1 means in same flow
                    eventType:"HTML5", //	HTML5/JQUERY_DRAG for all drag operations
                    dataOnDemand : true, // The on demand data fetch is enabled by default
                    extraViewFetch : true, // the default fetching of next and previous view
                    extraViewFetchFactor: {
                    	 horizontal :  1, // in percentage of the view area 1=> 100% means full View horizontally will be fetched
                    	 vertical :  1 // in percentage of the view area 1=> 100% means full View vertically will be fetched
                    },
                    extraFetchFactor : {
                    	horizontal :  1, // in percentage of the view area 1=> 100% means extra full View  horizontally(date) will be fetched
                    	vertical :  1 // in percentage of the view area 1=> 100% means extra full View vertically(yValue) will be fetched
                    	//Provide values 0 if extra fetch is not needed
                    },
                    defaultFocus : true,
                    errorHandle : "throw"  //ignore/throw Eg:  canvas dimensions is 0 we throw error and terminate execution.
                    					//if ignore it stops further drawing, instead of terminating the execution
                },
                hooks: {},
                multiScreenFeature : {
                	enabled :  false //if scroll link is added, it will be enabled
                },
				chronosWorker : {
					enabled: false //default disabled
				}
            };
          //object attributes
          var ctx = null,  octx = null,  hctx = null,
        	canvasLayerMap = [],
        	mainLayerName = null,
            canvas = null,      // the base canvas for the plot itself
	        overlay = null,     // canvas for interactive stuff on top of plot   - mainly for HTML5 dag & pan
	        highlightCanvas = null, //the canvas for highlighting tasks

	        xaxes = [], yaxes = [],
	        canvasWidth = 0, canvasHeight = 0,
	        plotWidth = 0, plotHeight = 0,
	        hooks = {
	            processOptions: [],
	            processRawData: [],
	            processDatapoints: [],
	            draw: [],
	            bindEvents: [],
	            drawHighLightOverlay: [],
	            shutdown: [],
	            bindZoomEvents : [],
	            drawSeries: [],
	            updateGanttData :[],
	            addTaskInBucket:[],
	            removeTaskFromBucket:[]
	        },
	        //For row header highlight
	        initialHighlightedNode = null,
	        initialHighlightedRowYValue = null,
	        /* These are specific to a plot*/
	        //currently loaded data in the map for the two axis
	        currentLoadedData = {
        		yValueMin : 0,
    	        yValueMax:0,
    	        fromDate:0,
    	        toDate:0
        	},
        	 currentVisibleData = {
        		yValueMin: 0,
    	        yValueMax: 0,
    	        fromDate: 0,
    	        toDate: 0
        	},
        	viewBucket = {
        		    min : 0,
        		    max :0
    		},

           //	EXTRA_FETCH_FACTOR = 0,
           	TREE_ROWID_CONSTANT ="CHRONOS_TREE_ROWID_",
        	hoverItem = null,
        	paddedHoverItem = null,
        	hoverRowItem = null,
        	hoveredArea = null,
        	shadowItem = null, // to store dragging effect posn
        	shadowHeaderItem = null,
        	resizeItem = null,
        	hoveredHeaderGridColumn = null,
        	eventMode = "NONE",
        	disableClickOnDrag  = false,
        	isDragging =false, // for ensuring s=dragStrt & drag End
        	eventHolder = null, // jQuery object that events should be bound to
        	cachedOffset = null,
        	plotOffset = { left: 0, right: 0, top: 0, bottom: 0},
            barBottom =null,
            barTop = null,
            DATA_MATRIX_ROW_SIZE=0, //default
            DATA_MATRIX_COLUMN_SIZE=0,//default
            TOTAL_ROW_AVAILABLE = 0,
            highlights=[],
            rectangleFrameHighlights =[],
            rowHighlights =[],
            tickHighlights=[],
            highlightedTick = {},
            blinkingObjects=[],
            blinkingSequenceNumber = 0,
            blinkingTimer = null,
            markerTime =null,
            hiddenRows =[],
            newInsertedRows =[],
            currentMousePosition= {},
            interimScrollMode = false,
            isScrolling  = false,
            textRenderer = null,
            //This dummy is for creating text on canvas
            cachedTextMap = [],
            cachedTextMaxWidthMap = [],
            cachedTextSizeMap = [], // This map holds the cached text for rendering
            textImagePreloadContext = null,
            //headerImage = null,
            preloadRowIndex = -1,
	        preloadColumnIndex = -1,
	        currentRowNodeHeightMap =  [],
	        columnIndexCoordinateMap =[], //keeps rowHeader index as key and value as  the no:of Row height in rows to be drawn for each header
	        mouseMoveTimeOut = null,
	        connections = [],
	        connectionNodesMap = null,
	        forcefullyExpandNodeList = [],
	        //Declarations for handling wrappedRowDisplay
	        // actualFirstWrapDisplayMap = [],//keeps key as actualYValye and value as the first displayedYValue of the Row (wrapIndex = 0).
	        //In normal case it will be the displayedyValue. Used in all cases to get the actual and displayed mapping

			//Declarations for scrollLink plugin
			screenId = 0,
			plotLabel = null,
			trackedTaskForMarking = null, //it can be a task or area. if area it will have start and end attributes only
			freezeTracker =false, //flag to check if tracker need to be moved or freezed

	        //Declarations for tile caching
	        tileArrayMap = {},
	        scrollDirection = null,
            isScrollPositive = null,
            oldXaxisMin  = 0,
			oldXaxisMax = 0,
			oldYaxisMin  = 0,
			oldYaxisMax  = 0,
            nodeParseRowIndex = 0, // the actual row index when the node is not hidden
            actualStartRowIndex = 0, // the actual row index of  the node in tree if hidden or not
            cornerObjects = null,
            //tileQueueListForUpdation = null,
            //queueTimer = null,
            isTaskRendererAFunction = true,
            isYLabelRendererAFunction = true,
            isXLabelRendererAFunction = true,
            isCornerRendererAFunction = true,
            isPriorityProviderAFunction = true,
            rowHotSpotMap = [],
            columnHeaderSelectObject = {}, //object holding the selected area when dragging on column headers

            actionType = null,
            actionData = null,
            actionTime = null,
            initialyCollapsed = null,
            touchStarted = false,
            plot = this;

	        /////////////////////////////////////////////////////////
	        //GOBAL ACCESS
	        //Following are public methods and variables specific to plot
            plot.forcedDraw = true,
          	plot.touchStarted =  touchStarted;
	        plot.hooks = hooks;
	        plot.executeHooks = executeHooks;
	        plot.cachedTextMap = cachedTextMap;
	        plot.cachedTextMaxWidthMap = cachedTextMaxWidthMap;
	        plot.cachedTextSizeMap = cachedTextSizeMap;
	        // public functions
			plot.triggerClickHoverEvent = triggerClickHoverEvent;
			plot.triggerGanttClickHoverEvent = triggerGanttClickHoverEvent;
			plot.findNearbyItem = findNearbyItem;
			plot.findItemOnGantt = findItemOnGantt;
			plot.findHoveredArea = findHoveredArea;
			plot.findStartAndEndPoints = findStartAndEndPoints;
			plot.drawGanttMarker = drawGanttMarker;
			plot.removeGanttMarker = removeGanttMarker;
			plot.setData = setData;
	        plot.setupGrid = setupGrid;
	        plot.draw = draw;
          	plot.drawAxisLabels = drawAxisLabels;
	        plot.yValueNodeDetailsMap = null; //yValue key and  nodes array in that row as value.

	        plot.measureHeightOfTextWithThisFont = measureHeightOfTextWithThisFont;
	        //Functions for manipulating rows
	        plot.hideRows = hideRows;
	        plot.unHideRows = unHideRows;
	        plot.unHideRowsBetween = unHideRowsBetween;

	        plot.startBatchUpdate = startBatchUpdate;
	        plot.endBatchUpdate = endBatchUpdate;
	        plot.insertRowAfter = insertRowAfter;
	        plot.insertRowBefore = insertRowBefore;
	        plot.deleteRow = deleteRow;
	        plot.addRowInTree = addRowInTree; // only for tree
	        plot.reArrangeRows=reArrangeRows;

	        plot.getCurrentRowIndex = getCurrentRowIndex;

	        //function to be called from Scheduler if scheduler is to be used
	        plot.executeSchedulerJob = executeSchedulerJob;
	        plot.setInterimScrollMode = setInterimScrollMode;
	        plot.setScrollDirection = setScrollDirection;
	        plot.setConnections = function(newConnections) {
	        	connections = newConnections;
	        };
	        plot.getConnections = function() {
	        	return connections;
	        };
	        plot.setConnectionNodesMap = function(newMap) {
	        	connectionNodesMap = newMap;
	        };
	        plot.getConnectionNodesMap = function() {
	        	return connectionNodesMap;
	        };

	        plot.getTileArrayMap = function() {
	        	return tileArrayMap;
	        };
	        plot.setTileArrayMap = function(newTileArrayMap) {
	        	tileArrayMap = newTileArrayMap;
	        };
	        plot.getScrollDirection = function() {
	        	return scrollDirection;
	        };
	        plot.isScrollPositive = function() {
	        	return isScrollPositive;
	        };
			plot.clearHeaderImage = function() {
				  oldXaxisMin  = 0;
				  oldXaxisMax  = 0;
				  oldYaxisMin  = 0;
				  oldYaxisMax  = 0;
			};
			plot.setOldBounds = function(currentXaxisMin, currentXaxisMax, currentYaxisMin, currentYaxisMax) {
				 oldXaxisMin = currentXaxisMin;
		    	 oldXaxisMax = currentXaxisMax;
		    	 oldYaxisMin = currentYaxisMin;
		    	 oldYaxisMax = currentYaxisMax;
			};

	        plot.setTransformationHelpers = setTransformationHelpers;
	        plot.drawTaskFromMap = drawTaskFromMap;

	        plot.getInterimScrollMode = function() {
	        	return interimScrollMode;
	        };

	        plot.isScrolling = function() {
	        	return isScrolling;
	        };

	        plot.setScrolling = function(scrollingflag) {
	        	isScrolling = scrollingflag;
	        };

	        plot.getPlaceholder = function() { return placeholder; };
	        plot.getCanvas = function() { return canvas; };//  For Scrollbars
	        plot.getCanvasContext = function() {
	        	return ctx;
	        };
	        plot.getHighlightContext = function() {
	        	return hctx;
	        };
	        plot.getCornerObjects = function() {
	        	return cornerObjects;
	        };
	        //To access from Navigate plugin
	        plot.getEventMode = function() {
	           	return eventMode;
	        };
	        plot.setEventMode = function (newEventMode) {
	           	eventMode = newEventMode;
	        };
	        plot.getDisableClickOnDrag = function() {
	           	return disableClickOnDrag;
	        };
	        plot.setDisableClickOnDrag = function (flag) {
	        	disableClickOnDrag = flag;
	        };


	        plot.getIsDragging = function() {
	           	return isDragging;
	        };
	        plot.setIsDragging = function(isDraggingNew) {
	        	isDragging = isDraggingNew;
	        };
	        plot.getHoverItem = function() { return hoverItem; };
	        plot.getShadowItem = function() { return shadowItem; };
	        plot.setShadowItem = function(newItem) {
	        	shadowItem = newItem;
	        };
	        plot.getShadowHeaderItem = function() { return shadowHeaderItem; };
	        plot.setShadowHeaderItem = function(newItem) {
	        	shadowHeaderItem = newItem;
	        };
	        plot.getResizeItem = function() { return resizeItem; };
	        plot.getPreviousClickedItem = function() { return this.previousClickedItem; };
	        plot.setPreviousClickedItem = function(item) {
	        	this.previousClickedItem = item;
	        };

	        plot.getHoveredHeaderGridColumn = function() { return hoveredHeaderGridColumn ; };
	        plot.getColumnIndexCoordinateMap = function() { return columnIndexCoordinateMap; };

	        plot.getColumnHeaderSelectionObject = function() { return columnHeaderSelectObject; }
	        plot.setColumnHeaderSelectionObject = function(modifiedObject) {
	        	 columnHeaderSelectObject = modifiedObject;
	        };
	        plot.clearColumnHeaderSelection = function() {
	        	 columnHeaderSelectObject = null;
	        };

	        plot.setCurrentMousePosition = function(currentPosition) {
	        	currentMousePosition  = currentPosition;
	        };
	        plot.getCurrentMousePosition = function() {
	        	return currentMousePosition;
	        };
	        plot.getHoveredRowHeader = function() { return hoverRowItem; };
	        plot.setupRowsForCanvasHeight = setupRowsForCanvasHeight;
	        plot.currentLoadedData = currentLoadedData;
	        plot.currentVisibleData = currentVisibleData;


	        plot.addTaskByUserToHighlightList = addTaskByUserToHighlightList;
	        //plot.EXTRA_FETCH_FACTOR = EXTRA_FETCH_FACTOR;
	        plot.TREE_ROWID_CONSTANT = TREE_ROWID_CONSTANT;
	        plot.addAllItemsInRangeToRectangleHighlights = addAllItemsInRangeToRectangleHighlights; //add to highlights if 5th parameter (highlightitem) present
	        //plot.callFetchDataIfRequired = plot.callFetchDataIfRequired;
	        //plot.callDataLoadFunction = plot.callDataLoadFunction;
	        plot.clearHighlightOverlay = clearHighlightOverlay;
	        plot.drawHighLightOverlay = drawHighLightOverlay;
	        plot.clearAllRectangleSelectHighlightList = clearAllRectangleSelectHighlightList;
		    plot.addSelectedListToOriginalHighlightlist = addSelectedListToOriginalHighlightlist;
		    plot.isHighlightedEntity = isHighlightedEntity;
		    plot.unhighlightTask = unhighlightTask;

		    plot.tickHighlights = tickHighlights;
		    plot.highlightedTick = highlightedTick;
			plot.addTaskToHighlightList = addTaskToHighlightList;

			plot.setScrollRangeAccordingToData = setScrollRangeAccordingToData;
			//HOTSPOTS
		    plot.setHotSpots = setHotSpots;
			plot.getRowHotSpotMap = function () {
			    return rowHotSpotMap;
			};
			plot.setRowHotSpotMap = function (newMap) {
			    rowHotSpotMap = newMap;
			};

			//WRAP Additions
			plot.areWrapRowsEnabled = function() {
				return options.series.gantt.wrappedRows.enabled;
			};
			plot.viewBucket  = viewBucket;
			plot.getCurrentColumnIndex = getCurrentColumnIndex ;
			plot.hiddenRows = hiddenRows;
			plot.newInsertedRows = newInsertedRows;

			//scrollLink plugin setter/getter
			plot.setScreenId = function(newScreenId) {
				screenId = newScreenId;
			};
			plot.getScreenId = function() {
				return screenId;
			};
			plot.setPlotLabel = function(newPlotLabel) {
				plotLabel = newPlotLabel;
			};
			plot.getPlotLabel = function() {
				return plotLabel;
			};
			//this task will be available in the initiating plot only. ie if the task exists.
    		//User will be setting this API. For linking the tracker this API will not work
			plot.setTrackedTask = function(taskId) {
				var idTaskMap =  plot.getDataMap();
				if(idTaskMap == null || !Object.keys(idTaskMap).length) {
					return;
				}
				var series = plot.getSeries();
				if(!taskId) {
					trackedTaskForMarking = null; //clear the tracked task on setting null
				} else {
					trackedTaskForMarking = idTaskMap[taskId.toString()] ;
					//initially draw the lines on exactly at the start and end of task.
					 var taskStartPosition  =  parseInt(series.xaxis.p2c(trackedTaskForMarking.start)); //canvas pixels
		        	var taskEndPosition  =  parseInt(series.xaxis.p2c(trackedTaskForMarking.end)); //canvas pixels
		        	var taskWidth = taskEndPosition - taskStartPosition ; //in pixels
		        	trackedTaskForMarking.drawMouseX = taskStartPosition ;
		        	trackedTaskForMarking.width = taskWidth; // for passing to other task.

		        	var actualYValueOfRow = series.rowYvalueMap[trackedTaskForMarking.rowId];
		        	if (plot.areWrapRowsEnabled() ) {     //On demand wrap cannot be predicted use scrollToTimeAndItemRowOnTop instead
	       	    		var wrapIndex = plot.getTaskIdWrapIndexMap()[trackedTaskForMarking.chronosId];
	       	    		trackedTaskForMarking.drawMouseY =  series.yaxis.p2c(series.actualFirstWrapDisplayMap[actualYValueOfRow]  + wrapIndex);
		        	} else {
		        		trackedTaskForMarking.drawMouseY =  series.yaxis.p2c(actualYValueOfRow);
		        	}
					plot.setTrackedTaskForMarking(trackedTaskForMarking);
				}
				plot.drawHighLightOverlay(); // draw the first exact lines on start and end
				//following to prevent firing mouse move action immediately
				mouseMoveTimeOut = true;
				setTimeout(function() {
					mouseMoveTimeOut = null;
		          }, 100);

			};
			// For linking tracker across panes, use this API
			/**
			 *  trackedTaskFullData should have the start and end
			 */
			plot.setTrackedTaskForMarking = function (trackedTaskFullData) {
				trackedTaskForMarking = trackedTaskFullData;
			};

			plot.getTrackedTask = function() {
				return trackedTaskForMarking;
			};
			/**
			 * Area to be set from the end of taskFrom(milliseconds) and start of taskTo(milliseconds)
			 * @trackInEmptyPlot is added to set track area even if there is no data for the plot.
			 * Set to true if empty plot need to be tracked. default is false
			 */
			plot.setTrackedArea = function(taskFrom, taskTo, trackInEmptyPlot) {
				if(!trackInEmptyPlot) { //ISRM 7189
					if(!Object.keys(plot.getDataMap()).length) {
						return;
					}
				}
				if(!taskFrom  || !taskTo) {
					trackedTaskForMarking = null;
				} else {
					trackedTaskForMarking ={ };
					trackedTaskForMarking.start  = taskFrom;
					trackedTaskForMarking.end = taskTo;
					var series = plot.getSeries();
					//initially draw the lines on exactly at the start and end of task.
				    var taskStartPosition  =  parseInt(series.xaxis.p2c(trackedTaskForMarking.start)); //canvas pixels
		        	var taskEndPosition  =  parseInt(series.xaxis.p2c(trackedTaskForMarking.end)); //canvas pixels
		           	trackedTaskForMarking.drawMouseX = taskStartPosition;
		           	trackedTaskForMarking.drawMouseY = plot.getCurrentMousePosition().currentMouseY;
		        	trackedTaskForMarking.width = taskEndPosition - taskStartPosition ; //in pixels;
					plot.setTrackedTaskForMarking(trackedTaskForMarking);
					plot.drawHighLightOverlay(); // draw the first exact lines on start and end
				}

			};
			plot.getTrackedArea = function() {
				return trackedTaskForMarking;
			};
			/**
			 * flag true/ false , if true if you want to freeze the tracker in any other scroll position,
			 * provide the freezePoint . other wise , the tracker will be freezed on the tracked task.
			 * ie wrt the start and end of the task and  the row yValue of the corresponding task.
			 * freezePoint will have x as time in millis and y as yValue
			 * eg:  freezePoint= {
    	 		x : item.x,
    	 		y : item.y
    	 	}
			 */
			plot.freezeTrackerMovement = function(flag, freezePoint) {
				freezeTracker = flag;
				if(freezePoint != null) {
	    			var trackedTaskForMarking = plot.getTrackedTask();
	    			if(trackedTaskForMarking != null) {
	    				trackedTaskForMarking.followTime =  freezePoint.x,
	    				trackedTaskForMarking.followRowyValue =  freezePoint.y;
	    			}
				}
    		};

			plot.isTrackerFreezed = function() {
				return freezeTracker;
			};

	        //Public to application
	        plot.getFillStyle=getFillStyle;
	        plot.drawText=drawText;
			plot.removeTaskFromBucket = removeTaskFromBucket;
			plot.removeTasksFromBucket = removeTasksFromBucket;
			plot.addTaskInBucket = addTaskInBucket;
		    plot.addNewTasksAndRowHeadersToBucket = addNewTasksAndRowHeadersToBucket;
		    plot.resetRowColumnDataRangeForGantt = resetRowColumnDataRangeForGantt; //FOR REALTIME DATA FTECH AND NON-REAL TIME
		    plot.updateRowOrderAndRedrawGantt = updateRowOrderAndRedrawGantt; //WHEN onDamand is false- NOT REALTIME
	        plot.clearDataAndRefetchDataForGantt = clearDataAndRefetchDataForGantt;
	        plot.resetRootTreeNodeAndColumnRangeForGantt = resetRootTreeNodeAndColumnRangeForGantt;
	        plot.enablePanMode = enablePanMode;
	        plot.enableRectangleSelectMode = enableRectangleSelectMode;
	        plot.enableRectangleTaskCreateMode = enableRectangleTaskCreateMode;
			plot.enableTaskResizeMode = enableTaskResizeMode;

	        //This will return the arrays of all rowHeader objects passed from the server which are there in client
	        plot.getRowHeaderArray = getRowHeaderArray;
	        //Added methods to user
	        plot.getCanvasXCoordinateForTime = getCanvasXCoordinateForTime;
	        plot.setTimeMarker = setTimeMarker;
	        //this will return all the highlighted task items   in a 1D array
	        plot.getAllHighlights = getAllHighlights;
	        //this will return a 1D array of  all the highlighted row Ids
	        plot.getAllRowHighlights = getAllRowHighlights;
	        plot.getRectangleFrameHighlights = getRectangleFrameHighlights;
	        //This will add this task with this ID to highlighted list
	        plot.highlightAnEntity=highlightAnEntity;
	        //This will remove the task with this ID from the highlighted list and redraw
	        plot.removeHighlightForEntity = removeHighlightForEntity;

	        //This will clear all highlights added by the user as well as by the fw(hover & selection)
	        plot.clearAllhighlights = clearAllhighlights;
	        //This will add this row with this ID to highlighted list
	        plot.highlightARow=highlightARow;
	        //This will add this rowIds to the highlighted list
	        plot.highlightRows = highlightRows;
	        //This will remove the row with this ID from the highlighted list and redraw the plot
	        plot.removeHighlightForRow = removeHighlightForRow;
	        //This will clear all highlights added for rows in the plot
	        plot.clearAllRowhighlights = clearAllRowhighlights;
	        plot.updateGanttData = updateGanttData;
	        plot.reBucketData2DMap = reBucketData2DMap;

	        //This will return a 1D array of all ids of items in with this rowId
	        plot.getAllItemsInARow = getAllItemsInARow;
	        plot.addObjectToBlinkingList = addObjectToBlinkingList;
	        plot.addObjectsToBlinkingList = addObjectsToBlinkingList;
	        plot.removeObjectFromBlinkingList = removeObjectFromBlinkingList;

	        // public to application for linking Scrollbars
	        plot.setHorizontalScrollBar = setHorizontalScrollBar;
	        plot.setVerticalScrollBar = setVerticalScrollBar;
	        plot.scrollToPosition = scrollToPosition;
	        plot.scrollToTimeAndYvalueOnTop = scrollToTimeAndYvalueOnTop;
	        plot.scrollToCenterPosition = scrollToCenterPosition;
	        plot.scrollToDateRangePosition=scrollToDateRangePosition;
	        plot.scrollToTimeAndItemRowOnTop = scrollToTimeAndItemRowOnTop;

	        //metadata additions
	        plot.actionType = actionType;
	        plot.actionData = actionData;
	        plot.actionTime = actionTime;
	        plot.initialyCollapsed = initialyCollapsed;
	        plot.triggerTreeCollapseAction = triggerTreeCollapseAction;
	        //Accessed from navigate plugin
	        plot.getDataMatrixRowSize = function() {
	        	return DATA_MATRIX_ROW_SIZE;
	        };
	        plot.getDataMatrixColumnSize = function() {
	        	return DATA_MATRIX_COLUMN_SIZE;
	        };
	        plot.getPlotOffset = function() { return plotOffset; };
	        plot.width = function () { return plotWidth; };
	        plot.height = function () { return plotHeight; };

          /**
			 * Overridden version of JQuery offset method to give support to Shadow DOM.
			 *
			 * @param {HTMLCanvasElement} ref
			 * @param {Object} options
			 */
			function getOffset(ref, options) {
				// Preserve chaining for setter
				if ( arguments.length  > 1) {
					return options === undefined ?
						ref :
						ref.each( function( i ) {
							jQuery.offset.setOffset( ref, options, i );
						} );
				}

				var doc, docElem, rect, win,
					elem = ref[ 0 ];

				if ( !elem ) {
					return;
				}

				// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
				// Support: IE <=11 only
				// Running getBoundingClientRect on a
				// disconnected node in IE throws an error
				if ( !elem.getClientRects().length ) {
					return { top: 0, left: 0 };
				}

				rect = elem.getBoundingClientRect();

				doc = elem.ownerDocument;
				docElem = doc.documentElement;
				win = doc.defaultView;

				return {
					top: rect.top + win.pageYOffset - docElem.clientTop,
					left: rect.left + win.pageXOffset - docElem.clientLeft
				};
		    }

	        plot.offset = function () {
	           // var o = eventHolder.offset();
	        	var plotOptions = plot.getOptions();

	        	if (!plotOptions.series.gantt.cacheOffset) {
	        		return getOffset(eventHolder);
	        	}
	            return cachedOffset;
	        };

	        //to access from scrollbar
	        plot.getEventHolder= function () {
	        	return eventHolder;
	        };
	        plot.getBarBottom = function() {
	        	return barBottom;
	        };
	        plot.getBarTop= function() {
	        	return barTop;
	        };

	        plot.getSeries = function () {
	        	return series;
	        }; //ASSUMPTION ONLY ONE SERIES FOR A GANTT

	        plot.setSeries = function(newSeries) {
	        	series = newSeries;
	        };

	        //NOTE: TO SUPPORT OTHER CHARTS AND ITS PLUGINS without modifications
	        plot.getData = function () {
	        	return series; };


	        //This is the ID Task Map which the user access to get an item using key-id
	        plot.getDataMap = function() {
	        	return series.dataMap;
	        };
	        //This will return the map with keys rowId and the values as indexes --0,1,2,3,...
	        plot.getRowYvalueMap = function() {
	        	return series.rowYValueMap;
	        };
	        plot.getAxes = function () {
	            var res = {};
	            $.each(xaxes.concat(yaxes), function (_, axis) {
	                if (axis)
	                    res[axis.direction + (axis.n != 1 ? axis.n : "") + "axis"] = axis;
	            });
	            return res;
	        };
	        plot.allAxes =  allAxes;
	        plot.getXAxes = function () { return xaxes; };
	        plot.getYAxes = function () { return yaxes; };
	        plot.c2p = canvasToAxisCoords;
	        plot.p2c = axisToCanvasCoords;
	        plot.getOptions = function () { return options; };
	        plot.unhighlight = unhighlight;
	        plot.pointOffset = function(point) {
	            return {
	                left: parseInt(xaxes[axisNumber(point, "x") - 1].p2c(+point.x) + plotOffset.left),
	                top: parseInt(yaxes[axisNumber(point, "y") - 1].p2c(+point.y) + plotOffset.top)
	            };
	        };
	        //Added to include testcases handling
	        plot.onMouseMove = onMouseMove;
			plot.onMouseDown = onMouseDown;
			plot.onMouseUp = onMouseUp;
			plot.onMouseLeave = onMouseLeave;
			plot.onClick = onClick;
			plot.onDoubleClick = onDoubleClick;

			plot.reInitialize = reInitialize;

	        plot.shutdown = shutdown;
	        plot.startPreLoadTextImage = startPreLoadTextImage; // this initiated in appliction code aftyer updateData

	        plot.resize = function () {
	            getCanvasDimensions();
	            resizeCanvas(canvas);
	            resizeCanvas(overlay);
	            resizeCanvas(highlightCanvas);
	            for (var eachLayerName in canvasLayerMap) { //copy the same in base context to all canvas context in layerMap
	            	 resizeCanvas(canvasLayerMap[eachLayerName].canvas);
	            }
	        };
	        plot.getCanvasLayerMap = function() {
	        	return canvasLayerMap;
	        };

	        plot.triggerCallBackRenderer = triggerCallBackRenderer;
	        plot.iterateNodeRecursively = iterateNodeRecursively;

	        initPlugins(plot);
	        parseOptions(options_);
	        setupCanvases();
	        setData(data_);


        //Functions for Scroll bars
        function setHorizontalScrollBar(hScrollBar) {
        	plot.horizontalScrollBar = hScrollBar;
        	if(plot.horizontalScrollBar != null) {
        		plot.horizontalScrollBar.addScrollableObject(plot);
        	}

        	var scrollRange = options.xaxis.scrollRange;
        	if(!scrollRange) {
        		return;
        	}
        	plot.horizontalScrollBar.setAxisValues(scrollRange[0], scrollRange[1]);
        	plot.horizontalScrollBar.setViewValues(options.xaxis.min, options.xaxis.max);
        	plot.horizontalScrollBar.redrawScrollBox();

        }

        function setInterimScrollMode(interimScrollmode) {
        	interimScrollMode = interimScrollmode;
        }
        function setScrollDirection(scrollingDirection, isPositiveScroll) {
        	scrollDirection = scrollingDirection;
        	isScrollPositive = isPositiveScroll;
        }

        function setVerticalScrollBar(vScrollBar) {

        	plot.verticalScrollBar = vScrollBar;
           	if(plot.verticalScrollBar != null) {
        		plot.verticalScrollBar.addScrollableObject(plot);
        	}
        	var scrollRange = options.yaxis.scrollRange;
        	if(!scrollRange) {
        		return;
        	}
        	plot.verticalScrollBar.setAxisValues(scrollRange[0], scrollRange[1]);
        	//Don't set view values and draw ScrollBox first as it needs to check the maximum Rows
        	//plot.verticalScrollBar.setViewValues(options.yaxis.min, options.yaxis.max);
        	//plot.verticalScrollBar.redrawScrollBox();
        }
        /*
         * time for horizontal axis and rowId for vertical axis
         * time - will be the index of values in time in milliseconds
         * rowId  - will be the values in yaxis values  eg: crew20
         */
        //This will position the row and column in center
        function scrollToCenterPosition(time , rowId) {
        	var viewValue, diff, halfValue,  min, max;
        	var currentSeries = plot.getSeries();
        	if(time != null) {
        		viewValue = plot.horizontalScrollBar.getViewValues();
       		 	diff = (viewValue.maxViewValue - viewValue.minViewValue);
       		 	halfValue = diff/2;

       		 	if( (window['console'] !== undefined) ){
       		 		//console.log("time  for rowId - " + rowId + "  == " + time);
       		 	}
	        	min = time - halfValue;
	        	max = min + diff;
	        	//console.log(min + " ,  " + max);
	        	//clip boundaries
	        	plot.capXValuesAndFetchData(min, max);

        	}
       		if(rowId != null) {
        		viewValue = plot.verticalScrollBar.getViewValues();
       		 	diff = (viewValue.maxViewValue - viewValue.minViewValue);
       		 	halfValue = Math.round(diff/2);
       		 	var actualYValueOfRow = currentSeries.rowYvalueMap[rowId];   //(the 0, 1, 2 yValue for each rows -not hidden)
       		 	if(actualYValueOfRow == undefined) {
    		 		return -1; // In case of tree if the node is collapsed/hidden
    		 	}

	        	 if (plot.areWrapRowsEnabled() ) {
        			var displayedYValueOfRow = currentSeries.actualFirstWrapDisplayMap[actualYValueOfRow];
        			//wrap Index is always zero for the rowIds passed as we point always to the firts row. So need not use here
	       			min =  displayedYValueOfRow  - options.yaxis.verticalScrollExtendunit;
       				//console.log("actualYValueOfRow " , actualYValueOfRow ,   "displayedYValueOfRow : " , displayedYValueOfRow  , " min  ", min) ;
       				plot.capYValuesAndFetchData(min, (min + diff));
       			}   else {
       				min = actualYValueOfRow - halfValue;
       		 		max = min + diff;
       				plot.capYValuesAndFetchData(min, max);
       			}
       		}
        }
        /**
         * time will be in milliseconds
         * actualYvalue - will be set as the view min yValue
         * Note : This is not supported for on demand data call(for wrap)
         */
        function scrollToTimeAndYvalueOnTop(time , actualYvalue) {
        	var viewValue, diff, min, max;
            var currentSeries = plot.getSeries();
           	if(time != null) {
        		viewValue = plot.horizontalScrollBar.getViewValues();
       		 	diff = (viewValue.maxViewValue - viewValue.minViewValue);
	        	min = time;
	        	max = min + diff;
	        	plot.capXValuesAndFetchData(min, max);
        	}
        	if(actualYvalue != null) {
        		viewValue = plot.verticalScrollBar.getViewValues();
       		 	diff = (viewValue.maxViewValue - viewValue.minViewValue);

	        	if (plot.areWrapRowsEnabled() ) {     //On demand wrap cannot be predicted use scrollToTimeAndItemRowOnTop instead
        			var displayedYValueOfRow = currentSeries.actualFirstWrapDisplayMap[actualYvalue];
        			var wrapIndex = plot.getWrapIndexDisplayMap()[displayedYValueOfRow] || 0;
       				min =  displayedYValueOfRow + wrapIndex - options.yaxis.verticalScrollExtendunit;
       				//console.log(actualYValueOfRow , " WRAP CASE Y setting to ",  min , min + diff ," wrapIndex  " , wrapIndex , " displayedYValueOfRow " , displayedYValueOfRow);
       				plot.capYValuesAndFetchData(min, min + diff);
       			}  else {
       				min = actualYvalue - options.yaxis.verticalScrollExtendunit;
	        		max = min + diff;
	        		plot.capYValuesAndFetchData(min, max);
       			}
        	}

        }
        /*
         * time for horizontal axis and rowId for vertical axis
         * time - will be the index of values in time in milliseconds
         * rowId  - will be the values in yaxix values  eg: crew20
          This will position the time in the left most area of plot and
          row to the top most area of plot */

        function scrollToPosition(time, rowId, resetCurrentRowId) {
        	var viewValue, diff, min, max;
            var currentSeries = plot.getSeries();
           	if(time != null) {
        		viewValue = plot.horizontalScrollBar.getViewValues();
       		 	diff = (viewValue.maxViewValue - viewValue.minViewValue);
	        	min = time;
	        	max = min + diff;
	        	plot.capXValuesAndFetchData(min, max);
        	}
        	if(rowId != null) {
        		viewValue = plot.verticalScrollBar.getViewValues();
       		 	diff = (viewValue.maxViewValue - viewValue.minViewValue);
       		 	var actualYValueOfRow = currentSeries.rowYvalueMap[rowId];
       		 	//console.log("Actual yValue of the row", actualYValueOfRow);
       		 	if(actualYValueOfRow == undefined) {
       		 		return -1; // In case of tree if the node is collapsed/hidden
       		 	}

        		if (plot.areWrapRowsEnabled() && currentSeries.actualFirstWrapDisplayMap) {
        			var displayedYValueOfRow = currentSeries.actualFirstWrapDisplayMap[actualYValueOfRow];
        			//wrap Index is always zero for the rowIds passed as we point to teh firts row. So need not calculate
       				min =  displayedYValueOfRow  - options.yaxis.verticalScrollExtendunit;
       				//console.log(actualYValueOfRow , " WRAP CASE Y setting to ",  min , min + diff ," wrapIndex  " , wrapIndex , " actualYValueOfRow  " , actualYValueOfRow , " displayedYValueOfRow " , displayedYValueOfRow);
       				plot.capYValuesAndFetchData(min, min + diff);
       			}  else {
    	          	min = actualYValueOfRow - options.yaxis.verticalScrollExtendunit;
             		max = min + diff;
             		plot.capYValuesAndFetchData(min, max);
       			}
       			if(!resetCurrentRowId){
       				plot.currentScrollRowId = rowId;
       			} else{
       				plot.currentScrollRowId = null;
       			}
        	}
		 }
        /*
         * This method will move the gantt to the start time
			of the item and to the respective rowId of the item
        	This is more useful to scroll to a correct wrapped row
		 	if the item is drawn on wrapped rows and data is fetched onDemand
         * time  - the time of the task object to point to .the time will be the left most time.
         * item - the task object to point to top. The corresponding row will be the top row.
         * Eg :
         *  var item = {
				 rowId : "Flight023",
				 chronosId : "DSS023-20-1"  //chronosId will be generated only if draw is doen with correct wrapIndex
			}
         */
        function scrollToTimeAndItemRowOnTop(time , item) {
        	var viewValue, diff, min, max;
            var currentSeries = plot.getSeries();
            var rowId = item.rowId; //default rowId attribute
         // the data passed to request metatdata
            plot.actionType = "scrollToTimeAndItemRowOnTop";
            plot.actionData = {
            		time : time,
            		item  :item
            }
            var options = plot.getOptions();
            if (options.multiScreenFeature != undefined && options.multiScreenFeature.enabled) {
            	plot.updateMultiscreenRows = true;
            }

           	if(time != null) {
        		viewValue = plot.horizontalScrollBar.getViewValues();
       		 	diff = (viewValue.maxViewValue - viewValue.minViewValue);
	        	min = time;
	        	max = min + diff;
	        	plot.capXValuesAndFetchData(min, max);
        	}
        	if(rowId != null) {
        		viewValue = plot.verticalScrollBar.getViewValues();
       		 	diff = (viewValue.maxViewValue - viewValue.minViewValue);
       		 	var actualYValueOfRow = currentSeries.rowYvalueMap[rowId];
       		 	//console.log("Actual yValue of the row", actualYValueOfRow);
       		 	if(actualYValueOfRow == undefined) {
       		 		return -1; // In case of tree if the node is collapsed/hidden
       		 	}
       		 	if (plot.areWrapRowsEnabled() ) {
       		 		var displayedYValueOfRow = actualYValueOfRow;
       		 		// if the item passed has a chronos Id, get the wrapIndex if any and  move that to the top
       			    var actualFirstWrapDisplayMap = currentSeries.actualFirstWrapDisplayMap;
       		 		if(item.chronosId != null && actualFirstWrapDisplayMap && actualFirstWrapDisplayMap[actualYValueOfRow]){
       		 			//to cater to enity which is not in visible area.
       		 			displayedYValueOfRow = actualFirstWrapDisplayMap[actualYValueOfRow];
       				    var wrapIndex = plot.getTaskIdWrapIndexMap()[item.chronosId];
       				    if(wrapIndex) {
                            min = displayedYValueOfRow + wrapIndex - options.yaxis.verticalScrollExtendunit;
                            /*console.log("Wrap Index corresponding to chronosID" , item.chronosId , " = " , wrapIndex);*/
                        } else { // wrap Index is always zero for the rowIds passed as we  point to the first row. So need not calculate wrap
                            min = displayedYValueOfRow - options.yaxis.verticalScrollExtendunit;
                        }
                        plot.capYValuesAndFetchData(min, min + diff);
                        /* console.log(actualYValueOfRow , " WRAP CASE Y setting to ", min , min + diff ,
       			    	" actualYValueOfRow " , actualYValueOfRow , " displayedYValueOfRow " , displayedYValueOfRow);*/
       			    }  else {
       			    	min = actualYValueOfRow - options.yaxis.verticalScrollExtendunit;
       			    	max = min + diff;
       			    	plot.capYValuesAndFetchData(min, max);
       			    }
       		 	}
        	 }
		 }


        /*
         * This method will display the gantt zoomed to the given time.
         * Here reset the  header Image Creation image
         * startTime - start time in milliseconds.
         * endTime  - endTime in milliseconds
         */
        function scrollToDateRangePosition(startTime , endTime) {
        	if(!startTime || !endTime){
       		 throw "Invalid startTime or endTime";
        	}
        	var plotOptions = plot.getOptions();
        	var xscrollRange = plotOptions.xaxis.scrollRange;
        	if(startTime < xscrollRange[0]) {
        		startTime = xscrollRange[0];
        	}
        	if(endTime > xscrollRange[1]) {
        		endTime = xscrollRange[1];
        	}
        	//ISRM-5631
        	plot.setXaxisViewArea(startTime, endTime);
        	if(plot.areWrapRowsEnabled()) {
        		//update the wrap Index also as it will be moved to a different region
        		plot.determineBucketWiseWrap(series, true, true); //calling as Async // ifcallfetchrequired
			}
        	if(plot.horizontalScrollBar != undefined) {
        		plot.horizontalScrollBar.fetchDataAndRedraw();
        	}
        }


        function executeHooks(hook, args) {
            args = [plot].concat(args);
            for (var i = 0; i < hook.length; ++i) {
            	 hook[i].apply(this, args);
            }
        }

        function initPlugins() {
            for (var i = 0; i < plugins.length; ++i) {
                var p = plugins[i];
                 p.init(plot);
                if (p.options)
                    $.extend(true, options, p.options);
            }
        }

        function parseOptions(opts) {
        	//console.log('2. Inside parseOptions...', opts);
            var i;
            $.extend(true, options, opts);
        	isXLabelRendererAFunction = $.isFunction(options.xaxis.labelRenderer);
        	isYLabelRendererAFunction = $.isFunction(options.yaxis.labelRenderer);
            if (options.xaxis.color == null)
                options.xaxis.color = options.grid.color;
            if (options.yaxis.color == null)
                options.yaxis.color = options.grid.color;

            if (options.xaxis.tickColor == null) // backwards-compatibility
                options.xaxis.tickColor = options.grid.tickColor;
            if (options.yaxis.tickColor == null) // backwards-compatibility
                options.yaxis.tickColor = options.grid.tickColor;

            if (options.grid.borderColor == null)
                options.grid.borderColor = options.grid.color;
            if (options.grid.tickColor == null)
                options.grid.tickColor = $.color.parse(options.grid.color).scale('a', 0.22).toString();

            //User can set xaxis labelMargin and yaxis label margin separately  and also if specified in grid, it will be taken for both
            if (options.grid.labelMargin != null && options.grid.labelMargin !=0 ) {
            	options.yaxis.labelMargin = options.grid.labelMargin;
            	options.xaxis.labelMargin = options.grid.labelMargin;
            }
            if(options.yaxis.labelMargin == undefined) {
            	options.yaxis.labelMargin = 0;
            }
            if(options.xaxis.labelMargin == undefined) {
            	options.xaxis.labelMargin = 0;
            }

            //If the treeNode has footer specified , ensure that all other rows also  have the footer enabled by default
            if(options.yaxis.treeNode != undefined &&
            			options.yaxis.treeNode.footer != undefined && options.yaxis.treeNode.footer.enable &&
            			!options.yaxis.rowFooter.enable) {
            	options.yaxis.rowFooter.enable = true;
            	options.yaxis.rowFooter.width = options.yaxis.treeNode.footer.width;
            	options.yaxis.rowFooter.borderWidth = options.yaxis.treeNode.footer.borderWidth;
            	if(options.yaxis.rowFooter.footerRenderer == undefined) {
            		options.yaxis.rowFooter.footerRenderer = options.yaxis.treeNode.footer.renderer;
            	}
            }
            if(options.yaxis.treeNode && options.yaxis.treeNode.openMultiple == undefined) {
            		options.yaxis.treeNode.openMultiple = true; //set as the default. Multipel nodes can be opened at a time

            }
            // fill in defaults in axes, copy at least always the
            // first as the rest of the code assumes it'll be there
            for (i = 0; i < Math.max(1, options.xaxes.length); ++i){
            	if(options.xaxes[i] != undefined) {
            		options.xaxes[i] = $.extend(true, {}, options.xaxis, options.xaxes[i]);
            	}
            }
            for (i = 0; i < Math.max(1, options.yaxes.length); ++i) {
            	if(options.yaxes[i] != undefined) {
            		options.yaxes[i] = $.extend(true, {}, options.yaxis, options.yaxes[i]);
            	}
            }
            if (options.x2axis) {
                options.xaxes[1] = $.extend(true, {}, options.xaxis, options.x2axis);
                options.xaxes[1].position = "top";
            }
            if (options.y2axis) {
                options.yaxes[1] = $.extend(true, {}, options.yaxis, options.y2axis);
                options.yaxes[1].position = "right";
            }

            //FOR LINE< BAR & POINT  CHARTS
            if (options.lines)
                $.extend(true, options.series.lines, options.lines);
            if (options.points)
                $.extend(true, options.series.points, options.points);
            if (options.bars)
                $.extend(true, options.series.bars, options.bars);
            if (options.shadowSize != null)
                options.series.shadowSize = options.shadowSize;
            if (options.highlightColor != null)
                options.series.highlightColor = options.highlightColor;

            // save options on axes for future reference
            for (i = 0; i < options.xaxes.length; ++i)
                getOrCreateAxis(xaxes, i + 1).options = options.xaxes[i];
            for (i = 0; i < options.yaxes.length; ++i)
                getOrCreateAxis(yaxes, i + 1).options = options.yaxes[i];

            // add hooks from options
            for (var n in hooks)
                if (options.hooks[n] && options.hooks[n].length)
                    hooks[n] = hooks[n].concat(options.hooks[n]);

            executeHooks(hooks.processOptions, [options]);
        }

        function setScrollRangeAccordingToData(xscrollRange, yScrollRange) {
        	options = plot.getOptions();
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
             $.each(plot.getAxes(), function(_, axis) {
            	if(axis.direction == 'x') {
            		axis.options.scrollRange = options.xaxis.scrollRange;
            	} else if(axis.direction == 'y') {
            		axis.options.scrollRange = options.yaxis.scrollRange;
            	}
            });

        }

      //set Xaxis and axis.options min & max properly
        plot.setXaxisViewArea = function(minViewTime, maxViewTime) {
        	var currentSeries = plot.getSeries();
        	currentSeries.xaxis.min = minViewTime;
        	currentSeries.xaxis.max = maxViewTime;
        	currentSeries.xaxis.options.min = minViewTime;
        	currentSeries.xaxis.options.max = maxViewTime;
        	  if(plot.horizontalScrollBar != undefined) {
        		  plot.horizontalScrollBar.setViewValues(minViewTime, maxViewTime);
        		  plot.horizontalScrollBar.redrawScrollBox();
        	  }
			plot.currentVisibleData.fromDate = plot.resetViewPortTime(minViewTime) ;
        	plot.currentVisibleData.toDate =  plot.resetViewPortTime(maxViewTime);

        };
       //set yaxis and axis.options min & max properly
        plot.setYaxisViewArea = function(minViewRow, maxViewRow) {
        	var currentSeries = plot.getSeries();
        	currentSeries.yaxis.min = minViewRow;
        	currentSeries.yaxis.max = maxViewRow;
        	currentSeries.yaxis.options.min = minViewRow;
        	currentSeries.yaxis.options.max = maxViewRow;
      		plot.currentVisibleData.yValueMin = minViewRow;
      		plot.currentVisibleData.yValueMax =  maxViewRow;

           if(plot.verticalScrollBar != undefined) {
            	plot.verticalScrollBar.setViewValues(minViewRow, maxViewRow);
            	plot.verticalScrollBar.redrawScrollBox();
           }
        };

        /**
		 * Used to re-initialize the plot whenever the chronos options are modified by the application.
		 *
		 * Clear and re-populates all the data-structures.
		 * Initiates a fetch with the currentLoadedData
		 * @param  overridingOptions:  The changed options that need to be updated
		 */
		function reInitialize (overridingOptions) {
			if (!overridingOptions) {
				return;
			}

			var plotOptions = plot.getOptions();
			var series = plot.getSeries();
			var screenId = plot.getScreenId();
			var plotLabel = plot.getPlotLabel();

			var data = {};
			data.screenId = screenId;
			data.plotLabel = plotLabel;

			data.rowHeaderIds = series.rowHeaderIds;
			var xscrollRange = plotOptions.xaxis.scrollRange;
			data.columnDataRange = {
				startDate : xscrollRange[0],
				endDate   : xscrollRange[1]
			};
			data.label = series.label;
			data.callBackFunction = series.callBackFunction;
			data.taskRenderer = series.taskRenderer;
			data.fillColorProvider = series.fillColorProvider;
			data.bindEvents	= false;

			var desiredLoadedRange = {
				fromDate  : plot.currentLoadedData.fromDate,
				toDate    : plot.currentLoadedData.toDate
			};

			var desiredVisibleRange = {
				fromDate  : plot.currentVisibleData.fromDate,
				toDate    : plot.currentVisibleData.toDate
			};

			var yaxisOpts = series.yaxis.options;
			var yaxisRange = yaxisOpts.max - yaxisOpts.min;

			// merge the changes in the options
			$.extend(true, plotOptions, overridingOptions);

			// clear existing data-structures
			plot.clearAllFrameworkDataStructures(true);

			// repopulate all data-structures
			plot.setData (data);

			// always start from the "0" row when re-initialized
			series.yaxis.options.min = -0.5;
			series.yaxis.options.max = -0.5 + yaxisRange;

			desiredLoadedRange.yValueMin = 0;
			desiredLoadedRange.yValueMax = yaxisRange;
			desiredLoadedRange.rowIds = plot.getRequestedRowIds (desiredLoadedRange);

			// redraw vertical scrollbar accordingly
			var scrollOpts = plot.verticalScrollBar.getViewValues();
			var scrollMin = -0.5;
			var scrollMax = scrollMin + (scrollOpts.maxViewValue - scrollOpts.minViewValue);
			plot.verticalScrollBar.setViewValues (scrollMin, scrollMax);
			plot.verticalScrollBar.redrawScrollBox();

			// Initiate the fetch for the current-loaded-range
			var windowDataRange = {
				fromDate : desiredLoadedRange.fromDate,
				toDate   : desiredLoadedRange.toDate,
				rowIds   : desiredLoadedRange.rowIds
			};
			var desiredLoadedDataArray = [];
			desiredLoadedDataArray.push(windowDataRange);

			var fetchDataRequest = {
				windowDataRange		: windowDataRange,
				fetchDataRangeList	: desiredLoadedDataArray
			};

			plot.callDataLoadFunction(fetchDataRequest);

			plot.currentLoadedData = {
				yValueMin : desiredLoadedRange.yValueMin,
				yValueMax : desiredLoadedRange.yValueMax,
				fromDate  : desiredLoadedRange.fromDate,
				toDate    : desiredLoadedRange.toDate
			};

			plot.currentVisibleData = {
				yValueMin : scrollMin,
				yValueMax : scrollMax,
				fromDate  : desiredVisibleRange.fromDate,
				toDate    : desiredVisibleRange.toDate
			};
		}

        /**
         * Will be called once creating the chart -
         * -
         * @param dataObject
         */
        function setData(dataObject) {
        	var bindEventsFlag = true;
        	if(options.series.gantt.show) {
        		series = initialSetup(dataObject);
        		//Initialise the text renderer and cachedTextMap for caching the measure Text and drawText to improve performnace in scrolling
                textRenderer = new TextRenderer(plot, series );
	            if(series != null && series != undefined) {
	            	fillInGanttOptions();
	            }
        	} else {
        		series = parseData(dataObject);
                fillInSeriesOptions();
                processData();
        	}
        	setupGrid();
        	if (dataObject.bindEvents != undefined && dataObject.bindEvents == false) {
				bindEventsFlag = false;
			}

			if (bindEventsFlag) {
				bindEvents();
			}
            //To support when dataOn demand is false. ie full data fetched initially
            if(!options.interaction.dataOnDemand) {		 //CASE : DATA ON DEMAND OFF

	            var columnDataRange = dataObject.columnDataRange;
	            var windowDataRange = {
	            		fromDate : columnDataRange.startDate,
	            		toDate :columnDataRange.endDate,
	            		rowIds: series.rowHeaderIds
	            };
	           var desiredLoadedDataArray = [];
	            desiredLoadedDataArray[0] = windowDataRange;

	            var fetchDataRequest = {
						windowDataRange		: windowDataRange,
						fetchDataRangeList	: desiredLoadedDataArray
				};
	             setTimeout(function() {
	            	plot.callDataLoadFunction(fetchDataRequest);
	            }, 10);

            }

        }

        //clear and refetch everything once again.This is called when there is a filter for some kind of data.
        function clearDataAndRefetchDataForGantt() {
        	var currentSeries = plot.getSeries();
        	currentSeries.rowAvailable = [];
			currentSeries.columnAvailable = [];
			//Keep track of unused row and column --- For FIrst time
			for (var row = 0; row < DATA_MATRIX_ROW_SIZE; row++) {
				currentSeries.rowAvailable.push(row);
			}
			for (var col = 0; col < DATA_MATRIX_COLUMN_SIZE; col++) {
				currentSeries.columnAvailable.push(col);
			}
			var data2DMatrix = new Array(DATA_MATRIX_ROW_SIZE);
			for(var i = 0; i < DATA_MATRIX_ROW_SIZE; i++) {
				data2DMatrix[i] = new Array(DATA_MATRIX_COLUMN_SIZE);
			}
			currentSeries.data2DMatrix = data2DMatrix;
			//initialise longRangeData Map
			var longRangeDataMap = [DATA_MATRIX_ROW_SIZE];
			//dataMapRowIndex as in 2D map  as the key and the JSON list of tasks for each row as value
			currentSeries.longRangeDataMap = longRangeDataMap;
			//initialise all series variables to be used later when updating data
			currentSeries.columnHeaderArray = [];
			currentSeries.rowMap = [];
			currentSeries.columnMap = [];
			currentSeries.dataMap = [];
			plot.currentLoadedData = {
    			    yValueMin	: 0,
    			    yValueMax 	: -1,
    			    fromDate 	: 0,
    				toDate 		: -1
        	};
			plot.callFetchDataIfRequired();
        }


        /* This method is called for both ondemand and full data fetch. The data call is done  by the fw
        	reset all row/column header data and update all datastructures for updating gantt

        	Case : This is called when there is a change in row or column filters and there is no change in plot options
        	This also ensures that the filtered view will be shown in the same view where the filter was invoked
         	Accept a json data of the form
				rowHeaderIds   (scroll will be from 0 to rowHeaderIds.length)
				Handled for both ondemand data fetch and also for entire data is on cleint

				columnDataRamnge is an array which holds 2 items --startDate in [0] and endDate in [1]
		*/
        function resetRowColumnDataRangeForGantt(rowHeaderIds, columnDataRange) {
	        	 if(rowHeaderIds == null && columnDataRange == null) {
	        		 throw "Invalid row & column Header data for plot, rowHeaderIds = " + rowHeaderIds +
	        		 		", columnDataRange = " +columnDataRange ;
	        	}
	        	 var series = plot.getSeries(), options = plot.getOptions();
	        	 series.rowHeaderIds = rowHeaderIds;
	        	// Initialize based on previous screen configurations for multiscreen if any
		    	initializePreviousScreenConfiguration(options);
                var normalMaximumDaySpan = series.gantt.normalMaximumDaySpan;

	        	if(!options.interaction.dataOnDemand) { //not data on demand -Full data on client
		                var totalRows = series.rowHeaderIds.length;
		                var one_day = 1000 * 60 * 60 * 24;
		                var startDate = columnDataRange[0];
		        		var endDate = columnDataRange[1];
		                var totalDays = Math.ceil((endDate - startDate)/one_day);

		            //The data map size is calculated based on totalRows, totalDays and normalMaximumDaySpan
		            calculateDataMapSizeForFullData(totalRows, totalDays, normalMaximumDaySpan);

	               //initialise currentLoadedData as min of scroll range ie initially ensure that  it should be equal to desired Min
	                plot.currentLoadedData = {
	                    yValueMin : 0,
	                    yValueMax : totalRows,
	                    fromDate  : startDate,
	                    toDate    : endDate
	                };
	                 // Now perform the internal logic for updations & resting maps
		        	 updateDataStructuresForGantt(rowHeaderIds, columnDataRange);
		        	 plot.currentVisibleData = {
		 	 			    yValueMin: options.yaxis.min,
		 	 			    yValueMax : options.yaxis.max,
		 	 			    fromDate : plot.resetViewPortTime(series.xaxis.options.min),
		 	 				toDate : plot.resetViewPortTime(series.xaxis.options.max)
		 	 			};
		        	 setupCoreFrameworkMaps(); // will update all maps in this series as well as initiaise rowMap.
		        		//USer has to trigger update gantt data and draw the chart

				 }  else { //ON DEMAND
					 //The data map size is calculated based on maxVisibleDays, maxVisibleRows and EXTRA_FETCH_FACTOR
					 calculateDataMapSizeForOnDemand(normalMaximumDaySpan);

					  // Now perform the internal logic for updations & resting maps
		        	 updateDataStructuresForGantt(rowHeaderIds, columnDataRange);
					 plot.currentVisibleData = {
				 			    yValueMin: options.yaxis.min,
				 			    yValueMax : options.yaxis.max,
				 			    fromDate : plot.resetViewPortTime(series.xaxis.options.min),
				 				toDate : plot.resetViewPortTime(series.xaxis.options.max)
				 			};
	               //initialise currentLoadedData as min of scroll range ie initially ensure that  it should be equal to desired Min
	                plot.currentLoadedData = {
	                    yValueMin : 0,
	                    yValueMax : -1,
	                    fromDate  : 0,
	                      toDate  : -1
	                };
	               //Also ensure that the user can call data fetch after reset  of min and max for both axis
	                plot.callFetchDataIfRequired();	//call data if required
	                // Added for ISRM-7683
					if(plot.areWrapRowsEnabled()) {
						plot.updateWrapIndexDisplayMap();
					}
	          }
 			setupGrid();
  	    	draw();
        }
        /*
		 * This method is called only when data is there in client ie ONDEMAND = FALSE Case.  This is called when there
		 * is a change in row order with the existing gantt display.
		 */
        function updateRowOrderAndRedrawGantt(rowHeaderIds) {
        	series = plot.getSeries(); //existing series
        	series.rowHeaderIds = rowHeaderIds;
        	plot.isScrollRangeUpdated = true;
        	plot.updateDisplayedRows();
 			setupGrid();
 	    	draw();
 	    	plot.isScrollRangeUpdated = false;
        }


        /*This method is called only for root header node and its column data range updation.
         * The fw	reset all row/column header data and update all datastructures for updating gantt.
    	This is called when there is a change in rowNodes or column filters and there is no change in plot options.
    	This also ensures that the filtered view will be shown in the same view where the filter was invoked
		Provide rootTreeNode   as the rootRowHeader object and  columnDataRange as an array holding  startTime and endtime.
		columnDataRange is optional. If not specified, it will take the previous settings
         */
        function resetRootTreeNodeAndColumnRangeForGantt(rootTreeNode, columnDataRange) {
        	var series = plot.getSeries();
        	 // Now perform the internal logic for updations & resting maps
        	series.rootTreeNode = rootTreeNode;
			//ASSMPN: DATA ON DEMAND IS OFF for this  case
			if(series.rootTreeNode != undefined) {
				//iterate the treeNode and get rowIds and row header Objects from the leafNode
				nodeParseRowIndex = 0;
				actualStartRowIndex = 0;
				series.rowHeaderIds = [];
				series.rowHeaderObjects = [];
				series.rowIdLeafNodeMap = [];
				series.rootTreeNode.isExpanded = true;
				iterateNodeRecursively(series.rootTreeNode, series.rowHeaderIds, series.rowHeaderObjects, 0); // A recursive call
			}
			var totalRows = series.rowHeaderIds.length;
            var one_day = 1000 * 60 * 60 * 24;
            var startDate = columnDataRange[0];
     		var endDate = columnDataRange[1];
            var totalDays = Math.ceil((endDate - startDate)/one_day);
            //initialise currentLoadedData as min of scroll range ie initially ensure that  it should be equal to desired Min
            plot.currentLoadedData = {
                 yValueMin : 0,
                 yValueMax : totalRows,
                 fromDate  : startDate,
                 toDate    : endDate
            };
			calculateDataMapSize(totalRows, totalDays, series.gantt.normalMaximumDaySpan);
			updateDataStructuresForGantt(series.rowHeaderIds, columnDataRange);
			setupCoreFrameworkMaps(); // will update all maps in this series as well as initiaise rowMap.
			var callFetchReq = true;
			if(options.interaction.dataOnDemand) {
				callFetchReq = true;
			}
			//Added to calculate max wrapped rows for each bucket in the 2D matrix
	        if (plot.areWrapRowsEnabled()) { //Wrap Additions
	        	plot.determineBucketWiseWrap(series, true, callFetchReq ); //calling as Async
			}

			//This nodes are the ones which has set expandedNode from framework.
			if(forcefullyExpandNodeList.length > 0) {
				plot.expandNodes(forcefullyExpandNodeList);
			}
			var axisy = series.yaxis;
			//ISRM-4058 option to open Tree node in collapsed form by default
			if(!axisy.options.treeNode.openMultiple || axisy.options.treeNode.initialyCollapsed) {
				plot.initialyCollapsed = false;
				//Default display of nodes as all collapsed in case of accordion style  or fully collapse in case of initialCollapsed
				plot.collapseRootNode(series.rootTreeNode);
			}
			setupGrid();
 	    	draw();
        }

        // A common private function to initialise and setup  the fw internal logic called from resetRowColumnDataRangeForGantt
        //and resetRootTreeNodeAndColumnRangeForGantt
        function updateDataStructuresForGantt(rowHeaderIds, columnDataRange) {
        	var currentSeries = plot.getSeries()
        	, options = plot.getOptions()
        	, startDate = options.xaxis.scrollRange[0]
        	, endDate = options.xaxis.scrollRange[1]
        	, displayedRowIds = []
        	, actualFilterRowIds =[]
        	, rowHeaderMap=[]
        	,rowIdRowObjectMap =[]
        	, rowYvalueMap =[];
        	//, rowIdValue;

        	if(columnDataRange != null) { //otherwise previous datarange set in options will be taken
        		startDate = columnDataRange[0];
        		endDate = columnDataRange[1];
        	}

        	//initially cache the existing view values of gantt
        	var minViewTime = currentSeries.xaxis.options.min;
        	var maxViewTime = currentSeries.xaxis.options.max;

        	var minViewRow = currentSeries.yaxis.min;
        	var maxViewRow = currentSeries.yaxis.max;

        	var diffRow = maxViewRow - minViewRow;
        	var diffTime = maxViewTime - minViewTime;

        	if(rowHeaderIds != null && startDate != null && endDate != null ) {
        		var xScrollRange = [startDate, endDate],
        			yScrollRange = [0, rowHeaderIds.length -1];

        		setScrollRangeAccordingToData(xScrollRange, yScrollRange);//considers verticalScrollUnit as well
            	//Now set the view areas to the begining of the view area in case of rows
            	var newScrollRange = options.yaxis.scrollRange; // if verticalScrollunit is set, consider that too in calculating min
            	//Also update vertical scrollbar with new range
            	var verticalScrollBar = plot.verticalScrollBar;
           	    if(verticalScrollBar != undefined) {
	           		plot.verticalScrollBar.setAxisValues(newScrollRange[0], newScrollRange[1]);
           	    }
            	minViewRow = newScrollRange[0];
            	maxViewRow = minViewRow + diffRow;
            	if(maxViewRow > newScrollRange[1]) { // if greater than new scrollrange
            		maxViewRow = newScrollRange[1];
            	}
            	//set axis and axis.options min & max properly
            	plot.setYaxisViewArea(minViewRow, maxViewRow);
            	//Keep existing as it is
            	// if condition added for iAirport
            	if(plot.horizontalScrollBar != undefined ) {
            		plot.horizontalScrollBar.setAxisValues(xScrollRange[0], xScrollRange[1]);
            	}
            	//if view areas are beyond the xaxis area, cap before setting view or else in the same view time area
            	//the previous view area doesn't come in the current scroll range
            	if(minViewTime < xScrollRange[0] || !(minViewTime> xScrollRange[0] && minViewTime <xScrollRange[1])) {
            		minViewTime = xScrollRange[0];
            		maxViewTime = minViewTime + diffTime;
            	}
            	if(maxViewTime > xScrollRange[1] || !(maxViewTime> xScrollRange[0] && maxViewTime <xScrollRange[1])) {
            		maxViewTime = xScrollRange[1];
            		minViewTime = maxViewTime - diffTime;
            		//cap this too
            		if(minViewTime< xScrollRange[0]){
            			minViewTime = xScrollRange[0];
            		}
            	}
            	//set axis and axis.options min & max properly
            	plot.setXaxisViewArea(minViewTime, maxViewTime);
        	}

        	if(rowHeaderIds != null) {
				// actualFilterRowIds will have index 0,1,2,3 ... and id as values crew-5, crew10..etc
				var count = 0;
				currentSeries.rowHeaderIds = rowHeaderIds;
				$.each(rowHeaderIds, function (yvalue, rowId) { //the full rowIds passed initially	is now there in actualFilterRowIds
					actualFilterRowIds[yvalue] = rowId;
					//if(jQuery.inArray(rowId, hiddenRows) == -1) { // not hidden
					if(hiddenRows.indexOf(rowId) == -1) { // not hidden
						displayedRowIds[count] = yvalue;
						count++;
					}
				});
				currentSeries.actualFilterRowIds = actualFilterRowIds;
				currentSeries.displayedRowIds = displayedRowIds;

				//keep rowHeaders in series as well as a named Array with key as yValue and value as rowHeader object
				currentSeries.rowHeaderMap = rowHeaderMap;

				//Finally added a map to expose to application users
				currentSeries.rowIdRowObjectMap = rowIdRowObjectMap; // Key rowId and Value rowHeaderObject

			 	//create rowYvalueMap from drawn rowheader
				$.each(displayedRowIds, function (y) {
					eachRowId = plot.retrieveActualRowId(y);
					rowYvalueMap[eachRowId] = y ;
				});

				currentSeries.rowYvalueMap = rowYvalueMap;
				//Adding new attributes for internal data2DMatrix creation for caching
				currentSeries.rowAvailable = [];
				//Keep track of unused row and column --- For FIrst time
				for (var row = 0; row < DATA_MATRIX_ROW_SIZE; row++) {
					currentSeries.rowAvailable.push(row);
				}
				currentSeries.rowMap = []; // should be a named array
			}

			if(columnDataRange != null) {
				currentSeries.columnAvailable = [];
				for (var col = 0; col < DATA_MATRIX_COLUMN_SIZE; col++) {
					currentSeries.columnAvailable.push(col);
				}
				currentSeries.columnHeaderArray = [];
				currentSeries.columnMap = []; // should be a named array
			}
			var data2DMatrix = new Array(DATA_MATRIX_ROW_SIZE);

			for(var i = 0; i < DATA_MATRIX_ROW_SIZE; i++) {
				data2DMatrix[i] = new Array(DATA_MATRIX_COLUMN_SIZE);
			}
			currentSeries.data2DMatrix = data2DMatrix;
			//initialise longRangeData Map
			var longRangeDataMap = new Array(DATA_MATRIX_ROW_SIZE);
			currentSeries.longRangeDataMap = longRangeDataMap;
			//Changes added for ISRM-3586.
			if(!options.interaction.dataOnDemand) {
	                //Note: If there are no data in any rows or days, the dataMap will not be updated So called here if in case
	                //there is no task in the ganttdata list
	                var range = {
	                              startDate : columnDataRange[0],
	                              endDate : columnDataRange[1]
	                }
	                initialiseColumnDataMap(range);

	                //Note: If there are no data in any rows, the rowMap will not be updated for this row. So called here if in case
	                //there is no task in the ganttdata list
	                initialiseRowDataMap(currentSeries.rowHeaderIds);
	         }
			//initialise all series variables to be used later when updating data
			currentSeries.dataMap = new Array(); // should be a named array with name as ID and value as the corresponding task object
			//keep it back in  global series
			plot.setSeries(currentSeries);
        }


        function sortParentNodeForProperty(rootNode, sortAttribute, sortNodeLevel, eachHeaderColumn) {
        	var childNodes = rootNode.childNodes;
        	if(!childNodes) {
        		return;
        	}
        	var oldChildNodes = childNodes.slice(0, childNodes.length); //keep a copy

        	if(rootNode.oldChildNodes == undefined) {
        		rootNode.oldChildNodes  = oldChildNodes;
        	}
        	if(rootNode.nodeLevel == sortNodeLevel) {
        		if(childNodes != null && eachHeaderColumn.mode != "NIL") {
					childNodes = performSorting(childNodes, sortAttribute, eachHeaderColumn);
        		} else {
        			  childNodes = rootNode.oldChildNodes;
        			  rootNode.childNodes = childNodes;
        			  rootNode.oldChildNodes = undefined;
        		}
			} else if(childNodes != null) {
				for ( var int = 0; int < childNodes.length; int++) {
					sortParentNodeForProperty(childNodes[int], sortAttribute, sortNodeLevel, eachHeaderColumn);
				}
			}
        }


        function performSorting(childNodes, attribute, eachHeaderColumn) {
        	if(eachHeaderColumn.comparator != undefined) {
        		  childNodes.sort(function(a, b) {
        			var result  = eval(eachHeaderColumn.comparator).apply(this, [a, b] );
	            	if(eachHeaderColumn.mode == "ASC" || eachHeaderColumn.mode == undefined) {
	            		return result; //make ascending order
	            	} else {
	            		return (result*-1); //make decending order
	            	}
	            });
        	} else {
	            childNodes.sort(function(a, b) {
	            	var result = 0;
	            	if(a.data[attribute] > b.data[attribute]) {
	            		result  = 1;
	            	} else if(a.data[attribute] < b.data[attribute]) {
	            		result= -1;
	            	}
	            	if(eachHeaderColumn.mode == "ASC" || eachHeaderColumn.mode == undefined) {
	            		return result;//make ascending order
	            	} else {
	            		return (result*-1);	//make decending order
	            	}
	            });
       	  }
           return childNodes;
        }

         /**
          * This is a recursively called function called on rootNode, which  will calculate and
          * assign the startRowIndex, actualStartRowIndex, nodeLevel & familyCount for each Node
          * and also populate map like rowIdLeafNodeMap, rowIdRowObjectMap
          */
	     function  iterateNodeRecursively(currentNode, rowHeaderIds, rowHeaderObjects, nodeLevel, nodeParseRowIndexPassed, actualStartRowIndexPassed ) {

	    	 if(nodeParseRowIndexPassed != undefined && actualStartRowIndexPassed != undefined) {
		    		 nodeParseRowIndex = nodeParseRowIndexPassed;
		    		 actualStartRowIndex = actualStartRowIndexPassed;
		    	 }
	    	    currentNode.startRowIndex = nodeParseRowIndex;
	    	    currentNode.actualStartRowIndex = actualStartRowIndex;
	    	    currentNode.nodeLevel = nodeLevel;

	        	var familyCount = 0;
	        	var series = plot.getSeries();
	        	var rowId = currentNode.rowId; // rowId should be there in our tree Node structure

	    	   if(options.yaxis.treeNode.nodeLimit >= currentNode.nodeLevel && nodeLevel != 0) {
	    		   //The nodes to become tree nodes .
	    		   if (rowId == null) {//Create empty rows with this objects
	    			  rowId = TREE_ROWID_CONSTANT + currentNode.nodeLevel +"-"+ nodeParseRowIndex;
	    			  currentNode.rowId = rowId;
	    	       }
	    		   rowHeaderIds.push(rowId);

	    		   if(currentNode.isExpanded == undefined) {
	    			   currentNode.isExpanded = true; //used  in normal case
	    			   forcefullyExpandNodeList.push(currentNode);
	    		   }

	    		   if(currentNode.collapsible == undefined) { //tree node can be collapsible or expandable accordign to business
	    			   currentNode.collapsible = true; //default to true. -  this flag is used to ensure that the treenode is collapsible or not(data display case)
	    		   }
	    		   currentNode.isLeafNode = false;
    			   rowHeaderObjects.push(currentNode); // push the entire Node as row header Object
    			   series.rowIdRowObjectMap[rowId] = currentNode;  //PUSHING TO THIS MAP AS WELL

		           //if(jQuery.inArray(rowId, hiddenRows) == -1){ // not hidden
		           if(hiddenRows.indexOf(rowId) == -1) { // not hidden
						nodeParseRowIndex++;
				   }
		           actualStartRowIndex ++;
		           familyCount++;

	    	   }  else if(currentNode.childNodes == null) { //LEAF
		        	//when child nodes are null , this is a leaf node  grab the rowId and rowObject
		        	currentNode.familyCount = 1;
		        	currentNode.isLeafNode = true;
		        	rowHeaderIds.push(rowId);
		        	rowHeaderObjects.push(currentNode); // push the entire Node as row header Object

		        	//rowIdLeafNodeMap used  for all cases : used for updating rowheaders passed from asyc callback
		        		series.rowIdLeafNodeMap[rowId] = currentNode;

		        	//if(jQuery.inArray(rowId, hiddenRows) == -1){ // not hidden
		        	if(hiddenRows.indexOf(rowId) == -1) { // not hidden
						nodeParseRowIndex++;
					}
		        	actualStartRowIndex++;
		        	return 1;
		        }

		        if(currentNode.childNodes != null) {
					var childNodes = currentNode.childNodes;
					for ( var i = 0; i < childNodes.length; i++) {
						//Set the parent node
						childNodes[i].parentNode = currentNode;
						if(childNodes[i].isExpanded == undefined) {
							 childNodes[i].isExpanded = true;
							 forcefullyExpandNodeList.push(childNodes[i]);
						}
						if(childNodes[i].collapsible == undefined) { //tree node can be collapsible or expandable accordign to business
							childNodes[i].collapsible = true; //default to true. -  this flag is used to ensure that the treenode is collapsible or not(data display case)
			    		}
						familyCount += iterateNodeRecursively(childNodes[i], rowHeaderIds, rowHeaderObjects, nodeLevel+1);
					}
					currentNode.familyCount = familyCount;
					return familyCount;
				}
		        //Case when there is no child nodes  up to nodeLimit mentioned
		        currentNode.familyCount = familyCount;
		        return familyCount;
	    }

        /**
         * This does all the initialisations and map creations for the storage of actual data in the update gantt call.
         * @param dataObject
         * @returns series
         */
        function initialSetup(dataObject) {
				// Added this IF case HERE IS where u have to parse the data
			if (dataObject !=  null) {
				plot.setPlotLabel (dataObject.plotId);
				if (options.multiScreenFeature!= undefined && options.multiScreenFeature.enabled && (dataObject.screenId != undefined || dataObject.screenId != null)) {
					plot.setScreenId (dataObject.screenId);
				}

				series = $.extend(true, {}, options.series);
				// displayedRowIds will have index 0,1,2,3 ... and id as values crew-5, crew10..etc
				var rowHeaderIds= [] , rowHeaderObjects =[], rowIdRowObjectMap=[];
				var displayedRowIds = [] , actualFilterRowIds = [], rowHeaderMap=[], rowYvalueMap =[];

				series.rootTreeNode = dataObject.rootTreeNode;
				if(dataObject.rowHeaderIds != undefined) {
					rowHeaderIds = dataObject.rowHeaderIds;
				}
				series.rowHeaderIds = rowHeaderIds; //initial set provided
				series.rowHeaderObjects = rowHeaderObjects; // on demand or full updation done to this

				series.displayedRowIds = displayedRowIds;  // displayed 0,1,2,3 (displayedYvalue) and Value as actual yValue 0,1,2,3
				series.actualFilterRowIds = actualFilterRowIds; //Key as actualyValue 0,1,2,3... and Value as  rowId;
				//keep rowHeaders in series as well as a named Array with key as yValue and value as rowHeader object

				series.rowHeaderMap = rowHeaderMap; //Key displayedYvalue and Value- > rowHeaderObject of just displayed rows //to be used internally only
				series.rowYvalueMap = rowYvalueMap;	 //Key rowId  and Value -> displayedYvalue  , only displyed Rows details // to be used internally only

				//Finally added a map to expose to application users
				series.rowIdRowObjectMap = rowIdRowObjectMap; // Key rowId and Value rowHeaderObject : Exposed to application

				//ASSMPN: DATA ON DEMAND IS OFF for this below case
				if(series.rootTreeNode != undefined) {
					//iterate the treeNode and get rowIds and row header Objects from the leafNode
					 nodeParseRowIndex = 0;
					 actualStartRowIndex = 0;
					 series.rootTreeNode.isExpanded = true;
					 series.rowIdLeafNodeMap = [];
					 iterateNodeRecursively(series.rootTreeNode, series.rowHeaderIds, series.rowHeaderObjects, 0); // A recursive call
				}
				//initialise all series variables to be used later when updating data
				series.columnHeaderArray = [];
    			series.rowMap = []; // should be a named array
    			series.columnMap = []; // should be a named array
    			series.dataMap = new Array(); // should be a named array with name as ID and value as the corresponding task object
				setupCoreFrameworkMaps(); // will update all maps in this series as well as initiaise rowMap.

				var columnDataRange = dataObject.columnDataRange;
				series.label = dataObject.label;
				series.callBackFunction = dataObject.callBackFunction;
				series.taskRenderer = dataObject.taskRenderer;
				series.fillColorProvider = dataObject.fillColorProvider;

    			//Set Scroll Ranges accordign to the data : NEW ADDITION
    			var startDate = columnDataRange.startDate , endDate = columnDataRange.endDate;

    			if(series.rowHeaderIds != null && endDate != null && endDate != null ) {
            		var xScrollRange = [startDate, endDate]
            			, yScrollRange = [0, series.rowHeaderIds.length -1];
            			setScrollRangeAccordingToData(xScrollRange, yScrollRange);
            	}

    			// Initialize based on previous screen configurations for multiscreen if any
	    		initializePreviousScreenConfiguration(options);

    			//Also ensure that the user can call data fetch for the first load. Set  min and max for both axis
    			plot.currentVisibleData = {
    			    yValueMin	:	options.yaxis.min,
    			    yValueMax 	: 	options.yaxis.max,
    			    fromDate 	: 	plot.resetViewPortTime(options.xaxis.min),
    				toDate 		: 	plot.resetViewPortTime(options.xaxis.max)
    			};

    			//When onDemandData is disabled,
    			 var totalRows = 0, totalDays = 0;
    			 if(!options.interaction.dataOnDemand) { //not data on demand
                     totalRows = series.rowHeaderIds.length;
                     var one_day = 1000 * 60 * 60 * 24;
                     totalDays = Math.ceil((endDate - startDate)/one_day);
                    //initialise currentLoadedData as min of scroll range ie initially ensure that  it should be equal to desired Min
                     plot.currentLoadedData = {
                         yValueMin : 0,
                         yValueMax : totalRows,
                         fromDate  : startDate,
                         toDate    : endDate
                     };
    			 }  else {
                    //initialise currentLoadedData as min of scroll range ie initially ensure that  it should be equal to desired Min
                     plot.currentLoadedData = {
                         yValueMin : 0,
                         yValueMax : -1,
                         fromDate  : 0,
                           toDate  : -1
                     };
               }
    			//The data map size is calculated based on maxVisibleDays, maxVisibleRows and EXTRA_FETCH_FACTOR
    			 calculateDataMapSize(totalRows, totalDays, series.gantt.normalMaximumDaySpan);
    			if(DATA_MATRIX_ROW_SIZE < 0 || DATA_MATRIX_COLUMN_SIZE < 0) {
    				if( (window['console'] !== undefined) ){
    					console.log("Data map size is not correct. Cannot load data.");
    				}
    				return;
    			}
				//Adding new attributes for internal data2DMatrix creation for caching
    			series.rowAvailable = [];
    			series.columnAvailable = [];
    			//Keep track of unused row and column --- For FIrst time
				for (var row = 0; row < DATA_MATRIX_ROW_SIZE; row++) {
					series.rowAvailable.push(row);
				}

				for (var col = 0; col < DATA_MATRIX_COLUMN_SIZE; col++) {
					series.columnAvailable.push(col);
				}
				var data2DMatrix = new Array(DATA_MATRIX_ROW_SIZE);

				for(var i = 0; i < DATA_MATRIX_ROW_SIZE; i++) {
					data2DMatrix[i] = new Array(DATA_MATRIX_COLUMN_SIZE);
				}
				series.data2DMatrix = data2DMatrix;
				//initialise longRangeData Map
				var longRangeDataMap = new Array(DATA_MATRIX_ROW_SIZE);
				//dataMapRowIndex as in 2D map  as the key and the JSON list of tasks for each row as value
				series.longRangeDataMap = longRangeDataMap;

				//Note: If there are no data in any rows or days, the dataMap will not be updated So called here if in case
				//there is no task in the ganttdata list
    			initialiseColumnDataMap(columnDataRange);

    			//Note: If there are no data in any rows, the rowMap will not be updated for this row. So called here if in case
				//there is no task in the ganttdata list
    			initialiseRowDataMap(series.rowHeaderIds);
    			dataObject = null;
			}//if
			return series; // this is teh gloabl series
		}

        function initializePreviousScreenConfiguration(options) {
        	var customData = options.multiScreenFeature.customData;
        	var screenId = (customData != null && Object.keys(customData).length > 0) ? $.multiScreenScroll.getCurrScreenId(customData.key) : plot.getScreenId();
			var plotLabel = plot.getPlotLabel();
			if ( options.multiScreenFeature!= undefined && options.multiScreenFeature.enabled ) {
				// if it is a "refresh" take the existing config from the localStore
				var isRefresh = $.getFromSessionStore ('rfsh');
				var screens = $.getFromLocalStore ('s');
				var totalRows = options.yaxis.max - options.yaxis.min;

				if (isRefresh != undefined) { // update (xmin,xmax) && (ymin,ymax) from the config stored earlier (in localStorage)
					//SCREEN_REFRESH reading_from_earlier_config
					var screenConfig = $.multiScreenScroll.getMultiScreenConfig(screens, customData, screenId);
					var paneConfig = screenConfig ? screenConfig.pane[plotLabel] : undefined;
					if(paneConfig && paneConfig.startDisplayObject.id) {
						options.xaxis.min = screenConfig.dateRange.start;
						options.xaxis.max = screenConfig.dateRange.end;
						options.yaxis.min = paneConfig.startDisplayObject.id;
						options.yaxis.max = options.yaxis.min + totalRows;
					} else {
						plot.updateDateRangeInLocalStore (options.xaxis.min, options.xaxis.max, true);
					}
				} else {
					var currScreenConfig = (Object.keys(customData).length > 0) ? $.multiScreenScroll.getMultiScreenConfig(screens,customData) : undefined;
					if(screenId == 0 && currScreenConfig && currScreenConfig.pane[plotLabel] != undefined){
						plot.updateDateRangeInLocalStore (options.xaxis.min, options.xaxis.max, true);
					}
					else if (screenId > 0) {
						// CONFIG_CHANGE_BASED_ON_PREV_SCREEN"
						var prevScreenConfig = $.multiScreenScroll.getMultiScreenConfig(screens, customData, screenId-1);
						var prevPaneConfig = prevScreenConfig.pane[plotLabel];
						var linkage = options.multiScreenFeature.linkage;
						var MILLISECS_IN_A_DAY = 86400000;
						if(prevPaneConfig){
							if (linkage == 'vertical') {
								options.yaxis.min = prevPaneConfig.endDisplayObject.id - $.multiScreenScroll.getRowOverlapCount();
								options.yaxis.max = options.yaxis.min + totalRows;
								if (options.xaxis.min != prevScreenConfig.dateRange.start) {
									options.xaxis.min = prevScreenConfig.dateRange.start;
								}
								if (options.xaxis.max != prevScreenConfig.dateRange.end) {
									options.xaxis.max = prevScreenConfig.dateRange.end;
								}
							} else if (linkage == 'horizontal') {
								if (options.yaxis.min != prevPaneConfig.startDisplayObject.id)
									options.yaxis.min = prevPaneConfig.startDisplayObject.id;
								if (options.yaxis.max != prevPaneConfig.endDisplayObject.id)
									options.yaxis.max = prevPaneConfig.endDisplayObject.id;

								options.xaxis.min = prevScreenConfig.dateRange.end - $.multiScreenScroll.getColOverlapCount() * MILLISECS_IN_A_DAY;
								options.xaxis.max = options.xaxis.min + (prevScreenConfig.dateRange.end - prevScreenConfig.dateRange.start);
							}
							plot.updateDateRangeInLocalStore (options.xaxis.min, options.xaxis.max, true);
						}
					}

				}
			}
        }

        function initialiseColumnDataMap(columnDataRange) {
        	//update column Headers as well if it is undefined
        	var oneDayMillis = 1000 * 60 * 60 * 24; //one day in millis
        	 var normalSpanMillis = (series.gantt.normalMaximumDaySpan) * oneDayMillis;

        	for ( var eachDay = plot.resetViewPortTime(columnDataRange.startDate - normalSpanMillis); eachDay <= columnDataRange.endDate;  ) {
        		getCurrentColumnIndex(eachDay);
        		eachDay = eachDay + oneDayMillis;
			}
        }

        function initialiseRowDataMap(rowHeaderIds) {
        	for (var id = 0; id < rowHeaderIds.length; id++) {
        		getCurrentRowIndex(rowHeaderIds[id]);
        	}
        }

        /**
         * THis method creates and update the rowHeaderIds, displayed Rows, rowHeaderObjects, rowHeaderMap and soon.
         * This will be called when ever there is a change in displayed rows ..hiding , un hiding , deletion etc
         */
        function setupCoreFrameworkMaps() {
        	var series = plot.getSeries();
        	var rowHeaderIds = series.rowHeaderIds;
        		series.actualFilterRowIds = [];   // series.actualFilterRowIds,
        		series.displayedRowIds = [];
        		series.rowYvalueMap = [];
        		var displayedRowyValue = 0;
			$.each(rowHeaderIds, function (actualyValue, rowId) { //the full rowIds passed initially	is now there in actualFilterRowIds
				series.actualFilterRowIds[actualyValue] = rowId;
				// ISRM: 5426  don't add undefined also
			    if(hiddenRows.indexOf(rowId) == -1 && actualyValue != undefined) { // not hidden
					series.displayedRowIds[displayedRowyValue] = actualyValue;
					series.rowYvalueMap[rowId] = displayedRowyValue; // update this for not hidden rows - when hiding and not hiding
					displayedRowyValue++;
				}
			});
			//Now update the rowHeader Maps as well NOTE: ON DEMAND NOT SUPPORTED . row header list shd be available
			series.rowHeaderMap = []; //reset this and update
			updateRowHeaderMap(series.rowHeaderObjects);
        }

        /**
         * Execute these when there is a hiding of rows.
         * This method updates the rows and Yvalue maps like actualFilterRowIds, rowYValueMap, displayedRowIds , rowHeaderMap etc
         */
        plot.updateDisplayedRows = function() {
        	var series = plot.getSeries();
        	//reset all the Arrays and update the framework row maps
        	setupCoreFrameworkMaps();
			//Set Scroll Ranges according to the new rows : NEW ADDITION
       		var xScrollRange = null,
       			yScrollRange = [0, series.displayedRowIds.length -1];
       			setScrollRangeAccordingToData(xScrollRange, yScrollRange);
    			if(plot.areWrapRowsEnabled()){
       				if(plot.getOptions().chronosWorker.enabled) {
       					if(plot.bucketWrapCalcRunning == true){
       						plot.waitForBucketUpdation = true;
       					}else{
       						 plot.updateWrapIndexDisplayMap(true); //calling as Async
       					}
    			    }else {
    				    plot.updateWrapIndexDisplayMap(false);
    			    }
       			}
        };

        /**
         *
         * @param yValue
         * @returns
         */
        plot.retrieveActualRowId = function(displayedyValue) {
        	series = this.getSeries();
        	var actualRowYValue = series.displayedRowIds[displayedyValue];
        	//get the actual rowId from actualFilterRowIds
        	return(series.actualFilterRowIds[actualRowYValue]); //returns the rowId
        };

        //calculating the data map size initially for loading data
        function calculateDataMapSize(totalRows, totalDays, normalMaximumDaySpan) {
        	 if(options.interaction.dataOnDemand) {
        		 calculateDataMapSizeForOnDemand(normalMaximumDaySpan);
        	 } else {
        		 calculateDataMapSizeForFullData(totalRows, totalDays, normalMaximumDaySpan);
        	 }
		}
        /**
         * Full data on client.
         */
        function calculateDataMapSizeForFullData(totalRows, totalDays, normalMaximumDaySpan) {
        	DATA_MATRIX_ROW_SIZE =  totalRows;
            DATA_MATRIX_COLUMN_SIZE =  totalDays + normalMaximumDaySpan;
            TOTAL_ROW_AVAILABLE = DATA_MATRIX_ROW_SIZE;
        }
        /**
         * On demand scenario
         */
        function calculateDataMapSizeForOnDemand(normalMaximumDaySpan) {
        	var options = plot.getOptions();
        	var xZoomRange = options.xaxis.zoomRange; //considering zoomRange for days as there is a zooming max and min range
        	var one_day = 1000 * 60 * 60 * 24; //one day in millis
        	 if(!xZoomRange) {
        		xZoomRange = [];
        		xZoomRange[0] = 360000; //min 1 hour zoom in
        		xZoomRange[1] = 30 * one_day; //max 30 days at one view on zoom out
        	}
        	 var maxVisibleRows = options.series.gantt.maxTotalRows;
    		 var maxVisibleDays =  Math.ceil(xZoomRange[1]) /one_day ; //calculated with max zoomRange
			 //maxTotalRows is taken for calculation as the max Row shown will be clipped when resize, and DATA_MATRIX_ROW
			 //will be calculated as according to this.
			 //For the data2DMatrix -  increased the range for extra two days & normal span for column and 2 for rows

    		 var EXTRA_FETCH_FACTOR_ROW = options.interaction.extraFetchFactor.horizontal;
    		 var EXTRA_FETCH_FACTOR_COLUMN  = options.interaction.extraFetchFactor.vertical;

			 DATA_MATRIX_ROW_SIZE  =  Math.ceil((maxVisibleRows + 1)  * 3 + 2 * Math.ceil((maxVisibleRows + 1) * EXTRA_FETCH_FACTOR_ROW));
			 DATA_MATRIX_COLUMN_SIZE = Math.ceil((maxVisibleDays + 2) * 3  +  2 * Math.ceil((maxVisibleDays + 2) * EXTRA_FETCH_FACTOR_COLUMN)) + normalMaximumDaySpan + 1;
			 TOTAL_ROW_AVAILABLE = DATA_MATRIX_ROW_SIZE;
			// console.log("DATA_MATRIX_ROW_SIZE ", DATA_MATRIX_ROW_SIZE ,  "  DATA_MATRIX_COLUMN_SIZE " , DATA_MATRIX_COLUMN_SIZE);
        }
        /**
		 * This function updates the gantt data with the new one
		 * and redraw the gantt with the changes.
		 * update the data2DMatrix and redraw gantt after the callBack function call
		 */
		function updateGanttData(ganttData) {

			if(series == null || series == undefined) {
				return;
			}
			parseGanttDataTo2DMap(ganttData.data);
			//Now update rowHeaderMap in series as well to display legend on fetch
			if(ganttData.rowHeaders != undefined) {	 //ISRM-2321
					if(series.rootTreeNode != undefined) { //if row header is a  tree structure
						// if tree update the rowHeaders
						setDataToRowHeader(ganttData.rowHeaders, series);
						var axisy = series.yaxis;
						//ISRM-4058 option to open Tree node in collapsed form by default
						if(!axisy.options.treeNode.openMultiple || axisy.options.treeNode.initialyCollapsed) {
							//Default display of nodes as all collapsed in case of accordion style  or fully collapse in case of initialCollapsed
							plot.collapseRootNode(series.rootTreeNode);
						}
					} else {
						updateRowHeaderMap(ganttData.rowHeaders); // the structure inside this is not as nodes
					}
			}
			 if(ganttData.requestMetaData) {
				 var requestMetaData = JSON.parse(ganttData.requestMetaData);
				 switch(requestMetaData.actionType){
					case "scrollToTimeAndItemRowOnTop" :
						{
						plot.actionData = requestMetaData.actionData;
						plot.actionType =  requestMetaData.actionType;
						plot.actionTime = requestMetaData.actionTime;
						break;
					 }
					 default : {
						 plot.actionData = null;
						 plot.actionType = null;
						 plot.actionTime = null;
						 break;
					 }
				}
			}

            //Added to calculate max wrapped rows for each bucket in the 2D matrix
            if (plot.areWrapRowsEnabled()) { //Wrap Additions
            	plot.determineBucketWiseWrap(series, true, true); //calling as Async
			}
			executeHooks(hooks.updateGanttData, [ganttData]);
			//reset rowHotSpotMap for applications using hotSpot
			plot.setRowHotSpotMap(new Array());
			plot.clearHeaderImage();//done to create header image
			plot.setupGrid();
			plot.draw();
			plot.actionData = null;
			plot.actionType = null;
			plot.actionTime = null;
		};

		plot.getGanttStartDateAttribute =  function(task) {
			var startDateAttribute = series.gantt.startDateAttribute;
			 if($.isFunction(startDateAttribute)) {
				 return startDateAttribute(task); //execute the function to get the attribute.
	       	 }  else {
	       		return startDateAttribute;
	       	 }
		};

		plot.getGanttEndDateAttribute =  function(task) {
			var endDateAttribute = series.gantt.endDateAttribute;
			 if($.isFunction(endDateAttribute)) {
				 return endDateAttribute(task); //execute the function to get the attribuete.
	       	 }  else {
	       		return endDateAttribute;
	       	 }
		};

		/**
		 * A function which converts the crude Gantt data to the required 2D Map - plotDataMap
		 * This also ensures that if the data is not changed, the column index and reowindex is not recalculated.
		 *
		 */
	    function parseGanttDataTo2DMap(ganttTaskDataArray) {
	    	//var startTime = new Date().getTime();
		   var eachRowHeaderKey=0, eachColumnHeaderKey, taskStartDate;
		   var series = plot.getSeries();
           var rowIdAttributeInTask = series.gantt.rowIdAttributeInTask;
           var rowIdProviderCallBackFunction = series.gantt.rowIdProviderCallBack;
           var startDateAttribute , endDateAttribute;
           var normalMaximumDaySpan = series.gantt.normalMaximumDaySpan;
           var initialSetOfRowHeaderIds = series.rowHeaderIds;
           var oneDayMillis = 24*3600*1000;
           var currentRowIndex, currentColumnIndex = 0, eachTaskData, taskIDArray, presentInOriginalList;
           for(var dataIndex = 0 ; dataIndex < ganttTaskDataArray.length; dataIndex++) {
                  eachTaskData = ganttTaskDataArray[dataIndex];
                  if(eachTaskData != null ) {
                	  //if this task is already there in gantt map for updation
	                  var existingTaskInMap = getTaskAlreadyAddedInMap(eachTaskData)
	                  if(existingTaskInMap != null) {
                		  //remove from 2D matrix
                		  removeExistingTaskFrom2Dmatrix(existingTaskInMap);
                	  }
	                  if(rowIdAttributeInTask != null) {
                                eachRowHeaderKey = eachTaskData[rowIdAttributeInTask]; //eg: Crew5 deafult is 'rowId'
                         } else if(rowIdProviderCallBackFunction != null){
                                //Get the row key from rowIdProviderCallBack
                                eachRowHeaderKey = triggerCallBackProviderToGetRowId(eachTaskData, rowIdProviderCallBackFunction);
                                //console.log("Got  ID " + eachRowHeaderKey);
                         }
                         eachTaskData.rowId = eachRowHeaderKey; //set it as default rowId  as it is used in draw after first parsing
                         presentInOriginalList = false;
                         for(var index = 0 ; index < initialSetOfRowHeaderIds.length; index++) {   //jQuery in array removed due to performance issues in FF
                        	 //the full rowIds passed initially	is now there in actualFilterRowIds
                        	 var rowId = initialSetOfRowHeaderIds[index];
                        	 if(eachRowHeaderKey == rowId) {
                        		 presentInOriginalList = true;
                        		 break;
                        	 }
                         }
                         if(!presentInOriginalList) {
                        	 continue;
                         }

                         startDateAttribute = plot.getGanttStartDateAttribute(eachTaskData);
                         taskStartDate = eachTaskData[startDateAttribute]; //eg: startDate in milliseconds
                         eachColumnHeaderKey = plot.resetViewPortTime(taskStartDate);  //startDate rounded is eachColumnHeaderKey

                        //SET AS START ATTRIBUTE so that it is accessed in draw   with .start property
                         eachTaskData.start = taskStartDate;
                         endDateAttribute = plot.getGanttEndDateAttribute(eachTaskData);
                         var taskEndDate = eachTaskData[endDateAttribute]; //eg: endDate in milliseconds
                         //SET AS START ATTRIBUTE so that it is accessed in draw   with .start property
                         eachTaskData.end = taskEndDate;

                         var taskEndDateCeiled = plot.resetViewPortTime(taskEndDate);
                         var noOfDaySpan = (taskEndDateCeiled - eachColumnHeaderKey)/oneDayMillis;
                         eachTaskData.noOfDaySpan = noOfDaySpan;
                         currentRowIndex = getCurrentRowIndex(eachRowHeaderKey);
                         //checkLongRangeData and if so add to longRangeMap
                         if(noOfDaySpan < normalMaximumDaySpan) { // Note:  Check this only for normal data, for long range don't get this index
                               currentColumnIndex = getCurrentColumnIndex(eachColumnHeaderKey);
                         }
                         if(noOfDaySpan >= normalMaximumDaySpan) {
                                // update long  range data for this task
                                //keep array of ids to the actual longRangeDataMap
                                if(currentRowIndex != undefined) {
                              	  	 taskIDArray = plot.getLongRangeTaskIdArray(series, currentRowIndex);
                                       if(taskIDArray == null ) {
                                              taskIDArray = new Array();
                                       }
                                       var taskId = getIdForTask(eachTaskData);
										 if ($.inArray (taskId, taskIDArray) == -1) {
											taskIDArray.push(taskId);
										 }
                                       plot.setLongRangeTaskIdArray(series, currentRowIndex, taskIDArray);
                                }
                         } else {
                                if(currentRowIndex != undefined && currentColumnIndex != undefined) {
                              	   taskIDArray = plot.getNormalTaskIdArray(series, currentRowIndex, currentColumnIndex);
                                       if(taskIDArray == null ) {
                                              taskIDArray = new Array();
                                       }
                                       var taskId = getIdForTask(eachTaskData);
									   if ($.inArray (taskId, taskIDArray) == -1) {
											taskIDArray.push(taskId);
										}
                                       plot.setNormalTaskIdArray(series, currentRowIndex, currentColumnIndex, taskIDArray);
                                }
                         } //else
                  } //eachTaskData is not null
            }//for
            //var endTime = new Date().getTime();
        	//console.log("Total time taken -------------- " + (endTime - startTime));

     }

	    function removeExistingTaskFrom2Dmatrix(existingTask) {
	    	var noOfDaySpan = existingTask.noOfDaySpan;
	    	var series = plot.getSeries();
            var rowIndexMap = series.rowMap;
     		var dataMapRowIndex = rowIndexMap[existingTask.rowId];	//row header label in Y axis
     		var columnHeaderKey = plot.resetViewPortTime(existingTask.start);
     		var columnIndexMap = series.columnMap;
     		var dataMapColumnIndex = columnIndexMap[columnHeaderKey];
            var eachId, taskIdsArray = null;
            if(noOfDaySpan >= series.gantt.normalMaximumDaySpan) {
		 		if(dataMapRowIndex  && series.longRangeDataMap) {
			    		//Remove the task from longRangeData if the task is in this longRangeDataMap
		 				taskIdsArray = plot.getLongRangeTaskIdArray(series, dataMapRowIndex );
		 				var newIdArray = [];
		        		if(taskIdsArray != null ) {
		        			for(var i = 0; i < taskIdsArray.length ; i++) {
		        				eachId = taskIdsArray[i];
		    					  if(eachId != existingTask.chronosId) { //if same ID remove that from current
		    					  	  newIdArray.push(eachId);
		    					  }
		    				}
		    			}
			        	plot.setLongRangeTaskIdArray(series, dataMapRowIndex, newIdArray);
		     	}
            } else if(dataMapRowIndex && dataMapColumnIndex && series.data2DMatrix) {
            		// remove the data from normal task map
  	    			taskIdsArray = plot.getNormalTaskIdArray(series, dataMapRowIndex, dataMapColumnIndex) ;
  	    			var newIdArray = [], eachId;
  	        		if(taskIdsArray != null ) {
  	        			for(var i = 0; i < taskIdsArray.length; i++) {
  	        			  eachId = taskIdsArray[i];
      					  if(eachId != existingTask.chronosId) { //if same ID remove that from current
      					  	  newIdArray.push(eachId);
      					  }
  	    				}
  	    			}
  	    			plot.setNormalTaskIdArray(series, dataMapRowIndex, dataMapColumnIndex, newIdArray);
            }

	    }

	    /**
		 * A function which rebuckets  the existing 2d map data to the new datMap.
		 * Use case : useful when there is a change in the rowIdAttributeInTask and the plot need to be redraw with the new change.
		 * Asmpn: The only change in attributes of time ie start and endTime to draw the task.
		 */
	    function reBucketData2DMap() {
	    	 var series = plot.getSeries();
	    	// var startTime = new Date().getTime();
	    	//clear the existing 2D matrix and set the available row and column
	    	 series.rowAvailable = [];
	    	 series.columnAvailable =[];
	    	 series.rowMap = [];
	    	 series.columnMap = [];
	    	for (var row = 0; row < DATA_MATRIX_ROW_SIZE; row++) {
	    		 series.rowAvailable.push(row);
			}
			for (var col = 0; col < DATA_MATRIX_COLUMN_SIZE; col++) {
				series.columnAvailable.push(col);
			}
	    	var data2DMatrix = new Array(DATA_MATRIX_ROW_SIZE);
			for(var i = 0; i < DATA_MATRIX_ROW_SIZE; i++) {
				data2DMatrix[i] = new Array(DATA_MATRIX_COLUMN_SIZE);
			}
			series.data2DMatrix = data2DMatrix;

			//initialise longRangeData Map
			var longRangeDataMap = new Array(DATA_MATRIX_ROW_SIZE);
			series.longRangeDataMap = longRangeDataMap;

			var eachColumnHeaderKey, taskStartDate;
	        var startDateAttribute ,endDateAttribute;
	        var normalMaximumDaySpan = series.gantt.normalMaximumDaySpan;
	        var oneDayMillis = 24*3600*1000;
	        var currentRowIndex, currentColumnIndex = 0, eachTaskData, taskIDArray;
            var idTaskMap =  plot.getDataMap();
          //if data not in any row, the rowMap desn't get updated. So check that and add
            updateRowMapInOnDemandRebucket(series);
	           for(var eachTaskId in  idTaskMap) {
	                  eachTaskData = idTaskMap[eachTaskId];
	                  if(eachTaskData != null ) {
	                	   startDateAttribute  = plot.getGanttStartDateAttribute(eachTaskData);
	                	   taskStartDate = eachTaskData[startDateAttribute]; //eg: startDate in milliseconds
	                       eachColumnHeaderKey = plot.resetViewPortTime(taskStartDate);  //startDate rounded is eachColumnHeaderKey
	                        //SET AS START ATTRIBUTE so that it is accessed in draw   with .start property
	                         eachTaskData.start = taskStartDate;
	                         endDateAttribute = plot.getGanttEndDateAttribute(eachTaskData);
	                         var taskEndDate = eachTaskData[endDateAttribute]; //eg: endDate in milliseconds
	                         //SET AS START ATTRIBUTE so that it is accessed in draw   with .start property
	                         eachTaskData.end = taskEndDate;

	                         var taskEndDateCeiled = plot.resetViewPortTime(taskEndDate);
	                         var noOfDaySpan = (taskEndDateCeiled - eachColumnHeaderKey)/oneDayMillis;
	                         eachTaskData.noOfDaySpan = noOfDaySpan;
	                         var eachRowHeaderKey = eachTaskData.rowId ; // Assmpn: In the initial iteration this should have been correctly set in default rowId
	                         currentRowIndex = getCurrentRowIndex(eachRowHeaderKey);
	                         //checkLongRangeData and if so add to longRangeMap
	                         if(noOfDaySpan < normalMaximumDaySpan) { // Note:  Check this only for normal data, for long range don't get this index
	                               currentColumnIndex = getCurrentColumnIndex(eachColumnHeaderKey);
	                         }
	                         if(noOfDaySpan >= normalMaximumDaySpan) {
	                                // update long  range data for this task
	                                //keep array of ids to the actual longRangeDataMap
	                                if(currentRowIndex != undefined) {
	                              	  	 taskIDArray = plot.getLongRangeTaskIdArray(series, currentRowIndex);
	                                       if(taskIDArray == null ) {
	                                              taskIDArray = new Array();
	                                       }
	                                       var taskId = eachTaskData.chronosId;
										   if ($.inArray (taskId, taskIDArray) == -1) {
												taskIDArray.push(taskId);
											}
	                                       plot.setLongRangeTaskIdArray(series, currentRowIndex, taskIDArray);
	                                }
	                         } else if(currentRowIndex != undefined && currentColumnIndex != undefined) {
	                              	   taskIDArray = plot.getNormalTaskIdArray(series, currentRowIndex, currentColumnIndex);
	                                       if(taskIDArray == null ) {
	                                              taskIDArray = new Array();
	                                       }
	                                       var taskId = eachTaskData.chronosId;//getIdForTask(eachTaskData);
										   if ($.inArray (taskId, taskIDArray) == -1) {
												taskIDArray.push(taskId);
											}
	                                      //console.log("Pushing to taskIDArray>>>>>>>>>>>>>>>>>>>>>>>>>>> "  + eachTaskData.flightId);
	                                       plot.setNormalTaskIdArray(series, currentRowIndex, currentColumnIndex, taskIDArray);
	                         } //else if
	                  } //eachTaskData is not null
	            }//for
	            //Added to calculate max wrapped rows for each bucket in the 2D matrix
	            if (plot.areWrapRowsEnabled()) {
	            	plot.determineBucketWiseWrap(series, true); //calling as Async
				}
	        //var endTime = new Date().getTime();
	        //console.log("Total time taken  " + (endTime - startTime));
	    }

	    /**
	     * This function will create rowMap entry for which data was not updated.
	     * Usually when data gets updated, rowMap gets populated.
	     * This function is called from reBucketData2DMap.
	     */
	   function updateRowMapInOnDemandRebucket(series) {
		   for(var rowId in series.rowIdRowObjectMap) {
			   var eachRowHeaderObject = series.rowIdRowObjectMap[rowId];
				if(eachRowHeaderObject){
					var rowDataId = eachRowHeaderObject.rowId;
					var rowAvailableArray = series.rowAvailable;
					var rowIndex;
					if(series.rowMap[rowDataId] == undefined) {
						var yValue = series.rowYvalueMap[rowDataId];
						var displayedYValue = series.displayedRowIds[yValue];
						if (displayedYValue >= plot.currentLoadedData.yValueMin  &&
								displayedYValue <= plot.currentLoadedData.yValueMax && rowAvailableArray != undefined) {
								rowIndex = rowAvailableArray.pop();
								if(rowIndex != undefined) {
									series.rowMap[rowDataId] = rowIndex;
								}  else {
									console.log("WARNING !!! -  rowIndex not available !!");
								}
						  }
					}
				}

		   } //for
	   }

	  function triggerCallBackProviderToGetRowId(eachObject, providerFunction ) {
	       var args = new Array();
		   args.push(eachObject);
		   return eval(providerFunction).apply(this, args);
      }


	  //this function gets the rowHeader from callback and update the rowHeaderMap for label rendering.

	  function updateRowHeaderMap(rowHeaderObjectList) {
		var rowHeaderMap = series.rowHeaderMap;
		var rowYvalueMap = series.rowYvalueMap; //[yvalue] = rowId
		var rowIdAttribute = series.gantt.rowIdAttribute;
		var eachRowHeaderObject, yValue, rowId;
		//update rowHeaderObjects in series  when data fetch happens and data is available
        series.rowHeaderObjects = rowHeaderObjectList;
		for (var rowHeaderIndex = 0, len = rowHeaderObjectList.length; rowHeaderIndex < len; rowHeaderIndex++) {
				eachRowHeaderObject = rowHeaderObjectList[rowHeaderIndex];
				if(eachRowHeaderObject != null ) { //This is null only when a delete row happens
					if(series.rootTreeNode == undefined) {
						rowId = eachRowHeaderObject[rowIdAttribute]; //~ row ID value from <rowIdattaribute>
					} else {
						rowId = eachRowHeaderObject.rowId; //~ row ID value is to be taken from Node structure in tree
					}

					if(plot.areWrapRowsEnabled() ) {
						var rowIdExpandedStatusMap = plot.getRowIdExpandedStatusMap();
                        if(rowIdExpandedStatusMap[rowId]) {
                            eachRowHeaderObject.expanded = rowIdExpandedStatusMap[rowId];
							 //console.log(rowId ,  " eachRowHeaderObject.expanded   = "  , eachRowHeaderObject.expanded );
            }
						if(eachRowHeaderObject.expanded == undefined) { // if it is newly loaded, the expanded value will be empty
							  eachRowHeaderObject.expanded = series.gantt.wrappedRows.expandMode; //Wrap addition - default case of row display
							  rowIdExpandedStatusMap[rowId] = series.gantt.wrappedRows.expandMode;
			 			}
					}

					//Created to ensure that a map is maintained with rowHeaderObject and its rowID
					series.rowIdRowObjectMap[rowId] = eachRowHeaderObject; // full set of rowHeader Objects except deleted ones , including hidden rows
					if(hiddenRows.indexOf(rowId) == -1) { // not hidden
						yValue = rowYvalueMap[rowId]; //get the yValue and update map
						if ((rowHeaderMap[yValue] == undefined) || (rowHeaderMap[yValue] == null)) {
							rowHeaderMap[yValue] = eachRowHeaderObject;
						}

						var onDemandTree = false;
						if(series.rootTreeNode != undefined  && options.interaction.dataOnDemand) {
							onDemandTree = true;
						}
						//Note: If there are no data in the rows, the rowMap will not be updated for this row. So called here if in case
						//there is no task for this row or if it is a new row created.
						if(!onDemandTree) {  // DO THIS ONLY FOR ALL OTHER CASES EXCEPT TREE  WITH ON DEMAND
							// Reason for IF: if rowMap is poulated here  in case of ondemand tree, the discarding data logic by considering rowMap in callfetchData
							// function for collapsed rows will not work .
							getCurrentRowIndex(rowId);
						}
					}
				}
			} //for
	  }
	  /**
	   * This will be executed  for tree case.-  updating rowHeader Object passed from data fetch callback
	   *   Executes both in on demand and not on demand case
	   *
	   * In case of tree the series.rowHeaderObjects holds value as treeNodes. Only leafNode data is taken on demand.
	   * If it is not a tree  series.rowHeaderObjects  holds actual rowHeaderObject passsed by user
	   * Here if the rowIndex setting in rowMap for empty data rows(if not added from parse Data) is also considered.
	   * @param rowHeaderObjects is the list of rowHeader Vos passed for leaf Nodes in case of tree
	   * and list of row headerobjects  in case of normal chart
	   */
	  function setDataToRowHeader(rowHeaderObjects, series) {
		  //console.log("Setting Data To Row Header ", rowHeaderObjects);
		  var rowYvalueMap = series.rowYvalueMap; //[yvalue] = rowId
		  var rowHeaderObjectArrived, rowId,leafNodeObject, yValue;
		  var rowIdAttribute = series.gantt.rowIdAttribute;
		  var rowHeaderMap = series.rowHeaderMap;
		  for (var rowHeaderIndex = 0; rowHeaderIndex < rowHeaderObjects.length; rowHeaderIndex++) {
			  rowHeaderObjectArrived = rowHeaderObjects[rowHeaderIndex];
				if(rowHeaderObjectArrived != null ) { //This is null only when a delete row happens
				   rowId = rowHeaderObjectArrived[rowIdAttribute]; // when data is sent by user it is an array of normal rowheader objects
				  leafNodeObject = series.rowIdLeafNodeMap[rowId];
				  if(leafNodeObject != undefined && rowHeaderObjectArrived.data == null) {
					  leafNodeObject.data = rowHeaderObjectArrived;
					  series.rowIdRowObjectMap[rowId] = leafNodeObject;
					  $.each(series.rowHeaderObjects , function(index, eachRowHeaderObject) {
						  	if(eachRowHeaderObject.rowId == rowId) { //ONLY SET DATA FOR LEAF NODES
						  		series.rowHeaderObjects[index]  = leafNodeObject;
						  		//console.log("Setting data in rowHeaderObjects ", leafNodeObject);
						  	}
					  });
				  }
				  if(hiddenRows.indexOf(rowId) == -1) { // not hidden
						yValue = rowYvalueMap[rowId]; //get the yValue and update map
						if ((rowHeaderMap[yValue] == undefined) || (rowHeaderMap[yValue] == null)) {
							rowHeaderMap[yValue] = leafNodeObject;
						}

						var onDemandTree = false;
						if(series.rootTreeNode != undefined  && options.interaction.dataOnDemand) {
							onDemandTree = true;
						}
						//Note: If there are no data in the rows, the rowMap will not be updated for this row. So called here if in case
						//there is no task for this row or if it is a new row created.
						if(!onDemandTree) {  // DO THIS ONLY FOR ALL OTHER CASES EXCEPT TREE  WITH ON DEMAND
							// Reason for IF: if rowMap is populated here  in case of ondemand tree, the discarding data logic by considering rowMap in callfetchData
							// function for collapsed rows will not work .
				  //Note: If there are no data in the rows, the rowMap will not be updated for this row for parseGanttData.
				  // So called here if in case there is no task for this row or if it is a new row created.
				  getCurrentRowIndex(rowId);
						}
					}
				} //null
		  }//for
	  }

	  /**
	   *  This map will have  full set of rowHeader Objects except deleted ones, including hidden rows.
	   *  The key will be rowId and the value will be the rowheader Objects
	   *  series.rowHeaderIds will give u the full rowIds passed to client initially.
	   *
	   */
	  plot.getFullListOfRowHeaderObjects = function getFullListOfRowHeaderObjects() {
		  return series.rowIdRowObjectMap;
	  };
		/**
		 * return all rowHeaders passed from  server present in  the rowHeaderMap
		 * This will not have hidden rowIds in this. ie all rowheaders which are not hidden
		 * @returns {Array}
		 */
		function getRowHeaderArray() {
			var rowHeaderArray = [];
			var series = plot.getSeries();
			var rowHeaderMap = series.rowHeaderMap;
			for(var index in rowHeaderMap) {
				if(rowHeaderMap[index] != null) {
					rowHeaderArray.push(rowHeaderMap[index]);
				}
	        }
			return rowHeaderArray;
		}

		/**
		 * return  the rowIndex to be used for  finding position in the 2d dataMap for saving actualdata
		 */
		function getCurrentRowIndex(rowDataId) {
			var series = plot.getSeries();
			var rowAvailableArray = series.rowAvailable;
			var rowIndex =  series.rowMap[rowDataId];

			//Note:  initially rowAvailableArray will be undefined when called from setupCoreFramework from initialise setup.
			//For integers !0 will not work if !rowIndex is used. ISRM-3586
			if(rowIndex == null || rowIndex == undefined) {
				var yValue = series.rowYvalueMap[rowDataId];	//displayed yValue corresponding to rowId
				 //ISRM-4583 in case of tree collapsed  only the displayed yValue need to be checked
                var displayedYValueOfRow ,actualYValueOfRow;
                if(plot.areWrapRowsEnabled() && series.actualFirstWrapDisplayMap){ // in case of wrap
                	//first calculate the displayedYValue considering wrap rows.
                	// actualFirstWrapDisplayMap keeps key as actualYValye and value as the first displayedYValue of the Row (wrapIndex = 0).
                    displayedYValueOfRow = series.actualFirstWrapDisplayMap[yValue];
                    actualYValueOfRow = series.displayedRowIds[displayedYValueOfRow];
                } else {
                	//displayedRowIds has keys as displayedYValue and value as actualyValue of row
                    actualYValueOfRow = series.displayedRowIds[yValue];
                }
				if (actualYValueOfRow >= plot.currentLoadedData.yValueMin  &&
						actualYValueOfRow <= plot.currentLoadedData.yValueMax && rowAvailableArray != undefined) {
						rowIndex = rowAvailableArray.pop();
						if(rowIndex != undefined) {
							series.rowMap[rowDataId] = rowIndex;
						}  else {
	     					console.log("WARNING !!! -  rowIndex not available !!");
	     				}

				  }
			}
			return rowIndex;
		}
		/**
		 * return  the columnIndex to be used for  finding position in the 2d  dataMap for saving actualdata
		 */
		function getCurrentColumnIndex(date) {
              var oneDayMillis = 24*3600*1000;
              var normalSpanMillis = series.gantt.normalMaximumDaySpan * oneDayMillis; // to check the ending tasks also in the loaded range
              var currentLoadedData = plot.currentLoadedData;
              var columnIndex = series.columnMap[date];
	          if(columnIndex == null || columnIndex == undefined) {
	          	  if ((date >= plot.resetViewPortTime(currentLoadedData.fromDate)) && (date <= currentLoadedData.toDate)) {
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

		function getTaskAlreadyAddedInMap(task) {
			var idTaskMap =  plot.getDataMap();
         	var taskIdProviderCallBackFunction = series.gantt.taskIdProviderCallBack;
         	var id; //= task.id;
         	if(taskIdProviderCallBackFunction != null) {
         		//Get the ID key from taskIdProviderCallBackFunction
 				id = triggerCallBackProviderToGetRowId(task, taskIdProviderCallBackFunction);
         	} else { //backward compatibility
 				id = task.id; //eg: Crew5 deafult is 'rowId'
 			}
         	return idTaskMap[id.toString()];

		}


		/**
		 * Will return an id for the task
		 * This method also put these ids and corresponding objects in another map - dataMap
		 *
		 */
		function getIdForTask(task) {
			var idTaskMap =  plot.getDataMap();
         	var taskIdProviderCallBackFunction = series.gantt.taskIdProviderCallBack;
         	var id; //= task.id;

         	if(taskIdProviderCallBackFunction != null) {
         		//Get the ID key from taskIdProviderCallBackFunction
 				id = triggerCallBackProviderToGetRowId(task, taskIdProviderCallBackFunction);
         	} else if(task.id != null) { //backward compatibility
 				id = task.id; //eg: Crew5 deafult is 'rowId'
 			}

         	task.chronosId = id;
			//Also save the id and corresponding task objects in idTaskMap
			if(id != undefined) {
				idTaskMap[id.toString()] = task;
			}
			return id;
		}

		/**
		 * Pass boolean true or false to enable Pan mode
		 */
		function enablePanMode(enableMode) {
			var options = plot.getOptions();
			if(enableMode) {
				options.pan.interactive = true;
			} else {
				options.pan.interactive = false;
			}
		}
		/**
		 * pass boolean true or false to enable rectangle select
		 */
		function enableRectangleSelectMode(enableMode) {
			var options = plot.getOptions();
			if(enableMode) {
				options.rectangleSelect.interactive = true;
			} else {
				options.rectangleSelect.interactive = false;
			}
		}

		/**
		 * pass boolean true or false to enable task create using mouse drag
		 */

		function enableRectangleTaskCreateMode(enableMode) {
			var options = plot.getOptions();
			if(enableMode) {
				options.taskCreate.interactive = true;
			} else {
				options.taskCreate.interactive = false;
			}
		}


        /**
		 * pass boolean true or false to enable resizing of task objects
		 */
		function enableTaskResizeMode(enableMode, plotObject) {
			var options = plotObject.getOptions();
			if(enableMode) {
				options.taskResize.interactive = true;
			} else {
				options.taskResize.interactive = false;
			}
		}
        //Function to parse the data for bar and line
        function parseData(d) {
            var res = [];
            for (var i = 0; i < d.length; ++i) {
                var s = $.extend(true, {}, options.series);

                if (d[i].data != null) {
                    s.data = d[i].data; // move the data instead of deep-copy
                    delete d[i].data;

                    $.extend(true, s, d[i]);

                    d[i].data = s.data;
                }
                else
                    s.data = d[i];
                res.push(s);
            }

            return res;
        }


        /**
         * ganttData .data will the list of tasks
         */
    	function removeTasksFromBucket(ganttData) {
    		var ganttTaskDataArray = ganttData.data;
    		var eachNewTask;
    		if (ganttTaskDataArray != null) {
	    		for ( var count = 0; count < ganttTaskDataArray.length; count++) {
	    			eachNewTask = ganttTaskDataArray[count];
	    			removeTaskFromBucket(eachNewTask) ;
				}
	    		//ganttTaskDataArray = null;
    		}

    		if (plot.forcedDraw) {
    			plot.setupGrid();
    			plot.draw();
    		}
      	}

        /*
         *Remove  task from corresponding bucket
         */

    	 function removeTaskFromBucket(oldTask) {
         	var currentSeries = plot.getSeries();
         	var rowIdProviderCallBackFunction = currentSeries.gantt.rowIdProviderCallBack;
         	var rowIdAttributeInTask = currentSeries.gantt.rowIdAttributeInTask, eachRowHeaderKey = null;
         	if(rowIdAttributeInTask != null) {
 				eachRowHeaderKey = oldTask[rowIdAttributeInTask]; //eg: Crew5 deafult is 'rowId'
 			} else if(rowIdProviderCallBackFunction != null){
 				//Get the row key from rowIdProviderCallBack
 				eachRowHeaderKey = triggerCallBackProviderToGetRowId(oldTask, rowIdProviderCallBackFunction);
 			}
         	oldTask.rowId = eachRowHeaderKey;  //set it as default rowId     as it is used in draw
         	var idTaskMap = plot.getDataMap();
     		var rowIndexMap = currentSeries.rowMap;
     		var dataMapRowIndex = rowIndexMap[eachRowHeaderKey];	//row header label in Y axis

     		var startDateAttribute = plot.getGanttStartDateAttribute(oldTask);
     		var taskStartDate = oldTask[startDateAttribute]; //eg: startDate in milliseconds
 			//SET AS START ATTRIBUTE so that it is accessed in draw   with .start property
     		oldTask.start = taskStartDate;
     		var startDayIndexRounded = plot.resetViewPortTime(taskStartDate);
     		var columnIndexMap = currentSeries.columnMap;
     		var dataMapColumnIndex = columnIndexMap[startDayIndexRounded];	// days in long milliis in X axix
     		var taskIdsArray, newIdArray;
     		var isNormalTask = false;
     		var isLongRangeTask = false;
     		var returnObj;
     		if(dataMapRowIndex && dataMapColumnIndex && currentSeries.data2DMatrix) {
 	    			taskIdsArray = plot.getNormalTaskIdArray(currentSeries, dataMapRowIndex, dataMapColumnIndex) ;
 	    			returnObj = createNewArrayAfterRemoving(taskIdsArray, oldTask.chronosId);
 	    			isNormalTask = returnObj.foundTask;
 	    			plot.setNormalTaskIdArray(currentSeries, dataMapRowIndex, dataMapColumnIndex, returnObj.newIdArray);
     		}
     		if(!isNormalTask && dataMapRowIndex  && currentSeries.longRangeDataMap) {
 	    			//Remove the task from longRangeData if the task is in this longRangeDataMap
     				taskIdsArray = plot.getLongRangeTaskIdArray(currentSeries,dataMapRowIndex );
     				returnObj  = createNewArrayAfterRemoving(taskIdsArray, oldTask.chronosId);
     				isLongRangeTask = returnObj.foundTask;
 	        		plot.setLongRangeTaskIdArray(currentSeries, dataMapRowIndex, returnObj.newIdArray);
	     	}
     		//Delete the old task from dataMap
 	    	delete(idTaskMap[oldTask.chronosId]);
 	    	// delete it from highlights map as well
 	    	unhighlightTask(oldTask); // removes from highlights map as well
 	    	if (plot.areWrapRowsEnabled()) {
 	    		//clear this deleted task from wrapRowTaskList maps
 	    		plot.clearWrapRowTaskListMaps(eachRowHeaderKey, oldTask.wrappedRowIndex, startDayIndexRounded , isLongRangeTask);
				//update the wrap Index of this row alone
				plot.determineBucketWiseWrapForEachRow(eachRowHeaderKey, currentSeries, true);  //true =>  clearWrapIndexForTasksInRow
				// recalculate the actualFilter rowIds and update the wrapIndex map after this
				plot.updateWrapIndexDisplayMap();
			}
 	    	executeHooks(hooks.removeTaskFromBucket, [oldTask]);
         }

	   	function createNewArrayAfterRemoving(taskIdsArray, oldTaskId) {
    		var newIdArray = [];
    		var foundTask;
    		if(taskIdsArray != null ) {
				$.each(taskIdsArray, function(index, eachId) {
					  if(eachId != oldTaskId) { //if same ID remove that from current
					  	  newIdArray.push(eachId);
					  }  else {
						  foundTask =  true;
					  }
				});
			}

			//Check if these items are there in the  highlightList, if so remove
    		 if (oldTaskId) {
                // delete(highlights[oldTaskId]);
                 highlights.splice(highlights.indexOf(oldTaskId) , 1);
             }

			  //or check if item is a hoverItem, if so remove
			  if(hoverItem  && oldTaskId == hoverItem.details.chronosId) {
					  hoverItem = null;
			  }
			  return {
	    			newIdArray: newIdArray,
	    			foundTask: foundTask
	    		}
    	}


    	/**
    	 * ganttData {
    	 * 	data 	: will be list of tasks to be added
    	 *  rowHeaders :  the rowhearder object to be updated :  Asmpn.. rowHeaderId will be same;
    	 */
    	function addNewTasksAndRowHeadersToBucket(ganttData) {
    		var ganttTaskDataArray = ganttData.data;
    		var ganttRowHeaders = ganttData.rowHeaders;
    		var eachNewTask;
    		if (ganttTaskDataArray != null) {
	    		for ( var count = 0; count < ganttTaskDataArray.length; count++) {
	    			eachNewTask = ganttTaskDataArray[count];
	    			addTaskInBucket(eachNewTask) ;
				}
	    		ganttTaskDataArray = null;
    		}
    		if(ganttRowHeaders != null) {
    			updateNewRowHeaderToMap(ganttRowHeaders);
    			ganttRowHeaders = null;
    		}

    		if (plot.forcedDraw) {
    			plot.draw();
    		}
    	}

        /*
         *Add  task in corresponding bucket
         */
        function addTaskInBucket(newTask) {
        	var currentSeries = plot.getSeries(),
    		//opts = plot.getOptions(),
    		normalMaximumDaySpan = currentSeries.gantt.normalMaximumDaySpan,
    		rowIdProviderCallBackFunction = currentSeries.gantt.rowIdProviderCallBack,
    		rowIdAttributeInTask = currentSeries.gantt.rowIdAttributeInTask,
    		eachRowHeaderKey, eachColumnHeaderKey;

	    	//check if this id is there in dataMap . if so remove it
	    	var idTaskMap =  plot.getDataMap();
	    	var startDateAttribute = plot.getGanttStartDateAttribute(newTask);
	    	var endDateAttribute = plot.getGanttEndDateAttribute(newTask);
	    	var taskStartDate = newTask[startDateAttribute]; //eg: startDate in milliseconds
	    	var taskEndDate = newTask[endDateAttribute]; //eg: endDate in milliseconds
	    	// if it is not there there is a task with this ID, add it to bucket blindly
	    	if(rowIdAttributeInTask != null) {
				eachRowHeaderKey = newTask[rowIdAttributeInTask]; //eg: Crew5 deafult is 'rowId'
			} else if(rowIdProviderCallBackFunction != null) {
				//Get the row key from rowIdProviderCallBack
				eachRowHeaderKey = triggerCallBackProviderToGetRowId(newTask, rowIdProviderCallBackFunction);
			}

	    	//Check if this task already exist in the dataMap
	    	if(newTask.chronosId != null) {
	        	var oldTask  = idTaskMap[newTask.chronosId];
	        	if(oldTask) { //if it is there already remove it
	              //console.log("Task start date"+taskStartDate);
	                var oldTaskStartDate = oldTask[startDateAttribute];
	                var oldTaskEndDate = oldTask[endDateAttribute];
	                var oldTaskRowId;
	                if(rowIdAttributeInTask != null) {
	    				oldTaskRowId = oldTask[rowIdAttributeInTask];
	    			} else if(rowIdProviderCallBackFunction != null) {
	    				//Get the row key from rowIdProviderCallBack
	    				oldTaskRowId = triggerCallBackProviderToGetRowId(oldTask, rowIdProviderCallBackFunction);
	    			}
	                if((taskStartDate == oldTaskStartDate) && (taskEndDate == oldTaskEndDate) &&
	                		(oldTaskRowId == eachRowHeaderKey) ){
	                	//just update and return;
	                	//Added for ISRM-7513
						newTask.rowId = eachRowHeaderKey;
                        newTask.start = taskStartDate;
                        newTask.end = taskEndDate;
                        newTask.yValue = oldTask.yValue;
	                    idTaskMap[newTask.chronosId] = newTask;
	                    return;
	                } else {
	                	plot.removeTaskFromBucket(oldTask);
	                }
	        	}
	    	} else {
	    	    getIdForTask(newTask); //Note :  chronosId might not be set if it is a new task passed by user
	    	}

			newTask.rowId = eachRowHeaderKey; //set it as default rowId     as it is used in draw
			//console.log("Got  ID " + eachRowHeaderKey);
	   		var rowIndexMap = currentSeries.rowMap;
			var dataMapRowIndex = rowIndexMap[eachRowHeaderKey];	//label in Y axis
			eachColumnHeaderKey = plot.resetViewPortTime(taskStartDate);
			//SET AS START ATTRIBUTE so that it is accessed in draw   with .start property
			newTask.start = taskStartDate;

			//SET AS end ATTRIBUTE so that it is accessed in draw   with .end property
			newTask.end = taskEndDate;
			//console.log(' NEW TASK dataMapRowIndex' + dataMapRowIndex  + " eachRowHeaderKey " + eachRowHeaderKey);
			var columnIndexMap = currentSeries.columnMap;
			var dataMapColumnIndex = columnIndexMap[eachColumnHeaderKey];	// days in long milliis in X axix rounded

			//console.log('NEW TASK dataMapColumnIndex' + dataMapColumnIndex  + " eachColumnHeaderKey " + eachColumnHeaderKey);
			var taskEndDateCeiled = plot.resetViewPortTime(taskEndDate);
			var oneDayMillis = 24*3600*1000;
			var noOfDaySpan = (taskEndDateCeiled - eachColumnHeaderKey)/oneDayMillis;

			//console.log("No:of day Span " + noOfDaySpan + " normalMaximumDaySpan " + normalMaximumDaySpan);
			addToCorrectBucket(dataMapRowIndex, dataMapColumnIndex, newTask, noOfDaySpan, normalMaximumDaySpan);
			executeHooks(hooks.addTaskInBucket, [newTask]);

			//console.log("plot.areWrapRowsEnabled() " , plot.areWrapRowsEnabled());
			if (plot.areWrapRowsEnabled()) {
				//update the wrap Index of that row alone
				plot.determineBucketWiseWrapForEachRow(eachRowHeaderKey, currentSeries, true);  //true =  clearWrapIndexForTasksInRow
				// recalculate the actualFilter rowIds and update the wrapIndex map after this
				plot.updateWrapIndexDisplayMap();
			}
	    }
        /**
         * adding to the correct bucket
         */
        function addToCorrectBucket(dataMapRowIndex, dataMapColumnIndex, newTask, noOfDaySpan, normalMaximumDaySpan) {
        	var taskIDArray,
        		series = plot.getSeries();
				//Now add it appropriately accordign to the type of task
				if(noOfDaySpan >= normalMaximumDaySpan) {
					// update long  range data for this task
					//Get the longrange array again.
					if(dataMapRowIndex != undefined) {
						taskIDArray = plot.getLongRangeTaskIdArray(series, dataMapRowIndex);
						if(taskIDArray == null || taskIDArray == undefined ) {
							taskIDArray = new Array();
						}
						taskIDArray.push(getIdForTask(newTask));
						plot.setLongRangeTaskIdArray(series, dataMapRowIndex,taskIDArray );
						/*console.log("Pushing LONGRANGE DATA Array of ID " + taskIDArray + "\n dataMapRowIndex " + dataMapRowIndex
								+ "currentColumnIndex " +  currentColumnIndex); */
					}

				} else {
					//Get the new array again.
					if(dataMapRowIndex != undefined && dataMapColumnIndex != undefined) {
						taskIDArray = plot.getNormalTaskIdArray(series, dataMapRowIndex, dataMapColumnIndex );
						if(taskIDArray == null || taskIDArray == undefined ) {
							taskIDArray = new Array();
						}
						taskIDArray.push(getIdForTask(newTask));
					    	/*console.log("Pushing to Array of ID -  " + taskIDArray + "\n dataMapRowIndex= " + dataMapRowIndex
						 			+ " , dataMapColumnIndex = " +  dataMapColumnIndex);  */
						plot.setNormalTaskIdArray(series, dataMapRowIndex, dataMapColumnIndex, taskIDArray );
					}

			 }
        }

        function updateNewRowHeaderToMap(rowHeaderObjectList) {
			var rowHeaderMap = series.rowHeaderMap;
			var rowYvalueMap = series.rowYvalueMap;
			var rowIdAttribute = series.gantt.rowIdAttribute;
			var eachRowHeaderObject, yValue, rowHeaderId;

			for (var rowHeaderIndex = 0; rowHeaderIndex < rowHeaderObjectList.length; rowHeaderIndex++) {
				eachRowHeaderObject = rowHeaderObjectList[rowHeaderIndex];
				if(series.rootTreeNode == undefined) {
					rowHeaderId = eachRowHeaderObject[rowIdAttribute]; //~ row ID value from <rowIdattaribute>
				} else {
					//if tree
					rowHeaderId = eachRowHeaderObject.rowId; //~ row ID value is to be taken from Node structure
				}
				series.rowIdRowObjectMap[rowHeaderId] = eachRowHeaderObject;
				yValue = rowYvalueMap[rowHeaderId]; //get the yValue and update map
				if(yValue != null) {
					rowHeaderMap[yValue] = eachRowHeaderObject;
				}
			}
			//update the existing rowHeaderObjects in the series with the new modified
		   for (var rowHeaderIndex = 0, len = series.rowHeaderObjects.length; rowHeaderIndex < len; rowHeaderIndex++) {
                eachRowHeaderObject = series.rowHeaderObjects[rowHeaderIndex];
                if(eachRowHeaderObject != null  && series.rootTreeNode == undefined) { // normal case
                  var rowId = eachRowHeaderObject[rowIdAttribute]; //~ row ID value from <rowIdattaribute>
                  if (series.rowIdRowObjectMap[rowId]) {
                      series.rowHeaderObjects[rowHeaderIndex] = series.rowIdRowObjectMap[rowId];
                  }
                }
            } //for
		}
        /**
         * This will return a an array of all ids of items in a row with this rowId
         */
        function getAllItemsInARow(rowDataId) {
        	//console.log('getAllItemsInARow ' + rowDataId) ;
        	var currentSeries = plot.getSeries(),
        	 rowMap = currentSeries.rowMap,
			 rowIndex =  rowMap[rowDataId],
			 oneDayMillis = 24*3600*1000;
			var rowItemIds=[], idArray;
			var xaxisOpts = currentSeries.xaxis.options;
			var minViewTime , maxViewTime;
			if(plot.currentLoadedData.fromDate  == 0) {
        		minViewTime = xaxisOpts.scrollRange[0]; //non realtime data fetch case
        	}
        	if(plot.currentLoadedData.toDate  == -1) {
        		maxViewTime = xaxisOpts.scrollRange[1];
        	}
			var normalSpanMillis = currentSeries.gantt.normalMaximumDaySpan * oneDayMillis; // to check the ending tasks also in the open view range
			//TO BE DONE IN BOTH CASES
				minViewTime = plot.currentLoadedData.fromDate - normalSpanMillis; // in case of realtime data fetch
        	maxViewTime = plot.currentLoadedData.toDate;

        	for (var eachDay = plot.resetViewPortTime(minViewTime) ; eachDay <= plot.resetViewPortTime(maxViewTime); ) {
				var columnMap = plot.getSeries().columnMap;
				var columnIndex = columnMap[eachDay];
				if(rowIndex != undefined  && columnIndex != undefined) {
					idArray = plot.getNormalTaskIdArray(currentSeries, rowIndex, columnIndex );
					if(idArray != undefined ||  idArray != null) {
						for ( var item = 0; item < idArray.length; item++) {
							rowItemIds.push(idArray[item]);
						}
					}
				}
				eachDay = eachDay  + oneDayMillis;
			}//for
        	//adding long range data also
        	if(currentSeries.longRangeDataMap != undefined && rowIndex != undefined) {
        		var taskObjectIdArray = plot.getLongRangeTaskIdArray(currentSeries, rowIndex );
				if(taskObjectIdArray != undefined) {
    				for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
       					rowItemIds.push(taskObjectIdArray[taskID]);

    				}//for
				}
			}
			return rowItemIds;
        }

        function processData() {
            var topSentry = Number.POSITIVE_INFINITY,
                bottomSentry = Number.NEGATIVE_INFINITY,
                fakeInfinity = Number.MAX_VALUE,
                i, j, k, m,
                s, points, ps, val, f, p, format = 0;
               // x, y, axis;

            function updateAxis(axis, min, max) {
                if (min < axis.datamin && min != -fakeInfinity)
                    axis.datamin = min;
                if (max > axis.datamax && max != fakeInfinity)
                    axis.datamax = max;
            }

            $.each(allAxes(), function (_, axis) {
                // init axis
            	axis.datamin = topSentry;
                axis.datamax = bottomSentry;
                axis.used = false;
            });

            for (i = 0; i < series.length; ++i) {
                s = series[i];
                s.datapoints = { points: [] };

                executeHooks(hooks.processRawData, [ s, s.data, s.datapoints ]);
            }

            // first pass: clean and copy data
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                var data = s.data;
                format = s.datapoints.format;

                if (!format) {
                    format = [];
                    // find out how to copy
                    format.push({ x: true, number: true, required: true });
                    format.push({ y: true, number: true, required: true });

                    if (s.bars.show || (s.lines.show && s.lines.fill)) {
                        format.push({ y: true, number: true, required: false, defaultValue: 0 });
                        if (s.bars.horizontal) {
                            delete format[format.length - 1].y;
                            format[format.length - 1].x = true;
                        }
                    }

                    s.datapoints.format = format;
                }

                if (s.datapoints.pointsize != null)
                    continue; // already filled in

                s.datapoints.pointsize = format.length;

                ps = s.datapoints.pointsize;
                points = s.datapoints.points;

                var insertSteps = s.lines.show && s.lines.steps;
                s.xaxis.used = s.yaxis.used = true;

                for (j = k = 0; j < data.length; ++j, k += ps) {
                    p = data[j];

                    var nullify = p == null;
                    if (!nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = p[m];
                            f = format[m];

                            if (f) {
                                if (f.number && val != null) {
                                    val = +val; // convert to number
                                    if (isNaN(val))
                                        val = null;
                                    else if (val == Infinity)
                                        val = fakeInfinity;
                                    else if (val == -Infinity)
                                        val = -fakeInfinity;
                                }

                                if (val == null) {
                                    if (f.required)
                                        nullify = true;

                                    if (f.defaultValue != null)
                                        val = f.defaultValue;
                                }
                            }

                            points[k + m] = val;
                        }
                    }

                    if (nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = points[k + m];
                            if (val != null) {
                                f = format[m];
                                // extract min/max info
                                if (f.x)
                                    updateAxis(s.xaxis, val, val);
                                if (f.y)
                                    updateAxis(s.yaxis, val, val);
                            }
                            points[k + m] = null;
                        }
                    }
                    else {
                        // a little bit of line specific stuff that
                        // perhaps shouldn't be here, but lacking
                        // better means...
                        if (insertSteps && k > 0
                            && points[k - ps] != null
                            && points[k - ps] != points[k]
                            && points[k - ps + 1] != points[k + 1]) {
                            // copy the point to make room for a middle point
                            for (m = 0; m < ps; ++m)
                                points[k + ps + m] = points[k + m];

                            // middle point has same y
                            points[k + 1] = points[k - ps + 1];

                            // we've added a point, better reflect that
                            k += ps;
                        }
                    }
                }
            }

            // give the hooks a chance to run
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                executeHooks(hooks.processDatapoints, [ s, s.datapoints]);
            }

            // second pass: find datamax/datamin for auto-scaling

            for (i = 0; i < series.length; ++i) {
                s = series[i];
                points = s.datapoints.points,
                ps = s.datapoints.pointsize;
                var xmin = topSentry, ymin = topSentry,
                    xmax = bottomSentry, ymax = bottomSentry;

                for (j = 0; j < points.length; j += ps) {
                    if (points[j] == null)
                        continue;

                    for (m = 0; m < ps; ++m) {
                        val = points[j + m];
                        f = format[m];
                        if (!f || val == fakeInfinity || val == -fakeInfinity) {
                            continue;
                        }
                        if (f.x) {
                            if (val < xmin)
                                xmin = val;
                            if (val > xmax)
                                xmax = val;
                        }
                        if (f.y) {
                            if (val < ymin)
                                ymin = val;
                            if (val > ymax)
                                ymax = val;
                        }
                    }
                }

                if (s.bars.show) {
                    // make sure we got room for the bar on the dancing floor
                    var delta = s.bars.align == "left" ? 0 : -s.bars.barWidth/2;
                    if (s.bars.horizontal) {
                        ymin += delta;
                        ymax += delta + s.bars.barWidth;
                    }
                    else {
                        xmin += delta;
                        xmax += delta + s.bars.barWidth;
                    }
                }

                updateAxis(s.xaxis, xmin, xmax);
                updateAxis(s.yaxis, ymin, ymax);
            }

            $.each(allAxes(), function (_, axis) {
                if (axis.datamin == topSentry)
                    axis.datamin = null;
                if (axis.datamax == bottomSentry)
                    axis.datamax = null;
            });
        }

        function axisNumber(obj, coord) {
            var a = obj[coord + "axis"];
            if (typeof a == "object") // if we got a real axis, extract number
                a = a.n;
            if (typeof a != "number")
                a = 1; // default to first axis
            return a;
        }

        function allAxes() {
            // return flat array without annoying null entries
            return $.grep(yaxes.concat(xaxes), function (a) { return a; });
        }
        /**
         * returns the xaxix accordign to a time plotted
         * @param timeInmilliseconds
         * @returns
         */
        function getCanvasXCoordinateForTime(timeInmilliseconds) {
            var i, axis, xaxes;
        	xaxes = plot.getXAxes();
            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used) {
                    return axis.p2c(timeInmilliseconds);
                }
            }
        }

        function canvasToAxisCoords(pos) { //c2p
            // return an object with x/y corresponding to all used axes
            var res = {}, i, axis;
            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used)
                    res["x" + axis.n] = axis.c2p(pos.left);
            }

            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used)
                    res["y" + axis.n] = axis.c2p(pos.top);
            }

            if (res.x1 !== undefined)
                res.x = res.x1;
            if (res.y1 !== undefined)
                res.y = res.y1;

            return res;
        }

        function axisToCanvasCoords(pos) {
            // get canvas coords from the first pair of x/y found in pos
            var res = {}, i, axis, key;

            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used) {
                    key = "x" + axis.n;
                    if (pos[key] == null && axis.n == 1)
                        key = "x";

                    if (pos[key] != null) {
                        res.left = axis.p2c(pos[key]);
                        break;
                    }
                }
            }

            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used) {

                    key = "y" + axis.n;
                    if (pos[key] == null && axis.n == 1)
                        key = "y";
                    if (pos[key] != null) {
                        res.top = axis.p2c(pos[key]);
                        break;
                    }
                }
            }

            return res;
        }

        /*
         * Setting all series opsions for multiple series
         * for charts - line & bar  and set up the axix
         * correspondingly.
         */

        function fillInSeriesOptions() {
            var i;
            // collect what we already got of colors
            var neededColors = series.length,
                usedColors = [],
                assignedColors = [];
            for (i = 0; i < series.length; ++i) {
                var sc = series[i].color;
                if (sc != null) {
                    --neededColors;
                    if (typeof sc == "number")
                        assignedColors.push(sc);
                    else
                        usedColors.push($.color.parse(series[i].color));
                }
            }
            // we might need to generate more colors if higher indices
            // are assigned
            for (i = 0; i < assignedColors.length; ++i) {
                neededColors = Math.max(neededColors, assignedColors[i] + 1);
            }

            // produce colors as needed
            var colors = [], variation = 0;
            i = 0;
            while (colors.length < neededColors) {
                var c;
                if (options.colors.length == i) // check degenerate case
                    c = $.color.make(100, 100, 100);
                else
                    c = $.color.parse(options.colors[i]);

                // vary color if needed
                var sign = variation % 2 == 1 ? -1 : 1;
                c.scale('rgb', 1 + sign * Math.ceil(variation / 2) * 0.2);
                // we should probably skip this one
                colors.push(c);
                ++i;
                if (i >= options.colors.length) {
                    i = 0;
                    ++variation;
                }
            }

            // fill in the options
            var colori = 0, s;

            for (i = 0; i < series.length; ++i) {
                s = series[i];

                // assign colors
                if (s.color == null) {
                    s.color = colors[colori].toString();
                    ++colori;
                }
                else if (typeof s.color == "number")
                    s.color = colors[s.color].toString();

                // turn on lines automatically in case nothing is set
                if (s.lines.show == null) {
                    var v = 0, show = true;
                    for (v in s)
                        if (s[v] && s[v].show) {
                            show = false;
                            break;
                        }
                    if (show)
                        s.lines.show = true;
                }

                // setup axes
                s.xaxis = getOrCreateAxis(xaxes, axisNumber(s, "x"));
                s.yaxis = getOrCreateAxis(yaxes, axisNumber(s, "y"));
            }
        }

        function fillInGanttOptions() {

            // fill in the options
            var s = series;
            // setup axes
            s.xaxis = getOrCreateAxis(xaxes, axisNumber(s, "x"));
            s.yaxis = getOrCreateAxis(yaxes, axisNumber(s, "y"));

            $.each(allAxes(), function (_, axis) {
                if (axis.direction == "x") {
                    axis.used = true;
                } else {
                     axis.used = true;
                 }
             });

          //Some initialisations for checkign renderers are functions and store its eval object globally
			 isTaskRendererAFunction  = $.isFunction(series.taskRenderer);

			var cornerFunction = options.grid.cornerBox.cornerRendererCallbackFn;
			if(cornerFunction != null) {
				isCornerRendererAFunction  = $.isFunction(cornerFunction);
			}
			var priorityFn = options.series.gantt.priorityProvider;
			if(priorityFn != null) {
				isPriorityProviderAFunction = $.isFunction(priorityFn);
			}



        }

        function getOrCreateAxis(axes, number) {
            if (!axes[number - 1])
                axes[number - 1] = {
                    n: number, // save the number for future reference
                    direction: axes == xaxes ? "x" : "y",
                    options: $.extend(true, {}, axes == xaxes ? options.xaxis : options.yaxis)
                };

            return axes[number - 1];
        }

        function getCanvasDimensions() {
            canvasWidth = placeholder.width();
            canvasHeight = placeholder.height();
            if (canvasWidth <= 0 || canvasHeight <= 0) {
            	if(options.interaction.errorHandle == "throw") {
                      throw "Invalid dimensions for plot, width = " + canvasWidth + ", height = " + canvasHeight;
            	} else {
            		return false;
            	}
            }

         }

        function resizeCanvas(c) {
            // resizing should reset the state (excanvas seems to be buggy though)
        	if(c!= null) {
                if (c.width != canvasWidth)
             	   c.width = canvasWidth;

                if (c.height != canvasHeight)
             	   c.height = canvasHeight;

                var ctx = c.getContext("2d");
                /*
                var devicePixelRatio = window.devicePixelRatio || 1,
                backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                    ctx.mozBackingStorePixelRatio ||
                    ctx.msBackingStorePixelRatio ||
                    ctx.oBackingStorePixelRatio ||
                    ctx.backingStorePixelRatio || 1,
                ratio = devicePixelRatio / backingStoreRatio;

               if (typeof auto === 'undefined') {
                   auto = true;
               }

                // upscale the canvas if the two ratios don't match
                if (auto && devicePixelRatio !== backingStoreRatio) {

                    var oldWidth = c.width;
                    var oldHeight = c.height;

                    c.width = oldWidth * ratio;
                    c.height = oldHeight * ratio;

                    c.style.width = oldWidth + 'px';
                    c.style.height = oldHeight + 'px';

 	   	            // so try to get back to the initial state (even if it's  gone now, this should be safe according to the spec)
 	   	            ctx.scale(ratio, ratio);
                }
                */
                ctx.restore();
   	            // and save again
   	            ctx.save();

         	}

        }

        function setupCanvases() {
        	var layers = options.series.gantt.canvasLayers, //layerNames will be in order
        			layerNames = layers.layerNames, //array
        			mainLayerIndex = layers.mainLayerIndex;

        	var zIndex = 1;//default

        	//FOR ALL LAYERS
        	if(layerNames != undefined && layerNames.length > 0) {
        		if(mainLayerIndex == undefined) {
        			mainLayerIndex = 0; //Assume the first layer provided in the array as the main  base layer
        		}

        		//create other canvases and set z-index of layers according to the order in array
        		var  eachLayerCanvas;
        		for(var i = 0; i < layerNames.length ; i++) {
        			zIndex = i;
        			if(mainLayerIndex == i) { /// THis will be set as our default context .
        				mainLayerName = layerNames[mainLayerIndex];
        				canvas = makeCanvas(false, placeholder.attr('id'), mainLayerName); //z-index will be 0
                		$(canvas).css({ 'z-index': zIndex}); //trhis will become the main context
                		 ctx = canvas.getContext('2d');
                		//Add the main canvas also to the map
                		canvasLayerMap[mainLayerName] =  {
                        		context : ctx,
                        		canvas : canvas
                        }


        			} else {
	        			eachLayerCanvas = makeCanvas(false, placeholder.attr('id'), layerNames[i]);
	        			var eachLayerContext = eachLayerCanvas.getContext('2d');
		        		$(eachLayerCanvas).css({ 'z-index': zIndex});
		        		canvasLayerMap[layerNames[i]] =  {
		                		context : eachLayerContext,
		                		canvas : eachLayerCanvas
		                }
        			}

	        		//console.log("canvasLayerMap ==  " + canvasLayerMap);
	        		zIndex++;
        		}

        	} else {
        		mainLayerName = "chronos_base";
    	        canvas = makeCanvas(false, placeholder.attr('id'), mainLayerName);
    	        ctx = canvas.getContext('2d');
        	}

            ctx.createDashedLine = createDashedLine; // invoking a function to support dashed line
            ctx.mozImageSmoothingEnabled = false; //performance improvent in FF
            textImagePreloadContext = new TextImagePreloadContext(ctx);

            if(options.series.gantt.priorityLayer) {
            	var priorityCanvas = makeCanvas(false, placeholder.attr('id'), "chronos_priority");
                var priorityContext = priorityCanvas.getContext('2d');
                $(priorityCanvas).css({ 'z-index': zIndex}); // Note : z-index greter than base and other layers in map it is global in this method
                canvasLayerMap["chronos_priority"] =  {
                		context : priorityContext,
                		canvas : priorityCanvas
                }
            }

            if(options.grid.autoHighlight == true) {
	            highlightCanvas = makeCanvas(false,placeholder.attr('id'), "chronos_highlight");// highlightCanvas  for highlight task drawings & its features
	            hctx = highlightCanvas.getContext("2d");
	            $(highlightCanvas).css({ 'z-index': zIndex++}); // Note : z-index gretaer than priority
	            hctx.mozImageSmoothingEnabled = false; //performance improvent in FF
	            hctx.createDashedLine = createDashedLine; // invoking a function to support dashed line
        	}


            overlay = makeOverlayCanvas("chronos_overlay", placeholder.attr('id') , zIndex);
            octx = overlay.getContext("2d");

            octx.mozImageSmoothingEnabled=false;//performance improvent in FF
            plot.resize(); //This does all the settings for width & height according to place holder   for both base and overlay
            // we include the canvas in the event holder too, because of issues with stacking order
            if(highlightCanvas != null) {
            	eventHolder = $([overlay, highlightCanvas]);
            } else {
            	eventHolder = $([overlay]);
            }
            //Ensure that the offset is cached as this call is CPU intensive in popup windows
            updateOffset();

            bindOverlayEvents(overlay);


            globalTransferObject = plot.tempCreateCommonTransferObject();
            if(globalTransferObject != undefined ) {
            	if(globalTransferObject.plotCanvasMap == undefined) {
            		globalTransferObject.plotCanvasMap = [];
            	}
				 //TO keep a map which track   the plotObject  and respective canvas jQuery Object : On drag & Drop between different plots
				globalTransferObject.plotCanvasMap[overlay.id] = plot; //canvas#baseplaceholder1.base as key and value as PlotObject
				//console.log("Adding to global Map " + overlay.id + " plot "+ plot + " globalTransferObject " + globalTransferObject);
        	}
        }

        function updateOffset() {
        	cachedOffset = eventHolder.offset();
        }

        function makeOverlayCanvas(className, id, zIndex) {
        	var c = document.createElement('canvas');
            c.className = className;
            c.id = className+id;//"CanvasId";
       	 	//Set the overlay above all the base & highlight
            $(c).css({ 'z-index': zIndex++});

            //if no tabindex specified , set this to invoke the key press events
            if($(placeholder).attr('tabindex') == null) {
            	$(c).attr( 'tabindex', '10');
            } else {
            	$(c).attr( 'tabindex', $(placeholder).attr('tabindex'));
            }
            $(c).css({ position: 'absolute', left: 0, top: 0 , "outline-width" : 0});  // to prevent the overlay border color on draggign in webkit browsers
            $(c).attr('draggable' , true);

            if ($(placeholder).children("#"+c.id).length == 0) {
                //console.log('Already placeholder has as children with this ID');
                $(c).appendTo(placeholder);
            }
            if (!c.getContext) // excanvas hack
                c = window.G_vmlCanvasManager.initElement(c);
           // used for resetting in case we get replotted
            c.getContext("2d").save();
            return c;
        }

        // function that does the HTML5 event binding for the overlay canvas
        function bindOverlayEvents(overlayCanvas) {

        	if(options.interaction.eventType == "HTML5"){
	        	$(overlayCanvas).get()[0].ondragstart = function(event){
	    			plot.dragStartHandler(event);
	    		};
	    		$(overlayCanvas).get()[0].ondragover = function(event){
	    			 plot.dragOverHandler(event);
				};
				$(overlayCanvas).get()[0].ondragend = function(event){
					    plot.dragEndHandler(event);
				};
				$(overlayCanvas).get()[0].ondrop = function(event){
				    plot.dropHandler(event);
				};
				$(overlayCanvas).get()[0].ondrag = function(event){
				    plot.draggingHandler(event);
				};

				//TOCH EVENTS IN HTML5
        		var element = $(overlayCanvas).get()[0];
        		element.addEventListener("touchstart", onjQueryEventDragStart, false);
        		element.addEventListener("touchmove", onjQueryEventDrag, false);
        		element.addEventListener("touchend", onjQueryEventDragEnd, false);
        		//element.addEventListener("touchcancel", onjQueryEventDragEnd, false); // TODO Check if needed  ???? tap, dbtap

        	} else if(options.interaction.eventType == "JQUERY_DRAG") {

        		eventHolder.on("dragstart", onjQueryEventDragStart);
        		eventHolder.on("drag", onjQueryEventDrag);
        		eventHolder.on("dragend", onjQueryEventDragEnd);

        		eventHolder.on("touchstart", onjQueryEventDragStart);
        		eventHolder.on("touchmove", onjQueryEventDrag);
        		eventHolder.on("touchend", onjQueryEventDragEnd);
        		if(options.interaction.defaultFocus) {
        			$(eventHolder).focus();       //is needed .. Focus is must to work .
        		}
 		  	}
        	//if hotKeys need to be supported
			bindScrollEventsOnHotKey(overlayCanvas);
        	//binding mouse wheel for Scroll
        	var scrollTrigger = options.scroll.trigger;
        	if(scrollTrigger == 'mousewheel') { // and Check if  Ctl key pressed or not as well
        		 eventHolder.mousewheel(scrollOnMouseWheel);
        	}
       }

        var hoveredScrollBarPosition =  null;
        function scrollOnMouseWheel(e, delta, deltaX, deltaY) {
        	if(e.ctrlKey) { //if  Ctl key pressed , don't scroll
        		return;
        	}
        	e.preventDefault();
        	if (delta > 0 && plot.verticalScrollBar != undefined) { // up   click
		    	hoveredScrollBarPosition = "TOP_ARROW";
		    	plot.verticalScrollBar.onScrollOnMouseWheel(e, hoveredScrollBarPosition, Math.abs(delta));

		    } else if (delta < 0 && plot.verticalScrollBar != undefined) { // down
		    	hoveredScrollBarPosition="BOTTOM_ARROW";
		    	plot.verticalScrollBar.onScrollOnMouseWheel(e, hoveredScrollBarPosition, Math.abs(delta));
		    }

        }

        var getPointerEvent = function(event) {
        	if(event.originalEvent != null) {
        		return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
        	} else {
        		return event;
        	}
        };

        var currX = 0,
	    currY = 0,
	    cachedX = 0,
	    cachedY = 0,
	    isStillDragging;
        var tapped = false;

       //Support for Jquery event where HTML5 event is not supported.
        function onjQueryEventDragStart(e) {
        	plot.touchStarted = true;
        	//normal dragging triggered.
        	 plot.dragStartHandler(e);
        	 if(e.touches) {
	        	 eventHolder.unbind("click", onClick);
	        	 eventHolder.unbind("mousemove", onMouseMove);
	        	//console.log("onjQueryEventDragStart----------" + e + " plot.touchStarted " + plot.touchStarted);
	         	var touchEvent = getPointerEvent(e);
	             // caching the current x
	         	 cachedX = currX = touchEvent.pageX;
	             // caching the current y
	             cachedY = currY = touchEvent.pageY;
	             if (!isStillDragging) { //was clicking not dragging
	               	 // detecting if after 200ms the finger is still in the same position
	               	 if(!tapped){ //if tap is not set, set up single tap
	               		 tapped = setTimeout(function (){
	       	                if ((cachedX === currX) && !plot.touchStarted && (cachedY === currY)) {
	       	                    // Here you will get the Tap event
	       	                	performMouseMoveActions(touchEvent);
	    	   	                 setTimeout(function (){
	    	   	                	onClick(touchEvent);
	    	   	                 }, 200)
	       	                    tapped = null;

	       	                }
	       		            },200); //wait 300ms then  will fire the single tap

	       	            } else {    //tapped within 300ms of last tap. double tap
	       	              clearTimeout(tapped); //stop single tap event
	       	              tapped=null;
	       	              //Here the double tap event is called
	       	              performMouseMoveActions(touchEvent);
	    	   	          setTimeout(function (){
	    	   	        	onDoubleClick(touchEvent);
	    		           }, 200)
	       	            }
	       	        }
        	 }
        }

		function onjQueryEventDrag(e) {
			isStillDragging = true;
			//console.log("onjQueryEventDrag--------------" + e);
			plot.draggingHandler(e);
			plot.dragOverHandler(e);
		}

		function onjQueryEventDragEnd(e) {
			 if(isStillDragging) {
				 //if dragging was started trigger end
	        	plot.dropHandler(e);
				plot.dragEndHandler(e);
			 }
			 plot.touchStarted = false;
		     isStillDragging = false;
		}
		plot.focusedItem = null;
		plot.focusData = {
				//focusedItem : null,
				focusedItems :  [],
				previousArrowPressed : null,
				initialHighlightedItem : null
		};
		//for storing first highlighted item
		plot.firstHighlightedItem = null;
		// Add the key board selected items to rectangle highlights and finally to highlights
		function addToFocusItems(arrowKey, shiftPressed) {
			var length = 0;
			var series = plot.getSeries();
				for(var index in highlights) {
					length++;
				}
				if(plot.focusedItem == null  && plot.focusData.initialHighlightedItem != null && length == 1) { //only if one item is highlighted
						plot.focusedItem = plot.focusData.initialHighlightedItem;
				}
				var startRow =   series.rowYvalueMap[plot.focusData.initialHighlightedItem.rowId];//plot.focusData.initialHighlightedItem.yValue;
	   	 		var startTime = plot.focusData.initialHighlightedItem.start ;
				plot.previousArrowPressed = arrowKey;
				//console.log("plot.focusedItem ", plot.focusedItem);
				var scrollRange = options.yaxis.scrollRange,
					viewRange = series.yaxis.max - series.yaxis.min,
					endRow, endTime;
				if(plot.focusedItem != null) {
			   	 	var focusRow = plot.focusedItem.yValue,  //start yValue
			   	 		focusStartTime = plot.focusedItem.start,
			   	 		nextPrevObject;

				   	 	switch(arrowKey) {
					   	 	case "RIGHT_ARROW" : {
					   	 		nextPrevObject = plot.findExactNextObject(focusRow, focusStartTime);
					   	 		plot.focusedItem = nextPrevObject != null ?  nextPrevObject : plot.focusedItem;
					   	 		break;
					   	 	}

					   	  case "LEFT_ARROW" : {
					   		  nextPrevObject = plot.findExactPreviousObject(focusRow, plot.focusedItem.end);
					   		  plot.focusedItem = nextPrevObject != null ?  nextPrevObject : plot.focusedItem;
					   	 	  break;
					   	 }
					   	 case "TOP_ARROW" : {
						   	 	//get items which is in the top row above it
					   	 		endRow  = Math.floor(series.yaxis.min) - viewRange;
					   		 	 if(endRow < scrollRange[0]) {
					   		 		endRow = scrollRange[0]; //cap
					   		 	}
					   	 		endTime =  series.xaxis.max ;
					   	 		plot.focusedItem = getFocusedItem(focusRow -1, series.xaxis.min, endRow, endTime, arrowKey);
					   	 		break;
					   	 }
					   	 case "BOTTOM_ARROW" : {
						   	 	 //get items from  the next immediate row below it ...

					   	 		endRow  = Math.ceil(series.yaxis.max) + viewRange;
					   		 	if(endRow > scrollRange[1]) {
					   		 		endRow = scrollRange[1]; //cap
					   		 	}
					   	 		endTime =  series.xaxis.max ;
					   	 		plot.focusedItem = getFocusedItem(focusRow + 1, series.xaxis.min, endRow, endTime, arrowKey);
					   	 		break;
					   	 }
				   	 	}//switch
				   	   // console.log("plot.focusedItem ", plot.focusedItem);
				   	 	if(plot.focusedItem != null) {
				   		  endRow = plot.focusedItem.yValue ,
				   		  endTime = plot.focusedItem.end;
				   		  scrollToFocus(arrowKey);
				   	 	}
				   		//console.log("plot.focusedItem----------------- ", plot.focusedItem);

				   	 plot.focusData.focusedItems.push(plot.focusedItem);
					   	 if(shiftPressed && plot.focusedItem != null){
					   		 //add to highlights
					   		clearAllhighlights(); //need for backward clearing
					   		clearAllRectangleSelectHighlightList();
					   		addAllItemsInRangeToRectangleHighlights(startRow, startTime, endRow, endTime, null);
					   		addSelectedListToOriginalHighlightlist();
					   	 }
					   	drawHighLightOverlay();
				}
		}


		/**
		 * get the focused item given in the range
		 */
		function getFocusedItem(startRow, startTime, endRow, endTime, arrowKey) {
			if(startRow > endRow ) {
				temp = startRow
				startRow = endRow;
				endRow = temp;
			}
			var taskArray = plot.getAllTasksInArea(startRow, startTime, endRow, endTime, true); //true means exact check of items only in these yValues
			taskArray.sort(function(a, b) {
				var result, flag = true;
				var condition1 = (arrowKey == "TOP_ARROW" ?  a.yValue < b.yValue  : a.yValue > b.yValue);
				var condition2 = (arrowKey == "TOP_ARROW" ?  a.yValue > b.yValue  : a.yValue < b.yValue);
		    	 if(condition1 ) { //ascending
		    		result =  1;
		        } else if(condition2) {
		        	result= -1;
		        } else {
		        	 return findOverlap(b, plot.focusedItem) -  findOverlap(a, plot.focusedItem);
		        }
		    	 return result;
		     });
			//get the first lowest yValue immediate top task in this range	and also the immediate top task
			plot.focusedItem = taskArray[0];
			//console.log(" Focused Item ", plot.focusedItem);
			return plot.focusedItem;
		}

		/**
		 * return the very nearest item to the focused item,
		 */
		function findOverlap(a, b) {
			var start = a.start > b.start? a.start:b.start;
			var end = a.end < b.end? a.end:b.end;
			return end - start;

		}

	function scrollToFocus(arrowKey) {
	   	 	var xaxis = series.xaxis;
	   	    var yaxis = series.yaxis;
	   	    var minViewValue , maxViewValue, range;
			switch(arrowKey) {
				case "RIGHT_ARROW" : {
			   	 	if(plot.focusedItem.end > xaxis.max) {
			   			 range = xaxis.max - xaxis.min;
			   			 maxViewValue = plot.focusedItem.end + options.keyboardFocus.autoScrollPixel;
						 minViewValue = maxViewValue - range;
						 plot.capXValuesAndFetchData(minViewValue, maxViewValue);
			   	     }	//END
		   	 		break;
				}
				case "LEFT_ARROW" : {
				   	if(plot.focusedItem.end < xaxis.min){
				   		range = xaxis.max - xaxis.min;
				   		minViewValue = plot.focusedItem.start - options.keyboardFocus.autoScrollPixel;
				   		maxViewValue = minViewValue + range ;
				   		plot.capXValuesAndFetchData(minViewValue, maxViewValue);
				   	};
				   	break;
				}
				case "BOTTOM_ARROW" : {
				   	if(plot.focusedItem.yValue > yaxis.max){
				   		range = yaxis.max - yaxis.min;
				   		maxViewValue = plot.focusedItem.yValue + 0.5 ;
				   		minViewValue = maxViewValue - range;
				   		plot.capYValuesAndFetchData(minViewValue, maxViewValue);
				   	};
				   	break;
				}

				case "TOP_ARROW" : {
				   	if(plot.focusedItem.yValue < yaxis.min){
				   		range = yaxis.max - yaxis.min;
				   		minViewValue = plot.focusedItem.yValue - 0.5;
				   		maxViewValue = minViewValue + range;
				   		plot.capYValuesAndFetchData(minViewValue, maxViewValue);
				   	};
				   	break;
				}
			} //switch
		}

		function highlightFocusedItem() {
			if(plot.focusedItem) {
				addTaskByUserToHighlightList(plot.focusedItem);
				drawHighLightOverlay();
			}
		}


        function bindScrollEventsOnHotKey(overlayCanvas) {
			$(overlayCanvas).on("keydown",  function(e) {
				var prvKey = false;
        		plot.setKeyPressedTime(Number.MAX_VALUE);
        		var shiftPressed = e.shiftKey;
        		var ctrlPressed = e.ctrlKey;
        		var spacebarPressed = (e.keyCode == 32);
        		var keyboardFocus = plot.getOptions().keyboardFocus;
        	    var focusKeyPressed =  (keyboardFocus.enable) ? (shiftPressed || ctrlPressed) : false;
        	   // console.log("focusKeyPressed ", focusKeyPressed , " spacebarPressed ");
        	    if(ctrlPressed && spacebarPressed && keyboardFocus.enable){
        	    	highlightFocusedItem(); // to select an item when space bar pressed
        	    }

				if (e.keyCode == 37 || e.keyCode == 72) { // left & h
				    prvKey = true;
					hoveredScrollBarPosition = "LEFT_ARROW";
					if( focusKeyPressed && e.keyCode == 37){
						//shiftPressed case and left arrow pressed
						addToFocusItems(hoveredScrollBarPosition, shiftPressed);
					} else {
						plot.horizontalScrollBar.scrollActionOnKeyDownEvent(e, hoveredScrollBarPosition);
					}

				} else if (e.keyCode == 39 || e.keyCode == 76) {        // right & l
					prvKey = true;
					hoveredScrollBarPosition = "RIGHT_ARROW";
					if(focusKeyPressed  && e.keyCode == 39){
						//console.log(shiftPressed , "hoveredScrollBarPosition " +  hoveredScrollBarPosition);
						addToFocusItems(hoveredScrollBarPosition, shiftPressed);
					} else {
						plot.horizontalScrollBar.scrollActionOnKeyDownEvent(e , hoveredScrollBarPosition);
					}

				} else if (e.keyCode == 38 || e.keyCode == 74) { // up & j
			    	prvKey = true;
			    	hoveredScrollBarPosition = "TOP_ARROW";
			    	if(focusKeyPressed && e.keyCode == 38){
			    		//console.log(shiftPressed , "hoveredScrollBarPosition " +  hoveredScrollBarPosition);
			    		addToFocusItems(hoveredScrollBarPosition, shiftPressed);
					} else {
						plot.verticalScrollBar.scrollActionOnKeyDownEvent(e, hoveredScrollBarPosition);
					}

			    } else if (e.keyCode == 40 || e.keyCode == 75) { // down & k
			    	prvKey = true;
			    	hoveredScrollBarPosition="BOTTOM_ARROW";
			    	if(focusKeyPressed && e.keyCode == 40){
			    		//console.log(shiftPressed , "hoveredScrollBarPosition " +  hoveredScrollBarPosition);
			    		addToFocusItems(hoveredScrollBarPosition, shiftPressed);
					} else {
						plot.verticalScrollBar.scrollActionOnKeyDownEvent(e, hoveredScrollBarPosition);
					}

			    }   else if(e.keyCode == 36) {//HOME
			    	prvKey = true;
			    	hoveredScrollBarPosition="HOME";
			    	plot.horizontalScrollBar.redrawScrollBarOnSpecialKeys(e, hoveredScrollBarPosition);

			    } else if(e.keyCode == 35) {	//end
			    	prvKey = true;
			    	hoveredScrollBarPosition="END";
			    	plot.horizontalScrollBar.redrawScrollBarOnSpecialKeys(e, hoveredScrollBarPosition);

			    } else if(e.keyCode == 34) { //'pagedown
			    	prvKey = true;
			    	hoveredScrollBarPosition="PAGE_DOWN";
			    	plot.verticalScrollBar.redrawScrollBarOnSpecialKeys(e, hoveredScrollBarPosition);

			    } else if(e.keyCode == 33) { //33:'pageup
			    	  prvKey = true;
			    	  hoveredScrollBarPosition="PAGE_UP";
			    	  plot.verticalScrollBar.redrawScrollBarOnSpecialKeys(e, hoveredScrollBarPosition);
			     }
				if(prvKey) {
			     	e.preventDefault();
			     }
		   });
		   $(overlayCanvas).on("keyup", function(e) {
        		 e.preventDefault();
        		 //console.log("overlay class  bind keyup ..");
		 		 if(plot.horizontalScrollBar!=undefined && (hoveredScrollBarPosition == 'RIGHT_ARROW' ||
		 				 hoveredScrollBarPosition == 'LEFT_ARROW' ||
		 				 hoveredScrollBarPosition == 'HOME' ||
		 				 hoveredScrollBarPosition == 'END') ) {
		 			plot.horizontalScrollBar.scrollActionOnKeyUpEvent(e, hoveredScrollBarPosition);

		  		} else if(plot.verticalScrollBar !=undefined && ( hoveredScrollBarPosition == 'TOP_ARROW' ||
		  				hoveredScrollBarPosition == 'BOTTOM_ARROW' ||
		  				hoveredScrollBarPosition == 'PAGE_DOWN' ||
		  				hoveredScrollBarPosition == 'PAGE_UP') ) {
		  			plot.verticalScrollBar.scrollActionOnKeyUpEvent(e, hoveredScrollBarPosition);
		  		}
	      });

        }
        var ctrlPressed = false, shiftPressed = false;

		 //Actual canvas creation is done here
        function makeCanvas(skipPositioning, id, className) {
            var c = document.createElement('canvas');
            c.className = className;
            c.id = className+id;//"CanvasId";
            //Setting this below the overlay
            $(c).css({ 'z-index': '0'});
            if (!skipPositioning)
                $(c).css({ position: 'absolute', left: 0, top: 0  });

            if ($(placeholder).children("#"+c.id).length == 0) {
                //console.log('Already placeholder has as children with this ID');
                $(c).appendTo(placeholder);
            }
         if (!c.getContext) // excanvas hack
            	c = window.G_vmlCanvasManager.initElement(c);

            // used for resetting in case we get replotted
            c.getContext("2d").save();

            return c;
        }


        // Bind all the events for the plot
        function bindEvents() {
        	 //console.log(" NORMAL bind events in float "  + hooks.bindEvents);
            // bind events
        	if (options.grid.hoverable) {
                eventHolder.mousemove(onMouseMove);
                eventHolder.mouseleave(onMouseLeave);
                eventHolder.mousedown(onMouseDown);
                eventHolder.mouseup(onMouseUp);

            }
            if (options.grid.clickable) {
                eventHolder.click(onClick);
            	eventHolder.dblclick(onDoubleClick);
            }
            executeHooks(hooks.bindEvents, [eventHolder]);

        }

        //unbind events on shutdown
        function shutdown() {
            if (redrawTimeout)
                clearTimeout(redrawTimeout);
            plot = this;
            eventHolder.unbind("mousemove", onMouseMove);
            eventHolder.unbind("mouseleave", onMouseLeave);
            eventHolder.unbind("click", onClick);
            eventHolder.unbind("dblclick", onDoubleClick);
            eventHolder.unbind("mousedown ", onMouseDown);

            eventHolder.unbind("dragstart", onjQueryEventDragStart);
    		eventHolder.unbind("drag", onjQueryEventDrag);
    		eventHolder.unbind("dragend", onjQueryEventDragEnd);

    		eventHolder.unbind("touchstart", onjQueryEventDragStart);
    		eventHolder.unbind("touchmove", onjQueryEventDrag);
    		eventHolder.unbind("touchend", onjQueryEventDragEnd);
            $(overlay).unbind("keydown");
            $(overlay).unbind("keyup");

           // plot.unBindResizeEvents();
            executeHooks(hooks.shutdown, [eventHolder]);
            plot.clearAllFrameworkDataStructures();
        }
        /**
         *
         * @param clearOnlyDataStructures :  when true, the plot will not be nullified.(Case only called from reInitialize)
         * normally user need to pass empty parameter from their application.
         */
        plot.clearAllFrameworkDataStructures  = function(clearOnlyDataStructures) {
			var clearAll = true;
			if (clearOnlyDataStructures == true) {
				clearAll = false;
			}
        	//console.log("Clearing all datastructures ion Shut down");
			if(plot != null) {
	            series = plot.getSeries();
	            series.rootTreeNode = null;
				series.rowHeaderIds = null; //initial set provided
				series.rowHeaderObjects = null; // on demand or full updation done to this

				series.displayedRowIds = null;  // displayed 0,1,2,3 (displayedYvalue) and Value as actual yValue 0,1,2,3
				series.actualFilterRowIds = null; //Key as actualyValue 0,1,2,3... and Value as  rowId;
				series.rowHeaderMap = null; //Key displayedYvalue and Value- > rowHeaderObject of just displayed rows
				series.rowYvalueMap = null;	 //Key rowId  and Value -> displayedYvalue  , only displyed Rows details
				series.rowIdRowObjectMap = null; // Key rowId and Value rowHeaderObject

				//clear all series variables used in updating data
				series.columnHeaderArray = null;
				series.rowMap = null; // should be a named array
				series.columnMap = null; // should be a named array
				series.dataMap = null; // should be a named array with name as ID and value as the corresponding task object

				series.label = null;
				series.callBackFunction = null;
				series.taskRenderer = null;
				series.fillColorProvider = null;

				series.rowAvailable = null;
				series.columnAvailable = null;
				series.data2DMatrix = null;
				series.longRangeDataMap = null;

			}

			/*if (plot.areWrapRowsEnabled()) {
				var startDisplayObject = {id : 0, startWrapRow : 0};
				plot.setCurrentFirstDisplayObject (startDisplayObject);
				plot.clearWrappedRowDisplayMap();
			}*/

			if (clearAll) {
				series.xaxis = null;
				series.yaxis = null;
				if(plot != null) {
					axes = plot.allAxes();
					axes = null;
					xaxes =  plot.getXAxes();
					xaxes = null;
					yaxes =  plot.getYAxes();
					yaxes = null;
					var options= plot.getOptions();
					options = null;
				}
				ctx =null;
				hctx = null;
				octx = null;

				rectangleFrameHighlights = null;
				highlights = null;
				rowHighlights = null;
				tickHighlights = null,
				blinkingObjects = null;
				connections = null;
				plot.yValueNodeDetailsMap = null; //yValu

				series = null;
				if(globalTransferObject != undefined  || globalTransferObject != null ) {
					var placeholderId = plot.getPlaceholder().attr('id');
					var itemToRemove = null;
					for(var index in globalTransferObject.plotCanvasMap) {
						if(globalTransferObject.plotCanvasMap[index].getPlaceholder().attr('id') === placeholderId) {
							itemToRemove = index;
							break;
						}
					}
					if(itemToRemove){
						delete globalTransferObject.plotCanvasMap[itemToRemove];
	                }
		        }
				plot.getPlaceholder().empty();
				plot = null;
			}
        }

        function setTransformationHelpers(axis) {
            // set helper functions on the axis, assumes plot area
            // has been computed already

            function identity(x) { return x; }

            var s, m, t = axis.options.transform || identity,
                it = axis.options.inverseTransform;

            // precompute how much the axis is scaling a point
            // in canvas space
            if (axis.direction == "x") {
                s = axis.scale = plotWidth / Math.abs(t(axis.max) - t(axis.min));
                m = Math.min(t(axis.max), t(axis.min));
            }
            else {
            	//console.log("In inverse transform   axis.max " + axis.max + " axis.min " + axis.min);
                s = axis.scale = plotHeight / Math.abs(t(axis.max) - t(axis.min));
                s = -s;
                m = Math.max(t(axis.max), t(axis.min));
            }

            // data point to canvas coordinate
            if (t == identity) // slight optimization
                axis.p2c = function (p) { return (p - m) * s; };
            else
                axis.p2c = function (p) { return (t(p) - m) * s; };
            // canvas coordinate to data point
            if (!it)
                axis.c2p = function (c) { return m + c / s; };
            else
                axis.c2p = function (c) { return it(m + c / s); };
        }

        function measureTickLabels(axis) {

            var opts = axis.options, ticks = axis.ticks || [];
            ctx.save();
            measureActualTickLabels(ticks, axis); // MINOR LABELS HEIGHT CALCULATION
            var totalHeight = 0;
            if(opts.mode == "time" &&  axis.direction == "x" && opts.multiLineTimeHeader.minorTickLabelHeight!= undefined && axis.options.multiLineTimeHeader.enable){
            	axis.heightOfMinorTickLabel = opts.multiLineTimeHeader.minorTickLabelHeight;
            	totalHeight =  opts.multiLineTimeHeader.minorTickLabelHeight + axis.options.labelMargin;
            	axis.totalHeightOfMinorTickLabel=totalHeight;
            }else{
            	axis.heightOfMinorTickLabel = axis.labelHeight;
            	totalHeight =  axis.labelHeight + axis.options.labelMargin; //save this for major tick case
            }
            if(opts.mode == "time" &&  axis.direction == "x"  && opts.multiLineTimeHeader.enable && axis.showLabel) {
            	var majorTicks = axis.majorTicks || [];
            	measureActualTickLabels(majorTicks, axis); // MAJOR LABELS HEIGHT CALCULATION
            	if(opts.multiLineTimeHeader.majorTickLabelHeight!= undefined && axis.options.multiLineTimeHeader.enable){
            		axis.heightOfMajorTickLabel=opts.multiLineTimeHeader.majorTickLabelHeight;
            		totalHeight = totalHeight + opts.multiLineTimeHeader.majorTickLabelHeight;
            		axis.totalHeightOfMajorTickLabel=opts.multiLineTimeHeader.majorTickLabelHeight;
            	}else{
            	 axis.heightOfMajorTickLabel = axis.labelHeight;
            	 totalHeight = totalHeight + axis.labelHeight;
            	}
            	//Add major Tick Height to the labelHeight
            	axis.labelHeight = totalHeight; //make axis.labelHeight as the total height of minor +major
            }

            //console.log("Finally Axis direction " + axis.direction + ' labelWidth ' + axis.labelWidth + " labelHeight -> "  + axis.labelHeight);
            ctx.restore();

        }

        /**
         * if label height is provided in axis, the maximum of labelHeight of axis or the heigth calculated by framework according to font will be taken
         */
        function measureActualTickLabels(ticks, axis) {
        	  var opts = axis.options, axisw = opts.labelWidth || 0;
        	  var  axish =  opts.labelHeight || 0;

              f = axis.font;
        	  ctx.font = f.style + " " + f.variant + " " + f.weight + " " + f.size + "px '" + f.family + "'";
        	  if(series.gantt != undefined && series.gantt.show) {
        		  textRenderer.setShouldSetFontToContext(true);
        	  }
        	  var fontHeight = measureHeightOfTextWithThisFont(f);

        	  //console.log("Tick labels ----------" + ticks.length);
        	  for (var i = 0; i < ticks.length; ++i) {
                  var t = ticks[i];
                  t.lines = [];
                  t.width = t.height = 0;

                  if(t.label == null &&  axis.options.multiLineTimeHeader.enable) { //for major tcks
                	  t.label = t.majorTickLabel;
                	 // console.log("measuring Major Ticks t.label =" +  t.label );
                  }
                  if (!t.label)
                      continue;
                  // accept various kinds of newlines, including HTML ones
                  // (you can actually split directly on regexps in Javascript,
                  var lines = t.label.replace(/<br ?\/?>|\r\n|\r/g, "\n").split("\n");
                  for (var j = 0; j < lines.length; ++j) {
                      var line = { text: lines[j] },
                            m = ctx.measureText(line.text);
                      		line.width = m.width;
                      		line.height = fontHeight;
		                    t.width = Math.max(line.width, t.width);
		                    t.height += line.height;
		                    t.lines.push(line);

                  } //for
                 if (axisw == null || axisw == 0 && axis.showLabel)
                      axisw = Math.max(axisw, t.width);
                  if (axish == null || axish == 0 && axis.showLabel)
                      axish = Math.max(axish, t.height);

              }//for
    		  axis.labelWidth = Math.ceil(axisw);   // add this to label width & height when showing for default axis label.
    		  axis.labelHeight = Math.ceil(axish);
    		  //console.log( " Axis width --->" + axis.labelWidth);
        }

        function allocateAxisBoxFirstPhase(axis) {
            // find the bounding box of the axis by looking at label
            // widths/heights and ticks, make room by diminishing the plotOffset

            var lw = axis.labelWidth,
                lh = axis.labelHeight, //this labelHeight is the height for drawing ticks calculated for axis font
                bw = options.grid.borderWidth,
                pos = axis.options.position,
                tickLength = axis.options.tickLength,
                axismargin = options.grid.axisMargin,
                labelMargin = axis.options.labelMargin,
                all = axis.direction == "x" ? xaxes : yaxes;               // index;
            // determine axis margin
            var samePosition = $.grep(all, function (a) {
                return a && a.options.position == pos && a.reserveSpace;
            });
            if ($.inArray(axis, samePosition) == samePosition.length - 1)
                axismargin = 0; // outermost

            // determine tick length - if we're innermost, we can use "full"
            if (tickLength == null)
                tickLength = "full";

            var sameDirection = $.grep(all, function (a) {
                return a && a.reserveSpace;
            });

            var innermost = $.inArray(axis, sameDirection) == 0;
            if (!innermost && tickLength == "full")
                tickLength = 5;

            if (!isNaN(+tickLength))
                labelMargin += +tickLength; // adding tickLength along with label margin

            axis.box = {};
            //console.log("Canvas Height --- " + canvasHeight + " canvadWidth " + canvasWidth);
            //console.log("PlotWidth --- " + plotWidth + " plotHeight " + plotHeight);

            // compute box
            var fbw = options.series.gantt.fullBorderWidth;
            if(fbw < 1) {
              	 fbw =  0;
             }

            //Check For multiline header time display, a labelmargin is used before majorTicks as well as after minortick label.
            //So add this label margin too in plotOffset.top and bottom. So change labelMargin accordingly
            var extraLabelMargin = 0;
            if(axis.direction == "x" && axis.options.multiLineTimeHeader.enable &&  axis.showLabel) {
            	extraLabelMargin = axis.options.labelMargin; // on top and bottom before major Tick Label on top and bottom.
            		//Also remove the tickLength for major label display space . so add
            }

          //Extreme top area above column that can be added to xaxis  -  eg: spannign 4 days location in a place
            var topHeaderHeight = 0;
            if(axis.direction == "x" && axis.options.topHeader.enable) {
            	axis.topHeaderHeight = axis.options.topHeader.height;
            	axis.totalHeight = axis.labelHeight + axis.topHeaderHeight;
           		plotOffset.top = plotOffset.top + axis.topHeaderHeight;
            	topHeaderHeight = axis.topHeaderHeight;
            }

            if (axis.direction == "x") {
            	if(axis.showLabel){
            		lh += labelMargin;
            		lh += extraLabelMargin;
            	} else {
            		lh = 0;fbw = 0;
            		axis.options.labelMargin=0;
            		axismargin = 0;
            	}
            	//console.log("Finnaly label height +  summary added  + labelMargin " + lh);
                if (pos == "bottom") {
                    plotOffset.bottom += lh ;
                    if(bw > 0) {
                    	plotOffset.top += bw;
                    }
                    if(fbw > 0) {
                     	plotOffset.top += fbw;
                    }
                    axis.box = { top: canvasHeight - (plotOffset.bottom + axismargin),
                    			height: lh -fbw,
                    			labelMargin: axis.options.labelMargin
                    			};
                }
                else if(pos == "top") { //for top
                    axis.box = {
                    		top: fbw + axismargin + topHeaderHeight,//plotOffset.top + fbw + axismargin ,
                    		height: lh-fbw ,
                    		labelMargin: axis.options.labelMargin
                    		};
                    plotOffset.top += lh + axismargin;
                    if(bw>0) {
                    	plotOffset.bottom += bw;
                    }
                    if(fbw > 0) {
                     	plotOffset.bottom += fbw;
                    }

                } else if(pos == "both") {
                	   axis.labelPosition ={};
                	 //Save top details also ie same as pos== "top" TOP
	                var boxTop = { top: axismargin + fbw + topHeaderHeight , //
	                			height: lh-fbw ,
	                			labelMargin: axis.options.labelMargin};
                   plotOffset.top += lh + axismargin + fbw;

                   axis.labelPosition.top = {
                			position: pos,
                			tickLength: tickLength,
                			box: boxTop,
                			innermost: innermost
                   };
                   //Bottom details ie pos== "bottom"  BOTTOM
                   plotOffset.bottom += lh + axismargin + fbw; // labelMargin alreday considered in lh
                   var boxBottom = { top: canvasHeight - plotOffset.bottom ,
                    		height: lh - fbw,
                    		labelMargin: axis.options.labelMargin};
	               axis.labelPosition.bottom = {
	                			position: pos,
	                			tickLength: tickLength,
	                			box: boxBottom,
	                			innermost: innermost
	                };

	               if(bw > 0) {
	            	 plotOffset.top += bw;
                   	 plotOffset.bottom += bw;
                   }
	               if(fbw > 0) {
  	            	 	plotOffset.top += fbw;
                     	plotOffset.bottom += fbw;
                    }

                }
            } else { //if yaxis
            	if(axis.options.multiColumnLabel.columns.length != 0 &&
            			axis.options.labelRenderer == undefined) {
            			lw = 0; //options.grid.borderWidth; // Note : reset this if labelRenderer and multiColumn label renderer is present as its calculations is as below
                		var headerColumns = axis.options.multiColumnLabel.columns;
                		//set the label Margin as the sum of all column widths
                		for ( var i = 0; i < headerColumns.length; i++) {
                			lw = lw + headerColumns[i].width;
    					}
                		if(axis.options.multiColumnLabel.border != undefined) {
                			lw = lw + (headerColumns.length * axis.options.multiColumnLabel.border.width); // all borders - start and end will be border/2
                		}

            	}
                lw += labelMargin;
                if (pos == "left") {
                    axis.box = { left: plotOffset.left + axismargin + fbw,
                    			 width: lw - fbw };
                    plotOffset.left += lw + axismargin;
                   if(bw>0) {
                    	plotOffset.right += bw;
                    	plotOffset.left += bw;

                    }
                   if(fbw > 0) {
  	            	 	plotOffset.right += fbw;
  	            	 	plotOffset.left += fbw;
                    }

                   //Currently rowFooter supported only for yaxis Label position left. So assign it to plotOffset.right
                    if(axis.options.rowFooter.enable) {
                    	plotOffset.right = plotOffset.right + axis.options.rowFooter.width;
                    }
                }
                else if(pos == "right") { //for right
                    plotOffset.right += lw + axismargin;

                    axis.box = { left: canvasWidth - plotOffset.right + fbw , // this plotOffset.right is without inner border border width and full border width
                    		width: lw - fbw -1 };
                    if(bw > 0) {
                    	plotOffset.right += bw;
                    	plotOffset.left += bw;
                    	//fbw = 0; // draw only one border on left if both r there
                    }
                     if(fbw > 0) {
                    	 plotOffset.right += fbw;
   	            	 	plotOffset.left += fbw;
                     }

                } else if(pos == "both") {

                	//positions for left axis label
                	var boxLeft = { left: plotOffset.left + axismargin + fbw,
                			width: lw,
        					labelMargin: labelMargin
        					};
                    plotOffset.left += lw + axismargin;
                    axis.labelPosition ={};
	                axis.labelPosition.left = {
	                			position: pos,
	                			tickLength: tickLength,
	                			box: boxLeft,
	                			innermost: innermost
	                };

	                //Save right postion details also
                	plotOffset.right += lw + axismargin;
                	var boxRight = { left: canvasWidth - plotOffset.right + labelMargin,// This bw is the left & right border
                					width: lw -fbw,
                					labelMargin: labelMargin};
                    axis.labelPosition.right = {
                			position: pos,
                			tickLength: tickLength,
                			box: boxRight,
                			innermost: innermost
                    };
                    if(bw > 0) {
   	            	 	plotOffset.left += bw;
                      	plotOffset.right += bw;
                     }
                    if(fbw > 0) {
   	            	 	plotOffset.left += fbw;
                      	plotOffset.right += bw;
                     }
                } //else
            }

            //Additional column summary that can be added next to xaxis  -  eg: occupancy , hold etc
            if(axis.options.columnSummary != undefined && axis.options.columnSummary.enable) {
        		//lh = lh + axis.options.columnSummary.height;
            	axis.summaryHeight = axis.options.columnSummary.height;
            	axis.totalHeight = axis.labelHeight + axis.summaryHeight;
            	//console.log("plotOffset.top  BEFORE---------- "+ plotOffset.top );
            	if(axis.options.columnSummary.position == "top") {
            		plotOffset.top = plotOffset.top + axis.summaryHeight;
            	} else if(axis.options.columnSummary.position == "bottom") {
            		plotOffset.bottom = plotOffset.bottom + axis.summaryHeight;
            	}
            	//console.log("plotOffset.top  after "+ plotOffset.top );
        	}  else {
        		axis.summaryHeight = 0;
        	}


             // save for future reference
            axis.position = pos;
            axis.tickLength = tickLength;
            axis.box.labelMargin = labelMargin;
            axis.innermost = innermost;
        }

        function allocateAxisBoxSecondPhase(axis) {
        	 // set remaining bounding box coordinates
        	 if(axis.options.position != "both"){
	            if (axis.direction == "x") {
	                axis.box.left = plotOffset.left;
	                axis.box.width = plotWidth;
	                //console.log("Setting box width " + plotWidth);
	            }
	            else {
	                axis.box.top = plotOffset.top;
	                axis.box.height = plotHeight;
	            }
        	} else { //FOR position="BOTH"
        		 if (axis.direction == "x") {
 	               axis.labelPosition.top.box.left = plotOffset.left;
 	               axis.labelPosition.top.box.width = plotWidth;

 	               axis.labelPosition.bottom.box.left = plotOffset.left;
 	               axis.labelPosition.bottom.box.width = plotWidth;

 	            }
 	            else { //for y axis
 	               axis.labelPosition.left.box.top = plotOffset.top;
 	               axis.labelPosition.left.box.height = plotHeight;

 	              axis.labelPosition.right.box.top = plotOffset.top;
 	              axis.labelPosition.right.box.height = plotHeight;
 	            }
        	}

        }

        function setupGrid() {
	        //console.log("Setup Grid.......");
        	var allocatedAxes;
	        if(plot == null) {
	               return;
	        }
	        updateOffset(); //Ensure this is updated as it is cached in all other cases.
	        var axes = plot.allAxes();

	        plotOffset.left = plotOffset.right = plotOffset.top = plotOffset.bottom = 0;
          // first calculate the plot and axis box dimensions
          $.each(axes, function (_, axis) {
              axis.show = axis.options.show;
              axis.showLabel = axis.options.showLabel;
              if (axis.show == null)
                  axis.show = axis.used; // by default an axis is visible if it's got data

              if (axis.showLabel == null) {
                  axis.showLabel = axis.used; // by default an axis label is visible if it's got data
              }

              axis.reserveSpace = axis.show || axis.options.reserveSpace;
              setRange(axis);

          });
          if (options.grid.show) {
              // determine from the placeholder the font size ~ height of font ~ 1 em
              var fontDefaults = {
                  style: placeholder.css("font-style"),
                  size: Math.round(0.8 * (+placeholder.css("font-size").replace("px", "") || 13)),
                  variant: placeholder.css("font-variant"),
                  weight: placeholder.css("font-weight"),
                  family: placeholder.css("font-family")
              };
                 allocatedAxes = $.grep(axes, function (axis) { return axis.reserveSpace; });
               //Added for ISRM-8275
                 if(plot.getPlaceholder().height() && plot.width()){
                 	$.each(axes, function (_, axis) {
                         setTransformationHelpers(axis);
                     });
                 }
              $.each(allocatedAxes, function (_, axis) {
            	  //axis range settings happens inside this So tick generation shd happen after this
            	  axis = setupRowsForCanvasHeight(axis);

                  // make the ticks
                  setupTickGeneration(axis);
                  setTicks(axis);
                  snapRangeToTicks(axis, axis.ticks, axis.majorTicks);
                  axis.font = $.extend({}, fontDefaults, axis.options.font);
                  // find labelWidth/Height for axis
                  measureTickLabels(axis);
              });

              // with all dimensions in house, we can compute the
              // axis boxes, start from the outside (reverse order)
              for (var i = allocatedAxes.length - 1; i >= 0; --i){
                  allocateAxisBoxFirstPhase(allocatedAxes[i]);
              }

              // make sure we've got enough space for things that might stick out
              adjustLayoutForThingsStickingOut();


              //Note:  plotWidth is gloabl and is used in allocateAxisBoxSecondPhase
              plotWidth = canvasWidth - plotOffset.left - plotOffset.right  ;
              plotHeight = canvasHeight - plotOffset.bottom - plotOffset.top;

              $.each(allocatedAxes, function (_, axis) {
                  allocateAxisBoxSecondPhase(axis);
                  //Do this here as we need to re calculate the corner only on a resize
                  setupCornerObjects();
              });

          }
          // now we got the proper plotWidth/Height, we can compute the scaling
          $.each(axes, function (_, axis) {
              setTransformationHelpers(axis);
          });
          insertLegend();

      }
      function adjustLayoutForThingsStickingOut() {
            // possibly adjust plot offset to ensure everything stays
            // inside the canvas and isn't clipped off
            var minMargin = options.grid.minBorderMargin,
                margins = { x: 0, y: 0 };//, axis;
            margins.x = margins.y = Math.ceil(minMargin);
            $.each(allAxes(), function (_, axis) {
                var dir = axis.direction;
                var pos = axis.position;
                if (dir == 'x') {
                       switch (pos) {
                             case 'top'    :
                                    plotOffset.top = Math.max(margins.y, plotOffset.top);
                                    break;
                             case 'bottom' :
                                    plotOffset.bottom = Math.max(margins.y, plotOffset.bottom);
                                    break;
                             case 'both'   :
                                    plotOffset.top = Math.max(margins.y, plotOffset.top);
                                    plotOffset.bottom = Math.max(margins.y, plotOffset.bottom);
                                    break;
                       }
                } else { // "y"
                       switch (pos) {
                             case 'left'   :
                                    plotOffset.left = Math.max(margins.x, plotOffset.left);
                                    break;
                             case 'right'  :
                                    plotOffset.right = Math.max(margins.x, plotOffset.right);
                                    break;
                             case 'both'   :
                                    plotOffset.left = Math.max(margins.x, plotOffset.left);
                                    plotOffset.right = Math.max(margins.x, plotOffset.right);
                                    break;
                       }
                }
              });
        }

        /*
    	 * An utility function to return height of the text written with  this font User can call the measureHeightOfTextWithThisFont utility
    	 * method which will accept parameter as a font object of the form {
    	 * size: 11, style: "italic", weight: "bold", family: "sans-serif",  variant: "small-caps" },
    	 */
        function measureHeightOfTextWithThisFont(fontObject) {
			ctx.font = fontObject.style + " " + fontObject.variant + " " + fontObject.weight + " " + fontObject.size + "px '" + fontObject.family + "'";
			if(series.gantt !=undefined   && series.gantt.show) {
				textRenderer.setShouldSetFontToContext(true);
			}
			const textMeasure = ctx.measureText("W");
			// m.height might not be defined, not in the standard yet
			var height = textMeasure.height != null ? textMeasure.height : fontObject.size;
			// add a bit of margin since font rendering is not pixel  perfect and cut off letters look
			// bad, this also doubles as spacing between lines
			height += Math.round(fontObject.size * 0.15);
			return height;
        }

        /**
        The function setupRowsForCanvasHeight should be executed as we need to set the correct rows
		according to the height of plot and with the new filtered data.
		*/

        function setupRowsForCanvasHeight(axis) {
        	var opts = axis.options,
        		series = plot.getSeries(),
        		options = plot.getOptions();

        	//adjust Row max by the checking the  size of min tickHeight and canvas Height for gantt chart
        	var canvasHeight = plot.height();
        	var currentHeight = canvasHeight - plotOffset.bottom - plotOffset.top;
        	if(series.gantt && axis.direction == "y" && currentHeight > 0) {
	    		if (series.gantt.rowHeightProvider != null) {
					var height = eval(series.gantt.rowHeightProvider).apply();
					options.series.gantt.minTickHeight = height;
				}
	    		var totalRowsThatCanBeDrawn;
	    		if(options.segment && !options.segment.enable) {
	    		//To exactly get the rowHeight and prevent partial rows from not displaying on scroll limit.
	    			totalRowsThatCanBeDrawn =  Math.round(currentHeight/options.series.gantt.minTickHeight) ;
	    		} else {
	    			//for segment charts , let totals draws be less than 1 .
	    			totalRowsThatCanBeDrawn = currentHeight/options.series.gantt.minTickHeight ;
	    		}

    			//For clipping the total no:of rows used to calculate the datamapRow size, which user has set as maximum
	             var maxTotalRowsAllowedInView = options.series.gantt.maxTotalRows;
	            if(totalRowsThatCanBeDrawn  > maxTotalRowsAllowedInView) {
	            	totalRowsThatCanBeDrawn = maxTotalRowsAllowedInView;
	            }

	    		var currentMaxViewRowsToDisplay = axis.options.min +  totalRowsThatCanBeDrawn;

	           if (currentMaxViewRowsToDisplay > options.yaxis.scrollRange[1]) { //maxScrollRange clip
	        	   opts.max = options.yaxis.scrollRange[1];
	        	   currentMaxViewRowsToDisplay = options.yaxis.scrollRange[1]; //clip this also
	        	   var newMin = currentMaxViewRowsToDisplay - totalRowsThatCanBeDrawn;
	        	   //clip min also if it goes beyond the original scroll ie lessthan  -0.5
	        	   if(newMin < options.yaxis.scrollRange[0]) {
	        		   //No change to the scrollMin   keep it as -0.5 or 0 as it is
	        		   opts.min = options.yaxis.scrollRange[0];
	        		   currentMaxViewRowsToDisplay = opts.min + totalRowsThatCanBeDrawn;
	        		   options.yaxis.scrollRange[1] = currentMaxViewRowsToDisplay;
	        	   } else {
	        		   opts.min = newMin;
	        	   }
	            }
	            if(currentMaxViewRowsToDisplay != opts.max) {
			       	opts.max = currentMaxViewRowsToDisplay; //for handlign resize for view area
			       	plot.viewRangeUpdated = true;
			       	//for on demand data fetch even if the vertical scrollbar is not initialised the data loading needs to happen
			       	// when there is a change in rows calculated from the user provided in options
			       	// plot.currentVisibleData.yValueMin = opts.min;
		      		//plot.currentVisibleData.yValueMax =  opts.max; //TODO check
			     }

	            var verticalScrollBar = plot.verticalScrollBar;
         	   if(verticalScrollBar != undefined) {
					if(plot.getScrollDirection() == undefined || plot.isScrollRangeUpdated || 	plot.viewRangeUpdated ) {
							plot.verticalScrollBar.setAxisValues(options.yaxis.scrollRange[0], options.yaxis.scrollRange[1]);
							plot.setYaxisViewArea(opts.min, opts.max);
							plot.viewRangeUpdated = false;
					}
				  if ( options.multiScreenFeature!= undefined && options.multiScreenFeature.enabled ) {
					  if(plot.actionType == "scrollToTimeAndItemRowOnTop" && plot.updateMultiscreenRows) {
							// doNotUpdate is set to false in this case ISRM-7234
							plot.updateRowRangeInLocalStore (opts.min, opts.max, false);
							plot.updateMultiscreenRows = false;
						} else {
							plot.updateRowRangeInLocalStore(opts.min, opts.max, true);
						}
				  }
         	   }
         	   axis.options.scrollRange = options.yaxis.scrollRange;
        	}
        	//Recalculate these as it should be used in calculation of corner objects
        	plotWidth = canvasWidth - plotOffset.left - plotOffset.right  ;
            plotHeight = canvasHeight - plotOffset.bottom - plotOffset.top;

        	return axis;
        }

        function setRange(axis) {
        	var opts = axis.options;
            var min = +(opts.min != null ? opts.min : axis.datamin),
                max = +(opts.max != null ? opts.max : axis.datamax),
                delta = max - min;

            if (delta == 0.0) {
                // degenerate case
                var widen = max == 0 ? 1 : 0.01;

                if (opts.min == null)
                    min -= widen;
                // always widen max if we couldn't widen min to ensure we
                // don't fall into min == max which doesn't work
                if (opts.max == null || opts.min != null)
                    max += widen;
            }
            else {
                // consider autoscaling
                var margin = opts.autoscaleMargin;
                if (margin != null) {
                    if (opts.min == null) {
                        min -= delta * margin;
                        // make sure we don't go below zero if all values
                        // are positive
                        if (min < 0 && axis.datamin != null && axis.datamin >= 0)
                            min = 0;
                    }
                    if (opts.max == null) {
                        max += delta * margin;
                        if (max > 0 && axis.datamax != null && axis.datamax <= 0)
                            max = 0;
                    }
                }
            }
            axis.min = min;
            axis.max = max;
        }

        var timeUnitSize;

        function setupTickGeneration(axis) {
            var opts = axis.options;
            	axis.tickSize = null;

            // estimate number of ticks
            var noTicks;
            if (typeof opts.ticks == "number" && opts.ticks > 0)
                noTicks = opts.ticks;
            else
                // heuristic based on the model a*sqrt(x) fitted to
                // some data points that seemed reasonable
                noTicks = 0.25 * Math.sqrt(axis.direction == "x" ? canvasWidth : canvasHeight);

            if(axis.direction == "x" &&  opts.mode == "time" && opts.minTickWidth != null) {
            	noTicks = canvasWidth/opts.minTickWidth;
            }

            var delta = (axis.max - axis.min) / noTicks,
                size, generator, unit, formatter,  magn, norm;

            if (opts.mode == "time") {
                // pretty handling of time
                // map of app. size of time units in milliseconds
                timeUnitSize = {
                    "second": 1000,
                    "minute": 60 * 1000,
                    "hour": 60 * 60 * 1000,
                    "day": 24 * 60 * 60 * 1000,
                    "month": 30 * 24 * 60 * 60 * 1000,
                    "year": 365.2425 * 24 * 60 * 60 * 1000
                };
            	if(opts.multiLineTimeHeader.displayWeek && opts.multiLineTimeHeader.displayWeek.enable) {
	            	timeUnitSize["week"] =  7 * 24 * 60 * 60 * 1000;
	            }
                var viewAreaInMilliseconds = axis.max - axis.min;
                var viewAreaInPixels = 0;
                if($.isFunction(axis.p2c)) {
                	 viewAreaInPixels = axis.p2c(Math.round(axis.max)) - axis.p2c(Math.round(axis.min));
                }

                // the allowed tick sizes, after 1 year we use
                // an integer algorithm
                var spec = [
                    [1, "second"], [2, "second"], [5, "second"], [10, "second"],
                    [30, "second"],
                    [1, "minute"], [2, "minute"], [5, "minute"], [10, "minute"],[15, "minute"],
                    [30, "minute"],
                    [1, "hour"], [2, "hour"], [4, "hour"],[6, "hour"],
                    [8, "hour"], [12, "hour"],
                    [1, "day"], [2, "day"], [3, "day"],
                    [0.25, "month"], [0.5, "month"], [1, "month"],
                    [2, "month"], [3, "month"], [6, "month"],
                    [1, "year"]
                ];

                var minSize = 0;
                if (typeof opts.tickSize == "number") {
                    minSize = opts.tickSize;
                } else if (opts.minTickSize != null) {
                    minSize = opts.minTickSize[0] * timeUnitSize[opts.minTickSize[1]];
                }


                for (var i = 0; i < spec.length - 1; ++i) {
                    if (delta < (spec[i][0] * timeUnitSize[spec[i][1]]
                                 + spec[i + 1][0] * timeUnitSize[spec[i + 1][1]]) / 2
                       && spec[i][0] * timeUnitSize[spec[i][1]] >= minSize) {
                        break;
                    }
	                size = spec[i][0];
	                unit = spec[i][1];
                }
                // special-case the possibility of several years
                if (unit == "year") {
                    magn = Math.pow(10, Math.floor(Math.log(delta / timeUnitSize.year) / Math.LN10));
                    norm = (delta / timeUnitSize.year) / magn;
                    if (norm < 1.5)
                        size = 1;
                    else if (norm < 3)
                        size = 2;
                    else if (norm < 7.5)
                        size = 5;
                    else
                        size = 10;

                    size *= magn;
                }
                if(opts.tickSizeProvider != null && $.isFunction(opts.tickSizeProvider)) { // Check only for normal and minor ticks
    	                axis.tickSize = opts.tickSizeProvider(viewAreaInMilliseconds, viewAreaInPixels);
	                // Expectign the return object from the tickSizeProvider callback - Eg:  [1, "day"]
	                if(axis.tickSize) {
	                	axis.tickStep = axis.tickSize[0]  * timeUnitSize[axis.tickSize[1]];  // ISRM-5052
                	}
                }

                if(axis.tickSize == undefined) { //framework default
                	axis.tickSize = opts.tickSize || [size, unit];
                	axis.tickStep = axis.tickSize[0]  * timeUnitSize[unit];
                }
                generator = function(axis) {//framework default to generate ticks
                	return generateTicks(axis, "MINOR_TICKS", timeUnitSize); //generate minor ticks
                };
                if(opts.multiLineTimeHeader.enable) {
                	axis.majorTickSize = null; //default clear
                	axis.majorTicks = null;
	                if(opts.multiLineTimeHeader.majorTickSize != null) {
	                	axis.majorTickSize = opts.multiLineTimeHeader.majorTickSize;
	                } else  if(opts.multiLineTimeHeader.majorTickSizeProvider != null) {
	                	var funcName = opts.multiLineTimeHeader.majorTickSizeProvider;
	                	if ($.isFunction(funcName)) {
	                		 axis.majorTickSize = funcName(viewAreaInMilliseconds, viewAreaInPixels);
	                	}
	                }

	                if(axis.majorTickSize == undefined) {
	                	//framework default
	                	var majorTickUnit = generateDefaultMajorTickUnit(axis, size, unit, timeUnitSize); // returns in the  major tick unit to be displayed
	                	axis.majorTickSize = [1, majorTickUnit]; // of the form [size, unit];
	                	//axis.majorTickStep = axis.majorTickSize[0] * timeUnitSize[majorTickUnit];
	                }

	                majorTickGenerator = function(axis) {
	                	return generateTicks(axis, "MAJOR_TICKS", timeUnitSize);
	                };
                }

                if(opts.subTick.enable) {
                	axis.subTickSize = null;
                	axis.subTicks = null;
                	if(opts.subTick.subTickSize != null) {
	                	axis.subTickSize = opts.subTick.subTickSize;
	                } else {
	                	var relativeTickSizePercentage = opts.subTick.relativeTickSize; // default is 2 sub ticks for each minor  tick
	                	relativeTickSizeInMillis = (size * timeUnitSize[unit])/relativeTickSizePercentage;
	                	//console.log(" relativeTickSizeInMillis " + relativeTickSizeInMillis);
	                	if(relativeTickSizeInMillis>=timeUnitSize.month) {
	                		subTickUnit = "month";
	                		axis.subTickSize = [relativeTickSizeInMillis/timeUnitSize.month, "month"];
	                	} else if (relativeTickSizeInMillis>=timeUnitSize.day){
	                		subTickUnit = "day";
	                		axis.subTickSize = [relativeTickSizeInMillis/timeUnitSize.day, "day"];
	                	} else if (relativeTickSizeInMillis>=timeUnitSize.hour){
	                		subTickUnit = "hour";
	                		axis.subTickSize = [relativeTickSizeInMillis/timeUnitSize.hour, "hour"];
	                	} else if (relativeTickSizeInMillis>=timeUnitSize.minute){
	                		subTickUnit = "minute";
	                		axis.subTickSize = [relativeTickSizeInMillis/timeUnitSize.minute, "minute"];
	                	} else if (relativeTickSizeInMillis>=timeUnitSize.second){
	                		subTickUnit = "second";
	                		axis.subTickSize = [relativeTickSizeInMillis/timeUnitSize.second, "second"];
		                 }
	                	//console.log(" Setting subTick  " + axis.subTickSize );
	                }
	                subTickGenerator = function(axis) {
	                	subTicks = generateTicks(axis, "SUB_TICKS", timeUnitSize);
	                    return subTicks;
	                };
                }

                //Default formatter for time axis
                formatter = function (v, axis) {
                	var d = $.chronosDate(plot, v);
                    // first check global format
                    if (opts.timeformat != null)
                        return $.chronos.formatDate(d, opts.timeformat, opts.monthNames);
                    else
                    	return generateNormalFormatter(v, axis, timeUnitSize);
                };

                if(opts.multiLineTimeHeader.enable) {
                	// MAJOR FORMATTER
	                majorTickFormatter = function(v, axis, nextTick) {
	                	var d = $.chronosDate(plot, v);
	                    // first check global format
	                    if (opts.timeformat != null)
	                        return $.chronos.formatDate(d, opts.timeformat, opts.monthNames);
	                    else
	                	 return generateMajorTickFormatter(v, axis, timeUnitSize, opts.multiLineTimeHeader, nextTick);
	                };

	                // MINOR FORMATTER
	                minorTickFormatter = function(v, axis) {
	                	var d = $.chronosDate(plot, v);
	                    // first check global format
	                    if (opts.timeformat != null)
	                        return $.chronos.formatDate(d, opts.timeformat, opts.monthNames);
	                    else
	                    	return generateMinorTickFormatter(v, axis, timeUnitSize);
	                };
                }

            } else {
                // pretty rounding of base-10 numbers
                var maxDec = opts.tickDecimals;
                var dec = -Math.floor(Math.log(delta) / Math.LN10);
                if (maxDec != null && dec > maxDec)
                    dec = maxDec;

                magn = Math.pow(10, -dec);
                norm = delta / magn; // norm is between 1.0 and 10.0

                if (norm < 1.5)
                    size = 1;
                else if (norm < 3) {
                    size = 2;
                    // special case for 2.5, requires an extra decimal
                    if (norm > 2.25 && (maxDec == null || dec + 1 <= maxDec)) {
                        size = 2.5;
                        ++dec;
                    }
                }
                else if (norm < 7.5)
                    size = 5;
                else
                    size = 10;

                size *= magn;

                if (opts.minTickSize != null && size < opts.minTickSize)
                    size = opts.minTickSize;

                axis.tickDecimals = Math.max(0, maxDec != null ? maxDec : dec);
                axis.tickSize = opts.tickSize || size;

                generator = function (axis) {
                    var ticks = [];

                    // spew out all possible ticks
                    var start = floorInBase(axis.min, axis.tickSize),
                        i = 0, v = Number.NaN, prev;
                    do {
                        prev = v;
                        v = start + i * axis.tickSize;
                        ticks.push(v);
                        ++i;
                    } while (v < axis.max && v != prev);
                    return ticks;
                };

                formatter = function (v, axis) {
                    return v.toFixed(axis.tickDecimals);
                };
            }

            if (opts.alignTicksWithAxis != null) {
                var otherAxis = (axis.direction == "x" ? xaxes : yaxes)[opts.alignTicksWithAxis - 1];
                if (otherAxis && otherAxis.used && otherAxis != axis) {
                    // consider snapping min/max to outermost nice ticks
                    var niceTicks = generator(axis);
                    if (niceTicks.length > 0) {
                        if (opts.min == null)
                            axis.min = Math.min(axis.min, niceTicks[0]);
                        if (opts.max == null && niceTicks.length > 1)
                            axis.max = Math.max(axis.max, niceTicks[niceTicks.length - 1]);
                    }

                    generator = function (axis) {
                        // copy ticks, scaled to this axis
                        var ticks = [], v, i;
                        for (i = 0; i < otherAxis.ticks.length; ++i) {
                            v = (otherAxis.ticks[i].v - otherAxis.min) / (otherAxis.max - otherAxis.min);
                            v = axis.min + v * (axis.max - axis.min);

                            ticks.push(v);
                        }
                        return ticks;
                    };

                    // we might need an extra decimal since forced
                    // ticks don't necessarily fit naturally
                    if (opts.mode != "time" && opts.tickDecimals == null) {
                        var extraDec = Math.max(0, -Math.floor(Math.log(delta) / Math.LN10) + 1),
                            ts = generator(axis);

                        // only proceed if the tick interval rounded
                        // with an extra decimal doesn't give us a
                        // zero at end
                        if (!(ts.length > 1 && /\..*0$/.test((ts[1] - ts[0]).toFixed(extraDec))))
                            axis.tickDecimals = extraDec;
                    }
                }
            }

            //Framework support subTicks for xaxis
            if(opts.mode == "time" && axis.direction =="x" &&  opts.subTick.enable) {
	           	 //create subticks
	          	 axis.subTickGenerator = subTickGenerator;
      	 	}

            //Framework supports multiline only for xaxis- time
            if(opts.mode == "time" && axis.direction =="x" && opts.multiLineTimeHeader.enable) {
            	axis.tickGenerator =  generator;
            	axis.majorTickGenerator = majorTickGenerator; // default fw formatter

            	if ($.isFunction(opts.tickFormatter)) {
	                axis.minorTickFormatter = function (v, axis) { return "" + opts.tickFormatter(v, axis); };
            	} else {
	                axis.minorTickFormatter = minorTickFormatter;
            	}

            	 if ($.isFunction(opts.multiLineTimeHeader.majorTickFormatter)) {
  	                axis.majorTickFormatter = function (v, axis) { return "" + opts.multiLineTimeHeader.majorTickFormatter(v, axis); };
            	 } else {
  	                axis.majorTickFormatter = majorTickFormatter;
            	 }

            } else {
            	axis.tickGenerator =  generator;
	            if ($.isFunction(opts.tickFormatter))
	                axis.tickFormatter = function (v, axis) { return "" + opts.tickFormatter(v, axis); };
	            else
	                axis.tickFormatter = formatter;
	        }
        }

       //This is the function declaration called above for generating Major TickUnit
       function  generateDefaultMajorTickUnit(axis, minorTickSize , minorTickUnit, timeUnitSize ) {//eg: 10, minute
             var t = minorTickSize * timeUnitSize[minorTickUnit]; //tickSize unit(hr/day...) in millis
             var span = axis.max - axis.min;
             var weekDisplay= axis.options.multiLineTimeHeader.displayWeek;
             var majorTickUnit = "day"; // default is set as day
             if (t >= timeUnitSize.month && t <= timeUnitSize.year) { //when showing months in minor So show year in major
            	 if (span < timeUnitSize.year) {
            		 majorTickUnit = "month";
            	 } else {
            		 majorTickUnit = "year";
            	 }
             } if ((t >=timeUnitSize.day || t >= timeUnitSize.week) && t <= timeUnitSize.month) { //when showing months in minor So show year in major
            	 if (span < timeUnitSize.month && weekDisplay.enable) {
            		 majorTickUnit = "week";
            	 } else {
            		 majorTickUnit = "month";
            	 }
             } else if( (t >= timeUnitSize.hour && t <= timeUnitSize.day) ||
             	(t >= timeUnitSize.minute && t <= timeUnitSize.hour) ) {
            	 majorTickUnit = "day";  //showing hrs  or   showing hours eg: half day
             } else  if (t >= timeUnitSize.minute && t <= timeUnitSize.hour ) { // showing minutes
            	 majorTickUnit = "hour";
             } else if (t >= timeUnitSize.second && t < timeUnitSize.minute) { //showing seconds
            	 majorTickUnit = "minute";
             }
             //console.log("Setting  majorTickUnit -------------------"  +  majorTickUnit + " for minorTickSize " + minorTickSize + " -" + minorTickUnit );
             return majorTickUnit;
        };

        function generateTicks(axis, tickType, timeUnitSize) {
		   	 var ticks = [],
		   	 		 d = $.chronosDate(plot, axis.min);
		   	 //console.log("axis.tickSize " + axis.tickSize);
		   	 switch(tickType) {
			   	 case "MINOR_TICKS" : {
			   		 tickSize = axis.tickSize[0], unit = axis.tickSize[1]; // for default case & minor ticks-if multi header enabled
			   		 break;
			   	 }
			   	 case "MAJOR_TICKS" : {
			   		 tickSize = axis.majorTickSize[0], unit = axis.majorTickSize[1]; // for majorTicks if multi header enabled
			   		 break;
			   	 }
			   	 case "SUB_TICKS" : {
			   		 tickSize = axis.subTickSize[0], unit = axis.subTickSize[1]; // for sub ticks if multi header enabled
			   		 break;
			   	 }
		   	 }
		   	 var step = tickSize * timeUnitSize[unit]; //  This should be 6 ticks for an hour if [10, minute]

		   	 //console.log(tickType ," Step--------", step , "timeUnitSize  ", timeUnitSize);
		     if (unit == "second")
                 d.setSeconds(floorInBase(d.getSeconds(), tickSize));
             if (unit == "minute")
                 d.setMinutes(floorInBase(d.getMinutes(), tickSize));
             if (unit == "hour")
                 d.setHours(floorInBase(d.getHours(), tickSize));
             if (unit == "day")
                 d.setDate(floorInBase(d.getDate(), tickSize));
             if (unit == "week")
                  d.setDate(floorInBase(d.getDate(), tickSize * 7));
             if (unit == "month")
                 d.setMonth(floorInBase(d.getMonth(), tickSize));
             if (unit == "year")
                 d.setFullYear(floorInBase(d.getFullYear(), tickSize));

		       // reset smaller components
		       d.setMilliseconds(0);
		     if (step >= timeUnitSize.minute)
		           d.setSeconds(0);
		       if (step >= timeUnitSize.hour)
		           d.setMinutes(0);
		       if (step >= timeUnitSize.day)
		           d.setHours(0);
		       if (step >= timeUnitSize.day * 4)
		           d.setDate(1);
		       if (step > timeUnitSize.week)
		           d.setDate(1);
		       if (step >= timeUnitSize.year)
		           d.setMonth(0);

		       var carry = 0, v = Number.NaN, prev = Number.NaN;
		       var options =  axis.options;
		       v = d.getTime();
		       var weekFirstDay = (options.multiLineTimeHeader && options.multiLineTimeHeader.displayWeek.enable ?
		    		   options.multiLineTimeHeader.displayWeek.weekFirstDay : 0);

		       do {
		          // console.log("pushing ticks --" + new Date(v) );
		    	   ticks.push(v);

		           if (unit == "month") {
	                   prev = v;
	                   d.setTime(v);
		               if (tickSize < 1) {
		                   // a bit complicated - we'll divide the month
		                   // up but we need to take care of fractions
		                   // so we don't end up in the middle of a day
		                   d.setDate(1);
		                   var start = d.getTime();
		                   d.setMonth(d.getMonth() + 1);
		                   var end = d.getTime();
		                   d.setTime(v + carry * timeUnitSize.hour + (end - start) * tickSize);
		                   carry = d.getHours();
		                   d.setHours(0);
		               } else {

		                   d.setMonth(d.getMonth());
		                   d.setDate(1);
		                   d.setHours(0);
		                   d.setMinutes(0);
		                   d.setSeconds(0);
		                  var daysInMonth = new Date(d.getFullYear(), d.getMonth() +1, 0).getDate();

		                   step = daysInMonth * timeUnitSize.day * tickSize; // calculate step here as months have different days
		               }
	                   v = d.getTime();
	                   v = v + step;
		           }
		           else if (unit == "year") {
		        	   prev = v;
		        	   var year  = d.getFullYear(),
		        	   daysInYear = 365; // Not a leap year
		               d.setFullYear(year);
		        	   v = d.getTime();
		        	   d.setMonth(1);
	                   d.setDate(1);
	                   d.setHours(0);
	                   d.setMinutes(0);
	                   d.setSeconds(0);

	                   if(year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
	                       // if Leap year
	                	   daysInYear =  366;
	                   }
		        	   step = daysInYear * timeUnitSize.day * tickSize; // calculate step here as months have different days
		        	   v = v + step;
		           } else if (unit == "day") {
		        	   prev = v;
		        	   d.setTime(v);
		        	   d.setDate(d.getDate());
		        	   d.setHours(0);
		        	   v = d.getTime();
		        	   v = v + step;
		           } else if (unit == "week") {
		        	  var daysInWeek = 7;
		        	   prev = v;
		        	   d.setTime(v);
		        	   d.setDate(d.getDate() - d.getDay() + weekFirstDay);
	                   d.setHours(0);
	                   d.setMinutes(0);
	                   d.setSeconds(0);
		        	   step = daysInWeek * timeUnitSize.day * tickSize;
		        	   v = d.getTime();
		        	   v = v + step;
			       } else {
		               d.setTime(v + step);
			           prev = v;
			           v = v + step;
		           }


		       } while (v < axis.max && v != prev);
		       return ticks;
    	}

        //This formatter is used for normal default case and sub ticks case
        function generateNormalFormatter(v, axis, timeUnitSize) {
        	  var d = $.chronosDate(plot, v);
        	  var opts = axis.options;
              var t = axis.tickSize[0] * timeUnitSize[axis.tickSize[1]];
              var span = axis.max - axis.min;
              var suffix = (opts.twelveHourClock) ? " %p" : "";
              if (t < timeUnitSize.minute) {
                  fmt = "%h:%M:%S" + suffix;
              } else if (t < timeUnitSize.day) {
                  if (span < 2 * timeUnitSize.day)
                      fmt = "%h:%M" + suffix;
                  else
                      fmt = "%b %d %h:%M" + suffix;
              } else if (t < timeUnitSize.month) {
                  fmt = "%b %d";
              } else if (t < timeUnitSize.year) {
                  if (span < timeUnitSize.year)
                      fmt = "%b";
                  else
                      fmt = "%b %y";
              } else {
                  fmt = "%y";
              }
              return $.chronos.formatDate(d, fmt, opts.monthNames);
        }

        function generateMajorTickFormatter(v, axis, timeUnitSize, multiLineHeaderOpts, nextTick) {
        	 var d = $.chronosDate(plot, v);
              var tickSize = axis.tickSize[0], //minor tickSize
              unit = axis.tickSize[1];
             var majorTickMillis = axis.majorTickSize[0] * timeUnitSize[axis.majorTickSize[1]];
              var t = tickSize * timeUnitSize[unit]; //tickSize unit(hr/day...) in millis

              if (t >= timeUnitSize.month && t <= timeUnitSize.year) {     //showing months in minor So show year in major
           	   		fmt = "%y";

              } else if (t >= timeUnitSize.day && t <= timeUnitSize.month ) { //showing Thursday,17 in minor, So Show Month April,2012 in major
              //ISRM-6150
           	  var nextTickDate , nextDate;
           	  if(nextTick != null){
           		nextTickDate = new Date(nextTick);
           		nextDate = $.chronosDate(plot, nextTick);
           	  }
           	  if(nextTickDate != null &&  nextTickDate.getMonth() != d.getMonth() && nextTickDate.getDate() != 1) {
           		  return  $.chronos.formatDate(d,"%0f") + " / " + $.chronos.formatDate(nextDate,"%0f, %y");
           	  } else {
           	   		fmt = "%0f, %y";
           	  }
              }  else {
            	    //showing hrs or minutes or seconds  in minor, So Show
            	  if(multiLineHeaderOpts.displayWeek && multiLineHeaderOpts.displayWeek.enable) {
            		  fmt = multiLineHeaderOpts.displayWeek.weekFormat != null ? multiLineHeaderOpts.displayWeek.weekFormat: "%b %d, %W";
            	  } else {
            	  	fmt = "%0f %d, %y";
              	 }
              }
             return $.chronos.formatDate(d, fmt);
        }

        function generateMinorTickFormatter(v, axis, timeUnitSize) {
        	 var d = $.chronosDate(plot, v);
        	 var opts = axis.options;

             var tickSize = axis.tickSize[0],
             unit = axis.tickSize[1];
             var t = tickSize * timeUnitSize[unit]; //tickSize unit(hr/day...) in millis
             var suffix = (opts.twelveHourClock) ? " %p" : "";

             var span = axis.max - axis.min;
             var fSize = opts.font.size;

               if (t >= timeUnitSize.month && t <= timeUnitSize.year) {       //showing months

            	   if (span < timeUnitSize.year)
                       fmt = "%0b";
                   else
                       fmt = "%0b %y";

            	   axis.minorFontSize = fSize;
               } else if (t >= timeUnitSize.day && t <= timeUnitSize.month ) { //showing days - Thursday,17
            	   fmt = "%d";
            	   axis.minorFontSize = fSize -3;
            	   // if week days need to be shown in minor tick label
            	   if(opts.multiLineTimeHeader.displayWeek && opts.multiLineTimeHeader.displayWeek.showInMinor){
            		   if(t >= timeUnitSize.day && t < timeUnitSize.month) {
            			   fmt = "%d %W";
            		   }
            	   }

               } else if (t >= timeUnitSize.hour && t <= timeUnitSize.day){ //showing hrs
            	   fmt = "%h:%M" + suffix;
            	   axis.minorFontSize = fSize -3;

               } else  if (t >= timeUnitSize.minute && t <= timeUnitSize.hour){	 // showing minutes
            	   fmt = "%h:%M"+ suffix;
            	   axis.minorFontSize = fSize -4;

               } else if (t >= timeUnitSize.second && t < timeUnitSize.minute){ //showing seconds
               	   fmt = "%h:%M:%S" + suffix;
               	   axis.minorFontSize = fSize -5;
               }

               return $.chronos.formatDate(d, fmt, opts.monthNames);
        }

        //Set ticks and labels to axis
        function setTicks(axis) {
        	var opts = axis.options;
        	 if(opts.mode == "time" &&   axis.direction =="x" && opts.subTick.enable) {
        		 setTicksAndLabels(axis, "SUB_TICKS");
        	 }
        	 if(opts.mode == "time" && axis.direction == "x" && opts.multiLineTimeHeader.enable) {
        		 setTicksAndLabels(axis, "MINOR_TICKS");
        		 setTicksAndLabels(axis, "MAJOR_TICKS");
        	 } else {
        		 setTicksAndLabels(axis, "DEFAULT_NORMAL");// default normal case
        	 }
        }

        function setTicksAndLabels(axis, tickType) {
        	var oticks = null, ticks = [];
        	switch(tickType) {
	        	case "MINOR_TICKS" :
	        	case "DEFAULT_NORMAL" :	{
	        		 axis.ticks = [];
	        		oticks = axis.options.ticks;
	        		 if (oticks == null || (typeof oticks == "number" && oticks > 0))
	                     ticks = axis.tickGenerator(axis);
	        		 else if (oticks) {
	                     if ($.isFunction(oticks))
	                         // generate the ticks
	                         ticks = oticks({ min: axis.min, max: axis.max });
	                     else
	                         ticks = oticks;
	                 }
	        		break;
	        	}
	        	case "SUB_TICKS" : {
	        		axis.subTicks=[];
	        		oticks = axis.options.subTicks;
	        		 if (oticks == null || (typeof oticks == "number" && oticks > 0))
	                     ticks = axis.subTickGenerator(axis);
	        		 else if (oticks) {
	                     if ($.isFunction(oticks))
	                         // generate the ticks
	                         ticks = oticks({ min: axis.min, max: axis.max });
	                     else
	                         ticks = oticks;
	                 }
	        		break;
	        	}
	        	case "MAJOR_TICKS" : {
	        		axis.majorTicks=[];
	        		var oMajorticks = axis.options.majorTicks;
	                if (oMajorticks == null || (typeof oMajorticks == "number" && oMajorticks > 0))
	                	ticks = axis.majorTickGenerator(axis);
	                else if (oticks) {
	                    if ($.isFunction(oticks))
	                        // generate the ticks
	                    	ticks = oMajorticks({ min: axis.min, max: axis.max });
	                    else
	                    	ticks = oMajorticks;
	                }
	        		break;
	        	}
        	}


            // clean up/labelify the supplied ticks, copy them over
            var i, v;


            for (i = 0; i < ticks.length; ++i) {
                var label = null, minorLabel = null, subTickLabel = null, majorTickLabel = null;
                var t = ticks[i];
                if (typeof t == "object") {
                    v = +t[0];
                    if (t.length > 1) {
                        label = t[1];
                    }
                }
                else
                    v = +t;

                if (axis.options.mode == "time" && axis.direction =="x" && subTickLabel == null && tickType == 'SUB_TICKS') {
                     if (!isNaN(v)){
                     	 axis.subTicks.push({ // Note : sub ticks are in axis.subTicks
                     		 v: v
                     		 });
                    }
                }

            	if(axis.options.mode == "time" && axis.direction =="x" && axis.options.multiLineTimeHeader.enable) {
            		if (minorLabel == null  && tickType == 'MINOR_TICKS') {
            			minorLabel =  axis.minorTickFormatter(v, axis);
            			if (!isNaN(v)){
                     	 axis.ticks.push({  // Note : minor and normal ticks are in axis.ticks
                     		 v: v,
                     		 minorTickLabel : minorLabel,
                     		 label: minorLabel});
            			}
            		}

	        		 if (majorTickLabel == null && tickType == 'MAJOR_TICKS') {
	                      majorTickLabel = axis.majorTickFormatter(v, axis, ticks[i+1]);
	                      if (!isNaN(v)){
	                          	  axis.majorTicks.push({ // Note : Major ticks are in axis.majorTicks
	                            	  	v: v,
	                            	  	majorTickLabel : majorTickLabel
	                            	  	});

	                      }
	                 }

                } else if (label == null && tickType == 'DEFAULT_NORMAL') { // even for yaxis tick generation and is the default when there is no multi header time line
                    label = axis.tickFormatter(v, axis);
                    if (!isNaN(v)){
                    	 axis.ticks.push({ // Note : minor and normal ticks are in axis.ticks
                    		 v: v,
                    		 label: label
                    		 });
                   }



                }
            }//each ticks for loop
        } //function close

        // @ticks will be minor ticks in case of multi header..
        // @majorTicks will be major ticks in case of multi header else null
        // @subTicks will be sub ticks in case of sub ticks for time axis
        function snapRangeToTicks(axis, ticks, majorTicks) {
            if (axis.options.autoscaleMargin && ticks.length > 0) {
                // snap to ticks
                if (axis.options.min == null)
                    axis.min = Math.min(axis.min, ticks[0].v);
                if (axis.options.max == null && ticks.length > 1)
                    axis.max = Math.max(axis.max, ticks[ticks.length - 1].v);
            }

            if(majorTicks != null && majorTicks.length > 0) {
            	 // snap to ticks
                if (axis.options.min == null)
                    axis.min = Math.min(axis.min, majorTicks[0].v);
                if (axis.options.max == null && majorTicks.length > 1)
                    axis.max = Math.max(axis.max, majorTicks[majorTicks.length - 1].v);
            }
        }


        //FOLLOWING ARE COMMON FUNCTIONS FOR RESTORING
        function restoreContext() {
        	if(options.series.gantt.canvasLayers.layerNames == null) { //default case
        		//FOR BASE
            	ctx.restore();
        	}
        	//FOR ALL LAYERS
        	for (eachLayerName in canvasLayerMap) {
        		canvasLayerMap[eachLayerName].context.restore(); //restore all including base
        	}
        }

        function clearContext() {
        	//CLEAR FOR BASE AND HIGHLIGHT
        	if(options.series.gantt.canvasLayers.layerNames == null) { //default case
        		ctx.beginPath();
	        	if( options.legend.labelContainerWidth == 0 ) {
	        		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	        	} else {
	        		ctx.clearRect(options.legend.labelContainerWidth, 0, canvasWidth, canvasHeight);
	        	}
	        	ctx.closePath();
        	}
        	//clear highlight also before redraw
        	if(hctx != null) {// will be theer only if autohighlight is on
        		hctx.beginPath();
        		hctx.clearRect(0, 0, canvas.width, canvas.height);
        		hctx.closePath();
        	}


        	//CLEAR FOR  ALL LAYERS
        	for (eachLayerName in canvasLayerMap) {
        		if( options.legend.labelContainerWidth == 0 ) {
        			canvasLayerMap[eachLayerName].context.beginPath();
        			canvasLayerMap[eachLayerName].context.clearRect(0, 0, canvasWidth, canvasHeight);
        			canvasLayerMap[eachLayerName].context.closePath();

            	} else {
            		canvasLayerMap[eachLayerName].context.beginPath();
            		canvasLayerMap[eachLayerName].context.clearRect(options.legend.labelContainerWidth, 0, canvasWidth, canvasHeight);
            		canvasLayerMap[eachLayerName].context.closePath();
            	}

        	}
        }

        /**
         *
         * @param actualDraw :  is set to true from framework where ever we need the actual draw
         */
        function draw(actualDraw) {
        	//var startTime = new Date().getTime();
        	//console.log("Draw start time  " + startTime);
        	//ensure that the call is only from tiled View
			if(plot.forcedDrawWorker){
				return;
			}

          if(plot.getOptions().drawOnlyColumnHeader){
            plot.drawAxisLabels();
            return;
          }

        	if((actualDraw == undefined || actualDraw == false)  && plot.isScrolling()) {
                  plot.setInterimScrollMode(true);
        	}   // actual draw in the canvas should happen.
        	//FOR BASE AND HIGHLIGHT
        	restoreContext();
        	restoreContext();

        	if(hctx !=null ) {
        		hctx.restore();
        		hctx.restore();
        	}
        	//CLEAR FOR BASE AND HIGHLIGHT
        	clearContext();

            var grid = options.grid;
           // draw background, if any
            if (grid.show && grid.backgroundColor)
                drawBackground();

            //draw full background if defaultMarkings is not enabled
            if (options.series.gantt.show && options.series.gantt.fullBackgroundColor){
            	drawFullBackGround();
        	}

            if (grid.show && !grid.aboveData) {
                drawGrid();
            }
            series = plot.getSeries();
            //Modified for ISRM-8140
            // if (options.xaxis.colorDays.enable) {
	        	// ctx.save();
	          //   ctx.translate(plotOffset.left, plotOffset.top);
	          //   drawMarkings(plot.coloringFunction(options.xaxis.colorDays), false, !options.xaxis.colorDays.headerOnly) //drawMarkings on headers Only if darwOnGrid is false
	          // 	ctx.restore();
  	        //   }
            if(options.series.gantt.show) {
            // Added for ISRM-8231
            	if(options.xaxis.multiLineTimeHeader.enable && options.xaxis.multiLineTimeHeader.majorTickStyle.tickRenderer
            			&& options.xaxis.multiLineTimeHeader.majorTickStyle.drawTickOnTop == false) {
  	     		    drawAllTicks();
  	     		    drawSeriesGantt(ctx, series); //HERE IS WHERE THE ACTUAL GANTT DRAWING STARTS.
  	     		} else {
            	drawSeriesGantt(ctx, series); //HERE IS WHERE THE ACTUAL GANTT DRAWING STARTS.
  	     		}
            	//For drawign connections
            	if(connections != null) {
     	    	   ctx.save();
                   ctx.translate(plotOffset.left, plotOffset.top);

                   var priorityContext = null;
                   if(canvasLayerMap != null && canvasLayerMap["chronos_priority"] != undefined) {
                	   priorityContext = canvasLayerMap["chronos_priority"].context;
                   priorityContext.save();
    			   priorityContext.translate(plotOffset.left, plotOffset.top);
                   }

                   plot.drawConnections(connections);
     	    	   ctx.restore();
     	    	   if(priorityContext != null) {
     	    		   priorityContext.restore()
     	    	   };
     	       }

            } else { //OTHER CHARTS
            	ctx.save();
                ctx.translate(plotOffset.left, plotOffset.top);
            	//For Charts - line , bar & point //DRAWING FOR LINE & BAR
	            for (var i = 0; i < series.length; ++i) {
	                executeHooks(hooks.drawSeries, [ctx, series[i]]);
	                drawSeries(series[i]);
	            }
	            ctx.restore();
            }

            if(grid.autoHighlight == true ) {
	        	 if(options.series.gantt.show) {
	        		 drawHighLightOverlay();
	        	 }
	        }
            if(options.series.gantt.show) {
            	drawAxisLabels(); //Draw Axis after the  gantt is drawn so that clipping of the left & right happens automatically
            	drawMarkingsExtendingToRowHeaders();
            }
            //Draw the plot border and markings
	        drawGridBorder(); // This also drawn after gantt task

            //Draw border around whole chart if needed
            if(options.series.gantt.show && options.series.gantt.fullBorderColor != null) {
            	ctx.lineWidth = options.series.gantt.fullBorderWidth;
            	ctx.strokeStyle = (options.series.gantt.fullBorderColor).toString();
            	ctx.strokeRect(0, 0 , canvasWidth -1, canvasHeight);
            	ctx.closePath();
            }
            if (grid.show && grid.aboveData) {
                drawGrid();
                drawAxisLabels();
            }
	        executeHooks(hooks.draw, [ctx]);
	        //reset back at the end which user triggers
        	plot.setInterimScrollMode(false);

        	//var endTime = new Date().getTime();
        	//console.log("Total time taken fro draw in milliseconds : ----------  " + (endTime - startTime));

       	}

        /**
         * Does the backgrounf filling and and header ticks drawing.
		 * also trigger fill label renderer  and row footer background.
         */
        function fillLabelBackgroundColor(axis) {
		 //console.log("fillLabelBackgroundColor axis .direction ", axis.direction , "axis.showLabel ", axis.showLabel);
		   if(!axis.showLabel) {
			   return;
		   }
		   var box = axis.box;
           //First apply the label background and then write the labels
           if(axis.position != "both") {
        	   if(axis.show && axis.direction =="x") {
        		   if(axis.position == "top") {
        			   box.boxPosition = "XAXIS_BOX_TOP";
        			   applyLabelBackground(axis, box);
        		   } else {
        			   box.boxPosition = "XAXIS_BOX_BOTTOM";
        			   applyLabelBackground(axis, box);
        		   }

        		   if(axis.options.labelBackgroundColor != undefined) {
        			 //if there are any markings on header, redraw that as well.
        	          if (options.grid.markings.markingsArray) {
        	            drawMarkingsExtendingToColumnHeaders();
        	          }
        			   //After filling background ensure that you redraw the header ticks ..especially multi header
          	     		drawHeaderTicks();

        		   }

        	   } else if(axis.direction =="y") {
        		   if(axis.position=="left") {
        			   box.boxPosition = "YAXIS_BOX_LEFT";
        			   applyLabelBackground(axis, box);
        		   } else {
        			   box.boxPosition = "YAXIS_BOX_RIGHT";
        			   applyLabelBackground(axis, box);
                		   }
               }
             } else { //FOR BOTH
        	 	if(axis.direction =="x") {
    				var boxTop = axis.labelPosition.top.box;
    				boxTop.boxPosition = "XAXIS_BOX_TOP";
    				applyLabelBackground(axis, boxTop);

    				var boxBottom = axis.labelPosition.bottom.box;
    				boxBottom.boxPosition = "XAXIS_BOX_BOTTOM";
    				applyLabelBackground(axis, boxBottom);
    				// Modified for ISRM-8231
    				 if(axis.options.labelBackgroundColor != undefined &&(axis.options.multiLineTimeHeader.enable && axis.options.multiLineTimeHeader.majorTickStyle.tickRenderer != undefined)) {
          			   //After filling background ensure that you redraw the header ticks ..especially multi header on xaxis
            	     	drawHeaderTicks();
          		     }
                 } else {
            	   var boxLeft = axis.labelPosition.left.box;
            	   boxLeft.boxPosition = "YAXIS_BOX_LEFT";
   				   applyLabelBackground(axis, boxLeft);

   				   var boxRight = axis.labelPosition.right.box;
   				   boxRight.boxPosition = "YAXIS_BOX_RIGHT";
   				   applyLabelBackground(axis, boxRight);
                }
            } //NOT BOTH

           if(axis.direction == "y") {  //FOR Y ALONE
               //Check for rowFooter full background if any . If so paint that before triggering each row footer
               if(axis.options.rowFooter.enable && (axis.options.rowFooter.fullBackgroundColor != null ||
            		   axis.options.rowFooter.backgroundRendererCallbackFn != null)) {
            	  var footerWidth = options.yaxis.rowFooter.width;
                  ctx.lineWidth = axis.options.rowFooter.borderWidth;
	              var areaBox = {
	            		  left : plotOffset.left + plotWidth,
            			  top :  plotOffset.top,
            			  height : plotHeight,
            			  width :  footerWidth
            	  	};
            	 applyRowFooterBackground(areaBox,  axis);

		 	    }
           }
        }
        /**
         * Painting label backgroubnd color for row footer
         */
        function applyRowFooterBackground(areaBox, axis) {

        	var rowFooterBackgroubdColor = axis.options.rowFooter.fullBackgroundColor;
        	var rowFooterBackgroundCallback = axis.options.rowFooter.backgroundRendererCallbackFn;

        	if(rowFooterBackgroubdColor != undefined) {
	 			ctx.strokeStyle = (rowFooterBackgroubdColor).toString();
	       		ctx.fillStyle = (rowFooterBackgroubdColor).toString() ;
	     		ctx.beginPath();
	           	ctx.fillRect(areaBox.left,  areaBox.top,  areaBox.width, areaBox.height );
	           	ctx.strokeRect(areaBox.left, areaBox.top,  areaBox.width, areaBox.height );
	           	ctx.closePath();
	 		}

	        //Trigger full label call back renderer as well if specified here
	        if(rowFooterBackgroundCallback != undefined ||  rowFooterBackgroundCallback != null) {
	               	var dataToCallBackFn ={
	               			drawingContext :ctx,
	               			left : areaBox.left, //in pixels
	               			top : areaBox.top,
	               			width :areaBox.width,
	               			height:areaBox.height
	               	}
	             triggerCallBackRenderer(dataToCallBackFn, rowFooterBackgroundCallback);
	         }
        }

        /**
		   * returns true if the old coordinates are same ..ie no change in position . Used in calculating header image
		   */
		  plot.isSameCanvasBounds = function() {
			  series = plot.getSeries();
			  var isSameBounds = (oldYaxisMin == series.yaxis.min && oldYaxisMax == series.yaxis.max &&
					  		oldXaxisMin == series.xaxis.min && oldXaxisMax == series.xaxis.max);
			  if(oldYaxisMin == 0 && oldXaxisMin == 0) { //reset on any saveTileCache
				  isSameBounds = false;
			  }
			  if(!isSameBounds) {
				  plot.setOldBounds(series.xaxis.min, series.xaxis.max, series.yaxis.min, series.yaxis.max);
			  }
			  return isSameBounds;
		  };

        //Display all minor, major axis labels and the corner clippings and rendering images and text in corner boxes.
        //This function also apply label backgrounds
		  function drawAxisLabels() {
	        	var treeNode  = series.yaxis.options.treeNode;
	        	var interimScrollMode = plot.getInterimScrollMode();
	        	//Drawing header image in all cases if cacheHeaderTextAsImage is true
	        	$.each(allAxes(), function (_, axis) { // firts iteration will be xaxis
	        		 fillLabelBackgroundColor(axis); //first fill the background and also label ticks in the label part
	        		 if((interimScrollMode == true) && (series.gantt.cacheHeaderTextAsImage == true)
		            		  && ((axis.direction =="y" && scrollDirection == "horizontal" ) || (axis.direction =="x" && scrollDirection == "vertical" ))) {
		            	 plot.drawHeaderImage();
	        		 }
	        	});
	        	if(treeNode == undefined)  { // Note for tree Node it is called after drawing yaxis root headers(drawMultiGridRowHeaders)
	        		for(var eachIndex = 0; eachIndex < allAxes().length; eachIndex++)  {
		        		   axis = allAxes()[eachIndex];
		        		if(axis.showLabel) {
		        			drawMinorAxisLabels(axis); // for default y axis  and minor  time axis label
		        			//Draw major ticks  for xaxis as well if multiLineTimeHeader is enabled
		        			setContextFontProperties(axis.font, axis.options.color);
		        			if(axis.options.mode == "time" &&  axis.direction =="x" && axis.options.multiLineTimeHeader.enable) {
		        				drawMajorAxisLabels(axis);
		        			}
		        		}
		               //Enable corner Box only if there is no multiColumnLabel for that axis
		               if(axis.options.multiColumnLabel != undefined  && axis.options.multiColumnLabel.columns.length == 0) {	// all othere cases except tree node
				           //Note : Clipping all the corner to prevent labels overlapping
				           if(options.grid.cornerBox.enable) {
				        		  drawCornerBoxes("BASE", ctx);
				           }
			           }
		             //NOTE : Do the following  only after drawing y axis labels and footers .. Case when not tree
		             if(axis.direction == "x") {
		            		if(axis.options.columnSummary != undefined && axis.options.columnSummary.enable) {
			            	  if(axis.options.columnSummary.fullBackground != null) {
			            		  drawColumnSummaryBackGround(axis);
			            	  }
			            	  drawColumnSummaryLabels(axis);	//These are tick labels
			              	  drawColumnSummaryHeader(axis);	//Thease are summary exactly over column summary
		            		}
		            		if(axis.options.topHeader != undefined && axis.options.topHeader.enable) {
				            	drawTopHeaderArea(axis);
			            	}
		            		//Note : Clipping all the corner to prevent labels overlapping
					        if(options.grid.cornerBox.enable) {
					        	drawCornerBoxes("BASE", ctx); // clear top header corner as well
					        }
		              }
		        	}//);  // for each axis
	        	} else  if(treeNode != undefined) {
		        	//EXECUTE THIS ONLY FOR TREE ONLY -BUG FIX FOR TREENODEROW HEADERS  HEADER SEEN OVER XAXIS LABEL
	        	   for(var eachIndex = 0; eachIndex < allAxes().length; eachIndex++)  {
	        		   axis = allAxes()[eachIndex];

		            	if(axis.direction == "x") {
		            		if(axis.showLabel) {
		            			fillLabelBackgroundColor(axis); //first fill the background and also label ticks in the label part
		            			drawMinorAxisLabels(axis); // for default and minor axis label
		            			setContextFontProperties(axis.font, axis.options.color);
			              	    if(axis.options.multiLineTimeHeader.enable) {
			              	     drawMajorAxisLabels(axis);
			              	   }
		            		}
			              	 //NOTE : Do the following  only after drawing y axis labels and footers ..
		              	     if(axis.options.columnSummary != undefined && axis.options.columnSummary.enable) {
				            	  if(axis.options.columnSummary.fullBackground != null) {
				            		  drawColumnSummaryBackGround(axis);
				            	  }
				            	  drawColumnSummaryLabels(axis);	//These are tick labels
				              	  drawColumnSummaryHeader(axis);	//Thease are summary exactly over column summary
			               }
		              	   if(axis.options.topHeader != undefined && axis.options.topHeader.enable) {
				            	drawTopHeaderArea(axis);
				            	//Note : Clipping all the corner to prevent labels overlapping
						           if(options.grid.cornerBox.enable) {
						        		  drawCornerBoxes("BASE", ctx);
						           }
			            	}
			            } else if(axis.direction == "y") { //Note : Y will be executed first
		   		        	 if(axis.options.multiColumnLabel.columns.length > 0) {
		   		        		 fillLabelBackgroundColor(axis); //first fill the background and also label ticks in the label part
		   		        	     drawMinorAxisLabels(axis); // for default and minor axis label
		   		             }
			            }
	        	   }//for
	        	   //once agian //Draw the columns headers in the corner area	:  BUG : time labels Text coming over corner area	So draw it last
	        	   $.each(allAxes(), function (_, axis) {
	        		   if(axis.direction == "y") {
	        			  setupCornerObjects(); // for recalculating cornerHeight corrcetly
	        			  drawMultiGridRowHeaders(axis);
	        		   }
	        	   });
	           }

	        	//Now create the header image to be used for scrolling . For Performance improvemnt in scrolling
	            if(interimScrollMode == false  && series.gantt.cacheHeaderTextAsImage == true) {
	            	setTimeout(plot.createHeaderImage, 0);  // if header image is successfully created.
	            }
	        }
        function drawColumnSummaryBackGround(axis) {
        	///if there is a full background ..draw that first
          	var top = 0;
          	if (axis.options.columnSummary.position == "top") {
          		top = plotOffset.top - axis.options.columnSummary.height - options.grid.borderWidth;
  	       	} else if (axis.options.columnSummary.position == "bottom") {
  	       		 top = plotHeight + plotOffset.top + 2* options.grid.borderWidth;
  	       	}
          	 var summaryBox = {
             			left : 0, //plotOffset.left,
             			top : top,
             			width: plotOffset.left +plotWidth+ plotOffset.right, //plotWidth,
             			height:(axis.options.columnSummary.height - options.grid.borderWidth)
             		};
          	 ctx.beginPath();
           	 ctx.fillStyle = axis.options.columnSummary.fullBackground;
           	 ctx.fillRect(summaryBox.left , summaryBox.top, summaryBox.width, summaryBox.height);
           	 ctx.strokeStyle = axis.options.columnSummary.fullBackground;
           	 ctx.strokeRect(summaryBox.left , summaryBox.top, summaryBox.width, summaryBox.height);
           	 ctx.closePath();
        }



        function drawTopHeaderArea(axis) {
        	///if there is a full background ..draw that first
          	 var topHeaderBox = {
             			left : plotOffset.left,
             			top : 0,
             			width: plotWidth,
             			height:axis.options.topHeader.height
             		};
          	 if(axis.options.topHeader.fullBackground != undefined) {
	           	 ctx.fillStyle = axis.options.topHeader.fullBackground;
	           	 ctx.fillRect(topHeaderBox.left , topHeaderBox.top, topHeaderBox.width, topHeaderBox.height);
	           	 ctx.stroke();
          	 }
    		var customRenderer = axis.options.topHeader.customRenderer;
    		if(customRenderer != undefined) {
		          dataToRenderer = {
				  		  drawingContext 	: ctx,
				  		  areaBox 			: topHeaderBox,
				  		  startTime 		: series.xaxis.min,
				  		  endTime 			: series.xaxis.max
				  };
				  triggerCallBackRenderer(dataToRenderer, customRenderer);
	 		}
        }


        function drawColumnSummaryLabels(axis) {
        	var right =0 , left = 0, eachTickWidth;
        	if(axis.ticks.length > 1) {
     	  		 right = axis.ticks[1].v;
     	  		 left = axis.ticks[0].v;
     	  		var tickSizeInMilliseconds = right -left;
     	  		 eachTickWidth = axis.p2c(right) - axis.p2c(left);
     	  	} else {
     	  		eachTickWidth = axis.p2c(axis.ticks[0].v);
     	  	}
        	for (var i = 0; i < axis.ticks.length; i++) {
                 var currentTick = axis.ticks[i];
                 var nextTick = null;
                 if((i+1) <= axis.ticks.length) {
                	 nextTick = axis.ticks[i+1];
                 }
                 if(i == axis.ticks.length-1){ // special case at end when next tick not available
                	 nextTick = {};
                	 nextTick.v = currentTick.v + tickSizeInMilliseconds;
                 }
             	 drawColumnSummaryTicks(axis, currentTick, nextTick, eachTickWidth);
        	 }
        }

        function drawColumnSummaryTicks(axis, currentTick, nextTick , width) {
        	var height = axis.options.columnSummary.height;
        	var left  =  plotOffset.left + axis.p2c(currentTick.v);
        	if(left < plotOffset.left) {
        		left = plotOffset.left; //capping left most area
        	}
        	var top = null;

        	if (axis.options.columnSummary.position == "top") {
        		top = plotOffset.top - axis.options.columnSummary.height ;
        	} else if (axis.options.columnSummary.position == "bottom") {
        		 top = plotHeight + plotOffset.top + 2* options.grid.borderWidth;
        	}
        	 var summaryTickArea = {
         			left : left,
         			top : top,
         			width: width,
         			height:height
         		};
        		var summaryTickRenderer = axis.options.columnSummary.summaryTickRenderer;
        		if(summaryTickRenderer != undefined) {
    		           dataToRenderer = {
    				           			  drawingContext : ctx,
    				           			  areaBox :summaryTickArea,
    				           			  tickStart : currentTick,
    				           			  tickEnd :nextTick

    				    };
    				    triggerCallBackRenderer(dataToRenderer, summaryTickRenderer);
    	 		}
        }

        // Mouse click event fired on the corresponding label tick area for the additional column header for xaxis
        //This function checks whether the mouse pointer is on the summary header tick area
        function checkHoveredOnColumnSummaryTickLabels(e) {
        	var axisx = plot.getSeries().xaxis;
        	var offset = plot.offset(),
        	 	canvasX = plot.getPageX(e) - offset.left,
        	 	canvasY = plot.getPageY(e) - offset.top;
        	var right , left, eachTickWidth;
        	if(axisx.ticks.length > 1) {
     	  		 right = axisx.ticks[1].v;
     	  		 left = axisx.ticks[0].v;
     	  		 tickSizeInMilliseconds = right -left;
     	  		 eachTickWidth = axisx.p2c(right) - axisx.p2c(left);
     	  	} else {
     	  		eachTickWidth = axisx.p2c(axisx.ticks[0].v);
     	  	}
        	//Note: Since the plotting happens from canvasX,canvas y = 0
        	var plotOffset = plot.getPlotOffset(),
        			canvasXForPlot = canvasX- plotOffset.left; //to calculate teh actual time plotted

        	 for (var i = 0; i < axisx.ticks.length; ++i) {
                 var currentTick = axisx.ticks[i];
                 var nextTick = null;
                 if((i+1) <=axisx.ticks.length) {
                	 nextTick = axisx.ticks[i+1];
                 }
                 if(i == axisx.ticks.length-1){
                	 nextTick = {};
                	 nextTick.v = currentTick.v + tickSizeInMilliseconds;
                 }
                var height = axisx.options.columnSummary.height;
             	var left  =  plotOffset.left + axisx.p2c(currentTick.v);
             	var top = null;
             	if (axisx.options.columnSummary.position == "top") {
             		top = plotOffset.top - axisx.options.columnSummary.height ;
             	} else if (axisx.options.columnSummary.position == "bottom") {
             		 top = plotHeight + plotOffset.top + 2* options.grid.borderWidth;
             	}
             	var summaryTickArea = { left : left, top : top, width: eachTickWidth, height:height };
              	if(eachTickWidth > 0 && canvasX>= left && canvasX <= left + eachTickWidth
              					&& canvasY >= top && canvasY <= top + height) {

              		var endTime = null;
              		if(nextTick != undefined) {
              			endTime = nextTick.v;
              		}
              		return {
                 		summaryTickArea  :summaryTickArea,
                 		startTime : currentTick.v,
                 		endTime : endTime,
                 		mouseXTime : axisx.c2p(canvasXForPlot), // precompute some stuff to make the loop faster
                    	mouseX : canvasX ,
                    	mouseY :canvasY
                 	 };
              	}
        	 } //for

        	 return null;
        }

        function checkHoveredOnTopHeaderTickArea(e) {
        	var axisx = plot.getSeries().xaxis;
        	var offset = plot.offset(),
        		canvasX = plot.getPageX(e)- offset.left,
        		canvasY = plot.getPageY(e) - offset.top;
        	var right , left, eachTickWidth;
        	if(axisx.ticks.length > 1) {
     	  		 right = axisx.ticks[1].v;
     	  		 left = axisx.ticks[0].v;
     	  		 tickSizeInMilliseconds = right -left;
     	  		 eachTickWidth = axisx.p2c(right) - axisx.p2c(left);
     	  	} else {
     	  		eachTickWidth = axisx.p2c(axisx.ticks[0].v);
     	  	}
        	//Note: Since the plotting happens from canvasX,canvas y = 0
        	var plotOffset = plot.getPlotOffset(),
        			canvasXForPlot = canvasX- plotOffset.left; //to calculate teh actual time plotted

        	 for (var i = 0; i < axisx.ticks.length; ++i) {
                 var currentTick = axisx.ticks[i];
                 var nextTick = null;
                 if((i+1) <=axisx.ticks.length) {
                	 nextTick = axisx.ticks[i+1];
                 }
                 if(i == axisx.ticks.length-1){
                	 nextTick = {};
                	 nextTick.v = currentTick.v + tickSizeInMilliseconds;
                 }
                var height = axisx.options.topHeader.height;
             	var left  =  plotOffset.left + axisx.p2c(currentTick.v);
             	var top =  0 ;// Always top Header will be on top

             	var areaBox = { left : left, top : top, width: eachTickWidth, height:height };
              	if(eachTickWidth > 0 && canvasX>= left && canvasX <= left + eachTickWidth
              					&& canvasY >= top && canvasY <= top + height) {

              		var endTime = null;
              		if(nextTick != undefined) {
              			endTime = nextTick.v;
              		}
              		return {
              			areaBox  :areaBox,
                 		startTime : currentTick.v,
                 		endTime : endTime,
                 		mouseXTime : axisx.c2p(canvasXForPlot), // precompute some stuff to make the loop faster
                    	mouseX : canvasX ,
                    	mouseY :canvasY
                 	 };
              	}
        	 } //for

        	 return null;

        }

     function initializeTreeMap(yaxisOpts) {
        	//DO iT ONLY ONCE
        	var headerGridColums = yaxisOpts.multiColumnLabel.columns;
        	var eachHeaderColumn;
        	for ( var int = 0; int < headerGridColums.length; int++) {
        		eachHeaderColumn = headerGridColums[int];
       			currentRowNodeHeightMap[int] =  -1;
        	}
     }
     function drawMinorAxisLabels(axis) {
    	 setContextFontProperties(axis.font, axis.options.color, axis.minorFontSize );
    	 var right, left, eachMinorTickWidth;
    	 if(axis.ticks.length == 0) {  // fox for ISRM-4056
    		 return;
    	 }
    	 if(axis.ticks.length >  1) {
 	  		 right = axis.ticks[1].v;
 	  		 left = axis.ticks[0].v;
 	  		 eachMinorTickWidth = axis.p2c(right) - axis.p2c(left);
 	  	} else {
 	  		eachMinorTickWidth = axis.p2c(axis.ticks[0].v);
 	  	}

    	 var box = axis.box, bw = options.grid.borderWidth ;
    	 if(  axis.direction == "y" &&  axis.options.multiColumnLabel.columns.length > 0) {
    		 initializeTreeMap(axis.options);
    	 }
    	 for (var i = 0; i < axis.ticks.length; ++i) {
             var tick = axis.ticks[i];
             if (!tick.label || tick.v > Math.ceil(axis.max) || tick.v == -1)
                 continue;
             var startX;
             var x = 0, y = 0, offset = 0, line;
             var axisEndX = axis.p2c(axis.max);
             for (var k = 0; k < tick.lines.length; ++k) {
                 line = tick.lines[k];
                 if(axis.ticks.length > 1) {
             		 startX = axis.p2c(tick.v);
             	 } else {
             		 startX = -1;
             	 }
                 if (axis.direction == "x") {
                    	if(isOnTickAndLessThanThreeDayView(axis)) {
                    	   ctx.textAlign = "center";
                     	   if(axis.options.multiLineTimeHeader.minorTickLabel.zeroHour == "hide" && tick.v == plot.resetViewPortTime(tick.v)) {
                                tick.lines[k].text= "";
                                tick.minorTickLabel ="";
                            }
                    	} else {
                    		  ctx.textAlign = "left";
                    	}
                	 //this logic enables the display of Tick labels to feel like scrolling in the visible parts
                	 var endX = startX + eachMinorTickWidth;
                 	 var boundary = 0;
                 	   if(startX >= boundary && endX <= axisEndX) {
                             //Modified for ISRM-8285
                             if(isOnTickAndLessThanThreeDayView(axis)) {
                            	 x =  plotOffset.left + axis.p2c(tick.v) ;
                             } else {
                            	 x =  plotOffset.left + axis.p2c(tick.v) + eachMinorTickWidth/2  - line.width/2 ;
                             }

                 	   } else if(startX < boundary && endX > axisEndX) {
                 		   x =  plotOffset.left + axisEndX/2  - line.width/2 ;

                       } else if(startX < boundary) {
                 		   	var availableWidth = eachMinorTickWidth + startX;
                 		   	if(availableWidth > line.width) {
                 			   x = plotOffset.left + availableWidth/2  - line.width/2 ;
                 		   	} else {
                 			   ctx.textAlign = "right";
                 			   x = plotOffset.left + availableWidth;
                 		   	}
                 	   } else if(endX > axisEndX) {
                            if (isOnTickAndLessThanThreeDayView(axis) ) {
                               x =  plotOffset.left + axis.p2c(tick.v) ;
                    } else {
                 		   availableWidth = axisEndX - startX;
                 		   if(availableWidth > line.width) {
                 			   x = plotOffset.left + startX + availableWidth/2  - line.width/2 ;
                 		   } else {
                 			   x = plotOffset.left + startX + 1;
                 		   }
                    }
                        } else {
                             //x will be 0; or startx will be less than boundary don't draw the initial tick which gets overlapped
                             if(x == 0) {
                               continue;
                             }
                        }

                     if (axis.position == "bottom") {
                         y = box.top + box.labelMargin + bw ;
                         offset = displayValueOnAxis(axis, tick, line, x , y, offset,box);

                     } else if (axis.position == "top") {
                     	 y = box.top + box.height - axis.heightOfMinorTickLabel - box.labelMargin; // the label margin betweehn axis and minor label
                     	offset = displayValueOnAxis(axis, tick, line, x , y, offset,box);

                     } else if(axis.position == "both") {
                     	offset = drawAxisOnBothSides(axis, tick, line, x, y, offset);
                     }
                 } else { //axis is Y -  ticks-default case

                 	 y = plotOffset.top + axis.p2c(tick.v) - tick.height/2;
                     if (axis.position == "left") {
	                    if(axis.options.multiColumnLabel.columns.length == 0) {
	                    	 x = box.left + box.width - box.labelMargin - line.width;
	                    	 offset = displayValueOnAxis(axis, tick, line, x , y, offset, box);
	                    } else { //multi grid case
	                    	 x = box.left + box.width - box.labelMargin;
	                    	 offset = displayMultiGridLabelsOnAxis(axis, tick, line, x , y, offset, box);
	                    }
                     }
                     else if (axis.position == "right") {
                         x = box.left + box.labelMargin;  // axis in right
                         if(axis.options.multiColumnLabel.columns.length == 0) {
                        	 offset = displayValueOnAxis(axis, tick, line, x , y, offset, box);
	                    } else { //multi grid case
	                    	 offset = displayMultiGridLabelsOnAxis(axis, tick, line, x , y, offset, box);
	                    }
                     } else if(axis.position == "both") {
                     	offset = drawAxisOnBothSides(axis, tick, line, x, y, offset);
                     }
                 }

             } //for k < tick.lines.length
         }     //for axis.ticks.length
     }
     //Added for ISRM-8285
     function isOnTickAndLessThanThreeDayView(axis) {
         if(axis.options.multiLineTimeHeader.enable  &&
                            axis.options.multiLineTimeHeader.minorTickLabel.tickPosition == "ontick" ) {
                    if( axis.majorTicks.length <= 3 && axis.majorTickSize[1] == "day") {
                     return true;
                    }
         }
         return false;
         }


     function drawMultiGridRowHeaders(axis) {
     	var multiColumnLabelObject = axis.options.multiColumnLabel;
     	//These settings are common to all headers
     	var headerColumns = multiColumnLabelObject.columns;
 		var borderWidth = multiColumnLabelObject.border.width;
 		ctx.strokeStyle = multiColumnLabelObject.border.color;
 		ctx.lineWidth = borderWidth/2;

 		var topLeftCorner = cornerObjects.topLeftCorner;
     	if(topLeftCorner.width > borderWidth) {
     		drawRowGridHeaderLabels(headerColumns, borderWidth, multiColumnLabelObject, topLeftCorner);
     	}
     	var topRightCorner = cornerObjects.topRightCorner;
     	if(topRightCorner.width   > borderWidth) {
     		drawRowGridHeaderLabels(headerColumns, borderWidth, multiColumnLabelObject, topRightCorner);
     	}

     	var bottomLeftCorner = cornerObjects.bottomLeftCorner;
     	if(bottomLeftCorner.height > borderWidth) {
     		drawRowGridHeaderLabels(headerColumns, borderWidth, multiColumnLabelObject, bottomLeftCorner);
     	}

     	var bottomRightCorner = cornerObjects.bottomRightCorner;
     	if(bottomRightCorner.height > borderWidth) {
     		drawRowGridHeaderLabels(headerColumns, borderWidth, multiColumnLabelObject, bottomRightCorner);
     	}
     }
     /**
     @param columnSummaryHeaderArea Position -BOTTOM_RIGHT_CORNER. BOTTOM_LEFT_CORNER , TOP_RIGHT_CORNER, TOP_LEFT_CORNER
     **/
     function drawColumnSummaryHeader(axis) {

    	 var yaxisOpts = plot.getSeries().yaxis.options;
    	 var footerEnabled = yaxisOpts.rowFooter.enable  && yaxisOpts.rowFooter.width > 0;
    	 var columnSummary = axis.options.columnSummary, columnSummaryHeaderArea;
	  	 if(columnSummary.position == "top") {
	  		 if(yaxisOpts.position == "left" || yaxisOpts.position == "both") {
	  		    var topLeftCorner = cornerObjects.topLeftCorner;
		  		 columnSummaryHeaderArea = {
			    			 left:topLeftCorner.left,
			    			 top: plotOffset.top - columnSummary.height, // + options.grid.borderWidth,
			    			 height: columnSummary.height,
			    			 width: topLeftCorner.width,
			    			 position : "TOP_LEFT_CORNER"
			    };
		  		invokeHeaderRenderer(axis, columnSummaryHeaderArea);
	  		 }
	  		 if (yaxisOpts.position == "both" || yaxisOpts.position == "right"  || footerEnabled) {
		  			 var topRightCorner = cornerObjects.topRightCorner;
			  		 columnSummaryHeaderArea = {
				    			 left:topRightCorner.left,
				    			 top: plotOffset.top - columnSummary.height, // + options.grid.borderWidth,
				    			 height: columnSummary.height,
				    			 width: topRightCorner.width,
				    			 position : "TOP_RIGHT_CORNER"
				    };
			  	invokeHeaderRenderer(axis, columnSummaryHeaderArea);
		  	 }

	  	 } else  if(axis.options.columnSummary.position == "bottom") {
	  		if(yaxisOpts.position == "left" || yaxisOpts.position == "both" ) {
		  		 var bottomLeftCorner = cornerObjects.bottomLeftCorner;
		  		 columnSummaryHeaderArea = {
			    			 left:bottomLeftCorner.left,
			    			 top: plotOffset.top + plotHeight,
			    			 height:columnSummary.height,
			    			 width: bottomLeftCorner.width,
			    			 position : "BOTTOM_LEFT_CORNER"
		  		 };
		  		invokeHeaderRenderer(axis, columnSummaryHeaderArea);
	  		}
	  		if (yaxisOpts.position == "both" || yaxisOpts.position == "right"  || footerEnabled) {
	  			 var bottomRightCorner = cornerObjects.bottomRightCorner;
		  		 columnSummaryHeaderArea = {
			    			 left:bottomRightCorner.left,
			    			 top: plotOffset.top + plotHeight,
			    			 height: columnSummary.height,
			    			 width: bottomRightCorner.width,
			    			 position : "BOTTOM_RIGHT_CORNER"
			    };
		  		 invokeHeaderRenderer(axis, columnSummaryHeaderArea);
	  		}
	  	 }
     }

     function invokeHeaderRenderer(axis, columnSummaryHeaderArea) {
    	var summaryHeaderRenderer = axis.options.columnSummary.summaryHeaderRenderer;
 	  	if(summaryHeaderRenderer == undefined || summaryHeaderRenderer == null) {
 				//if corner Renderer is enabled, it will be displayed , other wise summary header will be displayed over it
 	  		 	if(!options.grid.cornerBox.enable && options.grid.cornerBox.cornerRendererCallbackFn == undefined){
 	  		 		//means if the corner renderer need to be rendered separately, then this area will not be drawn
 	  		 		// but will be drawn along with corner Area
 		  		 	ctx.textAlign="middle";
 		  		 	//Default coloring
 		  		 	ctx.fillStyle ="rgb(255,255,255)";
 		  		 	ctx.fillRect(columnSummaryHeaderArea.left , columnSummaryHeaderArea.top, columnSummaryHeaderArea.width, columnSummaryHeaderArea.height);
 	  		 	}
 		}
 	  	if(summaryHeaderRenderer != undefined && summaryHeaderRenderer != null) {
 	           dataToRenderer = {
 			           			drawingContext : ctx,
 			           			areaBox :columnSummaryHeaderArea,
 			           			plotWidth : plot.width(),
 			           			leftOffset :  plotOffset.left,
 			           			rightOffset :  plotOffset.right

 			     };
 			     triggerCallBackRenderer(dataToRenderer, summaryHeaderRenderer);
 		}
     }

    /**
     *
     * @param multiColumnLabelObject
     * @param cornerAreaBox
     * @param boxPosition -BOTTOM_RIGHT_CORNER. BOTTOM_LEFT_CORNER, TOP_RIGHT_CORNER, TOP_LEFT_CORNER
     */
     function drawRowGridHeaderLabels(headerColumns, borderWidth, multiColumnLabelObject, cornerAreaBox) {
    		var left = cornerAreaBox.left, top = cornerAreaBox.top, height;
    		var columnSummary =  series.xaxis.options.columnSummary;
    		 if(columnSummary != undefined && columnSummary.enable && columnSummary.summaryHeaderRenderer != undefined) {
        		height = cornerAreaBox.height - columnSummary.height + borderWidth;
    		} else {
    			height = cornerAreaBox.height;
    		 }
    		//Case :  When corner Renderer is there , to disable  writing teh header just give show : false
    		 //or   There is no  area to draw the header text
    		if(height <= borderWidth ||  !multiColumnLabelObject.header.show){
 				return;
 			}

    	 	//Firts fill the are with background Color
    	    ctx.fillStyle= multiColumnLabelObject.header.backgroundColor; //Now set color for writing text
    	    ctx.fillRect(left, cornerAreaBox.top,  cornerAreaBox.width,  height );
    	 	//set the label Margin as the sum of all column widths
  			var y = (top + height)/2, lineHeight;

  			if(multiColumnLabelObject.header.textFont != null) {
  				var f = multiColumnLabelObject.header.textFont;
  			    ctx.font = f.style + " " + f.variant + " " + f.weight + " " + f.size + "px '" + f.family + "'";
  				  textRenderer.setShouldSetFontToContext(true);
  				lineHeight = f.size;
  			}

  			ctx.textBaseline = 'middle';
  			ctx.textAlign = 'center';

  			var eachColumnWidth = 0,startX=0,  x=0, side = height/6, spaceFromBorder=8;
  			//var pixelForEachChar = ctx.measureText("W").width;
  			 var maxWidthAvailable, width;
     		for ( var i = 0; i < headerColumns.length; i++) {
     			width = headerColumns[i].width;
     			eachColumnWidth = width + borderWidth;
     			maxWidthAvailable = eachColumnWidth - spaceFromBorder;
     			headerColumns[i].height = height; //set it for use in navigate
     			if(borderWidth > 0) {
     				ctx.strokeRect(left+borderWidth/2, top + borderWidth/2 , eachColumnWidth , height );
     			}
     			//write text
     			if(headerColumns[i].sortable) {
     				startX = left + (maxWidthAvailable)/2 ;
     			} else {
     				startX = left + eachColumnWidth/2;
     			}
     			ctx.fillStyle= multiColumnLabelObject.header.textColor; //Now set color for writing text

     			if(headerColumns[i].headerText == undefined) {
     				headerColumns[i].headerText = "";
     			}
	 			var text = headerColumns[i].headerText;
	 			var wrappedLines;
	 			if(headerColumns[i].wrappedLines == undefined) { //initial case
	 				wrappedLines = plot.wrapText(ctx, text, maxWidthAvailable, lineHeight, height) ;
	 				headerColumns[i].wrappedLines = wrappedLines;
	 			} else {
	 				wrappedLines =  headerColumns[i].wrappedLines;
	 			}

                var eachLineHeight = Math.ceil(height/wrappedLines.length);
                y = top + eachLineHeight/2; //to get the center

	 			if(series.gantt.cacheHeaderTextAsImage) {
			        	textRenderer.setContext(ctx);
			        	for(var l = 0; l < wrappedLines.length ; l++) {
			        		textRenderer.fillText(wrappedLines[l], startX, y);
	                    	  y = y + eachLineHeight ;
			        	}
		        } else {
	                     for(var l = 0; l < wrappedLines.length ; l++) {
	                    	  ctx.fillText(wrappedLines[l], startX, y);
	                    	  y = y + eachLineHeight ;
	                     }
		        }
     			if(headerColumns[i].sortable) {
     				x = left + maxWidthAvailable;
     				midY = top + height/2 + 2;
     				ctx.lineWidth =1.5;
     				//DOWN ARROW
     				ctx.beginPath();
	     			ctx.moveTo(x, midY  );
	            	ctx.lineTo(x + side ,  midY ); //left to right ----->
	            	ctx.lineTo(x + side/2, midY  + side *1.73/2); // right to down  /
	            	ctx.lineTo(x, midY); //down to start posn
	            	ctx.closePath();
	            	if(headerColumns[i].mode == "DES" ) {
	            		ctx.fillStyle = multiColumnLabelObject.header.sortedArrowColor;
	            	}  else  {
	            		ctx.fillStyle = multiColumnLabelObject.header.unSortedArrowColor;
	            	}
	            	ctx.fill();
	            	//UP ARROW
	            	midY = midY - 4 ;
	            	ctx.beginPath();
	            	ctx.moveTo(x, midY); // ---
	            	ctx.lineTo(x + side ,  midY );
	            	ctx.lineTo(x + side/2,  midY - side *1.73/2); // right to top  /
	            	ctx.lineTo(x, midY); //down to start posn
	            	ctx.closePath();
	            	if(headerColumns[i].mode == "ASC" ) {
	            		ctx.fillStyle = multiColumnLabelObject.header.sortedArrowColor;
	            	} else  {
	            		ctx.fillStyle = multiColumnLabelObject.header.unSortedArrowColor;
	            	}
	            	ctx.fill();
     			}
     			left = left + eachColumnWidth;
			}     //for loop
     }

     function displayMultiGridLabelsOnAxis(axis, tick, line, x , y, offset, box) {
    	 y += line.height/2 + offset;
	     offset += line.height;
	   	 executeMultiColumnLabelRenderer(axis, box, tick, x, y);
	   	 return offset;
     }

     function drawMajorAxisLabels(axis) {
      //first calculate the individual major tickSize to postion major label
      if(axis.options.multiLineTimeHeader.majorTickFont != undefined) {
        setContextFontProperties(axis.options.multiLineTimeHeader.majorTickFont, axis.options.multiLineTimeHeader.majorTickFont.color);
      }
      var box = axis.box;

       var  eachMajorTickWidth, right, left;
       if(axis.majorTicks.length > 1) {
          right = axis.majorTicks[1].v;
          left = axis.majorTicks[0].v;
          eachMajorTickWidth = axis.p2c(right) - axis.p2c(left);
       } else {
         eachMajorTickWidth = plotWidth - plotOffset.left - plotOffset.right;
       }

       var axisEndX = axis.p2c(axis.max);
        for (var i = 0; i < axis.majorTicks.length; ++i) {
                var majorTick = axis.majorTicks[i];
                var x = 0, y = 0, offset = 0, line = null;
                 for (var k = 0; k <majorTick.lines.length; ++k) {
                     line = majorTick.lines[k];
                     //THese logic enables the display of Major Tick labels to feel like scrolling the visible parts
                     if (axis.direction == "x") {
                       var startX;
                       if(axis.majorTicks.length > 1) {
                         startX = axis.p2c(majorTick.v);
                       } else {
                         startX = -1;
                       }
                       var endX = startX + eachMajorTickWidth;
                       ctx.textAlign = "left";
                       var boundary = 0;
                         if(startX >= boundary && endX <= axisEndX) {
                           x =  plotOffset.left + axis.p2c(majorTick.v) + eachMajorTickWidth/2  - line.width/2 ;
                         } else if(startX < boundary && endX > axisEndX) {
                           x =  plotOffset.left + axisEndX/2  - line.width/2 ;

                         } else if(startX < boundary) {
                           var availableWidth = eachMajorTickWidth + startX;
                           if(availableWidth > line.width) {
                             x = plotOffset.left + availableWidth/2  - line.width/2 ;
                           } else {
                             ctx.textAlign = "right";
                             x = plotOffset.left + availableWidth;// - line.width - 1;
                           }
                         } else if(endX > axisEndX) {
                           var availableWidth = axisEndX - startX;
                           if(availableWidth > line.width) {
                             x = plotOffset.left + startX + availableWidth/2  - line.width/2 ;
                           } else {
                             x = plotOffset.left + startX + 1;
                           }
                         }
                         if (axis.position == "bottom") {
                           y = box.top + axis.heightOfMinorTickLabel + box.labelMargin  + 1 ; // box.labelMargin has labelMargin + tickLength
                           line.height = line.height + (2*axis.options.labelMargin);    // for major label display don't consider ticklength
                             offset = displayValueOnAxis(axis, majorTick, line, x , y, offset,box);

                         } else if (axis.position == "top") {
                         y =  box.top + axis.options.labelMargin;
                            offset = displayValueOnAxis(axis, majorTick, line, x , y, offset,box);

                         } else if(axis.position == "both") {
                            offset = drawMajorAxisLabelsOnBothSides(axis, majorTick, line, x, y, offset,eachMajorTickWidth );
                         }

                     }
                 }//for
             }
     }


        function drawMajorAxisLabelsOnBothSides(axis, majorTick, line, x , y, offset, eachMajorTickWidth) {

			var boxTop = axis.labelPosition.top.box;
			 //first draw axis on top
			 y = boxTop.top + axis.options.labelMargin;
			displayValueOnAxis(axis, majorTick, line, x , y, offset, boxTop);

			//Now draw axis on bottom
			var boxBottom = axis.labelPosition.bottom.box  ;

			 y = boxBottom.top + boxBottom.height - axis.heightOfMajorTickLabel - axis.options.labelMargin + 1 ; //1 for the horizontal line width
			offset = displayValueOnAxis(axis, majorTick, line, x , y, offset, boxBottom);

			return offset;
        }

        function drawAxisOnBothSides(axis, tick, line, x , y, offset) {
 			if(axis.direction =="x") {
 				var boxTop = axis.labelPosition.top.box;
 				 //first draw axis on top
 				var tickLength = 0;

 				if(axis.tickLength != "full" && axis.tickLength != null) {
 					 tickLength = axis.labelPosition.top.tickLength;
 				}
 				y =  boxTop.top + boxTop.height - axis.heightOfMinorTickLabel - boxTop.labelMargin -tickLength  ; // 1 pixel horizontal line
 				displayValueOnAxis(axis, tick, line, x , y, offset, boxTop);

 				//Now draw axis on bottom
 				var boxBottom = axis.labelPosition.bottom.box;
 	 			 y = boxBottom.top + boxBottom.labelMargin + tickLength;
 	 			offset = displayValueOnAxis(axis, tick, line, x , y, offset, boxBottom);

 			} else  if(axis.direction == "y") {
 				//Draw labels on left
 				var boxLeft = axis.labelPosition.left.box;
 				y = plotOffset.top + axis.p2c(tick.v) - tick.height/2;     //same for both sides

	 		      if(axis.options.multiColumnLabel.columns.length == 0) {
	 		    	  x = boxLeft.left + boxLeft.width - boxLeft.labelMargin - line.width;
	 		    	  displayValueOnAxis(axis, tick, line, x , y, offset, boxLeft);
	              } else { //multi grid case
	              	 x = boxLeft.left + boxLeft.width - boxLeft.labelMargin;
	              	 displayMultiGridLabelsOnAxis(axis, tick, line, x , y, offset, boxLeft);
	              }
	 		      //Draw labels on right as well
	 		       var boxRight = axis.labelPosition.right.box;
	 		       x = boxRight.left + boxRight.labelMargin;  // axis in right
	 		       if(axis.options.multiColumnLabel.columns.length == 0) {
	 		    	 offset = displayValueOnAxis(axis, tick, line, x , y, offset, boxRight);
	 		      } else {
	 		    	 offset = displayMultiGridLabelsOnAxis(axis, tick, line, x , y, offset, boxRight);
	 		      }
 		       }

 			 return offset;
 			}

        function displayValueOnAxis(axis, tick, line, x , y, offset, box) {
	    	  // account for middle aligning and line number
          y += line.height/2 + offset;
		      offset += line.height; // for tick labels spaning multiple lines
		    var areaBox, top;
		    var series = plot.getSeries();
		    var labelRendererCallbackFn = axis.options.labelRenderer;
	        if(!labelRendererCallbackFn) {
	        	if(series.gantt && series.gantt.cacheHeaderTextAsImage || series.gantt.cacheTextAsImage) {
		        	textRenderer.setContext(ctx);
		        	textRenderer.fillTextForHeader(line.text, x, y, undefined);
		        	//Added callback for separate major and minor label rendering
	        	} else if( axis.direction == "x" && axis.options.multiLineTimeHeader.enable){
	        		 var majorLabelRendererCallbackFn = axis.options.multiLineTimeHeader.majorLabelRenderer;
	        		 var minorLabelRendererCallbackFn = axis.options.multiLineTimeHeader.minorLabelRenderer;
		        	 var dataToCallBackFn ={
		      				  label: tick.label,
		           			  majorTickLabel : tick.majorTickLabel,
		           			  minorTickLabel: tick.minorTickLabel,
		           			  value :  tick.v,
		           			  xposition : x,
		           			  yposition :y,
		           			  drawingContext : ctx,
		           			  labelMargin: box.labelMargin,
		           			  majorTickLength : axis.majorTicks.length,
		           			  majorTickSize : axis.majorTickSize,
		           			  minorTickLength : axis.ticks.length,
		           			  minorTickSize : axis.tickSize
		                 	};
	                if(majorLabelRendererCallbackFn){
	                   triggerCallBackRenderer(dataToCallBackFn, majorLabelRendererCallbackFn);
	                } else {
	                  if(tick.majorTickLabel){
	                     ctx.fillText(tick.majorTickLabel, x, y);
	                  }
	                }
	                if(minorLabelRendererCallbackFn ) {
	                   triggerCallBackRenderer(dataToCallBackFn,minorLabelRendererCallbackFn);
	                } else {
	                  if(tick.minorTickLabel){
	                     ctx.fillText(tick.minorTickLabel, x, y);
	                  }
	                }
			   } else {
	        	  ctx.fillText(line.text, x, y);
	           }
	        } else if(axis.direction == "y") {
	        	 if (labelRendererCallbackFn != undefined) {
	        		 setupRowHeaderDataToRenderer(axis,tick, x, y, box);
	             }
	             if(axis.options.rowFooter.enable && axis.options.rowFooter.width > 0) {
	            	  var tickHeight =  axis.p2c(1) - axis.p2c(0);
	            	var footerWidth = axis.options.rowFooter.width;
	                  ctx.lineWidth = axis.options.rowFooter.borderWidth;
	                  top = y - (tickHeight/2);
	                  var rowId = plot.retrieveActualRowId(tick.v);
		              var rowHeaderObject = series.rowIdRowObjectMap[rowId];
	                  if(rowHeaderObject != null) {
		            	  areaBox = {
		            			  left : plotOffset.left + plotWidth,
		            			  top :  top,
		            			  height : tickHeight,
		            			  width :  footerWidth
		            	  	};
		            	  drawEachRowFooter(areaBox, tick, axis.options.rowFooter.borderColor, axis.options.rowFooter.footerRenderer, rowHeaderObject);
		            	}
	              }
	        } else if(axis.direction == "x" && labelRendererCallbackFn != undefined) {
	            	  areaBox = {
		            			  left : box.left,
		            			  top : box.top,
		            			  height : box.height,
		            			  width : box.width - box.labelMargin - options.grid.borderWidth, //labelMargin is ~ to options.grid.labelMargin
		            			  boxPosition: box.boxPosition
		            	  	};
	            	  dataToRenderer = {
	            			  label: tick.label,
	            			  majorTickLabel : tick.majorTickLabel,
	            			  minorTickLabel: tick.minorTickLabel,
	            			  value :  tick.v,
	            			  xposition : x,
	            			  yposition :y,
	            			  drawingContext : ctx,
	            			  areaBox :areaBox,
	            			  labelMargin: box.labelMargin

	            	  };
	              	triggerCallBackRenderer(dataToRenderer, labelRendererCallbackFn, isXLabelRendererAFunction);

	        }	//else no renderer
	        return offset;
         }

        /**
		**/
        function setupRowHeaderDataToRenderer(axis, tick, xposition, yposition, box) {
        	var rowIdAttribute = options.series.gantt.rowIdAttribute, selected = false;

        	//WRAP ADDITION
        	var rowId = plot.retrieveActualRowId(tick.v);
        	var rowHeaderObject = series.rowIdRowObjectMap[rowId];
        	if(!rowHeaderObject){
        		return;
        	}
        	var dataToPass = {};
        	dataToPass.x = xposition;
        	dataToPass.y = yposition;
        	dataToPass.box = box;
        	dataToPass.yValue = tick.v;
        	dataToPass.label = tick.label;

       		 //This case comes when we scroll to location where there is no data
       		 var rowHeaderId;
       		 if(series.rootTreeNode == undefined) {
				rowHeaderId = rowHeaderObject[rowIdAttribute]; //~ row ID value from <rowIdattaribute>
       		 } else { //if tree
       			 rowHeaderId = rowHeaderObject.rowId; //~ row ID value is to be taken from Node structure in case of tree
			 }
			 if(rowHighlights[rowHeaderId]) {
				selected = true;
			 }

       		 textRenderer.setContext(ctx);
       		 //Adding mode as a new atribute
       		 var mode = "NORMAL";
       		 if(selected) {
       			 mode = "SELECTION";
       		 }
       		dataToPass.mode = mode;
       		drawRowHeaderRenderer(axis, rowHeaderObject, ctx, dataToPass );


        }
        /**
         * This common function will accept the rowHeaderObject to redraw and the drawing canvas context
         * and if any dataTo be passed to teh renderer.
         * This will call the yaxis labelRenderer for drawign row headers and pass the dataToDraw for renderers.
         */
        function drawRowHeaderRenderer(axisy, rowHeaderObject, drawingContext, dataToPass ) {
   		 var tickHeight =  axisy.p2c(1) - axisy.p2c(0);
   		 var box = dataToPass.box;
   		 var yposition = dataToPass.y;
           	 var areaBox;
           	 var top =   yposition - (tickHeight/2); // normal case
           	 var labelRendererCallbackFn = axisy.options.labelRenderer;
   		 textRenderer.setContext(ctx);
   		var rowId;
  		 if(series.rootTreeNode == undefined) {
  			var rowIdAttribute = options.series.gantt.rowIdAttribute
  			rowId = rowHeaderObject[rowIdAttribute]; //~ row ID value from <rowIdattaribute>
  		 } else { //if tree
  			 //Tree will be handled in multi column renderer case
  			return;
  		 }

  		 var yValue = dataToPass.yValue;
   		 var dataToRenderer = {
              			  label: dataToPass.label,
              			  value :  yValue,
              			  xposition : dataToPass.x,
              			  yposition :dataToPass.y,
              			  textRenderer: textRenderer,
              			  labelInfo : rowHeaderObject,
              			  drawingContext : drawingContext,
              			  labelMargin: box.labelMargin,
              			  selected: rowHighlights[rowId],
              			  mode : dataToPass.mode,
              			  currentPosition: dataToPass.currentPosition // in case of hover
              	  };
              	  if (plot.areWrapRowsEnabled()) {
              		  var rowIdMaxWrapMap = plot.getRowIdDisplayWrapMap();
             		  var wrapIndexDisplayMap = plot.getWrapIndexDisplayMap(); // yValue and the wrapIndex 0 ,1..., 0,1....
              		  var wrapInfo  = { };
              		  wrapInfo.wrapIndex = wrapIndexDisplayMap[yValue];
   					  wrapInfo.wrapMode = plot.getRowIdExpandedStatusMap()[rowId] ;
   					  wrapInfo.maxWrapRowIndex = rowIdMaxWrapMap[rowId] ;
   					  dataToRenderer.wrapInfo = wrapInfo;
   		        	  if(options.series.gantt.wrappedRows.mergeWrapRows) { // to show wrap rows as merged in rowHeader
   		        		  top =   yposition - (tickHeight/2) - (wrapInfo.wrapIndex * tickHeight);
  		        		var wrapIndexChangeMap = plot.getWrapIndexChangeYValueMap();
  		        		if(top < 0) {
  		        			//For catering the part of wrap rows on top, the wrapIndexChangeMap[yValue] will be undefined in this case.
  		        			var actualYValueOfRow = series.rowYvalueMap[rowId];
  		        			var wrapYvalue = series.actualFirstWrapDisplayMap[actualYValueOfRow];
  		        			dataToRenderer.value =  wrapIndexChangeMap[wrapYvalue];
  		        		} else {
  	  		        		dataToRenderer.value = wrapIndexChangeMap[yValue];
  		        		}
  		        		var wrapRowsDisplayed = plot.getRowIdDisplayWrapMap();
   		        		  if(plot.getRowIdExpandedStatusMap()[rowId]) { // only if expanded else normal case
  		        			tickHeight = tickHeight *  wrapRowsDisplayed[rowId]; // as it si the height of merged row headers
  		        		}
  		        		wrapInfo.merged = true;

  		        		if(dataToRenderer.value  === undefined || wrapInfo.wrapIndex > 0 && top > 0) {
  		        			// the half of the first row if on top should be drawn even if wrapIndex is >0 and
  		        			//draw only the first row in case of wrap
  		        			return;
  		        		}
  		        	  }   //wrap enabled


   	        	  }
              	  areaBox = {
              			  left : box.left,
              			  top : top,
              			  height : tickHeight,
              			  width : box.width - box.labelMargin - options.grid.borderWidth //labelMargin is ~ to options.grid.labelMargin
              	  };
              	  dataToRenderer.areaBox = areaBox;		// set here after calculating tickHeight
                 triggerCallBackRenderer(dataToRenderer, labelRendererCallbackFn, isYLabelRendererAFunction);

   		}

        function drawEachRowFooter(areaBox, tick, strokeColor, rowFooterCallbackFn, rowHeaderObject) {
          	 // draw footer
        	  ctx.strokeStyle = strokeColor;
              if(rowFooterCallbackFn == null) {
            	  ctx.strokeRect(areaBox.left, areaBox.top , areaBox.width, areaBox.height);
              } else {
	              var dataToRenderer = {
	        			  value :  tick.v,
	        			  rowHeaderObject :rowHeaderObject,
	        			  drawingContext :ctx,
	        			  areaBox :areaBox

	        	  };
	          	 triggerCallBackRenderer(dataToRenderer, rowFooterCallbackFn,$.isFunction(rowFooterCallbackFn) );
              }

        }

        function applyLabelBackground(axis, box) {
         	var backgroundLabelRendererCallbackFn = axis.options.backgroundLabelRenderer;
        	if(axis.options.labelBackgroundColor != undefined || backgroundLabelRendererCallbackFn != undefined) {
        			var bw = options.grid.borderWidth, left = 0, width = 0, top = 0, height = 0;
               		var boxPosition = box.boxPosition;
                 	if(axis.direction == "x") {
	               		if(boxPosition == "XAXIS_BOX_TOP") { //drawing  xaxis top box
	               			left = box.left;
	               			top = box.top;
	               			width = box.width;
	               			height = box.height;
		               		 if(bw > 0) {
		               			 //border end points also considered for coloring
		               			left  -= bw;
		               			width += 2*bw;
		               		 }

	               		} else if(boxPosition == "XAXIS_BOX_BOTTOM") {
	               			left = box.left;
	               			top = box.top + bw;
	               			width = box.width;
	               			height = box.height;

		               		 if(bw>0) {
		               			 //border end points also considered for coloring
		               			left  -= bw;
		               			width += 2*bw;
		               		 }
	               		}
                 	} else {
                 		if(boxPosition == "YAXIS_BOX_LEFT") {
                 			left = box.left;
	               			top = box.top ;
	               			width = box.width - bw;
	               			height = box.height;
                 			 if(bw>0) {
		               			 //border end points also considered for coloring
		               			top  -= bw;
		               			height += 2*bw;
		               		 }
                 		} else 	if(boxPosition == "YAXIS_BOX_RIGHT") {

                 			left = box.left ;//- box.labelMargin + bw; //CHECK
	               			top = box.top ;
	               			width = box.width;
	               			height = box.height;
                 			 if(bw>0) {
		               			 //border end points also considered for coloring
		               			top  -= bw;
		               			height += 2*bw;
		               			left = box.left + bw;
		               		 }
                 		}

                 	}
             		if(axis.options.labelBackgroundColor != undefined) {
                   		ctx.fillStyle = (axis.options.labelBackgroundColor).toString() ;
                 		ctx.beginPath();
	                   	ctx.fillRect(left,  top,  width, height );
	                   	ctx.closePath();
             		}
	                //Trigger full label renderer as well if specified here
	                if(backgroundLabelRendererCallbackFn != undefined ||  backgroundLabelRendererCallbackFn != null) {
		                   	var dataToCallBackFn ={
		                   			drawingContext :ctx,
		                   			labelPosition : boxPosition,//XAXIS_BOX_TOP,XAXIS_BOX_BOTTOM, YAXIS_BOX_LEFT, YAXIS_BOX_RIGHT
		                   			left : left, //in pixels
		                   			top : top,
		                   			width :width,
		                   			height:height,
		                   			majorTickHeight : axis.totalHeightOfMajorTickLabel,
		                   			minorTickHeight : axis.totalHeightOfMinorTickLabel
		                   	}
		                 triggerCallBackRenderer(dataToCallBackFn, backgroundLabelRendererCallbackFn);
	                 }

                 }
        	}
        	/**
        	 * @fontObject is of the form {
        	 * 	font: { size: 15,  weight: "normal", family: 'Tahoma', style : "italic", variant: "normal"  } //mandatory
        	 *     Important: Don't use quotes around axis.font.family! Just around single
		          font names like 'Times New Roman' that have a space or special character in it.
        	 *  @fillStyle is the color of the text to be rendered usin this font // mandatory
        	 *  @forcedFontSize : if present will be taken as the fontSize instead of the size in fontObject. is Optional
        	 */
        	function setContextFontProperties(fontObject, fillStyle, forcedFontSize) {
        		 var  f = fontObject;
		    	  ctx.fillStyle = fillStyle;
		    	  if(forcedFontSize != undefined) {
		    		  f.size = forcedFontSize;
		    	  }

		          //Note renderer will set it to contxet
		          ctx.textAlign = "start";
		          // middle align the labels - top would be more natural, but browsers can differ a pixel or two in
		          // where they consider the top to be, so instead we middle align to minimize variation between browsers
		          // and compensate when calculating the coordinates
		          ctx.textBaseline = "middle";

			          if(f.style == undefined) {
		                    f.style = "";
		              }
		              if(f.variant == undefined) {
		                    f.variant = "";
		              }
		              if(f.weight == undefined) {
		                    f.weight = "";
		              }
		        	  textRenderer.setFont(f);
		              ctx.font = f.style + " " + f.variant + " " + f.weight + " " + f.size + "px '" + f.family + "'";
        	}

        function setupCornerObjects() {
        	var bw = options.grid.borderWidth ,  fbw = options.series.gantt.fullBorderWidth;
          	//These settings are common to alla headers
          	var leftCorner = 0.5, topCorner = 0.5;
          	 if(options.series.gantt.fullBorderWidth > 0) {
          		leftCorner = options.series.gantt.fullBorderWidth;
          		topCorner = options.series.gantt.fullBorderWidth;
          	}
          	var topLeftCorner =  {
          			left : leftCorner,
          			top: topCorner,
          			width: plotOffset.left -bw - fbw,
          			height :plotOffset.top -bw -fbw //plotOffset.top includes border width inner also
          	};

          	var bottomLeftCorner =  {
          			left : leftCorner,
          			top : plotOffset.top + plotHeight + bw , // this bw is bottom line border
          			width: plotOffset.left -bw - fbw,
          			height :plotOffset.bottom -bw - fbw
          	};

          	var topRightCorner =  {
          			left : plotOffset.left + plotWidth + bw,
          			top:topCorner,
          			width: (plotOffset.right -2*bw - fbw),
          			height :(plotOffset.top -bw - fbw)
          	};

          	var bottomRightCorner =  {
          			left : plotOffset.left + plotWidth + bw, // this bw is the right side border line
          			top : plotOffset.top + plotHeight + bw -topCorner ,
          			width: plotOffset.right -2*bw - fbw,
          			height :plotOffset.bottom - bw- fbw
          	};
          	//Setting this to plot varibale to check the hovered place
          	cornerObjects = {
          			topLeftCorner:topLeftCorner,
          			bottomLeftCorner:bottomLeftCorner,
          			topRightCorner:topRightCorner,
          			bottomRightCorner:bottomRightCorner
          	};
          }

        //Draw corner boxes and images in it if any
        function drawCornerBoxes (drawingCanvas, context) {
        	context.strokeStyle = options.grid.cornerBox.borderColor;//"#000000";
        	context.fillStyle = options.grid.cornerBox.fillColor;//"#FFFFFF";
        	context.lineWidth = options.grid.cornerBox.lineWidth;
        	cornerObjects = plot.getCornerObjects();

        	if(cornerObjects == null) {
        		return;
        	}
        	var topLeftCorner = cornerObjects.topLeftCorner;
        	var borderWidth = options.series.gantt.fullBorderWidth;
        	var fbw = options.series.gantt.fullBorderWidth;
        	if(topLeftCorner != null && topLeftCorner.height > fbw && topLeftCorner.width > 0) {
           	    drawCornerImageAndText(topLeftCorner, "TOP_LEFT_CORNER", drawingCanvas, context);
        	}
        	var topRightCorner = cornerObjects.topRightCorner;
        	if(topRightCorner !=null && topRightCorner.height > fbw && topLeftCorner.width > 0) {
        		drawCornerImageAndText(topRightCorner, "TOP_RIGHT_CORNER", drawingCanvas, context);
        	}
        	var bottomLeftCorner = cornerObjects.bottomLeftCorner;
        	if(bottomLeftCorner != null && bottomLeftCorner.height > fbw && topLeftCorner.width > 0) {
        		drawCornerImageAndText(bottomLeftCorner, "BOTTOM_LEFT_CORNER", drawingCanvas, context);
        	}

        	var bottomRightCorner = cornerObjects.bottomRightCorner;
        	if(bottomRightCorner !=null && bottomRightCorner.height > fbw && topLeftCorner.width > 0) {
        		//draw Corner image and text if  image path is mentioned
        		drawCornerImageAndText(bottomRightCorner, "BOTTOM_RIGHT_CORNER", drawingCanvas, context);
        	}
	   }

	   function drawCornerImageAndText(cornerCoordinates, position, drawingCanvas, context) {

		   	   var columnSummary = plot.getSeries().xaxis.options.columnSummary;
			   if(columnSummary.enable && (columnSummary.summaryHeaderRenderer != undefined
					   || columnSummary.summaryHeaderRenderer != null)) {
				   //If Column Summary comes  at  top
				   if(columnSummary.position == "top") {
					   if(position  == "TOP_LEFT_CORNER" || 	position == "TOP_RIGHT_CORNER") {
						   cornerCoordinates.height = plotOffset.top - columnSummary.height;
					   }
				   } else if(columnSummary.position == "bottom") { //If Column Summary comes  at bottom
					   if(position  == "BOTTOM_LEFT_CORNER"  || position == "BOTTOM_RIGHT_CORNER") {
						   cornerCoordinates.top =  plotOffset.top  + plotHeight + columnSummary.height;
						   cornerCoordinates.height = plotOffset.bottom - columnSummary.height;
					   }
				   }
			   }
			   var fbw = options.series.gantt.fullBorderWidth;
			   if(cornerCoordinates.height <= fbw) { // after recalculation of height in case of column summary
				   return;
			   }
		       	if(options.grid.cornerBox.cornerRendererCallbackFn != null) {
		       		var dataToCallBackFn = {
		       				drawingContext: context,
		       				position : position, //will be any one of TOP_LEFT_CORNER,TOP_RIGHT_CORNER, BOTTOM_RIGHT_CORNER, BOTTOM_LEFT_CORNER
		       				cornerCoordinates: cornerCoordinates,
		       				drawingCanvas :drawingCanvas
		       		};
		       		triggerCallBackRenderer(dataToCallBackFn, options.grid.cornerBox.cornerRendererCallbackFn, isCornerRendererAFunction);

		       	} else if(options.grid.cornerBox.cornerRendererCallbackFn == undefined && drawingCanvas == "BASE") {

        			context.strokeRect(cornerCoordinates.left , cornerCoordinates.top,  cornerCoordinates.width, cornerCoordinates.height );
        			context.fillRect(cornerCoordinates.left , cornerCoordinates.top,  cornerCoordinates.width, cornerCoordinates.height );
        			//If there is any default image
        			var imageOption = options.grid.cornerBox.image;
    		       	if(imageOption.path != null ) { // always draw the image only in base
    		       		var image = new Image();
    		       		image.src = imageOption.path;
    		       		context.drawImage(image,  cornerCoordinates.left , cornerCoordinates.top, imageOption.width, imageOption.height);
    		       	}
        		}
	       }

	        /*
	         * This function clips the labels on scrolling to the top left , top-right, bottom-left and bottom-right positions
	         */
	        function clipLabelsOnScrolling(axis, box) {
	        	 //Note : Clipping the top most corner to prevent labels overlapping
	        	if(options.grid.backgroundColor == null) {
	        		options.grid.backgroundColor = "#ffffff";
	        	}
	        	ctx.strokeStyle="#000000";
	        	var bw = options.grid.borderWidth;
	        	if(axis.direction == "x" && (options.yaxis.position =="left" || options.yaxis.position =="both")) {
	        		ctx.strokeRect(0 , box.top,  axis.labelWidth + box.labelMargin - bw, box.height );
	        		ctx.fillRect(0, box.top,  axis.labelWidth + box.labelMargin - bw, box.height);
	        	} else if (axis.direction == "y" && (options.yaxis.position =="right" || options.yaxis.position == "both")) {
	        		ctx.strokeRect(box.left , 0,  axis.labelWidth + box.labelMargin , box.top );
	        		ctx.fillRect(box.left, 0,  axis.labelWidth + box.labelMargin , box.top);
	        	}
	        	ctx.closePath();
	        }

	     function reduceActualPlotBorderSpaceIfAny(box){
	    	 var bw = options.grid.borderWidth;
	    	 if(bw > 0) {
	    		 return  {
		    		left: box.left -bw,
		    		right:box.right-bw,
		    		top :box.top -bw,
		    		bottom: box.top -bw
		    	 };
	    	 } else {
	    		 return box;
	    	 }
	     }

        /**
         * Note :  box.left. right , top and bootom has considered the    bw = options.grid.borderWidth. So to fill the space
         * reduce those actual plot margins
         * @param axis
         * @param box
         * @param tick
         * @param x
         * @param y
         */


        function executeMultiColumnLabelRenderer(axis, box, tick, x, y) {
        	series = plot.getSeries();
        	var headerGridColums = axis.options.multiColumnLabel.columns;
        	var eachHeaderColumn, tickHeight, areaBox,  rowIdAttribute, dataToRenderer, rowHeaderId;
        	var rowHeaderNode = null, rowHeaderObject = null, rowHeader; // if header is of Tree structure

        	tickHeight =  axis.p2c(1) - axis.p2c(0);
        	rowIdAttribute = options.series.gantt.rowIdAttribute;
           	//get the corresponding rowHEader Object using yValue from rowHeaderMap
        	//WRAP ADDITIONS
        	 var yValue = tick.v;
        	var rowId = plot.retrieveActualRowId(yValue);
        	 //this map will have hidden rows as well
        	rowHeader = series.rowIdRowObjectMap[rowId];  // if tree it is the node
    	 	if(rowHeader == undefined) {
           		 return;
           	} else if(series.rootTreeNode != undefined &&  rowHeader.nodeLevel != undefined ) { //if Tree structure
           		rowHeaderNode = rowHeader;
           		if(rowHeader.data != null) {
           			rowHeaderObject = rowHeaderNode.data;
           			//set the rowId properly to rowHeaderObject as well.data might not have the rowId for selection purpose
           			rowHeaderObject.rowId = rowHeaderNode.rowId;
           		}
           	 } else  { // for normal row header
           		rowHeaderObject  = rowHeader;
           	}

        	var left = box.left , columnWidth = 0, borderWidth = 0;
        	var top = y - (tickHeight/2) + borderWidth/2;
         	var borderObject  = axis.options.multiColumnLabel.border;
           	if(borderObject != undefined && borderObject.width >0) {
           		borderWidth = borderObject.width; //default 1
           		ctx.lineWidth = borderWidth; //default 1
           	}  else {
           		borderWidth = 0;
           	}
           	if(axis.options.treeNode.nodeLimit != undefined && rowHeaderNode !=null && rowHeaderNode.nodeLevel <= axis.options.treeNode.nodeLimit) {
           			initiateTreeHeaderRenderer(axis.options.treeNode, rowHeaderNode, ctx, left, top, tickHeight, borderObject, axis.options.multiColumnLabel.header);
           		  //Drawing footer for treeNode
               	   if(axis.options.treeNode.footer != undefined && axis.options.treeNode.footer.enable &&
               			   axis.options.treeNode.footer.renderer != undefined ) {

               		 ctx.beginPath();
                 	 var footerWidth = axis.options.treeNode.footer.width;
                     ctx.lineWidth = axis.options.treeNode.footer.borderWidth;
       	            	  areaBox = {
       	            			  left : canvasWidth - footerWidth, // if tree header rowfooter alone is enabled, plotOffset won't be changed
       	            			  top :  top,
       	            			  height : tickHeight,
       	            			  width :  footerWidth
       	            	  	};
       	            drawEachRowFooter(areaBox, tick, axis.options.treeNode.footer.borderColor, axis.options.treeNode.footer.renderer, rowHeaderNode);
       	            ctx.closePath();
                    }
           			return;
           	}
           	if(rowHeaderObject != undefined) {
           		if(series.rootTreeNode == undefined) {
					rowHeaderId = rowHeaderObject[rowIdAttribute]; //~ row ID value from <rowIdattaribute>
				} else {
					//if tree
					rowHeaderId = rowHeaderObject.rowId; //~ row ID value is to be taken from Node structure in case of tree
				}
           	}

           //Normal case left . Set it initially
           	var  startX = 0;
           	for ( var col = 0; col < headerGridColums.length; col++) {
           		eachHeaderColumn = headerGridColums[col];
           		columnIndexCoordinateMap[col] = {
           	    		startX : startX,
           	    		width : eachHeaderColumn.width
           	    };
           		startX = startX + eachHeaderColumn.width;
           	}
        	var bleft = left;
        	var currentNode, colHeight, objectPassed, defaultLabel;
        	var value = yValue;
        	for ( var colIndex = 0; colIndex < headerGridColums.length; colIndex++) {
        		eachHeaderColumn = headerGridColums[colIndex];
        		//overriding border if specifically present in each columns
        		if(eachHeaderColumn.border != undefined && eachHeaderColumn.border.width >0) {
        			borderObject = eachHeaderColumn.border;
        			borderWidth = borderObject.width;
        		}
       		 	var nodeLevel =  eachHeaderColumn.nodeLevel;
       		 	var property = eachHeaderColumn.cellProperty;
       		 	currentNode = retrieveNodeForAttribute(property, rowHeaderNode, nodeLevel);
       		 	if(nodeLevel == undefined && rowHeaderObject != null) { //when nodelevel is not given or is a leafNode
       		 		defaultLabel = rowHeaderObject[property];
       		 		colHeight = tickHeight;
       		 		objectPassed = rowHeaderObject;
       		 	}
       		     else if(currentRowNodeHeightMap[colIndex] <yValue ) { //merging the previous column - parent of leaf rows
       		 	 //property = eachHeaderColumn.cellProperty; //eg:  property = 'buildingName'
           		 if(currentNode != undefined) {
	            		 rowHeaderObject = currentNode.data;
		        		 defaultLabel = rowHeaderObject[property];

		        		 if (plot.areWrapRowsEnabled()) {
			        		 var wrapIndexDisplayMap = plot.getWrapIndexDisplayMap();
			        		 var wrapIndex = wrapIndexDisplayMap[yValue];
			        		 var rowIdMaxWrapMap = plot.getRowIdMaxWrapMap();
			        		 currentNode.wrapInfo =  {
				        		  wrapIndex :wrapIndex,
			 	   				  wrapMode : plot.getRowIdExpandedStatusMap()[rowId],
			 	   				  maxWrapRowIndex :   rowIdMaxWrapMap[rowId]
			        		 };
			        		 if(options.series.gantt.wrappedRows.mergeWrapRows && currentNode.isLeafNode) { // if  merged
			        			 colHeight = tickHeight * currentNode.wrappedFamilyCount;
			        			 currentRowNodeHeightMap[colIndex] =  currentNode.startRowIndex + currentNode.wrappedFamilyCount - 1;
			        			 top =  y - (tickHeight/2) + borderWidth/2 - (yValue - currentNode.startRowIndex) * tickHeight ;

			    				 // for alternate colouring of merged leaf header nodes as the rows .. sameColorForMergedHeaders.
			        			 // the value will be passed accordingly so
			    				 var wrapIndexChangeMap = plot.getWrapIndexChangeYValueMap();
			 	        		if(top < 0) {
			 	        			//For catering the part of wrap rows on top, the wrapIndexChangeMap[yValue] will be undefined in this case.
			 	        			var actualYValueOfRow = series.rowYvalueMap[rowHeaderId];
			 	        			var wrapYvalue = series.actualFirstWrapDisplayMap[actualYValueOfRow];
			 	        			 value =  wrapIndexChangeMap[wrapYvalue];
			        		 } else {
			  		        		 value = wrapIndexChangeMap[yValue];
			 	        		}
			 	        		//console.log("value ------------", value, "wrapIndex ", wrapIndex , " top ", top);
			 	        		if( value  === undefined) {
		 		        			// the half of the first row if on top should be drawn even if wrapIndex is >0 and
		 		        			//draw only the first row in case of wrap, set the value to 0
			 	        			 value = 0;
			 		        	}


			        		 } else {
			        			 if(currentNode.isLeafNode) {
			        				 colHeight = tickHeight*currentNode.familyCount;
			        				 currentRowNodeHeightMap[colIndex] =  currentNode.startRowIndex + currentNode.familyCount - 1;
			        			 } else{
			        				 colHeight = tickHeight*currentNode.wrappedFamilyCount;
			        				currentRowNodeHeightMap[colIndex] =  currentNode.startRowIndex + currentNode.wrappedFamilyCount - 1;
			        			 }
			        			 top = (y - (tickHeight/2) + borderWidth/2 - (yValue - currentNode.startRowIndex) * tickHeight)
			        			 						+ (wrapIndex * tickHeight); // adding wrapIndex with tickHeight to get each Top
			        		 }
		        		 } else {// NO WRAP
		        			 currentRowNodeHeightMap[colIndex] =  currentNode.startRowIndex + currentNode.familyCount - 1;
		        			 colHeight = tickHeight*currentNode.familyCount;
				        	 top =  y - (tickHeight/2) + borderWidth/2 - (yValue - currentNode.startRowIndex) * tickHeight ;
		        		 }
		        		 //Adding selection highlights to rowHeaders according to child Nodes that are selected.
		        		 //selection of merged headers by checking the selection of chilNodes
		           		 if(!currentNode.isLeafNode) {
		           			// if all child nodes are true, highlight the parent
		           			currentNode.selected = isAllChildNodesHighlighted(currentNode);
		           		 } else {
		           			currentNode.selected =  rowHighlights[rowHeaderId]; // is leaf node
		           		 }

		        		 objectPassed = currentNode;
            		 } else {
            			 continue;
            		 }
	        	}  else  {
        			//increment x and set new  left
        			columnWidth = eachHeaderColumn.width;
			        left = left + borderWidth + columnWidth;
			        x = left;
			        bleft = left;
        			continue;
	        	}
       		 	if(defaultLabel == undefined) {
		    		 defaultLabel= "";
		  		}
	    		columnWidth = eachHeaderColumn.width;
        		var cellRendererCallbackFn = eachHeaderColumn.cellRenderer;

        		 if(borderObject != undefined && borderObject.width > 0) {
	    			 //vertical lines
	    			 ctx.strokeStyle = borderObject.color;
	    			 if(colIndex == 0) { //first column vertical line b/w is enough
	    				 ctx.lineWidth = borderWidth/2;
	    				 bleft = bleft + borderWidth/4;
	    			 } else {
	    				 ctx.lineWidth = borderWidth;
	    				 bleft = bleft + borderWidth/2;
	    			 }
	        		 //vertical stroke
	        		 ctx.beginPath();
	        		 ctx.moveTo(bleft, top);
	         		 ctx.lineTo(bleft, top + colHeight);
	         		 ctx.stroke();
	         		 ctx.closePath();

	         		//for horizontal stroke of all cells
	         		ctx.lineWidth = borderWidth/2; //for all headers horizontal line shd be same width
	         		ctx.beginPath();
	         		ctx.moveTo((left + borderWidth/2), top + borderWidth/2);
	         		ctx.lineTo((left + columnWidth - borderWidth/2), top + borderWidth/2);
	         		ctx.stroke();
	         		ctx.closePath();
		        }
        		areaBox = getAreaBoxForEachColumn(left, top, columnWidth - borderWidth, colHeight, borderWidth);

        		x = left + borderWidth + 1 ;	// a pixel next to start of column
        		if(cellRendererCallbackFn == undefined || cellRendererCallbackFn == null) {
        			//Draw labels on left
 		        	ctx.fillText(defaultLabel,  x, top + tickHeight/2);
        		} else {
        			var mode = "NORMAL";
        			if(objectPassed.selected) {
        				mode = "SELECTION";
        			}
 		           dataToRenderer = {
				           			  label: defaultLabel,
				           			  value :  value,
				           			  labelInfo : objectPassed,
				           			  drawingContext : ctx,
				           			  areaBox :areaBox,
				           			  labelMargin: box.labelMargin,
				           			  selected:objectPassed.selected,
				           			  mode : mode
				     };
				     triggerCallBackRenderer(dataToRenderer, cellRendererCallbackFn);
        		 }

		        //increment x and set new  left
		        left = left + borderWidth + columnWidth;
		        x = left;
		        bleft = left;

	        } //for
            if(axis.options.rowFooter.enable  && axis.options.rowFooter.width > 0) {
          	    var footerWidth = axis.options.rowFooter.width;
                ctx.lineWidth = axis.options.rowFooter.borderWidth;
                if(rowHeaderObject != null) {
	            	  var areaBox = {
	            			  left : plotOffset.left + plotWidth,
	            			  top :  top,
	            			  height : tickHeight,
	            			  width :  footerWidth
	            	  	};
	            	  drawEachRowFooter(areaBox, tick, axis.options.rowFooter.borderColor, axis.options.rowFooter.footerRenderer, rowHeaderObject);
                }
            }
        } //function


        function initiateTreeHeaderRenderer(treeNode, rowHeaderNode, ctx, left, top, tickHeight, borderObject, headerObject) {
        	var nodeRendererCallbackFn = treeNode.nodeRenderer;
        	var defaultLabel =  rowHeaderNode.data ;
        	var borderWidth = 0,
        		width = canvasWidth - borderWidth - 2*options.series.gantt.fullBorderWidth; //default will span the entire header row
        	if(borderObject.width > 0) {
        		borderWidth = borderObject.width;
        	}
        	if(treeNode.displayData){
        		width = plot.getPlotOffset().left - borderWidth - 2*options.series.gantt.fullBorderWidth;
        	}

        	var areaBox = getAreaBoxForEachColumn(left, top, width, tickHeight, borderWidth);
        	 ctx.textAlign = 'left';

        	if(!nodeRendererCallbackFn) {
	        		ctx.fillStyle = headerObject.backgroundColor;
	            	ctx.fillRect(left, top, canvasWidth-borderWidth, tickHeight);
	            	if(borderWidth >0) {
	            		ctx.strokeStyle = borderObject.color;
	            		ctx.strokeRect(left, top, canvasWidth-borderWidth, tickHeight);
	            	}

	        		if(rowHeaderNode.nodeLevel != 1) {
	       				left = left + (rowHeaderNode.nodeLevel - 1)*tickHeight; // From Second level writings alone start a space after
	       			}
	        		var f = headerObject.textFont;
	        		if(f != null) {
	        			ctx.font = f.style + " " + f.variant + " " + f.weight + " " + f.size + "px '" + f.family + "'";
	        		}
        			ctx.fillStyle = headerObject.textColor;
        			var side = tickHeight/4;
        			left = left + 5; //drawing triangle
		        	ctx.fillText(defaultLabel,  left + tickHeight  , top + tickHeight/2);
		        	//define the colour of the line
		        	ctx.strokeStyle = "red";
		        	ctx.beginPath();
		        	if(rowHeaderNode.isExpanded) {
			        	//define the starting point of line1 (x1,y1)
			        	ctx.moveTo(left - 2, top + tickHeight/4 );
			        	ctx.lineTo(left + side + 2 ,  top + tickHeight/4); //top to bottom
			        	ctx.lineTo(left + side/2, top + tickHeight*5/8 - 2); // lottom to left
			        	//define the end point of line3 (x1,y1). We are back to where we started
			        	ctx.lineTo(left - 2, top + tickHeight/4);
			        	//draw the points that makeup the triangle - (x1,y1) to (x2,y2), (x2,y2) to (x3,y3),  and (x3,y3) to (x1,y1)
		        	} else {
		        		ctx.moveTo(left, top + tickHeight/4 - 2);
		            	ctx.lineTo(left + tickHeight*3/8 ,  top + tickHeight*3/8); //top to bottom
		            	ctx.lineTo(left, top + tickHeight/2 + 2); // bottom to left
			        	//define the end point of line3 (x1,y1). We are back to where we started
			        	ctx.lineTo(left, top + tickHeight/4 - 2);
		        	}
		        	ctx.stroke();
		        	ctx.fill();

    		} else {

		           dataToRenderer = {
			           			  label: defaultLabel,
			           			  labelInfo : rowHeaderNode,
			           			  drawingContext : ctx,
			           			  areaBox :areaBox
		           };
			     triggerCallBackRenderer(dataToRenderer, nodeRendererCallbackFn);
    		 }
        }

        /**
         * draws border for each column Cell and returs that area
         */
        function getAreaBoxForEachColumn(left, top, columnWidth, tickHeight, borderWidth) {
        	 return areaBox = {
      			  left : left + borderWidth, //includes bw also
      			  top : top + borderWidth/2,
      			  width : columnWidth,
      			  height : tickHeight - borderWidth
	        };
        }
        /**
         *
         */
        var nodeWithProperty = null;
        function retrieveNodeForAttribute(attribute , currentNode, nodeLevel) {
        	if(currentNode != null) {
	        	nodeWithProperty = getNodeWithProperty(attribute, currentNode, nodeLevel);
	        	if(nodeWithProperty != null) {
	        			return nodeWithProperty;
	        	}
	        	if(currentNode.parentNode != null ) {
	        		retrieveNodeForAttribute(attribute , currentNode.parentNode, nodeLevel);
	        		if(nodeWithProperty != null) {
	        			return nodeWithProperty;
	        		}
	        	}
        	}
        	return null;
        }
        /**
			function to check if all child nodes of the given node
			is highlighted or not.This will be done recursively
			for all the childnodes under it.
		**/
        function isAllChildNodesHighlighted(currentNode) {
        	if(currentNode && currentNode.childNodes) {
        		var childNodes = currentNode.childNodes;
        		var isChildNodesHighlighted =  true;
    			for ( var i = 0; i < childNodes.length; i++) {
    				if(childNodes[i].isLeafNode) {
    					if( !isRowHighlighted(childNodes[i].rowId)){
    						isChildNodesHighlighted = false;
    						break;
    					}
    				} else {
    					isChildNodesHighlighted = isAllChildNodesHighlighted(childNodes[i]);
    				}

    			}
        	}
        	return isChildNodesHighlighted;

        }

        /**
         * returns null if node doesn't have the property in that nodeLevel
         * else will return the node with that property.
         */

        function getNodeWithProperty(property, node, nodeLevel) {

        	var nodeWithProperty = null;
        	if(node.data != null) {
        		var objectData = node.data;
        		if(objectData != null && objectData[property] != null && node.nodeLevel == nodeLevel) {
        				nodeWithProperty =  node;
        			}
        		}
        	return nodeWithProperty;
        }



        function extractRange(ranges, coord) {
            var axis=0, from = 0, to=0, key=0, axes = allAxes();

            for (var i = 0; i < axes.length; ++i) {
                axis = axes[i];
                if (axis.direction == coord) {
                    key = coord + axis.n + "axis";
                    if (!ranges[key] && axis.n == 1)
                        key = coord + "axis"; // support x1axis as xaxis
                    if (ranges[key]) {
                        from = ranges[key].from;
                        to = ranges[key].to;
                        break;
                    }
                }
            }

            // backwards-compat stuff - to be removed in future
            if (!ranges[key]) {
                axis = coord == "x" ? xaxes[0] : yaxes[0];
                from = ranges[coord + "1"];
                to = ranges[coord + "2"];
            }

            // auto-reverse as an added bonus
            if (from != null && to != null && from > to) {
                var tmp = from;
                from = to;
                to = tmp;
            }

            return { from: from, to: to, axis: axis };
        }

        function drawGrid() {
             ctx.save();
     		 ctx.translate(plotOffset.left, plotOffset.top);

            //FOR ALL LAYERS
        	for (eachLayerName in canvasLayerMap) {
        		if(eachLayerName == mainLayerName) {
        			continue;
        		}
        		canvasLayerMap[eachLayerName].context.save();
        		canvasLayerMap[eachLayerName].context.translate(plotOffset.left, plotOffset.top);
        	}

        	var markingsOnTop = options.grid.markings.drawOnTop; // not on top
        	if(!markingsOnTop) { // draw markings before the default markings
        		 drawMarkings();
        	}
            //defaultMarkings by the FW
            var defaultMarkings = options.yaxis.defaultMarkings;

            if(defaultMarkings.enable) { // only for Y axis - drawing AlternateRowColor
            	drawDefaultMarkingsOnYaxis();
            }
            // draw markings other than default markings
            if(markingsOnTop) {
       		 	drawMarkings();
            }
           //Full weekend coloring including header and grid
        	if (options.xaxis.colorDays.enable && !options.xaxis.colorDays.headerOnly) {
        		 drawMarkings(plot.coloringFunction(options.xaxis.colorDays), false, true)//full length weekend area marking
        	}
            // Modified for ISRM-8231
            // draw all the ticks
        	if(!options.xaxis.multiLineTimeHeader.enable || options.xaxis.multiLineTimeHeader.majorTickStyle.tickRenderer == undefined){
            drawAllTicks();
        	}

            ctx.restore();
            //FOR ALL LAYERS
        	for (eachLayerName in canvasLayerMap) {
        		if(eachLayerName == mainLayerName) {
        			continue;
        		}
        		canvasLayerMap[eachLayerName].context.restore();
        	}
        }


        function drawGridBorder() {
        	ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
        	 // draw border
            var bw = options.grid.borderWidth;
            if (bw >0) {
                ctx.lineWidth = bw;
                if(options.grid.borderColor != undefined) {
                	ctx.strokeStyle = (options.grid.borderColor).toString();
                }
                ctx.strokeRect(-bw, -bw , plotWidth + 2*bw, plotHeight +2*bw);
            }
            ctx.restore();

        }

        function drawFullBackGround() {
            ctx.fillStyle = getColorOrGradient(options.series.gantt.fullBackgroundColor, canvasHeight, 0, "rgba(255, 255, 255, 0)", ctx, plotOffset.left);
            ctx.fillRect(0, 0 , canvasWidth, canvasHeight);
        }

        function drawBackground() {
            ctx.save();
            var bw = options.grid.borderWidth;
            ctx.translate(plotOffset.left-bw/2, plotOffset.top-bw/2);
            ctx.fillStyle = getColorOrGradient(options.grid.backgroundColor, plotHeight + bw, 0, "rgba(255, 255, 255, 0)", ctx, plotOffset.left-bw/2);
            ctx.fillRect(0, 0 , plotWidth+bw, plotHeight+bw);
            ctx.restore();
        }

        function drawAllTicks() {
        	  var axes = allAxes();
              for (var j = 0; j < axes.length; ++j) {
                  var axis = axes[j];
                  if (!axis.show || axis.ticks.length == 0 && axis.ticks.length == 0) {
                		continue;
                  }

                  if(axis.options.mode =="time" && axis.options.subTick.enable) { //drawSubTickFirst
                    	// draw normal ticks  for both x and y axis
                     drawTicks(axis, axis.subTicks, "SUBTICK", null);
                  }
                  if((axis.direction == "x" && !axis.options.multiLineTimeHeader.enable) || axis.direction == "y") {
                  	// draw normal ticks  for both x and y axis
                     drawTicks(axis, axis.ticks, "DEFAULT_NORMAL", null);
                  }

                  if(axis.direction == "x" && axis.options.multiLineTimeHeader.enable) { //if multiline , draw major ticks  and header format lines
                  	 drawTicks(axis, axis.ticks, "MINOR", axis.options.multiLineTimeHeader);   //draw minor ticks
                  	 drawTicks(axis, axis.majorTicks, "MAJOR", axis.options.multiLineTimeHeader); //drawing major ticks
                  	 if(axis.showLabel) {
                  		 drawHeaderHorizontalLines(axis) ; // horizontal line below major tick labels in both direction
                  	 }
                  }

              }
        }

        /**
         * drawing AlternateRowColor
         */
        function drawDefaultMarkingsOnYaxis() {
        	var axes = plot.getAxes();
        	 var axis = axes.yaxis;
        	 var series  = plot.getSeries();
        	 var defaultMarkings = options.yaxis.defaultMarkings;
        	 ctx.lineWidth = defaultMarkings.lineWidth;
        	 ctx.strokeStyle = defaultMarkings.lineColor;

        	var  xoff = yoff = 0, y, rowColor,
          		//box = axis.box,
          		tickSize = options.yaxis.tickSize;

          	var xrange={}, yrange={};
	        if(axis == undefined) {
	        	   return;
	        }
	        var rowCountToColor = 0;
	        var rowColoringFor = defaultMarkings.rowColoringFor;
	        if(rowColoringFor  == "full") {
	        	rowCountToColor = axis.ticks.length;
	        } else { //diplsyed Rows by default
	        	   //Draw alternate Colours only for row with row headers ..ie only for actual data rows.leave rest empty
		           rowCountToColor = axis.ticks.length;
		        if(series.displayedRowIds.length < axis.ticks.length) {// when data is less when compared to max rows
		        	rowCountToColor = series.displayedRowIds.length + 1;
		        }
	        }
	        var maxCanvasCoordinates = axis.p2c(axis.max);
	        var value = 0 ;
        	 for (var i = 0; i < rowCountToColor; ) {
        		 if(axis.ticks[i] == null) {
        			 i = i + tickSize;
        			 continue;
        		 }
                 var tickValue = axis.ticks[i].v;
                 var halfAboveTickValue = tickValue - (tickSize/2);
                 if(halfAboveTickValue < axis.min){ //clip initially
                	 halfAboveTickValue = axis.min;
                 }
                 // clip
                 //Note   if the top half portion should be colored even if the start position is not in canvas
                 //So when value == min the drawing should be done
                 if(halfAboveTickValue < axis.min || halfAboveTickValue >= axis.max) {
                	 i = i + tickSize; // increment the lines with tickSize and don't draw the line
                	 continue;
                 }
                 y = axis.p2c(halfAboveTickValue);
                 if(axis.position != undefined && axis.position != "both" ) {
                	 if (axis.position == "left" || axis.position == "right") {
						 xoff = plotWidth;
					}
                 } else {
                	  //if both
                	 xoff = plotWidth;
                 }
                 xrange.from = 0; //Check inverse transform case as well
                 xrange.to = xoff;
                 yrange.from = y;
                 yrange.to = y ;
                 var height = axis.p2c(2) - axis.p2c(1);
                 // to show wrap rows color same for all rows with merged  rowHeader
                 if(defaultMarkings.alternateRowColor && options.series.gantt.wrappedRows.mergeWrapRows &&
                	  defaultMarkings.sameColorForMergedRows) {
  		        		var wrapIndexChangeMap = plot.getWrapIndexChangeYValueMap();
  	              		var displayedRowYvalue = series.displayedRowIds[tickValue];
  		        		var rowId = series.actualFilterRowIds[displayedRowYvalue];
  	              		var expandedStatus = plot.getRowIdExpandedStatusMap()[rowId] ;
  	              		var wrapYvalue;
	              		var actualYValueOfRow;
  		        		if (yrange.from < 0 ) {
  		        			//For catering the part of wrap rows on top, the wrapIndexChangeMap[yValue] will be undefined in this case.
  		        			actualYValueOfRow = series.rowYvalueMap[rowId];
  		        			wrapYvalue = series.actualFirstWrapDisplayMap ? series.actualFirstWrapDisplayMap[actualYValueOfRow]: undefined;
  		        			value =  wrapIndexChangeMap[wrapYvalue];
  		        			if(value == undefined) {
  		        				value =  wrapIndexChangeMap[displayedRowYvalue];
  		        			}
                      } else {
  	  		        		value = wrapIndexChangeMap[tickValue];
  		        		}
  		        		var wrapIndexMap = plot.getWrapIndexDisplayMap();
  		        		if (value  === undefined || wrapIndexMap[tickValue] > 0 && yrange.from > 0) {
  		        			// the half of the first row if on top should be drawn even if wrapIndex is >0 and
  		        			//draw only the first row in case of wrap
  		        			i = i + tickSize;
  		        			continue;
  		        		}
  		        		rowColor = (value % 2 == 0) ?defaultMarkings.alternateRowColor[0] : defaultMarkings.alternateRowColor[1];
  		        		if (expandedStatus) { // only if expanded else normal case
  		        			//var maxRowMap = plot.getRowIdMaxWrapMap();
  		        			var wrapIndexDisplayMap = plot.getWrapIndexDisplayMap(); // yValue and the wrapIndex 0 ,1..., 0,1....
  		        			//var wrapIndex = wrapIndexDisplayMap[tickValue];
  		        			//height = height *  maxRowMap[rowId] - wrapIndex; // as it is the height of merged row headers
  		        			var wrapRowsDisplayed = plot.getRowIdDisplayWrapMap();
  		        			height = height *  wrapRowsDisplayed[rowId]; // as it is the height of merged row headers
  		        		}

  		       		} // if aleternate rows with same color for merge ends
	                 // IF sameColorForMergedRows is false -(default) or // NORMAL CASE(not merged)
	                 if(!defaultMarkings.sameColorForMergedRows || !options.series.gantt.wrappedRows.mergeWrapRows ){
	                	 rowColor = tickValue % 2 == 0 ?defaultMarkings.alternateRowColor[0] :  defaultMarkings.alternateRowColor[1];
                      }
                	 // fill area
                     ctx.fillStyle = rowColor;
                	 var width = xrange.to - xrange.from;
                	 //check if height exceeds max
                	 if(yrange.from + height > maxCanvasCoordinates) {
                		 height = maxCanvasCoordinates - yrange.from;  // height for the partly displayed last and first row in current view
                	 }
                     ctx.fillRect(xrange.from, yrange.from, width, height);
                 i = i + tickSize; // increment the lines with tickSize
             } //for


  	        //For gridline renderer, ensure that it is drawn for alternate row coloring
        	var  lineRendererFor = defaultMarkings.gridLineRenderer.lineRendererFor;
 	        	  //Draw alternate Colours only for row with row headers ..ie only for actual data rows.leave rest empty
 	        var lineCountToRenderer = axis.ticks.length;
 	       if(lineRendererFor  != "full" && series.displayedRowIds.length < axis.ticks.length) {
	        	// when data is less when compared to max rows
	        	lineCountToRenderer = series.displayedRowIds.length;
		      }
 	       for (var i = 0; i < lineCountToRenderer; ) {
	       		if(axis.ticks[i] == null) {
	       			 i = i + tickSize;
	       			 continue;
	       		 }
                tickValue = axis.ticks[i].v;
                //console.log(plot.retrieveActualRowId(tickValue));
                halfAboveTickValue = tickValue - (tickSize/2);
                // clip
                //Note   if the top half portion should be colored even if the start position is not in canvas
                //So when value == min the drawing should be done
                if(halfAboveTickValue < round(axis.min, 0.1) || halfAboveTickValue >= axis.max) {
               	 i = i + tickSize; // increment the lines with tickSize and don't draw the line
               	 continue;
                }
                y = axis.p2c(halfAboveTickValue);
                xoff = plotWidth;
                xrange.from = 0; //Check inverse transform case as well
                xrange.to = xoff;
                yrange.from = y;
                yrange.to = y ;

        		 if(defaultMarkings.gridLineRenderer.rendererCallback != null) {
                	 //For gridlines height needs to be same for all rows. this data is given to callback
        			 height = axis.p2c(2) - axis.p2c(1);
                	 var width = xrange.to - xrange.from;
                	 var uniqueRowId = plot.retrieveActualRowId(tickValue);
                	 if(uniqueRowId) {
                	 var dataToRenderer = {
                			drawingContext :ctx,
                			xFrom :  xrange.from,
                			yFrom :  yrange.from,
                			xTo :  xrange.to,
                			yTo: yrange.to,
                			rowWidth : width,
                			rowHeight: height,
	                		rowId :  uniqueRowId,    //considering warp case as well
	                		rowObject : series.rowIdRowObjectMap[uniqueRowId] // passign rowObject as well
                	 }
                	 triggerCallBackRenderer(dataToRenderer, defaultMarkings.gridLineRenderer.rendererCallback);
                	 }
                 } else if(defaultMarkings.dashedLine) {
                	 ctx.createDashedLine(xrange.from, yrange.from , xrange.to, yrange.to, defaultMarkings.dashedStyle);
                 } else {
                 	ctx.beginPath();
                 	ctx.moveTo(xrange.from, yrange.from);
                 	ctx.lineTo(xrange.to, yrange.to);
                 	ctx.stroke();
                  }
                 i = i + tickSize; // increment the lines with tickSize
        	 }
        }
        // TEMPORRAY FIX , if filling used in markings .. This to be handled only
        // for outside actual plot area
        function drawMarkingsExtendingToRowHeaders() {
        	ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            // Modified for ISRM-8231
            if( !options.grid.markings.markingsArray && (options.grid.markings.drawOnTop == true || options.grid.markings.drawOnTop == undefined)) {
        	drawMarkings(null, true); //drawLineMarkingOnly
            }
        	ctx.restore();
        }

        /**
         * for roundign the values to given seep
         * Eg: round(0.5444, 0.1) = 0.5
         */
        function round(value, step) {
            step || (step = 1.0);
            var inv = 1.0 / step;
            return Math.round(value * inv) / inv;
        }

        /**
         * for markings array to be drawn as background column headers before ticks
         */
        function drawMarkingsExtendingToColumnHeaders(){
        	ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
        	var  markingsToHeaders = options.grid.markings.markingsArray;
        	var isCustomMarkings = true;
        	// Modified for ISRM-8231
        	  if (!options.grid.markings.markingsArray &&
        	         (options.grid.markings.drawOnTop == true || options.grid.markings.drawOnTop == undefined)) {
        	 drawMarkings(markingsToHeaders, false, true,isCustomMarkings);
        	  }
        	ctx.restore();
        }

        /**
         * if markings is not passed, will check from options.grid.markings.markingsArray
         * Draw the markings on grid and column headers dependign on the flag drawOnGrid
         * markings is of the form
         *  markings.push({ xaxis: {
   			  				from: i,
   			  				to: i + 2 * 24 * 60 * 60 * 1000
   			  				} ,
   			  			yaxis: {
   			  				from: axes.ymin,
   			  				to: axes.ymax
   			  			},
   			  			color: colorDays.color ,
   			  			clipWithBoundary: true
   		  });
   		 * drawLineMarkingOnly -  only draw lines for the markings not the area
         * drawOnBoth -  if true will draw tyhe markings on grid area  as well as column header.
         * If false will draw only in column headers
         *
         */
        function drawMarkings(markings, drawLineMarkingOnly, drawOnBoth,isCustomMarkings) {
        	if(!markings) {
        		markings = options.grid.markings.markingsArray;
        	}
        	if(drawLineMarkingOnly == undefined){
        		drawLineMarkingOnly = false;
        	}
        	if(drawOnBoth == undefined) {
        		drawOnBoth = true;
        	}
        	// console.log("markings -------------", markings);
            if (markings) {
                if ($.isFunction(markings)) {
                    var axes = plot.getAxes();
                    // xmin etc. is backwards compatibility, to be
                    // removed in the future
                    axes.xmin = axes.xaxis.min;
                    axes.xmax = axes.xaxis.max;
                    axes.ymin = axes.yaxis.min;
                    axes.ymax = axes.yaxis.max;
                    markings = markings(axes);
                }
                for (var i = 0; i < markings.length; ++i) {
                    var m = markings[i],
                        xrange = extractRange(m, "x"),
                        yrange = extractRange(m, "y");
                    if(m.clipWithBoundary == undefined) {
                    	m.clipWithBoundary = true; // for backward compatibility to Chronos version1.0
                    }
                    // fill in missing
                    if (xrange.from == null)
                        xrange.from = xrange.axis.min;
                    if (xrange.to == null)
                        xrange.to = xrange.axis.max;
                    if (yrange.from == null)
                        yrange.from = yrange.axis.min;
                    if (yrange.to == null)
                        yrange.to = yrange.axis.max;

                    // clip
                    if (xrange.to < xrange.axis.min || xrange.from > xrange.axis.max ||
                        yrange.to < yrange.axis.min || yrange.from > yrange.axis.max)
                        continue;

                    xrange.from = Math.max(xrange.from, xrange.axis.min);
                    xrange.to = Math.min(xrange.to, xrange.axis.max);
                    yrange.from = Math.max(yrange.from, yrange.axis.min);
                    yrange.to = Math.min(yrange.to, yrange.axis.max);

                    if (xrange.from == xrange.to && yrange.from == yrange.to)
                        continue;
	                    xrange.from = xrange.axis.p2c(xrange.from);
	                    xrange.to = xrange.axis.p2c(xrange.to);
	                    yrange.from = yrange.axis.p2c(yrange.from);
	                    yrange.to = yrange.axis.p2c(yrange.to);
	                    //console.log(m.clipWithBoundary , '------------', xrange, yrange);

		               if(!m.clipWithBoundary) { // draw from headers as well
                    	if(xrange.from == 0) {
                    		xrange.from = - plotOffset.left;
                    	}
                    	if(xrange.to == plotWidth) {
                    		xrange.to = plotWidth + plotOffset.right;
                    	}
                    	if(yrange.from == 0) {
                    		yrange.from = - plotOffset.top;
                    	}
                    	if(yrange.to == plotHeight) {
                    		yrange.to = plotHeight + plotOffset.bottom;
                    	}
		                	//console.log(m.clipWithBoundary , '---INSIDE---------', xrange, yrange);
		               }

		               //Check if whether this call is to draw on grid or only on column headers - assmpn time on top
		               //Added for ISRM-8065
		               if(!isCustomMarkings){// executed only if custom markings are not provided.
		                var colorOn = options.xaxis.colorDays.colorOn;
                    	if (colorOn == "BOTH") {
                   			yrange.from =-plotOffset.top;
                   			yrange.to = plotHeight + plotOffset.bottom;
                   		} else if(drawOnBoth == false || colorOn == "HEADER" ){
                   			yrange.from =-plotOffset.top;
                   			yrange.to = 0;
                   		} else if(colorOn == "GRID"){
                   			yrange.from=0;
                   			yrange.to = plotHeight ;
                   		}
                    }

                   if (xrange.from == xrange.to || yrange.from == yrange.to) { //drawLineMarkingOnly = true
                    	// draw line
                        ctx.strokeStyle = m.color || options.grid.markings.color;
                        ctx.lineWidth = m.lineWidth || options.grid.markings.lineWidth;
                        if(m.dashedLine) {
                        	ctx.createDashedLine(xrange.from, yrange.from, xrange.to, yrange.to, m.dashedStyle );
                        }  else {
                        	ctx.beginPath();
                        	ctx.moveTo(xrange.from, yrange.from);
                        	ctx.lineTo(xrange.to, yrange.to);
                        	ctx.stroke();
                        }
                    }
                    else if(!drawLineMarkingOnly) {
	                        // fill area
	                        ctx.fillStyle = m.color || options.grid.markings.color;
	                        ctx.fillRect(xrange.from, yrange.to,
	                                     xrange.to - xrange.from,
	                                     yrange.from - yrange.to);

                    }

                } // for
            }
        }

        function drawTicks(axis, ticks, tickType, multiLineTimeHeaderObject) {
        	 var tickStyle = {},tickLength=0;

        	 var tickColor="#000000", lineWidth=1, xoff = 0, yoff = 0,	x = 0,  y = 0; //default initialisation

        	 if(multiLineTimeHeaderObject != undefined && tickType == "MAJOR" ) {
        		 tickStyle = multiLineTimeHeaderObject.majorTickStyle;
             var majorTickLabelHeight = multiLineTimeHeaderObject.majorTickLabelHeight;
             var minorTickLabelHeight = multiLineTimeHeaderObject.minorTickLabelHeight;
             var majorTickSize = axis.majorTickSize;
        		 if(tickStyle != null) {
     				tickLength = tickStyle.majorTickLength;
        		 }

        	 }  else if(tickType == "MINOR" || tickType == "DEFAULT_NORMAL") { //NORMAL/DEFAULT or MINOR
        		 tickStyle = axis.options.tickStyle;
        		 if(tickStyle != null) {
     				tickLength = axis.tickLength;
        		 }
        	 } else if(tickType == "SUBTICK" ) {
        		 tickStyle = axis.options.subTick.subTickStyle;
        		 if(tickStyle != null) {
        				tickLength = tickStyle.subTickLength;
        		 }
        	 }

        	 if(tickStyle != null) {
              	tickColor = tickStyle.tickColor;
              	lineWidth = tickStyle.lineWidth;
              }

        	 var bw = options.grid.borderWidth;

        	 // find the edges
             if (axis.options.mode == "time" && tickType == "MAJOR") {    //This ticklength only for major ticks
            	 if(tickLength == 'full') {
            		  if(axis.showLabel) {
            			  y = (axis.position == "top" ?-plotOffset.top : -plotOffset.bottom); //if top,  y will be plotOffset.top
            		  } else {
            			  y = 0;
            		  }
            	} else {
            		 y = -tickLength;
            	 }
            	 //t = tickLength;
              }  else if (tickType == "MINOR" || tickType == "DEFAULT_NORMAL") {
            	  if(tickLength == 'full') {
            		  var box = axis.box;
            		  if(axis.options.columnSummary != undefined && axis.options.columnSummary.enable) {
              			y = -(axis.heightOfMinorTickLabel + axis.options.columnSummary.height + box.labelMargin + bw + 1.5); // one pixel for the width of line

              		 } else {

              			 if(axis.showLabel) {
              				 y = - (axis.heightOfMinorTickLabel + bw  + box.labelMargin +  1.5); // one pixel for the width of line
              			 } else {
              				 y = 0;
              			 }
              		 }
            	  } else {
            		  y = -tickLength;
            	  }
              }
	      	  if (tickType == "SUBTICK") {
	      		 y = 0; //to start sub tick from plotOffset top and plotOffset bottom
	      	  }

	      	  t = tickLength; // common

             //setting for the context
             ctx.strokeStyle = tickColor;
             ctx.lineWidth = lineWidth;
            for (var i = 0; i < ticks.length; ++i) {
                var v = ticks[i].v;
                xoff = yoff = 0;
                if (v < axis.min || v > axis.max
                    // skip those lying on the axes if we got a border Should we do it for multi header?
                    || (t == "full" && bw > 0
                        && (v == axis.min || v == axis.max)))
                    continue;

                if (axis.direction == "x") {
                    x = axis.p2c(v);
                 if (tickType == "SUBTICK") {
                    	yoff = t == "full" ? plotHeight : t;
                    	if( t != "full") {
	                    	 if (axis.position == "top"  ) {
		                          yoff = tickLength;
	                         } else if (axis.position == "both") {
	                          } else if (axis.position == "bottom") {
	                        	 y = plotHeight;
	                          	yoff = -tickLength;
	                          }
                    	}
                } else {

                	yoff = t == "full" ? -plotHeight : t;
                    if (axis.position == "top"  ) {
                        yoff = -yoff-y;

                    } else if (axis.position == "both") {
                    	yoff = -yoff-y-y;

                    } else if (axis.position == "bottom") {
                    	 yoff = -yoff-y-y;
                    }
                }
                } else {
                    y = axis.p2c(v);
                    xoff = t == "full" ? -plotWidth : t;
                    if (axis.position == "left")
                        xoff = -xoff;
                }

                if (lineWidth == 1) {
                    if (axis.direction == "x")
                        x = Math.floor(x) + 0.5;
                    else
                        y = Math.floor(y) + 0.5;
                }

                var rendererFunction = null;
                if(tickStyle != null && tickStyle.tickRenderer != undefined) {
                	rendererFunction = tickStyle.tickRenderer;
              //Modified for ISRM-8231
               } else if( axis.direction == "x" && axis.options.multiLineTimeHeader.enable
            		          && axis.options.multiLineTimeHeader.majorTickStyle.tickRenderer != undefined) {
                         rendererFunction = axis.options.multiLineTimeHeader.majorTickStyle.tickRenderer;
                }
               if( rendererFunction == null) {
	                if(tickStyle != null && tickStyle.dashedLine)  {
	                	ctx.createDashedLine(x, y ,x + xoff, y + yoff, tickStyle.dashedStyle);

	                } else {
	                	ctx.beginPath();
	                	ctx.moveTo(x, y);
	                	ctx.lineTo(x + xoff, y + yoff);
	                	ctx.stroke();
	                 }
               } else {
              // Added for ISRM-8231
            	  var dataToRenderer = {
            			  drawingContext : ctx,
            			  x : x,
            			  y:y,
            			  xoffset : xoff,
            			  yoffset : yoff,
            			  ticks : ticks,
            			  drawingTick : ticks[i],
            			  plotHeight : plotHeight,
            			  tickType : tickType,
            			  axis : axis,
            			  plotOffset : plotOffset
            	  };
            	   //draw the tick from the renderer
            	   ctx.moveTo(x, y);
            	   if ($.isFunction(rendererFunction)) {
                   rendererFunction(dataToRenderer);
            	   }
               }
            }
        }
        /**
         * horizontal line below major tick labels in top and bottom inc ase of multi header
         * Note: this is called after translation to plotOffset.left, plotOffset.top.
         */
        function drawHeaderHorizontalLines(axis) {
        	//Draw a horizontal line below major tick labels  for multiline header
        	var yPosn = 0;
       	 	var bw = options.grid.borderWidth;
        	var box = axis.box;

        	if (axis.position == "top" ||  axis.position == "both"  )  {
        		if(axis.options.columnSummary != undefined && axis.options.columnSummary.enable) {
        			yPosn = (axis.heightOfMinorTickLabel + axis.options.columnSummary.height +  box.labelMargin +bw)  - 1; // one pixel for the width of line
        		} else {
        			yPosn = axis.heightOfMinorTickLabel + box.labelMargin + 1 + bw; // 1 side of horizontal line
        		}
                ctx.beginPath();  //prevent anti aliasing with additing 0.5`
                var tickStyle = axis.options.tickStyle; // style of minor ticks is taken for the horizontal line in header
                ctx.strokeStyle = tickStyle.tickColor;
                ctx.lineWidth = tickStyle.lineWidth;

            	ctx.moveTo(0.5, -yPosn-0.5); // 	MINUS since it is translated.
            	ctx.lineTo(plotWidth +0.5, -yPosn-0.5);
            	ctx.stroke();
        	}
        	if(axis.position == "bottom" ||  axis.position == "both") {
        			yPosn = plotHeight + axis.heightOfMinorTickLabel + box.labelMargin + 1 + 0.5 + bw;
        		ctx.beginPath();
        		tickStyle = axis.options.tickStyle; // style of minor ticks is taken for the horizontal line in header
                ctx.strokeStyle = tickStyle.tickColor;
                ctx.lineWidth = tickStyle.lineWidth;
	            ctx.moveTo(0.5, yPosn);
	            ctx.lineTo(plotWidth + 0.5,  yPosn);
	            ctx.stroke();
        	}
        	//STORE THIS FOR TICK SELECTION - VERY IMPORTANT
        	axis.endOfMajorTickLabel = (plotOffset.top - yPosn);
        	axis.endOfMinorTickLabel = axis.endOfMajorTickLabel + axis.heightOfMinorTickLabel + box.labelMargin;

        }

        //This method is called after label background filling of xaxis top and bottom for ensuring that the tick lines are again drawn
        //over teh label background
        function drawHeaderTicks() {
        	 ctx.save();
             ctx.translate(plotOffset.left, plotOffset.top);
	      	  var axes = allAxes();
	            for (var j = 0; j < axes.length; ++j) {
	                var axis = axes[j];
	                if (!axis.show || axis.ticks.length == 0)
	                if (axis.ticks.length == 0)
	                   continue;
	                if(axis.showLabel &&  axis.direction == "x" && !axis.options.multiLineTimeHeader.enable) {
	                	// draw normal ticks  for both x and y axis
	                	drawHeaderTickLines(axis, axis.ticks, "DEFAULT_NORMAL", null);
	                }
	                if(axis.showLabel && axis.direction == "x" && axis.options.multiLineTimeHeader.enable) {//if multiline , draw major ticks  and header format lines
                   //Added for ISRM-8140
                       if(axis.options.multiLineTimeHeader.header.minorTickLines == "show"){
                    	   drawHeaderTickLines(axis, axis.ticks, "MINOR", axis.options.multiLineTimeHeader); //drawing minor ticks
                       }
                    // Modified for ISRM-8370
                       if(axis.options.multiLineTimeHeader.header.majorTickLines == "show"
                    		    || axis.options.multiLineTimeHeader.header.tickRenderer != undefined ){
	                	drawHeaderTickLines(axis, axis.majorTicks, "MAJOR", axis.options.multiLineTimeHeader); //drawing major ticks
                       }
                       if(axis.options.multiLineTimeHeader.drawHorizontalLine == "show"){
	                	drawHeaderHorizontalLines(axis) ; // horizontal line below major tick labels in both direction
                       }
	                	if(axis.subTicks != null) {
	                		drawHeaderTickLines(axis, axis.subTicks, "SUBTICK", null); //drawing major ticks
	                	}
	                }
	            }
	            ctx.restore();
	      }

        function drawHeaderTickLines(axis, ticks, tickType, multiLineTimeHeaderObject) {
	         var tickStyle = {},tickLength = "full";
	       	 var  xfrom = 0, xto=0, yfrom = 0, yto = 0, yTopFrom = 0,yBottomFrom = 0,yTopTo = 0, yBottomTo = 0 ; //default initialisation
	       	 if(multiLineTimeHeaderObject != undefined && tickType == "MAJOR" ) {
	       		 tickStyle = multiLineTimeHeaderObject.majorTickStyle;
	       		 if(tickStyle != null) {
	    				tickLength = tickStyle.majorTickLength;
	       		 }
	       	 }  else if(tickType == "MINOR" || tickType == "DEFAULT_NORMAL") { //NORMAL/DEFAULT or MINOR
	       		 tickStyle = axis.options.tickStyle;
	       		 if(axis.options.tickLength != undefined) {
	       			 tickLength = axis.options.tickLength;
	       		 }
	       	 }  else if(tickType == "SUBTICK" ) {
        		 tickStyle = axis.options.subTick.subTickStyle;
        		 if(tickStyle != null) {
        				tickLength = tickStyle.subTickLength;
        		 }
        	 }
	     	// t = tickLength; // common
	       	 var bw = options.grid.borderWidth;
	       	 // find the edges
	       	 	if (tickType == "MAJOR") {    //This ticklength only for major ticks
			       	 if(tickLength == 'full') {
			      		 if(axis.position == "top") {
			           		yfrom = -plotOffset.top;
			           		yto = 0;
		           		 } else if (axis.position == "bottom") {
		           			 yfrom = plotOffset.top + plotHeight;
		           			yto = plotOffset.top + plotHeight + plotOffset.bottom;
		           		 } else if (axis.position == "both") {
		           			 yTopFrom = -plotOffset.top;
		           			 yTopTo = 0;
		           			 yBottomFrom = plotHeight;
		           			 yBottomTo =  plotHeight + plotOffset.bottom;
		           		 }
//Added for ISRM-8140
			        }else if(tickLength == 'grid')  {
			        	yfrom =  plotOffset.top;
	       			 	yto = plotHeight;
			        }
		        }  else if (tickType == "MINOR" || tickType == "DEFAULT_NORMAL") {
		        	if(tickLength == 'full') {
			        	if(axis.position == "top") {
			        		if(tickType == "MINOR") {
			        			yfrom =  - (axis.heightOfMinorTickLabel + axis.summaryHeight + axis.options.labelMargin + 1.5);
			       			 	yto = 0;
			        		} else {
			        			yfrom = -plotOffset.top;
			       			 	yto = 0;
			        		}
			       		 } else if (axis.position == "bottom") {
			       			if(tickType == "MINOR") {
			       				yfrom = plotHeight + (axis.heightOfMinorTickLabel + axis.summaryHeight + axis.options.labelMargin + 1.5);
			       				yto = plotHeight ;
			       			} else {
			       				yfrom =  plotHeight + plotOffset.bottom;
			       				yto = plotHeight ;
			       			}

			       		 } else if (axis.position == "both") {
			       			if(tickType == "MINOR") {
			       				 yTopFrom = - (axis.heightOfMinorTickLabel + axis.summaryHeight + axis.options.labelMargin + 1.5);
				       			 yTopTo = 0;
				       			 yBottomFrom = plotHeight +  axis.heightOfMinorTickLabel + axis.options.labelMargin + 1.5; //darw from down to up on bottom
				       			 yBottomTo = plotHeight ;
			       			} else {
				       			 yTopFrom = -plotOffset.top;
				       			 yTopTo = 0;

				       			 yBottomFrom = plotHeight + plotOffset.bottom; //darw from down to up on bottom
				       			 yBottomTo = plotHeight ;
			       			}
			       		 }
		        	}
		        	//Added for ISRM-8140
		        	else if(tickLength=='grid'){
		        		if(tickType == "MINOR") {
		        			yfrom =  -(axis.summaryHeight + axis.options.labelMargin-1.5 );
		       			 	yto = plotHeight;
		        		}
		        	} else { //when mentioning tick length in pixels
		        		if(axis.position == "top") {
			       			 yfrom = -tickLength;
			       			 yto = 0;
			       		 } else if (axis.position == "bottom") { //darw from down to up on bottom
			       			 yfrom =  plotHeight;
			       			 yto = plotHeight + tickLength ;
			       		 } else if (axis.position == "both") {
			       			 yTopFrom = -tickLength;
			       			 yTopTo = 0;

			       			 yBottomFrom = plotHeight + tickLength;	//darw from down to up on bottom
			       			 yBottomTo = plotHeight ;
			       		 }
		        	}
		         } if (tickType == "SUBTICK") {
                 	yfrom = 0;
                	 if (axis.position == "top"  ) {
                		 yto = tickLength;

                     } else if (axis.position == "both") {
                    	 yTopFrom = tickLength;
		       			 yTopTo = 0;

		       			 yBottomFrom = plotHeight -( tickLength);	//darw from down to up on bottom
		       			 yBottomTo = plotHeight ;

                      } else if (axis.position == "bottom") {
                    	  yfrom = plotHeight;
                    	  yto = plotHeight -(tickLength) ;
                      }
               }
		       t = tickLength; // common
	           for (var i = 0; i < ticks.length; ++i) {
	             var v = ticks[i].v;

	             if (v < axis.min || v > axis.max
	                   // skip those lying on the axes if we got a border Should we do it for multi header?
	                   || (t == "full" && bw > 0
	                       && (v == axis.min || v == axis.max)))
	                   continue;

	             if (axis.direction == "x") {
	                   xfrom = axis.p2c(v);
	                   xto = xfrom;
	             }

	             if (ctx.lineWidth == 1) {
	                   if (axis.direction == "x")
	                       xfrom = Math.floor(xfrom) + 0.5;
	                   else
	                	   yfrom = Math.floor(yfrom) + 0.5;
	             }

		         if (axis.position == "both") {
		     		   drawHeaderTickLine(xfrom, yTopFrom, xto, yTopTo, tickStyle, tickType, axis, v);
		         	   drawHeaderTickLine(xfrom, yBottomFrom, xto, yBottomTo, tickStyle, tickType, axis, v);
		 		 } else {
		 			 drawHeaderTickLine(xfrom, yfrom, xto, yto, tickStyle, tickType, axis, v);
		 		 }

	           } //for
       }

        function drawHeaderTickLine(xfrom, yfrom, xto, yto, tickStyle, tickType, axis, v) {
        	var tickColor="#000000", lineWidth=1;
        	if(tickStyle != null) {
             	tickColor = tickStyle.tickColor;
              	lineWidth = tickStyle.lineWidth;
            }
        	//setting for the context
            ctx.strokeStyle = tickColor;
            ctx.lineWidth = lineWidth;

            var rendererFunction = null;
            var headerRendererFunction = null;
            // Modified for ISRM-8370
            if(tickStyle != null && tickStyle.tickRenderer != undefined
            		&& axis.options.multiLineTimeHeader.header.tickRenderer == undefined) {
            	rendererFunction = tickStyle.tickRenderer;
            } else {
            	rendererFunction = axis.options.multiLineTimeHeader.header.tickRenderer;
            }
            if( rendererFunction == null) {
	                if(tickStyle != null && tickStyle.dashedLine)  {
	                	ctx.createDashedLine(xfrom, yfrom ,xto, yto, tickStyle.dashedStyle);
	                   	//ctx.setLineDash([0]);
	                } else {
	                 	ctx.beginPath();
	                   	ctx.moveTo(xfrom, yfrom);
	                   	ctx.lineTo(xto, yto);
	                   	ctx.stroke();
	                   	//ctx.closePath();
	                 }
           } else {
        	   //draw the tick from the renderer
        	// Added for ISRM-8370
    		   var dataToRenderer = {
          			 drawingContext : ctx,
          			 xfrom : xfrom,
          			 yfrom:yfrom,
          			 xto : xto,
          			 yto : yto,
          			 axis : axis,
          			 drawingTick : v,
          			 tickType : tickType
          	  };
        	   ctx.moveTo(xfrom, yfrom);
        	   if ($.isFunction(rendererFunction)) {
         		  rendererFunction(dataToRenderer);
        	   }
           }
        }

        //Functions for preloading image text in cache
        function startPreLoadTextImage() {
        	if(!series.gantt.cacheTextAsImage) {
        		return;
        	}
        	var axisx = series.xaxis;
        	var axisy = series.yaxis;
        	// console.log('started  preload ' + axisx.options.scrollRange[0] + ' ' + axisx.options.scrollRange[1] + ' ' + axisy.options.scrollRange[0] + ' ' + axisy.options.scrollRange[1]);
        	preloadColumnIndex = plot.resetViewPortTime(axisx.options.scrollRange[0]);
        	preloadRowIndex = Math.floor(axisy.options.scrollRange[0]);
        	setTimeout(preLoadTextImage, 0);

        }

        function preLoadTextImage() {
        	var previousInterimScrollMode = plot.getInterimScrollMode();
        	plot.setInterimScrollMode(true);
        	var columnTime = preloadColumnIndex;
        	var row = preloadRowIndex;
	    	var dataMapRowIndex, dataMapColumnIndex ;//, displayedRowIds;
	    	var series = plot.getSeries();
	    	var rowIndexMap = series.rowMap;
	    	var columnIndexMap = series.columnMap;
	    	var dataMap = series.dataMap;
	    	var axisx = series.xaxis;
	    	var axisy = series.yaxis;
	    	var oneDayMillis = 24*3600*1000;
	    	var drawRowId, taskObjectId, eachTask, taskObjectIdArray;
	    	var priorityRowList = new Array();
	    	if(row <=Math.ceil(axisy.options.scrollRange[1]) ) {
	    			drawRowId = plot.retrieveActualRowId(row);
	    			if(drawRowId != undefined) {
	        			dataMapRowIndex = rowIndexMap[drawRowId];
	        			if(dataMapRowIndex != null ||  dataMapRowIndex != undefined) {
	        				if (columnTime < axisx.options.scrollRange[1]) {
			            		dataMapColumnIndex = columnIndexMap[columnTime];
			            			if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {
			            				taskObjectIdArray = plot.getNormalTaskIdArray(series, dataMapRowIndex,dataMapColumnIndex );
			            				if(taskObjectIdArray != undefined ) {
				            				for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
				            					taskObjectId = taskObjectIdArray[taskID];
					            				eachTask  = dataMap[taskObjectId];
					            				if(eachTask != null &&  eachTask !=  undefined) {
					            					eachTask.yValue = row;
					            					drawGanttTask(eachTask.start, row, eachTask.end, axisx, axisy, textImagePreloadContext, eachTask, "NORMAL");
					            				}//if
					            			}//for
				            			}
				            		}//if
		            			preloadColumnIndex = preloadColumnIndex + oneDayMillis;
		                    	setTimeout(preLoadTextImage, 0);
		                    	plot.setInterimScrollMode(previousInterimScrollMode);
		                    	return;

				            }
			            }// if

	        			if(series.longRangeDataMap != undefined) {
	        				taskObjectIdArray = plot.getLongRangeTaskIdArray(series, dataMapRowIndex );
	        				if(taskObjectIdArray != undefined) {
		        				for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
	            					taskObjectId = taskObjectIdArray[taskID];
		            				eachTask  = dataMap[taskObjectId];
		            				if(eachTask != null &&  eachTask !=  undefined) {
		            					eachTask.yValue = row;
					            		drawGanttTask(eachTask.start, row, eachTask.end, axisx, axisy, textImagePreloadContext, eachTask, "NORMAL");
				            		}//if
	            				}//for
	        				}
	        			}
			        }

	        		preloadColumnIndex = axisx.options.scrollRange[0];
	        		preloadRowIndex++;
	            	setTimeout(preLoadTextImage,0);
	            	plot.setInterimScrollMode(previousInterimScrollMode);
	            	return;

	    		} else {
	  					var imagePreloadEndCallBack  = series.gantt.imagePreloadEndCallBack;
	  		            if(imagePreloadEndCallBack != null) {
		  		            if($.isFunction(imagePreloadEndCallBack)) {
		  		            	imagePreloadEndCallBack();
		  		            } else {
		  					   eval(imagePreloadEndCallBack).apply(this, []);
		  		       		}
	  		            }
	  		  	}
        }


        function setContextProperties(ctx, series) {
        	ctx.lineWidth = series.gantt.lineWidth;
        	 //default behaviour
            ctx.textAlign = "start";
            ctx.textBaseline = "alphabetic";
            	textRenderer.setContext(ctx);

        }

        //For NEWGEN
        function drawSeriesGantt(ctx, series) {
        	var interimScrollMode = plot.getInterimScrollMode();
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            //FOR ALL LAYERS
             for (eachLayerName in canvasLayerMap) { //copy the same in base context to all canvas context in layerMap
            	if(eachLayerName == mainLayerName) {
            		continue;
            	}
            	canvasLayerMap[eachLayerName].context.save();
            	canvasLayerMap[eachLayerName].context.translate(plotOffset.left, plotOffset.top);
            }
            switch(series.gantt.align) {
	      		case "bottom": {
	      			barBottom = series.gantt.barHeight;
	      			barTop = 0;
	      			break;
	      		}
	      		case "top" : {
	      			barBottom = 0;
	      			barTop = series.gantt.barHeight;
	      			break;
	      		}
	      		case "center" : {
	      			barBottom = series.gantt.barHeight/2;
	      			barTop = series.gantt.barHeight/2;
	      			break;
	      		}
            }
            var tileWidth = (series.xaxis.max - series.xaxis.min) ;
            if(interimScrollMode && tileArrayMap[tileWidth] != null) {
            	  //console.log('tileWidth ' + tileWidth);
            	var canDraw = plot.drawFromTiles(tileWidth);
            	if(!canDraw) {
            		drawTaskFromMap(ctx, series);
           		 }
            	//console.log("Drawing from tiles .........");
            } else {
            	drawTaskFromMap(ctx, series);
            	//console.log("Actual draw!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! .........");
            	if(!interimScrollMode && tileArrayMap[tileWidth] != null) {
            		setTimeout(plot.loadTileImagesFromCache,0); // to prefetch the surroundign tiles
            	}
            }
            //FOR ALL LAYERS
            ctx.restore();
             for (eachLayerName in canvasLayerMap) {
            	 if(eachLayerName == mainLayerName) {
             		continue;
             	}
            	canvasLayerMap[eachLayerName].context.restore();
            }
        }

        function drawTaskFromMap(ctx, series) {

        	// setting context from text renderer. Need to do it here as dummy context for timing is called here
        	setContextProperties(ctx, series);
        	 for (eachLayerName in canvasLayerMap) { //copy the same in base context to all canvas context in layerMap
             	if(eachLayerName == mainLayerName) {
             		continue;
             	}
             	setContextProperties(canvasLayerMap[eachLayerName].context, series);
             }
        	var dataMapRowIndex, dataMapColumnIndex ;//, displayedRowIds;
        	var rowIndexMap = series.rowMap;
        	var columnIndexMap = series.columnMap;
        	var dataMap = series.dataMap;
        	var axisx = series.xaxis;
        	var axisy = series.yaxis;

        	if(axisx == undefined || axisy == undefined) {
        		return;
        	}
        	var oneDayMillis = 86400000; //24*3600*1000
        	var normalMaximumDaySpan = series.gantt.normalMaximumDaySpan;
        	//Note: Check for tasks before 1 day of axis.min so subtract  24*3600*1000 to axis.min always
           	//This normalMaximumDaySpan is passed from the server at emptyChart call in plotData
        	var viewPortMin = plot.resetViewPortTime(axisx.min) - (normalMaximumDaySpan * oneDayMillis);
        	var drawRowId, taskObjectId, eachTask, taskObjectIdArray, rowHeaderObject;

        	var row = Math.floor(axisy.min);
			var priorityRowList = null;
			//Case when priority tasks are drawn on  a different priority layer
			var priorityContext = null;
			if(canvasLayerMap != null && canvasLayerMap["chronos_priority"] != undefined) {
			  priorityContext = canvasLayerMap["chronos_priority"].context;
			}
			var wrapRowIndex = 0, entityWrapIndex;
			var taskIdWrapIndexMap = null;
			 if (plot.areWrapRowsEnabled()) {
				 taskIdWrapIndexMap = plot.getTaskIdWrapIndexMap();
			 }
        	for ( ;  row <= Math.ceil(axisy.max); row++) {
	        		if (plot.areWrapRowsEnabled()) {
	        			var wrapIndexDisplayMap = plot.getWrapIndexDisplayMap();
	       			 	wrapRowIndex = wrapIndexDisplayMap[row];
	        		}
					drawRowId = plot.retrieveActualRowId(row);
	        		if(options.series.gantt.priorityLayer == false) {
	    				priorityRowList = [];
	    			}
        			if(drawRowId != undefined) {
        				if (plot.areWrapRowsEnabled()) {
    						rowHeaderObject = series.rowIdRowObjectMap[drawRowId];
    					}
	        			dataMapRowIndex = rowIndexMap[drawRowId];
		            	//Drawing tasks only for this view port
	        			if(dataMapRowIndex != null ||  dataMapRowIndex != undefined) {
			            	for (var dayMilliSeconds = viewPortMin; dayMilliSeconds <= axisx.max; ) {
			            		dataMapColumnIndex = columnIndexMap[dayMilliSeconds];
			            			if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {
			            				taskObjectIdArray = plot.getNormalTaskIdArray(series, dataMapRowIndex,dataMapColumnIndex );
			            				if(taskObjectIdArray != undefined ) {
				            				for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
				            					taskObjectId = taskObjectIdArray[taskID];
					            				eachTask  = dataMap[taskObjectId];
					            				if(eachTask != null &&  eachTask !=  undefined) {
					            				    if (plot.areWrapRowsEnabled()) {
					            				    	  entityWrapIndex = taskIdWrapIndexMap[eachTask.chronosId];
					            				    	  eachTask.wrappedRowIndex = entityWrapIndex;
					            				    	  if ((wrapRowIndex != entityWrapIndex) &&
					            				    			  (rowHeaderObject!= null && rowHeaderObject.expanded)) {
															continue;
														}
					            					}
					            					eachTask.yValue = row;
				            					     if(checkPriorityTask(series, eachTask)) {
				            					    	 if(options.series.gantt.priorityLayer) {
				            					    	 	drawGanttTask(eachTask.start, row, eachTask.end, axisx, axisy, priorityContext, eachTask, "NORMAL");
						            					} else {
						            						storePrioirityGanttTask(eachTask.start, row, eachTask.end, axisx, axisy, ctx, eachTask, "NORMAL", priorityRowList);
						            					}
					            					 } else {
					            						drawGanttTask(eachTask.start, row, eachTask.end, axisx, axisy, ctx, eachTask, "NORMAL");
					            					 }
							            		}//if
				            				}//for

			            				}
			            			}//if
			            			dayMilliSeconds = dayMilliSeconds + oneDayMillis;
			            		} //for
		            	}//if
	        			if(series.longRangeDataMap != undefined) {
	        				taskObjectIdArray = plot.getLongRangeTaskIdArray(series, dataMapRowIndex );
	        				if(taskObjectIdArray != undefined) {
		        				for(var taskID = 0;  taskID<taskObjectIdArray.length ; taskID++) {
	            					taskObjectId = taskObjectIdArray[taskID];
		            				eachTask  = dataMap[taskObjectId];
		            				if(eachTask != null &&  eachTask !=  undefined) {
		            					  if (plot.areWrapRowsEnabled()) {
		            						  entityWrapIndex = taskIdWrapIndexMap[eachTask.chronosId];
		            						  eachTask.wrappedRowIndex = entityWrapIndex;
		            						  if ((wrapRowIndex != entityWrapIndex) &&
		            								  (rowHeaderObject != null && rowHeaderObject.expanded)) {
													continue;
												}
			            					}
		            					eachTask.yValue = row;
		            					if(checkPriorityTask(series, eachTask)) {
		            						if(options.series.gantt.priorityLayer) {
		            					    	 	drawGanttTask(eachTask.start, row, eachTask.end, axisx, axisy, priorityContext, eachTask, "NORMAL");
				            				} else {
				            						storePrioirityGanttTask(eachTask.start, row, eachTask.end, axisx, axisy, ctx, eachTask, "NORMAL", priorityRowList);
				            				}
		            					} else {
		            						drawGanttTask(eachTask.start, row, eachTask.end, axisx, axisy, ctx, eachTask, "NORMAL");
		            					}

				            		}//if
	            				}//for
	        				}
	        			}//series.longRangeDataMap

	        			//Now draw the prioirity tasks for tasks to be drawn on base context on top
	                	if(priorityRowList != null) {
	                		for(var index in  priorityRowList) {
	        	        		var eachTaskToDrawOnTop = priorityRowList[index];
	        	        		actualCallToDrawTask(eachTaskToDrawOnTop.dataToRenderer, eachTaskToDrawOnTop.right, eachTaskToDrawOnTop.left,
	        	        				eachTaskToDrawOnTop.top, eachTaskToDrawOnTop.bottom, eachTaskToDrawOnTop.inverseTransformAppliedOnXaxis);
	        	        	}
	                	}

        			} //after each Row
        	} //outer for

        }

        function checkPriorityTask(series, eachTask) {
        	var priorityProviderFn = series.gantt.priorityProvider; // Note this function is MANDATORY FOR PRIORITY SETTING
            if(priorityProviderFn != undefined) {
 	           var isTaskOnTop = eachTask.isTaskOnTop;
 	           if(!isTaskOnTop) {
 	        	   isTaskOnTop = triggerPriorityProvider(eachTask, priorityProviderFn, isPriorityProviderAFunction);
 	        	   eachTask.isTaskOnTop = isTaskOnTop;
 	           }
 	 		   if(isTaskOnTop) {
 	 			   return true;
 	 		   }
            }
            return false;
        }

        /**
         * THis function will store the details of the priority task which will be drawn on top of other normal task
         */
        function storePrioirityGanttTask(startTime, y, endTime, axisx, axisy, c, eachTask, mode, priorityRowList) {
            var left, right, bottom, top;
            var interimScrollMode = plot.getInterimScrollMode();
            // in horizontal mode, we start the bar from the left instead of from the bottom so it appears to be
            // horizontal rather than vertical - SO considering only horizontal draw
            left = startTime;
            right = endTime;
            top = y + barBottom;
            bottom = y - barTop;
            var scrollingDirection = null;
            if(interimScrollMode == true && mode == "NORMAL") { // otherwise all overlay modes will also be changed
            	mode = "SCROLLING";
            	scrollingDirection = scrollDirection;
            }

            left = axisx.p2c(left);
            bottom = axisy.p2c(bottom);
            right = axisx.p2c(right);
            top = axisy.p2c(top);

            if(isNaN(left) ||  isNaN(right)||bottom == Number.NaN ||  top == Number.NaN) {
            	return;
            }

            //object which holds all data to pass to renderer and to drawText
            //default behaviour
            c.textAlign = "start";
            c.textBaseline = "alphabetic";
            	textRenderer.setContext(c);

            var dataToRenderer = {
            		eachTask : eachTask,
       			   	drawingContext: c,
       			   	mode:mode,
       			   	textRenderer: textRenderer,
       			   	scrollDirection : scrollingDirection
      		};
        	var inverseTransformAppliedOnXaxis = axisx.options.inverseTransform;//$.isFunction(options.xaxis.transform);
            //FOr Task that needs to be drawn always on top will return true for the boolean isTaskOnTop
           var eachTaskDrawDetails = {
	 		  			dataToRenderer:dataToRenderer,
	 		   			right:right,
	 		   			left:left,
	 		   			top: top,
	 		   			bottom: bottom,
	 		   			inverseTransformAppliedOnXaxis:inverseTransformAppliedOnXaxis
	 		   	 };
	 		priorityRowList.push(eachTaskDrawDetails);
        }


        /*
        x :  starttime
        y :  y axis - taskID
        b :  endTime
        x =190000000000 y =1 b=200000000000 barBottom =-0.5 barTop=0.5 offset=0*/
        // The actual gantt tasks drawing is handled here in this function
        //Note: The meaning of bottom and top are reverse when inverse transform is applied.
        //Note mode : can have values SELECTION, HOVER,  NORMAL
        function drawGanttTask(startTime, y, endTime, axisx, axisy, c, eachTask, mode, selectedHotSpot) {
            var left, right, bottom, top;
            var interimScrollMode = plot.getInterimScrollMode();
            // in horizontal mode, we start the bar from the left instead of from the bottom so it appears to be
            // horizontal rather than vertical - SO considering only horizontal draw
            left = startTime;
            right = endTime;
            top = y + barBottom;
            bottom = y - barTop;
            var scrollingDirection = null;
            if(interimScrollMode == true && mode == "NORMAL") { // otherwise all overlay modes will also be changed
            	mode = "SCROLLING";
            	scrollingDirection = scrollDirection;
            }

            left = axisx.p2c(left);
            bottom = axisy.p2c(bottom);
            right = axisx.p2c(right);
            top = axisy.p2c(top);


            if(isNaN(left) ||  isNaN(right)||bottom == Number.NaN ||  top == Number.NaN) {
            	return;
            }
            	textRenderer.setContext(c);
            var dataToRenderer = {
            		eachTask : eachTask,
       			   	drawingContext: c,
       			   	mode:mode,
       			   	textRenderer: textRenderer,
       			   	scrollDirection : scrollingDirection
      		};
            if(selectedHotSpot != undefined) {
            	dataToRenderer.selectedHotSpot = selectedHotSpot;
            }

        	var inverseTransformAppliedOnXaxis = axisx.options.inverseTransform;//$.isFunction(options.xaxis.transform);
           //The actual call to default drawing or to the render if specified.
 		   actualCallToDrawTask(dataToRenderer, right, left, top, bottom, inverseTransformAppliedOnXaxis);
        }

        function actualCallToDrawTask(dataToRenderer, right, left, top, bottom, inverseTransformAppliedOnXaxis) {
        	var seriesGantt = series.gantt,
        			context = dataToRenderer.drawingContext,
        			options = plot.getOptions();
            //renderes if any, don't draw the task just invoke renderers
            var taskRendererCallbackFn = series.taskRenderer;
            if (inverseTransformAppliedOnXaxis == null && taskRendererCallbackFn != undefined) {
            	var leftCordinate  = left, topCordinate = bottom; // before translating
            	context.save();  //except for normal base canvas and priority drawings, highlight has to be translated as highlight is not in map,
	            context.translate(left, bottom);
            	//FOR ALL LAYERS -SPECIAL CASE OF TRANSLATING TO ACTAUL DRAW COORDINATES
             	for (eachLayerName in canvasLayerMap) {
             		if(eachLayerName == mainLayerName || eachLayerName == "chronos_priority") {
             			//Layer case normal base canvas and priority drawings is in already in  map
            			continue;
            		}
             		canvasLayerMap[eachLayerName].context.save();
             		canvasLayerMap[eachLayerName].context.translate(left, bottom);
             	}

        		dataToRenderer.width = right - left;
        		dataToRenderer.height = top - bottom;
        		dataToRenderer.leftCordinate = leftCordinate;
        		dataToRenderer.topCordinate = topCordinate;
        		dataToRenderer.canvasLayerMap = canvasLayerMap;

            	triggerCallBackRenderer(dataToRenderer, taskRendererCallbackFn, isTaskRendererAFunction);

            	//FOR ALL LAYERS
            	context.restore();
            	 for (eachLayerName in canvasLayerMap) {
            		if(eachLayerName == mainLayerName || eachLayerName == "chronos_priority") {
            			continue;
            		}
            		canvasLayerMap[eachLayerName].context.restore();
            	}
            	return;
            }

            var mode = dataToRenderer.mode;
            // fill the bar
            if (mode == "HOVER" && options.grid.autoHighlight) {
            	left = left-2;
            	right = right +2 ;
            	top = parseInt(top + 2);
            	bottom = parseInt(bottom - 2);
            }

            // draw outline
            context.beginPath(); //madatory
            var width = right - left , height = bottom - top;
            context.strokeRect(left, top, width , height);
        	if((mode == 'SHADOW' || mode == 'TASK_RESIZE') && context.fillStyle != null) {
        		context.fillRect(left, top, width , height);
        	}
            //Filling a color for the tasks and triggering renderers if any
            if (seriesGantt.fillColor && (mode == "NORMAL" || mode =="SCROLLING")) {

            	var fillColorProvider = series.fillColorProvider;
            	var colorArray;
            	var fillColor;
               	if(fillColorProvider  != undefined) {
               		colorArray = triggerFillColorProvider(eachTask, fillColorProvider);
            	} else {
            		colorArray = seriesGantt.fillColor.colors;

            	}
               	if(colorArray != null) {
               		fillColor = {
	               		colors : colorArray
	               	};
               	} else {
               		fillColor =  seriesGantt.fillColor.toString();
               	}
               	var fillOptions={};
				fillOptions.fillColor =  fillColor;
				fillOptions.fill = seriesGantt.fill;
                // Check for performnace
				var style  = fillTaskWithColors(top, bottom, fillOptions, context, left);
				context.fillStyle=style;
				context.fillRect(left, top, width , height);
            }

	        //DRAWING TEXT -  separate function call
            if(mode != "SHADOW") {
            	dataToRenderer.bottom = top;
        		dataToRenderer.top = bottom;
        		dataToRenderer.left = left;
        		dataToRenderer.right = right;

            	drawText(dataToRenderer, (seriesGantt.fontColor).toString(),seriesGantt.fontSize);
            }
        }

        function triggerFillColorProvider(eachTask, colorProviderFunction, isRendererAFunction) {
        	if(isRendererAFunction) {
    	 		//console.log("Executing as normal FUNCTION " + );
    	 		return colorProviderFunction(eachTask);
    		} else {
		        var args = new Array();
				args.push(eachTask);
				return  eval(colorProviderFunction).apply(this, args);
    		}
		}


        function triggerPriorityProvider(eachTask, priorityProviderFunction, isRendererAFunction) {
        	 	if(isRendererAFunction) {
        	 		//console.log("Executing as normal FUNCTION " + );
        	 		return priorityProviderFunction(eachTask);
        		} else {
			        var args = new Array();
					args.push(eachTask);
					return  eval(priorityProviderFunction).apply(this, args);
        		}
		}


       /**
        * A common function to call a function provided in options
        * @param dataToRenderer
        * @param rendererFunction
        * @param isRendererFunction :  which retuns true/false if the renderer is a function or not

        */
       function triggerCallBackRenderer (dataToRenderer, rendererFunction, isRendererAFunction) {
    	   if(isRendererAFunction == undefined) {
    		   isRendererAFunction = $.isFunction(rendererFunction);
    	   }

    	   if(isRendererAFunction) {
    	    	return rendererFunction(dataToRenderer, plot);
       	   } else {
		       var args = new Array();
			   args.push(dataToRenderer);
			  return eval(rendererFunction).apply(this, args);
       	   }
       };
       /**
        *
        * @param dataToFillText - the same object  passed to renderer
        * @param fontColor -  a string object
        */
       function drawText(dataToFillText, fontColor, fontSize) {

    	   //console.log("dataToFillText " + JSON.stringify(dataToFillText));
    	   var text = dataToFillText.eachTask.chronosId,
    	   right  = dataToFillText.right,
    	   left = dataToFillText.left,
    	   top = dataToFillText.top,
    	   bottom = dataToFillText.bottom,
    	   drawingContext = dataToFillText.drawingContext;
    	   drawingContext.font = fontSize + "pt Arial";

    	   drawingContext.fillStyle = fontColor;
           var barWidth = right - left;
           var textWidth = drawingContext.measureText(text).width;
           if(textWidth < barWidth) {
        	   drawingContext.fillText(text , (right + left)/2 - textWidth/2 , (bottom + top)/2 + 5 );
           }
	   }


       	function fillTaskWithColors(top, bottom, fillOptions, drawingContext, left) {
        	var colorArray = fillOptions.fillColor.colors;
        	//Note bottom & top r reverse here So setting actual
        	//console.log('c.fillStyle using  bottom' + bottom + " top " +  top + " left " + left );
        	var actualTopOfTask = bottom;
        	var actualBottomOfTask = top;
			var style = getFillStyle(fillOptions, colorArray, actualBottomOfTask, actualTopOfTask , drawingContext, left);
	        //console.log('c.fillStyle using  ' + style);
	        drawingContext.fillStyle=style;
	        return style;

		};

		function drawSeries(series) {
            if (series.lines.show)
                drawSeriesLines(series);
            if (series.bars.show)
                drawSeriesBars(series);
            if (series.points.show)
                drawSeriesPoints(series);
        }

        function drawSeriesLines(series) {
        	//console.log("Draw drawSeriesLines ....");
            function plotLine(datapoints, xoffset, yoffset, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    prevx = null, prevy = null;

                ctx.beginPath();
                for (var i = ps; i < points.length; i += ps) {
                    var x1 = points[i - ps], y1 = points[i - ps + 1],
                        x2 = points[i], y2 = points[i + 1];

                    if (x1 == null || x2 == null)
                        continue;

                    // clip with ymin
                    if (y1 <= y2 && y1 < axisy.min) {
                        if (y2 < axisy.min)
                            continue; // line segment is outside
                        // compute new intersection point
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    }
                    else if (y2 <= y1 && y2 < axisy.min) {
                        if (y1 < axisy.min)
                            continue;
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }

                    // clip with ymax
                    if (y1 >= y2 && y1 > axisy.max) {
                        if (y2 > axisy.max)
                            continue;
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    }
                    else if (y2 >= y1 && y2 > axisy.max) {
                        if (y1 > axisy.max)
                            continue;
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }

                    // clip with xmin
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    }
                    else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }

                    // clip with xmax
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    }
                    else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }

                    if (x1 != prevx || y1 != prevy)
                        ctx.moveTo(axisx.p2c(x1) + xoffset, axisy.p2c(y1) + yoffset);

                    prevx = x2;
                    prevy = y2;
                    ctx.lineTo(axisx.p2c(x2) + xoffset, axisy.p2c(y2) + yoffset);
                }
                ctx.stroke();
            }

            function plotLineArea(datapoints, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    bottom = Math.min(Math.max(0, axisy.min), axisy.max),
                    i = 0, areaOpen = false,
                    ypos = 1, segmentStart = 0, segmentEnd = 0;

                // we process each segment in two turns, first forward
                // direction to sketch out top, then once we hit the
                // end we go backwards to sketch the bottom
                while (true) {
                    if (ps > 0 && i > points.length + ps)
                        break;

                    i += ps; // ps is negative if going backwards

                    var x1 = points[i - ps],
                        y1 = points[i - ps + ypos],
                        x2 = points[i], y2 = points[i + ypos];

                    if (areaOpen) {
                        if (ps > 0 && x1 != null && x2 == null) {
                            // at turning point
                            segmentEnd = i;
                            ps = -ps;
                            ypos = 2;
                            continue;
                        }

                        if (ps < 0 && i == segmentStart + ps) {
                            // done with the reverse sweep
                            ctx.fill();
                            areaOpen = false;
                            ps = -ps;
                            ypos = 1;
                            i = segmentStart = segmentEnd + ps;
                            continue;
                        }
                    }

                    if (x1 == null || x2 == null)
                        continue;

                    // clip x values
                    // clip with xmin
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    }
                    else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }

                    // clip with xmax
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    }
                    else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }

                    if (!areaOpen) {
                        // open area
                        ctx.beginPath();
                        ctx.moveTo(axisx.p2c(x1), axisy.p2c(bottom));
                        areaOpen = true;
                    }

                    // now first check the case where both is outside
                    if (y1 >= axisy.max && y2 >= axisy.max) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.max));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.max));
                        continue;
                    }
                    else if (y1 <= axisy.min && y2 <= axisy.min) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.min));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.min));
                        continue;
                    }

                    // else it's a bit more complicated, there might
                    // be a flat maxed out rectangle first, then a
                    // triangular cutout or reverse; to find these
                    // keep track of the current x values
                    var x1old = x1, x2old = x2;

                    // clip the y values, without shortcutting, we
                    // go through all cases in turn

                    // clip with ymin
                    if (y1 <= y2 && y1 < axisy.min && y2 >= axisy.min) {
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    }
                    else if (y2 <= y1 && y2 < axisy.min && y1 >= axisy.min) {
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }

                    // clip with ymax
                    if (y1 >= y2 && y1 > axisy.max && y2 <= axisy.max) {
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    }
                    else if (y2 >= y1 && y2 > axisy.max && y1 <= axisy.max) {
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }

                    // if the x value was changed we got a rectangle
                    // to fill
                    if (x1 != x1old) {
                        ctx.lineTo(axisx.p2c(x1old), axisy.p2c(y1));
                        // it goes to (x1, y1), but we fill that below
                    }

                    // fill triangular section, this sometimes result
                    // in redundant points if (x1, y1) hasn't changed
                    // from previous line to, but we just ignore that
                    ctx.lineTo(axisx.p2c(x1), axisy.p2c(y1));
                    ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2));

                    // fill the other rectangle if it's there
                    if (x2 != x2old) {
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2));
                        ctx.lineTo(axisx.p2c(x2old), axisy.p2c(y2));
                    }
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            ctx.lineJoin = "round";

            var lw = series.lines.lineWidth,
                sw = series.shadowSize;
            // FIXME: consider another form of shadow when filling is turned on
            if (lw > 0 && sw > 0) {
                // draw shadow as a thick and thin line with transparency
                ctx.lineWidth = sw;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                // position shadow at angle from the mid of line
                var angle = Math.PI/18;
                plotLine(series.datapoints, Math.sin(angle) * (lw/2 + sw/2), Math.cos(angle) * (lw/2 + sw/2), series.xaxis, series.yaxis);
                ctx.lineWidth = sw/2;
                plotLine(series.datapoints, Math.sin(angle) * (lw/2 + sw/4), Math.cos(angle) * (lw/2 + sw/4), series.xaxis, series.yaxis);
            }

            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            var fillStyle = getFillStyle(series.lines, series.color, 0, plotHeight);
            if (fillStyle) {
                ctx.fillStyle = fillStyle;
                plotLineArea(series.datapoints, series.xaxis, series.yaxis);
            }

            if (lw > 0)
                plotLine(series.datapoints, 0, 0, series.xaxis, series.yaxis);
            ctx.restore();
        }

        function drawSeriesPoints(series) {
        	//console.log("Draw Series Points ....");
            function plotPoints(datapoints, radius, fillStyle, offset, shadow, axisx, axisy, symbol) {
                var points = datapoints.points, ps = datapoints.pointsize;

                for (var i = 0; i < points.length; i += ps) {
                    var x = points[i], y = points[i + 1];
                    if (x == null || x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                        continue;

                    ctx.beginPath();
                    x = axisx.p2c(x);
                    y = axisy.p2c(y) + offset;
                    if (symbol == "circle")
                        ctx.arc(x, y, radius, 0, shadow ? Math.PI : Math.PI * 2, false);
                    else
                        symbol(ctx, x, y, radius, shadow);
                    ctx.closePath();

                    if (fillStyle) {
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    ctx.stroke();
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            var lw = series.points.lineWidth,
                sw = series.shadowSize,
                radius = series.points.radius,
                symbol = series.points.symbol;
            if (lw > 0 && sw > 0) {
                // draw shadow in two steps
                var w = sw / 2;
                ctx.lineWidth = w;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                plotPoints(series.datapoints, radius, null, w + w/2, true,
                           series.xaxis, series.yaxis, symbol);

                ctx.strokeStyle = "rgba(0,0,0,0.2)";
                plotPoints(series.datapoints, radius, null, w/2, true,
                           series.xaxis, series.yaxis, symbol);
            }

            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            plotPoints(series.datapoints, radius,
                       getFillStyle(series.points, series.color), 0, false,
                       series.xaxis, series.yaxis, symbol);
            ctx.restore();
        }

        function drawBar(x, y, b, barLeft, barRight, offset, fillStyleCallback, axisx, axisy, c, series) {
        	/*console.log("Draw Bar function called " + x + " y = " + y + " b = " + b + "barLeft = "  +
        			barLeft + "  barRight " + barRight + " offset "  + offset   + "c " + c);*/
            var left, right, bottom, top,
                drawLeft, drawRight, drawTop, drawBottom,
                tmp;

            var horizontal = series.bars.horizontal;//anu
			var lineWidth = series.bars.lineWidth;//anu

            // in horizontal mode, we start the bar from the left
            // instead of from the bottom so it appears to be
            // horizontal rather than vertical
            if (horizontal) {
                drawBottom = drawRight = drawTop = true;
                drawLeft = false;
                left = b;
                right = x;
                top = y + barLeft;
                bottom = y + barRight;

                // account for negative bars
                if (right < left) {
                    tmp = right;
                    right = left;
                    left = tmp;
                    drawLeft = true;
                    drawRight = false;
                }
            }
            else {
            	//console.log('horizontal ' + horizontal);
                drawLeft = drawRight = drawTop = true;
                drawBottom = false;
                left = x + barLeft;
                right = x + barRight;
                bottom = b;
                top = y;

                // account for negative bars
                if (top < bottom) {
                    tmp = top;
                    top = bottom;
                    bottom = tmp;
                    drawBottom = true;
                    drawTop = false;
                }
            }

            //console.log("axisx.min "  + axisx.min + "axisx.max  " + axisx.max + " axisy.min " +axisy.min + "axisy.max " + axisy.max)

            // clip
            if (right < axisx.min || left > axisx.max ||
                top < axisy.min || bottom > axisy.max)
                return;

            if (left < axisx.min) {
                left = axisx.min;
                drawLeft = false;
            }

            if (right > axisx.max) {
                right = axisx.max;
                drawRight = false;
            }

            if (bottom < axisy.min) {
                bottom = axisy.min;
                drawBottom = false;
            }

            if (top > axisy.max) {
                top = axisy.max;
                drawTop = false;
            }

            left = axisx.p2c(left);
            bottom = axisy.p2c(bottom);
            right = axisx.p2c(right);
            top = axisy.p2c(top);

            // fill the bar
            if (fillStyleCallback) {
                c.beginPath();
                c.moveTo(left, bottom);
                c.lineTo(left, top);
                c.lineTo(right, top);
                c.lineTo(right, bottom);
                c.fillStyle = fillStyleCallback(bottom, top);
                c.fill();
            }

            // draw outline
            if (lineWidth > 0 && (drawLeft || drawRight || drawTop || drawBottom)) {
                c.beginPath();
                // FIXME: inline moveTo is buggy with excanvas
                c.moveTo(left, bottom + offset);
                if (drawLeft)
                    c.lineTo(left, top + offset);
                else
                    c.moveTo(left, top + offset);
                if (drawTop)
                    c.lineTo(right, top + offset);
                else
                    c.moveTo(right, top + offset);
                if (drawRight)
                    c.lineTo(right, bottom + offset);
                else
                    c.moveTo(right, bottom + offset);
                if (drawBottom)
                    c.lineTo(left, bottom + offset);
                else
                    c.moveTo(left, bottom + offset);
                c.stroke();
            }

            //customisation  started
			//Object which holds all data to pass to renderer and to drawText
            var dataToRenderer = {
				left: left,
     			right: right,
     			bottom: bottom,
				top: top,
     			drawingContext: c,
				y: y
     	    };

            var valueRendererCallbackFn = options.bars.valueRenderer;
            if (valueRendererCallbackFn != undefined) {
            	triggerCallBackRenderer(dataToRenderer, valueRendererCallbackFn);
			}
			//customisation end

        }

        function drawSeriesBars(series) {
        	//console.log("drawSeriesBars ------");
            function plotBars(datapoints, barLeft, barRight, offset, fillStyleCallback, axisx, axisy) {
                var points = datapoints.points, ps = datapoints.pointsize;


                for (var i = 0; i < points.length; i += ps) {
                    if (points[i] == null)
                        continue;
                    drawBar(points[i], points[i + 1], points[i + 2], barLeft, barRight, offset, fillStyleCallback, axisx, axisy, ctx, series);//anu
                }
            }

            // FIXME: figure out a way to add shadows (for instance along the right edge)
            ctx.lineWidth = series.bars.lineWidth;
            ctx.strokeStyle = series.color;
            var barLeft;

            switch (series.bars.align) {
                case "left":
                    barLeft = 0;
                    break;
                case "right":
                    barLeft = -series.bars.barWidth;
                    break;
                case "center":
                    barLeft = -series.bars.barWidth / 2;
                    break;
                default:
                    throw new Error("Invalid bar alignment: " + series.bars.align);
            }

            var fillStyleCallback = series.bars.fill ? function (bottom, top) { return getFillStyle(series.bars, series.color, bottom, top, ctx); } : null;
            plotBars(series.datapoints, barLeft, barLeft + series.bars.barWidth, 0, fillStyleCallback, series.xaxis, series.yaxis);

        }

		 //This function can be exposed to  return a color after applying Color or gradient
		function getFillStyle(filloptions, seriesColor, bottom, top, drawingContext, left) {
            var fill = filloptions.fill;
            if (!fill)
                return null;

            if (filloptions.fillColor)
                return getColorOrGradient(filloptions.fillColor, bottom, top, seriesColor, drawingContext, left);

            var c = $.color.parse(seriesColor);
            c.a = typeof fill == "number" ? fill : 0.4;
            c.normalize();
            return c.toString();
        }


		function getColorOrGradient(spec, bottom, top, defaultColor, drawingContext, left) {
            if (typeof spec == "string")
                return spec;
            else {
            	//console.log('drawingContext ' + drawingContext +"left " + left +  " top " +  top + " bottom " + bottom) ;
                //assume this is a gradient spec; IE currently only
                // supports a simple vertical gradient properly, so that's            // what we support too
            	var gradient;
            	if(top != undefined && bottom !=undefined && left != undefined && !isNaN(top) && !isNaN(bottom)   && !isNaN(left)) {
            		 gradient = drawingContext.createLinearGradient(left, top, left , bottom);
            	} else {
            		gradient = drawingContext.createLinearGradient(0, 1, 0, 1);
            	}

                for (var i = 0, l = spec.colors.length; i < l; ++i) {
                    var c = spec.colors[i];
                    if (typeof c != "string") {
                        var co = $.color.parse(defaultColor);
                        if (c.brightness != null)
                            co = co.scale('rgb', c.brightness);
                        if (c.opacity != null)
                            co.a *= c.opacity;
                        c = co.toString();
                    }
                    gradient.addColorStop(i / (l - 1), c);
                }
                return gradient;
            }
        }
		function insertLegend() {
			 	//clear first otehrwise it will overwrite when zooming or panning
			 	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	            if (!options.legend.show)
	                return;
	            if(!series) {
	            	return;
	            }
	            //console.log("Inside insertLegend ...") ;
	            var fragments = [],
	            lf = options.legend.labelFormatter, s=0, label;
	            var  entries = [];
	            // Build a list of legend entries, with each having a label and a color
	            for (var i = 0; i < series.length; ++i) {
	                      s = series[i];
	                     if (s.label) {
	                          label = lf ? lf(s.label, s) : s.label;
	                           if (label) {
	                               entries.push({
	                                   label: label,
	                                   color: s.color
	                               });
	                           }
	                        }
	            } //for
                // Sort the legend using either the default or a custom comparator
                if (options.legend.sorted) {
                    if ($.isFunction(options.legend.sorted)) {
                        entries.sort(options.legend.sorted);
                    } else {
                        var ascending = options.legend.sorted != "descending";
                        entries.sort(function(a, b) {
                            return a.label == b.label ? 0 : (
                                (a.label < b.label) != ascending ? 1 : -1 // Logical XOR
                            );
                        });
                    }
                }

                // Generate markup for the list of entries, in their final order
                for (var i = 0; i < entries.length; ++i) {
                    entry = entries[i];
                    fragments.push(entry);
                }
	            if (fragments.length == 0)
	            	return;

	            var f = options.legend.font;
	            ctx.font = f.style + " " + f.variant + " " + f.weight + " " + f.size + "px '" + f.family + "'";
	            if(series.gantt != null && series.gantt.show) {
	            	textRenderer.setShouldSetFontToContext(true);
	            }
	            var axisy = s.yaxis, eachEntry , entryTop, labelBoxTop;
	            var box = axisy.box;
	            var rowHeight = options.legend.rowHeight,
	            	labelBoxWidth = options.legend.labelBoxWidth; //Assuming label box  is a square

				 for (var i = 0; i < fragments.length; ++i) {
					 eachEntry = fragments[i];

					 entryTop =  box.top + (i*rowHeight);
					 labelBoxTop = entryTop +  rowHeight/2 - labelBoxWidth/2;

					 ctx.strokeStyle=options.legend.labelBoxBorderColor;
					 ctx.strokeRect(1, labelBoxTop, labelBoxWidth, labelBoxWidth); //a small 5px gap between two label boxes

					 ctx.fillStyle = eachEntry.color;
					 //console.log("Filling color " + eachEntry.color );
					 ctx.fillRect(1, labelBoxTop, labelBoxWidth, labelBoxWidth); //options.legend.labelBoxBorderColor

					 //for rendering text
					 ctx.fillStyle = f.color;
					 ctx.fillText(eachEntry.label, parseInt(labelBoxWidth)+5, entryTop+rowHeight/2 +labelBoxWidth/2);//a space of 2px between box & label

				 }
		 }


        ///////////////////////// interactive features starts here///////////////////////////
        // returns the data item the mouse is over, or null if none is found
        function findItemOnGantt(mouseX, mouseY) {
        	plot = this;
        	if(mouseX < 0 || mouseY < 0 || mouseX > plotWidth || mouseY > plotHeight){
        		return null;
        	}
        	var s = plot.getSeries();
        	if(!s || s.xaxis == undefined || s.yaxis == undefined) {
        		return;
        	}
        	var foundItem = null;
        	//register a call back for findItemOnGantt , if present call that
        	if(s.gantt.findItemOnGanttCallBack != null) {
        		var rendererFunction = s.gantt.findItemOnGanttCallBack;
        		foundItem = rendererFunction({ mouseX: mouseX, mouseY:mouseY});
        		if(foundItem != -1) {
        			//console.log("FOUND =========" + JSON.stringify(foundItem));
            		return foundItem;
            	}  else {
            		return null;
            	}
        	}
	        var  axisx = s.xaxis, axisy = s.yaxis,
            	mx = axisx.c2p(mouseX), // precompute some stuff to make the loop faster
            	my = axisy.c2p(mouseY),
            	dataMapRowIndex,
            	dataMapColumnIndex,
            	taskIdArray = null;
            var rowIndexMap = s.rowMap,
            	columnIndexMap = s.columnMap,
            	currentRowId = null;
            	// displayedRowIds = s.displayedRowIds;
            var oneDayMillis = 24*3600*1000,
            normalMaximumDaySpan = s.gantt.normalMaximumDaySpan ;

        	//Note: Check for tasks before   'normalMaximumDaySpan' days of axis.min    up to mx
           	var viewPortMin = plot.resetViewPortTime(mx) - (normalMaximumDaySpan * oneDayMillis);
           	var itemYValue = Math.round(my);

			currentRowId = plot.retrieveActualRowId(itemYValue); //normal case

           	var normalTasksArray= null, longRangeTaskArray = null;

        	dataMapRowIndex = rowIndexMap[currentRowId]; //itemYValue should be teh exact rowId. only integers on map
        	if(dataMapRowIndex != null ||  dataMapRowIndex != undefined) {
        		 var priorityItem = null, priorityProviderFn = s.gantt.priorityProvider, firstItem = null;
        		 //1. Checking if item is a task in the 2D map
	        	 for(var time = viewPortMin ; time <= plot.resetViewPortTime(mx) ; ) { //check tasks in previous and next bucket also
	        		//console.log("Looking each ---" + printDate(time));
	        		 normalTasksArray = null, longRangeTasksArray = null;
	        		//Case 1 . Check if item is a normal task
	        		dataMapColumnIndex = columnIndexMap[time];
		     		if(dataMapColumnIndex != null ||  dataMapColumnIndex != undefined) {
	     				//console.log("dataMapColumnIndex  " + dataMapColumnIndex);
		     			//CHECKING HOVERED ON PRIORITY ITEM
		     			//Case 1 . Check if item is a normal task having top prioirities
		     			normalTasksArray = plot.getNormalTaskIdArray(s, dataMapRowIndex, dataMapColumnIndex );
		     			//console.log("normalTasksArray " + normalTasksArray);
			     		if(normalTasksArray != null) {
		     			   if(priorityProviderFn != undefined) {
			     			 //check if a priority task is present in normal array
			     				foundItem = checkIfItemFound(normalTasksArray, s, mx, my, itemYValue, currentRowId, true);
			     				if(foundItem != null && foundItem.actualHover) {
				     				if(foundItem.priorityItem != null) {
				     					//console.log(" 1 NORMAL PRIORITY FOUND " + JSON.stringify(foundItem.priorityItem));
					     				return foundItem.priorityItem;
				     				} else if (foundItem.firstItem != null) {
				     					firstItem = foundItem.firstItem;
				     				}
			     				} else { //extra hover
			     					if(foundItem != null && foundItem.priorityItem != null) {
				     					//console.log(" 1 NORMAL PRIORITY paddedHoverItem FOUND " + JSON.stringify(foundItem.priorityItem));
			     						paddedHoverItem = foundItem.priorityItem;
					     				return null;
				     				} else if (foundItem!=null && foundItem.firstItem != null) {
				     					firstItem = foundItem.firstItem;
				     				}
			     				}
			     		  }   else {
				     		//Case 1 . Check if item is a normal task with no prioirities
			     				foundItem = checkIfItemFound(normalTasksArray, s, mx, my, itemYValue, currentRowId);
			     				if(foundItem != null && foundItem.actualHover && foundItem.item != null) { //actual hover
				     				//console.log(" 1 NORMAL FOUND " + JSON.stringify(foundItem));
				     				return foundItem.item;
			     				} else if(foundItem !=null && foundItem.item != null) { //extra hover
					     					//console.log(" 1 NORMAL paddedHoverItem  FOUND" + JSON.stringify(foundItem));
			     						 	paddedHoverItem = foundItem.item;
					     					return null;
			     				}
			     		  }
			     		}
		     		} //dataMapColumnIndex

		     		// Case 2. Check if the item  is a task in longRangeData  with priority

		     		longRangeTasksArray = plot.getLongRangeTaskIdArray(s, dataMapRowIndex);
		     		//console.log("longRangeTasksArray " + longRangeTasksArray);
			     	if(longRangeTasksArray != null) {
				     	   if(priorityProviderFn != undefined) {
				     		  //check if a priority task is present in longrange array
				     			 	foundItem = checkIfItemFound(longRangeTasksArray, s, mx, my, itemYValue, currentRowId, true);
				     			 	if(foundItem != null && foundItem.actualHover) {
					     				 if(foundItem.priorityItem != null) {
					     					//console.log(" 2-1  LONGRANGE PRIORITY FOUND " + JSON.stringify(foundItem.priorityItem));
					     					 return foundItem.priorityItem;
					     				 } else if(firstItem == null && foundItem.firstItem){
					     					firstItem = foundItem.firstItem;
					     				 }
				     			 	} else { //padded hoverItem -- not actual item hovered
				     			 		 	if(foundItem != null && foundItem.priorityItem != null) {
				     			 		 		paddedHoverItem  = foundItem.priorityItem;
				     			 		 		//console.log(" 2-2 LONGRANGE PRIORITY paddedHoverItem FOUND " + JSON.stringify(foundItem));
				     			 		 		return null;
						     				 } else if(foundItem != null && firstItem == null && foundItem.firstItem){
						     					firstItem = foundItem.firstItem;
						     				 }
				     			 	}

			     		 } else {
			     			// Case 2. Check if the item  is a task in longRangeData normal case
			     			foundItem = checkIfItemFound(longRangeTasksArray, s, mx, my, itemYValue, currentRowId);
			     			if(foundItem != null && foundItem.actualHover) {
					     			//console.log(" 2-3  LONGRANGE FOUND " + JSON.stringify(foundItem));
						        	return foundItem.item;
				     		} else  if (foundItem != null && !foundItem.actualHover) {
					     			//console.log(" 2-4  LONGRANGE paddedHoverItem FOUND " + JSON.stringify(foundItem));
					     			paddedHoverItem = foundItem.item;
						        	return null;
				     		}
			     		 }
	        	   }//longRangeTasksArray

		     		time = time + oneDayMillis;

	        	 } //for all the previous and next days span
	        	 //if no priority item found return the first  task if present
     			 if (firstItem != null) {
     				//console.log(" FIRST ITEM FOUND " + JSON.stringify(firstItem));
     				paddedHoverItem = firstItem;
     				return firstItem;
     			}
        	}  //outer if dataMapRowIndex != null
        	//Case 3 . Check if mouse is over any hotSpot
     		foundItem = checkIfHotSpotFound(s, mx, my , itemYValue , currentRowId);
     		if (foundItem != null) {
     			//console.log(" 3 HOT SPOT FOUND " + JSON.stringify(foundItem));
	        	return foundItem;
	        }

         	return null;

        }
        // Returns the first item hovered on that point if no prioirity is set.
		//if prioirity is set, the first item with the flag 'isTaskOnTop' is returned
        //if checkPrioirityItem parameter is true, only prioriry taks are checked
        function checkIfItemFound(taskIdArray, s, mx, my , itemYValue , currentRowId, checkPrioirityItem) {
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
			var wrapRowIndex = 0;
			var rowId = plot.retrieveActualRowId(itemYValue);
			var rowHeaderObject = s.rowIdRowObjectMap[rowId]

			if (plot.areWrapRowsEnabled()) { //WRAP ADDITIONS
				var wrapIndexDisplayMap = plot.getWrapIndexDisplayMap();
				wrapRowIndex  = wrapIndexDisplayMap[itemYValue];
				//console.log("Wrap Index got-----------", wrapRowIndex);
			}

			var hoveredItems = new Array(), eachHoveredItem = null;
			var extraDistanceInPixel = options.taskResize.radius,
					extraHoveredItems = new Array();
			var axisx = s.xaxis;
			var axisy = s.yaxis;
	       	for(var taskIdIndex = 0;  taskIdIndex < taskIdArray.length ; taskIdIndex++) {
	       			 var eachTaskID  =  taskIdArray[taskIdIndex];
	       			 var eachTask = s.dataMap[eachTaskID];
	       			 if(eachTask != null || eachTask != undefined)  { //ISRM-4104
	       			 var paddedStart = axisx.c2p(axisx.p2c(eachTask.start) - extraDistanceInPixel);	// converted to in time
					 var paddedEnd = axisx.c2p(axisx.p2c(eachTask.end) + extraDistanceInPixel);
	       				if (plot.areWrapRowsEnabled() && (rowHeaderObject && rowHeaderObject.expanded && wrapRowIndex != eachTask.wrappedRowIndex)) {
	       						//console.log(" Not found --contimnueing wrapRowIndex = ",wrapRowIndex ,  " eachTask.wrappedRowIndex" , eachTask.wrappedRowIndex);
								continue;
	       				} else if((mx <= eachTask.end  && mx >= eachTask.start) &&
	           		    		(my <= (itemYValue + barBottom) && my >= (itemYValue - barTop))) {
	           		    	 //console.log("Each Task Object from Map ---FOUND " + JSON.stringify(eachTask));
	           		    	 item = eachTask;
	           		    	 item.rowId = currentRowId;
	           		    	 item.yValue = itemYValue;
	           		    	  //console.log("MATCH ============Item Yvalue set ------", itemYValue);
	           		    	 //console.log ("ITEM FOUND........... " , item );
					          var datapoint=  [item.start, itemYValue, item.end, item]; //keep existing ..Remove later
					          var identifySubTaskFunction = s.gantt.subTaskIdentifier;


					          if( identifySubTaskFunction != null) {
						          //Added for finding subtask inside main
						          //=======================================
					        	  var relativeCoordinates = { // in pixels
						        		  x :  axisx.p2c(mx) - axisx.p2c(item.start),
						        		  y :  axisy.p2c(my) - axisy.p2c(itemYValue - barTop),
						        		  left : 0,
						        		  top : 0,
						        		  width :  axisx.p2c(item.end) - axisx.p2c(item.start),
						        		  height : axisy.p2c(itemYValue + barBottom) - axisy.p2c(itemYValue - barTop),
						          };
						          var dataToRenderer = {
						        		 mx		      : mx,
						        		 my			  : my,
						        		 item         : item,
						        		 //datapoint    : datapoint,
						        		 relativeCoordinates :relativeCoordinates,
						        		 currentRowId : currentRowId,
						        		 itemYValue   : itemYValue
						          };
						      	triggerCallBackRenderer(dataToRenderer, identifySubTaskFunction);
						      	datapoint = dataToRenderer.datapoint;
						      	item = dataToRenderer.item;
					          }
					          eachHoveredItem = {
					        		  details: item
					          };
					          hoveredItems.push(eachHoveredItem);
           		        }  else if((mx <= paddedEnd && mx >=  paddedStart) &&
           		        			(my <= (itemYValue + barBottom) && my >= (itemYValue - barTop))) {
           		             //console.log("Each Task Object from Map ---FOUND " + JSON.stringify(eachTask));
              		    	 item = eachTask;
              		    	 item.rowId = currentRowId;
              		    	 item.yValue = itemYValue;
	   				         // console.log ("ITEM FOUND..........." + JSON.stringify(item) );
	   				          var datapoint=  [item.start, itemYValue, item.end, item]; //keep existing ..Remove later
	   				          var identifySubTaskFunction = s.gantt.subTaskIdentifier;
	   				          if( identifySubTaskFunction != null) {
	   					          //Added for finding subtask inside main
	   					          //=======================================
	   				        	 var relativeCoordinates = { // in pixels
						        		  x :  axisx.p2c(mx) - axisx.p2c(item.start),
						        		  y :  axisy.p2c(my) - axisy.p2c(itemYValue - barTop),
						        		  left : 0,
						        		  top : 0,
						        		  width :  axisx.p2c(item.end) - axisx.p2c(item.start),
						        		  height : axisy.p2c(itemYValue + barBottom) - axisy.p2c(itemYValue - barTop),
						          };
	   					          var dataToRenderer = {};
	   					          dataToRenderer = {
	   					        		 mx		      : mx,
	   					        		 my			  : my,
	   					        		 item         : item,
	   					        		 //datapoint    : datapoint,
	   					        		 relativeCoordinates :relativeCoordinates,
	   					        		 currentRowId : currentRowId,
	   					        		 itemYValue   : itemYValue
	   					          };
	   					      	triggerCallBackRenderer(dataToRenderer, identifySubTaskFunction);
	   					      	datapoint = dataToRenderer.datapoint;
	   					      	item = dataToRenderer.item;
	   				          }
	           		         eachHoveredItem = {
					        		  details: item
					          };
	           		         //console.log(" Pushing to extraHoveredItems " + JSON.stringify(eachHoveredItem));
	           		         extraHoveredItems.push(eachHoveredItem); // for hovering on extra sides of actual tasks as well
           		        }
	       			 } //if
	       		 }//for

	       		var hoverItemCallBack = s.gantt.hoverItemCallBack;  //CASE : User retuning the actual hover items
	        	if(hoveredItems != null &&  hoveredItems !=  undefined && hoveredItems.length > 0) {
			          if(hoverItemCallBack != null) {
			        	  hoveredItems = modifyHoverItemsAccordingToCallback(hoveredItems, mx, my, axisx);
			        	  if(hoveredItems.length <= 0) {
			        		 //console.error("hoverItemCallBack always returned false " + hoveredItems.length);
			        		  return null;
			        	  }
			          }
	        		if(checkPrioirityItem) {
		        		for(var i = 0;  i < hoveredItems.length ; i++) {
		        				eachItem = hoveredItems[i];
		        				//console.log("hoveredItems each :  " + eachItem.details.chronosId + " : " + eachItem.details.isTaskOnTop);
		        			 	if(eachItem.details.isTaskOnTop) { //if priority set , the first one with flag true in the list is returned
		        			 		//console.log("returning taskOnTop " + JSON.stringify(eachItem.details));
		        			 		return {
		        			 			priorityItem : eachItem,
		        			 			actualHover : true
		        			 		}
		        			 	}
		        		 } //for
		        		 return {
    			 			priorityItem : null,
    			 			firstItem : hoveredItems[0],
    			 			actualHover : true
    			 		 }
	        		} else {
	        			 //console.log("returning  first normal task " + JSON.stringify(hoveredItems[0].details));
	        			 return {
	        				 item : hoveredItems[0],
	        				 actualHover : true //if no priority item is searched set , the first one in the list is returned
	        			 }
	        		}
	         } else if(extraHoveredItems != null && extraHoveredItems.length > 0) {
	        	 //console.log("hoveredItems:  " + hoveredItems.length);
	        	 if(hoverItemCallBack != null) { //CASE : User retuning the actual hover items
	        		 extraHoveredItems = modifyHoverItemsAccordingToCallback(extraHoveredItems, mx, my, axisx, s);
	        		 if(extraHoveredItems.length <= 0) {
		        		  //console.error("hoverItemCallBack alwyas returned false ");
		        		  return null;
		        	  }
		          }
	        	  if(checkPrioirityItem) {
		        		for(var i = 0;  i < extraHoveredItems.length ; i++) {
		        				eachItem = extraHoveredItems[i];
		        				//console.log("hoveredItems each :  " + eachItem.details.chronosId + " : " + eachItem.details.isTaskOnTop);
		        			 	if(eachItem.details.isTaskOnTop) { //if priority set , the first one with flag true in the list is returned
		        			 		//console.log("returning taskOnTop " + JSON.stringify(eachItem.details));
		        			 		return {
		        			 			priorityItem : eachItem,
		        			 			actualHover : false
		        			 		}
		        			 	}
		        		 } //for
		        		 return {
	 			 			priorityItem : null,
	 			 			firstItem : extraHoveredItems[0],
	 			 			actualHover : false
		        		 }
	        		} else {
	        			 return {
	        				 item : extraHoveredItems[0],
	        				 actualHover : false //if no priority item is searched set , the first one in the list is returned
	        			 }
	        		}
	         }
        } //function checkIfItemFound

        /**
         * This will modify the items in that particular area according to the input from user call back.
         *
         */
        function modifyHoverItemsAccordingToCallback(hoveredItems, mx, my, axisx) {
        	//console.log("BEFORE hoveredItems:  " + hoveredItems.length);
        	var newHoverItems = $.merge([], hoveredItems);//make a copy
        	var length = newHoverItems.length;
         	var axisy = plot.getSeries().yaxis;
      	    var currentMouseX =  axisx.p2c(mx);
      	    var currentMouseY = axisy.p2c(my);
      	    var barBottom = plot.getBarBottom();
    	    var barTop = plot.getBarTop();
    	    var relativeX, relativeY, widthInPx, eachHoveredItem,dataToRenderer ;
    	    var hoverItemCallBack = plot.getSeries().gantt.hoverItemCallBack;

    	    var  indexOfHoverItems = new Array();
    	    for(var i = 0;  i < length ; i++) {
		      eachHoveredItem = newHoverItems[i].details;
			  //Trigger user call back for hover - hoverItemCallBack  if any so as to return the exact task if hovered
	   	      //Case : Identifying Actual and schedules tasks in the same area .
			  relativeX =  currentMouseX - axisx.p2c(eachHoveredItem.start);//clicked position relative to the start of this item
			  relativeY = currentMouseY - axisy.p2c(eachHoveredItem.yValue - barTop);
			  widthInPx = axisx.p2c(eachHoveredItem.end) - axisx.p2c(eachHoveredItem.start); // will be from attribute providers

			  var heightInPx = axisy.p2c(eachHoveredItem.yValue + barBottom) - axisy.p2c(eachHoveredItem.yValue - barTop);

	      	  dataToRenderer = {
	      		  eachHoveredItem : eachHoveredItem,
      			  currentMouseX : currentMouseX, //pixel
      			  currentMouseY : currentMouseY, //in pixel
      			  currentTime 	: mx, //millis
      			  currentyValue	: my, //0,1,2..
      			  relativeX 	: relativeX, //in pixel
      			  relativeY 	: relativeY,	//in pixel
      			  widthInPx 	: widthInPx,
      			  heightInPx	: heightInPx

	      	  };
	      	  var isActualItemHovered = null;
	      	  if($.isFunction(hoverItemCallBack)) {
	      		isActualItemHovered = hoverItemCallBack(dataToRenderer);
	      	  }
		      if(!isActualItemHovered) { //if returned true then only do the rest of priority checking and returning else look into the next bucket
		    	  indexOfHoverItems.push(i);
		      }
		    }//for

    	    //only if condition is  true, the array newHoverItems will be created.
    	    //grep Finds the elements of the newHoverItems array which satisfy the filter function
    	    //Fix for ISRM-2593
    	    newHoverItems = $.grep(newHoverItems, function(item, index) {
    	    	return indexOfHoverItems.indexOf(index) == -1;
    	    });
		   return newHoverItems;
		}

        function checkIfHotSpotFound( s, mx, my , itemYValue , currentRowId) {
        	//var barBottom = plot.getBarBottom();
        	var barTop = plot.getBarTop();
        	var hotSpotTop = 0, hotSpotBottom = 0;
        	var rowHotSpotMap = plot.getRowHotSpotMap() ; // rowID as key and HotSpot objects as Value
        	//ADDED FOR CONSIDERATION OF HOTSPOT
        	if(rowHotSpotMap == null || rowHotSpotMap.length == 0) {
        		return;
        	}

   			var hotSpotsInThisRow = rowHotSpotMap[currentRowId], eachHotSpot = null;
   			var eachTask;
   			var startX = 0, limitTo = 0, limitFrom = 0;

   			if(hotSpotsInThisRow  == undefined) {
   				return;
   			}
   			//console.log("hotSpotsInThisRow  " + JSON.stringify(hotSpotsInThisRow));
    		for(var hotSpot = 0;  hotSpot < hotSpotsInThisRow.length ; hotSpot++) {
				eachHotSpot = hotSpotsInThisRow[hotSpot];
				eachTask = s.dataMap[eachHotSpot.itemId];
				if(eachTask == undefined) {
					continue;
				}
				//console.log("eachTask associated  " + JSON.stringify(eachTask));
				limitFrom = eachTask.start; //default START iof not specified
				if(eachHotSpot.startX != undefined) {
					startX = eachHotSpot.startX;
				}
				if	(eachHotSpot.relativeTo == "START") {
					limitFrom = startX + eachTask.start;
				} else if (eachHotSpot.relativeTo == "END") {
					limitFrom = startX + eachTask.end; // in time
				}
				//console.log("limitFrom " + new Date(limitFrom).toUTCString() );

				if(eachHotSpot.widthInTime != undefined) {
					limitTo = limitFrom +  eachHotSpot.widthInTime; //if -ve it will be subtracted
				} else if(eachHotSpot.widthInPixel != undefined) {
					limitTo = s.xaxis.p2c(limitFrom)+ eachHotSpot.widthInPixel; //if -ve it will be subtracted
					limitTo = s.xaxis.c2p(limitTo);			 // converted to in time
				}
	        	if(eachHotSpot.startYPercentage != undefined && eachHotSpot.endYPercentage != undefined) {
	        		//Note : percentage with respect to top of s.gantt.barHeight
	        		//startYPercentage :0,  //from the rowHeight top
		    		//endYPercentage :25,  //from the rowHeight top
	        		hotSpotTop = barTop - (s.gantt.barHeight *eachHotSpot.startYPercentage/100);
	        		//hotSpotBottom = barBottom - (s.gantt.barHeight *(100-eachHotSpot.endYPercentage)/100);
	        		hotSpotBottom = barTop - (s.gantt.barHeight *eachHotSpot.endYPercentage/100);
	        	}

	        	if(limitFrom > limitTo) {
	        		var temp = limitFrom;
	        		limitFrom = limitTo;
	        		limitTo = temp;
	        	}
	        	var limitTop = itemYValue - hotSpotTop,
	        			limitBottom = itemYValue - hotSpotBottom;

   				if((mx >= limitFrom  && mx <= limitTo) &&
        		   		(my <= limitBottom  &&  my >= limitTop)) {
   				 // console.log("my ----------------------" +my + " < = " + limitBottom + "  and >= " + limitTop);

 		    	  eachHotSpot.rowId = currentRowId;
   		    	  eachHotSpot.yValue = itemYValue;
				  var datapoint=  [limitFrom, itemYValue, limitTo]; //keep existing ..Remove later
			           return {
			                   selectedHotSpot: eachHotSpot,
			                   datapoint :datapoint,
			                   details:eachTask // not an item but a hotspot
			            };

        		 } //if

   			}//for

        }


        var mouseMoveEvent = null; // to ensure that the latest events are always fired

        function onMouseMove(e) {
        	mouseMoveEvent = e;
        	if(mouseMoveTimeOut) {
        		return false;
        	}
        	mouseMoveTimeOut = setTimeout(performMouseMoveActions, 100);
        }

        function performMouseMoveActions(touchEvent) {
        	var e = mouseMoveEvent;
        	if(!e) {
        		e =  touchEvent;
        	}
        	if(!plot) {
        		return;
        	}
        	var offset = plot.offset(),
        		options = plot.getOptions(),
        		plotOffset = plot.getPlotOffset(),
        		canvasX = plot.getPageX(e) - offset.left - plotOffset.left,
        		canvasY = plot.getPageY(e) - offset.top - plotOffset.top,
        		s = plot.getSeries(),
            	axisy = s.yaxis, axisx = s.xaxis;

        	if(options.mouseTracker.enable) {
        		enableMouseTracker(e);
        		//plot.getPlaceholder().trigger("trackerMoving", [ tickSelection ]);
        	}
        	if(options.taskTracker.enable) {
        		enableTaskTracker(e); // on mouse move
        	}
        	var oldHoverItem = null;
        	if(options.series.gantt.show) {
        		hoveredArea = plot.findHoveredArea(e);
        		//console.log("hoveredArea ", hoveredArea);
	    		if(hoveredArea != null) {
	    		  switch (hoveredArea.label)  {
	    				case "ROW_HEADER_ITEM": {  //if hoverd on a rowItem
	    					  hoverRowItem = hoveredArea;
	    					  manageCursorOutsidePlotBody();
	    					 // var s = plot.getSeries(), axisy = s.yaxis;
		    		   	       var pos = canvasToAxisCoords({ left: canvasX, top: canvasY });
		    		   	       	   pos.pageX = plot.getPageX(e); //set this to trigger outside
   		   	                       pos.pageY = plot.getPageY(e);  //set this to trigger outside
		    		   	        if(pos.y != undefined) {
		    		   	         	pos.rowId = plot.retrieveActualRowId(Math.round(pos.y));
		    		   	        }
		    		   	  	//TREE ROW HEADER
		    				if(axisy.options.treeNode != undefined && axisy.options.treeNode.nodeLimit != undefined) {
		    					  var multiColumnHeader = axisy.options.multiColumnLabel.header;
		    						if(multiColumnHeader.resizable) { // when cursor moved through the border from top to bottom thru the border
		    							//console.log("ROW_HEADER_ITEM isDragging ", isDragging);
		    							if(!isDragging ) {
		    								hoveredHeaderGridColumn = checkHoveredOnCornerObjects(e);
		    								if(hoveredHeaderGridColumn == undefined) {
		    									placeholder.css('cursor', "default");
		    								}
		    							}
		    						}
		    						var currentX = plot.getPageX(e) - offset.left;// since checking on row header
	    			   	         	var hoveredColumn = checkExactColumDataHovered(currentX, pos.rowId);
	    			   	         	var hoveredNode = null , columnIndex = null;
	    			   	         	if(hoveredColumn != null) {
	    			   	         		hoveredNode = hoveredColumn.hoveredNode;
	    			   	         		columnIndex = hoveredColumn.columnIndex;
	    			   	         	}
	    			   	         	// Additions for New feature : ISRM-4324
	    			   	            hoverRowItem.hoverNodeDetails = {
											pos: pos,
											currentX :  currentX,
											hoveredColumn :  hoveredColumn,
											columnIndex :  columnIndex


	    			   	         	}
	    			   	         	placeholder.trigger("rowHeaderHover", [hoverRowItem, pos,  hoveredNode, columnIndex]);


	    			    	}  else if (options.grid.headerClickable) { //NORMAL ROW HEADER
			    		   	         hoverRowItem = hoveredArea;
			    			    	 placeholder.trigger("rowHeaderHover", [hoverRowItem, pos ]);

			    		   	}
		    			//New feature : ISRM-4324
		    			if(options.rowHeaderHover.autoHighlight) {
	    					 drawHighLightOverlay();
					   	  }

		    			break;
	    			 } //case
    				case "ROW_FOOTER_ITEM": {   //if hoverd on a rowItem
    						manageCursorOutsidePlotBody();
     	     				//console.log( " HOVERED IN rowFooter Area " +  JSON.stringify(hoveredArea));
     	     				 placeholder.trigger("rowFooterHover", [ hoveredArea ]);
    					break;
    				}
    				case "CORNER_AREA": {  //IS HOVERED ON CORNER OBJECTS
    					 // CHECK IF HOVERED ON CORNER AREA WHEN THERE IS A TREE NODE WITH HEADER
	    				 if(axisy.options.treeNode != undefined && axisy.options.treeNode.nodeLimit != undefined) {  // CHECK IF CLICKED ON CORNER AREA WHEN THERE IS A TREE NODE WITH HEADER
	    		    		var multiColumnHeader = axisy.options.multiColumnLabel.header;
	    		    		//console.log('HOVERED ON TREENODE CORNER AREA  multiColumnHeader : ' + JSON.stringify(multiColumnHeader) );
	    		    		if(multiColumnHeader.resizable) {
	    		    			if(!isDragging ){
	    			    				 hoveredHeaderGridColumn = checkHoveredOnCornerObjects(e);
	    			    		 }
	    				    	//console.log("CORNER_AREA hoveredHeaderGridColumn " + JSON.stringify(hoveredHeaderGridColumn));
	    				    	if(hoveredHeaderGridColumn != null && hoveredHeaderGridColumn.isOnBorder == true) {
	    				    		// resizing the column headers
	    					      		placeholder.css('cursor', options.taskResize.cursor);
	    				    	}  else if(!isDragging ) {
	    				    			placeholder.css('cursor', "default");
	    				    	}
	    		    		}
		    		    	 //if column Summary there in tree case and separate hover needed
		    		    	 if(axisx.options.columnSummary.enable && axisx.options.columnSummary.summaryHeaderRenderer != undefined &&
		    		    			 axisx.options.columnSummary.summaryHeader.hoverable) {
		    		    		 var cornercanvasY = plot.getPageY(e) - offset.top;
			    				  hoveredArea = findCornerObjectsInDetail(cornercanvasY ,hoveredArea);
			    				  if(hoveredArea.label == "CORNER_AREA"  && options.grid.cornerBox.hoverable)  { // CORNER AREA  WITH COLUMN SUMMARY
						 	     	//console.log('HOVERED ON TOP_CORNER_AREA clickable : hoveredArea : ' + JSON.stringify(hoveredArea) );
						 	     	placeholder.trigger("cornerAreaHover", [ hoveredArea ]);

			    				  } else if (hoveredArea.label == "COLUMN_SUMMARY_HEADER"  && axisx.options.columnSummary.summaryHeader.hoverable) {
			    					 // console.log('HOVERED ON CORNER AREA COLUMN_SUMMARY_HEADER : hoveredArea : ' + JSON.stringify(hoveredArea) );
					 	     		  placeholder.trigger("columnSummaryHeaderHover", [ hoveredArea ]);
			    				  }
		    		    	 } else if(options.grid.cornerBox.hoverable) { //NORMAL CORNER AREA
			    					//console.log('HOVERED ON NORMAL CORNER AREA  hoveredArea : ' + JSON.stringify(hoveredArea) );
			    					placeholder.trigger("cornerAreaHover", [ hoveredArea ]);
			    			}
	    		    	} else { //NORMAL CORNER AREA
	    		    				if(options.grid.cornerBox.hoverable) { //NORMAL CORNER AREA
	    		    					//console.log('HOVERED ON NORMAL CORNER AREA  hoveredArea : ' + JSON.stringify(hoveredArea) );
	    		    					placeholder.trigger("cornerAreaHover", [ hoveredArea ]);
	    		    				}
	    		    	}
	    				break;
    				  }
    				case "PLOT_BODY" : {
    					//IS ON ANY TASK OBJECT ON PLOT BODY
    					//highlight selected task  & hover item if option specified
    					//console.log("On plot body ----------", hoverItem);
    			   	    oldHoverItem = hoverItem;
    		   	        hoverItem = plot.findItemOnGantt(canvasX, canvasY);
    		   	         if(hoveredHeaderGridColumn != undefined && !isDragging) { // resizing the column headers which is near plotBody
    		   	        	 hoveredHeaderGridColumn = checkHoveredOnCornerObjects(e);
    		   	        }
    		   	        manageCursorOnPlotBody(canvasX, canvasY);
    		   	        if(options.grid.autoHighlight == true) {
			   	    	 	drawHighLightOverlay();
			   	    	}
    	        		var isHoverItemChanged = hoverItem != oldHoverItem && (hoverItem == null || oldHoverItem == null || hoverItem.details != oldHoverItem.details );
	            		var data = {
	            				isHoverItemChanged : isHoverItemChanged
	            		};
	            		//console.log("On plot body ----------isHoverItemChanged ", isHoverItemChanged);
	                    triggerGanttClickHoverEvent("plothover", e , data);      // NORMAL PLOT HOVER
    		    		break;
    				}
    				case "COLUMN_SUMMARY_TICK_AREA" : {
    					 if(hoveredHeaderGridColumn != undefined && !isDragging) { // resizing the column headers which is near plotBody
     		   	        	 //console.log("isDragging " +isDragging + "hoveredHeaderGridColumn.isOnBorder   " + hoveredHeaderGridColumn.isOnBorder );
     		   	        	 hoveredHeaderGridColumn = checkHoveredOnCornerObjects(e);
     		   	        	 manageCursorOnPlotBody(canvasX, canvasY);
     		   	         } else if(!isDragging)  {
     		   	        	 manageCursorOutsidePlotBody();
     		   	         }
    					 if (options.xaxis.columnSummary.hoverable) {
    						 //console.log( " HOVERED IN COLUMN_SUMMARY_TICK_AREA " +  JSON.stringify(hoveredArea.columnSummaryTickArea));
	     	     			 placeholder.trigger("columnSummaryTickHover", [ hoveredArea.columnSummaryTickArea ]);
	     	     		}
		   	  			break;
    				}

    				case "COLUMN_HEADER_AREA" : {
    					//console.log("COLUMN_HEADER_AREA.......isDragging = ",  isDragging);
    					if(!isDragging ) { // in case of row header res
							placeholder.css('cursor', "default");
    					}
    					if (options.columnHeaderHover.interactive) {
    						placeholder.trigger("columnHeaderHover", [ hoveredArea ]);
    					}
						 break;
    				}
    				case "TOP_HEADER_AREA" : {
	   					 if (options.xaxis.topHeader.hoverable) {
	   						 //console.log( " HOVERED IN TOP_HEADER_AREA " ,hoveredArea);
		     	     		 placeholder.trigger("topHeaderHover", [ hoveredArea ]);
		     	     	}
			   	  		break;
   				   }


	    		  } //switch

	    		} else { //if hovered  Area is null
	    			// console.log("ELSE   hoveredHeaderGridColumn " + JSON.stringify(hoveredHeaderGridColumn));
	    			//RESET THE POINTERS ACCORDINGLY WHEN PONTER MOVES TO HEADER AFTER DRAGGING FROM BORDER which is near to teh plot
	    			var multiColumnHeader = axisy.options.multiColumnLabel.header;
	    			if(multiColumnHeader.resizable) {
	    				if(!isDragging ){
	    					 hoveredHeaderGridColumn = checkHoveredOnCornerObjects(e);
	    				 }

		    			if(hoveredHeaderGridColumn != null && hoveredHeaderGridColumn.isOnBorder == true) {
		    				manageCursorOnPlotBody(canvasX, canvasY);
		    			}
	    			}
	    	} // end of else part of if hovered area is null
        	mouseMoveTimeOut = null;


        	var returnFlag = false;
    		if(connections != null && plot.yValueNodeDetailsMap != null) {
    			 returnFlag = triggerConnectionNodeClickEvent(e, false) ;
    			 if(returnFlag) {
        			 placeholder.css('cursor', "default");
    				 mouseMoveTimeOut = null;
    				 clearTimeout(mouseMoveTimeOut);
    				 hoverItem = null;
    				 hoverRowItem = null;
    				 drawHighLightOverlay();
    				 return;
        		}
    		}
        } else {  //OTHER CHARTS
		   	    oldHoverItem = hoverItem;
        		hoverItem = findNearbyItem(canvasX, canvasY, function (s) { return s["hoverable"] != false; });
        }
       // console.log("Out............ .........");

       }

      function manageCursorOnPlotBody(canvasX, canvasY) {

    	  //Define a hotSpot of size options.taskResize.radius on both sides of each task
    		resizeItem = options.taskResize.interactive ? findStartAndEndPoints(canvasX, canvasY) : null;
   	        if (resizeItem != null && resizeItem.resizable != false) {
        		placeholder.css('cursor', options.taskResize.cursor);
        		plot.setEventMode("TASK_RESIZE_MODE");
        	} else	if(resizeItem == null && hoverItem != null) {
    			//CASE : //mouse moves inside that hoverItem after chaging to resize cursor
    			placeholder.css('cursor', "default");
    			plot.setEventMode("TASK_ITEM_DRAG");
        	}
   	        if (resizeItem == null && hoverItem == null) {
    			placeholder.css('cursor', "default");
    			plot.setEventMode("NONE");
        	}
      }
      function manageCursorOutsidePlotBody() {
    		resizeItem = plot.getResizeItem();
   	        if (resizeItem != null && options.taskResize.interactive) {
        		placeholder.css('cursor', "default"); // reset tt to default
        		//console.log("CASE resizeItem  is not null but immediately moved on ROWHEADER or COLUMN SUMMARY outside the actual plot area" );
        	}
      }

      function checkExactColumDataHovered (canvasX,  rowId) {

        	var s = plot.getSeries(), 	axisy = s.yaxis;
        	var multiColumnLabelObject = axisy.options.multiColumnLabel;
        	var headerColumns = multiColumnLabelObject.columns;
        	var left, eachColumnWidth, nodeLevel, property, currentNode;
        	var rowHeaderNode = series.rowIdRowObjectMap[rowId];
        	for ( var colIndex = 0; colIndex < headerColumns.length;colIndex++) {
        		 var eachHeaderColumn = headerColumns[colIndex];
        		 var eachColumnCoordinate = columnIndexCoordinateMap[colIndex];
        		 if(eachColumnCoordinate != null) {
	        		 left = eachColumnCoordinate.startX;
	        		 eachColumnWidth = eachHeaderColumn.width;
	       			 if(canvasX >= left && canvasX <= (left + eachColumnWidth)) {
	       					nodeLevel =  eachHeaderColumn.nodeLevel;
	           		 		property = eachHeaderColumn.cellProperty;
	                	    currentNode = retrieveNodeForAttribute(property, rowHeaderNode, nodeLevel);
	       				   return {
	       						columnIndex : colIndex,
	       						hoveredNode : currentNode,
	       						left : left,
	       						hoveredProperty : property,
	       						hoveredHeaderColumn :  eachHeaderColumn
	       					};
	       			}
        		 }
       		}   //for
        }


        function onMouseLeave(e) {

            if(options.series.gantt.show) {
	            if(options.taskDrag.draggingEffect.enable) {
					plot.setShadowItem(null);
				}
	            if(options.rectangleSelect.interactive) {
	            	plot.selectRectangle = null;
	            	plot.rectangleStartPosition=null;
	            }
		        setTimeout(function() {
		        	hoveredArea = null;
	        		hoverItem = null;
	        		hoverRowItem = null;
	        		hoverRow = null;
	        		mouseMoveTimeOut = null;
	        		clearTimeout(mouseMoveTimeOut);
		        	plot.drawHighLightOverlay();
		        	if (options.grid.hoverable) {
		        		if(options.series.gantt.show ) {
		        			triggerGanttClickHoverEvent("plotleave", e);
		        		} else {
		        			triggerClickHoverEvent("plotleave", e, function (s) { return s["hoverable"] != false; });
		        		}
		        	}
		        }, 150);

            }

        }

        function enableMouseTracker(e) {
        	var offset = plot.offset(),
        		options = plot.getOptions(),
        	plotOffset = plot.getPlotOffset(),
        	currentMouseX = plot.getPageX(e) - offset.left  - plotOffset.left,
    		currentMouseY = plot.getPageY(e) - offset.top - plotOffset.top;
        	var maxHorizontalWidth = plotWidth;
        	//return if mouse hovering is in the row Headers
        	if(options.mouseTracker.moveOnRowHeader && currentMouseX < 0) {
        		//the mouse pointer will be moved in row header as well
        		//and will be darwn only if renderer for row header hover is not called.
        		currentMouseX = plot.getPageX(e) - offset.left;
        		maxHorizontalWidth  = plotWidth + plotOffset.left + plotOffset.right;
        	}
        	if(currentMouseX < 0 || currentMouseY < 0 || currentMouseX > maxHorizontalWidth   || currentMouseY > plotHeight){
        		return;
        	}
        	currentMousePosition = {
        			currentMouseX :currentMouseX,
        			currentMouseY :currentMouseY
        	};
        	plot.drawMouseTrackerOnMouseMove(currentMousePosition);
        	var data = {
        			currentMousePosition  :currentMousePosition
        	}
        	plot.getPlaceholder().trigger("mouseTrackerMoved", [ data ]);

        }
        /**
         * This function will be called on any plot to draw the mouse tracker on mouse movement
         * @param should be of the form currentMousePosition = {
        			currentMouseX :currentMouseX,
        			currentMouseY :currentMouseY
        	};
         */
        plot.drawMouseTrackerOnMouseMove = function(currentMousePosition) {
        	this.setCurrentMousePosition(currentMousePosition);
			this.drawHighLightOverlay();
        };

        /**
         * To enable a task marker when a markerTaskObject is supplied and the
         * taskMarker is enabled. called on mouse move
         */
        function enableTaskTracker(e) {
        	var offset = plot.offset(),
        		plotOffset = plot.getPlotOffset(),
                currentMouseX, currentMouseY;
        		currentMouseX = plot.getPageX(e) - offset.left - plotOffset.left;
        		currentMouseY = plot.getPageY(e) - offset.top - plotOffset.top;

        	//return if mouse hovering is in any row Headers
        	if(currentMouseX < 0 || currentMouseY < 0 || currentMouseX > plotWidth || currentMouseY > plotHeight){
        		return;
        	}
        	 var trackedTaskForMarking = plot.getTrackedTask();
        	if(trackedTaskForMarking != null) {
        		trackedTaskForMarking.currentMouseX = currentMouseX;
         		trackedTaskForMarking.currentMouseY = currentMouseY;
        		 if(!plot.isTrackerFreezed()) { //if not freezed, set the task start and end position
        		 	trackedTaskForMarking.drawMouseX = currentMouseX - trackedTaskForMarking.width/2;  //current ponter will be the postion to the middle
      	        	trackedTaskForMarking.drawMouseY = currentMouseY;
        		 } else { // if freezed
        			 calculateFreezedTracker();
        		 } //else if freezed
        		plot.drawTaskTrackerOnMouseMove(trackedTaskForMarking);
        	 	var data =  {
            			trackedTaskForMarking : trackedTaskForMarking
            	};
        	 	plot.getPlaceholder().trigger("taskTrackerMoved", [ data ]);
        	}

        }

        /**
         * Common API that should be invoked on any plot for setting tracked Task.
         * trackedTaskForMarking is of the form
         * {	drawMouseX :
         * 		drawMouseY :
         * 		chronosId :
         * 		start	:
         * 		end		:
         * 		//if freezed it will have  attributes followTime and followRowyValue
         * }
         */
        plot.drawTaskTrackerOnMouseMove = function(trackedTaskForMarking) {
        	//Note that this API is different
        	plot.setTrackedTaskForMarking(trackedTaskForMarking); //this is set in plot which doesn't have the actual task ..just to draw the tracker lines
        	plot.drawHighLightOverlay();
        };
        /**
         * Once freezed , the tracker should not folow the scroll or mouse points
         * If freezePoints are specified on freezing, the freezing happens in that poistion
         * irrespective of the tracked task. But the width of task remains the same
         */
       function calculateFreezedTracker() {
    	   // if no data, no need of a tracker call
    	   if(!Object.keys(plot.getDataMap()).length) {
    		   return;
    	   }
    	   var trackedTaskForMarking = plot.getTrackedTask();
    	   var series = plot.getSeries() ,  options = plot.getOptions();
    	   // if freezed ie not needed to follow scroll.. should be fixed
   			var trackerX , trackerY;
   			var direction  = options.taskTracker.freezeDirection;
		 	var actualYValueOfRow = series.rowYvalueMap[trackedTaskForMarking.rowId];
        	if (plot.areWrapRowsEnabled() ) {     //On demand wrap cannot be predicted use scrollToTimeAndItemRowOnTop instead
  	    		var wrapIndex = plot.getTaskIdWrapIndexMap()[trackedTaskForMarking.chronosId];
  	    		trackerY =  series.yaxis.p2c(series.actualFirstWrapDisplayMap[actualYValueOfRow]  + wrapIndex);
        	} else {
        		trackerY =  series.yaxis.p2c(actualYValueOfRow);
        	}
        	trackerX = parseInt(series.xaxis.p2c(trackedTaskForMarking.start));

        	//console.log('start time'  , trackerX , "followTime" , series.xaxis.p2c(trackedTaskForMarking.followTime))
		 	switch(direction) {
   			 	case "vertical" :  {
   			 		if (trackedTaskForMarking.followTime != undefined) {
   			 			trackedTaskForMarking.drawMouseX = series.xaxis.p2c(trackedTaskForMarking.followTime) ;
   			 		} else {
   			 			trackedTaskForMarking.drawMouseX = trackerX;
   			 		}
   			 	    // row tracker can move. horizontal aslo drawn at freezed position
   			 	    trackedTaskForMarking.drawMouseY = trackedTaskForMarking.currentMouseY ? trackedTaskForMarking.currentMouseY : trackedTaskForMarking.drawMouseY;
 		        break;
       			 }
       			 case "horizontal" : {
 		        	if(trackedTaskForMarking.followRowyValue != undefined) {
 		        		trackedTaskForMarking.drawMouseY = series.yaxis.p2c(trackedTaskForMarking.followRowyValue) ;
 		        	} else {
 		        		trackedTaskForMarking.drawMouseY = trackerY;
 		        	}
 		        	// column tracker can move and also point the cursor to center
 		        	trackedTaskForMarking.drawMouseX = trackedTaskForMarking.currentMouseX ? trackedTaskForMarking.currentMouseX - trackedTaskForMarking.width/2: trackedTaskForMarking.drawMouseX;
 	 		        break;
       			 }
       			 case "both" : {
       				 if(trackedTaskForMarking.followTime != undefined && trackedTaskForMarking.followRowyValue != undefined) {
       					trackedTaskForMarking.drawMouseX = series.xaxis.p2c(trackedTaskForMarking.followTime);
    	        		trackedTaskForMarking.drawMouseY = series.yaxis.p2c(trackedTaskForMarking.followRowyValue);
       				 } else {
       					 trackedTaskForMarking.drawMouseX = trackerX;
       					 trackedTaskForMarking.drawMouseY = trackerY; // both will not move
       				 }
       			 }
   			 }
        }

        /**
         * function that draws vertical, horizontal or both lines at mouse position with width as
         * the task object selected .
         */
        function drawTaskTracker(taskTracker) {

        	var trackedTaskForMarking = plot.getTrackedTask();
        	if(trackedTaskForMarking == null) {
        		return;
        	}
        	if(plot.isTrackerFreezed()) {
        		 calculateFreezedTracker();
        	}
			hctx.lineWidth = taskTracker.lineWidth;
        	hctx.strokeStyle = taskTracker.lineColor;
			var y = trackedTaskForMarking.drawMouseY;
			var leftPos = trackedTaskForMarking.drawMouseX; // for vertical line
			var rightPos = leftPos + trackedTaskForMarking.width; //for vertical line

			switch(taskTracker.direction) { // set currentMouseY and x value according to move direction. limiting
				case 'horizontal' : {
					//prevent drawing on top header
					if(y < 0) {
						y = 0;
					}
					if (taskTracker.dashedLine) {
						hctx.createDashedLine(0, y, plotWidth, y);
					} else {
						hctx.beginPath();
						hctx.moveTo(0, y);
						hctx.lineTo(plotWidth, y);
						hctx.stroke();
					}
					break;
				}
			 case 'vertical' : {
					if (taskTracker.dashedLine) {
						//left end of task
						if(leftPos > 0) { //don't draw in y row headers
							hctx.createDashedLine(leftPos, 0, leftPos, plotHeight);
						}
						//right end of the task
						if(rightPos < plotWidth && rightPos > 0) {//don't draw in y row headers
							hctx.createDashedLine(rightPos, 0, rightPos, plotHeight);
						}
					} else {
						hctx.beginPath();
						if(leftPos > 0) { //don't draw in y row headers
							hctx.moveTo(leftPos, 0);
							hctx.lineTo(leftPos, plotHeight);
						}
						if(rightPos < plotWidth && rightPos>0) { //don't draw in y row headers
							hctx.moveTo(rightPos, 0);
							hctx.lineTo(rightPos, plotHeight);
						}
						hctx.stroke();
					}
					break;
				}
				case 'both' : {
					if (taskTracker.dashedLine) {
						//xrange.from, yrange.from , xrange.to, yrange.to
						//horizontal
						hctx.createDashedLine(0, y, plotWidth, y);
						//left end of task -vertical
						if(leftPos > 0) { //don't draw in y row headers
							hctx.createDashedLine(leftPos, 0, leftPos, plotHeight);
						}
						//right end of the task - vertical
						if(rightPos < plotWidth && rightPos > 0) {//don't draw in y row headers
							hctx.createDashedLine(rightPos, 0, rightPos, plotHeight);
						}

					} else {
						hctx.beginPath();
						hctx.moveTo(0, y);
						hctx.lineTo(plotWidth, y);
						if(leftPos > 0) {//don't draw in y row headers
							hctx.moveTo(leftPos, 0);
							hctx.lineTo(leftPos, plotHeight);
						}
						if(rightPos < plotWidth && rightPos > 0) {//don't draw in y row headers
							hctx.moveTo(rightPos, 0);
							hctx.lineTo(rightPos, plotHeight);
						}
						hctx.stroke();
						hctx.closePath();
					}
					break;
				}
			}

        }
        /**
         * Action triggered when clicked on header nodes
		parentNode (merged) in tree - in case of  multi column headers
         */


        plot.triggerTreeMergeHeaderClickableAction = function(e, hovedNodeObject) {
        	//console.log(  " hovedNodeObject ", hovedNodeObject);
        	ctrlPressed = e.ctrlKey;
        	shiftPressed = e.shiftKey;
            //if all childNodes are highlighted, deselect all, otherwise  select all
        	if(!shiftPressed || ctrlPressed) { //resetting
	 	       	initialHighlightedRowYValue = series.rowYvalueMap[hovedNodeObject.childNodes[0].rowId];
	 	       	initialHighlightedNode = hovedNodeObject;
 	       	}
	        if(!ctrlPressed && !shiftPressed) {
    		 	clearAllRowhighlights();
			 	highlightAllChildNodes(hovedNodeObject);

	        } else if(ctrlPressed  &&  isAllChildNodesHighlighted(hovedNodeObject)) {
	        	//deselect all childnodes iteratively
    		   removeAllHighlightedChildNodes(hovedNodeObject);

	       	} else if(ctrlPressed  && !isAllChildNodesHighlighted(hovedNodeObject)) {
	        	//select all childNodes iteratively and highlight all
           		highlightAllChildNodes(hovedNodeObject);

	       	} else if(shiftPressed) { //all child nodes not highlighted
       			clearAllRowhighlights();
 	       		//for the firts time shift press
 	       		 if (initialHighlightedNode == null && initialHighlightedRowYValue != null) {
	    			initialHighlightedNode = hovedNodeObject;

	    		} else if (initialHighlightedRowYValue == null) {
	       			initialHighlightedRowYValue = series.rowYvalueMap[hovedNodeObject.childNodes[0].rowId];
	    		}

	       		highlightAllChildNodes(hovedNodeObject);// highlight last pressed siblings as well
	       		if(initialHighlightedNode != null) {
	       			highlightAllChildNodes(initialHighlightedNode); // highlight initial highlighted rows siblings as well
	       		}
        		var currentRowHeaderNode = {}
        		currentRowHeaderNode.yValue= series.rowYvalueMap[hovedNodeObject.childNodes[0].rowId]  ;// the starting childNode Yvlaue of this merged Parent
            	checkForRowsToHighlightOnShiftKeyDown(currentRowHeaderNode);

	        }
            plot.draw();
        }
        /**
         * remove all highlighted childnodes recursively given a parent treeNode
         */
        function removeAllHighlightedChildNodes(hovedNodeObject) {
        	var childNodes = hovedNodeObject.childNodes;
        	for(var i = 0 ; i < childNodes.length ; i++) {
    			var eachNode = childNodes[i];
    			if(eachNode.childNodes && eachNode.childNodes.length > 0 ) {
    				removeAllHighlightedChildNodes(eachNode);
    			} else  { // if not highlighted
    				removeHighlightForRow(eachNode.rowId);
    			}
    		}
        }
        /**
         * highlight all  childnodes recursively given a parent treeNode
         */
        function highlightAllChildNodes(hovedNodeObject){
        	var childNodes = hovedNodeObject.childNodes;
        	for(var i = 0 ; i < childNodes.length ; i++){
    			var eachNode = childNodes[i];
    			if(eachNode.childNodes && eachNode.childNodes.length > 0 ) {
    				highlightAllChildNodes(eachNode);
    			} else  { // if not highlighted
            		highlightARow(eachNode.rowId) ;
    			}
    		}
        }



        /**
         * function triggered when a header click event is fired and highlight option is selected
         * @param e
         */
        plot.triggerHeaderClickableAction = function(e) {
        	//console.log(hoverRowItem ,  " hoveredArea ", hoveredArea);
        	ctrlPressed = e.ctrlKey;
        	shiftPressed = e.shiftKey;
        	if(!ctrlPressed && !shiftPressed) {
        		clearAllRowhighlights();
        	}
            if (hoverRowItem != null && hoverRowItem.label == "ROW_HEADER_ITEM" ||
            		hoveredArea!=null && hoveredArea.label == "ROW_HEADER_ITEM") {
               	addRowToHighlightList(hoverRowItem, ctrlPressed, shiftPressed );
            }
            plot.draw();
        }

        function checkForTaksToHighlightOnShiftKeyDown() {
        	var initialHighlightedItem = null,hoveredTask = null,
        			initialHighlightedItems = highlights,
        			length = 0;
        	//Note index Of Highlight will be the taskiD itslef
        	for(var index in initialHighlightedItems) {
        		taskId = index;
        		length++;
        	}
        	var focusedTaskItem = hoverItem.details;
        	if((plot.firstHighlightedItem == null || length == 0) && focusedTaskItem != null) {
        		//Adding to highlights if shudt pressed on a single item
        		plot.firstHighlightedItem = hoverItem.details;
        		highlights[focusedTaskItem.chronosId] = focusedTaskItem;
        	} else {
        		initialHighlightedItem = plot.firstHighlightedItem;
			}
        	if(initialHighlightedItem != null && length > 0 && hoverItem != null) { //only if atleast one item is highlighted
	       	 		hoveredTask = hoverItem.details;
	       	 		//get the end item
	       	 	var startRow = initialHighlightedItem.yValue,  //start yValue
       	 			startTime = initialHighlightedItem.start,
       	 			endRow =  hoveredTask.yValue,	 // end yValue
	       	 		endTime = hoveredTask.end;

	       	 	if(endTime< startTime) {
	       	 		//shift selection backward
	       	 		startTime = initialHighlightedItem.end;
	       	 		endTime = hoveredTask.start;
	       	 	}
	       	 	clearAllhighlights(); //need for backward clearing
		   		clearAllRectangleSelectHighlightList();
			   		//Added for ISRM-7781
		   		addTaskToHighlightList(initialHighlightedItem); // to add initially highlighted item to highlights after clearing all highlights
	       	 	addAllItemsInRangeToRectangleHighlights(startRow, startTime, endRow, endTime, initialHighlightedItem);
        	}
        }

        /**
         *
         * @param startRow - the actual yValue of the map where rectangle starts
         * @param startTime - the actual time in milliseconds where the rectangle starts
         * @param endRow -the actual yValue of the map where rectangle ends
         * @param endTime - the actual time in milliseconds where the rectangle ends
         * @initialHighlightedItem - highlighted items passed when the shift key is pressed
         *
         *  This function adds to highlight list if a start or an end of a task is selcted thru rectangle select
         *  and also for shift key press selection
         */
        function addAllItemsInRangeToRectangleHighlights(startRow, startTime, endRow, endTime, initialHighlightedItem) {
	      	if(startTime > endTime  ) {
	      		//REVERSE OR BACKWARD SELECTION
	      		 var temp = startTime;
	      		startTime = endTime;
	      		endTime = temp;
	      	}
	      	//start  & end time clipped
	      	if(startTime<= series.xaxis.min) {
	      		startTime =  series.xaxis.min ;
	      	}
	      	if(endTime>= series.xaxis.max) {
	      		endTime =  series.xaxis.max ;
	      	}
	      	if(startRow > endRow ) {
	 			var tempRow = startRow; //interchange if selected upward
	 			startRow = endRow;
	 			endRow = tempRow;
	 		}
	    	//start and endRow clipped
	      	if(startRow<= series.yaxis.min) {
	      		startRow =  Math.ceil(series.yaxis.min) ;
	      	}
	      	if(endRow>= series.yaxis.max) {
	      		endRow =  Math.ceil(series.yaxis.max);
	      	}


        	var currentSeries = plot.getSeries();
        	var oneDayMillis = 24*60*60*1000;
        	var dataMapRowIndex, dataMapColumnIndex,  resetEndTime, resetStartTime;//, displayedRowIds;
        	var rowIndexMap = currentSeries.rowMap;
        	var columnIndexMap = currentSeries.columnMap;
        	var dataMap = currentSeries.dataMap;
        	resetStartTime = plot.resetViewPortTime(startTime);
        	resetEndTime = plot.resetViewPortTime(endTime);
        	 var options = plot.getOptions();
        	var passingThroughTask = options.rectangleSelect.passingThroughTask;

        	var normalSpanMillis = (currentSeries.gantt.normalMaximumDaySpan * oneDayMillis); // to check the ending tasks also in the open view range
        	resetStartTime = resetStartTime - normalSpanMillis;  //fetching normalDaySpan buckets ahead

        	//console.log("startRow " , startRow  ,  "endRow ", endRow);
    		for (var row = startRow;  row <= endRow; row++) {
    			var drawRowId = plot.retrieveActualRowId(row);
    			if(drawRowId != undefined) {
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
				            			if(eachTask != null &&  eachTask !=  undefined) {
				            				if(initialHighlightedItem != null) {
				            					//Modified for ISRM-7781
				            					if(((eachTask.start >= startTime && eachTask.start <= endTime) ||
						            					 (eachTask.end <= endTime   && eachTask.end >= startTime)) &&
					            						initialHighlightedItem.chronosId != taskObjectId) {
				            						//Don't again add to highlight the initial Item
				            						plot.getyValueConsideringWrap(eachTask);
				            						if(row == eachTask.yValue) {
				            							 addTaskToHighlightList(eachTask);
				            						}
					            				}
					            			} else if((eachTask.start >= startTime && eachTask.start <= endTime) ||
						            					 (eachTask.end <= endTime   && eachTask.end >= startTime) ) {
				            					  //Case :  RECTANGLE_SELECT
					            				  plot.getyValueConsideringWrap(eachTask);
				            	         		  if(row == eachTask.yValue) {
					            					addTaskToRectangleSelectHighlightList(eachTask);
				            	         		  }

				            				}//else
			            					if(passingThroughTask && eachTask.start < startTime &&  eachTask.end > endTime)  {
	  											  plot.getyValueConsideringWrap(eachTask);
	  											  if(row == eachTask.yValue) {
				 									addTaskToRectangleSelectHighlightList(eachTask);
				 									// Use this same option for  shift rectangular selection area
				 									addTaskToHighlightList(eachTask);
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
        				var longTaskObjectIdArray = plot.getLongRangeTaskIdArray(currentSeries, dataMapRowIndex );
        				if (longTaskObjectIdArray != undefined) {
	        				for(var ltaskID = 0;  ltaskID < longTaskObjectIdArray.length ; ltaskID++) {
            					var longTaskObjectId = longTaskObjectIdArray[ltaskID];
	            				var eachLongTask  = dataMap[longTaskObjectId];
	            				if(initialHighlightedItem != null) {
	            					if(((eachLongTask.start >= startTime && eachLongTask.start <= endTime) ||
			            					 (eachLongTask.end <= endTime   && eachLongTask.end >= startTime)) &&
		            						initialHighlightedItem.chronosId != longTaskObjectId) {	//Don't again add to highlight the initial Item
		            					 plot.getyValueConsideringWrap(eachLongTask);
	            						 if(row == eachLongTask.yValue) {
	            							 addTaskToHighlightList(eachLongTask);
	            						 }
		            				}
	            				} else if((eachLongTask.start >= startTime && eachLongTask.start <= endTime) ||
		            					 (eachLongTask.end <= endTime   && eachLongTask.end >= startTime) ) {
	            						//Case :  RECTANGLE_SELECT
	            						 plot.getyValueConsideringWrap(eachLongTask);
	            						if(row == eachLongTask.yValue) {
	            							 addTaskToRectangleSelectHighlightList(eachLongTask);
	            						 }

	            				}//else
	            				if(passingThroughTask && eachLongTask.start < startTime &&  eachLongTask.end > endTime)  {
	            					plot.getyValueConsideringWrap(eachLongTask);
	            					if(row == eachLongTask.yValue) {
	            						addTaskToRectangleSelectHighlightList(eachLongTask);
	            						// Use this same option for  shift rectangular selection area
	            						addTaskToHighlightList(eachLongTask);
	 								}
	            				}
            				}//for
        				}
        			}
    			}

    	} //outer for

       }

        function addRowToHighlightList(rowHeaderObject, ctrlPressed, shiftPressed) {
        	var rowHeaderItem = rowHeaderObject.rowHeaderInfo;
        	  var rowIdAttribute = options.series.gantt.rowIdAttribute;
        	  var rowId;// index Of Highlight will be the rowHeader Id itslef
        	  if(series.rootTreeNode == undefined) {
        		  rowId = rowHeaderItem[rowIdAttribute]; //~ row ID value from <rowIdattaribute>
				} else {
					//if tree
					rowId = rowHeaderItem.rowId; //~ row ID value is to be taken from Node structure in case of tree
				}
	         // clear highlights if ctrl is NOT pressed
	       	 var unselected = false;
	       	 if(!shiftPressed || ctrlPressed) {
	       		initialHighlightedRowYValue = hoverRowItem.yValue;
	       		initialHighlightedNode = null; // reset this here
	       	 }
       	    if(!ctrlPressed && !shiftPressed && isRowHighlighted(rowId)) {
        		  removeHighlightForRow(rowId);
          		  unselected = true;
          		   var rowSelection = {
                   		rowHeaderItem :  rowHeaderItem,
                		selected : false
                	};
        			placeholder.trigger("rowHeaderSelection", [rowSelection]);
        	} else if(!ctrlPressed && !shiftPressed) {
        		clearAllRowhighlights();
       	    } else if (ctrlPressed  && isRowHighlighted(rowId)){
        	    removeHighlightForRow(rowId);
        		unselected = true;
        			rowSelection = {
                   		rowHeaderItem :  rowHeaderItem,
                		selected : false
                	};
        			placeholder.trigger("rowHeaderSelection", [rowSelection]);
        	} else if(shiftPressed) {
        		clearAllRowhighlights();
        		if(initialHighlightedRowYValue == null) {
        			initialHighlightedRowYValue = hoverRowItem.yValue;
        		}
        		unselected = checkForRowsToHighlightOnShiftKeyDown(rowHeaderObject);
        	}

            if (rowId != null && !unselected ) {
					highlightARow(rowId) ;
					rowSelection = {
						rowHeaderItem :  rowHeaderItem,
						selected : true
					};
					placeholder.trigger("rowHeaderSelection", [rowSelection]);

            }
        }
        /**
         * Function to add the rows to highlight list in shift key pressed action.
         */
        function checkForRowsToHighlightOnShiftKeyDown(rowHeaderObject) {
        	var currentRowYValue = rowHeaderObject.yValue, series = plot.getSeries();
        	if(initialHighlightedRowYValue != null ) { //only if one item is highlighted
        		var startTickValue, endTickValue;
	       	 		//get the end item 	in both directions
        		if(initialHighlightedRowYValue < currentRowYValue) {
        			startTickValue = initialHighlightedRowYValue;  //start yValue
       	 			endTickValue =  currentRowYValue;	 // end yValue
        		} else {
        			startTickValue = currentRowYValue;   //start yValue
       	 			endTickValue =  initialHighlightedRowYValue;	 // end yValue
        		}
		       	for ( var eachRowYValue = startTickValue; eachRowYValue <= endTickValue; eachRowYValue++) {
		       		eachRowId = plot.retrieveActualRowId(eachRowYValue);
		       		rowHighlights[eachRowId]  = true;
		       		var rowSelection = {
		               		rowHeaderItem :  series.rowIdRowObjectMap[eachRowId],
		            		selected : true
		            	};
		       		placeholder.trigger("rowHeaderSelection", [rowSelection]);
		       	 }
        	}
        	return true;

        }

        function isRowHighlighted(rowId) {
        	if(!rowHighlights[rowId]) {
        		return false;
        	} else if (rowHighlights[rowId] == true) {
        		return true;
        	}
        }

        /**
         * this will return a 1D array of  all the highlighted row Ids
         */

        function getAllRowHighlights() {
        	var rowHighlightsArray = new Array();
        	for(var index in  rowHighlights) {
      		  rowHighlightsArray.push(index);
        	}
        	return rowHighlightsArray;
        }

        //This will add this row with this ID to highlighted list
        function highlightARow(rowId) {
        	var isAlreadyHighlighted = isRowHighlighted(rowId);
        	if(!isAlreadyHighlighted) { //if false only add to list
        		     rowHighlights[rowId] = true;
	        		 plot.draw();
     		  }
        }
        /**
         * highlight the set of rows. If it is a leaf node in tree,
         *  it in turn select the parents as well.
         */
        function highlightRows(rowIds) {
        	 for(var index in  rowIds) {
        		 var rowId = rowIds[index];
	        	var isAlreadyHighlighted = isRowHighlighted(rowId);
	        	if(!isAlreadyHighlighted) { //if false only add to list
	        		  rowHighlights[rowId] = true;
	     		}
        	 }
        	 plot.draw();
        }

        //This will remove the row with this ID from the highlighted list and redraw the plot
        function removeHighlightForRow(rowId) {
        	delete  rowHighlights[rowId];

        }

        //This will clear all highlights added for rows in the plot
        function clearAllRowhighlights() {
        	 for(var index in  rowHighlights) {
        		delete  rowHighlights[index];
        	}

        }
        /**
         * function to check if the mouse is hovered on a row Header, footer or in any corner area if so return the corresponding Object
         * @param event
         * @returns each Object area. If it is on plotBody , it will return null
         */

        function findHoveredArea(event) {
        	plot = this;
        	var offset = plot.offset(), //eventHolder.offset(),
              	    plotOffset = plot.getPlotOffset() ,
              	    canvasX = plot.getPageX(event) - offset.left,
              	    canvasY = plot.getPageY(event) - offset.top,
      	            hoveredRowHeaderObject = null;
            var series = plot.getSeries(),
             	    plotWidth = plot.width(),
             	    plotHeight = plot.height();
            var	axisy = series.yaxis,
            	axisx = series.xaxis, hoveredRow,
            	tickValue = -1, relativeX, relativeY;
            	var yPosn = canvasY - plotOffset.top; //actual canvas pixel coordinates
            	//Added for ISRM-8275
            	if(axisy.c2p == undefined) {
            		return;
            	}
                var my = axisy.c2p(yPosn);//convert canvas coordinates to axis to find row YValue

      	   if(canvasX > plotOffset.left &&  canvasX < (plotOffset.left + plotWidth)  &&
      			  canvasY > plotOffset.top && canvasY < (plotOffset.top + plotHeight)) {
      		   //ON PLOT BODY
      		   //This will include column headers as well as PLOT_BODY
		        var newCanvasX = canvasX - plotOffset.left,
		        newCanvasY = canvasY - plotOffset.top;
		        hoverItem = plot.findItemOnGantt(newCanvasX, newCanvasY);
		        tickValue =  Math.round(my);
		        var rowId = plot.retrieveActualRowId(tickValue);
		        if(rowId == undefined) {
		        	hoveredRow = null;
		        	drawHighLightOverlay();
		        	//ENSURE that hovering happens as plot_body for empty rows as well.
		        }
		        hoveredRow = series.rowIdRowObjectMap[rowId];
		    	return  {
		    		hoverItem: hoverItem,
		    		label : "PLOT_BODY",
		    		currentPosition: {
							x: newCanvasX,
							y : newCanvasY
					},
					yValue :tickValue,
					hoveredRow : hoveredRow
		    	};
	      } else if(canvasX < plotOffset.left) { //POSITIONED ON  left OF PLOT
	      	   //Check if hovered on Ylabel
      	    	if(canvasY > plotOffset.top && canvasY < (plotOffset.top + plotHeight)) { //Actual labels
	      	    	if(my != undefined) {
	          	    	tickValue =  Math.round(my);
	          	    	rowId = plot.retrieveActualRowId(tickValue);
	          	    	hoveredRowHeaderObject = series.rowIdRowObjectMap[rowId];
	          	    }
	      	    	if( hoveredRowHeaderObject == undefined ) {
	      	    		return null;
	      	    	}  else
						return {
	      	    				label : "ROW_HEADER_ITEM",
								rowHeaderInfo : hoveredRowHeaderObject,
								currentPosition: {
										x: canvasX,
										y : yPosn
								},
								yValue:tickValue


						    };
      	    	} else if(canvasY < plotOffset.top) { //corner area on LEFT TOP
      	    	    relativeX =  canvasX - cornerObjects.topLeftCorner.left;//clicked x position relative to the left of the corner area
      			    relativeY = canvasY - cornerObjects.topLeftCorner.top; //clicked y position relative to the top of the corner area
      	    		return {
      	    			label : "CORNER_AREA",
						cornerArea : cornerObjects.topLeftCorner,
						cornerPosition: "TOP_LEFT_CORNER",
						currentPosition: {
								x: canvasX,
								y : canvasY,
								relativeX :relativeX,
								relativeY: relativeY
						}
				    };

      	    	} else if(canvasY > (plotOffset.top + plotHeight)) { //corner area on LEFT BOTTOM
      	    	    relativeX =  canvasX - cornerObjects.bottomLeftCorner.left;//clicked x position relative to the left of the corner area
    			    relativeY = canvasY - cornerObjects.bottomLeftCorner.top; //clicked Y position relative to the top of the corner area
      	    	   return {
      	    			cornerArea : cornerObjects.bottomLeftCorner,
						cornerPosition: "BOTTOM_LEFT_CORNER",
						currentPosition: {
								x: canvasX,
								y : canvasY,
								relativeX :relativeX,
								relativeY: relativeY
						},
						label : "CORNER_AREA"
				    };
      	    	}

      	    } else if (canvasX > (plotWidth + plotOffset.left)) {  //POSITIONED ON  right OF PLOT
      	    	if(canvasY > plotOffset.top && canvasY < (plotOffset.top + plotHeight)) {
      	    			//positioned on entire right avoiding corner areas
		      	    	if(my != undefined) {
		          	    	tickValue =  Math.round(my);
		          	    	rowId = plot.retrieveActualRowId(tickValue);
		    		        hoveredRowHeaderObject = series.rowIdRowObjectMap[rowId];
		      				if( hoveredRowHeaderObject == null ) {
		         	    		return null;
		      				}
		          	    }
		      	    	var isTree = (axisy.options.treeNode != null);
		      	    	var isLeafNode =  isTree  &&  !(hoveredRowHeaderObject.nodeLevel <= axisy.options.treeNode.nodeLimit );
		      	    	if(!axisy.options.rowFooter.enable  && axisy.options.position == "right") { //NOT ROW FOOTER ie ROW HEADER ON RIGHT
		      	    		//YLabel on right. Both Ylabel on Right & row Footer not supported.
			      	    	 return {
			      	    		 		rowHeaderInfo : hoveredRowHeaderObject,
										currentPosition: {
												x: canvasX,
												y : canvasY
										},
										yValue:tickValue,
										label : "ROW_HEADER_ITEM"
								    };
		      	    	} else if(axisy.options.rowFooter.enable) {
		      	    		//Check if hovered on footer on right : Asumption Y axis on left and X axis on top

		         	    		var tickHeight =  Math.round(axisy.p2c(1) - axisy.p2c(0));
		         	    		var top = plotOffset.top + Math.round(axisy.p2c(tickValue) - (tickHeight/2));
		     					return {
		     							label : "ROW_FOOTER_ITEM",
		     							yValue:tickValue,
		     							rowHeaderObject : hoveredRowHeaderObject,
		     							isLeafNode :isLeafNode,
		     							footerArea : {
		     								left: plotOffset.left + plotWidth,
		     								top: top,
		     		            			width :  axisy.options.rowFooter.width,
		     		            			height : tickHeight
		     							},currentPosition: {
		     								x: canvasX,
		     								y : canvasY
		     							},
		     							drawingContext : ctx
		     					    };

		      	    	}
      	    	} else if(canvasY < plotOffset.top && canvasX > (plotWidth + plotOffset.left)) {
      	    	    relativeX =  canvasX - cornerObjects.topRightCorner.left;//clicked x position relative to the left of the corner area
  			        relativeY = canvasY - cornerObjects.topRightCorner.top; //clicked y position relative to the top of the corner area
      	    		return {
      	    			label : "CORNER_AREA",
      	    			cornerArea : cornerObjects.topRightCorner,
      	    			cornerPosition: "TOP_RIGHT_CORNER",
						currentPosition: {
								x: canvasX,
								y : canvasY,
								relativeX: relativeX,
								relativeY: relativeY
						}
				    };

      	    	} else if(canvasY >  plotOffset.top + plotHeight && canvasX > (plotWidth + plotOffset.left)) { //corner area on  RIGHT BOTTOM
      	    		relativeX =  canvasX - cornerObjects.bottomRightCorner.left;//clicked x position relative to the left of the corner area
  			        relativeY = canvasY - cornerObjects.bottomRightCorner.top; //clicked y position relative to the top of the corner area
      	    		return {
      	    			label : "CORNER_AREA",
						cornerArea : cornerObjects.bottomRightCorner,
						cornerPosition: "BOTTOM_RIGHT_CORNER",
						currentPosition: {
								x: canvasX,
								y : canvasY,
								relativeX: relativeX,
								relativeY: relativeY
						}
				    };
      	    	}
      	   }

      	   if(axisx.options.topHeader != undefined && axisx.options.topHeader.enable) {
     		    //IF topHeader   AREA
	  			var topHeaderTickArea = checkHoveredOnTopHeaderTickArea(event);
	  			if(topHeaderTickArea != null) {
		  			mx = axisx.c2p(canvasX - plotOffset.left);
		  			return {
		  				topHeaderTickArea : topHeaderTickArea,
		  				currentTime : mx, //in milliseconds
						label : "TOP_HEADER_AREA"
				    };
	  			}
     	     }

      	   var columnHeaderTopStart  = 0; // the actual time display major ot minor
      	   var columnHeaderTopEnd = plotOffset.top;
	      	if (axisx.options.position == "top") {
	      	      columnHeaderTopStart =  axisx.options.topHeader.enable  ? axisx.options.topHeader.height : 0; // when topHeaderis present
		      	 if( axisx.options.columnSummary.enable && axisx.options.columnSummary.position == "top") {
				     columnHeaderTopEnd = plotOffset.top - axisx.options.columnSummary.height;// when column summary is present
		      	 } else {
		      		columnHeaderTopEnd = plotOffset.top; // when column summary is not on top
		      	 }
	      	} else if (axisx.options.position == "bottom") {
	      		if( axisx.options.columnSummary.enable &&  axisx.options.columnSummary.position == "bottom") {
	      		    columnHeaderTopStart = plotOffset.top + plotHeight + axisx.options.columnSummary.height; // when column summary is present
	      		} else {
	      			columnHeaderTopStart = plotOffset.top + plotHeight; // when column summary is present
	      		}
				columnHeaderTopEnd = plotOffset.top + plotHeight + plotOffset.bottom;
	      	}
      	   if(canvasX >  plotOffset.left && canvasX <  plotOffset.left + plotWidth &&
      			 canvasY >  columnHeaderTopStart &&  canvasY <  columnHeaderTopEnd ) {
      		   mx = axisx.c2p(canvasX - plotOffset.left);
      		   return {
      			   label : "COLUMN_HEADER_AREA",
					currentPosition: {
							x: canvasX,
							y : canvasY
					},
					currentTime : mx //in milliseconds
			    };
			    top = plotOffset.top - axisx.options.columnSummary.height ;
      	   }  else  if(axisx.options.columnSummary != undefined && axisx.options.columnSummary.enable) {
      		    //IF COLUMN SUMMARY AREA
	  			var columnSummaryTickArea = checkHoveredOnColumnSummaryTickLabels(event);
	  			mx = axisx.c2p(canvasX - plotOffset.left);
	  			return {
	  				label : "COLUMN_SUMMARY_TICK_AREA",
	  				columnSummaryTickArea : columnSummaryTickArea,
	  				currentTime : mx, //in milliseconds
	  				currentPosition: {
						x: (columnSummaryTickArea != undefined ? columnSummaryTickArea.mouseX : canvasX),
						y : (columnSummaryTickArea != undefined ? columnSummaryTickArea.mouseY : canvasY)
	  				}

			    };
      	   }
      	    return null;
        }

        function onMouseDown(e) {
        	//Note this is a must as resize should perfetcly work on resizeIcon chnage
        	plot.setIsDragging(true);
        	//ISRM-4056
        	//For dragging perfectly in IE, save the previous Clicked Item
        	var offset = plot.offset(),
        	canvasX = plot.getPageX(e) - offset.left - plotOffset.left,
        	canvasY = plot.getPageY(e) - offset.top - plotOffset.top;
        	var currentObject = plot.findItemOnGantt(canvasX, canvasY);
        	if(currentObject != null) {
        		plot.setPreviousClickedItem(currentObject);
        	}

        	var rightclick = false;
        	if (!e) { e = window.event; };
        	if (e.which) {
        		rightclick = (e.which == 3);
        	} else if (e.button) {
        		rightclick = (e.button == 2);
        	}
        	if(rightclick) { // When mouse button right click
        		if(options.series.gantt.show ) {
        			var returnFlag = false;
        			if(connections != null && plot.yValueNodeDetailsMap != null) {
        				returnFlag  = triggerConnectionNodeClickEvent(e, true);
	        			if(returnFlag ) {
	        				 hoverItem = null;
	        				 hoverRowItem = null;
	        				 drawHighLightOverlay();
		   	        		return true;
	        			}
	   	        	}
        			if(options.grid.headerClickable && hoveredArea && hoveredArea.label == "ROW_HEADER_ITEM") { // ~ hoverRowItem != null ~ options.grid.headerClickable
        				triggerRowHeaderMouseEvents("rowHeaderMouseButtonRightClick", e);
            		} else {
            			triggerGanttClickHoverEvent("mouseButtonRightClick", e);
            		}
        		}


        	} else {
        		$(eventHolder).focus();  //is needed .. Focus is must for key board scroll towork .
        	}
        }

        function triggerConnectionNodeClickEvent(e, triggerAction) {
        	var connectionNode;
	        var offset = plot.offset(),
	        	plotOffset = plot.getPlotOffset(),
	        	canvasX = plot.getPageX(e) - offset.left - plotOffset.left,
	        	canvasY = plot.getPageY(e) - offset.top - plotOffset.top;
	        	connectionNode = plot.findHoverNodeInConnection(canvasX, canvasY);
	        	if(triggerAction == false && connectionNode != null) { //if false
		   	    	return true;
		   	    } else if( triggerAction && connectionNode != null) {
		   	         var pos = canvasToAxisCoords({ left: canvasX, top: canvasY });
		   	         pos.pageX = plot.getPageX(e); //set this to trigger outside
		   	         pos.pageY = plot.getPageY(e);  //set this to trigger outside
			    	 placeholder.trigger("connectionNodeRightClick", [connectionNode, pos ]);
			    	 return true;
		   	    } else {
		   	    	return false;
		   	    }

        }

       function triggerRowHeaderMouseEvents(eventname, event) {
           	ctrlPressed = event.ctrlKey;
         	shiftPressed = event.shiftKey;
         	placeholder.trigger("rowHeaderMouseButtonRightClick", [hoverRowItem]);
        }
        function onMouseUp(e) {
        	if(plot != null) {
        		plot.setIsDragging(false);
        	}
        }
        // CLEAR FOCUSED ITEM ON CLICK
        function clearFocusedItems(event) {
        	plot.focusedItem = null; //rest on every shift up
        	plot.focusedItems = new Array();

        	ctrlPressed = event.ctrlKey;
         	shiftPressed = event.shiftKey;
         	if(!ctrlPressed && !shiftPressed) {
         		 clearAllhighlights();
         	 }

        }

        function onClick(e) {
        	if(options.series.gantt.show ) {
	        		var axisy = plot.getSeries().yaxis;
	        		var axisx = plot.getSeries().xaxis;

	        		var offset = plot.offset(),
	        			plotOffset = plot.getPlotOffset(),
	        			rowId=0;
	        		var canvasX = plot.getPageX(e)- offset.left - plotOffset.left;
	   	         	var canvasY = plot.getPageY(e) - offset.top - plotOffset.top;
	   	            var hoveredArea = plot.findHoveredArea(e);
	   	            plot.focusData.initialHighlightedItem = hoverItem != null ? hoverItem.details : null;
		    		if(hoveredArea == null) {
		    			//ISRM-6868 plot click event  for no row hovered area
                    	var customEvent = jQuery.Event("emptyPlotclick");
                    	customEvent.originalEvent = e;
                    	customEvent.OriginalType = customEvent.type;
                    	var pos = {
                    			canvasX :canvasX,
                    			canvasY : canvasY
                    	}
                    	placeholder.trigger(customEvent,  [ pos, hoveredArea]);
                    	return null;
		    		}
		    		switch(hoveredArea.label) {
		    			case "ROW_HEADER_ITEM": {   //if hoverd on a rowItem
			    			//TREE ROW HEADER
		    				if(!options.grid.headerClickable) {
			        			return;
			        		}
		    				var customEvent = jQuery.Event("rowHeaderClick");
		    	        	customEvent.originalEvent = e;
		    	        	customEvent.OriginalType = customEvent.type;
			    			if(axisy.options.treeNode != undefined && axisy.options.treeNode.nodeLimit != undefined
			    					&& hoverRowItem && hoverRowItem.rowHeaderInfo != null) {
								var rowHeaderNode =  hoverRowItem.rowHeaderInfo;
								if(rowHeaderNode.nodeLevel <= axisy.options.treeNode.nodeLimit
										&& rowHeaderNode.collapsible) { // ON TREE ROW NODE
									triggerTreeCollapseAction(rowHeaderNode, e);
									if(!axisy.options.treeNode.eventCallback) { // if a call back is also needed
										return;
									}


								} else {  // ON ANY LEAF NODES or its parents
					   	         	var pos = canvasToAxisCoords({ left: canvasX , top: canvasY });
					   	         		pos.pageX = plot.getPageX(e) ; //set this to trigger outside
					   	         		pos.pageY = plot.getPageY(e);  //set this to trigger outside
					   	         	if(pos.y != undefined) {
				                		rowId = plot.retrieveActualRowId(Math.round(pos.y));
				                	}
								}//else
								//call back in both treenode(if eventCallback is true in tree Node) and leaf node exposed
								canvasX = plot.getPageX(e) - offset.left;// since checking on row header
				   	         	var hovedNodeObject = checkExactColumDataHovered(canvasX, rowId);
				   	         	var hoveredNode = null , columnIndex = null;
				   	         	if(hovedNodeObject != null) {
				   	         		hoveredNode = hovedNodeObject.hoveredNode;
				   	         		columnIndex = hovedNodeObject.columnIndex;
				   	         	placeholder.trigger(customEvent, [hoverRowItem, pos, hoveredNode, columnIndex]);
					   	         	if(options.grid.headerHighlight ) { // support for header selection for tree nodes.
					   	         		if(hoveredNode && hoveredNode.childNodes) { //ISRM -4104
					   	         			plot.triggerTreeMergeHeaderClickableAction(e, hoveredNode);
					   	         		} else { // leafNode
					   	         			plot.triggerHeaderClickableAction(e);
					   	         		}
					            	}
				   	         	}
				   	         	return;

			    			} else {
				    			//NORMAL CASE
			    				hoverRowItem = hoveredArea;
			    				if(plot.getDisableClickOnDrag()) {
			    					return;
			    				}
				    			var preventDefault = placeholder.trigger(customEvent, [ hoverRowItem]).data("preventDefault");
				    			if(options.grid.headerHighlight && (!preventDefault || preventDefault == undefined)) {
				            		plot.triggerHeaderClickableAction(e);
				            	}
				    			return;
			    			}
			    			break;
		    		} //case

	    			case "ROW_FOOTER_ITEM": {   //if hoverd on a rowItem
	    					if(axisy.options.rowFooter.enable && axisy.options.rowFooter.clickable) {
			 	     			placeholder.trigger("rowFooterClick", [ hoveredArea ]);
			 	     			return;
			 	     		}
	    					break;
	    			}
	    			case "CORNER_AREA": {   //if clicked on a corner Area
	    				  // CHECK IF CLICKED ON CORNER AREA WHEN THERE IS A TREE NODE WITH HEADER
	    				  if(axisy.options.treeNode != undefined && axisy.options.treeNode.nodeLimit != undefined) {
				    			var clickedHeaderGridCoulumn = checkHoveredOnCornerObjects(e);
				    			if(clickedHeaderGridCoulumn != null && clickedHeaderGridCoulumn.isOnBorder == false && !isDragging) {
					    			var eachHeaderGridColumn  = clickedHeaderGridCoulumn.eachHeaderColumn ;
			  						if(eachHeaderGridColumn.sortable) {
			  							sortColumnGrid(eachHeaderGridColumn);//perform sorting
			  						}
				    			}

			    			  //if column Summary there in tree case
				    		  if(axisx.options.columnSummary.enable && axisx.options.columnSummary.summaryHeaderRenderer != undefined &&
				    				  axisx.options.columnSummary.summaryHeader.clickAllowed) {
				    			  var cornercanvasY = plot.getPageY(e)- offset.top;
			    				  hoveredArea = findCornerObjectsInDetail(cornercanvasY ,hoveredArea);
			    				  if(hoveredArea.label == "CORNER_AREA"  && options.grid.cornerBox.clickable)  { // CORNER AREA  WITH COLUMN SUMMARY
						 	     	placeholder.trigger("cornerAreaClick", [ hoveredArea ]);
			    				  } else  if (hoveredArea.label == "COLUMN_SUMMARY_HEADER"  && axisx.options.columnSummary.summaryHeader.clickAllowed) {
					 	     		  placeholder.trigger("columnSummaryHeaderClick", [ hoveredArea ]);
			    				  }
			    				  return;
				    		  } else {
				 	     		    placeholder.trigger("cornerAreaClick", [ hoveredArea ]);
				 	     		    return;
				    		  }
	    				  } else if(options.grid.cornerBox.clickable) { //NORMAL CORNER AREA   - NOT TREE
			 	     		    placeholder.trigger("cornerAreaClick", [ hoveredArea ]);
			 	     		    return;
			 	     	  }

	    				  break;
	    			}
	    			case "PLOT_BODY": {
	    					//Added for keyboard focus and traversal
		   	         		clearFocusedItems(e);
	    		    		//If hovered Area  will be on plotBody
	    		    		 if( axisy.options.treeNode != undefined && axisy.options.treeNode.nodeLimit != undefined
	    		    				 		&& !axisy.options.treeNode.displayData) {
	    		        			var pos = canvasToAxisCoords({ left: canvasX, top: canvasY }), rowId = 0;
	    		        			if(pos.y != undefined){
	    		                		rowId = plot.retrieveActualRowId(Math.round(pos.y));
	    		                	}
	    		                	var eachRowHeaderObject = series.rowIdRowObjectMap[rowId];
	    		                	if(eachRowHeaderObject != undefined) {
	    								if(eachRowHeaderObject.nodeLevel <= axisy.options.treeNode.nodeLimit
	    										&& eachRowHeaderObject.collapsible) {
	    									triggerTreeCollapseAction(eachRowHeaderObject, e);
	    									if(!axisy.options.treeNode.eventCallback) { // default is false
	    										// if the default plotclick call back is not needed it will retrun from here
	    									    return;
	    									}
	    								}
	    								var data = {
	    										hoveredRowHeader : eachRowHeaderObject
	    			            		};
	    				        		triggerGanttClickHoverEvent("plotclick", e, data); //on normal task objects or on plot

	    		                	} else {
	    		                		//ISRM-6868plot click event  for no row area also
	    		                    	var customEvent = jQuery.Event("plotclick");
	    		                    	customEvent.originalEvent = e;
	    		                    	customEvent.OriginalType = customEvent.type;
	    		                    	placeholder.trigger(customEvent,  [ pos, hoverItem]); // all events from plot click
	    		                	}
	    				    //if x axis & column Summary (Additional row and its header Eg: Occupancy % or HOLD)
	    			    	} else {
	    			    		triggerGanttClickHoverEvent("plotclick", e); // NORMAL CASES
	    			    	}
	    		    		 break;
	    			}
	    			case "COLUMN_SUMMARY_TICK_AREA" : {
		   	  			    triggerGanttClickHoverEvent("columnSummaryTickClick", e , hoveredArea);
		   	  				 break;
	    			}
	    			case "COLUMN_HEADER_AREA" : {
	    				 triggerGanttClickHoverEvent("columnHeaderClick", e , hoveredArea);      // NORMAL PLOT HOVER
    					 break;
    				}
	    			case "TOP_HEADER_AREA" : {
	    				 triggerGanttClickHoverEvent("topHeaderClick", e , hoveredArea);      // NORMAL PLOT HOVER
  						 break;
	    			}
        		}//switch

        	} else { //for other charts other than gantt
        		triggerClickHoverEvent("plotclick", e, function (s) { return s["clickable"] != false; });
        	}

        }

        function findCornerObjectsInDetail(canvasY, hoveredArea) {
        	var columnSummary = plot.getSeries().xaxis.options.columnSummary , summaryHeight = 0 , top = 0;
        	if(columnSummary != undefined && columnSummary.enable && columnSummary.height > 0) {
        		summaryHeight = columnSummary.height;
        	}
        	if(summaryHeight  ==  0) {
        		return hoveredArea;
        	}
        	hoveredArea.currentPosition.y = canvasY;
        	//Note :  top header not considered here
        	if(columnSummary.position == "top"){

	        	if(canvasY > top && canvasY < (plotOffset.top - summaryHeight)) {
	        		hoveredArea.label = "CORNER_AREA"; //label for topCorner area separated from column summary
	        		hoveredArea.cornerArea.top = top;
	        		hoveredArea.cornerArea.height = plotOffset.top - summaryHeight;

	        	} else if (canvasY > (plotOffset.top - summaryHeight) && canvasY < plotOffset.top  ) {
	        		hoveredArea.label = "COLUMN_SUMMARY_HEADER";
	        		hoveredArea.cornerArea.top = plotOffset.top - summaryHeight;
	        		hoveredArea.cornerArea.height = summaryHeight;
				}
        	} else if(columnSummary.position == "bottom") {
        		top  = plotOffset.top + plotHeight;
        		if (canvasY > top && canvasY < (top + summaryHeight) ) {
	        		hoveredArea.label = "COLUMN_SUMMARY_HEADER";
	        		hoveredArea.cornerArea.top = top;
	        		hoveredArea.cornerArea.height = summaryHeight;
				} else if(canvasY > (top + summaryHeight) && canvasY < (top + plotOffset.bottom) ) {
					hoveredArea.label = "CORNER_AREA";
	        		hoveredArea.cornerArea.top = top + summaryHeight;
	        		hoveredArea.cornerArea.height = plotOffset.bottom - summaryHeight;
				}
        	}

        	return hoveredArea;
        }

        function sortColumnGrid(eachHeaderGridColumn) {

	         if(eachHeaderGridColumn.mode == undefined || eachHeaderGridColumn.mode == "NIL") {
	        	 eachHeaderGridColumn.mode = "ASC" ;
	        } else if(eachHeaderGridColumn.mode == "ASC") {
	        	eachHeaderGridColumn.mode = "DES";
	        }  else  if(eachHeaderGridColumn.mode == "DES"){
	        	eachHeaderGridColumn.mode = "NIL";
	        }

	        sortParentNodeForProperty(series.rootTreeNode, eachHeaderGridColumn.cellProperty,
						parseInt(eachHeaderGridColumn.nodeLevel-1), eachHeaderGridColumn);

	        resetAllOtherSameLevelArrowColor(eachHeaderGridColumn, eachHeaderGridColumn.nodeLevel);
	        series.rowHeaderIds= [] ;
			series.rowHeaderObjects =[];
			nodeParseRowIndex = 0;
			actualStartRowIndex = 0;
			iterateNodeRecursively(series.rootTreeNode, series.rowHeaderIds, series.rowHeaderObjects, 0); // A recursive call

			if(options.interaction.dataOnDemand) {
 	    		//On demand case
 	    		 plot.callFetchDataIfRequired();
 	    	}
			plot.isScrollRangeUpdated = true;
			plot.updateDisplayedRows();
			setupGrid();
	    	draw();
	    	plot.isScrollRangeUpdated = false;

        }
        //Clear all other sorting arrow modes except the current Column mode
        function resetAllOtherSameLevelArrowColor(currentSortedColumn, nodeLevel) {
       	    var s = plot.getSeries(), 	axisy = s.yaxis;
          	var multiColumnLabelObject = axisy.options.multiColumnLabel;
	       	var headerColumns = multiColumnLabelObject.columns;
	       	 for ( var i = 0; i < headerColumns.length; i++) {
	       		 if((headerColumns[i].cellProperty != currentSortedColumn.cellProperty) && (nodeLevel == headerColumns[i].nodeLevel)) {
	       			headerColumns[i].mode = "NIL";
	       		 }
	       	 }
	     }

        function checkHoveredOnCornerObjects(e) {

        	var offset = plot.offset(),
        		canvasX = plot.getPageX(e) - offset.left,
        		canvasY = plot.getPageY(e) - offset.top;
        	var topLeftCorner = cornerObjects.topLeftCorner;
        	//if columnSummary, there would be a header on column summary , reduce the height
        	var xaxisOpts = plot.getSeries().xaxis.options,
        		summaryHeight = 0;
        	if(xaxisOpts.columnSummary != undefined && xaxisOpts.columnSummary.enable) {
        		summaryHeight = xaxisOpts.columnSummary.height;
        	}

         	if(topLeftCorner.width > 0 ) {
         		var cornerHeight = plotOffset.top - summaryHeight;
	        	topLeftCorner.height = cornerHeight;
         		if( canvasX<= plotOffset.left && canvasX >= topLeftCorner.left
         					&& canvasY >= topLeftCorner.top && canvasY <= topLeftCorner.top + topLeftCorner.height) {

         		return checkExactColumHeaderHovered(canvasX, topLeftCorner);
         		}
         	}
        }

        function checkExactColumHeaderHovered (canvasX,  cornerArea) {
	       	 var s = plot.getSeries(), 	axisy = s.yaxis;
	       	var multiColumnLabelObject = axisy.options.multiColumnLabel;
	       	var headerColumns = multiColumnLabelObject.columns;
	    	var borderWidth = multiColumnLabelObject.border.width;

	       	 for ( var colIndex = 0; colIndex < headerColumns.length;colIndex++) {
	       		 var eachHeaderColumn = headerColumns[colIndex];
	       		 var eachColumnCoordinate = columnIndexCoordinateMap[colIndex];
	       		 var left = eachColumnCoordinate != undefined ? eachColumnCoordinate.startX :0 ;
	       		 var eachColumnWidth = eachHeaderColumn.width + borderWidth;


	       		 if(canvasX >= (left + eachColumnWidth - 2)  && canvasX <= (left + eachColumnWidth + 2)) {
	      				   return {
	      						columnIndex : colIndex,
	      						eachHeaderColumn : eachHeaderColumn,
	      						isOnBorder : true
	      					};
	      		} else if(canvasX >= left && canvasX <= (left + eachColumnWidth)) {
	      				   return {
	      						columnIndex : colIndex,
	      						eachHeaderColumn : eachHeaderColumn,
	      						isOnBorder : false
	      					};
	      			}

	      		}   //for
       }


       /**
        * This function will collapse all the childNodes of the rowHeaderNode passed
        * those will  be added to hideRowList and redrawn.
        */
        plot.collapseAllChildNodes = function(rowHeaderNode) {
           if(rowHeaderNode) {
     	   	 plot.collapseNodes(rowHeaderNode.childNodes);
     	   }
           /* To be removed later
           var series = plot.getSeries();
    	   var childNodes = rowHeaderNode.childNodes;
    	   var hideRowsList = new Array();
    	   var eachCorrectRowId;
    	   for ( var j = 0; j < childNodes.length; j++) {
	    	   var eachNodeToCollapse = childNodes[j];
			   var maxyValueToBeClosed = (eachNodeToCollapse.actualStartRowIndex + eachNodeToCollapse.familyCount -1);
			   for(var yValue = eachNodeToCollapse.actualStartRowIndex + 1 ; yValue<= maxyValueToBeClosed ; yValue++ ) {
					 eachCorrectRowId =  series.actualFilterRowIds[yValue] ;
					 if(eachCorrectRowId != undefined) {
					 hideRowsList.push(eachCorrectRowId);
			  }
			  }
			   eachNodeToCollapse.isExpanded = false;
    	   }
    	    hideRows(hideRowsList);
    	   plot.draw();	 */
       }



       /**
        * THis will be called form update Gantt Data initially passign the actual root treeNode
        * The case if  openMultiple or   initialCollapsed or normal case is handled here */
       plot.collapseRootNode= function(rootTreeNode) {
   	    	var series = plot.getSeries(), axisy = series.yaxis ;
   	    	var hideRowsList = [];
   	    	if(plot.initialyCollapsed) {
   	    		return;
   	    	}
   	    	if(axisy.options.treeNode.initialyCollapsed) {
 	    	   //This rowHeaderNode
 	    	   /*getChildRowIdsMoreThanNodeLimit(rootTreeNode, hideRowsList); // gets all recurisively
 	    	   if(hideRowsList.length > 0 ) {
 				   plot.hideRows(hideRowsList);	//draw and setup grid called inside this function
 	    	   } */
   	    		if(rootTreeNode.childNodes != null){
   	    			plot.collapseNodes(rootTreeNode.childNodes);
 	    	   }
 	    	   plot.initialyCollapsed = true;
   	    	} else if (!axisy.options.treeNode.openMultiple) { // behaviour similar to an accordion.
	       		//only the first node will be opened, all others will be collapsed
   	    		if(rootTreeNode.childNodes != null && rootTreeNode.childNodes.length > 0){
   	    			plot.expandNode(rootTreeNode.childNodes[0]);
   	    			plot.initialyCollapsed = true;
   	    		}
	       }
			//discard the hidden Rows from rowMap only in case of on demand
   	    	if(options.interaction.dataOnDemand && hideRowsList.length > 0) {
				plot.discardHiddenRows(hideRowsList);
				plot.callFetchDataIfRequired();
			}
       };
       /**
        * @param collapseRowList is the array of rowIds for collapsing
        */
       plot.collapseNodesList = function(collapseRowList) {
           var series = plot.getSeries(), axisy = series.yaxis;
           var rowHeaderNodes = [];
           collapseRowList.forEach(function(rowId){
              rowHeaderNodes.push(series.rowIdRowObjectMap[rowId]);
           });
            plot.collapseNodes(rowHeaderNodes);
       };

       /**
        * @param expandRowList is the array of rowIds for expanding
        */
       plot.expandNodesList = function(expandRowList) {
           var series = plot.getSeries();
           var rowHeaderNodes = [];
           expandRowList.forEach(function(rowId){
              rowHeaderNodes.push(series.rowIdRowObjectMap[rowId]);
           });
            plot.expandNodes(rowHeaderNodes);
       };

       /**
        * @parem :  rowID of the node to be collapse
        */
       plot.collpseNodeWithRowId = function(rowId) {
    	   var series = plot.getSeries();
    	   var rowHeaderNode =series.rowIdRowObjectMap[rowId];
    	   plot.collapseNode(rowHeaderNode);
       };
       /**
        * @parem :  rowID of the node to be expanded
        */
       plot.expandNodeWithRowId = function(rowId) {
    	   var series = plot.getSeries();
    	   var rowHeaderNode = series.rowIdRowObjectMap[rowId];
    	   if(rowHeaderNode != null && rowHeaderNode != undefined && !rowHeaderNode.isExpanded ) {
				plot.expandNode(rowHeaderNode);
		   }
       };
       /**
        * @parem :  rowID of the node to be collapsed
        */
       plot.collapseNodeWithRowId = function(rowId) {
    	   var series = plot.getSeries();
    	   var rowHeaderNode =series.rowIdRowObjectMap[rowId];
    	   if(rowHeaderNode != null && rowHeaderNode != undefined && rowHeaderNode.isExpanded ) {
				plot.collapseNode(rowHeaderNode);
		   }

       };

       /**
        * this function will collapse all the childnodes of the rowHeaderNode passed.
        * All the childnodes  will be added to hideRowList and redrawn
        * rowHeaderNode will be of the form
        *  {
        *  childNodes : { List of nodes }
        * 	data :
		* 	rowId :
		*  }
		*  Note :  If rootNode is passed it will collapse all its child nodes
        */
       plot.collapseNode = function(rowHeaderNode) {
    	   var hideRowsList = [];

      	   var options = plot.getOptions();

    	   getAllChildRowIdsForThisHeaderNode(rowHeaderNode, hideRowsList);
    	   rowHeaderNode.isExpanded = false;//if hideROwsList also not there
    	   markExpandedStatusForChildNodes(rowHeaderNode , false);
    	   //hideRowsList contains clicked node also
    	   for ( var i = 0; i < hideRowsList.length; i++) {
    		    //remove the clicked node from the list
	   			if(hideRowsList[i] == rowHeaderNode.rowId) {
	   				hideRowsList.splice(i, 1);
	   			}
			}
	       if(hideRowsList.length > 0 ) {
			   plot.hideRows(hideRowsList);	//draw and setup grid called inside this function
    	   }  else {
	       		setupGrid(); // even if there are no child nodes drawing should be done for setup grid to happen
		    	draw();
	       }
		   //discard the hidden Rows from rowMap only in case of on demand
		   if(options.interaction.dataOnDemand) {
				plot.discardHiddenRows(hideRowsList);
				plot.callFetchDataIfRequired();
		   }
		   //ISRM: 5620 / ISRM: 6786
		   if (options.multiScreenFeature != undefined && options.multiScreenFeature.enabled
    			   && options.multiScreenFeature.linkage == 'vertical') {
	         var customData = options.multiScreenFeature.customData;
	         var screenId = (Object.keys(customData).length > 0) ? $.multiScreenScroll.getCurrScreenId(customData.key) : plot.getScreenId
	         if(screenId > 0 ) {
			   plot.setRangeInLocalStoreForMultiScreen(screenId, customData);
	        }
		   }
       };

       /**
        *
        */
       plot.setRangeInLocalStoreForMultiScreen = function(screenId, customData) {
		    var screens = $.getFromLocalStore ('s');
	        var plotLabel = plot.getPlotLabel();
			var doNotUpdate = true;
			var prevScreenConfig = $.multiScreenScroll.getMultiScreenConfig(screens, customData, screenId-1);
			var prevPaneConfig = prevScreenConfig.pane[plotLabel];
		    var min = prevPaneConfig.endDisplayObject.id,
		    totalRows = prevPaneConfig.totalRows,
			max = min + totalRows;
			plot.updateRowRangeInLocalStore (min, max, doNotUpdate);
			plot.setYaxisViewArea(min, max);
       }

       /**
        * This function will collapse all the childnodes of the rowHeaderNode passed.
        * All the childnodes  will be added to hideRowList and redrawn
        * rowHeaderNodes will be an aray of the form
        *  [{
        *  childNodes : { List of nodes }
        * 	data :
		* 	rowId :
		*  } ]
		*
        */
       plot.collapseNodes = function(rowHeaderNodes) {
    	   var hideRowsList = [], rowHeaderNode;
    		for (var n = 0 ; n < rowHeaderNodes.length ; n++ ) {
    		   rowHeaderNode = rowHeaderNodes[n];
		       getAllChildRowIdsForThisHeaderNode(rowHeaderNode, hideRowsList);
		       markExpandedStatusForChildNodes(rowHeaderNode , false);
	    	   rowHeaderNode.isExpanded = false; //if hideROwsList also not there
	    	   for ( var i = 0; i < hideRowsList.length; i++) {
	    		    //remove the passed node from the list
		   			if(hideRowsList[i] == rowHeaderNode.rowId) {
		   				hideRowsList.splice(i, 1);
		   			}
				}
    		}
	       if(hideRowsList.length > 0 ) {
			   plot.hideRows(hideRowsList);	//draw and setup grid called inside this function
    	   }  else {
	       		setupGrid(); // even if there are no child nodes drawing should be done for setup grid to happen
		    	draw();
	       }

		   //discard the hidden Rows from rowMap only in case of on demand
	       var options = plot.getOptions();
		   if(options.interaction.dataOnDemand) {
				plot.discardHiddenRows(hideRowsList);
				plot.callFetchDataIfRequired();
		   }
		 	//ISRM: 5620 / ISRM: 6786
		   if (options.multiScreenFeature != undefined && options.multiScreenFeature.enabled
    			   && options.multiScreenFeature.linkage == 'vertical') {
			   var customData = options.multiScreenFeature.customData;
		       var screenId = (Object.keys(customData).length > 0) ? $.multiScreenScroll.getCurrScreenId(customData.key) : plot.getScreenId();
		       if(screenId > 0) {
		    	   plot.setRangeInLocalStoreForMultiScreen(screenId, customData);
		       }
		  }
       };
       /**
		* all siblings of the rowHeaderNode and its children are added to hidden rows
		*/
       plot.collapseAllSiblingsAndItsChildren = function(rowHeaderNode, nodeLevel) {
    	   var hideRowsList = [];
    	   rowHeaderNode.parentNode.isExpanded = true;
    	   getAllSiblingNodesAndCollapse(rowHeaderNode.parentNode , nodeLevel, hideRowsList);
    	   if(hideRowsList.length > 0 ) {
			   plot.hideRows(hideRowsList);	//draw and setup grid called inside this function
    	   }

       };

       	/**
       	 * given the parent of a single sibling nodeLevel  and the sibling level to find the nodes
       	 */
       function getAllSiblingNodesAndCollapse(parent, nodeLevel, hideRowsList) {
    	   if(parent.childNodes != null) {
				var childNodes = parent.childNodes;
				for ( var c = 0; c < childNodes.length; c++) {
					var eachNode = childNodes[c];
					if(eachNode.nodeLevel == nodeLevel) {
						getChildRowIdsMoreThanNodeLimit(eachNode, hideRowsList);
						eachNode.isExpanded = false;
					}
				}
    	   }
       }

       /**
        *
        * This will expand all the  childNodes of the rowHeaderNode passed
        * rowHeaderNode will be of the form
        *  [{
        *   childNodes : { List of nodes }
        * 	data :
		* 	rowId :
		*  }]
		*  expandAllChildNode : true, Expand all childNodes of this particular rowHeaderNode.
        */
       plot.expandNodes = function(rowHeaderNodes, expandAllChildNode) {
      	   	 var childRowIds = [], rowHeaderNode;
    	     for (var n = 0 ; n < rowHeaderNodes.length ; n++ ) {
    	     	rowHeaderNode = rowHeaderNodes[n];
   			   	rowHeaderNode.isExpanded = true;
   			 	if(expandAllChildNode || expandAllChildNode == undefined) {
   			   		getAllChildRowIdsForCollapsedNode(rowHeaderNode, childRowIds); // all nodes of this rowHeaderNode
   					markExpandedStatusForChildNodes(rowHeaderNode , true);
   			   	} else  {
   			   		childRowIds.push(rowHeaderNode.rowId); //add the passed rowNode also to expand.
   			   		//expand Only immediate children
   			   		var childNodes = rowHeaderNode.childNodes;
   			   		var addRowId;
   			   		if(childNodes != null) {
   			   		 for ( var c = 0; c < childNodes.length; c++) {
   			   			addRowId =  childNodes[c]  ? childNodes[c].rowId : null;
   			   			childNodes[c].isExpanded = false;
   			   			if(addRowId) {
   			   				childRowIds.push(addRowId);
   			   			}
   					 }

   				  }
   			   	}
    	     }
    	   //Now unhiding all child rows
		    if(childRowIds.length > 0) {
		     	unHideRows(childRowIds); // draw and setup grid called inside this function
		 	}

		 //ISRM: 5620 / ISRM: 6786
		 if (options.multiScreenFeature != undefined && options.multiScreenFeature.enabled
    			   && options.multiScreenFeature.linkage == 'vertical') {
			 var customData = options.multiScreenFeature.customData;
	       	 var screenId = (Object.keys(customData).length > 0) ? $.multiScreenScroll.getCurrScreenId(customData.key) : plot.getScreenId();
			 if(screenId > 0) {
			   plot.setRangeInLocalStoreForMultiScreen(screenId, customData);
		 	}
		 }
       };

       /**
        * Expand all childNodes of this particular rowHeaderNode.
        * This will expand all the  childNodes of the rowHeaderNode passed
        * rowHeaderNode will be of the form
        *  {
        *   childNodes : { List of nodes }
        * 	data :
		* 	rowId :
		*  }
		*  Note :  If rootNode is passed it will expand all its child nodes
        */
       plot.expandNode = function(rowHeaderNode) {
      	 var series = plot.getSeries(), axisy = series.yaxis ;
      	 var hiddenRowIds = [];
      	 var options = plot.getOptions();
       	 if(!axisy.options.treeNode.openMultiple && rowHeaderNode.parentNode != null && !rowHeaderNode.isLeafNode) {
  	    	// console.log("Inside ACCORDION-----------expandNode------");
  	    	plot.collapseAllSiblingsAndItsChildren(rowHeaderNode, rowHeaderNode.nodeLevel); //first collapse all siblings of rowHeaderNode
  	     }
  		 //expand all the child nodes of this collapsed node
  		    	   getAllChildRowIdsForCollapsedNode(rowHeaderNode, hiddenRowIds);
  	         rowHeaderNode.isExpanded = true;
         		 for ( var i = 0; i < hiddenRowIds.length; i++) {
  	    		   //remove the clicked node from the list
  		   			if(hiddenRowIds[i] == rowHeaderNode.rowId){
  		   				hiddenRowIds.splice(i, 1);
  		   			}
  			 }
  		 //Now unhiding the rows
  	       	 if(hiddenRowIds.length > 0) {
  		   		 markExpandedStatusForChildNodes(rowHeaderNode , true);
  	       		 unHideRows(hiddenRowIds); // draw and setup grid called inside this function
  	       	 } else {
  	       		setupGrid(); // even if there are no child nodes drawing should be done
  		    	draw();
  	       	 }
      	//ISRM: 5620 / ISRM: 6786
	    if (options.multiScreenFeature != undefined && options.multiScreenFeature.enabled
			   && options.multiScreenFeature.linkage == 'vertical') {
	    	var customData = options.multiScreenFeature.customData;
	    	var screenId = (Object.keys(customData).length > 0) ? $.multiScreenScroll.getCurrScreenId(customData.key) :
	    				plot.getScreenId();

 			if(screenId > 0) {
			   plot.setRangeInLocalStoreForMultiScreen(screenId, customData);
 			}
  		  }
        };


       /**
        * This will push  all childRowIds to the array parameter "childRowIds"
        *  of nodes that are in any status (expanded or collapsed)
        *  THis will also push the clicked node in this list
        */
       function getAllChildRowIdsForCollapsedNode(rowHeaderNode, childRowIds) {
       		//unique adding
    	   if(childRowIds.indexOf(rowHeaderNode.rowId) === -1) {
  	  		childRowIds.push(rowHeaderNode.rowId);
    	   }
	        if(rowHeaderNode.childNodes != null) {
				var childNodes = rowHeaderNode.childNodes;
				for ( var int = 0; int < childNodes.length; int++) {
					getAllChildRowIdsForCollapsedNode(childNodes[int], childRowIds);
				}
			}
      }

       /**
        * This will push  all childRowIds to the array parameter "childRowIds"
        * of nodes that are in expanded status only.
        * This will add rowHeaderNode rowId also to the list.
        */
       function getAllChildRowIdsForThisHeaderNode(rowHeaderNode, childRowIds) {
			//unique adding and don't add undefined rowIds also
    	   if(childRowIds.indexOf(rowHeaderNode.rowId) === -1 && rowHeaderNode.rowId != undefined) {
   	  		childRowIds.push(rowHeaderNode.rowId);
    	   }
	        if(rowHeaderNode.childNodes != null && rowHeaderNode.isExpanded) {
				var childNodes = rowHeaderNode.childNodes;
				for ( var int = 0; int < childNodes.length; int++) {
					getAllChildRowIdsForThisHeaderNode(childNodes[int], childRowIds);
				}
			}
       }

       /**
        * This will push  all childRowIds to the array  "childRowIds"
        * of nodes that are not the immediate childNodes of the treeNode specified in nodeLimit
        * This is used for the case when user wants to see the all nodes in collapsed state
        * on first initiation.
        */
       function getChildRowIdsMoreThanNodeLimit(rowHeaderNode, childRowIds) {
    	   if(options.yaxis.treeNode.nodeLimit < rowHeaderNode.nodeLevel && rowHeaderNode.nodeLevel != 0
    			   && rowHeaderNode.rowId != null && rowHeaderNode.isExpanded ) {
    		   // Don't add the root treeNode immediate children.
    		   childRowIds.push(rowHeaderNode.rowId);
           } else {
        	   rowHeaderNode.isExpanded = false; // thses nodes should  be drawn collpased as this childNodes will be hidden
           }

	       if(rowHeaderNode.childNodes != null) {
				var childNodes = rowHeaderNode.childNodes;
				for ( var int = 0; int < childNodes.length; int++) {
					getChildRowIdsMoreThanNodeLimit(childNodes[int], childRowIds);
				}
	       }
       }




       /**
        * Mark the children of tree nodes as isExpanded = true/false after expanding/collapsing the nodes
        */
       function markExpandedStatusForChildNodes(rowHeaderNode , status) {
	        if(rowHeaderNode.childNodes != null ) {
				var childNodes = rowHeaderNode.childNodes;
				rowHeaderNode.isExpanded = status;
				for ( var int = 0; int < childNodes.length; int++) {
					markExpandedStatusForChildNodes(childNodes[int], status);
				}
			}
      }
       /**
        * triggers the expand and collpase action.
        * If root Node is provided all the nodes will be in collapsed status
        */
      function  triggerTreeCollapseAction(rowHeaderNode, e) {
    	 // console.log("triggerTreeCollapseAction  - rowHeaderNode to collpase ", rowHeaderNode);
    	 var data = { };
    	 data.originalEvent = e ; // the dragged item backward compatibility
		 data.rowHeaderNode = rowHeaderNode;
    	 var allowToggle = placeholder.trigger("allowTreeNodeToggle", [ data]).data("allowToggle");
		 if(allowToggle || allowToggle == undefined) {  // if allowToggle is true or is not defined(backward compatibility)
		 if(rowHeaderNode.isExpanded) { // if expanded
			 plot.collapseNode(rowHeaderNode);
		 } else {
			plot.expandNode(rowHeaderNode);
		 }
		}
		return;
      }
      /**
       * this function will recalculate the startRowIndex dependign on the hidden rows(collpased)
       * and also wrapped rows.
       * This startIndex is used for rowheader display. (used for normal, wrap and marge case as well)
       */
      function resetStartRowIndex(currentNode, nodeLevel) {
    	 currentNode.startRowIndex = nodeParseRowIndex;
    	 var rowId = currentNode.rowId; // rowId should be there in our tree Node structure
    	 var maxWrap = 0;
    	 if(plot.areWrapRowsEnabled()) { // ISRM-3758 do this only for wrap enabled
    	     var map = plot.getRowIdDisplayWrapMap(); // on expanding all hidden rows will also be expanded
    		 maxWrap = map[rowId] ? map[rowId]  : 1; // ISRM 7224
    	 }
	  	 if(options.yaxis.treeNode.nodeLimit >= currentNode.nodeLevel && nodeLevel != 0) { // header nodes
	  		  if(hiddenRows.indexOf(rowId) == -1) { // not hidden
	  			nodeParseRowIndex++;
	  		  }
	  	 } else if(currentNode.isLeafNode) { //leaf node
	  		if(plot.areWrapRowsEnabled()) {
	 	        	   nodeParseRowIndex = nodeParseRowIndex + maxWrap;
			} else {
				if(hiddenRows.indexOf(rowId) == -1) { // not hidden
					 nodeParseRowIndex++;
				 }
			}
		 }
	     if(currentNode.isExpanded && currentNode.childNodes != null) {
			var childNodes = currentNode.childNodes;
			for ( var int = 0; int < childNodes.length; int++) {
				resetStartRowIndex(childNodes[int], nodeLevel+1);
			}
	     }

      }

       function onDoubleClick(e) {
    	   if(options.series.gantt.show ) {
        		var offset = plot.offset(),
        		canvasX = plot.getPageX(e) - offset.left - plotOffset.left,
                canvasY = plot.getPageY(e) - offset.top - plotOffset.top;
        		var axisy = plot.getSeries().yaxis;
        		if(hoveredArea == null) {
        			return null;
        		}
        		var hoverItem = plot.findItemOnGantt(canvasX, canvasY);
        		//console.log("Double click event hoverItem ", hoverItem, "hoveredArea ", hoveredArea);
        		switch(hoveredArea.label) {
	        		case  "ROW_HEADER_ITEM":{
	        			if(options.grid.headerClickable && hoveredArea!= null && hoveredArea.label == "ROW_HEADER_ITEM") {
	    	        		if(axisy.options.treeNode!= undefined && axisy.options.treeNode.nodeLimit != undefined && hoverRowItem.rowHeaderInfo !=null){
	    						var rowHeaderNode =  hoverRowItem.rowHeaderInfo;
	    						if((rowHeaderNode.nodeLevel <= axisy.options.treeNode.nodeLimit)
	    								&& rowHeaderNode.collapsible) {
	    							triggerTreeCollapseAction(rowHeaderNode, e);
	    							if(!axisy.options.treeNode.eventCallback) { // if a call back is not needed return
										return;
									}
	    						}
	    	        		}
	            			placeholder.trigger("rowHeaderDoubleClick", [ hoverRowItem]);
	    	    		}
	        			break;
	        		}
	        		case  "PLOT_BODY": {
		        		if(axisy.options.treeNode != undefined && axisy.options.treeNode.nodeLimit != undefined) {
				                var pos = canvasToAxisCoords({ left: canvasX, top: canvasY }), rowId = 0;
				            	if(pos.y != undefined){
				            		rowId = plot.retrieveActualRowId(Math.round(pos.y));
				            	}
				            	var eachRowHeaderObject = series.rowIdRowObjectMap[rowId];
				            	var isTreeNode = eachRowHeaderObject!= null &&
				            					(eachRowHeaderObject.nodeLevel <= axisy.options.treeNode.nodeLimit);

								if(isTreeNode && eachRowHeaderObject.collapsible) { //if tree node && collapsible
									if(axisy.options.treeNode.displayData == false) { // if not displaying data
										triggerTreeCollapseAction(eachRowHeaderObject, e);
									} else if(axisy.options.treeNode.displayData && hoverItem != null	) {
										//  tree node having data displayed in tree node
						        		triggerGanttClickHoverEvent("objectDoubleclick", e);
						        	}
								} else if (isTreeNode &&  axisy.options.treeNode.displayData && hoverItem != null) {
									// not tree node row header normal rows
									triggerGanttClickHoverEvent("objectDoubleclick", e);
								}
			        	}
		        		if(hoverItem != null) { // need to execute in tree and  normal case
			        		triggerGanttClickHoverEvent("objectDoubleclick", e);
			        	} else {
			        		triggerGanttClickHoverEvent("plotDoubleclick", e);//ISRM-5641
			        	}
		        		break;
	        	}

        		} //switch end
        	}

        }

        function findStartAndEndPoints(canvasX, canvasY) {
        	var series = plot.getSeries();
        	 if(series == undefined || series.xaxis == undefined || series.yaxis == undefined) {
 	        	return;
 	        }
        	var s = series;
        	var barBottom = plot.getBarBottom();
  	        var barTop = plot.getBarTop();
        	// iF user has explicitly spcified the item Height Positioning
        	var heightPosition = s.gantt.itemHeightPositioning;
        	if(heightPosition != undefined) {
        		//Note : percentage with respect to s.gantt.barHeight
        		//startPercentage :25,  //from the rowHeight top
	    		//endPercentage :75,  //from the rowHeight top
        		barBottom = barBottom - (s.gantt.barHeight *(100-heightPosition.endPercentage)/100);
        		barTop = barTop - (s.gantt.barHeight *heightPosition.startPercentage/100);
        	}
        	 var item,
	             axisx = s.xaxis,
	             axisy = s.yaxis,
	             radius = options.taskResize.radius,
	             mxLeft = canvasX - radius,
	             mxRight = canvasX + radius,
	             my = axisy.c2p(canvasY),
	     	     start =0, end = 0, yValue, top, bottom;

	         	var resizingItem = null;
		         if(hoverItem == null) {
		        	 if(paddedHoverItem != null) {
		        		 resizingItem = paddedHoverItem;
		        	 }
		         } else {
		        	 resizingItem = hoverItem;
		         }

		         if(resizingItem != null && resizingItem.resizable != false) {
		        	 item = resizingItem.details;
		        	  yValue = item.yValue;
		        	 //TWO CASES OF RESIZING
		        	 if(options.taskResize.fireOnEdgeOnly) {
			         	 start = resizingItem.details.start;
			        	 end = resizingItem.details.end;
		        	 } else {
		        		//trigger the callback from user to get start and end
		        		 var dataToRenderer = resizingItem.details;
		        		 var actualAttributesForResize = eval(options.taskResize.resizeItemAttributeProvider).apply(this, [dataToRenderer]);
		        		 if(actualAttributesForResize !=null){
			        		 start = dataToRenderer[actualAttributesForResize.start];
				        	 end = dataToRenderer[actualAttributesForResize.end];
				        	 item.actualAttributesForResize = actualAttributesForResize;
		        		 }
		        	 }
	        	 top = yValue - barTop;
	          	 bottom = yValue + barBottom;
	          	var mxCLeft = axisx.c2p(mxLeft),
	          	 	mxCRight = axisx.c2p(mxRight);
	          	 if ( (mxCLeft <= start && mxCRight >= start) && ( my >=top && my <= bottom)  ) {
	          		 item = resizingItem.details;
	          		item.resizePosition="START";
	          		return item;
	          	 } else if ( (mxCLeft <= end && mxCRight >= end)  && (my >= top &&  my <= bottom) ) {
	                 item = resizingItem.details;
	                 item.resizePosition="END";
	                 return item;
	             }
		         }
	          	 return null;
       }



        // trigger click or hover event (This is a separate call for gantt chart)
        function triggerGanttClickHoverEvent(eventname, event, dataPassed) {
        	var offset = plot.offset(),
        	series = plot.getSeries(),
        	canvasX = plot.getPageX(event) - offset.left - plotOffset.left,
            canvasY = plot.getPageY(event) - offset.top - plotOffset.top;
            var pos = canvasToAxisCoords({ left: canvasX, top: canvasY });
            pos.pageX = event.pageX; //set this to trigger outside
            pos.pageY = event.pageY;  //set this to trigger outside
            //sent the rowKeys as well in  trigger
        	if(pos.y != undefined) {
        		pos.rowId = plot.retrieveActualRowId(Math.round(pos.y));
        	}
        	ctrlPressed = event.ctrlKey;
        	shiftPressed = event.shiftKey;

        	//Added to provide the original Even to user
        	var customEvent = jQuery.Event(eventname);
        	customEvent.originalEvent = event;
        	customEvent.OriginalType = customEvent.type;
        	var data={};
        	if( dataPassed  != null ) {
        		data = dataPassed;
        	}
        	data.position = pos;
        	data.hoveredArea = hoveredArea;

            if (hoverItem != null && hoveredArea != null && hoveredArea.label == "PLOT_BODY") { // when an item is hovered or clicked
                //set the relative positions of the clicked Posn,  with respect to the task item as well to user.
            	var itemYValue = hoverItem.details.yValue;
            	var itemTop = itemYValue - plot.getBarTop();

            	hoverItem.pageX = parseInt(series.xaxis.p2c(hoverItem.details.start) + offset.left + plotOffset.left);
            	if(hoverItem.details.segmentTop == undefined) {
            		hoverItem.pageY = parseInt(series.yaxis.p2c(itemTop) + offset.top + plotOffset.top);
            	} else {
            		hoverItem.pageY = parseInt(series.yaxis.p2c(itemTop) + hoverItem.details.segmentTop + offset.top + plotOffset.top);
            	}
            	pos.relativeX = pos.pageX - hoverItem.pageX ;
            	pos.relativeY = pos.pageY -  hoverItem.pageY;
                if(eventname == "plotclick") {
	                if(shiftPressed) {
	                	checkForTaksToHighlightOnShiftKeyDown();
	                } else if(options.grid.autoHighlight && hoverItem.details != null) {
			                addTaskToHighlightList(hoverItem.details);
			                if(!ctrlPressed){
			                	//firts highlightred item set on shift presses will be cleared here
			                	plot.firstHighlightedItem =  hoverItem.details;
			                }
	                	}
		            }
                if(eventname == "mouseButtonRightClick") {
                	addTaskToHighlightList(hoverItem.details);
                }

                drawHighLightOverlay(); //common
                //Note : trigger this only after adding to highlight list and draw overlay
                if(hoverItem.selectedHotSpot != undefined) {
                	placeholder.trigger(customEvent, [ pos, hoverItem ]); // need to  pass the details of hotSpot which is there in hoverItem
       	        } else {
                	placeholder.trigger(customEvent, [ pos, hoverItem.details ]); // all other events
                }
                return;
            }
            if(eventname == "plothover" ) { // no hover item
            	drawHighLightOverlay();
            	placeholder.trigger(customEvent, [ pos, hoverItem ]); // all other events

            } else  if(eventname == "plotclick" && options.grid.autoHighlight && !ctrlPressed && !shiftPressed) { // no hover item
        		unhighlightAll();
        		drawHighLightOverlay();
        		if(data.hoveredRowHeader != null){ // in case of hoveredRowHeader in case of tree on plot body
        			placeholder.trigger(customEvent,  [ pos, data.hoveredRowHeader]);
        		} else {
        			placeholder.trigger(customEvent,  [ pos, hoverItem]); // all events from plot click
        		}
            }  else if(eventname == "columnHeaderClick" ) {
        		//Note hoverItem will be first selected and then column header can also be selected SO if loop outside
        		if(options.columnHeaderClick.selectionAllowed) {
            		triggerTimeHeaderClickAction(customEvent);
            	}
            	if(options.columnHeaderClick.interactive ) {  // just trigger the callback on click no selection of days
        			placeholder.trigger(customEvent, [ data]);
        		}
            }   else if(eventname == "columnSummaryTickClick" ) {
        		if(options.xaxis.columnSummary.selectionAllowed) {
            		triggerTimeHeaderClickAction(customEvent);
            	}
            	if(options.xaxis.columnSummary.clickAllowed ) {  // just trigger the callback on click no selection of days
        			placeholder.trigger(customEvent, [ hoveredArea.columnSummaryTickArea]);
        		}
            }  else if(eventname == "topHeaderClick" ) {
            	if(options.xaxis.topHeader.clickAllowed ) {
        			placeholder.trigger(customEvent, [ hoveredArea]);
        		}
           }  else {
            	placeholder.trigger(customEvent,  [ pos, hoveredArea ]); // all events like double click, plothover  etc
           }

            return;
        }

        /**
         * function triggered when a header click event is fired and column Header highlight option is selected
         * @param e
         */
        function triggerTimeHeaderClickAction(e) {
        	ctrlPressed = e.originalEvent.ctrlKey;
        	shiftPressed = e.originalEvent.shiftKey;
            if (hoveredArea && (hoveredArea.label == "COLUMN_HEADER_AREA" || hoveredArea.label == "COLUMN_SUMMARY_TICK_AREA")) {
               	plot.addTickToHighlightList(hoveredArea, ctrlPressed, shiftPressed );
            }
        }


        //For line chart, bar chart & points
        // Note the third parameter difference from Gantt chart
        // trigger click or hover event (they send the same parameters so we share their code)
        function triggerClickHoverEvent(eventname, event, seriesFilter) {
            var offset = plot.offset(),
            	canvasX = plot.getPageX(event) - offset.left - plotOffset.left,
            	canvasY = plot.getPageY(event)- offset.top - plotOffset.top,
            pos = canvasToAxisCoords({ left: canvasX, top: canvasY });
            pos.pageX = event.pageX;
            pos.pageY = event.pageY;
            var item = findNearbyItem(canvasX, canvasY, seriesFilter);

            if (item) {
                // fill in mouse pos for any listeners out there
                item.pageX = parseInt(item.series.xaxis.p2c(item.datapoint[0]) + offset.left + plotOffset.left);
                item.pageY = parseInt(item.series.yaxis.p2c(item.datapoint[1]) + offset.top + plotOffset.top);
            }

            if (options.grid.autoHighlight) {
                // clear auto-highlights
                for (var i = 0; i < highlights.length; ++i) {
                    var h = highlights[i];
                    if (h.auto == eventname &&
                        !(item && h.series == item.series &&
                          h.point[0] == item.datapoint[0] &&
                          h.point[1] == item.datapoint[1]))
                        unhighlight(h.series, h.point);
                }

                if (item)
                    highlight(item.series, item.datapoint, eventname);
            }

            placeholder.trigger(eventname, [ pos, item ]);
        }


        // returns the data item the mouse is over, or null if none is found
        //For all other tasks - BAR, LINE
        function findNearbyItem(mouseX, mouseY, seriesFilter) {
            var maxDistance = options.grid.mouseActiveRadius,
                smallestDistance = maxDistance * maxDistance + 1,
                item = null, i, j;

            for (i = series.length - 1; i >= 0; --i) {
                if (!seriesFilter(series[i]))
                    continue;

                var s = series[i],
                    axisx = s.xaxis,
                    axisy = s.yaxis,
                    points = s.datapoints.points,
                    ps = s.datapoints.pointsize,
                    mx = axisx.c2p(mouseX), // precompute some stuff to make the loop faster
                    my = axisy.c2p(mouseY),
                    maxx = maxDistance / axisx.scale,
                    maxy = maxDistance / axisy.scale;

                // with inverse transforms, we can't use the maxx/maxy
                // optimization, sadly
                if (axisx.options.inverseTransform)
                    maxx = Number.MAX_VALUE;
                if (axisy.options.inverseTransform)
                    maxy = Number.MAX_VALUE;

                if (s.lines.show || s.points.show) {
                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j], y = points[j + 1];
                        if (x == null)
                            continue;

                        // For points and lines, the cursor must be within a
                        // certain distance to the data point
                        if (x - mx > maxx || x - mx < -maxx ||
                            y - my > maxy || y - my < -maxy)
                            continue;

                        // We have to calculate distances in pixels, not in
                        // data units, because the scales of the axes may be different
                        var dx = Math.abs(axisx.p2c(x) - mouseX),
                            dy = Math.abs(axisy.p2c(y) - mouseY),
                            dist = dx * dx + dy * dy; // we save the sqrt

                        // use <= to ensure last point takes precedence
                        // (last generally means on top of)
                        if (dist < smallestDistance) {
                            smallestDistance = dist;
                            item = [i, j / ps];
                        }
                    }
                }

                if (s.bars.show && !item) { // no other point can be nearby
                    var barLeft = s.bars.align == "left" ? 0 : -s.bars.barWidth/2,
                        barRight = barLeft + s.bars.barWidth;

                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j], y = points[j + 1], b = points[j + 2];
                        if (x == null)
                            continue;

                        // for a bar graph, the cursor must be inside the bar
                        if (series[i].bars.horizontal ?
                            (mx <= Math.max(b, x) && mx >= Math.min(b, x) &&
                             my >= y + barLeft && my <= y + barRight) :
                            (mx >= x + barLeft && mx <= x + barRight &&
                             my >= Math.min(b, y) && my <= Math.max(b, y)))
                                item = [i, j / ps];
                    }
                }
            }

            if (item) {
                i = item[0];
                j = item[1];
                ps = series[i].datapoints.pointsize;

                return { datapoint: series[i].datapoints.points.slice(j * ps, (j + 1) * ps),
                         dataIndex: j,
                         series: series[i],
                         seriesIndex: i };
            }

            return null;
        }

        /**
        * this will return all the highlighted task items ( in view area or deom highlights map)  in a 1D array
         * @returns {Array}
         */
        function getAllHighlights() {
       	var highlightsArray = [];
       	var dataMap = plot.getDataMap(), highlightedItemchronosId;
        	for(var index in highlights) {
       		highlightedItemchronosId  = highlights[index].chronosId;
       		if (highlightedItemchronosId != null) {
       			//if item is there in dataMap it is not discarded - ie the  task is in view area
            	// else check if it is present in highlights
        		var highlightItem = null;
        		if(dataMap[highlightedItemchronosId] != undefined) {
        			highlightItem = dataMap[highlightedItemchronosId];
        		} else if(highlights[highlightedItemchronosId] != undefined) {
        			highlightItem = highlights[highlightedItemchronosId];
        		}
        		if(highlightItem) {
        			highlightsArray.push(highlightItem);
        		}
       		}
        	}
        	return highlightsArray;
        }

        //Check if this task is in the highlighted list
        function isHighlightedEntity(taskItem) {
         	 var id = taskItem.chronosId;
         	for(var index in highlights) {
        		 if(id == index) {
        			 return true;
        		 }
        	}
        }

        //Added to expose an API to highlight An Entity
        function highlightAnEntity(taskId) {
        	var dataMap = plot.getDataMap();
        	var series = plot.getSeries(),
        		rowYvalueMap = series.rowYvalueMap;
        	var taskItem = dataMap[taskId];
        	//Before drawing this taskItem set the yValue for task as well.
        	//Get  the yValue corresponding to the rowId rom the rowYvalueMap
        	if(taskItem) {
        		var yValue = rowYvalueMap[taskItem.rowId];
        		var rowObject = series.rowIdRowObjectMap[taskItem.rowId];
        		//ISRM-6871 highlight a collapsed row task
        		if (plot.areWrapRowsEnabled() && rowObject.expanded != false) { //ISRM-5839
    				taskItem.yValue = series.actualFirstWrapDisplayMap[yValue] + plot.getTaskIdWrapIndexMap()[taskItem.chronosId];
		        } else {
		        	taskItem.yValue = yValue;
		        }
        		addTaskByUserToHighlightList(taskItem);
        		drawHighLightOverlay();
        	}

        }

        //Adding task to highlight list progamatically from outside.
        //here don't check if it is ctrl pressed or already in the list
        function addTaskByUserToHighlightList(taskItem) {
	       	 var id = taskItem.chronosId; // index Of Highlight will be the taskiD itslef
       	     if (id != null) {
       	        highlights[id] = taskItem;
	       	     var objectSelection = {
	                  	taskItem :  taskItem,
	               		selected : true
	               };
	       		 placeholder.trigger("objectSelection", [objectSelection]);
            }
       }

        //This will remove the task with this ID from the highlighted list and will redraw
        function removeHighlightForEntity(taskId) {
        	var taskItem = null;
        	//if item is there in dataMap , it is not discarded , ie the  task is in view area
        	// else check if it is present in highlights and remove from it.
        	var dataMap = plot.getDataMap();
    		if(dataMap[taskId] != undefined) {
    			taskItem = dataMap[taskId];
    		} else if(highlights[taskId] != undefined) {
    			taskItem = highlights[taskId];
    		}
        	if(taskItem) {
        		unhighlightTask(taskItem);
        		drawHighLightOverlay();
        	}

        }
        //This will clear all highlights added by teh user and by the fw
        function clearAllhighlights() {
        	unhighlightAll();
        	clearHighlightOverlay();
        }


        //highlights is a named map with id of task as the index and value as the object(task Object)
        //FOR GANTT CHART
        function addTaskToHighlightList(taskItem) {
	       	 var id = taskItem.chronosId; // index Of Highlight will be the taskiD itslef
	         // clear highlights if ctrl is NOT pressed
	       	 var unselected = false;
	       	 var objectSelection;
        	if(!ctrlPressed && !shiftPressed) {
        		if(!highlights[id]) {   //if some items are selected and clciked on the selected item releasing ctrl or shift ..donot un highlight
        			unhighlightAll();
        		}
        	} else if(highlights[id] && !shiftPressed) {
        		unhighlightTask(taskItem);
        		unselected = true;
        	}
            if (id != null && !unselected) {
            	highlights[id] = taskItem;
            	 objectSelection = {
                     	taskItem :  taskItem,
                  		selected : true
                  };
          		 placeholder.trigger("objectSelection", [objectSelection]);

            }
        }

        //FOR GANTT CHART
        function unhighlightAll() {
        	for(var id in highlights) { //clear all from list
                if (highlights[id] != null) {
                	//if item is there in dataMap it is not discarded - task in view area
                	// else check if it is present in highlights and remove from it.
            		var dataMap =  plot.getDataMap();
            		if(dataMap[id] != undefined) {
            			unhighlightTask(dataMap[id]);
            		} else if(highlights[id] != undefined) {
            			unhighlightTask(highlights[id]);
            		}
                }
            }
        }

        //FOR GANTT CHART// This will remove the item only from highlights map
        function unhighlightTask(taskItem) {
            var indexOfHighlightItem = taskItem.chronosId;
        	var objectSelection;
            if (indexOfHighlightItem != null && indexOfHighlightItem != undefined) {
                objectSelection = {
                     	taskItem :  taskItem,
                  		selected : false
                  };
                placeholder.trigger("objectSelection", [objectSelection]);
          	   delete(highlights[indexOfHighlightItem]);
            }
        }

        //This list is only used only for rectangle selecting
        function addTaskToRectangleSelectHighlightList(taskItem) {
	       	 var id = taskItem.chronosId; // index O fHighlight will be the taskiD itslef
	         if (id != null) {
	           	rectangleFrameHighlights[id] = taskItem;
	         }
       }
        //Clears all rectangle selections added in the list
	    function clearAllRectangleSelectHighlightList() {
	    	rectangleFrameHighlights = [];
	    }


	    function getRectangleFrameHighlights() {
	    	return rectangleFrameHighlights;
	    }

	    function addSelectedListToOriginalHighlightlist() {
	    	var taskItem, id;
	    	var objectSelection;
	    	for(var i in rectangleFrameHighlights) { //clear all from list
	    		taskItem = rectangleFrameHighlights[i];
		    	id = taskItem.chronosId;
		    	if (id != null) {
	            	highlights[id] = taskItem;
	            	objectSelection = {
	                     	taskItem :  taskItem,
	                  		selected : true
	                  };
	          		 placeholder.trigger("objectSelection", [objectSelection]);
	            }
	    	}
	    }

	    // public function to the chronos user to add the blinkingObjects of Gantt to a list
	    function addObjectsToBlinkingList(blinkingObjectsList) {
	    	var blinkingObjectId;
	    	for(var i in blinkingObjectsList) {
	    		blinkingObjectId = blinkingObjectsList[i];
	    		addObjectToBlinkingList(blinkingObjectId);

	    	}
	    }

	    // public function to the chronos user to add the blinkingObjects of Gantt to a list
        function addObjectToBlinkingList(blinkingObjectId) {
        	var dataMap = plot.getDataMap();
        	var rowYvalueMap = plot.getSeries().rowYvalueMap;
        	var taskItem = dataMap[blinkingObjectId];

        	if(taskItem) {
        		var yValue = rowYvalueMap[taskItem.rowId];
    			taskItem.yValue = yValue;    		 //THis is need for drawing ..Note set this
    			if(blinkingObjects.indexOf(taskItem) == -1) {
    				blinkingObjects.push(taskItem);
    			}
        	}
        	if(blinkingObjects.length == 1) {
 	        	drawBlinkingObjects();
 	        }

        }

        // public function to the chronos user to remove any blinkingObjects from Gantt
        function removeObjectFromBlinkingList(blinkingObjectId) {
        	 var dataMap = plot.getDataMap();
        	var taskItem = dataMap[blinkingObjectId];

        	if(taskItem) {
        		for ( var int = 0; int < blinkingObjects.length; int++) {
        			if(blinkingObjects[int].chronosId == taskItem.chronosId){
        				blinkingObjects.splice(int, 1);
        			}
				}
        	}
        	if(blinkingObjects.length == 0 && blinkingTimer != null) {
        		blinkingTimer.unRegisterSchedule(plot);
        	}

        }

        function executeSchedulerJob(blinkingSqNor) {
        	blinkingSequenceNumber = blinkingSqNor;
	    	drawHighLightOverlay();

        }


	    function drawBlinkingObjects() {
    		var blinkingTimeGap = options.taskBlinking.blinkingTimeGap;
    		blinkingTimer = $.scheduler(blinkingTimeGap);
    		blinkingTimer.registerSchedule(plot);
	    }

	    /**
	     * When user wants to hide a set of rows - Supported only if ONDEMAND is off
	     * @param rowIds
	     */
	    function hideRows(rowIds) {
	    	if(rowIds == null || rowIds.length == 0) {
	    		return;
	    	}
	    	var eachRowId;
	    	for ( var int = 0; int < rowIds.length; int++) {
	    		eachRowId = rowIds[int];
	    		//normal case
	    		if(hiddenRows.indexOf(eachRowId) == -1) {
	    			hiddenRows.push(eachRowId);
	    		}
			}
	    	//discard the hidden Rows from rowMap only in case of on demand
			if(options.interaction.dataOnDemand) {
				plot.discardHiddenRows(hiddenRows);
			}

			plot.updateDisplayedRows();
            if(options.interaction.dataOnDemand) {
                //On demand case
                plot.callFetchDataIfRequired();
            }

			if(plot.areWrapRowsEnabled()) {
				//need to clear the wrap calculations and update the rowIdMaxWrapMap
				for ( var index = 0; index < hiddenRows.length; index++) {
	    			eachRowId = hiddenRows[index];
	    			 //need to clear the wrap calculations and update the rowIdMaxWrapMap
	    			plot.determineBucketWiseWrapForEachRow(eachRowId, plot.getSeries(), true);
		    	}
				// recalculate the actualFilter rowIds and update the wrapIndex map also.
				plot.determineBucketWiseWrap(plot.getSeries(), true); //calling as Async
            }

			plot.isScrollRangeUpdated = true;
	    	//Remove any items highlighted/selected for this hidden row
	    	var taskItem;
	    	for(var i in highlights) {
	    		if (highlights[i].chronosId != null) {
           			//Taking the item directly fom datamap
            		var dataMap =  plot.getDataMap();
            		taskItem = dataMap[highlights[i].chronosId];
		    		if(taskItem && hiddenRows.indexOf(taskItem.rowId) != -1){
		    			//remove that highlighted task Item in that hidden row. User need to add again on un hiding row
	    			unhighlightTask(taskItem);
	    		}
	    	}
	    	}

	    	//Impt : Used when tree collpase nodes are done . Not to remove
	    	if(series.rootTreeNode != undefined) {
	    		nodeParseRowIndex = 0;
	    		resetStartRowIndex(series.rootTreeNode, 0);
	    	}

	    	plot.setupGrid();
	    	plot.draw();
	    	plot.isScrollRangeUpdated = false;
	    }


	    /**
	     * When user wnats to un hide a row - Supported only if ONDEMAND is off
	     * @param rowIds
	     */
	    function unHideRows(rowIds) {
	    	if(rowIds == null || rowIds.length == 0) {
	    		return;
	    	}
	    	var eachRowId;
	    	for ( var rowCount = 0; rowCount < rowIds.length; rowCount++) {
	    		eachRowId = rowIds[rowCount];
		    	for ( var count = 0; count < hiddenRows.length; count++) {
	    			if(hiddenRows[count] == eachRowId){
	    				hiddenRows.splice(count, 1);
	    				break;
	    			}
				}
	    	}
	    	plot.updateDisplayedRows();
	    	if(options.interaction.dataOnDemand) {
	    	   plot.callFetchDataIfRequired(); // This will fetch the unhided rowHeaders again  & internally update all the maps

	    	}
	    	plot.isScrollRangeUpdated = true;

	    	//Impt : Used when tree expand nodes are done . Not to remove
	    	if(series.rootTreeNode != undefined) {
	    		 nodeParseRowIndex = 0;
	    		 resetStartRowIndex(series.rootTreeNode, 0);
	    	}

	    	setupGrid();
	    	draw();
	    	plot.isScrollRangeUpdated = false;
	    }
	    /**
	     *
	     * @param rowIds
	     * @returns
	     */
	    function unHideRowsBetween(beginRowId, endRowId) {
	    	if(beginRowId == null || endRowId == null) {
	    		return;
	    	}
	    	var hiddenRowsTobeMadeVisible = [];
	    	var displayedBeginYValue = series.rowYvalueMap[beginRowId],
	    		displayedEndYValue = series.rowYvalueMap[endRowId],
	    		actualBeginYValue = series.displayedRowIds[displayedBeginYValue],
	    		actualEndYValue = series.displayedRowIds[displayedEndYValue],
	    		eachRowId;
	    	var beginActualRowId = series.actualFilterRowIds[actualBeginYValue];
	    	var endActualRowId = series.actualFilterRowIds[actualEndYValue];

	    	if(beginActualRowId == beginRowId && endActualRowId == endRowId) { //Check needed if the specified limits are displayed?
	    		 for(var i = (actualEndYValue -1); i > actualBeginYValue ; i--){ //get the actual rowIds from actualFilterRowIds
	    			 eachRowId = series.actualFilterRowIds[i];
	    			 //if(jQuery.inArray(eachRowId, hiddenRows) != -1){ // if  the row is hidden
	    			 if(hiddenRows.indexOf(eachRowId) != -1) { // if  the row is hidden
	    				 hiddenRowsTobeMadeVisible.push(eachRowId);
	    			 }
	    		 }
	    	} else {
	    		if(window.console) {
	    			console.error("Either Start and End Rows specified may not be in displayed rows.");
	    			return;
	    		}
	    	}

	    	unHideRows(hiddenRowsTobeMadeVisible);
	    }
	    /**
	     * API for adding rows in a tree provided the node path
	     * @param newRowHeaderNode :  the new rowTo add
	     * @param nodePath :  the path to which the addition is to be done.eg " Array of the path  of jsonObjectrootId, subRowId, subsubRowId "
	     */
        function addRowInTree(newRowHeaderNode, nodePathArray) {
        	var series = plot.getSeries();
        	var reachedNode = series.rootTreeNode;
        	$.map(nodePathArray, function (eachNodeObject, index) {

        		var nodeRowId = eachNodeObject.rowId; // rowId is the attribute name of the syntax --{rowId, data , childNodes}
        		var node = retrieveNodeWithRowId(nodeRowId, reachedNode);
        		if( node == null) {
        			var newNode = {};
        			newNode.rowId  = nodeRowId;
        			newNode.childNodes =  eachNodeObject.childNodes;
        			newNode.data =  eachNodeObject.data;
        			var modifiedChildren = reachedNode.childNodes;
        			if(modifiedChildren != null) {
        				modifiedChildren.push(newNode);
        			} else {
        				modifiedChildren = [];
        				modifiedChildren.push(newNode);
        			}
        			reachedNode.childNodes = modifiedChildren;
        			reachedNode = newNode;
        		}  else {
        			reachedNode = node;
        		}
        	});

        	if(reachedNode != null) {
        		if(reachedNode.childNodes == null) {
        			reachedNode.childNodes = [];
        		}
        		reachedNode.childNodes.push(newRowHeaderNode);
        		if(!reachedNode.isExpanded) {  //ISRM-6342
					 //if row adding is to a collapsed parent node , it should be hidden
					 plot.hideRows([newRowHeaderNode.rowId]);
				}
 				series.rowHeaderIds = [];
 				series.rowHeaderObjects = [];
 				nodeParseRowIndex = 0;
 				actualStartRowIndex = 0;
 				iterateNodeRecursively(series.rootTreeNode, series.rowHeaderIds, series.rowHeaderObjects, 0); // A recursive call
     	    	plot.isScrollRangeUpdated = true;
     	    	plot.updateDisplayedRows();
     	    	if(options.interaction.dataOnDemand) {
     	    		//On demand case
     	    		 plot.callFetchDataIfRequired();
     	    	}

     	    	plot.setupGrid();
     	    	plot.draw();
     	    	plot.isScrollRangeUpdated = false;
        	}
        }

        function retrieveNodeWithRowId(nodeRowId, currentNode) {
        	var found = false;
        	var allChildren = currentNode.childNodes;
        	var reachedNode = null;
        	if( allChildren != null) {
        		for ( var j = 0; j < allChildren.length; j++) {
        			found = hasNodeReachedWithRowId(nodeRowId, allChildren[j]  );
        			if(found) {
        				reachedNode = allChildren[j] ;
        				break;
        			}
				} //for
        	}
        	return reachedNode;
        }

        function hasNodeReachedWithRowId(nodeRowId,currentNode) {

        	if(currentNode.rowId != null  && currentNode.rowId == nodeRowId) { //first case  for root node , rowId will be null
	        		  return true;
	        }
        	return false;
        }
        /**
         * This function is to be called initially for all group insert Rows or group delet or update rows call.
         * Once this batch insertion is done, remember to call endBatchUpdate()
         */
        function startBatchUpdate() {
        	plot.forcedDraw = false;
        }

        /**
         * Only if endBatchUpdate is called after all batch additions/updations of rows , the draw will be fired.
         */
        function  endBatchUpdate() {

        	plot.isScrollRangeUpdated = true;
	    	plot.updateDisplayedRows();
	    	if(options.interaction.dataOnDemand) {
	    		//On demand case
	    		plot.callFetchDataIfRequired();
	    	}
	    	if(!options.chronosWorker.enabled){
	    		plot.setupGrid();
			    plot.draw();
			    plot.newInsertedRows = [];
			    plot.isScrollRangeUpdated = false;
			    plot.forcedDraw = true;
	    	} else{
	    		plot.forcedDrawWorker = true
	    	}

        }

	    /**
	     * function to insert a row After a particular rowID  with the new rowID
	     */
	    function insertRowAfter(rowId, newRowHeaderObject) {

	    	var actualFilterRowIds = series.actualFilterRowIds; //Key as actualyValue 0,1,2,3... and Value as  rowId;
	    	var actualyValue = actualFilterRowIds.indexOf(rowId);
	    	//insert the new row after actualyValue
	    	var positionToInsert = actualyValue + 1; //yvalue starts at 0, 1, 2

	    	if(positionToInsert < 0) {
	    		return;
	    	}
	    	if(series.rowIdLeafNodeMap != undefined) { //INSERTION IN  TREE
	    	    var currRowNode = series.rowIdRowObjectMap[rowId] ? series.rowIdRowObjectMap[rowId] : series.rowIdLeafNodeMap[rowId];
	    		reArrangeRowAndUpdateDataStructures(positionToInsert, newRowHeaderObject, currRowNode, true); //true means insert after
	    	} else {
		    	//insert the new row before actualyValue
		    	reArrangeRowAndUpdateDataStructures(positionToInsert, newRowHeaderObject);
	    	}
	    }

	    /**
	     * inserts firstRowId  into secondRowId Position and vice versa
	     * Eg : plot2.reArrangeRows("Flight001","Flight005");
	     * Ensure that both Ids are there already in rowHeaderIds.
	     */
	    function reArrangeRows(firstRowId, secondRowId) {
	    	var series = plot.getSeries();
	      	var firstRowIndex = series.rowHeaderIds.indexOf(firstRowId);
	    	var secondRowIndex = series.rowHeaderIds.indexOf(secondRowId);
	    	series.rowHeaderIds[firstRowIndex] = secondRowId;
	    	series.rowHeaderIds[secondRowIndex] = firstRowId;

	    	plot.updateDisplayedRows();
    		if(options.interaction.dataOnDemand) {
	    		//On demand case
	    		plot.callFetchDataIfRequired();
	    	}
    		plot.setupGrid();
			plot.draw();
	    }

	    /**
	     * function to insert a row before a particular rowID  with the new rowID
	     * If insertion is done ina tree, the newRowHeaderObject will be added to same nodelevel as the rowId
	     * and as the child of the parent of specifiedRowId(rowId)
	     */
	    function insertRowBefore(rowId, newRowHeaderObject) {
	    	var series = plot.getSeries();
	    	var actualFilterRowIds = series.actualFilterRowIds; //Key as actualyValue 0,1,2,3... and Value as  rowId;
	    	var positionToInsert = actualFilterRowIds.indexOf(rowId);//yvalue starts at 0, 1, 2

	    	if(positionToInsert < 0) {
	    		return;
	    	}
	    	if(series.rowIdLeafNodeMap != undefined) { //INSERTION IN  TREE
	    	    var currRowNode = series.rowIdRowObjectMap[rowId] ? series.rowIdRowObjectMap[rowId] : series.rowIdLeafNodeMap[rowId];
	    		reArrangeRowAndUpdateDataStructures(positionToInsert, newRowHeaderObject, currRowNode, false); //false means insert before
	    	} else {
		    	//insert the new row after actualyValue
		    	reArrangeRowAndUpdateDataStructures(positionToInsert, newRowHeaderObject);
	    	}
	    }

	    // private function called from insert Row methods
	    //@param specifiedNode is the sibling node to which the newRowHeaderObject should be added to
	    //@param isAfter - true if the insertion is after the specifiedNode , false if before
	    function reArrangeRowAndUpdateDataStructures(positionToInsert, newRowHeaderObject, specifiedNode, isAfter) {
	    	var series = plot.getSeries();
			if(series.rowHeaderIds.indexOf(newRowHeaderObject.rowId) != -1){
	    		return; // return if duplicate row
	    	}
	    	var rowIdAttribute = series.gantt.rowIdAttribute,
    		newRowId = newRowHeaderObject[rowIdAttribute]; //~ row ID value from <rowIdattaribute>, passed as normla rowheader json by user
	    	var existingRowHeaderIds = series.rowHeaderIds;
	    	existingRowHeaderIds.splice(positionToInsert, 0, newRowId);

	    	if(newInsertedRows.indexOf(newRowId) == -1) { // if already not in list
	    		newInsertedRows.push(newRowId);
    		}
	    	series.rowHeaderIds = existingRowHeaderIds;

	    	if(!options.interaction.dataOnDemand) {	 // CASE : FULL DATA IN CLIENT
	    		//update data structures internally - row of 2dmatrix, longrange data map, rowAvailable etc
		    	var newRowSize = existingRowHeaderIds.length;
		    	DATA_MATRIX_ROW_SIZE = newRowSize;
		    	TOTAL_ROW_AVAILABLE ++;
		    	series.rowAvailable.push(TOTAL_ROW_AVAILABLE);
		    	series.data2DMatrix[TOTAL_ROW_AVAILABLE] = new Array(DATA_MATRIX_COLUMN_SIZE);
				//initialise longRangeData Map with a new item
		    	series.longRangeDataMap.push(new Array());
		    	//update the current loaded range accordingly.Then only the rowMap index will get upated for this row
	            plot.currentLoadedData.yValueMin = 0;
	            plot.currentLoadedData.yValueMax = TOTAL_ROW_AVAILABLE;
	    	}

	    	//if it is tree structure row addition
	    	if(series.rootTreeNode != undefined) { //INSERTION IN  TREE
				insertNodeInRootTreeNode(series.rootTreeNode, newRowHeaderObject, specifiedNode, isAfter);
				series.rowHeaderIds = [];
				series.rowHeaderObjects = [];
				nodeParseRowIndex = 0;
				actualStartRowIndex = 0;
				iterateNodeRecursively(series.rootTreeNode, series.rowHeaderIds, series.rowHeaderObjects, 0); // A recursive call
		    }  else {
		    	  series.rowHeaderObjects.push(newRowHeaderObject);
		    }
	    	plot.isScrollRangeUpdated = true;
	    	plot.updateDisplayedRows();
	    	if(plot.forcedDraw) { // draw this only for single updation. FOr batch updation, it will be done only at end
	    		if(options.interaction.dataOnDemand) {
		    		//On demand case
		    		plot.callFetchDataIfRequired();
		    	}
			    plot.setupGrid();
			    plot.draw();
		    	newInsertedRows.splice(newInsertedRows.indexOf(newRowId) , 1);// after adding delete from list
	    	}
	    	plot.newInsertedRows=newInsertedRows;
	    	plot.isScrollRangeUpdated = false;
	    }
	    /**
	     * Insert a leaf child node to the same parent specified by the other rowID
	     * @rowDataToAdd will be of the form {rowId:"AirCraftAFTER_0" ,id:"AIR-AFTER", name:"BoeingBB",aircraftId:"AIR-AFTER",aircraftName:"BoeingBB",aircraftType:"Boeing"}
	     * specifiedNode will be of the form { data : ... , childNodes: null, rowId : ...}
	     */
	    function insertNodeInRootTreeNode(currentNode, rowDataToAdd, specifiedNode, isAfter) {
	    	   var foundNode = false, eachChild;
		  	   var allChildren = currentNode.childNodes;
		  		   if(allChildren != null) {
		  			 for ( var i = 0; i < allChildren.length; i++) {
		  				 	eachChild = allChildren[i];
							if(eachChild.rowId == specifiedNode.rowId
									  && eachChild.nodeLevel == specifiedNode.nodeLevel) { //if same ID  in the same nodeLevel

								  var childNodes = currentNode.childNodes;
								  var nodeToAdd = {}; //new Child node gettign created
								  nodeToAdd.rowId = rowDataToAdd[series.gantt.rowIdAttribute]; // passed by user as normal rowheader object
								  nodeToAdd.data = rowDataToAdd;
								  if(isAfter) {
									  childNodes.splice(i+1, 0, nodeToAdd);
								  } else {
									  childNodes.splice(i, 0, nodeToAdd);
								  }

								  currentNode.childNodes = childNodes;
								  foundNode = true;
								  if(!currentNode.isExpanded) {  //ISRM-6342
									  //if row addign is to a collapsed node , it should be hidden
									  plot.hideRows([nodeToAdd.rowId]);
								  }

								  break;
							 }
					}

				  	if(foundNode) {
				  		return true;
				  	} else {
			  			for ( var j = 0; j < allChildren.length; j++) {
			  				foundNode  = insertNodeInRootTreeNode(allChildren[j], rowDataToAdd, specifiedNode, isAfter);
			  				if(foundNode) {
			  					return true;
			  				}
						}
					 }
		  		   }
	    } //function
	    /**
	     *
	     * @param rowId to delete permanently
	     */
	    function deleteRow(rowId) {
	    	var series = plot.getSeries();
	    	var actualFilterRowIds = series.actualFilterRowIds; //Key as actualyValue 0,1,2,3... and Value as  rowId;
	    	var positionToDelete = actualFilterRowIds.indexOf(rowId);//yvalue starts at 0, 1, 2
	    	// If the rowId is not present .. do not delete
	    	if (positionToDelete == -1) { // ISRM-4290
                return;
	    	}
	    	var existingRowHeaderIds = series.rowHeaderIds;
	    	existingRowHeaderIds.splice(positionToDelete, 1);
	    	series.rowHeaderIds = existingRowHeaderIds;

	    	//var rowObjectToDelete = series.rowIdRowObjectMap[rowId];// this need to have the data  loaded
	    	var eachRowHeaderObject;
	    	if(series.rowIdLeafNodeMap != undefined) { //DELETION FROM TREE
					deleteNodeFromRootTreeNode(series.rootTreeNode, rowId);
					series.rowHeaderIds = [];
					series.rowHeaderObjects = [];
					nodeParseRowIndex = 0;
					actualStartRowIndex = 0;
					iterateNodeRecursively(series.rootTreeNode, series.rowHeaderIds, series.rowHeaderObjects, 0); // A recursive call
			}  else {
				//Note rowIdRowObjectMap should also be  updated according to this rowHeaderObjects;
                for(var index = 0 ; index < series.rowHeaderObjects.length; index++) {
                    eachRowHeaderObject = series.rowHeaderObjects[index];
                    if(rowId == eachRowHeaderObject[series.gantt.rowIdAttribute]) { // remove row Id present in this array
                        //Note rowIdRowObjectMap should also be  updated according to this rowHeaderObjects;
                        series.rowHeaderObjects.splice(index, 1);
                          break;
                     }
                }
			}
	    	delete(series.rowIdRowObjectMap[rowId]);
			deleteItemsInThisRow(rowId);
			//delete row highlight if it is added to that list
	    	delete(rowHighlights[rowId]);
			delete(series.rowMap[rowId]);
	    	plot.isScrollRangeUpdated = true;
	    	plot.updateDisplayedRows();
	    	if(plot.forcedDraw) {
		    	setupGrid();
		    	draw();
	    	}
	    	plot.isScrollRangeUpdated = false;
	    }
	    /**
	     * Delete a child node with rowId and remove that childNode from its parent
	     */
	    function deleteNodeFromRootTreeNode(currentNode, rowId) {
	    	   var foundNode = false;
		  	   var allChildren = currentNode.childNodes;
		  	   var modifiedChildren = [];
		  		   if(allChildren != null) {
				  		$.each(allChildren, function(index, eachChild) {
							  if(eachChild.rowId != rowId ) { //if same ID remove that from current
								  modifiedChildren.push(eachChild);
							  }  else if(eachChild.rowId == rowId ){
								  foundNode = true;
							  }
						});
				  		if(foundNode) {
				  			currentNode.childNodes = modifiedChildren;
				  			return true;
				  		} else {
				  				for ( var int = 0; int < allChildren.length; int++) {
									deleteNodeFromRootTreeNode(allChildren[int], rowId);
								}
					    }
		  		   }

	    } //function


	    //This deletion is used for moving rows to another position ..so don't delete the items in the row.
	    // This is the private call called from navigate inside framework
	    plot.temporaryDeleteRow = function temporaryDeleteRow(rowId) {
	    	var series = plot.getSeries();
	    	var actualFilterRowIds = series.actualFilterRowIds; //Key as actualyValue 0,1,2,3... and Value as  rowId;
	    	var positionToDelete = actualFilterRowIds.indexOf(rowId);//yvalue starts at 0, 1, 2
	    	if(positionToDelete < 0) {
	    		return;
	    	}
	    	var existingRowHeaderIds = series.rowHeaderIds;
	    	existingRowHeaderIds.splice(positionToDelete, 1);
	    	series.rowHeaderIds = existingRowHeaderIds;
	    	var rowIdAttribute = options.series.gantt.rowIdAttribute, eachRowHeaderObject;
	    	var rowIdToCheck;
	    	for(var index = 0 ; index < series.rowHeaderObjects.length; index++) {
	    		eachRowHeaderObject = series.rowHeaderObjects[index];

	    		if(series.rootTreeNode == undefined) {
	    			rowIdToCheck = eachRowHeaderObject[rowIdAttribute];
	    		} else {
	    			rowIdToCheck = eachRowHeaderObject.rowId;
	    		}
		    	if(eachRowHeaderObject && rowId == rowIdToCheck) { // remove row Id present in this array
		    		//Note rowIdRowObjectMap should also be  updated according to this rowHeaderObjects;
					series.rowHeaderObjects.splice(index, 1);
					delete(series.rowIdRowObjectMap[rowId]);
					break;
				}
	    	}
	    	plot.updateDisplayedRows();	   // not need to set isScrollrange Updated flag here .. is been done in insertRowAfter/Before where this is used.
	    };

	    /**
	     * THis function delete the tasks from datamap matchign this rowId
	     */
	    function deleteItemsInThisRow(rowId) {
        	var currentSeries = plot.getSeries(),
        			rowMap = currentSeries.rowMap,
        			rowIndex =  rowMap[rowId],
        			oneDayMillis = 24*3600*1000;
			var idArray;
			var xaxisOpts = currentSeries.xaxis.options;
			var minViewTime , maxViewTime;
			if(plot.currentLoadedData.fromDate  == 0) {
        		minViewTime = xaxisOpts.scrollRange[0]; //no relatiem data fetch case
        	}
        	if(plot.currentLoadedData.toDate  == -1) {
        		maxViewTime = xaxisOpts.scrollRange[1];
        	}
			var normalSpanMillis = currentSeries.gantt.normalMaximumDaySpan  * oneDayMillis; // to check the ending tasks also in the open view range
			if(options.interaction.dataOnDemand){
			minViewTime = plot.currentLoadedData.fromDate - normalSpanMillis; // in case of realtime datafetch
        	maxViewTime = plot.currentLoadedData.toDate;
			}
        	for (var eachDay = minViewTime ; eachDay <= maxViewTime; ) {
				var columnMap = plot.getSeries().columnMap;
				var columnIndex = columnMap[eachDay];
				if(rowIndex != undefined  && columnIndex != undefined) {
					idArray = plot.getNormalTaskIdArray(currentSeries, rowIndex, columnIndex );
					if(idArray) {
						$.each(idArray, function (index, taskId) { //
							//if deleted row Items are available in highlights remove from that list also
		        			delete(highlights[taskId]);
		        		});

						idArray.length =0;
					}
				}
				eachDay = eachDay  + oneDayMillis;
			}//for
        	//adding long range data also
        	if(currentSeries.longRangeDataMap != undefined && rowIndex != undefined) {
        		var taskObjectIdArray = plot.getLongRangeTaskIdArray(currentSeries, rowIndex );
				if(taskObjectIdArray != undefined) {
					//if deleted row Items are available in highlights remove from that list also
        			$.each(taskObjectIdArray, function (index, taskId) { //
        				delete(highlights[taskId]);
        			});
					taskObjectIdArray.length=0;
				}
			}
	    }
	     /**
	     * User need to set the array of hotspot objects  needed for each item.
	     *  The hotSpot object is of the form
	     *  hotSpotObject : {
	     *  	hotSpotId:"H1"
	     *  	relativeTo : "START/END" of the task item
	     *  	startX: pixel from where to start from the relative To position specified
	     *  	widthInPixel: if hotspots are fixed even in zoom  -  TAKEN PREFERENCE if specified
	     *      widthInTime: if hotspots needs to be zoomed w.r.t to task item
	     *    			Note :  +ve if in the left to right direction relativeTo(start of task), -ve if it extends to right to left relativeTo(start)
	     *  	 		 		+ve if in the right to left direction relativeTo(end of task), -ve if it extends from left to right relativeTo(end)
	     *
	     *      startYPercentage: from the rowHeight top . percentage with respect to series.gantt.barHeight
	     *      endYPercentage : from the row top . percentage with respect to series.gantt.barHeight
	     *  }
	     *
	     */
	    function setHotSpots(itemId, hotSpotsArray) {
	    	var idTaskMap =  plot.getDataMap();
	    	var itemAssociated = idTaskMap[itemId];
	    	var rowHotSpotMap = plot.getRowHotSpotMap() ;
	    	if(rowHotSpotMap == null) {
	    		rowHotSpotMap = [];
	    	}
			if(itemAssociated) {
            	 var rowIdAttributeInTask = plot.getSeries().gantt.rowIdAttributeInTask;
            	 var rowID = itemAssociated[rowIdAttributeInTask];

            	 var existingArray = rowHotSpotMap[rowID]; //for that particular row
            	 if (existingArray) {
            		 rowHotSpotMap[rowID] = existingArray.concat(hotSpotsArray);
            	 } else {
            	     rowHotSpotMap[rowID] = hotSpotsArray;
            	 }
            	 var existingHotSpots = itemAssociated.hotSpots; //for that particular item
            	 if (existingHotSpots) {
            	     itemAssociated.hotSpots = existingHotSpots.concat(hotSpotsArray);
            	 } else {
            	     itemAssociated.hotSpots = hotSpotsArray;
            	 }
            }
	    }
        /**
         * clear and redraw the hightlight overlay for gantt
         * @param drawSelectionStyle
         * @param drawHoverStyle
         */
        function drawHighLightOverlay() {
        	if(plot == null) {
        		return;
        	}
        	var options = plot.getOptions();
        	var drawSelectionStyle = options.grid.drawSelectionStyle;
        	var drawHoverStyle =  options.grid.drawHoverStyle;
        	var axisy = plot.getSeries().yaxis;
            redrawTimeout = null;

            //clear and redraw
            if(hctx == null) {
            	return;
            }
            clearHighlightOverlay();
            hctx.save();
            hctx.translate(plotOffset.left, plotOffset.top);

            //FOR ALL LAYERS
            for (eachLayerName in canvasLayerMap) {
        		if(eachLayerName == mainLayerName) { //Don't do it for base
        			continue;
        		}
        		canvasLayerMap[eachLayerName].context.save();
        		canvasLayerMap[eachLayerName].context.translate(plotOffset.left, plotOffset.top);
        	}

            // draw highlights
            var highLightItem;
            if(hoverItem != null && plot.expandingItem == null) { // to ensure that on resizing hoverItem is not drawn
            	if(hoverItem.selectedHotSpot != undefined) {
            		drawGanttHighlight(hoverItem, drawHoverStyle,"HOVER");
            	} else {
            		if(axisy.options.treeNode != undefined && !axisy.options.treeNode.displayData) {
            			//when there is data display in treeNode
            			var hoveredRowHeaderObject = series.rowIdRowObjectMap[hoverItem.details.rowId];
	                	if(hoveredRowHeaderObject  && hoveredRowHeaderObject.nodeLevel > axisy.options.treeNode.nodeLimit) {
								// NOT ON A collapsible TREE ROW NODE
								drawGanttHighlight(hoverItem.details, drawHoverStyle,"HOVER");
							}
	            	} else {
	            		drawGanttHighlight(hoverItem.details, drawHoverStyle,"HOVER");
	            	}
            	}

            } else if(plot.resizingItem != null)    {
            	var resizingEffect = options.taskResize.resizingEffect;
            	var showTime = options.taskResize.showTime;
            	if(showTime.enable) {
        			var dateTodisplay = null;
        			if(plot.resizingItem.originalObject.resizePosition == "START") {
        				 dateTodisplay = $.chronosDate(plot, plot.resizingItem.start);

        			} else if(plot.resizingItem.originalObject.resizePosition == "END") {
        				 dateTodisplay = $.chronosDate(plot, plot.resizingItem.end);
        			}

        			if(dateTodisplay != null) {
        				dateTodisplay = $.chronos.formatDate(dateTodisplay, showTime.timeFormat);
        				 var f= showTime.font;
        				hctx.font = f.style + " " + f.variant + " " + f.weight + " " + f.size + "px '" + f.family + "'";
        				hctx.fillStyle = f.color;
        				hctx.fillText(dateTodisplay , plot.resizingItem.position.currentMouseX , plot.resizingItem.position.currentMouseY);
        			}
        		}
            	var customMode = options.taskResize.mode;
            	drawGanttHighlight(plot.resizingItem.resizedObject, resizingEffect, customMode);
            }

            for(var i in highlights) {
            	if (highlights[i].chronosId != null) {
            		// console.log(dataMap[highlights[i].chronosId]);
           			//Taking the item directly fom datamap -  the item will be in VIEW AREA
            		var dataMap =  plot.getDataMap();
            		highLightItem = dataMap[highlights[i].chronosId];
	            	if(highLightItem != null) {
                drawGanttHighlight(highLightItem, drawSelectionStyle, "SELECTION");
	            	}
            	}

           }
            //if there are any blinking objects
            for(var b in blinkingObjects) {
            	var rowIdAttributeInTask = plot.getSeries().gantt.rowIdAttributeInTask;
            	var eachObject = blinkingObjects[b];
    			//if(jQuery.inArray(eachObject[rowIdAttributeInTask], hiddenRows) == -1){ // if  the row is not hidden
            	 if(hiddenRows.indexOf(eachObject[rowIdAttributeInTask]) == -1) { // not hidden
		    		blinkingObjects[b].blinkingSequenceNumber = blinkingSequenceNumber;
		    		drawGanttHighlight(blinkingObjects[b], null, "BLINKING_MODE");
    			}
	    	}

            //Focus item drawing
            if(plot.focusedItem != null ){
            	drawGanttHighlight(plot.focusedItem, options.keyboardFocus.focusStyle, "FOCUS");
            }

            //NOTE: Added this to clear header parts to avoid overwriting of highlights, selection etc in header
            clearAllHeaderPortions();
            shadowItem = plot.getShadowItem();
           if(options.taskDrag.draggingEffect.enable) {
        	   var draggingEffectStyle = options.taskDrag.draggingEffect;
        	   var showTrackerEnabled = draggingEffectStyle.showTracker.enable;
        	   var eachShadowItem;
            	if(plot.getShadowItem() != null && showTrackerEnabled == false) {
            		 if(shadowItem instanceof Array) {
            			 //multiple tasks dragged case
            			 for ( var count = 0; count < shadowItem.length; count++) {
            				 eachShadowItem = shadowItem[count];
            				 showTimeLineAndDrawShadow(eachShadowItem, draggingEffectStyle);
            			 }
            		 } else {
            			 showTimeLineAndDrawShadow(shadowItem, draggingEffectStyle);
            		 }
            	} else if(shadowItem != null && showTrackerEnabled == true) {
            		 var	height = axisy.p2c(2) - axisy.p2c(1);
            		 var beginX = 0, endX = 0, beginY, endY;
            		//Tracker mode enabled
            		 if(shadowItem instanceof Array) {
            			 //multiple tasks dragged case
            			 for ( var count = 0; count < shadowItem.length; count++) {
            				 eachShadowItem = shadowItem[count];
            				 endOfShadow = eachShadowItem.drawMouseX + eachShadowItem.widthInPixels;
            				 if(count == 0) {
            					 beginX = eachShadowItem.drawMouseX;
            					 endX = endOfShadow;
            				 }
            				 if(eachShadowItem.drawMouseX < beginX) {
            					 beginX = eachShadowItem.drawMouseX;
            				 }
            				 if(endOfShadow > endX) {
            					 endX = endOfShadow;
            				 }
            			 }//for
            			 if(eachShadowItem != null) {
     	            	beginY = eachShadowItem.drawMouseY,
     	            	endY = eachShadowItem.drawMouseY + height;
            			 }

            		 } else {
            	            beginX = shadowItem.drawMouseX ,
            	            endX = shadowItem.drawMouseX + shadowItem.widthInPixels,
            	            beginY = shadowItem.drawMouseY,
            	            endY = shadowItem.drawMouseY + height;
            	            //Here there is a need of line to teh shadow from the dragged Task - Only for ONE TASK DARGGING
            	            var originalTask = shadowItem.draggedTask ,
                        	middlePixel =  shadowItem.widthInPixels/2,
                        	trackerStyle = draggingEffectStyle.showTracker;
	                        var axisx = series.xaxis;
	                        var startCoordinate = axisx.p2c(originalTask.start) + middlePixel;
	                        //Draw line from the original task to shadow
	                        hctx.beginPath();
	                        hctx.lineWidth = trackerStyle.lineWidth; // we can set the line width default to 2
	                        hctx.strokeStyle = trackerStyle.lineColor;
	                        hctx.moveTo(startCoordinate, axisy.p2c(originalTask.yValue));
	             	        hctx.lineTo( shadowItem.currentMouseX + 0.5, shadowItem.currentMouseY);
	             	        hctx.stroke();
	             	        hctx.closePath();
            		 }

            		 showTrackerAndShadowRectangle(draggingEffectStyle.showTracker, beginX, endX, beginY, endY);
            	}
            }

           //For drawing mousetracker
           if(options.mouseTracker.enable && plot.getCurrentMousePosition() != null) {
        		 drawMouseTracker(options.mouseTracker);
           }
          //For drawing task tracker on mouse move
           if(options.taskTracker.enable && (plot.getTrackedTask() != null ||  plot.getTrackedArea() != null)) {
        		   drawTaskTracker(options.taskTracker);
        	   }
            if(plot.selectRectangle != null) {
            	drawSelectionStyle = options.rectangleSelect.rectangleSelectStyle;
            	hctx.strokeStyle = drawSelectionStyle.lineColor;
            	hctx.strokeRect(plot.selectRectangle.x, plot.selectRectangle.y, plot.selectRectangle.width, plot.selectRectangle.height);
            	hctx.fillStyle = drawSelectionStyle.fillColor;
            	hctx.fillRect(plot.selectRectangle.x, plot.selectRectangle.y, plot.selectRectangle.width, plot.selectRectangle.height);

            	for(var fh in rectangleFrameHighlights) {
                 	var eachHighLightItem = rectangleFrameHighlights[fh];
                     drawGanttHighlight(eachHighLightItem, drawSelectionStyle, "SELECTION");
                }

            } else if(plot.taskCreationRectangle != null) {
            	var drawTaskCreateStyle = options.taskCreate.taskCreateStyle;
            	hctx.strokeStyle = drawTaskCreateStyle.lineColor;
            	eachHighLightItem = {
            			start : plot.taskCreationRectangle.startTime,
            			yValue : plot.taskCreationRectangle.startRow,
            			end : plot.taskCreationRectangle.endTime
            	};
            	drawGanttHighlight(eachHighLightItem, drawTaskCreateStyle, "TASK_CREATE_MODE");
            }

            //draw current time moved to overlay
  	       if(options.grid.showCurrentTimeMarker) {
  	    	  drawTimeMarker(hctx);
   	       }
  	       hctx.restore();
  	       //FOR ALL LAYERS
           for (eachLayerName in canvasLayerMap) {
	       		if(eachLayerName == mainLayerName) { //Don't clear the base
	       			continue;
	       		}
	       		canvasLayerMap[eachLayerName].context.restore();
       		}

           //NOTE: ALL ACTIONS DONE AFTER RESTORING COORDINATES
           //column Header SelectionObject is created only on columnDrag
           columnHeaderSelectObject = plot.getColumnHeaderSelectionObject();

           if( columnHeaderSelectObject != null && options.columnHeaderDrag.interactive) {
	           	drawSelectionStyle = options.columnHeaderDrag.selectionStyle;
	           	columnHeaderSelectObject.selectionStyle = drawSelectionStyle
	           	columnHeaderSelectObject.action = plot.COLUMN_HEADER_DRAG;
	           	drawHeaderSelectedArea(columnHeaderSelectObject, hctx);
           }

           //daySelectObject is created here on header day click
           if((options.columnHeaderClick.selectionAllowed || options.xaxis.columnSummary.selectionAllowed)
        		    && tickHighlights != undefined) {
        	   var daySelectObject = {};
        	   if(options.columnHeaderClick.selectionAllowed ) {
            	   drawSelectionStyle = options.columnHeaderClick.selectionStyle;
               }
               if(options.xaxis.columnSummary.enable && options.xaxis.columnSummary.selectionAllowed ) {
            	   drawSelectionStyle = options.xaxis.columnSummary.selectionStyle;
               }
        	   //column headers days is seleced on columnclick and is drawn here
        	   daySelectObject.selectionStyle = drawSelectionStyle
        	    for(var index in  tickHighlights) {
        	    	if(tickHighlights[index].highlighted) { // if tick is highlighted
        	    		daySelectObject.startTime = parseInt(tickHighlights[index].startTick);
        	    		daySelectObject.endTime = parseInt(tickHighlights[index].endTick);
        	    		daySelectObject.action = "COLUMN_HEADER_CLICK";
        	    		drawHeaderSelectedArea(daySelectObject, hctx);
        	    	}
        	   }
           }
           //DRAGGING HEADER SHADOW
	  	   shadowHeaderItem = plot.getShadowHeaderItem();
           if(shadowHeaderItem != null && options.headerDrag.interactive && options.headerDrag.shadowEffect)  {
        	   drawRowHeaderHighlight(shadowHeaderItem, axisy, "SHADOW");
            }  else if(options.rowHeaderHover.autoHighlight  && hoveredArea !=null && hoveredArea.label == "ROW_HEADER_ITEM") {
            	//HOVERING MODE ON ROW HEADER
           		drawRowHeaderHighlight(hoveredArea, axisy, "HOVER");
           	}

  	       //drawing Corner boxes for everything drawn on highlight canvas
	  	  //if(axisy.options.multiColumnLabel && axisy.options.multiColumnLabel.columns.length > 0) {
	           //Note : Drawing all the corners if it is enabled
		      if(options.grid.cornerBox.enable) {
		   			drawCornerBoxes("OVERLAY", hctx);
		   	  }
	  	  // }
         executeHooks(hooks.drawHighLightOverlay, [hctx]);

        }//drawHighlioght overlay

        /**
         * This will draw the rowHeader Item in the highlighted canvas .
         * Mode SHADOW and HOVER triggered from here.
         * This will inturn call the common label renderer.
         */
        function drawRowHeaderHighlight(rowHeaderItem, axisy, mode) {
        	if(rowHeaderItem == null) {
        		return;
	  	   }
            	//Call renderer with the moving coordinates
				var labelRendererCallbackFn = axisy.options.labelRenderer;
			var rowHeaderObject =  rowHeaderItem.rowHeaderInfo;

        	 var x , y = 0, dataToPass = {};
        	 dataToPass.box = axisy.box;
        		var tickHeight =  axisy.p2c(1) - axisy.p2c(0);
			if(mode == "SHADOW") {
				rowHeaderObject = rowHeaderItem.draggedHeader;
				x = rowHeaderItem.drawMouseX;
				y = rowHeaderItem.drawMouseY;
				dataToPass.draggable = true;
			} else  if( mode == "HOVER") {
				if(!rowHeaderItem.hoverNodeDetails) { //NORMAL ROW HEADER
					rowHeaderObject = rowHeaderItem.rowHeaderInfo;
					x = axisy.box.left;
					y = plotOffset.top + axisy.p2c(rowHeaderItem.yValue);     //same for both sides
					dataToPass.currentPosition = rowHeaderItem.currentPosition;
				} else  { // multi column headers and tree
					// console.log("HOVERED ON  MULTI COLUMN NODE ", rowHeaderItem.rowHeaderInfo);
					var hoveredColumn = rowHeaderItem.hoverNodeDetails.hoveredColumn;
					 if(hoveredColumn && hoveredColumn.hoveredNode) {
						 // do not highlight tree root nodes
						 drawHoveredColumnHighlight(hoveredColumn.hoveredHeaderColumn,
               			   hoveredColumn.hoveredNode, hoveredColumn.left, axisy,
               			   hoveredColumn.hoveredProperty , rowHeaderItem.hoverNodeDetails.pos);
					 }
				}
			}

			var rowIdAttribute = options.series.gantt.rowIdAttribute
			var rowId = rowHeaderObject[rowIdAttribute];
	        if(!labelRendererCallbackFn  ) { // if no renderer provided and not tree
	        	if( axisy.options.treeNode.nodeLimit) {
	        		return;
	        	}

	        	if(series.gantt && series.gantt.cacheHeaderTextAsImage || series.gantt.cacheTextAsImage) {
		        	textRenderer.setContext(ctx);
		        	textRenderer.fillTextForHeader(rowId, x, y, undefined);
				} else {
		        	var top =    y - (tickHeight/2); // normal case
	        		var  areaBox = {
	            			  left : axisy.box.left,
	            			  top : top,
	            			  height : tickHeight,
	            			  width : axisy.box.width - axisy.box.labelMargin - options.grid.borderWidth //labelMargin is ~ to options.grid.labelMargin
				};
		    		hctx.fillStyle = 'rgba(0, 0, 255, 0.4)';
		    		hctx.fillRect (areaBox.left, areaBox.top, areaBox.width, areaBox.height);
		    		hctx.fillStyle = '#000000';
		    		hctx.textAlign = "center";
		    		hctx.fillText(rowId  , areaBox.left + areaBox.width/2, areaBox.top + areaBox.height/2);
	        	}

		        } else  {
	        	var yValue = rowHeaderItem.yValue;
				if(!yValue) {
					yValue = plot.getSeries().rowYvalueMap[rowId];
				}
				dataToPass.x = x;
				dataToPass.y = y;
				dataToPass.yValue = yValue;
				dataToPass.mode = mode;
				dataToPass.rootNode = rowHeaderItem;
				//actal call to the renderer
				drawRowHeaderRenderer(axisy, rowHeaderObject, hctx, dataToPass);

	        }
        }
         /**
          *
          *  The highlighting of the hovered multi column row headers are done in this function.
          *  This will trigger the row renderers with the drawing canvas as highlight.
          *  The currentNode will not be null here as highlighting of tree node will not happen here
          */
      function drawHoveredColumnHighlight(eachHeaderColumn, currentNode, left,  axis, property, pos) {
        var yValue = Math.round(pos.y);
    	var y =  plotOffset.top +  axis.p2c(yValue);
		var rowHeaderObject =  currentNode.data;
		var defaultLabel = rowHeaderObject ? rowHeaderObject[property]: eachHeaderColumn[property];
		var tickHeight =  axis.p2c(1) - axis.p2c(0);
		var borderWidth = 0;
		var colHeight;
		var borderObject  = axis.options.multiColumnLabel.border;
		if(borderObject != undefined && borderObject.width > 0) {
			borderWidth = borderObject.width; //default 1
			ctx.lineWidth = borderWidth; //default 1
		}
		var top, value = yValue;
	    if (plot.areWrapRowsEnabled()) {
    		 var wrapIndexDisplayMap = plot.getWrapIndexDisplayMap();
    		 var wrapIndex = wrapIndexDisplayMap[yValue];
    		 var rowIdMaxWrapMap = plot.getRowIdDisplayWrapMap();
    		 currentNode.wrapInfo =  {
        		  wrapIndex :wrapIndex,
   				  wrapMode : plot.getRowIdExpandedStatusMap()[currentNode.rowId],
   				  maxWrapRowIndex : rowIdMaxWrapMap[currentNode.rowId]
    		 };
    		 if(options.series.gantt.wrappedRows.mergeWrapRows && currentNode.isLeafNode) { // if  merged
    			 colHeight = tickHeight * currentNode.wrappedFamilyCount;
    			 top =  y - (tickHeight/2) + borderWidth/2 - (yValue - currentNode.startRowIndex) * tickHeight ;
    			 var wrapIndexChangeMap = plot.getWrapIndexChangeYValueMap();
    			 if(top < 0) {
        			//For catering the part of wrap rows on top, the wrapIndexChangeMap[yValue] will be undefined in this case.
        			var wrapYvalue = series.actualFirstWrapDisplayMap[yValue];
        			value =  wrapIndexChangeMap[wrapYvalue];
    			 } else {
	        		value = wrapIndexChangeMap[yValue];
    			 }
    			 if( value  === undefined) {
	        		// the half of the first row if on top should be drawn even if wrapIndex is >0 and
	        		//draw only the first row in case of wrap, set the value to 0
    				colHeight = tickHeight*currentNode.wrappedFamilyCount;
    				top = y - (tickHeight/2) + borderWidth/2 - (yValue - currentNode.startRowIndex) * tickHeight;
		        }

    		 } else {
    			 if(currentNode.isLeafNode) {
    				 colHeight = tickHeight*currentNode.familyCount;
    			 top = (y - (tickHeight/2) + borderWidth/2 - (yValue - currentNode.startRowIndex) * tickHeight)
    			 						+ (wrapIndex * tickHeight); // adding wrapIndex with tickHeight to get each Top
    			 } else {
    			 	//will be merged rows
    				colHeight = tickHeight*currentNode.wrappedFamilyCount;
    				 top = y - (tickHeight/2) + borderWidth/2 - (yValue - currentNode.startRowIndex) * tickHeight;
    			 }
    		 }
		 } else {// NO WRAP

			 colHeight = tickHeight * currentNode.familyCount;
        	 top =  y - (tickHeight/2) + borderWidth/2 - (yValue - currentNode.startRowIndex) * tickHeight ;
		 }
		 //Adding selection highlights to rowHeaders according to child Nodes that are selected.
		 //selection of merged headers by checking the selection of chilNodes
   		 if(!currentNode.isLeafNode) {
   			// if all child nodes are true, highlight the parent
   			currentNode.selected = isAllChildNodesHighlighted(currentNode);
   		 } else {
   			currentNode.selected =  rowHighlights[currentNode.rowId]; // is leaf node
   		 }
		var columnWidth = eachHeaderColumn.width;
		var cellRendererCallbackFn = eachHeaderColumn.cellRenderer;
		areaBox = getAreaBoxForEachColumn(left + borderWidth, top, columnWidth, colHeight, borderWidth);
	    dataToRenderer = {
		           			  label: defaultLabel,
		           			  value :  value,
		           			  labelInfo : currentNode,
		           			  drawingContext : hctx,
		           			  areaBox :areaBox,
		           			  labelMargin: axis.box.labelMargin,
		           			  selected:currentNode.selected,
		           			  mode : "HOVER"
		     };
		   triggerCallBackRenderer(dataToRenderer, cellRendererCallbackFn);
        } //function


        //This draws th area or days on drag or click. Just does the drawing
        function drawHeaderSelectedArea(columnHeaderSelectObject, hctx) {
        	var drawSelectionStyle = columnHeaderSelectObject.selectionStyle;
        	var startTime= columnHeaderSelectObject.startTime,
       		endTime= columnHeaderSelectObject.endTime;
        	if(startTime == undefined || endTime == undefined) {
        		return;
        	}
        	var xaxis = plot.getSeries().xaxis;
       		var	startTimeToCanvasPos = xaxis.p2c(startTime) + plotOffset.left,
       			endTimeToCanvasPos = xaxis.p2c(endTime) + plotOffset.left,
       			plotWidth = plot.width();

	       	if (endTime <= xaxis.min || startTime >= xaxis.max) {
	       		return; // don't draw the selection highlights
	       	}
	       	if(startTimeToCanvasPos < plotOffset.left   ) {
	       		startTimeToCanvasPos = plotOffset.left;
	       	}
			if(endTimeToCanvasPos > plotOffset.left + plotWidth ) {
				endTimeToCanvasPos = plotOffset.left + plotWidth;
			}
			var width = endTimeToCanvasPos - startTimeToCanvasPos;

			if(columnHeaderSelectObject.action == "COLUMN_HEADER_CLICK") {
					if(plot.highlightedTick.type == plot.MINOR_TICK) {
						//check if unit is same --then draw
						if((xaxis.tickSize[0] !=  plot.highlightedTick.size)  || (xaxis.tickSize[1] != plot.highlightedTick.unit)) {
							if (xaxis.majorTickSize[0] ==  plot.highlightedTick.size  && xaxis.majorTickSize[1] ==  plot.highlightedTick.unit ) {
								//Switch  the tick on ZOOM when type changes
								plot.highlightedTick.type = plot.MAJOR_TICK;
								 plot.highlightedTick.selectionStart = (xaxis.topHeaderHeight > 0) ? topHeaderHeight : 0;
								 if(drawSelectionStyle.type == "HEADER_ONLY") {
									 plot.highlightedTick.selectionEnd =   xaxis.endOfMajorTickLabel;
								 } else  if(drawSelectionStyle.type == "COMPLETE_HEADER") {
									 plot.highlightedTick.selectionEnd =   xaxis.endOfMinorTickLabel;
								 }
							} else {
								//clear the tick
								plot.clearAllTickHighlights();
								return;
							}
						}
					}
					if(plot.highlightedTick.type == plot.MAJOR_TICK) {
						//check if unit is same --then draw
						if((xaxis.majorTickSize[0] !=  plot.highlightedTick.size)  || (xaxis.majorTickSize[1] != plot.highlightedTick.unit)  ) {
							 if (xaxis.tickSize[0] ==  plot.highlightedTick.size  && xaxis.tickSize[1] ==  plot.highlightedTick.unit ) {
								//Switch the tick on ZOOM if  type chnages
								 plot.highlightedTick.type = plot.MINOR_TICK;
								 plot.highlightedTick.selectionStart = xaxis.endOfMajorTickLabel;
								 plot.highlightedTick.selectionEnd =   xaxis.endOfMinorTickLabel; // stored when drawing horizontal lime in core
							} else {
								//clear the tick
								plot.clearAllTickHighlights();
								return;
							}
						}
					}
			}
			var labelMargin = (xaxis.options.labelMargin > 0 ? xaxis.options.labelMargin : 0);
			if(!xaxis.showLabel){ //specifically if it is not displayed
				xaxis.heightOfMinorTickLabel = 0;
				xaxis.heightOfMajorTickLabel = 0;
			}
			var selectionStart = 0, selectionEnd = 0;
			if(columnHeaderSelectObject.action == "COLUMN_HEADER_CLICK") {
				if(xaxis.showLabel) {
				selectionStart = plot.highlightedTick.selectionStart; // Set from util
				selectionEnd = plot.highlightedTick.selectionEnd;
				}

			} else if(columnHeaderSelectObject.action == plot.COLUMN_HEADER_DRAG) {
				 selectionStart =  xaxis.options.topHeader.enable ? xaxis.options.topHeader.height : 0;
			 	var heightOfMinorTickLabel, heightOfMajorTickLabel;
			 	var totalHeightOfMajorTickLabel = 0, totalHeightOfMinorTickLabel = 0;
				if(xaxis.heightOfMajorTickLabel != undefined ) {
					heightOfMajorTickLabel = xaxis.heightOfMajorTickLabel;
					totalHeightOfMajorTickLabel = heightOfMajorTickLabel +  (2* labelMargin);
				}
				if(xaxis.heightOfMinorTickLabel != undefined ) {
					heightOfMinorTickLabel = xaxis.heightOfMinorTickLabel;
					totalHeightOfMinorTickLabel = heightOfMinorTickLabel +   labelMargin;
				}
				selectionEnd = selectionStart +  totalHeightOfMinorTickLabel + totalHeightOfMajorTickLabel;
			}
			var selectionHeight = 0;
			if(drawSelectionStyle.type == 'FULL') {
				selectionHeight = canvasHeight;
			}  else {
				selectionHeight = selectionEnd - selectionStart  ;
			}
			if(columnHeaderSelectObject.renderer == undefined) {
				hctx.strokeStyle = drawSelectionStyle.lineColor;
		       	hctx.strokeRect(startTimeToCanvasPos, selectionStart, width, selectionHeight);
		       	hctx.fillStyle = drawSelectionStyle.fillColor;
		    	hctx.fillRect(startTimeToCanvasPos, selectionStart, width, selectionHeight);
			} else {
				var dataToRenderer = {
						drawingContext :hctx,
						areaBox : {
								left: startTimeToCanvasPos,
								top : selectionStart,
								width: width,
								height: selectionHeight
						},
						draggedRowObject : columnHeaderSelectObject,
				};
				triggerCallBackRenderer(dataToRenderer, columnHeaderSelectObject.renderer);
			}
        }

        function clearAllHeaderPortions() {
        	//Do it for highlightCanvas
        	clearHeaderForCanvas(hctx);
        	//Do it for all canvas in canvasLayerMap
        	for (eachLayerName in canvasLayerMap) {
	        	if(eachLayerName == mainLayerName) {
	        		continue; //Don't clear for main layer.. we are drawing header in main layer
	        	}
	    		clearHeaderForCanvas(canvasLayerMap[eachLayerName].context);
	        }
        }
        /**
         * clearing all left top, bottom, right headers
         * clears the highlight Canvas as well as priority Canvas and or any canvas added in canvasLayerMap
         */
        function clearHeaderForCanvas(context) {

        	context.restore();
        	if(plotOffset.top > 0){
        		context.clearRect(plotOffset.left, 0, plotWidth, plotOffset.top);
        	}
        	if(plotOffset.bottom > 0){
        		context.clearRect(plotOffset.left, canvasHeight-plotOffset.bottom, plotWidth, plotOffset.bottom);
        	}
        	 if(plotOffset.left > 0){
        		 context.clearRect(0, 0, plotOffset.left, canvasHeight);
        	}
        	if(plotOffset.right > 0){
        		context.clearRect(canvasWidth - plotOffset.right,0, plotOffset.right, canvasHeight);
        	}
        	//keep back teh previous origin
        	context.save();
        	context.translate(plotOffset.left, plotOffset.top);
        }

        function showTimeLineAndDrawShadow(shadowItem, draggingEffectStyle) {

        	if(draggingEffectStyle.showTimeLine) {
     			hctx.lineWidth = draggingEffectStyle.lineWidth; // we can set the line width default to 2
                hctx.strokeStyle = draggingEffectStyle.lineColor;
                hctx.moveTo(shadowItem.drawMouseX + 0.5, shadowItem.drawMouseY);
     	        hctx.lineTo(shadowItem.drawMouseX + 0.5,  0);
     	        //console.log(" dateTo display " + dateTodisplay.toString());
     	        hctx.stroke();
     		}
			drawGanttHighlight(shadowItem, draggingEffectStyle, "SHADOW");
        }

        /**
         * Function to call when tracker mode is enabled
         * @param shadowItem
         * @param trackerStyle
         */
        function showTrackerAndShadowRectangle(trackerStyle, beginX, endX, beginY, endY) {
        	hctx.lineWidth = trackerStyle.lineWidth; // we can set the line width default to 2
            hctx.strokeStyle = trackerStyle.lineColor;

            //Draw vertical line at the begining of shadow
            hctx.beginPath();
            hctx.moveTo(beginX, 0);
 	        hctx.lineTo(beginX,  plotHeight);

 	        //Draw vertical line at the  end of the shadow
 	        hctx.moveTo(endX, 0);
 	        hctx.lineTo(endX,  plotHeight);

 	       //Draw horizontal line at start of row
 	        hctx.moveTo(-plotOffset.left, beginY);
	        hctx.lineTo(plotWidth + plotOffset.right ,  beginY);

	        //Draw horizontal line at end of row
	        hctx.moveTo(-plotOffset.left, endY);
	        hctx.lineTo(plotWidth + plotOffset.right, endY );
	        hctx.closePath();

	        hctx.fillStyle = trackerStyle.fillColor;
	        hctx.fillRect(beginX, beginY, endX-beginX, endY-beginY);

	        hctx.stroke();

        }

        /**
         * function that draws vertical, horizontal or both lines at mouse position.
         */
        function drawMouseTracker(mouseMarkerStyle) {
        	//console.log("In drawMouseTracker plot ", plot.getPlaceholder().attr("id")  );
        	var position = plot.getCurrentMousePosition(),
				x = position.currentMouseX,
				y = position.currentMouseY;

			hctx.lineWidth = mouseMarkerStyle.lineWidth;
        	hctx.strokeStyle = mouseMarkerStyle.lineColor;
			switch(mouseMarkerStyle.direction) { // set currentMouseY and x value according to move direction. limiting
				case 'horizontal' : {
					if (mouseMarkerStyle.dashedLine) {
						hctx.createDashedLine(-plotOffset.left, y, plotWidth + plotOffset.right, y);
					} else {
						hctx.beginPath();
						hctx.moveTo(-plotOffset.left, y);
						hctx.lineTo(plotWidth + plotOffset.right, y);
						hctx.stroke();
					}
					break;
				}
				case 'vertical' : {
					if (mouseMarkerStyle.dashedLine) {
						hctx.createDashedLine(x, 0, x, plotHeight, null);
					} else {
						hctx.beginPath();
						hctx.moveTo(x, 0);
						hctx.lineTo(x, plotHeight);
						hctx.stroke();
					}
					break;
				}
				case 'both' : {
					if (mouseMarkerStyle.dashedLine) {
						hctx.createDashedLine(-plotOffset.left, y, plotWidth + plotOffset.right, y);
						hctx.createDashedLine(x, 0, x, plotHeight);
					} else {
						hctx.beginPath();
						hctx.moveTo(-plotOffset.left, y);
						hctx.lineTo(plotWidth + plotOffset.right, y);
						hctx.moveTo(x, 0);
						hctx.lineTo(x, plotHeight);
						hctx.stroke();
					}
					break;
				}
			}


        }

        // clear and redraw the hightlight overlay for gantt
        function clearHighlightOverlay() {
        	if(hctx != null) {
	            hctx.clearRect(0, 0, canvas.width, canvas.height);
        	}
        }
        //- Highlighting selected tasks for gantt tasks
        function drawGanttHighlight(highLightItem , drawStyle, mode) {
        	var selectedHotSpot = null;

        	if(highLightItem.selectedHotSpot != undefined) {
        		selectedHotSpot = highLightItem.selectedHotSpot;
        		highLightItem = highLightItem.details;
        	}


        	//Note: set the position of yValue only for these modes before drawing
          if(mode == "BLINKING_MODE" || mode == "SELECTION" || mode == "HOVER" || mode == "FOCUS") {
        		var currentSeries = plot.getSeries();
	        	var rowIdProviderCallBackFunction = currentSeries.gantt.rowIdProviderCallBack;
	         	var rowIdAttributeInTask = currentSeries.gantt.rowIdAttributeInTask, eachRowHeaderKey = null;

	         	if(rowIdAttributeInTask != null) {
	 				eachRowHeaderKey = highLightItem[rowIdAttributeInTask];
	 			} else if(rowIdProviderCallBackFunction != null){
	 				//Get the row key from rowIdProviderCallBack
	 				eachRowHeaderKey = triggerCallBackProviderToGetRowId(highLightItem, rowIdProviderCallBackFunction);
	 			}

	         	highLightItem.rowId = eachRowHeaderKey;  //set it as default rowId     as it is used in draw
	         	var actualYValueOfRow = currentSeries.rowYvalueMap[eachRowHeaderKey];


	         	if (plot.areWrapRowsEnabled() ) {
	         		var firstDisplayedYValueOfRow = currentSeries.actualFirstWrapDisplayMap[actualYValueOfRow];
	         		var rowIdExpandedStatusMap = plot.getRowIdExpandedStatusMap();
	         		if(rowIdExpandedStatusMap [eachRowHeaderKey]) {
         			 //Add the wrapIndex to get the displayed Row correctly if the row is expanded
         			 wrapIndex = plot.getTaskIdWrapIndexMap()[highLightItem.chronosId];
         			 highLightItem.yValue =	 firstDisplayedYValueOfRow + wrapIndex;

	         		}
         		 } else {
         			 //In all other cases
         			highLightItem.yValue =	 actualYValueOfRow ;
         		 }
        	 }

        	if(mode == "BLINKING_MODE" ) {
        		drawGanttTask(highLightItem.start, highLightItem.yValue, highLightItem.end, series.xaxis,  series.yaxis, hctx,
	            		highLightItem, mode, selectedHotSpot);
        		return true;
        	}
        	if(hctx != null && highLightItem != null && drawStyle != null) {
        		if(drawStyle.lineWidth != null) {
        			hctx.lineWidth = drawStyle.lineWidth;
        		}
	            if(drawStyle.lineColor != null) {
	            	hctx.strokeStyle = drawStyle.lineColor;
	            }
	            if(drawStyle.fillColor != null) {
	            	hctx.fillStyle = drawStyle.fillColor;
	            }
	            drawGanttTask(highLightItem.start, highLightItem.yValue, highLightItem.end, series.xaxis,  series.yaxis, hctx,
	            		highLightItem, mode, selectedHotSpot);
        	}

        	if(mode == "SHADOW" && drawStyle.showTime) {
        		hctx.beginPath();
        		if(highLightItem != null && highLightItem.start != Number.NaN) {
        			var axisx = plot.getSeries().xaxis;
        			var dateTodisplay = $.chronosDate(plot, highLightItem.start);
        			if(dateTodisplay != null) {
        				hctx.fillStyle=drawStyle.lineColor;
        				hctx.fillText(dateTodisplay.converToString() , shadowItem.drawMouseX + 0.5 , shadowItem.drawMouseY + 2);
        			}
        		}
        	}
        }

        function drawTimeMarker(hctx) {
           if (markerTime != null) {
				var options = plot.getOptions();
				var timeMarkerStyle = options.grid.timeMarkerStyle;
				hctx.lineWidth = timeMarkerStyle.lineWidth;
				hctx.strokeStyle = timeMarkerStyle.lineColor;

				var currentTimeMouseX = getCanvasXCoordinateForTime(markerTime);
				// clip if it is outside plot area
				if (currentTimeMouseX > 0 &&  currentTimeMouseX <= plotWidth) { // not a negative value & before right side header
					if (timeMarkerStyle.dashedLine) {
						hctx.createDashedLine(currentTimeMouseX, 0, currentTimeMouseX, plotHeight, null);
					} else {
						hctx.beginPath();
						hctx.moveTo(currentTimeMouseX, 0);
						hctx.lineTo(currentTimeMouseX, plotHeight);
						hctx.stroke();
						hctx.closePath();
					}
				}

				if(options.grid.showCurrentTimeMarker && timeMarkerStyle.showTime) {
					var e = mouseMoveEvent;
					if(e == null) {
						return;
					}
					//display time on mouse hover
					var offset = plot.offset(),
		        	plotOffset = plot.getPlotOffset(),
		        	currentMouseX = plot.getPageX(e) - offset.left - plotOffset.left,
		        	currentMouseY = plot.getPageY(e) - offset.top - plotOffset.top;
					// clip if it is outside plot area
					if (currentTimeMouseX > 0
							&&  currentTimeMouseX <= plotWidth // not a negative value & before right side header
					 		&& (currentTimeMouseX  <= (currentMouseX + timeMarkerStyle.lineWidth) ) &&
					 				(currentTimeMouseX  >= (currentMouseX - timeMarkerStyle.lineWidth) ))  {
						//console.log("setTimeMarker markerTime : " , markerTime);
						dateTodisplay = $.chronosDate(plot, markerTime);
						//console.log("dateTodisplay ", dateTodisplay.getTime());
	        			if(dateTodisplay != null) {
	        				dateTodisplay = $.chronos.formatDate(dateTodisplay, timeMarkerStyle.showTime.timeFormat);
	        				 var f= timeMarkerStyle.showTime.font;
	        				hctx.font = f.style + " " + f.variant + " " + f.weight + " " + f.size + "px '" + f.family + "'";
	        				hctx.fillStyle = f.color;
	        				hctx.fillText(dateTodisplay ,currentTimeMouseX , currentMouseY);
	        			}
					}
				}

			}
        }

        // Set the marker time to plot variable
        function setTimeMarker(timeTodrawInMilliseconds) {
        	  // setting to plot variable markerTime
             if(timeTodrawInMilliseconds == null) {
            	 var currentTime = $.chronosDate(plot, new Date());
            	 markerTime = currentTime.getTime();
             } else {
            	 markerTime = timeTodrawInMilliseconds;
             }
        }

		//To draw the corresponding startValue marker
        function drawGanttMarker(e) {
        	if(hoverItem == null){
        		return;
        	}
        	var offset = plot.offset();
			var plotOffset = plot.getPlotOffset();

			var currentMouseX = e.clientX - offset.left - plotOffset.left;
			var currentMouseY = e.clientY - offset.top - plotOffset.top;
            hctx.save();
            hctx.translate(plotOffset.left, plotOffset.top);
            hctx.clearRect(0, 0, canvasWidth, canvasHeight);

            hctx.lineWidth = 2; // we can set the line width default to 2
            hctx.strokeStyle = "#ff0000";
	        hctx.moveTo(currentMouseX, currentMouseY);
	        hctx.lineTo(currentMouseX,  0);
	        hctx.stroke();
	        var canvasToaxisPos = plot.c2p({  // the dragging coordinates
					left : currentMouseX,
					top : currentMouseY
				});
	         var draggedTask = hoverItem.details,
	         	 taskWidth = draggedTask.end - draggedTask.start;

			var startTime = canvasToaxisPos.x,
				endTime = startTime + taskWidth,
				rowYValue = Math.round(canvasToaxisPos.y);

			 //Now draw the shadow of the task
	         drawSingleTask(startTime, endTime, rowYValue, hctx);
	         hctx.restore();
        }

        function removeGanttMarker() {
             hctx.clearRect(0, 0, canvasWidth, canvasHeight);

        }

        //SUPPORT FOR OTHER CHARTS  -LINE, BAR & POINT
        var redrawTimeout = null;
        function highlight(s, point, auto) {
            if (typeof s == "number")
                s = series[s];

            if (typeof point == "number") {
                var ps = s.datapoints.pointsize;
                point = s.datapoints.points.slice(ps * point, ps * (point + 1));
            }

            var i = indexOfHighlight(s, point);
            if (i == -1) {
                highlights.push({ series: s, point: point, auto: auto });

                triggerRedrawOverlay();
            }
            else if (!auto)
                highlights[i].auto = false;
        }

        function triggerRedrawOverlay() {
            var t = options.interaction.redrawOverlayInterval;
            if (t == -1) { // skip event queue
                drawOverlay();
                return;
            }

            if (!redrawTimeout)
                redrawTimeout = setTimeout(drawOverlay, t);
        }
        function drawOverlay() {
            redrawTimeout = null;

            // draw highlights
            octx.save();
            octx.clearRect(0, 0, canvasWidth, canvasHeight);
            octx.translate(plotOffset.left, plotOffset.top);

            var i, hi;
            for (i = 0; i < highlights.length; ++i) {
                hi = highlights[i];
                if (hi.series.bars.show)
                    drawBarHighlight(hi.series, hi.point);
                else
                    drawPointHighlight(hi.series, hi.point);
            }
            octx.restore();

            //executeHooks(hooks.drawOverlay, [octx]);
        }

        function unhighlight(s, point) {
            if (s == null && point == null) {
                highlights = [];
                triggerRedrawOverlay();
            }

            if (typeof s == "number")
                s = series[s];

            if (typeof point == "number")
                point = s.data[point];

            var i = indexOfHighlight(s, point);
            if (i != -1) {
                highlights.splice(i, 1);

                triggerRedrawOverlay();
            }
        }

        function indexOfHighlight(s, p) {
            for (var i = 0; i < highlights.length; ++i) {
                var h = highlights[i];
                if (h.series == s && h.point[0] == p[0]
                    && h.point[1] == p[1])
                    return i;
            }
            return -1;
        }

        function drawPointHighlight(series, point) {
            var x = point[0], y = point[1],
                axisx = series.xaxis, axisy = series.yaxis;

             highlightColor = (typeof series.highlightColor === "string") ? series.highlightColor : $.color.parse(series.color).scale('a', 0.5).toString();

            if (x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                return;

            var pointRadius = series.points.radius + series.points.lineWidth / 2;
            octx.lineWidth = pointRadius;
            octx.strokeStyle = highlightColor;
            var radius = 1.5 * pointRadius,
                x = axisx.p2c(x),
                y = axisy.p2c(y);

            octx.beginPath();
            if (series.points.symbol == "circle")
                octx.arc(x, y, radius, 0, 2 * Math.PI, false);
            else
                series.points.symbol(octx, x, y, radius, false);
            octx.closePath();
            octx.stroke();
        }

        function drawBarHighlight(series, point) {
            var highlightColor = (typeof series.highlightColor === "string") ? series.highlightColor : $.color.parse(series.color).scale('a', 0.5).toString(),
                fillStyle = highlightColor,
                barLeft = series.bars.align == "left" ? 0 : -series.bars.barWidth/2;

            octx.lineWidth = series.bars.lineWidth;
            octx.strokeStyle = highlightColor;


            drawBar(point[0], point[1], point[2] || 0, barLeft, barLeft + series.bars.barWidth,
                    0, function () { return fillStyle; }, series.xaxis, series.yaxis, octx, series);
        }

       //SUPPORT FOR OTHER CHARTS  END
       function drawSingleTask(startTime, endTime, rowYValue, context) {
        	 var left = startTime,
             	right = endTime,
             	top = rowYValue + barBottom,
             	bottom = rowYValue - barTop,
             	series = plot.getSeries(),
             	axisx = series.xaxis,
                axisy = series.yaxis;

        	 context.lineWidth = series.gantt.lineWidth;
        	 context.strokeStyle = "#ff0000";

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
             // draw outline
             context.beginPath();
             context.moveTo(left, bottom);
             context.lineTo(left, top);
             context.lineTo(right, top);
             context.lineTo(right, bottom);
             context.lineTo(left, bottom);
             context.closePath();
             context.stroke();
        }



	       	/*
			 * xrange.from, yrange.from , xrange.to, yrange.to,
			 * dashedStyle of [2,3] etc
			 */
	    function createDashedLine(xFrom, yFrom, xTo, yTo, dashedStyle) {
	    	 if (!dashedStyle) dashedStyle = [10,5];
	    	 var ctx = this;

	    	 if (!ctx.setLineDash) {
	    		  ctx.setLineDash = function () {};
	    	 } else {
	    		 ctx.setLineDash(dashedStyle);
	    		 ctx.mozDash = dashedStyle;
	    	 }
	    	 if(ctx.strokeStyle == null) {
	            ctx.strokeStyle = "#000000"; //user need to set this for the context
	         }
	    	 ctx.beginPath();
	    	 ctx.moveTo(xFrom, yFrom);
	    	 ctx.lineTo(xTo, yTo);
             ctx.stroke();
             ctx.closePath();

             //reset the line Dash
             ctx.setLineDash([0]);

	    } //create Dashed Line


	    //this method needs to be called when user chnages the font for a renderering
	    this.clearTextImageCache =  function() {
	    	   this.cachedTextMap = []; // This map holds the cached text for rendering
	           this.cachedTextSizeMap = []; // This map holds the cached text for rendering
	           this.cachedTextMaxWidthMap = [];
	    };


    }



    // round to nearby lower multiple of base
    function floorInBase(n, base) {
        return base * Math.floor(n / base);
    }

    //This renderer should be called from the task filling renderers for setFont , fillText and measureText to improve performnace
    function TextRenderer(plot, series) {

        var context = null;
          //Added for Performance Improvemnt in Scrolling .temporary canvas creation for drawign text
          var dummyCanvas = document.createElement('canvas');
          dummyCanvas.setAttribute('style', 'visibility:hidden');

        var fontObject = null;
        var shouldSetFontToContext = false;

        this.setShouldSetFontToContext= function(flag) {
        	shouldSetFontToContext = flag;
        };

        var cacheHeaderTextAsImage = series.gantt.cacheHeaderTextAsImage;

        this.setContext = function (ctx) {
              context = ctx;
        };
        this.setFont = function(f) {
              if(f.style == undefined) {
                    f.style = "";
              }
              if(f.variant == undefined) {
                    f.variant = "";
              }
              if(f.weight == undefined) {
                    f.weight = "";
              }
              shouldSetFontToContext = true;
              fontObject = f;
              			};

        this.measureText = function(text) {
        	 if(text == null) {
        	    return {width:0};
        	 }
             var textMeasure = plot.cachedTextSizeMap[text];
             if(textMeasure == null) {
                  if(shouldSetFontToContext) {
                		this.checkFontAndSetToContext();
                  }
                  textMeasure = context.measureText(text);
                  plot.cachedTextSizeMap[text] = textMeasure;
            }
            return textMeasure;
        };

        this.fillText = function (text, x, y, maxWidth) {
         	if(text == null || text == "") {
        	    return ;
        	}
         	var style =  "";
         	if(fontObject != null) {
         		style = fontObject.style;
         	}
         	var  key = text + context.fillStyle + style;//Assmp: Style in font only changes
 	        if(context.getFillStyle) { //for The preloading context
 	           key = text + context.getFillStyle() + style; //Assmp: Style in font only changes
 	        }

            //CASE : NO TEXT CACHING  OR when actual draw (Not scrolling)
            if(!series.gantt.cacheTextAsImage || (!plot.getInterimScrollMode() && context.fillText)) {
                  if(maxWidth != undefined) {
                        if(maxWidth > 0) {
                        	if(shouldSetFontToContext) {
  	                    	  this.checkFontAndSetToContext();
  	                    	}
                          var possibleTextWidth = this.measurePossibleTextWidth(context, text, maxWidth, key);
                          context.fillText(text.substring(0, possibleTextWidth.charsToWrite), x, y);

                        }
                  } else {
                	  if(shouldSetFontToContext) {
                    	  this.checkFontAndSetToContext();
                    	}
                      context.fillText(text,x,y);
                  }
                  return;
              }

            //CASE : TEXT CACHING ENABLED
            var cachedImage = plot.cachedTextMap[key];
            var fontHeight = fontObject.size;
            if(cachedImage == null) {
            	cachedImage = this.saveTextAsImageToCache(text, fontHeight, key);
             }
             if(cachedImage != "" && context.drawImage && cachedImage.complete ) {
                    var width = cachedImage.width;
                    var height = cachedImage.height;
                    var clipWidth  = 0;
                    if(fontHeight > 0) {
                           if(maxWidth != undefined) {
                        	   clipWidth = this.measurePossibleTextWidth(context, text, maxWidth, key).viewWidth;

                                if(clipWidth > width) {
                                	clipWidth = width;
                                }
                                if(clipWidth > 0) {
                                      context.drawImage(cachedImage, 0, 0, clipWidth, height, x, y-fontHeight, clipWidth, height);
                                }
                          } else {
                                context.drawImage(cachedImage, x, y-fontHeight);
                           }
                    }
              } else {
	            	  if(shouldSetFontToContext) {
	                	  this.checkFontAndSetToContext();
	                	}
	            	  if(maxWidth > 0) {
		                  	if(shouldSetFontToContext) {
		                    	  this.checkFontAndSetToContext();
		                    }
		                  	var possibleTextWidth = this.measurePossibleTextWidth(context, text, maxWidth, key);
		                    context.fillText(text.substring(0, possibleTextWidth.charsToWrite), x, y);
	                  } else {
	                	  context.fillText(text,x,y);
	                  }
            	  }
          };//function fillText() end

          this.measurePossibleTextWidth = function(context, text, maxWidth, key) {
        	  var keyForMaxWidth  =  key + maxWidth;

        	  if(plot.cachedTextMaxWidthMap[keyForMaxWidth] != undefined) {
        		  return plot.cachedTextMaxWidthMap[keyForMaxWidth];
        	  }

        	  var textLength = text.length;
              var pixelForEachChar = context.measureText("W").width;
              var minCharsToWrite =  Math.floor(maxWidth/pixelForEachChar);
              var charsToWrite =  textLength;
              var textWidth = -1;
              for(var i = minCharsToWrite + 1; i <= textLength; i++) {
            	   var tempTextWidth = context.measureText(text.substring(0, i)).width;
                    if(tempTextWidth >= maxWidth) {
                          charsToWrite = i - 1;
                          break;
                    }
                    textWidth = tempTextWidth;
              }
              if(textWidth == -1) {//incase the loop exited in first iteration
            	  textWidth = context.measureText(text.substring(0, charsToWrite)).width;
              }
              var widthObject = {
            		  charsToWrite:charsToWrite,
            		  viewWidth:textWidth
              };

              plot.cachedTextMaxWidthMap[keyForMaxWidth] = widthObject;

              return widthObject;
          };

          this.checkFontAndSetToContext = function() {
        	  if(fontObject != undefined) {
                  context.font = fontObject.style + " " + fontObject.variant + " " + fontObject.weight + " " + fontObject.size + "px '" + fontObject.family + "'";
                  shouldSetFontToContext = false;
        	  }
          };

          this.saveTextAsImageToCache = function (text, fontHeight, key) {
        	  var cachedImage = null;
        	  if(shouldSetFontToContext) {
            	  this.checkFontAndSetToContext();
            	}
              var textSize = context.measureText(text);
              dummyCanvas.width = textSize.width;
              if(dummyCanvas.width != 0) {
                    dummyCanvas.height = fontHeight + (fontHeight *0.5); // to completely incoorporate the letters j,g,q,y etc
                    var dummyContext = dummyCanvas.getContext("2d");
                    dummyContext.save();
                    dummyContext.font = context.font;
                    dummyContext.fillStyle = context.fillStyle;

                    dummyContext.textAlign = context.textAlign;
                    dummyContext.textBaseline = context.textBaseline;

                    dummyContext.fillText(text, 0, fontHeight);
                  var textImage = new Image();
                    textImage.src = dummyCanvas.toDataURL('image/jpg', 0.25);
                    cachedImage = textImage;
                    plot.cachedTextMap[key] = cachedImage;
                    dummyContext.restore();
              } else {
                    cachedImage = "";
                    plot.cachedTextMap[key] = cachedImage;
              }
              return cachedImage;
          };

          this.measureTextForHeader = function(text) {
          	 if(text == null) {
          	    return {width:0};
          	}
                if(cacheHeaderTextAsImage) {
                      var textMeasure = plot.cachedTextSizeMap[text];
                      if(textMeasure == null) {
                          	if(shouldSetFontToContext) {
                          	  this.checkFontAndSetToContext();
                          	}
                            textMeasure = context.measureText(text);
                            plot.cachedTextSizeMap[text] = textMeasure;
                      }
                      return textMeasure;
                }
                if(shouldSetFontToContext) {
              	  this.checkFontAndSetToContext();
              	}
                return context.measureText(text);
            };

          this.fillTextForHeader = function (text, x, y, maxWidth) {
           	if(text == null) {
          	    return ;
          	}

              var key = text + context.fillStyle;
              if(context.getFillStyle) {
              	  key = text + context.getFillStyle();
              }

              if(cacheHeaderTextAsImage && plot.getInterimScrollMode()) {
		              var cachedImage = plot.cachedTextMap[key];
		                    var fontHeight = parseInt(fontObject.size);
		              if(cachedImage == null) {
		            	  cachedImage = this.saveTextAsImageToCache(text, fontHeight, key);
		              }
		              if(cachedImage != "" && context.drawImage) {
		              	if(cachedImage.complete) {
		                    var width = cachedImage.width;
		                    var height = cachedImage.height;
		                    var clipWidth  = 0;
		                    if(fontHeight > 0) {
		                           if(maxWidth != undefined) {
		                        	   clipWidth = maxWidth-(fontHeight/2);
		                                if(clipWidth > width) {
		                                	clipWidth = width;
		                                }
		                                if(clipWidth > 0) {
		                                      context.drawImage(cachedImage, 0, 0, clipWidth, height, x, y-fontHeight, clipWidth, height);
		                                }
		                          } else {
								    var textAlign = context.textAlign; //done for the case of scrolling labels touching boundary
		                            if(textAlign == "right") {
		                            	x = x - context.measureText(text).width;
		                            }
		                            context.drawImage(cachedImage, x, y-fontHeight);
		                       }
		                    }
		                    return;
		              	}

		              }
              }


                if(maxWidth != undefined) {
                      if(maxWidth > 0) {
                      	if(shouldSetFontToContext) {
  	                    	  this.checkFontAndSetToContext();
  	                    	}
                        var textLength = text.length;
                        var pixelForEachChar = context.measureText("W").width;
                        var minCharsToWrite =  Math.floor(maxWidth/pixelForEachChar);
                        var charsToWrite =  textLength;
                        for(var i = minCharsToWrite + 1; i <= textLength; i++) {
                              if(context.measureText(text.substring(0, i)).width > maxWidth) {
                                    charsToWrite = i - 1;
                                    break;
                              }
                        }
                        context.fillText(text.substring(0, charsToWrite), x, y);
                      }
                } else {
              	  if(shouldSetFontToContext) {
                  	  this.checkFontAndSetToContext();
                  	}
                    context.fillText(text,x, y);
                }
                return;
            };//function fillText() end

    }//TextRenderer
    function TextImagePreloadContext(canvasContext) {
    	this.isImagePreloadContext = true;
    	this.font = null;
    	this.fillStyle = null;
    	this.beginPath = function() {
    	};
    	this.stroke = function() {
    	};
    	this.fill = function() {
    	};
    	this.closePath = function() {
    	};
    	this.strokeRect = function(x,y,width, height) {
    	};
    	this.fillRect = function(x,y,width, height) {
    	};
    	this.moveTo = function(x,y) {
    	};
    	this.lineTo = function(x,y) {
    	};
    	this.save = function(){
    		return canvasContext.save();
    	};
    	this.translate = function(x, y){
    		return canvasContext.translate(x, y);
    	};
    	this.measureText = function(text) {
    		canvasContext.font = this.font;
    		return canvasContext.measureText(text);
    	};
    	this.restore = function() {
    		return canvasContext.restore();
    	};
    	this.getFillStyle = function() {
    		canvasContext.fillStyle = this.fillStyle;
    		return canvasContext.fillStyle;
    	};
    	this.fillText = function() {

    	}
    };

   // plugin definition
    $.chronos = function(placeholder, data, options) {
    	//added to chronos canvas parent to identify resize element
    	$(placeholder).attr("chronosresize", true);

        var plot = new Chronos($(placeholder), data, options, $.chronos.plugins);
        return plot;
    };
    //This is added to ensure backward compatibility for chronos 5.2.7 and below when $.plot has conflict with jquery flot
    if(!preventChronosPlotConflict) {// ENSURE BACK WARD COMPATIBILITY
    	$.plot = $.chronos;
    }

    // returns a string with the date d formatted according to fmt
    $.chronos.formatDate = function(date, fmt, monthNames) {
    	var d = null;
    	if(date.isChronosDate)  {
    		d = date;
    	} else {
    		//user has passed a normal date from outside say eg : from tick formatter as $.chronos.formatDate(new Date(val), fmt);
  			// ENSURE BACK WARD COMPATIBILITY
    		d = $.convertToChronosDate(date.getTime());
    	}
        var leftPad = function(n) {
            n = "" + n;
            return n.length == 1 ? "0" + n : n;
        };

        var r = [];
        var escape = false, padNext = false;
        var hours = d.getHours();
        var isAM = hours < 12;
        if (monthNames == null)
            monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var weekday= new Array(7);
        weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        if (fmt.search(/%p|%P/) != -1) {
            if (hours > 12) {
                hours = hours - 12;
            } else if (hours == 0) {
                hours = 12;
            }
        }
        for (var i = 0; i < fmt.length; ++i) {
            var c = fmt.charAt(i);
            if (escape) {
                switch (c) {
                case 'h': c = "" + hours; break;
                case 'H': c = leftPad(hours); break;
                case 'M': c = leftPad(d.getMinutes()); break;
                case 'S': c = leftPad(d.getSeconds()); break;
                case 'd': c = "" + d.getDate(); break;
                case 'm': c = "" + (d.getMonth() + 1); break;
                case 'y': c = "" + d.getFullYear(); break;
                case 'b': c = "" + monthNames[d.getMonth()]; break;
                case 'p': c = (isAM) ? ("" + "am") : ("" + "pm"); break;
                case 'P': c = (isAM) ? ("" + "AM") : ("" + "PM"); break;
                case '0': c = ""; padNext = true; break;
                case "w": c = "" + weekday[d.getDay()]; break; // showfull day
                case "W": c = "" + (weekday[d.getDay()].substring(0,3)); break;
                case 'D': c = "" + leftPad(d.getDate()); break;
                case 'Y': c = "" + ((d.getFullYear().toString()).substring(2,4)); break;
                case 'B': c = "" + monthNames[d.getMonth()].toUpperCase(); break;
                case 'f': c = "" + fullMonthNames[d.getMonth()]; break;
                case 'F': c = "" + fullMonthNames[d.getMonth()].toUpperCase(); break;
                case 't': c = "" + (weekday[d.getDay()].substring(0,2)); break; // 2 letter string
                case 'o': c = "" + (weekday[d.getDay()].substring(0,1)); break; // 1 letter string
                }
                if (c && padNext) {
                    c = leftPad(c);
                    padNext = false;
                }
                r.push(c);
                if (!padNext)
                    escape = false;
            }
            else {
                if (c == "%")
                    escape = true;
                else
                    r.push(c);
            }
        }
        return r.join("");
    };
    $.chronos.version = "6.10.10";
    $.chronos.plugins = [];
    $.chronos.name ="chronos.core";

})(jQuery);
