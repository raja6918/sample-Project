import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import moment from 'moment';

const PickersWrapper = styled.div`
  .picker-field {
    margin-top: 5px;
    & div > input {
      cursor: pointer;
    }
  }
  .picker-field2 {
    margin-top: 16px;
    & div > input {
      cursor: pointer;
    }
  }
`;

class CompoundTimePicker extends Component {
  state = {
    startTime: this.props.value.startTime
      ? moment(this.props.value.startTime, this.props.displayTimeFormat)
      : null,
    endTime: this.props.value.endTime
      ? moment(this.props.value.endTime, this.props.displayTimeFormat)
      : null,
  };

  componentDidMount() {
    if (this.props.value.noChange) {
      this.sendTime();
    }
  }

  sendTime = () => {
    const { startTime, endTime } = this.state;
    const { returnTimeFormat, onChange } = this.props;
    const startTimeF = moment(startTime).format(returnTimeFormat);
    const endTimeF = moment(endTime).format(returnTimeFormat);
    const value = {};

    if (startTime) value.startTime = startTimeF;
    if (endTime) value.endTime = endTimeF;

    onChange(value, null, null);
  };

  handleChange = (event, field) => {
    this.setState({ [field]: event }, this.sendTime);
  };

  render() {
    const { t, displayTimeFormat, containerStyle } = this.props;
    const { startTime, endTime } = this.state;
    return (
      <Grid container style={containerStyle}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <PickersWrapper>
            <Grid item xs={12} sm={12}>
              <TimePicker
                name="startTime"
                ampm={false}
                className="picker-field"
                label={t('FILTER.pane.labels.between')}
                format={displayTimeFormat}
                placeholder={displayTimeFormat.toUpperCase()}
                value={startTime}
                onChange={event => this.handleChange(event, 'startTime')}
                InputProps={{
                  endAdornment: (
                    <AccessTimeIcon
                      color="primary"
                      style={{ cursor: 'pointer' }}
                    />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TimePicker
                className="picker-field2"
                name="endTime"
                ampm={false}
                label={t('FILTER.pane.labels.and')}
                format={displayTimeFormat}
                placeholder={displayTimeFormat.toUpperCase()}
                value={endTime}
                onChange={event => this.handleChange(event, 'endTime')}
                InputProps={{
                  endAdornment: (
                    <AccessTimeIcon
                      color="primary"
                      style={{ cursor: 'pointer' }}
                    />
                  ),
                }}
              />
            </Grid>
          </PickersWrapper>
        </MuiPickersUtilsProvider>
      </Grid>
    );
  }
}

CompoundTimePicker.propTypes = {
  t: PropTypes.func.isRequired,
  value: PropTypes.shape({
    startTime: PropTypes.oneOfType([PropTypes.shape({}), null]),
    endTime: PropTypes.oneOfType([PropTypes.shape({}), null]),
    noChange: PropTypes.bool,
  }),
  onChange: PropTypes.func.isRequired,
  returnTimeFormat: PropTypes.string,
  displayTimeFormat: PropTypes.string,
  containerStyle: PropTypes.shape({}),
};

CompoundTimePicker.defaultProps = {
  returnTimeFormat: 'HH:mm',
  displayTimeFormat: 'HH:mm',
  value: {
    startTime: null,
    endTime: null,
    noChange: true,
  },
  containerStyle: { width: '160px' },
};

export default CompoundTimePicker;
