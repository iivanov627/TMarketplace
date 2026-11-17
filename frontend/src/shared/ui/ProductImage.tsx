import { Image, Box } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import { useState } from 'react';

type SizePreset = 'thumb' | 'card' | 'full';

interface ProductImageProps {
  src?: string;
  alt?: string;
  size?: SizePreset;
}

const presetSizes: Record<SizePreset, { w: number | string ; h: number | string}> = {
  thumb: { w: 48, h: 48 },
  card: { w: 160, h: 160 },
  full: { w: '100%', h: 320 },
};

export function ProductImage({ src, alt = 'Товар', size = 'card' }: ProductImageProps) {
  const [error, setError] = useState(false);
  const { w, h } = presetSizes[size];

  if (!src || error) {
    return (
      <Box
        w={w}
        h={h}
        bg="gray.1"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
      >
        <IconPhoto size={32} color="var(--mantine-color-gray-5)" />
      </Box>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      w={w}
      h={h}
      fit="contain"
      radius={8}
      onError={() => setError(true)}
    />
  );
}