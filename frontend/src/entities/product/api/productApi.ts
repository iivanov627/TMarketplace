import { apiClient, type Page } from '../../../shared/api';
import { MOCK_PRODUCTS } from '../model/mockProducts';
import type { Product, ProductListParams } from '../model/types';

const USE_MOCK = true;

export const productApi = {
  async list(params: ProductListParams, signal?: AbortSignal): Promise<Page<Product>> {
    let items: Product[] = [];

    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      items = [...MOCK_PRODUCTS];

      if (params.q) {
        const query = params.q.toLowerCase();
        items = items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
      }
      if (params.categoryId) {
        items = items.filter((item) => item.categoryId === params.categoryId);
      }
      if (params.minPrice !== undefined) {
        items = items.filter((item) => item.price >= params.minPrice!);
      }
      if (params.maxPrice !== undefined) {
        items = items.filter((item) => item.price <= params.maxPrice!);
      }
    } else {
      const { data } = await apiClient.get<Product[]>('/products', {
        params: {
          q: params.q,
          categoryId: params.categoryId,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
        },
        signal,
        skipAuth: true,
      });
      items = data;
    }

    // Нарезаем массив на страницы на стороне клиента, пока бэкенд отдает весь список целиком
    const page = params.page ?? 1;
    const size = params.size ?? 12;
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / size));
    const startIndex = (page - 1) * size;

    return {
      items: items.slice(startIndex, startIndex + size),
      total,
      page,
      size,
      totalPages,
    };
  },

  async getById(productId: string, signal?: AbortSignal): Promise<Product> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const found = MOCK_PRODUCTS.find((item) => item.id === productId);
      if (!found) throw new Error('Товар не найден');
      return found;
    }

    const { data } = await apiClient.get<Product>(`/products/${productId}`, {
      signal,
      skipAuth: true,
    });
    return data;
  },
};
