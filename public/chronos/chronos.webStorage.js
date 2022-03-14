/*
 *  Copyright 2013-2014 IBS Software Services (P) Ltd. All Rights Reserved.
 *  This software is the proprietary information of IBS Software Services (P) Ltd.
 *  Use is subject to license terms.
 *	
 *	@author 	: A-4314 
 * 	@copyright  : 2014 IBS Software Services Pvt Ltd
 *	version		: 6.10.6
 *
 *  Plugin which has wrappers to deal with the webStorage.
 *  - has put/get/delete API's
 *  - deals with both LocalStorage && SessionStorage
 */

(function(jQuery)
{
	"use strict";

	jQuery.extend({
		putInSessionStore : function (key, value) {	
			sessionStorage.setItem (key, JSON.stringify(value));
		},

		getFromSessionStore : function (key) {
			return JSON.parse(sessionStorage.getItem (key));
		},

		deleteFromSessionStore : function (key) {
			return sessionStorage.removeItem (key);
		},

		putInLocalStore : function (key, value, override) {
			if('localStorage' in window && window['localStorage'] !== null) {
				var store = window.localStorage;
				var existingValue = $.getFromLocalStore (key);
				var isObject = function(value) {
                    if (typeof value === 'object' && Object.keys(value).length !== 0)
                    	return true;
                    else 
                    	return false;
                }
				if ((existingValue != undefined || existingValue != null) && isObject(existingValue) && (override == undefined)) {
					// merge the options
					$.extend(true, existingValue, value);
					value = existingValue;
				}
				store[iFlight_Module_Name + '_' + key] = JSON.stringify(value);
			} else {
				console.error ("Sorry, your browser does not support web storage...");
			}
		},
		
		getFromLocalStore : function (key) {
			if('localStorage' in window && window['localStorage'] !== null) {
				var store = window.localStorage;		
				if (store[iFlight_Module_Name + '_' + key] != undefined) {
					return JSON.parse(store[iFlight_Module_Name + '_' + key]);
				}
			} else {
				console.error ("Sorry, your browser does not support web storage...");
			}
		},

		deleteFromLocalStore : function (key) {
			if('localStorage' in window && window['localStorage'] !== null) {
				var store = window.localStorage;
				if (store[iFlight_Module_Name + '_' + key] != undefined) {
					console.log("LS key removed: ", key);
					return store.removeItem (iFlight_Module_Name + '_' + key);
				}
			} else {
				console.error ("Sorry, your browser does not support web storage...");
			}
		},
		getAllFromLocalStore : function(){
			if('localStorage' in window && window['localStorage'] !== null) {
				var store = window.localStorage;
				var actualKey;
				var localStoreObject = JSON.parse(store);
				var customObject = {};
				for(var key in localStoreObject) {
					actualKey = key;
					if(key.startsWith(iFlight_Module_Name + '_')) {
						actualKey = key.substring((iFlight_Module_Name + '_').length);
					}
					customObject[actualKey] = localStoreObject[key];
				}
				return customObject;	
			} else {
				console.error ("Sorry, your browser does not support web storage...");
			}
		}
	});
})(jQuery);