export type ApiErrorKind = 'network' | 'timeout' | 'aborted' | 'http' | 'parse';
export type FieldErrors = Record<string, string>;

interface ApiErrorInit {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  code?: string;
  fieldErrors?: FieldErrors;
  traceId?: string;
  data?: unknown;
  originalError?: unknown;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly fieldErrors?: FieldErrors;
  readonly traceId?: string;
  readonly data?: unknown;
  readonly originalError?: unknown;

  constructor(init: ApiErrorInit) {
    super(init.message);
    this.name = 'ApiError';
    this.kind = init.kind;
    this.status = init.status;
    this.code = init.code;
    this.fieldErrors = init.fieldErrors;
    this.traceId = init.traceId;
    this.data = init.data;
    this.originalError = init.originalError;
  }

  get isUnauthorized() { return this.status === 401; }
  get isForbidden() { return this.status === 403; }
  get isNotFound() { return this.status === 404; }
  get isConflict() { return this.status === 409; }
  get isValidation() { return this.status === 400 || this.status === 422; }
  get isServer() { return (this.status ?? 0) >= 500; }
  get isNetwork() { return this.kind === 'network' || this.kind === 'timeout'; }
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;
