import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import GenericTextField from '../GenericTextField/GenericTextField';

const BoxWrapper = styled.div`
  & > div {
    display: flex;
    justify-content: space-between;
    width: 160px;
  }

  & .errorSpan {
    color: #d10000 !important;
    margin-top: 3px;
    font-size: 0.75rem;
  }

  & label + .MuiInput-formControl {
    margin-top: 0px;
  }

  & .MuiInputLabel-formControl {
    top: 4px;
  }
`;

class MinMaxBox extends Component {
  state = {
    min: this.props.value.min,
    max: this.props.value.max,
    error: false,
    errorMsg: '',
  };

  isEmpty = value => value === undefined || value === null || value === '';

  sendValues = () => {
    const { min, max, error } = this.state;
    let values = {};

    if (!this.isEmpty(min)) {
      values.min = min;
    }
    if (!this.isEmpty(max)) {
      values.max = max;
    }
    if (this.isEmpty(min) && this.isEmpty(max)) {
      values = null;
    }

    this.props.onChange(values, null, error);
  };

  validate = () => {
    const { min, max } = this.state;
    const {
      invalidFormatMessage,
      pattern,
      rangeValidator,
      rangeErrorMessage,
    } = this.props;
    if (min || max) {
      if (
        (min ? !pattern.test(min) : false) ||
        (max ? !pattern.test(max) : false)
      ) {
        return this.setState(
          { error: true, errorMsg: invalidFormatMessage },
          this.sendValues
        );
      }
      if (!rangeValidator(min, max)) {
        return this.setState(
          { error: true, errorMsg: rangeErrorMessage },
          this.sendValues
        );
      }
    }
    this.setState({ error: false, errorMsg: '' }, this.sendValues);
  };

  handleChange = (type, value) => {
    this.setState({ [type]: value }, () => {
      this.validate();
    });
  };

  getValue = value => {
    return value !== undefined && value !== null ? value : '';
  };

  render() {
    const {
      style,
      error,
      type,
      maxInputLength,
      placeholder,
      innerPattern,
      converter,
      minLabel,
      maxLabel,
      maxDisplayLength,
    } = this.props;

    const { min, max } = this.state;
    return (
      <BoxWrapper>
        <div>
          <GenericTextField
            style={style}
            label={minLabel}
            error={error}
            type={type}
            maxInputLength={maxInputLength}
            placeholder={placeholder}
            pattern={innerPattern}
            converter={converter}
            value={this.getValue(min)}
            onChange={value => this.handleChange('min', value)}
            maxDisplayLength={maxDisplayLength}
          />
          <GenericTextField
            style={style}
            label={maxLabel}
            error={error}
            type={type}
            maxInputLength={maxInputLength}
            placeholder={placeholder}
            pattern={innerPattern}
            converter={converter}
            value={this.getValue(max)}
            onChange={value => this.handleChange('max', value)}
            maxDisplayLength={maxDisplayLength}
          />
        </div>
        {this.state.error && (
          <span className="errorSpan">{this.state.errorMsg}</span>
        )}
      </BoxWrapper>
    );
  }
}

MinMaxBox.propTypes = {
  style: PropTypes.shape({}),
  error: PropTypes.bool,
  type: PropTypes.string,
  minLabel: PropTypes.string,
  maxLabel: PropTypes.string,
  maxInputLength: PropTypes.number,
  placeholder: PropTypes.string,
  innerPattern: PropTypes.instanceOf(RegExp),
  converter: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  pattern: PropTypes.instanceOf(RegExp),
  rangeValidator: PropTypes.func,
  value: PropTypes.shape({
    min: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
      PropTypes.number,
    ]),
    max: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
      PropTypes.number,
    ]),
  }),
  invalidFormatMessage: PropTypes.string,
  rangeErrorMessage: PropTypes.string,
  maxDisplayLength: PropTypes.number,
};

MinMaxBox.defaultProps = {
  style: { width: '70px' },
  error: false,
  type: 'text',
  minLabel: 'Min',
  maxLabel: 'Max',
  maxInputLength: 11,
  placeholder: '0h00',
  innerPattern: /./,
  converter: value => value,
  pattern: /./,
  rangeValidator: (min, max) => true,
  value: {
    min: null,
    max: null,
  },
  invalidFormatMessage: 'Invalid Format',
  rangeErrorMessage: 'Range validation error',
  maxDisplayLength: 7,
};
export default MinMaxBox;
