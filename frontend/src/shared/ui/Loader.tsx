import { Center, Loader as MantineLoader } from '@mantine/core';

export function Loader() {
  return (
    <Center py="xl">
      <MantineLoader type="oval" color="yellowBrand" size="md" />
    </Center>
  );
}