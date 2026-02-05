import React from 'react';
import { Typography, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

export interface BreadcrumbItem {
    title: string;
    path?: string;
}

interface PageHeaderProps {
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    extra?: React.ReactNode;
    description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs, extra, description }) => {
    return (
        <div className="bg-white p-6 border-b border-gray-100">
            {breadcrumbs && (
                <div className="mb-3">
                    <Breadcrumb
                        items={breadcrumbs.map((item) => ({
                            title: item.path ? <Link to={item.path}>{item.title}</Link> : item.title,
                        }))}
                    />
                </div>
            )}

            <div className="flex justify-between items-center">
                <div>
                    <Title level={3} className="!mb-0 !mt-0 text-gray-800 font-bold">
                        {title}
                    </Title>
                    {description && (
                        <Text type="secondary" className="mt-2 block">
                            {description}
                        </Text>
                    )}
                </div>

                {extra && <div className="flex gap-3">{extra}</div>}
            </div>
        </div>
    );
};

export default PageHeader;
