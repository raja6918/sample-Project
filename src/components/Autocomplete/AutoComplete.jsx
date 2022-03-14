import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import InputMUI from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import Icon from '../Icon';
import SelectWrapped from './SelectWrapped';
import { shortenText } from '../../utils/common';

const Input = styled(InputMUI)`
  & .Select {
    padding-bottom: 3px;
  }
  & .Select-control {
    width: 95%;
    overflow: hidden;
    border: 0;
    height: auto;
    display: flex;
    background: transparent;
    align-items: center;
  }
  & .Select-control:hover {
    box-shadow: none;
  }
  & .Select-multi-value-wrapper {
    display: flex;
    flex: 1;
    flex-grow: 1;
    overflow: hidden;
    height: 16px;
    padding-bottom: 7px;
  }
  & .Select-multi-value-wrapper > div:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 0 -2px 0;
    max-width: 95%;
    width: auto;
  }
  & .Select--multi .Select-input {
    margin: 0;
  }
  &
    .Select.has-value.is-clearable.Select--single
    > .Select-control
    .Select-value {
    padding: 0;
  }
  & .Select-noresults {
    padding: 16px;
  }
  & .Select-input {
    height: auto;
    display: inline-flex !important;
    padding: 0;
  }
  & .Select-input input {
    border: 0;
    cursor: default;
    margin: 0;
    padding: 0;
    display: inline-block;
    outline: 0;
    font-size: inherit;
    background: transparent;
    font-family: inherit;
    box-shadow: none;
  }
  & .Select-placeholder,
  .Select--single .Select-value {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    padding: 0;
    position: absolute;
    font-size: 1rem;
    align-items: center;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  }
  & .Select-placeholder {
    color: rgba(0, 0, 0, 0.87);
  }
  & .Select-menu-outer {
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    z-index: 99;
    position: absolute;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
    max-height: 216px;
    background-color: #fff;
  }
  & .Select-menu-outer > div > div {
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  & .Select.is-focused:not(.is-open) > .Select-control {
    box-shadow: none;
  }
  & .Select-menu {
    max-height: 216px;
    overflow-y: auto;
    z-index: 99;
  }
  & .Select-menu div {
    box-sizing: content-box;
  }
  & .Select-arrow-zone {
    position: absolute;
    right: 0;
    top: 0;
  }
  & .Select-clear-zone {
    transform: translateY(-4px);
  }
  & .Select-arrow-zone,
  .Select-clear-zone {
    color: rgba(0, 0, 0, 0.54);
    width: 21px;
    cursor: pointer;
    height: 21px;
    z-index: 1;
  }
  & .Select-aria-only {
    clip: rect(0 0 0 0);
    width: 1px;
    height: 1px;
    margin: -1px;
    position: absolute;
    overflow: hidden;
  }
  .Select.is-open .Select-control .Select-clear-zone {
    display: block;
  }
  .Select .Select-control .Select-clear-zone {
    display: none;
  }
  .Select.is-open .Select-control .Select-clear-zone span {
    font-size: 16px;
    margin-top: 5px;
  }
`;

class AutoComplete extends Component {
  state = {
    value: this.props.value || '',
    focused: false,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });

    // If component is still not focused and we got a value from props
    if (!this.state.focused && nextProps.value) {
      this.props.setShrink(true);
    }
  }

  handleChange = name => value => {
    this.setState(
      {
        [name]: value,
      },
      () => this.props.onChange(value)
    );
  };

  onKeyPress = event => {
    this.props.onFocus();
    const { maxLength } = this.props;
    if (event.target.value && event.target.value.length === maxLength) {
      event.preventDefault();
      return false;
    }
  };

  handleFocus = () => {
    this.setState({ focused: true });
    this.props.setShrink(true);
    this.props.onFocus();
  };

  handleBlur = () => {
    this.setState({ focused: false });
    this.props.setShrink(!!this.state.value);
    this.props.onBlur();
  };

  getLabelFromSuggestion = (suggestions, value) => {
    const suggestion = suggestions.find(
      suggestion => suggestion.value === value
    );
    if (suggestion) {
      return shortenText(suggestion.label, 48);
    }
    return '';
  };

  render() {
    const { value } = this.state;

    const {
      suggestions,
      id,
      name,
      placeholder,
      required,
      createLabel,
      create,
      adornmentIcon,
      t,
      onChange,
      style,
      disabled,
      className,
      isToolTip,
    } = this.props;

    const inputComponent = !disabled ? { inputComponent: SelectWrapped } : {};
    const derivedValue = !disabled
      ? value
      : this.getLabelFromSuggestion(suggestions, value);

    return (
      <Input
        className={className}
        onFocus={this.handleFocus}
        fullWidth
        disabled={disabled}
        value={derivedValue}
        style={style}
        required={required}
        onClick={this.props.onClick}
        onBlur={this.handleBlur}
        onKeyPress={this.onKeyPress}
        onChange={this.handleChange('value')}
        placeholder={required && placeholder ? `${placeholder} *` : placeholder}
        startAdornment={
          <InputAdornment position="start">
            {adornmentIcon ? (
              <img
                style={{ margin: '0 0 3px 0' }}
                src={adornmentIcon}
                alt="adornmentIcon"
              />
            ) : (
              ''
            )}
          </InputAdornment>
        }
        id={id}
        inputProps={{
          name: name,
          value: derivedValue,
          instanceId: id,
          simpleValue: true,
          options: suggestions,
          createComponent: create,
          createLabel: createLabel,
          t: t,
          required: required,
          isToolTip,
        }}
        {...inputComponent}
      />
    );
  }
}

AutoComplete.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
  style: PropTypes.shape({}),
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  createLabel: PropTypes.string,
  create: PropTypes.bool,
  maxLength: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  adornmentIcon: PropTypes.string,
  t: PropTypes.func,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  setShrink: PropTypes.func,
};

AutoComplete.defaultProps = {
  placeholder: '',
  required: false,
  createLabel: '',
  create: false,
  maxLength: 1000,
  value: '',
  style: {},
  onBlur: () => {},
  onChange: () => {},
  adornmentIcon: '',
  t: () => {},
  onFocus: () => {},
  onClick: () => {},
  disabled: false,
  setShrink: () => {},
};

export default AutoComplete;
