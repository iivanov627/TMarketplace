import { describe, expect, it } from 'vitest';
import { parseErrorBody } from './parseErrorBody';

describe('parseErrorBody', () => {
  it('извлекает стандартное сообщение об ошибке и traceId из ответа бэкенда', () => {
    const result = parseErrorBody({
      message: 'Товар не найден',
      traceId: 'req-98765',
    });

    expect(result.message).toBe('Товар не найден');
    expect(result.traceId).toBe('req-98765');
  });

  it('собирает ошибки валидации по конкретным полям из массива violations', () => {
    const result = parseErrorBody({
      title: 'Validation Failed',
      violations: [
        { field: 'price', message: 'Цена должна быть больше 0' },
        { field: 'name', message: 'Название не может быть пустым' },
      ],
    });

    expect(result.message).toBe('Validation Failed');
    expect(result.fieldErrors).toEqual({
      price: 'Цена должна быть больше 0',
      name: 'Название не может быть пустым',
    });
  });

  it('игнорирует сырой HTML-код при ошибках прокси-сервера (например, 502 Bad Gateway)', () => {
    const result = parseErrorBody('<!DOCTYPE html><html><body><h1>502 Bad Gateway</h1></body></html>');

    expect(result.message).toBeUndefined();
    expect(result.fieldErrors).toBeUndefined();
  });

  it('корректно обрабатывает пустое тело ответа (null или undefined)', () => {
    expect(parseErrorBody(null)).toEqual({});
    expect(parseErrorBody(undefined)).toEqual({});
  });
});
