import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SelectWrapped from './SelectWrapped';

const BoxContainer = styled.div`
  display: flex;
  width: ${props => `${props.width}px`};
  height: 50px;
  justify-content: space-between;

  & > div > div > div > div:nth-child(2) > div {
    padding: 0;
  }
  & > div > div > div:nth-child(3) {
    width: auto;
    min-width: ${props => `${props.width * 0.9}px`};
    max-width: ${props => `${props.width + 150}px`};
    & > div > div {
      white-space: nowrap;
      & > div {
        max-width: ${props => `${props.width + 100}px`};
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
`;

export default class ColorAutocompleteBox extends Component {
  state = {
    selectedOption: this.props.value || this.props.defaultValue,
  };

  componentWillReceiveProps(nextProps) {
    // To revert to previous value if the API call failed
    if (nextProps.value !== this.state.selectValue && !nextProps.error) {
      this.setState({ selectedOption: nextProps.value });
    }
  }

  handleChange = selectedOption => {
    const { onChange } = this.props;
    const value = selectedOption ? selectedOption.value : null;
    this.setState({ selectedOption: value }, () => {
      onChange(value);
    });
  };

  getProcessedData = data => {
    const options = [...data];
    const primaryData = [];
    const secondaryData = [];
    options.forEach(item => {
      if (item.primary) primaryData.push(item);
      else secondaryData.push(item);
    });
    if (primaryData.length) {
      primaryData.sort((a, b) => a.label.localeCompare(b.label));
      primaryData[primaryData.length - 1].primaryLast = true;
    }
    if (secondaryData.length) {
      secondaryData.sort((a, b) => a.label.localeCompare(b.label));
    }
    return primaryData.concat(secondaryData);
  };

  render() {
    const { selectedOption } = this.state;
    const {
      placeholder,
      defaultValue,
      width,
      color,
      disabled,
      options,
      value,
    } = this.props;

    return (
      <BoxContainer width={width}>
        <div
          style={{
            flexBasis: '5%',
            background: color,
            opacity: !selectedOption || disabled ? 0.2 : 1,
          }}
        />
        <div style={{ flexBasis: '90%', alignSelf: 'flex-end' }}>
          <SelectWrapped
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            options={this.getProcessedData(options)}
            onChange={this.handleChange}
            disabled={disabled}
            color={color}
          />
        </div>
      </BoxContainer>
    );
  }
}

ColorAutocompleteBox.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.boolean,
    PropTypes.string,
    PropTypes.number,
  ]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.boolean,
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      primary: PropTypes.boolean,
      primaryLast: PropTypes.boolean,
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
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  width: PropTypes.number,
  color: PropTypes.string,
};

ColorAutocompleteBox.defaultProps = {
  value: null,
  error: false,
  defaultValue: null,
  disabled: false,
  placeholder: '',
  width: 200,
  color: '#000000AB',
};
