import pick from 'lodash/pick';
import { getFormattedTime } from '../../utils/dates';
import storage, { localStorage } from '../../utils/storage';
import { previewChannel } from '../../utils/broadCast';
import scenarioService from '../../services/Scenarios/index';
import { CREW_GROUP_RULESET_FAIL_STATUS } from './Constants';

import {
  REQUIRED_FIELDS,
  SOLVER_GENERAL,
  SOLVER_FIELDS,
  isRequiredPredicate,
  customPredicates,
} from './Constants';

import { ALL } from '../../_shared/configurationEntities';

export const hasError = errors => {
  return Object.values(errors).reduce((hasPrevErrors, hasError) => {
    return hasPrevErrors || hasError;
  }, false);
};

export const evaluateRegex = (regex, term) => {
  const reg = new RegExp(regex);
  const isValidRegex = reg.test(term);
  return isValidRegex;
};

export const isRequiredField = (field, fieldsToCheck) =>
  fieldsToCheck.indexOf(field) !== -1;

export const getCustomPredicate = field => {
  return customPredicates[field] || (() => true);
};

export const wereAllFieldsFilled = state => {
  const fieldsToCheck = [...REQUIRED_FIELDS];

  return SOLVER_FIELDS.reduce((acc, field) => {
    if (!acc) return acc;

    const value = state[field];
    const _isRequired = isRequiredField(field, fieldsToCheck);
    const isEmptyField = !isRequiredPredicate(value);
    const isEmptyArray = Array.isArray(value) && value.length === 0;

    if ((_isRequired && isEmptyField) || (_isRequired && isEmptyArray))
      return false;

    const customPredicate = getCustomPredicate(field);

    const hasValidValue = !isEmptyField ? customPredicate(value, state) : true;
    return acc && hasValidValue;
  }, true);
};

export const getDefaultName = (t, state) => {
  const stations = [state.arrivalStationCode];
  if (state.departureStationCode) stations.unshift(state.departureStationCode);

  return t(`${SOLVER_GENERAL}.defaultName`, {
    route: ` ${stations.join('-')}`,
  }).trim();
};

export const getDefaultEntity = () => {
  return {
    crewGroup: '',
    solverTask: '',
    rule: '',
    name: '',
    description: '',
    recipeNames: [],
  };
};

export const mapEntityToState = originalEntity => {
  const entity = { ...originalEntity };

  if (!entity) return getDefaultEntity();

  entity.outboundDuration = entity.outboundTiming.duration;
  entity.outboundConnectionTimeBefore =
    entity.outboundTiming.connectionTimeBefore;
  entity.outboundConnectionTimeAfter =
    entity.outboundTiming.connectionTimeAfter;

  entity.creditPolicyCode = entity.creditPolicyCode
    ? entity.creditPolicyCode
    : ALL;

  return {
    ...pick(entity, SOLVER_FIELDS),
    outboundFirstDepartureTime: getFormattedTime(
      entity.outboundTiming.firstDepartureTime
    ),
    outboundLastDepartureTime: getFormattedTime(
      entity.outboundTiming.lastDepartureTime
    ),
  };
};

export const getDefaultErrors = () => {
  return {
    crewGroup: false,
    solverTask: false,
    rule: false,
    recipeNames: false,
    name: false,
    description: false,
  };
};

/**
 * To remove the preview data from localstorage if popup is blocked
 *
 * @param {number} previewId
 */
export const clearLocalStorage = previewId => {
  // Remove openItem from localstorage
  const openPreviews = localStorage.getItem('openPreviews');

  const filteredPreviews = openPreviews.filter(preview =>
    preview ? preview.previewId !== parseInt(previewId, 10) : false
  );

  localStorage.setItem('openPreviews', filteredPreviews);
};

/**
 * To delete unused preview scenario
 *
 * @param {number} previewId
 */
const deletePreview = previewId => {
  try {
    const userId = storage.getItem('loggedUser')
      ? storage.getItem('loggedUser').id
      : '';
    scenarioService.deletePreview(parseInt(previewId, 10), userId, true);
  } catch (error) {
    console.error(error);
  }
};

