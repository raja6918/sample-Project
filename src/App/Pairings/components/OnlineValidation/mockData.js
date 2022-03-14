export const alerts = {
  74: {
    alertLevel: 'error',
    alerts: {
      errorAlerts: [
        {
          rule: null,
          message: 'Invalid flight reference',
          tag: 'at',
          leg: {
            flightNumber: 8992,
            departureStationCode: 'YHZ',
            arrivalStationCode: 'YYT',
            startDate: '2019-07-08',
          },
          contextStartDateTime: '2019-07-08T19:45',
          contextEndDateTime: '2019-07-08T20:35',
        },
        {
          rule: null,
          message: 'Mismatched arrival and departure stations between flights.',
          tag: 'at',
          leg: {
            flightNumber: 8899,
            departureStationCode: 'YYR',
            arrivalStationCode: 'YHZ',
            startDate: '2019-07-08',
          },
          contextStartDateTime: '2019-07-08T19:45',
          contextEndDateTime: '2019-07-08T20:35',
        },
      ],
      warningAlerts: [
        {
          rule: { code: 'duty-credit', name: 'Duty credit' },
          message: 'duty credit exceeded',
          tag: 'at',
          leg: {
            flightNumber: 8829,
            departureStationCode: 'YYT',
            arrivalStationCode: 'YYR',
            startDate: '2019-07-08',
          },
          contextStartDateTime: '2019-07-08T19:45',
          contextEndDateTime: '2019-07-08T20:35',
        },
      ],
      cautionAlerts: [
        {
          rule: { code: 'leg-nb-max', name: 'Consecutive Flight Duty Periods' },
          message: 'Should be maximum of 3 but currently is 5',
          tag: 'at',
          leg: {
            flightNumber: 8885,
            departureStationCode: 'YYT',
            arrivalStationCode: 'YYR',
            startDate: '2019-07-08',
          },
          contextStartDateTime: '2019-07-08T19:45',
          contextEndDateTime: '2019-07-08T20:35',
        },
      ],
      infoAlerts: [
        {
          rule: { code: 'leg-nb-max', name: 'Consecutive Flight Duty Periods' },
          message: 'Should be maximum of 3 but currently is 5',
          tag: 'at',
          leg: {
            flightNumber: 8634,
            departureStationCode: 'YYT',
            arrivalStationCode: 'YYR',
            startDate: '2019-07-08',
          },
          contextStartDateTime: '2019-07-08T19:45',
          contextEndDateTime: '2019-07-08T20:35',
        },
      ],
    },
  },
  115: {
    alertLevel: 'warning',
    alerts: {
      warningAlerts: [
        {
          rule: { code: 'leg-nb-max', name: 'Maximum legs per duty' },
          message: 'maximum legs per duty exceeded',
          tag: 'at',
          leg: {
            flightNumber: 7951,
            departureStationCode: 'YYT',
            arrivalStationCode: 'YYR',
            startDate: '2019-07-08',
          },
          contextStartDateTime: '2019-07-08T19:45',
          contextEndDateTime: '2019-07-08T20:35',
        },
        {
          rule: { code: 'duty-credit', name: 'Duty credit' },
          message: 'duty credit exceeded',
          tag: 'at',
          leg: {
            flightNumber: 7954,
            departureStationCode: 'YYT',
            arrivalStationCode: 'YYR',
            startDate: '2019-07-08',
          },
          contextStartDateTime: '2019-07-08T19:45',
          contextEndDateTime: '2019-07-08T20:35',
        },
      ],
    },
  },
  116: {
    alertLevel: 'caution',
    alerts: {
      cautionAlerts: [
        {
          rule: { code: 'leg-nb-max', name: 'Consecutive Flight Duty Periods' },
          message: 'Should be maximum of 3 but currently is 5',
          tag: 'at',
          leg: {
            flightNumber: 7954,
            departureStationCode: 'YYT',
            arrivalStationCode: 'YYR',
            startDate: '2019-07-08',
          },
          contextStartDateTime: '2019-07-08T19:45',
          contextEndDateTime: '2019-07-08T20:35',
        },
      ],
    },
  },
  120: {
    alertLevel: 'info',
    alerts: {
      infoAlerts: [
        {
          rule: { code: 'leg-nb-max', name: 'Consecutive Flight Duty Periods' },
          message: 'Should be maximum of 3 but currently is 5',
          tag: 'at',
          leg: {
            flightNumber: 7951,
            departureStationCode: 'YYT',
            arrivalStationCode: 'YYR',
            startDate: '2019-07-08',
          },
          contextStartDateTime: '2019-07-08T19:45',
          contextEndDateTime: '2019-07-08T20:35',
        },
      ],
    },
  },
  176: {
    alertLevel: 'caution',
    alerts: {
      cautionAlerts: [
        {
          rule: { code: 'leg-nb-max', name: 'Consecutive Flight Duty Periods' },
          message: 'Should be maximum of 3 but currently is 5',
          tag: 'at',
          leg: {
            flightNumber: 7957,
            departureStationCode: 'YYT',
            arrivalStationCode: 'YYR',
            startDate: '2019-07-08',
          },
          contextStartDateTime: '2019-07-08T19:45',
          contextEndDateTime: '2019-07-08T20:35',
        },
      ],
      infoAlerts: [
        {
          rule: { code: 'leg-nb-max', name: 'Consecutive Flight Duty Periods' },
          message: 'Should be maximum of 3 but currently is 5',
          tag: 'at',
          leg: {
            flightNumber: 7965,
            departureStationCode: 'YYT',
            arrivalStationCode: 'YYR',
            startDate: '2019-07-08',
          },
          contextStartDateTime: '2019-07-08T19:45',
          contextEndDateTime: '2019-07-08T20:35',
        },
      ],
    },
  },
};
