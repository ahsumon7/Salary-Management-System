import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // remove /api/v1 from here
    timeout: 10000,
});

// Add token to headers if exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized access - please login');
        }
        return Promise.reject(error);
    }
);

export default api;
