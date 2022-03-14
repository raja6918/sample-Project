export const filterCriteria = [
  {
    filterId: 1,
    filterName: 'Pairings Filter',
    filterKey: 'PAIRINGS_FILTER',
    categories: [
      {
        categoryId: 1,
        categoryName: 'Pairing Criteria',
        categoryKey: 'TRIP_PAIRING_CRITERIA',
        criteria: [
          {
            crId: '11',
            crKey: 'TRIP_PAIRING_CR_PAIRING_NAME',
            crValue: 'Pairing Name',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'pairingName',
          },
          {
            crId: '12',
            crKey: 'TRIP_PAIRING_CR_LAYOVER_AT',
            crValue: 'Layover At',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'layoverAt',
          },
          {
            crId: '13',
            crKey: 'TRIP_PAIRING_CR_PAIRING_START',
            crValue: 'Pairing start date',
            type: 'dateTimeType',
            render: 'static',
            crName: 'pairingStart',
          },
          {
            crId: '14',
            crKey: 'TRIP_PAIRING_CR_PAIRING_END',
            crValue: 'Pairing end date',
            type: 'dateTimeType',
            render: 'static',
            crName: 'pairingEnd',
          },
          {
            crId: '15',
            crKey: 'TRIP_PAIRING_CR_CNX_AT',
            crValue: 'TOG at',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'cnxAt',
          },
          {
            crId: '16',
            crKey: 'TRIP_PAIRING_CR_CNX_DURATION',
            crValue: 'TOG duration',
            type: 'durationType',
            render: 'static',
            crName: 'cnxDuration',
          },
          {
            crId: '17',
            crKey: 'TRIP_PAIRING_CR_CNX_ACHG',
            crValue: 'TOG aircraft change',
            type: 'multiSelectType',
            render: 'static',
            crName: 'cnxAchg',
          },
          {
            crId: '18',
            crKey: 'TRIP_PAIRING_CR_CREW_BASE',
            crValue: 'Crew Base',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'crewBase',
          },
          {
            crId: '19',
            crKey: 'TRIP_PAIRING_CR_CC',
            crValue: 'Crew Composition',
            type: 'multiSelectType',
            render: 'dynamic',
            crName: 'crewComposition',
          },
          {
            crId: '110',
            crKey: 'TRIP_PAIRING_CR_BLOCK_TIME',
            crValue: 'Pairing block hours',
            type: 'durationType',
            render: 'static',
            crName: 'blockTime',
          },
          {
            crId: '111',
            crKey: 'TRIP_PAIRING_CR_TAFB',
            crValue: 'TAFB',
            type: 'durationType',
            render: 'static',
            crName: 'tafb',
          },
          {
            crId: '112',
            crKey: 'TRIP_PAIRING_CR_OCCURRENCES',
            crValue: 'Pairing occurrences',
            type: 'intRangeType',
            render: 'static',
            crName: 'occurrences',
          },
          {
            crId: '113',
            crKey: 'TRIP_PAIRING_CR_DUTIES',
            crValue: 'Duties',
            type: 'intRangeType',
            render: 'static',
            crName: 'duties',
          },
          {
            crId: '114',
            crKey: 'TRIP_PAIRING_CR_DUTY_DAYS',
            crValue: 'Duty Days',
            type: 'intRangeType',
            render: 'static',
            crName: 'dutyDays',
          },
          {
            crId: '115',
            crKey: 'TRIP_PAIRING_CR_BPDH',
            crValue: 'Average productivity (block per duty hour)',
            type: 'durationType',
            render: 'static',
            crName: 'bpdh',
          },
          {
            crId: '116',
            crKey: 'TRIP_PAIRING_CR_BPDP',
            crValue: 'Average productivity (block per duty period)',
            type: 'durationType',
            render: 'static',
            crName: 'bpdp',
          },
          {
            crId: '117',
            crKey: 'TRIP_PAIRING_CR_OP_FLIGHTS',
            crValue: 'Flights (in pairing)',
            type: 'intRangeType',
            render: 'static',
            crName: 'opFlights',
          },
          {
            crId: '118',
            crKey: 'TRIP_PAIRING_CR_LAYOVER_DUR',
            crValue: 'Layover Duration',
            type: 'durationType',
            render: 'static',
            crName: 'layoverDur',
          },
          {
            crId: '119',
            crKey: 'TRIP_PAIRING_CR_PAIRING_START_TIME',
            crValue: 'Pairing start time',
            type: 'timeType',
            render: 'static',
            crName: 'pairingStartTime',
          },
          {
            crId: '120',
            crKey: 'TRIP_PAIRING_CR_PAIRING_END_TIME',
            crValue: 'Pairing End time',
            type: 'timeType',
            render: 'static',
            crName: 'pairingEndTime',
          },
        ],
      },
      {
        categoryId: 2,
        categoryName: 'Duty Period Criteria',
        categoryKey: 'TRIP_DP_CRITERIA',
        criteria: [
          {
            crId: '21',
            crKey: 'TRIP_DP_CRITERIA_DUTY_START',
            crValue: 'Duty start date',
            type: 'dateTimeType',
            render: 'static',
            crName: 'dutyStart',
          },
          {
            crId: '22',
            crKey: 'TRIP_DP_CRITERIA_DUTY_END',
            crValue: 'Duty end date',
            type: 'dateTimeType',
            render: 'static',
            crName: 'dutyEnd',
          },
          {
            crId: '23',
            crKey: 'TRIP_DP_CRITERIA_DUTY_BLOCK_HOURS',
            crValue: 'Duty block hours',
            type: 'durationType',
            render: 'static',
            crName: 'dutyBlockHours',
          },
          {
            crId: '24',
            crKey: 'TRIP_DP_CRITERIA_DUTY_CREDIT_HOURS',
            crValue: 'Duty credit hours',
            type: 'durationType',
            render: 'static',
            crName: 'dutyCreditHours',
          },
          {
            crId: '25',
            crKey: 'TRIP_DP_CRITERIA_DUTY_HOURS',
            crValue: 'Duty hours',
            type: 'durationType',
            render: 'static',
            crName: 'dutyHours',
          },
          {
            crId: '26',
            crKey: 'TRIP_DP_CRITERIA_OP_FLIGHTS',
            crValue: 'Flights (in duty)',
            type: 'intRangeType',
            render: 'static',
            crName: 'dpOpFlights',
          },
          {
            crId: '27',
            crKey: 'TRIP_DP_CRITERIA_BPDH',
            crValue: 'Block Per Duty Hour',
            type: 'durationType',
            render: 'static',
            crName: 'dpBpdh',
          },
          {
            crId: '28',
            crKey: 'TRIP_DP_CRITERIA_DUTY_START_TIME',
            crValue: 'Duty start time',
            type: 'timeType',
            render: 'static',
            crName: 'dutyStartTime',
          },
          {
            crId: '29',
            crKey: 'TRIP_DP_CRITERIA_DUTY_END_TIME',
            crValue: 'Duty end time',
            type: 'timeType',
            render: 'static',
            crName: 'dutyEndTime',
          },
        ],
      },
      {
        categoryId: 3,
        categoryName: 'Flight Criteria',
        categoryKey: 'TRIP_FLIGHT_CRITERIA',
        criteria: [
          {
            crId: '31',
            crKey: 'TRIP_FLIGHT_CR_FLIGHT_DESIG',
            crValue: 'Flight designator',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'flightDesig',
          },
          {
            crId: '32',
            crKey: 'TRIP_FLIGHT_CR_AR_TYPE',
            crValue: 'Aircraft Type',
            type: 'multiSelectType',
            render: 'dynamic',
            crName: 'arType',
          },
          {
            crId: '33',
            crKey: 'TRIP_FLIGHT_CR_DEP_REG',
            crValue: 'Flight departures (region)',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'depReg',
          },
          {
            crId: '34',
            crKey: 'TRIP_FLIGHT_CR_ARRV_REG',
            crValue: 'Flight arrivals (region)',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'arrvReg',
          },
          {
            crId: '35',
            crKey: 'TRIP_FLIGHT_CR_DEP_CNT',
            crValue: 'Flight departures (country)',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'depCountry',
          },
          {
            crId: '36',
            crKey: 'TRIP_FLIGHT_CR_AR_CNT',
            crValue: 'Flight arrivals (country)',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'arrCountry',
          },
          {
            crId: '37',
            crKey: 'TRIP_FLIGHT_CR_DEP_STATION',
            crValue: 'Flight departures (station)',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'depStation',
          },
          {
            crId: '38',
            crKey: 'TRIP_FLIGHT_CR_ARRV_STATION',
            crValue: 'Flight arrivals (station)',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'arrvStation',
          },
          {
            crId: '39',
            crKey: 'TRIP_FLIGHT_CR_FLIGHT_START',
            crValue: 'Flight start date',
            type: 'dateTimeType',
            render: 'static',
            crName: 'flightStart',
          },
          {
            crId: '310',
            crKey: 'TRIP_FLIGHT_CR_FLIGHT_END',
            crValue: 'Flight end date',
            type: 'dateTimeType',
            render: 'static',
            crName: 'flightEnd',
          },
          {
            crId: '311',
            crKey: 'TRIP_FLIGHT_CR_FLIGHT_ST_DOW',
            crValue: 'Flight Start DOW',
            type: 'multiSelectType',
            render: 'static',
            crName: 'flightStDow',
          },
          {
            crId: '312',
            crKey: 'TRIP_FLIGHT_CR_FLIGHT_ED_DOW',
            crValue: 'Flight End DOW',
            type: 'multiSelectType',
            render: 'static',
            crName: 'flightEdDow',
          },
          {
            crId: '313',
            crKey: 'TRIP_FLIGHT_CR_BLOCK_TIME',
            crValue: 'Block Time',
            type: 'durationType',
            render: 'static',
            crName: 'flightBlockTime',
          },
          {
            crId: '314',
            crKey: 'TRIP_FLIGHT_CR_FLIGHT_START_TIME',
            crValue: 'Flight start time',
            type: 'timeType',
            render: 'static',
            crName: 'flightStartTime',
          },
          {
            crId: '315',
            crKey: 'TRIP_FLIGHT_CR_FLIGHT_END_TIME',
            crValue: 'Flight end time',
            type: 'timeType',
            render: 'static',
            crName: 'flightEndTime',
          },
        ],
      },
    ],
  },
  {
    filterId: 2,
    filterName: 'Legs Filter',
    filterKey: 'LEGS_FILTER',
    categories: [
      {
        categoryId: 1,
        categoryName: 'Flight Criteria',
        categoryKey: 'LEGS_FLIGHT_CRITERIA',
        criteria: [
          {
            crId: '11',
            crKey: 'LEGS_FLIGHT_CR_FLIGHT_DESIG',
            crValue: 'Flight Designator',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'legsFlightDesig',
          },
          {
            crId: '12',
            crKey: 'LEGS_FLIGHT_CR_AR_TYPE',
            crValue: 'Aircraft Type',
            type: 'multiSelectType',
            render: 'dynamic',
            crName: 'legsArType',
          },
          {
            crId: '13',
            crKey: 'LEGS_FLIGHT_CR_DEP_REG',
            crValue: 'Flight departures (region)',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'legsDepReg',
          },
          {
            crId: '14',
            crKey: 'LEGS_FLIGHT_CR_ARRV_REG',
            crValue: 'Flight arrivals (region)',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'legsArrvReg',
          },
          {
            crId: '15',
            crKey: 'LEGS_FLIGHT_CR_DEP_CNT',
            crValue: 'Flight departures (country)',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'legsDepCnt',
          },
          {
            crId: '16',
            crKey: 'LEGS_FLIGHT_CR_ARRV_CNT',
            crValue: 'Flight arrivals (country)',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'legsArrvCnt',
          },
          {
            crId: '17',
            crKey: 'LEGS_FLIGHT_CR_DEP_STATION',
            crValue: 'Flight departures (station)',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'legsDepStation',
          },
          {
            crId: '18',
            crKey: 'LEGS_FLIGHT_CR_ARRV_STATION',
            crValue: 'Flight arrivals (station)',
            type: 'multiSelectSearchType',
            render: 'dynamic',
            crName: 'legsArrvStation',
          },
          {
            crId: '19',
            crKey: 'LEGS_FLIGHT_CR_FLIGHT_START',
            crValue: 'Flight start date',
            type: 'dateTimeType',
            render: 'static',
            crName: 'legsFlightStart',
          },
          {
            crId: '110',
            crKey: 'LEGS_FLIGHT_CR_FLIGHT_END',
            crValue: 'Flight end date',
            type: 'dateTimeType',
            render: 'static',
            crName: 'legsFlightEnd',
          },
          {
            crId: '111',
            crKey: 'LEGS_FLIGHT_CR_FLIGHT_ST_DOW',
            crValue: 'Flight Start DOW',
            type: 'multiSelectType',
            render: 'static',
            crName: 'legsFlightStDow',
          },
          {
            crId: '112',
            crKey: 'LEGS_FLIGHT_CR_FLIGHT_ED_DOW',
            crValue: 'Flight End DOW',
            type: 'multiSelectType',
            render: 'static',
            crName: 'legsFlightEdDow',
          },
          {
            crId: '113',
            crKey: 'LEGS_FLIGHT_CR_BLOCK_TIME',
            crValue: 'Block Time',
            type: 'durationType',
            render: 'static',
            crName: 'legsBlockTime',
          },
          {
            crId: '114',
            crKey: 'LEGS_FLIGHT_CR_FLIGHT_START_TIME',
            crValue: 'Flight start time',
            type: 'timeType',
            render: 'static',
            crName: 'legsFlightStartTime',
          },
          {
            crId: '115',
            crKey: 'LEGS_FLIGHT_CR_FLIGHT_END_TIME',
            crValue: 'Flight end time',
            type: 'timeType',
            render: 'static',
            crName: 'legsFlightEndTime',
          },
        ],
      },
    ],
  },
];

