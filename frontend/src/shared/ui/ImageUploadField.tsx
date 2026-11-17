import { Box, Image, ActionIcon, Text, Stack } from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';
import { useRef } from 'react';

interface ImageUploadFieldProps {
  value?: string;             
  onChange: (file: File | null) => void; 
  size?: number;              
}

export function ImageUploadField({ value, onChange, size = 100 }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onChange(null);
  };

  return (
    <Box
      w={size}
      h={size}
      onClick={handleClick}
      style={{
        border: '2px dashed #DEE2E6',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: value ? '#fff' : '#F8F9FF',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {value ? (
        <>
          <Image src={value} alt="Превью" w="100%" h="100%" fit="cover" />
          <ActionIcon
            size="sm"
            color="red"
            variant="filled"
            onClick={handleRemove}
            style={{ position: 'absolute', top: 4, right: 4 }}
          >
            <IconX size={12} />
          </ActionIcon>
        </>
      ) : (
        <Stack align="center" gap={4}>
          <IconPlus size={24} color="var(--mantine-color-gray-5)" />
          <Text size="xs" c="dimmed">Добавить</Text>
        </Stack>
      )}
    </Box>
  );
}