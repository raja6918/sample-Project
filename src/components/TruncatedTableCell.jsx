import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';

import TableCell from '@material-ui/core/TableCell';
import SierraMuiTooltip from '../_shared/components/SierraMuiTooltip/SierraMuiTooltip';

const Tooltip = styled(SierraMuiTooltip)`
  div {
    font-size: 11px;
  }
  div[data-placement='top-start'] {
    top: 5px !important;
  }
  div[data-placement='bottom-start'] {
    top: -5px !important;
  }
`;
Tooltip.displayName = 'Tooltip';
TableCell.displayName = 'TableCell';

class TruncatedTableCell extends React.Component {
  state = {
    showTooltip: false,
  };

  componentDidMount() {
    this.checkWidth();
    window.addEventListener('resize', this.checkWidth);
  }

  checkWidth = _.debounce(() => {
    const element = document.getElementById(this.props.id);
    this.setState({
      showTooltip: element.scrollWidth > element.clientWidth,
    });
  }, 300);

  componentWillUnmount() {
    this.checkWidth.cancel();
    window.removeEventListener('resize', this.checkWidth);
  }
  render() {
    const { text } = this.props;

    if (this.state.showTooltip) {
      return (
        <TableCell
          style={this.props.style}
          onClick={this.props.onClick}
          id={this.props.id}
        >
          <SierraMuiTooltip title={text} placement="top-start">
            <span>{this.props.children}</span>
          </SierraMuiTooltip>
        </TableCell>
      );
    } else {
      return (
        <TableCell
          style={this.props.style}
          onClick={this.props.onClick}
          id={this.props.id}
        >
          <div>{this.props.children}</div>
        </TableCell>
      );
    }
  }
}

TruncatedTableCell.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  text: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.shape(),
  children: PropTypes.string,
};

TruncatedTableCell.defaultProps = {
  id: Date.now(),
  text: '',
  onClick: () => {},
  style: {},
  children: '',
};

export default TruncatedTableCell;
