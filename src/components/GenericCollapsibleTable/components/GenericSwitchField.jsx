import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SwitchMUI from '@material-ui/core/Switch';
import ResetButton from './ResetButton';
import './style.scss';

export const Switch = styled(SwitchMUI)`
  .MuiSwitch-track {
    background-color: #cccccc;
  }

  & .MuiIconButton-root:hover {
    background-color: transparent !important;
  }
  & .custom-bar {
    width: 34px !important;
  }
  .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track {
    background-color: #ff650c !important;
  }
  .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track + .Mui-disabled {
    background-color: #fba776 !important;
  }
`;

export default class GenericSwitchField extends Component {
  state = {
    value: this.props.value,
  };

  componentWillReceiveProps(nextProps) {
    // To revert to previous value if the API call failed
    if (nextProps.value !== this.state.value && !nextProps.error) {
      this.setState({ value: nextProps.value });
    }
  }

  handleOnChange = () => {
    const value = !this.state.value;
    this.setState({ value }, () => {
      this.props.onChange(value, this.props.data);
    });
  };

  retrieveLabels = (items = [], type = true) => {
    return (
      Array.isArray(items) &&
      items.find(item => item.value.toString() === type.toString())
    );
  };

  render() {
    const {
      value,
      data,
      enableReset,
      handleReset,
      handleTooltipDisable,
      handleDisable,
      getTooltipContent,
      items,
    } = this.props;
    const disabled = handleDisable(value, data);
    const tooltipDisabled = handleTooltipDisable(value, data);
    const tooltipContent = getTooltipContent(value, data);
    const falseLabel = this.retrieveLabels(items, false);
    const trueLabel = this.retrieveLabels(items);

    return (
      <span>
        {items && (
          <span
            className={!this.state.value ? 'switchLabelBold' : 'switchLabel'}
          >
            {falseLabel && falseLabel.display}
          </span>
        )}
        <Switch
          size="medium"
          disabled={disabled}
          classes={{
            track: 'custom-bar',
            thumb: this.state.value
              ? !disabled
                ? 'enabled-thumb'
                : 'disabled-thumb'
              : '',
          }}
          checked={this.state.value}
          onChange={this.handleOnChange}
        />
        {items && (
          <span
            className={this.state.value ? 'switchLabelBold' : 'switchLabel'}
          >
            {trueLabel && trueLabel.display + ' '}
          </span>
        )}
        {enableReset && (
          <span>
            (
            <ResetButton
              data={data}
              handleReset={handleReset}
              disabled={tooltipDisabled}
              tooltipContent={tooltipContent}
            />
            )
          </span>
        )}
      </span>
    );
  }
}

GenericSwitchField.propTypes = {
  data: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  handleReset: PropTypes.func,
  enableReset: PropTypes.bool,
  handleTooltipDisable: PropTypes.func,
  getTooltipContent: PropTypes.func,
  handleDisable: PropTypes.func,
  error: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      display: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.number,
      ]),
    })
  ),
};

GenericSwitchField.defaultProps = {
  error: false,
  enableReset: false,
  handleReset: () => null,
  handleTooltipDisable: () => false,
  getTooltipContent: () => false,
  handleDisable: () => false,
  items: null,
};
