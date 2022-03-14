import { dataTypesComplement } from './../../Import/importConfig';
import React from 'react';

export function alertsCount_DEPRECATED(alerts) {
  let totalCount = 0;
  const dataTypes = Object.keys(alerts);

  for (const dataType of dataTypes) {
    totalCount += alerts[dataType].length;
  }

  return totalCount;
}

export function generateTabsData(errors, t) {
  const dataTypes = Object.keys(errors);
  const tabsData = [];
  for (const dataType of dataTypes) {
    const { translationKey } = dataTypesComplement[dataType] || {};
    const label = translationKey ? t(translationKey) : dataType;
    const count = errors[dataType].errors.length;

    if (count > 0) {
      tabsData.push({
        value: dataType,
        label: (
          <React.Fragment>
            <div>{label}</div>
            <div>({count})</div>
          </React.Fragment>
        ),
      });
    }
  }
  return tabsData;
}

export function scrollPercentage(elementHeight, elementTop) {
  return Math.ceil((elementTop / elementHeight) * 100);
}
