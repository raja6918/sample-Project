export const orderBy = 'name';
export const order = 'inc';

export const type = 'DATA.crewBases.type';

export const INITIAL_ITEMS = 100;

export const getHeaders = t => [
  {
    field: 'name',
    displayName: t('DATA.crewBases.headers.name'),
  },
  {
    field: 'countryDisplayName',
    displayName: t('DATA.crewBases.headers.country'),
  },
  {
    field: 'stations',
    displayName: t('DATA.crewBases.headers.stations'),
    sortCriteria: 'stationCodes',
  },
];
