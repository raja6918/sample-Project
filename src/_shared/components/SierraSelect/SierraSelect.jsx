import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import className from 'classnames';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Popover from '@material-ui/core/Popover';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

import {
  checkAllAs,
  dataToArray,
  prepareData,
  selectedValues,
} from './helpers';
import './SierraSelect.css';

const StyledCheckbox = styled(Checkbox)`
  width: 42px;
  height: 42px;
`;

const StyledCheckboxList = styled.div`
  padding: 10px 22px;
  border-top: 1px solid rgba(151, 151, 151, 0.24);
  border-bottom: 1px solid rgba(151, 151, 151, 0.24);
  max-height: 220px;
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
`;

const StyledSecondaryButton = styled.div`
  color: ${props => (props.disabled ? 'rgba(0, 0, 0, 0.24)' : '#0a75c2')};
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  display: flex;
  align-items: center;
  margin-right: 15px;

  i {
    font-size: 18px;
  }
  .text {
    font-size: 12px;
  }
`;

const StyledFooter = styled.div`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledHeader = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  .info {
    color: rgba(0, 0, 0, 0.5);
    font-size: 12px;
    margin-right: 15px;
  }
`;

const Input = styled(TextField)`
  width: 100%;
  margin: 0;
  &.error > label {
    color: #d10000 !important;
  }
`;

const SecondaryButton = ({ children, ...restProps }) => {
  const { disabled, onClick } = restProps;
  const props = {
    ...restProps,
    onClick: disabled ? null : onClick,
  };
  return <StyledSecondaryButton {...props}>{children}</StyledSecondaryButton>;
};

class SierraSelect extends React.Component {
  state = {
    anchorEl: null,
    data: prepareData(this.props.data, this.props.value),
  };
  inputRef = React.createRef();

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  handleSelectAll = () => {
    const data = checkAllAs(this.state.data, true);
    this.setState({ data }, this.handlerAfterChange);
  };

  handleClearAll = () => {
    const data = checkAllAs(this.state.data, false);
    this.setState({ data }, this.handlerAfterChange);
  };

  handleChange = (event, checked) => {
    const value = event.target.value;

    this.setState(
      state => ({
        data: {
          ...state.data,
          [value]: { ...state.data[value], checked },
        },
      }),
      this.handlerAfterChange
    );
  };

  handleChangeGroup = (event, checked) => {
    const groupValue = event.target.value;
    const { data } = this.state;
    const newData = {};
    const keys = Object.keys(data);
    for (const key of keys) {
      if (data[key].groupValue === groupValue) {
        newData[key] = { ...data[key], checked };
      } else {
        newData[key] = { ...data[key] };
      }
    }
    this.setState({ data: newData }, this.handlerAfterChange);
  };

  handlerAfterChange = () => {
    const { data } = this.state;
    const { id, onChange } = this.props;
    const _selectedValues = selectedValues(data);
    onChange(_selectedValues, id);
  };

  render() {
    const { data, anchorEl } = this.state;
    const { disabled } = this.props;
    const open = Boolean(anchorEl);
    const arrayData = dataToArray(data);
    const { label, showSelectAll, showClearAll, groups, required } = this.props;
    const anchorElWidth = this.inputRef.current
      ? this.inputRef.current.parentElement.clientWidth
      : null;
    const optionChecked = option => option.checked;

    const groupProps = {};
    if (groups) {
      for (const group of groups) {
        const groupedOptions = arrayData.filter(
          option => option.groupValue === group.value
        );

        const allChecked = groupedOptions.every(optionChecked);
        const someChecked = groupedOptions.some(optionChecked);

        if (allChecked) {
          groupProps[group.value] = { checked: true };
        } else if (someChecked) {
          groupProps[group.value] = { indeterminate: true, checked: true };
        } else {
          groupProps[group.value] = { indeterminate: false, checked: false };
        }
      }
    }

    const someChecked = arrayData.some(optionChecked);
    const allChecked = arrayData.every(optionChecked);
    const selectedLabels = arrayData
      .filter(optionChecked)
      .map(option => option.label)
      .join(', ');
    const InputClassNames = className({ simulatedFocus: open });

    return (
      <React.Fragment>
        <Input
          className={InputClassNames}
          inputRef={this.inputRef}
          autoComplete="off"
          id="sierra-select"
          label={label}
          color="secondary"
          value={selectedLabels}
          onClick={this.handleClick}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <ArrowDropDownIcon
                  style={
                    disabled
                      ? { color: 'rgba(0, 0, 0, 0.25)' }
                      : { color: 'rgba(0, 0, 0, 0.54)' }
                  }
                />
              </InputAdornment>
            ),
          }}
          required={required}
          disabled={disabled}
          style={disabled ? { pointerEvents: 'none' } : {}}
        />
        <Popover
          open={open}
          disableAutoFocus={true}
          disableRestoreFocus={true}
          id="simple-popper"
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <div style={{ width: anchorElWidth }}>
            {groups && (
              <StyledHeader>
                <span className="info">Select:</span>
                <FormGroup row>
                  {groups.map(group => {
                    const props = { ...groupProps[group.value] };

                    return (
                      <FormControlLabel
                        key={group.value}
                        control={
                          <StyledCheckbox
                            onChange={this.handleChangeGroup}
                            value={group.value}
                            {...props}
                          />
                        }
                        label={group.label}
                        style={{ marginRight: '13px' }}
                      />
                    );
                  })}
                </FormGroup>
              </StyledHeader>
            )}
            <StyledCheckboxList>
              <FormGroup>
                {Object.keys(data).map(optionKey => {
                  const option = data[optionKey];
                  return (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <StyledCheckbox
                          checked={option.checked}
                          onChange={this.handleChange}
                          value={option.value}
                        />
                      }
                      label={option.label}
                    />
                  );
                })}
              </FormGroup>
            </StyledCheckboxList>
            <StyledFooter>
              {showSelectAll && (
                <SecondaryButton
                  disabled={allChecked}
                  onClick={this.handleSelectAll}
                >
                  <i className="material-icons">select_all</i>
                  <span className="text">Select all</span>
                </SecondaryButton>
              )}
              {showClearAll && (
                <SecondaryButton
                  disabled={!someChecked}
                  onClick={this.handleClearAll}
                >
                  <i className="material-icons">close</i>
                  <span className="text">Clear all</span>
                </SecondaryButton>
              )}
              <Button
                variant="contained"
                onClick={this.handleClose}
                color="primary"
                disabled={!someChecked}
              >
                ADD
              </Button>
            </StyledFooter>
          </div>
        </Popover>
      </React.Fragment>
    );
  }
}

SierraSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  showSelectAll: PropTypes.bool,
  showClearAll: PropTypes.bool,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  onChange: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.string),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

SierraSelect.defaultProps = {
  label: '',
  showSelectAll: true,
  showClearAll: true,
  data: [],
  groups: null,
  onChange: () => {},
  value: [],
  required: false,
  disabled: false,
};

export default SierraSelect;
