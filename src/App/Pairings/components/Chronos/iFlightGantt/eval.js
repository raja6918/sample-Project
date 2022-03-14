'use strict';
/**
 * This is an expresssion evaluator purely for iFlightGantt configuration expression evaluation
 *
 * Core guidelines for the generic safe evaluator over javascript eval:
 * 1. Prevent execution of arbitary javascript
 * 2. Prevent change of built-in object prototypes
 * 3. Prevent access to global variables like document and window
 * 4. Prevent any other potential security vulnerability
 */

import {
  getDate,
  getUTCDateForTimeInMilliseconds,
  getDefaultTimeFormat,
  getDefaultDateTimeFormat,
  formatMinutesToTime,
  formatDateTime,
} from './utils';

/**
 * Function to check safe data
 */
function isValidObject(obj) {
  return (
    obj &&
    obj instanceof Object && //valid object
    !(
      obj.constructor === obj && //not a fucntion
      obj.window === obj && //n0t widnow object
      obj.children &&
      (obj.nodeName || (obj.prop && obj.attr && obj.find)) && //not an element
      obj === Object
    )
  ); //not Object class itself
}

/**
 * Function to check safe expression
 */
function isValidExpression(exp) {
  return exp && (typeof exp === 'string' || exp instanceof String) && exp != '';
}

/**
 * Function that checks if expression safe to evaluate
 */
function assertion() {
  var expression = null;

  var contains = (strOrRegex, exp) => {
    let containsStr = false;
    for (const str of strOrRegex) {
      if (exp.search(str) !== -1) {
        containsStr = true;
        break;
      }
    }
    return containsStr;
  };

  /**
   * Generic Guidelines:
   * checkIfPrototypeUsed: prototype, delete
   * checkIfGlobalsUsed: document, window, eval, obj.window === obj
   * checkIfConditionalsUsed: if, else, else if, switch, case, default
   * checkIfLoopsUsed: for, do, while, in, of
   * checkIfRestrictedProperty: __defineGetter__, __defineSetter__, __lookupGetter__, __lookupSetter__, __proto__
   * checkIfRestrictedTypeUsed: Array, Boolean, JSON, RegExp, Object
   * checkIfJumpStatementUsed: break, continue, return, goto
   * checkIfRestrictedKeywordsUsed: try, catch, throw, throws, static, finally, debugger
   * Note: Certain keywords from above list are intioantionally allowed
   */
  function isSafeKeyword() {
    const restrictedKeywords = [
      '.prototype',
      '.__defineGetter__',
      '.__defineSetter__',
      '.__lookupGetter__',
      '.__lookupSetter__',
      '.__proto__',
      'delete',
      'document',
      'window',
      'Document',
      'Window',
      'eval',
      'throw',
      'throws',
      'break',
      'continue',
      'return',
      'goto',
      'constructor',
      'console',
      'alert',
      'confirm',
      'prompt',
      'with',
      'Object',
      'Function',
    ];
    return !contains(restrictedKeywords, expression);
  }

  /**
   * Generic Guidelines:
   * checkIfFunctionsUsed: function, class, instanceof, new, typeof, constructor, final, obj.constructor === obj,
   *  obj === Function.prototype.call || obj === Function.prototype.apply || obj === Function.prototype.bind
   * checkIfDOMElement: obj.children && (obj.nodeName || (obj.prop && obj.attr && obj.find)))
   * checkIfEscapeCharacterUsed: \n, \f, \r, \t, \v, \', ''
   * checkIfDataInitialized: =, :, var, let, const
   *  obj === (0).constructor || obj === (false).constructor || obj === ''.constructor ||
   *  obj === {}.constructor || obj === [].constructor || obj === Function.constructor
   * checkIfBlocksUsed: {}
   */
  function isSafeLietral() {
    let isSafe = true;

    const functionCalls = ['.call', '.apply', '.bind'];
    isSafe = !contains(functionCalls, expression);

    if (isSafe) {
      const escCharsOrBlock = ['\n ', '\f ', '\r ', '\t ', '\v ', '{', '}'];
      isSafe = !contains(escCharsOrBlock, expression);
    }

    if (isSafe) {
      const unsafeLiterals = ['var ', 'let ', 'const ', '[]']; //Regex to be added
      isSafe = !contains(unsafeLiterals, expression);
    }

    return isSafe;
  }

  this.checkIfSafeExpression = function(newExpression) {
    let isSafeExpression = false;
    if (!isValidExpression(newExpression)) {
      return isSafeExpression;
    }
    expression = newExpression;
    if (isSafeKeyword() && isSafeLietral()) {
      isSafeExpression = true;
    }
    return isSafeExpression;
  };
}

function safeEvalWrapper() {
  this.data = null;
  this.getCurrentDate = getDate;
  this.getDate = getDateObj;
  this.formatDateTime = formatDateTime;
  this.getUTCDateForTimeInMilliseconds = getUTCDateForTimeInMilliseconds;
  this.getDefaultTimeFormat = getDefaultTimeFormat;
  this.getDefaultDateTimeFormat = getDefaultDateTimeFormat;
  this.formatMinutesToTime = formatMinutesToTime;

  function getDateObj(unixTime) {
    return new Date(Math.abs(unixTime));
  }

  function transform(expression) {
    //attachWrapperObject
    var transformedExpression = expression;
    const safeAttributes = [
      'data',
      'getCurrentDate',
      'getDate',
      'formatDateTime',
      'getUTCDateForTimeInMilliseconds',
      'getDefaultTimeFormat',
      'getDefaultDateTimeFormat',
      'formatMinutesToTime',
    ];
    safeAttributes.forEach(safeAttribute => {
      let safeAttributeRegex = new RegExp(safeAttribute, 'g');
      transformedExpression = transformedExpression.replace(
        safeAttributeRegex,
        `wrapper.${safeAttribute}`
      );
    });
    return transformedExpression;
  }

  function evaluate(expression) {
    return new Function('wrapper', 'return ' + expression);
  }

  this.eval = function(expression) {
    let output;
    let assertions = new assertion();
    if (assertions.checkIfSafeExpression(expression)) {
      try {
        let safeWrapper = this;
        let safeExpression = transform(expression);
        output = evaluate(safeExpression)(safeWrapper);
      } catch (error) {
        console.log('ExecutionError:', error);
        return 0;
      }
    }
    return output; //return 0 if result undefined
  };

  this.destroy = function() {
    this.data = null;
    this.getCurrentDate = null;
    this.getDate = null;
    this.formatDateTime = null;
    this.getUTCDateForTimeInMilliseconds = null;
    this.getDefaultTimeFormat = null;
    this.getDefaultDateTimeFormat = null;
    this.formatMinutesToTime = null;
    this.eval = null;
    this.destroy = null;
  };

  //Object.seal(this);
}

/**
 * Returns evaluator
 *
 * @param {Object} data
 * @returns {string} safeEvalWrapper object
 */
function getEvaluator(data) {
  let evaluator = new safeEvalWrapper();
  evaluator.data = data;
  return evaluator;
}

/**
 * Javascript Expression evaluator
 *
 * @param {string} expression
 * @param {Object} data
 * @returns {string} evaluated result
 */
export function safeConfigEval(expression, data) {
  if (!isValidExpression(expression) || !isValidObject(data)) {
    console.log(`Configuration Error : Invalid expression or data.`);
    return 0;
  }
  let result;
  try {
    let configEvaluator = getEvaluator(data);
    result = configEvaluator.eval(expression);
    configEvaluator.destroy();
    configEvaluator = null;
  } catch (e) {
    console.log(`Configuration Error : ${e.message}`);
  }
  return result;
}
