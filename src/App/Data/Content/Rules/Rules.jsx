import React, { Component, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Grid, MenuItem, Select } from '@material-ui/core';
import DataNotFound from '../../../../components/DataNotFound';
import Container from '../../../../components/DataContent/Container';
import GenericCollapsibleTable from '../../../../components/GenericCollapsibleTable';
import AddHeader from '../../../../components/Headers/AddHeader';
import RedirectLink from '../../../../components/RedirectLink';
import EditModeBar from '../../../../components/EditModeBar';
import { orderBy, order, getHeaders, INITIAL_ITEMS } from './constants';
import storage from '../../../../utils/storage';
import RuleDescription from './RuleDescription';
import ModalLoader from '../../../../components/ModalLoader';
import * as ruleService from '../../../../services/Data/rules';
import MenuText from '../../../../components/Menu/MenuText';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import { checkEmptyFilter } from './helpers.js';
import { prepareSortPayload } from './../../../../components/GenericCollapsibleTable/helpers';
import AccessEnabler from '../../../../components/AccessEnabler';
import scopes from '../../../../constants/scopes';
import { checkPermission } from '../../../../utils/common';
import { pushRuleChangeDataToAnalytics } from '../../../../utils/analytics';
import { clearMasterData } from '../../../../actions/data';

export class Rules extends Component {
  state = {
    rules: [],
    ruleSets: [],
    totalDataSize: 0,
    ruleDescriptions: [],
    currentRuleSetId: storage.getItem('rulesetId'),
    userId: this.props.userData.id,
    filteredDataSize: 0,
    openLoader: false,
    titleLoader: this.props.t('DATA.rules.loader'),
    isFilter: false,
    isLoading: false,
    filters: null,
  };

  rulesPayload = {
    startIndex: 0,
    endIndex: INITIAL_ITEMS,
    sort: prepareSortPayload({ field: orderBy }, order),
  };

  tableRef = createRef();

