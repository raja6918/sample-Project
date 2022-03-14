export const evaluateRegex = (regex, term) => {
  const reg = new RegExp(regex);
  const isValidRegex = reg.test(term);
  return isValidRegex;
};

export const epsilonValidation = value => {
  const valueArr = value.split('');
  return valueArr.indexOf('e') !== -1;
};
