import { Radio, Group, Text } from '@mantine/core';
import type { ReactNode } from 'react';

interface SelectableCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

export function SelectableCard({ value, label, description, icon }: SelectableCardProps) {
  return (
    <Radio.Card value={value} radius="md" p="md">
      <Group wrap="nowrap" align="flex-start">
        <Radio.Indicator />
        <div>
          <Group gap="xs">
            {icon}
            <Text fw={500} size="sm">{label}</Text>
          </Group>
          {description && (
            <Text size="xs" c="dimmed" mt={4}>{description}</Text>
          )}
        </div>
      </Group>
    </Radio.Card>
  );
}