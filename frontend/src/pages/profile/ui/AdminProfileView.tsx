import { Stack } from '@mantine/core';

import { AccountInfo } from './AccountInfo';
import { LogoutButton } from './LogoutButton';

export function AdminProfileView() {
  return (
    <Stack gap="md" maw={480} mx="auto" w="100%">
      <AccountInfo />
      <LogoutButton />
    </Stack>
  );
}
