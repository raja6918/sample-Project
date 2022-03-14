import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
} from '@material-ui/core';
import { timeCreator } from './utils';
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import './TimeRangePicker.css';
import { MuiPickersUtilsProvider, ClockView } from '@material-ui/pickers';
import {
  AccessTime,
  Search,
  ChevronLeft,
  ChevronRight,
  HighlightOff,
} from '@material-ui/icons';
import { defaultTime, format, singleDateLength } from './constant';
import { addEventsToInputs, spliter } from './helper';
import SierraTooltip from '../../_shared/components/SierraTooltip';

function TimeRangePicker(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [traversedtoEnd, changeTraverse] = useState(false);
  const [textValue, handleTextValue] = useState('');
  const [value, handleTimeChange] = useState(defaultTime);
  const [startValue, handleStartValue] = useState(value);
  const [endValue, handleEndValue] = useState(startValue);
  const [type, changeType] = useState('hours');
  const [valueType, changeValueType] = useState(props.startLabel);
  const dfTime = moment(defaultTime).format(format);
  const inputRef = useRef(null);

  // required to show ellipsis correctly on date range field.
  const removeFocus = () => {
    const elements = document.querySelectorAll('#time-range-picker');
    elements.forEach(element => element.blur());
  };

  useEffect(() => {
    removeFocus();
    props.inputRef(inputRef.current); // passing on input ref to the parent
  });

  const openDialog = () => setIsOpen(true);

  /**
   * @function closeDialog
   * @description Used to close the dialogs and set to defaults
   */

  const closeDialog = () => {
    setIsOpen(false);
    changeType('hours');
    changeValueType(props.startLabel);
    if (textValue !== '') {
      const startEndDate = spliter(textValue);
      if (startEndDate.length) {
        const start = startEndDate[0]
          ? timeCreator(startEndDate[0])
          : defaultTime;
        const end = startEndDate[1] ? timeCreator(startEndDate[1]) : start;
        handleStartValue(start);
        handleEndValue(end);
        handleTimeChange(start);
      }
    } else {
      handleStartValue(defaultTime);
      handleEndValue(defaultTime);
      handleTimeChange(defaultTime);
    }
    removeFocus();
  };
  /**
   * @function handleClockChange
   * @param {*} time
   * @description Used to set the hour,minute value for either start time or end time
   */

  const handleClockChange = (time, isFinish = false, type = 'hour') => {
    handleTimeChange(time);
    if (type === 'hour' && isFinish) changeType('minutes');
    if (valueType === props.startLabel) {
      handleStartValue(time);
      if (!traversedtoEnd) handleEndValue(time);
      return;
    }
    handleEndValue(time);
  };

  /**
   * @function handleNavigation
   * @description Used to set values on Arrow clicks
   */
  const handleNavigation = (current = 'start') => {
    if (!traversedtoEnd) handleEndValue(startValue);
    changeTraverse(true);
    changeValueType(current !== 'start' ? props.startLabel : props.endLabel);
    changeType('hours');
    handleTimeChange(current !== 'start' ? startValue : endValue);
  };
  /**
   * @function clearField
   * @description Used to clear the input field and reset the value
   */
  const clearField = () => {
    handleTimeChange(defaultTime);
    handleStartValue(defaultTime);
    handleEndValue(defaultTime);
    changeTraverse(false);
    handleTextValue('');
    if (props.filterOpen) addEventsToInputs(inputRef.current, '');
  };

  useEffect(() => {
    clearField();
  }, [props.filterOpen]);

  /**
   * @function handleOk
   * @description Used on dialog OK action , passes start Time and end Time to the
   * onChange callback
   */
  const handleOk = () => {
    setIsOpen(false);
    const start = moment(startValue).format(format);
    const end = moment(endValue).format(format);
    const endTimenottraversed = textValue === '' && !traversedtoEnd;
    const endTimeSameAsStart = start === end;
    const text =
      endTimenottraversed || endTimeSameAsStart ? start : `${start} - ${end}`;
    handleTextValue(text);
    changeType('hours');
    changeValueType(props.startLabel);
    handleTimeChange(startValue);
    addEventsToInputs(inputRef.current, text);
    removeFocus();
  };

  const checkOnChange = e => {
    props.onChange(e);
  };

  return (
    <React.Fragment>
      <SierraTooltip
        position="bottom"
        html={<p style={{ padding: '7px' }}>{textValue}</p>}
        title={' '}
        disabled={textValue.length <= singleDateLength}
        style={{
          padding: 0,
          border: 0,
        }}
      >
        <Input
          id="time-range-picker"
          value={textValue}
          type="text"
          inputProps={{ onClick: openDialog, onFocus: openDialog }}
          onChange={checkOnChange}
          className="mui-ctrp-text"
          inputRef={inputRef}
          disableUnderline={true}
          placeholder={props.placeholder}
          readOnly
          startAdornment={<Search onClick={openDialog}>search</Search>}
          endAdornment={
            !textValue ? (
              <AccessTime className="mui-ctrp-clock" onClick={openDialog}>
                clock
              </AccessTime>
            ) : (
              <HighlightOff className="mui-ctrp-clear" onClick={clearField}>
                close
              </HighlightOff>
            )
          }
        />
      </SierraTooltip>
      <Dialog open={isOpen} className="mui-ctrp-dialog">
        <Grid container className="mui-ctrp-container">
          <Grid className="mui-ctrp-left" item xs={2}>
            {valueType !== props.startLabel && (
              <ChevronLeft
                className="mui-ctrp-leftchevron"
                disabled={true}
                onClick={() => handleNavigation('end')}
              />
            )}
          </Grid>
          <Grid item className="mui-ctrp-middle" xs={8}>
            <Grid className="mui-ctrp-middletitle">{valueType}</Grid>
            <Grid className="mui-ctrp-middlehourmin">
              <span
                className={
                  'hourLabel' + (type !== 'hours' ? ' mui-ctrp-selected' : '')
                }
                onClick={() => changeType('hours')}
              >
                {moment(
                  valueType === props.startLabel ? startValue : endValue
                ).format('HH')}
              </span>
              <span className="mui-ctrp-selected hourminseperator">:</span>
              <span
                className={
                  'minLabel' + (type !== 'minutes' ? ' mui-ctrp-selected' : '')
                }
                onClick={() => changeType('minutes')}
              >
                {moment(
                  valueType === props.startLabel ? startValue : endValue
                ).format('mm')}
              </span>
            </Grid>
          </Grid>
          <Grid className="mui-ctrp-right" item xs={2}>
            {valueType === props.startLabel && (
              <ChevronRight
                className="mui-ctrp-rightchevron"
                onClick={() => handleNavigation('start')}
              />
            )}
          </Grid>
        </Grid>
        <DialogContent className="mui-ctrp-dialogcontent">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ClockView
              type={type}
              date={value}
              ampm={false}
              onMinutesChange={(time, isFinish) =>
                handleClockChange(time, isFinish, 'minutes')
              }
              onHourChange={(time, isFinish) =>
                handleClockChange(time, isFinish)
              }
              onSecondsChange={time => {}}
            />
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions className="mui-ctrp-buttons">
          <Button onClick={closeDialog} color="primary">
            {props.cancelLabel}
          </Button>
          <Button onClick={handleOk} color="primary">
            {props.okLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

TimeRangePicker.propTypes = {
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  okLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  inputRef: PropTypes.func.isRequired,
  filterOpen: PropTypes.bool,
};

TimeRangePicker.defaultProps = {
  startLabel: 'BETWEEN',
  endLabel: 'AND',
  placeholder: 'Search',
  okLabel: 'OK',
  cancelLabel: 'CANCEL',
  filterOpen: false,
};

export default TimeRangePicker;
