import { Group, Text } from '@mantine/core';
import type { ReactNode } from 'react';

interface KeyValueRowProps {
  label: string;
  value: ReactNode;
  emphasized?: boolean; 
}

export function KeyValueRow({ label, value, emphasized }: KeyValueRowProps) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Text size={emphasized ? 'md' : 'sm'} fw={emphasized ? 700 : 400} c={emphasized ? undefined : 'dimmed'}>
        {label}
      </Text>
      <Text size={emphasized ? 'md' : 'sm'} fw={emphasized ? 700 : 500}>
        {value}
      </Text>
    </Group>
  );
}