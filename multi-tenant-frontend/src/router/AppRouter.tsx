import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    ShoppingOutlined,
    SettingOutlined,
    GlobalOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import BasicLayout from '../layouts/ProLayout/BasicLayout';
import PageContainer from '../layouts/ProLayout/PageContainer';
import CardWidget from '../components/common/CardWidget';
import LandingPage from '../pages/LandingPage';
import SaUsersPage from "../pages/sa/SaUsersPage";
import TenantsPage from '../pages/sa/TenantsPage';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import { APP_ROLES, getDefaultRouteForRole } from '../types/auth';
import { ROUTES } from './routes';

// tenantAdminMenu
import DashboardPage from "../pages/admin/DashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import ProductsPage from "../pages/admin/ProductsPage";
import OrdersPage from "../pages/admin/OrdersPage";
import SettingsPage from "../pages/admin/SettingsPage";
import OrderDetailsPage from "../pages/admin/OrderDetailsPage";


// Users 
import StoreLayout from '../layouts/StoreLayout';
import StoreProductsPage from '../pages/store/StoreProductsPage';
import StoreOrdersPage from '../pages/store/StoreOrdersPage';
import StoreSettingsPage from '../pages/store/StoreSettingsPage';
import CartPage from '../pages/store/CartPage';
import CheckoutPage from '../pages/store/CheckoutPage';
import StoreOrderDetailsPage from '../pages/store/StoreOrderDetailsPage';


// --- Menu Definitions ---

const superAdminMenu = [
    { key: ROUTES.superAdmin.dashboard, icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: ROUTES.superAdmin.tenants, icon: <GlobalOutlined />, label: 'Tenants' },
    { key: ROUTES.superAdmin.users,   icon: <UserOutlined />, label: 'Users' },  
    { key: ROUTES.superAdmin.settings, icon: <SettingOutlined />, label: 'System Settings' },
];

const tenantAdminMenu = [
    { key: ROUTES.tenantAdmin.dashboard, icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: ROUTES.tenantAdmin.users, icon: <UserOutlined />, label: 'Users' },
    { key: ROUTES.tenantAdmin.products, icon: <ShoppingOutlined />, label: 'Products' },
    { key: ROUTES.tenantAdmin.orders, icon: <FileTextOutlined />, label: 'Orders' },
    { key: ROUTES.store.settings, icon: <SettingOutlined />, label: 'Settings' },
];

// --- Placeholder Page Component ---
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
    <PageContainer
        header={{
            title,
            breadcrumbs: [{ title: 'Home' }, { title }]
        }}
    >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <CardWidget>
                <div className="text-gray-500 mb-1">Total Users</div>
                <div className="text-2xl font-bold">1,234</div>
            </CardWidget>
            <CardWidget>
                <div className="text-gray-500 mb-1">Revenue</div>
                <div className="text-2xl font-bold">$12,345</div>
            </CardWidget>
            <CardWidget>
                <div className="text-gray-500 mb-1">Active Orders</div>
                <div className="text-2xl font-bold">45</div>
            </CardWidget>
            <CardWidget>
                <div className="text-gray-500 mb-1">Growth</div>
                <div className="text-2xl font-bold text-green-500">+12%</div>
            </CardWidget>
        </div>

        <CardWidget title="Content Area">
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded">
                <span className="text-gray-400">Content for {title} goes here</span>
            </div>
        </CardWidget>
    </PageContainer>
);

const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const defaultRoute = getDefaultRouteForRole(user?.role);

  return (
    <BrowserRouter>
      <Routes>
        {/* Root: حسب عامل Login أو لا */}
        <Route
          path={ROUTES.root}
          element={
            isAuthenticated
              ? <Navigate to={defaultRoute} replace />
              : <LandingPage />
          }
        />

        {/* Login */}
        <Route element={<AuthLayout />}>
          <Route
            path={ROUTES.login}
            element={
              isAuthenticated
                ? <Navigate to={defaultRoute} replace />
                : <LoginPage />
            }
          />
        </Route>

       {/* Super Admin Routes */}
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

        {/* Tenant User Routes */}
            <Route element={<ProtectedRoute allowedRoles={[APP_ROLES.tenantUser, APP_ROLES.tenantAdmin]} />}>
              <Route path={ROUTES.store.root} element={<StoreLayout />}>
              <Route index element={<Navigate to="products" replace />} />
              <Route path="products" element={<StoreProductsPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="orders" element={<StoreOrdersPage />} />
              <Route path="orders/:orderId" element={<StoreOrderDetailsPage />} />
              <Route path="settings" element={<StoreSettingsPage />} />
              </Route>
            </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
