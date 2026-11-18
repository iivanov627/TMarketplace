import { matchPath } from 'react-router';

import type { NavTab } from './tabs';

export const isTabActive = (pathname: string, tab: NavTab) =>
  tab.match.some((path) => matchPath({ path, end: false }, pathname) !== null);