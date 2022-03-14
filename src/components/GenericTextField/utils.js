export const evaluateRegex = (regex, term) => {
  const reg = new RegExp(regex);
  const isValidRegex = reg.test(term);
  return isValidRegex;
};
