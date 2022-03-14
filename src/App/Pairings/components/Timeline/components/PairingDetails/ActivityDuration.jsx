import React from 'react';
import className from 'classnames';
import PropTypes from 'prop-types';

class ActivityDuration extends React.Component {
  render() {
    const { startLabel, endLabel, checkpoints } = this.props;
    const containerClassNames = className({
      'activity-duration': true,
    });
    return (
      <div className={containerClassNames}>
        <span className="start-label">{startLabel}</span>
        {checkpoints.map((checkpoint, idx) => {
          const durationClassNames = className({
            duration: true,
            'airport-shuttle': checkpoint.isStationShuttle,
          });

          const lineClassNames = className({
            line: true,
            'auto-grow': !checkpoint.isStationShuttle,
          });

          return (
            <React.Fragment key={idx}>
              <span className="bullet" />
              <span className={lineClassNames} />
              <span className={durationClassNames}>
                {checkpoint.isStationShuttle && (
                  <i className="material-icons">airport_shuttle</i>
                )}
                <span>{checkpoint.duration}</span>
              </span>
              <span className={lineClassNames} />
            </React.Fragment>
          );
        })}
        <span className="bullet" />
        <span className="end-label">{endLabel}</span>
      </div>
    );
  }
}

ActivityDuration.propTypes = {
  startLabel: PropTypes.node.isRequired,
  endLabel: PropTypes.node.isRequired,
  checkpoints: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ActivityDuration;
