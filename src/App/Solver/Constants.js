import { evaluateRegex } from '../Data/utils/utils.js';

export const NAME_REGEX = '^[a-zA-Z0-9].*';

export const SOLVER_FORM = 'DATA.solver.form';
export const SOLVER_GENERAL = `${SOLVER_FORM}.section.general`;

export const SOLVER_FIELDS = [
  'solverTask',
  'crewGroup',
  'rule',
  'name',
  'description',
  'recipeNames',
];

export const REQUIRED_FIELDS = [
  'solverTask',
  'crewGroup',
  'rule',
  'recipeNames',
  'name',
];
export const POLLING_INTERVAL = 5000;

export const SOLVER_RUNNING_STATUS = [
  'Creating',
  'Waiting',
  'Sending',
  'Running',
  'Fetching',
];
export const CREW_GROUP_RULESET_FAIL_STATUS = [
  'Creating',
  'Launching',
  'READY_TO_LAUNCH',
  'Waiting',
  'Sending',
  'Running',
  'Fetching',
  'Done-success',
  'Done-stopped',
];
export const isRequiredPredicate = val => val !== '' && val !== null;

export const customPredicates = {
  name: val => evaluateRegex(NAME_REGEX, val),
};
