import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MUIFormControl from '@material-ui/core/FormControl';
import { pull, union } from 'lodash';
import FormBodyTitle from './FormBodyTitle';
import FilterPaneFooter from './FilterPaneFooter';
import SaveFilterFooter from './SaveFilterFooter';
import FilterPaneFavourites from './FilterPaneFavourites';
import Base from '../../../../components/FormDrawer/Base';
import FormHeader from '../../../../components/FormDrawer/FormHeader';
import FormBody from '../../../../components/FormDrawer/FormBody';
import { SelectInput } from '../../../../components/GenericCollapsibleTable/components';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { perfectScrollConfig } from '../../../../utils/common';

import CriteriaFilter from './components/CriteriaFilter/CriteriaFilter';

import './style.scss';
import FilterComponentWithRouter from './FilterComponent';
import storage from '../../../../utils/storage';
import { pushGanttFilterAnalytics } from '../../../../utils/analytics';
import { getDefaultValues } from './helpers';

import { saveFilter, updateFilter } from '../../../../services/Pairings';

const FormContainer = styled.div`
  position: relative;
  width: 400px;
  height: 100vh;
`;

const FormControl = styled(MUIFormControl)`
  width: 100%;
`;

const BlueSpan = styled.div`
  color: #5098e7;
  font-size: 14px;
  padding-top: 5px;
  padding-bottom: 5px;
`;

const WhiteContainer = styled(Grid)`
  background: #ffffff;
  margin: 22px 8px;
  margin-bottom: 64px;
  & h2 {
    margin: 16px;
  }
  .link-button {
    display: block;
    color: #0a75c2;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
    margin-left: 16px;
    margin-right: 16px;
  }
`;

class FilterPane extends Component {
  state = {
    filterTypes: this.props.filterCriteria.map(filter => ({
      display: this.props.t(
        `FILTER.filterCriteria.filters.${filter.filterKey}`
      ),
      value: filter.filterId,
    })),
    filterCriteria: this.props.filterCriteria,
    filterId: 1,
    selectedCriteria: [],
    filterApplied: {},
    criteriaErrors: [],
    isLastFilterEnabled: false,
    filters: null,
    filterLoaded: '',
    enableFilterSave: false,
    isSaving: false,
    disableFilterSaveBtn: false,
  };

  componentWillReceiveProps() {
    const filters = storage.getItem(`timelineLastFilter${this.props.id}`);

    if (filters && filters.selectedCriteria.length > 0) {
      this.setState({ isLastFilterEnabled: true, filters });
    } else {
      this.setState({ isLastFilterEnabled: false, filters: null });
    }
  }

  handleAddSubCategory = () => {
    const [categories, subCategories] = this.getCategories();
    if (subCategories) {
      this.handleAddCriteria(subCategories, this.state.filterId);
    }
  };

  handleFilterTypeChange = value => {
    this.setState(
      {
        filterId: value,
        selectedCriteria: [],
        filterApplied: {},
        isLastFilterEnabled:
          this.state.filters && this.state.filters.selectedCriteria.length > 0,
      },
      this.handleAddSubCategory
    );
  };

  handleClearAll = () => {
    const { filters } = this.state;
    this.setState(
      {
        filterCriteria: this.props.filterCriteria,
        selectedCriteria: [],
        filterApplied: {},
        criteriaErrors: [],
        isLastFilterEnabled: filters && filters.selectedCriteria.length > 0,
        filterLoaded: '',
        isSaving: false,
        enableFilterSave: false,
      },
      this.handleAddSubCategory
    );
  };

  loadFilterToPane = (filterId, filters, filterLoaded = '') => {
    if (filters && filters.selectedCriteria.length > 0) {
      this.setState(
        { selectedCriteria: [], filterApplied: {}, filterId },
        () => {
          for (const [key, value] of Object.entries(filters.selectedCriteria)) {
            this.handleAddCriteria([value], value.categoryId, false);
          }
          this.setState({
            filterApplied: { ...filters.filterCriteria },
            isLastFilterEnabled: !filterLoaded
              ? false
              : this.state.filters &&
                this.state.filters.selectedCriteria.length > 0,
            filterLoaded: filterLoaded || '',
            enableFilterSave: filterLoaded ? false : true,
          });
        }
      );
    }
  };

  handleLastFilterApply = () => {
    const { filters } = this.state;
    const filterId = filters.render === 'pairings' ? 1 : 2;
    this.loadFilterToPane(filterId, filters, filters.filterLoaded);
  };

