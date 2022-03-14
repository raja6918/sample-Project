import moment from 'moment';
import { checkIsTemplate } from './common';
import dataRegex from './constants';
import storage from './storage';
/**
 * @summary - push data to window.dataLayer for analytics
 * @param {*} data
 */
export const pushToAnalytics = data => {
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(data);
  }
};

/**
 * @summary - Generate planning period by scenario data
 * @param {*} scenario
 */
export const generateScenarioPlannigPeriod = (
  scenario,
  format = 'YY/MM/DD'
) => {
  if ('id' in scenario && !scenario.isTemplate) {
    const startDate = moment(scenario.startDate).format(format);
    const endDate = moment(scenario.endDate).format(format);
    return `${startDate}-${endDate}`;
  }
  return null;
};

/**
 * @summary-Generate data card analytics and push to the window dataLayer
 * @param {*} data
 * @param {*} iDataRecordAction -action performed
 */

export const pushDataToAnalytics = (data, iDataRecordAction = 'Create') => {
  const { scenarioId, type } = data;
  const openScenario = storage.getItem('openScenario');
  if ('id' in openScenario) {
    const isTemplate = !!openScenario.isTemplate || false;

    pushToAnalytics({
      event: 'sierraDataRecordStatus',
      iDataRecordLocation: isTemplate ? 'Template' : 'Scenario',
      iScenarioId: isTemplate ? null : scenarioId,
      iDataTemplateID: isTemplate ? scenarioId : null,
      iScenarioPlanningPeriod: generateScenarioPlannigPeriod(openScenario),
      iDataRecordType: type,
      iDataRecordAction,
    });
  }
};

export const dateDiff = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const diff = moment(endDate).diff(moment(startDate), 'days');
  return Number.isInteger(diff) ? diff : 0;
};

/**
 * @summary - Generate Template analytics and push to the window dataLayer
 * @param {*} template
 * @param {*} iDataTemplateActionStatus
 * @param {*} iDataTemplateCreatedFrom - Generated from Template or scenario
 */
export const pushTemplateDataToAnalytics = (
  template,
  iDataTemplateActionStatus = 'Create',
  iDataTemplateCreatedFrom = 'Template'
) => {
  const { id, sourceId, category } = template;
  pushToAnalytics({
    event: 'sierraDataTemplateStatus',
    iDataTemplateID: id,
    iDataTemplateSourceID: sourceId,
    iDataTemplateActionStatus,
    iDataTemplateCategory: category,
    iDataTemplateCreatedFrom,
  });
};

/**
 * @summary - Generate scenario analytics and push to the window dataLayer
 * @param {*} scenario
 * @param {*} status
 */
export const PushScenarioDataToAnalytics = (scenario, status = 'Create') => {
  const { startDate, endDate, id, sourceId } = scenario;

  pushToAnalytics({
    event: 'sierraScenarioStatus',
    iScenarioId: id,
    iScenarioDuration: dateDiff(startDate, endDate),
    iScenarioStartDate: moment(startDate).format('YY/MM/DD'),
    iScenarioEndDate: moment(endDate).format('YY/MM/DD'),
    iScenarioActionStatus: status,
    iDataTemplateId: sourceId,
  });
};

const generateRouteData = (payLoad, props) => {
  const { location, match } = props;
  const scenarioId = match.params.itemID;
  const user = storage.getItem('loggedUser');
  if (!!location && location.pathname) {
    dataRegex.forEach(dataObj => {
      if (dataObj.pattern.test(location.pathname)) {
        const isTemplate = checkIsTemplate();
        if (dataObj.name !== 'data-home') {
          payLoad.iPageTitle = `${dataObj.screen}`;
          payLoad.iPagePath = `${location.pathname}`;
          if (dataObj.dataCard) {
            const namePrefix = isTemplate ? 'Templates' : 'Scenario';
            const prefix = isTemplate ? '/templates' : '';
            payLoad.iPageTitle = `${namePrefix} ${payLoad.iPageTitle}`;
            payLoad.iPagePath = `${prefix}${payLoad.iPagePath}`;
          }
        }
        if (dataObj.name === 'data-home') {
          if (isTemplate) {
            payLoad.iPageTitle = 'Templates - Data - Home - Types Listing';
            payLoad.iPagePath = `/templates/${scenarioId}/data`;
          } else {
            payLoad.iPageTitle = 'Scenario Data - Home - Types Listing';
            payLoad.iPagePath = `/data/${scenarioId}`;
          }
        }
        if (!!user) {
          payLoad.iUserRole = user.role;
        }
      }
    });
  }

  return payLoad;
};

