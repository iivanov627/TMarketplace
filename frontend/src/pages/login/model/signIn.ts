import { pickRole, sessionApi, sessionStore } from '../../../entities/session';

export async function signIn(values: { login: string; password: string }) {
  const tokens = await sessionApi.login({
    login: values.login.trim(),
    password: values.password,
  });
  const user = await sessionApi.whoami(tokens.accessToken);

  // Сохраняем сессию только когда оба запроса прошли успешно
  sessionStore.setSession(tokens.accessToken, tokens.refreshToken, {
    id: user.id,
    login: user.login,
    role: pickRole(user.roles),
  });
}
