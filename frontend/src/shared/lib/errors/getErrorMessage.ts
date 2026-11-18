import { isApiError } from '../../api';

export function getErrorMessage(error: unknown): string {
  // Если упала не сеть/сервер, а произошла внутренняя ошибка кода
  if (!isApiError(error)) {
    return 'Что-то пошло не так. Попробуйте ещё раз';
  }

  // Сетевые сбои и таймауты
  if (error.kind === 'network') return 'Нет соединения с сервером';
  if (error.kind === 'timeout') return 'Сервер долго не отвечает. Попробуйте позже';

  // Основные HTTP-статусы
  if (error.isUnauthorized) return 'Нужно войти в аккаунт';
  if (error.isForbidden) return 'Недостаточно прав для этого действия';
  if (error.isNotFound) return 'Ничего не найдено';
  if (error.isServer) return 'Ошибка на сервере. Попробуйте позже';

  // Для 400, 409, 422 возвращаем конкретное сообщение от бэкенда (например, "Товар закончился")
  return error.message || 'Проверьте введённые данные';
}
