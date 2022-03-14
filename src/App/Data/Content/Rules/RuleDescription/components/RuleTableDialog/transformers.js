export const getFixedTableTransformer = (
  data,
  displayOnlyFields = [],
  keyField = 'code'
) => {
  const transformedData = {};

  if (Array.isArray(data)) {
    for (const item of data) {
      transformedData[item[keyField]] = { ...item };

      for (const key of displayOnlyFields) {
        delete transformedData[item[keyField]][key];
      }

      delete transformedData[item[keyField]][keyField];
      delete transformedData[item[keyField]]['_to'];
    }
  }

  return transformedData;
};

export const getFixedSimpleTableTransformer = (
  data,
  displayOnlyFields = [],
  keyField = 'code'
) => {
  const transformedData = {};

  if (Array.isArray(data)) {
    for (const item of data) {
      let value;
      //In case of fixed simple table we need to find the only field that is a parameter ie not a code (ie key) and not a display only field
      if (typeof item === 'object' && item !== null) {
        for (const key of Object.keys(item)) {
          if (key !== keyField && !displayOnlyFields.includes(key)) {
            value = item[key];
          }
        }
      }

      transformedData[item[keyField]] = value;
    }
  }

  return transformedData;
};

export const getSimpleListTableTransformer = (
  data,
  displayOnlyFields = [],
  keyField = 'code'
) => {
  const transformedData = [];

  if (Array.isArray(data)) {
    for (const item of data) {
      let value;
      //In case of fixed simple table we need to find the only field that is a parameter ie not a code (ie key) and not a display only field
      if (typeof item === 'object' && item !== null) {
        for (const key of Object.keys(item)) {
          if (key !== keyField && !displayOnlyFields.includes(key)) {
            value = item[key];
          }
        }
      }

      transformedData.push(value);
    }
  }

  return transformedData;
};

export const getListTableTransformer = (
  data,
  displayOnlyFields = [],
  keyField = 'code'
) => {
  const transformedData = [];

  if (Array.isArray(data)) {
    for (const item of data) {
      const newItem = { ...item }; // to avoid direct mutation of data attribute

      // remove key field and display only fields
      for (const key of displayOnlyFields) {
        delete newItem[key];
      }
      delete newItem[keyField];

      transformedData.push(newItem);
    }
  }

  return transformedData;
};

export const getMultidimensionalTableTransformer = (
  data,
  displayOnlyFields = [],
  keyField = 'code',
  exceptions
) => {
  const transformedData = {};
  const modifiedExpections = {};

  if (Array.isArray(data)) {
    for (const item of data) {
      transformedData[item[keyField]] = { ...item };

      for (const key of displayOnlyFields) {
        delete transformedData[item[keyField]][key];
      }

      delete transformedData[item[keyField]][keyField];
    }
  }

  if (Array.isArray(exceptions)) {
    for (const exception of exceptions) {
      modifiedExpections[exception.key] = exception.values;
    }
  }

  return { generic: transformedData, ...modifiedExpections };
};
