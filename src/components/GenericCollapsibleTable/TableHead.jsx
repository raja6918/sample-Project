import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import TableHeaderIcons from './TableHeaderIcons';
import { t } from 'i18next';

import {
  InputSearch,
  SearchIcon,
  ClearButton,
  ClearIcon,
} from '../FilterInput';

const CollapsableTableRow = styled(TableRow)`
  ${props =>
    props.show === 'true'
      ? `
        position: relative;
        opacity: 1;
        transition: all 0.3s linear;
        z-index: 1000;
        `
      : `
        display:none;
        position: absolute;
        opacity: 0;
        z-index: -1;
        `};
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
  componentRefs = [];

  componentWillReceiveProps(nextProps) {
    if (!nextProps.filtersOpen) {
      this.clearAllInputs();
    }
  }

  clearAllInputs = () => {
    const headers = this.props.headers;
    for (let i = 0; i < headers.length; i++) {
      /* There is no field to clear if noFilter is set to false */

      if (!headers[i].noFilter && this[headers[i].field]) {
        this[headers[i].field].value = '';
      }
    }
  };

  createSortHandler = header => () => {
    this.props.onRequestSort(header);
  };

  onFilter = (header, e) => {
    let field = header.filterName ? header.filterName : header.field;
    let filter = {
      [field]: e.target.value,
    };
    if (typeof header.filterTransformer === 'function') {
      filter = {
        ...filter,
        [field]: header.filterTransformer(e.target.value, header.filterType),
      };
    }

    this.props.handleFilterChange(filter);
  };

  clearInpunt = (event, field, h = '') => {
    this[field].value = '';
    let f = typeof h === 'object' && h.filterName ? h.filterName : field;
    this.props.handleFilterChange({ [f]: '' });
  };

  isEmpty = field => {
    if (this[field]) {
      return this[field].value.length < 1;
    } else {
      return true;
    }
  };

  toggleFilters = () => {
    try {
      this.props.toggleFilters();
      if (this.componentRefs.length > 0) {
        for (let i = 0; i < this.componentRefs.length; i++) {
          if (this.componentRefs[i].current) {
            this.componentRefs[i].current.resetToDefaultValue();
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const {
      headers,
      onSelectAllClick,
      order,
      orderBy,
      filtersOpen,
      numSelected,
      rowCount,
      enableEdits,
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell style={{ padding: '0px 18px', paddingRight: '33px' }}>
            <Checkbox
              color={'primary'}
              onChange={onSelectAllClick}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount && rowCount > 0}
              style={{ width: 20, height: 20 }}
            />
          </TableCell>
          {headers.map((h, k) => {
            const lastColumnStyle =
              !enableEdits && k === headers.length - 1
                ? { paddingRight: '0px' }
                : {};

            const style = h.cellStyle
              ? {
                  ...h.cellStyle,
                  ...lastColumnStyle,
                }
              : lastColumnStyle;

            const direction = order === 'inc' ? 'asc' : 'desc';
            return (
              <TableCell
                key={k}
                sortDirection={orderBy === h.field ? direction : false}
                style={style}
              >
                <span
                  style={
                    !enableEdits
                      ? {
                          display: 'flex',
                          justifyContent: 'space-between',
                        }
                      : {}
                  }
                >
                  <StyledTableSortLabel
                    hideSortIcon={true}
                    active={orderBy === h.field && !h.disableSort}
                    direction={direction}
                    onClick={this.createSortHandler(h)}
                    style={{
                      cursor: h.disableSort ? 'default' : 'pointer',
                    }}
                  >
                    {h.displayName}
                  </StyledTableSortLabel>
                  {!enableEdits && k === headers.length - 1 && (
                    <span>
                      <TableHeaderIcons toggleFilters={this.toggleFilters} />
                    </span>
                  )}
                </span>
              </TableCell>
            );
          })}
          {enableEdits && (
            <TableCell style={{ width: '154px', textAlign: 'right' }}>
              <TableHeaderIcons toggleFilters={this.toggleFilters} />
            </TableCell>
          )}
        </TableRow>

        <CollapsableTableRow className="filters" show={filtersOpen.toString()}>
          <TableCell style={{ padding: '0px 18px' }} />
          {headers.map(h => {
            // if any custom component need to be rendered inside TableCell
            if (h.filterComponent) {
              const Component = h.filterComponent;
              const componentStyle = h.filterComponentStyle || {};
              const componentRef = createRef();
              this.componentRefs.push(componentRef);
              return (
                <TableCell
                  key={h.field}
                  style={{ paddingLeft: 3, paddingRight: 3 }}
                >
                  <Component
                    data={{}}
                    ref={componentRef}
                    style={componentStyle}
                    {...h.filterComponentProps}
                    onChange={v => {
                      const e = { target: { value: v } };
                      this.onFilter(h, e);
                    }}
                  />
                </TableCell>
              );
            }

            return (
              <TableCell
                key={h.field}
                style={{ paddingLeft: 3, paddingRight: 3 }}
              >
                {!h.noFilter && (
                  <InputSearch>
                    <Input
                      type="text"
                      disableUnderline={true}
                      startAdornment={<SearchIcon>search</SearchIcon>}
                      placeholder={t('SEARCHENGINE')}
                      onChange={e => {
                        this.onFilter(h, e);
                      }}
                      inputRef={node => {
                        this[h.field] = node;
                      }}
                      endAdornment={
                        !this.isEmpty(h.field) && (
                          <ClearButton
                            onClick={e => this.clearInpunt(e, h.field, h)}
                          >
                            <ClearIcon>highlight_off</ClearIcon>
                          </ClearButton>
                        )
                      }
                      disabled={h.disableFilter}
                    />
                  </InputSearch>
                )}
              </TableCell>
            );
          })}
          {enableEdits && <TableCell />}
        </CollapsableTableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  filtersOpen: PropTypes.bool.isRequired,
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onRequestSort: PropTypes.func.isRequired,
  toggleFilters: PropTypes.func.isRequired,
  enableEdits: PropTypes.bool.isRequired,
};

EnhancedTableHead.defaultProps = {};

export default EnhancedTableHead;
