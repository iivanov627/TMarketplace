import { Group, Switch, Text, Card } from '@mantine/core';

interface SwitchRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SwitchRow({ label, description, checked, onChange, disabled }: SwitchRowProps) {
  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" wrap="nowrap">
        <div>
          <Text fw={500} size="sm">{label}</Text>
          {description && (
            <Text size="xs" c="dimmed">{description}</Text>
          )}
        </div>
        <Switch
          checked={checked}
          onChange={(e) => onChange(e.currentTarget.checked)}
          disabled={disabled}
          color="yellowBrand"
        />
      </Group>
    </Card>
  );
}