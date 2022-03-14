import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';

const TableOptionsMenu = styled(Menu)`
  & .MuiPaper-root {
    height: 155px;
    min-width: 200px;
    margin-left: -15px;
    margin-top: 10px;
  }
  & .MuiMenuItem-root {
    min-height: 46px;
    font-size: 15px;
  }
  & .MuiListItemIcon-root {
    min-width: 30px;
  }
`;

const RowOptions = ({
  t,
  index,
  open,
  anchorEl,
  handleClose,
  handleInsertRow,
  handleDeleteRow,
}) => (
  <TableOptionsMenu
    id="table-row-menu"
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
    <MenuItem onClick={() => handleInsertRow(index, 'above')}>
      <ListItemIcon>
        <ExpandLessIcon fontSize="small" />
      </ListItemIcon>
      {t('DYNAMIC_TABLE.rowOptions.rowAbove')}
    </MenuItem>
    <MenuItem onClick={() => handleInsertRow(index, 'below')}>
      <ListItemIcon>
        <ExpandMoreIcon fontSize="small" />
      </ListItemIcon>
      {t('DYNAMIC_TABLE.rowOptions.rowBelow')}
    </MenuItem>
    <MenuItem onClick={() => handleDeleteRow(index)}>
      <ListItemIcon>
        <DeleteIcon fontSize="small" />
      </ListItemIcon>
      {t('DYNAMIC_TABLE.rowOptions.deleteRow')}
    </MenuItem>
  </TableOptionsMenu>
);

RowOptions.propTypes = {
  t: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.shape(),
  handleClose: PropTypes.func.isRequired,
  handleInsertRow: PropTypes.func.isRequired,
  handleDeleteRow: PropTypes.func.isRequired,
};

RowOptions.defaultProps = {
  anchorEl: null,
};

export default RowOptions;
