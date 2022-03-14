import GenericTextField from './components/GenericTextField';
import CheckboxFilterWithErrorHandler from './components/CheckboxFilter/CheckboxFilter';
import CompoundTimePicker from './components/CompoundTimePicker/CompoundTimePicker';
import CompoundDateTimePicker from './components/CompoundDateTimePicker/CompoundDateTimePicker';
import MinMaxBox from './components/MinMaxBox/MinMaxBox';
import MultiSelectComboBoxWithErrorHandler from './components/MultiSelectComboBox/MultiSelectComboBox';
import GeoCoordinates from './components/GeoCoordinates/GeoCoordinates';
import * as filterService from '../../../../services/Pairings';
import {
  getDataValue,
  getDates,
  getTimes,
  getDataResolver,
  isServerSideSearch,
  validateDurationRange,
  validateRange,
  getPaginationSize,
  getScope,
  getCurrentScenario,
  getTooltipKey,
  isSelectAll,
  getDefaultValues,
  checkIsSubCategory,
} from './helpers';

export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm';
export const TIME_FORMAT = 'HH:mm';

export const criteriaConfig = {
  cnxAchg: {
    data: filterService.getTOGAircraftType,
  },
  flightStDow: {
    data: filterService.getStartAndEndDOWType,
  },
  flightEdDow: {
    data: filterService.getStartAndEndDOWType,
  },
  legsFlightStDow: {
    data: filterService.getStartAndEndDOWType,
  },
  legsFlightEdDow: {
    data: filterService.getStartAndEndDOWType,
  },
  arrvStation: {
    data: filterService.getStations,
    scope: 'pairings',
    paginationSize: 500,
  },
  depStation: {
    data: filterService.getStations,
    scope: 'pairings',
    paginationSize: 500,
  },
  legsArrvStation: {
    data: filterService.getStations,
    scope: 'flights',
    paginationSize: 500,
  },
  legsDepStation: {
    data: filterService.getStations,
    scope: 'flights',
    paginationSize: 500,
  },
  arrCountry: {
    data: filterService.getCountries,
    scope: 'pairings',
    paginationSize: 300,
  },
  depCountry: {
    data: filterService.getCountries,
    scope: 'pairings',
    paginationSize: 300,
  },
  legsArrvCnt: {
    data: filterService.getCountries,
    scope: 'flights',
    paginationSize: 300,
  },
  legsDepCnt: {
    data: filterService.getCountries,
    scope: 'flights',
    paginationSize: 300,
  },
  arrvReg: {
    data: filterService.getRegions,
    scope: 'pairings',
    paginationSize: 300,
  },
  depReg: {
    data: filterService.getRegions,
    scope: 'pairings',
    paginationSize: 300,
  },
  legsArrvReg: {
    data: filterService.getRegions,
    scope: 'flights',
    paginationSize: 300,
  },
  legsDepReg: {
    data: filterService.getRegions,
    scope: 'flights',
    paginationSize: 300,
  },
  crewBase: {
    data: filterService.getCrewBases,
    scope: 'pairings',
    paginationSize: 300,
  },
  crewComposition: {
    data: filterService.getCrewCompositions,
    scope: 'pairings',
    paginationSize: 300,
    tooltipKey: 'tooltip',
  },
  arType: {
    data: filterService.getAircraftTypes,
    scope: 'pairings',
    paginationSize: 300,
  },
  legsArType: {
    data: filterService.getAircraftTypes,
    scope: 'flights',
    paginationSize: 300,
  },
  layoverAt: {
    data: filterService.getLayovers,
    scope: 'layovers',
    paginationSize: 300,
  },
  cnxAt: {
    data: filterService.getStations,
    scope: 'pairings',
    paginationSize: 500,
  },
  pairingName: {
    data: filterService.getPairingNames,
    scope: 'pairings',
    paginationSize: 300,
    enableServerSearch: true,
  },
  flightDesig: {
    data: filterService.getFlightDesignators,
    scope: 'pairings',
    paginationSize: 300,
    enableServerSearch: true,
  },
  legsFlightDesig: {
    data: filterService.getFlightDesignators,
    scope: 'flights',
    paginationSize: 300,
    enableServerSearch: true,
  },
  pairingDeadHeads: {
    data: filterService.getPairingDeadheads,
    selectAll: true,
  },
  flightTypes: {
    data: filterService.getFlightTypes,
    defaultValues: ['@isACT'],
    isSubCategory: true,
  },
  pairingsFlightCoverage: {
    data: filterService.getPairingFlightCoverage,
  },
  flightsFlightCoverage: {
    data: filterService.getFlightsFlightCoverage,
  },
};

