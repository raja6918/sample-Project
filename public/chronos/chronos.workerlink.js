/*
 * Copyright 2013-2014 IBS Software Services (P) Ltd. All Rights Reserved.
 * This software is the proprietary information of IBS Software Services (P) Ltd.
 * Use is subject to license terms.
 
 @author A-7934, Maintained by TCC.
 name : chronos-workerlink
 version: 6.10.6
 
Created plugin for maintaining web worker calls for chronos.
Web worker is a JavaScript that runs in the background, independently of other scripts, without affecting the performance of the page

*/

(function ($) {
	var options = {}; // no options
	var contextList = {}, chronosWorkerInit = false, context;
	
	function isFunction(value) {
    return typeof value === 'function';
	}
	
	function workerInit() {
		var base = this; //Reference to this plugin 
		//chronos worker invocation types
		var workerType = { METHOD_CALL: "METHOD_CALL", METADATA: "META" };

		// Initial function 
		base.init = function () {
			//chronos web worker creation
			base.chronosWorker = new Worker(`${window.base_url}${window.chronosWorkerPath}/chronos.worker.js`);
		};

		/* 
		call function with parameters methodName, args which is an array including callbackFn parameters, callbackFn and callToken
		*/
		base.call = function (methodName, args, callbackFn, callToken) {

			/*Context is a string appended with current time in milliseconds to callToken . 
			  If callToken is not available then context will be current time in milliseconds 
			  Once the message is posted from worker then the function is called.
			  In the function if the type of workerData matches with the Method call of Worker Type , currContext is obtained
			  then check whether the currContext matches workerData methodName and callbackFn passed in call method is a Function,
			  then currContext callbackFn [Function passed to call method ]is called . 
			*/
			context = callToken ? callToken : "";
			context = context + (new Date()).getTime();
			contextList[context] = {
				methodName: methodName,
				callbackFn: callbackFn,
				type: workerType.METHOD_CALL
			};

			if (!chronosWorkerInit) {
				chronosWorkerInit = true;
				base.chronosWorker.addEventListener('message', function (e) {
					var workerData = e.data;
					if (workerData.type === workerType.METHOD_CALL) {
						var currContext = contextList[workerData.context];
						if (currContext && workerData.methodName == currContext.methodName && isFunction(currContext.callbackFn)) {
							currContext.callbackFn(workerData.result);
						}
						delete contextList[workerData.context];
					}
				}, false);
			}

			//Message is posted and then addEventListener of chronos worker called 
			base.chronosWorker.postMessage({
				methodName: methodName,
				args: args,
				context: context,
				type: workerType.METHOD_CALL
			});

		}

		base.init();


		var sumArray = [8, 2], sumResult = 0;
		/* Sample call to getSum method using worker
		   Passing arguments getSum [Sample method name], parameters of the getSum function passed as an array , callbackFn and context in the call method 
		   In callbackFn sum is passed to sumResult
		*/
		base.call("getSum", sumArray, function (sum) {

			sumResult = sum;
			console.log("sum of args in getsum is ", sumResult);

		}, context);

	};

	//jQuery plugin
	jQuery.chronosworker = new workerInit();

})(jQuery);
