import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import styled from 'styled-components';
import { Link as RRLink } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import Badge from '@material-ui/core/Badge';
import { connect } from 'react-redux';
import * as notificationService from '../../services/Notifications';

import MenuText from '../Menu/MenuText';
import Avatar from '../Avatar';
import HamburgerDrawerComp from './HamburgerDrawer';
import { MenuItemLink } from '../Menu/MenuItem';
import { disableNavigation, enableNotificationIcon } from './helpers';
import './NavBar.css';
import NotificationPanel from '../../components/NotificationPane/NotificationPane';
import storage from '../../utils/storage';
import {
  notificationDecrement,
  updateNotificationAsSeen,
  viewedAllStatus,
  notificationCleanUp,
  closeNotificationBar,
} from '../../actions/generic';
import { currentUserUpdated } from '../../actions/scenario';
import Profile from './UserProfile/Profile';
import upperFirst from 'lodash/upperFirst';
import { userDataCleanUp } from '../../actions/user';
import history from '../../history';

const Root = styled.div`
  width: 100%;
  min-height: 54px;
  height: 100%;
  & header > div {
    background: #004c8c;
    min-height: 54px;
    max-height: 54px;
  }
`;
const Title = styled(Typography)`
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  color: #fff;
  a {
    text-decoration: none;
    color: inherit;
  }
  @media (max-width: 576px) {
    display: none;
  }
`;
const ContainerBTNs = styled.div`
  flex: 1;
  div {
    display: flex;
    float: right;
  }
`;
const NotificationsBTN = styled(IconButton)`
  margin-right: 10px;
  color: #fff;
  width: 48px;
  height: 48px;
  @media (max-width: 576px) {
    margin-right: 0;
  }
`;
const ProfileBTN = styled(IconButton)`
  width: auto;
  color: #fff;
  border-radius: 0;
  padding-right: 0;
`;
const MenuProfile = styled(Menu)`
  top: 34px;
  & .MuiPaper-root {
    height: 171px;
    min-width: 336px;
    max-width: 433px;
    overflow: hidden;
    border-radius: 3px;
    box-shadow: 0 0 24px 0 rgb(0 0 0 / 35%);
  }
`;
const Link = styled(RRLink)`
  width: 100%;
  height: 100%;
  display: inline-flex;
  padding: 20px;
  text-decoration: none;
`;

export class NavBar extends Component {
  state = {
    anchorEl: null,
    isNotificationsOpen: false,
    firstName: '',
    lastName: '',
    role: '',
  };

