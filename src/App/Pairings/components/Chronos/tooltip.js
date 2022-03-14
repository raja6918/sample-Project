import moment from 'moment';
import DOMPurify from 'dompurify';
import { services } from './iFlightGantt/core';
import { convertTime } from './utils';
import { isTreeMode, isSplitMode } from './constants';
import {
  briefTemplate,
  CommercialDeadHeadTemplate,
  connectionTemplate,
  deadHeadTemplate,
  flightTemplate,
  restTemplate,
  coterminalTemplate,
} from './tooltipTemplate';

let prevItemId;
let timer;

export const getTemplate = (activity, context) => {
  switch (activity.type) {
    case 'FLT': {
      return flightTemplate(activity, context);
    }
    case 'BRF': {
      return briefTemplate(activity);
    }
    case 'DBRF': {
      return briefTemplate(activity);
    }
    case 'CNX': {
      return connectionTemplate(activity);
    }
    case 'LCNX': {
      return connectionTemplate(activity);
    }
    case 'LO': {
      return restTemplate(activity);
    }
    case 'DHI': {
      return deadHeadTemplate(activity);
    }
    case 'CML': {
      return CommercialDeadHeadTemplate(activity);
    }
    case 'COTRM': {
      return coterminalTemplate(activity);
    }
    default:
      return '';
  }
};

export const generateCrewComposition = (
  crewComposition,
  coverageBalance,
  context
) => {
  const crewDescriptionHtml = [];
  const coverageHtml = [];
  const balanceHtml = [];
  const balance = [];
  const totalPositions = crewComposition.length;
  const positionCodes = context.props.selectedCrewGroup
    ? context.props.selectedCrewGroup.positionCodes
    : [];
  for (let i = 0; i < totalPositions; i++) {
    const position = crewComposition[i];
    const isPosition = positionCodes.includes(position.positionCode);
    const positionCoverage =
      coverageBalance.find(
        coverageItem => coverageItem.positionCode === position.positionCode
      ) || {};
    const positionBalance = positionCoverage.balance || 0;
    const isUnderlined = positionBalance < 0;
    const isOverlined = positionBalance > 0;

    const coverageBalanceStr =
      positionBalance > 0 ? `+${positionBalance}` : positionBalance;

    crewDescriptionHtml.push(
      `<span class=${!isPosition ? 'noPosition' : ''}>
         ${position.quantity} ${position.positionCode}${
        i === totalPositions - 1 ? '' : ','
      }
        </span>`
    );

    coverageHtml.push(
      `<span class=${!isPosition ? 'noPosition' : ''}>
         ${isPosition ? position.quantity + positionBalance : 'X'} ${
        position.positionCode
      }${i === totalPositions - 1 ? '' : ','}
        </span>`
    );

    if (isUnderlined || isOverlined) {
      balance.push(
        positionBalance !== 0
          ? `${coverageBalanceStr} ${position.positionCode}`
          : ''
      );
    }
  }

  for (let i = 0; i < balance.length; i++) {
    balanceHtml.push(
      `<span class="under">  ${balance[i]}${
        i === balance.length - 1 ? '' : ','
      }</span>`
    );
  }

  return {
    crewDescription: crewDescriptionHtml.join(''),
    coverage: coverageHtml.join(''),
    balance: balanceHtml.join(''),
  };
};

export const mountTooltip = (activity, position, barHeight, context) => {
  const containerDiv = document.querySelector('#W1');
  const containerDistanceToTop =
    window.pageYOffset + containerDiv.getBoundingClientRect().top;
  let toolipWidth = 0;
  let tooltipHeight = 0;
  const arrowHeight = 8;
  let isArrowBottom = false;

  let top;
  let left;

  const tooltipContainer = document.getElementById('sierra-tooltip');
  if (tooltipContainer) {
    tooltipContainer.innerHTML = DOMPurify.sanitize(
      getTemplate(activity, context)
    );
    if (tooltipContainer.hasChildNodes()) {
      toolipWidth = tooltipContainer.offsetWidth;
      tooltipHeight = tooltipContainer.offsetHeight;

      const activityCenter = activity ? activity.width / 2 : 0;
      const startWidth = activity ? activity.startWidth : 0;
      const arrowPosition =
        position.pageX - position.relativeX + startWidth + activityCenter;
      const leftPosition = arrowPosition - toolipWidth / 2;

      if (window.innerHeight - position.pageY > tooltipHeight + 20) {
        top =
          position.pageY -
          containerDistanceToTop -
          position.relativeY +
          barHeight +
          arrowHeight;
      } else {
        top =
          position.pageY -
          containerDistanceToTop -
          position.relativeY -
          tooltipHeight -
          arrowHeight;
        isArrowBottom = true;
      }

      if (position && leftPosition > 0) {
        left = leftPosition;
      } else {
        left = 2;
      }

      if (window.innerWidth - leftPosition < toolipWidth) {
        left = window.innerWidth - toolipWidth - 5;
      }

      let arrowLeft = arrowPosition - left;
      if (arrowPosition > window.innerWidth) {
        arrowLeft = window.innerWidth - left - 15;
      }

      if (arrowPosition < 0) {
        arrowLeft = left + 15;
      }

      tooltipContainer.style.top = `${top}px`;
      tooltipContainer.style.left = `${left}px`;

      tooltipContainer.style.setProperty(
        '--sierra-tooltip-left',
        `${arrowLeft}px`
      );

      if (isArrowBottom) {
        tooltipContainer.classList.remove('up');
        tooltipContainer.classList.add('down');
      } else {
        tooltipContainer.classList.remove('down');
        tooltipContainer.classList.add('up');
      }
      tooltipContainer.style.visibility = 'visible';
    }
  }
};

