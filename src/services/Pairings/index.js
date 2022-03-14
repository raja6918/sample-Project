import API from './api';
import {
  PAIRINGS_AGGREGATES_ENDPOINT,
  FLIGHT_AGGREGATES_ENDPOINT,
  FILTER_ENDPOINT,
  PAIRING_DETAILS_ENDPOINT,
} from './constants';
import { getUserId } from '../Data/utils';

/**
 * @deprecated since corev2. Use getPairingIds along with getGanttDetails instead.
 */
export function getPairingAggregates(scenarioId, requestPayload = null) {
  return API.post(
    `${PAIRINGS_AGGREGATES_ENDPOINT}/get?scenarioId=${scenarioId}`,
    requestPayload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * @deprecated since corev2. Use getFlightIds along with getGanttDetails instead.
 */
export function getFlightAggregates(scenarioId, requestPayload = null) {
  return API.post(
    `${FLIGHT_AGGREGATES_ENDPOINT}/get?scenarioId=${scenarioId}`,
    requestPayload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export function getFilterCriteria(userId) {
  const params = `/getAllCriteria?userId=${userId}`;
  return API.get(`${FILTER_ENDPOINT}${params}`);
}

export function getFlightTypes() {
  return [
    { display: 'Operating', value: '@isACT', key: '@isACT' },
    { display: 'Internal deadhead', value: '@isDHD', key: '@isDHD' },
    { display: 'Commercial', value: '@isCML', key: '@isCML' },
  ];
}

export const getTOGAircraftType = () => {
  return [
    { display: 'With change', value: 'With', key: 'With' },
    { display: 'Without change', value: 'Without', key: 'Without' },
  ];
};

export const getStartAndEndDOWType = () => {
  return [
    { display: '1', value: 1, key: 1 },
    { display: '2', value: 2, key: 2 },
    { display: '3', value: 3, key: 3 },
    { display: '4', value: 4, key: 4 },
    { display: '5', value: 5, key: 5 },
    { display: '6', value: 6, key: 6 },
    { display: '7', value: 7, key: 7 },
  ];
};

export function getStations(scenarioId, requestPayload) {
  const userId = getUserId();
  const params = `/stations?userId=${userId}&scenarioId=${scenarioId}`;
  return API.post(`${FILTER_ENDPOINT}${params}`, requestPayload);
}

export function getCountries(scenarioId, requestPayload) {
  const userId = getUserId();
  const params = `/countries?userId=${userId}&scenarioId=${scenarioId}`;
  return API.post(`${FILTER_ENDPOINT}${params}`, requestPayload);
}

export function getRegions(scenarioId, requestPayload) {
  const userId = getUserId();
  const params = `/regions?userId=${userId}&scenarioId=${scenarioId}`;
  return API.post(`${FILTER_ENDPOINT}${params}`, requestPayload);
}

export function getCrewBases(scenarioId, requestPayload) {
  const userId = getUserId();
  const params = `/bases?userId=${userId}&scenarioId=${scenarioId}`;
  return API.post(`${FILTER_ENDPOINT}${params}`, requestPayload);
}

export function getCrewCompositions(scenarioId, requestPayload) {
  const userId = getUserId();
  const params = `/pairings/crewComposition?userId=${userId}&scenarioId=${scenarioId}`;
  return API.post(`${FILTER_ENDPOINT}${params}`, requestPayload);
}

export function getAircraftTypes(scenarioId, requestPayload) {
  const userId = getUserId();
  const params = `/aircrafts?userId=${userId}&scenarioId=${scenarioId}`;
  return API.post(`${FILTER_ENDPOINT}${params}`, requestPayload);
}

export function getLayovers(scenarioId, requestPayload) {
  const userId = getUserId();
  const params = `/layovers?userId=${userId}&scenarioId=${scenarioId}`;
  return API.post(`${FILTER_ENDPOINT}${params}`, requestPayload);
}

export function getFlightDesignators(scenarioId, requestPayload) {
  const userId = getUserId();
  const params = `/flightDesignator?userId=${userId}&scenarioId=${scenarioId}`;
  return API.post(`${FILTER_ENDPOINT}${params}`, requestPayload);
}

export function getPairingNames(scenarioId, requestPayload) {
  const userId = getUserId();
  const params = `/name?userId=${userId}&scenarioId=${scenarioId}`;
  return API.post(`${FILTER_ENDPOINT}${params}`, requestPayload);
}

export function getPairingDeadheads() {
  return [
    { display: 'Internal', value: '@isDHD', key: '@isDHD' },
    { display: 'Commercial', value: '@isCML', key: '@isCML' },
    { display: 'Ground', value: '@isGND', key: '@isGND' },
  ];
}

export function getPairingFlightCoverage() {
  return [
    { display: 'Covered', value: 'covered', key: 'covered' },
    { display: 'Overcovered', value: 'overcovered', key: 'overcovered' },
    { display: 'Undercovered', value: 'undercovered', key: 'undercovered' },
    { display: 'Mixed', value: 'mixed', key: 'mixed' },
  ];
}

export function getFlightsFlightCoverage() {
  return [
    { display: 'Covered', value: 'covered', key: 'covered' },
    { display: 'Overcovered', value: 'overcovered', key: 'overcovered' },
    { display: 'Undercovered', value: 'undercovered', key: 'undercovered' },
    { display: 'Uncovered', value: 'uncovered', key: 'uncovered' },
    { display: 'Mixed', value: 'mixed', key: 'mixed' },
  ];
}

export function getPairingDetails(selectedPairing, scenarioId, requestToken) {
  const params = `/${selectedPairing}?scenarioId=${scenarioId}`;
  return API.get(`${PAIRING_DETAILS_ENDPOINT}${params}`, requestToken);
}

export function getPairingIds(scenarioId, requestPayload = null) {
  const userId = getUserId();
  return API.post(
    `${FILTER_ENDPOINT}/getPairings?scenarioId=${scenarioId}&userId=${userId}`,
    requestPayload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export function getFlightIds(scenarioId, requestPayload = null) {
  const userId = getUserId();
  return API.post(
    `${FILTER_ENDPOINT}/flights?scenarioId=${scenarioId}&userId=${userId}`,
    requestPayload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export function getGanttDetails(
  scenarioId,
  pairingIds,
  flightIds,
  deadHeadFlightIds,
  cmlFlightIds
) {
  const userId = getUserId();
  return API.post(
    `${FILTER_ENDPOINT}/details?scenarioId=${scenarioId}&userId=${userId}`,
    {
      'pairing-key-list': pairingIds,
      'active-flt-key-list': flightIds,
      'dhd-flt-key-list': deadHeadFlightIds,
      'cml-key-list': cmlFlightIds,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export function updatePairings(scenarioId, data = []) {
  const userId = getUserId();
  return API.put(
    `${PAIRING_DETAILS_ENDPOINT}?scenarioId=${scenarioId}&userId=${userId}`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export function breakPairings(scenarioId, data = []) {
  const userId = getUserId();
  return API.post(
    `${PAIRING_DETAILS_ENDPOINT}/break?scenarioId=${scenarioId}&userId=${userId}`,
    {
      'key-list': data,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export function joinPairings(
  scenarioId,
  crewComposition,
  flightIds = [],
  pairingIds = [],
  internalDeadHeadIds = [],
  cmlIds = []
) {
  const userId = getUserId();
  return API.post(
    `${PAIRING_DETAILS_ENDPOINT}/join?scenarioId=${scenarioId}&userId=${userId}`,
    {
      'crew-composition': crewComposition,
      'active-flt-key-list': flightIds,
      'dhd-flt-key-list': internalDeadHeadIds,
      'cml-key-list': cmlIds,
      'pairing-key-list': pairingIds,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export function loadFilters(scenarioId) {
  const userId = getUserId();
  return API.get(
    `${FILTER_ENDPOINT}/filters?scenarioId=${scenarioId}&userId=${userId}`
  );
}

export function saveFilter(scenarioId, filterPayload) {
  const userId = getUserId();
  return API.post(
    `${FILTER_ENDPOINT}?scenarioId=${scenarioId}&userId=${userId}`,
    [filterPayload],
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export function updateFilter(scenarioId, filterPayload) {
  const userId = getUserId();
  return API.put(
    `${FILTER_ENDPOINT}?scenarioId=${scenarioId}&userId=${userId}`,
    [filterPayload],
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
