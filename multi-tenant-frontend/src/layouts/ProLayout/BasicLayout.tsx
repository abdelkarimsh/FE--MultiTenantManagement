import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import SiderMenu from './SiderMenu';
import TopHeader from './TopHeader';
import type { MenuProps } from 'antd';

const { Content } = Layout;

interface BasicLayoutProps {
    menuItems: MenuProps['items'];
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ menuItems }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout className="min-h-screen">
            <SiderMenu
                collapsed={collapsed}
                onCollapse={setCollapsed}
                menuItems={menuItems}
            />

            <Layout
                className="transition-all duration-200"
                style={{
                    // Adjust margin based on sider width (256px expanded, 80px collapsed usually)
                    // But AntD Sider handles this with relative positioning if inside a Layout.
                    // We'll let AntD handle logic but ensure background is correct
                }}
            >
                <TopHeader
                    collapsed={collapsed}
                    onCollapse={() => setCollapsed(!collapsed)}
                />

                <Content className="flex flex-col overflow-hidden h-[calc(100vh-64px)]">
                    {/* Outlet renders the page or PageContainer */}
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default BasicLayout;
