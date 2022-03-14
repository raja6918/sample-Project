import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import { getFirstLetters, shortenText } from '../../../utils/common';
import './Profile.scss';

const UserIcon = styled.span`
  background: #5098e7;
  border-radius: 2px;
  display: inline-block;
  min-width: 34px;
  width: 72px;
  height: 72px;
  font-family: 'Roboto', sans-serif;
  font-size: 32px;
  text-align: center;
  color: #ffffff;
  opacity: 0.85;
  padding: 16px 0;
`;

class Profile extends Component {
  render() {
    const { userRole, disabled, firstName, lastName } = this.props;
    return (
      <span className="user-nav-profile">
        <Grid container spacing={2} className="user-icon-grid">
          <Grid item className="item-cls">
            <UserIcon disabled={disabled}>
              {getFirstLetters(firstName, lastName)}
            </UserIcon>
          </Grid>
          <Grid item className="item-cls">
            <Grid container direction="column">
              <Grid item className="username">
                {shortenText(firstName, 18)}
                <br />
                {shortenText(lastName, 18)}
              </Grid>
              <Grid item className="role">
                {userRole}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </span>
    );
  }
}

Profile.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

Profile.defaultProps = {
  disabled: false,
};

export default Profile;