export const unmountTooltip = (clearPreviousItemId = true) => {
  if (clearPreviousItemId) prevItemId = null;

  const tooltipContainer = document.getElementById('sierra-tooltip');
  if (tooltipContainer) {
    tooltipContainer.style.visibility = 'hidden';
    tooltipContainer.style.top = `0px`;
    tooltipContainer.style.left = `0px`;
    tooltipContainer.innerHTML = '';
  }

  clearTimeout(timer);
};

const getPairingLabels = (currPaneObj, item, pos) => {
  let startWidth = 0;
  let label = '';
  let itemId = '';
  if (item.activities && Array.isArray(item.activities)) {
    item.activities.forEach(activity => {
      if (activity.activities) {
        activity.activities.forEach(activity => {
          const startDate = convertTime(activity.startDateTime);
          const endDate = convertTime(activity.endDateTime);
          const left = currPaneObj.getCanvasPixelForTimeWidth(startDate);
          const right = currPaneObj.getCanvasPixelForTimeWidth(endDate);
          const width = right - left;

          if (
            pos.relativeX > startWidth &&
            pos.relativeX < startWidth + width
          ) {
            label = { ...activity, width, startWidth };
            itemId = item.chronosId + '-' + activity.startDateTime;
          }

          startWidth += width;
        });
      } else {
        const startDate = convertTime(activity.startDateTime);
        const endDate = convertTime(activity.endDateTime);
        const left = currPaneObj.getCanvasPixelForTimeWidth(startDate);
        const right = currPaneObj.getCanvasPixelForTimeWidth(endDate);
        const width = right - left;

        if (pos.relativeX > startWidth && pos.relativeX < startWidth + width) {
          label = { ...activity, width, startWidth };
          itemId = item.chronosId + '-' + activity.startDateTime;
        }
        startWidth += width;
      }
    });
  }

  return { itemId, label };
};

const getFlightLabels = (currPaneObj, item, pos) => {
  const startWidth = 0;
  let label = '';
  let itemId = '';

  const left = currPaneObj.getCanvasPixelForTimeWidth(item.startDate);
  const right = currPaneObj.getCanvasPixelForTimeWidth(item.endDate);
  const width = right - left;

  label = { ...item, width, startWidth };
  itemId = item.chronosId + '-' + item.startDateTime;

  return { itemId, label };
};

export const generateTooltip = (data, context) => {
  const { data: item, pos } = data;

  const barHeight =
    context.zoomObject && (context.zoomObject.minTickHeight * 60) / 100;

  const currPaneObj = services.getCurrentPaneObject(
    context.$scope.paneObjArr,
    isTreeMode,
    isSplitMode
  );

  if (item) {
    let labelInfo;
    if (item.type === 'PRG') {
      labelInfo = getPairingLabels(currPaneObj, item, pos);
    }

    if (['FLT', 'DHI', 'CML'].includes(item.type)) {
      labelInfo = getFlightLabels(currPaneObj, item, pos);
    }

    if (labelInfo && pos && barHeight) {
      if (prevItemId === labelInfo.itemId) {
        return;
      }
      prevItemId = labelInfo.itemId;

      unmountTooltip(false);
      timer = setTimeout(() => {
        mountTooltip(labelInfo.label, pos, barHeight, context);
      }, 500);
    }
  }
};

export const formatDate = (date, mask = 'H:mm') => {
  if (!date) return '';
  return moment.utc(date).format(mask);
};

export const getPairingsString = pairings => {
  return pairings && pairings.map(pairing => pairing.name).join(', ');
};

export const getDaysDiff = (startDate, endDate) => {
  const initialDate = moment.utc(startDate).startOf('day');
  const finalDate = moment.utc(endDate).startOf('day');
  const flightDaysDiff = finalDate.diff(initialDate, 'days');
  return flightDaysDiff > 0 ? `(+${flightDaysDiff})` : '';
};
