import pick from 'lodash/pick';
import { RegExs, ENTITY_FIELDS, getDefaultEntity } from './Constants';

export const validatePassword = data => {
  let containsUpperCase = false;
  let containsLowerCase = false;
  let contains8Chars = false;
  let containsNum = false;
  let containsNoBlank = false;

  // has uppercase letter
  if (data.toLowerCase() !== data) {
    containsUpperCase = true;
  }

  // has lowercase letter
  if (data.toUpperCase() !== data) {
    containsLowerCase = true;
  }

  // has number
  if (/\d/.test(data)) {
    containsNum = true;
  }

  // has 8 characters
  if (data.length >= 8) {
    contains8Chars = true;
  }

  // Contain no blank spaces
  if (/^\S{1,}$/.test(data)) {
    containsNoBlank = true;
  }

  return (
    containsLowerCase &&
    containsUpperCase &&
    contains8Chars &&
    containsNum &&
    containsNoBlank
  );
};

export const werePasswordFieldsFilled = (state, props) => {
  const { password, passwordRe } = state;
  const isPasswordActive = !state.disablePasswordField;
  const isCreate = !props.user;
  const areFilled =
    password !== '' && passwordRe !== '' && password === passwordRe;

  if (isCreate) return areFilled;

  return isPasswordActive ? areFilled : true;
};

export const wereAllFieldsFilled = (state, props) => {
  return ENTITY_FIELDS.reduce((acc, field) => {
    if (!acc) return acc;

    const value = state[field];

    if (field !== 'password') return acc && value !== '';
    return acc && werePasswordFieldsFilled(state, props);
  }, true);
};

export const hasError = errors => {
  return Object.values(errors).reduce((hasPrevErrors, hasError) => {
    return hasPrevErrors || hasError;
  }, false);
};

export const mapEntityToState = entity => ({
  ...getDefaultEntity(),
  ...pick(entity, ENTITY_FIELDS),
});

export const evaluateRegex = (regex, term) => {
  if (!regex) return true;

  const reg = new RegExp(regex);
  const isValidRegex = reg.test(term);
  return isValidRegex;
};

export const updateErrors = (key, value, state) => {
  const { errors } = state;

  if (value === '') {
    return {
      ...errors,
      [key]: false,
    };
  }

  if (key === 'password') {
    return {
      ...errors,
      [key]: !validatePassword(value),
    };
  }

  if (key === 'passwordRe') {
    return {
      ...errors,
      [key]: value !== state.password,
    };
  }

  return {
    ...errors,
    [key]: !evaluateRegex(RegExs[key], value),
  };
};

export const rolesFilter = (roles = []) => {
  return roles.filter(
    role => role.name !== 'uma_authorization' && role.name !== 'offline_access'
  );
};
