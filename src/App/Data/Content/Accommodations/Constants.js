import {
  PER_CREW_MEMBER,
  USD,
} from './../../../../_shared/configurationEntities';

const headers = 'DATA.accommodations.headers';
export const OrderBy = 'name';
export const order = 'inc';
export const type = 'DATA.accommodations.type';
export const getHeaders = t => [
  {
    field: 'name',
    displayName: t(`${headers}.name`),
  },
  {
    field: 'stationsStr',
    displayName: t(`${headers}.stations`),
    sortCriteria: 'stationCodes',
  },
  {
    field: 'typeDisplayName',
    displayName: t(`${headers}.type`),
    sortCriteria: 'typeCode',
  },
  {
    field: 'costDisplay',
    displayName: t(`${headers}.nightlyRate`),
    sortCriteria: 'cost',
  },
  {
    field: 'capacity',
    displayName: t(`${headers}.rooms`),
  },
];

export const ACC_NAME_REGEX = '^[a-zA-Z0-9].*';
export const POSITIVE_NUM_REGEX = '^[0-9]+$';

export const DEFAULT_DURATION = 0;
export const DEFAULT_COST = 0;

export const INITIAL_ITEMS = 450;

export const prepareAccommodationTypes = accommodationTypes => {
  return accommodationTypes.map(type => ({
    value: type.code,
    display: type.name,
  }));
};

export const transitModel = () => {
  return {
    billingPolicyCode: PER_CREW_MEMBER,
    transportCost: DEFAULT_COST,
    transportCurrencyCode: USD,
    duration: DEFAULT_DURATION,
    extraTravelTimes: [],
  };
};

export const transitErrorModel = {
  transitTime: false,
  transitCost: false,
  extraTimes: null,
};
