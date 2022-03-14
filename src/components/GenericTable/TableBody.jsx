import React from 'react';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import RootRef from '@material-ui/core/RootRef';
import debounce from 'lodash/debounce';
import './GenericTable.css';
import throttle from 'lodash/throttle';
import Icon from '../Icon';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import ReadOnlyModeContext from '../../App/ReadOnlyModeContext';
import { DEFAULT_FIXED_COLUMNS, MIN_DISTANCE_TO_BOTTOM } from './constants';
import { perfectScrollConfig } from '../../utils/common';

class GenericTableBody extends React.Component {
  previousScrollTop = 0;

  handleDelete = item => {
    this.props.handleDeleteItem(item);
  };

  handleEdit = throttle(
    item => {
      document.querySelector(`#tablerow${item.id}`).classList.add('highlight');
      this.props.handleEditItem(item);
    },
    3000,
    { trailing: false }
  );

  handleDebouncedScroll = () => {
    if (this._scrollRefY) {
      const { clientHeight, scrollTop, scrollHeight } = this._scrollRefY;

      let nextItems = 0;

      const almostReachedBottom =
        Math.trunc(scrollHeight - scrollTop - clientHeight) <
        MIN_DISTANCE_TO_BOTTOM;

      const scrollMovementInPixels = Math.trunc(
        scrollTop - this.previousScrollTop
      );

      /* Calculate next items to request to API */
      if (scrollMovementInPixels > 0) {
        if (scrollMovementInPixels < 100) {
          nextItems = 10;
        } else if (scrollMovementInPixels < 200) {
          nextItems = 20;
        } else if (scrollMovementInPixels < 500) {
          nextItems = 30;
        } else if (scrollMovementInPixels < 700) {
          nextItems = 50;
        } else if (scrollMovementInPixels < 1000) {
          nextItems = 80;
        } else {
          nextItems = 100;
        }
      }

      /* Save the current scrollTop */
      this.previousScrollTop = scrollTop;

      if (almostReachedBottom && nextItems) {
        this.props.handleFetchData(nextItems);
      }
    }
  };

  handleOnScroll = debounce(this.handleDebouncedScroll, 50);

  disableDelete = data => {
    const { handleDeleteItem, handleDisableDelete } = this.props;
    if (handleDeleteItem === null) {
      return true;
    }
    return handleDisableDelete(data);
  };

  disableEdit = data => {
    const { handleDisableEdit } = this.props;
    return handleDisableEdit ? handleDisableEdit(data) : true;
  };

  render() {
    const {
      data,
      isSelected,
      handleClick,
      headers,
      restrictReadOnly,
    } = this.props;

    const colSpan = headers.length + DEFAULT_FIXED_COLUMNS;
    return (
      <PerfectScrollbar
        containerRef={ref => {
          this._scrollRefY = ref;
        }}
        onScrollY={this.handleOnScroll}
        option={perfectScrollConfig}
      >
        <RootRef>
          <TableBody>
            {data.map((d, k) => {
              return d.isCaptionRow ? (
                <TableRow key={k} className={'caption-row'}>
                  <TableCell className={'caption-cell'} colSpan={colSpan}>
                    {d.value}
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow
                  key={k}
                  id={`tablerow${d.id}`}
                  hover
                  classes={{
                    hover: 'hover',
                    selected: 'selected',
                    root: 'MuiTableRow',
                  }}
                  selected={isSelected(d.id)}
                >
                  <TableCell
                    style={{ padding: '0px 18px', width: 40, height: 40 }}
                  >
                    <Checkbox
                      color="primary"
                      onClick={() => handleClick(d.id)}
                      checked={isSelected(d.id)}
                      style={{ width: 20, height: 20 }}
                    />
                  </TableCell>
                  {headers.map(header => {
                    let cellValue = d[header.field];
                    if (header.transformer) {
                      cellValue = header.transformer(cellValue);
                    }

                    const style = header.cellStyle ? header.cellStyle : {};
                    return (
                      <TableCell
                        key={header.field}
                        style={style}
                        onClick={() => this.handleEdit(d)}
                      >
                        {cellValue}
                      </TableCell>
                    );
                  })}

                  <ReadOnlyModeContext.Consumer>
                    {({ readOnly }) => {
                      const isDisableDelete =
                        (readOnly && !restrictReadOnly) ||
                        this.disableDelete(d);
                      const isDisabled = this.disableEdit(d);
                      return (
                        <TableCell
                          style={{
                            width: '154px',
                            textAlign: 'right',
                            cursor: isDisableDelete ? 'default' : '',
                          }}
                        >
                          <IconButton
                            style={{ width: 40, height: 40, padding: 0 }}
                            onClick={() => this.handleEdit(d)}
                          >
                            <Icon iconcolor="#0A75C2" margin={'0'}>
                              {(readOnly && !restrictReadOnly) ||
                              d.isReadOnly ||
                              isDisabled
                                ? 'info'
                                : 'edit'}
                            </Icon>
                          </IconButton>
                          <IconButton
                            style={{ width: 40, height: 40, padding: 0 }}
                            onClick={() => this.handleDelete(d)}
                            disabled={isDisableDelete}
                          >
                            <Icon
                              iconcolor={
                                isDisableDelete ? 'inherit' : '#0A75C2'
                              }
                              margin={'0'}
                            >
                              delete
                            </Icon>
                          </IconButton>
                        </TableCell>
                      );
                    }}
                  </ReadOnlyModeContext.Consumer>
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
  data: PropTypes.arrayOf(PropTypes.shape()),
  isSelected: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleDeleteItem: PropTypes.func,
  handleEditItem: PropTypes.func.isRequired,
  handleFetchData: PropTypes.func,
  restrictReadOnly: PropTypes.bool.isRequired,
  handleDisableDelete: PropTypes.func.isRequired,
};

GenericTableBody.defaultProps = {
  data: [],
  handleDeleteItem: null,
  handleFetchData: () => {},
};

export default GenericTableBody;
