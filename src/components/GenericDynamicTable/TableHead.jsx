import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Divider } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ControlPointIcon from '@material-ui/icons/ControlPoint';

import ColumnOptions from './ColumnOptions';

const VerticalDivider = styled(Divider)`
  background: #808080;
  margin-top: 10px;
`;

const StyledTableSortLabel = styled(TableSortLabel)`
  &.MuiTableSortLabel-root {
    color: rgba(0, 0, 0, 0.87) !important;
  }
  &.MuiTableSortLabel-active.MuiTableSortLabel-root.MuiTableSortLabel-active
    .MuiTableSortLabel-icon {
    color: rgba(0, 0, 0, 0.87) !important;
    font-size: 16px;
  }
`;

class EnhancedTableHead extends Component {
  state = {
    columnSelected: null,
    menuOptionsOpen: false,
    anchorEl: null,
  };

  componentDidMount() {
    // const resizeDiv = document.querySelectorAll('.resize-handle');
    // resizeDiv.forEach(div => {
    //   div.addEventListener('dragstart', this.handleDragStart.bind(this));
    //   div.addEventListener('drag', this.handleDrag.bind(this));
    //   div.addEventListener('dragend', this.handleDragEnd.bind(this));
    // });
  }

  componentWillUnmount() {
    // const resizeDiv = document.querySelectorAll('.resize-handle');
    // resizeDiv.forEach(div => {
    //   div.addEventListener('dragstart', this.handleDragStart);
    //   div.removeEventListener('drag', this.handleDrag.bind(this));
    //   div.removeEventListener('dragend', this.handleDragEnd.bind(this));
    // });
  }

  // handleDragStart = event => {
  //   event.dataTransfer.setData('application/node type', this);

  //   const container = document.querySelector('#dynamic-table-container');
  //   container.classList.add('header--being-resized');

  //   const resizeDiv = document.querySelectorAll('.resize-handle');
  //   resizeDiv.forEach(div => {
  //     div.style.minWidth = '15px';
  //     div.style.maxWidth = '15px';
  //   });
  // };

  // handleDrag = event =>
  //   requestAnimationFrame(() => {
  //     const container = document.querySelector('#dynamic-table-container');
  //     const bodyTD = Array.from(
  //       document.querySelector(
  //         '#dynamic-table-container tbody tr:not(.caption-row)'
  //       ).children
  //     );

  //     // Find the correct target;
  //     let target = event.target;
  //     if (!event.target.classList.contains('resize-handle')) {
  //       target = event.target.parentElement;
  //     }

  //     const parentElement = target.parentElement;
  //     const index = parseInt(target.getAttribute('data-index'), 10);

  //     if (parentElement && container) {
  //       const positionInfo = parentElement.getBoundingClientRect();
  //       const width = positionInfo.width;
  //       const newWidth = width + event.offsetX;

  //       const headTextRef = parentElement.querySelector('.header-label');
  //       const minHeaderWidth = headTextRef.offsetWidth + 80;

  //       if (
  //         newWidth > minHeaderWidth &&
  //         newWidth < container.clientWidth - 100
  //       ) {

  //         parentElement.style.minWidth = newWidth + 'px';
  //         bodyTD[index].style.minWidth = newWidth + 'px';
  //       }
  //     }
  //   });

  // handleDragEnd = event => {
  //   const container = document.querySelector('#dynamic-table-container');
  //   container.classList.remove('header--being-resized');

  //   this.props.columnsResizing();
  // };

  createSortHandler = header => () => {
    this.props.onRequestSort(header);
  };

  checkError = (field, errors) => {
    const hasError = Array.isArray(errors)
      ? errors.find(err => err.hfield === field)
      : null;
    if (hasError) return true;
    return false;
  };

  selectColumn = key => {
    this.setState({ columnSelected: key });
  };

  clearColumn = () => {
    this.setState({
      columnSelected: null,
      menuOptionsOpen: false,
      anchorEl: null,
    });
  };

  handleMenuOptionsOpen = event => {
    this.setState({ menuOptionsOpen: true, anchorEl: event.currentTarget });
  };

  handleMenuOptionsClose = () => {
    this.setState({
      menuOptionsOpen: false,
      anchorEl: null,
      columnSelected: null,
    });
  };

  handleInsertColumn = (index, position, isLastColumn) => {
    this.handleMenuOptionsClose();
    this.props.handleInsertColumn(index, position, isLastColumn);
  };

  handleDeleteColumn = index => {
    this.handleMenuOptionsClose();
    this.props.handleDeleteColumn(index);
  };

