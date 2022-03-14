import moment from 'moment';
import {
  MIN_TIMELINE_WINDOW_HEIGHT,
  MIN_TIMELINE_WINDOW_HEIGHT_COLLAPSED,
} from './constants';

export const getDaysInDatesRange = (startDate, endDate) => {
  const date_1 = moment.utc(startDate);
  const date_2 = moment.utc(endDate);
  return Math.abs(date_1.diff(date_2, 'days')) + 1;
};

export const generateCalendarData = planing => {
  const months = {};
  const TLend = moment.utc(planing.timelineEndDate);
  const periodStart = moment.utc(planing.periodStartDate);
  const periodEnd = moment.utc(planing.periodEndDate);
  const dayAfterPeriodEnd = moment.utc(periodEnd).add(1, 'days');

  let current = moment.utc(planing.timelineStartDate);
  const period = {};

  while (TLend.diff(current, 'days') >= 0) {
    months[`${current.month()} ${current.year()}`] = current.format('MMMM');
    current.add(1, 'days');
  }

  for (const key in months) {
    if ({}.hasOwnProperty.call(months, key)) {
      const monthName = months[key];
      const [monthNumber, year] = key.split(' ');
      period[key] = {
        monthNumber,
        monthName,
        year,
        daysCount: 0,
        days: [],
      };
    }
  }

  current = moment.utc(planing.timelineStartDate);

  let dayIndex = 0;
  while (TLend.diff(current, 'days') >= 0) {
    const key = `${current.month()} ${current.year()}`;
    period[key].daysCount++;
    const day = {
      dayIndex,
      dayNumber: current.format('DD'),
      dayName: current.format('dddd'),
      dayShortName: current.format('dd'),
      isCarryIn: current.isBefore(periodStart),
      isCarryOut: current.isAfter(periodEnd),
      isPeriodStart: current.isSame(periodStart),
      isPeriodEnd: current.isSame(periodEnd),
      isDayAfterPeriodEnd: current.isSame(dayAfterPeriodEnd),
      isWeekend: current.weekday() === 6 || current.weekday() === 0,
      isFirstDayOfMonth: current.format('D') === '1',
      relativeDay: current.isBefore(periodStart)
        ? current.diff(periodStart, 'days')
        : current.diff(periodStart, 'days') + 1,
    };

    dayIndex++;
    period[key].days.push(day);
    current.add(1, 'days');
  }

  const planingPeriod = [];
  for (const key in period) {
    if ({}.hasOwnProperty.call(period, key)) {
      planingPeriod.push(period[key]);
    }
  }

  return planingPeriod;
};

export const transformDuration = duration => {
  if (!duration) return null;
  const [hours, minutes] = duration.split('h');
  return +hours + +minutes / 60;
};

export const calculateGAPDurationBetweenPairings = (
  currentPairing,
  nextPairing
) => {
  if (!nextPairing || !currentPairing) return null;
  const cpEndDate = moment.utc(currentPairing.endDateTime);
  const npStartDate = moment.utc(nextPairing.startDateTime);
  return npStartDate.diff(cpEndDate, 'minutes') / 60;
};

function groupByRowNumber(pairings) {
  const sorted = [];

  for (const pairing of pairings) {
    const { rowNumber } = pairing;

    if (!sorted[rowNumber]) {
      sorted[rowNumber] = [];
    }

    sorted[rowNumber].push({ ...pairing });
  }

  return sorted;
}

export const preparePairingsData = (pairings, startDate) => {
  if (!pairings || pairings.length === 0) return [];

  /* Creates a new copy of pairings to avoid mutation of the original
  backend response */
  const pairingsClone = JSON.parse(JSON.stringify(pairings));

  const timelineStartDate = moment.utc(startDate);

  for (let groupIdx = 0; groupIdx < pairingsClone.length; groupIdx++) {
    const pairingGroup = pairingsClone[groupIdx];
    const isEmptyPairing = pairingGroup._empty;
    if (!isEmptyPairing) {
      pairingGroup._grouppedPairings = groupByRowNumber(pairingGroup.pairings);
      if (
        pairingGroup._grouppedPairings &&
        pairingGroup._grouppedPairings.length > 0
      ) {
        for (const pairingRow of pairingGroup._grouppedPairings) {
          for (
            let pairingIdx = 0;
            pairingIdx < pairingRow.length;
            pairingIdx++
          ) {
            const previousPairing = pairingRow[pairingIdx - 1];
            const nextPairing = pairingRow[pairingIdx + 1];
            const pairing = pairingRow[pairingIdx];
            const pairingStartDate = moment.utc(pairing.startDateTime);
            const minutesFromTimelineStart = pairingStartDate.diff(
              timelineStartDate,
              'minutes'
            );

            pairing._hoursFromTimelineStart = minutesFromTimelineStart / 60;
            pairing._duration = transformDuration(pairing.duration);

            pairing._hoursToNextPairing = calculateGAPDurationBetweenPairings(
              pairing,
              nextPairing
            );
            pairing._hoursFromPrevPairing = previousPairing
              ? previousPairing._hoursToNextPairing
              : null;
          }
        }
      }
    }
  }

  return pairingsClone;
};

