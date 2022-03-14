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

const BoxShadow = styled.div`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 4px 0 rgba(0, 0, 0, 0.12),
    0 1px 5px 0 rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14),
    0 3px 4px 0 rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14),
    0 3px 4px 0 rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  margin-top: ${props => (props.editMode ? '10px' : '5px')};
`;

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
      padding-right: 40px;
    }
  }
  & table tbody {
    max-height: ${props =>
      props.filtersOpen
        ? props.editMode
          ? 'calc(100vh - 348px) !important'
          : 'calc(100vh - 318px) !important'
        : props.editMode
        ? 'calc(100vh - 402px) !important'
        : 'calc(100vh - 272px) !important'};

    overflow-y: auto;
    overflow-x: hidden;
    -webkit-border-radius: 0 0 2px 2px;
    -moz-border-radius: 0 0 2px 2px;
    border-radius: 0 0 2px 2px;
  }
  & table thead {
    background-color: #e0e0e0;
    border-top: 1px solid #cccccc;
    display: block;
  }
  & table thead tr,
  & table thead th {
    background-color: #e0e0e0;
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
    padding: 0px 56px 0px 24px;
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
    height: 41px;
  }

  & table .caption-cell {
    font-weight: 500;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.87);
  }
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

class GenericTable extends Component {
  state = {
    order: this.props.order,
    orderBy: this.props.orderBy,
    selected: [],
    unSelected: [],
    data: prepareData(
      this.props.data,
      this.props.orderBy,
      this.props.order,
      this.props.groupBy
    ),
    allSelected: false,
    filtersOpen: false,
    filters: {},
    hasFilter: false,
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

  componentWillMount() {
    const { headers } = this.props;

    this.fixedColumnsIndexes = getFixedColumnsIndexes(headers);
    this.fixedColumnsCount = this.fixedColumnsIndexes.length;
    this.handleSearchDebounced = _.debounce(function() {
      this.props.handleFilter.apply(this, [this.state.filters]);
    }, 500);
  }

  componentDidMount() {
    this.columsResizing();
    this.shakeScrollBar();
    window.addEventListener('resize', this.columsResizing);
    window.addEventListener('resize', this.shakeScrollBar);

    this.scrollWidth = this.tableContainerRef.current.scrollWidth; //Store the initial scrollWidth
    this.timer = setTimeout(() => {
      this.tableContainerRef.current.children[0].children[1].scrollTop = 0;
      const container = document.querySelector('#contentContainer');
      container.children[0].scrollLeft = 0;
    }, 200);
    if (sessionStorage.getItem('openedDataLeftMenu'))
      this.leftMenuPaneOpened = true;
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    window.removeEventListener('resize', this.columsResizing);
    window.removeEventListener('resize', this.shakeScrollBar);
  }

  componentWillReceiveProps(newProps) {
    /* Next if block was commented out while doing ALT-961. It's not clear what is its purpose */
    /*
    if (this.updateTableWidthTimer === null) {
      this.updateTableWidthTimer = setInterval(this.columsResizing, 40);
    }
    */
    const newData = newProps.frontEndFilterdisabled
      ? newProps.data
      : this.filterData(newProps.data);

    let selected = [];
    selected = this.state.allSelected
      ? newData
          .map(n => n.id)
          .filter(item => {
            return this.state.unSelected.indexOf(item) === -1;
          })
      : this.state.selected;
    if (!_.isEqual(this.state.data, newProps.data)) {
      //remove id from this.state.selected if newProps.data doesn't contain it
      const dataIds = newProps.data.map(n => n.id);
      const newSelected = _.intersection(dataIds, selected);

      this.setState(
        {
          data: newData,
          selected: newSelected,
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

    const filtersDisplayChanged =
      prevState.filtersOpen !== this.state.filtersOpen;

    const scrollWidthChanged =
      this.tableContainerRef.current.scrollWidth !== this.scrollWidth;

    if (
      filtersDisplayChanged ||
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

  toggleFilters = () => {
    this.setState({
      filtersOpen: !this.state.filtersOpen,
    });
    this.clearFilters();
    this.columsResizing();
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

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({
        selected: this.state.data.filter(n => !n.isCaptionRow).map(n => n.id),
        allSelected: true,
        unSelected: [],
      });
      return;
    }
    this.setState({
      selected: [],
      allSelected: false,
      unSelected: this.state.data.map(n => n.id),
    });
  };

  isSelected = id => {
    return this.state.selected.indexOf(id) !== -1;
  };

  handleClick = id => {
    const { selected, unSelected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    let unSelectedNew = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = newSelected.concat(
        selected.filter(item => {
          return item !== id;
        })
      );
      unSelectedNew =
        newSelected.indexOf(id) !== -1
          ? unSelectedNew.concat(
              unSelected.filter(item => {
                return item !== id;
              })
            )
          : _.union(unSelectedNew, unSelected, [id]);
    }

    this.setState({ selected: newSelected, unSelected: unSelectedNew });
  };

  /* ColumsResizing adjust the columns every time the user resize the browser */
  columsResizing = () => {
    const fixedColumns = DEFAULT_FIXED_COLUMNS + this.fixedColumnsCount;

    if (
      this.state.data.length > 0 &&
      document.querySelector('tbody tr') !== null &&
      document.querySelector('thead tr') !== null
    ) {
      const bodyTD = Array.from(
        document.querySelector('tbody tr:not(.caption-row)').children
      );
      const headTH = Array.from(document.querySelector('thead tr').children);
      const container = document.querySelector('#contentContainer');
      const containerWithXScroll = container.children[0];

      const TBody = document.querySelector('tbody');

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
      for (let i = 1; i < thWidths.length - 1; i++) {
        /* Process only those columns indexes that are not fixed columns*/
        if (!this.fixedColumnsIndexes.includes(i)) {
          const initialWidth = Math.max(
            headTH[i].clientWidth,
            bodyTD[i].clientWidth
          );
          const newWidth = initialWidth + extraWidthPerColumn;
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

  handleFilterChange = newFilter => {
    const filters = { ...this.state.filters, ...newFilter };
    const { data } = this.props;

    if (typeof this.props.handleFilter === 'function') {
      this.setState({ filters });
      this.handleSearchDebounced();
    } else {
      let hasFilter = false;
      for (const key in filters) {
        if (!!filters[key] && !hasFilter) hasFilter = true;
      }
      const dataArray = this.filterData(data, filters);
      this.setState({ filters: filters, data: dataArray, hasFilter });
    }
  };

  filterData = (data = this.props.data, filters = this.state.filters) => {
    return prepareData(
      data.filter(current => {
        let res = true;
        for (const field in filters) {
          if (
            String(current[field])
              .toLowerCase()
              .indexOf(String(filters[field]).toLowerCase()) === -1
          ) {
            res = false;
          }
        }
        return res;
      }),
      this.state.orderBy,
      this.state.order,
      this.props.groupBy
    );
  };

  clearFilters = () => {
    const data = prepareData(
      this.props.data,
      this.props.orderBy,
      this.props.order,
      this.props.groupBy
    );
    this.setState({ filters: {}, data, hasFilter: false });
    if (typeof this.props.handleFilter === 'function')
      this.handleSearchDebounced();
  };

  render() {
    const {
      headers,
      data: originalData,
      handleDeleteItem,
      handleEditItem,
      handleFetchData,
      name,
      t,
      editMode,
      totalDataSize,
      isFilter,
      filteredDataSize,
      restrictReadOnly = false,
      handleDisableDelete,
      handleDisableEdit,
    } = this.props;
    const {
      data,
      order,
      orderBy,
      filtersOpen,
      selected,
      hasFilter,
    } = this.state;
    const filteredCount = data.filter(m => !m.isCaptionRow).length;
    const count =
      filteredDataSize && isFilter ? filteredDataSize : filteredCount;
    return (
      <React.Fragment>
        <BoxShadow id="contentContainer" editMode={editMode}>
          <TableContainer
            filtersOpen={filtersOpen}
            editMode={editMode}
            innerRef={this.tableContainerRef}
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
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleSortClick}
                  filtersOpen={filtersOpen}
                  headers={headers}
                  numSelected={this.state.selected.length}
                  rowCount={data.filter(m => !m.isCaptionRow).length}
                  handleFilterChange={this.handleFilterChange}
                  toggleFilters={this.toggleFilters}
                />
                {data.length > 0 && (
                  <TableBody
                    data={data}
                    headers={headers}
                    isSelected={this.isSelected}
                    handleClick={this.handleClick}
                    handleDeleteItem={handleDeleteItem}
                    handleEditItem={handleEditItem}
                    handleFetchData={handleFetchData}
                    toggleFilters={this.toggleFilters}
                    selectedItems={selected}
                    ref={this.scrollRef}
                    restrictReadOnly={restrictReadOnly}
                    handleDisableDelete={handleDisableDelete}
                    handleDisableEdit={handleDisableEdit}
                  />
                )}
              </TableMUI>
            </PerfectScrollbar>
            {data.length < 1 && (
              <DataNotFound
                text={t('GLOBAL.filters.noResults', { data: name })}
              />
            )}
          </TableContainer>
        </BoxShadow>

        <TableFooter
          totalDataSize={totalDataSize}
          total={isFilter ? totalDataSize : originalData.length}
          current={count}
          name={name}
          isFilter={isFilter || hasFilter}
        />
      </React.Fragment>
    );
  }
}

GenericTable.propTypes = {
  t: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape()),
  headers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleDeleteItem: PropTypes.func,
  handleEditItem: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  groupBy: PropTypes.string,
  handleFetchData: PropTypes.func,
  handleSort: PropTypes.func,
  totalDataSize: PropTypes.number.isRequired,
  frontEndFilterdisabled: PropTypes.bool,
  restrictReadOnly: PropTypes.bool,
  handleDisableDelete: PropTypes.func,
  handleDisableEdit: PropTypes.func,
};

GenericTable.defaultProps = {
  data: [],
  handleDeleteItem: null,
  groupBy: null,
  handleFetchData: () => {},
  handleSort: () => {},
  frontEndFilterdisabled: false,
  restrictReadOnly: false,
  handleDisableDelete: () => false,
  handleDisableEdit: () => false,
};

export default GenericTable;
