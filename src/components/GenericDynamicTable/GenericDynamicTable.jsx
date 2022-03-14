import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import TableMUI from '@material-ui/core/Table';
import _ from 'lodash';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import TableHead from './TableHead';
import TableBody from './TableBody';
import TableFooter from './TableFooter';

import prepareData from '../../utils/sort';
import DataNotFound from '../DataNotFound';

import { DEFAULT_FIXED_COLUMNS } from './constants';
import { prepareSortPayload } from './helpers';
import { perfectScrollConfig, scrollSyncX } from '../../utils/common';

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;

  & table {
    position: relative;
  }
  & & table tr,
  & table td,
  & table th {
    text-align: left;
    white-space: nowrap;
    :last-child {
      padding-left: 0;
      padding-right: 0;
    }
  }
  & table tbody {
    max-height: 'calc(100vh - 272px) !important'};
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-border-radius: 0 0 2px 2px;
    -moz-border-radius: 0 0 2px 2px;
    border-radius: 0 0 2px 2px;
  }
  & table thead {
    background-color: #e5e5e5;
    border-top: 1px solid #cccccc;
    display: block;
  }
  & table thead tr,
  & table thead th {
    background-color: #e5e5e5;
    height: 45px;
  }

  & table tbody {
    display: block;
    background-color: #fff;
  }

  & table thead tr:first-child {
    background-color: red;
  }

  & table tbody td,
  & table thead th {
    padding: 0px 25px 0px 15px;
    font-size: 0.8125rem;
  }
  & table thead th span {
    color: #000000;
    font-weight: 500;
  }
  & table tbody tr {
    z-index: 9000;
    height: 40px;
    background-color: #fff;
  }
  & table tbody tr td {
    height: 50px;
  }

  & table .caption-cell {
    font-weight: 500;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.87);
  }
`;

const TableBodyWrapper = styled.div`
  max-height: 300px;
`;

const TableWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RowHeader = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #000000;
  padding-bottom: 16px;
`;

const ColumnHeader = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 10px;
  text-align: center;
  color: #000000;
  writing-mode: vertical-rl;
  transform: rotate(-180deg);
  width: 26px;
