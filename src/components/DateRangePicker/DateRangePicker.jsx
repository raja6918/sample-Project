import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Button,
  Input,
  Dialog,
  DialogActions,
  Grid,
  DialogContent,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  Calendar,
  DatePicker,
} from '@material-ui/pickers';
import { DateRange, Search, HighlightOff } from '@material-ui/icons';
import DateFnsUtils from '@date-io/date-fns';
import './DateRangePicker.css';
import { addEventsToInputs } from './helper';
import SierraTooltip from '../../_shared/components/SierraTooltip';
import { t } from 'i18next';

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  height: 100px;
  padding-left: 20px;
  background-color: #0a75c2;
  color: #ffffff;
  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    & > span {
      color: #ffffff;
    }
    & > span:last-child {
      width: 50px;
      cursor: pointer;
    }
  }
  & > p {
    margin: 0;
    font-size: 20px;
  }
  span {
    color: rgba(255, 255, 255, 0.54);
  }
`;
const StyledDialogContent = styled(DialogContent)`
  overflow: hidden;
`;

/**
 * @function - CustomDateRangePicker
 * Custom date range picker made with MUI calender.
 */
function CustomDateRangePicker(props) {
  const ref = useRef(null);
  const dateFormat = 'YYYY-MM-DD';
  const displayDateFormat = 'DD/MM/YYYY';
  const toolBarDateFormat = 'MMM D, YYYY';
  const singleDateLength = 10;
  const startupDate = moment(props.startupDate).toDate();

  const [currentDate, setCurrentDate] = useState(startupDate);
  const [selectedDates, setSelectedDates] = useState([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isYearPickerOpen, setYearPickerOpen] = useState(false);
  const [dateText, setDateText] = useState('');
  const [displayText, setdisplayText] = useState('');

  // required to show ellipsis correctly on date range field.
  const removeFocus = () => {
    const elements = document.querySelectorAll('#date-range-picker');
    elements.forEach(element => element.blur());
  };

  useEffect(() => {
    removeFocus();
    props.inputRef(ref.current);
  });

  // triggers on each date change and sets selected dates
  const handleChange = date => {
    let dates = Array.from(selectedDates);
    if (dates.length === 1) {
      if (moment(date).isBefore(dates[0])) {
        dates = [];
      }
    } else if (dates.length === 2) {
      dates = [];
    }
    dates.push(date);
    setCurrentDate(date);
    setSelectedDates(dates);
  };

  // day renderer, to color the selected and between dates
  const renderDay = (day, selectedDate, dayInCurrentMonth, dayComponent) => {
    let classes = 'all-dates';
    const currentDay = moment(day).format(dateFormat);
    const startDate = moment(selectedDates[0]).format(dateFormat);
    if (selectedDates.length === 1) {
      if (moment(currentDay).isSame(startDate) && dayInCurrentMonth)
        classes += ' selected-dates';
    } else if (selectedDates.length === 2) {
      const endDate = moment(selectedDates[1]).format(dateFormat);
      const startDiff = moment(startDate).diff(currentDay);
      const endDiff = moment(endDate).diff(currentDay);
      if (startDiff < 0 && endDiff > 0 && dayInCurrentMonth) {
        classes += ' between-dates';
      }
      if (
        (moment(currentDay).isSame(endDate) ||
          moment(currentDay).isSame(startDate)) &&
        dayInCurrentMonth
      ) {
        classes += ' selected-dates';
      }
    }
    return <div className={classes}>{dayComponent}</div>;
  };

  // pass the dates to the input box after accepting a date
  const onAcceptDates = () => {
    let text = '';
    let displayText = '';
    setIsPickerOpen(false);
    if (selectedDates.length === 2) {
      const start = moment(selectedDates[0]).format(dateFormat);
      const end = moment(selectedDates[1]).format(dateFormat);
      const displayStart = moment(selectedDates[0]).format(displayDateFormat);
      const displayEnd = moment(selectedDates[1]).format(displayDateFormat);
      if (start === end) {
        text = start;
        displayText = displayStart;
      } else {
        text = `${start} - ${end}`;
        displayText = `${displayStart} - ${displayEnd}`;
      }
    } else if (selectedDates.length === 1) {
      text = moment(selectedDates[0]).format(dateFormat);
      displayText = moment(selectedDates[0]).format(displayDateFormat);
    }
    addEventsToInputs(ref.current, displayText);
    setDateText(text);
    setdisplayText(displayText);
    removeFocus();
  };

  // on cancelling the dialog, preserve the date from the input box
  const onCancel = () => {
    setIsPickerOpen(false);
    if (dateText !== '') {
      const startEndDate = dateText.split(' - ');
      const start = startEndDate[0]
        ? moment(moment(startEndDate[0], 'Y-M-D').format(dateFormat)).toDate()
        : new Date();
      const end = startEndDate[1]
        ? moment(moment(startEndDate[1], 'Y-M-D').format(dateFormat)).toDate()
        : start;
      setSelectedDates([start, end]);
      setCurrentDate(end || start);
    } else {
      setSelectedDates([]);
      setCurrentDate(startupDate);
    }
    removeFocus();
  };

  // clears the input field and resets the selected dates
  const clearField = () => {
    setCurrentDate(startupDate);
    setSelectedDates([]);
    setDateText('');
    setdisplayText('');
    if (props.filterOpen) addEventsToInputs(ref.current, '');
  };

  useEffect(clearField, [props.filterOpen]);

  return (
    <React.Fragment>
      <SierraTooltip
        position="bottom"
        html={<p style={{ padding: '7px' }}>{displayText}</p>}
        title={' '}
        disabled={dateText.length <= singleDateLength}
        style={{
          padding: 0,
          border: 0,
        }}
      >
        <Input
          id="date-range-picker"
          disableUnderline
          readOnly
          startAdornment={
            <Search onClick={() => setIsPickerOpen(true)}>Search</Search>
          }
          placeholder={t('SEARCHENGINE')}
          inputRef={ref}
          onChange={e => props.onChange(e)}
          endAdornment={
            !dateText ? (
              <DateRange
                className="mui-cdrp-calender"
                onClick={() => setIsPickerOpen(true)}
              >
                Search
              </DateRange>
            ) : (
              <HighlightOff onClick={clearField}>close</HighlightOff>
            )
          }
          inputProps={{
            onClick: () => setIsPickerOpen(true),
            onFocus: () => setIsPickerOpen(true),
          }}
          className="mui-cdrp-text"
        />
      </SierraTooltip>
      <Dialog open={isPickerOpen}>
        <StyledGrid>
          <div>
            <span>SELECT DATE RANGE</span>
            <span>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  views={['year', 'month']}
                  onChange={date => setCurrentDate(date)}
                  TextFieldComponent={DateRange}
                  onOpen={() => setYearPickerOpen(true)}
                  onClose={() => setYearPickerOpen(false)}
                />
              </MuiPickersUtilsProvider>
            </span>
          </div>
          <p>
            {selectedDates[0] ? (
              moment(selectedDates[0]).format(toolBarDateFormat)
            ) : (
              <span>START</span>
            )}
            <span style={{ margin: '0 5px' }}>-</span>
            {selectedDates[1] ? (
              moment(selectedDates[1]).format(toolBarDateFormat)
            ) : (
              <span>END</span>
            )}
          </p>
        </StyledGrid>
        <StyledDialogContent
          className={isYearPickerOpen ? 'hide-calender' : ''}
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Calendar
              date={currentDate}
              onChange={handleChange}
              renderDay={renderDay}
            />
          </MuiPickersUtilsProvider>
        </StyledDialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={onAcceptDates}
            color="primary"
            disabled={selectedDates.length === 0}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

CustomDateRangePicker.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  filterOpen: PropTypes.bool.isRequired,
  startupDate: PropTypes.date,
};

CustomDateRangePicker.defaultProps = {
  startupDate: new Date(),
};

export default CustomDateRangePicker;
