import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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

class InputSelector extends Component {
  state = {
    value: '',
  };

  onChange = e => {
    if (this.props.handleChange) {
      this.setState(
        {
          value: e.target.value,
        },
        this.props.handleChange(e.target.value)
      );
    } else {
      this.setState({
        value: e.target.value,
      });
    }
  };

  componentDidMount() {
    const { selected } = this.props;

    if (selected !== -1) {
      this.setState({
        value: selected,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.setState({
        value: nextProps.selected,
      });
    }
  }

  render() {
    const { name, label, required, items, disabled, displayed } = this.props;
    const { value } = this.state;

    return (
      <SelectBox disabled={disabled} required={required}>
        <InputLabel disabled={disabled} htmlFor={name}>
          {label}
        </InputLabel>
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
          {items.map(data => (
            <MenuItem key={data.id} value={data.id}>
              <MenuText>{data[displayed]}</MenuText>
            </MenuItem>
          ))}
        </Select>
      </SelectBox>
    );
  }
}
InputSelector.defaultProps = {
  label: '',
  required: false,
  selected: -1,
  handleChange: () => {},
  disabled: false,
  displayed: 'name',
};
InputSelector.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  required: PropTypes.bool,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleChange: PropTypes.func,
  disabled: PropTypes.bool,
  displayed: PropTypes.string,
};
export default InputSelector;
