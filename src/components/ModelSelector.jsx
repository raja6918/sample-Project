import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import MenuText from './Menu/MenuText';

const SelectBox = styled(FormControl)`
  width: 100%;
  & p {
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${props => (props.disabled ? 'currentColor' : 'inherit')};
  }
`;

class ModelSelector extends Component {
  state = {
    value: '',
  };

  onChange = e => {
    if (this.props.handleChange) {
      this.setState(
        {
          value: e.target.value,
        },
        () => this.props.handleChange(e.target.value)
      );
    } else {
      this.setState({
        value: e.target.value,
      });
    }
  };

  componentDidMount() {
    const { items, selected, setDefaultOption } = this.props;
    const value = !!selected || !setDefaultOption ? selected : items[0];

    this.setState({
      value,
    });
  }

  render() {
    const {
      name,
      label,
      required,
      items,
      disabled,
      menukey,
      menuitemlabel,
      placeholder,
      defaultValue,
    } = this.props;
    const { value } = this.state;

    return (
      <SelectBox>
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Select
          onChange={this.onChange}
          value={value}
          inputProps={{
            name: name,
            id: name,
            required: required || false,
          }}
          disabled={disabled}
        >
          <MenuItem value={defaultValue} style={{ display: 'none' }} disabled>
            <MenuText style={{ color: '#909090', fontSize: '16px' }}>
              {placeholder}
            </MenuText>
          </MenuItem>

          {items.map((data, key) => (
            <MenuItem key={data + key} value={menukey ? data[menukey] : data}>
              <MenuText>{menuitemlabel ? data[menuitemlabel] : data}</MenuText>
            </MenuItem>
          ))}
        </Select>
      </SelectBox>
    );
  }
}

ModelSelector.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleChange: PropTypes.func,
  selected: PropTypes.string,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  label: PropTypes.string,
  setDefaultOption: PropTypes.bool,
  disabled: PropTypes.bool,
  menukey: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  menuitemlabel: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
    PropTypes.null,
  ]),
  placeholder: PropTypes.string,
};

ModelSelector.defaultProps = {
  handleChange: () => {},
  selected: '',
  required: false,
  label: '',
  setDefaultOption: true,
  disabled: false,
  menukey: false,
  menuitemlabel: false,
  placeholder: '',
  defaultValue: '',
};

export default ModelSelector;
