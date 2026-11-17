import { UnstyledButton, Flex, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

interface TabBarItemProps {
  icon: ReactNode;
  label: string;
  to: string;
  active?: boolean;
  badge?: number; 
}

export function TabBarItem({ icon, label, to, active, badge }: TabBarItemProps) {
  const color = active ? 'var(--mantine-color-black)' : '#c8c8d1';

  return (
    <UnstyledButton
      component={Link}
      to={to}
      style={{ flex: 1 }}
    >
      <Flex direction="column" align="center" gap={2} pos="relative">
        <div style={{ color }}>{icon}</div>
        <Text size="xs" c={color} fw={active ? 600 : 400}>
          {label}
        </Text>
        {badge != null && badge > 0 && (
          <Text
            size="xs"
            fw={700}
            c="black"
            style={{
              position: 'absolute',
              top: -4,
              right: 'calc(50% - 16px)',
              background: '#FFD701',
              borderRadius: 8,
              padding: '0 4px',
              fontSize: 10,
              lineHeight: '14px',
            }}
          >
            {badge}
          </Text>
        )}
      </Flex>
    </UnstyledButton>
  );
}