import { extraFieldValidators } from './constants';

function arrayUnique(array) {
  return [...new Set(array)];
}

export function terminalsCleansing(terminals) {
  if (!terminals) return [];

  const cleanedTerminals = terminals
    .split(',')
    .map(terminal => terminal.trim().toUpperCase())
    .filter(terminal => terminal !== '');

  const uniqueTerminals = arrayUnique(cleanedTerminals);

  return uniqueTerminals;
}

export const checkErrorFlags = errors => {
  let isDirty = false;
  for (const field in errors) {
    if (errors[field]) {
      isDirty = true;
      break;
    }
  }
  return isDirty;
};

export const cleanCoordinateValue = value => {
  const fixedValue = value
    .split('.')
    .map(num => num.substr(0, 6))
    .join('.');

  return fixedValue;
};

export const validateFields = (field, value) => {
  return extraFieldValidators[field]
    ? extraFieldValidators[field](value)
    : true;
};

export const checkEmptyFilter = filters => {
  return typeof filters === 'object'
    ? Object.values(filters).filter(a => a !== '').length
    : 0;
};

export const getLabel = (suggestions, code) => {
  const data = suggestions.find(data => data.value === code);
  return data ? data.label : '';
};
