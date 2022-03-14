export const orderBy = 'code';
export const order = 'inc';

export const CURRENCY_CODE_MAX_LENGTH = 3;
export const CURRENCY_NAME_MAX_LENGTH = 50;
export const CURRENCY_EXCHANGE_RATE = 50;
export const CURRENCY_CODE_REGEX = `[A-Za-z]{${CURRENCY_CODE_MAX_LENGTH}}`;
export const CURRENCY_NAME_REGEX = '^[a-zA-Z0-9].*';
export const CURRENCY_RATE_REGEX = /^(?=.*[1-9])\d{1,6}(?:\.\d{1,6})?\s*$/g;

export const INITIAL_ITEMS = 250;

export const type = 'Currency';

export const getHeaders = t => [
  {
    field: 'code',
    displayName: t('DATA.currencies.headers.code'),
  },
  {
    field: 'name',
    displayName: t('DATA.currencies.headers.name'),
  },
  {
    field: 'exchangeRate',
    displayName: t('DATA.currencies.headers.exchangeRate'),
  },
];
