import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DateRange } from '@material-ui/icons';
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
  & .errorSpan {
    color: #d10000 !important;
    margin-top: 3px;
    font-size: 0.75rem;
  }
`;

class CompoundDateTimePicker extends Component {
  state = {
    startTime: this.props.value.startTime,
    endTime: this.props.value.endTime,
    error: false,
  };

  componentDidMount() {
    if (this.props.value.noChange) {
      this.sendDateTime();
    }
  }

  isDateTimeRangeValid = () => {
    const { startTime, endTime } = this.state;
    const { returnDateFormat } = this.props;
    if (startTime && endTime) {
      const startDateTimeF = moment(startTime, returnDateFormat);
      const endDateTimeF = moment(endTime, returnDateFormat);
      return startDateTimeF.isSameOrBefore(endDateTimeF);
    }
    return true;
  };

  sendDateTime = () => {
    const { startTime, endTime, error } = this.state;
    const { returnDateFormat, onChange } = this.props;
    const startDateTimeF = moment(startTime).format(returnDateFormat);
    const endDateTimeF = moment(endTime).format(returnDateFormat);
    let value = {};

    if (startTime && !endTime) value = { startTime: startDateTimeF };
    else if (endTime && !startTime) value = { endTime: endDateTimeF };
    else if (endTime && startTime)
      value = { startTime: startDateTimeF, endTime: endDateTimeF };

    onChange(value, null, error);
  };

  handleChange = (event, field) => {
    this.setState({ [field]: event }, () =>
      this.setState({ error: !this.isDateTimeRangeValid() }, this.sendDateTime)
    );
  };

  render() {
    const { t, displayDateFormat, containerStyle } = this.props;
    const { startTime, endTime, error } = this.state;

    return (
      <Grid container style={containerStyle}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <PickersWrapper>
            <Grid item xs={12} sm={12}>
              <DateTimePicker
                name="startTime"
                ampm={false}
                className="picker-field"
                label={t('FILTER.pane.labels.between')}
                maxDate={endTime || null}
                format={displayDateFormat}
                placeholder={displayDateFormat.toUpperCase()}
                value={startTime}
                onChange={event => this.handleChange(event, 'startTime')}
                InputProps={{
                  endAdornment: (
                    <DateRange color="primary" style={{ cursor: 'pointer' }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <DateTimePicker
                className="picker-field2"
                name="endTime"
                ampm={false}
                label={t('FILTER.pane.labels.and')}
                minDate={startTime || null}
                format={displayDateFormat}
                placeholder={displayDateFormat.toUpperCase()}
                value={endTime}
                onChange={event => this.handleChange(event, 'endTime')}
                InputProps={{
                  endAdornment: (
                    <DateRange color="primary" style={{ cursor: 'pointer' }} />
                  ),
                }}
              />
            </Grid>
            {error && (
              <span className="errorSpan">
                {t('ERRORS.FILTER.dateTimeRangeIncorrect')}
              </span>
            )}
          </PickersWrapper>
        </MuiPickersUtilsProvider>
      </Grid>
    );
  }
}

CompoundDateTimePicker.propTypes = {
  t: PropTypes.func.isRequired,
  value: PropTypes.shape({
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    noChange: PropTypes.bool,
  }),
  onChange: PropTypes.func.isRequired,
  returnDateFormat: PropTypes.string,
  displayDateFormat: PropTypes.string,
  containerStyle: PropTypes.shape({}),
};

CompoundDateTimePicker.defaultProps = {
  returnDateFormat: 'YYYY-MM-DDTHH:mm',
  displayDateFormat: 'yy/MM/dd HH:mm',
  value: { startTime: null, endTime: null, noChange: true },
  containerStyle: { width: '160px' },
};

export default CompoundDateTimePicker;
