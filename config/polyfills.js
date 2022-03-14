import 'babel-polyfill';

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// fetch() polyfill for making API calls.
require('whatwg-fetch');

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object-assign');

// In tests, polyfill requestAnimationFrame since jsdom doesn't provide it yet.
// We don't polyfill it in the browser--this is user's responsibility.
if (process.env.NODE_ENV === 'test') {
  require('raf').polyfill(global);
}


// Array.from() IE polyfill
if(typeof Array.from === 'undefined'){
  Array.from = require('array-from');
}

// Array.fill() IE polyfill
if(typeof Array.fill === 'undefined'){
  Array.fill = require('array-fill');
}

// Element.closest IE polyfill
if(window.Element && !Element.prototype.closest){
	Element.closest = require('element-closest');
}

/* polyfill for smooth scroll in IE */
if (!Element.prototype.scroll) {
  require('smoothscroll-polyfill').polyfill();
}
