import type { FieldErrors } from './ApiError';

type Json = Record<string, unknown>;
const isObject = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v : undefined);

function normalizeFieldErrors(raw: unknown): FieldErrors | undefined {
  const out: FieldErrors = {};

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (isObject(item)) {
        const field = str(item.field) ?? str(item.name);
        const message = str(item.message) ?? str(item.defaultMessage);
        if (field && message && !out[field]) out[field] = message;
      }
    }
  } else if (isObject(raw)) {
    for (const [field, value] of Object.entries(raw)) {
      const message = Array.isArray(value) ? str(value[0]) : str(value);
      if (message) out[field] = message;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

export interface ParsedErrorBody {
  message?: string;
  code?: string;
  traceId?: string;
  fieldErrors?: FieldErrors;
}

export function parseErrorBody(body: unknown): ParsedErrorBody {
  if (typeof body === 'string') {
    // HTML-страницы прокси и API Gateway пользователю не показываем
    return body.trimStart().startsWith('<') ? {} : { message: str(body)?.slice(0, 300) };
  }
  if (!isObject(body)) return {};

  return {
    message: str(body.message) ?? str(body.detail) ?? str(body.title) ?? str(body.error),
    code: str(body.code) ?? str(body.errorCode),
    traceId: str(body.traceId) ?? str(body.requestId),
    fieldErrors: normalizeFieldErrors(body.errors ?? body.fieldErrors ?? body.violations),
  };
}
