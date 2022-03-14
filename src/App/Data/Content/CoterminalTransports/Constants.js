import { evaluateRegex } from '../../utils/utils.js';
import { boolToIconTransformer } from './../../../../components/GenericTable/transformers/';

const COTERMINAL_HEADERS = 'DATA.coterminalTransports.headers';

export const POSITIVE_INTEGERS_REGEX = /^\d+$/g;
export const NAME_REGEX = '^[a-zA-Z0-9].*';
export const COST_REGEX = /^(?=(\d|\.))(\d*)?(?:\.\d{1,2})?\s*$/g;

export const COTERMINAL_FORM = 'DATA.coterminalTransports.form';
export const COTERMINAL_TIMING = `${COTERMINAL_FORM}.section.timing`;
export const COTERMINAL_GENERAL = `${COTERMINAL_FORM}.section.general`;
export const COTERMINAL_COST = `${COTERMINAL_FORM}.section.cost`;
export const COTERMINAL_ERRORS = 'ERRORS.COTERMINAL_TRANSPORTS';

export const INITIAL_ITEMS = 150;

export const orderBy = 'departureStationCode';
export const order = 'inc';

export const type = 'DATA.coterminalTransports.type';

const MAX_INTEGER = 2147483647;

export const COTERMINAL_FIELDS = [
  'departureStationCode',
  'arrivalStationCode',
  'name',
  'typeCode',
  'capacity',
  'outboundDuration',
  'outboundConnectionTimeBefore',
  'outboundConnectionTimeAfter',
  'outboundFirstDepartureTime',
  'outboundLastDepartureTime',
  'cost',
  'currencyCode',
  'billingPolicyCode',
  'credit',
  'creditPolicyCode',
  'outboundExtraTravelTimes',
  'isBidirectional',
  'inboundLastDepartureTime',
  'inboundFirstDepartureTime',
  'inboundDuration',
  'inboundConnectionTimeAfter',
  'inboundConnectionTimeBefore',
  'inboundExtraTravelTimes',
];

export const REQUIRED_FIELDS = [
  'departureStationCode',
  'arrivalStationCode',
  'typeCode',
  'outboundDuration',
  'outboundFirstDepartureTime',
  'outboundLastDepartureTime',
  'outboundConnectionTimeBefore',
  'outboundConnectionTimeAfter',
  'cost',
  'credit',
  'currencyCode',
];

export const REQUIRED_INBOUND_FIELDS = [
  'inboundDuration',
  'inboundFirstDepartureTime',
  'inboundLastDepartureTime',
  'inboundConnectionTimeBefore',
  'inboundConnectionTimeAfter',
];

export const isRequiredPredicate = val => val !== '' && val !== null;

const isIntegerGreaterThanOrEqualToZeroPredicate = val =>
  evaluateRegex(POSITIVE_INTEGERS_REGEX, val) &&
  Number(val) >= 0 &&
  Number(val) <= MAX_INTEGER;

const costPredicate = val => evaluateRegex(COST_REGEX, val) && Number(val) >= 0;

export const customPredicates = {
  capacity: isIntegerGreaterThanOrEqualToZeroPredicate,
  outboundDuration: isIntegerGreaterThanOrEqualToZeroPredicate,
  outboundConnectionTimeAfter: isIntegerGreaterThanOrEqualToZeroPredicate,
  outboundConnectionTimeBefore: isIntegerGreaterThanOrEqualToZeroPredicate,
  name: val => evaluateRegex(NAME_REGEX, val),
  cost: costPredicate,
  credit: isIntegerGreaterThanOrEqualToZeroPredicate,
  inboundDuration: isIntegerGreaterThanOrEqualToZeroPredicate,
  inboundConnectionTimeAfter: isIntegerGreaterThanOrEqualToZeroPredicate,
  inboundConnectionTimeBefore: isIntegerGreaterThanOrEqualToZeroPredicate,
};

const buildOptions_DEPRECATED = (t, path) => {
  const optionsConfig =
    t(path, {
      returnObjects: true,
    }) || {};

  return Object.keys(optionsConfig).map(key => ({
    value: key,
    display: optionsConfig[key],
  }));
};

export const getHeaders = t => [
  {
    field: 'isBidirectional',
    displayName: '',
    transformer: boolToIconTransformer('compare_arrows'),
    noFilter: true,
    fixedWidth: true,
    cellStyle: {
      paddingLeft: 0,
      paddingRight: 0,
      width: '28px',
    },
  },
  {
    field: 'departureStationCode',
    displayName: t(`${COTERMINAL_HEADERS}.from`),
    cellStyle: {
      paddingLeft: '10px',
    },
  },
  {
    field: 'arrivalStationCode',
    displayName: t(`${COTERMINAL_HEADERS}.to`),
  },
  {
    field: 'name',
    displayName: t(`${COTERMINAL_HEADERS}.name`),
  },
  {
    field: 'typeDisplayName',
    displayName: t(`${COTERMINAL_HEADERS}.type`),
    sortCriteria: 'typeCode',
  },
];

export const prepareTransportBillingPolicies = billingPolicies => {
  return billingPolicies.map(billingPolicy => ({
    value: billingPolicy.code,
    display: billingPolicy.name,
  }));
};

export const prepareTransportBillingPolicies_flat_DEPRECATED = billingPolicies => {
  return billingPolicies.map(billingPolicy => billingPolicy.name);
};

export const prepareTransportTypes = transportTypes => {
  return transportTypes.map(transportType => ({
    value: transportType.code,
    display: transportType.name,
  }));
};

export const prepareCreditPolicies = creditPolicies => {
  return creditPolicies.map(creditPolicy => ({
    value: creditPolicy.code,
    display: creditPolicy.name,
  }));
};
