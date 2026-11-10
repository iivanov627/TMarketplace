import { Flex, Text, UnstyledButton } from '@mantine/core';
import { useNavigate } from 'react-router';
import { IconHome, IconShoppingCart, IconClipboardList, IconUser } from '@tabler/icons-react';

export function BottomNav() {
  const navigate = useNavigate();
  const isAuthenticated = false; // позже — из контекста/JWT

  const handleProtectedClick = (path: string) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <Flex h="100%" justify="space-around" align="center">
      <UnstyledButton onClick={() => navigate('/catalog')}>
        <Flex direction="column" align="center" gap={2}>
          <IconHome size={24} color="var(--mantine-color-dark-4)" stroke={2.5} />
          <Text size="xs" c="dark.4">Каталог</Text>
        </Flex>
      </UnstyledButton>

      <UnstyledButton onClick={() => handleProtectedClick('/cart')}>
        <Flex direction="column" align="center" gap={2}>
          <IconShoppingCart size={24} color="var(--mantine-color-dark-4)" stroke={2.5} />
          <Text size="xs" c="dark.4">Корзина</Text>
        </Flex>
      </UnstyledButton>

      <UnstyledButton onClick={() => handleProtectedClick('/orders')}>
        <Flex direction="column" align="center" gap={2}>
          <IconClipboardList size={24} color="var(--mantine-color-dark-4)" stroke={2.5} />
          <Text size="xs" c="dark.4">Заказы</Text>
        </Flex>
      </UnstyledButton>

      <UnstyledButton onClick={() => handleProtectedClick('/profile')}>
        <Flex direction="column" align="center" gap={2}>
          <IconUser size={24} color="var(--mantine-color-dark-4)" stroke={2.5} />
          <Text size="xs" c="dark.4">Кабинет</Text>
        </Flex>
      </UnstyledButton>
    </Flex>
  );
}