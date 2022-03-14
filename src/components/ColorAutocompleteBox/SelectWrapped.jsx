import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select3';
import Icon from '@material-ui/core/Icon';

import './style.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';

class SelectWrapper extends Component {
  DropdownIndicator = props => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <Icon>arrow_drop_down</Icon>
        </components.DropdownIndicator>
      )
    );
  };

  CustomOption = props => {
    return (
      <div
        style={{
          fontWeight: props.data.primary ? 500 : 400,
          color: props.data.primary ? this.props.color : '',
        }}
        className={props.data.primaryLast ? 'margin-check' : ''}
      >
        <components.Option {...props} />
      </div>
    );
  };

  render() {
    const {
      value,
      onChange,
      options,
      disabled,
      placeholder,
      color,
    } = this.props;
    const selectedOption = Array.isArray(options)
      ? options.find(option => option.value === value)
      : '';
    return (
      <Select
        styles={{
          menu: styles => ({
            ...styles,
            maxHeight: '240px',
          }),
          menuList: styles => ({
            ...styles,
            maxHeight: '240px',
          }),
          indicatorContainer: styles => ({ ...styles, padding: 0 }),
          dropdownIndicator: styles => ({
            ...styles,
            color: disabled ? '#cccccc !important' : '',
          }),
          control: styles => ({
            ...styles,
            border: 0,
            borderBottom: '1px solid #cccccc',
            borderRadius: 'unset',
            background: 'transparent',
            boxShadow: 0,
            cursor: 'pointer',
          }),
          option: (styles, { data, isSelected }) => ({
            ...styles,
            background: isSelected ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
            color: data.primary ? color : '#000000',
            cursor: 'pointer',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.04)',
            },
          }),
          placeholder: styles => ({
            ...styles,
            color: disabled ? '#cccccc !important' : '',
          }),
          singleValue: (styles, { data }) => ({
            ...styles,
            color: data.primary ? color : '',
          }),
        }}
        isClearable
        components={{
          Option: this.CustomOption,
          DropdownIndicator: this.DropdownIndicator,
          IndicatorSeparator: () => null,
        }}
        value={selectedOption || ''}
        onChange={onChange}
        options={options}
        isDisabled={disabled}
        placeholder={placeholder}
      />
    );
  }
}

SelectWrapper.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.boolean,
    PropTypes.string,
    PropTypes.number,
  ]),
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.boolean,
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      primary: PropTypes.boolean,
      primaryLast: PropTypes.boolean,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
    PropTypes.null,
  ]),
};

SelectWrapper.defaultProps = {
  placeholder: '',
  value: '',
  color: '#000000AB',
  disabled: false,
  defaultValue: null,
};
export default SelectWrapper;
