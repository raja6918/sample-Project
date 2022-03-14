import React from 'react';
import className from 'classnames';
import PropTypes from 'prop-types';
import compact from 'lodash/compact';

import { formatDate } from '../../helpers';
import { getDaysDiff } from './helpers';

class ActivityDuration extends React.Component {
  getActivityInfo = () => {
    const { activity } = this.props;
    const duration = activity.duration || '';
    const departure = formatDate(activity.startDateTime, 'HH:mm');
    const arrival = formatDate(activity.endDateTime, 'HH:mm');

    const startLabels = [];
    const endLabels = [];
    const middleLabels = [duration];
    middleLabels[2] = <span>&nbsp;</span>;

    startLabels[0] = activity.departureStationCode || activity.stationCode;
    startLabels[1] = departure;

    endLabels[0] = activity.arrivalStationCode || activity.stationCode;
    endLabels[1] = arrival;

    switch (activity.type) {
      case 'CNX':
      case 'LCNX': {
        middleLabels[1] = <i className="material-icons icon-line">autorenew</i>;
        break;
      }
      case 'COTRM': {
        middleLabels[1] = (
          <i className="material-icons icon-line">airport_shuttle</i>
        );
        break;
      }
      case 'BRF': {
        middleLabels[1] = (
          <i className="material-icons icon-line">assignment</i>
        );
        break;
      }
      case 'DBRF': {
        middleLabels[1] = (
          <i className="material-icons icon-line">assignment</i>
        );
        break;
      }
      case 'LO': {
        middleLabels[1] = <i className="material-icons icon-line">hotel</i>;

        const flightDaysDiff = getDaysDiff(
          activity.startDateTime,
          activity.endDateTime
        );
        if (flightDaysDiff > 0) {
          endLabels[2] = `(+${flightDaysDiff})`;
        }
        break;
      }
      case 'CML':
      case 'DHI': {
        middleLabels[1] = <i className="material-icons icon-line">loop</i>;
        break;
      }
      case 'FLT': {
        middleLabels[1] = (
          <i className="material-icons icon-line rotate-icon">flight</i>
        );
        middleLabels[2] = [activity.aircraft || activity.aircraftTypeCode];
        break;
      }

      default:
        middleLabels[1] = <i className="material-icons icon-line">warning</i>;
        break;
    }

    return { startLabels, endLabels, middleLabels };
  };

  render() {
    const { startLabels, endLabels, middleLabels } = this.getActivityInfo();
    const { activity } = this.props;

    const containerClassNames = className({
      'activity-duration': true,
    });

    const durationClassNames = className({
      duration: true,
    });

    const lineClassNames = className({
      line: true,
      'auto-grow': true,
    });

    const endLabelClassNames = className({
      'end-label': true,
      'elements-2': compact(endLabels).length === 2,
      [activity.type]: true,
    });

    return (
      <div className={containerClassNames}>
        <span className="start-label">
          {startLabels.map((lbl, idx) => (
            <span key={`start-label-text-${idx}`}>{lbl}</span>
          ))}
        </span>
        <span className="bullet" />
        <span className={lineClassNames} />
        <span className={durationClassNames}>
          {middleLabels.map((lbl, idx) => (
            <span key={`middle-label-text-${idx}`}>{lbl}</span>
          ))}
        </span>
        <span className={lineClassNames} />
        <span className="bullet" />
        <span className={endLabelClassNames}>
          {endLabels.map((lbl, idx) => (
            <span key={`end-label-text-${idx}`}>{lbl}</span>
          ))}
        </span>
      </div>
    );
  }
}

ActivityDuration.propTypes = {
  activity: PropTypes.shape({}).isRequired,
};

export default ActivityDuration;
