import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import InputSelector from '../../../components/InputSelector';
import TextArea from '../../../components/TextArea';
import { FormControl } from './../FormComponents';
import { getDefaultEntity, getMappedValues } from '../utils';
import WarningIcon from '@material-ui/icons/Warning';
import SierraTooltip from '../../../_shared/components/SierraTooltip';
import { connect } from 'react-redux';
import { triggerShowErrors } from '../../../actions/solver';
import AccessEnabler from '../../../components/AccessEnabler';
import RecipeContainer from './../RecipeDND/RecipeContainer';
import '../styles.scss';
import { Typography } from '@material-ui/core';

const SolverFormContent = styled.div`
  width: 96%;
`;

export class SummaryForm extends Component {
  state = {
    ...getDefaultEntity(),
    activeRequest: this.props.activeRequest,
    isEditing: false, // used to check whether there is a need to re-render
  };

  /**
   * @function - Used to find the ID's of the String name and set the state.
   * @param {Object} props - The latest props object.
   */
  setIds = props => {
    const { solverTasks, crewGroups, rules, recipes, activeRequest } = props;

    const values = {
      solverTask: activeRequest.solverTaskName,
      crewGroup: activeRequest.crewGroupName,
      rule: activeRequest.rulesetName,
      recipeNames: activeRequest.solverRecipeName,
    };
    const filter = { match: 'name', for: 'id' };

    this.setState({
      activeRequest,
      ...getMappedValues(
        solverTasks,
        crewGroups,
        rules,
        recipes,
        values,
        filter,
        activeRequest
      ),
    });
  };

  componentDidMount() {
    this.setIds(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) this.setIds(nextProps);
  }

  updateSolverSummary = (id, value) => {
    const {
      isEditing,
      crewGroups,
      solverTasks,
      rules,
      recipes,
      updateCrewGroupRulesDetails,
      updateSolverSummary,
    } = this.props;

    this.setState({ isEditing: false }, () => {
      isEditing(this.state.isEditing);
    });

    // convert the id's of the selected control to name.
    switch (id) {
      case 'crewGroupName':
        value = crewGroups.find(crewGroup => crewGroup.id === value);
        break;
      case 'solverTaskName':
        value = solverTasks.find(solverTask => solverTask.id === value);
        break;
      case 'rulesetName':
        value = rules.find(rule => rule.id === value);
        break;
      case 'solverRecipeName': {
        const dataRecipes = [...recipes, { id: '-1', name: '-1' }];
        value = value.map(val =>
          val !== null && val !== '-1' && val !== undefined && val !== ''
            ? dataRecipes.find(r => r.id === val).name
            : '-1'
        );
        break;
      }
      default:
    }

    value = ['description', 'solverScopeId', 'solverRecipeName'].includes(id)
      ? value
      : value
      ? value.name
      : '';

    if (id === 'crewGroupName') updateCrewGroupRulesDetails(value);
    else updateSolverSummary(id, value);
  };

  setRuleBasedOnCrewGroup = crewGroupId => {
    const filteredCrewGroup = this.props.crewGroups.find(
      crewGroup => crewGroup.id === parseInt(crewGroupId, 10)
    );

    if (filteredCrewGroup) {
      this.setState({
        rule: filteredCrewGroup.ruleset,
      });
    }
  };

  handleChangeDescription = event => {
    const isEditing = this.state.isEditing;
    const nextState = {
      activeRequest: {
        ...this.state.activeRequest,
        description: event.target.value,
      },
      isEditing: true,
    };

    this.setState(nextState, () => {
      if (!isEditing) {
        this.props.isEditing(this.state.isEditing);
      }
    });
  };

