import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlMUI from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SwitchMUI from '@material-ui/core/Switch';

import DateFnsUtils from '@date-io/date-fns';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import ErrorMessage from '../../../../components/FormValidation/ErrorMessage';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '../../../../components/Icon';

const FormControl = styled(FormControlMUI)`
  width: 100%;
`;

const Input = styled(TextField)`
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
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

export const ComboBox = ({
  name,
  onChange,
  value,
  items,
  label,
  required,
  disabled,
}) => {
  return (
    <FormControl required={required}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        onChange={onChange}
        value={value}
        inputProps={{ name }}
        disabled={disabled}
      >
        {items.map((item, k) => (
          <MenuItem key={k} value={item.value}>
            {item.display}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

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

export const PickersWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  padding: 10px !important;
  & > div {
    max-width: 45%;
    flex-basis: 45%;
  }
  & > div:first-child {
    margin-right: 10%;
  }
  .picker-field {
    width: 100%;
    margin-top: 16px;
  }
  & .error > label {
    color: #d10000 !important;
  }
`;

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
        disabled={disabled}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <Icon margin="0" iconcolor="#0A75C2">
                access_time
              </Icon>
            </InputAdornment>
          ),
        }}
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
              <Icon margin="0" iconcolor="#0A75C2">
                access_time
              </Icon>
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  </MuiPickersUtilsProvider>
);

export const GeneralTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  height: 28px;
`;

export const OpositeDirection = styled.div`
  background-color: #e5e5e5;
  padding: 2px 20px 20px 20px;
  margin: 10px 0px;
`;

export const SwitchContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  & p {
    font-size: 13px;
    color: RGBA(0, 0, 0, 0.87);
    margin-top: 20px;
  }

  & p.unchecked {
    color: RGBA(0, 0, 0, 0.14);
    font-weight: 500;
  }
`;

export const Switch = styled(SwitchMUI)`
  & .MuiIconButton-root:hover {
    background-color: transparent !important;
  }

  & .MuiSwitch-colorSecondary.Mui-checked {
    color: transparent !important;
  }

  & .MuiSwitch-input {
    width: 300px;
  }

  & .custom-icon {
    color: #ffffff;
    width: 15px;
    height: 15px;
    margin-top: 5px;
    margin-left: 4px;
  }

  & .custom-bar {
    width: 35px !important;
    height: 20px;
    border-radius: 40px;
    border: 1px solid #df3900;
    background-color: #ff650c;
    opacity: 1;
  }

  & .custom-base {
    padding-left: 0px;
    padding-right: 0px;
  }

  & .custom-checked {
    opacity: 1;
    & .custom-bar {
      background-color: #ff650c;
      color: #ff650c;
    }

    & .custom-icon {
      margin-left: -2px;
    }
  }

  .Mui-checked + .MuiSwitch-track {
    opacity: 1;
  }
`;

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

ComboBox.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      display: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ).isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

ComboBox.defaultProps = {
  required: false,
  disabled: false,
};

InputForm.propTypes = {
  id: PropTypes.string.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  maxLength: PropTypes.number,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
};

InputForm.defaultProps = {
  required: false,
  error: false,
  maxLength: 0,
  errorMessage: '',
  disabled: false,
};
