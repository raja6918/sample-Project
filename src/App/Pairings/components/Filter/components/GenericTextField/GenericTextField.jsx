import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import '../style.scss';
import { shortenText } from '../../../../../../utils/common';
import SierraTooltip from './../../../../../../_shared/components/SierraTooltip';

export default class GenericTextField extends Component {
  state = {
    value: this.props.value,
    editing: false,
    displayValue: '',
  };

  componentDidMount() {
    this.setState({
      displayValue: shortenText(this.state.value, this.props.maxDisplayLength),
    });
  }

  componentWillReceiveProps(nextProps) {
    // To revert to previous value if the API call failed
    if (
      nextProps.value !== this.state.value &&
      !nextProps.error &&
      !this.state.editing
    ) {
      this.setState({ value: nextProps.value });
    }
  }

  handleOnBlur = () => {
    const { value } = this.state;
    const { maxDisplayLength, onChange, converter } = this.props;
    this.setState(
      { editing: false, displayValue: shortenText(value, maxDisplayLength) },
      () => {
        const val = value ? converter(value) : '';
        onChange(val);
      }
    );
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
      this.setState({ value, displayValue: value });
    }
  };

  render() {
    const {
      value,
      error,
      handleDisable,
      type,
      style,
      placeholder,
      label,
    } = this.props;
    const { displayValue, value: stateValue } = this.state;
    const disabled = handleDisable(value);

    return (
      <span className="filter-panel-input">
        {' '}
        <SierraTooltip
          title={' '}
          disabled={stateValue === displayValue}
          position="bottom"
          html={<p style={{ padding: '10px' }}>{stateValue}</p>}
        >
          <TextField
            label={label}
            error={error}
            type={type}
            style={style}
            disabled={disabled}
            onBlur={this.handleOnBlur}
            value={displayValue}
            className={error ? 'input-error' : ''}
            onChange={this.handleOnChange}
            onFocus={event => {
              event.target.select();
              this.setState({ displayValue: stateValue });
            }}
            placeholder={placeholder}
            onClick={this.removeOverlay}
          />
        </SierraTooltip>
      </span>
    );
  }
}

GenericTextField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  style: PropTypes.shape(),
  handleDisable: PropTypes.func,
  error: PropTypes.bool,
  type: PropTypes.string,
  label: PropTypes.string,
  maxInputLength: PropTypes.number,
  placeholder: PropTypes.string,
  pattern: PropTypes.instanceOf(RegExp),
  converter: PropTypes.func,
  maxDisplayLength: PropTypes.number,
};

GenericTextField.defaultProps = {
  style: {},
  error: false,
  handleDisable: () => false,
  type: 'text',
  label: '',
  maxInputLength: 7,
  placeholder: '',
  pattern: /./,
  converter: value => value,
  maxDisplayLength: 9,
};
