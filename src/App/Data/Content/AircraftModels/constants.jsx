export const orderBy = 'code';
export const order = 'inc';
export const endpoint = '/data/aircrafts/models';
export const MODEL_NAME_MAX_LENGTH = 50;
export const MODEL_CODE_MAX_LENGTH = 10;
export const MODEL_NAME_REGEX = '^[a-zA-Z0-9].*';
export const MODEL_CODE_REGEX = `^[a-zA-Z0-9]{1,${MODEL_CODE_MAX_LENGTH}}$`;

export const INITIAL_ITEMS = 50;

export const type = 'DATA.aircraftModels.type';

export const getHeaders = t => [
  {
    field: 'code',
    displayName: t('DATA.aircraftModels.headers.model'),
  },
  {
    field: 'name',
    displayName: t('DATA.aircraftModels.headers.name'),
  },
];
