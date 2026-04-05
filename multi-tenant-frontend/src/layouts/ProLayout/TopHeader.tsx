import React from 'react';
import { Layout, Avatar, Dropdown, Space, theme } from 'antd';
import { useQuery } from '@tanstack/react-query';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { APP_ROLES, normalizeRole } from '../../types/auth';
import { queryKeys } from '../../api/queryKeys';
import { tenantApi } from '../../api/tenantApi';

const { Header } = Layout;

interface TopHeaderProps {
    collapsed: boolean;
    onCollapse: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ collapsed, onCollapse }) => {
    const { token: themeToken } = theme.useToken();
    const { user, logout, currentTenantId } = useAuth();
    const navigate = useNavigate();
    const role = normalizeRole(user?.role);

    const { data: tenantData } = useQuery({
        queryKey: queryKeys.tenants.byId(currentTenantId),
        queryFn: () => tenantApi.getById(currentTenantId as string),
        enabled: !!currentTenantId && role === APP_ROLES.tenantAdmin,
        staleTime: 5 * 60 * 1000,
    });

    const tenantDisplayName = tenantData?.name?.trim() || 'Tenant';

    const handleLogout = () => {
        logout();
        navigate(ROUTES.login);
    };

    const userMenu = {
        onClick: ({ key }: { key: string }) => {
            if (key === 'settings') {
                if (role === APP_ROLES.tenantAdmin) {
                    navigate(ROUTES.tenantAdmin.settings);
                    return;
                }
                navigate(ROUTES.superAdmin.settings);
            }
        },
        items: [
            {
                key: 'profile',
                icon: <UserOutlined />,
                label: 'My Profile',
            },
            {
                key: 'settings',
                icon: <SettingOutlined />,
                label: 'Account Settings',
            },
            {
                type: 'divider' as const,
            },
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Logout',
                danger: true,
                onClick: handleLogout
            },
        ],
    };

    return (
        <Header
            className="sticky top-0 z-10 w-full flex items-center justify-between px-4 transition-all duration-200"
            style={{
                background: '#fff',
                height: 64,
                boxShadow: '0 1px 4px rgba(0,21,41,.08)'
            }}
        >
            {/* Left: Toggler */}
            <div className="flex items-center">
                <div
                    onClick={onCollapse}
                    className="cursor-pointer text-lg p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Tenant Placeholder */}
                <div className="hidden md:flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <GlobalOutlined className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-600">
                        {tenantDisplayName}
                    </span>
                </div>

                {/* User Dropdown */}
                <Dropdown menu={userMenu} trigger={['click']}>
                    <Space className="cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-md transition-colors">
                        <Avatar
                            style={{ backgroundColor: themeToken.colorPrimary }}
                            icon={<UserOutlined />}
                            size="small"
                        />
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
                            {user?.email || 'User'}
                        </span>
                    </Space>
                </Dropdown>
            </div>
        </Header>
    );
};

export default TopHeader;
