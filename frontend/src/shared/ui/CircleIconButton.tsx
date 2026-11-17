import { ActionIcon, type ActionIconProps } from '@mantine/core';
import type { ReactNode } from 'react';

interface CircleIconButtonProps extends Omit<ActionIconProps, 'children'> {
  children: ReactNode;
  onClick?: () => void;
}

export function CircleIconButton({ children, ...props }: CircleIconButtonProps) {
  return (
    <ActionIcon
      variant="white"
      radius="xl"
      size="lg"
      color="gray"
      style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)' }}
      {...props}
    >
      {children}
    </ActionIcon>
  );
}