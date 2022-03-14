import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import DateFnsUtils from '@date-io/date-fns';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import ErrorMessage from '../../FormValidation/ErrorMessage';
import Icon from '../../Icon';
import {
  AddButton,
  DeleteBtn,
  Input,
  FormControl,
  CustomGrid,
  TimeIcon,
} from './Components';
import { POSITIVE_NUM_REGEX } from '../../../utils/formValidation/regexExpresions';
import { evaluateRegex } from '../../../utils/formValidation/validations';
import {
  extraTimeModel,
  extraTimeErrorModel,
  EXTRA_TIME_ROW_LIMIT,
} from './Constants';

export const TimePickerComponent = styled(TimePicker)`
  .MuiInputBase-input,
  .MuiInputAdornment-root {
    cursor: pointer;
  }
`;

class AddExtraTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      extraTimeDetails: {},
      extraTimeErrors: {},
      extraTimeCounter: 1,
      isAddBtnDisabled: false,
    };
    this.keyGenIndex = 1;
    this.buttonElement = null;
  }

  componentDidMount() {
    this.buttonElement = document.getElementById(this.props.buttonId);
  }

  componentWillMount() {
    const { extraTimeDetails, extraTimeErrors } = this.props;
    if (extraTimeDetails && extraTimeErrors) {
      this.mountExtraTimeRows(extraTimeDetails, this.state.extraTimeDetails);
      this.mountExtraTimeRows(extraTimeErrors, this.state.extraTimeErrors);
    } else if (extraTimeDetails && !extraTimeErrors) {
      this.mountExtraTimeRows(
        extraTimeDetails,
        this.state.extraTimeDetails,
        true
      );
    }
  }

  validateErrors = (e, keyRow, regex: '') => {
    const event = e.target || e.srcElement;
    const name = event.name;
    const value = event.value;

    const isError = value === '' ? false : !evaluateRegex(regex, value);
    this.setState(
      {
        extraTimeErrors: {
          ...this.state.extraTimeErrors,
          [keyRow]: {
            ...this.state.extraTimeErrors[keyRow],
            [name]: isError,
          },
        },
      },
      this.updateExtraTimeDetails
    );
  };

  updateExtraTimeDetails = () => {
    const { extraTimeDetails, extraTimeErrors } = this.state;
    const extraTime = {
      extraTimeDetails,
      extraTimeErrors,
    };

    this.props.updateExtraTimeDetails(extraTime);
  };

  handleInputChange = (e, keyRow) => {
    const event = e.target || e.srcElement;
    const name = event.name;
    const value = event.value;
    this.setState(
      {
        extraTimeDetails: {
          ...this.state.extraTimeDetails,
          [keyRow]: {
            ...this.state.extraTimeDetails[keyRow],
            [name]: value,
          },
        },
      },
      this.updateExtraTimeDetails
    );
  };

  handleChangePicker = (name, keyRow) => dateTime => {
    const { extraTimeDetails } = this.state;
    let isError = null;
    if (name === 'startTime') {
      isError = dateTime.getTime() > extraTimeDetails[keyRow].endTime.getTime();
    } else {
      isError =
        dateTime.getTime() < extraTimeDetails[keyRow].startTime.getTime();
    }

    this.setState(
      {
        extraTimeDetails: {
          ...this.state.extraTimeDetails,
          [keyRow]: {
            ...this.state.extraTimeDetails[keyRow],
            [name]: dateTime,
          },
        },
        extraTimeErrors: {
          ...this.state.extraTimeErrors,
          [keyRow]: {
            ...this.state.extraTimeErrors[keyRow],
            startEndTime: isError,
          },
        },
      },
      this.updateExtraTimeDetails
    );
  };

  newExtraTimeRow = operator => {
    const disabledAddBtn =
      this.state.extraTimeCounter + operator > EXTRA_TIME_ROW_LIMIT;
    this.keyGenIndex++;
    this.setState(
      {
        extraTimeCounter: this.state.extraTimeCounter + operator,
        isAddBtnDisabled: disabledAddBtn,
      },
      () => {
        this.updateExtraTimeDetails();
        this.buttonElement.scrollIntoView();
      }
    );
  };

  mountExtraTimeRows = (arr, target, initializeErrors = false) => {
    const extraTimeErrors = this.state.extraTimeErrors;
    this.keyGenIndex = arr.length + 1;
    arr.forEach((item, index) => {
      target[`timeRow_${index + 1}`] = target[`timeRow_${index + 1}`] || item;
      if (initializeErrors) {
        //Only for edit case
        extraTimeErrors[`timeRow_${index + 1}`] = extraTimeErrorModel;
      }
    });
    const disabledAddBtn = arr.length + 1 > EXTRA_TIME_ROW_LIMIT;
    this.setState({
      extraTimeCounter: arr.length + 1,
      isAddBtnDisabled: disabledAddBtn,
    });
  };

  addExtraTimeRow = () => {
    const { extraTimeDetails, extraTimeErrors, extraTimeCounter } = this.state;

    if (extraTimeCounter <= EXTRA_TIME_ROW_LIMIT) {
      extraTimeDetails[`timeRow_${this.keyGenIndex}`] =
        extraTimeDetails[`timeRow_${this.keyGenIndex}`] || extraTimeModel;
      extraTimeErrors[`timeRow_${this.keyGenIndex}`] =
        extraTimeErrors[`timeRow_${this.keyGenIndex}`] || extraTimeErrorModel;
      this.newExtraTimeRow(+1);
    }
  };

  deleteExtraTimeRow = key => {
    const { extraTimeDetails, extraTimeErrors } = this.state;
    if (
      Object.prototype.hasOwnProperty.call(extraTimeDetails, key) &&
      Object.prototype.hasOwnProperty.call(extraTimeErrors, key)
    ) {
      delete extraTimeDetails[key];
      delete extraTimeErrors[key];
      this.newExtraTimeRow(-1);
    } else {
      return true;
    }
  };

  render() {
    const { t, disabled } = this.props;
    const { extraTimeErrors, extraTimeDetails, isAddBtnDisabled } = this.state;
    const form = 'DATA.generic.extraTimes';
    const errorMsg = 'ERRORS.EXTRATIMES';
    const extraTimeRows = Object.keys(extraTimeDetails);
    return (
      <React.Fragment>
        {extraTimeRows.length !== 0 && (
          <React.Fragment>
            {extraTimeRows.map(keyRow => {
              const details = extraTimeDetails[keyRow];
              const errors = extraTimeErrors[keyRow];
              return (
                <Grid
                  container
                  spacing={0}
                  key={keyRow}
                  style={{ marginBottom: '10px' }}
                >
                  <CustomGrid item xs={11} sm={11}>
                    <Grid
                      container
                      spacing={8}
                      style={{ margin: '0', marginBottom: '10px' }}
                    >
                      <CustomGrid item xs={4} sm={4}>
                        <FormControl error={errors.extraTime}>
                          <Input
                            inputProps={{
                              maxLength: 3,
                            }}
                            className={errors.extraTime ? 'error' : ''}
                            id={`extraTime`}
                            name={`extraTime`}
                            label={t(`${form}.extraTime`)}
                            required
                            color="secondary"
                            defaultValue={details.extraTime}
                            error={errors.extraTime}
                            onChange={e => {
                              this.handleInputChange(e, keyRow);
                              this.validateErrors(
                                e,
                                keyRow,
                                POSITIVE_NUM_REGEX
                              );
                            }}
                            disabled={disabled}
                          />
                          <ErrorMessage
                            isVisible={errors.extraTime}
                            message={t(`${errorMsg}.extraTime`)}
                          />
                        </FormControl>
                      </CustomGrid>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <CustomGrid item xs={4} sm={4}>
                          <FormControl error={errors.startEndTime}>
                            <TimePickerComponent
                              name="startTime"
                              id="startTime"
                              ampm={false}
                              required
                              label={t(`${form}.startTime`)}
                              placeholder={'HH:MM'}
                              className={errors.startEndTime ? 'error' : ''}
                              value={
                                details.startTime ? details.startTime : null
                              }
                              onChange={this.handleChangePicker(
                                'startTime',
                                keyRow
                              )}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment>
                                    <TimeIcon margin="0" iconcolor="#0A75C2">
                                      access_time
                                    </TimeIcon>
                                  </InputAdornment>
                                ),
                                error: errors.startEndTime,
                              }}
                              disabled={disabled}
                            />
                            <ErrorMessage
                              isVisible={errors.startEndTime}
                              message={t(`${errorMsg}.startEndTime`)}
                            />
                          </FormControl>
                        </CustomGrid>

                        <CustomGrid item xs={4} sm={4}>
                          <TimePickerComponent
                            name="endTime"
                            id="endTime"
                            ampm={false}
                            required
                            label={t(`${form}.endTime`)}
                            placeholder={'HH:MM'}
                            value={details.endTime ? details.endTime : null}
                            onChange={this.handleChangePicker(
                              'endTime',
                              keyRow
                            )}
                            disabled={
                              disabled || (details.startTime ? false : true)
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment>
                                  <TimeIcon margin="0" iconcolor="#0A75C2">
                                    access_time
                                  </TimeIcon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </CustomGrid>
                      </MuiPickersUtilsProvider>
                    </Grid>
                  </CustomGrid>
                  <CustomGrid item xs={1} sm={1}>
                    <DeleteBtn
                      disabled={disabled}
                      color="primary"
                      component="span"
                      onClick={() => this.deleteExtraTimeRow(keyRow)}
                    >
                      <Icon margin="0" iconcolor="#0A75C2">
                        delete
                      </Icon>
                    </DeleteBtn>
                  </CustomGrid>
                </Grid>
              );
            })}
          </React.Fragment>
        )}
        <AddButton>
          <IconButton
            color="primary"
            component="span"
            onClick={this.addExtraTimeRow}
            disabled={disabled || isAddBtnDisabled}
            id={this.props.buttonId}
          >
            <Icon margin="0" iconcolor={isAddBtnDisabled ? '' : '#0A75C2'}>
              add_circle
            </Icon>
          </IconButton>
          <span
            onClick={
              isAddBtnDisabled || disabled ? () => null : this.addExtraTimeRow
            }
            className={isAddBtnDisabled || disabled ? 'disabled' : ''}
          >
            {t(`${form}.addExtraTime`)}
          </span>
        </AddButton>
      </React.Fragment>
    );
  }
}

AddExtraTime.propTypes = {
  t: PropTypes.func.isRequired,
  updateExtraTimeDetails: PropTypes.func.isRequired,
  extraTimeDetails: PropTypes.arrayOf(
    PropTypes.shape({
      extraTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      startTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      endTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ),
  extraTimeErrors: PropTypes.arrayOf(
    PropTypes.shape({
      extraTime: PropTypes.bool,
      starEndTime: PropTypes.bool,
    })
  ),
  buttonId: PropTypes.string,
  disabled: PropTypes.bool,
};

AddExtraTime.defaultProps = {
  extraTimeDetails: null,
  extraTimeErrors: null,
  buttonId: 'buttonId',
  disabled: false,
};

export default AddExtraTime;