  render() {
    const {
      t,
      headers,
      order,
      orderBy,
      defaultHeaderComponent,
      errors,
      readOnly,
      showRowOptions,
      showColumnOptions,
      showColumnDivider,
    } = this.props;
    const { columnSelected, menuOptionsOpen, anchorEl } = this.state;

    return (
      <TableHead>
        <TableRow>
          {headers.map((h, k) => {
            let style = h.cellStyle ? h.cellStyle : {};
            if (!showColumnDivider) {
              style = { ...style, padding: '0px 15px 0px 15px' };
            }

            const direction = order === 'inc' ? 'asc' : 'desc';
            const enableSort = h.enableSort !== undefined ? h.enableSort : true;

            // if any custom component need to be rendered inside TableCell
            if (h.value !== undefined && defaultHeaderComponent) {
              const Component = defaultHeaderComponent.component;
              const componentStyle =
                defaultHeaderComponent.componentStyle || {};
              const hasError = this.checkError(h.field, errors);
              return (
                <TableCell
                  key={k}
                  sortDirection={orderBy === h.field ? direction : false}
                  style={style}
                  onMouseEnter={() => this.selectColumn(k)}
                  onMouseLeave={this.clearColumn}
                >
                  <Component
                    data={{ _header: h, index: k }}
                    value={h.value}
                    style={componentStyle}
                    error={hasError}
                    {...defaultHeaderComponent.props}
                    placeholder={defaultHeaderComponent.placeholder || ''}
                  />
                  {enableSort && (
                    <StyledTableSortLabel
                      hideSortIcon={false}
                      active={orderBy === h.field && enableSort}
                      direction={direction}
                      onClick={this.createSortHandler(h)}
                      style={{
                        cursor: enableSort ? 'pointer' : 'default',
                      }}
                    >
                      {' '}
                    </StyledTableSortLabel>
                  )}

                  <span
                    className="resize-handle"
                    data-index={k}
                    draggable={true}
                    style={
                      !readOnly && showColumnOptions && columnSelected === k
                        ? { width: '45px' }
                        : {}
                    }
                  >
                    {!readOnly && showColumnOptions && columnSelected === k && (
                      <Fragment>
                        <IconButton
                          style={{ width: 40, height: 40 }}
                          onClick={this.handleMenuOptionsOpen}
                        >
                          <MoreVertIcon color="primary" />
                        </IconButton>
                        <ColumnOptions
                          t={t}
                          index={k}
                          anchorEl={anchorEl}
                          open={menuOptionsOpen}
                          handleClose={this.handleMenuOptionsClose}
                          handleInsertColumn={this.handleInsertColumn}
                          handleDeleteColumn={this.handleDeleteColumn}
                        />
                      </Fragment>
                    )}
                    {k < headers.length - 1 && showColumnDivider && (
                      <VerticalDivider orientation="vertical" />
                    )}
                  </span>
                </TableCell>
              );
            }

            return (
              <TableCell
                key={k}
                sortDirection={orderBy === h.field ? direction : false}
                style={style}
              >
                {h.displayName && (
                  <Fragment>
                    <StyledTableSortLabel
                      disabled={!enableSort}
                      hideSortIcon={!enableSort}
                      active={orderBy === h.field && enableSort}
                      direction={direction}
                      onClick={this.createSortHandler(h)}
                      style={{
                        cursor: enableSort ? 'pointer' : 'default',
                      }}
                    >
                      <span className="header-label">{h.displayName}</span>
                    </StyledTableSortLabel>
                    {k < headers.length - 1 && showColumnDivider && (
                      <span
                        className="resize-handle"
                        data-index={k}
                        draggable={true}
                      >
                        <VerticalDivider orientation="vertical" />
                      </span>
                    )}
                  </Fragment>
                )}
              </TableCell>
            );
          })}
          <TableCell
            style={{
              width: '45px',
              textAlign: 'left',
              position: showRowOptions ? 'absolute' : 'unset',
            }}
          >
            {showColumnOptions && (
              <IconButton
                style={{
                  width: 24,
                  height: 24,
                  margin: '10px',
                }}
                onClick={() =>
                  this.handleInsertColumn(headers.length, 'left', true)
                }
                disabled={readOnly}
              >
                <ControlPointIcon color={readOnly ? 'disabled' : 'primary'} />
              </IconButton>
            )}
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  t: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onRequestSort: PropTypes.func.isRequired,
  defaultHeaderComponent: PropTypes.shape(),
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      field: PropTypes.string,
    })
  ).isRequired,
  readOnly: PropTypes.bool.isRequired,
  showRowOptions: PropTypes.bool.isRequired,
  showColumnOptions: PropTypes.bool.isRequired,
  handleInsertColumn: PropTypes.func.isRequired,
  handleDeleteColumn: PropTypes.func.isRequired,
  showColumnDivider: PropTypes.bool.isRequired,
};

EnhancedTableHead.defaultProps = {
  defaultHeaderComponent: null,
};

export default EnhancedTableHead;
