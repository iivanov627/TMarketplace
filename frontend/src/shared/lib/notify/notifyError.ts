import { notifications } from '@mantine/notifications';

import { isApiError } from '../../api';
import { getErrorMessage } from '../errors/getErrorMessage';

export function notifyError(error: unknown, title = 'Ошибка') {
  // Если запрос отменился сам (например, пользователь ушел со страницы), пугать его красным окном не нужно
  if (isApiError(error) && error.kind === 'aborted') {
    return;
  }

  notifications.show({
    color: 'red',
    title,
    message: getErrorMessage(error),
  });
}
