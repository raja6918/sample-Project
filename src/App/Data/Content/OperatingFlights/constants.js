import { evaluateRegex } from '../../utils/utils.js';
import {
  operationDaysTransformer,
  crewCompositionTransformer,
  dateFormatTransformer,
} from './../../../../components/GenericTable/transformers';
import DateRangePicker from '../../../../components/DateRangePicker';
import TimeRangePicker from '../../../../components/TimeRangePicker';

export const translationPath = 'DATA.operatingFlights';
export const OPERATING_FLIGHTS_FORM = 'DATA.operatingFlights.form';
export const OPERATING_FLIGHTS_GENERAL = `${OPERATING_FLIGHTS_FORM}.section.general`;
export const OPERATING_FLIGHTS_CREW = `${OPERATING_FLIGHTS_FORM}.section.crew`;
export const OPERATING_FLIGHTS_TIME = `${OPERATING_FLIGHTS_FORM}.section.extraTime`;
export const OPERATING_FLIGHTS_INFO = `${OPERATING_FLIGHTS_FORM}.section.extraInformation`;
export const OPERATING_FLIGHTS_ERRORS = 'ERRORS.OPERATING_FLIGHTS';

export const POSITIVE_INTEGERS_REGEX = /^\d+$/g;
export const NAME_REGEX = '^[a-zA-Z0-9].*';
export const CHAR_REGEX = '^[a-zA-Z].*';
export const FLIGHT_DESIGNATOR_REGEX = '^[a-zA-Z]{2,3}[0-9]{1,4}$';
export const VALID_STRING_REGEX = '^[a-zA-Z0-9]+?(.)*?$';
export const CABIN_CONFIG_REGEX = '^[a-zA-Z0-9]+$';

export const orderBy = 'flightDesignator';
export const order = 'inc';

const UTC = 'UTC';
export const TIME_REFERENCE = UTC;
export const INITIAL_ITEMS = 50;

export const type = 'DATA.operatingFlights.type';

export const getHeaders = (t, scenarioStartDate) => [
  {
    field: 'flightDesignator',
    displayName: t('DATA.operatingFlights.headers.flightDesignator'),
    disableFilter: false,
  },
  {
    field: 'departureStationCode',
    displayName: t('DATA.operatingFlights.headers.departureStationCode'),
    disableFilter: false,
  },
  {
    field: 'arrivalStationCode',
    displayName: t('DATA.operatingFlights.headers.arrivalStationCode'),
    disableFilter: false,
  },
  {
    field: 'startTime',
    displayName: t('DATA.operatingFlights.headers.startTime'),
    disableFilter: false,
    component: TimeRangePicker,
    filterTransformer: date => date.replace(' - ', '-'),
  },
  {
    field: 'endTime',
    displayName: t('DATA.operatingFlights.headers.endTime'),
    disableFilter: false,
    component: TimeRangePicker,
    filterTransformer: date => date.replace(' - ', '-'),
  },
  {
    field: 'operationDays',
    displayName: t('DATA.operatingFlights.headers.operationDays'),
    transformer: operationDaysTransformer,
    disableSort: true,
    disableFilter: true,
  },
  {
    field: 'firstDepartureDate',
    displayName: t('DATA.operatingFlights.headers.firstDepartureDate'),
    disableFilter: false,
    filterType: 'YYYY-MM-DD',
    component: DateRangePicker,
    componentProps: { startupDate: scenarioStartDate },
    filterTransformer: date => date.replace(' - ', ':'),
    transformer: dateFormatTransformer,
  },
  {
    field: 'lastDepartureDate',
    displayName: t('DATA.operatingFlights.headers.lastDepartureDate'),
    disableFilter: false,
    filterType: 'YYYY-MM-DD',
    component: DateRangePicker,
    componentProps: { startupDate: scenarioStartDate },
    filterTransformer: date => date.replace(' - ', ':'),
    transformer: dateFormatTransformer,
  },
  {
    field: 'onwardFlightDesignatorWithOffset',
    displayName: t('DATA.operatingFlights.headers.onwardFlightDesignator'),
    sortCriteria: ['onwardFlightDesignator', 'onwardFlightDayOffset'],
    disableFilter: false,
    filterName: 'onwardFlightDesignator',
  },
  {
    field: 'aircraftTypeCode',
    displayName: t('DATA.operatingFlights.headers.aircraftTypeCode'),
    disableFilter: false,
  },
  {
    field: 'crewComposition',
    displayName: t('DATA.operatingFlights.headers.crewComposition'),
    transformer: crewCompositionTransformer,
    disableSort: true,
    disableFilter: true,
  },
];

export const OPERATING_FLIGHTS_FIELDS = [
  'flightNumber',
  'airlineCode',
  'departureStationCode',
  'arrivalStationCode',
  'tailNumber',
  'aircraftTypeCode',
  'duration',
  'sequenceNumber',
  'serviceTypeCode',
  'onwardFlightDesignator',
  'onwardFlightDayOffset',
  'operationalSuffix',
  'extraBriefingFlightDeck',
  'extraBriefingCabin',
  'extraDebriefingFlightDeck',
  'extraDebriefingCabin',
  'passengerTerminalDeparture',
  'passengerTerminalArrival',
  'aircraftConfigurationVersion',
  'tags',
  'crewComposition',
  'startTime',
  'endTime',
  'flightDesignator',
  'flightInstances',
  'deadheadSeatsNumber',
  'startDates',
];

export const REQUIRED_FIELDS = [
  'flightNumber',
  'airlineCode',
  'departureStationCode',
  'arrivalStationCode',
  'startTime',
  'endTime',
  'aircraftTypeCode',
  'startDates',
];

export const isRequiredPredicate = val => val !== '' && val !== null;

const isIntegerGreaterThanOrEqualToZeroPredicate = val =>
  evaluateRegex(POSITIVE_INTEGERS_REGEX, val) &&
  Number(val) >= 0 &&
  Number(val) <= 9999;

const isNotEmptyArray = val => val.length;

export const customPredicates = {
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
