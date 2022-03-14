import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import { t } from 'i18next';

import Icon from '../Icon';

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
  componentWillReceiveProps(nextProps) {
    if (!nextProps.filtersOpen) {
      this.clearAllInputs();
    }
  }

  clearAllInputs = () => {
    const headers = this.props.headers;
    for (let i = 0; i < headers.length; i++) {
      /* There is no field to clear if noFilter is set to false */
      if (!headers[i].noFilter) {
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

  generateComponent = (component, header) => {
    const Component = component;
    const minProps = {
      onChange: e => {
        this.onFilter(header, e);
      },
      inputRef: node => {
        this[header.field] = node;
      },
      filterOpen: this.props.filtersOpen,
    };
    const cProps = header.componentProps
      ? {
          ...header.componentProps,
          ...minProps,
        }
      : minProps;
    return <Component {...cProps} />;
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
      toggleFilters,
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell style={{ padding: '0px 18px' }}>
            <Checkbox
              color={'primary'}
              onChange={onSelectAllClick}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount && rowCount > 0}
              style={{ width: 20, height: 20 }}
            />
          </TableCell>
          {headers.map((h, k) => {
            const style = h.cellStyle ? h.cellStyle : {};
            const direction = order === 'inc' ? 'asc' : 'desc';
            return (
              <TableCell
                key={k}
                sortDirection={orderBy === h.field ? direction : false}
                style={style}
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
              </TableCell>
            );
          })}
          <TableCell style={{ width: '154px', textAlign: 'right' }}>
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
          </TableCell>
        </TableRow>

        <CollapsableTableRow className="filters" show={filtersOpen.toString()}>
          <TableCell style={{ padding: '0px 18px' }} />
          {headers.map(h => (
            <TableCell
              key={h.field}
              style={{ paddingLeft: 3, paddingRight: 3 }}
            >
              {!h.noFilter && (
                <InputSearch>
                  {!h.component ? (
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
                  ) : (
                    this.generateComponent(h.component, h)
                  )}
                </InputSearch>
              )}
            </TableCell>
          ))}
          <TableCell />
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
};

EnhancedTableHead.defaultProps = {};

export default EnhancedTableHead;
