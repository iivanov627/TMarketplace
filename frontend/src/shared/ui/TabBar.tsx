import { Flex } from '@mantine/core';
import type { ReactNode } from 'react';

export function TabBar({ children }: { children: ReactNode }) {
  return (
    <Flex h="100%" justify="space-around" align="center">
      {children}
    </Flex>
  );
}