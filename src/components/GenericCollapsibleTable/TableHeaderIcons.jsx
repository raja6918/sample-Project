import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Icon from '../Icon';

const TableHeaderIcons = ({ toggleFilters }) => (
  <Fragment>
    <IconButton
      style={{ width: 45, height: 45 }}
      onClick={() => toggleFilters()}
    >
      <Icon iconcolor={'#0A75C2'} margin={'none'}>
        filter_list
      </Icon>
    </IconButton>
    {/* <IconButton style={{ width: 45, height: 45 }}>
      <Icon iconcolor={'#0A75C2'} margin={'none'}>
        more_vert
      </Icon>
    </IconButton> */}
  </Fragment>
);

TableHeaderIcons.propTypes = {
  toggleFilters: PropTypes.func.isRequired,
};

export default TableHeaderIcons;