export const getComponent = (t, data, location) => {
  const config = {
    integerType: {
      component: GenericTextField,
      props: {
        type: 'text',
        value: getDataValue(data),
        rightPadding: '',
        placeholder: '',
        style: { width: '160px' },
        maxInputLength: 8,
        minInputLength: 3,
        enableReset: true,
        pattern: /^-?(\d?|\d+)$/,
        converter: parseInt,
      },
    },
    stringType: {
      component: GenericTextField,
      props: {
        type: 'text',
        value: getDataValue(data),
        rightPadding: '',
        placeholder: '',
        style: { width: '160px' },
        maxInputLength: 100,
        minInputLength: 5,
        enableReset: true,
      },
    },
    durationType: {
      component: MinMaxBox,
      props: {
        type: 'text',
        value: getDataValue(data),
        placeholder: '0h00',
        style: { width: '70px' },
        maxInputLength: 11,
        innerPattern: /^(\d?\d?\d?\d?\d?\d?\d?\d?)(h\d?\d?)?$/,
        pattern: /^(\d?\d?\d?\d?\d?\d?\d?)\dh[0-5][0-9]$/,
        rangeValidator: validateDurationRange,
        invalidFormatMessage: t('ERRORS.FILTER.durationFormatIncorrect'),
        rangeErrorMessage: t('ERRORS.FILTER.durationRangeError'),
      },
    },
    intRangeType: {
      component: MinMaxBox,
      props: {
        type: 'text',
        value: getDataValue(data),
        placeholder: '',
        style: { width: '70px' },
        maxInputLength: 8,
        innerPattern: /^(\d?|\d+)$/,
        pattern: /^(\d?|\d+)$/,
        converter: parseInt,
        rangeValidator: validateRange,
        rangeErrorMessage: t('ERRORS.FILTER.integerRangeError'),
      },
    },
    dateTimeType: {
      component: CompoundDateTimePicker,
      props: {
        returnDateFormat: DATE_FORMAT,
        displayDateFormat: 'yy/MM/dd HH:mm',
        containerStyle: { width: '160px' },
        value: getDates(data, location),
      },
    },
    timeType: {
      component: CompoundTimePicker,
      props: {
        returnTimeFormat: TIME_FORMAT,
        displayTimeFormat: TIME_FORMAT,
        containerStyle: { width: '160px' },
        value: getTimes(data),
      },
    },
    multiSelectSearchType: {
      component: CheckboxFilterWithErrorHandler,
      props: {
        dataResolver: getDataResolver(data),
        enableServerSearch: isServerSideSearch(data),
        render: data.render,
        scope: getScope(data),
        paginationSize: getPaginationSize(data),
        scenarioInfo: getCurrentScenario(location),
        tooltipKey: getTooltipKey(data),
        selectAll: isSelectAll(data),
      },
    },
    multiSelectType: {
      component: CheckboxFilterWithErrorHandler,
      props: {
        dataResolver: getDataResolver(data),
        searchBox: false,
        render: data.render,
        scenarioInfo: getCurrentScenario(location),
        tooltipKey: getTooltipKey(data),
        scope: getScope(data),
        selectAll: isSelectAll(data),
      },
    },
    multiSelectComboBox: {
      component: MultiSelectComboBoxWithErrorHandler,
      props: {
        dataResolver: getDataResolver(data),
        searchBox: false,
        render: data.render,
        scope: getScope(data),
        defaultValues: getDefaultValues(data),
        crName: data.crName,
        isSubCategory: checkIsSubCategory(data),
      },
    },
    geographicRangeType: {
      component: GeoCoordinates,
      props: {
        value: getDataValue(data),
        placeholder: '00.0000',
        style: { width: '70px' },
        rangeValidator: validateRange,
        pattern: /^[-+]?\d*\.{0,1}\d+$/,
      },
    },
  };

  return config[data.type];
};
