import { Routes, Route, Navigate } from "react-router";

import { ROUTES } from "../shared/config/routes";

import { CatalogPage } from "../pages/catalog";
import { ProductPage } from "../pages/product";
import { LoginPage } from "../pages/login";
import { RegisterPage } from "../pages/register";

import { CartPage } from "../pages/cart";
import { OrdersPage } from "../pages/orders";
import { ProfilePage } from "../pages/profile";

import { SellerProductsPage } from "../pages/seller/products";
import { SellerProductNewPage } from "../pages/seller/product-new";
import { SellerProductEditPage } from "../pages/seller/product-edit";
import { SellerOrdersPage } from "../pages/seller/orders";
import { SellerOrderPage } from "../pages/seller/order";

import { AdminProductsPage } from "../pages/admin/products";
import { AdminProductNewPage } from "../pages/admin/product-new";
import { AdminProductEditPage } from "../pages/admin/product-edit";
import { AdminOrdersPage } from "../pages/admin/orders";
import { AdminOrderPage } from "../pages/admin/order";
import { AdminBonusesPage } from "../pages/admin/bonuses";

import { NotFoundPage } from "../pages/not-found";
import { UiKitPage } from "../pages/ui-kit/UiKitPage";

import { MainLayout } from "./layouts";
import { AuthLayout } from "./layouts";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      <Route element={<MainLayout />}>
        {/* Редирект с корня */}
        <Route path="/" element={<Navigate to={ROUTES.CATALOG} replace />} />
        {/* Публичные */}
        <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
        <Route path={ROUTES.PRODUCT_PATTERN} element={<ProductPage />} />
        {/* Покупатель */}
        <Route path={ROUTES.CART} element={<CartPage />} />
        <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        {/* Продавец */}
        <Route path={ROUTES.SELLER_PRODUCTS} element={<SellerProductsPage />} />
        <Route
          path={ROUTES.SELLER_PRODUCT_NEW}
          element={<SellerProductNewPage />}
        />
        <Route
          path="/seller/products/:id/edit"
          element={<SellerProductEditPage />}
        />
        <Route path={ROUTES.SELLER_ORDERS} element={<SellerOrdersPage />} />
        <Route path="/seller/orders/:id" element={<SellerOrderPage />} />
        {/* Админ */}
        <Route path={ROUTES.ADMIN_PRODUCTS} element={<AdminProductsPage />} />
        <Route
          path={ROUTES.ADMIN_PRODUCT_NEW}
          element={<AdminProductNewPage />}
        />
        <Route
          path="/admin/products/:id/edit"
          element={<AdminProductEditPage />}
        />
        <Route path={ROUTES.ADMIN_ORDERS} element={<AdminOrdersPage />} />
        <Route path="/admin/orders/:id" element={<AdminOrderPage />} />
        <Route path={ROUTES.ADMIN_BONUSES} element={<AdminBonusesPage />} />

        {/* UI-kit для разработки */}
        <Route path="/ui-kit" element={<UiKitPage />} />

        {/* 404 */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
