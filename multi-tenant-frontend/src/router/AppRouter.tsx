import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_ROLES, getDefaultRouteForRole } from '../types/auth';
import { ROUTES } from './routes';
import ProtectedRoute from './ProtectedRoute';
import { superAdminMenu, tenantAdminMenu } from './menuConfig';
import { PlaceholderPage } from './RouterPlaceholders';
import AuthLayout from '../layouts/AuthLayout';
import BasicLayout from '../layouts/ProLayout/BasicLayout';
import StoreLayout from '../layouts/StoreLayout';
import PublicLayout from '../layouts/PublicLayout';
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import FeaturesPage from '../pages/public/FeaturesPage';
import LoginPage from '../pages/auth/LoginPage';
import TenantsPage from '../pages/sa/TenantsPage';
import SaUsersPage from '../pages/sa/SaUsersPage';
import DashboardPage from '../pages/admin/DashboardPage';
import UsersPage from '../pages/admin/UsersPage';
import ProductsPage from '../pages/admin/ProductsPage';
import OrdersPage from '../pages/admin/OrdersPage';
import OrderDetailsPage from '../pages/admin/OrderDetailsPage';
import SettingsPage from '../pages/admin/SettingsPage';
import StoreProductsPage from '../pages/store/StoreProductsPage';
import CartPage from '../pages/store/CartPage';
import CheckoutPage from '../pages/store/CheckoutPage';
import StoreOrdersPage from '../pages/store/StoreOrdersPage';
import StoreOrderDetailsPage from '../pages/store/StoreOrderDetailsPage';

const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const defaultRoute = getDefaultRouteForRole(user?.role);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            isAuthenticated
              ? <Navigate to={defaultRoute} replace />
              : <PublicLayout />
          }
        >
          <Route path={ROUTES.root} element={<HomePage />} />
          <Route path={ROUTES.about} element={<AboutPage />} />
          <Route path={ROUTES.features} element={<FeaturesPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route
            path={ROUTES.login}
            element={<LoginPage />}
          />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[APP_ROLES.systemAdmin]} />}>
          <Route path={ROUTES.superAdmin.root} element={<BasicLayout menuItems={superAdminMenu} />}>
            <Route index element={<Navigate to={ROUTES.superAdmin.tenants} replace />} />
            <Route path="tenants" element={<TenantsPage />} />
            <Route path="dashboard" element={<PlaceholderPage title="Super Admin Dashboard" />} />
            <Route path="users" element={<SaUsersPage />} />
            <Route path="settings" element={<PlaceholderPage title="System Settings" />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[APP_ROLES.tenantAdmin]} />}>
          <Route path={ROUTES.tenantAdmin.root} element={<BasicLayout menuItems={tenantAdminMenu} />}>
            <Route index element={<Navigate to={ROUTES.tenantAdmin.dashboard} replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:orderId" element={<OrderDetailsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[APP_ROLES.tenantUser, APP_ROLES.tenantAdmin]} />}>
          <Route path={ROUTES.store.root} element={<StoreLayout />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<StoreProductsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<StoreOrdersPage />} />
            <Route path="orders/:orderId" element={<StoreOrderDetailsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
