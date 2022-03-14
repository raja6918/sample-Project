/**
 * To open url in new browser tab
 *
 * @param {string} url
 * @param {number} PairingId
 * @returns {boolean}
 */
export const openInNewTab = url => {
  const win = window.open(url, '_blank');
  if (win !== null) {
    win.focus();
    return true;
  }
  return false;
};
