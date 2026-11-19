import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';

import type { ProductListParams } from '../model/types';
import { productApi } from './productApi';

export const productKeys = {
  all: ['products'] as const,
  list: (params: ProductListParams) => [...productKeys.all, 'list', params] as const,
};

export const productListQuery = (params: ProductListParams) =>
  queryOptions({
    queryKey: productKeys.list(params),
    queryFn: ({ signal }) => productApi.list(params, signal),
    placeholderData: keepPreviousData, 
    staleTime: 30_000, // данные считаются свежими 30 секунд
  });

export const useProducts = (params: ProductListParams) => {
  return useQuery(productListQuery(params));
};

export const productDetailsQuery = (id: string) =>
  queryOptions({
    queryKey: [...productKeys.all, 'details', id] as const,
    queryFn: ({ signal }) => productApi.getById(id, signal),
    enabled: Boolean(id),
    staleTime: 60_000,
  });

export const useProduct = (id: string) => {
  return useQuery(productDetailsQuery(id));
};