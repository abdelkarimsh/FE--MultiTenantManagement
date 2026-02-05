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

// tenantAdminMenu
import DashboardPage from "../pages/admin/DashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import ProductsPage from "../pages/admin/ProductsPage";
import OrdersPage from "../pages/admin/OrdersPage";
import SettingsPage from "../pages/admin/SettingsPage";


// Users 
import StoreLayout from '../layouts/StoreLayout';
import StoreProductsPage from '../pages/store/StoreProductsPage';
import StoreOrdersPage from '../pages/store/StoreOrdersPage';


// --- Menu Definitions ---

const superAdminMenu = [
    { key: '/sa/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/sa/tenants', icon: <GlobalOutlined />, label: 'Tenants' },
    { key: '/sa/users',   icon: <UserOutlined />, label: 'Users' },  
    { key: '/sa/settings', icon: <SettingOutlined />, label: 'System Settings' },
];

const tenantAdminMenu = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/admin/users', icon: <UserOutlined />, label: 'Users' },
    { key: '/admin/products', icon: <ShoppingOutlined />, label: 'Products' },
    { key: '/admin/orders', icon: <FileTextOutlined />, label: 'Orders' },
    { key: '/admin/settings', icon: <SettingOutlined />, label: 'Settings' },
];

const tenantUserMenu = [
    { key: '/app/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/app/products', icon: <ShoppingOutlined />, label: 'Products' },
    { key: '/app/orders', icon: <FileTextOutlined />, label: 'My Orders' },
    { key: '/app/profile', icon: <UserOutlined />, label: 'Profile' },
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
  const role = user?.role ?? '';

  const getDefaultDashboard = () => {
    if (role === 'SystemAdmin') return '/sa/dashboard';
    if (role === 'TenantAdmin') return '/admin/dashboard';
    if (role === 'User') return '/store/products';
    return '/login';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Root: حسب عامل Login أو لا */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to={getDefaultDashboard()} replace />
              : <LandingPage />
          }
        />

        {/* Login */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              isAuthenticated
                ? <Navigate to={getDefaultDashboard()} replace />
                : <LoginPage />
            }
          />
        </Route>

       {/* Super Admin Routes */}
        <Route path="/sa" element={<BasicLayout menuItems={superAdminMenu} />}>
            <Route index element={<Navigate to="/sa/tenants" replace />} />
             <Route path="tenants" element={<TenantsPage />} />

            <Route path="dashboard" element={<PlaceholderPage title="Super Admin Dashboard" />} />
            <Route path="users" element={<SaUsersPage />} />
            <Route path="settings" element={<PlaceholderPage title="System Settings" />} />
        </Route>


       <Route path="/admin" element={<BasicLayout menuItems={tenantAdminMenu} />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="settings" element={<SettingsPage />} />
     </Route>

        {/* Tenant User Routes */}
            <Route path="/store" element={<StoreLayout />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<StoreProductsPage />} />
            <Route path="orders" element={<StoreOrdersPage />} />
            </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
