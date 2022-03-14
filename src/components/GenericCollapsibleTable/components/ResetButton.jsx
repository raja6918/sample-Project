import React from 'react';
import PropTypes from 'prop-types';
import ReplayIcon from '@material-ui/icons/Replay';
import IconButton from '@material-ui/core/IconButton';
import './style.scss';
import SierraMuiTooltip from '../../../_shared/components/SierraMuiTooltip/SierraMuiTooltip';

const commonTooltipProps = {
  interactive: false,
  arrow: true,
  placement: 'bottom',
};

const classes = {
  tooltip: 'zoom-tooltip',
  popper: `reset-zoom-popper`,
};

/**
 * Disabled buttons cannot have tooltip, So we need to manually prevent click interactions outside
 */
const ResetButton = ({ data, tooltipContent, handleReset, disabled, size }) => {
  const color = disabled ? 'disabled' : 'primary';
  return (
    <SierraMuiTooltip
      title={tooltipContent}
      classes={classes}
      {...commonTooltipProps}
    >
      <span>
        <IconButton
          aria-label="reset icon"
          size={size}
          disabled={disabled}
          style={{ pointerEvents: 'auto' }}
          onClick={() => handleReset(data)}
        >
          <ReplayIcon color={color} fontSize={size} />
        </IconButton>
      </span>
    </SierraMuiTooltip>
  );
};

ResetButton.propTypes = {
  data: PropTypes.shape().isRequired,
  tooltipContent: PropTypes.string.isRequired,
  handleReset: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.string,
};

ResetButton.defaultProps = {
  disabled: false,
  size: 'small',
};

export default ResetButton;
