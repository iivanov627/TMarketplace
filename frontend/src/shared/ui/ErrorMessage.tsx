import { Alert } from '@mantine/core';
export function ErrorMessage({ message }: { message: string }) {
  return <Alert color="red">{message}</Alert>;
}