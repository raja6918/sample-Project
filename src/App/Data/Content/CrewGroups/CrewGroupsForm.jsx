import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import pick from 'lodash/pick';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Form from '../../../../components/FormDrawer/Form';
import FormHeader from '../../../../components/FormDrawer/FormHeader';
import FormBody from '../../../../components/FormDrawer/FormBody';

import Grid from '@material-ui/core/Grid';
import MUIFormControl from '@material-ui/core/FormControl';

import SierraSelect from './../../../../_shared/components/SierraSelect';
import { getInlineErrorMessage } from '../../../../_shared/helpers';

import { InputForm, ComboBox } from './FormComponents';
import {
  perfectScrollConfig,
  getFormHeading,
  getFormOkButton,
  getFormCancelButton,
} from '../../../../utils/common';

import {
  getDefaultEntity,
  getDefaultErrors,
  hasError,
  wereAllFieldsFilled,
  getCustomPredicate,
  preparePositions,
  prepareAirlines,
  prepareAircraftTypes,
  prepareRuleSets,
  mapEntityToState,
} from './utils';

import {
  CREWGROUPS_GENERAL,
  CREWGROUPS_FORM,
  CREWGROUPS_ERRORS,
  CREW_GROUPS_FIELDS,
} from './constants';

const FormControl = styled(MUIFormControl)`
  width: 100%;
`;

class CrewGroupsForm extends React.Component {
  state = {
    ...getDefaultEntity(),
    errors: getDefaultErrors(),
    isFormDirty: false,
    isFormOpen: false,
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

  isReadyToSubmit = () => {
    return !this.state.isFormDirty;
  };

  onSierraSelectChange = (values, id) => {
    this.setState({ [id]: values }, this.checkFormIsReady);
  };

  handleChange = (e, shouldValidateForm = true) => {
    const { inlineError } = this.props;
    const inlineErrorMessage = getInlineErrorMessage(e, inlineError);
    this.onChange(
      e.target.name,
      e.target.value,
      shouldValidateForm,
      inlineErrorMessage
    );
  };

  onChange = (fieldName, value, shouldValidForm = true, inlineErrorMessage) => {
    this.setState(
      {
        [fieldName]: value,
        inlineErrorMessage,
      },
      () => {
        if (shouldValidForm) this.checkFormIsReady();
      }
    );
  };

  handleSubmit = formRef => {
    const entity = pick(this.state, CREW_GROUPS_FIELDS);
    if (this.props.selectedItem) entity.id = this.props.selectedItem.id;
    this.props.handleOk(formRef, entity);
  };

  componentWillReceiveProps(nextProps) {
    const { selectedItem, isOpen } = nextProps;
    if (!isOpen) {
      const entity = selectedItem
        ? mapEntityToState(selectedItem)
        : getDefaultEntity();

      this.setState({
        ...entity,
        isFormDirty: false,
        errors: getDefaultErrors(),
      });
    }
    if (nextProps.inlineError) {
      this.setState(nextProps.inlineError, this.checkFormIsReady);
    }
  }

  render() {
    const {
      t,
      positionsCategorized,
      airlines,
      aircraftTypes,
      ruleSets,
      selectedItem,
      readOnly,
      enableReadOnly,
      ...rest
    } = this.props;

    const {
      errors,
      name,
      positionCodes,
      airlineCodes,
      aircraftTypeCodes,
      ruleset,
      inlineErrorMessage,
    } = this.state;

    const sectionPath = CREWGROUPS_GENERAL;

    const [groups, positions] = preparePositions(positionsCategorized);
    const airlinesData = prepareAirlines(airlines);
    const aircraftTypesData = prepareAircraftTypes(aircraftTypes);
    const ruleSetsData = prepareRuleSets(ruleSets);
    let codeErrorMessage = t(`${CREWGROUPS_ERRORS}.name`);

    if (inlineErrorMessage) {
      codeErrorMessage = inlineErrorMessage;
    }

    const readOnlyStatus = readOnly || enableReadOnly;
    const isDisabled = readOnlyStatus ? false : this.isReadyToSubmit();

    return (
      <Form
        okButton={getFormOkButton(t, selectedItem)}
        cancelButton={getFormCancelButton(t, readOnlyStatus)}
        isDisabled={isDisabled}
        onChange={() => {}}
        anchor={'right'}
        {...rest}
        enableReadOnly={enableReadOnly}
        handleOk={this.handleSubmit}
      >
        <FormHeader>
          <span>
            {getFormHeading(t, selectedItem, readOnlyStatus, CREWGROUPS_FORM)}
          </span>
          <span>{name}</span>
        </FormHeader>
        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              <h2>{t(`${sectionPath}.title`)}</h2>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <InputForm
                    id="name"
                    label={t(`${sectionPath}.name`)}
                    className={errors.name ? 'error' : ''}
                    color="secondary"
                    error={errors.name}
                    defaultValue={name}
                    onChange={this.handleInputChange}
                    maxLength={50}
                    errorMessage={codeErrorMessage}
                    disabled={readOnlyStatus}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl error={false}>
                    <SierraSelect
                      id="positionCodes"
                      onChange={this.onSierraSelectChange}
                      groups={groups}
                      data={positions}
                      label={t(`${sectionPath}.positions`)}
                      showSelectAll={false}
                      value={positionCodes}
                      required
                      disabled={readOnlyStatus}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl error={false}>
                    <SierraSelect
                      data={airlinesData}
                      label={t(`${sectionPath}.airlines`)}
                      id="airlineCodes"
                      onChange={this.onSierraSelectChange}
                      value={airlineCodes}
                      required
                      disabled={readOnlyStatus}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl error={false}>
                    <SierraSelect
                      data={aircraftTypesData}
                      label={t(`${sectionPath}.aircraftTypes`)}
                      id="aircraftTypeCodes"
                      onChange={this.onSierraSelectChange}
                      value={aircraftTypeCodes}
                      required
                      disabled={readOnlyStatus}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <ComboBox
                    name={'ruleset'}
                    value={ruleset}
                    onChange={this.handleChange}
                    items={ruleSetsData}
                    label={t(`${sectionPath}.ruleset`)}
                    required
                    disabled={readOnlyStatus}
                  />
                </Grid>
              </Grid>
            </div>
          </PerfectScrollbar>
        </FormBody>
      </Form>
    );
  }
}

CrewGroupsForm.propTypes = {
  t: PropTypes.func.isRequired,
  positionsCategorized: PropTypes.arrayOf(PropTypes.shape({})),
  airlines: PropTypes.arrayOf(PropTypes.shape({})),
  aircraftTypes: PropTypes.arrayOf(PropTypes.shape({})),
  ruleSets: PropTypes.arrayOf(PropTypes.shape({})),
  handleOk: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  inlineError: PropTypes.shape(),
};

CrewGroupsForm.defaultProps = {
  selectedItem: null,
  positionsCategorized: [],
  airlines: [],
  aircraftTypes: [],
  ruleSets: [],
  inlineError: null,
};

export default CrewGroupsForm;
