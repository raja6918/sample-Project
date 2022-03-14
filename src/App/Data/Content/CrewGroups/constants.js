import { ellipsisTransformer } from './../../../../components/GenericTable/transformers';
import { evaluateRegex } from '../../utils/utils.js';

export const orderBy = 'name';
export const order = 'inc';

export const type = 'DATA.crewGroups.type';

export const INITIAL_ITEMS = 150;

export const NAME_REGEX = '^[a-zA-Z0-9].*';

export const CREWGROUPS_FORM = 'DATA.crewGroups.form';
export const CREWGROUPS_GENERAL = `${CREWGROUPS_FORM}.section.general`;
export const CREWGROUPS_ERRORS = 'ERRORS.CREW_GROUPS';

export const CREW_GROUPS_FIELDS = [
  'name',
  'positionCodes',
  'airlineCodes',
  'aircraftTypeCodes',
  'ruleset',
];
export const REQUIRED_FIELDS = [
  'name',
  'positionCodes',
  'airlineCodes',
  'aircraftTypeCodes',
  'ruleset',
];

export const getHeaders = t => [
  {
    field: 'name',
    displayName: t('DATA.crewGroups.headers.name'),
  },
  {
    field: 'positions',
    displayName: t('DATA.crewGroups.headers.positions'),
    transformer: ellipsisTransformer,
    sortCriteria: 'positionCodes',
  },
  {
    field: 'airlines',
    displayName: t('DATA.crewGroups.headers.airlines'),
    sortCriteria: 'airlineCodes',
  },
  {
    field: 'aircraftTypes',
    displayName: t('DATA.crewGroups.headers.aircraftTypes'),
    transformer: ellipsisTransformer,
    sortCriteria: 'aircraftTypeCodes',
  },
  {
    field: 'rulesetDisplayName',
    displayName: t('DATA.crewGroups.headers.ruleset'),
    transformer: ellipsisTransformer,
  },
];

export const isRequiredPredicate = val => val !== '' && val !== null;
const arrayIsNotEmpty = arr => Array.isArray(arr) && arr.length > 0;

export const customPredicates = {
  name: val => evaluateRegex(NAME_REGEX, val),
  positionCodes: arrayIsNotEmpty,
  airlineCodes: arrayIsNotEmpty,
  aircraftTypeCodes: arrayIsNotEmpty,
};
