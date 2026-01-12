/**
 * Auth Utilities
 * 
 * Helper functions for authentication state management.
 */

/**
 * Decode JWT token payload (client-side only)
 */
export const decodeToken = (token) => {
    try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

/**
 * Get current user from stored token
 */
export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return decodeToken(token);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return getCurrentUser() !== null;
};

/**
 * Logout user - clear storage and redirect
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('apiKey');
    window.location.href = '/login';
};
