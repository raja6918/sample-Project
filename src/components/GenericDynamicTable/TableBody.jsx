import React from 'react';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RootRef from '@material-ui/core/RootRef';
import './GenericTable.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { perfectScrollConfig } from '../../utils/common';
import RowOptions from './RowOptions';

class GenericTableBody extends React.Component {
  state = {
    rowSelected: null,
    menuOptionsOpen: false,
    anchorEl: null,
  };

  previousScrollTop = 0;

  checkError = (data, field, errors, keyField) => {
    const hasError = Array.isArray(errors)
      ? errors.find(err => err.key === data[keyField] && err.field === field)
      : null;
    if (hasError) return true;
    return false;
  };

  selectRow = key => {
    this.setState({ rowSelected: key });
  };

  clearRow = () => {
    this.setState({
      rowSelected: null,
      menuOptionsOpen: false,
      anchorEl: null,
    });
  };

  handleMenuOptionsOpen = event => {
    this.setState({ menuOptionsOpen: true, anchorEl: event.currentTarget });
  };

  handleMenuOptionsClose = () => {
    this.setState({ menuOptionsOpen: false, anchorEl: null });
  };

  handleInsertRow = (index, position) => {
    this.handleMenuOptionsClose();
    this.props.handleInsertRow(index, position);
  };

  handleDeleteRow = index => {
    this.handleMenuOptionsClose();
    this.props.handleDeleteRow(index);
  };

  render() {
    const {
      t,
      data,
      headers,
      errors,
      keyField,
      readOnly,
      showRowOptions,
      getComponentDefaults,
      cellOverrides,
      handleCellOverrides,
    } = this.props;
    const { rowSelected, menuOptionsOpen, anchorEl } = this.state;

    return (
      <PerfectScrollbar
        containerRef={ref => {
          this._scrollRefY = ref;
        }}
        option={perfectScrollConfig}
      >
        <RootRef>
          <TableBody>
            {data.map((d, k) => {
              const key = k;
              return (
                <TableRow
                  key={key}
                  id={`tablerow-${key}`}
                  hover
                  classes={{
                    hover: 'hover',
                    selected: 'selected',
                    root: 'MuiTableRow',
                  }}
                  style={
                    showRowOptions && rowSelected === key
                      ? { backgroundColor: '#e8f4fc' }
                      : {}
                  }
                  onMouseEnter={() => this.selectRow(key)}
                  onMouseLeave={this.clearRow}
                >
                  {headers.map((header, index) => {
                    const hkey =
                      typeof header.field === 'symbol'
                        ? `_${index}`
                        : header.field;
                    let cellValue = d[header.field];

                    if (typeof d[header.field] === 'symbol') {
                      const config = getComponentDefaults(header.type);
                      cellValue = config ? config.defaultValue : '';
                    }

                    if (header.transformer) {
                      cellValue = header.transformer(cellValue);
                    }

                    let style = header.cellStyle
                      ? header.cellStyle
                      : {
                          backgroundColor:
                            rowSelected === key ? '#e8f4fc' : '#ffffff',
                        };

                    // if it is a columnHeader then we need to render it in grey background
                    if (header.columnHeader) {
                      style = { ...style, backgroundColor: '#e5e5e5' };
                    }

                    // if any custom component need to be rendered inside TableCell
                    if (header.component) {
                      const Component = header.component;
                      const componentData = { ...d, _header: header };
                      const componentStyle = header.componentStyle || {};

                      // To enable cell color and handle reset button based on cell row and column
                      const overrides = cellOverrides
                        ? handleCellOverrides(componentData)
                        : {};

                      if (overrides) {
                        componentData._header = {
                          ...componentData._header,
                          exceptionType: overrides.exceptionType,
                          revertTo: overrides.revertTo,
                        };
                      }

                      const hasError = this.checkError(
                        d,
                        header.field,
                        errors,
                        keyField
                      );
                      return (
                        <TableCell
                          key={hkey}
                          style={style}
                          className={overrides ? overrides.className : ''}
                        >
                          <Component
                            data={componentData}
                            value={cellValue}
                            error={hasError}
                            style={componentStyle}
                            id={`tablecomponent-${hkey}-${index}`}
                            {...header.props}
                            {...overrides}
                            placeholder={header.placeholder}
                          />
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={hkey} style={style}>
                        {cellValue}
                      </TableCell>
                    );
                  })}

                  <TableCell
                    style={{
                      width: '45px',
                      textAlign: 'left',
                      backgroundColor: rowSelected === key ? '#e8f4fc' : '#fff',
                    }}
                  >
                    {!readOnly && showRowOptions && rowSelected === key && (
                      <div style={{ position: 'relative' }}>
                        <IconButton
                          style={{ width: 40, height: 40, padding: 0 }}
                          onClick={this.handleMenuOptionsOpen}
                        >
                          <MoreVertIcon color={'primary'} />
                        </IconButton>
                        <RowOptions
                          t={t}
                          index={k}
                          anchorEl={anchorEl}
                          open={menuOptionsOpen}
                          handleClose={this.handleMenuOptionsClose}
                          handleInsertRow={this.handleInsertRow}
                          handleDeleteRow={this.handleDeleteRow}
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </RootRef>
      </PerfectScrollbar>
    );
  }
}

GenericTableBody.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape()),
  headers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      field: PropTypes.string,
    })
  ).isRequired,
  readOnly: PropTypes.bool.isRequired,
  keyField: PropTypes.string.isRequired,
  showRowOptions: PropTypes.bool.isRequired,
  handleInsertRow: PropTypes.func.isRequired,
  handleDeleteRow: PropTypes.func.isRequired,
  getComponentDefaults: PropTypes.func.isRequired,
  cellOverrides: PropTypes.bool.isRequired,
  handleCellOverrides: PropTypes.func.isRequired,
};

GenericTableBody.defaultProps = {
  data: [],
};

export default GenericTableBody;
