import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import styled from 'styled-components';
import { Link as RRLink } from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';
import ListMUI from '@material-ui/core/List';
import ListItemMUI from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import HamburguerIcon from '@material-ui/icons/Menu';

import AccessEnabler from '../AccessEnabler';
import history from '../../history';
import storage from '../../utils/storage';
import scopes from '../../constants/scopes';

import Icon from '../Icon';
import IconsPath from './icons/IconsPath';
import './NavBar.css';
import { perfectScrollConfig, currentScenario } from '../../utils/common';

import {
  ScenariosLink,
  PairingsLink,
  SolverLink,
  DataLink,
  ReportsLink,
  DashboardLink,
  SettingsLink,
} from './constants';
import { connect } from 'react-redux';
import { READ_ONLY } from '../../constants';

const HamburgerBTN = styled(IconButton)`
  margin-left: -12px;
  margin-right: 15px;
  width: 48px;
  height: 48px;
  span {
    color: ${props => (props.disabled ? 'inherit' : '#fff')};
  }
  @media (max-width: 576px) {
    margin-right: 0;
  }
`;

const DrawerContent = styled.div`
  width: 320px;
  overflow-x: hidden;
  outline: none;
`;

const Link = styled(RRLink)`
  text-decoration: none;
  width: 100%;
  padding: 12px 24px;
`;

const ProfileContent = styled.div`
  position: relative;
  padding-bottom: 12px;

  & div.profile-content span {
    width: 56px;
    vertical-align: top;
  }

  & div:first-child span p.userName-first {
    margin: 18px auto;
    width: 100%;
    font-size: 15px;
    padding-left: 0px;
  }
  & p {
    margin: 0;
    color: #fff;
    font-size: 16px;
    font-weight: normal;
    padding-left: 15px;
    vertical-align: bottom;
  }
  & span,
  & p {
    display: inline-block;
  }

  & div[role='button'] span,
  & div[role='button'] p {
    display: inline-block;
    vertical-align: middle;
  }
  & div[role='button'] p {
    padding-left: 0;
  }
`;
const CloseChevron = styled.button`
  height: 24px;
  padding: 0;
  border: 0;
  background-color: transparent;
  position: absolute;
  right: -8px;
  top: 12px;
  cursor: pointer;
  & span {
    width: 100%;
    height: 100%;
    margin: 0;
  }
`;

const List = styled(ListMUI)`
  padding: 0;
  & p.heading {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #bae1fc;
    padding: 14px 2px 14px 75px;
    max-width: 310px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  & a {
    display: inline-flex;
    align-items: center;
  }
  & a p {
    font-size: 16px;
    color: #fff;
    margin: 0;
  }
`;

const ListItem = styled(ListItemMUI)`
  padding: ${props => (props.submenu ? '0 0 0 48px' : '0')};
  background-color: ${props => (props.currentSelected ? '#BAE1FC' : 'none')};
  &:hover {
    background: #e8f4fc;
    & p,
    & span {
      color: #0a75c2 !important;
    }
    & path,
    & polygon {
      fill: #0a75c2 !important;
    }
  }
`;

const Ellipsis = styled.p`
  width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DrawerUI = styled(Drawer)`
  color: #fff;
  & > div:nth-child(3n) {
    background-image: linear-gradient(
      0deg,
      #004c8c -2%,
      #0a75c2 1%,
      #012b4f 95%
    );
  }
