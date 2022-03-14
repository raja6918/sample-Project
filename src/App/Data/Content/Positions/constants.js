export const orderBy = 'order';
export const order = 'inc';
export const groupBy = 'type';
export const endpoint = '/data/positions';

export const type = 'DATA.positions.type';

export const getHeaders = t => [
  {
    field: 'order',
    displayName: t('DATA.positions.headers.order'),
    disableSort: true,
  },
  {
    field: 'code',
    displayName: t('DATA.positions.headers.code'),
    disableSort: true,
  },
  {
    field: 'name',
    displayName: t('DATA.positions.headers.name'),
    disableSort: true,
  },
];

export const preparePositionTypes = positionTypes => {
  return positionTypes.map(positionType => ({
    id: positionType.code,
    name: positionType.name,
  }));
};
