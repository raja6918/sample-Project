import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Icon from '../../Icon';
import ResetButton from './ResetButton';
import {
  ERROR_ZINDEX,
  ICON_COLOR,
  ERROR_ICON_COLOR,
  DISABLED_ICON_COLOR,
} from './constants';

export default class GenericDateField extends Component {
  state = {
    value: this.props.value,
  };

  componentWillReceiveProps(nextProps) {
    // To revert to previous value if the API call failed
    if (nextProps.value !== this.state.value && !nextProps.error) {
      this.setState({ value: nextProps.value });
    }
  }

  handleOnChange = dateTime => {
    if (
      this.props.value !== moment(dateTime).format(this.props.returnDateFormat)
    ) {
      this.setState({ value: dateTime }, () => {
        this.props.onChange(
          moment(this.state.value).format(this.props.returnDateFormat),
          this.props.data
        );
      });
    }
  };

  generateStyle = () => {
    const zIndex = this.props.error ? ERROR_ZINDEX : 1;
    return { zIndex, ...this.props.style };
  };

  render() {
    const {
      value,
      data,
      error,
      removeOverlay,
      handleDisable,
      enableReset,
      handleReset,
      handleTooltipDisable,
      getTooltipContent,
      maxDate,
      minDate,
      displayDateFormat,
    } = this.props;
    const disabled = handleDisable(value, data);
    const tooltipDisabled = handleTooltipDisable(value, data);
    const tooltipContent = getTooltipContent(value, data);
    const iconColor = disabled ? DISABLED_ICON_COLOR : ICON_COLOR;
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <span className="date-time-pointer">
          {' '}
          <DatePicker
            error={error}
            style={this.generateStyle()}
            value={this.state.value}
            disabled={disabled}
            format={displayDateFormat}
            maxDate={maxDate}
            minDate={minDate}
            onChange={this.handleOnChange}
            onOpen={removeOverlay}
            className={error ? 'input-error' : ''}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <Icon
                    margin="0"
                    iconcolor={error ? ERROR_ICON_COLOR : iconColor}
                    size={18}
                    style={{
                      right: '2px',
                      top: '0px',
                      cursor: disabled ? 'default' : 'pointer',
                    }}
                  >
                    date_range
                  </Icon>
                </InputAdornment>
              ),
              className: error ? 'input-error' : '',
            }}
          />
          {enableReset && (
            <span>
              (<ResetButton
                data={data}
                handleReset={handleReset}
                disabled={tooltipDisabled}
                tooltipContent={tooltipContent}
              />)
            </span>
          )}{' '}
        </span>
      </MuiPickersUtilsProvider>
    );
  }
}

GenericDateField.propTypes = {
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
  maxDate: PropTypes.string,
  minDate: PropTypes.string,
  removeOverlay: PropTypes.func,
  returnDateFormat: PropTypes.string,
  displayDateFormat: PropTypes.string,
};

GenericDateField.defaultProps = {
  style: { width: '90px', color: '#ff650c' },
  handleDisable: () => false,
  enableReset: false,
  handleReset: () => null,
  handleTooltipDisable: () => false,
  getTooltipContent: () => false,
  error: false,
  minDate: '2019-01-01',
  maxDate: '2100-12-31',
  removeOverlay: () => null,
  returnDateFormat: 'YYYY-MM-DD',
  displayDateFormat: 'dd/MM/yyyy',
};
