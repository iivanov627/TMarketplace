import { Box, Button, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';

function TBankMark() {
  return (
    <Box
      w={20}
      h={20}
      bg="#FFDD2D"
      display="flex"
      style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}
    >
      <Text fz={12} fw={800} c="black" lh={1}>
        Т
      </Text>
    </Box>
  );
}

export function TBankLoginButton() {

  return (
    <Button variant="default" size="lg" fullWidth leftSection={<TBankMark />}>
      Войти с помощью Т-Банка
    </Button>
  );
}