export const dataCardClassNames = (isTemplate, card) => {
  const key = isTemplate ? 'template' : 'scenario';
  switch (card.type) {
    case 'accommodation':
      return `tm-${key}_data_home__accommodations-btn`;
    case 'aircraftType':
      return `tm-${key}_data_home__aircraft_types-btn`;
    case 'commercialFlight':
      return `tm-${key}_data_home__commercial_flights-btn`;
    case 'coterminalTransport':
      return `tm-${key}_data_home__coterminal_transports-btn`;
    case 'country':
      return `tm-${key}_data_home__countries-btn`;
    case 'crewGroup':
      return `tm-${key}_data_home__crew_groups-btn`;
    case 'base':
      return `tm-${key}_data_home__crew_bases-btn`;
    case 'currency':
      return `tm-${key}_data_home__currencies-btn`;
    case 'flight':
      return `tm-${key}_data_home__operating_flights-btn`;
    case 'position':
      return `tm-${key}_data_home__positions-btn`;
    case 'region':
      return `tm-${key}_data_home__regions-btn`;
    case 'rule':
      return `tm-${key}_data_home__rules-btn`;
    case 'station':
      return `tm-${key}_data_home__stations-btn`;
    default:
      return '';
  }
};

const routeAnalytics = props => {
  let data = { event: 'sierraPageview' };

  data = generateRouteData(data, props);

  if (!!data.iPageTitle) {
    pushToAnalytics(data);
  }
};

export const pushSolverDataToAnalytics = (data = {}) => {
  const openScenario = storage.getItem('openScenario');
  const p = {
    event: 'sierraSolverRequestStatus',
    iScenarioId: openScenario.id,
    iScenarioPlanningPeriod: generateScenarioPlannigPeriod(openScenario),
    ...data,
  };
  pushToAnalytics(p);
};

export const pushSolverEventAnalytics = (data = {}) => {
  const openScenario = storage.getItem('openScenario');
  const p = {
    event: 'sierraSolverRequest',
    iScenarioId: openScenario.id,
    iScenarioPlanningPeriod: generateScenarioPlannigPeriod(openScenario),
    ...data,
  };
  pushToAnalytics(p);
};

export const pushBinDataToAnalytics = (data = {}) => {
  const openScenario = storage.getItem('openScenario');
  const p = {
    event: 'sierraDataBinCreated',
    iScenarioPlanningPeriod: generateScenarioPlannigPeriod(openScenario),
    ...data,
  };
  pushToAnalytics(p);
};

export const pushImportDataToAnalytics = (data = {}) => {
  const openScenario = storage.getItem('openScenario');
  const p = {
    event: 'sierraDataImportStatus',
    iScenarioPlanningPeriod: generateScenarioPlannigPeriod(openScenario),
    ...data,
  };
  pushToAnalytics(p);
};

export const pushRulesetDataToAnalytics = (data = {}) => {
  const openScenario = storage.getItem('openScenario');
  const p = {
    event: 'sierraRuleSetStatus',
    iScenarioPlanningPeriod: generateScenarioPlannigPeriod(openScenario),
    ...data,
  };
  pushToAnalytics(p);
};
export const pushRuleChangeDataToAnalytics = (data = {}) => {
  const p = { event: 'sierraRuleStatus', ...data };
  pushToAnalytics(p);
};

/**
 * Generate Gantt Filter data
 * @param {*} data
 * @param {*} type
 */
export const pushGanttFilterAnalytics = (data = [], type) => {
  const criterias = [];
  const openScenario = storage.getItem('openScenario');
  if ('id' in openScenario) {
    data.forEach(eachCriteria => {
      criterias.push(eachCriteria.crValue);
      pushToAnalytics({
        event: 'FilterCriteria',
        iGanttCriteria: eachCriteria.crValue,
        iScenarioId: openScenario.id,
        iScenarioPlanningPeriod: generateScenarioPlannigPeriod(openScenario),
      });
    });
    pushToAnalytics({
      event: 'sierraGanttFilterUse',
      iScenarioId: openScenario.id,
      iScenarioPlanningPeriod: generateScenarioPlannigPeriod(openScenario),
      iGanttFilterCount: criterias.length,
      iGanttFilterType: type,
    });
  }
};
export default routeAnalytics;
