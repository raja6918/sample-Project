import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '../../components/Icon';
import sessionStorage from '../../utils/storage';

import Button from '@material-ui/core/Button';
import AccessEnabler from '../../components/AccessEnabler';
import solverScopes from '../../constants/scopes';

const MessageBar = styled.div`
  padding: 5px 27px;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  height: 48.5px;
  & div:first-child {
    width: 25%;
  }
  & div:nth-child(2) {
    width: 50%;
    text-align: center;
    & p {
      display: inline-flex;
      vertical-align: middle;
      align-items: center;
      margin: 0;
      font-size: 16px;
    }
  }
  & div:last-child {
    width: 25%;
    text-align: right;
    & button {
      padding: 0 15px;
      /* width: 134px; */
      min-height: 32px;
      font-size: 13px;
      line-height: 32px;
      text-transform: uppercase;
    }
    & button:first-child {
      background: #ffffff;
      border: 1px solid #0a75c2;
      border-radius: 2px;
      color: #0a75c2;
      margin-right: 5px;
    }
    & button:last-child {
      background: #0a75c2;
      border-radius: 2px;
      color: #fff;
      margin-left: 5px;
    }
  }

  & button {
    text-transform: none;
    border-color: #0a75c2;
  }

  & button:disabled {
    background: rgba(10, 117, 194, 0.7) !important;
  }

  @media only screen and (min-width: 1134px) and (max-width: 1164px) {
    & div:last-child {
      & button {
        padding: 0 10px;
        width: 130px;
      }
    }
  }

  @media only screen and (min-width: 826px) and (max-width: 1133px) {
    & div:first-child {
      width: 5%;
    }
    & div:nth-child(2) {
      width: 60%;
    }
    & div:last-child {
      width: 35%;
    }
  }

  @media only screen and (min-width: 768px) and (max-width: 825px) {
    & div:first-child {
      width: 5%;
    }
    & div:nth-child(2) {
      width: 50%;
      & p {
        font-size: 14px;
      }
    }
    & div:last-child {
      width: 45%;
    }
  }
`;
class PairingsSolverResults extends Component {
  disableSave = () => {
    const disableSave = sessionStorage.getItem('disableSave');

    if (disableSave) {
      return disableSave.status;
    }

    return false;
  };

  render() {
    const { handleClose, handleSave, location, t } = this.props;
    const solverName =
      location && location.state ? location.state.solverName : '';
    return (
      <MessageBar>
        <div />
        <div>
          <p>
            <Icon iconcolor="#0A75C2">visibility</Icon>
            <span>
              {t('PAIRINGS.solverResults.message')}
              <strong>{` ${solverName} `}</strong>
              {t('PAIRINGS.solverResults.viewOnly')}.
            </span>
          </p>
        </div>
        <div>
          <Button onClick={handleClose}>
            {t('PAIRINGS.solverResults.btnClosePreview')}
          </Button>
          <AccessEnabler
            scopes={solverScopes.solver.solverManage}
            disableComponent
            render={props => (
              <Button
                onClick={handleSave}
                disabled={this.disableSave() || props.disableComponent}
              >
                {t('PAIRINGS.solverResults.btnSavePairings')}
              </Button>
            )}
          />
        </div>
      </MessageBar>
    );
  }
}

PairingsSolverResults.propTypes = {
  location: PropTypes.shape({}).isRequired,
  t: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default PairingsSolverResults;
