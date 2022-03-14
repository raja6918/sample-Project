const prepareData = (originalData, orderBy, order, groupBy = null) => {
  let data = [];
  if (groupBy !== null && originalData.length) {
    const groupedData = {};
    for (let i = 0; i < originalData.length; i++) {
      const position = originalData[i];
      const key = position[groupBy];
      const currentElements = groupedData[key] || [];
      groupedData[key] = [...currentElements, position];
    }

    const groups = Object.keys(groupedData);
    for (const groupName of groups) {
      const positions = groupedData[groupName];
      const captionRow = {
        value: groupName,
        isCaptionRow: true,
      };
      data.push(captionRow, ...positions);
    }
  } else {
    data = originalData;
  }
  return data;
};
export default prepareData;

export const sortData = (data, sortPayload) => {
  const fieldName = sortPayload[0].fieldName;
  const sortResult = data.sort((a, b) => {
    let comparison = 0;
    if (a[fieldName].toUpperCase() < b[fieldName].toUpperCase()) {
      comparison = -1;
    }
    if (a[fieldName].toUpperCase() > b[fieldName].toUpperCase()) {
      comparison = 1;
    }
    return sortPayload[0].direction === 'dec' ? comparison * -1 : comparison;
  });
  return sortResult;
};
