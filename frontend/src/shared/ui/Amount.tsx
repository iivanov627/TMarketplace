import { Text, type TextProps } from '@mantine/core';
import { formatBonus, formatMoney } from '../lib/format';

type AmountVariant = 'bonus' | 'money';

interface AmountProps extends Omit<TextProps, 'children'> {
  value: number;
  variant?: AmountVariant;
  size?: 'sm' | 'md' | 'lg';
}


export function Amount({ value, variant = 'bonus', size = 'md', ...props }: AmountProps) {
  const formatted = variant === 'bonus' ? formatBonus(value) : formatMoney(value);

  const sizes = { sm: 'sm', md: 'md', lg: 'lg' } as const;

  return (
    <Text size={sizes[size]} fw={700} {...props}>
      {formatted}
    </Text>
  );
}