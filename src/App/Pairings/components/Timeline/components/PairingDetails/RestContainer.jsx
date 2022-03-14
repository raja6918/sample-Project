import React from 'react';
import ActivityDuration from './ActivityDuration';
import { getMealsString, formatTime } from './helpers';

const translationKey = 'PAIRINGS.details';

class RestContainer extends React.Component {
  render() {
    const { t, activity } = this.props;
    const { startTimeStr, endTimeStr, daysDifference } = formatTime(
      activity.startDateTime,
      activity.endDateTime
    );

    const checkpoints = [
      {
        duration: activity.outboundTransportDuration,
        isStationShuttle: true,
      },
      {
        duration: activity.restAtAccommodation,
        isStationShuttle: false,
      },
      {
        duration: activity.inboundTransportDuration,
        isStationShuttle: true,
      },
    ];

    return (
      <div className="rest-container">
        <span>Rest at {activity.departureStationCode}</span>
        <div style={{ width: '400px' }}>
          <ActivityDuration
            startLabel={<span className="bold">{startTimeStr}</span>}
            endLabel={
              <span className="bold">
                {endTimeStr} {daysDifference > 0 && `(+${daysDifference})`}
              </span>
            }
            checkpoints={checkpoints}
          />
        </div>
        <div className="rest-attributes">
          <span className="rest-attribute">
            <i className="material-icons">hotel</i>
            <span>{activity.accommodationName}</span>
          </span>
          <span className="rest-attribute">
            <i className="material-icons">restaurant</i>
            <span>{getMealsString(activity.stats.meals)}</span>
          </span>
          <span className="rest-attribute">
            <i className="material-icons">money</i>
            <span>${activity.stats.cost}</span>
          </span>
        </div>
        <span className="more-info">
          <i className="material-icons">expand_more</i>
          <span>{t(`${translationKey}.seeMore`)}</span>
        </span>
      </div>
    );
  }
}

export default RestContainer;