  async componentDidMount() {
    try {
      const { openItemId } = this.props;
      const { currentRuleSetId } = this.state;
      let tempRulesetId = currentRuleSetId;
      this.setState({ isLoading: true });
      await this.getAllRuleSets();
      if (currentRuleSetId) {
        this.getAllRules();
      } else {
        ruleService
          .getDefaultCrewgroup(openItemId)
          .then(result => {
            if (Array.isArray(result.data) && result.data[0].ruleset) {
              tempRulesetId = result.data[0].ruleset;
            } else {
              const parentRuleSet = this.state.ruleSets.find(
                item => item.fallback === 0
              );
              tempRulesetId = parentRuleSet ? parentRuleSet.id : null;
            }
            if (tempRulesetId)
              this.setState(
                { currentRuleSetId: tempRulesetId },
                this.getAllRules
              );
          })
          .catch(error => {
            if (error.response) this.props.reportError({ error });
          });
      }
    } catch (e) {
      console.error(e);
      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    this.props.clearMasterData();
  }

  getAllRuleSets = () => {
    const { userId } = this.state;
    const { openItemId } = this.props;
    return ruleService
      .getRuleSets(openItemId, userId)
      .then(ruleSets => {
        this.setState({ ruleSets });
      })
      .catch(error => {
        if (error.response) this.props.reportError({ error });
      });
  };

  getAllRules = () => {
    const { openItemId } = this.props;
    const { currentRuleSetId, userId } = this.state;
    ruleService
      .getRules(userId, openItemId, currentRuleSetId, this.rulesPayload)
      .then(response => {
        this.setState({
          rules: response.data,
          totalDataSize: response.totalDataSize,
        });
      })
      .catch(error => {
        if (error.response) this.props.reportError({ error });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  getCurrentRuleSetName = () => {
    const { ruleSets, currentRuleSetId } = this.state;

    const tempRuleSet = ruleSets.find(item => item.id === currentRuleSetId);
    return tempRuleSet ? tempRuleSet.name : '';
  };

  onChangeRuleSet = event => {
    const { openItemId } = this.props;
    const { userId } = this.state;
    this.rulesPayload = {
      ...this.rulesPayload,
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
    };
    ruleService
      .getRules(userId, openItemId, event.target.value, this.rulesPayload)
      .then(response => {
        this.setState({
          rules: response.data,
          currentRuleSetId: event.target.value,
          ruleDescriptions: [],
          filteredDataSize: response.totalDataSize,
        });
        // Reset table body ie to collapse already opened rows
        if (this.tableRef.current) {
          this.tableRef.current.resetRows();
          this.tableRef.current.moveScrollBarToTop();
        }
        storage.setItem('rulesetId', event.target.value);
      })
      .catch(error => {
        if (error.response) this.props.reportError({ error });
      });
  };

  handleStateChange = async (value, data) => {
    const rules = this.state.rules;
    const ruleIndex = rules.findIndex(rule => rule.code === data.code);
    try {
      // Call the change state API
      await ruleService.activateRule(
        this.state.userId,
        this.props.openItemId,
        data.ruleset,
        data.code,
        value
      );
      if (ruleIndex !== -1) {
        rules[ruleIndex].active = value;
        rules[ruleIndex].activeDefinedInCurrent = true;
      }
    } catch (error) {
      if (error.response) {
        this.props.reportError({ error });
      }

      // In case of error reset the selectbox
      if (ruleIndex !== -1) {
        rules[ruleIndex].active = !value;
      }
    } finally {
      this.setState({ rules }, () => {
        this.filterStates();
      });
    }
  };

  handleStateReset = async data => {
    try {
      // Call the revert rule API
      await ruleService.revertRule(
        this.state.userId,
        this.props.openItemId,
        data.ruleset,
        data.code
      );

      // Once revert is success, Call rule detail API to fetch it's previous value
      const ruleDetails = await this.fetchRuleDetails(data.code, data.ruleset);

      const rules = this.state.rules;
      const ruleIndex = rules.findIndex(rule => rule.code === data.code);
      if (ruleIndex !== -1) {
        rules[ruleIndex].active = ruleDetails.active;
        rules[ruleIndex].activeDefinedInCurrent =
          ruleDetails.activeDefinedInCurrent;
      }

      this.setState({ rules }, () => {
        this.filterStates();
      });
    } catch (error) {
      if (error.response) this.props.reportError({ error });
    }
  };

  fetchRuleDetails = async (code, ruleSet) => {
    try {
      return await ruleService.getRuleDescription(
        code,
        this.props.openItemId,
        this.state.userId,
        ruleSet
      );
    } catch (error) {
      if (error.response) this.props.reportError({ error });
    }
  };

  /**
   * Method to remove rule in rules table if user apply state filter and then change state
   */
  filterStates = () => {
    const { filters, isFilter } = this.state;
    if (isFilter) {
      const active = filters ? filters.active : null;
      if (typeof active === 'boolean') {
        const rules = this.state.rules.filter(rule => rule.active === active);
        this.setState({ rules });
      }
    }
  };

  handleDisable = (value, data) => {
    const { readOnly, userPermissions } = this.props;
    return (
      data.ruleTypeName === 'Definition' ||
      readOnly ||
      !checkPermission(scopes.rules.ruleEdit, userPermissions)
    );
  };

  highlighter = (value, data) => {
    if (value) {
      return value === this.getCurrentRuleSetName();
    }
    return false;
  };

  checkStateToolTipStatus = data =>
    !data.activeDefinedInCurrent || !data.ruleHasReject;

  handleStateTooltipDisable = (value, data) => {
    const { readOnly, userPermissions } = this.props;
    return (
      this.checkStateToolTipStatus(data) ||
      readOnly ||
      !checkPermission(scopes.rules.ruleEdit, userPermissions)
    );
  };

  getTooltipContent = (value, data) =>
    this.checkStateToolTipStatus(data)
      ? this.props.t('DATA.rules.tooltip.settingsFrom', {
          name: data.activeReferenceRulesetName,
        })
      : this.props.t('DATA.rules.tooltip.revertTo', {
          name: data.activeReferenceRulesetName,
        });

  /**
   * This method will be called once the API call is successfully completed by Description component
   */
  handleParamSet = async (value, data, code) => {
    this.toggleLoader(true);
    const ruleDescriptions = this.state.ruleDescriptions.map(description => {
      if (description.code === code && data.name) {
        const paramObject = description.userDescription.references[data.name];
        if (paramObject) {
          paramObject.definedInCurrent = true;
          paramObject.value = value;
          description.userDescription.references[data.name] = paramObject;
          const payload = {};
          payload['iRuleCategory'] = description.ruleCategoryName;
          payload['iRuleType'] = description.ruleTypeName;
          pushRuleChangeDataToAnalytics(payload);
        }
      }
      return description;
    });

    // If paramater change we need to change the Setting From value too.
    const selectedRuleSet = this.state.ruleSets.find(
      item => item.id === this.state.currentRuleSetId
    );

    const rules = this.state.rules;
    const ruleIndex = rules.findIndex(rule => rule.code === code);
    if (ruleIndex !== -1) {
      rules[ruleIndex].settingsFromRulesetName = selectedRuleSet
        ? selectedRuleSet.name
        : rules[ruleIndex].settingsFromRulesetName;
    }

    this.setState({ ruleDescriptions, rules }, () => {
      this.refreshRules();
    });
  };

  handleParamReset = async (data, ruleset, code) => {
    try {
      this.toggleLoader(true);
      // Call the revert param API
      await ruleService.revertParam(
        this.state.userId,
        this.props.openItemId,
        ruleset,
        data.name
      );

      this.refreshRules();
    } catch (error) {
      if (error.response) this.props.reportError({ error });
    }
  };

  userDescriptionTransformer = data => {
    const transformedData = {};
    const references = {};
    transformedData.data = data.data;
    data.references.forEach(reference => {
      if (reference.name) references[reference.name] = reference;
    });
    transformedData.references = references;
    return transformedData;
  };

  fetchDescription = async (data, ruleSet) => {
    try {
      const checkExist = this.state.ruleDescriptions.find(
        description => description.code === data.code
      );

      // If it is not in global ruleDescriptions state, Then fetch it via API
      if (!checkExist) {
        // calling API
        const description = await ruleService.getRuleDescription(
          data.code,
          this.props.openItemId,
          this.state.userId,
          data.ruleset || ruleSet
        );
        description.userDescription = this.userDescriptionTransformer(
          description.userDescription
        );
        if (description) {
          this.setState(prevState => ({
            ruleDescriptions: prevState.ruleDescriptions.concat(description),
          }));
        }
      }
    } catch (error) {
      if (error.response) this.props.reportError({ error });
    }
  };

  handleSort = sortPayload => {
    const { openItemId } = this.props;
    const { currentRuleSetId, userId } = this.state;
    this.rulesPayload = {
      ...this.rulesPayload,
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
      sort: sortPayload,
    };

    ruleService
      .getRules(userId, openItemId, currentRuleSetId, this.rulesPayload)
      .then(response => {
        this.setState({ rules: response.data });
        // Reset table body ie to collapse already opened rows
        if (this.tableRef.current) {
          this.tableRef.current.resetRows();
          this.tableRef.current.moveScrollBarToTop();
        }
      });
  };

  handleFilter = filters => {
    const isEmpTyFilterObj = checkEmptyFilter(filters);
    const { openItemId } = this.props;
    const { currentRuleSetId, userId } = this.state;
    this.rulesPayload = {
      ...this.rulesPayload,
      filterCriteria: filters,
      startIndex: 0,
      endIndex: INITIAL_ITEMS,
    };
    ruleService
      .getRules(userId, openItemId, currentRuleSetId, this.rulesPayload)
      .then(response => {
        this.setState({
          rules: response.data,
          isFilter: isEmpTyFilterObj ? true : false,
          filteredDataSize: response.totalDataSize,
          filters: isEmpTyFilterObj ? filters : null,
        });
      })
      .catch(err => {
        this.setState({
          rules: [],
          isFilter: isEmpTyFilterObj ? true : false,
          filteredDataSize: 0,
          filters: isEmpTyFilterObj ? filters : null,
        });
        console.error(err);
        if (err.response) this.props.reportError({ err });
      });
  };

  fetchData = nextItems => {
    const {
      currentRuleSetId,
      userId,
      totalDataSize,
      isFilter,
      filteredDataSize,
    } = this.state;
    const { openItemId } = this.props;
    const { endIndex: currentEndIndex } = this.rulesPayload;

    if (
      currentEndIndex === totalDataSize ||
      (totalDataSize > 0 && currentEndIndex > totalDataSize) ||
      (isFilter && currentEndIndex > filteredDataSize)
    )
      return;

    const nextStartIndex = currentEndIndex;
    let nextEndIndex = currentEndIndex + nextItems;

    if (nextEndIndex > totalDataSize) {
      nextEndIndex = totalDataSize;
    }

    this.rulesPayload = {
      ...this.rulesPayload,
      startIndex: nextStartIndex,
      endIndex: nextEndIndex,
    };

    ruleService
      .getRules(userId, openItemId, currentRuleSetId, this.rulesPayload)
      .then(response => {
        const newRulesData = [...this.state.rules, ...response.data];
        this.setState({ rules: newRulesData });
      })
      .catch(error => {
        if (error.response) this.props.reportError({ error });
      });
  };

  toggleLoader = open => {
    this.setState({ openLoader: open });
  };

  getRuleCodes = () => {
    return this.state.ruleDescriptions.map(desc => desc.code);
  };

  refreshRules = async () => {
    try {
      this.toggleLoader(true);
      const { openItemId } = this.props;
      const { currentRuleSetId, userId, rules } = this.state;
      const getRules = ruleService.getRules(
        userId,
        openItemId,
        currentRuleSetId,
        { ...this.rulesPayload, startIndex: 0, endIndex: rules.length }
      );
      const getRuleDescriptionFromCodes = ruleService.getRuleDescriptionFromCodes(
        this.getRuleCodes(),
        openItemId,
        userId,
        currentRuleSetId
      );

      const [ruleData, ruleDescriptions] = await Promise.all([
        getRules,
        getRuleDescriptionFromCodes,
      ]);

      ruleDescriptions.forEach(description => {
        description.userDescription = this.userDescriptionTransformer(
          description.userDescription
        );
      });

      this.setState({
        rules: ruleData.data,
        ruleDescriptions: ruleDescriptions,
        totalDataSize: ruleData.totalDataSize,
      });
    } catch (error) {
      if (error.response) this.props.reportError({ error });
    } finally {
      this.toggleLoader(false);
    }
  };

  disableRowStyle = (data, header) => {
    return !data.active && header.field !== 'active' ? { opacity: '0.5' } : {};
  };

  ruleText = 'DATA.rules';

  render() {
    const {
      t,
      editMode,
      openItemId,
      openItemName,
      readOnly,
      ...rest
    } = this.props;
    const {
      rules,
      userId,
      totalDataSize,
      ruleDescriptions,
      ruleSets,
      currentRuleSetId,
      isFilter,
      filteredDataSize,
      isLoading,
    } = this.state;
    return (
      <Fragment>
        <AddHeader
          t={t}
          name={this.getCurrentRuleSetName()}
          editMode={editMode}
          openItemId={openItemId}
          openItemName={openItemName}
          needAddButton={false}
          redirectLink={
            <RedirectLink
              to={{
                pathname: `rules/rule-sets`,
                state: {
                  openItemId: openItemId,
                  openItemName: openItemName,
                  editMode: editMode,
                  readOnly,
                },
              }}
            >
              {t('DATA.ruleSets.link')}
            </RedirectLink>
          }
          readOnly={readOnly}
          {...rest}
        />
        <ModalLoader
          open={this.state.openLoader}
          title={this.state.titleLoader}
          color="white"
        />
        <Container>
          <Grid
            container
            spacing={1}
            alignItems="center"
            className="container-cls"
          >
            <Grid item>{t(`DATA.rules.inputSelector`)} :</Grid>
            <Grid item>
              <Select
                className="ruleset-select"
                onChange={this.onChangeRuleSet}
                value={currentRuleSetId}
                inputProps={{
                  name: name,
                  id: name,
                  required: false,
                }}
              >
                {ruleSets.map(data => (
                  <MenuItem key={data.id} value={data.id}>
                    <MenuText>{data.name ? data.name : ''}</MenuText>
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
          {rules.length || isFilter ? (
            <AccessEnabler
              scopes={scopes.rules.ruleEdit}
              disableComponent
              render={props => (
                <GenericCollapsibleTable
                  headers={getHeaders(
                    t,
                    this.handleStateChange,
                    this.handleDisable,
                    this.highlighter,
                    this.handleStateReset,
                    this.handleStateTooltipDisable,
                    this.getTooltipContent
                  )}
                  data={rules}
                  totalDataSize={totalDataSize}
                  orderBy={orderBy}
                  order={order}
                  handleSort={this.handleSort}
                  handleFilter={this.handleFilter}
                  frontEndFilterdisabled={true}
                  handleFetchData={this.fetchData}
                  filteredDataSize={filteredDataSize}
                  name={t(`${this.ruleText}.name`)}
                  isFilter={isFilter}
                  t={t}
                  editMode={editMode}
                  collapsibleComponent={RuleDescription}
                  collapsibleComponentProps={{
                    userId: userId,
                    readOnly: props.disableComponent || readOnly,
                    scenarioId: openItemId,
                    ruleDescriptions: ruleDescriptions,
                    handleParamSet: this.handleParamSet,
                    handleParamReset: this.handleParamReset,
                    fetchDescription: this.fetchDescription,
                    toggleLoader: this.toggleLoader,
                    refreshRules: this.refreshRules,
                  }}
                  ref={this.tableRef}
                  keyField="code"
                  disableRowStyle={this.disableRowStyle}
                />
              )}
            />
          ) : (
            <Fragment>
              {isLoading ? (
                <DataNotFound
                  text={t('GLOBAL.dataLoading.message', {
                    data: t(`${this.ruleText}.name`).toLowerCase(),
                  })}
                />
              ) : (
                <DataNotFound
                  text={t('GLOBAL.dataNotFound.message', {
                    data: t(`${this.ruleText}.name`).toLowerCase(),
                  })}
                />
              )}
            </Fragment>
          )}
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state;
  return { userData: user.userData, userPermissions: user.permissions };
};

const mapDispatchToProps = (dispatch, props) => ({
  clearMasterData: () => dispatch(clearMasterData()),
});

const RulesComponent = connect(mapStateToProps, mapDispatchToProps)(Rules);

Rules.propTypes = {
  t: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  openItemName: PropTypes.string.isRequired,
  reportError: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  userData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    userName: PropTypes.string,
  }),
  userPermissions: PropTypes.shape([]).isRequired,
  clearMasterData: PropTypes.func.isRequired,
};

Rules.defaultProps = {
  userData: {},
};

export default withErrorHandler(RulesComponent);
