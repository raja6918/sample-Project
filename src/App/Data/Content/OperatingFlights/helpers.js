import pick from 'lodash/pick';
import { translationPath } from './constants';
import {
  getFormattedTime,
  formatFlightDate,
  formatDepartureDates,
} from '../../../../utils/dates';

import {
  REQUIRED_FIELDS,
  OPERATING_FLIGHTS_GENERAL,
  OPERATING_FLIGHTS_FIELDS,
  isRequiredPredicate,
  customPredicates,
} from './constants';
import Sort from '../../../../utils/sortEngine';

export const hasError = errors => {
  return Object.values(errors).reduce((hasPrevErrors, hasError) => {
    return hasPrevErrors || hasError;
  }, false);
};

export const isRequiredField = field => REQUIRED_FIELDS.indexOf(field) !== -1;

export const getCustomPredicate = field => {
  return customPredicates[field] || (() => true);
};

export const wereAllFieldsFilled = state => {
  return OPERATING_FLIGHTS_FIELDS.reduce((acc, field) => {
    if (!acc) return acc;

    const value = state[field];
    const _isRequired = isRequiredField(field);
    const isEmptyField = !isRequiredPredicate(value);

    if (_isRequired && isEmptyField) return false;

    const customPredicate = getCustomPredicate(field);

    const hasValidValue = !isEmptyField ? customPredicate(value, state) : true;
    return acc && hasValidValue;
  }, true);
};

export const formatFlight = (flight, index) => {
  const { onwardFlightDesignator, onwardFlightDayOffset } = flight;
  const newFlight = {
    _original: { ...flight },
    ...flight,
    id: index,
  };

  let onwardFlightDesignatorWithOffset = onwardFlightDesignator;
  if (onwardFlightDesignator && onwardFlightDayOffset > 0) {
    onwardFlightDesignatorWithOffset = `${onwardFlightDesignator} [+${onwardFlightDayOffset}]`;
  }

  newFlight.onwardFlightDesignatorWithOffset = onwardFlightDesignatorWithOffset;

  return newFlight;
};

export const formatData = (flights, length = 0) => {
  const flightsData = flights.map((flight, index) => {
    const newFlight = formatFlight(flight, index + length);
    return newFlight;
  });

  return flightsData;
};

export const sanitizeFlight = flight => {
  return Object.keys(flight).reduce((acc, key) => {
    const keyValue = flight[key] === '' ? null : flight[key];
    acc[key] = keyValue;
    return acc;
  }, {});
};

const createDatesArray = flightDates => {
  const startDates = [];

  flightDates.forEach(flight => {
    const flightDate = formatFlightDate(flight.startDateTime);
    startDates.push(flightDate);
  });
  return startDates;
};

export const getTimeReferenceConfig = (timeReference, t) => {
  const options = {
    UTC: [t(`${translationPath}.UTC`), t(`${translationPath}.LT`)],
    LT: [t(`${translationPath}.LT`), t(`${translationPath}.UTC`)],
    DEFAULT: [timeReference, '-'],
  };

  return options[timeReference] || options.DEFAULT;
};
export const getDefaultEntity = () => {
  return {
    flightNumber: '',
    airlineCode: '',
    departureStationCode: '',
    arrivalStationCode: '',
    tailNumber: '',
    aircraftTypeCode: '',
    duration: '',
    sequenceNumber: 0,
    serviceTypeCode: '',
    onwardFlightDesignator: '',
    onwardFlightDayOffset: null,
    onwardOffsetIsDisabled: true,
    operationalSuffix: '',
    extraBriefingFlightDeck: '0',
    extraBriefingCabin: '0',
    extraDebriefingFlightDeck: '0',
    extraDebriefingCabin: '0',
    passengerTerminalDeparture: '',
    passengerTerminalArrival: '',
    aircraftConfigurationVersion: '',
    tags: [],
    crewComposition: [],
    startTime: getFormattedTime('00:00'),
    endTime: getFormattedTime('00:00'),
    flightDesignator: '',
    flightInstances: [],
    firstDepartureDate: formatDepartureDates('start'),
    lastDepartureDate: formatDepartureDates('end'),
    deadheadSeatsNumber: 0,
    startDates: [],
  };
};

export const mapEntityToState = originalEntity => {
  const entity = { ...originalEntity };
  if (!entity) return getDefaultEntity();

  const startDates = createDatesArray(entity.flightInstances);
  const onwardOffsetIsDisabled =
    entity.onwardFlightDesignator === '' ||
    entity.onwardFlightDesignator === null
      ? true
      : false;

  return {
    ...pick(entity, OPERATING_FLIGHTS_FIELDS),
    startTime: getFormattedTime(entity.startTime),
    endTime: getFormattedTime(entity.endTime),
    startDates,
    onwardOffsetIsDisabled,
  };
};

export const getDefaultErrors = () => {
  return {
    flightNumber: false,
    tailNumber: false,
    onwardFlightDesignator: false,
    operationalSuffix: false,
    cabinConfiguration: false,
    extraBriefingFlightDeck: false,
    extraBriefingCabin: false,
    extraDebriefingFlightDeck: false,
    extraDebriefingCabin: false,
  };
};

export const prepareSelectData = data => {
  return data.map(d => ({
    value: d.code,
    display: d.name,
  }));
};

export const prepareSelectDataForAirCraftType = data => {
  return data.map(d => ({
    value: d.code,
    display: d.code,
  }));
};

export const prepareStations = stations => {
  const sortedStations = new Sort(stations, {
    type: 'string',
    direction: 'inc',
    field: 'code',
  }).sort();
  const options = sortedStations.map(station => {
    return {
      value: station.code,
      label: `${station.code} - ${station.name}`,
    };
  });

  return options;
};

export const prepareServices = services => {
  const options = services.map(service => {
    return {
      value: service.code,
      label: service.name,
    };
  });

  return options;
};

const prepareTerminals = terminals => {
  const options = terminals.map(terminal => {
    return {
      value: terminal,
      display: terminal,
    };
  });

  return options;
};

export const findTerminalsByStationCode = (stations, stationCode) => {
  if (!stationCode) return [];
  const station = stations.find(station => station.code === stationCode);
  const terminals = station.terminals || [];
  return prepareTerminals(terminals);
};

export const checkEmptyFilter = filters => {
  return typeof filters === 'object'
    ? Object.values(filters).filter(a => a !== '').length
    : 0;
};

export const getStationName = (stations, stationCode) => {
  const station = stations.find(station => station.code === stationCode);
  return station ? station.name : '';
};
