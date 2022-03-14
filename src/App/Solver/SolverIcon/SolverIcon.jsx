import React from 'react';
import PropTypes from 'prop-types';

import RocketIcon from './images/Solver-Launched-icon.svg';
import RunningIcon from './images/Solver-Running-icon.svg';
import Triangle from './images/Solver-Stopped-icon.svg';
import NotEmptyTriangle from './images/Solver-StoppedPartial-icon.svg';
import CompletedIcon from './images/Solver-Completed-icon.svg';
import FailedIcon from './images/Solver-Failed-icon.svg';
import CreatingIcon from './images/Solver-Creating-icon.svg';

const SolverIcon = ({ status, style, tooltip }) => {
  const iconNames = {
    READY_TO_LAUNCH: RocketIcon,
    Running: RunningIcon,
    Fetching: RunningIcon,
    default: RocketIcon,
    Creating: CreatingIcon,
    Waiting: CreatingIcon,
    Sending: CreatingIcon,
    Launching: CreatingIcon,
    Stopping: FailedIcon,
    'Done-success': CompletedIcon,
    'Done-stopped': FailedIcon,
    'Done-failed': FailedIcon,
    SUCCESS: CompletedIcon,
    ERROR: FailedIcon,
  };

  return (
    <img
      style={style}
      src={iconNames[status] || iconNames['default']}
      alt={tooltip}
    />
  );
};

SolverIcon.propTypes = {
  status: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  style: PropTypes.shape(),
};

SolverIcon.defaultProps = {
  tooltip: '',
  style: {},
};

export default SolverIcon;
