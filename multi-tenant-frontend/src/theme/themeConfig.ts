import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
    token: {
        fontFamily: "'Inter', sans-serif",
        colorPrimary: '#1677FF', // AntD Default Blue
        borderRadius: 8,
    },
    components: {
        Button: {
            controlHeight: 40,
            borderRadius: 8,
            algorithm: true,
        },
        Input: {
            controlHeight: 40,
        },
        Layout: {
            colorBgBody: '#f3f4f6', // Gray-100
            colorBgHeader: '#ffffff',
        },
    },
};

export default theme;
