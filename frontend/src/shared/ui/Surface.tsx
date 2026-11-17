import { Card, type CardProps } from '@mantine/core';

export function Surface({ children, ...props }: CardProps) {
  return (
    <Card radius={16} withBorder bg="white" {...props}>
      {children}
    </Card>
  );
}