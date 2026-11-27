import { Stack, Text } from '@mantine/core';

import { useViewer } from '../../../entities/session';
import { AccountInfo, InfoRow } from './AccountInfo';
import { LogoutButton } from './LogoutButton';

export function SellerProfileView() {
  const { organizationName } = useViewer();

  return (
    <Stack gap="md" maw={480} mx="auto" w="100%">
      <AccountInfo>
        {organizationName && (
          <InfoRow label="Организация">
            <Text size="sm" fw={600} truncate>
              {organizationName}
            </Text>
          </InfoRow>
        )}
      </AccountInfo>
      <LogoutButton />
    </Stack>
  );
}
