import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MinimizeIcon from '@material-ui/icons/Minimize';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
  ERROR_ZINDEX,
  ICON_COLOR,
  ERROR_ICON_COLOR,
  DISABLED_ICON_COLOR,
} from './constants';
import './style.scss';

export default class GenericTimeRangeField extends Component {
  state = {
    from: this.props.value ? moment(this.props.value, 'HH:mm') : null,
    to: this.props.data._to ? moment(this.props.data._to, 'HH:mm') : null,
  };

  isOpen = false;
  clickedOk = false;

  componentWillReceiveProps(nextProps) {
    // To revert to previous value if the API call failed
    if (
      nextProps.value !== this.state.from &&
      !nextProps.error &&
      !this.isOpen
    ) {
      this.setState({
        from: nextProps.value ? moment(nextProps.value, 'HH:mm') : null,
      });
    }

    if (
      nextProps.data._to !== this.state.to &&
      !nextProps.error &&
      !this.isOpen
    ) {
      this.setState({
        to: nextProps.data._to ? moment(nextProps.data._to, 'HH:mm') : null,
      });
    }
  }

  handleFromChange = dateTime => {
    this.clickedOk = true;
    if (this.props.value !== moment(dateTime).format('HH:mm')) {
      this.setState({ from: dateTime }, () => {
        this.props.onChange(
          moment(this.state.from).format('HH:mm'),
          this.props.data
        );
      });
    }
  };

  handleToChange = dateTime => {
    this.clickedOk = true;
    if (this.props.data._to !== moment(dateTime).format('HH:mm')) {
      this.setState({ to: dateTime }, () => {
        this.props.onChange(moment(this.state.to).format('HH:mm'), {
          ...this.props.data,
          _header: { ...this.props.data._header, field: '_to' },
        });
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
      moment(this.state.from, 'HH:mm').format('HH:mm') !==
        moment(this.props.value, 'HH:mm').format('HH:mm') &&
      !this.clickedOk
    ) {
      if (!this.props.error) {
        this.setState({ from: moment(this.props.value, 'HH:mm') });
      }
    }

    if (
      moment(this.state.to, 'HH:mm').format('HH:mm') !==
        moment(this.props.data._to, 'HH:mm').format('HH:mm') &&
      !this.clickedOk
    ) {
      if (!this.props.error) {
        this.setState({ to: moment(this.props.data._to, 'HH:mm') });
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
      fromPlaceHolder,
      toPlaceHolder,
    } = this.props;
    const { from, to } = this.state;
    const disabled = handleDisable(value, data);
    const iconColor = disabled ? DISABLED_ICON_COLOR : ICON_COLOR;
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <span className="time-range-picker">
          {' '}
          <TimePicker
            variant="inline"
            error={error}
            placeholder={fromPlaceHolder}
            invalidDateMessage=""
            style={this.generateStyle()}
            ampm={false}
            value={from}
            disabled={disabled}
            onChange={this.handleFromChange}
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
          <span>
            <MinimizeIcon style={{ fontSize: '18px', margin: '2px 10px' }} />
          </span>
          <TimePicker
            variant="inline"
            error={error}
            placeholder={toPlaceHolder}
            invalidDateMessage=""
            style={this.generateStyle()}
            ampm={false}
            value={to}
            disabled={disabled}
            onChange={this.handleToChange}
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
        </span>
      </MuiPickersUtilsProvider>
    );
  }
}

GenericTimeRangeField.propTypes = {
  data: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  style: PropTypes.shape(),
  handleDisable: PropTypes.func,
  error: PropTypes.bool,
  removeOverlay: PropTypes.func,
  fromPlaceHolder: PropTypes.string,
  toPlaceHolder: PropTypes.string,
};

GenericTimeRangeField.defaultProps = {
  error: false,
  style: { color: '#ff650c', width: '75px' },
  handleDisable: () => false,
  removeOverlay: () => null,
  fromPlaceHolder: 'From',
  toPlaceHolder: 'To',
};
