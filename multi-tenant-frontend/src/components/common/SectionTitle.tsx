import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, className }) => {
    return (
        <div className={`mb-4 ${className}`}>
            <Title level={4} className="!mb-1 font-semibold text-gray-800">
                {title}
            </Title>
            {subtitle && <span className="text-gray-500 text-sm">{subtitle}</span>}
        </div>
    );
};

export default SectionTitle;
