export const amIinScenariosScreen = history =>
  history.location.pathname === '/' ||
  history.location.pathname === '/scenarios';

/**
 * To disable navigation in Navbar and HamburgerDrawers if particular pathname match
 *
 * @param {object} location - from react router dom
 */
export const disableNavigation = location => {
  // If user open pairing in preview mode diable all navigations
  if (location.pathname.includes('pairings-preview')) {
    return true;
  } else if (location.pathname.includes('pairing-details')) {
    return true;
  }
};

/**
 * To enable notification menu if particular pathname match
 *
 * @param {object} location - from react router dom
 */
export const enableNotificationIcon = location => {
  if (location.pathname.includes('pairing-details')) {
    return false;
  }
};
