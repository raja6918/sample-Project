import {
  CREW_GROUPS_FIELDS,
  REQUIRED_FIELDS,
  customPredicates,
  isRequiredPredicate,
} from './constants';

import pick from 'lodash/pick';

export const getDefaultEntity = () => {
  return {
    name: '',
    positionCodes: [],
    airlineCodes: [],
    aircraftTypeCodes: [],
    ruleset: '',
  };
};

export const getDefaultErrors = () => {
  return {
    name: false,
    positionCodes: false,
    airlineCodes: false,
    aircraftTypeCodes: false,
    ruleset: false,
  };
};

export const mapEntityToState = originalEntity => {
  const entity = { ...originalEntity };

  if (!entity) return getDefaultEntity();

  return {
    ...pick(entity, CREW_GROUPS_FIELDS),
  };
};

export const hasError = errors => {
  return Object.values(errors).reduce((hasPrevErrors, hasError) => {
    return hasPrevErrors || hasError;
  }, false);
};

export const isRequiredField = field => REQUIRED_FIELDS.indexOf(field) !== -1;

export const getCustomPredicate = field => {
  return customPredicates[field] || (() => true);
};

export const wereAllFieldsFilled = state => {
  return CREW_GROUPS_FIELDS.reduce((acc, field) => {
    if (!acc) return acc;

    const value = state[field];
    const _isRequired = isRequiredField(field);
    const isEmptyField = !isRequiredPredicate(value);

    if (_isRequired && isEmptyField) return false;

    const customPredicate = getCustomPredicate(field);

    const hasValidValue = !isEmptyField ? customPredicate(value, state) : true;
    return acc && hasValidValue;
  }, true);
};

export function complementCrewGroupData(crewGroup) {
  const newCrewGroup = {
    ...crewGroup,
    positions: crewGroup.positionCodes.join(', '),
    airlines: crewGroup.airlineCodes.join(', '),
    aircraftTypes: crewGroup.aircraftTypeCodes.join(', '),
  };
  return newCrewGroup;
}

export function preparePositions(positionsCategorized) {
  const groups = [];
  const positions = [];
  for (const positionCategory of positionsCategorized) {
    groups.push({
      label: positionCategory.positionType,
      value: positionCategory.positionTypeCode,
    });
    for (const position of positionCategory.positions) {
      positions.push({
        label: position.code,
        value: position.code,
        groupValue: position.typeCode,
      });
    }
  }
  return [groups, positions];
}

export function prepareAirlines(airlines) {
  const data = airlines.map(airline => {
    return { label: airline.code, value: airline.code };
  });
  return data;
}

export function prepareAircraftTypes(aircraftsTypes) {
  const data = aircraftsTypes.map(aircraftType => {
    return { label: aircraftType.code, value: aircraftType.code };
  });
  return data;
}

export function prepareRuleSets(ruleSets) {
  const data = ruleSets.map(ruleSet => {
    return { label: ruleSet.name, value: ruleSet.id };
  });
  return data;
}
