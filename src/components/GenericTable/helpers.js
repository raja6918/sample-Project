export const prepareSortPayload = (header, direction) => {
  let sortCriteria = header.sortCriteria || header.field;

  if (!Array.isArray(sortCriteria)) {
    sortCriteria = [sortCriteria];
  }

  const sortPayload = sortCriteria.map(fieldName => {
    return { fieldName, direction };
  });

  return sortPayload;
};
