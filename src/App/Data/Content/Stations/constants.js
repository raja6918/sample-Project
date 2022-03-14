export const MAX_TERMINALS = 25;
export const TERMINAL_PATTERN = '^[a-zA-Z0-9]{1,2}$';

export const type = 'DATA.stations.type';

const validateCoordinates = limit => value => {
  const minLimit = limit * -1;
  const inputValue = parseFloat(value);
  return inputValue >= minLimit && inputValue <= limit;
};

export const extraFieldValidators = {
  longitude: validateCoordinates(180),
  latitude: validateCoordinates(90),
};
