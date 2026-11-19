import { Card, Skeleton, Stack } from '@mantine/core';

export function ProductCardSkeleton() {
  return (
    <Card withBorder radius="lg" p="xs">
      <Stack gap={6}>
        <Skeleton h={110} radius="md" />
        <Skeleton h={18} w="50%" />
        <Skeleton h={28} />
        <Skeleton h={40} radius="md" />
      </Stack>
    </Card>
  );
}