import { Box, Button, Group } from '@mantine/core';
import type { ReactNode } from 'react';

interface BottomActionBarProps {
  leftContent?: ReactNode;   
  buttonLabel: string;
  onButtonClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function BottomActionBar({
  leftContent,
  buttonLabel,
  onButtonClick,
  loading,
  disabled,
}: BottomActionBarProps) {
  return (
    <Box
      p="md"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTop: '1px solid #DEE2E6',
        zIndex: 100,
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        {leftContent ?? <div />}
        <Button
          onClick={onButtonClick}
          loading={loading}
          disabled={disabled}
          radius="md"
          size="md"
        >
          {buttonLabel}
        </Button>
      </Group>
    </Box>
  );
}