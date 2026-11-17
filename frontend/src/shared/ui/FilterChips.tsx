import { Chip, Group, ScrollArea } from '@mantine/core';

interface FilterChipsProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
}

export function FilterChips({ options, value, onChange, multiple = false }: FilterChipsProps) {
  return (
    <ScrollArea type="never" offsetScrollbars>
      <Chip.Group
        multiple={multiple}
        value={value}
        onChange={(val) => onChange(Array.isArray(val) ? val : [val])}
      >
        <Group gap="xs" wrap="nowrap">
          {options.map((opt) => (
            <Chip key={opt.value} value={opt.value} variant="light" radius="xl" size="sm">
              {opt.label}
            </Chip>
          ))}
        </Group>
      </Chip.Group>
    </ScrollArea>
  );
}