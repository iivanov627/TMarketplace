import { Group, NumberInput, Stack, Text } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useState, useEffect } from 'react';

import { SearchInput } from '../../../shared/ui';

export interface CatalogFiltersValue {
  q: string;
  minPrice?: number;
  maxPrice?: number;
}

interface Props {
  value: CatalogFiltersValue;
  onChange: (patch: Partial<CatalogFiltersValue>) => void;
}

const toNumber = (v: number | string) => (typeof v === 'number' && !Number.isNaN(v) ? v : undefined);

export function CatalogFilters({ value, onChange }: Props) {
  const [q, setQ] = useState(value.q);
  const [min, setMin] = useState<number | ''>(value.minPrice ?? '');
  const [max, setMax] = useState<number | ''>(value.maxPrice ?? '');

  const invalidRange = min !== '' && max !== '' && min > max;
  const commit = useDebouncedCallback((patch: Partial<CatalogFiltersValue>) => onChange(patch), 400);

  useEffect(() => {
    setQ(value.q);
    setMin(value.minPrice ?? '');
    setMax(value.maxPrice ?? '');
  }, [value.q, value.minPrice, value.maxPrice]);

  return (
    <Stack gap="sm">

      <SearchInput
        placeholder="Найти товар"
        value={q}
        onChange={(event) => {
          const next = event.currentTarget.value;
          setQ(next);
          commit({ q: next.trim() });
        }}
      />

      <Stack gap={6}>
        <Text size="xs" c="dimmed">Цена, бонусы</Text>
        <Group grow gap="sm" align="flex-start">
          <NumberInput
            placeholder="От"
            value={min}
            error={invalidRange ? 'Неверный диапазон цен' : undefined}
            onChange={(next) => {
              const num = toNumber(next);
              setMin(num ?? '');
              if (num === undefined || max === '' || num <= max) {
                commit({ minPrice: num });
              }
            }}
          />
          <NumberInput
            placeholder="До"
            value={max}
            error={invalidRange}
            onChange={(next) => {
              const num = toNumber(next);
              setMax(num ?? '');
              if (num === undefined || min === '' || min <= num) {
                commit({ maxPrice: num });
              }
            }}
          />
        </Group>
      </Stack>
    </Stack>
  );
}
