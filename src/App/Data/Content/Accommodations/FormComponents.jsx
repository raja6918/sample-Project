import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import MUIFormControl from '@material-ui/core/FormControl';
import MUIFormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import SwitchMUI from '@material-ui/core/Switch';
import ExpansionPanelMUI from '@material-ui/core/ExpansionPanel';

export const CurrencyGrid = styled(Grid)`
  & .first,
  & .last {
    padding: 12px !important;
  }
  & .first {
    width: 33.333333%;
  }
  & .last {
    width: 66.666666%;
    max-height: 56px;
  }
  & .last > div:first-child {
    max-height: 100%;
  }
  & .nightly {
    display: block;
    width: 100%;
    padding: 7px 12px 0 12px;
    font-size: 12px;
  }
`;

export const CheckInOutGrid = styled(Grid)`
  margin-top: 20px;
  margin-bottom: 10px;
  & .title {
    font-size: 12px;
    width: 100%;
    display: block;
    margin-bottom: 10px;
  }
  & fieldset > div:first-child {
    display: block;
    margin-bottom: 10px;
  }
  & fieldset div label {
    width: 50%;
    margin: 0;
  }
  & fieldset div label > span {
    vertical-align: middle;
    font-size: 14px;
  }
  & fieldset div label > span:first-child {
    width: 24px;
    margin-right: 7px;
    height: 24px;
  }
  & fieldset div label > span:last-child {
    width: calc(100% - 31px);
  }
`;

export const ItemText = styled(ListItemText)`
  & span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 260px;
  }
`;

export const Input = styled(TextField)`
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
`;

export const FormControl = styled(MUIFormControl)`
  width: 100%;
`;
export const Label = styled(MUIFormControlLabel)`
  margin-left: -2px;
`;
export const PickersWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  padding: ${props => (props.padding ? props.padding : '10px !important')};
  .MuiInputBase-input {
    cursor: pointer;
  }
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

export const MenuItemStations = styled(MenuItem)`
  padding-right: 0;
  padding-left: 0;
  & > div {
    padding-left: 0;
  }
`;

export const Switch = styled(SwitchMUI)`
  & .MuiIconButton-root:hover {
    background-color: transparent !important;
  }
  justify-content: flex-end;
`;

export const DefaultValue = styled.div`
  & label {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.87);
  }
  & p {
    margin: 5px 0;
  }
`;

export const ExpansionPanel = styled(ExpansionPanelMUI)`
  width: 100%;
  & > div:first-child {
    background-color: #efefef;
    min-height: 48px;
    padding: 0 10px;
    & div {
      margin: 0;
    }
  }
  & > div:first-child[aria-expanded='true'] {
    background-color: #89c0fd;
  }
  & p {
    color: #000;
    font-size: 13px;
    font-weight: 500;
  }
`;

export const SelectInput = ({ name, onChange, value, items, disabled }) => {
  return (
    <Select
      disabled={disabled}
      onChange={onChange}
      value={value}
      inputProps={{ name }}
    >
      {items.map((item, k) => (
        <MenuItem key={k} value={item.value}>
          {item.display}
        </MenuItem>
      ))}
    </Select>
  );
};

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      display: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

SelectInput.defaultProps = {
  disabled: false,
};
