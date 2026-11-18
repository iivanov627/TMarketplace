import {
  IconBox,
  IconCirclePlus,
  IconHeart,
  IconHome,
  IconReceipt,
  IconShoppingCart,
  IconUser,
  type Icon,
} from '@tabler/icons-react';

import type { Role } from '../../../entities/session';
import { ROUTES } from '../../../shared/config/routes';

export interface NavTab {
  id: string;
  label: string;
  icon: Icon;
  to: string;
  match: string[];
}

const catalog: NavTab = {
  id: 'catalog',
  label: 'Каталог',
  icon: IconHome,
  to: ROUTES.CATALOG,
  match: [ROUTES.CATALOG, '/product'],
};

// гость: вкладки, требующие входа, ведут на /login
const guestOnly = (id: string, label: string, icon: Icon): NavTab => ({
  id,
  label,
  icon,
  to: ROUTES.LOGIN,
  match: [],
});

export const NAV_TABS: Record<Role, NavTab[]> = {
  guest: [
    catalog,
    guestOnly('favorites', 'Избранное', IconHeart),
    guestOnly('cart', 'Корзина', IconShoppingCart),
    guestOnly('profile', 'Профиль', IconUser),
  ],
  buyer: [
    catalog,
    { id: 'favorites', label: 'Избранное', icon: IconHeart, to: ROUTES.FAVORITES, match: [ROUTES.FAVORITES] },
    { id: 'cart', label: 'Корзина', icon: IconShoppingCart, to: ROUTES.CART, match: [ROUTES.CART] },
    { id: 'profile', label: 'Профиль', icon: IconUser, to: ROUTES.PROFILE, match: [ROUTES.PROFILE, ROUTES.ORDERS] },
  ],
  seller: [
    { id: 'products', label: 'Товары', icon: IconBox, to: ROUTES.SELLER_PRODUCTS, match: [ROUTES.SELLER_PRODUCTS] },
    { id: 'orders', label: 'Заказы', icon: IconReceipt, to: ROUTES.SELLER_ORDERS, match: [ROUTES.SELLER_ORDERS] },
    catalog,
    { id: 'profile', label: 'Профиль', icon: IconUser, to: ROUTES.PROFILE, match: [ROUTES.PROFILE] },
  ],
  admin: [
    catalog,
    { id: 'products', label: 'Товары', icon: IconBox, to: ROUTES.ADMIN_PRODUCTS, match: [ROUTES.ADMIN_PRODUCTS] },
    { id: 'orders', label: 'Заказы', icon: IconReceipt, to: ROUTES.ADMIN_ORDERS, match: [ROUTES.ADMIN_ORDERS] },
    { id: 'bonuses', label: 'Бонусы', icon: IconCirclePlus, to: ROUTES.ADMIN_BONUSES, match: [ROUTES.ADMIN_BONUSES] },
    { id: 'profile', label: 'Профиль', icon: IconUser, to: ROUTES.PROFILE, match: [ROUTES.PROFILE] },
  ],
};