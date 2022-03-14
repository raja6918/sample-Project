import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Loading from './components/Loading';
import { Router, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import scenariosService from './services/Scenarios/';
import templateService from './services/Templates/';

// import JssProvider from 'react-jss/lib/JssProvider';
// import { JssProvider } from 'react-jss';
import { create } from 'jss';
import {
  createGenerateClassName,
  jssPreset,
  StylesProvider,
} from '@material-ui/core/styles';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import storage from './utils/storage';
import * as keycloakService from '../src/services/Keycloak';

import registerServiceWorker from './registerServiceWorker';
import Auth from './components/Auth';

import Home from './App';
import { Provider } from 'react-redux';

import history from './history';

// Register all your Broadcast Channels when app boot up
import './utils/broadCast';

//store
import store from './store';
import { setUserDetails, setPermissions } from '../src/actions/user';
import keycloak from './keycloak';
import { ReactKeycloakProvider } from '@react-keycloak/web';

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById('jss-insertion-point'),
});

const theme = createMuiTheme({
  palette: {
    primary: { main: '#0A75C2' },
    secondary: {
      light: '#ed9d78',
      main: '#ff650c',
      contrastText: '#FFF',
    },
    error: {
      main: '#D50000',
    },
  },
});

class MyApp extends React.Component {
  logout = async () => {
    const locallyOpenedScenario = storage.getItem('openScenario');
    try {
      if (locallyOpenedScenario) {
        if (locallyOpenedScenario.isTemplate) {
          await templateService.closeTemplate(locallyOpenedScenario.id);
        } else {
          await scenariosService.closeScenario(locallyOpenedScenario.id);
        }
      }
    } catch (e) {
      console.error(e);
    }
    storage.removeItem('jwt');
    storage.removeItem('loggedUser');
    storage.removeItem(`timelineFilter1`);
    storage.removeItem(`timelineFilter2`);
    storage.removeItem(`timelineFilter3`);
    storage.removeItem(`pairingStore`);
    storage.removeItem('openScenario');
    keycloak.logout({ redirectUri: window.location.origin });
  };

  render() {
    return (
      <Router history={history}>
        <StylesProvider jss={jss} generateClassName={generateClassName}>
          <I18nextProvider i18n={i18n}>
            <MuiThemeProvider theme={theme}>
              <React.Fragment>
                <CssBaseline />
                <Switch>
                  <Route path="/logout" render={() => this.logout()} />
                  <Auth path="/" render={() => <Home />} />
                </Switch>
              </React.Fragment>
            </MuiThemeProvider>
          </I18nextProvider>
        </StylesProvider>
      </Router>
    );
  }
}

const Jsx = () => {
  const [authenticated, setAuthenticatedStatus] = useState(false);
  const eventLogger = () => {};

  const tokenExchanger = async subjectToken => {
    try {
      const exchangeTokens = await keycloakService.getResourceToken(
        subjectToken.token
      );
      storage.setItem('jwt', {
        token: exchangeTokens.access_token,
        refresh_token: subjectToken.refreshToken,
      });
      store.dispatch(setPermissions(exchangeTokens.access_token));
      setAuthenticatedStatus(true);
    } catch (err) {
      console.error(err);
    }
  };

  const tokenLogger = tokens => {
    if (tokens.token) {
      const userDetails = keycloak.idTokenParsed;
      const {
        email,
        family_name,
        given_name,
        preferred_username,
        Role,
        userid,
      } = userDetails;
      let roles = [];
      if (Array.isArray(Role) && Role.length) {
        roles = Role.filter(
          r => !['keycloak_non_deletable', 'default-roles-sierra'].includes(r)
        );
      }
      const userinfo = {
        email,
        firstName: given_name,
        lastName: family_name,
        username: preferred_username,
        id: userid,
        role: roles.length ? roles[0] : 'Anonymous', // considering user will have one role
      };
      storage.setItem('loggedUser', userinfo);
      store.dispatch(setUserDetails(userinfo));
      tokenExchanger(tokens);
    }
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      onEvent={eventLogger}
      onTokens={tokenLogger}
      initOptions={{ onLoad: 'login-required', checkLoginIframe: false }}
      LoadingComponent={<Loading />}
    >
      <Provider store={store}>{authenticated && <MyApp />}</Provider>
    </ReactKeycloakProvider>
  );
};

ReactDOM.render(<Jsx />, document.getElementById('root'));
registerServiceWorker();
