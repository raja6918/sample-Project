export function checkAllAs(data, checked = true) {
  const newData = {};
  const keys = Object.keys(data);
  for (const key of keys) {
    newData[key] = { ...data[key], checked };
  }
  return newData;
}

export function dataToArray(data) {
  const arr = [];
  const keys = Object.keys(data);
  for (const key of keys) {
    arr.push(data[key]);
  }
  return arr;
}

export function prepareData(data, defaultValues) {
  const preparedData = {};
  for (const option of data) {
    preparedData[option.value] = {
      ...option,
      value: `${option.value}`,
      checked: defaultValues.includes(option.value),
    };
  }
  return preparedData;
}

export function selectedValues(data) {
  const arrayData = dataToArray(data);
  const arrValues = arrayData
    .filter(option => option.checked)
    .map(option => option.value);
  return arrValues;
}
