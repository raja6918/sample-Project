import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import LeftMenu from './LeftMenu';
import HomeComponent from './Home';
import IntegrationAlerts from './components/IntegrationAlerts/';
import Loading from '../../components/Loading';
import { isBoolean } from 'lodash';

import { getRoutes } from './leftMenuConstants';

import storage from '../../utils/storage';
import { getDataHomeCards } from './../../services/Home/';
import { getDynamicRenderRules } from '../../services/Data/import';
import {
  getImportProcess,
  getErrorsSummary,
  hideError,
} from '../../services/Data/import';

import { complementDataHome } from '././homeConfig';
import { complementDynamicRules } from './Import/importConfig';
import { currentScenario, checkIsTemplate, Sort } from '../../utils/common';
import { connect } from 'react-redux';
import { READ_ONLY } from '../../constants';

export const Container = styled.div`
  margin: 0;
  padding: 0;
  width: ${props => (props.open ? 'calc(100% - 256px)' : 'calc(100% - 65px)')};
  height: calc(100vh - 54px);
  vertical-align: top;
  display: inline-block;
  transition: all 0.2s ease;
`;
export class Data extends Component {
  state = {
    open:
      storage.getItem('openedDataLeftMenu') === null
        ? false
        : storage.getItem('openedDataLeftMenu'),
    homeCards: [],
    scenarioBinId: null,
    importConfig: [],
    importFileOptions: [],
    importProcess: null,
    isFetching: true,
    importErrors: {},
  };

  routes = Sort(getRoutes(this.props.t), 'name');

  handleExpandCollapseMenu = () => {
    storage.setItem('openedDataLeftMenu', !this.state.open);
    this.setState({ open: !this.state.open });
  };

  getLocationState = () => {
    const currentPath = this.props.match.url;
    const { location: locationConfig } = this.props;

    // const editMode = locationConfig.state
    //   ? locationConfig.state.editMode
    //   : false;

    const editMode = checkIsTemplate();

    const openItemId = locationConfig.state
      ? locationConfig.state.openItemId
      : currentPath.split('/').pop();

    let openItemName = locationConfig.state
      ? locationConfig.state.openItemName
      : '';

    let readOnly = locationConfig.state ? locationConfig.state.readOnly : false;
    //additional check if history variable is null
    if (openItemName === '' || !readOnly) {
      const openScenario = currentScenario();
      if (openScenario) {
        openItemName = openScenario.name;
        readOnly = openScenario.status === READ_ONLY;
      }
    }

    return {
      editMode,
      openItemId,
      openItemName,
      readOnly,
    };
  };

  componentDidMount() {
    const { openItemId: scenarioId, editMode } = this.getLocationState();
    const { userData } = this.props;
    const userId = userData.id;
    const getImportData = {
      scenarioId,
      userId,
      state: 'IN_PROGRESS',
    };

    const scenarioImportPromises = !editMode
      ? Promise.all([getDynamicRenderRules(), getImportProcess(getImportData)])
      : Promise.resolve(null);

    const promises = [
      this.wrapSafePromise(scenarioImportPromises),
      this.fetchHomeCards(),
      this.fetchHomeErrors(),
    ];
    Promise.all(promises).then(
      ([scenarioImportResponses, dataHomeResponse, importErrors]) => {
        const importProcessData =
          scenarioImportResponses !== null
            ? this.buildImportProcessData(scenarioImportResponses)
            : {};
        const {
          homeCards: cards,
          binId: scenarioBinId,
        } = this.buildHomeCardsData(dataHomeResponse);

        const homeCards =
          importErrors && importErrors.total > 0
            ? this.setHomeCardsErrors(importErrors, cards)
            : cards;

        this.setState(
          {
            ...importProcessData,
            homeCards,
            scenarioBinId,
            importErrors,
          },
          () => {
            this.setIsFetching(false);
          }
        );
      }
    );

    if (
      isBoolean(this.props.readOnly) &&
      this.getLocationState().readOnly !== this.props.readOnly
    ) {
      this.props.setReadOnly(this.getLocationState().readOnly);
    }
  }

  wrapSafePromise = (promise, defaultReturnValue = null) =>
    new Promise(resolve => {
      promise.then(resolve).catch(() => resolve(defaultReturnValue));
    });

  buildImportProcessData = ([dynamicRender, importProcess]) => {
    const { t } = this.props;

    const { importConfig, importFileOptions } = complementDynamicRules(
      dynamicRender,
      t
    );

    return {
      importConfig,
      importFileOptions,
      importProcess: importProcess && importProcess[0],
    };
  };

  componentDidUpdate(prevProps) {
    const userWentBackToDataHome =
      !prevProps.match.isExact && this.props.match.isExact;
    if (userWentBackToDataHome) {
      this.getHomeCards();
    }
  }

  fetchHomeCards = () => {
    const scenarioId = this.getLocationState().openItemId;
    const { userData } = this.props;
    const userId = userData.id;

    return getDataHomeCards(scenarioId, userId);
  };

