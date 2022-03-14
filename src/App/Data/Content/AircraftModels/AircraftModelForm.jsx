import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MUIFormControl from '@material-ui/core/FormControl';

import ErrorMessage from '../../../../components/FormValidation/ErrorMessage';
import Form from '../../../../components/FormDrawer/Form';
import FormHeader from '../../../../components/FormDrawer/FormHeader';
import FormBody from '../../../../components/FormDrawer/FormBody';
import { getInlineErrorMessage } from '../../../../_shared/helpers';
import {
  perfectScrollConfig,
  getFormOkButton,
  getFormHeading,
  getFormCancelButton,
} from '../../../../utils/common';

import {
  MODEL_NAME_MAX_LENGTH,
  MODEL_CODE_MAX_LENGTH,
  MODEL_NAME_REGEX,
  MODEL_CODE_REGEX,
} from './constants';

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

class AircraftModelForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modelCode: '',
      isFormDirty: false,
      modelName: '',
      errors: {
        modelCode: false,
        modelName: false,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isOpen) {
      this.setState({
        modelName: nextProps.model ? nextProps.model.name : '',
        modelCode: nextProps.model ? nextProps.model.code : '',
        isFormDirty: false,
        errors: {
          modelCode: false,
          modelName: false,
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

  isValidField = value => {
    return value !== '' && value !== null;
  };

  getElementValue = elementId => {
    const nodeElement = document.getElementById(elementId);

    if (!nodeElement) return '';

    return nodeElement.value.trim();
  };

  checkIfFormisReady = () => {
    const modelName = this.getElementValue('modelName');
    const modelCode = this.getElementValue('modelCode');
    const { errors, isFormDirty } = this.state;
    const isError = errors.modelName || errors.modelCode;
    const isValidModelName = modelName === '' || this.isValidField(modelName);
    const allFieldsWereFilled =
      this.isValidField(modelCode) && isValidModelName;

    if (allFieldsWereFilled && !isError) {
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

  validateErrors = (e, regexp: '') => {
    const errors = this.updateErrors(e, regexp);
    this.setState({ errors }, this.checkIfFormisReady);
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
    const { model, t, readOnly, enableReadOnly, ...rest } = this.props;
    const { errors, modelName, modelCode, inlineErrorMessage } = this.state;
    const readOnlyStatus = readOnly || enableReadOnly;
    const isDisabled = readOnlyStatus ? false : this.isReadyToSubmit();
    const addModels = 'DATA.aircraftModels.form';
    const sectionGeneral = 'DATA.aircraftModels.form.section.general';
    const errorMsg = 'ERRORS.AICRAFT_MODELS';

    let codeErrorMessage = t(`${errorMsg}.modelCode`);

    if (inlineErrorMessage) {
      codeErrorMessage = inlineErrorMessage;
    }

    return (
      <Form
        okButton={getFormOkButton(t, model)}
        cancelButton={getFormCancelButton(t, readOnlyStatus)}
        isDisabled={isDisabled}
        onChange={this.onFormChange}
        anchor={'right'}
        enableReadOnly={enableReadOnly}
        {...rest}
      >
        <FormHeader>
          <span>{getFormHeading(t, model, readOnlyStatus, addModels)}</span>
          <span>{modelName}</span>
        </FormHeader>
        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              <h2>{t(`${sectionGeneral}.title`)}</h2>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.modelCode}>
                    <Input
                      inputProps={{
                        name: 'modelCode',
                        maxLength: MODEL_CODE_MAX_LENGTH,
                      }}
                      className={errors.modelCode ? 'error' : ''}
                      id="modelCode"
                      label={t(`${sectionGeneral}.modelCode`)}
                      placeholder={t(`${sectionGeneral}.modelCode`)}
                      color="secondary"
                      onChange={e => this.handleChange(e, MODEL_CODE_REGEX)}
                      value={modelCode}
                      error={errors.modelCode}
                      required
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.modelCode}
                      message={codeErrorMessage}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl error={errors.modelName}>
                    <Input
                      inputProps={{
                        name: 'modelName',
                        maxLength: MODEL_NAME_MAX_LENGTH,
                      }}
                      id="modelName"
                      label={t(`${sectionGeneral}.modelName`)}
                      color="secondary"
                      className={errors.modelName ? 'error' : ''}
                      error={errors.modelName}
                      value={modelName}
                      onChange={e => this.handleChange(e, MODEL_NAME_REGEX)}
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.modelName}
                      message={t(`${errorMsg}.modelName`)}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          </PerfectScrollbar>
        </FormBody>
      </Form>
    );
  }
}

AircraftModelForm.propTypes = {
  t: PropTypes.func.isRequired,
  model: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    code: PropTypes.string,
  }),
  formId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  inlineError: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
};

AircraftModelForm.defaultProps = {
  model: {},
  inlineError: null,
};

export default AircraftModelForm;
