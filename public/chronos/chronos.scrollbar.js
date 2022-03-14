/*
 * Copyright 2013-2014 IBS Software Services (P) Ltd. All Rights Reserved.
 * This software is the proprietary information of IBS Software Services (P) Ltd.
 * Use is subject to license terms.

@author A-2094, Maintained by TCC.
name : chronos-scrollbar
version: 6.10.10

 scrollBarHolder is the div which holds the scroll canvas

 This script is for creating scroll bar and for firing event listeners related to it.
 This creates a scroll bar with the options provided.

"arrowScroll" specifies the % of the view area to be incremented on each arrow Cick
"arrowScrollUnit" is the no:of Tick Unit moved on each arrow press

"direction " reprersents the type of scroll bar ,can take values 'horizontal' or 'vertical'

"frameRate" specifies the maximum number of times per second the plot
will update itself while the user is scrolling  using the scrollbar.

"verticalIncrement"  is applicable only for vertical scroll bar. verticalIncrement:'down'  is the deafult.
 This specify the incremental direction of the scroll.
 Eg: 'down' means the vertical axis value displayed increments from  top to bottom ( eg : 0-50)
	 'up'  means the vertical axis  value increments from  bottom to top ( eg : 50 on top- 0 on bottom)


 scrollBar : {
				borderColor : '#515151',
				arrowColor : '#515151',
				lineWidth : 1,
				cssClass:null
			},
			scrollBox : {
				fillColor : '#333',
				borderColor : '#515151',// applied to scrollBox and arrow boxes on both sides
				lineWidth : 1,
				minLength :5 //in pixels the minimum length of the scroll Box when there is a big Scrollrange and view area is less.

			}

dependency:
jQuery resize event - v1.1 - 3/14/2010
		 http://benalman.com/projects/jquery-resize-plugin/
		 Copyright (c) 2010 "Cowboy" Ben Alman
		 Dual licensed under the MIT and GPL licenses. http://benalman.com/about/license/
jquery.event.drag-2.2.js

*/


