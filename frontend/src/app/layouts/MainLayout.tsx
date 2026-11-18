import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router';

import { Header } from '../../widgets/header';
import { BottomNav } from '../../widgets/bottom-nav';

export function MainLayout() {
  return (
    <AppShell
      header={{ height: 72 }}
      footer={{ height: 72 }}
      padding="md"
    >
      <AppShell.Header bg="white">
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <AppShell.Footer bg="white">
        <BottomNav />
      </AppShell.Footer>
    </AppShell>
  );
}