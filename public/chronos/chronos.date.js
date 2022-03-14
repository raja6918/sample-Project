/*  
 * Copyright 2013-2014 IBS Software Services (P) Ltd. All Rights Reserved.
 * This software is the proprietary information of IBS Software Services (P) Ltd.
 * Use is subject to license terms.
 *
 *  
 * @author A-2094, Maintained by TCC.
 * name 	: chronos-date
 * version	: 6.10.6
 * 
 */	
(function($) {
	//Global variables can be set here
	var isTimeZoneEnabled = null;
	var timeZoneValue = null;
	var plotOptions , timeZone;
	 /**
	  * plotObject 
	  * date : time in milliseconds
	  */	
	 
	function ChronosDate(dateInMilliseconds) {	
			var chronosDateObject = null;	
			if(isTimeZoneEnabled) {//timezone enabled date		
				//console.log("timezone enabled");
				chronosDateObject =  new timezoneJS.Date(dateInMilliseconds, timeZoneValue);
				chronosDateObject.isTimezonDate = true;
			} else { 		
				//console.log("timezone disabled");				
				chronosDateObject =  new Date(dateInMilliseconds);
				chronosDateObject.isTimezonDate = false;
			}					
			
			this.converToString = function() {
				if(isTimeZoneEnabled) { 		
					return chronosDateObject.toString();
				} else { 					
					return chronosDateObject.toUTCString();
				}		
			};
			this.getTime = function() {
					return chronosDateObject.getTime();
			};
			
			this.setTime = function(timeInMillis) {
				return chronosDateObject.setTime(timeInMillis);
			};
		
			this.getDate = function() {
				if(isTimeZoneEnabled) {
					return chronosDateObject.getDate();
				} else {
					return chronosDateObject.getUTCDate();
				}
			};
			this.getDay = function() {
				if(isTimeZoneEnabled) {
					return chronosDateObject.getDay();
				} else {
					return chronosDateObject.getUTCDay();
				}
			};
			
			this.getMonth = function() {
				if(isTimeZoneEnabled) {
					return chronosDateObject.getMonth();
				} else {
					return chronosDateObject.getUTCMonth();
				}
			};
			
			this.getSeconds = function() {
				if(isTimeZoneEnabled) {
					return chronosDateObject.getSeconds();
				} else {
					return chronosDateObject.getUTCSeconds();
				}
			};
			
			this.getMilliseconds = function() {
				if(isTimeZoneEnabled) {
					return chronosDateObject.getMilliseconds();
				} else {
					return chronosDateObject.getUTCMilliseconds();
				}
			};
			
			this.getMinutes = function() {
				if(isTimeZoneEnabled) {
					return chronosDateObject.getMinutes();
				} else {
					return chronosDateObject.getUTCMinutes();
				}
			};
			this.getHours = function() {
				if(isTimeZoneEnabled) {
					return chronosDateObject.getHours();
				} else {
					return chronosDateObject.getUTCHours();
				}
			};
			
			this.getFullYear = function() {
				if(isTimeZoneEnabled) {
					return chronosDateObject.getFullYear();
				} else {
					return chronosDateObject.getUTCFullYear();
				}
			};
			
			
			
			this.setDate = function(date) {
				if(isTimeZoneEnabled) {
					 chronosDateObject.setDate(date);
				} else {
					 chronosDateObject.setUTCDate(date);
				}
			};
			this.setDay = function(day) {
				if(isTimeZoneEnabled) {
					 chronosDateObject.setDay(day);
				} else {
					 chronosDateObject.setUTCDay(day);
				}
			};
			
			this.setMonth = function(month) {
				if(isTimeZoneEnabled) {
					 chronosDateObject.setMonth(month);
				} else {
					 chronosDateObject.setUTCMonth(month);
				}
			};
			
			this.setSeconds = function(seconds) {
				if(isTimeZoneEnabled) {
					 chronosDateObject.setSeconds(seconds);
				} else {
					 chronosDateObject.setUTCSeconds(seconds);
				}
			};
			
			this.setMilliseconds = function(milliseconds) {
				if(isTimeZoneEnabled) {
					 chronosDateObject.setMilliseconds(milliseconds);
				} else {
					 chronosDateObject.setUTCMilliseconds(milliseconds);
				}
			};
			
			this.setMinutes = function(minutes) {
				if(isTimeZoneEnabled) {
					 chronosDateObject.setMinutes(minutes);
				} else {
					 chronosDateObject.setUTCMinutes(minutes);
				}
			};
			this.setFullYear = function(year) {
				if(isTimeZoneEnabled) {
					 chronosDateObject.setFullYear(year);
				} else {
					 chronosDateObject.setUTCFullYear(year);
				}
			};	
			this.setHours = function(hours) {
				if(isTimeZoneEnabled) {
					chronosDateObject.setHours(hours);
				} else {
					chronosDateObject.setUTCHours(hours);
				}
			};
			
	} //function  
	  
	 $.chronosDate = function(plotObject, dateInMilliseconds) {		
		 	 
			 isTimeZoneEnabled = null;
			 if(plotObject != null) { 
				 plotOptions = plotObject.getOptions();
				 timeZone = plotOptions.timeZone;	
			 }
			initialize();
			//Actual creation of date			
			var dateObject  = null;			
			var chronosDate  = null;
			
			if(dateInMilliseconds != null) {
				dateInMilliseconds = Math.floor(dateInMilliseconds);
				chronosDate = new ChronosDate(dateInMilliseconds);
				chronosDate.isChronosDate = true;
			}
			
			function initialize() {
				//console.log(" timeZone " + timeZone);
				if(timeZone.value == null) {
					isTimeZoneEnabled =  false;
				} else {
					loadTimeZone(timeZone);
					isTimeZoneEnabled =  true;
					timeZoneValue = timeZone.value;
					$.chronosDate.timeZone = {
							enabled : isTimeZoneEnabled,
							value : timeZoneValue
					}
				}			 
				//console.log("After  isTimeZoneEnabled =============== " + isTimeZoneEnabled + " " + timeZone.value);
			}	
		return chronosDate;
	};	
	
	function loadTimeZone(timeZone) {				
    	timezoneJS.timezone.zoneFileBasePath = timeZone.zoneFileBasePath;
		timezoneJS.timezone.init({async:false});	    		 
    }
	
	$.convertToChronosDate = function( dateInMilliseconds) {	
		var chronosDate;
		if(dateInMilliseconds != null) {
			chronosDate = new ChronosDate(dateInMilliseconds);
			chronosDate.isChronosDate = true;
		}
		return chronosDate;
	}
	
	$.chronosDate.version = "6.10.6";
	$.chronosDate.name ="chronos.date";
	
})(jQuery);