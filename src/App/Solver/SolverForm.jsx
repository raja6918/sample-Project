import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Grid from '@material-ui/core/Grid';

import Form from '../../components/FormDrawer/Form';
import FormHeader from '../../components/FormDrawer/FormHeader';
import FormBody from '../../components/FormDrawer/FormBody';
import ErrorMessage from '../../components/FormValidation/ErrorMessage';
import TextArea from '../../components/TextArea';
import { getMappedValues } from './utils';
import { perfectScrollConfig } from '../../utils/common';
import RecipeContainer from './RecipeDND/RecipeContainer';

import {
  GeneralTitle,
  FormControl,
  Input,
  SpecificationTitle,
  SolverFormHeader,
} from './FormComponents';

import { AutoCompleteForm } from './../../components/FormComponents';

import {
  hasError,
  getCustomPredicate,
  wereAllFieldsFilled,
  getDefaultName,
  getDefaultEntity,
  getDefaultErrors,
  mapEntityToState,
  evaluateRegex,
} from './utils.js';

import {
  SOLVER_GENERAL,
  SOLVER_FORM,
  SOLVER_FIELDS,
  NAME_REGEX,
} from './Constants.js';

const SolverFormContent = styled.div`
  .mb-64 {
    margin-bottom: 64px;
  }
`;

class SolverForm extends Component {
  state = {
    ...getDefaultEntity(),
    isFormDirty: false,
    errors: getDefaultErrors(),
    apiCalled: false,
  };

