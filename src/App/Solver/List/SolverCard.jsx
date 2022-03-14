import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { fullDisplay } from '../../../utils/dates';

import CheckboxMUI from '@material-ui/core/Checkbox';
import SolverIcon from '../SolverIcon/SolverIcon';
import ElapsedTime from './ElapsedTime';
import Icon from '../../../components/Icon';

import storage from '../../../utils/storage';
import { IDLE } from './constants';

const Holder = styled.div`
  cursor: pointer;
  width: 100%;
  height: 95px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.24);
`;

const CheckboxHolder = styled.div`
  border-right: 1px solid #eaeaea;
  display: inline-block;
  width: 12%;
  height: 100%;
  vertical-align: top;
  text-align: center;
  & .MuiIconButton-root:hover {
    /* background-color: transparent; */
  }
`;

const Checkbox = styled(CheckboxMUI)`
  font-size: 1.5rem;
  width: 20px;
  margin-top: 60%;
  vertical-align: top;
  /* padding: 12px; */
`;

const RequestHolder = styled.div`
  position: relative;
  display: inline-block;
  width: 88%;
  height: 100%;
  ${props => (props.active ? 'background-color: #BAE1FC;' : '')} &:hover {
    background-color: #e8f4fc;
  }
`;

const RequestInfo = styled.div`
  display: inline-block;
  width: 82%;
  padding-left: 2%;
  position: relative;

  & p {
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
  }

  p:first-of-type {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.87);
    text-align: left;
    margin-top: 17px;
    margin-bottom: 7px;
    font-weight: 400;
  }
  p:not(:first-of-type) {
    font-size: 12px;
    color: #5e5e5e;
  }
`;

const Endorse = styled.span`
  position: absolute;
  width: 0;
  height: 0;
  border-right: 20px solid #707070;
  border-top: 20px solid #707070;
  border-left: 20px solid transparent;
  border-bottom: 20px solid transparent;
  margin: ${props =>
    props.isIdle ? '0px 12px 7px -24px' : '0px 12px 7px -18px'};
  & .material-icons {
    position: relative;
    bottom: 19px;
    font-size: 21px;
    right: 2px;
  }
`;

class SolverCard extends Component {
  componentWillMount() {
    window.addEventListener(
      'beforeunload',
      () => {
        storage.removeItem('requestDates');
      },
      false
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      'beforeunload',
      () => {
        storage.removeItem('requestDates');
      },
      false
    );
    storage.removeItem('requestDates');
  }

  onClick = () => {
    this.props.handleClick(this.props.request);
  };

  handleCheckbox = () => {
    this.props.handleCheckbox(null, this.props.request);
  };

  render() {
    const { active, t, isSelected, request } = this.props;

    const isIdle = request.status.status === IDLE;
    const showElapsedTime = request.status.showTimer;
    const showSolverLaunchDate = request.status.dateCurrent;
    const showLabel = request.status.showLabel;
    const dateTime = ['Done-success', 'Done-stopped', 'Done-failed'].includes(
      request.status.status
    )
      ? fullDisplay(request.lastModified)
      : fullDisplay(request.creationDateTime);

    return (
      <Holder>
        <CheckboxHolder>
          <Checkbox
            color="secondary"
            checked={isSelected}
            onChange={this.handleCheckbox}
          />
        </CheckboxHolder>
        <RequestHolder active={active} onClick={this.onClick}>
          <RequestInfo>
            <p>{request.name}</p>
            <p>{request.crewGroupName}</p>
            {showLabel && (
              <p>
                {`${t(
                  `SOLVER.statusMessages.${request.status.status}.label`
                )} ${showSolverLaunchDate ? dateTime : ''}`}
                {showElapsedTime && (
                  <ElapsedTime
                    defaultTime={request.elapsedTime}
                    status={request.status.status}
                  />
                )}
              </p>
            )}
          </RequestInfo>
          <SolverIcon
            style={{
              position: 'relative',
              bottom: showLabel ? '18px' : '0px',
            }}
            status={request.status.status}
          />
          {request.isEndorsed && (
            <Endorse isIdle={isIdle}>
              <Icon margin="0" iconcolor="#FFF">
                favorite
              </Icon>
            </Endorse>
          )}
        </RequestHolder>
      </Holder>
    );
  }
}

SolverCard.propTypes = {
  request: PropTypes.shape().isRequired,
  active: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
  handleCheckbox: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

SolverCard.defaultProps = {
  isSelected: false,
  active: null,
};

export default SolverCard;
