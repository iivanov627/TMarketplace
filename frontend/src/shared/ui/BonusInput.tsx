import { NumberInput, type NumberInputProps } from '@mantine/core';

interface BonusInputProps extends Omit<NumberInputProps, 'suffix' | 'thousandSeparator'> {
}

export function BonusInput({ ...props }: BonusInputProps) {
  return (
    <NumberInput
      suffix=" Б"
      thousandSeparator=" "
      radius="md"
      min={0}
      {...props}
    />
  );
}