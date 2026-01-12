import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || '';

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

export const authAPI = {
    login: (username, password) => api.post('/auth/login', { username, password }),
    register: (username, password) => api.post('/auth/register', { username, password }),
};

export const userAPI = {
    getMe: () => api.get('/user/me'),
    getApiKey: () => api.get('/user/api-key'),
    regenerateApiKey: () => api.post('/user/api-key/regenerate'),
};

export const adminAPI = {
    getUsers: () => api.get('/admin/users'),
    getLogs: () => api.get('/admin/logs'),
};

export const searchAPI = {
    anime: (query) => api.get('/api/anime', { params: { q: query } }),
    animeById: (id) => api.get(`/api/anime/${id}`),
    manga: (query) => api.get('/api/manga', { params: { q: query } }),
    mangaById: (id) => api.get(`/api/manga/${id}`),
};

export default api;
