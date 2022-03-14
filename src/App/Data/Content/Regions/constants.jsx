export const orderBy = 'code';
export const order = 'inc';
export const endpoint = '/data/regions';
export const REGION_NAME_MAX_LENGTH = 50;
export const REGION_CODE_MAX_LENGTH = 15;
export const REGION_NAME_REGEX = '^[a-zA-Z].*';
export const REGION_CODE_REGEX = '^[a-zA-Z0-9]+?(((-|\\/)??)*?\\w*?)*?$';
export const INITIAL_ITEMS = 50;

export const type = 'DATA.regions.type';

export const getHeaders = t => [
  {
    field: 'code',
    displayName: t('DATA.regions.headers.code'),
  },
  {
    field: 'name',
    displayName: t('DATA.regions.headers.name'),
  },
];
