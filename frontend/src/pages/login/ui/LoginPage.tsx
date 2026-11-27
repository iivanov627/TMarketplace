import { Anchor, Divider, Stack, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link, Navigate, useLocation } from 'react-router';

import { useViewer } from '../../../entities/session';
import { ROUTES } from '../../../shared/config/routes';
import { LoginForm } from './LoginForm';
import { TBankLoginButton } from './TBankLoginButton';

function getRedirectPath(state: unknown): string {
  const from = (state as { from?: { pathname?: string; search?: string } } | null)?.from;
  const path = from?.pathname;

  if (
    path &&
    path.startsWith('/') &&
    !path.startsWith('//') &&
    path !== ROUTES.LOGIN &&
    path !== ROUTES.REGISTER
  ) {
    return `${path}${from?.search ?? ''}`;
  }
  return ROUTES.CATALOG;
}

export function LoginPage() {
  useDocumentTitle('Вход');

  const viewer = useViewer();
  const location = useLocation();

  if (viewer.role !== 'guest') {
    return <Navigate to={getRedirectPath(location.state)} replace />;
  }

  return (
    <Stack gap="lg" pb="xl" maw={480} mx="auto" w="100%">
      <Anchor
        component={Link}
        to={ROUTES.CATALOG}
        size="sm"
        c="dimmed"
        display="inline-flex"
        w="fit-content"
        style={{ alignItems: 'center', gap: 6 }}
      >
        <IconArrowLeft size={16} />
        В каталог
      </Anchor>

      <Title order={1} fz={24}>
        Вход
      </Title>

      <LoginForm />

      <Divider label="или" labelPosition="center" />

      <TBankLoginButton />

      <Text ta="center" size="sm" c="dimmed">
        Нет аккаунта?{' '}
        <Anchor component={Link} to={ROUTES.REGISTER} state={location.state} fw={600} c="dark">
          Зарегистрироваться
        </Anchor>
      </Text>
    </Stack>
  );
}
