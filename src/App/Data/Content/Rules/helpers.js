export const checkEmptyFilter = filters => {
  return typeof filters === 'object'
    ? Object.values(filters).filter(a => {
        const val = /^ *$/.test(a);
        return !val;
      }).length
    : 0;
};
