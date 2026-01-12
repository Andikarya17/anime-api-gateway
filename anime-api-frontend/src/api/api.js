import axios from 'axios';

/**
 * API Service
 * 
 * Axios instance configured for the Anime API Gateway.
 * - Base URL from environment variable
 * - JWT token automatically attached to Authorization header
 * - API key automatically attached to X-API-Key header
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

// Response interceptor - Handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('apiKey');
            window.location.href = '/login';
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

// Gateway test endpoint
export const testGateway = (endpoint) => {
    return api.get(endpoint);
};

export default api;
