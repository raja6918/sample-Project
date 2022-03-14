import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from './../helpers';

/* This is a Pure component and it only renders one time */
class PairingLabels extends PureComponent {
  render() {
    const { activity, t, ...rest } = this.props;
    const textLabels = [];
    const station = activity.stationCode || '';
    const duration = activity.duration || '';
    const type = activity.type;

    switch (type) {
      case 'LO': {
        const departureStation = activity.departureStationCode || '';
        const arrivalStation = activity.departureStationCode || '';
        const station =
          departureStation === arrivalStation
            ? departureStation
            : `${departureStation}/${departureStation}`;

        textLabels[0] = [station];
        textLabels[1] = [duration];
        break;
      }

      case 'BRF':
      case 'DBRF':
      case 'CNX':
        textLabels[0] = [station];
        textLabels[1] = [duration];
        break;

      case 'DHI':
      case 'CML':
      case 'FLT': {
        const departure = formatDate(activity.startDateTime);
        const arrival = formatDate(activity.endDateTime);
        textLabels[0] = [activity.flightNumber];
        textLabels[1] = [activity.duration, `${departure} - ${arrival}`];
        break;
      }

      case 'COTRM': {
        const shortName = t(
          `PAIRINGS.transportTypes.${activity.transportTypeCode}.shortName`
        );

        textLabels[0] = [shortName];
        textLabels[1] = [duration];
        break;
      }

      default:
        textLabels[0] = [duration];
        break;
    }

    let rowClassName = 'pa-labels-row';

    /*
    This is a trick just to avoid the processLabels() function to touch this labels.
    We will revisit this in the coming sprints
    */
    if (type === 'LO') {
      rowClassName = 'pa-labels-row-rest';
    }

    const labels = textLabels.map((row, idx) => (
      <span key={`row-${idx}`} className={rowClassName}>
        {row.map((label, idx) => (
          <span key={`label-${idx}`} className="pa-label">
            {label}
          </span>
        ))}
      </span>
    ));

    return (
      <span {...rest} className="pa-labels-group">
        {labels}
      </span>
    );
  }
}

PairingLabels.propTypes = {
  activity: PropTypes.shape({}).isRequired,
};

export default PairingLabels;