  disableNavigation = false;
  enableNotificationIcon = false;
  componentDidMount() {
    const { firstName, lastName, role } = this.props.loggedUser;
    this.setState({ firstName, lastName, role });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.closeNavBar && this.state.isNotificationsOpen) {
      this.toggleNotificationPane();
    }
    if (nextProps.currentUserUpdated) {
      const { firstName, lastName, role } = storage.getItem('loggedUser');
      this.setState({ firstName, lastName, role }, () => {
        this.props.resetCurrentUserUpdated(false);
      });
    }
  }
  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  notificationViewed = () => {
    this.props.notificationViewed();
  };

  getRoute = () => {
    const { readOnly } = this.props;
    const openedScenario = storage.getItem('openScenario');
    let route = null;

    if ((history.location && history.location.state) || openedScenario) {
      const openItemId =
        history.location && history.location.state
          ? history.location.state.openItemId
          : openedScenario.id;
      const openItemName =
        history.location && history.location.state
          ? history.location.state.openItemName
          : openedScenario.name;

      route = {
        pathname: '/',
        state: {
          openItemId: openedScenario ? openedScenario.id : openItemId,
          openItemName: openedScenario ? openedScenario.name : openItemName,
          editMode: openedScenario ? openedScenario.isTemplate : false,
          readOnly,
        },
      };
    } else {
      route = '/';
    }

    return route;
  };

  toggleNotificationPane = () => {
    this.setState(
      prevState => ({
        isNotificationsOpen: !prevState.isNotificationsOpen,
      }),
      () => {
        if (this.state.isNotificationsOpen) {
          const { loggedUser } = this.props;
          const payload = {
            status: 'SEEN',
          };
          notificationService
            .updateAllNotifications(payload, loggedUser.id)
            .then(() => {
              this.props.viewedAllStatus();
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          this.props.updateNotificationAsSeen();
          if (this.props.notificationsCount) this.props.notificationViewed();
          this.props.closeNotificationBar(false);
        }
      }
    );
  };

  flushAllData = () => {
    const { notificationCleanUp, userDataCleanUp } = this.props;
    notificationCleanUp();
    userDataCleanUp();
  };

  render() {
    const { t, currentPath } = this.props;
    const {
      anchorEl,
      isNotificationsOpen,
      firstName,
      lastName,
      role,
    } = this.state;
    const open = Boolean(anchorEl);
    const menuProfile = 'NAVBAR.menuProfile';
    const fName = upperFirst(firstName);
    const lName = upperFirst(lastName);
    const userName = `fName lName`;
    this.disableNavigation = disableNavigation(location);
    this.enableNotificationIcon = enableNotificationIcon(location);
    return (
      <Root>
        <AppBar position="fixed">
          <Toolbar>
            <HamburgerDrawerComp
              t={t}
              userName={userName}
              disabled={this.disableNavigation}
              currentPath={currentPath}
            />
            <Title variant="title" color="inherit">
              {this.disableNavigation ? (
                <span>SIERRA</span>
              ) : (
                <RRLink to={this.getRoute()}>SIERRA</RRLink>
              )}
            </Title>
            {/*<SearchEngine />*/}
            <ContainerBTNs>
              <div>
                <NotificationsBTN
                  disabled={
                    this.disableNavigation && !this.enableNotificationIcon
                  }
                  onClick={this.toggleNotificationPane}
                >
                  <Badge
                    badgeContent={this.props.notificationsCount}
                    color="secondary"
                  >
                    <Icon>notifications</Icon>
                  </Badge>
                </NotificationsBTN>
                <ProfileBTN
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                  disabled={this.disableNavigation}
                >
                  <Avatar
                    firstName={fName}
                    lastName={lName}
                    disabled={this.disableNavigation}
                  />
                  <Icon>arrow_drop_down</Icon>
                </ProfileBTN>
                <MenuProfile
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <Profile
                    firstName={fName}
                    lastName={lName}
                    userRole={role}
                    disabled={this.disableNavigation}
                  />
                  {/* <MenuItem onClick={this.handleClose}>
                    <MenuIcon>person</MenuIcon>
                    <MenuText>{t(`${menuProfile}.profile`)}</MenuText>
                  </MenuItem> */}
                  {/* <MenuItem onClick={this.handleClose}>
                    <MenuIcon>settings</MenuIcon>
                    <MenuText>{t(`${menuProfile}.settings`)}</MenuText>
                  </MenuItem> */}
                  <Divider />
                  <MenuItemLink onClick={this.handleClose}>
                    <Link to="/logout" onClick={this.flushAllData}>
                      <MenuText
                        style={{ opacity: 0.9, fontWeight: 400 }}
                        textColor="#333333"
                      >
                        {t(`${menuProfile}.signOut`)}
                      </MenuText>
                    </Link>
                  </MenuItemLink>
                </MenuProfile>
              </div>
            </ContainerBTNs>
            <NotificationPanel
              t={t}
              isOpen={isNotificationsOpen}
              handleCancel={this.toggleNotificationPane}
            />
          </Toolbar>
        </AppBar>
      </Root>
    );
  }
}

const mapStatetoProps = state => {
  return {
    notificationsCount: state.notifications.count,
    closeNavBar: state.notifications.closeNavBar,
    currentUserUpdated: state.scenario.currentUserUpdated,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    notificationViewed: () => dispatch(notificationDecrement()),
    updateNotificationAsSeen: () => dispatch(updateNotificationAsSeen()),
    viewedAllStatus: () => dispatch(viewedAllStatus()),
    notificationCleanUp: () => dispatch(notificationCleanUp()),
    closeNotificationBar: () => dispatch(closeNotificationBar()),
    resetCurrentUserUpdated: bool => dispatch(currentUserUpdated(bool)),
    userDataCleanUp: () => dispatch(userDataCleanUp()),
  };
};

NavBar.propTypes = {
  t: PropTypes.func.isRequired,
  loggedUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    userName: PropTypes.string,
  }),
  notificationsCount: PropTypes.number,
  notificationViewed: PropTypes.func.isRequired,
  updateNotificationAsSeen: PropTypes.func.isRequired,
  viewedAllStatus: PropTypes.func.isRequired,
  notificationCleanUp: PropTypes.func.isRequired,
  closeNavBar: PropTypes.bool.isRequired,
  closeNotificationBar: PropTypes.func.isRequired,
  currentUserUpdated: PropTypes.bool.isRequired,
  resetCurrentUserUpdated: PropTypes.func.isRequired,
  userDataCleanUp: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

NavBar.defaultProps = {
  loggedUser: {},
  notificationsCount: 0,
  readOnly: false,
};
const NavComponent = connect(mapStatetoProps, mapDispatchToProps)(NavBar);
export default translate()(NavComponent);
