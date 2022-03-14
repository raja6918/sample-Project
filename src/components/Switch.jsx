import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SwitchWrapper = styled.div`
  & label {
    cursor: pointer;
  }
  & label input {
    display: none;
  }
  & .switch {
    width: 40px;
    height: 20px;
    background-color: ${props => (!props.checked ? '#757575' : '#0A75C2')};
    border-radius: 10px;
    position: relative;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }

  & .switch .handler {
    background-color: #fff;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: absolute;
    box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.8);
    left: ${props => (!props.checked ? '4px' : '24px')};
    top: 4px;
    -webkit-transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }
`;

const Switch = ({ name, label, checked, onChange }) => (
  <SwitchWrapper checked={checked}>
    <label htmlFor={name}>
      <div className="switch">
        <span className="handler" />
      </div>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        value={checked}
        onChange={onChange}
      />
    </label>
  </SwitchWrapper>
);

Switch.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
};

Switch.defaultProps = {
  onChange: () => {},
  checked: false,
  label: '',
};

export default Switch;