(function($) {
	var scrollBarObjectMap = [];

	function ScrollBar(scrollBarHolder, scrollBarOptions, plugins) {
		var options = {
			axis : {
				arrowScroll :  1,  //arrowScroll is the % of the view area to be incremented on arrow Cick
				arrowScrollUnit: 0,	//arrowScrollUnit is the Tick Unit moved . either arrowScroll or arrowScrollUnit will be used
				mouseWheelTickUnit :1, //the unit of axis ticks to be moved for each MouseWheel tick.
				mouseWheelTickPercentage : 0// the % of the view area to be incremented on mouse tick , if mouseWheelTickUnit is 0 or null, then percentage is considered
			},
			scroll : {
				direction : 'horizontal', // or vertical
				dragIntervalForFetch : 500, // Interval (in milli-secs) to check if a fetch is required or not, when a continuous scroll happens
				frameRate : 100,
				horizontalIncrement:'ltr', // (leftToRight)...or..rtl (rightToLeft).....
				verticalIncrement:'down', //or 'down' depends on the data displayed in vertical axis
				optimiseScrollOnArrowClick: false, //if this is false ensure cacheHeaderTextAsImage of gantt is also false
				homeKeyAction: null,// if callBackFunction specified, the default action is not fired
				endKeyAction :null,
				keyDownFetchInterval : 2000

			},
			scrollBar : {
	            arrowBox : {
	                display : "show",
	                arrowColor: "#515151",//applied to arrowBox on both sides
	                arrowBoxRenderer : null
	            },
	            borderColor : "#515151",// applied to scrollBox on both sides
				lineWidth : 1,
				cssClass:null,
	            renderer : null, // the entire scrollbar area can be customized
	            arrowColor : "#515151",        // -----deprecated
	            arrowBoxRenderer : null // the arrow boxes on both sides ---------deprecated
			},
			scrollBox : {
				fillColor : "#333",
				borderColor : "#515151",// applied to scrollBox and arrow boxes on both sides
				lineWidth : 1,
				minLength :5, //in pixels the minimum length of the scroll Box when there is a big Scrollrange and view area is less
				renderer : null, // the actual scroll box which needs to be moved
				maxWidth : null	// if maxWidth is provided the width of scrollbox renderer is limited to this width else default width will be provided
			},
			scrollOffset :{
				left : 0, // space in the left side of scrollbar
				right:0,
				top : 0, // space in top of scroll bar
				bottom:0

			},
			browserScroll : {
				enable : false
			},
			errorHandle : "throw"	//ignore/throw Eg:  canvas dimesions is 0 we throw error and terminate execution.
									//if ignore it stops further drawing, instead of terminating the execution

		},
		scrollCanvas = null, //the scrollbar canvas
		scrollInnerDiv = null, // the scroll inner Div for which with and height need to be calculated
		scrollCtx = null,
		offset = null,
		frameRate = null,
		dragIntervalForFetch = null,
		// jQuery object to which the scrollbar events should be bound to
		scrollEventHolder = null,
		// details of scrollBox
		scrollBoxStartX = null,
		scrollBoxStartY = null,
		scrollBoxLength = null, // This is the dyanmic movable scrollBox
		//extraSpace = 0,
		scrollBarWidth = null, // for browser Scrollbar Div widtha and canvas width
		scrollBarHeight = null, //including length of two arrow boxes
		scrollBoxWidth = null,
		actualScrollBarLength = null, // excluding the two arrow boxes
		startX = null,
		startY = null,

		viewArea = null,
		scrollTop = null,
		scrollLeft = null,
		horizontalIncrement = null,
		verticalIncrement = null,
		middleViewValue = null,
		scrollLength = null,
		//hoverScrollBox = null, //boolean true when mouse on scrollbox
		startPosnX = null,
		startPosnY = null,
		scrollStartMinViewValue = null,
		scrollTimeout = null,
		// A collection of scrollable objects to which this scroll bar is linked to
		scrollableObjectsCollection = null,
		hoveredScrollBarPosition = null,
		scrollEvent = null,
		//mousePosition = null,
		scrollbarStartX = null, //used for horizontal scroll - the point next to  the scrollbar left arrow box.
		scrollbarStartY = null, //used for vertical scroll - the point below  the scrollbar top arrow box.
		// invokedCanvas = null,
		scrollDirection = null,
		canvasX = null,
		canvasY = null,
		counter = null,
		//movementOnEachClick =null,

		// Following are declaration of public variables
		scrollbar = this,
		HORIZONTAL = 'horizontal',
		VERTICAL = 'vertical',
		SCROLL_BOX = "SCROLL_BOX",
		LEFT_ARROW = "LEFT_ARROW",
		RIGHT_ARROW = "RIGHT_ARROW",
		TOP_ARROW = "TOP_ARROW",
		BOTTOM_ARROW = "BOTTOM_ARROW",
		noDataFetchScheduled = false;

		scrollbar.minAxisValue = null;
		scrollbar.maxAxisValue = null;
		scrollbar.minViewValue = null;
		scrollbar.maxViewValue = null;
		scrollbar.scrollTop = scrollTop;
		scrollbar.scrollLeft = scrollLeft;

		scrollbar.previousValues = {
				minAxisValue : null,
				maxAxisValue : null,
				minViewValue : null,
				maxViewValue : null
		};
		scrollbar.viewArea = viewArea;
		scrollbar.scrollDirection = scrollDirection;
		scrollbar.onBrowserScroll = onBrowserScroll;
		scrollbar.width = scrollBarWidth;
		scrollbar.height = scrollBarHeight;
		scrollbar.getOptions = function(){
			return options;
		};
		scrollbar.scrollBarHolder = scrollBarHolder;
		scrollbar.scrollEventHolder = scrollEventHolder;
		scrollbar.actualScrollBarLength = actualScrollBarLength;
		scrollbar.scrollbarStartY = scrollbarStartY;
		scrollbar.scrollbarStartX = scrollbarStartX;

		scrollbar.scrollLength = scrollLength;
		scrollbar.scrollCanvas = scrollCanvas;
		scrollbar.scrollableObjectsCollection = scrollableObjectsCollection;
		scrollbar.drawTriggeredFromKeyDown = false;

		// Following are public functions
		scrollbar.getScrollbarCanvas = function () { return scrollCanvas; };
	 	scrollbar.setViewValues = setViewValues;
	 	scrollbar.getViewValues = getViewValues;

	 	scrollbar.setAxisValues = setAxisValues;
	 	scrollbar.getAxisValues = getAxisValues;

		scrollbar.setInvokedCanvas = setInvokedCanvas;
		scrollbar.syncAllCharts = syncAllCharts;
		scrollbar.syncAllChartsWithDataFetch = syncAllChartsWithDataFetch;
		scrollbar.addScrollableObject = addScrollableObject;
		scrollbar.removeScrollableObject = removeScrollableObject;
		scrollbar.drawScrollBar = drawScrollBar;
		scrollbar.redrawScrollBox = redrawScrollBox;
		scrollbar.shutdown = shutdown;
		scrollbar.resizeScrollCanvas = resizeScrollCanvas;
		scrollbar.redrawScrollBarOnKeyDownEvent = redrawScrollBarOnKeyDownEvent;

		scrollbar.scrollActionOnKeyDownEvent = scrollActionOnKeyDownEvent;
		scrollbar.scrollActionOnKeyUpEvent = scrollActionOnKeyUpEvent;
		scrollbar.onScrollOnMouseWheel = onScrollOnMouseWheel;

		scrollbar.redrawScrollBarOnSpecialKeys = redrawScrollBarOnSpecialKeys;

		scrollbar.fetchDataAndRedraw = fetchDataAndRedraw;
		scrollbar.noDataFetchButRedraw = noDataFetchButRedraw;
		scrollbar.getMovementOnEachClick = getMovementOnEachClick;
		scrollbar.fetchDataIfNeededAndScroll = fetchDataIfNeededAndScroll;
		scrollbar.redrawScrollBarOnScrollClick = redrawScrollBarOnScrollClick;

		// This is called to override the options set by the user
		parseOptions(scrollBarOptions);
		// initialize and draw scroll bar
		initialize();
		bindScrollEvents();


		var interval = 1 , actualDrawTimerForTiling = null;
		var scrollTimer = null;
		var timerMinViewValue = -1;
		var isScrolling = false;
		var timeout1 = null;
		var timeout2 = null;
		var timeoutDraw = null;


		/**
		 * This function gets all options from user and override teh default options set
		 * @param scrollBarOptions
		 */
		function parseOptions(scrollBarOptions) {
			$.extend(true, options, scrollBarOptions);

		}
		/**
		 * initialize all the global attributes
		 */
		function initialize() {
			options = scrollbar.getOptions();
			mouseWheelTickUnit= options.axis.mouseWheelTickUnit;
			mouseWheelTickPercentage = options.axis.mouseWheelTickPercentage;

			if(options.browserScroll.enable) {
				//create the div inside the scrollBar Holder div
				scrollInnerDiv = makeDivScroll(scrollBarHolder.attr('id'));
				scrollbar.scrollDirection = options.scroll.direction; // set this before resize
				scrollbar.scrollEventHolder = scrollEventHolder;
				scrollbar.scrollBarHolder = scrollBarHolder;
				scrollbar.scrollDirection = options.scroll.direction; // set this before resize
				//Now set the actual canvas dimensions
				scrollbar.resizeScrollCanvas();

			} else {
				//Note the scrollbar holder should have an ID, the canvas will have that iD + "CanvasId" appended
				scrollCanvas = makeCanvas(scrollBarHolder.attr('id'));
				scrollbar.scrollCanvas = scrollCanvas;
				scrollCtx = scrollCanvas.getContext("2d");
				scrollCtx.mozImageSmoothingEnabled = false;
				scrollBarHolder.css({
					padding : 0
				}); // padding messes up the positioning

				// Added for making the scrollBar canvas as the event holder
				scrollEventHolder = $([ scrollCanvas ]);
				scrollbar.scrollEventHolder = scrollEventHolder;
				scrollbar.scrollDirection = options.scroll.direction; // set this before resize
				scrollbar.scrollBarHolder = scrollBarHolder;
				//Now set the actual canvas dimensions
				scrollbar.resizeScrollCanvas();

				//startX  : canvas Starts from 0,0 . startX and startY are the start positions of drawing the actual body of scrollbar after teh arrowbox
		   		//startY : canvas Starts from 0,0 . startX and startY are the start positions of drawing the actual scrollbar
				scrollbar.startX = options.scrollOffset.left;
				scrollbar.startY = options.scrollOffset.top;
				horizontalIncrement = options.scroll.horizontalIncrement;
				verticalIncrement = options.scroll.verticalIncrement;
				frameRate = options.scroll.frameRate;
				dragIntervalForFetch = options.scroll.dragIntervalForFetch;
				keyDownFetchInterval = options.scroll.keyDownFetchInterval;
			}

			 scrollbar.drawScrollBar();

		}

		function makeCanvas(id) {
            var c = document.createElement('canvas');
            c.id = id+"CanvasId";
            //Setting this below the overlay
            $(c).css({ 'z-index': '9999'});
            c.className = options.scrollBar.cssClass;
            if ($(scrollBarHolder).children("#"+c.id).length == 0) {
                $(c).appendTo(scrollBarHolder);
            }
            //if no tabindex specified , set this to invoke the key press events
            if($(scrollBarHolder).attr('tabindex') == null) {
            	$(c).attr( 'tabindex', '10');
            } else {
            	$(c).attr( 'tabindex', $(scrollBarHolder).attr('tabindex'));
            }
            return c;
        }
		function makeDivScroll(id) {

			 var scrollDiv = document.createElement('div');
			 scrollDiv.id = "chronos_scrollbar_" +id + "OuterDivId" ;
			   $(scrollDiv).attr('direction', options.scroll.direction); // for internal use
	            //Setting this below the overlay
	            $(scrollDiv).css({ 'z-index': '9999'});
	            scrollDiv.className = options.scrollBar.cssClass;
	            if($(scrollBarHolder).attr('tabindex') == null) {
	            	$(scrollDiv).attr( 'tabindex', '1');
	            } else {
	            	$(scrollDiv).attr( 'tabindex', $(scrollBarHolder).attr('tabindex'));
	            }
	            // now add overflow:scroll to parent div (outer div)
	            if(options.scroll.direction == HORIZONTAL) {
	            	 $(scrollDiv).css('overflow-x', 'scroll');
	            	  $(scrollDiv).css('overflow-y', 'hidden');
	            } else  if(options.scroll.direction == VERTICAL) {
	            	  $(scrollDiv).css('overflow-y', 'scroll');
	            	  $(scrollDiv).css('overflow-x', 'hidden');
	            }

	            $(scrollDiv).css('width', ($(scrollBarHolder).css('width')));
	            $(scrollDiv).css('height', ($(scrollBarHolder).css('height')));

	            if ($(scrollBarHolder).children("#"+scrollDiv.id).length == 0) {
	                $(scrollDiv).appendTo(scrollBarHolder);
	            }

	        	scrollEventHolder = $(scrollDiv); //registerign scroll only for teh parent with scroll

	            var innerdiv = document.createElement('div');
	            innerdiv.id = "chronos_scrollbar_"+id+"InnerDivId";
	            //Setting this below the main div

	            if ($(scrollBarHolder).children("#"+innerdiv.id).length == 0) {
	                $(innerdiv).appendTo(scrollDiv);
	            }


            return innerdiv;
        }

		/**
		 * Function to set a new Scroll Percentage for the scrollbar on arrow click or on key press
		 * @param newArrowScrollPercentage
		 */
		this.setScrollPercentage = function(newArrowScrollPercentage) {
			options = this.getOptions();
			options.axis.arrowScroll = newArrowScrollPercentage;
		};

		/**
		 * Function to set a new Scroll Unit for the scrollbar on arrow click or on key press.
		 * If this is set , scrollPercentage is ignored
		 * @param newArrowScrollUnit
		 */
		this.setScrollUnit= function(newArrowScrollUnit) {
			options = this.getOptions();
			options.axis.arrowScrollUnit = newArrowScrollUnit;
		};

		this.setMouseWheelTickUnit= function(newMouseWheelUnit) {
			options = this.getOptions();
			options.axis.mouseWheelTickUnit = newMouseWheelUnit;
		};



		function resizeScrollCanvas() {
			scrollbar = this;
			scrollBarHolder = scrollbar.scrollBarHolder;
			scrollEventHolder = scrollbar.scrollEventHolder;
			if(!scrollbar.getOptions().browserScroll.enable) { //CANVAS SCROLL
				if(scrollbar.scrollDirection == HORIZONTAL) {
					//Assign in these variables for future use
					scrollBarHeight =  scrollBarHolder.width() ;
					scrollBarWidth = scrollBarHolder.height() ;
					validateScrollCanvasDimensions(scrollBarHeight, scrollBarWidth);
					//To make canvas like width="30" height="500"
					scrollCanvas.width  = scrollBarHeight;
					scrollCanvas.height = scrollBarWidth;

					//To make canvas like style="width: 30px; height: 500px;"
					scrollCanvas.style.width  = scrollBarHeight+'px';
					scrollCanvas.style.height = scrollBarWidth+'px';
					//This will be teh actual scrollbarWidth;
					scrollBarWidth = scrollBarWidth - options.scrollOffset.top - options.scrollOffset.bottom;

				}  else { //VERTICAL
					scrollBarHeight = scrollBarHolder.height();
					scrollBarWidth = scrollBarHolder.width();
					validateScrollCanvasDimensions(scrollBarHeight, scrollBarWidth);
					scrollCanvas.width  = scrollBarWidth;
					scrollCanvas.height = scrollBarHeight;
					scrollCanvas.style.width  = scrollBarWidth+'px';
					scrollCanvas.style.height = scrollBarHeight+'px';
					//This will be teh actual scrollbarWidth;
					scrollBarWidth = scrollBarWidth - options.scrollOffset.left - options.scrollOffset.right;
				}
				scrollbar.scrollCanvas = scrollCanvas;

			} else {
				if(scrollbar.scrollDirection == HORIZONTAL) {
					//Assign in these variables for future use
					scrollBarWidth =  scrollBarHolder.width() ;
					scrollBarHeight = scrollBarHolder.height() ;
					validateScrollCanvasDimensions(scrollBarHeight, scrollBarWidth);
					//To make div like width="30" height="500"
					scrollEventHolder = scrollbar.scrollEventHolder;

					$(scrollEventHolder).css('width', scrollBarWidth);
					$(scrollEventHolder).css('height', scrollBarHeight);

					//This will be teh actual scrollbarWidth;
					scrollBarWidth = scrollBarWidth - options.scrollOffset.top - options.scrollOffset.bottom;

				}  else { //VERTICAL
					scrollBarHeight = scrollBarHolder.height();
					scrollBarWidth = scrollBarHolder.width();
					validateScrollCanvasDimensions(scrollBarHeight, scrollBarWidth);

					$(scrollEventHolder).css('width', scrollBarWidth);
					$(scrollEventHolder).css('height', scrollBarHeight);

					//This will be teh actual scrollbarWidth;
					scrollBarWidth = scrollBarWidth - options.scrollOffset.left - options.scrollOffset.right;
				}
			}

		}

		 function validateScrollCanvasDimensions(scrollBarHeight, scrollBarWidth) {
	            if (scrollBarHeight <= 0 || scrollBarWidth <= 0)         {
	            	if(options.errorHandle == "throw") {
	            		throw "Invalid dimensions for scrollbar, width = " + scrollBarWidth + ", length = " + scrollBarHeight;
	            	} else {
	            		return false;
	            	}
	            }
	     }

		// This will be called by any gantt chart . Set the values and redraw
		function setViewValues(minValue, maxValue) {
			scrollbar = this;
			scrollbar.minViewValue = minValue;
			scrollbar.maxViewValue = maxValue;
			scrollbar.viewArea = scrollbar.maxViewValue - scrollbar.minViewValue;

		}

		// Used in flot code. return the view values
		function getViewValues() {
			scrollbar = this;
			var viewValue = {
					minViewValue : scrollbar.minViewValue,
					maxViewValue : scrollbar.maxViewValue
			};
			return viewValue;
		}

		// This will be called by any gantt chart . Set the values and redraw
		function setAxisValues(minAxisValuePassed, maxAxisValuePassed) {
			scrollbar = this;
			scrollbar.minAxisValue = minAxisValuePassed;
			scrollbar.maxAxisValue = maxAxisValuePassed;
		}

		function getAxisValues() {
			scrollbar = this;
			return {
					minAxisValue : scrollbar.minAxisValue,
					maxAxisValue : scrollbar.maxAxisValue
			};
		}

		/**
		 * Set the invoked canvas and now sync all other gantts accordingly
		 * @param canvasID
		 */
		function setInvokedCanvas(canvasID, event) {
			scrollbar = this;
			syncAllCharts(event);
		}
		/*
		 * function of scrollbar to register the gantt to scrollbar. Each Scroll
		 * bar object will keep a collection of scrollableObjects
		 */
		function addScrollableObject(scrollableObject) {
			scrollbar = this;
			if (scrollbar.scrollableObjectsCollection == null || scrollbar.scrollableObjectsCollection ==  undefined) {
				scrollbar.scrollableObjectsCollection = new Array();
			}
			scrollbar.scrollableObjectsCollection.push(scrollableObject);

		}

		/*
		 * function in scrollbar to unregister the scrollbar from gantt.
		 */
		function removeScrollableObject(scrollableObject) {
			scrollbar = this;
			if (scrollbar.scrollableObjectsCollection != null || scrollbar.scrollableObjectsCollection !=  undefined) {
				var index = -1;
				scrollbar.scrollableObjectsCollection.find( function(currObj, key) {
					if (scrollableObject.getPlaceholder().attr('id') == currObj.getPlaceholder().attr('id')) {
						index = key;
					}
				});
				if (index > -1){
					scrollbar.scrollableObjectsCollection.splice(index, 1);
				}
			}

		}

		/*
		 * Note that this method does the drawign of the full Scrollbar and arrows except the scroll box.
		 * So redrawScrollBox() Should be called after drawScroll is called
		 */
		function drawScrollBar() {
			 scrollbar = this;
			if(!options.browserScroll.enable) {
				if (scrollbar.scrollDirection == HORIZONTAL) {
					drawHorizontalScrollOnCanvas(); //only draw boundaries here
					 // drawScrollBox On HorizontalScrollBar  will be drawn when setting view value.
				}
				if (scrollbar.scrollDirection == VERTICAL) {
					drawVerticalScrollOnCanvas();//only draw boundaries here
					// drawScrollBox On VerticalScrollBar will be drawn when setting view value.
				}
			}
		}

		////////////////////////////FOR VERTICAL SCROLLBAR ///////////////////////////////
		function drawVerticalScrollOnCanvas() {

		//Modified for ISRM-8286
            if (options.scrollBar.arrowBox.display == "hide") {
                actualScrollBarLength = scrollBarHeight - options.scrollOffset.top - options.scrollOffset.bottom; // excluding arrow box and the scroll offset -TOP
                scrollbarStartY = scrollbar.startY;
            } else {
                actualScrollBarLength = scrollBarHeight - ( 2 * scrollBarWidth )- options.scrollOffset.top - options.scrollOffset.bottom; // excluding arrow box and the scroll offset -TOP
                scrollbarStartY = scrollbar.startY + scrollBarWidth; //incremented the top arrow box length : imagine vertically
            }
            scrollbarStartX = scrollbar.startX;

            //-2*scrollBarWidth means the arrow portions.
            // actualScrollBarLength = scrollBarHeight - ( 2 * scrollBarWidth )- options.scrollOffset.top - options.scrollOffset.bottom; // excluding arrow box and the scroll offset -TOP
            // scrollbarStartY = scrollbar.startY + scrollBarWidth; //incremented the top arrow box length : imagine vertically
            // scrollbarStartX = scrollbar.startX;

            //draw scrollbar setting values to object
            scrollbar.scrollbarStartY = scrollbarStartY; // y value after the arrowBox
            scrollbar.scrollbarStartX = scrollbarStartX; // x value after teh arrow box
            scrollbar.actualScrollBarLength = actualScrollBarLength; // the length of channel between arrow boxes
            scrollbar.scrollBarHeight = scrollBarHeight; // full height including arrowboxes at both sides
            scrollbar.scrollBarWidth = scrollBarWidth;// full width

            //draw the body of scroll bar not from 0,0 ie x = startX and y = startY + width = scrollbarStartY
            drawVerticalScrollBarBody();

		}
		function drawVerticalScrollBarBody() {

		scrollCanvas = scrollbar.getScrollbarCanvas();
            scrollCtx = scrollCanvas.getContext("2d");
            startX = scrollbar.startX ;
            startY = scrollbar.startY;
            scrollBarHeight = scrollbar.scrollBarHeight;
            scrollBarWidth = scrollbar.scrollBarWidth;
            scrollbarStartX = scrollbar.scrollbarStartX;
            scrollbarStartY = scrollbar.scrollbarStartY;
            actualScrollBarLength = scrollbar.actualScrollBarLength ;
            //clear all and draw everything once again
            scrollCtx.clearRect(startX, startY, startX + scrollBarWidth,  startY + scrollBarHeight);

            if(options.scrollBar.renderer != null) {

                triggerCallBackRenderer(scrollbar, options.scrollBar.renderer);
            } else {
                scrollCtx.lineWidth =  options.scrollBar.lineWidth;
                scrollCtx.strokeStyle = options.scrollBar.borderColor;// draw border
                scrollCtx.beginPath();
                scrollCtx.moveTo(Math.round((startX + scrollBarWidth / 2) + 0.5), Math.round((scrollbarStartY - scrollBarWidth / 2)));
                scrollCtx.lineTo(Math.round((startX + scrollBarWidth / 2)) +0.5,
                        Math.round((scrollbarStartY + actualScrollBarLength + scrollBarWidth / 2)));
                scrollCtx.stroke();

            }
             if(options.scrollBar.arrowBox.display == undefined || options.scrollBar.arrowBox.display == "show" ){
            if(options.scrollBar.arrowBoxRenderer != null) {
                    options.scrollBar.arrowBox = {};
                    options.scrollBar.arrowBox.top = {
                            scrollCtx :scrollCtx,
                            startX   :  startX,
                            startY      :  startY,
                            boxWidth :  scrollBarWidth,
                            boxHeight:  scrollBarWidth

                    };
                    var endY = scrollbarStartY + actualScrollBarLength;// the end Y of teh actual scrollbar before the down arrow box

                    options.scrollBar.arrowBox.bottom = {
                            scrollCtx :scrollCtx,
                            startX   :  startX,
                            startY      :  endY,
                            boxWidth :  scrollBarWidth,
                            boxHeight:  scrollBarWidth

                    };
                    //this will have both top and bottom details
                     triggerCallBackRenderer(options.scrollBar.arrowBox, options.scrollBar.arrowBoxRenderer);

            } else {
                scrollCtx.lineWidth = options.scrollBar.lineWidth; //lineWidth for scrollbox and arrow
                scrollCtx.strokeStyle = options.scrollBar.arrowColor;
                // draw top arrow
                scrollCtx.beginPath();
                scrollCtx.moveTo((startX + scrollBarWidth / 4), (scrollbarStartY - scrollBarWidth / 4)); //left
                scrollCtx.lineTo(startX + scrollBarWidth / 2 + 0.5, scrollbarStartY - scrollBarWidth / 2);    //left to top
                scrollCtx.lineTo((startX + (3/4)*scrollBarWidth), scrollbarStartY - scrollBarWidth / 4); // top to right

                 // draw down arrow
                var endY = scrollbarStartY + actualScrollBarLength;// the end Y of teh actual scrollbar before the down arrow box
                scrollCtx.moveTo((startX + scrollBarWidth / 4), (endY + scrollBarWidth / 4)); //left
                scrollCtx.lineTo(startX + scrollBarWidth / 2 + 0.5, endY + scrollBarWidth / 2);    //left to bottom
                scrollCtx.lineTo((startX + (3/4)*scrollBarWidth), endY + scrollBarWidth / 4); // bottom to top right
                scrollCtx.stroke();
            }
             }
		}

		 function triggerCallBackRenderer (dataToRenderer, rendererFunction, isRendererAFunction) {
	    	   if(isRendererAFunction == undefined) {
	    		   isRendererAFunction = $.isFunction(rendererFunction);
	    	   }
	    	   if(isRendererAFunction) {
	    	    	rendererFunction(dataToRenderer);
	       		} else {
			       var args = [];
				   args.push(dataToRenderer);
				   eval(rendererFunction).apply(this, args);
	       		}
	       };

		function drawVerticalScrollBox(scrollBoxValue) {
			scrollbarStartX = scrollbar.scrollbarStartX;
			scrollbarStartY = scrollbar.scrollbarStartY;
			options = scrollbar.getOptions();
			verticalIncrement = options.scroll.verticalIncrement;
			actualScrollBarLength = scrollbar.actualScrollBarLength;

			var startPosnY;
			scrollBoxStartX = scrollbarStartX;

			if(verticalIncrement == 'up') {
				startPosnY = scrollbarStartY  + actualScrollBarLength;
				scrollBoxStartY = startPosnY - scrollBoxValue - scrollBoxLength / 2;
			} else if (verticalIncrement == 'down') {
				startPosnY = scrollbarStartY;
				scrollBoxStartY = startPosnY + scrollBoxValue - scrollBoxLength / 2;
			}
			var scrollBoxWidth = options.scrollBox.maxWidth;
			if(scrollBoxWidth == null) {
				scrollBoxWidth =  options.scrollBar.lineWidth + 6; //horizontally
				if(scrollBoxWidth > scrollbar.scrollBarWidth) {
					scrollBoxWidth = scrollbar.scrollBarWidth;
				}
			}

			 //clear only the scroll body and draw it again
			drawVerticalScrollBarBody();
			drawVScrollBox(scrollBoxStartX, scrollBoxStartY,  scrollBoxWidth , scrollBoxLength);
		}

		function drawVScrollBox(scrollBoxStartX, scrollBoxStartY, scrollBoxWidth, scrollBoxLength) {
			// draw movable scrollBox border
			scrollCtx.lineWidth = options.scrollBox.lineWidth;
			scrollCtx.strokeStyle = options.scrollBox.borderColor;
			// draw movable ScrolBox
			var center = startX + scrollBarWidth / 2 + 0.5; //actual center where line is drawn
			scrollBoxStartX = center - scrollBoxWidth/2;
			scrollbar.scrollBox = {
					scrollCtx  		: scrollCtx,
					scrollBoxStartX : scrollBoxStartX,
					scrollBoxStartY : scrollBoxStartY,
					scrollBoxWidth	: scrollBoxWidth,
					scrollBoxLength : scrollBoxLength // vertically
			};

			if(options.scrollBox.renderer != null) {
				triggerCallBackRenderer(scrollbar.scrollBox, options.scrollBox.renderer);
			} else {
				//clear all
				scrollCtx.strokeRect(scrollBoxStartX, scrollBoxStartY, scrollBoxWidth, scrollBoxLength);
				scrollCtx.fillStyle = options.scrollBox.fillColor;
				scrollCtx.fillRect(scrollBoxStartX, scrollBoxStartY, scrollBoxWidth, scrollBoxLength);
			}

		}


		////////////////////////////  FOR HORIZONTAL SCROLLBAR ///////////////////////////////
		function drawHorizontalScrollOnCanvas() {
		//Modified for ISRM-8286
			if (options.scrollBar.arrowBox.display == "hide") {
				actualScrollBarLength = scrollBarHeight - options.scrollOffset.left - options.scrollOffset.right; // excluding arrow box and offset LEFT
				scrollbarStartX = scrollbar.startX ;
			} else {
			actualScrollBarLength = scrollBarHeight - (2*scrollBarWidth) - options.scrollOffset.left - options.scrollOffset.right; // excluding arrow box and offset LEFT
				scrollbarStartX = scrollbar.startX + scrollBarWidth; //incremented the top arrow box length : imagine horizontally
			}
			scrollbarStartY = scrollbar.startY; //incremented the left arrow box width : imagine horizontally

			//setting values to object
			scrollbar.scrollbarStartY = scrollbarStartY;
			scrollbar.scrollbarStartX = scrollbarStartX;
			scrollbar.scrollBarHeight = scrollBarHeight;
			scrollbar.actualScrollBarLength = actualScrollBarLength;
			scrollbar.scrollBarWidth = scrollBarWidth;
			//draw actual scrollbar the big rectangle
			drawHorizontalScrollBarBody();
			//All side boxes and arrows drawn below

		}

		function drawHorizontalScrollBarBody() {
			scrollCanvas = scrollbar.getScrollbarCanvas();
			scrollCtx = scrollCanvas.getContext("2d");
			startX = scrollbar.startX ;
			startY = scrollbar.startY;
			scrollBarHeight = scrollbar.scrollBarHeight;
			scrollBarWidth = scrollbar.scrollBarWidth;
			scrollbarStartX = scrollbar.scrollbarStartX;
			scrollbarStartY = scrollbar.scrollbarStartY;
			actualScrollBarLength = scrollbar.actualScrollBarLength;
			if(options.scrollBar.renderer != null) {
				triggerCallBackRenderer(scrollbar, options.scrollBar.renderer);
			} else {
				//clear all and draw everythign once again
				scrollCtx.clearRect(startX, startY, scrollBarHeight, scrollBarWidth); //clear all
				scrollCtx.lineWidth = options.scrollBar.lineWidth;
				scrollCtx.strokeStyle = options.scrollBar.borderColor;	// draw border
				scrollCtx.moveTo(scrollbarStartX - scrollBarWidth *1/2, Math.round(scrollbarStartY + scrollBarWidth / 2) + 0.5);
				scrollCtx.lineTo(scrollbarStartX + actualScrollBarLength + scrollBarWidth/2, Math.round(scrollbarStartY + scrollBarWidth / 2)+0.5);
				scrollCtx.stroke();
			}
			if(options.scrollBar.arrowBox.display == undefined || options.scrollBar.arrowBox.display == "show")  {
			if(options.scrollBar.arrowBoxRenderer != null) {
				options.scrollBar.arrowBox ={};
				options.scrollBar.arrowBox.left = {
						scrollCtx:scrollCtx,
						startX   :  startX,
						startY 	 :  startY,
						boxWidth :  scrollBarWidth,
						boxHeight:  scrollBarWidth

				};
				var endX = scrollbarStartX + actualScrollBarLength;// the endX of teh actual scrollbar before the right arrow box

				options.scrollBar.arrowBox.right = {
						scrollCtx:scrollCtx,
						startX   :  endX,
						startY 	 :  startY,
						boxWidth :  scrollBarWidth,
						boxHeight:  scrollBarWidth

				};
				//this will have both top and bottom details
		 		triggerCallBackRenderer(options.scrollBar.arrowBox, options.scrollBar.arrowBoxRenderer);

			} else {

				// left arrow Box
				scrollCtx.lineWidth = options.scrollBar.lineWidth; //lineWidth for scrollbox and arrow
				scrollCtx.strokeStyle = options.scrollBar.arrowColor;

				// draw left arrow
				scrollCtx.moveTo(scrollbarStartX - scrollBarWidth *1/2, Math.round(scrollbarStartY + scrollBarWidth / 2) + 0.5);
				scrollCtx.lineTo(scrollbarStartX - scrollBarWidth / 4, scrollbarStartY + scrollBarWidth/ 4);//towards up
				scrollCtx.moveTo(scrollbarStartX - scrollBarWidth *1/2, Math.round(scrollbarStartY + scrollBarWidth / 2) + 0.5);
				scrollCtx.lineTo(scrollbarStartX - scrollBarWidth / 4, scrollbarStartY + scrollBarWidth* 3 / 4 );//towards down
				scrollCtx.stroke();

				// draw right arrow
				scrollCtx.moveTo(scrollbarStartX + actualScrollBarLength + scrollBarWidth/2, Math.round(scrollbarStartY + scrollBarWidth / 2) + 0.5);
				scrollCtx.lineTo(scrollbarStartX + actualScrollBarLength + scrollBarWidth / 4, scrollbarStartY + scrollBarWidth/ 4);//towards up
				scrollCtx.moveTo(scrollbarStartX + actualScrollBarLength + scrollBarWidth/2, Math.round(scrollbarStartY + scrollBarWidth / 2) + 0.5);
				scrollCtx.lineTo(scrollbarStartX + actualScrollBarLength + scrollBarWidth / 4,scrollbarStartY + scrollBarWidth *3/4 ); //towards down

				scrollCtx.stroke();
			}
			}
		}
		/**
		 * Drawing scrollbox on horizontal scroll bar
		 * @param scrollPosition
		 */
		function drawHorizontalScrollBox(scrollBoxValue) {

			scrollbarStartX = scrollbar.scrollbarStartX;
			scrollbarStartY = scrollbar.scrollbarStartY;
			options = scrollbar.getOptions();
			horizontalIncrement = options.scroll.horizontalIncrement;
			actualScrollBarLength = scrollbar.actualScrollBarLength;

			var startPosnX = null;
			if (horizontalIncrement == 'rtl') {
				startPosnX = scrollbarStartX + actualScrollBarLength;
				scrollBoxStartX = startPosnX - scrollBoxValue - scrollBoxLength / 2;
			}
			else if (horizontalIncrement == 'ltr') {
				startPosnX = scrollbarStartX;
				scrollBoxStartX = startPosnX + scrollBoxValue - scrollBoxLength / 2;
			}
			scrollBoxStartY = scrollbarStartY;

			scrollCanvas = scrollbar.getScrollbarCanvas();
			scrollCtx = scrollCanvas.getContext("2d");
			drawHorizontalScrollBarBody();
			// draw movable scrollBox
			drawHScrollBox(scrollBoxStartX, scrollBoxStartY, scrollBoxLength, scrollBarWidth);

		}

		 function drawHScrollBox(scrollBoxStartX, scrollbarStartY, scrollBoxLength, scrollBarWidth ) {
			// draw movable scrollBox border
			scrollCtx.lineWidth = options.scrollBox.lineWidth;
			scrollCtx.strokeStyle = options.scrollBox.borderColor;
			// draw movable ScrolBox
			scrollCtx.beginPath();
			var scrollBoxWidth = options.scrollBox.maxWidth; // if user provides it will eb taken
			if(scrollBoxWidth == null) {
				scrollBoxWidth = options.scrollBar.lineWidth + 6; //vetically
			}
			if(scrollBoxWidth > scrollbar.scrollBarWidth) {
				scrollBoxWidth = scrollbar.scrollBarWidth;
			}

			var center = scrollBarWidth/2;
			var scrollBoxStartY = scrollbarStartY + center - scrollBoxWidth/2;
			//setting values to object
			scrollbar.scrollBox  = {
					scrollCtx 		:	scrollCtx,
					scrollBoxStartX :	scrollBoxStartX,
					scrollBoxStartY : 	scrollBoxStartY,
					scrollBoxWidth  : 	scrollBoxWidth,
					scrollBoxLength :	scrollBoxLength // horizontally
			};
			if(options.scrollBox.renderer == null) {
				scrollCtx.strokeRect(scrollBoxStartX, scrollBoxStartY, scrollBoxLength, scrollBoxWidth);
				scrollCtx.fillStyle = options.scrollBox.fillColor;
				scrollCtx.fillRect(scrollBoxStartX, scrollBoxStartY, scrollBoxLength, scrollBoxWidth);
			} else {
				triggerCallBackRenderer(scrollbar.scrollBox, options.scrollBox.renderer);
			}
		}

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

		function findPositionsOnMouseClick(e) {
			scrollEventHolder = scrollbar.scrollEventHolder;
      offset = getOffset(scrollEventHolder);
			canvasX = getPageX(e)- offset.left;
			canvasY = getPageY(e) - offset.top;

			startX = scrollbar.startX ;
			startY = scrollbar.startY;
			scrollBarHeight = scrollbar.scrollBarHeight;
			scrollBarWidth = scrollbar.scrollBarWidth;
			scrollbarStartX = scrollbar.scrollbarStartX;
			scrollbarStartY = scrollbar.scrollbarStartY;
			actualScrollBarLength = scrollbar.actualScrollBarLength;
			scrollBoxStartX = scrollbar.scrollBox.scrollBoxStartX;
			scrollBoxStartY = scrollbar.scrollBox.scrollBoxStartY;
			scrollBoxWidth = scrollbar.scrollBox.scrollBoxWidth;
			scrollBoxLength = scrollbar.scrollBox.scrollBoxLength;

			//Checks if the mouse hovered over horizontal left arrow, right arrow and on scrollBox
			if (scrollbar.scrollDirection == HORIZONTAL) {
				isPostionOnHorizontalScrollBar(e);
			} else if (scrollbar.scrollDirection == VERTICAL)  {
				isPostionOnVerticalScrollBar(e);
			}
			scrollbar.hoveredScrollBarPosition = hoveredScrollBarPosition;
		}

		getPageX = function getPageX(e) {
    		var pageX = 0 ;
			if( e.touches != undefined && e.touches.length != 0) {
				pageX = e.touches[0].pageX;
			} else if( e.changedTouches  != undefined && e.changedTouches .length != 0) {
  				pageX = e.changedTouches [0].pageX;
  			} else {
				pageX = e.pageX;
			}
			return pageX;
    	};

    	getPageY = function getPageY(e) {
    		var pageY = 0 ;
			if( e.touches!= undefined && e.touches.length != 0) {
				pageY = e.touches[0].pageY;
			} else if( e.changedTouches  != undefined && e.changedTouches .length != 0) {
  				pageY = e.changedTouches [0].pageY;
  			} else {
				pageY = e.pageY;
			}
			return pageY;
    	};


		//Just for testing
		function testPosition(e) {
			if(window.console != undefined) {
				console.log("isPostionOn " +  scrollbar.scrollDirection  + " ScrollBar " );
				console.log('testPosition : getPageY(e)->' + getPageY(e) + ',  canvasY ->' + canvasY +  ', offset.top-> ' + offset.top + ',  options.scrollOffset.top->'+ options.scrollOffset.top);
				console.log('testPosition : getPageX(e)->' + getPageX(e) + ',  canvasX ->' + canvasX +  ', offset.left-> ' + offset.left + ',  options.scrollOffset.left->'+ options.scrollOffset.left);
				console.log('scrollBoxStartX ' + scrollBoxStartX + ' scrollBoxStartY ' + scrollBoxStartY + ' scrollBoxLength ' + scrollBoxLength + ' scrollBarWidth '  +scrollBarWidth);
			}

		}
		/**
		 * Checks if the mouse hovered over left arrow, right arrow and on scrollBox
		 */

		function isPostionOnHorizontalScrollBar(e) {

			//Check if it is positioned in scroll box
			if (isOnHorizontalScrollBox()) {
				hoveredScrollBarPosition=SCROLL_BOX;
				return true;
			} else if ((canvasX >= (scrollbarStartX + actualScrollBarLength)) && (canvasX <= (scrollbarStartX + actualScrollBarLength + scrollBarWidth)) &&
					(canvasY >= startY) &&(canvasY <= (scrollbarStartY + scrollBarWidth))) {
				hoveredScrollBarPosition = RIGHT_ARROW;
				return true; //right arrow
			}  else  if ((canvasX <= scrollbarStartX)  && (canvasX >= (scrollbarStartX - scrollBarWidth)) ////Check if it is positioned in left arrow
					&& (canvasY >= scrollbarStartY) && canvasY <= (scrollbarStartY + scrollBarWidth)) {
				hoveredScrollBarPosition = LEFT_ARROW;
				return true; //right arrow

			} else if ((canvasX <= scrollBoxStartX && canvasX >= scrollbarStartX)
					&& (canvasY > scrollbarStartY) && canvasY < (scrollbarStartY + scrollBarWidth)) {
				hoveredScrollBarPosition="BEFORE_SCROLL_BOX";
				return true;

			} else if ((canvasX >= scrollBoxStartX + scrollBoxLength && canvasX <= scrollbarStartX + actualScrollBarLength)
					&& (canvasY >= scrollbarStartY) && canvasY <= (scrollbarStartY + scrollBarWidth)) {
				hoveredScrollBarPosition="AFTER_SCROLL_BOX";
				return true;
			}
			hoveredScrollBarPosition = null;

			return false;
		}

		//Checks if the mouse hovered over left arrow, right arrow and on scrollBox
		function isPostionOnVerticalScrollBar(e) {
			startX = scrollbar.startX ;
			startY = scrollbar.startY;
			scrollBarHeight = scrollbar.scrollBarHeight;
			scrollBarWidth = scrollbar.scrollBarWidth;
			scrollbarStartX = scrollbar.scrollbarStartX;
			scrollbarStartY = scrollbar.scrollbarStartY;
			actualScrollBarLength = scrollbar.actualScrollBarLength;

			//testPosition(e);
			//Check if it is positioned in scroll bar
			if (isOnVerticalScrollBox()) {
				hoveredScrollBarPosition=SCROLL_BOX;
				return true;

			} else if ((canvasY >= (scrollbarStartY + actualScrollBarLength)) && (canvasY <= (scrollbarStartY + actualScrollBarLength + scrollBarWidth )) &&
					(canvasX >= scrollbarStartX) &&(canvasX <= (scrollbarStartX + scrollBarWidth))) {
				hoveredScrollBarPosition = BOTTOM_ARROW;
				return true;

			} else  if ((canvasY <= startY + scrollBarWidth)  && (canvasY >= startY ) ////Check if it is positioned in left arrow
					&& (canvasX >= scrollbarStartX) && canvasX <= (scrollbarStartX + scrollBarWidth)) {
				hoveredScrollBarPosition = TOP_ARROW;
				return true;

			} else if ((canvasX >= scrollBoxStartX && canvasX <= (scrollBoxStartX + scrollBarWidth))
					&& (canvasY <= scrollBoxStartY && canvasY >= scrollbarStartY)) {
				hoveredScrollBarPosition="ABOVE_SCROLL_BOX";
				return true;

			} else if ((canvasX >= scrollBoxStartX && canvasX <= (scrollBoxStartX + scrollBarWidth))
					&& (canvasY >= (scrollBoxStartY + scrollBoxLength) && canvasY <= (scrollbarStartY + actualScrollBarLength))) {
				hoveredScrollBarPosition="BELOW_SCROLL_BOX";
				return true;
			}
			hoveredScrollBarPosition=null;
			return false;

		}


		function isOnVerticalScrollBox() {
			//Check if it is positioned on vertical scroll box
			if ((canvasX >= scrollBoxStartX && canvasX <= (scrollBoxStartX + scrollBoxWidth))
						&& (canvasY >= scrollBoxStartY && canvasY <= (scrollBoxStartY + scrollBoxLength))) {
				hoveredScrollBarPosition=SCROLL_BOX;
				 scrollbar.hoveredScrollBarPosition = hoveredScrollBarPosition;
				return true;
			}
			return false;
		}


		function isOnHorizontalScrollBox() {
			//Check if it is positioned on horizontal scroll box
			if ((canvasX >= scrollBoxStartX && canvasX <= (scrollBoxStartX + scrollBoxLength))
					&& (canvasY >= scrollBoxStartY && canvasY <= (scrollBoxStartY + scrollBoxWidth))) {
				hoveredScrollBarPosition=SCROLL_BOX;
				scrollbar.hoveredScrollBarPosition = hoveredScrollBarPosition;
				return true;
			}
			return false;
		}



		/**
		 * To re position the scroll bar on clicking the scroll arrows
		 * @param mouseWheelMovement will be defined only when this action is triggered on mouse wheel event,
		 * in all the otehr cases it will be undefined
		 */
		function redrawScrollBarOnScrollClick(e, mouseWheelMovement) {

			 scrollbar = scrollBarObjectMap[$(e.target).parent().attr('id')];
			if(scrollbar == undefined) {
				scrollbar = this; //in case of mouse scroll triggered on mouse wheel . no traget in this case
			}
			if(counter != null) {
				counter++;
				if(counter == 2 || counter == 3) {
					return;
				}
			}
			var movementOnEachClick = null;
			if(mouseWheelMovement == undefined ) {
				scrollbar.viewArea = scrollbar.maxViewValue - scrollbar.minViewValue;

				if(hoveredScrollBarPosition == "ABOVE_SCROLL_BOX" || hoveredScrollBarPosition == "BELOW_SCROLL_BOX"  ||
						hoveredScrollBarPosition == "BEFORE_SCROLL_BOX" || hoveredScrollBarPosition == "AFTER_SCROLL_BOX"  ) {
					if(!isOnHorizontalScrollBox() && !isOnVerticalScrollBox())  { // stop scrolling if scrollbox touches the current click position
						movementOnEachClick = scrollbar.viewArea;
					}
				} else {
					movementOnEachClick = getMovementOnEachClick();
				}
			} else {
				//when triggered from mouse wheel event
				movementOnEachClick = mouseWheelMovement * getMovementOnEachMouseTick();
			}
			if(hoveredScrollBarPosition == null || hoveredScrollBarPosition == undefined  || hoveredScrollBarPosition == SCROLL_BOX) {
				clearInterval(interval);
				return;
			}
			if(movementOnEachClick != null)  {
				if(hoveredScrollBarPosition == LEFT_ARROW || hoveredScrollBarPosition == "BEFORE_SCROLL_BOX" ) { // decrement
					if (horizontalIncrement == 'rtl') {
						scrollbar.minViewValue = scrollbar.minViewValue + movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue + movementOnEachClick;
					} else {
						scrollbar.minViewValue = scrollbar.minViewValue - movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue - movementOnEachClick;
					}
				} else if( hoveredScrollBarPosition == RIGHT_ARROW || hoveredScrollBarPosition == "AFTER_SCROLL_BOX") { // increment
					if (horizontalIncrement == 'rtl') {
						scrollbar.minViewValue = scrollbar.minViewValue - movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue - movementOnEachClick;
					} else {
						scrollbar.minViewValue = scrollbar.minViewValue + movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue + movementOnEachClick;
					}
				} else if( hoveredScrollBarPosition == BOTTOM_ARROW  || hoveredScrollBarPosition == "BELOW_SCROLL_BOX") { // decrement
					if(verticalIncrement == 'up' ) {
						scrollbar.minViewValue = scrollbar.minViewValue - movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue - movementOnEachClick;
					} else {
						scrollbar.minViewValue = scrollbar.minViewValue + movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue + movementOnEachClick;
					}
				} else if( hoveredScrollBarPosition == TOP_ARROW  ||  hoveredScrollBarPosition == "ABOVE_SCROLL_BOX") { // increment
					if(verticalIncrement == 'up') {
						scrollbar.minViewValue = scrollbar.minViewValue + movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue + movementOnEachClick;
					}  else { //'down'
						scrollbar.minViewValue = scrollbar.minViewValue - movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue - movementOnEachClick;
					}
				}
				capScrollLimits(); // capScrollLimits if the limit exceeds
				scrollbar.noDataFetchButRedraw(e);

				//Check For on demand data fetch we need to fire the data fetch for every keyDownFetchInterval .Check this and fire
				scrollbar.fetchDataIfNeededAndScroll(e);
			}
		};

		////arrowKeyPressed -  Case when keys are pressed, it will be passed from core

		function onScrollArrowPressed(e , arrowKeyPressed) {
			scrollEventHolder = this;
			scrollbar = scrollBarObjectMap[scrollEventHolder.parentNode.id];
			options = scrollbar.getOptions();
			if(arrowKeyPressed == undefined) {
				findPositionsOnMouseClick(e);	 //case when mouse is hovered and arrow click using mouse
			} else {
				hoveredScrollBarPosition = arrowKeyPressed;	 // Case when keys are pressed, it will be passed from core
				scrollbar.hoveredScrollBarPosition = hoveredScrollBarPosition;
			}

			hoveredScrollBarPosition = scrollbar.hoveredScrollBarPosition;
			if(hoveredScrollBarPosition != null && hoveredScrollBarPosition != SCROLL_BOX) {
				counter = 0;
				scrollbar.redrawScrollBarOnScrollClick(e);
				setScrolling(true);
				if(options.scroll.optimiseScrollOnArrowClick) { //tiled Scrolling with fixed header image for the static
					if(actualDrawTimerForTiling != null) {
						 clearInterval(actualDrawTimerForTiling);
					}
				}
				//ALL CASES
				if(interval != undefined) {
					clearInterval(interval);
				}
				interval = setInterval(function(e){
					if(scrollbar) {
					scrollbar.redrawScrollBarOnScrollClick(e);
					}
				 }.bind(this, e), 100); // enable scrolling on keeping clicked

			}
			//This is done in order to get focus on canvas plot even if user had focused on scrollbar
			if(scrollbar.scrollableObjectsCollection.length > 0)  {
				scrollbar.scrollableObjectsCollection[0].getEventHolder().focus();
			 }
		}

		/**
		 * Function triggered on releasing the mouse button after scrolling
		 * @param e
		 */

		function onScrollArrowReleasd(e) {
			scrollEventHolder = this;
			scrollbar = scrollBarObjectMap[scrollEventHolder.parentNode.id];
			if(hoveredScrollBarPosition != null && hoveredScrollBarPosition != SCROLL_BOX ) {
				if(interval != undefined) {
					  clearInterval(interval);
				}
				if(options.scroll.optimiseScrollOnArrowClick == true) { //tiling and optimised scroll arrow click
					actualDrawTimerForTiling = setTimeout(function(e) {
						setScrolling(false);
						scrollbar.fetchDataAndRedraw(e);
					}.bind(this, e),500);
				} else {
					setScrolling(false);
					scrollbar.fetchDataAndRedraw(e);  // fetching data at end and redraw
				}
			}
			//This is done in order to get focus on canvas plot even if user had focused on scrollbar
			if(scrollbar.scrollableObjectsCollection.length > 0)  {
				scrollbar.scrollableObjectsCollection[0].getEventHolder().focus();
			  }
		}

		function scrollActionOnKeyDownEvent(e , arrowKeyPressed) { //on every key down , this will be continuously called if kept on pressing ..........
			scrollbar = this;
			setScrolling(true);
			if(options.scroll.optimiseScrollOnArrowClick == true) { //tiling and optimised scroll on key down
				if(actualDrawTimerForTiling != null) {
					 clearInterval(actualDrawTimerForTiling);
				}
			}
			//Here no need of a timer to fire the tiling or in normal case
			scrollbar.redrawScrollBarOnKeyDownEvent(e , arrowKeyPressed) ;
		}
		/**
		 *
		 * exposed to the user to perform action on custom scroll button click
		 * arrowDirection can have values LEFT_ARROW, RIGHT_ARROW(for horizontal scrollbar) and  BOTTOM_ARROW and TOP_ARROW (for vertical scrollbar)
		 */
		this.triggerActionOnScrollButtonDown = function (e, arrowDirection) {
			scrollbar = this;
			scrollbar.scrollActionOnKeyDownEvent(e, arrowDirection);
			counter = 0;
			if(interval != undefined) {
				clearInterval(interval);
			}
			interval = setInterval(function(e, arrowDirection, scrollbar){
				counter++;
				if(counter == 1 || counter == 2){
					return;
				}
				if(scrollbar) {
					scrollbar.redrawScrollBarOnKeyDownEvent(e , arrowDirection) ;
				}
			}.bind(this, e, arrowDirection, scrollbar), 50);// enable scrolling on keeping clicked
		};

		/**
		 *
		 * exposed to the user to perform action on custom scroll button click
		 * arrowDirection can have values LEFT_ARROW, RIGHT_ARROW(for horizontal scrollbar) and  BOTTOM_ARROW and TOP_ARROW (for vertical scrollbar)
		 */
		this.triggerActionOnScrollButtonUp = function (e, arrowDirection) {
			if(interval != undefined) {
				clearInterval(interval);
				counter = 0;
			}

			this.scrollActionOnKeyUpEvent(e, arrowDirection);
		};
		function scrollActionOnKeyUpEvent(e, hoveredScrollBarPosition) {
			scrollbar = this;
			hoveredScrollBarPosition =  scrollbar.hoveredScrollBarPosition ;
			if(hoveredScrollBarPosition != null && hoveredScrollBarPosition != SCROLL_BOX ) {
				if(options.scroll.optimiseScrollOnArrowClick == true) { //tiling and optimised scroll on key down
					actualDrawTimerForTiling = setTimeout(function(e) {
						setScrolling(false);
						scrollbar.fetchDataAndRedraw(e);

		 			}.bind(this, e), 500);	// enable scrolling
				} else {
					setScrolling(false);
					scrollbar.fetchDataAndRedraw(e);  // fetching data at end and redraw  Now fetching of data on each press ..check this
				}
			}
		}

		function setScrolling(flag) {
			if(scrollbar.scrollableObjectsCollection.length != null)  {
				for ( var int = 0; int < scrollbar.scrollableObjectsCollection.length; int++) {
					var scrollableObject = scrollbar.scrollableObjectsCollection[int];
					scrollableObject.setScrolling(flag);
				}
			}
		}

		function redrawScrollBarOnKeyDownEvent(e , arrowKeyPressed) {
			scrollbar = this;
			hoveredScrollBarPosition = arrowKeyPressed; // make it as the scroll bar position
			scrollbar.hoveredScrollBarPosition = hoveredScrollBarPosition;
			var movementOnEachClick = getMovementOnEachClick();

			scrollbar.drawTriggeredFromKeyDown = false;

			if(movementOnEachClick != null)  {

				if(hoveredScrollBarPosition == LEFT_ARROW  ) { // decrement
					if (horizontalIncrement == 'rtl') {
						scrollbar.minViewValue = scrollbar.minViewValue + movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue + movementOnEachClick;
					} else {
						scrollbar.minViewValue = scrollbar.minViewValue - movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue - movementOnEachClick;
					}
					scrollbar.scrollDirection = HORIZONTAL;

				} else if( hoveredScrollBarPosition == RIGHT_ARROW ) { // increment
					if (horizontalIncrement == 'rtl') {
						scrollbar.minViewValue = scrollbar.minViewValue - movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue - movementOnEachClick;
					} else {
						scrollbar.minViewValue = scrollbar.minViewValue + movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.minViewValue + scrollbar.viewArea;//scrollbar.maxViewValue + movementOnEachClick;
					}
					scrollbar.scrollDirection = HORIZONTAL;

				} else if( hoveredScrollBarPosition == BOTTOM_ARROW) {  // decrement
					if(verticalIncrement == 'up' ) {
						scrollbar.minViewValue = scrollbar.minViewValue - movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue - movementOnEachClick;
					} else {
						scrollbar.minViewValue = scrollbar.minViewValue + movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue + movementOnEachClick;
					}
					scrollbar.scrollDirection = VERTICAL;
				} else if( hoveredScrollBarPosition == TOP_ARROW ) { // increment
					if(verticalIncrement == 'up') {
						scrollbar.minViewValue = scrollbar.minViewValue + movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue + movementOnEachClick;
					}  else { //'down'
						scrollbar.minViewValue = scrollbar.minViewValue - movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue - movementOnEachClick;
					}
					scrollbar.scrollDirection = VERTICAL;
				}
				//This flag will prevent the browser scroll from queing multiple events and result in wrong drawing(precision)
				scrollbar.drawTriggeredFromKeyDown = true;

				capScrollLimits(); // capScrollLimits if the limit exceeds
				scrollbar.noDataFetchButRedraw(e); // you need to draw the scroll box and plot with the current movement.MUST
				//actual Data fetch only if the dragIntervel for fetech is reached. This is a specific case of ON DEMAND data fetch
				//Additionally check datafetch needed and scroll. A new method addede in navigate
				scrollbar.fetchDataIfNeededAndScroll(e);

			}
		}


		function getScrollPercentage() {
			options = scrollbar.getOptions();
			return options.axis.arrowScroll;
		}

		function getScrollUnit() {
			options= scrollbar.getOptions();
			return options.axis.arrowScrollUnit;
		}

		function getMouseWheelTickUnit() {
			options= scrollbar.getOptions();
			return options.axis.mouseWheelTickUnit;
		}

		function getMouseWheelTickPercentage() {
			options = scrollbar.getOptions();
			return options.axis.mouseWheelTickPercentage;
		}



		function getMovementOnEachClick() {
			var arrowScroll = getScrollPercentage();
			var arrowScrollUnit = getScrollUnit();
			var movementOnEachClick;
			scrollbar.viewArea = scrollbar.maxViewValue - scrollbar.minViewValue;
			if(arrowScrollUnit != 0 && arrowScrollUnit != null) {
				movementOnEachClick = arrowScrollUnit ;//arrowScrollUnit is the Tick Unit moved
			} else if(arrowScroll != null) {
				movementOnEachClick =  (arrowScroll * scrollbar.viewArea / 100);//arrowScroll % of the view area
			}
			return movementOnEachClick;
		}

		function getMovementOnEachMouseTick() {

			var movementOnEachTick = 1;
			var tickScrollPercentage = getMouseWheelTickPercentage();
			var tickScrollUnit = getMouseWheelTickUnit();
			scrollbar.viewArea = scrollbar.maxViewValue - scrollbar.minViewValue;
			if(tickScrollUnit != 0 && tickScrollUnit != null) {
				movementOnEachTick = tickScrollUnit ;//tickScrollUnit is the Tick Unit moved
			} else if(tickScrollPercentage != null) {
				movementOnEachTick =  (tickScrollPercentage * scrollbar.viewArea / 100);//tickScrollPercentage % of the view area
			}
			return movementOnEachTick;
		}

		//var capLimitReached, capRedrawOnce;
		function capScrollLimits() {
			if (scrollbar.minViewValue < scrollbar.minAxisValue) {
				scrollbar.minViewValue = scrollbar.minAxisValue;
				scrollbar.maxViewValue = scrollbar.minViewValue + scrollbar.viewArea;
			}
			if (scrollbar.maxViewValue > scrollbar.maxAxisValue) {
				scrollbar.maxViewValue =  scrollbar.maxAxisValue;
				scrollbar.minViewValue = scrollbar.maxViewValue - scrollbar.viewArea;
			}
		}


		var currentScrollbar = null;

		function onScrollStart(e) {
			scrollbar =  scrollBarObjectMap[$(e.target).parent().attr('id')];
			currentScrollbar = scrollbar;
			scrollEventHolder = scrollbar.scrollEventHolder;
			hoveredScrollBarPosition = scrollbar.hoveredScrollBarPosition;
			var alreadyOnScrollBox = (hoveredScrollBarPosition == SCROLL_BOX);
			findPositionsOnMouseClick(e);
			if (hoveredScrollBarPosition == SCROLL_BOX || alreadyOnScrollBox) {
				scrollEvent = true;
				isScrolling = true;
				setScrolling(true);
				timerMinViewValue = -1;
				if(scrollTimer != null) {
					 clearInterval(scrollTimer);
				}
				scrollTimer = setInterval(function(scrollbar, e) { //There is a chance for this to go into infinite loop if onScrollEnd is not fired
						if(timerMinViewValue == scrollbar.minViewValue) {
							scrollbar.fetchDataAndRedraw(e);
						}
						timerMinViewValue = scrollbar.minViewValue;
				 }.bind(this, scrollbar, e), dragIntervalForFetch);
				offset = scrollEventHolder.offset();
				if(hoveredScrollBarPosition == SCROLL_BOX) {
					startPosnX = getPageX(e) - offset.left - options.scrollOffset.left;
					startPosnY = getPageY(e) - offset.top - options.scrollOffset.top;
				} else {
					startPosnX = scrollBoxStartX - options.scrollOffset.left;
					startPosnY = scrollBoxStartY -  options.scrollOffset.top;
				}
				capScrollLimits();
				scrollStartMinViewValue = scrollbar.minViewValue;
			}
		}


		/**
		 * This should be triggered only on dragging on clickign teh scrollbox
		 * @param e
		 */

		function onScrollDrag(e) {
			scrollbar = currentScrollbar;

			if(!scrollEvent) {
				return;
			}
			if (scrollTimeout) {
				return;
			}
			offset = scrollEventHolder.offset();
			canvasX = getPageX(e) - offset.left - options.scrollOffset.left,
			canvasY = getPageY(e) - offset.top - options.scrollOffset.top;

			options = scrollbar.getOptions();
			horizontalIncrement = options.scroll.horizontalIncrement;
			verticalIncrement = options.scroll.verticalIncrement;
			hoveredScrollBarPosition = scrollbar.hoveredScrollBarPosition;
			actualScrollBarLength = scrollbar.actualScrollBarLength;
			scrollLength = scrollbar.scrollLength;
			if(scrollbar.scrollDirection == HORIZONTAL) {

				if (horizontalIncrement == 'rtl')
				{
					scrollbar.minViewValue = scrollStartMinViewValue - (canvasX - startPosnX) * scrollLength	/ actualScrollBarLength;
					scrollbar.maxViewValue = scrollbar.minViewValue + scrollbar.viewArea;
				}
				else
				{
					scrollbar.minViewValue = scrollStartMinViewValue 	+ (canvasX - startPosnX) * scrollLength	/ actualScrollBarLength;
					scrollbar.maxViewValue = scrollbar.minViewValue + scrollbar.viewArea;
				}
			} else {
				if(verticalIncrement == 'up' ) {
					scrollbar.minViewValue = scrollStartMinViewValue 	+ (startPosnY - canvasY) * scrollLength	/ actualScrollBarLength;
					scrollbar.maxViewValue = scrollbar.minViewValue + scrollbar.viewArea;
				} else {
					scrollbar.minViewValue = scrollStartMinViewValue 	- (startPosnY - canvasY) * scrollLength	/ actualScrollBarLength;
					scrollbar.maxViewValue = scrollbar.minViewValue + scrollbar.viewArea;
				}

			}
			capScrollLimits();
			scrollTimeout = setTimeout(function(e, scrollbar) {

				if(!isScrolling) {
					scrollTimeout = null;
					return;
				}
				scrollbar.noDataFetchButRedraw(e);
				scrollTimeout = null;
			}.bind(this, e, scrollbar), 1000/frameRate);

		}

		function onScrollEnd(e) {

			scrollbar = currentScrollbar;
			if(isScrolling) {
				scrollbar.fetchDataAndRedraw(e);
				scrollEvent = false;
				clearInterval(scrollTimer);
				scrollTimer = null;
				isScrolling = false;
				setScrolling(false);
			}
			//This is done in order to get focus on canvas plot even if user had focused on scrollbar
			 if(scrollbar.scrollableObjectsCollection.length > 0)  {
				scrollbar.scrollableObjectsCollection[0].getEventHolder().focus();
			 }
		}

		/**
		 * perform scrollign alone ...Only redraw the gantt and box without data fetch
		 */
		function noDataFetchButRedraw(event) {
			scrollbar = this;
			// redraw the scroll box of the respective ScrollBar with new coordinates
			scrollbar.redrawScrollBox();
			// call all gantt function from scroll bar for all the plot objects
			if(timeoutDraw == null) {
				noDataFetchScheduled = true; // if in case the timeoutDraw is not set null in fetchData before executign this
				timeoutDraw = setTimeout(function(scrollbar) {
					timeoutDraw = null;
					 if(scrollbar.scrollableObjectsCollection.length != null)  {
						for ( var int = 0; int < scrollbar.scrollableObjectsCollection.length; int++) {
							var scrollableObject = scrollbar.scrollableObjectsCollection[int];
							scrollableObject.scrolling({ // no fetching of data
								minViewValue : scrollbar.minViewValue,
								maxViewValue : scrollbar.maxViewValue,
								minAxisValue : scrollbar.minAxisValue,
								maxAxisValue : scrollbar.maxAxisValue,
								scrollDirection: scrollbar.scrollDirection,
								optimiseScrollOnArrowClick : options.scroll.optimiseScrollOnArrowClick,
								//arrowKeyPressed :hoveredScrollBarPosition
								originalEvent  :event
							});
						}
					}
				} .bind(this, scrollbar),50);
			}



		}
		/**
		 * fetch data and redraw the scrollbox - chnaged to accept arrowKey
		 */
		function fetchDataAndRedraw (event) {
			scrollbar = this;
			scrollbar.redrawScrollBox();
			if (timeoutDraw != null && noDataFetchScheduled) {
				clearTimeout(timeoutDraw);
				timeoutDraw = null;
			}
			if(timeoutDraw == null) {
				timeoutDraw = setTimeout(function(scrollbar, event) {
					timeoutDraw = null;
					if(scrollbar.scrollableObjectsCollection.length != null)  {
						for ( var int = 0; int < scrollbar.scrollableObjectsCollection.length; int++) {
							var scrollableObject = scrollbar.scrollableObjectsCollection[int];
							scrollableObject.scroll({ // Fetching of data
								minViewValue : scrollbar.minViewValue,
								maxViewValue : scrollbar.maxViewValue,
								scrollDirection: scrollbar.scrollDirection,
								//arrowKeyPressed :arrowKeyPressed,
								originalEvent :event
							});
						}
					}
				}.bind(this, scrollbar, event), 50);

			}
		}

		function fetchDataIfNeededAndScroll(event) {
			scrollbar = this;
			keyDownFetchInterval =  scrollbar.getOptions().scroll.keyDownFetchInterval;
			if(scrollbar.scrollableObjectsCollection.length != null)  {
				for ( var int = 0; int < scrollbar.scrollableObjectsCollection.length; int++) {
					var scrollableObject = scrollbar.scrollableObjectsCollection[int];

					scrollableObject.checkDataFetchAndScroll({ // Fetching of data
						minViewValue : scrollbar.minViewValue,
						maxViewValue : scrollbar.maxViewValue,
						scrollDirection: scrollbar.scrollDirection,
						//arrowKeyPressed: hoveredScrollBarPosition,
						keyDownFetchInterval :keyDownFetchInterval,
						originalEvent :event

					});

				}
			}
			scrollbar.redrawScrollBox();
		}


		function onBrowserScroll(e) {
			 scrollbar = scrollBarObjectMap[$(e.target).parent().attr('id')];
			 scrollEventHolder = scrollbar.scrollEventHolder;
 			if($(e.target).attr('direction') == HORIZONTAL ) {
				scrollbar.scrollDirection = HORIZONTAL;
				scrollLeft = this.scrollLeft;

			} else if($(e.target).attr('direction') == VERTICAL ){
				scrollbar.scrollDirection = VERTICAL;
				scrollTop = this.scrollTop;
			}
			if(timeout1 == null) {
				timeout1 = setTimeout(function( ) {
					timeout1 = null;
					var areaMoved =null;
					scrollbar.viewArea = scrollbar.maxViewValue - scrollbar.minViewValue;
					totalLoadArea = (scrollbar.maxAxisValue - scrollbar.minAxisValue);
				    if(scrollbar.scrollDirection == HORIZONTAL) {
					    old = scrollbar.scrollLeft;
						var defaultPixel = scrollLeft - old;
						if(defaultPixel == 0){
							return;
						}
						//drawTriggeredFromKeyDown is set to true in redrawKeyDown function
						if(scrollbar.drawTriggeredFromKeyDown) {
							scrollbar.drawTriggeredFromKeyDown = false;
							return;
						}
				    	areaMoved = scrollLeft/scrollbar.width;
				    	scrollbar.scrollLeft = scrollbar.scrollEventHolder.scrollLeft();

					} else if(scrollbar.scrollDirection == VERTICAL) {
						   old = scrollbar.scrollTop;
							var defaultPixel = scrollTop - old;
							if(defaultPixel == 0){
								return;
							}
							//drawTriggeredFromKeyDown is set to true in redrawKeyDown function
							if(scrollbar.drawTriggeredFromKeyDown) {
								scrollbar.drawTriggeredFromKeyDown = false;
								return;
							}
						 areaMoved = scrollTop/scrollbar.height;
						 scrollbar.scrollTop = scrollbar.scrollEventHolder.scrollTop();

					}

				    //Keep the previous values
				    scrollbar.previousValues.minViewValue = scrollbar.minViewValue;
					scrollbar.previousValues.maxViewValue = scrollbar.maxViewValue;
					scrollbar.previousValues.minAxisValue = scrollbar.minAxisValue;
					scrollbar.previousValues.maxAxisValue = scrollbar.maxAxisValue;
				    scrollbar.minViewValue = scrollbar.minAxisValue + (areaMoved * totalLoadArea);
				    scrollbar.maxViewValue = scrollbar.minViewValue + scrollbar.viewArea;
				    capScrollLimits();

					if(scrollbar.scrollableObjectsCollection.length != null)  {
						for ( var int = 0; int < scrollbar.scrollableObjectsCollection.length; int++) {
							var scrollableObject = scrollbar.scrollableObjectsCollection[int];
							  scrollableObject.setScrolling(true);		// for image cache enabling
							  scrollableObject.setInterimScrollMode(true);
								scrollableObject.scroll({ // Fetching of data
									minViewValue : scrollbar.minViewValue,
									maxViewValue : scrollbar.maxViewValue
									,scrollDirection: scrollbar.scrollDirection,
									arrowKeyPressed :scrollbar.hoveredScrollBarPosition
								});
								clearTimeout(timeout2);
								timeout2 = setTimeout(function() {
									scrollableObject.setScrolling(false);
									scrollableObject.setInterimScrollMode(false);
									scrollableObject.scroll({ // Fetching of data
										minViewValue : scrollbar.minViewValue,
										maxViewValue : scrollbar.maxViewValue
										,scrollDirection: scrollbar.scrollDirection,
										arrowKeyPressed :scrollbar.hoveredScrollBarPosition
									});
									//This is done in order to get focus on canvas plot even if user had focused on scrollbar
									scrollableObject.getEventHolder().focus();
								}, 200);

						}
				}
			}, 20); //timout
		} //if timeout ==nul



		}

		/**
		 * Redraw only the respective scrollBox on the respective scrollbar.
		 *
		 */
		function redrawScrollBox() {
			scrollbar = this;
			scrollBarHolder = scrollbar.scrollBarHolder;
			//ensure before drawing that the view values are in the range
			capScrollLimits();
			if(options.browserScroll.enable) {
				//set the width of the scroll bar and redraw.
				 scrollLength = scrollbar.maxAxisValue - scrollbar.minAxisValue; // actual data

				 scrollbar.viewArea = scrollbar.maxViewValue - scrollbar.minViewValue;
				 var placeHolderScrollBarWidth, placeHolderScrollBarHeight;
				 var scrollBarPlaceHolderWidth =  ($(scrollBarHolder).css('width') != undefined) ? $(scrollBarHolder).css('width') : $(scrollBarHolder).attr('width');
				 if(scrollBarPlaceHolderWidth.indexOf("px") != -1) {
					 placeHolderScrollBarWidth = scrollBarPlaceHolderWidth.substring(0, scrollBarPlaceHolderWidth.indexOf("px"));
				 } else {
					 placeHolderScrollBarWidth = scrollBarPlaceHolderWidth;
				 }
				 var scrollBarPlaceHolderHeight = ( $(scrollBarHolder).css('height') != undefined) ? $(scrollBarHolder).css('height') : $(scrollBarHolder).attr('height');
				 if(scrollBarPlaceHolderHeight.indexOf("px") != -1) {
					 placeHolderScrollBarHeight = scrollBarPlaceHolderHeight.substring(0, scrollBarPlaceHolderHeight.indexOf("px"));
				 } else {
					 placeHolderScrollBarHeight = scrollBarPlaceHolderHeight;
				 }
				 if (scrollbar.scrollDirection == HORIZONTAL) {
					 scrollBarWidth = (scrollLength/scrollbar.viewArea) * placeHolderScrollBarWidth;
					 scrollBarHeight = placeHolderScrollBarHeight;
					 $(scrollInnerDiv).css('width', scrollBarWidth);
					 $(scrollInnerDiv).css('height', scrollBarHeight);
					 scrollbar.width = scrollBarWidth;
					 scrollbar.height = scrollBarHeight;
					 var scrollLeft = (scrollbar.minViewValue - scrollbar.minAxisValue)/scrollLength * scrollbar.width ;
					 if(scrollbar.scrollLeft  != scrollLeft) {
						 scrollbar.scrollEventHolder.scrollLeft(scrollLeft);
						 scrollbar.scrollLeft = scrollbar.scrollEventHolder.scrollLeft();
					 }
				 } else  if(scrollbar.scrollDirection == VERTICAL) {
					 scrollBarHeight = (scrollLength/scrollbar.viewArea) * placeHolderScrollBarHeight;
					 scrollBarWidth =  placeHolderScrollBarWidth;
					 $(scrollInnerDiv).css('width', scrollBarWidth);
					 $(scrollInnerDiv).css('height', scrollBarHeight);

					 scrollbar.width = scrollBarWidth;
					 scrollbar.height = scrollBarHeight;
					 var scrollTop = (scrollbar.minViewValue - scrollbar.minAxisValue)/scrollLength * scrollbar.height ;
						 if(scrollbar.scrollTop  != scrollTop) {
							 scrollbar.scrollEventHolder.scrollTop(scrollTop);
							 scrollbar.scrollTop = scrollbar.scrollEventHolder.scrollTop();
						 }
				 }

			} else {
				var scrollBoxValue =  calculateScrollBoxValue();
				if(scrollbar.scrollDirection == VERTICAL) {
					drawVerticalScrollBox(scrollBoxValue);
				} else if (scrollbar.scrollDirection == HORIZONTAL) {
					drawHorizontalScrollBox(scrollBoxValue);
				}
			}
		}
		/**
		 *
		 * Common function for both  scroll bars
		 * @returns {Number}
		 */

		function calculateScrollBoxValue() {
			options = scrollbar.getOptions();
			scrollLength = scrollbar.maxAxisValue - scrollbar.minAxisValue; // actual data
			scrollbar.scrollLength = scrollLength;
			actualScrollBarLength = scrollbar.actualScrollBarLength;
			scrollbar.viewArea = scrollbar.maxViewValue - scrollbar.minViewValue;

			middleViewValue = scrollbar.minViewValue + scrollbar.viewArea / 2;;
			scrollbar.scrollPosition = (middleViewValue - scrollbar.minAxisValue);
			var scrollBoxValue = scrollbar.scrollPosition * actualScrollBarLength/ scrollLength; // in pixels
			scrollBoxLength = scrollbar.viewArea * actualScrollBarLength / scrollLength; // in  pixels
			scrollbar.scrollBoxLength = scrollBoxLength;
			//Cap the scrollBox Length to minimum pixels
			if(scrollBoxLength < options.scrollBox.minLength) {
				//save extra space to clear
				scrollBoxLength = options.scrollBox.minLength;
			}

			return scrollBoxValue;
		}

		 /**
		  * Function does the scrolling event fired for all other charts except teh invoked one
		  */
		function syncAllCharts(event) {

			if(scrollbar.scrollableObjectsCollection.length != null)  {
				for ( var int = 0; int < scrollbar.scrollableObjectsCollection.length; int++) {
					var scrollableObject = scrollbar.scrollableObjectsCollection[int];
					// removed this check as this is handled in data fetch and also the scrolling need to
					//be invoked for all multiscreen plots irrespective of invoked one
						scrollableObject.scrolling({ // no fetching of data
							minViewValue : scrollbar.minViewValue,
							maxViewValue : scrollbar.maxViewValue,
							minAxisValue : scrollbar.minAxisValue,
							maxAxisValue : scrollbar.maxAxisValue,
							scrollDirection: scrollbar.scrollDirection,
							originalEvent : event
						});
				}
			}
		}
		/**
		 * This is needed only for PAN - Fetch data and maintain the scroll for the
		 * rest of the charts in case of single scrollbar linked with multiple charts
		 */
		function syncAllChartsWithDataFetch(event) {
			scrollbar = this;
			if(scrollbar.scrollableObjectsCollection.length != null)  {
				for ( var int = 0; int < scrollbar.scrollableObjectsCollection.length; int++) {
					var scrollableObject = scrollbar.scrollableObjectsCollection[int];
						scrollableObject.scroll({ // fetching of data
							minViewValue : scrollbar.minViewValue,
							maxViewValue : scrollbar.maxViewValue,
							scrollDirection: scrollbar.scrollDirection,
							//arrowkeyPressed : scrollbar.hoveredScrollBarPosition
							originalEvent :  event
						});
					}
			}

		}

		function onScrollbarResize() {
			scrollBarHolder = this;
			scrollbar = scrollBarObjectMap[$(scrollBarHolder).attr('id')];
            // somebody might have hidden us and we can't plot  when we don't have the dimensions
            if (scrollbar.width == 0 || scrollbar.height == 0) {
            	console.log("scrollbar.width " + scrollbar.width + " scrollbar.height " + scrollbar.height);

            }
            scrollbar.resizeScrollCanvas();
            scrollbar.drawScrollBar();
            scrollbar.redrawScrollBox();
		}

		function redrawScrollBarOnSpecialKeys(e , arrowKeyPressed) {
			scrollbar = this;
			hoveredScrollBarPosition = arrowKeyPressed; // make it as the scroll bar position
			scrollbar.viewArea = scrollbar.maxViewValue - scrollbar.minViewValue;
			var movementOnEachClick = scrollbar.viewArea;// 1 view area to be moved

			if(movementOnEachClick != null)  {
				  if( hoveredScrollBarPosition == "PAGE_DOWN"   ) { // decrement
					if(verticalIncrement == 'up' ) {
						scrollbar.minViewValue = scrollbar.minViewValue - movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue - movementOnEachClick;
					} else {
						scrollbar.minViewValue = scrollbar.minViewValue + movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue + movementOnEachClick;
					}
				} else if( hoveredScrollBarPosition == "PAGE_UP" ) { // increment
					if(verticalIncrement == 'up') {
						scrollbar.minViewValue = scrollbar.minViewValue + movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue + movementOnEachClick;
					}  else { //'down'
						scrollbar.minViewValue = scrollbar.minViewValue - movementOnEachClick;
						scrollbar.maxViewValue = scrollbar.maxViewValue - movementOnEachClick;
					}
				}  else if(hoveredScrollBarPosition == "HOME"   ) { // decrement
					var homeKeyAction = options.scroll.homeKeyAction;
					if(homeKeyAction == null) { // default action
						if (horizontalIncrement == 'rtl') {
							scrollbar.minViewValue = scrollbar.minViewValue + movementOnEachClick;
							scrollbar.maxViewValue = scrollbar.maxViewValue + movementOnEachClick;
						}
						else {
							scrollbar.minViewValue = scrollbar.minViewValue - movementOnEachClick;
							scrollbar.maxViewValue = scrollbar.maxViewValue - movementOnEachClick;
						}
					} else {
						 // function trigger CallBack Action
					   var dataToFunction = {
								currentViewMin : scrollbar.minViewValue,
								currentViewMax : scrollbar.maxViewValue
					   };
				       var args = new Array();
					   args.push(dataToFunction);
					   eval(homeKeyAction).apply(this, args);

					}

				} else if( hoveredScrollBarPosition == "END" ) { // increment
					var endKeyAction = options.scroll.endKeyAction;
					if(endKeyAction == null) { // default action
						if (horizontalIncrement == 'rtl') {
							scrollbar.minViewValue = scrollbar.minViewValue - movementOnEachClick;
							scrollbar.maxViewValue = scrollbar.maxViewValue - movementOnEachClick;
						} else {
							scrollbar.minViewValue = scrollbar.minViewValue + movementOnEachClick;
							scrollbar.maxViewValue = scrollbar.maxViewValue + movementOnEachClick;
						}
					} else {
						var dataToFunction = {
								currentViewMin : scrollbar.minViewValue,
								currentViewMax : scrollbar.maxViewValue
						};

				       var args = new Array();
					   args.push(dataToFunction);
					   eval(endKeyAction).apply(this, args);
					}
				}
				capScrollLimits(); // capScrollLimits if the limit exceeds
				scrollbar.fetchDataAndRedraw(e);
			}
		}

		function onScrollOnMouseWheel(e , arrowKeyPressed, mouseWheelTick) {
			scrollbar = this;
			hoveredScrollBarPosition = arrowKeyPressed; // make it as the scroll bar position equivalent to mouse scroll
			if(hoveredScrollBarPosition != null && hoveredScrollBarPosition != SCROLL_BOX) {
				if(options.scroll.optimiseScrollOnArrowClick) { //tiled Scrolling with fixed header image for the static
					if(actualDrawTimerForTiling != undefined) {
						clearInterval(actualDrawTimerForTiling);
					}
					scrollbar.redrawScrollBarOnScrollClick(e, mouseWheelTick);
					setScrolling(true); //ensures that tile reloading doesn't happen on mouse click
					actualDrawTimerForTiling = setTimeout(onScrollMouseWheelActionOnOptimiseScrollOnArrowClick.bind(this, e), 500);	// enable scrolling
				} else  {
					if(interval != undefined) {
						  clearInterval(interval);
					}
					interval = setTimeout(onScrollMouseWheelAction.bind(this, e, mouseWheelTick), 0);

				}
			}
		}

		function onScrollMouseWheelActionOnOptimiseScrollOnArrowClick(e) {
			scrollbar.fetchDataAndRedraw(e);
			setScrolling(false);
		}


		function onScrollMouseWheelAction(e, mouseWheelTick) {
			scrollbar.redrawScrollBarOnScrollClick(e, mouseWheelTick);
			scrollbar.fetchDataAndRedraw(e);
		}

		function bindScrollEvents() {
			if(options.browserScroll.enable) {
				scrollEventHolder.on("scroll", onBrowserScroll);
			} else {
				scrollEventHolder.on("dragstart", onScrollStart);
				scrollEventHolder.on("drag", onScrollDrag);
				scrollEventHolder.on("dragend", onScrollEnd);
				scrollEventHolder.on("mousedown", onScrollArrowPressed);
				scrollEventHolder.on("mouseup", onScrollArrowReleasd);
				//touch events binding
				scrollEventHolder.on("touchstart", onScrollStart);
				scrollEventHolder.on( "touchmove", onScrollDrag);
				scrollEventHolder.on("touchend", onScrollEnd);
			}
			// 'Binding on  the div which holds the canvas  and the scrollbar div';
			scrollBarHolder.on( "resize", onScrollbarResize);
		}

		function shutdown() {
			scrollbar = this;
			scrollEventHolder = scrollbar.scrollEventHolder;
			scrollBarObjectMap[$(scrollBarHolder).attr('id')] = null;
			if(options.browserScroll.enable) {
				scrollEventHolder.off("scroll", onBrowserScroll);
			}
			scrollEventHolder.off("dragstart", onScrollStart);
			scrollEventHolder.off("drag", onScrollDrag);
			scrollEventHolder.off("dragend", onScrollEnd);
			scrollEventHolder.off("mousedown", onScrollArrowPressed);
			scrollEventHolder.off("mouseup", onScrollArrowReleasd);
			scrollEventHolder.off("touchstart", onScrollStart);
			scrollEventHolder.off( "touchmove", onScrollDrag);
			scrollEventHolder.off("touchend", onScrollEnd);

			//unbing the resize event
			scrollBarHolder.off("resize", onScrollbarResize);

			scrollbar.scrollBarHolder.empty();
			scrollbar = null;
			clearInterval(interval);
			clearInterval(scrollTimer);

		}
	};// function ScrollBar

	$.scrollBar = function(scrollBarHolder, options) {
		//added to scrollbar canvas parent to identify resize element
    	$(scrollBarHolder).attr("chronosresize", true);
		var scrollBar = new ScrollBar($(scrollBarHolder), options,
				$.scrollBar.plugins);
		if(scrollBarObjectMap == undefined) {
			scrollBarObjectMap = [];
    	}

		scrollBarObjectMap[$(scrollBarHolder).attr('id')] = scrollBar;
		return scrollBar;
	};
	$.scrollBar.version = "6.10.10";
	$.scrollBar.plugins = [];
	$.scrollBar.name ="chronos.scrollbar";
})(jQuery);
