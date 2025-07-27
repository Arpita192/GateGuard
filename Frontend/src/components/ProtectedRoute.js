import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // FIX: Import and use the custom hook

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth(); // FIX: Use the hook to check if user is logged in
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;