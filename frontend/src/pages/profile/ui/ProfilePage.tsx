import { Group, Paper, Stack, Text } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { Navigate } from 'react-router';

import { useViewer } from '../../../entities/session';
import { ROUTES } from '../../../shared/config/routes';
import { LogoutButton } from './LogoutButton';


export function ProfilePage() {
  useDocumentTitle('Профиль');

  const viewer = useViewer();

  if (viewer.role === 'guest') {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (viewer.role !== 'buyer') {
    return <Navigate to={ROUTES.CATALOG} replace />;
  }

  return (
    <Stack gap="md">

      <Paper withBorder radius="lg" p="md">
        <Stack gap="sm">
          <Group justify="space-between" wrap="nowrap">
            <Text size="sm" c="dimmed">
              Email
            </Text>
            <Text size="sm" fw={600} truncate>
              {viewer.login ?? '—'}
            </Text>
          </Group>
        </Stack>
      </Paper>

      <LogoutButton />
    </Stack>
  );
}