/**
 * To open url in new browser tab
 *
 * @param {string} url
 * @param {number} previewId
 * @returns {boolean}
 */
export const openInNewTab = (url, previewId) => {
  const win = window.open(url, '_blank');
  if (win !== null) {
    win.focus();
    return true;
  } else {
    clearLocalStorage(previewId);
    deletePreview(previewId);
    return false;
  }
};

/**
 * To get or create a unique browserSessionId from session storage
 */
export const getBrowserSessionId = () => {
  let delay = 500;
  if ('BroadcastChannel' in self) {
    // For browsers that support BroadcastChannel a 100ms delay is enough
    delay = 100;
  }

  // sync browserSessionId between tabs
  previewChannel.postMessage({ title: 'GET_ID' });

  return new Promise(resolve =>
    setTimeout(() => {
      let browserSessionId = storage.getItem('browserSessionId');

      if (!browserSessionId) {
        browserSessionId = Date.now();
        storage.setItem('browserSessionId', browserSessionId);
      }

      resolve(browserSessionId);
    }, delay)
  );
};

/**
 * To filter Crew Bases and rules based on crewGroupId and rulesetId
 *
 * @param {number} crewGroupId
 * @param {array} crewGroups
 * @param {number} rulesetId
 * @param {array} rules
 *
 * @returns {array} of filteredCrewGroups and filteredRules
 */
export const getFilteredCrewBasesandRules = (
  crewGroupId,
  crewGroups,
  rulesetId,
  rules
) => {
  const filteredCrewGroups = crewGroups.filter(
    crewGroup => crewGroup.id === parseInt(crewGroupId, 10)
  );

  const filteredRules = rules.filter(
    rule => rule.id === parseInt(rulesetId, 10)
  );

  return [filteredCrewGroups, filteredRules];
};
/**
 * @function - To get the corresponding mapped values for the id which is passed.
 * @param {Object} solverTasks
 * @param {Object} crewGroups
 * @param {Object} rules
 * @param {Object} recipes
 * @param {Object} values - Specifies the values to be checked with for filtering.
 * @param {Object} filter - Specifies the filtering criteria.
 */
export const getMappedValues = (
  solverTasks,
  crewGroups,
  rules,
  recipes,
  values,
  filter,
  activeRequest
) => {
  const defaultReturn = '';
  let crewGroupMissing = false;
  let ruleSetMissing = false;
  const matchValue =
    filter.match === 'id' ? value => parseInt(value, 10) : value => value;

  let crewGroup = crewGroups.find(
    crewGroup => crewGroup[filter.match] === matchValue(values.crewGroup)
  );
  if (
    (!crewGroup || crewGroup === '') &&
    CREW_GROUP_RULESET_FAIL_STATUS.includes(activeRequest.status.status)
  ) {
    crewGroup = { id: values.crewGroup, name: values.crewGroup };
    crewGroupMissing = true;
  }
  const solverTask = solverTasks.find(
    solverTask => solverTask[filter.match] === matchValue(values.solverTask)
  );
  let rule = rules.find(rule => rule[filter.match] === matchValue(values.rule));
  if (
    (!rule || rule === '') &&
    CREW_GROUP_RULESET_FAIL_STATUS.includes(activeRequest.status.status)
  ) {
    rule = { id: values.rule, name: values.rule };
    ruleSetMissing = true;
  }
  const recipe = recipes.find(
    recipe => recipe[filter.match] === matchValue(values.recipe)
  );

  const datarecipes = [{ id: '-1', name: '-1' }, ...recipes];
  const filteredRecipes = values.recipeNames
    ? values.recipeNames.map(rec =>
        datarecipes.find(r => r[filter.match] === matchValue(rec))
      )
    : [];

  return {
    crewGroup: crewGroup ? crewGroup[filter.for] : defaultReturn,
    solverTask: solverTask ? solverTask[filter.for] : defaultReturn,
    rule: rule ? rule[filter.for] : defaultReturn,
    recipeNames: filteredRecipes.map(fil => (fil ? fil[filter.for] : '-1')),
    crewGroupMissing,
    ruleSetMissing,
  };
};
