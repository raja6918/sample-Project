import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import Dialog from '../../components/Dialog/Form';
import Icon from '../../components/Icon';

import { addDays, prettyFormat } from '../../utils/dates';
import { MAX_SCENARIO_DURATION } from './constants';
import ErrorMessage from '../../components/FormValidation/ErrorMessage';
import { SCENARIO_NAME_REGEX } from './constants';
import { evaluateRegex } from '../../utils/common';

const AddDialog = styled(Dialog)`
  & form > div:first-child {
    padding-bottom: 35px;
  }
  & > div:last-child {
    max-width: 560px;
  }
  & form > div p {
    font-size: 13px;
    margin: 0 0 10px 0;
    color: rgba(0, 0, 0, 0.87);
  }

  & form > div p span {
    font-weight: bold;
    color: rgba(0, 0, 0, 0.87);
  }
  & form > div div:firts-child {
    background-color: red;
  }
  & form div:fisrt-child {
    background-color: red;
  }
`;

const Input = styled(TextField)`
  margin: 0;
  white-space: nowrap;
  width: 100%;

  .helperText {
    position: absolute;
    top: 54px;
  }
  .MuiFormLabel-root.Mui-error {
    color: #d50000 !important;
  }

  &.error > label {
    color: #d10000 !important;
  }
`;

const DatesContainer = styled(Grid)`
  margin-top: 25px;
  & > div:first-child {
    width: 86px;
    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      /* applies for IE10+ only */
      overflow: hidden;
    }
  }
  & > div:first-child + button {
    width: 32px;
    height: 32px;
    vertical-align: bottom;
  }

  & > div + button + div {
    width: 75px;
    margin: 0 20px;

    & input {
      width: 100%;
    }
  }
  & > div + button + div + span {
    display: inline-block;
    vertical-align: bottom;
  }
`;
class ScenarioForm extends Component {
  state = {
    startDate: new Date(),
    scenarioName: '',
    isPickerOpen: false,
    duration: 30,
    errors: {
      scenarioName: false,
    },
  };

  validateScnNameAndSetErrors = () => {
    const { scenarioName, errors } = this.state;
    if (scenarioName !== '') {
      const isValidRegex = evaluateRegex(SCENARIO_NAME_REGEX, scenarioName);
      this.setState({ errors: { ...errors, scenarioName: !isValidRegex } });
    } else {
      this.setState({ errors: { ...errors, scenarioName: false } });
    }
  };

  scenarioNameChange = e => {
    this.setState(
      {
        scenarioName: e.target.value,
      },
      this.validateScnNameAndSetErrors
    );
  };

  handleChange = date => {
    this.setState({
      startDate: date,
      rangeDate: addDays(date, this.state.duration),
    });
  };

  handleOnFormEnter = () => {
    const form = document.getElementById(this.props.formId);
    if (form) {
      form.addEventListener('input', this.changeOnForm);
    }
  };

  handleFormClose = () => {
    const form = document.getElementById(this.props.formId);
    if (form) {
      form.removeEventListener('input', this.changeOnForm);
    }
  };

  openDatePicker = e => {
    e.preventDefault();
    this.tooglePicker(true);
  };

  tooglePicker = state => {
    this.setState({ isPickerOpen: state });
  };

  handleChangeRangeDate = e => {
    const isNum = /^\d+$/.test(e.target.value);

    if ((isNum || e.target.value === '') && e.target.value.charAt(0) !== '0') {
      this.setState({
        duration: e.target.value,
      });
    }
  };

  componentWillReceiveProps() {
    if (!this.props.open) {
      this.setState({
        startDate: new Date(),
        duration: 30,
      });
    }
  }

  isValidScenario = () =>
    !this.state.errors.scenarioName && this.state.scenarioName.trim() !== '';

  isValidDuration = () => this.state.duration <= MAX_SCENARIO_DURATION;

  isSubmmitDisable = () =>
    !(
      this.isValidDuration() &&
      this.isValidScenario() &&
      this.state.duration !== ''
    );

  getDurationErrorMessage = () =>
    this.isValidDuration() ? '' : this.props.t('ERRORS.SCENARIOS.duration');

  render() {
    const { startDate, duration, isPickerOpen, errors } = this.state;
    const { t, template, formId, ...rest } = this.props;

    return (
      <AddDialog
        title={t('SCENARIOS.form.title')}
        okButton={'Ok'}
        formId={formId}
        fullWidth={true}
        onEntered={this.handleOnFormEnter}
        onClose={this.handleFormClose}
        {...rest}
        disableSave={this.isSubmmitDisable()}
      >
        <p>
          {t('SCENARIOS.form.template')} <span>{template}</span>
        </p>
        <Grid container>
          <Grid item xs={12}>
            <Input
              inputProps={{
                name: 'scenarioName',
                maxLength: 50,
                required: true,
              }}
              id="scenarioName"
              label={t('SCENARIOS.form.name')}
              margin="normal"
              required
              onChange={this.scenarioNameChange}
              className={errors.scenarioName ? 'error' : ''}
            />
            <ErrorMessage
              error={errors.scenarioName}
              isVisible={errors.scenarioName}
              message={t(`ERRORS.SCENARIOS.name`)}
              style={{ marginBottom: 0 }}
            />
          </Grid>
          <DatesContainer item xs={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                id="startDate"
                name="startDate"
                label={t('SCENARIOS.form.startDate')}
                format="yyyy/MM/dd"
                value={startDate}
                open={isPickerOpen}
                onOpen={() => {
                  this.tooglePicker(true);
                }}
                onClose={() => {
                  this.tooglePicker(false);
                }}
                onChange={this.handleChange}
                animateYearScrolling={false}
                required
              />
            </MuiPickersUtilsProvider>
            <IconButton
              onClick={this.openDatePicker}
              style={{ padding: '0px' }}
            >
              <Icon margin={'0 0 0 0'} iconcolor="#0A75C2">
                date_range
              </Icon>
            </IconButton>
            {/* <DatePicker
                id="startDate"
                name="startDate"
                format="YYYY/MM/DD"
                value={startDate}
                onChange={this.handleChange}
                animateYearScrolling={false}
                placeholder="YYYY/MM/DD"
                required
                label={t('SCENARIOS.form.startDate')}
                ref={node => {
                  this.picker = node;
                }}
              />
            </MuiPickersUtilsProvider>
            <IconButton onClick={this.openDatePicker}>
              <Icon margin="0" iconcolor="#0A75C2">
                date_range
              </Icon>
            </IconButton> */}

            <Input
              inputProps={{
                name: 'scenarioDuration',
                required: true,
                type: 'text',
                pattern: '^[0-9]+',
                title: t('SCENARIOS.form.durationTitleMatch'),
                maxLength: 3,
              }}
              label={t('SCENARIOS.form.duration')}
              id="scenarioDuration"
              margin="normal"
              required
              value={duration}
              onChange={this.handleChangeRangeDate}
              error={!this.isValidDuration()}
              helperText={this.getDurationErrorMessage()}
              FormHelperTextProps={{ classes: { root: 'helperText' } }}
            />
            <span>
              ({duration !== ''
                ? addDays(startDate, duration)
                : prettyFormat(startDate)})
            </span>
          </DatesContainer>
        </Grid>
      </AddDialog>
    );
  }
}

ScenarioForm.propTypes = {
  t: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  template: PropTypes.string,
  open: PropTypes.bool.isRequired,
};

ScenarioForm.defaultProps = {
  template: '',
};

export default ScenarioForm;
