import pick from 'lodash/pick';
import { getFormattedTime } from '../../../../utils/dates';

import {
  REQUIRED_FIELDS,
  REQUIRED_INBOUND_FIELDS,
  COTERMINAL_GENERAL,
  COTERMINAL_FIELDS,
  isRequiredPredicate,
  customPredicates,
} from './Constants';

import {
  PER_CREW_MEMBER,
  ALL,
  USD,
} from '../../../../_shared/configurationEntities';

export const hasError = errors => {
  return Object.values(errors).reduce((hasPrevErrors, hasError) => {
    return hasPrevErrors || hasError;
  }, false);
};

export const formatObjectToArray = obj => Object.values(obj);

export const isRequiredField = (field, fieldsToCheck) =>
  fieldsToCheck.indexOf(field) !== -1;

export const getCustomPredicate = field => {
  return customPredicates[field] || (() => true);
};

export const wereAllFieldsFilled = state => {
  let fieldsToCheck = [...REQUIRED_FIELDS];
  if (state.isBidirectional) {
    fieldsToCheck = [...REQUIRED_FIELDS, ...REQUIRED_INBOUND_FIELDS];
  }

  return COTERMINAL_FIELDS.reduce((acc, field) => {
    if (!acc) return acc;

    const value = state[field];
    const _isRequired = isRequiredField(field, fieldsToCheck);
    const isEmptyField = !isRequiredPredicate(value);

    if (_isRequired && isEmptyField) return false;

    const customPredicate = getCustomPredicate(field);

    const hasValidValue = !isEmptyField ? customPredicate(value, state) : true;
    return acc && hasValidValue;
  }, true);
};

export const getDefaultName = (t, state) => {
  const stations = [state.arrivalStationCode];
  if (state.departureStationCode) stations.unshift(state.departureStationCode);

  return t(`${COTERMINAL_GENERAL}.defaultName`, {
    route: ` ${stations.join('-')}`,
  }).trim();
};

export const getDefaultEntity = () => {
  return {
    departureStationCode: '',
    arrivalStationCode: '',
    name: '',
    typeCode: '',
    capacity: '',
    outboundFirstDepartureTime: getFormattedTime('00:00'),
    outboundLastDepartureTime: getFormattedTime('23:59'),
    outboundDuration: '',
    outboundConnectionTimeAfter: '0',
    outboundConnectionTimeBefore: '0',
    cost: 0,
    currencyCode: USD,
    billingPolicyCode: PER_CREW_MEMBER,
    credit: 0,
    creditPolicyCode: ALL,
    outboundExtraTravelTimes: [],
    isBidirectional: false,
    inboundLastDepartureTime: getFormattedTime('23:59'),
    inboundFirstDepartureTime: getFormattedTime('00:00'),
    inboundDuration: '',
    inboundConnectionTimeAfter: '0',
    inboundConnectionTimeBefore: '0',
    inboundExtraTravelTimes: [],
  };
};

export const getDateFromMinutes_DEPRECATED = minutes => {
  if (!minutes && minutes !== 0) return '';

  const date = new Date(2010, 10, 10, 0, 0, 0);
  date.setMinutes(minutes);
  return date;
};

export const getMinutesFromDate = date => {
  if (!date) return 0;

  return date.getHours() * 60 + date.getMinutes();
};

const formatTimeToDate = time => {
  const [getHours, getMinutes] = time.split(':');
  const date = new Date('10/10/2010').setHours(getHours);
  const time2 = new Date(date);

  time2.setMinutes(getMinutes);

  return time2;
};

export const getInverseExtraTimeArray = extraTravelTimes => {
  const newExtraTimesArray = [];
  for (let i = 0; i < extraTravelTimes.length; i++) {
    newExtraTimesArray[i] = {
      extraTime: extraTravelTimes[i].duration,
      startTime: formatTimeToDate(extraTravelTimes[i].startTime),
      endTime: formatTimeToDate(extraTravelTimes[i].endTime),
    };
  }
  return newExtraTimesArray;
};

export const mapEntityToState = originalEntity => {
  const entity = { ...originalEntity };

  if (!entity) return getDefaultEntity();

  entity.outboundDuration = entity.outboundTiming.duration;
  entity.outboundConnectionTimeBefore =
    entity.outboundTiming.connectionTimeBefore;
  entity.outboundConnectionTimeAfter =
    entity.outboundTiming.connectionTimeAfter;

  if (entity.isBidirectional) {
    entity.inboundDuration = entity.inboundTiming.duration;
    entity.inboundConnectionTimeBefore =
      entity.inboundTiming.connectionTimeBefore;
    entity.inboundConnectionTimeAfter =
      entity.inboundTiming.connectionTimeAfter;
    entity.inboundFirstDepartureTime = getFormattedTime(
      entity.inboundTiming.firstDepartureTime
    );
    entity.inboundLastDepartureTime = getFormattedTime(
      entity.inboundTiming.lastDepartureTime
    );
    entity.inboundExtraTravelTimes = getInverseExtraTimeArray(
      entity.inboundTiming.extraTravelTimes
    );
  }

  entity.creditPolicyCode = entity.creditPolicyCode
    ? entity.creditPolicyCode
    : ALL;

  return {
    ...pick(entity, COTERMINAL_FIELDS),
    outboundFirstDepartureTime: getFormattedTime(
      entity.outboundTiming.firstDepartureTime
    ),
    outboundLastDepartureTime: getFormattedTime(
      entity.outboundTiming.lastDepartureTime
    ),
    outboundExtraTravelTimes: getInverseExtraTimeArray(
      entity.outboundTiming.extraTravelTimes
    ),
  };
};

export const getDefaultErrors = () => {
  return {
    departureStationCode: false,
    arrivalStationCode: false,
    name: false,
    type: false,
    capacity: false,
    outboundDuration: false,
    outboundConnectionTimeAfter: false,
    outboundConnectionTimeBefore: false,
    cost: false,
    currencyCode: false,
    costBasis: false,
    credit: false,
    creditPolicyCode: false,
    outboundExtraTimes: false,
    inboundDuration: false,
    inboundConnectionTimeAfter: false,
    inboundConnectionTimeBefore: false,
    inboundExtraTimes: false,
  };
};

export const areValidExtraTimes = extraTimes => {
  if (extraTimes.length === 0) return true;

  for (let i = 0; i < extraTimes.length; i++) {
    if (
      extraTimes[i].extraTime === '' ||
      isNaN(extraTimes[i].extraTime) ||
      parseFloat(extraTimes[i].extraTime) < 0
    ) {
      return false;
    }
  }

  return true;
};

export const getStationName = (stations, stationCode) => {
  const station = stations.find(station => station.code === stationCode);
  return station ? station.name : '';
};
