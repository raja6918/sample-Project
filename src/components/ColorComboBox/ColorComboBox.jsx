import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import styled from 'styled-components';

const BoxContainer = styled.div`
  display: flex;
  width: ${props => props.width};
  height: 50px;
  justify-content: space-between;
`;

/**
 * ColorComboBox: Provides a colored dropdown of 2 sections, a main and sub
 */
export default class ColorComboBox extends Component {
  state = {
    selectValue: this.props.value || this.props.defaultValue,
  };

  selector = createRef();

  componentWillReceiveProps(nextProps) {
    // To revert to previous value if the API call failed
    if (nextProps.value !== this.state.selectValue && !nextProps.error) {
      this.setState({
        selectValue: nextProps.value || this.props.defaultValue,
      });
    }
  }

  handleChange = e => {
    this.setState({ selectValue: e.target.value }, () => {
      this.props.onChange(e.target.value);
    });
    // To remove input focus after selection
    if (this.selector) {
      this.selector.current.children[0].style.background = 'transparent';
      this.selector.current.classList.remove('Mui-focused');
    }
  };

  handleClick = () => {
    // To remove input focus after click
    if (this.selector) {
      this.selector.current.children[0].style.background = 'transparent';
      this.selector.current.classList.remove('Mui-focused');
    }

    // To remove any outer overlay if any when we use this component
    this.props.removeOverlay();
  };

  generateStyle = primaryColor => {
    const { defaultValue, style, error } = this.props;
    const { selectValue } = this.state;
    const zIndex = error ? 1001 : 1;
    const color = defaultValue === selectValue ? '#000000AB' : primaryColor;
    return { zIndex, color, ...style };
  };

  render() {
    const {
      primaryItems,
      secondaryItems,
      error,
      color,
      disabled,
      placeholder,
      defaultValue,
      width,
    } = this.props;
    const { selectValue } = this.state;

    return (
      <BoxContainer width={width}>
        <div
          style={{
            flexBasis: '5%',
            background: color,
            opacity: defaultValue === selectValue || disabled ? 0.2 : 1,
          }}
        />
        <div
          style={{ flexBasis: '90%', alignSelf: 'flex-end' }}
          className={error ? 'input-error' : ''}
        >
          <Select
            style={this.generateStyle(color)}
            onChange={this.handleChange}
            value={selectValue}
            disabled={disabled}
            ref={this.selector}
            onClick={this.handleClick}
          >
            <MenuItem value={defaultValue} style={{ display: 'none' }} disabled>
              {placeholder}
            </MenuItem>
            {primaryItems.length > 0 &&
              primaryItems.map((item, k) => (
                <MenuItem
                  key={k}
                  value={item.value}
                  style={{ color, fontWeight: 700 }}
                >
                  {item.label}
                </MenuItem>
              ))}
            {primaryItems.length > 0 && (
              <hr
                style={{
                  border: '1px solid #cccccc',
                  margin: '10px 17px',
                }}
              />
            )}
            {secondaryItems.length > 0 &&
              secondaryItems.map((item, k) => (
                <MenuItem key={k} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
          </Select>
        </div>
      </BoxContainer>
    );
  }
}

ColorComboBox.propTypes = {
  primaryItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.number,
      ]),
    })
  ).isRequired,
  secondaryItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
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
  disabled: PropTypes.bool,
  removeOverlay: PropTypes.func,
  defaultValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
    PropTypes.null,
  ]),
  color: PropTypes.string,
  placeholder: PropTypes.string,
  width: PropTypes.string,
};

ColorComboBox.defaultProps = {
  style: { width: '100%' },
  error: false,
  disabled: false,
  removeOverlay: () => null,
  value: null,
  defaultValue: '_default',
  color: '#000000AB',
  placeholder: '',
  width: '200px',
};
