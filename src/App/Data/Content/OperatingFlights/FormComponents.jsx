import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import FormControlMUI from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import AutoComplete from '../../../../components/Autocomplete/AutoComplete';

import DateFnsUtils from '@date-io/date-fns';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import ErrorMessage from '../../../../components/FormValidation/ErrorMessage';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

const FormControl = styled(FormControlMUI)`
  width: 100%;
`;

const Input = styled(TextField)`
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
  &.read-only-input > label {
    color: rgba(0, 0, 0, 0.38) !important;
  }
`;

export const CustomText = styled.p`
  font-size: 12px;
  color: #666666;
  text-align: left;
  margin: 0px;
`;

export const TimePickerComponent = styled(TimePicker)`
  .MuiInputBase-input,
  .MuiInputAdornment-root {
    cursor: pointer;
  }
`;

export const SingleItem = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;

export const InputForm = props => {
  const {
    required = false,
    id,
    error: showError,
    errorMessage = '',
    maxLength,
    ...otherInputProps
  } = props;

  const inputProps = {
    name: id,
  };

  if (maxLength) inputProps.maxLength = maxLength;

  return (
    <FormControl required={required} error={showError}>
      <Input
        inputProps={inputProps}
        id={id}
        error={showError}
        required={required}
        {...otherInputProps}
      />
      <ErrorMessage isVisible={showError} message={errorMessage} />
    </FormControl>
  );
};

export const TimePickers = ({
  beforeName,
  beforeLabel,
  firstValue,
  onChange,
  afterName,
  afterLabel,
  lastValue,
  disabled,
}) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <Grid item xs={6} sm={6}>
      <TimePickerComponent
        name={beforeName}
        id={beforeName}
        ampm={false}
        required
        label={beforeLabel}
        placeholder={'HH:MM'}
        value={firstValue ? firstValue : null}
        onChange={onChange(beforeName)}
        style={{ width: '100%' }}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <AccessTimeIcon
                style={{ color: !disabled ? '#0A75C2' : 'rgba(0,0,0,.38)' }}
              />
            </InputAdornment>
          ),
        }}
        disabled={disabled}
      />
    </Grid>
    <Grid item xs={6} sm={6}>
      <TimePickerComponent
        name={afterName}
        id={afterName}
        ampm={false}
        required
        label={afterLabel}
        placeholder={'HH:MM'}
        value={lastValue ? lastValue : null}
        onChange={onChange(afterName)}
        disabled={disabled || (firstValue ? false : true)}
        style={{ width: '100%' }}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <AccessTimeIcon
                style={{ color: !disabled ? '#0A75C2' : 'rgba(0,0,0,.38)' }}
              />
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  </MuiPickersUtilsProvider>
);

export const AutoCompleteForm = ({
  required = false,
  label,
  id,
  error: showError,
  errorMessage = '',
  ...autocompleteProps
}) => {
  const [shrink, setShrink] = useState(!!autocompleteProps.value);

  return (
    <FormControl required={required} error={showError}>
      <InputLabel htmlFor={id} shrink={shrink}>
        {label}
      </InputLabel>
      <AutoComplete
        id={id}
        name={id}
        setShrink={setShrink}
        {...autocompleteProps}
      />
      <ErrorMessage isVisible={showError} message={errorMessage} />
    </FormControl>
  );
};

export const GeneralTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  height: 28px;
`;

InputForm.propTypes = {
  id: PropTypes.string.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  maxLength: PropTypes.number,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
};

TimePickers.propTypes = {
  beforeName: PropTypes.string.isRequired,
  afterName: PropTypes.string.isRequired,
  beforeLabel: PropTypes.string.isRequired,
  afterLabel: PropTypes.string.isRequired,
  firstValue: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  lastValue: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
    .isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

TimePickers.defaultProps = {
  disabled: false,
};

InputForm.defaultProps = {
  required: false,
  error: false,
  maxLength: 0,
  errorMessage: '',
};

AutoCompleteForm.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ).isRequired,
  required: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
};

AutoCompleteForm.defaultProps = {
  required: false,
  error: false,
  errorMessage: '',
};
