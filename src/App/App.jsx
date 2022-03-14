import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import Notifications from './Notification';
import NavBar from '../components/NavBar';

import Loadable from '../components/Loadable';

import storage from '../utils/storage';
import ReadOnlyModeContext from './ReadOnlyModeContext';
import scopes from '../constants/scopes';
import { checkPermission } from '../utils/common';
import routeAnalytics from '../utils/analytics';
import { setCurrentMenu } from '../actions/generic';
import { connect } from 'react-redux';
import scenarioService from '../services/Scenarios/index';

export const AsyncUsers = Loadable({
  loader: () => import('./Users'),
});
export const AsyncRoles = Loadable({
  loader: () => import('./Roles'),
});
export const AsyncScenarios = Loadable({
  loader: () => import('./Scenarios'),
});
export const AsyncData = Loadable({
  loader: () => import('./Data'),
});

export const AsyncTemplates = Loadable({
  loader: () => import('./Templates'),
});

const AsyncSolver = Loadable({
  loader: () => import('./Solver'),
});

const AsyncPairings = Loadable({
  loader: () => import('./Pairings'),
});

const AsyncPairingsPreview = Loadable({
  loader: () => import('./Pairings/PairingsPreview'),
});

const AsyncPairingTabDetails = Loadable({
  loader: () =>
    import(
      './Pairings/components/Timeline/components/PairingDetails/PairingTabDetails'
    ),
});

const AsyncTestErrors = Loadable({
  loader: () => import('./../components/ErrorHandler/TestPage.jsx'),
});

const AsyncErrorPage = Loadable({
  loader: () => import('./../components/ErrorHandler/ErrorPage.jsx'),
});

const routes = [
  {
    path: '/scenarios',
    component: AsyncScenarios,
    exact: true,
    scopes: scopes.pages.scenario,
    name: 'scenarios',
  },
  {
    path: '/dashboard',
    component: AsyncErrorPage,
    exact: true,
    scopes: scopes.pages.dashboard,
    name: 'dashboard',
  },
  {
    path: '/templates',
    component: AsyncTemplates,
    exact: true,
    scopes: scopes.pages.templates,
    name: 'templates',
  },
  {
    path: '/users',
    component: AsyncUsers,
    exact: true,
    scopes: scopes.pages.users,
    name: 'users',
  },
  {
    path: '/users/roles',
    component: AsyncRoles,
    exact: true,
    scopes: scopes.pages.roles,
    name: 'users',
  },
  {
    path: '/data/:itemID',
    component: AsyncData,
    exact: false,
    scopes: [...scopes.pages.scenario, ...scopes.pages.templates],
    name: 'data',
  },
  {
    path: '/solver/:scenarioID',
    component: AsyncSolver,
    exact: false,
    scopes: scopes.pages.scenario,
    name: 'solver',
  },
  {
    path: '/pairings/:scenarioID',
    component: withRouter(AsyncPairings),
    exact: false,
    scopes: scopes.pages.scenario,
    name: 'pairing',
  },
  {
    path: '/settings',
    component: AsyncErrorPage,
    exact: true,
    scopes: scopes.pages.scenario,
    name: 'settings',
  },
  {
    path: '/reports',
    component: AsyncErrorPage,
    exact: true,
    scopes: scopes.pages.scenario,
    name: 'reports',
  },
  {
    path: '/pairings-preview/:previewID',
    component: withRouter(AsyncPairingsPreview),
    exact: false,
    scopes: scopes.pages.scenario,
    name: 'solver',
  },
  {
    path: '/pairing-details/:pairingID',
    component: withRouter(AsyncPairingTabDetails),
    exact: false,
    scopes: scopes.pages.scenario,
    name: 'pairing',
  },

  {
    path: '/test_errors', // This page should be removed in the comming days
    component: AsyncTestErrors,
    exact: false,
    scopes: 'all',
  },
  {
    path: null,
    component: AsyncErrorPage,
    exact: false,
    scopes: 'all',
  },
];

class App extends Component {
  state = {
    readOnly: false,
  };
  currentSelected = false;

  setReadOnly = readOnly => {
    this.setState({ readOnly: !!readOnly });
  };
  componentDidMount() {
    AsyncErrorPage.preload();
    scenarioService.deletePendingPreviews();
  }

  setHomePagePath = route => {
    switch (route.name) {
      case 'scenarios':
        return '/(scenarios)?';
      case 'dashboard':
        return '/(dashboard)?';
      case 'templates':
        return '/(templates)?';
      case 'users':
        return '/(users)?';
      default:
        return false;
    }
  };

  routeCreator = context => {
    const { userPermissions, t, setCurrentMenuNav } = this.props;
    const filteredRoutes = [];
    let homePageSet = false;
    routes.forEach((route, index) => {
      if (checkPermission(route.scopes, userPermissions)) {
        let routePath = route.path;
        if (!homePageSet) {
          routePath = this.setHomePagePath(route);
          if (!routePath) {
            routePath = null;
          } else {
            homePageSet = true;
          }
        }
        filteredRoutes.push(
          <Route
            key={index}
            path={routePath}
            exact={route.exact}
            render={props => {
              setCurrentMenuNav(route.name);
              routeAnalytics(props);
              return (
                <route.component
                  t={t}
                  name={route.name}
                  {...context}
                  {...props}
                />
              );
            }}
          />
        );
      } else {
        filteredRoutes.push(
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            render={() => {
              setCurrentMenuNav(route.name);
              const error = { response: { status: 403 } };
              return <AsyncErrorPage error={error} t={t} />;
            }}
          />
        );
      }
    });
    return filteredRoutes;
  };

  render() {
    const { t } = this.props;
    const loggedUser = storage.getItem('loggedUser');
    const { readOnly } = this.state;

    const context = {
      readOnly,
      setReadOnly: this.setReadOnly,
    };

    return (
      <ReadOnlyModeContext.Provider value={context}>
        <Notifications t={t} loggedUser={loggedUser} readOnly={readOnly}>
          <React.Fragment>
            <ReadOnlyModeContext.Consumer>
              {context => (
                <NavBar
                  currentPath={this.currentSelected}
                  {...context}
                  loggedUser={loggedUser}
                />
              )}
            </ReadOnlyModeContext.Consumer>
            <ReadOnlyModeContext.Consumer>
              {context => <Switch>{this.routeCreator(context)}</Switch>}
            </ReadOnlyModeContext.Consumer>
          </React.Fragment>
        </Notifications>
      </ReadOnlyModeContext.Provider>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state;
  return {
    userPermissions: user.permissions,
  };
};

const mapDispatchToProps = dispatch => ({
  setCurrentMenuNav: name => dispatch(setCurrentMenu(name)),
});

App.propTypes = {
  t: PropTypes.func.isRequired,
  userPermissions: PropTypes.shape([]).isRequired,
  setCurrentMenuNav: PropTypes.func.isRequired,
};

const AppComponent = connect(mapStateToProps, mapDispatchToProps)(App);

export default translate()(AppComponent);
