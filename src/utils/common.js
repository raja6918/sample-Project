import React from 'react';
import SierraTooltip from '../_shared/components/SierraTooltip/';
import { READ_ONLY } from '../constants';

/**
 * src/utils/common.js
 * Let all the common configurations and utils at the app level go into this file.
 */

import storage from './storage';

// Custom configuration for the react perfect scroll
export const perfectScrollConfig = {
  wheelSpeed: 0.4,
  swipeEasing: true,
};

// To fix an issue with the react-perfect-scrollbar with Material UI table (Generic & Generic Collapsible table),
// where width of the container was increasing on scroll-x on certain zoom
//levels, note: currently implemented to work with MUI table on scroll x.
export const scrollSyncX = () => {
  const scrollXRail = document.querySelector('.ps--clicking');
  const MUITable = document.querySelector('.MuiTable-root');

  if (scrollXRail && MUITable) {
    const railLeft = parseInt(scrollXRail.style.left, 10);
    const scrollRailWidth = parseInt(scrollXRail.style.width, 10);
    const muiTableWidth = MUITable.clientWidth;

    if (railLeft + scrollRailWidth >= muiTableWidth) {
      scrollXRail.style.left = `${muiTableWidth - scrollRailWidth}px`;
    }
  }
};

// To fix an issue with the react-perfect-scrollbar with React table (Statistics table), where
// width of the container was increasing on scroll-x on certain zoom levels.
export const scrollSyncXRT = ref => {
  const scrollXRail = document.querySelector('.ps--clicking');
  const scrollXThumb = document.querySelector('.ps--clicking .ps__thumb-x');

  if (scrollXRail && scrollXThumb && ref) {
    scrollXRail.style.display = 'none';
    scrollXThumb.style.display = 'none';

    ref.scrollLeft -= 10;

    setTimeout(() => {
      scrollXRail.style.display = 'block';
      scrollXThumb.style.display = 'block';
    }, 500);
  }
};

// Shake the scroll bar to update the react-perfect-scroll
export const shakeScroll = () => {
  setTimeout(() => {
    const container = document.querySelectorAll(
      '.MuiList-root.scrollbar-container.ps.ps--active-y'
    );
    if (container) {
      container.forEach(elem => {
        elem.scrollTop += 1;
        elem.scrollLeft += 1;
      });
    }
  }, 1000);
};

/**
 * Utility function to check whether element is visible inside a container and to get bottom height difference.
 *
 * @param {HTMLElement} container
 * @param {HTMLElement} element
 * @returns {Object} {isVisible: boolean, bottomHeightDiff: number}
 */
export const checkElementVisibility = (container, element) => {
  try {
    //Get container properties
    const cTop = container.scrollTop;
    const cBottom = cTop + container.clientHeight;

    //Get element properties
    const eTop = element.offsetTop;
    const eBottom = eTop + element.clientHeight;

    return {
      isVisible: eTop >= cTop && eBottom <= cBottom,
      bottomHeightDiff: eBottom - cBottom,
    };
  } catch (error) {
    console.error(error);
  }
};

// To apply ellipsis based on text length, helpful in case of multilines
export const shortenText = (text, maxLength) => {
  if (typeof text === 'string' && text.length > maxLength) {
    text = `${text.substr(0, maxLength - 3)}...`;
  }
  return text;
};

// this is based on a char length and not based on actual width
// ellipsistransformer is recommended.
export const cutOffTextWithEllipsis = (text, maxLength) => (
  <SierraTooltip
    position="bottom"
    title={' '}
    html={<p style={{ padding: '0 10px' }}>{text}</p>}
  >
    {shortenText(text, maxLength)}
  </SierraTooltip>
);

export const currentScenario = () => {
  let openScenario = storage.getItem('openScenario');
  if (!openScenario) openScenario = null;
  return openScenario;
};

export const isReadOnlyMode = () => {
  const openScenario = currentScenario();
  if (openScenario) return openScenario.status === READ_ONLY;
  return false;
};

//To get the firstletterswithUppercase for a given string
export const getFirstLetters = (fName = '', lName = '') => {
  const f = fName[0] ? fName[0] : '';
  const l = lName[0] ? lName[0] : '';
  return (f + l).toUpperCase();
};

// To get form ok button by checking readonly mode
export const getFormOkButton = (t, condition) => {
  const addBtn = t('GLOBAL.form.add');
  const saveBtn = t('GLOBAL.form.save');
  return !condition ? addBtn : saveBtn;
};
export const getFormCancelButton = (t, condition) => {
  const closeBtn = t('GLOBAL.form.close');
  const cancelBtn = t('GLOBAL.form.cancel');
  return condition ? closeBtn : cancelBtn;
};

// To get form header by checking readonly mode
export const getFormHeading = (t, condition, readOnly = false, title = '') => {
  return !condition
    ? t(`${title}.add`)
    : readOnly
    ? t(`${title}.view`)
    : t(`${title}.edit`);
};

// check if the number of digits after and before the decimal is less than or equal to the limit
export const checkDecimalLimit = (value, lLimit, rLimit) => {
  let lCount = 0;
  let rCount = 0;
  if (value.includes('.')) {
    lCount = value.split('.')[0].length || 0;
    rCount = value.split('.')[1].length || 0;
  } else {
    lCount = value.length;
  }
  return lCount <= lLimit && rCount <= rLimit;
};

// test regex
export const evaluateRegex = (regex, term) => {
  const reg = new RegExp(regex);
  const isValidRegex = reg.test(term);
  return isValidRegex;
};

export const checkIsTemplate = () => {
  let isTemplate = false;
  const openScenario = storage.getItem('openScenario');
  if (openScenario && openScenario.isTemplate) {
    isTemplate = true;
  }
  return isTemplate;
};

export const checkPermission = (scopes, permissions) => {
  if (scopes === undefined) {
    /**this needs to be removed  later when permissions are added to entire app */
    return true;
  } else {
    return (
      (typeof scopes === 'string' && scopes === 'all') ||
      (Array.isArray(permissions) &&
        scopes.some(item => permissions.includes(item)))
    );
  }
};

export const Sort = (arr, field) => {
  return arr.sort((a, b) => {
    if (a[field].toLowerCase() < b[field].toLowerCase()) return -1;
    if (a[field].toLowerCase() > b[field].toLowerCase()) return 1;
    return 0;
  });
};

/**
 * Utility function to check date range overlaps between two items
 *
 * @param {string | Date} aStart - Accepted formats: '2019-07-05T07:30'
 * @param {string | Date} aEnd - Accepted formats: '2019-07-05T07:30'
 * @param {string | Date} bStart - Accepted formats: '2019-07-05T07:30'
 * @param {string | Date} bEnd - Accepted formats: '2019-07-05T07:30'
 * @return {boolan}
 */
export const dateRangeOverlaps = (aStart, aEnd, bStart, bEnd) => {
  if (aStart <= bStart && bStart <= aEnd) return true; // b starts in a
  if (aStart <= bEnd && bEnd <= aEnd) return true; // b ends in a
  if (bStart < aStart && aEnd < bEnd) return true; // a in b
  return false;
};
