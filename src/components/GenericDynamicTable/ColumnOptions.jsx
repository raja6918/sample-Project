import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import DeleteIcon from '@material-ui/icons/Delete';

const TableOptionsMenu = styled(Menu)`
  & .MuiPaper-root {
    height: 155px;
    min-width: 200px;
    margin-left: -15px;
    margin-top: 0px;
  }
  & .MuiMenuItem-root {
    min-height: 46px;
    font-size: 15px;
  }
  & .MuiListItemIcon-root {
    min-width: 30px;
  }
`;

const ColumnOptions = ({
  t,
  index,
  open,
  anchorEl,
  handleClose,
  handleInsertColumn,
  handleDeleteColumn,
}) => (
  <TableOptionsMenu
    id="table-column-menu"
    anchorEl={anchorEl}
    open={open}
    onClose={handleClose}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
  >
    <MenuItem onClick={() => handleInsertColumn(index, 'left')}>
      <ListItemIcon>
        <KeyboardArrowLeftIcon fontSize="small" />
      </ListItemIcon>
      {t('DYNAMIC_TABLE.columnOptions.columnLeft')}
    </MenuItem>
    <MenuItem onClick={() => handleInsertColumn(index, 'right')}>
      <ListItemIcon>
        <KeyboardArrowRightIcon fontSize="small" />
      </ListItemIcon>
      {t('DYNAMIC_TABLE.columnOptions.columnRight')}
    </MenuItem>
    <MenuItem onClick={() => handleDeleteColumn(index)}>
      <ListItemIcon>
        <DeleteIcon fontSize="small" />
      </ListItemIcon>
      {t('DYNAMIC_TABLE.columnOptions.deleteColumn')}
    </MenuItem>
  </TableOptionsMenu>
);

ColumnOptions.propTypes = {
  t: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.shape(),
  handleClose: PropTypes.func.isRequired,
  handleInsertColumn: PropTypes.func.isRequired,
  handleDeleteColumn: PropTypes.func.isRequired,
};

ColumnOptions.defaultProps = {
  anchorEl: null,
};

export default ColumnOptions;
