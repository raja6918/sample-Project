import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ResetButton from './ResetButton';
import {
  ERROR_ZINDEX,
  ICON_COLOR,
  ERROR_ICON_COLOR,
  DISABLED_ICON_COLOR,
} from './constants';
import './style.scss';

export default class GenericTimeField extends Component {
  state = {
    value: moment(this.props.value, 'HH:mm'),
  };

  isOpen = false;
  clickedOk = false;

  componentWillReceiveProps(nextProps) {
    // To revert to previous value if the API call failed
    if (
      nextProps.value !== this.state.value &&
      !nextProps.error &&
      !this.isOpen
    ) {
      this.setState({ value: moment(nextProps.value, 'HH:mm') });
    }
  }

  handleOnChange = dateTime => {
    this.clickedOk = true;
    if (this.props.value !== moment(dateTime).format('HH:mm')) {
      this.setState({ value: dateTime }, () => {
        this.props.onChange(
          moment(this.state.value).format('HH:mm'),
          this.props.data
        );
      });
    }
  };

  generateStyle = () => {
    const zIndex = this.props.error ? ERROR_ZINDEX : 1;
    return { zIndex, ...this.props.style };
  };

  handleOpen = () => {
    this.isOpen = true;
    this.props.removeOverlay();
  };

  handleClose = () => {
    if (
      moment(this.state.value, 'HH:mm').format('HH:mm') !==
        moment(this.props.value, 'HH:mm').format('HH:mm') &&
      !this.clickedOk
    ) {
      if (!this.props.error) {
        this.setState({ value: moment(this.props.value, 'HH:mm') });
      }
    }
    // Reset values of isOpen and clickedOk
    this.isOpen = false;
    this.clickedOk = false;
  };

  render() {
    const {
      value,
      data,
      error,
      handleDisable,
      enableReset,
      handleReset,
      handleTooltipDisable,
      getTooltipContent,
      variant,
    } = this.props;
    const disabled = handleDisable(value, data);
    const tooltipDisabled = handleTooltipDisable(value, data);
    const tooltipContent = getTooltipContent(value, data);
    const iconColor = disabled ? DISABLED_ICON_COLOR : ICON_COLOR;
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <span className="date-time-pointer">
          {' '}
          <TimePicker
            variant={variant}
            error={error}
            style={this.generateStyle()}
            ampm={false}
            value={this.state.value}
            disabled={disabled}
            onChange={this.handleOnChange}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            className={error ? 'input-error' : ''}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <AccessTimeIcon
                    className="access-time-icon-cls"
                    style={{
                      cursor: disabled ? 'default' : 'pointer',
                      color: error ? ERROR_ICON_COLOR : iconColor,
                    }}
                  />
                </InputAdornment>
              ),
              className: error ? 'input-error' : '',
            }}
          />
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
          )}{' '}
        </span>
      </MuiPickersUtilsProvider>
    );
  }
}

GenericTimeField.propTypes = {
  data: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  style: PropTypes.shape(),
  handleDisable: PropTypes.func,
  handleReset: PropTypes.func,
  enableReset: PropTypes.bool,
  handleTooltipDisable: PropTypes.func,
  getTooltipContent: PropTypes.func,
  error: PropTypes.bool,
  removeOverlay: PropTypes.func,
  variant: PropTypes.string,
};

GenericTimeField.defaultProps = {
  error: false,
  style: { color: '#ff650c', width: '55px' },
  handleDisable: () => false,
  enableReset: false,
  handleReset: () => null,
  handleTooltipDisable: () => false,
  getTooltipContent: () => false,
  removeOverlay: () => null,
  variant: 'dialog',
};
