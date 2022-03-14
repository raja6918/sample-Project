import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Material-Ui-Pickers
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

// Material-Ui-Next
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MUIFormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';

import timezonesObj from '../../../../../utils/timezones';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '../../../../../components/Icon';

const FormControl = styled(MUIFormControl)`
  width: 100%;
`;
const PickersWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  padding: 10px !important;
  .MuiInputBase-input {
    cursor: pointer;
  }
  .picker-field {
    width: 100%;
    margin-top: 16px;
  }
  & .error > label {
    color: #d10000 !important;
  }
`;
const DSTValues = [
  {
    value: '0h00',
    label: '0h00',
  },
  {
    value: '0h30',
    label: '0h30',
  },
  {
    value: '1h00',
    label: '1h00',
  },
  {
    value: '1h30',
    label: '1h30',
  },
  {
    value: '2h00',
    label: '2h00',
  },
];

class TimeZone extends Component {
  constructor(props) {
    super(props);
    const { station } = this.props;

    if (station) {
      this.state = {
        utcOffset: station.utcOffset,
        dstShift:
          station.dstShift || station.dstShift === 0
            ? station.dstShift.toString()
            : '',
        dstStartDateTime: station.dstStartDateTime
          ? new Date(station.dstStartDateTime.replace(' ', 'T'))
          : null,
        dstEndDateTime: station.dstEndDateTime
          ? new Date(station.dstEndDateTime.replace(' ', 'T'))
          : null,
      };
    } else {
      this.state = {
        utcOffset: '',
        dstShift: '',
        dstStartDateTime: null,
        dstEndDateTime: null,
      };
    }
  }

  handleChange = (picker, name) => event => {
    if (!picker) {
      if (event.target.name === 'dstShift' && event.target.value === '0') {
        this.setState({
          [event.target.name]: event.target.value,
          dstEndDateTime: null,
          dstStartDateTime: null,
        });
      } else {
        this.setState({ [event.target.name]: event.target.value });
      }
    } else if (name === 'dstStartDateTime' && this.state.dstEndDateTime) {
      this.setState({ dstEndDateTime: null, dstStartDateTime: event });
    } else {
      this.setState({ [name]: event });
    }
    setTimeout(() => {
      this.props.onChange();
    }, 100);
  };

  handleDstChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  getTimeZones = () => {
    return timezonesObj.map((zone, i) => (
      <MenuItem key={`zone_${i}`} value={zone}>
        {zone}
      </MenuItem>
    ));
  };

  getDstChangeValues = () => {
    return DSTValues.map(dst => (
      <MenuItem key={dst.label} value={dst.value}>
        {dst.label}
      </MenuItem>
    ));
  };

  render() {
    const { t, disabled } = this.props;
    const {
      utcOffset,
      dstShift,
      dstStartDateTime,
      dstEndDateTime,
    } = this.state;
    const timeLabels = 'DATA.stations.form.section.time';
    const utcOffsetName = t(`${timeLabels}.timeZone`);
    const dstShiftName = t(`${timeLabels}.DSTChange`);
    const dstStartName = t(`${timeLabels}.DSTStartDateTime`);
    const dstEndName = t(`${timeLabels}.DSTEndDateTime`);
    const dstEndValidityMsg = t('ERRORS.STATIONS.endDate');
    const areDatesDisabled = dstShift === '0h00';

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl required>
            <InputLabel htmlFor="utcOffset">{utcOffsetName}</InputLabel>
            <Select
              value={utcOffset}
              onChange={this.handleChange()}
              inputProps={{
                name: 'utcOffset',
                id: 'utcOffset',
                required: true,
              }}
              required
              disabled={disabled}
            >
              {this.getTimeZones()}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl required>
            <InputLabel htmlFor="dstShift">{dstShiftName}</InputLabel>
            <Select
              value={dstShift}
              onChange={this.handleChange()}
              inputProps={{
                name: 'dstShift',
                id: 'dstShift',
                required: true,
              }}
              required
              disabled={disabled}
            >
              {this.getDstChangeValues()}
            </Select>
          </FormControl>
        </Grid>
        {!areDatesDisabled && (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <PickersWrapper>
              <Grid item xs={12} sm={12}>
                <DateTimePicker
                  id="dstStartDateTime"
                  name="dstStartDateTime"
                  ampm={false}
                  className="picker-field"
                  label={dstStartName}
                  format="yyyy/MM/dd HH:mm:ss"
                  placeholder="YYYY/MM/DD HH:mm:ss"
                  value={dstStartDateTime}
                  onChange={this.handleChange(true, 'dstStartDateTime')}
                  disabled={disabled}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment style={{ cursor: 'pointer' }}>
                        <Icon margin="0" iconcolor="#0A75C2">
                          date_range
                        </Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <DateTimePicker
                  className={
                    dstEndDateTime < dstStartDateTime && dstEndDateTime !== null
                      ? 'picker-field error'
                      : 'picker-field'
                  }
                  id="dstEndDateTime"
                  name="dstEndDateTime"
                  disabled={disabled || (dstStartDateTime ? false : true)}
                  ampm={false}
                  label={dstEndName}
                  minDate={dstStartDateTime}
                  format="yyyy/MM/dd HH:mm:ss"
                  placeholder="YYYY/MM/DD HH:mm:ss"
                  minDateMessage={dstEndValidityMsg}
                  value={dstStartDateTime ? dstEndDateTime : null}
                  onChange={this.handleChange(true, 'dstEndDateTime')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment style={{ cursor: 'pointer' }}>
                        <Icon margin="0" iconcolor="#0A75C2">
                          date_range
                        </Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </PickersWrapper>
          </MuiPickersUtilsProvider>
        )}
      </Grid>
    );
  }
}

TimeZone.propTypes = {
  t: PropTypes.func.isRequired,
  station: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    code: PropTypes.string,
    country: PropTypes.string,
    region: PropTypes.string,
    dst: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dstEndDateTime: PropTypes.string,
    dstStartDateTime: PropTypes.string,
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

TimeZone.defaultProps = {
  station: {},
  onChange: () => {},
  disabled: false,
};

export default TimeZone;
