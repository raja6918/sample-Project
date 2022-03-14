import API from './../api';
import {
  RULES_ENDPOINT,
  RULESETS_ENDPOINT,
  RULESETS_DATA_ENDPOINT,
  CREWGROUP_ENDPOINT,
} from './constants';

import {
  buildBulkDeleteRequestDataParam,
  buildBulkRequestDataParam,
} from './../utils';

export function getRules(userId, scenarioId, ruleSet, data) {
  return API.post(
    `${RULES_ENDPOINT}/get?scenarioId=${scenarioId}&userId=${userId}&ruleSet=${ruleSet}`,
    data
  );
}

export function getRuleSets(scenarioId, userId) {
  return API.get(
    `${RULESETS_ENDPOINT}?scenarioId=${scenarioId}&userId=${userId}`
  );
}

export function getDefaultCrewgroup(scenarioId) {
  return API.get(`${CREWGROUP_ENDPOINT}?scenarioId=${scenarioId}`);
}

export function getAllRuleSets(userId, scenarioId) {
  return API.get(
    `${RULESETS_DATA_ENDPOINT}?userId=${userId}&scenarioId=${scenarioId}`
  );
}

export function getRuleDescription(code, scenarioId, userId, ruleset) {
  return API.get(
    `${RULES_ENDPOINT}/${code}?scenarioId=${scenarioId}&userId=${userId}&ruleSet=${ruleset}`
  );
}

export function deleteRuleset(ruleSetIds, scenarioId, userId) {
  const data = buildBulkDeleteRequestDataParam(ruleSetIds);
  return API.delete(
    `${RULESETS_ENDPOINT}?scenarioId=${scenarioId}&userId=${userId}`,
    { data }
  );
}

export function setParam(userId, scenarioId, ruleset, parameter, value) {
  return API.put(
    `${RULES_ENDPOINT}/setparam?scenarioId=${scenarioId}&userId=${userId}`,
    {
      parameter,
      ruleset,
      value,
    }
  );
}

export function revertParam(userId, scenarioId, ruleset, parameter) {
  return API.put(
    `${RULES_ENDPOINT}/revertparam?scenarioId=${scenarioId}&userId=${userId}`,
    {
      parameter,
      ruleset,
    }
  );
}

export function activateRule(userId, scenarioId, ruleset, rule, value) {
  return API.put(
    `${RULES_ENDPOINT}/activaterule?scenarioId=${scenarioId}&userId=${userId}`,
    {
      rule,
      ruleset,
      active: value,
    }
  );
}

export function revertRule(userId, scenarioId, ruleset, rule) {
  return API.put(
    `${RULES_ENDPOINT}/revertrule?scenarioId=${scenarioId}&userId=${userId}`,
    {
      rule,
      ruleset,
    }
  );
}

export function getRuleSetInfo(id, userId, scenarioId) {
  return API.get(
    `${RULESETS_ENDPOINT}/${id}?userId=${userId}&scenarioId=${scenarioId}`
  );
}

export function updateRuleSet(ruleSetData, userId, scenarioId) {
  const data = buildBulkRequestDataParam(ruleSetData);
  return API.put(
    `${RULESETS_ENDPOINT}?userId=${userId}&scenarioId=${scenarioId}`,
    data
  );
}

export function addRuleSet(ruleSet, userId, scenarioId) {
  return API.post(
    `${RULESETS_ENDPOINT}?userId=${userId}&scenarioId=${scenarioId}`,
    ruleSet
  );
}

export function getRuleDescriptionFromCodes(
  codes,
  scenarioId,
  userId,
  ruleset
) {
  const data = {
    'key-list': codes,
  };
  return API.post(
    `${RULES_ENDPOINT}/rulecodes?scenarioId=${scenarioId}&userId=${userId}&ruleSet=${ruleset}`,
    data
  );
}

export function updateCrewGroup(scenarioId, crewGroup, ruleset) {
  const putData = [
    {
      crewGroup,
      id: 1,
      ruleset,
    },
  ];
  return API.put(`${CREWGROUP_ENDPOINT}?scenarioId=${scenarioId}`, putData);
}

export function getTableDataDetails(code, scenarioId, userId, ruleset) {
  return API.get(
    `${RULES_ENDPOINT}/getComplexRuleParam/${code}?scenarioId=${scenarioId}&userId=${userId}&ruleSet=${ruleset}`
  );
}
