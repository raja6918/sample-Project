import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Button, Checkbox, Input } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CloseIcon from '@material-ui/icons/Close';
import { perfectScrollConfig } from '../../../../../../utils/common';
import SierraTooltip from './../../../../../../_shared/components/SierraTooltip';
import withErrorHandler from '../../../../../../components/ErrorHandler/withErrorHandler';

import {
  InputSearch,
  SearchIcon,
  ClearButton,
  ClearIcon,
} from '../../../../../../components/FilterInput';

const StyledSubComponent = styled.div`
  width: 160px;
  background: #f7f7f7;
  border-radius: 3px;
  outline: none;
  white-space: nowrap;

  & > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > span {
      font-size: 10px;
      font-style: italic;
      color: #666666;
    }
  }
  & > div:nth-child(2) {
    display: flex;
    justify-content: space-between;
  }
  & > div:nth-child(3) {
    max-height: 160px;
    border-bottom: 1px solid rgba(151, 151, 151, 0.24);
    & > div:first-child {
      max-height: 170px;
      & > div {
        display: flex;
        align-items: flex-start;
        padding: 4px 0;
        font-size: 15px;
        color: rgba(0, 0, 0, 0.67);
        cursor: pointer;
        & > div {
          padding: 4px;
          white-space: normal;
          user-select: none;
        }
      }
      & > div:hover {
        background: #f5f5f5;
      }
    }
  }
`;

const ClearAllButton = styled(Button)`
  text-transform: none;
  font-size: 10px;
  padding: 0;

  &:hover {
    background-color: transparent;
  }
  & .MuiButton-startIcon {
    margin-right: 0px;
  }
`;

const StyledInputSearch = styled(InputSearch)`
  width: 100%;
  margin: 7px 0;
  div {
    border: 1px solid rgba(0, 0, 0, 0.54);
  }
`;