/**
 * Now act as mock API call. Will be removed once API is integrated.
 */
export const getFilterCriteria = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(filterCriteria);
    }, 100);
  });
};

export const layoverAt = [
  { display: 'JFK', value: 'JFK' },
  { display: 'ABC', value: 'ABC' },
  { display: 'HKI', value: 'HKI' },
  { display: 'ALK', value: 'ALK' },
  { display: 'CAD TESTING LONG', value: 'CAD' },
  { display: 'AER', value: 'AER' },
  { display: 'BWD', value: 'BWD' },
  { display: 'CCV', value: 'CCV' },
  { display: 'DAS', value: 'DAS' },
  { display: 'EWW', value: 'EWW' },
  { display: 'FTY TESTING LONG', value: 'FTY' },
  { display: 'GER', value: 'GER' },
];

/**
 * Now act as mock API call. Will be removed once API is integrated.
 */
export const getLayoverAt = (scenarioId, { filter: search }) => {
  const filteredLayoverAt = search
    ? layoverAt.filter(layover =>
        layover.display.includes(search.toUpperCase())
      )
    : layoverAt;

  const data = {
    totalDataSize: filteredLayoverAt.length - 1,
    startIndex: 0,
    endIndex: 6,
    data: filteredLayoverAt,
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
};

export const getAircraftType = () => [
  { display: 'Active', value: 'active' },
  { display: 'International Dh', value: 'international' },
  { display: 'Cml', value: 'cml' },
];

/**
 * Now act as mock API call. Will be removed once API is integrated.
 */
export const getAircraftTypePromise = (scenarioId, { filter: search }) => {
  const data = {
    totalDataSize: 3,
    startIndex: 0,
    endIndex: 6,
    data: getAircraftType(),
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 100);
  });
};
