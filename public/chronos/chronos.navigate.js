/*
 * Copyright 2013-2014 IBS Software Services (P) Ltd. All Rights Reserved.
 * This software is the proprietary information of IBS Software Services (P) Ltd.
 * Use is subject to license terms.
 *
 @author A-2094, Maintained by TCC.
 name : chronos-navigate
version: 6.10.10

plugin for adding panning, zooming, drag and drop, rectangle select capabilities to
chronos.core for plotting.

The default behaviour is double click and scrollwheel up/down to zoom
in, drag to pan.
The plugin defines plot.zoom({ center }), plot.zoomOut() and plot.pan(offset)
so you easily can add custom controls. It also fires a "plotpan" and "plotzoom" e when
something happens, useful for synchronizing plots.

Options:

  zoom: {
    interactive: false
    trigger: "dblclick" // or "click" for single click
    amount: 1.5         // 2 = 200% (zoom in), 0.5 = 50% (zoom out)
  }

  pan: {
    interactive: false
    cursor: "move"      // CSS mouse cursor value used when dragging, e.g. "pointer"
    frameRate: 20,
    snapRow: false
  }

  xaxis, yaxis, x2axis, y2axis: {
    zoomRange: null  // or [number, number] (min range, max range) or false
    scrollRange: null   // or [number, number] (min, max) or false
  }

"interactive" enables the built-in drag/click behaviour. If you enable
interactive for pan, then you'll have a basic plot that supports
moving around; the same for zoom.

"amount" specifies the default amount to zoom in (so 1.5 = 150%)
relative to the current viewport.

"cursor" is a standard CSS mouse cursor string used for visual
feedback to the user when dragging.

"frameRate" specifies the maximum number of times per second the plot
will update itself while the user is panning around on it (set to null
to disable intermediate pans, the plot will then not update until the
mouse button is released).

"zoomRange" is the interval in which zooming can happen, e.g. with
zoomRange: [1, 100] the zoom will never scale the axis so that the
difference between min and max is smaller than 1 or larger than 100.
You can set either end to null to ignore, e.g. [1, null]. If you set
zoomRange to false, zooming on that axis will be disabled.

"scrollRange" confines the panning and scrolling to stay within a range, e.g. with
scrollRange: [-10, 20] panning/scrolling stops at -10 in one end and at 20 in the
other. Either can be null, e.g. [-10, null]. If you set
scrollRange to false, panning/scrolling on that axis will be disabled.

Example API usage:

  plot = $.chronos(...);

  // zoom default amount in on the pixel (10, 20)
  plot.zoom({ center: { left: 10, top: 20 } });

  // zoom out again
  plot.zoomOut({ center: { left: 10, top: 20 } });

  // zoom 200% in on the pixel (10, 20)
  plot.zoom({ amount: 2, center: { left: 10, top: 20 } });

  // pan 100 pixels to the left and 20 down
  plot.pan({ left: -100, top: 20 })

Here, "center" specifies where the center of the zooming should
happen. Note that this is defined in pixel space, not the space of the
data points (you can use the p2c helpers on the axes in Plot to help
you convert between these).

"amount" is the amount to zoom the viewport relative to the current
range, so 1 is 100% (i.e. no change), 1.5 is 150% (zoom in), 0.7 is
70% (zoom out). You can set the default in the options.

*/
// dependencies: jquery.mousewheel.js for zoom on mouse wheel e

