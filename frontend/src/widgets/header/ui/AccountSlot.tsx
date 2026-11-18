import { Button, Text, Paper } from '@mantine/core';
import { IconLogin2 } from '@tabler/icons-react';
import { Link } from 'react-router';

import { useViewer } from '../../../entities/session';
import { ROUTES } from '../../../shared/config/routes';
import { Amount } from '../../../shared/ui';

export function AccountSlot() {
  const viewer = useViewer();

  switch (viewer.role) {
    case 'guest':
      return (
        <Button
          component={Link}
          to={ROUTES.LOGIN}
          size="sm"
          leftSection={<IconLogin2 size={18} />}
        >
          Войти
        </Button>
      );

    case 'buyer':
      return (
        <Paper withBorder radius="md" px="md" h={35} display="flex" style={{ alignItems: 'center' }}>
          <Amount value={viewer.balance ?? 0} variant="bonus" fw={700} />
        </Paper>
      );

    case 'seller':
      return (
        <Paper withBorder radius="md" px="md" h={35} display="flex" style={{ alignItems: 'center' }}>
          <Text size="sm" fw={600} truncate maw={120}>
            {viewer.organizationName ?? 'Продавец'}
          </Text>
        </Paper>
      );

    case 'admin':
      return (
        <Paper radius="md" px="md" h={35} bg="dark.8" c="white" display="flex" style={{ alignItems: 'center' }}>
          <Text size="sm" fw={600} c="white">Админ</Text>
        </Paper>
      );

    default:
      return null;
  }
}