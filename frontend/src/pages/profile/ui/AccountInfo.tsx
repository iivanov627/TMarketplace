import { Badge, Group, Paper, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';

import { useViewer, type Role } from '../../../entities/session';

const ROLE_LABEL: Record<Role, string> = {
  guest: 'Гость',
  buyer: 'Покупатель',
  seller: 'Продавец',
  admin: 'Администратор',
};

export function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      {children}
    </Group>
  );
}

export function AccountInfo({ children }: { children?: ReactNode }) {
  const viewer = useViewer();

  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap="sm">
        <InfoRow label="Email">
          <Text size="sm" fw={600} truncate>
            {viewer.login ?? '—'}
          </Text>
        </InfoRow>
        <InfoRow label="Роль">
          <Badge color="gray" variant="light">
            {ROLE_LABEL[viewer.role]}
          </Badge>
        </InfoRow>
        {children}
      </Stack>
    </Paper>
  );
}
