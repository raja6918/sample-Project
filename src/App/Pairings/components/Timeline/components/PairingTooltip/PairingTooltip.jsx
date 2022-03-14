import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Tooltip as TippyTooltip } from 'react-tippy';
import ActivityDuration from './ActivityDuration';

import { TOOLTIPS_TITLE_PATH, TOOLTIPS_BODY_PATH } from './constants';
import { generateCrewComposition, toolTipPositioneSetter } from './helpers';

import 'react-tippy/dist/tippy.css';
import './PairingTooltip.scss';

const tippyTooltipProps = {
  transitionFlip: false,
  delay: 300,
  duration: 0,
  theme: 'transparent',
  arrow: true,
  interactive: true,
  style: { display: 'block' },
  hideOnClick: false,
  offset: 0,
  trigger: 'mouseenter',
  popperOptions: {
    placement: 'bottom',
    positionFixed: true,
    modifiers: {
      shift: {
        enabled: true,
        fn: data => {
          return toolTipPositioneSetter(data);
        },
      },
      arrow: {
        enabled: true,
        element: '.arrow-regular',
      },
    },
  },
  position: 'bottom',
};

class PairingTooltip extends Component {
  getActivityDuration = () => {
    const activity = this.props.activity;
    return <ActivityDuration activity={activity} />;
  };

  getTooltipInfo = () => {
    const { t, activity } = this.props;
    let textLabels = [];
    const station = activity.stationCode || '';
    const duration = activity.duration || '';
    const timezone = 'UTC'; // missing param

    switch (activity.type) {
      case 'CNX': {
        textLabels = [
          t(`${TOOLTIPS_TITLE_PATH}.connection`),
          t(
            `${TOOLTIPS_BODY_PATH}.${
              activity.aircraftChange
                ? 'connectionWithAircraftChange'
                : 'connectionWithoutAircraftChange'
            }`
          ),
        ];
        break;
      }
      case 'LCNX': {
        textLabels = [
          t(`${TOOLTIPS_TITLE_PATH}.longConnection`),
          t(
            `${TOOLTIPS_BODY_PATH}.${
              activity.aircraftChange
                ? 'connectionWithAircraftChange'
                : 'connectionWithoutAircraftChange'
            }`
          ),
        ];
        break;
      }
      case 'COTRM': {
        const name = t(
          `PAIRINGS.transportTypes.${activity.transportTypeCode}.name`
        );
        textLabels = [t(`${TOOLTIPS_TITLE_PATH}.coterminalTransport`), name];
        break;
      }
      case 'BRF': {
        textLabels = [
          t(`${TOOLTIPS_TITLE_PATH}.signOn`, { station }),
          t(`${TOOLTIPS_BODY_PATH}.timezone`, { timezone }),
        ];
        break;
      }
      case 'DBRF': {
        textLabels = [
          t(`${TOOLTIPS_TITLE_PATH}.signOff`, { station }),
          t(`${TOOLTIPS_BODY_PATH}.timezone`, { timezone }),
        ];
        break;
      }
      case 'LO': {
        textLabels = [
          t(`${TOOLTIPS_TITLE_PATH}.layover`, { station }),
          t(`${TOOLTIPS_BODY_PATH}.restPeriod`, { duration }),
        ];
        break;
      }
      case 'CML':
      case 'DHI': {
        const deadheadKey = `${TOOLTIPS_BODY_PATH}.${
          activity.type === 'CML' ? 'commercialDeadhead' : 'internalDeadhead'
        }`;
        textLabels = [
          t(`${TOOLTIPS_TITLE_PATH}.flight`, {
            flightNumber: activity.flightDesignator || activity.flightNumber,
          }),
          t(deadheadKey),
          t(`${TOOLTIPS_BODY_PATH}.timezone`, { timezone }),
        ];
        break;
      }
      case 'FLT': {
        const pairings = activity.pairings || [];
        const pairingsString = pairings.map(pairing => pairing.name).join(', ');
        const crewComposition = activity.crewComposition;
        const coverageBalance = activity.coverageBalance;

        textLabels = [
          t(`${TOOLTIPS_TITLE_PATH}.flight`, {
            flightNumber: activity.flightDesignator || activity.flightNumber,
          }),
          generateCrewComposition(crewComposition, coverageBalance, t),
          t(`${TOOLTIPS_BODY_PATH}.flightPairings`, {
            pairings: pairingsString,
          }),
        ];
        break;
      }

      default:
        textLabels[0] = duration;
        break;
    }

    return textLabels.map((label, idx) => (
      <span key={`pa-tooltip-text-${idx}`} className="pa-tooltip-text">
        {label}
      </span>
    ));
  };

  getTooltipContent = () => {
    return (
      <span className="pa-tooltip">
        <span className="activity-duration-container">
          {this.getActivityDuration()}
        </span>
        <span className="activity-description">{this.getTooltipInfo()}</span>
      </span>
    );
  };

  render() {
    return (
      <TippyTooltip {...tippyTooltipProps} html={this.getTooltipContent()}>
        {this.props.children}
      </TippyTooltip>
    );
  }
}

PairingTooltip.propTypes = {
  t: PropTypes.func.isRequired,
  activity: PropTypes.shape({}).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default PairingTooltip;
