import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen w-full galaxy-bg flex items-center justify-center p-4">
            <div className="galaxy-stars"></div>
            <div className="galaxy-rain"></div>

            {/* Content Container - Centered */}
            <div className="w-full max-w-4xl z-10">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
