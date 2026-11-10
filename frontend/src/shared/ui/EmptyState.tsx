import { EmptyState as MantineEmptyState, Button } from '@mantine/core';
import { IconMoodEmpty } from '@tabler/icons-react';

interface EmptyStateProps {
  message?: string;
  onReset?: () => void;
}

export function EmptyState({ message = 'Товаров нет', onReset }: EmptyStateProps) {
  return (
    <MantineEmptyState
      icon={<IconMoodEmpty size={48} stroke={1.5} />}
      title="Пусто"
      description={message}
      size="md"
      align="center"
      withIndicatorBackground
      styles={{
        root: {
          padding: '40px 20px',
        },
        title: {
          color: '#000000',
          fontSize: 18,
          fontWeight: 600,
        },
        description: {
          color: 'var(--mantine-color-dark-4)',
          fontSize: 14,
        },
      }}
    >
      {onReset && (
        <MantineEmptyState.Actions>
          <Button variant="light" color="yellowBrand" size="sm" onClick={onReset}>
            Сбросить фильтры
          </Button>
        </MantineEmptyState.Actions>
      )}
    </MantineEmptyState>
  );
}