import React, { Fragment, createRef } from 'react';
import { pull } from 'lodash';
import PropTypes from 'prop-types';
import Collapse from '@material-ui/core/Collapse';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import RootRef from '@material-ui/core/RootRef';
import debounce from 'lodash/debounce';
import './GenericCollapsibleTable.css';
import throttle from 'lodash/throttle';
import Icon from '../Icon';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import ReadOnlyModeContext from '../../App/ReadOnlyModeContext';
import { DEFAULT_FIXED_COLUMNS, MIN_DISTANCE_TO_BOTTOM } from './constants';
import { perfectScrollConfig } from '../../utils/common';

class GenericTableBody extends React.Component {
  ref = React.createRef();
  previousScrollTop = 0;

  state = {
    openRows: [],
    lastOpenedRowData: null,
  };

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

  checkNeedToMoveUp = key => {
    try {
      if (this._scrollRefY) {
        const index = this.props.data.length - key;
        const noOfRowsViewable = Math.floor(this._scrollRefY.clientHeight / 40);
        return index <= noOfRowsViewable;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  /**
   * To fix bug with new scrollbar ie unwanted space at bottom of table body when last rows are collapsed.
   * Here we calculate collapsible component height that we need to move up the scrollbar to fix the spacing issue.
   * Sometime if height is greater than visible body height we need to scroll to bottom of the page after render (by adding a delay) so that user will not lost the earlier visible rows.
   */
  calculateMoveUpHeight = (key, componentRef) => {
    try {
      const { data } = this.props;
      const height = componentRef.current
        ? componentRef.current.clientHeight
        : 0;
      const index = data.length - key;
      const noOfRowsViewable = Math.floor(this._scrollRefY.clientHeight / 40);
      const needToMoveUp = index <= noOfRowsViewable;
      const moveUpHeight =
        this._scrollRefY.clientHeight - height < 0
          ? this._scrollRefY.clientHeight
          : height;
      const moveDownHeight =
        data.length > noOfRowsViewable && moveUpHeight > noOfRowsViewable * 40
          ? data.length * 40
          : 0;

      return {
        needToMoveUp,
        moveUpHeight,
        moveDownHeight: moveDownHeight,
      };
    } catch (error) {
      console.error(error);
      return {
        needToMoveUp: false,
        moveUpHeight: 0,
        moveDownHeight: 0,
      };
    }
  };

  toggleRows = (key, data, componentRef) => {
    if (this.state.openRows.includes(key)) {
      const {
        needToMoveUp,
        moveUpHeight,
        moveDownHeight,
      } = this.calculateMoveUpHeight(key, componentRef);
      const currentPos = this._scrollRefY ? this._scrollRefY.scrollTop : 0;
      this.setState(
        prevState => ({
          openRows: pull(prevState.openRows, key),
          lastOpenedRowData: null,
        }),
        () => {
          if (this._scrollRefY && needToMoveUp) {
            this._scrollRefY.scrollTop -= moveUpHeight;
            if (currentPos) {
              const timer = setTimeout(() => {
                this._scrollRefY.scrollTop = currentPos;
                clearTimeout(timer);
              }, 500);
            }
          }
        }
      );
    } else {
      this.setState(prevState => ({
        openRows: prevState.openRows.concat(key),
        lastOpenedRowData: data,
      }));
    }
    // Manually calling columsResizing method in GenericCollapsibleTable to fix any size issue caused by Component injected
    this.props.triggerResize();
  };

  isSelected = (id, key) => {
    return this.state.openRows.includes(key) || this.props.isSelected(id);
  };

  resetRows = () => {
    this.setState({ openRows: [] });
  };

  render() {
    const {
      data,
      isSelected,
      handleClick,
      headers,
      handleDeleteItem,
      enableEdits,
      collapsibleComponent: CollapsibleComponent,
      collapsibleComponentProps,
      triggerResize,
      keyField,
      disableRowStyle,
    } = this.props;
    const { openRows, lastOpenedRowData } = this.state;

    const hideDelete = handleDeleteItem === null ? true : false;
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
          <TableBody onScroll={this.handleOnScroll}>
            {data.map((d, k) => {
              const componentRef = createRef();
              const needToMoveUp = this.checkNeedToMoveUp(k);
              const key = d[keyField] || k;
              return d.isCaptionRow ? (
                <TableRow key={key} className={'caption-row'}>
                  <TableCell className={'caption-cell'} colSpan={colSpan}>
                    {d.value}
                  </TableCell>
                </TableRow>
              ) : (
                <Fragment key={key}>
                  <TableRow
                    id={`tablerow${d.id}`}
                    hover
                    classes={{
                      hover: 'hover',
                      selected: 'selected',
                      root: 'MuiTableRow',
                    }}
                    selected={this.isSelected(d.id, k)}
                  >
                    <TableCell
                      style={{
                        paddingLeft: '18px',
                        paddingRight: '0px',
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Checkbox
                        color="primary"
                        onClick={() => handleClick(d.id)}
                        checked={isSelected(d.id)}
                        style={{ width: 20, height: 20 }}
                      />
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => this.toggleRows(key, d, componentRef)}
                        style={{ marginLeft: '10px' }}
                      >
                        {openRows.includes(key) ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    {headers.map((header, index) => {
                      let cellValue = d[header.field];

                      if (header.transformer) {
                        const transformerStyle = header.transformerStyle || {};
                        cellValue = header.transformer(
                          cellValue,
                          transformerStyle,
                          header.transformerProps
                        );
                      }

                      const style = header.cellStyle ? header.cellStyle : {};

                      // if any custom component need to be rendered inside TableCell
                      if (header.component) {
                        const Component = header.component;
                        const componentStyle = header.componentStyle || {};
                        return (
                          <TableCell
                            key={header.field}
                            style={{ ...style, ...disableRowStyle(d, header) }}
                            onClick={() =>
                              // enableEdits ? this.handleEdit(d) : null
                              header.togglePane
                                ? this.toggleRows(key, d, componentRef)
                                : null
                            }
                          >
                            <Component
                              data={d}
                              value={cellValue}
                              style={componentStyle}
                              {...header.props}
                            />
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={header.field}
                          style={{ ...style, ...disableRowStyle(d, header) }}
                          onClick={() =>
                            // enableEdits ? this.handleEdit(d) : null
                            header.togglePane
                              ? this.toggleRows(key, d, componentRef)
                              : null
                          }
                        >
                          {cellValue}
                        </TableCell>
                      );
                    })}
                    {enableEdits && (
                      <TableCell style={{ width: '154px', textAlign: 'right' }}>
                        <IconButton
                          style={{ width: 40, height: 40, padding: 0 }}
                          onClick={() => this.handleEdit(d)}
                        >
                          <Icon iconcolor="#0A75C2" margin={'0'}>
                            edit
                          </Icon>
                        </IconButton>
                        <ReadOnlyModeContext.Consumer>
                          {({ readOnly }) => (
                            <IconButton
                              style={{ width: 40, height: 40, padding: 0 }}
                              onClick={() => this.handleDelete(d)}
                              disabled={readOnly || hideDelete}
                            >
                              <Icon
                                iconcolor={
                                  readOnly || hideDelete ? 'inherit' : '#0A75C2'
                                }
                                margin={'0'}
                              >
                                delete
                              </Icon>
                            </IconButton>
                          )}
                        </ReadOnlyModeContext.Consumer>
                      </TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className={openRows.includes(key) ? '' : 'no-border'}
                      style={{ padding: 0 }}
                      colSpan={
                        enableEdits ? headers.length + 2 : headers.length + 1
                      }
                    >
                      <Collapse
                        in={openRows.includes(key)}
                        timeout="auto"
                        unmountOnExit
                        ref={componentRef}
                      >
                        <CollapsibleComponent
                          data={d}
                          triggerResize={triggerResize}
                          scrollRefY={this._scrollRefY}
                          needToMoveUp={needToMoveUp}
                          isOpen={openRows.includes(k)}
                          lastOpenedRowData={lastOpenedRowData}
                          {...collapsibleComponentProps}
                        />
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
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
  enableEdits: PropTypes.bool.isRequired,
  collapsibleComponent: PropTypes.func.isRequired,
  collapsibleComponentProps: PropTypes.shape().isRequired,
  triggerResize: PropTypes.func.isRequired,
  keyField: PropTypes.string,
  disableRowStyle: PropTypes.func.isRequired,
};

GenericTableBody.defaultProps = {
  data: [],
  handleDeleteItem: null,
  handleFetchData: () => {},
  keyField: '',
};

export default GenericTableBody;
