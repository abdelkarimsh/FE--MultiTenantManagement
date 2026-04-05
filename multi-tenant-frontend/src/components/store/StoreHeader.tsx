import React from 'react';
import { Button, Dropdown, Space, message } from 'antd';
import { LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import TenantBrand from './TenantBrand';
import type { User } from '../../types/auth';
import type { StorefrontTenantView } from '../../types/tenant';

interface StoreHeaderProps {
  tenant: StorefrontTenantView;
  user: User | null;
  onToggleSidebar?: () => void;
  onLogout: () => void;
}

const getUserInitials = (email?: string | null, fullName?: string | null) => {
  const base = fullName?.trim() || email?.trim() || 'User';
  return base.charAt(0).toUpperCase();
};

const StoreHeader: React.FC<StoreHeaderProps> = ({ tenant, user, onToggleSidebar, onLogout }) => {
  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        danger: true,
      },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') {
        onLogout();
        return;
      }
      message.info('Profile page is coming soon');
    },
  };

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onToggleSidebar}
            className="md:!hidden"
            aria-label="Toggle storefront navigation"
          />
          <TenantBrand
            name={tenant.displayName}
            subDomain={tenant.subDomain}
            logoUrl={tenant.logoUrl}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right sm:block">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Currency</div>
            <div className="text-sm font-medium text-slate-700">
              {tenant.currency ?? 'Not set'}
            </div>
          </div>

          <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right lg:block">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Support</div>
            <div className="text-sm font-medium text-slate-700">
              {tenant.supportPhone ?? 'Unavailable'}
            </div>
          </div>

          <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition-colors hover:bg-slate-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {getUserInitials(user?.email, user?.fullName)}
              </div>
              <Space direction="vertical" size={0} className="hidden min-w-0 sm:flex">
                <span className="truncate text-sm font-medium text-slate-800">
                  {user?.fullName || user?.email || 'Store User'}
                </span>
                <span className="truncate text-xs text-slate-500">
                  {user?.email || 'Authenticated user'}
                </span>
              </Space>
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;
