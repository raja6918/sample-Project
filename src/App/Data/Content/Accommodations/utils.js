import { DEFAULT_COST, DEFAULT_DURATION } from './Constants';

import {
  PER_CREW_MEMBER,
  USD,
  CHECKIN_CHECKOUT,
} from './../../../../_shared/configurationEntities';

import { getStringHours } from './../../../../_shared/helpers';

export const TRANSIT_TIME_MAX_VALUE = 2147483647;

const hasTrueValueObject = obj => {
  const Keys = Object.keys(obj);
  for (let i = 0; i < Keys.length; i++) {
    if (obj[Keys[i]]) {
      return true;
    }
  }
  return false;
};

const isThereATransitError = transitErrors => {
  const Keys = Object.keys(transitErrors);

  // Looping station codes
  for (let i = 0; i < Keys.length; i++) {
    const code = transitErrors[Keys[i]];
    const codeKeys = Object.keys(code);

    //Looping code properties
    for (let j = 0; j < codeKeys.length; j++) {
      if (typeof code[codeKeys[j]] === 'boolean' && code[codeKeys[j]]) {
        return true; // There is an error in transit section
      } else if (typeof code[codeKeys[j]] === 'object' && code[codeKeys[j]]) {
        //Loop through the internal array
        let isError = false;
        code[codeKeys[j]].forEach(item => {
          if (hasTrueValueObject(item)) {
            isError = true; //Errors in extra time array
          }
        });
        if (isError) {
          return true;
        }
      }
    }
  }
  return false; //No errors
};

const areValidTransitDetails = transitDetails => {
  const Keys = Object.keys(transitDetails);
  for (let i = 0; i < Keys.length; i++) {
    const code = transitDetails[Keys[i]];
    const { duration, extraTravelTimes, transportCost } = code;

    if (
      duration === '' ||
      duration === '-0' ||
      isNaN(duration) ||
      parseFloat(duration) < 0 ||
      duration > TRANSIT_TIME_MAX_VALUE
    ) {
      return false;
    }
    if (
      transportCost < 0 ||
      transportCost === '-0' ||
      isNaN(transportCost) ||
      transportCost === ''
    ) {
      return false;
    }
    for (let i = 0; i < extraTravelTimes.length; i++) {
      if (
        extraTravelTimes[i].extraTime === '' ||
        isNaN(extraTravelTimes[i].extraTime) ||
        parseFloat(extraTravelTimes[i].extraTime) < 0
      ) {
        return false;
      }
    }
  }
  return true;
};

export const isReadyToSubmit = (
  state,
  transitDetails,
  transitErrors,
  defaultTransists
) => {
  const {
    name,
    stations,
    typeCode,
    contractStartDate,
    contractLastDate,
    cost,
    currencyCode,
    billingPolicyCode,
    checkInTime,
    checkOutTime,
    errors,
  } = state;

  let isTransitSectionError = transitErrors
    ? isThereATransitError(transitErrors)
    : false;

  isTransitSectionError = defaultTransists ? false : isTransitSectionError;

  const isValidTransitDetails = defaultTransists
    ? true
    : areValidTransitDetails(transitDetails);

  const valid =
    name &&
    stations.length > 0 &&
    typeCode &&
    contractStartDate &&
    contractLastDate &&
    cost &&
    currencyCode &&
    isValidTransitDetails;

  const isCheckInOutTime = billingPolicyCode === CHECKIN_CHECKOUT;

  const areCheckInOutTimesValid = isCheckInOutTime
    ? checkInTime !== null && checkOutTime !== null
    : true;

  const noErrors =
    !errors.name &&
    !errors.cost &&
    !errors.extendedStayCostFactor &&
    !errors.capacity &&
    !isTransitSectionError;

  if (isCheckInOutTime) {
    return valid && noErrors && areCheckInOutTimesValid;
  } else {
    return valid && noErrors;
  }
};

export const countDecimals = value => {
  if (value.includes('.')) {
    return value.split('.')[1].length || 0;
  } else {
    return 0;
  }
};

export const evaluateRegex = (regex, term) => {
  const reg = new RegExp(regex);
  const isValidRegex = reg.test(term);
  return isValidRegex;
};

const getExtraTimesArray = extraTravelTimes => {
  let newExtraTimesArray = [];
  for (let i = 0; i < extraTravelTimes.length; i++) {
    newExtraTimesArray = [
      ...newExtraTimesArray,
      {
        duration: extraTravelTimes[i].extraTime,
        startTime: getStringHours(extraTravelTimes[i].startTime),
        endTime: getStringHours(extraTravelTimes[i].endTime),
      },
    ];
  }
  return newExtraTimesArray;
};

export const formatTransitDetails = transitDetails => {
  const Keys = Object.keys(transitDetails);
  let newTransitDetails = [];
  /* Looping through all the codes */
  for (let i = 0; i < Keys.length; i++) {
    newTransitDetails = [
      ...newTransitDetails,
      {
        billingPolicyCode: transitDetails[Keys[i]].billingPolicyCode,
        cost: +transitDetails[Keys[i]].transportCost,
        currencyCode: transitDetails[Keys[i]].transportCurrencyCode,
        duration: +transitDetails[Keys[i]].duration,
        extraTravelTimes: getExtraTimesArray(
          transitDetails[Keys[i]].extraTravelTimes
        ),
        stationCode: Keys[i],
      },
    ];
  }

  return newTransitDetails;
};

const formatTimeToDate = time => {
  const [getHours, getMinutes] = time.split(':');
  const date = new Date('10/10/2010').setHours(getHours);
  const time2 = new Date(date);

  time2.setMinutes(getMinutes);

  return time2;
};

const getInverseExtraTimeArray = extraTravelTimes => {
  let newExtraTimesArray = [];
  for (let i = 0; i < extraTravelTimes.length; i++) {
    newExtraTimesArray = [
      ...newExtraTimesArray,
      {
        extraTime: extraTravelTimes[i].duration,
        startTime: formatTimeToDate(extraTravelTimes[i].startTime),
        endTime: formatTimeToDate(extraTravelTimes[i].endTime),
      },
    ];
  }
  return newExtraTimesArray;
};

export const formatInverseTransitDetails = transitDetails => {
  let newTransitDetails = {};
  for (let i = 0; i < transitDetails.length; i++) {
    newTransitDetails = {
      ...newTransitDetails,
      [transitDetails[i].stationCode]: {
        billingPolicyCode: transitDetails[i].billingPolicyCode,
        transportCost: transitDetails[i].cost,
        transportCurrencyCode: transitDetails[i].currencyCode,
        duration: transitDetails[i].duration,
        extraTravelTimes: getInverseExtraTimeArray(
          transitDetails[i].extraTravelTimes
        ),
        stationCode: transitDetails[i].stationCode,
      },
    };
  }

  return newTransitDetails;
};

export const getDefaultTransitDetails = stations => {
  let newTransitDetails = [];
  for (let i = 0; i < stations.length; i++) {
    newTransitDetails = [
      ...newTransitDetails,
      {
        billingPolicyCode: PER_CREW_MEMBER,
        cost: DEFAULT_COST,
        currencyCode: USD,
        duration: DEFAULT_DURATION,
        extraTravelTimes: [],
        stationCode: stations[i].code,
      },
    ];
  }
  return newTransitDetails;
};

export const prepareCurrencyCodes = currencyCodes => {
  return currencyCodes.map(currencyCode => ({
    value: currencyCode,
    display: currencyCode,
  }));
};
