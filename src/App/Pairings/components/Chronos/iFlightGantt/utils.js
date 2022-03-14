'use strict';
// Temporary fixing $rootScope depencency
export const $rootScope = {
  $apply: () => {}, // Temporary fixing $rootScope.$apply() in iFlightWorker,
};

/**
 * Determines if a reference is a `Function`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Function`.
 */
export function isFunction(value) {
  return typeof value === 'function';
}

/**
 * Determines if a reference is a `String`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `String`.
 */
export function isString(value) {
  return typeof value === 'string';
}

/**
 * Determines if a value is a date.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Date`.
 */
export function isDate(value) {
  return toString.call(value) === '[object Date]';
}

/**
 * Need description
 *
 * @param {Date} date
 * @returns {string} time
 */
export function getGanttTime(date) {
  let time = 0;
  const minsToMilliseconds = 60000;

  if (isDate(date)) {
    time = date.getTime() - date.getTimezoneOffset() * minsToMilliseconds;
  }
  return time;
}

let systemDate = new Date();

/**
 * To set aaplication date for reference
 *
 * @returns {Date} systemDate
 */
export function setDate(currDate) {
  // eslint-disable-next-line no-return-assign
  return (systemDate = currDate);
}

/**
 * To get application date
 *
 * @returns {Date} systemDate
 */
export function getDate() {
  return systemDate;
}

/**
 * Utility function to convert time in milliseconds to date object in UTC
 *
 * @param {number} timeInMillis
 * @param {boolean} keepSeconds
 * @returns {Date} nowUtc
 */
export function getUTCDateForTimeInMilliseconds(timeInMillis, keepSeconds) {
  let now;
  let nowUtc;
  if (timeInMillis) {
    now = new Date(timeInMillis);
    nowUtc = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    );
    if (!keepSeconds) {
      nowUtc.setSeconds(0);
    }
  }
  return nowUtc;
}

/**
 * Utility function to return gantt defaults based in module
 *
 * @param {string} module
 * @returns {object} currGanttDefaults
 */
export function getdefaultGanttForCurrentRole(module) {
  let currGanttDefaults;
  if (module === 'OPS') {
    currGanttDefaults = $rootScope.opsGanttDefaults;
  } else if (module === 'CTS') {
    currGanttDefaults = $rootScope.ctsGanttDefaults;
  }
  if (
    !currGanttDefaults ||
    (currGanttDefaults && Object.keys(currGanttDefaults).length === 0)
  ) {
    currGanttDefaults = {
      defaultGantt: 0,
    };
  }
  return currGanttDefaults;
}

/**
 * Setting default time fomat, date format
 * and date time format
 */
let timeFormat = 'HH:mm';
let dateFormat = 'dd-MMM-yyyy';
let dateTimeFormat = 'dd-MMM-yyyy HH:mm';

/**
 * Funtion to override default time format
 */
export function setDefaultTimeFormat(format) {
  // eslint-disable-next-line no-return-assign
  return (timeFormat = format);
}

/**
 * Funtion to return default time format
 */
export function getDefaultTimeFormat() {
  return timeFormat;
}

/**
 * Funtion to override default date format
 */
export function setDefaultDateFormat(format) {
  // eslint-disable-next-line no-return-assign
  return (dateFormat = format);
}

/**
 * Need description
 */
export function getUserInfo() {
  var userInfo = $rootScope.applicationvo.userinfo;
  // TODO check with TCC if they expect changes to be made in applicationVO once initapp is called
  // Object.freeze( userInfo );
  return userInfo;
}

/**
 * Funtion to return default date format
 */
export function getDefaultDateFormat() {
  return dateFormat;
}

/**
 * Funtion to override default date time format
 */
export function setDefaultDateTimeFormat(format) {
  // eslint-disable-next-line no-return-assign
  return (dateTimeFormat = format);
}

/**
 * Funtion to return default date time format
 */
export function getDefaultDateTimeFormat() {
  return dateTimeFormat;
}

/**
 * Function to format date time
 *
 * @param {*} dateObj
 * @param {string} targetFormat
 * @returns {string} Formatted date time
 */
export function formatDateTime(dateObj, targetFormat) {
  if (dateObj) {
    targetFormat = targetFormat || getDefaultDateTimeFormat();
    return dateObj.toString(targetFormat);
  }
  return null;
}

/**
 * Function to format minute to time - HH:MM
 *
 * @param {string|number} minutes
 * @returns {string} timeFormat in HH:MM
 */
export function formatMinutesToTime(minutes) {
  let negativeFlag = false;
  let timeFormat = '';
  const timeInMinutesStr = String(minutes);
  if (timeInMinutesStr && timeInMinutesStr.indexOf('-') === 0) {
    minutes = timeInMinutesStr.substring(1);
    negativeFlag = true;
  }
  const timeInMinutes = parseInt(minutes, 10);
  if (!isNaN(timeInMinutes) && timeInMinutes >= 0) {
    timeFormat = '00:00';
    let min = 0;
    min = parseInt(timeInMinutes % 60, 10);
    let hrs = 0;
    hrs = parseInt(timeInMinutes / 60, 10);
    if (hrs <= 9) {
      hrs = `0${hrs}`;
    }
    if (min <= 9) {
      min = `0${min}`;
    }
    timeFormat = `${hrs}:${min}`;
    if (negativeFlag) {
      timeFormat = `-${timeFormat}`;
    }
  }
  return timeFormat;
}

