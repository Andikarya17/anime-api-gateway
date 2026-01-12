import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../auth/auth';

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * Redirects to /login if user is not authenticated.
 */
export const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

/**
 * AdminRoute Component
 * 
 * Wraps routes that require admin role.
 * Redirects to /dashboard if user is not admin.
 */
export const AdminRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const user = getCurrentUser();
    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

/**
 * UserRoute Component
 * 
 * Wraps routes for regular users.
 * Redirects admin users to /admin.
 */
export const UserRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const user = getCurrentUser();
    if (user?.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;