export const prepareFlightsData = (data, startDate) => {
  if (!data || data.length === 0) return [];
  const dataCopy = JSON.parse(JSON.stringify(data));

  const newFlights = [];

  for (let flightIdx = 0; flightIdx < dataCopy.length; flightIdx++) {
    const flight = dataCopy[flightIdx];
    const isEmptyFlight = flight._empty;
    if (!isEmptyFlight) {
      const flightInstances = flight.flightInstances;
      const newFlightActivities = [];
      const {
        departureStationCode,
        arrivalStationCode,
        ...restFlight
      } = flight;

      for (
        let flightInstanceIdx = 0;
        flightInstanceIdx < flightInstances.length;
        flightInstanceIdx++
      ) {
        const flightInstance = flightInstances[flightInstanceIdx];

        newFlightActivities.push({
          ...restFlight,
          departureStationCode: departureStationCode,
          arrivalStationCode: arrivalStationCode,
          ...flightInstance,
          type: 'FLT',
          rowNumber: 0,
        });
      }

      const newFlightObj = {
        id: flightIdx,
        groupId: flightIdx,
        rowCount: 1,
        pairings: newFlightActivities,
      };

      newFlights.push(newFlightObj);
    } else {
      newFlights.push(flight);
    }
  }

  return preparePairingsData(newFlights, startDate);
};

export const formatDate = (date, mask = 'H:mm') => {
  if (!date) return '';
  return moment.utc(date).format(mask);
};

export const indexingWindows = windows =>
  windows.map((window, index) => ({
    index,
    ...window,
  }));

export const splitValue = num => {
  const value2 = Math.floor(num / 2);
  const value1 = num - value2;
  return [value1, value2];
};

export function calculateHeightsAfterUncollapse(currentWindowIndex) {
  const timelineWindows = [...this.state.timelineWindows];
  const windowsHeights = timelineWindows.map(window => window.height);
  const indexedWindows = indexingWindows(timelineWindows);
  const currentWindow = { ...timelineWindows[currentWindowIndex] };

  /* A Candidate Window is a Timeline Window that can hold at least
    2 Timeline Windows at its minimum height
  */
  const candidateWindowMinHeight =
    MIN_TIMELINE_WINDOW_HEIGHT * 2 - MIN_TIMELINE_WINDOW_HEIGHT_COLLAPSED;
  const candidateWindowSearch = window =>
    window.height >= candidateWindowMinHeight;

  /* The first Candidate Window before the window which is about to uncollapse (current window) */
  const candidateWindowPrev = indexedWindows
    .slice(0, currentWindowIndex)
    .reverse()
    .find(candidateWindowSearch);

  let candidateWindowNext = null;

  /*
    If there is not a Candidate Window prior to the current window,
   look for a Candidate Window after the current window
  */
  if (!candidateWindowPrev) {
    candidateWindowNext = indexedWindows
      .slice(currentWindowIndex + 1)
      .find(candidateWindowSearch);
  }

  const neighborWindow = candidateWindowPrev || candidateWindowNext;
  const currentPlusNeighborHeight =
    currentWindow.height + neighborWindow.height;

  const neighborWindowNewHeight =
    neighborWindow.height -
    currentWindow.prevHeight +
    MIN_TIMELINE_WINDOW_HEIGHT_COLLAPSED;

  if (neighborWindowNewHeight >= MIN_TIMELINE_WINDOW_HEIGHT) {
    windowsHeights[currentWindowIndex] = currentWindow.prevHeight;
    windowsHeights[neighborWindow.index] = neighborWindowNewHeight;
  } else {
    windowsHeights[currentWindowIndex] =
      currentPlusNeighborHeight - MIN_TIMELINE_WINDOW_HEIGHT;
    windowsHeights[neighborWindow.index] = MIN_TIMELINE_WINDOW_HEIGHT;
  }

  return windowsHeights;
}

export const elementsCollide = (label, nextLabel) => {
  const [finalLabel] = label.getElementsByClassName('lbl-name');
  const lblOffset = finalLabel.getBoundingClientRect();
  const lblWidth = lblOffset.width;
  const lblDistanceFromLeft = lblOffset.left + lblWidth;

  const [finalNextLabel] = nextLabel.getElementsByClassName('lbl-name');
  const nextlblOffset = finalNextLabel.getBoundingClientRect();
  const nextlblWidth = nextlblOffset.width;
  const nextlblDistanceFromLeft = nextlblOffset.left + nextlblWidth;

  const notColliding =
    lblDistanceFromLeft < nextlblOffset.left ||
    lblOffset.left > nextlblDistanceFromLeft;

  return !notColliding;
};

export function findOptimalStartAndEndIndex(
  objectsToRender,
  startIndex,
  endIndex
) {
  const __sample = objectsToRender.slice(startIndex, endIndex);
  const firstEmptyIndex = __sample.findIndex(elem => elem._empty);

  if (firstEmptyIndex < 0) {
    return { startIndex: null, endIndex: null };
  }

  const lastEmptyIndex = __sample.reverse().findIndex(elem => elem._empty);

  const newStartIndex = startIndex + firstEmptyIndex;
  const newEndIndex = endIndex - lastEmptyIndex;

  return { startIndex: newStartIndex, endIndex: newEndIndex };
}
