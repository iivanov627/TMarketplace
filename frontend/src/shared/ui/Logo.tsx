import { Group, ThemeIcon, Title } from '@mantine/core';
import { IconBuildingStore } from '@tabler/icons-react';
import { Link } from 'react-router';
import type { ComponentPropsWithoutRef } from 'react';
import { ROUTES } from '../config/routes';

export function Logo() {
  return (
    <Group gap="xs">
      <ThemeIcon size={40} radius={12} color="yellowBrand" variant="filled">
        <IconBuildingStore size={22} style={{ color: 'var(--mantine-color-black)' }} />
      </ThemeIcon>
      <Title
        order={4}
        renderRoot={(props: ComponentPropsWithoutRef<'a'>) => (
          <Link to={ROUTES.CATALOG} {...props} />
        )}
        style={{
          lineHeight: '24px',
          letterSpacing: '-0.45px',
          color: 'var(--mantine-color-black)',
          fontWeight: 'bold',
          textDecoration: 'none',
        }}
      >
        Маркетплейс
      </Title>
    </Group>
  );
}