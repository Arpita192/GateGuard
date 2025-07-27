import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

/**
 * A component to protect routes that require authentication.
 * @param {{ allowedRoles: string[] }} props - The roles allowed to access this route.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // 1. Check if the user is authenticated
  if (!isAuthenticated) {
    // If not, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // 2. Check if the user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If they don't have the role, redirect to a "not authorized" page or home
    // For simplicity, we'll redirect them to their default dashboard
    return <Navigate to={`/${user.role}/dashboard`} replace />; 
  }

  // 3. If authenticated and authorized, render the child component
  return <Outlet />;
};

export default ProtectedRoute;