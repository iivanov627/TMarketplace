import { Link, useLocation } from 'react-router';

import { useViewer } from '../../../entities/session';
import { TabBar, TabBarItem } from '../../../shared/ui';
import { isTabActive } from '../model/isTabActive';
import { NAV_TABS } from '../model/tabs';

export function BottomNav() {
  const { pathname } = useLocation();
  const { role } = useViewer();

  return (
    <TabBar>
      {NAV_TABS[role].map((tab) => (
        <TabBarItem
          key={tab.id}
          to={tab.to}
          icon={<tab.icon size={24} stroke={1.8} />}
          label={tab.label}
          active={isTabActive(pathname, tab)}
        />
      ))}
    </TabBar>
  );
}