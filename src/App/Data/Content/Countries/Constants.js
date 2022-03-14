export const OrderBy = 'code';
export const order = 'inc';
export const endpoint = '/data/countries';

export const INITIAL_ITEMS = 350;

export const type = 'DATA.countries.type';

export const getHeaders = t => [
  {
    field: 'code',
    displayName: t('DATA.countries.headers.code'),
  },
  {
    field: 'name',
    displayName: t('DATA.countries.headers.name'),
  },
  {
    field: 'currencyCode',
    displayName: t('DATA.countries.headers.currency'),
  },
];

export const prepareCurrencies = currencies => {
  const options = currencies.map(currency => {
    return {
      value: currency.code,
      label: `${currency.name}, ${currency.code}`,
    };
  });

  return options;
};

export const getLabel = (suggestions, code) => {
  const data = suggestions.find(data => data.value === code);
  return data ? data.label : '';
};
