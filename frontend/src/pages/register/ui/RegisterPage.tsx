import { Anchor, Stack, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link, Navigate } from 'react-router';

import { useViewer } from '../../../entities/session';
import { ROUTES } from '../../../shared/config/routes';
import { RegisterForm } from './RegisterForm';

export function RegisterPage() {
  useDocumentTitle('Регистрация');

  const viewer = useViewer();

  // Уже вошёл или только что зарегистрировался: ведём в каталог
  if (viewer.role !== 'guest') {
    return <Navigate to={ROUTES.CATALOG} replace />;
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

      <Stack gap={4}>
        <Title order={1} fz={24}>
          Регистрация
        </Title>
        <Text size="sm" c="dimmed">
          Создайте аккаунт
        </Text>
      </Stack>

      <RegisterForm />

      <Text ta="center" size="sm" c="dimmed">
        Уже есть аккаунт?{' '}
        <Anchor component={Link} to={ROUTES.LOGIN} fw={600} c="dark">
          Войти
        </Anchor>
      </Text>
    </Stack>
  );
}
