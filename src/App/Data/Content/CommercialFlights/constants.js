import { evaluateRegex } from '../../utils/utils.js';
import {
  operationDaysTransformer,
  dateFormatTransformer,
} from './../../../../components/GenericTable/transformers';
import DateRangePicker from '../../../../components/DateRangePicker';
import TimeRangePicker from '../../../../components/TimeRangePicker';

export const translationPath = 'DATA.commercialFlights';
export const COMMERCIAL_FLIGHTS_FORM = 'DATA.commercialFlights.form';
export const COMMERCIAL_FLIGHTS_GENERAL = `${COMMERCIAL_FLIGHTS_FORM}.section.general`;
export const COMMERCIAL_FLIGHTS_CREW = `${COMMERCIAL_FLIGHTS_FORM}.section.crew`;
export const COMMERCIAL_FLIGHTS_TIME = `${COMMERCIAL_FLIGHTS_FORM}.section.extraTime`;
export const COMMERCIAL_FLIGHTS_INFO = `${COMMERCIAL_FLIGHTS_FORM}.section.extraInformation`;
export const COMMERCIAL_FLIGHTS_ERRORS = 'ERRORS.COMMERCIAL_FLIGHTS';

export const POSITIVE_INTEGERS_REGEX = /^\d+$/g;
export const NAME_REGEX = '^[a-zA-Z0-9].*';
export const CHAR_REGEX = '^[a-zA-Z].*';
export const FLIGHT_DESIGNATOR_REGEX = '^[a-zA-Z]{2,3}[0-9]{1,4}$';
export const VALID_STRING_REGEX = '^[a-zA-Z0-9]+?(.)*?$';
export const AIRLINE_CODE_REGEX = '^[a-zA-Z]{2,3}$';
export const AIRCRAFTTYPE_CODE_REGEX = '^[a-zA-Z0-9]{3,4}$';
export const CABIN_CONFIG_REGEX = '^[a-zA-Z0-9]+$';

export const orderBy = 'flightDesignator';
export const order = 'inc';

const UTC = 'UTC';
export const TIME_REFERENCE = UTC;
export const INITIAL_ITEMS = 50;

export const type = 'DATA.commercialFlights.type';

export const getHeaders = (t, scenarioStartDate) => [
  {
    field: 'flightDesignator',
    displayName: t('DATA.commercialFlights.headers.flightDesignator'),
    disableFilter: false,
  },
  {
    field: 'departureStationCode',
    displayName: t('DATA.commercialFlights.headers.departureStationCode'),
    disableFilter: false,
  },
  {
    field: 'arrivalStationCode',
    displayName: t('DATA.commercialFlights.headers.arrivalStationCode'),
    disableFilter: false,
  },
  {
    field: 'startTime',
    displayName: t('DATA.commercialFlights.headers.startTime'),
    disableFilter: false,
    component: TimeRangePicker,
    filterTransformer: date => date.replace(' - ', '-'),
  },
  {
    field: 'endTime',
    displayName: t('DATA.commercialFlights.headers.endTime'),
    disableFilter: false,
    component: TimeRangePicker,
    filterTransformer: date => date.replace(' - ', '-'),
  },
  {
    field: 'operationDays',
    displayName: t('DATA.commercialFlights.headers.operationDays'),
    transformer: operationDaysTransformer,
    disableSort: true,
    disableFilter: true,
  },
  {
    field: 'firstDeparture',
    displayName: t('DATA.commercialFlights.headers.firstDepartureDate'),
    disableFilter: false,
    filterType: 'YYYY-MM-DD',
    component: DateRangePicker,
    componentProps: { startupDate: scenarioStartDate },
    filterTransformer: date => date.replace(' - ', ':'),
    transformer: dateFormatTransformer,
  },
  {
    field: 'lastDeparture',
    displayName: t('DATA.commercialFlights.headers.lastDepartureDate'),
    disableFilter: false,
    filterType: 'YYYY-MM-DD',
    component: DateRangePicker,
    componentProps: { startupDate: scenarioStartDate },
    filterTransformer: date => date.replace(' - ', ':'),
    transformer: dateFormatTransformer,
  },
  {
    field: 'aircraftType',
    displayName: t('DATA.commercialFlights.headers.aircraftTypeCode'),
    disableFilter: false,
  },
  {
    field: 'aircraftConfigurationVersion',
    displayName: t(
      'DATA.commercialFlights.headers.aircraftConfigurationVersion'
    ),
    disableFilter: false,
  },
];

export const COMMERCIAL_FLIGHTS_FIELDS = [
  'flightNumber',
  'airlineCode',
  'departureStationCode',
  'arrivalStationCode',
  'aircraftType',
  'operationalSuffix',
  'passengerTerminalDeparture',
  'passengerTerminalArrival',
  'aircraftConfigurationVersion',
  'tags',
  'startTime',
  'endTime',
  'flightDesignator',
  'startDates',
  'flightInstances',
];

export const REQUIRED_FIELDS = [
  'flightNumber',
  'airlineCode',
  'departureStationCode',
  'arrivalStationCode',
  'startTime',
  'endTime',
  'aircraftType',
  'startDates',
];

export const isRequiredPredicate = val => val !== '' && val !== null;

const isIntegerGreaterThanOrEqualToZeroPredicate = val =>
  evaluateRegex(POSITIVE_INTEGERS_REGEX, val) &&
  Number(val) >= 0 &&
  Number(val) <= 9999;

const isNotEmptyArray = val => val.length;

export const customPredicates = {
  airlineCode: val => evaluateRegex(AIRLINE_CODE_REGEX, val),
  aircraftType: val => evaluateRegex(AIRCRAFTTYPE_CODE_REGEX, val),
  flightNumber: isIntegerGreaterThanOrEqualToZeroPredicate,
  operationalSuffix: val => evaluateRegex(CHAR_REGEX, val),
  deadheadSeatsNumber: isIntegerGreaterThanOrEqualToZeroPredicate,
  onwardFlightDayOffset: isIntegerGreaterThanOrEqualToZeroPredicate,
  extraBriefingCabin: isIntegerGreaterThanOrEqualToZeroPredicate,
  extraBriefingFlightDeck: isIntegerGreaterThanOrEqualToZeroPredicate,
  extraDebriefingCabin: isIntegerGreaterThanOrEqualToZeroPredicate,
  extraDebriefingFlightDeck: isIntegerGreaterThanOrEqualToZeroPredicate,
  onwardFlightDesignator: val => evaluateRegex(FLIGHT_DESIGNATOR_REGEX, val),
  tailNumber: val => evaluateRegex(VALID_STRING_REGEX, val),
  aircraftConfigurationVersion: val => evaluateRegex(CABIN_CONFIG_REGEX, val),
  startDates: isNotEmptyArray,
};
