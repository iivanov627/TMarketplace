import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Alert
      icon={<IconAlertCircle size={18} />}
      title="Ошибка"
      color="red"
      variant="light"
      radius="md"
      styles={{
        root: {
          margin: '16px 0',
        },
        title: {
          fontWeight: 600,
        },
        message: {
          fontSize: 14,
        },
      }}
    >
      {message}
    </Alert>
  );
}