/**
 * Function to format date time string in a predefined
 * format to a given new format
 *
 * @param {string} dateTimeString
 * @param {string} srcFormat
 * @param {string} targetFormat
 * @returns {string} formatted date time string
 */
export function formatDateTimeString(dateTimeString, srcFormat, targetFormat) {
  let formattedDateTimeString;
  let millisec;
  let dateObj;
  const JSONDateStringFormat = 'yyyy-MM-ddTHH:mm:ss'; // foramt from Date.prototype.toJSON;
  const dateTimeArray = dateTimeString.split('T');
  if (dateTimeArray.length > 1) {
    // handle JSON format
    if (dateTimeArray[1].indexOf('.') > -1) {
      // check millisecond
      formattedDateTimeString = dateTimeString.substring(
        0,
        dateTimeString.lastIndexOf('.')
      );
      millisec = parseInt(
        dateTimeString.substring(dateTimeString.lastIndexOf('.') + 1),
        10
      );
    }
    dateObj = this.parseDateTime(formattedDateTimeString, JSONDateStringFormat);
  } else if (dateTimeString) {
    dateObj = this.parseDateTime(dateTimeString, srcFormat);
  }
  if (dateObj) {
    if (millisec) {
      dateObj.setMilliseconds(millisec);
    }
    return formatDateTime(dateObj, targetFormat);
  }
  console.error('Error while converting Date to string ');
}

/**
 * Function to parse a date time string in a given format
 *
 * @param {string} dateTimeString
 * @param {string} srcDateTimeFormat
 * @returns {Date} parsed date object
 */
export function parseDateTime(dateTimeString, srcDateTimeFormat) {
  let dateObj;
  // eslint-disable-next-line no-param-reassign
  srcDateTimeFormat = srcDateTimeFormat || getDefaultDateTimeFormat();
  if (dateTimeString) {
    // Earlier we use Date.parseExact. We replace it parse since parseExact is not working
    dateObj = Date.parse(dateTimeString, srcDateTimeFormat);
  }
  if (dateObj) {
    return dateObj;
  }
  console.error('Error while converting datetime to date object ');
}

/**
 * To delete array elements by providing indexes to remove.
 *
 * @param {Array} sourceArr
 * @param {Array} idxToRemove
 */
export function deleteArrayElemByIdx(sourceArr, idxToRemove) {
  for (var i = 0; i < idxToRemove.length; i++) {
    delete sourceArr[idxToRemove[i]];
  }

  var newArr = [];
  for (var i = 0; i < sourceArr.length; i++) {
    if (sourceArr[i]) {
      newArr.push(sourceArr[i]);
    }
  }
  return newArr;
}

/**
 *
 * @param {string} pageid
 * @param {string} defaultModule
 */
export function getModule(pageid, defaultModule) {
  var moduleName = null;
  if ($rootScope.moduleConfig.CTS.indexOf(pageid) > -1) {
    moduleName = 'CTS';
  } else if ($rootScope.moduleConfig.OPS.indexOf(pageid) > -1) {
    moduleName = 'OPS';
  }
  if (!moduleName && defaultModule) {
    moduleName = defaultModule;
    $rootScope.moduleConfig[moduleName].push(pageid);
  }
  return moduleName;
}

/**
 *  Shortcuts alias for document.querySelector
 */
export const query = document.querySelector.bind(document);

/**
 *  Shortcuts alias for document.querySelectorAll
 */
export const queryAll = document.querySelectorAll.bind(document);

/**
 *  Shortcuts alias for document.getElementById
 */
export const fromId = document.getElementById.bind(document);

/**
 *  Shortcuts alias for document.getElementsByClassName
 */
export const fromClass = document.getElementsByClassName.bind(document);

/**
 *  Shortcuts alias for document.getElementsByTagName
 */
export const fromTag = document.getElementsByTagName.bind(document);

// utility worker
if (window.Worker) {
  $rootScope.utilityWorker = new Worker(
    `${window.base_url}${window.workerPath}/utility_worker.js`
  );
}

// utility worker invocation types
const workerType = { METHOD_CALL: 'METHOD_CALL', METADATA: 'META' };
const contextList = {};
let utilityWorkerInit = false;

export const iFlightWorker = {
  call: (methodName, args, callbackFn, callToken) => {
    let context = callToken.$id ? callToken.$id : callToken;
    context += new Date().getTime();
    contextList[context] = {
      methodName,
      callbackFn,
      type: workerType.METHOD_CALL,
    };

    if (!utilityWorkerInit) {
      utilityWorkerInit = true;
      $rootScope.utilityWorker.addEventListener(
        'message',
        function(e) {
          const workerData = e.data;
          if (workerData.type === workerType.METHOD_CALL) {
            const currContext = contextList[workerData.context];
            if (
              currContext &&
              // eslint-disable-next-line eqeqeq
              workerData.methodName == currContext.methodName &&
              isFunction(currContext.callbackFn)
            ) {
              currContext.callbackFn(workerData.result);
            }
            delete contextList[workerData.context];
          }
          if (!$rootScope.$$phase) {
            $rootScope.$apply();
          }
        },
        false
      );
    }

    $rootScope.utilityWorker.postMessage({
      methodName,
      args,
      context,
      type: workerType.METHOD_CALL,
    });
  },
};
