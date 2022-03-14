import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import ReadOnlyModeContext from '../../App/ReadOnlyModeContext';
import { formatDate } from '../../App/Data/utils/utils';
import storage from '../../utils/storage';
import AccessEnabler from '../../components/AccessEnabler';
import generalScopes from '../../../src/constants/scopes';

const textOverflowStyle = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 24px;
  position: relative;
  & h2 {
    font-weight: 400;
    margin: 0;
    width: 25%;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.87);
  }
  & p {
    font-size: 16px;
    text-align: center;
    width: 50%;
    color: rgba(0, 0, 0, 0.87);
    margin: 0;

    & > p {
      font-weight: 400;
      font-size: 13px;
      ${textOverflowStyle};
      color: #ff650c;
      width: 100%;
      margin-top: 5px;
    }
  }
  & div {
    position: absolute;
    top: 7px;
    right: 37px;
  }
  & .link {
    left: 6px;
    top: 42px;
  }
`;
Header.displayName = 'Header';

class AddHeader extends Component {
  state = {
    formattedDates: {},
  };

  componentDidMount() {
    this.updateDates();
  }

  updateDates = () => {
    const localOpenedScenario = storage.getItem('openScenario');
    const startDate = localOpenedScenario ? localOpenedScenario.startDate : '';
    const endDate = localOpenedScenario ? localOpenedScenario.endDate : '';
    const formattedDates = formatDate(startDate, endDate);
    this.setState({ formattedDates });
  };

  render() {
    const {
      name,
      onClick,
      openItemName,
      redirectLink,
      t,
      needAddButton,
      editMode,
      scopes,
      disableAdd,
      className,
    } = this.props;
    const { formattedStart, formattedEnd, days } = this.state.formattedDates;
    const viewOnlyText = t('SCENARIOS.viewOnly.viewOnlyText');

    return (
      <Header style={{ marginBottom: '0px' }}>
        <h2 style={{ fontSize: '20px' }}>
          {name}
          {redirectLink && (
            <span className="link">
              <br />
              {redirectLink}
            </span>
          )}
        </h2>

        <ReadOnlyModeContext.Consumer>
          {({ readOnly }) => (
            <React.Fragment>
              <AccessEnabler
                scopes={
                  editMode
                    ? generalScopes.template.manage
                    : generalScopes.scenario.manage
                }
                disableComponent
                render={props => (
                  <p>
                    {openItemName}
                    {readOnly || props.disableComponent
                      ? ` ${viewOnlyText}`
                      : ''}
                    {!editMode && (
                      <p>
                        {t('DATA.dateDetails', {
                          0: formattedStart,
                          1: formattedEnd,
                          2: days,
                        })}
                      </p>
                    )}
                  </p>
                )}
              />
              {needAddButton && (
                <div>
                  <AccessEnabler
                    scopes={scopes}
                    disableComponent={disableAdd}
                    render={props => (
                      <Fab
                        color="secondary"
                        onClick={onClick}
                        aria-label="add"
                        disabled={readOnly || props.disableComponent}
                        className={className}
                      >
                        <AddIcon />
                      </Fab>
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          )}
        </ReadOnlyModeContext.Consumer>
      </Header>
    );
  }
}

AddHeader.propTypes = {
  name: PropTypes.string,
  onClick: PropTypes.func,
  openItemName: PropTypes.string,
  t: PropTypes.func.isRequired,
  needAddButton: PropTypes.bool,
  redirectLink: PropTypes.oneOfType([PropTypes.element, PropTypes.null]),
  editMode: PropTypes.bool,
  scopes: PropTypes.arrayOf(PropTypes.string),
  disableAdd: PropTypes.bool,
  className: PropTypes.string,
};

AddHeader.defaultProps = {
  name: '',
  onClick: () => {},
  openItemName: '',
  needAddButton: true,
  redirectLink: null,
  editMode: false,
  scopes: undefined,
  disableAdd: false,
  className: '',
};
export default AddHeader;
