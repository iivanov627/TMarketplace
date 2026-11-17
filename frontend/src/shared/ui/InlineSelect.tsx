import { Menu, UnstyledButton, Group, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

interface InlineSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function InlineSelect({ options, value, onChange }: InlineSelectProps) {
  const current = options.find((o) => o.value === value);

  return (
    <Menu position="bottom-start" radius="md" shadow="md">
      <Menu.Target>
        <UnstyledButton>
          <Group gap={4} wrap="nowrap">
            <Text size="sm" fw={500}>{current?.label ?? 'Сортировка'}</Text>
            <IconChevronDown size={16} color="var(--mantine-color-gray-6)" />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {options.map((opt) => (
          <Menu.Item
            key={opt.value}
            onClick={() => onChange(opt.value)}
            fw={opt.value === value ? 600 : 400}
            c={opt.value === value ? 'yellowBrand' : undefined}
          >
            {opt.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}