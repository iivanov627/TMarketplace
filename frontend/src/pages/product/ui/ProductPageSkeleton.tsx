import { Skeleton, Stack } from '@mantine/core';

export function ProductPageSkeleton() {
  return (
    <Stack gap="md">
      <Skeleton h={320} radius="md" />
      <Skeleton h={28} w="75%" />
      <Skeleton h={32} w="35%" />
      <Skeleton h={100} radius="md" />
    </Stack>
  );
}