`;

const MenuItem = ({
  icon,
  link,
  text,
  onClick,
  needState,
  isDisable,
  selected,
  appendResourceId = true,
  submenu,
  ...rest
}) => {
  const openedScenario = storage.getItem('openScenario');
  let route = null;

  if (
    ((history.location && history.location.state) || openedScenario) &&
    needState
  ) {
    const openItemId =
      history.location && history.location.state !== undefined
        ? history.location.state.openItemId
        : openedScenario.id;
    const openItemName =
      history.location.state !== undefined
        ? history.location.state.openItemName
        : openedScenario.name;

    const readOnly =
      history.location.state !== undefined
        ? history.location.state.readOnly
        : openedScenario.status === READ_ONLY
        ? true
        : false;
    const editMode =
      history.location.state !== undefined
        ? history.location.state.editMode
        : !!openedScenario.isTemplate;

    const isScenariosLink = link === ScenariosLink;
    const shouldOpenedScenarioBeUsed = isScenariosLink && !!openedScenario;

    route = {
      pathname: appendResourceId ? `${link}/${openItemId}` : link,
      state: {
        openItemId: shouldOpenedScenarioBeUsed ? openedScenario.id : openItemId,
        openItemName: shouldOpenedScenarioBeUsed
          ? openedScenario.name
          : openItemName,
        editMode,
        readOnly: isScenariosLink ? false : readOnly,
      },
    };
  } else {
    route = link;
  }

  return (
    <ListItem
      currentSelected={selected}
      button
      onClick={onClick}
      disabled={isDisable}
      submenu={!!submenu}
      {...rest}
    >
      <Link to={route}>
        <ListItemIcon style={{ minWidth: '48px' }}>
          <SvgIcon style={{ margin: '0 24px 0 0' }}>
            <IconsPath
              icon={icon}
              color={{ fill: selected ? '#0A75C2' : '#fff' }}
            />
          </SvgIcon>
        </ListItemIcon>
        <p style={{ color: selected ? '#0A75C2' : '#fff' }}>{text}</p>
      </Link>
    </ListItem>
  );
};

export class HamburgerDrawer extends Component {
  state = {
    openDrawer: false,
    showSettings: false,
    enableLine: true,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.closeNavBar) {
      this.setState({ openDrawer: false, showSettings: false });
    }
  }

  toggleDrawer = () => {
    this.setState({ openDrawer: !this.state.openDrawer, showSettings: false });
  };

  toggleSettings = () => {
    this.setState({ showSettings: !this.state.showSettings });
  };

  createRoute = path => {
    let route = path;
    const openedScenario = storage.getItem('openScenario');
    if (openedScenario) {
      route = {
        pathname: path,
        state: {
          openItemId: openedScenario.id,
          openItemName: openedScenario.name,
          editMode: !!openedScenario.isTemplate,
          readOnly: openedScenario.status === READ_ONLY,
        },
      };
    }
    return route;
  };

  render() {
    const { openDrawer } = this.state;
    const { t, disabled, userPermissions, currentSelected } = this.props;
    const hamburgerMenu = 'NAVBAR.hamburgerMenu';
    const userName = this.props.userName;
    const openScenario = storage.getItem('openScenario');
    const isThereAnItemOpened = openScenario !== null;
    const isDisable =
      typeof history.location.state === 'undefined' && !isThereAnItemOpened;

    const editMode = history.location.state
      ? history.location.state.editMode
      : openScenario && !!openScenario.isTemplate;

    const currentSelectedScenario = currentScenario();

    return (
      <Fragment>
        <HamburgerBTN
          onClick={this.toggleDrawer}
          aria-label="Menu"
          disabled={disabled}
          className="tm-hamburger__menu-btn"
        >
          <HamburguerIcon />
        </HamburgerBTN>
        <DrawerUI open={openDrawer} onClose={this.toggleDrawer}>
          <PerfectScrollbar option={perfectScrollConfig}>
            <DrawerContent
              tabIndex={0}
              role="button"
              className="hamburger-scroll"
            >
              <ProfileContent>
                <div className="profile-content">
                  <CloseChevron onClick={this.toggleDrawer}>
                    <Icon iconcolor={'#fff'}>chevron_left</Icon>
                  </CloseChevron>
                  {/* <div>
                    <Avatar userName={userName} />
                    <Ellipsis>{userName}</Ellipsis>
                  </div> */}
                </div>
                {!!userPermissions.length && (
                  <div className="heading1">MAIN MENU</div>
                )}
                <List component="nav">
                  <AccessEnabler
                    scopes={scopes.pages.dashboard}
                    render={props => (
                      <MenuItem
                        selected={currentSelected === 'dashboard'}
                        icon="dashboardIcon"
                        link={DashboardLink}
                        text={t(`${hamburgerMenu}.dashboard`)}
                        onClick={() => {}}
                        className="tm-hamburger_menu__dashboard-btn"
                        {...props}
                      />
                    )}
                  />
                  <AccessEnabler
                    scopes={scopes.pages.scenario}
                    render={() => (
                      <Fragment>
                        <MenuItem
                          selected={currentSelected === 'scenarios'}
                          icon="scenarioIcon"
                          link={ScenariosLink}
                          text={t(`${hamburgerMenu}.scenarios`)}
                          onClick={() => {
                            this.toggleDrawer();
                          }}
                          needState={isThereAnItemOpened}
                          appendResourceId={false}
                          className="tm-hamburger_menu__scenario-btn"
                        />
                        {currentSelectedScenario &&
                          !currentSelectedScenario.isTemplate && (
                            <List component="nav">
                              <p className="heading">
                                <i>{currentSelectedScenario.name}</i>
                              </p>
                              <MenuItem
                                selected={currentSelected === 'data'}
                                icon="dataIcon"
                                link={DataLink}
                                needState={true}
                                submenu
                                text={t(`${hamburgerMenu}.data`)}
                                onClick={() => {
                                  this.toggleDrawer();
                                }}
                                isDisable={isDisable}
                                className="tm-hamburger_menu__scenario_data-btn"
                              />
                              <MenuItem
                                selected={currentSelected === 'pairing'}
                                icon="pairingsIcon"
                                link={PairingsLink}
                                needState={true}
                                submenu
                                text={t(`${hamburgerMenu}.pairings`)}
                                onClick={() => {
                                  this.toggleDrawer();
                                }}
                                isDisable={!!editMode || isDisable}
                                className="tm-hamburger_menu__scenario_pairings-btn"
                              />
                              <MenuItem
                                selected={currentSelected === 'solver'}
                                icon="solverIcon"
                                submenu
                                link={SolverLink}
                                needState={true}
                                text={t(`${hamburgerMenu}.solver`)}
                                onClick={() => {
                                  this.toggleDrawer();
                                }}
                                isDisable={!!editMode || isDisable}
                                className="tm-hamburger_menu__scenario_solver-btn"
                              />

                              <MenuItem
                                selected={currentSelected === 'reports'}
                                submenu
                                icon="reportsIcon"
                                link={ReportsLink}
                                text={t(`${hamburgerMenu}.reports`)}
                                onClick={() => {}}
                                className="tm-hamburger_menu__scenario_reports-btn"
                              />

                              <MenuItem
                                selected={currentSelected === 'settings'}
                                submenu
                                icon="settingsIcon"
                                link={SettingsLink}
                                text={t('NAVBAR.menuProfile.settings')}
                                onClick={() => {}}
                                className="tm-hamburger_menu__scenario_settings-btn"
                              />
                            </List>
                          )}
                      </Fragment>
                    )}
                  />
                  <AccessEnabler
                    scopes={scopes.pages.templates}
                    render={() => {
                      const style =
                        currentSelected === 'templates'
                          ? { background: '#BAE1FC' }
                          : {};
                      const textStyle =
                        currentSelected === 'templates'
                          ? { color: '#0A75C2' }
                          : {};
                      return (
                        <Fragment>
                          <ListItem
                            style={style}
                            button
                            className="tm-hamburger_menu__templates-btn"
                          >
                            <Link
                              to={this.createRoute('/templates')}
                              onClick={() => {
                                this.toggleDrawer();
                              }}
                            >
                              <Icon
                                iconcolor={
                                  currentSelected === 'templates'
                                    ? '#0A75C2'
                                    : '#fff'
                                }
                                style={{ margin: '0 24px 0 0' }}
                              >
                                library_books
                              </Icon>
                              <p style={textStyle}>
                                {t(`${hamburgerMenu}.templates`)}
                              </p>
                            </Link>
                          </ListItem>
                          {currentSelectedScenario &&
                            currentSelectedScenario.isTemplate && (
                              <List component="nav">
                                <p className="heading">
                                  <i>{currentSelectedScenario.name}</i>
                                </p>
                                <MenuItem
                                  selected={currentSelected === 'data'}
                                  icon="dataIcon"
                                  submenu
                                  link={DataLink}
                                  needState={true}
                                  text={t(`${hamburgerMenu}.data`)}
                                  onClick={() => {
                                    this.toggleDrawer();
                                  }}
                                  isDisable={isDisable}
                                  className="tm-hamburger_menu__templates_data-btn"
                                />
                              </List>
                            )}
                        </Fragment>
                      );
                    }}
                  />
                </List>
                <AccessEnabler
                  scopes={scopes.pages.users}
                  render={() => {
                    const style =
                      currentSelected === 'users'
                        ? { background: '#BAE1FC' }
                        : {};
                    const textStyle =
                      currentSelected === 'users' ? { color: '#0A75C2' } : {};
                    return (
                      <ListItem
                        style={style}
                        button
                        className="tm-hamburger_menu__users-btn"
                      >
                        <Link
                          to={this.createRoute('/users')}
                          onClick={() => {
                            this.toggleDrawer();
                          }}
                        >
                          <Icon
                            iconcolor={
                              currentSelected === 'users' ? '#0A75C2' : '#fff'
                            }
                            style={{ margin: '0 24px 0 0' }}
                          >
                            people
                          </Icon>
                          <p style={textStyle}>{t(`${hamburgerMenu}.users`)}</p>
                        </Link>
                      </ListItem>
                    );
                  }}
                />
              </ProfileContent>
            </DrawerContent>
          </PerfectScrollbar>
        </DrawerUI>
      </Fragment>
    );
  }
}

const mapStatetoProps = state => {
  return {
    notificationsCount: state.notifications.count,
    closeNavBar: state.notifications.closeNavBar,
    userPermissions: state.user.permissions,
    currentSelected: state.notifications.currentNav,
  };
};

MenuItem.propTypes = {
  icon: PropTypes.string.isRequired,
  link: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  needState: PropTypes.bool,
  isDisable: PropTypes.bool,
  appendResourceId: PropTypes.bool,
  closeNavBar: PropTypes.bool,
  selected: PropTypes.bool,
  submenu: PropTypes.bool,
};
MenuItem.defaultProps = {
  onClick: () => {},
  link: '',
  needState: null,
  isDisable: null,
  appendResourceId: true,
  closeNavBar: false,
  selected: false,
  submenu: false,
};
HamburgerDrawer.propTypes = {
  t: PropTypes.func.isRequired,
  userName: PropTypes.string,
  disabled: PropTypes.bool,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentSelected: PropTypes.string,
};

HamburgerDrawer.defaultProps = {
  userName: '',
  disabled: false,
  currentSelected: '',
};

const HamburgerDrawerComponent = connect(mapStatetoProps)(HamburgerDrawer);

export default translate()(HamburgerDrawerComponent);
