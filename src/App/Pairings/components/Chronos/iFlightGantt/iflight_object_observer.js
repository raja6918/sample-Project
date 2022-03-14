/**
 * Object observer for watching changes to object attributes.
 * This implementation makes use of ES6 proxies.
 */

'use strict';

const IFLIGHT_OBJ = Symbol('iFlight Object');
const IFLIGHT_OBJ_PROXY = Symbol('iFlight Object Proxy');

let iFlightObject = {};
iFlightObject.modelChangeCallback = null;
iFlightObject[IFLIGHT_OBJ] = true;

const iFlightObjSimpleWatcher = {
  set: function(obj, prop, val, rcvr) {
    let data = {
      object: obj,
      property: prop,
      value: val,
      receiver: rcvr,
      deepWatch: false,
    };
    return setObjectProperty(data);
  },
};

const iFlightObjDeepWatcher = {
  set: function(obj, prop, val, rcvr) {
    let data = {
      object: obj,
      property: prop,
      value: val,
      receiver: rcvr,
      deepWatch: true,
    };
    return setObjectProperty(data);
  },
};

function setObjectProperty(data) {
  let result = false;
  let obj = data.object,
    prop = data.property,
    value = data.value,
    receiver = data.receiver,
    deepWatch = data.deepWatch;

  /**
   * If the object property value is further an object, create a proxy for that too.
   */
  if (deepWatch && typeof value === 'object' && !value[IFLIGHT_OBJ_PROXY]) {
    if (typeof obj.modelChangeCallback !== 'undefined') {
      value.modelChangeCallback = obj.modelChangeCallback;
      value[IFLIGHT_OBJ_PROXY] = true;
      result = Reflect.set(
        obj,
        prop,
        new Proxy(value, iFlightObjDeepWatcher),
        receiver
      );
      checkPropAndCreateProxy(obj, prop, value);
    } else {
      console.error('Unable to create proxy for property {}', prop);
    }
  } else {
    result = Reflect.set(obj, prop, value, receiver);
  }

  if (result) {
    //execute if the set operation is successful
    obj.modelChangeCallback({
      obj: obj,
      prop: prop,
      val: value,
      receiver: receiver,
    });
  }

  return result;
}

function checkPropAndCreateProxy(parentObj, attribute, newObjVal) {
  Object.keys(newObjVal).forEach(key => {
    let value = newObjVal[key];
    if (
      value != null &&
      typeof value === 'object' &&
      !value[IFLIGHT_OBJ_PROXY]
    ) {
      value.modelChangeCallback = parentObj.modelChangeCallback;
      value[IFLIGHT_OBJ_PROXY] = true;
      Reflect.set(newObjVal, key, new Proxy(value, iFlightObjDeepWatcher));
      checkPropAndCreateProxy(newObjVal, key, value);
    }
  });
}

function createiFlightModelObject(props) {
  let callerContext = props.callerContext;
  let iFlightModelObject = Object.create(iFlightObject);
  iFlightModelObject.modelChangeCallback = async changeObj => {
    props.objectWatcher(changeObj, callerContext);
  };
  iFlightModelObject[IFLIGHT_OBJ_PROXY] = true;
  return new Proxy(
    iFlightModelObject,
    props.deepWatch ? iFlightObjDeepWatcher : iFlightObjSimpleWatcher
  );
}

export { createiFlightModelObject };
