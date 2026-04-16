import React from 'react';
import {
  AppstoreOutlined,
  FileTextOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { formatStoreSubdomainDisplay } from './subdomainDisplay';

interface StoreSidebarProps {
  tenantName: string;
  tenantSubDomain?: string | null;
  tenantLogoUrl?: string | null;
  collapsed: boolean;
  onToggleCollapse?: () => void;
  showToggle?: boolean;
  onNavigate?: () => void;
}

const navItems = [
  {
    key: ROUTES.store.products,
    label: 'Products',
    icon: <AppstoreOutlined />,
  },
  {
    key: ROUTES.store.orders,
    label: 'My Orders',
    icon: <FileTextOutlined />,
  },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'ST';

const linkBaseClass =
  'group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200';

const StoreSidebar: React.FC<StoreSidebarProps> = ({
  tenantName,
  tenantSubDomain,
  tenantLogoUrl,
  collapsed,
  onToggleCollapse,
  showToggle = true,
  onNavigate,
}) => {
  return (
    <aside className="flex h-full flex-col">
      <div className={`mb-3 flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-2 py-2`}>
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {tenantLogoUrl ? (
            <img src={tenantLogoUrl} alt={`${tenantName} logo`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 text-xs font-semibold text-white">
              {getInitials(tenantName)}
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900">{tenantName}</div>
            <div className="truncate text-xs text-slate-500">
              {formatStoreSubdomainDisplay(tenantSubDomain)}
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.key}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `${linkBaseClass} ${
                collapsed ? 'justify-center px-2' : 'gap-3'
              } ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {showToggle && onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`mt-3 flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 ${
            collapsed ? 'justify-center' : 'gap-2'
          }`}
        >
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
          {!collapsed && <span>Collapse</span>}
        </button>
      )}
    </aside>
  );
};

export default StoreSidebar;