  handleLoadFilter = (e, filterLoaded) => {
    if (filterLoaded) {
      const filters = filterLoaded.source;
      const filterId = filters.render === 'pairings' ? 1 : 2;

      // Rename ganttFilterCriteria back to filterCriteria
      if (!filters.filterCriteria) {
        filters.filterCriteria = filters.ganttFilterCriteria;
      }

      this.loadFilterToPane(filterId, filters, filterLoaded);
    } else {
      this.setState({ filterLoaded: '' });
    }
  };

  handleClose = () => {
    this.props.handleCancel();
    this.handleClearAll();
  };

  handleAddCriteria = (criteria, categoryId, isLastFilterEnabled = true) => {
    const { filters } = this.state;
    const criteriaIds = [];
    const modifiedCriteria = criteria.map(criterion => {
      criteriaIds.push(criterion.crId);
      return { ...criterion, categoryId };
    });
    this.setState(prevState => ({
      isLastFilterEnabled:
        isLastFilterEnabled && filters && filters.selectedCriteria.length > 0,
      selectedCriteria: [...prevState.selectedCriteria, ...modifiedCriteria],
      enableFilterSave: true,
      filterCriteria: prevState.filterCriteria.map(filter => {
        if (filter.filterId === this.state.filterId) {
          const newCategories = filter.categories.map(category => {
            if (category.categoryId === categoryId) {
              const newCriteria = category.criteria.filter(
                criteria => !criteriaIds.includes(criteria.crId)
              );
              return { ...category, criteria: newCriteria };
            }
            return category;
          });

          return { ...filter, categories: newCategories };
        }
        return filter;
      }),
    }));
  };

  handleRemoveCriteria = criteria => {
    const { filterApplied, filters } = this.state;
    delete filterApplied[criteria.crName];
    this.setState(prevState => ({
      isLastFilterEnabled: filters && filters.selectedCriteria.length > 0,
      selectedCriteria: prevState.selectedCriteria.filter(
        selectedCriteria => selectedCriteria.crId !== criteria.crId
      ),
      filterCriteria: prevState.filterCriteria.map(filter => {
        if (filter.filterId === this.state.filterId) {
          const newCategories = filter.categories.map(category => {
            if (category.categoryId === criteria.categoryId) {
              const newCriteria = category.criteria.concat(criteria);
              return { ...category, criteria: newCriteria };
            }
            return category;
          });

          return { ...filter, categories: newCategories };
        }
        return filter;
      }),
      filterApplied,
      criteriaErrors: pull(prevState.criteriaErrors, criteria.crName),
      enableFilterSave: true,
    }));
  };

  handleCriteriaChange = (name, value, data, error = false) => {
    const { filterApplied, filters } = this.state;
    if (value) {
      filterApplied[name] = { value, type: '' };
    } else {
      delete filterApplied[name];
    }
    this.setState(prevState => ({
      isLastFilterEnabled: filters && filters.selectedCriteria.length > 0,
      filterApplied,
      enableFilterSave: true,
      criteriaErrors: error
        ? union(prevState.criteriaErrors, [name])
        : pull(prevState.criteriaErrors, name),
    }));
  };

  handleApply = () => {
    const {
      filterId,
      filterApplied,
      selectedCriteria,
      filterLoaded,
      enableFilterSave,
    } = this.state;

    const isFilterChanged = enableFilterSave && filterLoaded;

    const filterBody = {
      type: 'apply',
      filterCriteria: filterApplied,
      selectedCriteria,
      filterLoaded: !isFilterChanged ? filterLoaded : '',
    };
    // for google analytics
    if (typeof filterApplied === 'object') {
      pushGanttFilterAnalytics(
        selectedCriteria,
        filterId === 1 ? 'Pairings' : 'Legs'
      );
    }
    if (filterId === 1) {
      // filterId 1 is Pairings Filter
      this.props.setFilter('pairings', {
        ...filterBody,
        render: 'pairings',
      });
    } else {
      // filterId 2 is legs Filter
      this.props.setFilter('legs', {
        ...filterBody,
        render: 'legs',
      });
    }
    const filters = storage.getItem(`timelineLastFilter${this.props.id}`);
    if (filters && filters.selectedCriteria.length > 0) {
      this.setState(
        {
          filters,
          isLastFilterEnabled: true,
        },
        this.handleClose
      );
    } else {
      this.handleClose();
    }
  };

  handleViewAllActivities = render => {
    this.props.viewAllActivities(render);
    this.handleClose();
  };

