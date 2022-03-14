import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ResetButton from './ResetButton';
import { ERROR_ZINDEX } from './constants';
import './style.scss';

export default class SelectInput extends Component {
  state = {
    selectValue:
      this.props.value === null ? this.props.defaultValue : this.props.value,
  };

  selector = createRef();

  componentWillReceiveProps(nextProps) {
    // To revert to previous value if the API call failed if value props is injected
    if (nextProps.value !== null) {
      if (nextProps.value !== this.state.selectValue && !nextProps.error) {
        this.setState({
          selectValue: nextProps.value,
        });
      }
    }
  }

  handleChange = e => {
    this.setState({ selectValue: e.target.value }, () => {
      this.props.onChange(e.target.value, this.props.data);
    });
    // To remove input focus after selection
    this.selector.current.children[0].style.background = 'transparent';
    this.selector.current.classList.remove('Mui-focused');
  };

  handleClick = () => {
    // To remove input focus after click
    this.selector.current.children[0].style.background = 'transparent';
    this.selector.current.classList.remove('Mui-focused');

    // To remove any outer overlay if any when we use this component
    this.props.removeOverlay();
  };

  generateStyle = () => {
    const zIndex = this.props.error ? ERROR_ZINDEX : 1;
    return { zIndex, ...this.props.style };
  };

  resetToDefaultValue = () => {
    this.setState({
      selectValue:
        this.props.value === undefined || this.props.value === null
          ? this.props.defaultValue
          : this.props.value,
    });
  };

  render() {
    const {
      value,
      data,
      items,
      error,
      handleDisable,
      enableReset,
      handleReset,
      handleTooltipDisable,
      getTooltipContent,
      placeholder,
      defaultValue,
    } = this.props;
    const { selectValue } = this.state;

    const disabled = handleDisable(value, data);
    const tooltipDisabled = handleTooltipDisable(value, data);
    const tooltipContent = getTooltipContent(value, data);

    return (
      <span className={error ? 'input-error' : ''}>
        {' '}
        <Select
          style={this.generateStyle()}
          onChange={this.handleChange}
          value={selectValue}
          disabled={disabled}
          ref={this.selector}
          onClick={this.handleClick}
          className={
            selectValue === defaultValue ? 'select-input-placeholder' : ''
          }
        >
          <MenuItem value={defaultValue} style={{ display: 'none' }} disabled>
            {placeholder}
          </MenuItem>
          {items.map((item, k) => (
            <MenuItem key={k} value={item.value}>
              {item.display}
            </MenuItem>
          ))}
        </Select>
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
    );
  }
}

SelectInput.propTypes = {
  data: PropTypes.shape(),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      display: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.number,
      ]),
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
  style: PropTypes.shape(),
  error: PropTypes.bool,
  handleDisable: PropTypes.func,
  enableReset: PropTypes.bool,
  handleReset: PropTypes.func,
  handleTooltipDisable: PropTypes.func,
  getTooltipContent: PropTypes.func,
  removeOverlay: PropTypes.func,
  defaultValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
    PropTypes.null,
  ]),
  placeholder: PropTypes.string,
};

SelectInput.defaultProps = {
  style: { width: '100%' },
  error: false,
  handleDisable: () => false,
  enableReset: false,
  handleReset: () => null,
  handleTooltipDisable: () => false,
  getTooltipContent: () => '',
  removeOverlay: () => null,
  defaultValue: '_default',
  data: {},
  placeholder: '',
  value: null,
};
