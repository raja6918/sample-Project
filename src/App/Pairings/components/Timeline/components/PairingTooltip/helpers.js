import React from 'react';
import moment from 'moment';
import className from 'classnames';

import ReadMore from './ReadMore';

import { TOOLTIPS_BODY_PATH } from './constants';

export const toolTipPositioneSetter = data => {
  const dataObject = data;
  let arrowPosition,
    translateX = 0,
    translateY = 0,
    borderRadius = '6px';

  const referenceCoordinates = {
    left: dataObject.offsets.reference.left,
    right: dataObject.offsets.reference.right,
  };
  const popperCoordinates = {
    left: dataObject.offsets.popper.left,
    right: dataObject.offsets.popper.right,
    width: dataObject.offsets.popper.width,
  };
  const boundaries = { left: 0, right: window.innerWidth };
  const element = document.querySelector('.arrow-regular');
  const popperContainer = document.querySelector(' .tippy-tooltip');
  popperContainer.style.borderRadius = '6px';
  if (
    popperCoordinates.left < boundaries.left ||
    popperCoordinates.right > boundaries.right
  ) {
    if (popperCoordinates.left < 0) {
      if (
        referenceCoordinates.left < 0 &&
        !(popperCoordinates.left + popperCoordinates.width > boundaries.right)
      ) {
        arrowPosition = -element.offsetWidth;
        popperContainer.style.borderRadius = '0px 6px 6px 0px';
      } else {
        arrowPosition =
          Math.round(referenceCoordinates.right) -
          element.offsetWidth -
          dataObject.offsets.reference.width / 2 -
          2;
      }
    }
    if (popperCoordinates.left + popperCoordinates.width > boundaries.right) {
      translateX =
        popperCoordinates.left - (popperCoordinates.right - boundaries.right);
      if (referenceCoordinates.right < boundaries.right) {
        arrowPosition = Math.round(
          referenceCoordinates.left -
            (popperCoordinates.left -
              (popperCoordinates.right - boundaries.right)) +
            dataObject.offsets.reference.width / 2 -
            element.offsetWidth -
            2
        );
      } else {
        arrowPosition = Math.round(
          boundaries.right -
            (popperCoordinates.left -
              (popperCoordinates.right - boundaries.right)) -
            element.offsetWidth -
            2
        );
        popperContainer.style.borderRadius = '6px 0px 0px 6px';
      }
    }
    translateY = Math.ceil(dataObject.offsets.popper.top);
    dataObject.styles = {
      transform: 'translate3d(' + translateX + 'px,' + translateY + 'px,0)',
    };
    if (
      referenceCoordinates.left < element.offsetWidth &&
      referenceCoordinates.right < boundaries.right
    ) {
      popperContainer.style.borderRadius = '0px 6px 6px 0px';
    }

    if (
      referenceCoordinates.right > boundaries.right &&
      referenceCoordinates.left > boundaries.left
    ) {
      popperContainer.style.borderRadius = '6px 0px 0px 6px';
    }
    dataObject.arrowStyles = {
      position: 'absolute',
      left: arrowPosition + 'px',
      top: '',
    };
  }
  return dataObject;
};

export const getDaysDiff = (startDate, endDate) => {
  const initialDate = moment.utc(startDate).startOf('day');
  const finalDate = moment.utc(endDate).startOf('day');
  return finalDate.diff(initialDate, 'days');
};

export const generateCrewComposition = (
  crewComposition,
  coverageBalance,
  t
) => {
  const crewDescription = [];
  const totalPositions = crewComposition.length;

  for (let i = 0; i < totalPositions; i++) {
    const position = crewComposition[i];
    const positionCoverage =
      coverageBalance.find(
        coverageItem => coverageItem.positionCode === position.positionCode
      ) || {};
    const positionBalance = positionCoverage.balance || 0;
    const isUnderlined = positionBalance < 0;
    const isOverlined = positionBalance > 0;

    const classNames = className({
      underline: isUnderlined,
      overline: isOverlined,
    });

    const coverageBalanceStr =
      positionBalance > 0 ? `+${positionBalance}` : positionBalance;

    const isNotTheLastItem = i < totalPositions - 1;

    crewDescription.push(
      <span key={`position-${i}`} className={classNames}>
        {position.quantity} {position.positionCode}
        {positionBalance !== 0 && ` (${coverageBalanceStr})`}
      </span>
    );

    if (isNotTheLastItem) {
      crewDescription.push(
        <span key={`separator-${i}`} className="separator">
          ,{' '}
        </span>
      );
    }
  }

  /*
    This is a workaround to display the full view when crewDescription is short.
    This must be refactored in the near future.
  */
  let crewCompositionBody = (
    <span className="title">
      {t(`${TOOLTIPS_BODY_PATH}.flightCrewComposition`)} {crewDescription}
    </span>
  );

  if (crewDescription.length > 12) {
    crewCompositionBody = <ReadMore lines={1}>{crewCompositionBody}</ReadMore>;
  }

  return <div className="crew-composition-tooltip">{crewCompositionBody}</div>;
};
