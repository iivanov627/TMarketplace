import type { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Беспроводные наушники T-Sound Pro',
    description: 'Активное шумоподавление и до 30 часов работы без подзарядки.',
    price: 4500,
    stock: 12,
    categoryId: 'cat-1',
    sellerId: 'seller-1',
    status: 'PUBLISHED'
  },
  {
    id: '2',
    name: 'Умная колонка с голосовым помощником',
    description: 'Чистый звук, управление умным домом и будильник.',
    price: 3200,
    stock: 5,
    categoryId: 'cat-1',
    sellerId: 'seller-1',
    status: 'PUBLISHED'
  },
  {
    id: '3',
    name: 'Рюкзак для ноутбука 15.6"',
    description: 'Водоотталкивающая ткань, скрытый карман и USB-порт.',
    price: 2100,
    stock: 8,
    categoryId: 'cat-2',
    sellerId: 'seller-2',
    status: 'PUBLISHED'
  },
  {
    id: '4',
    name: 'Термокружка из нержавеющей стали 500 мл',
    description: 'Держит тепло до 8 часов, герметичная крышка с замком.',
    price: 950,
    stock: 25,
    categoryId: 'cat-3',
    sellerId: 'seller-2',
    status: 'PUBLISHED'
  },
];
