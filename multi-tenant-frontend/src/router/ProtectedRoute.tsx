import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDefaultRouteForRole, normalizeRole } from '../types/auth';
import type { CanonicalRole } from '../types/auth';
import { ROUTES } from './routes';

interface ProtectedRouteProps {
  allowedRoles?: CanonicalRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const role = normalizeRole(user?.role);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (!role) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
