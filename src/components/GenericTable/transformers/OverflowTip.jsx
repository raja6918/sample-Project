import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SierraMuiTooltip from '../../../_shared/components/SierraMuiTooltip/SierraMuiTooltip';

const OverflowTip = props => {
  // Create Ref
  const textElementRef = useRef();

  // Define state and function to update the value
  const [hoverStatus, setHover] = useState(false);

  const compareSize = () => {
    const compare =
      textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
    setHover(compare);
  };

  useEffect(compareSize, [props.value]);

  return (
    <SierraMuiTooltip
      title={props.value}
      interactive
      disableHoverListener={!hoverStatus}
      style={props.tooltipStyle}
      classes={{ popper: `ellipse-zoom-popper` }}
    >
      <div
        ref={textElementRef}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: props.maxWidth,
        }}
      >
        {props.content}
      </div>
    </SierraMuiTooltip>
  );
};

OverflowTip.propTypes = {
  value: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  maxWidth: PropTypes.string.isRequired,
  tooltipStyle: PropTypes.shape(),
};

OverflowTip.defaultProps = {
  tooltipStyle: { fontSize: '14px' },
};

export default OverflowTip;