  componentDidMount() {
    const { solverTasks } = this.props;
    const solverTask =
      solverTasks && solverTasks.length > 0 ? solverTasks[0].id : '';

    this.setState({
      solverTask,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { selectedItem, isOpen, solverTasks } = nextProps;
    if (!isOpen) {
      const entity = selectedItem
        ? mapEntityToState(selectedItem)
        : getDefaultEntity();

      const solverTaskValue =
        solverTasks && solverTasks.length > 0 ? solverTasks[0].id : '';

      this.setState({
        ...entity,
        isFormDirty: false,
        solverTask: solverTaskValue,
        errors: getDefaultErrors(),
        apiCalled: false,
      });
    }
  }

  handleChange = (e, shouldValidateForm = true) => {
    this.onChange(e.target.name, e.target.value, shouldValidateForm);
  };

  handleAutocompleteChange = fieldName => {
    return value => {
      if (value === null) value = '';
      this.onChange(fieldName, value);
    };
  };

  handleRecipeChange = (fieldName, arrayData) => {
    if (arrayData.length === 0 || arrayData === null) {
      arrayData = [];
    } else {
      arrayData = arrayData.filter(id => {
        if (id !== null) {
          return id.toString() !== '-1';
        }
        return '';
      });
    }
    this.onChange(fieldName, arrayData);
  };

  onChange = (fieldName, value, shouldValidForm = true) => {
    this.setState(
      {
        [fieldName]: value,
      },
      () => {
        if (shouldValidForm) this.checkFormIsReady();
      }
    );
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

  handleBlur = (e, regex: '') => {
    const event = e.target || e.srcElement;
    const isError =
      event.value === '' ? false : !evaluateRegex(regex, event.value);
    this.setState(
      {
        errors: {
          ...this.state.errors,
          [event.name]: isError,
        },
      },
      () => this.checkFormIsReady(this.state)
    );
  };

  checkFormIsReady = () => {
    const { isFormDirty } = this.state;
    const _hasError = hasError(this.state.errors);
    const allFieldsWereFilled = wereAllFieldsFilled(this.state);

    if (allFieldsWereFilled && !_hasError) {
      if (!isFormDirty) {
        this.setState({
          isFormDirty: true,
        });
      }
    } else {
      if (isFormDirty) {
        this.setState({
          isFormDirty: false,
        });
      }
    }
  };

  isReadyToSubmit = () => {
    return !this.state.isFormDirty;
  };

  handleSubmit = formRef => {
    const {
      selectedItem,
      handleOk,
      t,
      solverTasks,
      crewGroups,
      rules,
      recipes,
    } = this.props;
    if (!this.state.apiCalled) {
      let entity = pick(this.state, SOLVER_FIELDS);
      if (selectedItem) entity.id = selectedItem.id;
      entity.name = entity.name || getDefaultName(t, this.state);
      this.setState({ apiCalled: true }, () => {
        const filter = { match: 'id', for: 'name' };
        entity = {
          ...entity,
          ...getMappedValues(
            solverTasks,
            crewGroups,
            rules,
            recipes,
            entity,
            filter
          ),
        };
        handleOk(formRef, entity);
      });
    }
  };

  handleInputChange = e => {
    const errors = this.updateErrors(e);

    this.setState(
      {
        errors,
        [e.target.name]: e.target.value,
      },
      this.checkFormIsReady
    );
  };

  updateErrors = e => {
    const event = e.target || e.srcElement;
    const fieldName = event.name;
    const isValid = getCustomPredicate(fieldName);
    const isError = event.value !== '' && !isValid(event.value, this.state);

    return {
      ...this.state.errors,
      [fieldName]: isError,
    };
  };

  getGeneralSection = () => {
    const { t, solverTasks, crewGroups, rules, recipes } = this.props;
    const {
      errors,
      crewGroup,
      solverTask,
      rule,
      name,
      description,
      recipeNames,
    } = this.state;
    const sectionPath = SOLVER_GENERAL;
    const errorMsg = 'ERRORS.SOLVER';
    const solverTasksSuggestions = solverTasks.map(({ id, name }) => ({
      value: `${id}`,
      label: name,
    }));
    const crewGroupsSuggestions = crewGroups.map(({ id, name }) => ({
      value: `${id}`,
      label: name,
    }));

    const rulesSuggestions = rules.map(({ id, name }) => ({
      value: `${id}`,
      label: name,
    }));

    const recipesSuggestions = recipes.map(({ id, name }) => ({
      value: `${id}`,
      label: name,
    }));

    return (
      <div>
        <GeneralTitle>
          <h2>{t(`${sectionPath}.title`)}</h2>
        </GeneralTitle>
        <SolverFormContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FormControl error={errors.name}>
                <Input
                  inputProps={{
                    name: 'name',
                    maxLength: 50,
                  }}
                  className={errors.name ? 'error' : ''}
                  id="name"
                  label={t('SOLVER.form.requestName')}
                  color="secondary"
                  defaultValue={name}
                  error={errors.name}
                  required
                  onChange={e => {
                    this.handleChange(e);
                    this.handleBlur(e, NAME_REGEX);
                  }}
                />
                <ErrorMessage
                  isVisible={errors.name}
                  message={t(`${errorMsg}.name`)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl required>
                <TextArea
                  inputProps={{
                    name: 'description',
                    maxLength: 1000,
                  }}
                  id="description"
                  label={t('SOLVER.form.description')}
                  style={{ display: 'block' }}
                  fullWidth
                  multiline
                  onChange={this.handleInputChange}
                  defaultValue={description}
                  value={description}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <SpecificationTitle>
              <h2>{t('SOLVER.specifications')}</h2>
            </SpecificationTitle>
            <Grid item xs={12} sm={12}>
              <AutoCompleteForm
                required
                id="solverTask"
                label={t('SOLVER.form.solverTask')}
                suggestions={solverTasksSuggestions}
                onChange={this.handleAutocompleteChange('solverTask')}
                t={t}
                error={errors.solverTask}
                value={solverTask}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <AutoCompleteForm
                required
                id="crewGroup"
                label={t('SOLVER.form.crewGroup')}
                suggestions={crewGroupsSuggestions}
                onChange={value => {
                  this.handleAutocompleteChange('crewGroup')(value);
                  this.setRuleBasedOnCrewGroup(value);
                }}
                t={t}
                error={errors.crewGroup}
                value={crewGroup}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <AutoCompleteForm
                required
                id="rule"
                label={t('SOLVER.form.ruleSet')}
                suggestions={rulesSuggestions}
                onChange={this.handleAutocompleteChange('rule')}
                t={t}
                error={errors.rule}
                value={rule}
              />
            </Grid>
            {/* <Grid className="mb-64" item xs={12} sm={12}>
              <AutoCompleteForm
                required
                id="recipe"
                label={t('SOLVER.form.recipe')}
                suggestions={recipesSuggestions}
                onChange={this.handleAutocompleteChange('recipe')}
                t={t}
                error={errors.recipe}
                value={recipe}
              />
            </Grid> */}
            <Grid item xs={12} sm={12} style={{ paddingTop: '20px' }}>
              <Grid container direction="column">
                <Grid item>
                  <span
                    className="label"
                    style={{
                      fontWeight: 500,
                      fontSize: '14px',
                      color: '#000000',
                    }}
                  >
                    {t('SOLVER.form.recipes.name')}
                  </span>
                </Grid>
                <Grid item>
                  <span
                    className="label"
                    style={{
                      fontSize: '12px',
                      fontWeight: 'normal',
                      color: '#000000',
                    }}
                  >
                    {t('SOLVER.form.recipes.description')}
                  </span>
                </Grid>
              </Grid>
              <Grid item>
                <RecipeContainer
                  t={t}
                  fieldName={t('SOLVER.form.recipes.fieldName')}
                  handleAutocompleteChange={this.handleRecipeChange}
                  recipesSuggestions={recipesSuggestions}
                  isDisabled={false}
                  maxLength={35}
                />
              </Grid>
            </Grid>
          </Grid>
        </SolverFormContent>
      </div>
    );
  };

  render() {
    const { selectedItem, t, ...rest } = this.props;

    const isDisabled = this.isReadyToSubmit();
    // const name = this.state.name || getDefaultName(t, this.state);
    const name = this.state.name;

    const addBtn = t('GLOBAL.form.add');
    const saveBtn = t('GLOBAL.form.save');
    return (
      <Form
        okButton={selectedItem ? saveBtn : addBtn}
        isDisabled={isDisabled}
        onChange={() => {}}
        anchor={'right'}
        {...rest}
        handleOk={this.handleSubmit}
      >
        <FormHeader>
          <SolverFormHeader>
            {!selectedItem
              ? t('SOLVER.addSolverRequest')
              : t(`${SOLVER_FORM}.edit`)}
          </SolverFormHeader>
          <SolverFormHeader>{name}</SolverFormHeader>
        </FormHeader>
        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>{this.getGeneralSection()}</div>
          </PerfectScrollbar>
        </FormBody>
      </Form>
    );
  }
}

SolverForm.propTypes = {
  t: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  crewGroups: PropTypes.shape({}).isRequired,
  solverTasks: PropTypes.shape({}).isRequired,
  rules: PropTypes.shape({}).isRequired,
  recipes: PropTypes.shape({}).isRequired,
};

SolverForm.defaultProps = {
  selectedItem: null,
};

export default SolverForm;
