import { Center, Stack, Text, ThemeIcon, Button } from '@mantine/core';
import { IconMoodEmpty } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  message?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  message = 'Здесь пока пусто',
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Center py="xl">
      <Stack align="center" gap="sm">
        <ThemeIcon size={48} radius="xl" variant="light" color="gray">
          {icon ?? <IconMoodEmpty size={28} />}
        </ThemeIcon>
        <Text c="dimmed" size="sm" ta="center">{message}</Text>
        {onAction && actionLabel && (
          <Button variant="light" color="yellowBrand" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Center>
  );
}