  render() {
    const {
      activeRequest,
      rule,
      solverTask,
      crewGroup,
      recipeNames,
      crewGroupMissing,
      ruleSetMissing,
    } = this.state;

    const {
      t,
      readOnly,
      solverTasks,
      crewGroups,
      rules,
      recipes,
      scopes,
      showErrors,
      triggerShowErrors,
      solverScopes,
      isAPICallActive,
      isLaunched,
    } = this.props;
    const updateCrewGroups = Array.from(crewGroups);
    const updatedRuleSets = Array.from(rules);
    const label = 'SOLVER.tabSummary';

    const isDisabled =
      [
        'Done-success',
        'Creating',
        'Waiting',
        'Sending',
        'Running',
        'Fetching',
        'Stopping',
        'Launching',
      ].includes(activeRequest.status.status) || readOnly;

    if (
      isDisabled ||
      ruleSetMissing ||
      crewGroupMissing ||
      recipeNames.includes('-1')
    ) {
      if (ruleSetMissing) {
        updatedRuleSets.push({ id: rule, name: rule });
      }
      if (crewGroupMissing) {
        updateCrewGroups.push({ id: crewGroup, name: crewGroup });
      }
      if (!showErrors) triggerShowErrors(true);
    } else {
      if (showErrors) triggerShowErrors(false);
    }

    const recipesSuggestions = recipes.map(({ id, name }) => ({
      value: id,
      label: name,
    }));

    return (
      <Grid container spacing={5} style={{ lineHeight: '0' }}>
        <Grid item xs={12} sm={6}>
          <AccessEnabler
            scopes={solverScopes.solverManage}
            disableComponent
            render={props => (
              <Grid container spacing={3}>
                <Grid item xs={10} sm={10}>
                  <InputSelector
                    label={t(`${label}.solverTask`)}
                    name="solverTaskName"
                    items={solverTasks}
                    selected={solverTask}
                    handleChange={event => {
                      this.updateSolverSummary('solverTaskName', event);
                    }}
                    disabled={isDisabled || props.disableComponent}
                    required
                  />
                </Grid>
                <Grid item xs={10} sm={10}>
                  <InputSelector
                    label={t(`${label}.crewGroup`)}
                    name="crewGroupName"
                    items={updateCrewGroups}
                    selected={crewGroup}
                    handleChange={event => {
                      this.updateSolverSummary('crewGroupName', event);
                      this.setRuleBasedOnCrewGroup(event);
                    }}
                    disabled={isDisabled || props.disableComponent}
                    required
                  />
                </Grid>
                {crewGroupMissing && (
                  <Grid item xs={2} sm={2}>
                    <SierraTooltip
                      position="top"
                      html={
                        <p style={{ width: '140px', fontSize: '12px' }}>
                          {t('SOLVER.tabSummary.crewGroupMissing')}
                        </p>
                      }
                      distance={20}
                      size="small"
                    >
                      <WarningIcon
                        style={{ fill: '#e5bc02', marginTop: '26px' }}
                      />
                    </SierraTooltip>
                  </Grid>
                )}
                <Grid item xs={10} sm={10}>
                  <InputSelector
                    label={t(`${label}.ruleSet`)}
                    name="rulesetName"
                    items={updatedRuleSets}
                    selected={rule}
                    handleChange={event =>
                      this.updateSolverSummary('rulesetName', event)
                    }
                    disabled={isDisabled || props.disableComponent}
                    required
                  />
                </Grid>
                {ruleSetMissing && (
                  <Grid item xs={2} sm={2}>
                    <SierraTooltip
                      position="top"
                      html={
                        <p style={{ width: '140px', fontSize: '12px' }}>
                          {t('SOLVER.tabSummary.ruleSetMissing')}
                        </p>
                      }
                      distance={20}
                    >
                      <WarningIcon
                        style={{ fill: '#e5bc02', marginTop: '26px' }}
                      />
                    </SierraTooltip>
                  </Grid>
                )}
                <Grid item xs={12} sm={12} style={{ paddingTop: '20px' }}>
                  <Grid
                    container
                    direction="column"
                    spaciing={3}
                    className="rcp-container"
                  >
                    <Grid item>
                      <span
                        className="recipe-label"
                        style={{
                          opacity:
                            isDisabled || props.disableComponent ? 0.4 : '',
                        }}
                      >
                        {t('SOLVER.form.recipes.name')}
                      </span>
                    </Grid>
                    <Grid item>
                      <Typography
                        className="recipe-desc"
                        style={{
                          opacity:
                            isDisabled || props.disableComponent ? 0.4 : '',
                        }}
                      >
                        {t('SOLVER.form.recipes.description')}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* <InputSelector
                    label={t(`${label}.recipe`)}
                    name="solverRecipeName"
                    items={recipes}
                    selected={recipe}
                    handleChange={event =>
                      this.updateSolverSummary('solverRecipeName', event)
                    }
                    disabled={isDisabled || props.disableComponent}
                    required
                  /> */}
                  <Grid item xs={10} sm={10} style={{ paddingTop: '25px' }}>
                    <RecipeContainer
                      t={t}
                      fieldName={t('SOLVER.form.recipes.summaryFieldName')}
                      activeRequestId={activeRequest.id}
                      selectedRecipes={recipeNames}
                      handleAutocompleteChange={this.updateSolverSummary}
                      recipesSuggestions={recipesSuggestions}
                      isDisabled={isDisabled || props.disableComponent}
                      isAPICallActive={isAPICallActive}
                      isLaunched={isLaunched}
                      maxLength={36}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AccessEnabler
            scopes={solverScopes.solverManage}
            disableComponent
            render={props => (
              <Grid container spacing={3}>
                <SolverFormContent>
                  <Grid item xs={12} sm={12}>
                    <FormControl required>
                      <TextArea
                        inputProps={{
                          name: 'description',
                          maxLength: 1000,
                        }}
                        id="description"
                        label={t(`${label}.description`)}
                        style={{
                          display: 'block',
                          marginLeft: '12px',
                          marginTop: '20px',
                        }}
                        customheight="172"
                        fullWidth
                        multiline
                        onChange={this.handleChangeDescription}
                        value={activeRequest.description || ''}
                        disabled={isDisabled || props.disableComponent}
                        size="medium"
                        onBlur={event =>
                          this.updateSolverSummary(
                            'description',
                            event.target.value
                          )
                        }
                      />
                    </FormControl>
                  </Grid>
                </SolverFormContent>
                <Grid item xs={12} sm={12}>
                  <Grid container spacing={0}>
                    <Grid item xs={10} sm={10}>
                      <InputSelector
                        label={t(`${label}.scope`)}
                        name="solverScopeId"
                        items={scopes}
                        selected={activeRequest.solverScopeId}
                        handleChange={event =>
                          this.updateSolverSummary('solverScopeId', event)
                        }
                        disabled={isDisabled || props.disableComponent}
                        required
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          />
        </Grid>
      </Grid>
    );
  }
}

const mapStatetoProps = state => {
  const { newJobStatus: solver } = state;
  return {
    showErrors: solver.showErrors,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    triggerShowErrors: bool => dispatch(triggerShowErrors(bool)),
  };
};

SummaryForm.propTypes = {
  activeRequest: PropTypes.shape({
    crewGroupName: PropTypes.string,
    elapsedTime: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isEndorsed: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.shape({
      activeBtns: PropTypes.arrayOf(PropTypes.string).isRequired,
      block: PropTypes.bool.isRequired,
      dateCurrent: PropTypes.bool.isRequired,
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      routes: PropTypes.arrayOf(PropTypes.number).isRequired,
      showTimer: PropTypes.bool.isRequired,
      status: PropTypes.string.isRequired,
      statusId: PropTypes.number.isRequired,
      textBar: PropTypes.string.isRequired,
      timerType: PropTypes.string.isRequired,
    }).isRequired,
    lastModified: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  solverTasks: PropTypes.arrayOf(PropTypes.shape({})),
  crewGroups: PropTypes.arrayOf(PropTypes.shape({})),
  rules: PropTypes.arrayOf(PropTypes.shape({})),
  recipes: PropTypes.arrayOf(PropTypes.shape({})),
  scopes: PropTypes.arrayOf(PropTypes.shape({})),
  isEditing: PropTypes.func.isRequired,
  updateCrewGroupRulesDetails: PropTypes.func.isRequired,
  updateSolverSummary: PropTypes.func.isRequired,
  showErrors: PropTypes.bool,
  triggerShowErrors: PropTypes.func.isRequired,
  solverScopes: PropTypes.shape([]).isRequired,
};

SummaryForm.defaultProps = {
  solverTasks: [],
  crewGroups: [],
  rules: [],
  recipes: [],
  scopes: [],
  showErrors: false,
};

export default connect(mapStatetoProps, mapDispatchToProps)(SummaryForm);
