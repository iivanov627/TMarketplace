import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { signOut } from '../../../entities/session';
import { ROUTES } from '../../../shared/config/routes';
import { ConfirmDialog } from '../../../shared/ui';

export function LogoutButton() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await signOut();
      queryClient.clear(); 
      close();
      navigate(ROUTES.LOGIN, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="default" color="red" c="red" size="lg" fullWidth onClick={open}>
        Выйти из аккаунта
      </Button>

      <ConfirmDialog
        opened={opened}
        onClose={close}
        title="Выход из аккаунта"
        description="Вы сможете войти снова в любой момент."
        confirmLabel="Выйти"
        cancelLabel="Отмена"
        loading={loading}
        onConfirm={handleConfirm}
      />
    </>
  );
}