  getCategories = () => {
    const selectedFilter = this.state.filterCriteria.find(
      filter => filter.filterId === this.state.filterId
    );
    return selectedFilter
      ? [selectedFilter.categories, selectedFilter.subCategories]
      : [[], []];
  };

  hasErrors = () => {
    return this.state.criteriaErrors.length > 0;
  };

  enableApplyBtn = subCats => {
    const { filterApplied } = this.state;

    let isChecked = false;
    if (Array.isArray(subCats) && !this.hasErrors()) {
      for (const key of Object.keys(filterApplied)) {
        const index = subCats.map(e => e.crName).indexOf(key);
        if (index !== -1) {
          isChecked = true;
          break;
        }
      }
    } else if (Object.keys(filterApplied).length > 0 && !this.hasErrors()) {
      isChecked = true;
    }
    return isChecked;
  };

  enableClearAll = () => {
    const { filterApplied, selectedCriteria } = this.state;

    let isEnable = true;
    if (Array.isArray(selectedCriteria)) {
      for (const sc of selectedCriteria) {
        if (
          filterApplied[sc.crName] &&
          filterApplied[sc.crName].value === getDefaultValues(sc)
        ) {
          isEnable = false;
        } else {
          isEnable = true;
          break;
        }
      }
    }
    return isEnable;
  };

  callSaveFilter = async (name, isUpdate = false) => {
    try {
      const {
        filterId,
        filterApplied,
        selectedCriteria,
        filterLoaded,
        filters,
      } = this.state;
      const { scenarioId, onUpdateLoadedFilter } = this.props;

      // Disable save filter button to prevent duplicate updates
      this.setState({ enableFilterSave: false });

      const filterBody = {
        object: 'filter',
        name,
        type: filterId === 1 ? 'PAIRING' : 'FLIGHT',
        source: {
          type: 'apply',
          ganttFilterCriteria: filterApplied,
          selectedCriteria,
          render: filterId === 1 ? 'pairings' : 'legs',
        },
      };

      let savedFilter;
      if (isUpdate) {
        filterBody.id = filterLoaded.id;
        savedFilter = await updateFilter(scenarioId, filterBody);
      } else {
        savedFilter = await saveFilter(scenarioId, filterBody);
      }

      if (savedFilter) {
        // Check whether last filter name is same as newly updated filter then we need to update last filter too
        if (
          filters &&
          filters.filterLoaded &&
          filters.filterLoaded.name === savedFilter[0].name
        ) {
          filters.filterLoaded = '';
          storage.setItem(`timelineLastFilter${this.props.id}`, filters);
        }

        this.setState({
          filterLoaded: savedFilter[0],
          isSaving: false,
          filters,
        });
        onUpdateLoadedFilter(savedFilter[0], isUpdate);
      }
    } catch (error) {
      // Re-enable save filter on error
      this.setState({ enableFilterSave: true });
      this.props.reportError({
        isCustomError: true,
        message: this.props.t('ERRORS.FILTER.save', {
          filterName: name,
        }),
      });

      console.error(error);
    } finally {
      this.setState({ disableFilterSaveBtn: false });
    }
  };

  handleStartSaveFilter = () => {
    this.setState({ isSaving: true });
  };

  handleUpdateFilter = () => {
    this.callSaveFilter(this.state.filterLoaded.name, true);
  };

  handleCancelFilter = () => {
    this.setState({ isSaving: false });
  };

  handleSaveFilter = name => {
    this.setState({ disableFilterSaveBtn: true });
    this.callSaveFilter(name, false);
  };

  enableSaveFilterBtn = () => {
    const { selectedCriteria, enableFilterSave } = this.state;
    const { readOnly } = this.props;

    return (
      selectedCriteria.length > 0 &&
      !this.hasErrors() &&
      enableFilterSave &&
      !readOnly
    );
  };

