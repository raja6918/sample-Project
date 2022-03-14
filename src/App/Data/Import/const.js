export const MAX_BIN_NAME_SIZE = 256;
export const IMPORT_CONVERTION_WARNINGS = 'CONVERSION_COMPLETED_WITH_WARNINGS';
export const CONVERSION_FAILED = 'CONVERSION_FAILED';
export const UPDATE_FAILED = 'UPDATE_FAILED';
export const UNKNOWN_FAILED = 'UNKNOWN_FAILED';
export const COMPLETED = 'COMPLETED';
export const COMPLETED_WITH_ERRORS = 'COMPLETED_WITH_ERRORS';
export const STOPPED = 'STOPPED';
export const IMPORT_TIMER_VALUE = 20000;

export const PROCESS_STATUS_CONTINUE = 'continue';
export const PROCESS_STATUS_ACKNOWLEDGE = 'acknowledge';
export const PROCESS_STATUS_STOP = 'stop';

export const BIN_NAME_REGEX = '^[a-zA-Z0-9].*';

export const warningsCatalog = {
  IMPORT_FLIGHT_ERROR_BAD_FORMAT: [
    { key: 'warningLine', paramId: 1 },
    { key: 'dataLine', paramId: 2 },
    { key: 'warningBadFormat', paramId: null },
  ],
  IMPORT_FLIGHT_ERROR_BAD_DATETIME_FORMAT: [
    { key: 'warningLine', paramId: 2 },
    { key: 'dataLine', paramId: 3 },
    { key: 'warningBadValue', paramId: 1 },
  ],
  IMPORT_FLIGHT_ERROR_DUPLICATED_ENTITY: [
    { key: 'warningLine', paramId: 1 },
    { key: 'dataLine', paramId: 2 },
    { key: 'warningDuplicatedEntity', paramId: null },
  ],
  IMPORT_PAIRING_ERROR_MISSING_FIELDS: [
    { key: 'warningLine', paramId: 1 },
    { key: 'warningMissingFields', paramId: null },
  ],
  IMPORT_PAIRING_ERROR_BAD_DATA: [
    { key: 'warningLine', paramId: 1 },
    { key: 'warningBadData', paramId: null },
  ],
  IMPORT_CML_ERROR_BAD_DATETIME_FORMAT: [
    { key: 'warningLine', paramId: 1 },
    { key: 'dataLine', paramId: 2 },
    { key: 'warningBadValue', paramId: 0 },
  ],
  IMPORT_CML_ERROR_BAD_STATION_OR_AIRCRAFTTYPE: [
    { key: 'warningLine', paramId: 2 },
    { key: 'dataLine', paramId: 3 },
    { key: 'warningBadValue', paramId: 0 },
  ],
};