  getHomeCards = (isFetching = true) => {
    this.setState({ isFetching }, () => {
      this.fetchHomeCards()
        .then(this.buildHomeCardsData)
        .then(({ homeCards, binId }) => {
          const updatedState = { scenarioBinId: binId };

          this.fetchHomeErrors().then(importErrors => {
            updatedState.importErrors = importErrors;

            updatedState.homeCards =
              importErrors.total > 0
                ? this.setHomeCardsErrors(importErrors, homeCards)
                : homeCards;

            updatedState.isFetching = false;

            this.setState(updatedState);
          });
        });
    });
  };

  buildHomeCardsData = dataHomeResponse => {
    const { t } = this.props;

    const { dataTypes, binId } = dataHomeResponse;
    const homeCards = Sort(complementDataHome(dataTypes, t), 'name');

    return { homeCards, binId };
  };

  fetchHomeErrors = () => {
    const { openItemId: scenarioId } = this.getLocationState();
    const { userData } = this.props;
    const userId = userData.id;

    return getErrorsSummary(scenarioId, userId);
  };

  setHomeCardsErrors = (importErrors, homeCards) => {
    const dataTypes = importErrors.datatypes;
    const keyArray = Object.keys(dataTypes);

    if (keyArray.length > 0) {
      keyArray.forEach(dataType => {
        const index = homeCards.map(e => e.type).indexOf(dataType);
        if (index !== -1) {
          homeCards[index].errorCount = dataTypes[dataType].errors.length;
        }
      });
    }

    return homeCards;
  };

  removeError = error => {
    const { importErrors, homeCards: cards } = { ...this.state };
    const [dataType, id] = error.split('-');

    const errorArray = importErrors.datatypes[dataType].errors;

    const eId = isNaN(id) ? id : +id;
    const errorIndex = errorArray.findIndex(e => e.id === eId.toString());
    errorArray.splice(errorIndex, 1);

    --importErrors.total;

    const homecards = this.setHomeCardsErrors(importErrors, cards);

    if (errorArray.length === 0) {
      delete importErrors.datatypes[dataType];
    }

    this.setState({ importErrors, homeCards: [...homecards] }, () => {
      hideError(id).catch(error => {
        console.error(error);
      });
    });
  };

  updateBinId = scenarioBinId => {
    this.setState({ scenarioBinId });
  };

  setIsFetching = isFetching => {
    this.setState({ isFetching });
  };

  render() {
    const openScenario = storage.getItem('openScenario');
    // To temporarily fix the issue when you open data pages in new tab
    if (!openScenario) return <Redirect to="/" />;

    const { t, location: locationConfig } = this.props;
    const {
      open,
      homeCards,
      scenarioBinId,
      importConfig,
      importFileOptions,
      importProcess,
      isFetching,
      importErrors,
    } = this.state;
    const current_path = this.props.match.url;
    const location = locationConfig.pathname;

    const locationState = this.getLocationState();
    const { editMode, readOnly } = locationState;
    const showAlertsBar =
      !readOnly &&
      !editMode &&
      !isFetching &&
      importErrors &&
      importErrors.total > 0;

    return (
      <React.Fragment>
        {current_path === location && (
          <HomeComponent
            t={t}
            path={current_path}
            {...locationState}
            readOnly={readOnly}
            cards={homeCards}
            scenarioBinId={scenarioBinId}
            updateBinId={this.updateBinId}
            importConfig={importConfig}
            importFileOptions={importFileOptions}
            importProcess={importProcess}
            setIsFetching={this.setIsFetching}
            getHomeCards={this.getHomeCards}
            isFetching={isFetching}
          />
        )}
        {current_path !== location && (
          <React.Fragment>
            <LeftMenu
              t={t}
              current_path={current_path}
              location={location}
              options={this.routes}
              open={open}
              handleExpandCollapseMenu={this.handleExpandCollapseMenu}
              {...locationState}
            />

            <Container open={open}>
              <Switch>
                {this.routes.map((route, k) => {
                  return (
                    <Route
                      key={k}
                      path={`${current_path}${route.path}`}
                      render={() => (
                        <route.component t={t} {...locationState} />
                      )}
                      exact={true}
                    />
                  );
                })}
              </Switch>
            </Container>
          </React.Fragment>
        )}
        {showAlertsBar && (
          <IntegrationAlerts
            t={t}
            importErrors={importErrors}
            removeError={this.removeError}
          />
        )}
        {isFetching && current_path === location && <Loading />}
      </React.Fragment>
    );
  }
}

Data.propTypes = {
  t: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    state: PropTypes.shape({
      openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      openItemName: PropTypes.string.isRequired,
      editMode: PropTypes.bool,
    }),
  }).isRequired,
  match: PropTypes.shape({
    isExact: PropTypes.bool.isRequired,
    pathname: PropTypes.string,
    url: PropTypes.string.isRequired,
  }).isRequired,
  readOnly: PropTypes.bool,
  setReadOnly: PropTypes.func,
  userData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    userName: PropTypes.string,
  }),
};

const mapStateToProps = (state, props) => {
  return { userData: state.user.userData, ...props };
};

Data.defaultProps = {
  readOnly: false,
  setReadOnly: () => {},
  userData: {},
};

const DataComponent = withRouter(connect(mapStateToProps)(Data));
export default DataComponent;
