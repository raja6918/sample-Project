import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MUIFormControl from '@material-ui/core/FormControl';

import InputSelector from '../../../../components/InputSelector';
import ErrorMessage from '../../../../components/FormValidation/ErrorMessage';
import Form from '../../../../components/FormDrawer/Form';
import FormHeader from '../../../../components/FormDrawer/FormHeader';
import FormBody from '../../../../components/FormDrawer/FormBody';
import StandardCrewComplement from '../../../../components/StandardCrewComplement';

import { prepareRestFacilities, prepareModels } from './Constants';
import { getInlineErrorMessage } from '../../../../_shared/helpers';
import {
  perfectScrollConfig,
  getFormOkButton,
  getFormHeading,
  getFormCancelButton,
} from '../../../../utils/common';

const DEFAULT_REST_FACILITY_CODE = 'NONE';

const Input = styled(TextField)`
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
`;
const FormControl = styled(MUIFormControl)`
  width: 100%;
`;

class AircraftTypesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aircraftName: '',
      aircraftType: '',
      aircraftModel: '',
      restFacility: DEFAULT_REST_FACILITY_CODE,
      crewComposition: null,
      errors: {
        aircraftName: false,
        aircraftType: false,
      },
      isFormDirty: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isOpen) {
      this.setState({
        aircraftName: nextProps.aircraft ? nextProps.aircraft.name : '',
        aircraftType: nextProps.aircraft ? nextProps.aircraft.code : '',
        aircraftModel: nextProps.aircraft ? nextProps.aircraft.modelCode : '',
        crewComposition: nextProps.aircraft
          ? nextProps.aircraft.crewComposition
          : null,
        restFacility: nextProps.aircraft
          ? nextProps.aircraft.restFacilityCode
          : DEFAULT_REST_FACILITY_CODE,
        isFormDirty: false,
        errors: {
          aircraftName: false,
          aircraftType: false,
        },
      });
    }

    if (nextProps.inlineError) {
      this.setState(nextProps.inlineError, this.checkIfFormisReady);
    }
  }

  isReadyToSubmit = () => {
    return !this.state.isFormDirty;
  };

  checkIfFormisReady = () => {
    const node_aircraftType = document.getElementById('aircraftType');
    const aircraftType = node_aircraftType
      ? node_aircraftType.value.trim()
      : '';
    const { errors, aircraftName, aircraftModel, isFormDirty } = this.state;
    const isError = errors.aircraftName || errors.aircraftType;

    if (
      aircraftType !== '' &&
      aircraftName !== '' &&
      aircraftModel !== null &&
      aircraftModel !== '' &&
      !isError
    ) {
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

  onFormChange = () => {
    this.checkIfFormisReady();
  };

  evaluateRegex = (regex, term) => {
    const reg = new RegExp(regex);
    const isValidRegex = reg.test(term);
    return isValidRegex;
  };

  updateErrors = (e, regexp: '') => {
    const event = e.target || e.srcElement;
    const key = event.name;
    const value = event.value;
    const isError = value === '' ? false : !this.evaluateRegex(regexp, value);

    return {
      ...this.state.errors,
      [key]: isError,
    };
  };

  handleCrewComplements = crewComposition => {
    this.setState(
      { crewComposition },
      this.props.handleCrewComplements(crewComposition)
    );
    if (crewComposition !== this.state.crewComposition) {
      this.onFormChange();
    }
  };

  onSelectChange = (target, value) => {
    this.setState(
      {
        [target]: value,
      },
      this.onFormChange
    );
  };

  handleChange = (e, regexp: '') => {
    const { inlineError } = this.props;
    const errors = this.updateErrors(e, regexp);
    const inlineErrorMessage = getInlineErrorMessage(e, inlineError);

    this.setState(
      {
        errors,
        [e.target.name]: e.target.value,
        inlineErrorMessage,
      },
      this.checkIfFormisReady
    );
  };

  render() {
    const {
      aircraft,
      openItemId,
      formId,
      models,
      restFacilities,
      t,
      readOnly,
      enableReadOnly,
      ...rest
    } = this.props;
    const {
      errors,
      aircraftType,
      aircraftName,
      aircraftModel,
      restFacility,
      crewComposition,
      inlineErrorMessage,
    } = this.state;
    const readOnlyStatus = readOnly || enableReadOnly;
    const isDisabled = readOnlyStatus ? false : this.isReadyToSubmit();
    const aircraftOp = 'DATA.aircraft.form';
    const sectionGeneral = 'DATA.aircraft.form.section.general';
    const sectionCrewComplement = 'DATA.aircraft.form.section.crewComplement';
    const errorMsg = 'ERRORS.AIRCRAFT';

    let codeErrorMessage = t(`${errorMsg}.aircraftType`);

    if (inlineErrorMessage) {
      codeErrorMessage = inlineErrorMessage;
    }

    return (
      <Form
        okButton={getFormOkButton(t, aircraft)}
        cancelButton={getFormCancelButton(t, readOnlyStatus)}
        isDisabled={isDisabled}
        onChange={this.onFormChange}
        anchor={'right'}
        enableReadOnly={enableReadOnly}
        {...rest}
      >
        <FormHeader>
          <span>{getFormHeading(t, aircraft, readOnlyStatus, aircraftOp)}</span>
          <span>{aircraftName}</span>
        </FormHeader>
        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              <h2>{t(`${sectionGeneral}.title`)}</h2>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.aircraftType}>
                    <Input
                      inputProps={{
                        name: 'aircraftType',
                        maxLength: 4,
                      }}
                      className={errors.aircraftType ? 'error' : ''}
                      id="aircraftType"
                      label={t(`${sectionGeneral}.aircraftType`)}
                      color="secondary"
                      onChange={e => this.handleChange(e, '^[a-zA-Z0-9]+$')}
                      value={aircraftType}
                      error={errors.aircraftType}
                      required
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.aircraftType}
                      message={codeErrorMessage}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <InputSelector
                    name="aircraftModel"
                    label={t(`${sectionGeneral}.aircraftModel`)}
                    required={true}
                    items={prepareModels(models)}
                    selected={aircraftModel}
                    handleChange={value =>
                      this.onSelectChange('aircraftModel', value)
                    }
                    disabled={readOnlyStatus}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl error={errors.aircraftName}>
                    <Input
                      inputProps={{
                        name: 'aircraftName',
                        maxLength: 50,
                      }}
                      id="aircraftName"
                      label={t(`${sectionGeneral}.aircraftName`)}
                      color="secondary"
                      className={errors.aircraftName ? 'error' : ''}
                      value={aircraftName}
                      required
                      error={errors.aircraftName}
                      onChange={e => this.handleChange(e, '^[a-zA-Z0-9].*')}
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.aircraftName}
                      message={t(`${errorMsg}.aircraftName`)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <InputSelector
                    name="restFacility"
                    label={t(`${sectionGeneral}.restFacility`)}
                    required={true}
                    items={prepareRestFacilities(restFacilities)}
                    selected={restFacility}
                    handleChange={value =>
                      this.onSelectChange('restFacility', value)
                    }
                    disabled={readOnlyStatus}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <h2>{t(`${sectionCrewComplement}.title`)}</h2>
                  <StandardCrewComplement
                    id="crewComposition"
                    t={t}
                    onChange={this.handleCrewComplements}
                    defaultValues={crewComposition}
                    openItemId={openItemId}
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

AircraftTypesForm.propTypes = {
  t: PropTypes.func.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  aircraft: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    modelCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    restFacilityCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    code: PropTypes.string,
    crewComposition: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
  }),
  formId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleCrewComplements: PropTypes.func.isRequired,
  models: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  restFacilities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  inlineError: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  enableReadOnly: PropTypes.bool,
};

AircraftTypesForm.defaultProps = {
  aircraft: {},
  inlineError: null,
  enableReadOnly: false,
};

export default AircraftTypesForm;
