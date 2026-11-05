import { Routes, Route, Navigate } from 'react-router';

import { CatalogPage } from '../pages/catalog';
import { ProductPage } from '../pages/product';
import { LoginPage } from '../pages/login';
import { RegisterPage } from '../pages/register';

import { CartPage } from '../pages/cart';
import { OrdersPage } from '../pages/orders';
import { ProfilePage } from '../pages/profile';

import { SellerProductsPage } from '../pages/seller/products';
import { SellerProductNewPage } from '../pages/seller/product-new';
import { SellerProductEditPage } from '../pages/seller/product-edit';
import { SellerOrdersPage } from '../pages/seller/orders';
import { SellerOrderPage } from '../pages/seller/order';

import { AdminProductsPage } from '../pages/admin/products';
import { AdminProductNewPage } from '../pages/admin/product-new';
import { AdminProductEditPage } from '../pages/admin/product-edit';
import { AdminOrdersPage } from '../pages/admin/orders';
import { AdminOrderPage } from '../pages/admin/order';
import { AdminBonusesPage } from '../pages/admin/bonuses';


import { NotFoundPage } from '../pages/not-found';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/catalog" replace />} />

      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/cart" element={<CartPage/>} />
      <Route path="/order" element={<OrdersPage/>} />
      <Route path="/profile" element={<ProfilePage/>} />

      <Route path="/seller/products" element={<SellerProductsPage />} />
      <Route path="/seller/products/new" element={<SellerProductNewPage />} />
      <Route path="/seller/products/:id/edit" element={<SellerProductEditPage />} />
      <Route path="/seller/orders" element={<SellerOrdersPage />} />
      <Route path="/seller/orders/:id" element={<SellerOrderPage />} />

      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/products/new" element={<AdminProductNewPage />} />
      <Route path="/admin/products/:id/edit" element={<AdminProductEditPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="/admin/orders/:id" element={<AdminOrderPage />} />
      <Route path="/admin/bonuses" element={<AdminBonusesPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}