export const errorsCatalog = {
  IMPORT_FLIGHT_UNKNOWN_POS: [
    { key: 'flightNotImported', paramId: [0, 1] },
    { key: 'refersToPosition' },
    { key: 'value', paramId: 2 },
  ],
  IMPORT_FLIGHT_UNKNOWN_AIRLINE: [
    { key: 'flightNotImported', paramId: [0, 1] },
    { key: 'refersToAirline' },
    { key: 'value', paramId: 2 },
  ],
  IMPORT_FLIGHT_UNKNOWN_DEP_STATION: [
    { key: 'flightNotImported', paramId: [0, 1] },
    { key: 'refersToStation' },
    { key: 'value', paramId: 2 },
  ],
  IMPORT_FLIGHT_UNKNOWN_ARR_STATION: [
    { key: 'flightNotImported', paramId: [0, 1] },
    { key: 'refersToStation' },
    { key: 'value', paramId: 2 },
  ],
  IMPORT_FLIGHT_UNKNOWN_AIRCRAFT_TYPE: [
    { key: 'flightNotImported', paramId: [0, 1] },
    { key: 'refersToAircraftType' },
    { key: 'value', paramId: 2 },
  ],
  IMPORT_TRIP_UNKNOWN_OR_EMPTY_POS: [
    { key: 'pairingNotImported', paramId: [0, 1] },
    { key: 'refersToPosition' },
    { key: 'value', paramId: 2 },
  ],
  IMPORT_TRIP_FLIGHT_UNKNOWN_AIRLINE: [
    { key: 'pairingNotImported', paramId: [0, 1] },
    { key: 'refersToAirline' },
    { key: 'value', paramId: 3 },
  ],
  IMPORT_TRIP_UNKNOWN_FLIGHT: [
    { key: 'pairingNotImported', paramId: [0, 1] },
    { key: 'refersToAirline' },
    { key: 'value', paramId: 3 },
  ],
  IMPORT_TRIP_UNKNOWN_BASE: [
    { key: 'pairingNotImported', paramId: [0, 1] },
    { key: 'refersToCrewBase' },
    { key: 'value', paramId: 2 },
  ],
  IMPORT_TRIP_DEADHEAD_NOT_FOUND: [
    { key: 'pairingNotImported', paramId: [0, 1] },
    { key: 'refersToDeadhead' },
    { key: 'value', paramId: 3 },
  ],
  IMPORT_TRIP_FLIGHT_UNKNOWN_DEP_STATION: [
    { key: 'pairingNotImported', paramId: [0, 1] },
    { key: 'refersToStation' },
    { key: 'value', paramId: 4 },
  ],
  IMPORT_TRIP_FLIGHT_UNKNOWN_ARR_STATION: [
    { key: 'pairingNotImported', paramId: [0, 1] },
    { key: 'refersToStation' },
    { key: 'value', paramId: 5 },
  ],
  IMPORT_TRIP_DEADHEAD_UNKNOWN_AIRLINE: [
    { key: 'pairingNotImported', paramId: [0, 1] },
    { key: 'refersToAirline' },
    { key: 'value', paramId: 3 },
  ],
  IMPORT_TRIP_DEADHEAD_UNKNOWN_DEP_STATION: [
    { key: 'pairingNotImported', paramId: [0, 1] },
    { key: 'refersToStation' },
    { key: 'value', paramId: 4 },
  ],
  IMPORT_TRIP_DEADHEAD_UNKNOWN_ARR_STATION: [
    { key: 'pairingNotImported', paramId: [0, 1] },
    { key: 'refersToStation' },
    { key: 'value', paramId: 5 },
  ],
  IMPORT_TRIP_UNKNOWN_STATION: [
    { key: 'pairingNotImported', paramId: [0, 1] },
    { key: 'refersToStation' },
    { key: 'value', paramId: 2 },
  ],
  IMPORT_TRIP_FLIGHT_UNKNOWN_AIRCRAFT_TYPE: [
    { key: 'pairingNotImported', paramId: [0, 1] },
    { key: 'refersToAircraftType' },
    { key: 'value', paramId: 7 },
  ],
  IMPORT_FLIGHT_MOCKED_NOT_MARKED_OBSOLETE: [
    { key: 'mockedMarkedObsolete', paramId: [0] },
  ],
  IMPORT_FLIGHT_DELETING_PAIRING: [
    { key: 'deletingPairing', paramId: [0, 1, 2, 5] },
  ],
  IMPORT_FLIGHT_MARKED_OBSOLETE: [{ key: 'markedObsolete', paramId: [0] }],
  IMPORT_CML_UNKNOWN_DEP_STATION: [
    { key: 'deadHeadAggregateNotImported', paramId: [0, 1] },
    { key: 'refersToStation' },
    { key: 'value', paramId: 2 },
  ],
  IMPORT_CML_UNKNOWN_ARR_STATION: [
    { key: 'deadHeadAggregateNotImported', paramId: [0, 1] },
    { key: 'refersToStation' },
    { key: 'value', paramId: 2 },
  ],
};

export const defaultState = {
  files: [],
  isEmpty: true,
  enableUpload: false,
  processStep: 1,
  binsFlag: false,
  selectedBin: null,
  directoryName: '',
  importMethod: '0',
  isValidName: true,
  nameError: '',
  counter: 0,
  highlight: false,
};

export const fileMetadataInfo = {
  dataType: 'unknown',
  icon: '',
  isCustomIcon: true,
  fileId: -1,
  isTypeChanged: false,
  name: '',
  errors: [],
  typeName: '',
  iconStyles: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-18%,-32%)',
  },
};
