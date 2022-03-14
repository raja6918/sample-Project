import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';

import 'react-tippy/dist/tippy.css';
import './SierraTooltip.css';

class SierraTooltip extends React.Component {
  render() {
    const { children, ...rest } = this.props;
    const tooltipProps = {
      ...rest,
      theme: 'sierra',
    };
    return <Tooltip {...tooltipProps}>{children}</Tooltip>;
  }
}

SierraTooltip.propTypes = {
  arrow: PropTypes.bool,
  size: PropTypes.string,
};

SierraTooltip.defaultProps = {
  arrow: true,
  size: 'small',
};

export default SierraTooltip;