  render() {
    const {
      t,
      id,
      handleCancel,
      loadedFilters,
      readOnly,
      ...rest
    } = this.props;
    const {
      filterTypes,
      filterId,
      selectedCriteria,
      isLastFilterEnabled,
      filterLoaded,
      isSaving,
      enableFilterSave,
      disableFilterSaveBtn,
    } = this.state;

    const [categories, subCategories] = this.getCategories();
    const isEnabled = this.enableApplyBtn(subCategories);
    const isSaveBtnFilterEnabled = this.enableSaveFilterBtn();

    return (
      <Base anchor="right" handleCancel={this.handleClose} {...rest}>
        <FormContainer>
          <FormHeader>
            <span>
              {t('FILTER.timeline')} #{id}
            </span>
            <span>{t('FILTER.name')}</span>
          </FormHeader>
          <FormBody className="filter-body">
            <PerfectScrollbar option={perfectScrollConfig}>
              <div>
                <FormBodyTitle
                  t={t}
                  enableClearAll={
                    selectedCriteria.length > 0 && this.enableClearAll()
                  }
                  handleClearAll={this.handleClearAll}
                  handleLastFilterApply={this.handleLastFilterApply}
                  enableLastFilter={isLastFilterEnabled}
                  formTitle={filterLoaded ? filterLoaded.name : ''}
                  isFilterChanged={enableFilterSave && filterLoaded}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <FormControl required>
                      <InputLabel htmlFor="filterType">
                        {t('FILTER.form.filterType')}
                      </InputLabel>
                      <SelectInput
                        name="filterType"
                        onChange={this.handleFilterTypeChange}
                        items={filterTypes}
                        value={filterId}
                        // handleDisable={() => true}
                      />
                    </FormControl>
                  </Grid>

                  {selectedCriteria.map((criteria, index) => {
                    const value = this.state.filterApplied[criteria.crName]
                      ? this.state.filterApplied[criteria.crName].value
                      : null;
                    return (
                      <Grid item xs={12} sm={12} key={criteria.crId}>
                        {index > 0 && <BlueSpan>({t('FILTER.and')})</BlueSpan>}
                        <FilterComponentWithRouter
                          t={t}
                          criteria={criteria}
                          handleCriteriaChange={this.handleCriteriaChange}
                          handleRemoveCriteria={this.handleRemoveCriteria}
                          value={value}
                        />
                      </Grid>
                    );
                  })}

                  {categories.length > 0 && (
                    <Fragment>
                      {selectedCriteria.length > 0 && (
                        <BlueSpan
                          style={{ paddingLeft: '7px', paddingTop: '13px' }}
                        >
                          ({t('FILTER.and')})
                        </BlueSpan>
                      )}
                      <Grid item xs={12} sm={12} style={{ paddingTop: '15px' }}>
                        <CriteriaFilter
                          t={t}
                          categories={categories}
                          getfilteredCriteria={this.handleAddCriteria}
                        />
                      </Grid>
                    </Fragment>
                  )}

                  <WhiteContainer item xs={12} sm={12}>
                    <h2>{t('FILTER.pane.quickFilter.title')}</h2>
                    <button
                      type="button"
                      className="link-button button-reset"
                      onClick={() => this.handleViewAllActivities('pairings')}
                    >
                      {t('FILTER.pane.quickFilter.pairings')}
                    </button>
                    <button
                      type="button"
                      className="link-button button-reset"
                      style={{ marginTop: '16px', marginBottom: '16px' }}
                      onClick={() => this.handleViewAllActivities('legs')}
                    >
                      {t('FILTER.pane.quickFilter.flights')}
                    </button>
                  </WhiteContainer>
                </Grid>
              </div>
            </PerfectScrollbar>
          </FormBody>
          {/* {!isSaving && Array.isArray(loadedFilters) && (
            <FilterPaneFavourites
              t={t}
              enableSave={isSaveBtnFilterEnabled}
              filterLoaded={filterLoaded}
              loadedFilters={loadedFilters}
              onLoadFilter={this.handleLoadFilter}
              onStartSaveFilter={this.handleStartSaveFilter}
              onUpdateFilter={this.handleUpdateFilter}
            />
          )}
          {isSaving && (
            <SaveFilterFooter
              t={t}
              onSaveFilter={this.handleSaveFilter}
              onCancelFilter={this.handleCancelFilter}
              loadedFilters={loadedFilters}
              disableFilterSave={disableFilterSaveBtn}
            />
          )} */}
          {!isSaving && (
            <FilterPaneFooter
              t={t}
              enableSave={isEnabled}
              handleCancel={this.handleClose}
              handleRefine={this.handleRefine}
              handleAugment={this.handleAugment}
              handleApply={this.handleApply}
            />
          )}
        </FormContainer>
      </Base>
    );
  }
}

FilterPane.propTypes = {
  t: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  filterCriteria: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setFilter: PropTypes.func.isRequired,
  viewAllActivities: PropTypes.func.isRequired,
  scenarioId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  readOnly: PropTypes.bool.isRequired,
  loadedFilters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onUpdateLoadedFilter: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
};

export default FilterPane;
