import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useState } from 'react';

import { isApiError } from '../../../shared/api';
import { notifyError } from '../../../shared/lib/notify/notifyError';
import { signIn } from '../../../entities/session/model/signIn';

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: { login: '', password: '' },
    validate: {
      login: isNotEmpty('Введите email'),
      password: isNotEmpty('Введите пароль'),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    try {
      await signIn(values);
    } catch (error) {
      if (isApiError(error) && error.fieldErrors) {
        form.setErrors(error.fieldErrors);
      } else if (isApiError(error) && (error.isUnauthorized || error.isForbidden)) {
        form.setFieldError('password', 'Неверный email или пароль');
      } else {
        notifyError(error, 'Не удалось войти');
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack gap="md">
        <TextInput
          label="Email"
          placeholder="Введите email"
          type="email"
          inputMode="email"
          autoComplete="email"
          {...form.getInputProps('login')}
        />
        <PasswordInput
          label="Пароль"
          placeholder="Введите пароль"
          autoComplete="current-password"
          {...form.getInputProps('password')}
        />
        <Button type="submit" size="lg" fullWidth loading={loading}>
          Войти
        </Button>
      </Stack>
    </form>
  );
}
