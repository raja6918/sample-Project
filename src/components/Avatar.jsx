import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getFirstLetters } from '../utils/common';

const UserIcon = styled.span`
  background: ${props =>
    props.disabled ? 'rgba(255,255,255, 0.5)' : '#5098e7'};
  border-radius: 2px;
  display: inline-block;
  min-width: 34px;
  width: 100%;

  .userName-first {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    text-align: center;
    color: #ffffff;
    margin: 7px 7px;
    opacity: 0.85;
  }
`;

class ProfileIcon extends Component {
  render() {
    return (
      <React.Fragment>
        <UserIcon disabled={this.props.disabled}>
          <p className="userName-first">
            {getFirstLetters(this.props.firstName, this.props.lastName)}
          </p>
        </UserIcon>
      </React.Fragment>
    );
  }
}

ProfileIcon.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

ProfileIcon.defaultProps = {
  disabled: false,
};

export default ProfileIcon;
