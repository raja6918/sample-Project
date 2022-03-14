export const orderBy = 'code';
export const order = 'inc';
export const endpoint = '/data/aircrafts';

export const INITIAL_ITEMS = 50;

export const type = 'DATA.aircraft.type';

export const getHeaders = t => [
  {
    field: 'code',
    displayName: t('DATA.aircraft.headers.type'),
  },
  {
    field: 'modelCode',
    displayName: t('DATA.aircraft.headers.model'),
  },
  {
    field: 'name',
    displayName: t('DATA.aircraft.headers.name'),
  },
  {
    field: 'restFacility',
    displayName: t('DATA.aircraft.headers.restFacility'),
    sortCriteria: 'restFacilityCode',
  },
  {
    field: 'standardComplement',
    displayName: t('DATA.aircraft.headers.standardComplement'),
    disableSort: true,
  },
];

export const prepareRestFacilities = restFacilities => {
  return restFacilities.map(restFacility => ({
    id: restFacility.code,
    name: restFacility.name,
  }));
};

export const prepareModels = models => {
  return models.data.map(model => ({
    id: model.code,
    name: model.name,
  }));
};
