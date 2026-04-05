import {
  DashboardOutlined,
  FileTextOutlined,
  GlobalOutlined,
  SettingOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ROUTES } from './routes';

export const superAdminMenu = [
  { key: ROUTES.superAdmin.dashboard, icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: ROUTES.superAdmin.tenants, icon: <GlobalOutlined />, label: 'Tenants' },
  { key: ROUTES.superAdmin.users, icon: <UserOutlined />, label: 'Users' },
  { key: ROUTES.superAdmin.settings, icon: <SettingOutlined />, label: 'System Settings' },
];

export const tenantAdminMenu = [
  { key: ROUTES.tenantAdmin.dashboard, icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: ROUTES.tenantAdmin.users, icon: <UserOutlined />, label: 'Users' },
  { key: ROUTES.tenantAdmin.products, icon: <ShoppingOutlined />, label: 'Products' },
  { key: ROUTES.tenantAdmin.orders, icon: <FileTextOutlined />, label: 'Orders' },
  { key: ROUTES.store.settings, icon: <SettingOutlined />, label: 'Settings' },
];
