import React from 'react';

interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className }) => {
    return (
        <div className={`p-6 max-w-[1600px] mx-auto w-full ${className}`}>
            {children}
        </div>
    );
};

export default PageWrapper;
