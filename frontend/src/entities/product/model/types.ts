export type ProductStatus =
  | 'DRAFT'
  | 'PENDING_MODERATION'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'HIDDEN'
  | 'DELETED'
  | 'ARCHIVED';

export interface Product {
  id: string;
  sellerId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: ProductStatus;
  imageUrl?: string;
}

export interface ProductListParams {
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}