import { Stack } from '@mantine/core';

import { AccountInfo } from './AccountInfo';
import { BecomeSellerButton } from './BecomeSellerButton';
import { LogoutButton } from './LogoutButton';

export function BuyerProfileView() {
  return (
    <Stack gap="md" maw={480} mx="auto" w="100%">
      <AccountInfo />
      <BecomeSellerButton />
      <LogoutButton />
    </Stack>
  );
}
