export const registerValidation = {
  login: (value: string) => {
    const login = value.trim();
    if (!/^\S+@\S+\.\S+$/.test(login)) return 'Введите корректный email';
    if (login.length < 6) return 'Минимум 6 символов';
    if (login.length > 100) return 'Максимум 100 символов';
    return null;
  },
  password: (value: string) => {
    if (value.length < 8) return 'Минимум 8 символов';
    if (value.length > 72) return 'Максимум 72 символа';
    if (!/^[\x21-\x7E]+$/.test(value)) {
      return 'Только латинские буквы, цифры и спецсимволы, без пробелов';
    }
    if (!/[A-Z]/.test(value)) return 'Добавьте хотя бы одну заглавную латинскую букву';
    if (!/[a-z]/.test(value)) return 'Добавьте хотя бы одну строчную латинскую букву';
    if (!/\d/.test(value)) return 'Добавьте хотя бы одну цифру';
    if (!/[^A-Za-z0-9]/.test(value)) return 'Добавьте хотя бы один спецсимвол (например, ! @ # $)';
    return null;
  },
  passwordConfirm: (value: string, values: { password: string }) =>
    value !== values.password ? 'Пароли не совпадают' : null,
};
