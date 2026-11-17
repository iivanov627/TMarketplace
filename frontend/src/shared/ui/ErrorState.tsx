import { Alert, Button, Center } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Что-то пошло не так', onRetry }: ErrorStateProps) {
  return (
    <Center py="xl">
      <Alert
        icon={<IconAlertCircle size={18} />}
        title="Ошибка"
        color="red"
        variant="light"
        radius="md"
      >
        {message}
        {onRetry && (
          <Button variant="light" color="red" size="xs" mt="sm" onClick={onRetry}>
            Повторить
          </Button>
        )}
      </Alert>
    </Center>
  );
}