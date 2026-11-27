import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useNavigate } from "react-router";

import { sessionApi, signIn } from "../../../entities/session";
import { isApiError } from "../../../shared/api";
import { ROUTES } from "../../../shared/config/routes";
import { notifyError } from "../../../shared/lib/notify/notifyError";
import { registerValidation } from "../model/validation";

export function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: { login: "", password: "", passwordConfirm: "" },
    validate: registerValidation,
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);

    try {
      await sessionApi.register({
        login: values.login.trim(),
        password: values.password,
      });
    } catch (error) {
      if (isApiError(error) && error.fieldErrors) {
        form.setErrors(error.fieldErrors);
      } else if (isApiError(error) && error.isConflict) {
        form.setFieldError("login", "Этот email уже зарегистрирован");
      } else {
        notifyError(error, "Не удалось зарегистрироваться");
      }
      setLoading(false);
      return;
    }

    try {
      await signIn({ login: values.login, password: values.password });
    } catch {
      notifications.show({
        color: "green",
        title: "Аккаунт создан",
        message: "Теперь можно войти с новым паролем",
      });
      navigate(ROUTES.LOGIN, { replace: true });
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
          {...form.getInputProps("login")}
        />
        <PasswordInput
          label="Пароль"
          placeholder="Введите пароль"
          autoComplete="new-password"
          description="Минимум 8 символов: заглавная и строчная латинские буквы, цифра и спецсимвол"
          {...form.getInputProps("password")}
        />
        <PasswordInput
          label="Повторите пароль"
          placeholder="Введите пароль"
          autoComplete="new-password"
          {...form.getInputProps("passwordConfirm")}
        />
        <Button type="submit" size="lg" fullWidth loading={loading}>
          Зарегистрироваться
        </Button>
      </Stack>
    </form>
  );
}
