import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router';

import { Header } from '../../widgets/header';

export function AuthLayout() {
  return (
    <AppShell header={{ height: 72 }} padding="md">
      <AppShell.Header bg="white">
        <Header withAccount={false} />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}