export class CheckboxFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredItems: [],
      selectedIds: this.props.value,
      filter: '',
      elements: [],
      totalDataSize: 0,
    };
  }

  componentDidMount() {
    const { render, dataResolver } = this.props;
    if (render === 'static') {
      // No need of await since it is a static data resolver
      const elements = dataResolver();
      this.setFilteredItems(elements);
      this.setState({
        elements,
        totalDataSize: elements.length,
      });
    } else {
      this.fetchData(true);
    }
  }

  setFilteredItems = elements => {
    const { selectedIds } = this.state;
    const { selectAll } = this.props;

    if (selectedIds.length && elements.length) {
      const filteredItems = elements.filter(element =>
        selectedIds.includes(element.value)
      );
      this.setState({ filteredItems });
    } else if (selectAll && selectedIds.length === 0) {
      const selectedIds = elements.map(elem => elem.value);
      this.setState({ selectedIds, filteredItems: elements }, this.handleAdd);
    }
  };

  fetchData = async (initialCall = false) => {
    try {
      const {
        render,
        dataResolver,
        scope,
        paginationSize,
        scenarioInfo: { id: scenarioId },
      } = this.props;
      const { filter, elements, totalDataSize } = this.state;
      if (
        render === 'dynamic' &&
        (elements.length < totalDataSize || initialCall)
      ) {
        // This code need to modify in future to pass further parameter to dataResolver ie API services when API is implemented
        const response = await dataResolver(scenarioId, {
          endIndex: elements.length + paginationSize,
          scope,
          startIndex: elements.length,
          filter,
        });
        this.setState(
          prevState => ({
            elements: [...prevState.elements, ...response.data],
            totalDataSize: response.totalDataSize,
          }),
          () => this.setFilteredItems(this.state.elements)
        );
      }
    } catch (error) {
      if (error.response) this.props.reportError({ error });
    }
  };

  handleAdd = () => {
    this.props.onChange(
      this.state.selectedIds.length > 0 ? this.state.selectedIds : null,
      this.state.filteredItems,
      false
    );
  };

  handleClearAll = () => {
    this.setState({ filteredItems: [], selectedIds: [] }, () => {
      this.props.onChange(null, this.state.filteredItems, false);
    });
  };

  handleFilter = async e => {
    const value = e.target.value;
    const { enableServerSearch } = this.props;
    this.setState({ filter: value }, () => {
      if (enableServerSearch) {
        this.handleServerSideSearch(value);
      }
    });
  };

  handleServerSideSearch = debounce(async value => {
    try {
      const {
        dataResolver,
        scope,
        paginationSize,
        scenarioInfo: { id: scenarioId },
      } = this.props;

      const response = await dataResolver(scenarioId, {
        endIndex: paginationSize,
        scope,
        startIndex: 0,
        filter: value,
      });
      this.setState({
        elements: response.data,
        totalDataSize: response.totalDataSize,
      });
    } catch (error) {
      if (error.response) this.props.reportError({ error });
    }
  }, 250);

  handleClearFilter = () => {
    const { enableServerSearch } = this.props;
    this.setState(
      prevState => ({
        filter: '',
        elements: enableServerSearch ? [] : prevState.elements,
      }),
      () => {
        if (enableServerSearch) {
          this.fetchData(true);
        }
      }
    );
  };

  toggleItems = (item, checked) => {
    if (checked) {
      this.setState(
        prevState => ({
          filteredItems: [...prevState.filteredItems, item],
          selectedIds: [...prevState.selectedIds, item.value],
        }),
        this.handleAdd
      );
    } else {
      this.setState(
        prevState => ({
          filteredItems: prevState.filteredItems.filter(
            filteredItem => filteredItem.value !== item.value
          ),
          selectedIds: prevState.selectedIds.filter(id => id !== item.value),
        }),
        this.handleAdd
      );
    }
  };

  handleOnScroll = debounce(() => {
    const { elements, totalDataSize } = this.state;
    if (elements.length <= totalDataSize && this.props.render === 'dynamic') {
      this.fetchData();
    }
  }, 250);

  getTooltipContent = data => {
    const { tooltipKey } = this.props;
    if (tooltipKey !== 'display') {
      return data[tooltipKey];
    }
    return null;
  };

  render() {
    const { t, searchBox, enableServerSearch } = this.props;
    const { elements, selectedIds, filter } = this.state;
    return (
      <StyledSubComponent>
        <div>
          <span> {t('FILTER.pane.labels.anyOf')}</span>
          <ClearAllButton
            disabled={selectedIds.length === 0}
            color="primary"
            size="small"
            startIcon={<CloseIcon />}
            disableRipple={true}
            disableFocusRipple={true}
            onClick={this.handleClearAll}
          >
            {t('FILTER.pane.buttons.clearAll')}
          </ClearAllButton>
        </div>
        <div>
          {searchBox && (
            <StyledInputSearch>
              <Input
                type="text"
                disableUnderline={true}
                startAdornment={<SearchIcon>search</SearchIcon>}
                placeholder={t('SEARCHENGINE')}
                onChange={this.handleFilter}
                value={filter}
                endAdornment={
                  filter && (
                    <ClearButton onClick={this.handleClearFilter}>
                      <ClearIcon>highlight_off</ClearIcon>
                    </ClearButton>
                  )
                }
              />
            </StyledInputSearch>
          )}
        </div>
        <PerfectScrollbar
          onScrollDown={this.handleOnScroll}
          option={perfectScrollConfig}
        >
          <div>
            {elements.map(element => {
              const tooltipContent = this.getTooltipContent(element);
              const isItemPresent = selectedIds.includes(element.value);
              const checkBox = (
                <div
                  key={element.key || element.value}
                  onClick={() => this.toggleItems(element, !isItemPresent)}
                  style={{
                    background: isItemPresent ? '#EBEBEB' : '',
                    fontWeight: isItemPresent ? 500 : '',
                  }}
                >
                  <Checkbox checked={isItemPresent} />{' '}
                  <SierraTooltip
                    disabled={tooltipContent === null}
                    position="bottom"
                    html={
                      <p style={{ padding: '10px' }}>{tooltipContent || ''}</p>
                    }
                    distance="0"
                  >
                    {element.display}
                  </SierraTooltip>
                </div>
              );
              if (!enableServerSearch) {
                if (
                  element.display
                    .toLowerCase()
                    .includes(filter.toLowerCase()) ||
                  filter === ''
                ) {
                  return checkBox; // returns local filtered checkboxes.
                }
                return null;
              }
              return checkBox; // if no search method applied, return all checkboxes.
            })}
          </div>
        </PerfectScrollbar>
      </StyledSubComponent>
    );
  }
}

CheckboxFilter.propTypes = {
  t: PropTypes.func.isRequired,
  enableServerSearch: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  searchBox: PropTypes.bool,
  render: PropTypes.string,
  dataResolver: PropTypes.func.isRequired,
  tooltipKey: PropTypes.string,
  scope: PropTypes.string,
  paginationSize: PropTypes.number,
  scenarioInfo: PropTypes.shape({}).isRequired,
  reportError: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  selectAll: PropTypes.bool,
};

CheckboxFilter.defaultProps = {
  searchBox: true,
  enableServerSearch: false,
  render: 'static',
  tooltipKey: 'display',
  scope: 'pairings',
  paginationSize: 300,
  value: [],
  selectAll: false,
};

export default withErrorHandler(CheckboxFilter);
