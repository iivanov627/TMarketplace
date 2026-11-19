import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

export interface CatalogParams {
  q: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
}

const toPrice = (v: string | null) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export function useCatalogParams() {
  const [sp, setSp] = useSearchParams();

  const params = useMemo<CatalogParams>(() => {
    const page = Number(sp.get('page'));
    return {
      q: sp.get('q') ?? '',
      minPrice: toPrice(sp.get('min')),
      maxPrice: toPrice(sp.get('max')),
      page: Number.isInteger(page) && page > 0 ? page : 1,
    };
  }, [sp]);

  const update = useCallback(
    (patch: Partial<CatalogParams>, opts?: { push?: boolean }) => {
      const next = { ...params, ...patch };
      if (!('page' in patch)) next.page = 1; // любой фильтр возвращает на первую страницу

      const out = new URLSearchParams();
      if (next.q) out.set('q', next.q);
      if (next.minPrice !== undefined) out.set('min', String(next.minPrice));
      if (next.maxPrice !== undefined) out.set('max', String(next.maxPrice));
      if (next.page > 1) out.set('page', String(next.page));
      setSp(out, { replace: !opts?.push });
    },
    [params, setSp],
  );

  const reset = useCallback(() => setSp(new URLSearchParams(), { replace: true }), [setSp]);

  return { params, update, reset } as const;
}
