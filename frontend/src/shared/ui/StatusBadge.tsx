import { Badge, type BadgeProps } from '@mantine/core';

type Tone = 'success' | 'neutral' | 'warning' | 'info' | 'danger';

interface StatusBadgeProps extends Omit<BadgeProps, 'color'> {
  tone?: Tone;
}

const toneToColor: Record<Tone, string> = {
  success: 'green',
  neutral: 'gray',
  warning: 'yellow',
  info: 'blue',
  danger: 'red',
};

export function StatusBadge({ tone = 'neutral', children, ...props }: StatusBadgeProps) {
  return (
    <Badge color={toneToColor[tone]} variant="light" radius="md" {...props}>
      {children}
    </Badge>
  );
}