import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoComplete from '../../Autocomplete/AutoComplete';
import ResetButton from './ResetButton';
import './style.scss';

export default class AutoCompleteComboBox extends Component {
  state = {
    className: 'autocomplete-combobox',
    selectValue:
      this.props.value === undefined
        ? this.props.defaultValue
        : this.props.value,
  };

  componentWillReceiveProps(nextProps) {
    // To revert to previous value if the API call failed
    if (nextProps.value !== this.state.selectValue && !nextProps.error) {
      this.setState({ selectValue: nextProps.value });
    }
  }

  handleChange = value => {
    this.setState({ selectValue: value }, () => {
      if (value) this.props.onChange(value, this.props.data);
    });
  };

  handleFocus = () => {
    this.setState({
      className: 'autocomplete-combobox autocomplete-combobox-focused',
    });
  };

  handleOnBlur = () => {
    this.setState(prevState => ({
      selectValue: prevState.selectValue
        ? prevState.selectValue
        : this.props.value,
      className: 'autocomplete-combobox',
    }));
  };

  showSelectorBox = () => {
    setTimeout(() => {
      const Menu = document.querySelector('.Select-menu-outer');
      if (Menu) {
        Menu.scrollIntoView();
      }
    }, 50);
  };

  handleClick = () => {
    // To remove any outer overlay if any when we use this component
    this.props.removeOverlay();
    this.showSelectorBox();
  };

  render() {
    const { selectValue, className } = this.state;
    const {
      id,
      data,
      value,
      error,
      handleDisable,
      enableReset,
      handleReset,
      handleTooltipDisable,
      getTooltipContent,
      suggestions,
      style,
      placeholder,
    } = this.props;

    const disabled = handleDisable(value, data);
    const tooltipDisabled = handleTooltipDisable(value, data);
    const tooltipContent = getTooltipContent(value, data);

    return (
      <div
        className={
          error ? `${className} autocomplete-combobox-error` : className
        }
      >
        <AutoComplete
          id={id}
          name={id}
          setShrink={() => {}}
          suggestions={suggestions}
          style={style}
          onChange={this.handleChange}
          onClick={this.handleClick}
          onBlur={this.handleOnBlur}
          onFocus={this.handleFocus}
          value={selectValue}
          disabled={disabled}
          placeholder={placeholder}
        />
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
        )}
      </div>
    );
  }
}

AutoCompleteComboBox.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.shape(),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
    PropTypes.null,
  ]),
  style: PropTypes.shape(),
  handleDisable: PropTypes.func,
  enableReset: PropTypes.bool,
  handleReset: PropTypes.func,
  handleTooltipDisable: PropTypes.func,
  getTooltipContent: PropTypes.func,
  removeOverlay: PropTypes.func,
  placeholder: PropTypes.string,
};

AutoCompleteComboBox.defaultProps = {
  style: { width: '100%' },
  error: false,
  data: {},
  defaultValue: null,
  handleDisable: () => false,
  enableReset: false,
  handleReset: () => null,
  handleTooltipDisable: () => false,
  getTooltipContent: () => '',
  removeOverlay: () => null,
  placeholder: '',
};
