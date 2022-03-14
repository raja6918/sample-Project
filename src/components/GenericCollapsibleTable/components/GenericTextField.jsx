import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import ResetButton from './ResetButton';
import { ERROR_ZINDEX } from './constants';
import './style.scss';

export default class GenericTextField extends Component {
  state = {
    value:
      this.props.value === null || this.props.value === undefined
        ? ''
        : this.props.value,
    editing: false,
  };

  componentWillReceiveProps(nextProps) {
    // To revert to previous value if the API call failed
    if (
      nextProps.value !== this.state.value &&
      !nextProps.error &&
      !this.state.editing
    ) {
      this.setState({
        value:
          nextProps.value === null || nextProps.value === undefined
            ? ''
            : nextProps.value,
      });
    }
  }

  handleOnBlur = () => {
    const value = this.props.converter(this.state.value);
    if (value !== this.props.value) {
      if (!value && value !== 0) {
        this.setState({ value: this.props.value, editing: false }, () => {
          this.props.handleRemoveParamSet(this.props.data);
        });
      } else {
        this.setState({ editing: false }, () => {
          this.props.onChange(value, this.props.data);
        });
      }
    } else {
      this.setState({ editing: false });
    }
  };

  handleOnChange = event => {
    if (event.target.value.length > this.props.maxInputLength) {
      event.target.value = event.target.value.slice(
        0,
        this.props.maxInputLength
      );
    }
    if (
      event.target.value === '' ||
      this.props.pattern.test(event.target.value)
    ) {
      const { value } = event.target;
      this.setState({ value });
    }
  };

  generateStyle = () => {
    let width;
    if (this.state.value === '' && this.props.placeholder) {
      width = this.props.placeholder.length;
    } else {
      const value =
        this.state.value === null || this.state.value === undefined
          ? ''
          : this.state.value;
      width =
        value.toString().length <= this.props.maxInputLength
          ? value.toString().length + 2
          : 9;
    }

    const zIndex = this.props.error ? ERROR_ZINDEX : 1;
    return { width: width + 'ch', zIndex, ...this.props.style };
  };

  removeOverlay = () => {
    this.setState({ editing: true }, () => {
      // To remove any outer overlay if any when we use this component
      this.props.removeOverlay();
    });
  };

  render() {
    const {
      value,
      data,
      error,
      handleDisable,
      type,
      rightPadding,
      enableReset,
      handleReset,
      handleTooltipDisable,
      getTooltipContent,
      placeholder,
    } = this.props;
    const disabled = handleDisable(value, data);
    const tooltipDisabled = handleTooltipDisable(value, data);
    const tooltipContent = getTooltipContent(value, data);

    return (
      <span className="rule-description-input">
        {' '}
        <TextField
          error={error}
          type={type}
          style={this.generateStyle()}
          disabled={disabled}
          onBlur={this.handleOnBlur}
          value={this.state.value}
          className={error ? 'input-error' : ''}
          onChange={this.handleOnChange}
          onFocus={event => event.target.select()}
          placeholder={placeholder}
          onClick={this.removeOverlay}
        />
        {rightPadding ? ` ${rightPadding} ` : ''}
        {enableReset && (
          <span className="reset-btn-container">
            (
            <ResetButton
              data={data}
              handleReset={handleReset}
              disabled={tooltipDisabled}
              tooltipContent={tooltipContent}
            />
            )
          </span>
        )}{' '}
      </span>
    );
  }
}

GenericTextField.propTypes = {
  data: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  style: PropTypes.shape(),
  handleDisable: PropTypes.func,
  handleReset: PropTypes.func,
  enableReset: PropTypes.bool,
  handleTooltipDisable: PropTypes.func,
  getTooltipContent: PropTypes.func,
  error: PropTypes.bool,
  type: PropTypes.string,
  maxInputLength: PropTypes.number,
  rightPadding: PropTypes.string,
  placeholder: PropTypes.string,
  pattern: PropTypes.instanceOf(RegExp),
  removeOverlay: PropTypes.func,
  converter: PropTypes.func,
  handleRemoveParamSet: PropTypes.func,
};

GenericTextField.defaultProps = {
  style: { color: '#ff650c' },
  error: false,
  handleDisable: () => false,
  enableReset: false,
  handleReset: () => null,
  handleTooltipDisable: () => false,
  getTooltipContent: () => false,
  type: 'text',
  maxInputLength: 7,
  rightPadding: '',
  placeholder: '',
  pattern: /./,
  removeOverlay: () => null,
  converter: value => value,
  handleRemoveParamSet: () => null,
};
