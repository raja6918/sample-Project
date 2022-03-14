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
  getFormHeading,
  getFormOkButton,
  getFormCancelButton,
} from '../../../../utils/common';

import {
  REGION_NAME_MAX_LENGTH,
  REGION_CODE_MAX_LENGTH,
  REGION_NAME_REGEX,
  REGION_CODE_REGEX,
} from './constants.jsx';

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

class RegionsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      regionCode: '',
      isFormDirty: false,
      regionName: '',
      errors: {
        regionCode: false,
        regionName: false,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isOpen) {
      this.setState({
        regionName: nextProps.region ? nextProps.region.name : '',
        regionCode: nextProps.region ? nextProps.region.code : '',
        isFormDirty: false,
        errors: {
          regionCode: false,
          regionName: false,
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

  checkIfFormisReady = () => {
    const regionCodeElement = document.getElementById('regionCode');
    const regionNameElement = document.getElementById('regionName');
    const regionCode = regionCodeElement ? regionCodeElement.value.trim() : '';
    const regionName = regionNameElement ? regionNameElement.value.trim() : '';
    const { errors, isFormDirty } = this.state;
    const isError = errors.regionName || errors.regionCode;
    const allFieldsWereFilled =
      this.isValidField(regionCode) && this.isValidField(regionName);

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
    const { region, t, readOnly, enableReadOnly, ...rest } = this.props;
    const { errors, regionName, regionCode, inlineErrorMessage } = this.state;
    const readOnlyStatus = readOnly || enableReadOnly;
    const isDisabled = readOnlyStatus ? false : this.isReadyToSubmit();
    const addRegions = 'DATA.regions.form';
    const sectionGeneral = 'DATA.regions.form.section.general';
    const errorMsg = 'ERRORS.REGIONS';

    let codeErrorMessage = t(`${errorMsg}.regionCode`);

    if (inlineErrorMessage) {
      codeErrorMessage = inlineErrorMessage;
    }

    return (
      <Form
        okButton={getFormOkButton(t, region)}
        cancelButton={getFormCancelButton(t, readOnlyStatus)}
        isDisabled={isDisabled}
        onChange={this.onFormChange}
        anchor={'right'}
        enableReadOnly={enableReadOnly}
        {...rest}
      >
        <FormHeader>
          <span>{getFormHeading(t, region, readOnlyStatus, addRegions)}</span>
          <span>{regionName}</span>
        </FormHeader>
        <FormBody>
          <PerfectScrollbar option={perfectScrollConfig}>
            <div>
              <h2>{t(`${sectionGeneral}.title`)}</h2>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <FormControl error={errors.regionCode}>
                    <Input
                      inputProps={{
                        name: 'regionCode',
                        maxLength: REGION_CODE_MAX_LENGTH,
                      }}
                      className={errors.regionCode ? 'error' : ''}
                      id="regionCode"
                      label={t(`${sectionGeneral}.regionCode`)}
                      placeholder={t(`${sectionGeneral}.regionCodePlaceholder`)}
                      color="secondary"
                      onChange={e => this.handleChange(e, REGION_CODE_REGEX)}
                      value={regionCode}
                      error={errors.regionCode}
                      required
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.regionCode}
                      message={codeErrorMessage}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl error={errors.regionName} required>
                    <Input
                      required
                      inputProps={{
                        name: 'regionName',
                        maxLength: REGION_NAME_MAX_LENGTH,
                      }}
                      id="regionName"
                      label={t(`${addRegions}.regionName`)}
                      color="secondary"
                      className={errors.regionName ? 'error' : ''}
                      error={errors.regionName}
                      value={regionName}
                      onChange={e => this.handleChange(e, REGION_NAME_REGEX)}
                      disabled={readOnlyStatus}
                    />
                    <ErrorMessage
                      isVisible={errors.regionName}
                      message={t(`${errorMsg}.regionName`)}
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

RegionsForm.propTypes = {
  t: PropTypes.func.isRequired,
  region: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    code: PropTypes.string,
  }),
  formId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  inlineError: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
};

RegionsForm.defaultProps = {
  region: {},
  inlineError: null,
};

export default RegionsForm;
