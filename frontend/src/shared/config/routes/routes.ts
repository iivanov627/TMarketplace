export const ROUTES = {
  // Публичные
  CATALOG: '/catalog',
  PRODUCT: (id: number | string) => `/product/${id}`,
  PRODUCT_PATTERN: '/product/:id',
  LOGIN: '/login',
  REGISTER: '/register',

  // Покупатель
  CART: '/cart',
  FAVORITES: '/favorites',
  ORDERS: '/orders',
  PROFILE: '/profile',

  // Продавец
  SELLER_PRODUCTS: '/seller/products',
  SELLER_PRODUCT_NEW: '/seller/products/new',
  SELLER_PRODUCT_EDIT: (id: number | string) => `/seller/products/${id}/edit`,
  SELLER_ORDERS: '/seller/orders',
  SELLER_ORDER: (id: number | string) => `/seller/orders/${id}`,

  // Админ
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_NEW: '/admin/products/new',
  ADMIN_PRODUCT_EDIT: (id: number | string) => `/admin/products/${id}/edit`,
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER: (id: number | string) => `/admin/orders/${id}`,
  ADMIN_BONUSES: '/admin/bonuses',

  SELLER_PRODUCT_EDIT_PATTERN: '/seller/products/:id/edit',
  SELLER_ORDER_PATTERN: '/seller/orders/:id',
  ADMIN_PRODUCT_EDIT_PATTERN: '/admin/products/:id/edit',
  ADMIN_ORDER_PATTERN: '/admin/orders/:id',

  // Служебное
  NOT_FOUND: '*',
} as const;