import { Text } from '@mantine/core';
export function EmptyState({ message }: { message: string }) {
  return <Text c="dimmed">{message}</Text>;
}