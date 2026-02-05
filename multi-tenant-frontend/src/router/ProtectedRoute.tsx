import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // ['SuperAdmin'], ['TenantAdmin'], ...
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const role = user?.role ?? '';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'SystemAdmin') return <Navigate to="/sa/dashboard" replace />;
    if (role === 'TenantAdmin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'TenantUser') return <Navigate to="/app/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
