import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { Link, useLocation , useNavigate } from 'react-router-dom';
import { RocketOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

interface SiderMenuProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
    menuItems: MenuProps['items']; // We'll pass items dynamically based on role
}

const SiderMenu: React.FC<SiderMenuProps> = ({ collapsed, onCollapse, menuItems }) => {
    const { token } = theme.useToken();
    const location = useLocation();
  const navigate = useNavigate();
    // Find the selected key based on current path
    const selectedKey = location.pathname;

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            width={256}
            breakpoint="lg"
            style={{
                background: '#fff',
                borderRight: '1px solid #f0f0f0',
                minHeight: '100vh',
                boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
                zIndex: 10
            }}
            theme="light"
        >
            {/* Logo Area */}
            <div
                className="h-16 flex items-center justify-center relative over-flow-hidden text-center transition-all duration-300"
                style={{ borderBottom: '1px solid #f0f0f0' }}
            >
                <Link to="/" className="flex items-center justify-center gap-3 text-inherit no-underline">
                    <div className={`transition-all duration-300 ${collapsed ? 'scale-0 w-0' : 'scale-100'}`}>
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                                <RocketOutlined style={{ color: token.colorPrimary, fontSize: '20px' }} />
                            </div>
                            <span className="text-lg font-bold text-gray-800 whitespace-nowrap">MultiTenant</span>
                        </div>
                    </div>

                    {collapsed && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <RocketOutlined style={{ color: token.colorPrimary, fontSize: '24px' }} />
                        </div>
                    )}
                </Link>
            </div>

            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                // defaultOpenKeys={['/']} // Optional: Auto open submenu Logic could be added here
                items={menuItems}
                className="border-none py-2"
                style={{ borderRight: 0 }}
                onClick={(info) => {
                    const path = info.key as string;
                    navigate(path);
                }}

            />
        </Sider>
    );
};

export default SiderMenu;
