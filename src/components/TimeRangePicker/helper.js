export const setNativeValue = (element, value) => {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(
    prototype,
    'value'
  ).set;
  if (valueSetter && valueSetter !== prototypeValueSetter)
    prototypeValueSetter.call(element, value);
  else valueSetter.call(element, value);
};

export const addEventsToInputs = (eleRef, value) => {
  setNativeValue(eleRef, value);
  eleRef.dispatchEvent(new Event(`input`, { bubbles: true }));
};

export const spliter = (value, seperator = '-') => {
  return value.replace(' ', '').split(seperator);
};
