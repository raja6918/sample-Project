import moment from 'moment';

export function getStringHours(date) {
  const momentDate = moment(date);
  const hoursWithMinutesStr = momentDate.format('HH:mm');
  return hoursWithMinutesStr;
}

export function numberOrNull(value) {
  const returnValue = null;
  const isFalsy = value === '' || value === null || value === undefined;
  if (!isFalsy) {
    return +value;
  }
  return returnValue;
}

export function arrayMove(array, from, to) {
  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
  return array;
}

export function getInlineErrorMessage(event, inlineError) {
  return inlineError && event.target.name !== Object.keys(inlineError.errors)[0]
    ? inlineError.inlineErrorMessage
    : null;
}

export function mergeArrayObjects(arrayA, arrayB, id = 'positionCode') {
  if (!arrayA || !arrayB) return [];

  const mergedArrays = arrayA.map(position => {
    const positionCode = position[id];
    const balance = arrayB.find(balance => balance[id] === positionCode);
    return { ...position, ...balance };
  });
  return mergedArrays;
}
