export const URL_BUILDER = (params = URLSearchParams, obj = {}) => {
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) params.append(k, obj[k]);
  }
  return params;
};