(function ($) {
  var options = {
      xaxis: {
          zoomRange: [360000,  30*24*3600*1000], // or [number, number] (min range, max range)
          scrollRange:null// or [number, number] (min, max)
      },
      zoom: {
          interactive: false,
          trigger: 'ctrl+mousewheel', // or "click"  or "dblclick" for single click
          amount: 1.5, // how much to zoom relative to current position, 2 = 200% (zoom in), 0.5 = 50% (zoom out)
          zoomPoint: 'center' // zoom with respect to the center or not defined is the default
      },
      scroll : {
        trigger:'mousewheel',
        snapRow :  false
      },
      pan: {
          interactive: true,
          cursor: "move",
          frameRate: 70,
          snapRow :  false
      },
      rectangleSelect : {
        interactive: false,
        passingThroughTask : false, // if true, will select tasks passing through that rectangle area as well. start and end not in rectangle
      rectangleSelectStyle: {
            lineWidth: 1,
            lineColor: "#ff0000",
            //strokeColor:"#ff0000"
            fillColor :"rgba(255, 255, 255, 0.4)"

         }
      },
      taskDrag: {
         interactive: false,
         cursor: "move",
         effectAllowed: 'move', //copy, move
         autoScrollTimer:1000,  // The time in milliseconds to redraw the plot after 1 sec when dragging reaches boundary
         autoScrollPixel:20, // the pixel from the boundary border left, right, top, bottom from which the dragMoves to the next View area
         draggingEffect : {
              enable 	:	true,
              direction	: 'both',		//Can have values horizontal/vertical/both- restricts the dragging movement
              lineWidth	: 1,
              lineColor	: "#000000",
              fillColor 	: "#FFFFFF",
              showTimeLine: true,
              showTime:true,
              showTracker: {
                  enable 		: false,
                  lineWidth	: 1,
                  lineColor	: "#000000",
                  fillColor 	: "rgba(255, 0, 0, 0.4)"
              },
              dragoverTimeDelay:10 //in milliseconds
         },
         globalTransferObjectProvider: 'provideGlobalTransferObject' // the call back function which  returns the globalObject
                         //to keep the transfer object in case of
                         //dragging shadow over multiple pane, as chrome doesn't support.
      },
      taskResize: {
        interactive: false,
        cursor	: "e-resize",
        radius	: 3,
        mode	: "NORMAL", //TASK_RESIZE OR NORMAL . if NORMAL the resizingEffect will be ignored,
                   //all drawings will be according to normal gantt style
        resizingEffect : {
               enable 	:	true,
               lineWidth	: 1,
               lineColor	: "#000000",
               fillColor 	: "#FFFFFF"
          },
          fireOnEdgeOnly :true,
          resizeItemAttributeProvider : null, // when fireOnEdge is false
          showTime : { // to show time in cursor point when resizing
            enable : false,
            timeFormat :"%b %d %h:%M %S",
            font : { color:"#000000" , size: 11, style: "normal", weight: 'bold', family: 'arial', variant: "normal" }
          }
      },
      headerDrag: { //specific to rowheader dragging and moving
          interactive: false,
          cursor: "move", //show that the pointer turns to move arrow.
          effectAllowed: 'move', //move - indicates that it is moved to another header location
          shadowEffect : true //to dispaly shadow on dragging
      },
      rowHeaderHover:  { // specific to row headers
        autoHighlight : false
      },
      columnHeaderDrag : { // column header or time header
           interactive: false,
             selectionStyle: {
                 lineWidth: 1,
                 lineColor: "#00ff00",
                 fillColor :"rgba(255, 0, 0, 0.2)",
                 type : "FULL" // OR HEADER_ONLY
            }
      },
      columnHeaderClick : { // column header or time header
        interactive: false, // just trigger the callback on click
        selectionAllowed :  false, // true will select major ticks and highlight it for multiline time header, minor ticks for single line time header
        renderer : null,
         selectionStyle: {
                 lineWidth: 1,
                 lineColor: "rgba(255, 0, 0, 0.2)",
                 fillColor :"rgba(255, 0, 0, 0.2)",
                 type : "HEADER_ONLY"  // OR FULL (selection drawn full the plot height)
         }
      },
      columnHeaderHover : {
        interactive: false // will trigger the hover callback on hover if true
      },
      yaxis: {
         zoomRange: false, //make this default
         scrollRange:null,// or [number, number] (min, max)//
         verticalScrollExtendunit:0.5, // [number] the extend on both boundaries to be displayed on chart,  with respect to teh scrollRange
         newScrollRange:{scrollMin:0, scrollMax:0 }  //To display the gantt boundaries for yaxix, the scrollRange will be increased and decresed by one unit
      },
      taskCreate: { //This is mainly for taskCreation using drag and drawing a rectangle
        interactive: false,
          taskCreateStyle: {
            lineWidth: 2,
            lineColor: "#00ff00",
            fillColor :"white"
         }
      },
      taskBlinking : {
           blinkingTimeGap:1000  //in milliseconds think later for global timer Object
      },
      mouseTracker : {
          enable 		: false,
          direction	: 'horizontal', //both, horizontal, vertical or both
       lineWidth	: 1,
       lineColor	: "#000000",
       dashedLine	: false,
       moveOnRowHeader: false // from 6.10.2 mouse tracker will be moving while mouse moves on row header also in case of horizontal
      },
      taskTracker : {
        enable : false,
        direction : 'horizontal', //both, horizontal, vertical or both
        lineWidth	: 1,
     lineColor	: "#000000",
     dashedLine	: false
      },
      keyboardFocus : {
        enable : true,
        focusStyle: {  //default style
            lineWidth: 1,
            lineColor: "#ff0000",
            fillColor :"rgba(255, 0, 0, 0.2)"
         },
         autoScrollPixel:50 // the pixel from the boundary border left, right , top, bottom moved along with focusItem

      }
  };

  function init(plot) {


    //################################### SCROLLING #################################################
    var axes, opts , scrollDirection, keyPressedTime = 0;

      //Declaration of constants used in this plugin
      var TASK_RESIZE_MODE = "TASK_RESIZE_MODE";
      plot.COLUMN_HEADER_DRAG = "COLUMN_HEADER_DRAG";
    var lastTimestamp;

      plot.getKeyPressedTime = function() {
        return keyPressedTime;
      };

      plot.setKeyPressedTime = function(time) {
        keyPressedTime  = time;
      };

      plot.checkDataFetchAndScroll = function (args) {
        var options = plot.getOptions();
        var keyDownFetchInterval = args.keyDownFetchInterval;
        if(options.interaction.dataOnDemand) {
      var currentTime = new Date().getTime();
      keyPressedTime = plot.getKeyPressedTime();
      if(currentTime - keyPressedTime < keyDownFetchInterval) {
        return;
      }
      plot.setKeyPressedTime(currentTime);
      plot.scroll({ // Fetching of data
        minViewValue : args.minViewValue,
        maxViewValue : args.maxViewValue,
        scrollDirection: args.scrollDirection,
        originalEvent : args.originalEvent
      });
    }
      };

      /**
       * fetching data here . DataFetch for charts. arrow Key accepted as argument
       * Once fetching, the wrap row calculation is triggered.
       */
      plot.scroll = function (args) {
         var min = args.minViewValue;
         var max = args.maxViewValue;
         scrollDirection = args.scrollDirection;
         axes = plot.getAxes();
       if(scrollDirection == 'horizontal') {
              opts = axes.xaxis.options;
                plot.setScrollDirection(scrollDirection, opts.min < min);
               opts.min = min;
              opts.max = max;
              //Also set in series , from which the calculation of wrap takes min and max
                  plot.getSeries().xaxis.min = min;
                  plot.getSeries().xaxis.max = max;

             plot.currentVisibleData.fromDate = plot.resetViewPortTime(min);//xaxix  min
          plot.currentVisibleData.toDate = plot.resetViewPortTime(max);  //xaxix max
          if(opts.max > plot.currentVisibleData.toDate) {
            plot.currentVisibleData.toDate = plot.currentVisibleData.toDate + 24*60*60*1000;
             }

          plot.currentVisibleData.yValueMin = Math.floor(axes.yaxis.options.min);
        plot.currentVisibleData.yValueMax = Math.ceil(axes.yaxis.options.max);
        if (options.multiScreenFeature && options.multiScreenFeature.enabled  && plot.getPlaceholder().height() > 0) {
          plot.updateDateRangeInLocalStore (min, max);
         }
        } else if(scrollDirection == 'vertical') {
              opts = axes.yaxis.options;
              plot.setScrollDirection(scrollDirection, opts.min < min);
                //ISRM-7190
                //Modified for ISRM-8273
              var scrollMax = opts.scrollRange[1];
                   if(options.scroll.snapRow && (max < scrollMax)) {
                       var min = Math.floor(min);
                       var max = Math.ceil(max);
                        if(opts.verticalScrollExtendunit > 0) {
                           min = min + opts.verticalScrollExtendunit;
                           max = max - opts.verticalScrollExtendunit;
                         }
                   }
                  opts.min = min;
              opts.max = max;
              //Also set in series , from which the calculation of wrap takes min and max
                 plot.getSeries().yaxis.min = min;
                 plot.getSeries().yaxis.max = max;

             plot.currentVisibleData.fromDate = plot.resetViewPortTime(axes.xaxis.options.min);
          plot.currentVisibleData.toDate = plot.resetViewPortTime(axes.xaxis.options.max);
          if(axes.xaxis.options.max > plot.currentVisibleData.toDate) {
            plot.currentVisibleData.toDate = plot.currentVisibleData.toDate + 24*60*60*1000;
             }
          plot.currentVisibleData.yValueMin = Math.floor(min); //y min
        plot.currentVisibleData.yValueMax = Math.ceil(max); // y max
        if (options.multiScreenFeature && options.multiScreenFeature.enabled && plot.getPlaceholder().height() > 0) {
          plot.updateRowRangeInLocalStore (min, max);
         }
            }

           plot.callFetchDataIfRequired();

           //if draw triggered from scroll bar
            plot.setupGrid();
            plot.draw(true);   //actual drawing needed so passed true
        //console.log("after draw " + new Date().getTime());
            //Added a call back indicating teh updation of  view Range
         var viewRangeChangedCallback = plot.getSeries().gantt.viewRangeChangedCallback;
         if(viewRangeChangedCallback) {
           var args = [];
           var data = {};
           data.currentVisibleData = plot.currentVisibleData;
           data.triggeredFrom = "scroll";
          args.push(data);
           eval(viewRangeChangedCallback).apply(this, args);
         }

        //console.log("after draw " + new Date().getTime());
            var customEvent = jQuery.Event("plotscroll");
          customEvent.originalEvent = args.originalEvent;
            if (!args.preventEvent) {

                 plot.getPlaceholder().trigger(customEvent, [ plot]);
            }
       };
       /**
        * No fetching of data here
        * args are
        *		minViewValue : current view min of x or y according to scoll drection,
          maxViewValue : current view max of x or y according to scoll drection,
          scrollDirection: scrollDirection / horizontal/vertical
          optimiseScrollOnArrowClick : // the boolean which ensures that arrow click is using tiling to improve performance
          forceScrolling :true // This will not set interimScrollMode to true even if previous view is same as current view. forces scrolling and draw
        */
       plot.scrolling = function (args) {
         plot.setInterimScrollMode(true);

          var min = args.minViewValue;
          var max = args.maxViewValue;
          var oldScrollDirection = plot.getScrollDirection();

          if( (args.optimiseScrollOnArrowClick == true) &&
              (!oldScrollDirection || (oldScrollDirection != args.scrollDirection))) {
            plot.createHeaderImage();
          }
          scrollDirection = args.scrollDirection;
          axes = plot.getAxes();
          if(scrollDirection == 'horizontal') {
             opts = axes.xaxis.options;
               plot.setScrollDirection(scrollDirection, opts.min < min);

                opts.min = min;
                opts.max = max;
                //Also set in series , from which the calculation of wrap takes min and max
                plot.getSeries().xaxis.min = min;
                plot.getSeries().xaxis.max = max;

                if (plot.areWrapRowsEnabled() && (plot.resetViewPortTime(opts.min) != plot.viewBucket.min || plot.resetViewPortTime(opts.max) != plot.viewBucket.max)) {
        plot.updateWrapIndexDisplayMap();
                }

                plot.currentVisibleData.fromDate = plot.resetViewPortTime(min);//xaxix  min
         plot.currentVisibleData.toDate = plot.resetViewPortTime(max);  //xaxix max
         plot.currentVisibleData.yValueMin = Math.floor(axes.yaxis.options.min);
       plot.currentVisibleData.yValueMax = Math.ceil(axes.yaxis.options.max);
       if (options.multiScreenFeature && options.multiScreenFeature.enabled && plot.getPlaceholder().height() > 0) {
          plot.updateDateRangeInLocalStore (min, max);
       }
          } else  if(scrollDirection == 'vertical') { //vertical
             opts = axes.yaxis.options;
               plot.setScrollDirection(scrollDirection, opts.min < min);
                opts.min = min;
               opts.max = max;
               //Also set in series , from which the calculation of wrap takes min and max
                plot.getSeries().yaxis.min = min;
                plot.getSeries().yaxis.max = max;

               plot.currentVisibleData.fromDate = plot.resetViewPortTime(axes.xaxis.options.min);
         plot.currentVisibleData.toDate = plot.resetViewPortTime(axes.xaxis.options.max);
         plot.currentVisibleData.yValueMin = Math.floor(min); //y min
       plot.currentVisibleData.yValueMax = Math.ceil(max); // y max
       if (options.multiScreenFeature && options.multiScreenFeature.enabled && plot.getPlaceholder().height() > 0) {
          plot.updateRowRangeInLocalStore (min, max);
       }
          }
          var currentInMillisStart = new Date().getTime();
    //if draw triggered from scroll bar
          plot.setupGrid();
          plot.draw();
          var currentInMillisEnd = new Date().getTime();
          var FPS = 1000/(currentInMillisEnd - currentInMillisStart);

         plot.setInterimScrollMode(false);

         var customEvent = jQuery.Event("plotscrolling");
        customEvent.originalEvent = args.originalEvent;
         if (!args.preventEvent) {
              plot.getPlaceholder().trigger(customEvent, [ plot]);
         }
      };

      //################################### DRAG & DROP & PANNING #################################################

    var internalDNDType = 'text';
    var hoverItem=null,  hoveredArea=null, options=0, hoveredEntityObject;
    var hoveredHeaderGridColumn = null;

    /**Note :
      We have the following lists of touch events:
        touches: A list of information for every finger currently touching the screen
        targetTouches: Like touches, but is filtered to only the information for finger touches that started out within the same node
        changedTouches: A list of information for every finger involved in the event.
        They vary in the following pattern:
        When I put a finger down, all three lists will have the same information. It will be in changedTouches because putting the finger down is
        what caused the event.
        When I put a second finger down, touches will have two items, one for each finger. targetTouches will have two items only if the finger
        was placed in the same node as the first finger. changedTouches will have the information related to the second finger, because it�s what caused the event
        If I put two fingers down at exactly the same time, it�s possible to have two items in changedTouches, one for each finger
        If I move my fingers, the only list that will change is changedTouches and will contain information related to as many fingers as have moved
        (at least one).
        When I lift a finger, it will be removed from touches, targetTouches and will appear in changedTouches since it�s what caused the event
        Removing my last finger will leave touches and targetTouches empty, and changedTouches will contain information for the last finger.
    */
    plot.getPageX = function getPageX(e) {
      var pageX = 0 ;

    if( e.touches && e.touches.length != 0) {
      pageX = e.touches[0].pageX;
    } else if( e.changedTouches && e.changedTouches.length != 0) {
        pageX = e.changedTouches[0].pageX;
      } else {
      pageX = e.pageX;
    }
    return pageX;
    };

    plot.getPageY = function getPageY(e) {
      var pageY = 0 ;
    if( e.touches && e.touches.length != 0) {
      pageY = e.touches[0].pageY;
    } else if( e.changedTouches && e.changedTouches.length != 0) {
        pageY = e.changedTouches[0].pageY;
      } else {
      pageY = e.pageY;
    }
    return pageY;
    };
    ///////////////////ACTIONS FOT COLUMN RESIZING ////////////////////
    plot.resizeGridColumnStart = function resizeHeaderStart(e) {
      plot.setIsDragging(true);
  };

  plot.resizingGridColumnHeader = function resizingHeader(e) {
    hoveredHeaderGridColumn = plot.getHoveredHeaderGridColumn();
    var offset = plot.offset();
    var currentMouseX = e.clientX - offset.left;
    var axisy = plot.getSeries().yaxis;

    var columnIndexCoordinateMap = plot.getColumnIndexCoordinateMap();
     if(axisy.options.multiColumnLabel.columns.length != 0 && hoveredHeaderGridColumn != undefined) {
       var currentResizingIndex = hoveredHeaderGridColumn.columnIndex;

       var lineHeight = axisy.options.multiColumnLabel.header.textFont.size;

       for(var i = currentResizingIndex ; i <axisy.options.multiColumnLabel.columns.length ; i++  ) {
         var headerColumns = axisy.options.multiColumnLabel.columns;
         var minWidth =5, newWidth;
         if( hoveredHeaderGridColumn.eachHeaderColumn.minWidth) {
           minWidth = hoveredHeaderGridColumn.eachHeaderColumn.minWidth;
         }
        if(i == currentResizingIndex) {
          newWidth = currentMouseX - columnIndexCoordinateMap[i].startX;
          if(newWidth <= minWidth) {
            newWidth = minWidth;
          }
          headerColumns[i].width = newWidth;
          hoveredHeaderGridColumn.eachHeaderColumn.width = newWidth;
          columnIndexCoordinateMap[i].width  = newWidth;
          // set the wrapped lines to display in the respective headerColumn
          var text = headerColumns[i].headerText;
          var ctx = plot.getCanvasContext();
          var wrappedLines = plot.wrapText(ctx, text, newWidth, lineHeight, headerColumns[i].height) ;
          headerColumns[i].wrappedLines = wrappedLines;

        } else {
          columnIndexCoordinateMap[i].startX = columnIndexCoordinateMap[i-1].startX + columnIndexCoordinateMap[i-1].width ;

        }

       }
        plot.setupGrid();
        plot.draw();
        return true;
        }
  };

  plot.resizingGridColumnHeaderEnd = function resizingHeader(e) {
    var axisy = plot.getSeries().yaxis;
    var  changedColumnHeaders = axisy.options.multiColumnLabel.columns;
      plot.getPlaceholder().trigger("columnHeaderResized", [ changedColumnHeaders]);

      return true;
  };
    ///////////////////ACTIONS FOT COLUMN RESIZING END ////////////////////

  plot.updateColumnHeaderObject = function(startTime, endTime) {

    var columnHeaderSelection = plot.getColumnHeaderSelectionObject();
    if(columnHeaderSelection == null) {
      columnHeaderSelection = {};
    }
    if(startTime != null) {
      columnHeaderSelection.startTime = startTime;
    }
    if(endTime != null) {
      columnHeaderSelection.endTime = endTime;
    }
    plot.setColumnHeaderSelectionObject(columnHeaderSelection);
  };

  plot.dragStartHandler = function dragStartHandler(e) {
    plot.setDisableClickOnDrag(true);//This will be disabled on drag and for 100 milliseconds after dragEnd.

    var commonTransferObject = {};
    //Invoking column resizing event for column headers in GRID VIEW
    hoveredHeaderGridColumn = plot.getHoveredHeaderGridColumn();
        if(hoveredHeaderGridColumn != null && hoveredHeaderGridColumn.isOnBorder == true) {
         plot.resizeGridColumnStart(e);
      }
    var offset = plot.offset(),
      plotOffset = plot.getPlotOffset(),
      canvasX = plot.getPageX(e) - offset.left - plotOffset.left,
      canvasY = plot.getPageY(e) - offset.top - plotOffset.top,
      eventMode =  plot.getEventMode();
    if(e.touches && e.touches.length == 2) {
        eventMode = "PINCH_ZOOM_MODE";
        commonTransferObject.eventMode = "PINCH_ZOOM_MODE";
        if(e.dataTransfer) { //SUPPORT  FOR JQUERY_DRAG
          e.dataTransfer.effectAllowed = options.taskDrag.effectAllowed;
          e.dataTransfer.dropEffect=options.taskDrag.effectAllowed;
          e.dataTransfer.setData(internalDNDType, JSON.stringify(commonTransferObject));
        }
        //set the data transfer object to global object provided by the framework , if appln doesn't provide this
        setToGlobalObject(commonTransferObject);
        plot.setEventMode(commonTransferObject.eventMode);
        pinchStart(e);
        return true;
    }
    plot.setIsDragging(true);
    options = plot.getOptions();
    if(options.series.gantt.show) {  //Note : Only for gantt
      ///fox for ISRM-4056
      var hoveredTaskObject = plot.getPreviousClickedItem();
      // Use the previous item clicked on the latest mouse press
      //if not found, check for the current item if any
      if(hoveredTaskObject ==  null ) {
        hoveredTaskObject = plot.findItemOnGantt(canvasX, canvasY);
      }

      if(hoveredTaskObject != null) {
        hoverItem = hoveredTaskObject.details;
      } else {
        hoverItem = null;
      }
      hoveredArea = plot.findHoveredArea(e);
      var resizeItem = plot.getResizeItem();
      hoveredTaskObject = plot.findItemOnGantt(canvasX, canvasY);
      if (resizeItem != null && hoveredArea.label != "ROW_HEADER_ITEM") {
        eventMode = TASK_RESIZE_MODE;
          } else	if(resizeItem == null && hoverItem != null) {
          //CASE : //mouse moves inside that hoverItem after changing to resize cursor
          eventMode = "NONE";
          }
             if (resizeItem == null && hoverItem == null ) {
                eventMode = "NONE";
          }
          if(hoveredTaskObject != null) {
        hoverItem = hoveredTaskObject.details;
      } else {
        hoverItem = null;
      }
      //hoveredArea = plot.findHoveredArea(e);
      // console.log("  plot.dragStartHandler : eventMode " ,  eventMode , " hoveredArea : ", hoveredArea)
    if(eventMode == TASK_RESIZE_MODE && options.taskResize.interactive && resizeItem != null && resizeItem.resizable != false) {
         plot.getPlaceholder().css('cursor', options.taskResize.cursor);
       commonTransferObject.originalObject = resizeItem; // is same as hover item	or hoverpadded item
       commonTransferObject.eventMode = TASK_RESIZE_MODE;
       eventMode = TASK_RESIZE_MODE;
     } else	if (eventMode == "NONE" && hoverItem != null ) {
        if(options.taskDrag.interactive) {
            commonTransferObject.dragType = "TASK_ITEM";
            hoveredEntityObject = onObjectDragStart(e, commonTransferObject.dragType);
            commonTransferObject.dragItemSize = hoveredEntityObject.dragItemSize;
            commonTransferObject.eventMode = "TASK_ITEM_DRAG";
            var draggedTasks  = updatePositionDifference(e, hoveredEntityObject.hoveredObject, commonTransferObject.dragItemSize);
            commonTransferObject.draggedObject = draggedTasks; // is same as hover item
            //if the item is highlighted and dragged . remove highlight
            if(plot.isHighlightedEntity(hoverItem) && hoveredEntityObject.dragItemSize == "SINGLE"){
              plot.unhighlightTask(hoverItem);
            }
        } else if (hoverItem.draggable == false) { // Enable task create inside a non draggable task object
           if(options.taskCreate.interactive) {
            // TRIGGER An EVENT TO USER	for any other dragStart Event actions other than rectangle Selector Pan
            plot.rectangleStartPosition = onRectangeSelectStart(e, "TASK_CREATE_MODE");
            commonTransferObject.eventMode = "TASK_CREATE_MODE";
          }
         }
    } else if (eventMode == "NONE" && hoveredArea!=null && hoveredArea.label == "ROW_HEADER_ITEM") {
      //console.log("  plot.dragStartHandler : eventMode " ,  eventMode , " hoveredArea : ", hoveredArea)
      if(options.headerDrag.interactive) {
        var allowDrag = plot.getPlaceholder().trigger("allowHeaderDrag", [ hoveredArea]).data("allowDrag");
          if(allowDrag || allowDrag == undefined) {
          commonTransferObject.dragType = "ROW_HEADER";
          hoveredEntityObject = onObjectDragStart(e, commonTransferObject.dragType );
          commonTransferObject.draggedObject = hoveredEntityObject.hoveredObject;
          //draggedObject.position
          commonTransferObject.dragItemSize = hoveredEntityObject.dragItemSize;
          commonTransferObject.eventMode = "ROW_HEADER_DRAG";
          commonTransferObject.sourceHeaderDragOptions = options.headerDrag;
          }
      }
    } else if (hoverItem == null  && hoveredArea != null && hoveredArea.label == "PLOT_BODY" && eventMode == 'NONE') {
      if(options.pan.interactive) {
        if(canvasX <0 || canvasY<0) {
          return ;
        }
        plot.getPlaceholder().css('cursor',  'move');
        onPanStart(e);
        commonTransferObject.draggedObject = "";
        commonTransferObject.eventMode = "PAN_MODE";
      } else if(options.rectangleSelect.interactive) {
        if(canvasX <0 || canvasY<0) {
          return ;
        }
        var ctrlPressed = e.ctrlKey;
            if(!ctrlPressed) {
               plot.clearAllhighlights();
            }
        plot.rectangleStartPosition = onRectangeSelectStart(e, "RECTANGLE_SELECT_MODE");
        commonTransferObject.eventMode = "RECTANGLE_SELECT_MODE";
      } else if(options.taskCreate.interactive) {
        if(canvasX <0 || canvasY<0) {
          return ;
        }
        // TRIGGER An EVENT TO USER	for any other dragStart Event actions other than rectangle Selector Pan
        plot.rectangleStartPosition = onRectangeSelectStart(e, "TASK_CREATE_MODE");
        commonTransferObject.eventMode = "TASK_CREATE_MODE";
      }
      commonTransferObject.dragType = "";
    }  else if (options.columnHeaderDrag.interactive && hoveredArea != null && hoveredArea.label == "COLUMN_HEADER_AREA") {
      commonTransferObject.eventMode = plot.COLUMN_HEADER_DRAG;
      plot.updateColumnHeaderObject(hoveredArea.currentTime, null); // update start time
      commonTransferObject.columnHeaderSelectionObject = plot.getColumnHeaderSelectionObject();
      var data = {
            currentTime : hoveredArea.currentTime //in millis
          };
          var event = jQuery.Event( "columnHeaderSelectionStart");
          event.originalEvent = e;
          event.OriginalType = e.type;
          plot.getPlaceholder().trigger(event, [ data ]);
    }//else

    }

    if(e.dataTransfer) { //SUPPORT  FOR JQUERY_DRAG
      e.dataTransfer.effectAllowed = options.taskDrag.effectAllowed;
      e.dataTransfer.dropEffect=options.taskDrag.effectAllowed;
      e.dataTransfer.setData(internalDNDType,JSON.stringify(commonTransferObject));
    }
    //set the data transfer object to global object provided by the framework , if appln doesn't provide this
    setToGlobalObject(commonTransferObject);
    plot.setEventMode(commonTransferObject.eventMode);
  };

  plot.dragEnterHandler = function dragEnterHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  //GLOBAL declarations
  var initialTime = new Date().getTime();
  var isFireFoxHTML5Event = false;
  var dragTimeout = null;

  plot.triggerActionsForDragging = function(e) {
    var commonTransferObject  = getCommonTransferObject(e);
    if(commonTransferObject.eventMode == "NONE") {
      return true;
    }
    //Invoking column resizing event for column headers in GRID VIEW
    hoveredHeaderGridColumn = plot.getHoveredHeaderGridColumn();
    if(hoveredHeaderGridColumn != null && hoveredHeaderGridColumn.isOnBorder == true) {
      plot.resizingGridColumnHeader(e); // will return from here
    }
    //Note : Issue : DATATRANSFER  here also in CHROME : . FIrefox the clientX, screenX doesn't change on dragging. So trigger all actions on dragOver
    //The following are applicable only if there is a taskDrag
    var options = plot.getOptions();
    /*TODO later if needed
    var dragIcon = document.createElement('img');
    dragIcon.src = 'images/drag.png';
    dragIcon.width = 100;
    e.dataTransfer.setDragImage(dragIcon, -10, -10);
    */
    if(commonTransferObject.eventMode == "PINCH_ZOOM_MODE") {
      pinchMove(e);
            return false;
    }

    if(!options.taskDrag.interactive){
      return false;
    }
    var offset = plot.offset() , series = plot.getSeries();
    var plotOffset = plot.getPlotOffset();
    var plotWidth = plot.getPlaceholder().width() - plotOffset.left - plotOffset.right;
        var  plotHeight = plot.getPlaceholder().height() - plotOffset.bottom - plotOffset.top;

    var currentMouseX =  plot.getPageX(e); // this is not - offset.left - plotOffset.left;
    var currentMouseY =  plot.getPageY(e); // this is not - offset.top - plotOffset.top;

    var xaxis = series.xaxis, yaxis = series.yaxis;
    var topBorder = offset.top + plotOffset.top;
    var bottomBorder = offset.top + plotOffset.top + plotHeight;
    var leftBorder = offset.left + plotOffset.left ;
    var rightBorder = offset.left + plotOffset.left + plotWidth;
    var currentTime,  minViewValue, maxViewValue, movementOnEachClick;

    var autoScrollTimer = options.taskDrag.autoScrollTimer, // default 1 sec
      autoScrollPixel = options.taskDrag.autoScrollPixel; //default 20
    if(autoScrollTimer == 0) {
      return false;
    }
    if(dragTimeout != null) {
      clearInterval(dragTimeout);
    }

    //CHECK POSTION IF THE CURSOR CAME NEAR THE WALL -LEFT SIDE
    if (currentMouseX  >= leftBorder && currentMouseX  <= (leftBorder + autoScrollPixel) ) { //LEFT SIDE
      function scrollLeft() {
        movementOnEachClick = plot.horizontalScrollBar.getMovementOnEachClick();
        minViewValue = Math.floor(xaxis.min) - movementOnEachClick;
        maxViewValue = Math.ceil(xaxis.max) - movementOnEachClick;
        plot.capXValuesAndFetchData(minViewValue, maxViewValue );
      };
      function triggerMoveLeft() {
        if (currentMouseX  >= leftBorder && currentMouseX  <= (leftBorder + autoScrollPixel)) {
          currentTime = new Date().getTime();
          if(currentTime - initialTime >=  autoScrollTimer) { //1 sec after
            scrollLeft();
            initialTime = currentTime;
            currentTime = null;
            }
        } else if(dragTimeout != null) {
            clearInterval(dragTimeout);
        }
      };

       if(options.interaction.eventType == "JQUERY_DRAG") {
         if(dragTimeout == null) {
           triggerMoveLeft();
        }
          dragTimeout = setInterval(function() {
            triggerMoveLeft();
              }, autoScrollTimer);

      } else if(options.interaction.eventType == "HTML5") {
        triggerMoveLeft();
          }


    } else if (currentMouseX  <= rightBorder && currentMouseX  >= (rightBorder - autoScrollPixel) ) { // RIGHT SIDE
      //local functions
      function scrollRight() {
        movementOnEachClick = plot.horizontalScrollBar.getMovementOnEachClick();
        minViewValue = Math.floor(xaxis.min) + movementOnEachClick;
        maxViewValue = Math.ceil(xaxis.max) + movementOnEachClick;
        plot.capXValuesAndFetchData(minViewValue, maxViewValue);

      };
      function triggerMoveRight() {
        if (currentMouseX  <= rightBorder && currentMouseX  >= (rightBorder - autoScrollPixel)) {
          currentTime = new Date().getTime();
          if(currentTime - initialTime >=  autoScrollTimer) { //1 sec after
            scrollRight();
            initialTime = currentTime;
            currentTime = null;
            }
        } else if(dragTimeout != null) {
            clearInterval(dragTimeout);
        }
      };

      if(options.interaction.eventType == "JQUERY_DRAG") {
         if(dragTimeout == null) {
           triggerMoveRight();
           }
          dragTimeout = setInterval(function() {
            triggerMoveRight();
              }, autoScrollTimer);

      } else if(options.interaction.eventType == "HTML5") {
         triggerMoveRight();
          }

    } else if (currentMouseY  >= topBorder && currentMouseY  <= (topBorder + autoScrollPixel) ) { //TOP SIDE
        function scrollUp() {
           if(plot.verticalScrollBar) {
            movementOnEachClick = plot.verticalScrollBar.getMovementOnEachClick();
            minViewValue = Math.floor(yaxis.min) - movementOnEachClick;
            maxViewValue = Math.ceil(yaxis.max) - movementOnEachClick;
            plot.capYValuesAndFetchData(minViewValue, maxViewValue );
          }
        };

        function triggerMoveUp() {
          if (currentMouseY  >= topBorder && currentMouseY  <= (topBorder + autoScrollPixel)) {
            currentTime = new Date().getTime();
            if(currentTime - initialTime >=  autoScrollTimer) { //1 sec after
              scrollUp();
              initialTime = currentTime;
              currentTime = null;
              }
          } else if(dragTimeout != null) {
            clearInterval(dragTimeout);
          }
        };
         if(options.interaction.eventType == "JQUERY_DRAG") {
           if(dragTimeout == null) {
             triggerMoveUp();
             }
            dragTimeout = setInterval(function() {
              triggerMoveUp();
                }, autoScrollTimer);
        } else if(options.interaction.eventType == "HTML5") {
          triggerMoveUp();
            }
    } else	if( currentMouseY<= bottomBorder   && currentMouseY>=(bottomBorder - autoScrollPixel) ) { //BOTTOM SIDE
      function scrollDown() {
        if (plot.verticalScrollBar) {
          movementOnEachClick = plot.verticalScrollBar.getMovementOnEachClick();
          minViewValue = Math.floor(yaxis.min) + movementOnEachClick;
          maxViewValue = Math.ceil(yaxis.max) + movementOnEachClick;
          plot.capYValuesAndFetchData(minViewValue, maxViewValue,e);
        }
      };
      function triggerMoveDown() {
        if (currentMouseY<= bottomBorder   && currentMouseY>=(bottomBorder - autoScrollPixel)) {
          currentTime = new Date().getTime();
          if(currentTime - initialTime >=  autoScrollTimer) { //1 sec after
            scrollDown();
            initialTime = currentTime;
            currentTime = null;
            }
        } else if(dragTimeout != null) {
          clearInterval(dragTimeout);
        }
      };
       if(options.interaction.eventType == "JQUERY_DRAG") {
         if(dragTimeout == null) {
           triggerMoveDown();
         }
          dragTimeout = setInterval(function() {
            triggerMoveDown();
              }, autoScrollTimer);
      } else if(options.interaction.eventType == "HTML5") {
        triggerMoveDown();
          }
    }
    return false;
  };

  plot.draggingHandler = function draggingHandler(e) {
    //Note : Forefox issue with Dragging event for all cordinates . So all actions on dragging need to be called in dragOver as well.
    isFireFoxHTML5Event = false;
    var options = plot.getOptions();
    if(e.clientX == 0 && e.pageX == 0 && e.screenX == 0 && e.mozMovementX == 0 && options.interaction.eventType == "HTML5") {
      //no dragging coordinates information during drag for HTML5 drag event in
      isFireFoxHTML5Event = true;
      return;
    }	else {
      plot.triggerActionsForDragging(e);
    }
  };
  plot.dragOverHandler = function dragOverHandler(e) {
    if(isFireFoxHTML5Event) {//Forefox issue with Dragging event for all cordinates . So all actions on dragging need to be called in dragOver as well.
      plot.triggerActionsForDragging(e);
    }
    //Added for the case for jQUERY DRAG , to ensure that during draggign the events are fired on targetPlot that chronos maintained
    var targetCanvas = e.target , targetPlot = null;
    if(globalTransferObject) {
      targetPlot = globalTransferObject.plotCanvasMap[targetCanvas.id];
    }
    if(targetPlot != null) {
      plot = targetPlot;
    } else {
      return; // ISRM-4057
    }
    var shadowItem = null;

    options = plot.getOptions();
    //Note:  getCommonTransferObject is not accessible in this In Chrome. So internally created a tempObject from global
    var commonTransferObject  = getCommonTransferObject(e);
    if(commonTransferObject.eventMode == "PINCH_ZOOM_MODE") {
      pinchMove(e);
            return false;
    }
    if(commonTransferObject != null) {
      if (commonTransferObject.eventMode == 'TASK_ITEM_DRAG' && commonTransferObject.dragType == "TASK_ITEM") { //shadow Only for task-item
        if(lastTimestamp && (Date.now() - lastTimestamp) < options.taskDrag.draggingEffect.dragoverTimeDelay) {
          //console.log('---------SKIP RENDERING---------' ,e ,  new Date(lastTimestamp));
          e.preventDefault();
          return false;
        };
        lastTimestamp = Date.now();

        if(commonTransferObject.dragItemSize == "SINGLE" && options.taskDrag.draggingEffect.enable) {
           plot.clearHighlightOverlay();
           shadowItem = generateShadowItem(e, commonTransferObject);

         } else	if(commonTransferObject.dragItemSize  == "MULTIPLE" &&  options.taskDrag.draggingEffect.enable) {
           plot.clearHighlightOverlay();
           shadowItem = generateMultipleShadowItems(e, commonTransferObject);
        }
        if(shadowItem != null) {
           plot.setShadowItem(shadowItem);
           plot.drawHighLightOverlay();
           var event = jQuery.Event( "objectDragging" );
            event.originalEvent = e;
            event.OriginalType = e.type;
            plot.getPlaceholder().trigger(event, [ shadowItem ]);
         }

      } else if (commonTransferObject.eventMode == 'ROW_HEADER_DRAG' && commonTransferObject.dragType == "ROW_HEADER") {
        if(commonTransferObject.dragItemSize == "SINGLE") {
         if(options.headerDrag.shadowEffect) {
           plot.clearHighlightOverlay();
           var shadowHeaderItem = generateHeaderShadowItem(e, commonTransferObject);
          if(shadowHeaderItem != null) {
             plot.drawHighLightOverlay();
             plot.setShadowHeaderItem(shadowHeaderItem);
          }
         }
        }
      } else if (commonTransferObject.eventMode == 'PAN_MODE' && options.pan.interactive == true) {
        onPan(e);

      }  else	if(commonTransferObject.eventMode == "RECTANGLE_SELECT_MODE" && options.rectangleSelect.interactive) {
           plot.setShadowItem(null);
        onRectangleSelectDrag(e);//drawing rectangle

      } else if(commonTransferObject.eventMode == TASK_RESIZE_MODE && options.taskResize.interactive) {
        //Note plot.resizingItem will be null object initially
        var allowResize = plot.getPlaceholder().trigger("allowResizeEvent", [ plot.resizingItem]).data("allowResize");

          if(allowResize || allowResize == undefined) { //undefined for backward compatibility
          commonTransferObject.eventMode = TASK_RESIZE_MODE;
          plot.resizingItem = generateResizingItem(e, commonTransferObject);
          if(plot.resizingItem != null) {
             plot.expandingItem = plot.resizingItem;
             plot.drawHighLightOverlay();
             event = jQuery.Event( "taskResizing" );
              event.originalEvent = e;
              event.OriginalType = e.type;
              plot.getPlaceholder().trigger(event, [ plot.resizingItem]);
          }
          }

      } else	if(commonTransferObject.eventMode == "TASK_CREATE_MODE" && options.taskCreate.interactive) {
        // create taskCreationRectangle
        drawTaskCreationRectangle(e);//drawing rectangle
        if(plot.taskCreationRectangle != null) {
           plot.drawHighLightOverlay();
        }
      } else if (options.columnHeaderDrag.interactive && commonTransferObject.eventMode == plot.COLUMN_HEADER_DRAG) {
        var offset = plot.offset();
        var plotOffset = plot.getPlotOffset();
        var currentMouseX = plot.getPageX(e) - offset.left - plotOffset.left,
          series = plot.getSeries(),
          axisx = series.xaxis,
          currentTime = axisx.c2p(currentMouseX);

          plot.updateColumnHeaderObject(null, currentTime);
          var columnHeaderSelectionObject = plot.getColumnHeaderSelectionObject();
          plot.drawColumnSelectionArea(columnHeaderSelectionObject);  //will update the object and draw

          event = jQuery.Event( "columnHeaderSelecting");
          event.originalEvent = e;
          event.OriginalType = e.type;
          var data = {
              columnHeaderSelectionObject:  columnHeaderSelectionObject
          };
          plot.getPlaceholder().trigger(event, [ data ]);


      }
    }
    e.preventDefault();
    return false;
  };
  /**
   * Draws the particular columnHeader area which the user selects using mouse drag.
   * User can invoke this on any plot from columnHeaderSelecting event so as to draw the same area on other plots
   */
  plot.drawColumnSelectionArea = function(columnHeaderSelectionObject) {
          var startTime = columnHeaderSelectionObject.startTime,
          endTime = columnHeaderSelectionObject.endTime;
      this.updateColumnHeaderObject(startTime, endTime); //update endtime
      this.drawHighLightOverlay();
  };


  plot.dragEndHandler = function dragEndHandler(e) {
    //clear the drag timer on drgEnd in all cases.
    setTimeout(function() {
      plot.setDisableClickOnDrag(false); //FOR IE SPECIFIC CONDITION FOR DISALLOWING CLICK FOR IE9
    }, 100);

    if(dragTimeout != null) {
       clearInterval(dragTimeout);
    }
    e.preventDefault();

    //Invoking column resizing event for column headers in GRID VIEW
    if(hoveredHeaderGridColumn != null && hoveredHeaderGridColumn.isOnBorder == true) {
      plot.resizingGridColumnHeaderEnd(e);	 //will return from here
    }
    var commonTransferObject = getCommonTransferObject(e);
    if(commonTransferObject != null) {
      var draggedObject = commonTransferObject.draggedObject; //from Common transfer object
      var draggedEventMode = commonTransferObject.eventMode; //from Common transfer object
      if(draggedEventMode == "PINCH_ZOOM_MODE") {
        pinchEnd(e);
        draggedEventMode = "NONE";
              return false;
      } else if (draggedEventMode == 'PAN_MODE') {
        onPanEnd(e);
      } else if (draggedEventMode == TASK_RESIZE_MODE && plot.resizingItem != null) {
           var data = {
               resizedObject  : plot.resizingItem.resizedObject,
               originalObject : commonTransferObject.originalObject
           };
         plot.getPlaceholder().trigger("objectResize", [ data ]);
         if(plot.resizingItem != null) {
          plot.resizingItem = null;
          plot.expandingItem   = null; // to ensure that on resizing hoverItem is not drawn
          draggedEventMode = "NONE";
          plot.getPlaceholder().css('cursor', "default");
          plot.setEventMode(draggedEventMode);
          commonTransferObject.eventMode = draggedEventMode;
          plot.setIsDragging(false);
          //clear transfer objects in this drag action
          clearCommonTransferObject(commonTransferObject);
          return true; // return true because , the object dropped event should not be triggered after this.
                // this may get triggered as we reset the eventMode which will clash with objects dropped from outside chronos check in drop
        }
      } else if(draggedEventMode == 'TASK_ITEM_DRAG' || draggedEventMode == 'ROW_HEADER_DRAG') {
        // TRIGGER An EVENT TO USER	on DRAG END on task drag or row header drag
        var data = {
          draggedObject: draggedObject
        };
        if(plot.getShadowItem() != null) {
          plot.setShadowItem(null);
        }
        if(plot.getShadowHeaderItem != null) {
          plot.setShadowHeaderItem(null);
        }
        plot.drawHighLightOverlay();

        var event = jQuery.Event( "objectDragEnd");
        event.originalEvent = e;
        event.OriginalType = e.type;
        plot.getPlaceholder().trigger(event, [ data ]);

    } else if (draggedEventMode == plot.COLUMN_HEADER_DRAG) {
      var data = {
          columnHeaderSelectionObject:  plot.getColumnHeaderSelectionObject()
        };
        var event = jQuery.Event( "columnHeaderSelectionEnd" );
        event.originalEvent = e;
        event.OriginalType = e.type;
        plot.getPlaceholder().trigger(event, [ data ]);
     }
    }
    //reset everything back
    draggedEventMode = "NONE";
    plot.getPlaceholder().css('cursor', "default");
    plot.setEventMode(draggedEventMode);
    commonTransferObject.eventMode = draggedEventMode;
    plot.setIsDragging(false);


    //clear transfer objects in this drag action
    clearCommonTransferObject(commonTransferObject);

    return false;
  };

  plot.dropHandler = function dropHandler(e) {

    e.preventDefault();
    var commonTransferObject = getCommonTransferObject(e);
    var draggedEventMode = getDraggedEventMode(e); //from Common transfer object
    options = plot.getOptions();
    if(draggedEventMode == "PINCH_ZOOM_MODE") {
      draggedEventMode = "NONE";
    } else if (draggedEventMode == "NONE" || draggedEventMode == undefined) {
      //The dragEnd triggered from a different object other than plot
      onObjectDropped(e);
    } else if (draggedEventMode != 'PAN_MODE') {
      //all cases except when panning is stopped
      if(draggedEventMode =="TASK_ITEM_DRAG" || draggedEventMode == "ROW_HEADER_DRAG") {
        onObjectDropped(e);
        if(options.taskDrag.draggingEffect.enable && plot.getShadowItem() != null) {
          plot.setShadowItem(null);
        } else if(plot.getShadowHeaderItem() != null) {
          plot.setShadowHeaderItem(null);
        }
      } else if(draggedEventMode == 'RECTANGLE_SELECT_MODE') {
        if(plot.selectRectangle != null) {
          onRectangleSelectEnd(e, commonTransferObject);
        }
       } else if(draggedEventMode == "TASK_CREATE_MODE" && options.taskCreate.interactive) {
        // create taskCreationRectangle
        drawTaskCreationRectangleEnd(e, commonTransferObject );//drawing rectangle
       }
      plot.drawHighLightOverlay();
      draggedEventMode = null; //reset the evntMode
    }

    //reset back everything
    plot.setEventMode("NONE");
    return false;
  };


  //Utility function for drag events
  plot.capYValuesAndFetchData = function(min, max, e) {
    var axes = plot.getAxes();
    var axis = axes.yaxis;
    var opts = axis.options,
    scrollRange = opts.scrollRange;
     var viewValue = plot.verticalScrollBar.getViewValues();
      var diff = (viewValue.maxViewValue - viewValue.minViewValue);
        if(min < scrollRange[0]) {
          min = scrollRange[0];
          max = min + diff;
        }
        if(max > scrollRange[1]) {
          max = scrollRange[1];
          min = max - diff;
        }

      //Setting these ranges to plot
    plot.verticalScrollBar.setViewValues(min, max); // shd cap
    plot.verticalScrollBar.fetchDataAndRedraw(e);

    plot.currentVisibleData.yValueMin = min;
      plot.currentVisibleData.yValueMax =  max;
      opts.min = min;
    opts.max = max;
  };



  plot.capXValuesAndFetchData = function(min, max) {
    var axes = plot.getAxes();
    var axis = axes.xaxis;
    var opts = axis.options,
    scrollRange = opts.scrollRange;
    var viewValue = plot.horizontalScrollBar.getViewValues();
     var diff = (viewValue.maxViewValue - viewValue.minViewValue);
        if(min < scrollRange[0]) {
          min = scrollRange[0];
          max = min + diff;
        }
        if(max > scrollRange[1]) {
          max = scrollRange[1];
          min = max - diff;
        }

      //Setting these ranges to plot
    plot.horizontalScrollBar.setViewValues(min, max); // shd cap
    plot.horizontalScrollBar.fetchDataAndRedraw();
    plot.currentVisibleData.fromDate = resetViewPortTime(min);
      plot.currentVisibleData.toDate =  resetViewPortTime(max);
      opts.min = min;
    opts.max = max;
  };

  function onRectangeSelectStart(e, mode) {

    var offset = plot.offset();
    var plotOffset = plot.getPlotOffset();

    var currentMouseX =  plot.getPageX(e) - offset.left - plotOffset.left;
    var currentMouseY =  plot.getPageY(e) - offset.top - plotOffset.top;
    // the dragging coordinates
    var canvasToaxisPos = plot.c2p({
        left : currentMouseX,
        top : currentMouseY
    });

    if(mode == "RECTANGLE_SELECT_MODE") {
      return  {
          startTime :  canvasToaxisPos.x,
          startRow  :	canvasToaxisPos.y,
          startMouseX: currentMouseX,
          startMouseY : currentMouseY
      } ;
    } else if(mode == "TASK_CREATE_MODE") {
      return {
          startTime :  canvasToaxisPos.x,
          startRow  :	Math.round(canvasToaxisPos.y), // drawing teh task in teh correct row rounded
          startMouseX: currentMouseX,
          startMouseY : currentMouseY
      } ;
    }

  }


  //To draw the rectangle for task creation
  function drawTaskCreationRectangle(e) {
    var startPosition = plot.rectangleStartPosition;
    if(startPosition != null) {
      var startRow = startPosition.startRow,  //start yValue
            startTime = startPosition.startTime ;
      var offset = plot.offset();
      var plotOffset = plot.getPlotOffset();

      var currentMouseX = plot.getPageX(e) - offset.left - plotOffset.left;
      var currentMouseY = plot.getPageY(e) - offset.top - plotOffset.top;
      //Do not  draw on right axis label area . clip
      if(currentMouseX > plot.width() ) {
        currentMouseX = plot.width();
      }
      if(currentMouseY > plot.height()) {
        currentMouseY = plot.height();
      }
      //Do not  draw on left axis label area
      if(currentMouseX <0 ) {
        currentMouseX = 0;
      }
      if(currentMouseY <0) {
        currentMouseY = 0;
      }

      var axisx = plot.getSeries().xaxis;
      var axisy = plot.getSeries().yaxis;

      var timeToCanvasPos = axisx.p2c(startTime);
      var rowToCanvasPos = axisy.p2c(startRow); //as it is ceiled from teh start posn

      //Do not  draw on left axis label area
       if(timeToCanvasPos < 0) {
         timeToCanvasPos = 0;
       }
       if(rowToCanvasPos < 0) {
         rowToCanvasPos = 0;
       }
       var canvasToaxisPos = plot.c2p({
           left : currentMouseX,
           top : currentMouseY
       });
      var currentMouseRowId = plot.retrieveActualRowId(Math.round(canvasToaxisPos.y));

       plot.taskCreationRectangle = {
           startX: timeToCanvasPos,
           startY: rowToCanvasPos,
           endX : currentMouseX,
          endY : currentMouseY,
              startRow : startRow,
          startTime : startTime,
          endRow 	: Math.floor(canvasToaxisPos.y),
          endTime : Math.round(canvasToaxisPos.x),
          rowId : currentMouseRowId
          };
    } else {
      plot.taskCreationRectangle = null;
    }
  }


  function onRectangleSelectDrag(e) {
     plot.clearAllRectangleSelectHighlightList();
     drawRectangle(e);
     if(plot.selectRectangle != null) {
       addAllItemsInTheRectangleBox(e); //highlightimg items on selection as well
       plot.drawHighLightOverlay();
     }
  }

  function drawRectangle(e) {
    var startPosition = plot.rectangleStartPosition;
    if(startPosition != null) {
      var startRow = startPosition.startRow,  //start yValue
            startTime = startPosition.startTime,
            offset = plot.offset(),
            plotOffset = plot.getPlotOffset();

      var currentMouseX = plot.getPageX(e) - offset.left - plotOffset.left;
      var currentMouseY = plot.getPageY(e) - offset.top - plotOffset.top;
      //Do not  draw on right axis label area . clip
      if(currentMouseX >plot.width() ) {
        currentMouseX = plot.width();
      }
      if(currentMouseY >plot.height()) {
        currentMouseY = plot.height();
      }
      //Do not  draw on left axis label area
      if(currentMouseX <0 ) {
        currentMouseX = 0;
      }
      if(currentMouseY <0) {
        currentMouseY = 0;
      }
      var axisx = plot.getSeries().xaxis;
      var axisy = plot.getSeries().yaxis;
      var timeToCanvasPos = axisx.p2c(startTime);
      var rowToCanvasPos = axisy.p2c(startRow); //as it is ceiled from teh start posn

        //Do not  draw on left axis label area
         if(timeToCanvasPos < 0) {
           timeToCanvasPos = 0;
         }
         if(rowToCanvasPos < 0) {
           rowToCanvasPos = 0;
         }
         var width = currentMouseX - timeToCanvasPos;
         var height = currentMouseY - rowToCanvasPos;

          plot.selectRectangle = {
                 x: timeToCanvasPos,
              y: rowToCanvasPos,
              //width : currentMouseX - startMouseX,
              //height: currentMouseY - startMouseY
              width : width,
              height:  height
          };


    } else {
      plot.selectRectangle = null;
    }
  }


  function addAllItemsInTheRectangleBox(e) {
    var startPosition = plot.rectangleStartPosition;
    var barBottom = plot.getBarBottom();
          var barTop = plot.getBarTop();
    if(startPosition != null) {
      var startRow = startPosition.startRow,  //start yValue converted to axis units
            startTime = startPosition.startTime;
      var offset = plot.offset();
      var plotOffset = plot.getPlotOffset();
      var currentMouseX = plot.getPageX(e) - offset.left - plotOffset.left;
      var currentMouseY = plot.getPageY(e) - offset.top - plotOffset.top;
      // the dragging coordinates
      var canvasToaxisPos = plot.c2p({
          left : currentMouseX,
          top : currentMouseY
        });

      var endRow = canvasToaxisPos.y ,
            endTime = canvasToaxisPos.x;
          //Check if user had selected in a negative direction
          if(plot.selectRectangle != null) {
            //var rectangleWidth = plot.selectRectangle.width;
            var rectangleHeight = plot.selectRectangle.height;
            if(rectangleHeight < 0 ) {
              //console.log("Up ward ....");
              var tempRow = startRow; //interchange if selected upward
                startRow = endRow;
                endRow = tempRow;
            }
            startRow =   Math.round(startRow + barBottom); //start yValue
            endRow =  Math.round(endRow - barTop);  // end yValue
          }
          if(startRow <= endRow) {
            plot.addAllItemsInRangeToRectangleHighlights( startRow, startTime, endRow, endTime, null);
       }
    }
  }

   function onRectangleSelectEnd(e, commonTransferObject) {

    //Add the items to original highlights listlist
    addAllItemsInTheRectangleBox(e);
    plot.addSelectedListToOriginalHighlightlist();
    //triggering event to the user with teh selected items.
    var data = {
        selectedItems : plot.getRectangleFrameHighlights()
    };

    //After triggering Clear all already highlighted in the templist
    plot.clearAllRectangleSelectHighlightList();
    plot.selectRectangle = null;
    plot.rectangleStartPosition = null;
    plot.setEventMode("NONE");
    commonTransferObject.eventMode="NONE";
    plot.drawHighLightOverlay();
    var event = jQuery.Event( "rectangleSelectionEnd" );
    event.originalEvent = e;
    event.OriginalType = e.type;
    plot.getPlaceholder().trigger(event, [ data ]);

   }

  function drawTaskCreationRectangleEnd(e, commonTransferObject) {
    // Also fire an e to the user to perform the business
    // TRIGGER An EVENT TO USER
    var offset = plot.offset();
    var plotOffset = plot.getPlotOffset();
    var currentMouseX = plot.getPageX(e) - offset.left - plotOffset.left;
    var currentMouseY = plot.getPageY(e) - offset.top - plotOffset.top;
    // the dragging coordinates
    var canvasToaxisPos = plot.c2p({
        left : currentMouseX,
        top : currentMouseY
    });
    //Pass the rowId also for the user
     var rowId = plot.retrieveActualRowId(plot.rectangleStartPosition.startRow);

    data = {
        startRow : plot.rectangleStartPosition.startRow,
        startTime : Math.round(plot.rectangleStartPosition.startTime),
        endRow 	: Math.floor(canvasToaxisPos.y),
        endTime : Math.round(canvasToaxisPos.x),
        rowId : rowId,
        startX : plot.rectangleStartPosition.startMouseX,
        startY : plot.rectangleStartPosition.startMouseY,
        endX : currentMouseX,
        endY : currentMouseY
    };
    plot.getPlaceholder().trigger("objectCreateEnd", [ data ]);
    plot.taskCreationRectangle = null;
    plot.rectangleStartPosition = null;
    plot.setEventMode("NONE");
    commonTransferObject.eventMode="NONE";
    plot.drawHighLightOverlay();

  }

  function updatePositionDifference (e, draggedTasks, dragItemSize) {
    var offset = plot.offset();
    var plotOffset = plot.getPlotOffset();
    var draggedTask = null, axisx, axisy,initialXCoordinate,currentMouseX,currentMouseY,initialYCoordinate,positionDifference;

    axisx = plot.getSeries().xaxis;
    axisy = plot.getSeries().yaxis;

    currentMouseX = plot.getPageX(e) - offset.left - plotOffset.left;
     currentMouseY = plot.getPageY(e) - offset.top - plotOffset.top;

    switch (dragItemSize) {
      case 'SINGLE' : { //here only one task
          initialXCoordinate = axisx.p2c(draggedTasks.start);
          initialYCoordinate = axisy.p2c(draggedTasks.yValue);
          positionDifference = {
             x : currentMouseX - initialXCoordinate,
             y: currentMouseY - initialYCoordinate
          };
          draggedTasks.positionDifference = positionDifference;
        break;
      }
      case 'MULTIPLE': { // here draggedTasks will be an array

        for ( var i = 0; i < draggedTasks.length; i++) {
          draggedTask = draggedTasks[i];
            initialXCoordinate = axisx.p2c(draggedTask.start);
            initialYCoordinate = axisy.p2c(draggedTask.yValue);
            positionDifference = {
               x : currentMouseX - initialXCoordinate,
               y: currentMouseY - initialYCoordinate,
               startMouseX : currentMouseX,
               startMouseY : currentMouseY
            };
            draggedTask.positionDifference = positionDifference;
        }//for
      }
    }//switch
    return draggedTasks;

  }

  function generateShadowItem(e, commonTransferObject) {

     var draggedTask = null, positionDifference = 0;
     if(commonTransferObject != null) {
        draggedTask = commonTransferObject.draggedObject; //from Common transfer object
        positionDifference = draggedTask.positionDifference;
     }
    if(draggedTask == null) {
      return;
    }

    //Considering the movent of dragging, find the positions
    var currentActualPosition = computeActualPositionWithDirectionLimit(e, draggedTask,  positionDifference);
     // the dragging coordinates
    var canvasToaxisPos = plot.c2p({
        left : currentActualPosition.leftValue,
        top : currentActualPosition.currentMouseY
      });
        var taskWidth = draggedTask.end - draggedTask.start;
    var axisx = plot.getSeries().xaxis,
        startTime = canvasToaxisPos.x,
        endTime = startTime + taskWidth,
        rowYValue = canvasToaxisPos.y,
        widthInPixels = axisx.p2c(endTime) - axisx.p2c(startTime);

    return {
           start : Math.round(startTime),
          end : Math.round(endTime),
          yValue:rowYValue,
          drawMouseX: currentActualPosition.leftValue ,
          drawMouseY: currentActualPosition.currentMouseY,
          draggedTask:draggedTask,
          widthInPixels:widthInPixels,
          currentMouseX : currentActualPosition.currentMouseX,
              currentMouseY : currentActualPosition.currentMouseY
        };
  }

  //When dragging multiple items
  function generateMultipleShadowItems(e, commonTransferObject) {
     var draggedTasks = null, positionDifference = 0;
     if(commonTransferObject != null) {
        draggedTasks = commonTransferObject.draggedObject; //from Common transfer object
     }

    if(draggedTasks == null) {
      return;
    }
    var shadowItems = [], eachShadowItem = {};
    for ( var count = 0; count < draggedTasks.length; count++) {
      draggedTask = draggedTasks[count];
      positionDifference = draggedTask.positionDifference;
      //Considering the movent of dragging, find the positions
      currentActualPosition = computeActualPositionWithDirectionLimit(e, draggedTask,  positionDifference);
       // the dragging coordinates
      var canvasToaxisPos = plot.c2p({
          left : currentActualPosition.leftValue,
          top : currentActualPosition.currentMouseY
        });
        var taskWidth = draggedTask.end - draggedTask.start;
      var startTime = canvasToaxisPos.x,
          endTime = startTime + taskWidth,
          rowYValue = canvasToaxisPos.y,
          axisx = plot.getSeries().xaxis,
          widthInPixels = axisx.p2c(endTime) - axisx.p2c(startTime);

      eachShadowItem = {
               start : Math.round(startTime),
              end : Math.round(endTime),
              yValue: rowYValue,
              drawMouseX: currentActualPosition.leftValue,
              drawMouseY: currentActualPosition.currentMouseY,
              draggedTask: draggedTask,
              widthInPixels: widthInPixels,
              startMouseX : positionDifference.startMouseX,
              startMouseY : positionDifference.startMouseY
              //currentMouseX :currentMouseX,
              //currentMouseY :currentMouseY
            };

        shadowItems.push(eachShadowItem);
    } //for
    return shadowItems;
  }

  plot.setTaskDraggingDirection = function(newDirection) {
    options = plot.getOptions();
    options.taskDrag.draggingEffect.direction = newDirection;
  };

  plot.getTaskDraggingDirection = function() {
    options = plot.getOptions();
    return options.taskDrag.draggingEffect.direction;
  };

  /**
   * This computes the current position considering teh direction of dragging limits like horizontal, vertical, or normal(both --all directions)
   */
  function computeActualPositionWithDirectionLimit(e, draggedTask,  positionDifference) {
    var offset = plot.offset(),
       plotOffset = plot.getPlotOffset(),
       options = plot.getOptions(),
       axisx = plot.getSeries().xaxis,
       axisy = plot.getSeries().yaxis,
       taskDragDirection =  options.taskDrag.draggingEffect.direction;

    var currentMouseX = plot.getPageX(e) - offset.left - plotOffset.left;
    var currentMouseY = 0;
    var leftValue;
    switch(taskDragDirection) { // set currentMouseY and x value according to move direction. limiting
      case 'horizontal' : {
        currentMouseY =  axisy.p2c(draggedTask.yValue);// y constant -no change
        leftValue = currentMouseX - positionDifference.x; //x only changes
        break;
      }
      case 'vertical' : {
        currentMouseY = plot.getPageY(e) - offset.top - plotOffset.top;	//y changes
        leftValue =  axisx.p2c(draggedTask.start); //x constnat
        break;
      }
      case 'both' : {
        currentMouseY = plot.getPageY(e) - offset.top - plotOffset.top;
        leftValue = currentMouseX - positionDifference.x;
        break;
      }
    }
    return {
      leftValue : leftValue,
      currentMouseY :currentMouseY,
      currentMouseX :currentMouseX
    };
  }

  function generateHeaderShadowItem(e, commonTransferObject) {
    var offset = plot.offset();
    var plotOffset = plot.getPlotOffset();
     var draggedHeader = null;
     if(commonTransferObject != null) {
        draggedHeader = commonTransferObject.draggedObject; //from Common transfer object
     }
    if(draggedHeader == null) {
      return;
    }
     var currentMouseY = plot.getPageY(e) - offset.top;
     var currentMouseX = plot.getPageX(e) - offset.left ;
    var axisy = plot.getSeries().yaxis,
        widthInPixels = plotOffset.left,
        tickHeight =    axisy.p2c(1) - axisy.p2c(0);

    return {
          drawMouseX: currentMouseX ,
          drawMouseY: currentMouseY,
          draggedHeader:draggedHeader,
          widthInPixels:widthInPixels,
          height: tickHeight
        };
  }


  function generateResizingItem(e, commonTransferObject) {
    var resizedObject ={}, originalObject={};
    if(commonTransferObject != null) {
       originalObject = commonTransferObject.originalObject; //from Common transfer object
    }
    if(originalObject == null) {
      return;
    }
    var fireOnEdgeOnly = plot.getOptions().taskResize.fireOnEdgeOnly;
    var actualAttributesForResize = originalObject.actualAttributesForResize;

        var offset = plot.offset();
    var plotOffset = plot.getPlotOffset();
    var currentMouseX = e.clientX - offset.left - plotOffset.left;
    var currentMouseY = e.clientY - offset.top - plotOffset.top;

    // the dragging coordinates
    var canvasToaxisPos = plot.c2p({
        left : currentMouseX,
        top : currentMouseY
    });
    var startTime=0, endTime = 0, rowYValue = originalObject.yValue;

    if(originalObject.resizePosition == "START") {
      startTime = canvasToaxisPos.x;	//current new position
      if(fireOnEdgeOnly) {
        endTime = originalObject.end; 	// end no change
      } else {
        endTime = originalObject[actualAttributesForResize.end];
      }
        if(startTime > endTime) { //if resizing end goes after end of the object , interchaneg start and end
          startTime = endTime;
          endTime = canvasToaxisPos.x;
        }
        if(currentMouseX <=  0){
          startTime = plot.c2p({ left :0, top :currentMouseY}).x ; //limit beyond the row plotbody
        }

    } else if(originalObject.resizePosition == "END"){
      if(fireOnEdgeOnly) {
        startTime = originalObject.start;	//start no change
      } else {
        startTime = originalObject[actualAttributesForResize.start];
      }
        endTime = canvasToaxisPos.x; //current new position
        if(startTime > endTime) { //if resizing end goes before start of the object,  , interchaneg start and end

          endTime = startTime;
        startTime = canvasToaxisPos.x;
        }
        if(currentMouseX >=  plot.width()){
          startTime = plot.c2p({ left :plot.width(), top :currentMouseY}).x ; //limit beyond the row plotbody
        }

    }

    //set the resizedObject details with new values.
    $.extend(resizedObject, originalObject);	// don't change original
    var startDateAttribute = plot.getGanttStartDateAttribute(resizedObject);
    var endDateAttribute = plot.getGanttEndDateAttribute(resizedObject);
    resizedObject.start = startTime;
    if(fireOnEdgeOnly) {
      resizedObject[startDateAttribute] = startTime; // set to actual attributes as well when fireOnEdgeOnly is true
    } else {
      if(originalObject.resizePosition == "START") {
        resizedObject[actualAttributesForResize.start] = startTime;
      }
    }

    resizedObject.end = endTime;
    if(fireOnEdgeOnly) {
      resizedObject[endDateAttribute] = endTime; // set to actual attributes as well
    } else {
      if(originalObject.resizePosition == "END") {
        resizedObject[actualAttributesForResize.end] = endTime;
      }
    }
    return {
         start : startTime,
        end : endTime,
        yValue:rowYValue,
        originalObject:originalObject,
        resizedObject:resizedObject,
        position : {
          currentMouseX :currentMouseX,
          currentMouseY: currentMouseY
          }
        };
  }

  /**
   * onObjectDragStart called from dragStart e
   */
  function onObjectDragStart(e, dragType) {
    var plotOffset = plot.getPlotOffset();
    var options = plot.getOptions();
    var offset = plot.offset();
    var currentMouseX, currentMouseY, canvasToaxisPos=null, hoveredObject=null;
    var data = {
        dragType: dragType,
        dragItemSize :null
    };
    switch(dragType) {
      case "TASK_ITEM": {
        plot.getPlaceholder().css('cursor', options.taskDrag.cursor);
        //if multiple select with CTL and drag
        var selectedTasks = plot.getAllHighlights(); //Note : dragging item can or cannot be in the list
        var eachHighlightItem, taskInList = false;
        var draggableTasks = new Array();
        if(selectedTasks != null && selectedTasks.length > 0) {
          //Check if non draggable tasks in list. If so ignore those
          for (var j = 0; j < selectedTasks.length; j++) {
            eachHighlightItem = selectedTasks[j];
            if(eachHighlightItem.draggable == undefined || eachHighlightItem.draggable ){ // default(undefined) or true
              draggableTasks.push(eachHighlightItem);
            }
          }
          //Check if the hoveritem is in the list
          for ( var int = 0; int < draggableTasks.length; int++) {
            eachDraggedtem = draggableTasks[int];
            if(eachDraggedtem.chronosId == hoverItem.chronosId) {
              taskInList = true;
              break;
            }
          }
        }
        //if task dragged and that is draggable and it is the hoverItem. it is to be added in list
        if(!taskInList && (hoverItem.draggable || hoverItem.draggable == undefined)){ // default is draggable
          draggableTasks.push(hoverItem);
        }

        if(draggableTasks.length == 0) { // no draggable items to drag
          return true;
        }

          if(draggableTasks.length > 1) {
            hoveredObject = draggableTasks;
            data.dragItemSize="MULTIPLE";
          } else { //hoverItem is dragged
            hoveredObject = draggableTasks[0]; // is the hovered Item
            data.dragItemSize="SINGLE";
          }
        //}
        currentMouseX = plot.getPageX(e) - offset.left - plotOffset.left;
        currentMouseY = plot.getPageY(e) - offset.top - plotOffset.top;
        var taskWidth = hoverItem.end - hoverItem.start;
        hoverItem.taskWidth = taskWidth;
        canvasToaxisPos = plot.c2p({
          left : currentMouseX,
          top : currentMouseY
        });
        //Round the time in milliseconds before giving the value to user
        canvasToaxisPos.x = Math.round(canvasToaxisPos.x);
        break;
      }
      case "ROW_HEADER" :  {

        var currentPosition = hoveredArea.currentPosition;
        var selectedRows = plot.getAllRowHighlights();

        if(selectedRows != null && selectedRows.length >1) {
          //add the hovered item also in it
          hoveredObject = selectedRows;
          data.dragItemSize="MULTIPLE";
        } else {
          hoveredObject = hoveredArea.rowHeaderInfo;
          data.dragItemSize="SINGLE";
        }
        canvasToaxisPos = plot.c2p({
          left : currentPosition.x,
          top : currentPosition.y
        });

        if(options.headerDrag.effectAllowed == "move") {
          plot.getPlaceholder().css('cursor', 'move');
        }

        break;
      }
    }
    //Common passing for both dragTypes
    //Pass the rowId also for the user	 even if it is already there in dragged Object.
    if(canvasToaxisPos){
    canvasToaxisPos.rowId = plot.retrieveActualRowId(Math.round(canvasToaxisPos.y));
    }

    data.currentItem = hoveredObject;
    data.canvasToaxisPos = canvasToaxisPos;
    // TRIGGER An EVENT TO USER	 - provide the original events as well
    var event = jQuery.Event( "objectDragStart" );
    event.originalEvent = e;
    event.OriginalType = e.type;

    plot.getPlaceholder().trigger(event, [ data ]);
    return {
      hoveredObject: hoveredObject,
      dragItemSize: data.dragItemSize
    };
  }
  function onObjectDropped(e) {
    // Find the target Item if any . it can be a task Item or a rowHEader
    var targetCanvas = e.target , targetPlot = null, series = plot.getSeries();
    var options = plot.getOptions();
    if(globalTransferObject) {
      targetPlot = globalTransferObject.plotCanvasMap[targetCanvas.id];
    }
    if(targetPlot == undefined) {
      return;
    }
    var commonTransferObject = getCommonTransferObject(e);
    var draggedObject = commonTransferObject.draggedObject; //from Common transfer object
    var dragType = commonTransferObject.dragType;
    var dragItemSize = commonTransferObject.dragItemSize;
    //NOTE: Chrome works only if the zoom level is 100%
    var currentMouseX, currentMouseY, targetHoveredObject ={};
    var canvasToaxisPos= {};
    var data = {};
      data.dragType = dragType;
      data.dragItemSize = dragItemSize;
      data.sourceHeaderDragOptions = ((commonTransferObject!= null)?commonTransferObject.sourceHeaderDragOptions : null);
    var offset = targetPlot.offset();

    var plotOffset = targetPlot.getPlotOffset() ;
    currentMouseX = targetPlot.getPageX(e) - offset.left - plotOffset.left;
    currentMouseY = targetPlot.getPageY(e) - offset.top - plotOffset.top;

    var draggedObjects = [], draggedRowIds = []; //for rowheader multiple case
    switch(dragType) {
      case "TASK_ITEM" : {
        if(dragItemSize == "SINGLE") {
          draggedObject = calculateNewPosition(e, draggedObject, targetPlot);
        } else if(dragItemSize == "MULTIPLE") {
          //Note in this case the canvasToaxis position will be inside each draggedObject
          for ( var int = 0; int < draggedObject.length; int++) {
            var eachObject = draggedObject[int];
            eachObject = calculateNewPosition(e, eachObject, targetPlot);
             draggedObjects.push(eachObject);
          }
          draggedObject = draggedObjects;
        }
        break;
        }
      case "ROW_HEADER" : {
        //var hoveredObject = null;
        if(dragItemSize == "SINGLE") {
          hoveredArea = targetPlot.findHoveredArea(e);
          if(hoveredArea != null) {
            var currentPosition = hoveredArea.currentPosition;
            canvasToaxisPos = targetPlot.c2p({
              left : currentPosition.x,
              top : currentPosition.y
            });
          }

          //Pass the rowId also for the user
          canvasToaxisPos.rowId = targetPlot.retrieveActualRowId(Math.round(canvasToaxisPos.y));
          data.canvasToaxisPos = canvasToaxisPos;		 // ONLY AVAILABLE WHEN 	drag type is ROW_HEADER
        } else if(dragItemSize == "MULTIPLE") {
          var eachRowId; // Here teh draggedObject will be the set of rowIds being dragged
          for ( var d = 0; int < draggedObject.length; d++) {
             eachRowId = draggedObject[d];
             draggedRowIds.push(eachRowId); //pushing only the rowIds and not the object
             draggedObjects.push(series.rowIdRowObjectMap[eachRowId]); // pushing the rowObjects as well
          }
          //sort the dragged yValue and get the smallest
          //Note : draggedRowIds will have only rowIds & draggedObjects will have arrays of rowObjects
          sortDraggedObjectsBasedOnYvalue(draggedRowIds, draggedObjects, series);
          draggedObject = draggedObjects; // set the actual objects after sorted in data.draggedObject given to the trigger
        }

        break;
      }	//case ROWHEADER
    } //switch end

    var droppedPosition =  calculateDroppedPosition(e, targetPlot);
    data.droppedPosition = droppedPosition;

    var targetItem = targetPlot.findItemOnGantt(currentMouseX, currentMouseY);
    var targetRowItem = null;
    if(targetItem == null) { //if it is not an item , check if it is a row header
      targetRowItem = targetPlot.findHoveredArea(e);
    }

    if(targetItem != null) {
      targetHoveredObject = targetItem.details;
      data.targetType = "TASK_ITEM";
    } else if(targetRowItem != null && targetRowItem.label == "ROW_HEADER_ITEM") {
      targetHoveredObject = targetRowItem.rowHeaderInfo;
      data.targetType = "ROW_HEADER";
    }

    data.currentItem = draggedObject; // the dragged item backward compatibility
    data.draggedItem = draggedObject;
    data.targetItem = targetHoveredObject;
    data.shadowItem = plot.getShadowItem();

    var allowDrop = targetPlot.getPlaceholder().trigger("allowDropEvent", [ data]).data("allowDrop");
    if(!allowDrop && allowDrop != undefined) { // if allowDrop is false or allow drop is not defined(backward compatibility)
      // reset back everything of the previous plot
      plot.setEventMode("NONE");
      plot.getPlaceholder().css('cursor', 'default');
      return;
    }

    //if allowdrop is success ort not defined , proceed drop .
    //Note : Moving original row to target by adding a new row happens only if sourcePlot headerDrag.effectAllowed is true:
    //CASE NEEDED ONLY IF ROWS MOVED BETWEEN  SAME PLOT.
    if(dragType == "ROW_HEADER"  &&  data.sourceHeaderDragOptions.effectAllowed == "move") {
      if(dragItemSize == "SINGLE") {
        moveOrinalRowToTargetPosition(draggedObject, droppedPosition.rowId);
      } else if (dragItemSize == "MULTIPLE") {
        moveOrinalRowsToTargetPosition(draggedRowIds, droppedPosition.rowId, series);
      }
    }

    var event = jQuery.Event( "objectDropped");
    event.originalEvent = e;
    event.OriginalType = e.type;
    // reset back everything of the previous plot
    plot.setEventMode("NONE");
    plot.getPlaceholder().css('cursor', 'default');

    // TRIGGER An EVENT TO USER	only if the dropped position is valid
    targetPlot.getPlaceholder().trigger(event, [ data ]);

  }

  // Sorting the objects based on yValue
  function sortDraggedObjectsBasedOnYvalue(draggedRowIds, draggedObjects, series) {
     draggedRowIds.sort(function(a, b) {
              var result;
              if(series.rowYvalueMap[a] > series.rowYvalueMap[b]) {
                result  = 1;
              } else {
                result= -1;
              }
              return result;
            });
     draggedObjects.sort(function(a, b) {
              var result;
              if(series.rowYvalueMap[a.chronosId] > series.rowYvalueMap[b.chronosId]) {
                result  = 1;
              } else {
                result= -1;
              }
              return result;
            });
  }

  /**
   * move Row headers in case of multiple header drag.
   */
  function moveOrinalRowsToTargetPosition(draggedRowIds,  droppedRowId, series) {
    var targetyValue = series.rowYvalueMap[droppedRowId]; //get the yValue and update map
    //get the yValue of the first dragged rowID in list which will be the lowest in list as it sorted
    var draggedyValue = series.rowYvalueMap[draggedRowIds[0]];
    var targetDropRowId = droppedRowId;

    if(draggedRowIds[0] == undefined || droppedRowId == undefined || draggedRowIds[0] == droppedRowId  ) {
      return;
    }

    if(draggedyValue < targetyValue) {
      var eachRowId, eachDraggedRowHeaderObject;
      for ( var index = 0; index < draggedRowIds.length; index++) {
        eachRowId = draggedRowIds[index];
        eachDraggedRowHeaderObject = series.rowIdRowObjectMap[eachRowId];
        plot.temporaryDeleteRow(eachRowId);
        plot.insertRowAfter(targetDropRowId, eachDraggedRowHeaderObject);
        targetDropRowId = eachRowId;
      }
    } else {
      for ( var index = (draggedRowIds.length -1); index >= 0; index--) {
        eachRowId = draggedRowIds[index];
        eachDraggedRowHeaderObject = series.rowIdRowObjectMap[eachRowId];
        plot.temporaryDeleteRow(eachRowId);
        plot.insertRowBefore(targetDropRowId, eachDraggedRowHeaderObject);
        targetDropRowId = eachRowId;
      }
    }
  }
  /**
   * Move row headers in case of SINGLE header drag
   */
  function moveOrinalRowToTargetPosition(draggedRowItem, droppedRowId) {
    var options= plot.getOptions() ,
      series = plot.getSeries();
    var draggedRowId = draggedRowItem[options.series.gantt.rowIdAttribute];

    if(!draggedRowId|| !droppedRowId || draggedRowId == droppedRowId ) {
      return;
    }

    //Now add the new row at the dropped position
    var targetyValue = series.rowYvalueMap[droppedRowId]; //get the yValue and update map
    var draggedyValue = series.rowYvalueMap[draggedRowId]; //get the yValue and update map

    plot.temporaryDeleteRow(draggedRowId);
    if(draggedyValue < targetyValue) {
      plot.insertRowAfter(droppedRowId, draggedRowItem);
    } else {
      plot.insertRowBefore(droppedRowId, draggedRowItem);
    }
    return;


  }

  function calculateNewPosition(e, draggedObject, plot) {
   //The actual dropped coordinates of shadow considering direction
   var actualPosition = computeActualPositionWithDirectionLimit(e, draggedObject, draggedObject.positionDifference);
   // the dragging coordinates
  canvasToaxisPos = plot.c2p({
        left : actualPosition.leftValue,
        top : actualPosition.currentMouseY
  });
  var newPosition = {};
  //Round the time in milliseconds before giving the value to user
  newPosition.startTime = Math.round(canvasToaxisPos.x);
  var taskWidth = draggedObject.end - draggedObject.start;
  newPosition.endTime = Math.round(newPosition.startTime + taskWidth),
  //Pass the rowId also for the user
  newPosition.rowId =  plot.retrieveActualRowId(Math.round(canvasToaxisPos.y));
  draggedObject.newPosition = newPosition;
  return draggedObject;

 }




 /**
  * Returns the dropped positions when a drop e is fired on targetPlot
  */
 function calculateDroppedPosition(e, targetPlot) {
   var offset = targetPlot.offset();
   var plotOffset = targetPlot.getPlotOffset() ;
  var currentMouseX = targetPlot.getPageX(e) - offset.left - plotOffset.left;
  var currentMouseY = targetPlot.getPageY(e) - offset.top - plotOffset.top;
  canvasToaxisPos = targetPlot.c2p({
        left : currentMouseX,
        top : currentMouseY
  });

  var droppedPosition = {};
  //Round the time in milliseconds before giving the value to user
  droppedPosition.time = Math.round(canvasToaxisPos.x); // in milliseconds
  //Pass the rowId also for the user
  droppedPosition.rowId =  targetPlot.retrieveActualRowId(Math.round(canvasToaxisPos.y)); // in rowID
  droppedPosition.currentMouseX = currentMouseX;
  droppedPosition.currentMouseY = currentMouseY;
  droppedPosition.rowHeaderObject = targetPlot.getSeries().rowIdRowObjectMap[droppedPosition.rowId];
  return droppedPosition;

 }


  function getCommonTransferObject(e) {
    var commonObject = null;

    if(e.dataTransfer != null) {
      var commonTransferObject = e.dataTransfer.getData(internalDNDType);
      if(commonTransferObject == null || commonTransferObject == "") {
        //SUPPORT FOR CHROME TODO remove later when supported in chrome
        commonObject = plot.tempCreateCommonTransferObject();
      } else if (commonTransferObject) {
        commonObject = JSON.parse(commonTransferObject);
      }
    } else {
      commonObject = plot.tempCreateCommonTransferObject();
    }
    return commonObject;
  }

  function clearCommonTransferObject(commonTransferObject) {
    commonTransferObject.dragType = null;
    commonTransferObject.draggedObject = null ;
    commonTransferObject.dragItemSize = null;
    commonTransferObject.eventMode 	 = "NONE";
    commonTransferObject.originalObject = null;
    commonTransferObject.sourceHeaderDragOptions = null;
    commonTransferObject.columnHeaderSelectionObject = null;
    clearGlobalObject();
  }

  //This is the case when transfer object is not supported in case of chrome
  plot.tempCreateCommonTransferObject = function(){
      //the case when drag over multiple panes. if same pane, temp Object is created
      //Here the application will provide the stored global Object - Support for chrome
    if(!globalTransferObject) {
      var options = plot.getOptions();
      var globalObjectProviderFunction = options.taskDrag.globalTransferObjectProvider;
      globalTransferObject = eval(globalObjectProviderFunction).apply();
      if(globalTransferObject) { // if this function is not defined
        globalTransferObject.plotCanvasMap =  [];

      }
    }
    return globalTransferObject;

  };

  function setToGlobalObject(commonTransferObject) {
    globalTransferObject = plot.tempCreateCommonTransferObject();
    if(globalTransferObject != null) {
       globalTransferObject.dragType = commonTransferObject.dragType;
      globalTransferObject.draggedObject = commonTransferObject.draggedObject;
      globalTransferObject.dragItemSize = commonTransferObject.dragItemSize;
      globalTransferObject.eventMode 	 = 	commonTransferObject.eventMode;
      globalTransferObject.originalObject = commonTransferObject.originalObject;
      globalTransferObject.sourceHeaderDragOptions = commonTransferObject.sourceHeaderDragOptions;
      globalTransferObject.columnHeaderSelectionObject = commonTransferObject.columnHeaderSelectionObject;
    }
  }
  function clearGlobalObject() {
    if(globalTransferObject != null) {
      globalTransferObject.dragType = null;
      globalTransferObject.draggedObject = null;
      globalTransferObject.dragItemSize = null;
      globalTransferObject.eventMode 	 = 	"NONE";
      globalTransferObject.originalObject = null;
      globalTransferObject.sourceHeaderDragOptions = null;
    }

  }

  function getDraggedEventMode(e) {
    var commonTransferObject = getCommonTransferObject(e);
     if( commonTransferObject!= null) {
       return commonTransferObject.eventMode;
     }
  }

  ///////////////////////////////////DRAG EVENTS END//////////////////////////

  var prevPageX = 0, prevPageY = 0, panTimeout = null;
  function onPanStart(e) {
    if (e.which != 1 && e.touches == undefined) // only accept left-click
      return false;
    prevPageX = plot.getPageX(e);
    prevPageY = plot.getPageY(e);
  }


  var myE;
  var nextPanTime = new Date().getTime();
  function onPan(e) {

    var frameRate = plot.getOptions().pan.frameRate;
    myE = e;
    if (panTimeout || !frameRate) {
      return false;
    }
    var requiredTimeOut = nextPanTime - new Date().getTime();
    if(requiredTimeOut  < 1) {
      requiredTimeOut = 1;
    }
     panTimeout = setTimeout(function(e) {
      nextPanTime = new Date().getTime() + (1 / frameRate * 1000);
      plot.pan({
        left : prevPageX - plot.getPageX(myE),
        top : prevPageY - plot.getPageY(myE),
        event  : e
      });
      prevPageX = plot.getPageX(myE);
      prevPageY = plot.getPageY(myE);
      panTimeout = null;
    }.bind(this, e), requiredTimeOut);


  }

    plot.pan = function(args) {
      var delta = {
        x : +args.left,
        y : +args.top
      };

      if (isNaN(delta.x))
        delta.x = 0;
      if (isNaN(delta.y))
        delta.y = 0;

      $.each(plot.getAxes(), function(_, axis) {
        var opts = axis.options,
        min, max,
        d = delta[axis.direction];
        min = axis.c2p(axis.p2c(axis.min) + d),
        max = axis.c2p(axis.p2c(axis.max)+ d);
        var scrollRange = opts.scrollRange;
        if (scrollRange == false) // no panning on this axis
          return;

        if (scrollRange) {
          // check whether we hit the wall
          if (scrollRange[0] != null && scrollRange[0] > min) {
            d = scrollRange[0] - min;
            min += d;
            max += d;
          }

          if (scrollRange[1] != null && scrollRange[1] < max) {
            d = scrollRange[1] - max;
            min += d;
            max += d;
          }
        }
        opts.min = min;
        opts.max = max;

        if (axis.direction == 'x') {
          plot.currentVisibleData.fromDate = plot.resetViewPortTime(min);
            plot.currentVisibleData.toDate = plot.resetViewPortTime(max);
            //Calculate this for PAN AS WELL
             if (plot.areWrapRowsEnabled() && (plot.resetViewPortTime(opts.min) != plot.viewBucket.min || plot.resetViewPortTime(opts.max) != plot.viewBucket.max)) {
            plot.updateWrapIndexDisplayMap();
        }
          if(plot.horizontalScrollBar) {
              plot.horizontalScrollBar.setViewValues(min, max);
              plot.horizontalScrollBar.redrawScrollBox();
              plot.horizontalScrollBar.setInvokedCanvas(plot.getCanvas().id,  args.event);
          }
        }

        if (axis.direction == 'y') {
          plot.currentVisibleData.yValueMin = Math.floor(min);
          plot.currentVisibleData.yValueMax = Math.ceil(max);

          if(plot.verticalScrollBar) {
              plot.verticalScrollBar.setViewValues(min, max);
              plot.verticalScrollBar.redrawScrollBox();
              plot.verticalScrollBar.setInvokedCanvas(plot.getCanvas().id,  args.event);

              }
        }
      });


      plot.setupGrid();
      plot.draw();
      var customEvent = jQuery.Event("plotpan");
        customEvent.originalEvent = args.event;
         if (!args.preventEvent) {
              plot.getPlaceholder().trigger(customEvent, [ plot]);
         }
    };// plotpan

  function onPanEnd(e) {
    //ISRM-5629
    var series = plot.getSeries();
      //Modified for ISRM-8273
    var scrollMax = options.yaxis.scrollRange[1];
    if(options.pan.snapRow && (series.yaxis.max < scrollMax)) {
      var min = Math.floor(series.yaxis.min);
      var max = Math.ceil(series.yaxis.max);
      if(plot.verticalScrollBar) {
        var opts = plot.getOptions();
       if(opts.yaxis.verticalScrollExtendunit > 0) {
        min = min + opts.yaxis.verticalScrollExtendunit;
        max = max - opts.yaxis.verticalScrollExtendunit;
        }
       plot.setYaxisViewArea(min, max);
      }
    }
        //user call invoked from here
      plot.callFetchDataIfRequired();	// current plot where pan is invoked
      if(plot.horizontalScrollBar) {
            plot.horizontalScrollBar.syncAllChartsWithDataFetch(e);
        }
      if(plot.verticalScrollBar) {
        plot.verticalScrollBar.syncAllChartsWithDataFetch(e); //except the invoked one
      }
      plot.getPlaceholder().css('cursor', 'default');
  }

  /**
   * For testign the data
   */
  function printData(data) {
    if( (window['console'] !== undefined) ) {
      console.log("rowIds :  " + data.rowIds  + "\n" +
       " YMin : " + data.yValueMin +  " , YMax : " + data.yValueMax +
      "\n FromDate  : " +  plot.printDate(data.fromDate)  + "\n" +
       " toDate :  " + plot.printDate(data.toDate) + " days ");
    }
  }

  /**
   * The call back function call when fetching data when required.
   * User can call this first time to load data . The dataloading logic will be done by teh frame work
   */
  var one_day = 1000 * 60 * 60 * 24; //one day in millis
  //This function specific to plot . User can call it from outside
  plot.callFetchDataIfRequired = function callFetchDataIfRequired() {
    options = plot.getOptions();
    if(!options.interaction.dataOnDemand) {
      return;
    }
    var callBackFunction = plot.getSeries().callBackFunction;
    var responseDesiredLoadedData = {};
    var desiredLoadedDataArray =  [];
    if(!callBackFunction) {
      return;
    }
    if (options.chronosWorker.enabled) {
      var series = plot.getSeries();
      var callFetchObject = {
          plot : {
            currentVisibleData : plot.currentVisibleData,
            hiddenRows : plot.hiddenRows,
            newInsertedRows : plot.newInsertedRows,
            currentLoadedData : plot.currentLoadedData,
            options : {
              interaction : {
                extraFetchFactor : options.interaction.extraFetchFactor,
                extraViewFetch : options.interaction.extraViewFetch,
                extraViewFetchFactor : options.interaction.extraViewFetchFactor
              },
              yaxis : {
                scrollRange : options.yaxis.scrollRange,
                newScrollRange : options.yaxis.newScrollRange,
                verticalScrollExtendunit : options.yaxis.verticalScrollExtendunit
              },
              xaxis : {
                scrollRange : options.xaxis.scrollRange
              }
            },
            series : {
              rootTreeNode : series.rootTreeNode ? true : undefined,
              displayedRowIds : series.displayedRowIds,
              actualFilterRowIds : series.actualFilterRowIds,
              rowIdLeafNodeMap : series.rowIdLeafNodeMap ? plot.prepareDataMap(series.rowIdLeafNodeMap,["isLeafNode"]) : series.rowIdLeafNodeMap,
              rowMap : series.rowMap,
              rowAvailable : series.rowAvailable,
              columnAvailable : series.columnAvailable,
              columnMap : series.columnMap,
              gantt : {
                normalMaximumDaySpan : series.gantt.normalMaximumDaySpan
              }
            }
          }
      }
      $.chronosworker.call("callFetchDataIfRequired",callFetchObject ,function(responseData){
        plot.callFetchCallBack(responseData);
      }, plot.getPlotLabel());
    } else {
      var responseData = getDesiredLoadedData(plot);
      plot.callFetchCallBack(responseData);
    }
  };

  plot.callFetchCallBack = function(responseData){
    if (responseData.triggerInitialViewDataLoad) {
      if(!responseData.extraViewFetchRequired) {
        discardIrreleventData(responseData.initialViewDesiredData,plot);
      }
      plot.triggerDataLoadCall(responseData.initialViewDesiredData, responseData.desiredLoadedDataArray);
      //Don't forget to set the current loaded here
      if(!responseData.extraViewFetchRequired) {
        plot.currentLoadedData = {
            yValueMin: responseData.initialViewDesiredData.yValueMin,
            yValueMax: responseData.initialViewDesiredData.yValueMax,
            fromDate: responseData.initialViewDesiredData.fromDate,
            toDate: responseData.initialViewDesiredData.toDate,
            rowIds : responseData.initialViewDesiredData.rowIds

        }
       };
    }
    if (responseData.triggerExtraViewDataLoad){
      discardIrreleventData(responseData.desiredLoadedData,plot);
      plot.triggerDataLoadCall(responseData.desiredLoadedData, responseData.desiredLoadedExtraFetchDataArray);
        plot.currentLoadedData = {
        yValueMin: responseData.desiredLoadedData.yValueMin,
        yValueMax: responseData.desiredLoadedData.yValueMax,
        fromDate: responseData.desiredLoadedData.fromDate,
        toDate: responseData.desiredLoadedData.toDate,
        rowIds : responseData.desiredLoadedData.rowIds
         };
    }
    // Note : If there are no data in the rows added , the rowMap will not be populated for this row.
    // So for every row , this is called here for the case of on demand add Row.
    // invoke this after plot.currentLoadedData is set
    // Refer to method updateRowHeaderMap in core, where getCurrentRowIndex is called for static data
    if(responseData && responseData.desiredLoadedDataArray){
      for(var listIndex = 0; listIndex < responseData.desiredLoadedDataArray.length ; listIndex ++) {
         var rowIdsTofetch = responseData.desiredLoadedDataArray[listIndex].rowIds;
         for(var id = 0 ; id < rowIdsTofetch.length ; id++) {
           plot.getCurrentRowIndex(rowIdsTofetch[id]);
         }
       }
    }
  }
  function getDesiredLoadedData(plot){
    var responseData = {};
    var responseDesiredLoadedData = {};
    var desiredLoadedDataArray =  [];
    var desiredLoadedExtraFetchDataArray =  [];
    var currentVisibleYRange =  (Math.floor(plot.currentVisibleData.yValueMax)  - Math.ceil(plot.currentVisibleData.yValueMin)) + 1 ; //including both the start & end yLabels
    // For calculating desired day range for X axis- time in this case
    var currentVisibleDays =  Math.ceil((plot.currentVisibleData.toDate  - plot.currentVisibleData.fromDate) /one_day) ; //including both the start & end days

    var extraViewFetchRequired = options.interaction.extraViewFetch; // By default previous and next View rows and columns will be fetched
    var initialViewDesiredData = plot.setupDesiredLoadedData(0, 0, extraViewFetchRequired);
    var missingRowIds =  plot.getMissingRowIds(initialViewDesiredData);
    /* console.log("BEFORE VIEW FETCH currentLoadedData---- > ", plot.currentLoadedData);
    console.log("fromDate : " , new Date(plot.currentLoadedData.fromDate) , " toDate : " ,  new Date(plot.currentLoadedData.toDate));

    console.log("\n BEFORE VIEW FETCH desiredLoadedData ---- > ", initialViewDesiredData);
    console.log("fromDate : " , new Date(initialViewDesiredData.fromDate) , " toDate : " ,  new Date(initialViewDesiredData.toDate));

    console.log("BEFORE missingRowIds ---- ",missingRowIds); */
    //Only for the initial fetch - server call send separately
    if(missingRowIds.length > 0 || (initialViewDesiredData.fromDate < plot.currentLoadedData.fromDate)
        || (initialViewDesiredData.toDate > plot.currentLoadedData.toDate)) {
        if(!extraViewFetchRequired) {
          applyExtraFetchFactorAndCap(initialViewDesiredData, currentVisibleYRange, currentVisibleDays);
          discardIrreleventData(initialViewDesiredData);
        }
        responseDesiredLoadedData.fromDate = initialViewDesiredData.fromDate; // no change
        responseDesiredLoadedData.toDate = initialViewDesiredData.toDate; // no change
         missingRowIds =  plot.getMissingRowIds(initialViewDesiredData);
        responseDesiredLoadedData.rowIds = missingRowIds;
        if(responseDesiredLoadedData.rowIds.length >0) {
        desiredLoadedDataArray.push(responseDesiredLoadedData);
        }
         plot.horizontalDatafetch(initialViewDesiredData, desiredLoadedDataArray);
        // setting response
        responseData.extraViewFetchRequired = extraViewFetchRequired;
        responseData.triggerInitialViewDataLoad = true;
        responseData.initialViewDesiredData = initialViewDesiredData;
        responseData.desiredLoadedDataArray = desiredLoadedDataArray;
    }

    //FOR EXTRA VIEW FETCH
    var desiredLoadedData = plot.setupDesiredLoadedData(currentVisibleYRange, currentVisibleDays,extraViewFetchRequired );
    missingRowIds =  plot.getMissingRowIds(desiredLoadedData);
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
      applyExtraFetchFactorAndCap(desiredLoadedData, currentVisibleYRange, currentVisibleDays);
      discardIrreleventData(desiredLoadedData);
      missingRowIds = plot.getMissingRowIds(desiredLoadedData);
      desiredLoadedDataArray =  [];
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


      plot.horizontalDatafetch(desiredLoadedData, desiredLoadedExtraFetchDataArray);
      // setting response
      responseData.triggerExtraViewDataLoad = true;
      responseData.desiredLoadedData = desiredLoadedData;
      responseData.desiredLoadedExtraFetchDataArray = desiredLoadedExtraFetchDataArray;
    }
    return responseData;
  };

  /**
   * This is for handling the scroll right and scroll left cases - horizontal fetch
   */
   plot.horizontalDatafetch = function(desiredLoadedData, desiredLoadedDataArray) {
    //SCROLL RIGHT CASE -------
     var tempDesiredLoadedData;
      var desiredVisibleRowIds = plot.getDesiredRowIdsThatAreVisible(desiredLoadedData);


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
   * Create desired loaded data considering the min-/max+currentVisibleYRange and min-/max+currentVisibleDays
   */
  plot.setupDesiredLoadedData = function(currentVisibleYRange, currentVisibleDays, extraViewFetchRequired) {
    var desiredLoadedData = {}, series = plot.getSeries(), options = plot.getOptions();
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
    capDesiredMinMaxDisplayedYValueLimits(desiredLoadedData); // normal displayedYValue -NOTE: Not converted to actual
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
    requestedRowIds = plot.getRequestedRowIds(desiredLoadedData);
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
    capDesiredMinMaxDayLimits(desiredLoadedData);
    return desiredLoadedData;
  };


  /**
   *common function to invoke ajax call for data fetch
   */
  plot.triggerDataLoadCall = function(desiredLoadedData, desiredLoadedDataArray) {
    //this is passed to the server
    var windowDataRange = {
        fromDate: desiredLoadedData.fromDate,
        toDate: desiredLoadedData.toDate,
        rowIds :desiredLoadedData.rowIds
    };
    if(desiredLoadedDataArray.length == 0) {
      return;
    }
    //Generate a metadata to be passed to the server for storing the
    var requestMetaData = null;
     if(this.actionType != null) {
      this.actionTime = new Date().getTime();
      requestMetaData =  {
          actionType : this.actionType,
          actionTime : this.actionTime,
          actionData : this.actionData
      }
     }

    //Now Create the fetch data limit object for requesting the gantt data by sending  through  callBack function
    var fetchDataRequest = {
        windowDataRange		: windowDataRange,
        fetchDataRangeList	: desiredLoadedDataArray
    };
    if(requestMetaData != null) {
       fetchDataRequest.requestMetaData = JSON.stringify(requestMetaData);
    }
    //Now call the actual server call supplied by user as callback function
    plot.callDataLoadFunction(fetchDataRequest);


  };

  /**
   * The original call back method call triggered here
   */
   plot.callDataLoadFunction =  function callDataLoadFunction(fetchDataRequest) {
     if(plot == null || plot.getSeries() == null) {
       return;
     }
     /*var listOfObject = fetchDataRequest.fetchDataRangeList;
     for(var listIndex = 0; listIndex < listOfObject.length ; listIndex ++) {
       // printData( listOfObject[listIndex]);
     }*/
     var callBackFunction = plot.getSeries().callBackFunction;
     /*Note the following syntax for fetchDataObject
     var fetchDataRequest = {
          windowDataRange		: windowDataRange,
          fetchDataRangeList	: desiredLoadedDataArray
      };
     */
     var args = new Array();
     args.push(fetchDataRequest);

     if(callBackFunction) {
       eval(callBackFunction).apply(this, args);
     }
  };


  /**
   * to retrieve the missing rowIds from desired range for the range specified in the desiredLoadedData.
   * Considering the rows not in the currentLoaded range, and those rowIds need to fetch data are pushed to the missing array
   */
  plot.getMissingRowIds = function (desiredLoadedData) {
    var series = plot.getSeries();
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
              missingRowIds = plot.pushToArray(actualRowId, missingRowIds, series, YValue);
              }
           } else {
           missingRowIds = plot.pushToArray(actualRowId, missingRowIds, series ,YValue );
         }
       }
    }
    // console.log("Missing row Ids------------  ", missingRowIds);
    return missingRowIds;
  };



  plot.pushToArray = function(actualRowId, arrayToPush, series, YValue) {
    if(jQuery.inArray(actualRowId, plot.hiddenRows) == -1) {
      if(series.rootTreeNode != undefined) {
        // case when tree expandNodes are done : for on demand fetching of those discarded rows
        var row2DIndex = series.rowMap[actualRowId];
        if(!row2DIndex && (jQuery.inArray(actualRowId, arrayToPush) == -1)) {	// if not already added
          arrayToPush.push(actualRowId);
        }
      }

      /**
       * Load all rows in current loaded range. The wrap calculation can change in each  scenario.
       * So checking the yValue range will not fetch all the required rows
       */
      if(  jQuery.inArray(actualRowId, arrayToPush) == -1  && ((plot.currentLoadedData.yValueMax == -1) ||
            jQuery.inArray(actualRowId, plot.currentLoadedData.rowIds)  == -1 ) ) {
        arrayToPush.push(actualRowId);
      }
    }
    if(jQuery.inArray(actualRowId, arrayToPush) == -1 && jQuery.inArray(actualRowId, plot.newInsertedRows) != -1) {
      //check if not already there in array
        arrayToPush.push(actualRowId);

    }
    return arrayToPush;
  };
  /**
   * get visible rowIds that are in the desired loaded range.
   */
  plot.getDesiredRowIdsThatAreVisible = function(desiredLoadedData) {
    var visibleRowIds = plot.getVisibleRowIds(plot.currentLoadedData);
    var desiredVisibleRowIds =  [];

    // get  the visible rows  specified in the desiredLoadedData
     $.each(visibleRowIds , function(index, eachVisibleRowId) {
      if(jQuery.inArray(eachVisibleRowId, desiredLoadedData.rowIds) > -1) {
        desiredVisibleRowIds.push(eachVisibleRowId);
      }
    });

     return desiredVisibleRowIds;
  };

  /**
   * to retrieve the visible rowIds(not hidden) for the range specified in the desiredLoadedData
   */
  plot.getVisibleRowIds = function (currentLoadedData) {
    var series = plot.getSeries();
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
              if(jQuery.inArray(actualRowId, plot.hiddenRows) == -1) {
                if(jQuery.inArray(actualRowId, visibleRowIds) == -1) { // if not already added
                 visibleRowIds.push(actualRowId);
                }
               }
            }
         } else {
           if(jQuery.inArray(actualRowId, plot.hiddenRows) == -1) {// NORMAL ON DEMAND
             if(jQuery.inArray(actualRowId, visibleRowIds) == -1) { //if  not already added
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
   * to retrieve the rowIds for the range specified in the desiredLoadedData
   * The rowIds fetched will be only leaf rows if it is tree. else
   * all rowIds (and not hidden) will be added for fetchign in desired rowIds
   */
  plot.getRequestedRowIds = function (desiredLoadedData) {
    var series = plot.getSeries();
    var options = plot.getOptions();
    var requestedRowIds = [];
    var actualRowId;
    var yMin = Math.floor(desiredLoadedData.yValueMin);
    var yMax = Math.ceil(desiredLoadedData.yValueMax);
    for ( var rowId = yMin; rowId <= yMax; rowId++) {
       actualRowId = series.actualFilterRowIds[rowId];
       if(actualRowId != undefined) {
         if(options.yaxis.treeNode && options.yaxis.treeNode.displayData){  // if non leaf nodes also needs to display data
           if(jQuery.inArray(actualRowId, plot.hiddenRows) == -1) {
             requestedRowIds.push(actualRowId);
           }
         } else {
           if(series.rowIdLeafNodeMap != undefined) {
              var leafNode  = series.rowIdLeafNodeMap[actualRowId];//FOR TREE ON DEMAND ONLY FOR LEAF NODE
              //console.log("Requestign tree leaf node----", leafNode);
               if(leafNode && leafNode.isLeafNode) {
                 if(jQuery.inArray(actualRowId, plot.hiddenRows) == -1) {
                   requestedRowIds.push(actualRowId);
                   // console.log("Requested rowID--", actualRowId);
                  }
               }
            } else {
              if(jQuery.inArray(actualRowId, plot.hiddenRows) == -1) {// NORMAL ON DEMAND
                requestedRowIds.push(actualRowId);
               }

            }
         }

       }
    }

    return requestedRowIds;
  };

  function applyExtraFetchFactorAndCap(desiredLoadedData, currentVisibleYRange, currentVisibleDays) {
    var options = plot.getOptions();
    var EXTRA_FETCH_FACTOR_ROW  = options.interaction.extraFetchFactor.vertical;
    desiredLoadedData.yValueMin = desiredLoadedData.yValueMin - Math.floor(currentVisibleYRange * EXTRA_FETCH_FACTOR_ROW);
    desiredLoadedData.yValueMax = desiredLoadedData.yValueMax + Math.ceil(currentVisibleYRange * EXTRA_FETCH_FACTOR_ROW);
    //Again cap for any exceeding values
    capDesiredMinMaxActualYValueLimits(desiredLoadedData);	//considering wrap rows as well. Note the capping is with is actual here.

    var EXTRA_FETCH_FACTOR_COLUMN = options.interaction.extraFetchFactor.horizontal;
    desiredLoadedData.fromDate = resetViewPortTime(desiredLoadedData.fromDate - Math.floor(currentVisibleDays * one_day) * EXTRA_FETCH_FACTOR_COLUMN);
    desiredLoadedData.toDate = resetViewPortTime(desiredLoadedData.toDate + Math.ceil(currentVisibleDays * one_day) * EXTRA_FETCH_FACTOR_COLUMN);
    //Again cap for any exceeding values
    capDesiredMinMaxDayLimits(desiredLoadedData);
    //update the rowIds for this area also
    desiredLoadedData.rowIds =  plot.getRequestedRowIds(desiredLoadedData);
    // console.log("EXTRA FETCH CALCULATED desiredLoadedData", desiredLoadedData);
  }

  /**
   *
   * discard from currentLoadedMin to desiredLoadedMin,
   * discard from desiredLoadedMax to currentLoadedMax
   * discardIrreleventData from the data2DMatrix as well -
   */
  function discardIrreleventData(desiredLoadedData) {
    var rowAvailable = plot.getSeries().rowAvailable;
    var rowMap = plot.getSeries().rowMap;
    var actualRowId, dataMapRowIndex, dataMapColumnIndex;
     if(plot.currentLoadedData.yValueMin < desiredLoadedData.yValueMin ) {
       for( var index = plot.currentLoadedData.yValueMin; (index < desiredLoadedData.yValueMin && index <= plot.currentLoadedData.yValueMax) ; index++) {
         actualRowId =  plot.getSeries().actualFilterRowIds[index];//Desired and Currentloaded data are having actualRowId yValue
         //removing the items from dataMap & from 2Dmatrix also
         dataMapRowIndex = rowMap[actualRowId];
         if(dataMapRowIndex) {
           rowAvailable.push(dataMapRowIndex);//make this space in map available and add it to rowAvailable list
           removeDataMapItemsForRow(dataMapRowIndex);
           discardLongRangeData(dataMapRowIndex);
         }
         discardRowHeaderMap(actualRowId);
         rowMap[actualRowId] = null;
        //  console.log("discarding ", actualRowId);
      }
     } //if

     if(plot.currentLoadedData.yValueMax > desiredLoadedData.yValueMax ) {
       //ISRM-5635 >= removed  One extra data removal corrected
       for(var index = plot.currentLoadedData.yValueMax; index > desiredLoadedData.yValueMax && index >= plot.currentLoadedData.yValueMin ; index--) {
         actualRowId =  plot.getSeries().actualFilterRowIds[index];
        //removing the items from dataMap & from 2Dmatrix
         dataMapRowIndex = rowMap[actualRowId];
         if(dataMapRowIndex) {
           rowAvailable.push(dataMapRowIndex);//make this space in map available and add it to rowAvailable list
           removeDataMapItemsForRow(dataMapRowIndex);
           discardLongRangeData(dataMapRowIndex);
         }
         discardRowHeaderMap(actualRowId);
         rowMap[actualRowId] = null;
         // console.log("discarding ", actualRowId);
      }
     } //if

     //FOR DAYS & COLUMN MAP
    var columnAvailable = plot.getSeries().columnAvailable;
    var columnMap = plot.getSeries().columnMap;
    var one_day = 1000 * 60 * 60 * 24; //one day in millis

     if(new Date(plot.currentLoadedData.fromDate) < new Date(desiredLoadedData.fromDate) ) {
       for( index = plot.currentLoadedData.fromDate; index < desiredLoadedData.fromDate  &&  index <= plot.currentLoadedData.toDate; ) {
        //removing the items from from dataMap & from 2Dmatrix
         dataMapColumnIndex = columnMap[index];
         if(dataMapColumnIndex) {
           columnAvailable.push(dataMapColumnIndex);//make this space in map available and add it to rowAvailable list
           removeDataMapItemsForColumn(dataMapColumnIndex);
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
           removeDataMapItemsForColumn(dataMapColumnIndex);
         }
         columnMap[colindex] = null;
         colindex = resetViewPortTime(colindex - one_day);
      }
     } //if

  }

  // this rowId is the index of the 2D matrix where the rows are kept
  function discardLongRangeData(rowId) {
    plot.setLongRangeTaskIdArray(plot.getSeries(), rowId, null);
  }

  function discardRowHeaderMap(rowHeaderId) {
    var series = plot.getSeries();
    var rowHeaderMap = series.rowHeaderMap;
    var rowYvalueMap = series.rowYvalueMap; //[yvalue] = rowId
    var yValue = rowYvalueMap[rowHeaderId];
    rowHeaderMap[yValue] = null;
    var rowHeaderObject = series.rowIdRowObjectMap[rowHeaderId];
    if(rowHeaderObject != null && rowHeaderObject.isLeafNode) {
      series.rowIdRowObjectMap[rowHeaderId] = null;
       //clear data in rowHeaderObjects array as well
       var rowIdAttribute = series.gantt.rowIdAttribute;
       $.each(series.rowHeaderObjects , function(index, eachRowHeaderObject) {
            if(eachRowHeaderObject[rowIdAttribute] == rowHeaderId) { //ONLY SET DATA FOR LEAF NODES
              series.rowHeaderObjects[index].data = null;
            }
        });
       //clear data in series.rowIdLeafNodeMap[rowId]
       if( series.rowIdLeafNodeMap != undefined) {
         series.rowIdLeafNodeMap[rowHeaderId].data = null;
       }
    }
  }

  plot.discardHiddenRows = function(hideRowsList) {
    var eachHiddenRowId;
    var series = plot.getSeries();
    if(hideRowsList == null){
      return true;
    }
    for( var i= 0; i < hideRowsList.length ; i++) {
      eachHiddenRowId = hideRowsList[i];
       //removing the items from dataMap & from 2Dmatrix also
       var dataMapRowIndex = series.rowMap[eachHiddenRowId];
       if(dataMapRowIndex) {
         var rowAvailable = plot.getSeries().rowAvailable;
         rowAvailable.push(dataMapRowIndex);//make this space in map available and add it to rowAvailable list
         removeDataMapItemsForRow(dataMapRowIndex);
         discardLongRangeData(dataMapRowIndex);
         discardRowHeaderMap(eachHiddenRowId);
         series.rowMap[eachHiddenRowId] = null;

        // console.log("discarding eachHiddenRowId ", eachHiddenRowId);
       }
    }
  };


  function removeDataMapItemsForRow(rowId) {
    var series = plot.getSeries();
    var dataMap = plot.getDataMap();
    var DATA_MATRIX_COLUMN_SIZE = plot.getDataMatrixColumnSize();
    var taskIds;
    for ( var col = 0; col < DATA_MATRIX_COLUMN_SIZE; col++) {
      taskIds = plot.getNormalTaskIdArray(series, rowId, col) ;
      if(taskIds) {
        //remove these from actual dataMap(ie the id, task Map)
        for ( var int = 0; int < taskIds.length; int++) {
          delete dataMap[taskIds[int]];
        }
        plot.setNormalTaskIdArray(series, rowId, col, null); // to improve performace.

      }
    }

  }

  function removeDataMapItemsForColumn(columnId) {
    var dataMap = plot.getDataMap();
    var DATA_MATRIX_ROW_SIZE = plot.getDataMatrixRowSize();
    var taskIds, series = plot.getSeries();
    for ( var row = 0; row < DATA_MATRIX_ROW_SIZE; row++) {
      taskIds = plot.getNormalTaskIdArray(series, row, columnId );
      if(taskIds) {
        //remove these from actual dataMap(ie the id, object Map)
        for ( var int = 0; int < taskIds.length; int++) {
          delete dataMap[taskIds[int]];
        }
        plot.setNormalTaskIdArray(series, row, columnId, null );// to improve performace.
      }
    }

  }

   function resetViewPortTime(minTimeInMillis) {
          var viewPortMinTime = new Date(minTimeInMillis);
          viewPortMinTime.setUTCHours(0);
        viewPortMinTime.setUTCMinutes(0);
        viewPortMinTime.setUTCSeconds(0);
        viewPortMinTime.setUTCMilliseconds(0);
        return viewPortMinTime.getTime();
     }

  function adjustEndPointsForYaxis(desiredLoadedData) {
    var opts = plot.getOptions();
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

  function capDesiredMinMaxDayLimits(desiredLoadedData) {
    var series = plot.getSeries();
     var normalSpanMillis = (series.gantt.normalMaximumDaySpan) * 1000 * 60 * 60 * 24;
    var options = plot.getOptions(),
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

  var scrollRange = null;

  /**
   * Capping the desired loaded data with displayed yValue - normal scrollrange
   */
  function capDesiredMinMaxDisplayedYValueLimits(desiredLoadedData) {
    var options = plot.getOptions();
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
    adjustEndPointsForYaxis(desiredLoadedData); //CHECK IF NEEDED HERE
    //After capping retrieve the rowIds as well and set to object
  }

  /**
   * Capping the desired loaded data with actual yValue.
   */
  function capDesiredMinMaxActualYValueLimits(desiredLoadedData) {
    var options = plot.getOptions();
    scrollRange = options.yaxis.scrollRange;
    var capActualMinYValue=plot.getSeries().displayedRowIds[Math.ceil(scrollRange[0])];
    var capActualMaxYValue = plot.getSeries().displayedRowIds[Math.floor(scrollRange[1])];
    if (desiredLoadedData.yValueMin < capActualMinYValue) {
      desiredLoadedData.yValueMin = capActualMinYValue;
    }
    if (desiredLoadedData.yValueMax > capActualMaxYValue) {
      desiredLoadedData.yValueMax = capActualMaxYValue;
    }
    //After capping retrieve the rowIds as well and set to object

  }

  //////////////////////////////////////////////////////

      function bindEvents(plot, eventHolder) {
    var o = plot.getOptions();
    if (o.zoom.interactive) {
      if (o.zoom.trigger != null) {
        if (o.zoom.trigger == 'ctrl+mousewheel') {

          //NB: Chrome doesn't support CTrl Zoom you may need to trigger on any other event mousewheel
           eventHolder.mousewheel(plot.onCtrlMouseWheel);
        } if (o.zoom.trigger == 'pinchZoom') {

          //This will be handled in touch start, 	move and end events
        } else {
          eventHolder.on(o.zoom.trigger, plot.onZoomClick);
        }
      } else {
        eventHolder.mousewheel(onMouseWheel); //default behaviour
      }
    }

  }

      function gesterChange() {
        /*hoverItem = plot.getHoverItem();
        var offset = plot.offset();
        offset.left = plot.getPageX(e) - offset.left;
        offset.top = plot.getPageY(e) - offset.top;
        zoomOut =  e.scale<1; // when fingers are moved closer - decreases the size according to the e.scale
        zoomIn = e.scale>1; // when fingers are widened - increases the size according to the e.scale
            if (zoomOut) {
              console.log('plot.zoomOut({ center: c })' + c	);
              plot.zoomOut({ center: c });
            } else {
              console.log('plot.zoom({ center: c })' + c	);
                plot.zoom({ center: c });
            }*/
      }

      var initialDistance = 0;
      function pinchEnd(e) {
        //console.log("pinch End ");
        return false;
      }

     //Note : In this event , e.changedTouches.length = 1 and e.touches.length = 2
      function pinchStart(e) {
        initialDistance = 0;

        if(	e.touches && e.touches.length == 2) {
           initialDistance =
            Math.sqrt(
                (e.touches[0].pageX-e.touches[1].pageX) * (e.touches[0].pageX-e.touches[1].pageX) +
                  (e.touches[0].pageY-e.touches[1].pageY) * (e.touches[0].pageY-e.touches[1].pageY));

        }
      }
     //Do this zooming on pinchMove
    function pinchMove(e) {
       var currentDistance = 0;
      if(e.touches && e.touches.length == 2) {
        currentDistance = Math.sqrt(
              (e.touches[0].pageX-e.touches[1].pageX) * (e.touches[0].pageX-e.touches[1].pageX) +
              (e.touches[0].pageY-e.touches[1].pageY) * (e.touches[0].pageY-e.touches[1].pageY));

      }
      var c = plot.offset();
         c.left = plot.getPageX(e) - c.left;
         c.top = plot.getPageY(e) - c.top;

        if (initialDistance > currentDistance) {	//zoomOut

              plot.zoomOut({ center: c , event : e});
            } else {	            	 //ZOOM IN

                plot.zoom({ center: c , event: e});
            }

      return false;
    }

    //Extended this plugin to call  the zoom functions from outside . Default percentage will be taken from options of zoom
      $.zoomAction = function(e, flag) {
         onZoomClick(e, flag);
      };

      function onMouseWheel(e, delta) {
        e.preventDefault();
          onZoomClick(e, delta < 0);
          return false;
      }

      plot.onCtrlMouseWheel = function(e, delta) {
        if(e.ctrlKey &&  delta) {
          e.preventDefault();
          onZoomClick(e, delta < 0);
        }
      };

      //Exposed to the user
      plot.onZoomClick = onZoomClick;
      function onZoomClick(e, zoomOut, amount) {
          var c = plot.offset();
          c.left = plot.getPageX(e) - c.left;
          c.top = plot.getPageY(e) - c.top;

            if (zoomOut) {
              plot.zoomOut({
                amount: amount,
                center: c,
                event :  e,
                direction:'zoomOut'});

            } else {
                plot.zoom({
                  amount: amount,
                  center: c ,
                  event : e,
                  direction:'zoomIn' });

            }
      }

      plot.zoomOut = function (args) {

          if (!args) {
              args = {};
          }
          if (!args.amount) {
              args.amount = plot.getOptions().zoom.amount;
          }
          args.amount = 1 / args.amount;
          plot.zoom(args);
      };

      plot.zoom = function (args) {
        var opts = plot.getOptions();

          if (!args)
              args = {};

          var c = args.center,
              amount = args.amount || opts.zoom.amount,
              zoomPoint = args.zoomPoint || opts.zoom.zoomPoint,
              w = plot.width(), h = plot.height(), xf=0, yf=0;
              //console.log('zoomPoint -----------------' , zoomPoint);

          if (c) {
            if(zoomPoint == undefined || zoomPoint =='center')   { // or center
               c = { left: w / 2,  top: h / 2 }; // wrt center
               xf = c.left / w;
            }  else if( 'left' == zoomPoint) {
              c = { left: 0,  top: h / 2 };
              xf = c.left ;
            }
             yf = c.top / h;
          }

            var minmax = {
                  x: {
                      min: c.left - xf * w / amount,
                      max: c.left + (1 - xf) * w / amount
                  },
                  y: {
                      min: c.top - yf * h / amount,
                      max: c.top + (1 - yf) * h / amount
                  }
              };


          $.each(plot.getAxes(), function(_, axis) {
              if (axis.direction == 'y') {
               return; //no zooming for y axis
             }
             var opts = axis.options,
                  min = minmax[axis.direction].min,
                  max = minmax[axis.direction].max,
                  zr = opts.zoomRange;

              if (zr === false) // no zooming on this axis
                  return;

              min = axis.c2p(min);
              max = axis.c2p(max);
              if (min > max) {
                  // make sure min < max
                  var tmp = min;
                  min = max;
                  max = tmp;
              }
              var range = max - min;
              if (zr) {
                if(zr[0] != null && range < zr[0]) {
                  min = min + (range - zr[0])/2;
                  max = max - (range - zr[0])/2;
                  if(opts.max - opts.min == zr[0]) {
                    return;
                  }
                } else if (zr[1] != null && range > zr[1]) {
                  min = min + (range - zr[1])/2;
                  max = max - (range - zr[1])/2;
                  if(opts.max - opts.min == zr[1]) {
                    return;
                  }
                }
              }
              if(scrollRange !=  undefined || scrollRange == null)  {   //Note: pan range and scroll range are same
                //Check the limit of zoom within scrollRange
              scrollRange = opts.scrollRange;
              range = max - min;
              var scrollMin = scrollRange[0], scrollMax = scrollRange[1];
              if (min < scrollMin) {
                  min = scrollMin;
                  max = min + range;
                  if(max > scrollMax){
                    max = scrollMax;
                  }
                }else if (max > scrollMax) {
                  max = scrollMax;
                  min = max - range;
                  if(min < scrollMin){
                    min = scrollMin;
                  }
                }
             }
           opts.min = min;
           opts.max = max;
           plot.currentVisibleData = {
               fromDate : plot.resetViewPortTime(min),
               toDate : plot.resetViewPortTime(max)
           };
           //printData(plot.currentVisibleData);
       if(plot.horizontalScrollBar) {
          plot.horizontalScrollBar.setViewValues(min, max);
          plot.horizontalScrollBar.redrawScrollBox();
          plot.horizontalScrollBar.setInvokedCanvas(plot.getCanvas().id, args.event);
        }
          }); //loop


          //To set the yaxix range call this again
          var axes = plot.getAxes();
    plot.currentVisibleData.yValueMin = Math.floor(axes.yaxis.options.min);
    plot.currentVisibleData.yValueMax = Math.ceil(axes.yaxis.options.max);
    //call this function on all charts  here on zooom
    if(plot.horizontalScrollBar != null){
      plot.horizontalScrollBar.syncAllChartsWithDataFetch(args.event); //except the invoked one
        }
          plot.callFetchDataIfRequired();
          plot.setupGrid();

          var customEvent = jQuery.Event("plotzoom");
          customEvent.originalEvent = args.event;
         if (!args.preventEvent){
              plot.getPlaceholder().trigger(customEvent, [ plot , args]); // exposed arguments with direction to the event
         }
         plot.executeHooks(plot.hooks.bindZoomEvents, [plot, args]); //trigger hook if any registered

         plot.draw();
      };

      function shutdown(plot, eventHolder) {
          eventHolder.unbind(plot.getOptions().zoom.trigger, onZoomClick);
          eventHolder.unbind("mousewheel", onMouseWheel);
          if (panTimeout) {
              clearTimeout(panTimeout);
          }
      }

      plot.hooks.bindEvents.push(bindEvents);
      plot.hooks.shutdown.push(shutdown);
  }

  $.chronos.plugins.push({
      init: init,
      options: options,
      name: 'chronos.navigate',
      version: '6.10.10'
  });

})(jQuery);