`;

/* First and last columns has always a fixed width */

const getFixedColumnsIndexes = headers => {
  const indexes = [];

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    if (header.fixedWidth) {
      /* Column 0 in the table is always the column with the checkbox,
      this is why all column dinamically generated start with index i + 1;
      */
      indexes.push(i + 1);
    }
  }

  return indexes;
};

class GenericDynamicTable extends Component {
  state = {
    order: this.props.order,
    orderBy: this.props.orderBy,
    data: prepareData(
      this.props.data,
      this.props.orderBy,
      this.props.order,
      this.props.groupBy
    ),
  };

  timer = null;
  tableContainerRef = React.createRef();
  scrollWidth = null;
  scrollRef = React.createRef();

  /* This variable is defined to set a setInterval in order to update the table's width while it is animating  */
  updateTableWidthTimer = null;

  hasHorizontalScroll = false;

  fixedColumnsIndexes = [];
  fixedColumnsCount = 0;
  leftMenuPaneOpened = false;

  savedColumnWidths = [];

  componentWillMount() {
    const { headers } = this.props;

    this.fixedColumnsIndexes = getFixedColumnsIndexes(headers);
    this.fixedColumnsCount = this.fixedColumnsIndexes.length;
  }

  componentDidMount() {
    this.columsResizing();
    this.shakeScrollBar();
    window.addEventListener('resize', this.columsResizingOnResize);
    window.addEventListener('resize', this.shakeScrollBar);

    this.scrollWidth = this.tableContainerRef.current.scrollWidth; //Store the initial scrollWidth
    this.timer = setTimeout(() => {
      this.tableContainerRef.current.children[0].children[1].scrollTop = 0;
      const container = document.querySelector('#dynamic-table');
      container.children[0].scrollLeft = 0;
    }, 200);
    if (sessionStorage.getItem('openedDataLeftMenu'))
      this.leftMenuPaneOpened = true;
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    window.removeEventListener('resize', this.columsResizingOnResize);
    window.removeEventListener('resize', this.shakeScrollBar);
  }

  componentWillReceiveProps(newProps) {
    const newData = newProps.data;
    if (!_.isEqual(this.state.data, newProps.data)) {
      this.setState(
        {
          data: newData,
        },
        () => {
          /* It seems that columnsResizing needs to be triggered after new data comes to GenericTable */
          this.columsResizing();
        }
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.shakeScrollBar();
    const currentData = this.state.data;
    const oldData = prevState.data;
    if (currentData.length - oldData.length === 1) {
      const newItem = _.differenceBy(currentData, oldData, 'id')[0];
      if (newItem) {
        const element = document.getElementById(`tablerow${newItem.id}`);
        if (element) {
          element.scrollIntoView(true);
        }
      }
    }
    const dataInTableWasRestored =
      prevState.data.length === 0 && this.state.data.length > 0;

    const scrollWidthChanged =
      this.tableContainerRef.current.scrollWidth !== this.scrollWidth;

    if (
      dataInTableWasRestored ||
      scrollWidthChanged ||
      this.leftMenuPaneOpened
    ) {
      this.leftMenuPaneOpened = sessionStorage.getItem('openedDataLeftMenu');
      setTimeout(() => {
        clearInterval(this.updateTableWidthTimer);
        this.updateTableWidthTimer = null;
        this.columsResizing();
      }, 300);
    }
  }

  shakeScrollBar = () => {
    // shake the scroll to get the scrollbar active in case of resizes :(
    setTimeout(() => {
      if (this._scrollRefX) {
        this._scrollRefX.scrollLeft += 1;
      }
      if (this.scrollRef.current) {
        this.scrollRef.current._scrollRefY.scrollTop += 1;
      }
    }, 1000);
  };

  handleSortClick = header => {
    const { handleSort } = this.props;
    const { field, disableSort } = header;

    if (disableSort) return;

    const orderBy = field;
    let order = 'inc';

    if (this.state.orderBy === field && this.state.order === 'inc') {
      order = 'dec';
    }

    const sortPayload = prepareSortPayload(header, order);

    this.setState({
      order,
      orderBy,
    });

    // Reset scrollTop for the main table
    if (this.tableContainerRef.current.children[0].children[1] !== undefined)
      this.tableContainerRef.current.children[0].children[1].scrollTop = 0;

    // Call B.E. with new sort criteria
    handleSort(sortPayload);
  };

  clearSavedColumnWidths = () => {
    this.savedColumnWidths = [];
  };

  columsResizingOnResize = () => {
    this.clearSavedColumnWidths();
    this.columsResizing();
  };

  /* ColumsResizing adjust the columns every time the user resize the browser */
  columsResizing = () => {
    const fixedColumns = DEFAULT_FIXED_COLUMNS + this.fixedColumnsCount;

    if (
      this.state.data.length > 0 &&
      document.querySelector('#dynamic-table tbody tr') !== null &&
      document.querySelector('#dynamic-table thead tr') !== null
    ) {
      const bodyTD = Array.from(
        document.querySelector('#dynamic-table tbody tr:not(.caption-row)')
          .children
      );
      const headTH = Array.from(
        document.querySelector('#dynamic-table thead tr').children
      );
      const container = document.querySelector('#dynamic-table');
      const containerWithXScroll = container.children[0];

      const TBody = document.querySelector('#dynamic-table tbody');

      /* thWidths and tdWidth stores all the initial widths*/
      const thWidths = headTH.map(th => {
        return th.clientWidth;
      });

      const tdWidths = bodyTD.map(td => {
        return td.clientWidth;
      });

      const dynamicColumnsCount = thWidths.length - fixedColumns;

      /* total stores the sum of all the biggest width of the table */
      let total = 0;
      for (let i = 0; i < thWidths.length; i++) {
        if (thWidths[i] > tdWidths[i]) {
          total += thWidths[i];
        } else {
          total += tdWidths[i];
        }
      }

      /* rest is the total amount of pixels that we add to all the TH and TD except to the first one and last one,
      we use total and the containers width to calc this value */
      const scrollbarWidth = TBody.offsetWidth - TBody.clientWidth;
      const rest = container.clientWidth - total - scrollbarWidth;
      const extraWidthPerColumn = Math.floor(rest / dynamicColumnsCount);
      let extraWidthForLastColumn = rest;

      /* this is loop is use to set rest to all the columns to after this loop the table will 100% sized*/
      for (let i = 0; i < thWidths.length - 1; i++) {
        /* Process only those columns indexes that are not fixed columns*/
        if (!this.fixedColumnsIndexes.includes(i)) {
          const initialWidth = Math.max(
            headTH[i].clientWidth,
            bodyTD[i].clientWidth
          );

          let newWidth;
          /**
           * To resolve the table width increasing issue when we add new row or update cell value we will be storing width.
           * The storedWidth will be cleared out when user resize this window or add new column.
           */
          const savedWidth = this.savedColumnWidths[i];
          if (savedWidth) {
            newWidth = savedWidth;
          } else {
            newWidth = initialWidth + extraWidthPerColumn;
            this.savedColumnWidths.push(newWidth);
          }

          extraWidthForLastColumn -= extraWidthPerColumn;

          if (bodyTD[i].clientWidth + (rest % 2) === 0) {
            bodyTD[i].style.minWidth = newWidth + 'px';
            headTH[i].style.minWidth = newWidth + 'px';
          } else {
            bodyTD[i].style.minWidth = newWidth + 'px';
            headTH[i].style.minWidth = newWidth + 'px';
          }

          if (bodyTD[i].clientWidth > headTH[i].clientWidth) {
            headTH[i].style.minWidth = bodyTD[i].clientWidth + 'px';
          } else {
            bodyTD[i].style.minWidth = headTH[i].clientWidth + 'px';
          }
        }
      }

      this.adjustOptionsColumn();

      const lastColumnIndex = thWidths.length - 1;
      const actionButtonsWidth = Math.max(
        headTH[lastColumnIndex].clientWidth,
        bodyTD[lastColumnIndex].clientWidth
      );

      /* The last column will take the rest of available space */
      // headTH[lastColumnIndex].style.minWidth =
      //   extraWidthForLastColumn + actionButtonsWidth - 1 + 'px';
      // bodyTD[lastColumnIndex].style.minWidth =
      //   extraWidthForLastColumn + actionButtonsWidth - 1 + 'px';

      //  removed extraWidthForLastColumn, to fix the issue ALT-1861
      headTH[lastColumnIndex].style.minWidth = actionButtonsWidth - 1 + 'px';
      bodyTD[lastColumnIndex].style.minWidth = actionButtonsWidth - 1 + 'px';

      const hasHorizontalScroll =
        containerWithXScroll.scrollWidth > containerWithXScroll.clientWidth;

      const didHorizontalScrollChanged =
        hasHorizontalScroll !== this.hasHorizontalScroll;
      this.hasHorizontalScroll = hasHorizontalScroll;

      if (!didHorizontalScrollChanged) return;

      if (hasHorizontalScroll) {
        TBody.style.maxHeight = TBody.clientHeight - 16 + 'px';
      } else {
        TBody.style.maxHeight = TBody.clientHeight + 16 + 'px';
      }
    }
  };

  /**
   * To scroll table body's scrollbar up or down based on the position in which new row is added.
   * Once the container's state updated it call this method to trigger scroll.
   */
  triggerTableBodyVerticalScroll = (position, isFooter) => {
    if (this._scrollRefY) {
      if (isFooter) {
        // if add btn in table footer clicked, we need to scroll to bottom of table.
        this._scrollRefY.scrollTop += this._scrollRefY.scrollHeight;
      } else if (position === 'below') {
        this._scrollRefY.scrollTop += 50;
      } else {
        this._scrollRefY.scrollTop -= 50;
      }
    }
  };

  /**
   * To scroll table scrollbar right based on the position in which new column is added.
   * Once the container's state updated it call this method to trigger scroll.
   */
  triggerTableHorizontalScroll = (index, position, isLastColumn) => {
    if (this._scrollRefX) {
      if (isLastColumn) {
        this._scrollRefX.scrollLeft += this._scrollRefX.scrollWidth;
      } else if (position === 'right') {
        document
          .querySelectorAll('#dynamic-table thead th')
          .forEach((el, i) => {
            if (i === index) {
              this._scrollRefX.scrollLeft += el.offsetWidth;
            }
          });
      }
    }
  };

  /**
   * To make menu option column fixed
   */
  adjustOptionsColumn = () => {
    if (this.props.showRowOptions) {
      const tableContainer = document.getElementById('dynamic-table-container');
      if (tableContainer && this._scrollRefX) {
        const right =
          this._scrollRefX.scrollWidth -
          tableContainer.getBoundingClientRect().width -
          this._scrollRefX.scrollLeft;

        const headerFirstColumn = tableContainer.querySelector(
          'thead th:first-child'
        );
        if (headerFirstColumn) {
          // To find out whether table bodies first columns has grey color
          const tableBodyFirstColumn = tableContainer.querySelector(
            'tbody td:first-child'
          );
          const color = tableBodyFirstColumn
            ? tableBodyFirstColumn.style.backgroundColor
            : '#ffffff';
          const tableFooterFirstColumn = document.querySelector(
            '#dynamic-table #table-footer-first-column'
          );
          if (tableFooterFirstColumn) {
            tableFooterFirstColumn.style.backgroundColor =
              color !== 'rgb(232, 244, 252)' ? color : '#fffff';
            const width =
              headerFirstColumn.offsetWidth - this._scrollRefX.scrollLeft;
            tableFooterFirstColumn.style.width =
              width < 0 ? '0px' : width + 'px';
          }
        }

        if (!this.props.readOnly) {
          const headerFixedColumn = tableContainer.querySelector(
            'thead th:last-child'
          );
          const tableFooterLastColumn = document.querySelector(
            '#dynamic-table #table-footer-last-column'
          );
          if (headerFixedColumn && tableFooterLastColumn) {
            if (right > 3) {
              headerFixedColumn.style.position = 'absolute';
              headerFixedColumn.style.right = `${right}px`;
              headerFixedColumn.style.zIndex = 1;
              headerFixedColumn.style.boxShadow =
                '-2px 2px 6px rgba(0, 0, 0, 0.25)';
              tableFooterLastColumn.style.boxShadow =
                '-2px 2px 6px rgba(0, 0, 0, 0.25)';
            } else {
              headerFixedColumn.style.position = 'unset';
              headerFixedColumn.style.boxShadow = 'unset';
              tableFooterLastColumn.style.boxShadow = 'unset';
            }
          }

          tableContainer.querySelectorAll('tbody td:last-child').forEach(el => {
            if (right > 3) {
              el.style.display = 'block';
              el.style.position = 'relative';
              el.style.right = `${right}px`;
              el.style.zIndex = 1;
              el.style.boxShadow = '-2px 0px 6px rgba(0, 0, 0, 0.25)';
            } else {
              el.style.display = 'table-cell';
              el.style.position = 'unset';
              el.style.boxShadow = 'unset';
            }
          });
        }
      }
    }
  };

  handleInsertColumn = (index, position, isLastColumn) => {
    this.clearSavedColumnWidths();
    this.props.handleInsertColumn(index, position, isLastColumn);
  };

  handleDeleteColumn = index => {
    this.clearSavedColumnWidths();
    this.props.handleDeleteColumn(index);
  };

  render() {
    const {
      headers,
      data: originalData,
      t,
      errors,
      keyField,
      readOnly,
      showFooter,
      showRowOptions,
      rowHeader,
      columnHeader,
      defaultHeaderComponent,
      getComponentDefaults,
      handleInsertRow,
      handleDeleteRow,
      showColumnOptions,
      showColumnDivider,
      cellOverrides,
      handleCellOverrides,
    } = this.props;
    const { data, order, orderBy } = this.state;

    return (
      <React.Fragment>
        <div id="dynamic-table">
          {rowHeader && <RowHeader>{rowHeader}</RowHeader>}

          <TableWrapper>
            {columnHeader && <ColumnHeader>{columnHeader}</ColumnHeader>}
            <TableContainer
              innerRef={this.tableContainerRef}
              onScroll={this.adjustOptionsColumn}
              id="dynamic-table-container"
            >
              <PerfectScrollbar
                option={perfectScrollConfig}
                onScrollX={scrollSyncX}
                containerRef={ref => {
                  this._scrollRefX = ref;
                }}
              >
                <TableMUI>
                  <TableHead
                    t={t}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={this.handleSortClick}
                    headers={headers}
                    defaultHeaderComponent={defaultHeaderComponent}
                    errors={errors}
                    readOnly={readOnly}
                    showRowOptions={showRowOptions}
                    showColumnOptions={showColumnOptions}
                    handleInsertColumn={this.handleInsertColumn}
                    handleDeleteColumn={this.handleDeleteColumn}
                    showColumnDivider={showColumnDivider}
                  />
                  {data.length > 0 && (
                    <PerfectScrollbar
                      option={perfectScrollConfig}
                      containerRef={ref => {
                        this._scrollRefY = ref;
                      }}
                    >
                      <TableBodyWrapper>
                        <TableBody
                          t={t}
                          data={data}
                          headers={headers}
                          ref={this.scrollRef}
                          errors={errors}
                          keyField={keyField}
                          readOnly={readOnly}
                          showRowOptions={showRowOptions}
                          handleInsertRow={handleInsertRow}
                          handleDeleteRow={handleDeleteRow}
                          getComponentDefaults={getComponentDefaults}
                          cellOverrides={cellOverrides}
                          handleCellOverrides={handleCellOverrides}
                        />
                      </TableBodyWrapper>
                    </PerfectScrollbar>
                  )}
                </TableMUI>
              </PerfectScrollbar>
              {data.length < 1 && (
                <DataNotFound text={t('DYNAMIC_TABLE.noData')} />
              )}
              {showFooter && (
                <TableFooter
                  index={data.length}
                  handleInsertRow={handleInsertRow}
                  readOnly={readOnly}
                />
              )}
            </TableContainer>
          </TableWrapper>
        </div>
      </React.Fragment>
    );
  }
}

GenericDynamicTable.propTypes = {
  t: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape()),
  headers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  readOnly: PropTypes.bool,
  groupBy: PropTypes.string,
  handleSort: PropTypes.func,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      field: PropTypes.string,
    })
  ),
  keyField: PropTypes.string.isRequired,
  showRowOptions: PropTypes.bool,
  showFooter: PropTypes.bool,
  rowHeader: PropTypes.string,
  columnHeader: PropTypes.string,
  defaultHeaderComponent: PropTypes.shape(),
  getComponentDefaults: PropTypes.func,
  handleInsertRow: PropTypes.func,
  handleDeleteRow: PropTypes.func,
  showColumnOptions: PropTypes.bool,
  handleInsertColumn: PropTypes.func,
  handleDeleteColumn: PropTypes.func,
  showColumnDivider: PropTypes.bool,
  cellOverrides: PropTypes.bool,
  handleCellOverrides: PropTypes.func,
};

GenericDynamicTable.defaultProps = {
  data: [],
  groupBy: null,
  handleSort: () => {},
  errors: [],
  showRowOptions: false,
  showFooter: false,
  readOnly: false,
  rowHeader: '',
  columnHeader: '',
  defaultHeaderComponent: null,
  getComponentDefaults: () => null,
  handleInsertRow: () => {},
  handleDeleteRow: () => {},
  showColumnOptions: false,
  handleInsertColumn: () => {},
  handleDeleteColumn: () => {},
  showColumnDivider: true,
  cellOverrides: false,
  handleCellOverrides: data => null,
};

export default GenericDynamicTable;
