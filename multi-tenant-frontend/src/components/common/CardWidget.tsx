import React from 'react';
import { Card } from 'antd';
import type { CardProps } from 'antd';

interface CardWidgetProps extends CardProps {
    children: React.ReactNode;
    noPadding?: boolean;
}

const CardWidget: React.FC<CardWidgetProps> = ({ children, noPadding, className, styles, ...props }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bodyStyle = (styles as any)?.body || {};

    return (
        <Card
            bordered={false}
            className={`shadow-sm rounded-lg ${className}`}
            styles={{
                ...styles,
                body: noPadding ? { padding: 0 } : { padding: '24px', ...bodyStyle },
            }}
            {...props}
        >
            {children}
        </Card>
    );
};

export default CardWidget;
