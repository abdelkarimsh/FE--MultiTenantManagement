import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import type { BreadcrumbItem } from '../../components/common/PageHeader';
import PageWrapper from '../../components/common/PageWrapper';

interface PageContainerProps {
    children: React.ReactNode;
    header?: {
        title: string;
        breadcrumbs?: BreadcrumbItem[];
        extra?: React.ReactNode;
        description?: string;
    };
    className?: string;
    contentClassName?: string;
}

/**
 * PageContainer Wrapper that integrates PageHeader and PageWrapper consistently.
 * Mimics Ant Design Pro's PageContainer.
 */
const PageContainer: React.FC<PageContainerProps> = ({
    children,
    header,
    className,
    contentClassName
}) => {
    return (
        <div className={`flex flex-col flex-1 min-h-0 ${className}`}>
            {header && (
                <PageHeader
                    title={header.title}
                    breadcrumbs={header.breadcrumbs}
                    extra={header.extra}
                    description={header.description}
                />
            )}

            <div className="flex-1 overflow-auto bg-gray-50/50">
                <PageWrapper className={contentClassName}>
                    {children}
                </PageWrapper>
            </div>
        </div>
    );
};

export default PageContainer;
