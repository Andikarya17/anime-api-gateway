import axios from 'axios';

/**
 * API Service
 * 
 * Axios instance for the Anime API Gateway.
 * - JWT token attached to Authorization header
 * - API key attached to X-API-Key header
 */
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Attach JWT and API key
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const apiKey = localStorage.getItem('apiKey');
        if (apiKey) {
            config.headers['X-API-Key'] = apiKey;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 only for auth routes
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || '';

        // Only auto-logout on 401 for auth-related endpoints
        if (status === 401) {
            const isAuthRoute = url.includes('/auth/') || url.includes('/user/') || url.includes('/admin/');

            if (isAuthRoute) {
                localStorage.removeItem('token');
                localStorage.removeItem('apiKey');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// Auth endpoints
export const authAPI = {
    login: (username, password) => api.post('/auth/login', { username, password }),
    register: (username, password) => api.post('/auth/register', { username, password }),
};

// User endpoints
export const userAPI = {
    getMe: () => api.get('/user/me'),
    getApiKey: () => api.get('/user/api-key'),
    regenerateApiKey: () => api.post('/user/api-key/regenerate'),
};

// Admin endpoints
export const adminAPI = {
    getUsers: () => api.get('/admin/users'),
    getLogs: () => api.get('/admin/logs'),
};

// Search endpoints (API Gateway)
export const searchAPI = {
    anime: (query) => api.get('/api/anime', { params: { q: query } }),
    animeById: (id) => api.get(`/api/anime/${id}`),
    manga: (query) => api.get('/api/manga', { params: { q: query } }),
};

export default api;
