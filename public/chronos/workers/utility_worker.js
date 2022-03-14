importScripts('./underscore-min.js');

// utility worker invocation types
var workerType = { METHOD_CALL: 'METHOD_CALL', METADATA: 'META' };

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
}

// Registering onMessage processor
self.addEventListener(
  'message',
  function (workerMsg) {
    var data = workerMsg.data;

    if (data.type === workerType.METHOD_CALL) {
      if (isFunction(self[data.methodName])) {
        var result = self[data.methodName](data.args);
        postMessage({
          type: data.type,
          context: data.context,
          methodName: data.methodName,
          result: result,
        });
      }
    } else if (data.type === workerType.METADATA) {
      //handle META
    }
  },
  false
);

//Register error handler
self.addEventListener(
  'error',
  function (e) {
    console.log(e);
  },
  false
);

function modifyForGantt(args) {
  var response = args[0],
    interationRestrictMap = args[1],
    headerType = args[2],
    plotLabel = args[3],
    pageId = args[4];

  var currentData = [];
  var masterGanttData = {};

  _.each(response.ganttHeader, function (headerInfo, key) {
    headerInfo.ganttItemType = headerType;
  });
  var ganttItemTypeList = [];
  _.each(response.ganttData, function (ganttData, key) {
    _.each(ganttData, function (newData, typeKey) {
      newData.ganttItemType = key;

      if (ganttItemTypeList.indexOf(key) == -1) {
        ganttItemTypeList.push(key);
      }

      // set interation Restrictions
      if (interationRestrictMap && interationRestrictMap.hasOwnProperty(key)) {
        var actions = interationRestrictMap[key].actions;
        if (_.contains(actions, 'dragOrDrop')) {
          newData.draggable = false;
        }
        if (_.contains(actions, 'itemResize')) {
          newData.resizable = false;
        }
        if (_.contains(actions, 'overlap')) {
          newData.wrappable = false;
        }
      }
      if (newData.modifyPermission == false) {
        newData.draggable = false;
        newData.resizable = false;
      }
      currentData.push(newData);
    });
  });

  masterGanttData[response.ganttDataType] = {
    data: currentData,
    rowHeaders: response.ganttHeader,
    requestMetaData: response.requestMetaData,
    additionalFetch: response.additionalFetch,
  };
  masterGanttData.isTree = response.isTree;
  masterGanttData.ganttItemTypeList = ganttItemTypeList;
  masterGanttData.updateDataMap = response.updateDataMap;
  return masterGanttData;
}

function modifyForUnassignedGantt(args) {
  var response = args[0],
    interationRestrictMap = args[1],
    ganttHeader = args[2],
    plotLabel = args[3],
    pageId = args[4];

  var currentData = [];
  var masterGanttData = {};
  var ganttItemTypeList = [];
  _.each(response.ganttData, function (ganttData, key) {
    _.each(ganttData, function (item, typeKey) {
      item.ganttItemType = key;

      if (ganttItemTypeList.indexOf(key) == -1) {
        ganttItemTypeList.push(key);
      }

      if (interationRestrictMap.hasOwnProperty(key)) {
        _.each(interationRestrictMap[key], function (value, key) {
          if (_.contains(value.action, 'dragOrDrop')) {
            item.draggable = false;
          }
          if (_.contains(value.action, 'itemResize')) {
            item.resizable = false;
          }
          if (_.contains(actions, 'overlap')) {
            item.wrappable = false;
          }
        });
      }
      if (!item.modifyPermission) {
        item.draggable = false;
        item.resizable = false;
      }
      currentData.push(item);
    });
  });
  masterGanttData[response.ganttDataType] = {
    data: currentData,
    rowHeaders: ganttHeader,
    requestMetaData: response.requestMetaData,
    additionalFetch: response.additionalFetch,
  };
  masterGanttData.isTree = response.isTree;
  masterGanttData.ganttItemTypeList = ganttItemTypeList;
  masterGanttData.updateDataMap = response.updateDataMap;
  return masterGanttData;
}
