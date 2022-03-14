import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import FilterListIcon from '@material-ui/icons/FilterList';
import FilterResetIcon from './icons/FilterResetIcon';
import storage from '../../../../utils/storage';

import FilterPane from './FilterPane';

const FilterIconContainer = styled.div`
  position: absolute;
  bottom: 11px;
  right: 6px;
  z-index: 999;
  background: transparent;
`;

const RoundedButton = styled(Button)`
  border-radius: 50%;
  height: 43px;
  width: 44px;
  min-width: 44px;
  padding: 0;
  margin: 0 5px;
  color: #7e7e7e;
`;

class FilterContainer extends Component {
  state = { isFilterOpen: false, bottom: null };

  timer = null;

  componentDidMount() {
    if (!this.props.isCollapsed) {
      this.setBottomHeight();
    }
  }

  componentWillReceiveProps() {
    if (!this.props.isCollapsed) {
      this.setBottomHeight();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  toggleFilterPane = () => {
    this.setState(prevState => ({
      isFilterOpen: !prevState.isFilterOpen,
    }));
  };

  isBottomWindow = () => {
    let bottomWindowId;
    const { id, timelineWindows } = this.props;
    for (const timeline of timelineWindows) {
      if (timeline.isOpen) {
        bottomWindowId = timeline.id;
      }
    }
    return bottomWindowId === id;
  };

  setBottomHeight = () => {
    try {
      const isBottomWindow = this.isBottomWindow();

      if (isBottomWindow) {
        this.setState({ bottom: { bottom: '60px' } });
        return;
      }

      // We need to give a small delay to calculate updated height of timeline window
      this.timer = setTimeout(() => {
        const filterIconContainer = document.getElementById(
          `filterIconContainer-${this.props.id}`
        );
        const rect = filterIconContainer
          ? filterIconContainer.getBoundingClientRect()
          : null;

        if (rect) {
          // If bottom timeline is collapsed
          if (rect.y + 90 > window.innerHeight) {
            this.setState({ bottom: { bottom: '30px' } });
            return;
          }
        }

        this.setState({ bottom: null });
      }, 10);
    } catch (error) {
      console.error(error);
    }
  };

  handleSetFilter = (render, filterBody) => {
    const { id } = this.props;
    storage.setItem(`timelineFilter${id}`, filterBody);
    storage.setItem(`timelineLastFilter${id}`, filterBody);
    this.props.setFilter(render, id);
  };

  handleResetFilter = () => {
    const { id } = this.props;
    const render = { 1: 'pairings', 2: 'legs' };
    const timelineFilter = storage.getItem(`timelineFilter${id}`);
    if (timelineFilter) {
      storage.removeItem(`timelineFilter${id}`);
      this.props.setFilter(render[id], id);
    }
  };

  render() {
    const { t, id, isCollapsed, filterCriteria } = this.props;
    return (
      <Fragment>
        {!isCollapsed && (
          <FilterIconContainer
            id={`filterIconContainer-${id}`}
            style={this.state.bottom}
          >
            <RoundedButton variant="contained" onClick={this.handleResetFilter}>
              <FilterResetIcon
                className="material-icons"
                style={{ marginLeft: '2px' }}
              />
            </RoundedButton>
            <RoundedButton variant="contained" onClick={this.toggleFilterPane}>
              <FilterListIcon />
            </RoundedButton>
            {/* 
              <RoundedButton variant="contained">
                <FavoriteIcon />
              </RoundedButton>
            */}
          </FilterIconContainer>
        )}

        {Array.isArray(filterCriteria) && filterCriteria.length > 0 && (
          <FilterPane
            t={t}
            id={id}
            isOpen={this.state.isFilterOpen}
            handleCancel={this.toggleFilterPane}
            filterCriteria={filterCriteria}
            setFilter={this.handleSetFilter}
          />
        )}
      </Fragment>
    );
  }
}

FilterContainer.propTypes = {
  t: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  timelineWindows: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterCriteria: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setFilter: PropTypes.func.isRequired,
};

export default FilterContainer;
