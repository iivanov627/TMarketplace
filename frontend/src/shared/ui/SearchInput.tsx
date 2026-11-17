import { TextInput, type TextInputProps } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface SearchInputProps extends Omit<TextInputProps, 'leftSection'> {
}

export function SearchInput({ placeholder = 'Поиск...', ...props }: SearchInputProps) {
  return (
    <TextInput
      leftSection={<IconSearch size={16} />}
      placeholder={placeholder}
      radius="md"
      {...props}
    />
  );
}